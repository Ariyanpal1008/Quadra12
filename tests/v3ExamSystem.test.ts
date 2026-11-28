import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {describe, it} from 'node:test';

import {APP_VERSION} from '../src/constants/version';
import {SUBJECTS} from '../src/data/pcmbData';
import {
  ALL_VERIFIED_QUESTIONS,
  BIOLOGY_QUESTIONS,
  CHEMISTRY_QUESTIONS,
  MATHS_QUESTIONS,
  PHYSICS_QUESTIONS,
} from '../src/data/questionBank';
import {ALL_STUDY_BUNDLES, getChapterStudyBundle} from '../src/data/studySheets';
import {getDiagramMetadata} from '../src/data/v3Diagrams';
import {
  BLOCKED_GOVERNANCE_SAMPLES,
  QUESTIONS_BY_ID,
  VERIFIED_MAIN_PAPERS,
  VERIFIED_MARKING_SCHEMES,
  getMarkingSchemeForPaper,
} from '../src/data/verifiedPapers';
import {
  canPublishExamPaper,
  evaluateOmrSubmission,
  stripAnswerKeysForActiveExam,
} from '../src/utils/examEvaluator';
import {
  LEGACY_V2_KEYS,
  StorageLike,
  appendExamAttemptRecord,
  createStudentProfile,
  ensureV2ToV3SafeMigration,
  loadChapterStudyStatusMap,
  loadExamAttemptsForStudent,
  setChapterStudyStatus,
} from '../src/utils/v3Storage';
import {
  CBSE_2027_DATE_SHEET,
  evaluateCbse2027Schedule,
} from '../src/data/cbseDateSheet2027';
import {
  buildHackersPlaylistEmbedUrl,
  buildHackersYouTubeEmbedUrl,
} from '../src/components/YouTubeSyncPlayer';
import {createApp} from '../server';

function createMemoryStorage(initial: Record<string, string> = {}): StorageLike & {
  dump(): Record<string, string>;
} {
  const store = new Map<string, string>(Object.entries(initial));
  return {
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    setItem(key: string, value: string) {
      store.set(key, String(value));
    },
    removeItem(key: string) {
      store.delete(key);
    },
    dump() {
      return Object.fromEntries(store.entries());
    },
  };
}

describe('Quadra 12 v3.1 — Release Hygiene & Zero Gemini Dependencies', () => {
  it('sets version 3.1 consistently across package.json, version.ts, sw.js, and Android config', () => {
    const root = process.cwd();
    const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
    assert.equal(pkg.version, '3.1');
    assert.equal(APP_VERSION, '3.1');
    assert.equal(pkg.dependencies['@google/genai'], undefined);

    const swSource = fs.readFileSync(path.join(root, 'src/sw.js'), 'utf8');
    assert.match(swSource, /quadra12-v3\.1/);

    const androidCfg = fs.readFileSync(path.join(root, 'scripts/configure-android.mjs'), 'utf8');
    assert.match(androidCfg, /'3\.1'/);
    assert.match(androidCfg, /3100 \+ runNumber/);
  });

  it('contains zero Gemini/proxy env leaks in server, env template, and workflows, and preserves historical v2.6.2 notes', () => {
    const root = process.cwd();
    assert.equal(fs.existsSync(path.join(root, 'server/geminiFailover.ts')), false);
    assert.equal(fs.existsSync(path.join(root, 'server/geminiFailover.test.ts')), false);
    assert.equal(fs.existsSync(path.join(root, 'RELEASE_NOTES_v2.6.2.md')), true);
    assert.equal(fs.existsSync(path.join(root, 'RELEASE_NOTES_v3.1.md')), true);
    assert.equal(fs.existsSync(path.join(root, 'RELEASE_NOTES_v3.0.0.md')), false);

    const serverSrc = fs.readFileSync(path.join(root, 'server.ts'), 'utf8');
    assert.doesNotMatch(serverSrc, /GEMINI_API_KEY|@google\/genai|\/api\/exam\/grade/i);

    const deployYml = fs.readFileSync(path.join(root, '.github/workflows/deploy.yml'), 'utf8');
    assert.doesNotMatch(deployYml, /VITE_PROXY_URL|GEMINI/i);

    const androidYml = fs.readFileSync(
      path.join(root, '.github/workflows/android-release.yml'),
      'utf8',
    );
    assert.doesNotMatch(androidYml, /VITE_PROXY_URL|GEMINI/i);
    assert.match(androidYml, /ANDROID_KEYSTORE_BASE64/);
  });

  it('serves GET /api/health v3.1 deterministic-local-exam-engine and JSON 404 for unknown /api routes', async () => {
    const app = createApp();
    const server = http.createServer(app);
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));

    try {
      const addr = server.address();
      assert.ok(addr && typeof addr === 'object');
      const base = `http://127.0.0.1:${addr.port}`;

      const healthRes = await fetch(`${base}/api/health`, {
        headers: {Origin: 'https://ariyanpal1008.github.io'},
      });
      assert.equal(healthRes.status, 200);
      assert.equal(healthRes.headers.get('access-control-allow-origin'), 'https://ariyanpal1008.github.io');
      const healthBody = (await healthRes.json()) as Record<string, unknown>;
      assert.equal(healthBody.ok, true);
      assert.equal(healthBody.version, '3.1');
      assert.equal(healthBody.mode, 'deterministic-local-exam-engine');

      const missingRes = await fetch(`${base}/api/exam/grade`, {method: 'POST'});
      assert.equal(missingRes.status, 404);
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close((err) => (err ? reject(err) : resolve())),
      );
    }
  });
});

