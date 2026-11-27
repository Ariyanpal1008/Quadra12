import type {SubjectId} from './pcmbData';
import type {
  ApprovalRecord,
  VerifiedExamPaper,
  VerifiedMarkingScheme,
  VerifiedMarkingSchemeEntry,
  VerifiedQuestion,
} from './v3Types';
import {
  ALL_VERIFIED_QUESTIONS,
  BIOLOGY_QUESTIONS,
  CHEMISTRY_QUESTIONS,
  MATHS_QUESTIONS,
  PHYSICS_QUESTIONS,
} from './questionBank';
import {canPublishExamPaper} from '../utils/examEvaluator';

export const QUESTIONS_BY_ID: Record<string, VerifiedQuestion> = Object.fromEntries(
  ALL_VERIFIED_QUESTIONS.map((q) => [q.id, q]),
);

const HUMAN_APPROVAL_V3: ApprovalRecord = {
  status: 'Published',
  reviewedBy: 'AriYan Pal (Keśava Dāsa)',
  reviewerRole: 'Lead Academic Author · Quadra 12',
  reviewedAt: '2026-11-26',
  verificationNotes:
    'Verified against NCERT Class 12 curriculum, SI units, option uniqueness, step-wise marking breakdown, and zero duplicate keys.',
  version: '3.0.0',
};

/**
 * Deterministically selects an even slice of approved questions across chapters
 * for a Main Sheet without altering or mutating the underlying question bank.
 */
function pickBalancedQuestionIds(
  pool: VerifiedQuestion[],
  targetCount: number,
  stride: number,
  offset: number,
): string[] {
  const picked: string[] = [];
  const seen = new Set<string>();
  let cursor = offset % pool.length;
  let guard = 0;

  while (picked.length < targetCount && picked.length < pool.length && guard < pool.length * 4) {
    const candidate = pool[cursor];
    if (candidate && !seen.has(candidate.id)) {
      seen.add(candidate.id);
      picked.push(candidate.id);
    }
    cursor = (cursor + stride) % pool.length;
    guard += 1;
  }
  return picked;
}

function buildMarkingSchemeForPaper(paper: VerifiedExamPaper): VerifiedMarkingScheme {
  const entries: Record<string, VerifiedMarkingSchemeEntry> = {};

  for (const qId of paper.questionIds) {
    const q = QUESTIONS_BY_ID[qId];
    if (!q) continue;
    const sol = q.subjectiveSolution;
    entries[qId] = {
      questionId: qId,
      correctIndex: q.correctIndex,
      positiveMarks: paper.positiveMarks,
      negativeMarks: paper.negativeMarks,
      maxMarks: paper.positiveMarks,
      stepMarkingBreakdown: [
        `Concept & Principle: ${sol.concept} — ${sol.formulaOrPrinciple}`,
        ...(sol.givenData ? [`Given Data: ${sol.givenData}`] : []),
        ...sol.substitutionAndWorking,
        `Final Answer: ${sol.finalResult}${sol.finalUnits ? ` (${sol.finalUnits})` : ''} [Key Check: Option ${String.fromCharCode(65 + q.correctIndex)}]`,
      ],
      subjectiveSolution: sol,
      diagramRefId: q.diagramRefId ?? sol.diagramRefId,
      relatedStudySheetIds: q.relatedStudySheetIds,
    };
  }

  return {
    id: paper.markingSchemeId ?? `ms-${paper.id}`,
    paperId: paper.id,
    subjectId: paper.subjectId,
    title: `${paper.title} — Official Marking Scheme`,
    paperVersion: paper.paperVersion,
    approvalStatus: 'Published',
    approval: HUMAN_APPROVAL_V3,
    entries,
  };
}

function makeMainPaper(params: {
  id: string;
  subjectId: SubjectId;
  title: string;
  subtitle: string;
  questionIds: string[];
  durationSeconds: number;
  positiveMarks: number;
  negativeMarks: number;
}): VerifiedExamPaper {
  const chapters = Array.from(
    new Set(
      params.questionIds
        .map((id) => QUESTIONS_BY_ID[id]?.chapterId)
        .filter((c): c is string => Boolean(c)),
    ),
  );

  return {
    id: params.id,
    subjectId: params.subjectId,
    title: params.title,
    subtitle: params.subtitle,
    paperVersion: '3.0.0',
    isMainSheet: true,
    publicationStatus: 'Published',
    approval: HUMAN_APPROVAL_V3,
    markingSchemeId: `ms-${params.id}`,
    durationSeconds: params.durationSeconds,
    positiveMarks: params.positiveMarks,
    negativeMarks: params.negativeMarks,
    questionIds: params.questionIds,
    chapterIdsCovered: chapters,
    instructions: [
      `All ${params.questionIds.length} questions are compulsory single-choice OMR questions (A, B, C, or D).`,
      `Marking Scheme: +${params.positiveMarks} mark${params.positiveMarks === 1 ? '' : 's'} for every correct response, ${
        params.negativeMarks > 0
          ? `-${params.negativeMarks} mark${params.negativeMarks === 1 ? '' : 's'} penalty for an incorrect response`
          : '0 negative marking for incorrect responses'
      }, and 0 marks for unanswered questions.`,
      'Answer keys remain locked throughout the active examination and are graded deterministically on submission.',
      'Your submitted attempt creates an immutable Practice Sheet snapshot tied only to your active student profile.',
    ],
  };
}

