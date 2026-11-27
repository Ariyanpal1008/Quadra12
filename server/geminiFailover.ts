export const FREE_TIER_GEMINI_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-4-hydrogen',
] as const;

export type FreeTierGeminiModel = (typeof FREE_TIER_GEMINI_MODELS)[number];

export type CooldownReason =
  | 'none'
  | 'service_unavailable'
  | 'quota_exhausted'
  | 'auth_error';

export interface ProjectSlotState {
  projectNumber: number; // 1..5
  cooldownUntil: number;
  cooldownReason: CooldownReason;
  consecutiveFailures: number;
  lastFailureAt: number | null;
  lastSuccessAt: number | null;
  lastRetryAfterSeconds: number | null;
}

export interface ProjectSlotPublicStatus {
  project: string;
  available: boolean;
  status: 'ready' | CooldownReason;
  retryAfterSeconds: number;
  consecutiveFailures: number;
}

export interface FailoverClassification {
  kind: 'service_unavailable' | 'quota_exhausted' | 'auth_error' | 'model_not_found' | 'bad_request';
  retryAfterMs: number;
  summary: string;
}

export interface FailoverCallArgs {
  apiKey: string;
  projectNumber: number;
  modelName: FreeTierGeminiModel;
}

export interface FailoverAttemptOutcome<T> {
  ok: true;
  data: T;
  projectNumber: number;
  modelName: FreeTierGeminiModel;
}

export interface FailoverUnavailableOutcome {
  ok: false;
  badRequest?: boolean;
  quotaExhausted: boolean;
  retryAfterSeconds: number;
  reason: string;
  attemptedProjects: number[];
}

export type FailoverResult<T> = FailoverAttemptOutcome<T> | FailoverUnavailableOutcome;

const MAX_PROJECTS = 5;
const BASE_SERVICE_COOLDOWN_MS = 30_000;
const MAX_SERVICE_COOLDOWN_MS = 300_000;
const DEFAULT_QUOTA_COOLDOWN_MS = 60_000;
const DAILY_QUOTA_COOLDOWN_MS = 900_000;
const AUTH_ERROR_COOLDOWN_MS = 600_000;

export function parseServerGeminiKeys(
  env: Record<string, string | undefined> = process.env,
): string[] {
  const raw = env.GEMINI_API_KEYS || env.GEMINI_API_KEY || '';
  const seen = new Set<string>();
  const uniqueKeys: string[] = [];
  for (const part of raw.split(',')) {
    const trimmed = part.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    uniqueKeys.push(trimmed);
    if (uniqueKeys.length >= MAX_PROJECTS) break;
  }
  return uniqueKeys;
}

export function isFreeTierGeminiModel(modelName: string): modelName is FreeTierGeminiModel {
  return (FREE_TIER_GEMINI_MODELS as readonly string[]).includes(modelName);
}

function extractRetryAfterMsFromError(err: unknown): number | null {
  const e = err as Record<string, any> | undefined;
  const msg = String(e?.message || err || '');

  // Check explicit RetryInfo / retryDelay formats like "42s", retryDelay: "42s", or "retry in 35.5s"
  const retryDelayMatch =
    msg.match(/"?retryDelay"?\s*:\s*"?(\d+(?:\.\d+)?)s"?/i) ||
    msg.match(/retry\s+(?:in|after)\s+(\d+(?:\.\d+)?)\s*s(?:ec(?:onds?)?)?/i);
  if (retryDelayMatch) {
    const secs = Number(retryDelayMatch[1]);
    if (Number.isFinite(secs) && secs > 0) {
      return Math.ceil(secs * 1000);
    }
  }

  // Check HTTP headers if exposed on SDK error response
  const headerVal =
    e?.headers?.['retry-after'] ??
    e?.response?.headers?.get?.('retry-after') ??
    e?.response?.headers?.['retry-after'];
  if (headerVal) {
    const numeric = Number(headerVal);
    if (Number.isFinite(numeric) && numeric > 0) {
      return Math.ceil(numeric * 1000);
    }
  }

  return null;
}