describe('Quadra 12 v3.1 — Official CBSE 2027 Date Sheet & 12th Hackers Player Controls', () => {
  it('tracks all 8 CBSE 2027 dates in IST, advances cleanly after end time, and auto-expires after 9 Apr 2027 1:30 PM IST', () => {
    assert.equal(CBSE_2027_DATE_SHEET.length, 8);

    // Before first exam (1 Feb 2027 09:00 IST)
    const beforeBoards = evaluateCbse2027Schedule(Date.parse('2027-02-01T09:00:00+05:30'));
    assert.equal(beforeBoards.completedCount, 0);
    assert.equal(beforeBoards.isExpired, false);
    assert.equal(beforeBoards.activeExam?.subject, 'Physics');
    assert.equal(beforeBoards.activeExam?.status, 'upcoming');
    assert.equal(beforeBoards.activeExam?.daysLeft, 15);

    // Physics exam morning (16 Feb 2027 09:00 IST) -> Exam Today
    const phyMorning = evaluateCbse2027Schedule(Date.parse('2027-02-16T09:00:00+05:30'));
    assert.equal(phyMorning.activeExam?.subject, 'Physics');
    assert.equal(phyMorning.activeExam?.status, 'today');
    assert.equal(phyMorning.activeExam?.isInProgress, false);

    // Fine Arts in progress (24 Feb 2027 11:30 IST, ends at 12:30 IST)
    const fineArtsLive = evaluateCbse2027Schedule(Date.parse('2027-02-24T11:30:00+05:30'));
    assert.equal(fineArtsLive.completedCount, 2); // Physics & PE completed
    assert.equal(fineArtsLive.exams[0].status, 'completed');
    assert.equal(fineArtsLive.exams[1].status, 'completed');
    assert.equal(fineArtsLive.activeExam?.code, '049 / 050 / 051 / 052');
    assert.equal(fineArtsLive.activeExam?.status, 'today');
    assert.equal(fineArtsLive.activeExam?.isInProgress, true);

    // Fine Arts just ended (24 Feb 2027 12:30 IST) -> advances to Chemistry (043)
    const afterFineArts = evaluateCbse2027Schedule(Date.parse('2027-02-24T12:30:00+05:30'));
    assert.equal(afterFineArts.completedCount, 3);
    assert.equal(afterFineArts.exams[2].status, 'completed');
    assert.equal(afterFineArts.activeExam?.subject, 'Chemistry');
    assert.equal(afterFineArts.isExpired, false);

    // Final exam (Web Application 803) ends (9 Apr 2027 13:30 IST) -> expires cleanly
    const afterAllBoards = evaluateCbse2027Schedule(Date.parse('2027-04-09T13:30:00+05:30'));
    assert.equal(afterAllBoards.completedCount, 8);
    assert.equal(afterAllBoards.allCompleted, true);
    assert.equal(afterAllBoards.isExpired, true);
    assert.equal(afterAllBoards.activeExam, null);
  });

  it('appends fs=0 to every 12th Hackers YouTube embed URL across all modes', () => {
    for (const mode of ['standard', 'pure', 'nocookie'] as const) {
      const url = buildHackersYouTubeEmbedUrl('dQw4w9WgXcQ', mode);
      assert.match(url, /[?&]fs=0(?:&|$)/);
    }
    const playlistUrl = buildHackersPlaylistEmbedUrl('PLDFtjdbvBWcYSFSWAmmApY25zg5A1Q7Df');
    assert.match(playlistUrl, /[?&]fs=0(?:&|$)/);
  });
});