const RAW_MAIN_PAPERS: VerifiedExamPaper[] = [
  makeMainPaper({
    id: 'phy-main-v3-competitive',
    subjectId: 'physics',
    title: 'Physics (042) · Full-Syllabus High-Yield Mock Paper I',
    subtitle: '28 Verified Mixed-Chapter OMR Questions · Competitive +4 / -1 Rules',
    questionIds: pickBalancedQuestionIds(PHYSICS_QUESTIONS, 28, 6, 0),
    durationSeconds: 45 * 60,
    positiveMarks: 4,
    negativeMarks: 1,
  }),
  makeMainPaper({
    id: 'phy-main-v3-board',
    subjectId: 'physics',
    title: 'Physics (042) · CBSE Concept & Numerical Sprint II',
    subtitle: '20 High-Yield Conceptual, Numerical & Diagram MCQs · +1 / 0 Board Pattern',
    questionIds: pickBalancedQuestionIds(PHYSICS_QUESTIONS, 20, 9, 3),
    durationSeconds: 30 * 60,
    positiveMarks: 1,
    negativeMarks: 0,
  }),
  makeMainPaper({
    id: 'chem-main-v3-competitive',
    subjectId: 'chemistry',
    title: 'Chemistry (043) · Full-Syllabus High-Yield Mock Paper I',
    subtitle: '28 Physical, Inorganic & Organic OMR Questions · Competitive +4 / -1 Rules',
    questionIds: pickBalancedQuestionIds(CHEMISTRY_QUESTIONS, 28, 6, 1),
    durationSeconds: 45 * 60,
    positiveMarks: 4,
    negativeMarks: 1,
  }),
  makeMainPaper({
    id: 'chem-main-v3-board',
    subjectId: 'chemistry',
    title: 'Chemistry (043) · CBSE Mechanism & Reaction Sprint II',
    subtitle: '20 High-Yield Concept, Reaction & Equation MCQs · +1 / 0 Board Pattern',
    questionIds: pickBalancedQuestionIds(CHEMISTRY_QUESTIONS, 20, 9, 4),
    durationSeconds: 30 * 60,
    positiveMarks: 1,
    negativeMarks: 0,
  }),
  makeMainPaper({
    id: 'bio-main-v3-competitive',
    subjectId: 'biology',
    title: 'Biology (044) · Full-Syllabus High-Yield Mock Paper I',
    subtitle: '28 Genetics, Biotech & Ecology OMR Questions · NEET/Board +4 / -1 Rules',
    questionIds: pickBalancedQuestionIds(BIOLOGY_QUESTIONS, 28, 6, 2),
    durationSeconds: 45 * 60,
    positiveMarks: 4,
    negativeMarks: 1,
  }),
  makeMainPaper({
    id: 'bio-main-v3-board',
    subjectId: 'biology',
    title: 'Biology (044) · NCERT Statement & Diagram Check II',
    subtitle: '20 High-Yield Reproduction, DNA & Immunity MCQs · +1 / 0 Board Pattern',
    questionIds: pickBalancedQuestionIds(BIOLOGY_QUESTIONS, 20, 9, 5),
    durationSeconds: 30 * 60,
    positiveMarks: 1,
    negativeMarks: 0,
  }),
  makeMainPaper({
    id: 'math-main-v3-competitive',
    subjectId: 'maths',
    title: 'Mathematics (041) · Full-Syllabus High-Yield Mock Paper I',
    subtitle: '28 Calculus, Matrices, Vectors & Probability OMR Questions · +4 / -1 Rules',
    questionIds: pickBalancedQuestionIds(MATHS_QUESTIONS, 28, 6, 0),
    durationSeconds: 50 * 60,
    positiveMarks: 4,
    negativeMarks: 1,
  }),
  makeMainPaper({
    id: 'math-main-v3-board',
    subjectId: 'maths',
    title: 'Mathematics (041) · Method & Integral Mastery Sprint II',
    subtitle: '20 High-Yield Method & Application MCQs · +1 / 0 Board Pattern',
    questionIds: pickBalancedQuestionIds(MATHS_QUESTIONS, 20, 9, 2),
    durationSeconds: 35 * 60,
    positiveMarks: 1,
    negativeMarks: 0,
  }),
];

export const VERIFIED_MARKING_SCHEMES: VerifiedMarkingScheme[] =
  RAW_MAIN_PAPERS.map(buildMarkingSchemeForPaper);

export const SCHEMES_BY_ID: Record<string, VerifiedMarkingScheme> = Object.fromEntries(
  VERIFIED_MARKING_SCHEMES.map((s) => [s.id, s]),
);

/**
 * Published Exam Hall Main Sheets guaranteed to pass canPublishExamPaper gatekeeping.
 */