export function classifyGeminiError(err: unknown): FailoverClassification {
  const e = err as Record<string, any> | undefined;
  const status = Number(e?.status ?? e?.statusCode ?? e?.code ?? 0);
  const rawMessage = String(e?.message || err || 'Unknown upstream error');
  const lower = rawMessage.toLowerCase();

  // Scrub any accidental query/key fragments before surfacing error summaries
  const safeMessage = rawMessage
    .replace(/key=[A-Za-z0-9_\-]+/gi, 'key=[REDACTED]')
    .replace(/AIza[0-9A-Za-z\-_]{10,}/g, '[REDACTED_KEY]')
    .slice(0, 220);

  if (
    status === 429 ||
    lower.includes('resource_exhausted') ||
    lower.includes('quota') ||
    lower.includes('rate limit') ||
    lower.includes('too many requests')
  ) {
    const parsedRetry = extractRetryAfterMsFromError(err);
    const isDailyLimit = /perday|daily|rpd/i.test(rawMessage);
    const retryAfterMs =
      parsedRetry ?? (isDailyLimit ? DAILY_QUOTA_COOLDOWN_MS : DEFAULT_QUOTA_COOLDOWN_MS);
    return {
      kind: 'quota_exhausted',
      retryAfterMs,
      summary: `Quota or rate limit reached (${safeMessage})`,
    };
  }

  if (
    status === 401 ||
    status === 403 ||
    lower.includes('api_key_invalid') ||
    lower.includes('permission_denied') ||
    lower.includes('api key not valid') ||
    lower.includes('unauthorized')
  ) {
    return {
      kind: 'auth_error',
      retryAfterMs: AUTH_ERROR_COOLDOWN_MS,
      summary: `Project credential unavailable (${safeMessage})`,
    };
  }

  if (status === 404 || lower.includes('not_found') || lower.includes('is not found for api version')) {
    return {
      kind: 'model_not_found',
      retryAfterMs: 0,
      summary: `Free-tier model alias unavailable (${safeMessage})`,
    };
  }

  if (status === 400 || lower.includes('invalid_argument')) {
    return {
      kind: 'bad_request',
      retryAfterMs: 0,
      summary: `Invalid grading payload (${safeMessage})`,
    };
  }

  // Genuine temporary service or network availability error (500, 502, 503, 504, timeout, network)
  const parsedRetry = extractRetryAfterMsFromError(err);
  return {
    kind: 'service_unavailable',
    retryAfterMs: parsedRetry ?? BASE_SERVICE_COOLDOWN_MS,
    summary: `Temporary service unavailability (${safeMessage})`,
  };
}

export class SequentialGeminiFailover {
  private states = new Map<number, ProjectSlotState>();

  constructor(private readonly nowFn: () => number = () => Date.now()) {}

  private ensureState(projectNumber: number): ProjectSlotState {
    let existing = this.states.get(projectNumber);
    if (!existing) {
      existing = {
        projectNumber,
        cooldownUntil: 0,
        cooldownReason: 'none',
        consecutiveFailures: 0,
        lastFailureAt: null,
        lastSuccessAt: null,
        lastRetryAfterSeconds: null,
      };
      this.states.set(projectNumber, existing);
    }
    return existing;
  }

  private refreshRecoveredState(state: ProjectSlotState, now: number): void {
    if (state.cooldownUntil > 0 && now >= state.cooldownUntil) {
      state.cooldownUntil = 0;
      state.cooldownReason = 'none';
      state.lastRetryAfterSeconds = null;
    }
  }