describe('Quadra 12 v3.1 — 50 Chapter Study Libraries & 720-Question Verified Bank', () => {
  it('provides Study Library bundles for all 50 NCERT chapters with valid SVG diagram references and complete derivations', () => {
    const allChapterIds = SUBJECTS.flatMap((s) => s.chapters.map((c) => c.id));
    assert.equal(allChapterIds.length, 50);
    assert.equal(ALL_STUDY_BUNDLES.length, 50);

    let totalPhysicsDerivations = 0;

    for (const chId of allChapterIds) {
      const bundle = getChapterStudyBundle(chId);
      assert.ok(bundle, `Missing study bundle for chapter ${chId}`);
      assert.ok(bundle.summary.trim().length > 20, `Empty summary for ${chId}`);

      const itemCount =
        (bundle.physicsFormulas?.length ?? 0) +
        (bundle.physicsDerivations?.length ?? 0) +
        (bundle.chemistryItems?.length ?? 0) +
        (bundle.chemistryDerivations?.length ?? 0) +
        (bundle.biologyItems?.length ?? 0) +
        (bundle.mathsFormulas?.length ?? 0) +
        (bundle.mathsMethods?.length ?? 0) +
        (bundle.mathsDerivations?.length ?? 0);
      assert.ok(itemCount >= 1, `Study bundle for ${chId} has no items`);
      assert.ok(
        bundle.diagramIds.length >= 1,
        `Study bundle for ${chId} is missing chapter diagrams/graphs`,
      );

      for (const diagId of bundle.diagramIds) {
        assert.ok(
          getDiagramMetadata(diagId),
          `Missing SVG diagram ${diagId} on chapter bundle ${chId}`,
        );
      }

      const refIds: Array<string | undefined> = [
        ...(bundle.physicsFormulas ?? []).map((x) => x.diagramRefId),
        ...(bundle.physicsDerivations ?? []).map((x) => x.diagramRefId),
        ...(bundle.chemistryItems ?? []).map((x) => x.diagramRefId),
        ...(bundle.chemistryDerivations ?? []).map((x) => x.diagramRefId),
        ...(bundle.biologyItems ?? []).map((x) => x.diagramRefId),
        ...(bundle.mathsMethods ?? []).map((x) => x.diagramRefId),
        ...(bundle.mathsDerivations ?? []).map((x) => x.diagramRefId),
      ];
      for (const refId of refIds) {
        if (refId) {
          assert.ok(
            getDiagramMetadata(refId),
            `Unresolved diagramRefId ${refId} in chapter bundle ${chId}`,
          );
        }
      }

      if (chId.startsWith('phy-')) {
        assert.ok(
          (bundle.physicsFormulas?.length ?? 0) >= 1,
          `Physics chapter ${chId} missing physicsFormulas`,
        );
        const derivLen = bundle.physicsDerivations?.length ?? 0;
        assert.ok(derivLen >= 1, `Physics chapter ${chId} missing physicsDerivations`);
        totalPhysicsDerivations += derivLen;
      }

      if (chId.startsWith('math-')) {
        assert.ok(
          (bundle.mathsFormulas?.length ?? 0) >= 1,
          `Maths chapter ${chId} missing mathsFormulas`,
        );
        assert.ok(
          (bundle.mathsMethods?.length ?? 0) >= 1,
          `Maths chapter ${chId} missing mathsMethods`,
        );
        assert.ok(
          (bundle.mathsDerivations?.length ?? 0) >= 1,
          `Maths chapter ${chId} missing mathsDerivations`,
        );
      }

      if (['chem-1', 'chem-2', 'chem-3'].includes(chId)) {
        assert.ok(
          (bundle.chemistryDerivations?.length ?? 0) >= 1,
          `Physical Chemistry chapter ${chId} missing chemistryDerivations`,
        );
      }
    }

    assert.ok(
      totalPhysicsDerivations >= 20,
      `Expected >= 20 Physics derivations, got ${totalPhysicsDerivations}`,
    );
  });

  it('contains exact 720 verified questions (180 per subject) with unique IDs and valid options', () => {
    assert.equal(PHYSICS_QUESTIONS.length, 180);
    assert.equal(CHEMISTRY_QUESTIONS.length, 180);
    assert.equal(BIOLOGY_QUESTIONS.length, 180);
    assert.equal(MATHS_QUESTIONS.length, 180);
    assert.equal(ALL_VERIFIED_QUESTIONS.length, 720);

    const seen = new Set<string>();
    const chapterSet = new Set(SUBJECTS.flatMap((s) => s.chapters.map((c) => c.id)));

    for (const q of ALL_VERIFIED_QUESTIONS) {
      assert.equal(seen.has(q.id), false, `Duplicate question ID ${q.id}`);
      seen.add(q.id);
      assert.ok(chapterSet.has(q.chapterId), `Invalid chapterId ${q.chapterId} on ${q.id}`);
      assert.equal(q.options.length, 4);
      assert.ok([0, 1, 2, 3].includes(q.correctIndex), `Invalid correctIndex on ${q.id}`);
      assert.ok(q.prompt.trim().length > 8);
      assert.doesNotMatch(q.prompt, /\b(TODO|TBD|FIXME)\b/);
      assert.doesNotMatch(q.subjectiveSolution.finalResult, /\bwait\.\.\.|let us recalculate\b/i);
      if (q.diagramRefId) {
        assert.ok(getDiagramMetadata(q.diagramRefId), `Missing diagram ${q.diagramRefId} on ${q.id}`);
      }
    }
  });
});