export const VERIFIED_MAIN_PAPERS: VerifiedExamPaper[] = RAW_MAIN_PAPERS.filter((paper) => {
  const scheme = paper.markingSchemeId ? SCHEMES_BY_ID[paper.markingSchemeId] : null;
  return canPublishExamPaper(paper, scheme, QUESTIONS_BY_ID).allowed;
});

/**
 * Sample governance cases illustrating papers explicitly blocked from entering the live
 * Examination Hall (Draft, Under Human Review, Missing Scheme, or Unapproved Scheme).
 */
export interface GovernanceSampleItem {
  paper: VerifiedExamPaper;
  scheme: VerifiedMarkingScheme | null;
}

export const BLOCKED_GOVERNANCE_SAMPLES: GovernanceSampleItem[] = [
  {
    paper: {
      ...RAW_MAIN_PAPERS[0],
      id: 'phy-draft-blocked-sample',
      title: 'Physics (042) · Upcoming Optics Special Set (Draft)',
      subtitle: 'In internal authoring — blocked from live OMR Examination Hall',
      publicationStatus: 'Draft',
      markingSchemeId: 'ms-phy-draft-blocked-sample',
      questionIds: PHYSICS_QUESTIONS.slice(0, 10).map((q) => q.id),
      approval: {
        ...HUMAN_APPROVAL_V3,
        status: 'Draft',
        verificationNotes: 'Initial author draft awaiting peer check.',
      },
    },
    scheme: {
      ...buildMarkingSchemeForPaper(RAW_MAIN_PAPERS[0]),
      id: 'ms-phy-draft-blocked-sample',
      paperId: 'phy-draft-blocked-sample',
      approvalStatus: 'Draft',
    },
  },
  {
    paper: {
      ...RAW_MAIN_PAPERS[2],
      id: 'chem-review-blocked-sample',
      title: 'Chemistry (043) · Electrochemistry Numericals (Under Human Review)',
      subtitle: 'Queued for step-marking sign-off — blocked until Approved/Published',
      publicationStatus: 'Under Human Review',
      markingSchemeId: 'ms-chem-review-blocked-sample',
      questionIds: CHEMISTRY_QUESTIONS.slice(0, 10).map((q) => q.id),
      approval: {
        ...HUMAN_APPROVAL_V3,
        status: 'Under Human Review',
        verificationNotes: 'Nernst equation unit checks pending final reviewer approval.',
      },
    },
    scheme: {
      ...buildMarkingSchemeForPaper(RAW_MAIN_PAPERS[2]),
      id: 'ms-chem-review-blocked-sample',
      paperId: 'chem-review-blocked-sample',
      approvalStatus: 'Under Human Review',
    },
  },
  {
    paper: {
      ...RAW_MAIN_PAPERS[4],
      id: 'bio-noscheme-blocked-sample',
      title: 'Biology (044) · Genetics Rapid Test (Missing Scheme)',
      subtitle: 'Published flag attempted without linked human Marking Scheme — auto-blocked',
      publicationStatus: 'Published',
      markingSchemeId: null,
      questionIds: BIOLOGY_QUESTIONS.slice(0, 10).map((q) => q.id),
      approval: HUMAN_APPROVAL_V3,
    },
    scheme: null,
  },
  {
    paper: {
      ...RAW_MAIN_PAPERS[6],
      id: 'math-incomplete-scheme-blocked',
      title: 'Mathematics (041) · Calculus Sprint (Incomplete Scheme)',
      subtitle: 'Marking Scheme missing verification entry for last question — auto-blocked',
      publicationStatus: 'Approved',
      markingSchemeId: 'ms-math-incomplete-scheme-blocked',
      questionIds: MATHS_QUESTIONS.slice(0, 8).map((q) => q.id),
      approval: {...HUMAN_APPROVAL_V3, status: 'Approved'},
    },
    scheme: (() => {
      const qIds = MATHS_QUESTIONS.slice(0, 7).map((q) => q.id);
      const base = buildMarkingSchemeForPaper({
        ...RAW_MAIN_PAPERS[6],
        id: 'math-incomplete-scheme-blocked',
        markingSchemeId: 'ms-math-incomplete-scheme-blocked',
        questionIds: qIds,
      });
      return {
        ...base,
        approvalStatus: 'Approved' as const,
      };
    })(),
  },
];

export function getApprovedPapersForSubject(subjectId: SubjectId): VerifiedExamPaper[] {
  return VERIFIED_MAIN_PAPERS.filter((paper) => {
    if (paper.subjectId !== subjectId) return false;
    const scheme = paper.markingSchemeId ? SCHEMES_BY_ID[paper.markingSchemeId] : null;
    return canPublishExamPaper(paper, scheme, QUESTIONS_BY_ID).allowed;
  });
}

export function getVerifiedPaperById(paperId: string): VerifiedExamPaper | undefined {
  return VERIFIED_MAIN_PAPERS.find((p) => p.id === paperId);
}

export function getMarkingSchemeForPaper(
  paper: VerifiedExamPaper,
): VerifiedMarkingScheme | undefined {
  if (!paper.markingSchemeId) return undefined;
  return SCHEMES_BY_ID[paper.markingSchemeId];
}