  public getPublicStatus(projectCount: number): {
    configuredProjects: number;
    availableProjects: number;
    activeMode: 'gemini' | 'self-check';
    quotaCooldownActive: boolean;
    retryAfterSeconds: number;
    projects: ProjectSlotPublicStatus[];
  } {
    const now = this.nowFn();
    const count = Math.max(0, Math.min(MAX_PROJECTS, projectCount));
    const projects: ProjectSlotPublicStatus[] = [];
    let availableProjects = 0;
    let quotaCooldownActive = false;
    let maxQuotaWaitSec = 0;
    let minWaitSec = Number.POSITIVE_INFINITY;

    for (let idx = 0; idx < count; idx++) {
      const projectNumber = idx + 1;
      const state = this.ensureState(projectNumber);
      this.refreshRecoveredState(state, now);

      const inCooldown = state.cooldownUntil > now;
      const waitSec = inCooldown ? Math.ceil((state.cooldownUntil - now) / 1000) : 0;
      if (inCooldown) {
        minWaitSec = Math.min(minWaitSec, waitSec);
        if (state.cooldownReason === 'quota_exhausted') {
          quotaCooldownActive = true;
          maxQuotaWaitSec = Math.max(maxQuotaWaitSec, waitSec);
        }
      } else {
        availableProjects++;
      }

      projects.push({
        project: `Project ${projectNumber}`,
        available: !inCooldown,
        status: inCooldown ? state.cooldownReason : 'ready',
        retryAfterSeconds: waitSec,
        consecutiveFailures: state.consecutiveFailures,
      });
    }

    const canServeGemini =
      count > 0 && availableProjects > 0 && !quotaCooldownActive;
    const retryAfterSeconds = quotaCooldownActive
      ? maxQuotaWaitSec
      : canServeGemini || !Number.isFinite(minWaitSec)
        ? 0
        : minWaitSec;

    return {
      configuredProjects: count,
      availableProjects: quotaCooldownActive ? 0 : availableProjects,
      activeMode: canServeGemini ? 'gemini' : 'self-check',
      quotaCooldownActive,
      retryAfterSeconds,
      projects,
    };
  }

  public reset(): void {
    this.states.clear();
  }