describe('Quadra 12 v3.1 — Exam Governance, Stripping & Deterministic OMR Evaluation', () => {
  it('approves all 8 Published Main Sheets and blocks Draft, Under Review, Missing Scheme, and Incomplete Scheme papers', () => {
    assert.equal(VERIFIED_MAIN_PAPERS.length, 8);
    assert.equal(VERIFIED_MARKING_SCHEMES.length, 8);

    for (const paper of VERIFIED_MAIN_PAPERS) {
      const scheme = getMarkingSchemeForPaper(paper);
      const gate = canPublishExamPaper(paper, scheme, QUESTIONS_BY_ID);
      assert.equal(gate.allowed, true, `Expected approved paper ${paper.id}, got ${gate.reason}`);
    }

    assert.equal(BLOCKED_GOVERNANCE_SAMPLES.length, 4);
    for (const sample of BLOCKED_GOVERNANCE_SAMPLES) {
      const gate = canPublishExamPaper(sample.paper, sample.scheme, QUESTIONS_BY_ID);
      assert.equal(gate.allowed, false, `Expected blocked sample ${sample.paper.id}`);
      assert.ok(gate.reason && gate.reason.length > 5);
    }
  });

  it('strips answer keys during live OMR exams and scores +4/-1 & +1/0 deterministically', () => {
    const compPaper = VERIFIED_MAIN_PAPERS.find((p) => p.positiveMarks === 4)!;
    const compScheme = getMarkingSchemeForPaper(compPaper)!;
    const activeViews = stripAnswerKeysForActiveExam(compPaper, QUESTIONS_BY_ID);

    assert.equal(activeViews.length, compPaper.questionIds.length);
    for (const view of activeViews) {
      assert.equal('correctIndex' in view, false);
      assert.equal('subjectiveSolution' in view, false);
    }

    const q0 = QUESTIONS_BY_ID[compPaper.questionIds[0]];
    const q1 = QUESTIONS_BY_ID[compPaper.questionIds[1]];
    const wrongIdx = (q1.correctIndex + 1) % 4;

    const attempt = evaluateOmrSubmission({
      attemptId: 'att-comp-1',
      studentProfileId: 'student-a',
      studentName: 'Aarav',
      paper: compPaper,
      markingScheme: compScheme,
      questionsById: QUESTIONS_BY_ID,
      studentAnswers: {
        [q0.id]: q0.correctIndex,
        [q1.id]: wrongIdx,
      },
      markedForReview: {[q1.id]: true},
      timeTakenSeconds: 420,
    });

    assert.equal(attempt.correctCount, 1);
    assert.equal(attempt.incorrectCount, 1);
    assert.equal(attempt.unansweredCount, compPaper.questionIds.length - 2);
    assert.equal(attempt.positiveMarksEarned, 4);
    assert.equal(attempt.negativeMarksDeducted, 1);
    assert.equal(attempt.totalScore, 3);
    assert.equal(attempt.accuracyPercent, 50);
    assert.equal(attempt.practiceSheet.isImmutableFromMainSheet, true);
    assert.equal(attempt.practiceSheet.questions[0].studentSelectedIndex, q0.correctIndex);
    assert.equal(attempt.practiceSheet.questions[1].markedForReview, true);
  });

  it('guarantees full Result, Practice Sheet, Marking Scheme & Study Library access even on 0-mark submissions', () => {
    const boardPaper = VERIFIED_MAIN_PAPERS.find((p) => p.positiveMarks === 1 && p.negativeMarks === 0)!;
    const boardScheme = getMarkingSchemeForPaper(boardPaper)!;

    const zeroAttempt = evaluateOmrSubmission({
      attemptId: 'att-zero-1',
      studentProfileId: 'student-z',
      studentName: 'Meera',
      paper: boardPaper,
      markingScheme: boardScheme,
      questionsById: QUESTIONS_BY_ID,
      studentAnswers: {},
      markedForReview: {},
      timeTakenSeconds: 15,
    });

    assert.equal(zeroAttempt.totalScore, 0);
    assert.equal(zeroAttempt.correctCount, 0);
    assert.equal(zeroAttempt.unansweredCount, boardPaper.questionIds.length);
    assert.equal(zeroAttempt.questionResults.length, boardPaper.questionIds.length);
    assert.equal(zeroAttempt.practiceSheet.questions.length, boardPaper.questionIds.length);
    assert.ok(zeroAttempt.relatedChapterIds.length > 0);
    assert.ok(zeroAttempt.relatedStudySheetIds.length > 0);
    assert.ok(zeroAttempt.questionResults.every((r) => r.subjectiveSolution.finalResult.length > 0));
  });
});

describe('Quadra 12 v3.1 — Multi-Student Isolation & Non-Destructive v2.6.2 Migration', () => {
  it('isolates student attempts, PracticeSheetSnapshots, and explicit ChapterStudyStatus per profile', () => {
    const storage = createMemoryStorage();
    const p1 = createStudentProfile('Student One', storage);
    const p2 = createStudentProfile('Student Two', storage);

    const paper = VERIFIED_MAIN_PAPERS[0];
    const scheme = getMarkingSchemeForPaper(paper)!;

    const a1 = evaluateOmrSubmission({
      attemptId: 'att-p1',
      studentProfileId: p1.id,
      studentName: p1.name,
      paper,
      markingScheme: scheme,
      questionsById: QUESTIONS_BY_ID,
      studentAnswers: {[paper.questionIds[0]]: QUESTIONS_BY_ID[paper.questionIds[0]].correctIndex},
      markedForReview: {},
      timeTakenSeconds: 60,
    });
    const a2 = evaluateOmrSubmission({
      attemptId: 'att-p2',
      studentProfileId: p2.id,
      studentName: p2.name,
      paper,
      markingScheme: scheme,
      questionsById: QUESTIONS_BY_ID,
      studentAnswers: {},
      markedForReview: {},
      timeTakenSeconds: 45,
    });

    appendExamAttemptRecord(a1, storage);
    appendExamAttemptRecord(a2, storage);

    const list1 = loadExamAttemptsForStudent(p1.id, storage);
    const list2 = loadExamAttemptsForStudent(p2.id, storage);
    assert.equal(list1.length, 1);
    assert.equal(list2.length, 1);
    assert.equal(list1[0].totalScore, 4);
    assert.equal(list2[0].totalScore, 0);

    setChapterStudyStatus(p1.id, 'phy-1', 'Completed', storage);
    assert.equal(loadChapterStudyStatusMap(p1.id, storage)['phy-1'], 'Completed');
    assert.equal(loadChapterStudyStatusMap(p2.id, storage)['phy-1'], undefined);
  });

  it('preserves all 17 legacy v2.6.2 localStorage keys intact during v3 migration', () => {
    const initial: Record<string, string> = {};
    LEGACY_V2_KEYS.forEach((key, idx) => {
      initial[key] = JSON.stringify({legacyIndex: idx, preserved: true});
    });

    const storage = createMemoryStorage(initial);
    const result = ensureV2ToV3SafeMigration(storage);

    assert.equal(result.migrated, true);
    assert.equal(result.preservedKeyCount, LEGACY_V2_KEYS.length);

    for (const key of LEGACY_V2_KEYS) {
      assert.equal(storage.getItem(key), initial[key]);
    }
  });
});