  /**
   * Executes a free-tier Gemini call sequentially: Project 1 -> Project 2 -> ... -> Project 5.
   * Respects project-specific quotas/retry delays (never rotates across projects to bypass 429 limits),
   * recovers automatically when cooldown windows expire, and falls back cleanly on exhaustion.
   */
  public async executeSequential<T>(
    apiKeys: string[],
    invoke: (args: FailoverCallArgs) => Promise<T>,
  ): Promise<FailoverResult<T>> {
    const keys = apiKeys.slice(0, MAX_PROJECTS);
    if (keys.length === 0) {
      return {
        ok: false,
        quotaExhausted: false,
        retryAfterSeconds: 0,
        reason: 'No server-side GEMINI_API_KEYS configured.',
        attemptedProjects: [],
      };
    }

    const now = this.nowFn();
    const attemptedProjects: number[] = [];

    // Respect active quota/rate-limit retry windows without rotating to another project to bypass limits
    for (let idx = 0; idx < keys.length; idx++) {
      const state = this.ensureState(idx + 1);
      this.refreshRecoveredState(state, now);
      if (state.cooldownReason === 'quota_exhausted' && state.cooldownUntil > now) {
        const waitSec = Math.max(1, Math.ceil((state.cooldownUntil - now) / 1000));
        return {
          ok: false,
          quotaExhausted: true,
          retryAfterSeconds: waitSec,
          reason: `Project ${state.projectNumber} is respecting Google's quota retry window (${waitSec}s remaining).`,
          attemptedProjects,
        };
      }
    }

    let lastReason = 'All configured Gemini projects are temporarily unavailable.';
    let minWaitSeconds = Number.POSITIVE_INFINITY;

    for (let idx = 0; idx < keys.length; idx++) {
      const projectNumber = idx + 1;
      const apiKey = keys[idx];
      const state = this.ensureState(projectNumber);
      this.refreshRecoveredState(state, now);

      if (state.cooldownUntil > now) {
        const waitSec = Math.max(1, Math.ceil((state.cooldownUntil - now) / 1000));
        minWaitSeconds = Math.min(minWaitSeconds, waitSec);
        continue;
      }

      attemptedProjects.push(projectNumber);
      let projectServiceFailed = false;

      for (const modelName of FREE_TIER_GEMINI_MODELS) {
        if (!isFreeTierGeminiModel(modelName)) {
          continue;
        }

        try {
          const data = await invoke({apiKey, projectNumber, modelName});
          state.cooldownUntil = 0;
          state.cooldownReason = 'none';
          state.consecutiveFailures = 0;
          state.lastSuccessAt = this.nowFn();
          state.lastRetryAfterSeconds = null;
          return {
            ok: true,
            data,
            projectNumber,
            modelName,
          };
        } catch (err) {
          const classified = classifyGeminiError(err);
          const failureTime = this.nowFn();

          if (classified.kind === 'bad_request') {
            return {
              ok: false,
              badRequest: true,
              quotaExhausted: false,
              retryAfterSeconds: 0,
              reason: classified.summary,
              attemptedProjects,
            };
          }

          if (classified.kind === 'model_not_found') {
            // Try the next free-tier model on the same project
            lastReason = classified.summary;
            continue;
          }

          if (classified.kind === 'quota_exhausted') {
            state.consecutiveFailures += 1;
            state.lastFailureAt = failureTime;
            state.cooldownReason = 'quota_exhausted';
            state.cooldownUntil = failureTime + classified.retryAfterMs;
            const retryAfterSeconds = Math.max(1, Math.ceil(classified.retryAfterMs / 1000));
            state.lastRetryAfterSeconds = retryAfterSeconds;

            console.warn(
              `[GeminiFailover] Project ${projectNumber} quota/rate limit hit; honoring ${retryAfterSeconds}s cooldown without rotating.`,
            );

            return {
              ok: false,
              quotaExhausted: true,
              retryAfterSeconds,
              reason: `Project ${projectNumber} free-tier quota or rate limit reached; retry allowed after ${retryAfterSeconds}s.`,
              attemptedProjects,
            };
          }

          if (classified.kind === 'auth_error') {
            state.consecutiveFailures += 1;
            state.lastFailureAt = failureTime;
            state.cooldownReason = 'auth_error';
            state.cooldownUntil = failureTime + classified.retryAfterMs;
            const waitSec = Math.ceil(classified.retryAfterMs / 1000);
            state.lastRetryAfterSeconds = waitSec;
            minWaitSeconds = Math.min(minWaitSeconds, waitSec);
            lastReason = `Project ${projectNumber} credential rejected.`;
            console.warn(
              `[GeminiFailover] Project ${projectNumber} credential rejected; advancing sequentially.`,
            );
            projectServiceFailed = true;
            break;
          }

          // Genuine temporary availability or service error (500/502/503/504/timeout/network)
          state.consecutiveFailures += 1;
          state.lastFailureAt = failureTime;
          state.cooldownReason = 'service_unavailable';
          const backoffMs = Math.min(
            MAX_SERVICE_COOLDOWN_MS,
            Math.max(
              classified.retryAfterMs,
              BASE_SERVICE_COOLDOWN_MS * Math.pow(2, Math.max(0, state.consecutiveFailures - 1)),
            ),
          );
          state.cooldownUntil = failureTime + backoffMs;
          const waitSec = Math.ceil(backoffMs / 1000);
          state.lastRetryAfterSeconds = waitSec;
          minWaitSeconds = Math.min(minWaitSeconds, waitSec);
          lastReason = `Project ${projectNumber}: ${classified.summary}`;
          console.warn(
            `[GeminiFailover] Project ${projectNumber} temporary service error on ${modelName}; backing off ${waitSec}s and failing over sequentially.`,
          );
          projectServiceFailed = true;
          break;
        }
      }

      if (!projectServiceFailed && state.cooldownUntil === 0) {
        // Exhausted free-tier model aliases on this project (e.g. 404 on both)
        state.consecutiveFailures += 1;
        state.lastFailureAt = this.nowFn();
        state.cooldownReason = 'service_unavailable';
        state.cooldownUntil = this.nowFn() + BASE_SERVICE_COOLDOWN_MS;
        const waitSec = Math.ceil(BASE_SERVICE_COOLDOWN_MS / 1000);
        state.lastRetryAfterSeconds = waitSec;
        minWaitSeconds = Math.min(minWaitSeconds, waitSec);
      }
    }

    return {
      ok: false,
      quotaExhausted: false,
      retryAfterSeconds: Number.isFinite(minWaitSeconds) ? minWaitSeconds : 30,
      reason: lastReason,
      attemptedProjects,
    };
  }
}

export interface DeterministicSelfCheckQuestion {
  questionId: string;
  questionNumber: number;
  marks: number;
  chapterTag: string;
  studentText: string;
  photos: Array<{mimeType: string; base64Data: string}>;
  markingKey: {
    exactModelAnswer: string;
    stepMarks: Array<{label: string; marks: number}>;
    finalAnswerValue?: string;
    examinerCheckpoints: string[];
  };
}

export function isGibberishSubmissionText(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;

  if (/[_*&"$#@!~`\\|]{3,}|[+*_(&"]{4,}|([!@#$%^&*_+=~`|\\?])\1{2,}/.test(trimmed)) {
    return true;
  }

  const tokens = trimmed
    .split(/[\s,=+*/()[\]{}_&^%$#@!~`"';:<>|\\?-]+/)
    .filter(Boolean);

  const lower = trimmed.toLowerCase();
  const trivialFillers = new Set([
    'hi', 'hello', 'hey', 'ok', 'okay', 'idk', 'na', 'nil', 'none', 'nothing',
    'null', 'test', 'testing', 'abc', 'xyz', 'asdf', 'qwer', 'qwerty', 'zxcv',
    'pass', 'skip', 'lol', 'bro', 'sir', 'mam', 'please', 'sorry', 'check',
  ]);
  if (
    tokens.length === 1 &&
    (trivialFillers.has(lower) ||
      (/^[a-zA-Z]+$/.test(trimmed) &&
        trimmed.length <= 4 &&
        !/^(yes|no|dna|rna|atp|adp|emf|ohm|amp|mol|ph|cft|vbt|sn1|sn2|hiv|pcr)$/i.test(
          trimmed,
        )))
  ) {
    return true;
  }
  if (/^(.)\1{2,}$/i.test(lower)) return true;

  const alphaTokens = tokens.filter((t) => /^[a-zA-Z]+$/.test(t));
  let weirdWords = 0;
  let shortConsonantFragments = 0;
  for (const w of alphaTokens) {
    if (w.length >= 5 && !/[aeiou]/i.test(w)) {
      weirdWords++;
    } else if (/[bcdfghjklmnpqrstvwxz]{5,}/i.test(w)) {
      weirdWords++;
    } else if (w.length >= 4 && /^(asdf|qwer|zxcv|hjkl|uiop|hhyb|kfkf)/i.test(w)) {
      weirdWords++;
    } else if (w.length <= 2 && !/[aeiou]/i.test(w)) {
      shortConsonantFragments++;
    }
  }
  if (weirdWords > 0 && weirdWords >= Math.ceil(alphaTokens.length / 2)) {
    return true;
  }
  if (
    alphaTokens.length >= 3 &&
    shortConsonantFragments + weirdWords >= Math.ceil(alphaTokens.length * 0.7) &&
    !/=/.test(trimmed)
  ) {
    return true;
  }
  return false;
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'that', 'this', 'into', 'when', 'where',
  'then', 'than', 'each', 'only', 'both', 'exact', 'final', 'step', 'value',
  'answer', 'correct', 'using', 'given', 'shown', 'formula', 'equation',
]);

function extractKeyTerms(text: string): string[] {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .split(/[^a-z0-9.=+\-*/^]+/)
        .map((t) => t.trim())
        .filter((t) => t.length >= 3 && !STOP_WORDS.has(t)),
    ),
  );
}

export function buildDeterministicSelfCheckResponse(params: {
  questions: DeterministicSelfCheckQuestion[];
  unavailableReason: string;
  quotaExhausted: boolean;
  retryAfterSeconds: number;
}) {
  const {questions, unavailableReason, quotaExhausted, retryAfterSeconds} = params;
  const affectedChapters = new Set<string>();
  let deterministicMatchesCount = 0;
  let disqualifiedCount = 0;
  let unattemptedCount = 0;
  let pendingManualCheckCount = 0;

  const questionGrades = questions.map((q) => {
    const typed = (q.studentText || '').trim();
    const hasText = typed.length > 0;
    const hasPhotos = Array.isArray(q.photos) && q.photos.length > 0;

    if (!hasText && !hasPhotos) {
      unattemptedCount++;
      affectedChapters.add(q.chapterTag);
      return {
        questionId: q.questionId,
        status: 'grey' as const,
        marks_awarded: 0,
        max_marks: q.marks,
        checksCompleted: ['Attempt presence check (unattempted)'],
        feedback:
          'Unattempted question (0 marks awarded). Gemini AI evaluation is unavailable; review the Exact Model Answer below.',
        exact_model_answer: q.markingKey.exactModelAnswer,
      };
    }

    if (!hasPhotos && isGibberishSubmissionText(typed)) {
      disqualifiedCount++;
      affectedChapters.add(q.chapterTag);
      return {
        questionId: q.questionId,
        status: 'red' as const,
        disqualified: true,
        marks_awarded: 0,
        max_marks: q.marks,
        checksCompleted: [
          'Deterministic gibberish / symbol-spam filter (disqualified)',
        ],
        feedback:
          'Submission Disqualified (0 Marks): Response failed local input validation (gibberish or irrelevant filler).',
        exact_model_answer: q.markingKey.exactModelAnswer,
      };
    }

    pendingManualCheckCount++;
    const checksCompleted: string[] = [
      'Non-empty & gibberish pre-validation passed',
    ];

    const lowerTyped = typed.toLowerCase();
    const matchedStepLabels: string[] = [];

    if (hasText && q.markingKey.finalAnswerValue) {
      const normalizedFinal = q.markingKey.finalAnswerValue.trim().toLowerCase();
      const finalMatched =
        normalizedFinal.length > 0 && lowerTyped.includes(normalizedFinal);
      checksCompleted.push(
        finalMatched
          ? `Final answer value check matched ("${q.markingKey.finalAnswerValue}")`
          : `Final answer value check ("${q.markingKey.finalAnswerValue}" not found verbatim in typed text)`,
      );
      if (finalMatched) deterministicMatchesCount++;
    }

    const totalCheckpoints = q.markingKey.stepMarks.length;
    if (hasText && totalCheckpoints > 0) {
      for (const step of q.markingKey.stepMarks) {
        const terms = extractKeyTerms(step.label);
        const hits = terms.filter((term) => lowerTyped.includes(term));
        if (terms.length > 0 && hits.length >= Math.min(2, terms.length)) {
          matchedStepLabels.push(step.label);
        }
      }
      checksCompleted.push(
        `Marking-rule keyword comparison: matched ${matchedStepLabels.length}/${totalCheckpoints} step checkpoints`,
      );
      if (matchedStepLabels.length > 0) deterministicMatchesCount++;
    }

    if (hasPhotos) {
      checksCompleted.push(
        `Photo presence verified (${q.photos.length} image(s) attached; handwritten image inspection unavailable without Gemini AI)`,
      );
    }

    const noticePrefix = quotaExhausted
      ? `Self-Check Mode Active (Gemini AI Unavailable — Free-tier quota reset in ~${retryAfterSeconds}s):`
      : 'Self-Check Mode Active (Gemini AI Evaluation Unavailable):';

    const checkSummary = checksCompleted.join('; ');

    return {
      questionId: q.questionId,
      status: 'grey' as const,
      marks_awarded: 0,
      max_marks: q.marks,
      checksCompleted,
      feedback: `${noticePrefix} No AI evaluation was performed. Completed checks: ${checkSummary}. Compare your work side-by-side with the Marking Scheme below and choose Green, Yellow, or Red.`,
      exact_model_answer: q.markingKey.exactModelAnswer,
    };
  });

  return {
    isSelfCheckMode: true,
    geminiUnavailable: true,
    quotaExhausted,
    retryAfterSeconds,
    unavailableReason,
    checksPerformed: [
      'Unattempted question detection',
      'Deterministic gibberish & symbol-spam disqualification',
      'Typed answer comparison against official marking scheme checkpoints & final values',
    ],
    questionGrades,
    examSummary: {
      weakTopics:
        affectedChapters.size > 0
          ? Array.from(affectedChapters).slice(0, 6)
          : ['Compare attempted subjective responses carefully against the CBSE Marking Scheme'],
      improvementTips: [
        'Gemini AI evaluation is currently unavailable, so no AI grading was performed.',
        `Deterministic checks completed: ${pendingManualCheckCount} valid attempted, ${disqualifiedCount} locally disqualified, ${unattemptedCount} unattempted (${deterministicMatchesCount} checkpoint/value matches found in typed responses).`,
        'Use Full Marks (Green), Partial Marks (Yellow), or Incorrect (Red) against each Marking Scheme Key to compute your self-checked score.',
      ],
      examinerRemarks:
        `Self-Check Mode (Gemini AI Evaluation Unavailable): ${unavailableReason} Completed deterministic validation, gibberish screening, and marking-scheme comparison—use Green / Yellow / Red buttons below to finalize step marks.`,
    },
  };
}
