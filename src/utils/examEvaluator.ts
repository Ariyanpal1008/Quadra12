import type {
  ActiveExamQuestionView,
  CategoryPerformanceStat,
  ExamAttemptRecord,
  PracticeSheetQuestionSnapshot,
  PracticeSheetSnapshot,
  QuestionResultBreakdown,
  VerifiedExamPaper,
  VerifiedMarkingScheme,
  VerifiedQuestion,
} from '../data/v3Types';

export interface GatekeeperCheckResult {
  allowed: boolean;
  reason?: string;
}

export function isApprovedOrPublishedStatus(status: string | undefined | null): boolean {
  return status === 'Approved' || status === 'Published';
}

/**
 * Publication Gatekeeper:
 * Strict enforcement that no draft, under-review, or archived paper—and no paper
 * lacking an approved/published corresponding marking scheme covering every question—can
 * ever be launched as a live student OMR examination.
 */
export function canPublishExamPaper(
  paper: VerifiedExamPaper,
  markingScheme: VerifiedMarkingScheme | null | undefined,
  questionsById: Record<string, VerifiedQuestion>,
): GatekeeperCheckResult {
  if (!paper.isMainSheet) {
    return {
      allowed: false,
      reason: 'Paper is not marked as an Exam Hall Main Sheet.',
    };
  }

  if (!isApprovedOrPublishedStatus(paper.publicationStatus)) {
    return {
      allowed: false,
      reason: `Paper status is "${paper.publicationStatus}". Only Approved or Published papers may enter the Examination Hall.`,
    };
  }

  if (!paper.markingSchemeId || !markingScheme) {
    return {
      allowed: false,
      reason: 'Missing human-verified Marking Scheme. Automated AI or unverified answer invention is disabled.',
    };
  }

  if (markingScheme.paperId !== paper.id || markingScheme.id !== paper.markingSchemeId) {
    return {
      allowed: false,
      reason: 'Marking Scheme ID does not match the linked Exam Hall Main Sheet.',
    };
  }

  if (!isApprovedOrPublishedStatus(markingScheme.approvalStatus)) {
    return {
      allowed: false,
      reason: `Marking Scheme status is "${markingScheme.approvalStatus}". Both Question Paper and Marking Scheme must be human-approved before publication.`,
    };
  }

  if (!Array.isArray(paper.questionIds) || paper.questionIds.length === 0) {
    return {
      allowed: false,
      reason: 'Paper contains zero questions.',
    };
  }

  for (const qId of paper.questionIds) {
    const q = questionsById[qId];
    if (!q) {
      return {
        allowed: false,
        reason: `Referenced question "${qId}" is missing from the verified Question Bank.`,
      };
    }
    if (!isApprovedOrPublishedStatus(q.approvalStatus)) {
      return {
        allowed: false,
        reason: `Question "${qId}" has status "${q.approvalStatus}" and is not approved.`,
      };
    }
    const schemeEntry = markingScheme.entries[qId];
    if (!schemeEntry) {
      return {
        allowed: false,
        reason: `Marking Scheme is incomplete: missing verified entry for question "${qId}".`,
      };
    }
    if (
      schemeEntry.correctIndex !== 0 &&
      schemeEntry.correctIndex !== 1 &&
      schemeEntry.correctIndex !== 2 &&
      schemeEntry.correctIndex !== 3
    ) {
      return {
        allowed: false,
        reason: `Marking Scheme entry for "${qId}" does not contain a valid human-verified answer index.`,
      };
    }
  }

  return {allowed: true};
}

/**
 * Strips all answer keys, solutions, and marking rules before rendering an active timed exam.
 */
export function stripAnswerKeysForActiveExam(
  paper: VerifiedExamPaper,
  questionsById: Record<string, VerifiedQuestion>,
): ActiveExamQuestionView[] {
  return paper.questionIds
    .map((id) => questionsById[id])
    .filter((q): q is VerifiedQuestion => Boolean(q))
    .map((q) => ({
      id: q.id,
      subjectId: q.subjectId,
      chapterId: q.chapterId,
      chapterTitle: q.chapterTitle,
      topic: q.topic,
      difficulty: q.difficulty,
      questionType: q.questionType,
      originalMarkCategory: q.originalMarkCategory,
      prompt: q.prompt,
      options: [...q.options] as [string, string, string, string],
      diagramRefId: q.diagramRefId,
    }));
}

export interface EvaluateOmrInput {
  attemptId: string;
  studentProfileId: string;
  studentName: string;
  paper: VerifiedExamPaper;
  markingScheme: VerifiedMarkingScheme;
  questionsById: Record<string, VerifiedQuestion>;
  studentAnswers: Record<string, number>;
  markedForReview: Record<string, boolean>;
  timeTakenSeconds: number;
  submittedAt?: string;
}

/**
 * 100% deterministic local OMR evaluation against the linked human-approved Marking Scheme.
 * Never alters the source Exam Hall Main Sheet; generates an immutable PracticeSheetSnapshot
 * paired to the student's individual attemptId & studentProfileId.
 */
export function evaluateOmrSubmission(input: EvaluateOmrInput): ExamAttemptRecord {
  const {
    attemptId,
    studentProfileId,
    studentName,
    paper,
    markingScheme,
    questionsById,
    studentAnswers,
    markedForReview,
    timeTakenSeconds,
  } = input;

  const gate = canPublishExamPaper(paper, markingScheme, questionsById);
  if (!gate.allowed) {
    throw new Error(gate.reason || 'Paper cannot be evaluated because it failed publication checks.');
  }

  const submittedAt = input.submittedAt || new Date().toISOString();
  const questionResults: QuestionResultBreakdown[] = [];
  const practiceQuestions: PracticeSheetQuestionSnapshot[] = [];

  let positiveMarksEarned = 0;
  let negativeMarksDeducted = 0;
  let maxMarks = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  const chapterMap = new Map<string, {total: number; correct: number; incorrect: number; unanswered: number}>();
  const difficultyMap = new Map<string, {total: number; correct: number; incorrect: number; unanswered: number}>();
  const relatedChapterSet = new Set<string>();
  const relatedDiagramSet = new Set<string>();
  const relatedStudySheetSet = new Set<string>();

  paper.questionIds.forEach((qId, idx) => {
    const q = questionsById[qId];
    const scheme = markingScheme.entries[qId];
    const qNum = idx + 1;

    const rawPick = studentAnswers[qId];
    const selectedIndex =
      typeof rawPick === 'number' && rawPick >= 0 && rawPick <= 3 ? rawPick : null;
    const isMarked = Boolean(markedForReview[qId]);

    let outcome: 'correct' | 'incorrect' | 'unanswered' = 'unanswered';
    let marksAwarded = 0;

    if (selectedIndex === null) {
      outcome = 'unanswered';
      unansweredCount += 1;
      marksAwarded = 0;
    } else if (selectedIndex === scheme.correctIndex) {
      outcome = 'correct';
      correctCount += 1;
      marksAwarded = scheme.positiveMarks;
      positiveMarksEarned += scheme.positiveMarks;
    } else {
      outcome = 'incorrect';
      incorrectCount += 1;
      marksAwarded = -Math.abs(scheme.negativeMarks);
      negativeMarksDeducted += Math.abs(scheme.negativeMarks);
    }

    maxMarks += scheme.maxMarks;

    if (q.chapterId) relatedChapterSet.add(q.chapterId);
    if (q.diagramRefId) relatedDiagramSet.add(q.diagramRefId);
    if (scheme.diagramRefId) relatedDiagramSet.add(scheme.diagramRefId);
    if (q.subjectiveSolution.diagramRefId) {
      relatedDiagramSet.add(q.subjectiveSolution.diagramRefId);
    }
    for (const sId of scheme.relatedStudySheetIds) {
      relatedStudySheetSet.add(sId);
    }
    for (const sId of q.relatedStudySheetIds) {
      relatedStudySheetSet.add(sId);
    }

    const chStat = chapterMap.get(q.chapterTitle) ?? {
      total: 0,
      correct: 0,
      incorrect: 0,
      unanswered: 0,
    };
    chStat.total += 1;
    chStat[outcome] += 1;
    chapterMap.set(q.chapterTitle, chStat);

    const diffStat = difficultyMap.get(q.difficulty) ?? {
      total: 0,
      correct: 0,
      incorrect: 0,
      unanswered: 0,
    };
    diffStat.total += 1;
    diffStat[outcome] += 1;
    difficultyMap.set(q.difficulty, diffStat);

    questionResults.push({
      questionId: q.id,
      questionNumber: qNum,
      chapterId: q.chapterId,
      chapterTitle: q.chapterTitle,
      topic: q.topic,
      difficulty: q.difficulty,
      questionType: q.questionType,
      originalMarkCategory: q.originalMarkCategory,
      prompt: q.prompt,
      options: [...q.options] as [string, string, string, string],
      selectedIndex,
      correctIndex: scheme.correctIndex,
      outcome,
      marksAwarded: Number(marksAwarded.toFixed(2)),
      maxMarks: scheme.maxMarks,
      diagramRefId: q.diagramRefId ?? scheme.diagramRefId,
      subjectiveSolution: q.subjectiveSolution,
      relatedStudySheetIds: scheme.relatedStudySheetIds,
    });

    practiceQuestions.push({
      questionId: q.id,
      questionNumber: qNum,
      subjectId: q.subjectId,
      chapterId: q.chapterId,
      chapterTitle: q.chapterTitle,
      topic: q.topic,
      difficulty: q.difficulty,
      questionType: q.questionType,
      originalMarkCategory: q.originalMarkCategory,
      prompt: q.prompt,
      options: [...q.options] as [string, string, string, string],
      diagramRefId: q.diagramRefId,
      studentSelectedIndex: selectedIndex,
      markedForReview: isMarked,
    });
  });

  const totalScore = Number((positiveMarksEarned - negativeMarksDeducted).toFixed(2));
  const attemptedCount = correctCount + incorrectCount;
  const accuracyPercent =
    attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

  const toStatsArray = (
    map: Map<string, {total: number; correct: number; incorrect: number; unanswered: number}>,
  ): CategoryPerformanceStat[] =>
    Array.from(map.entries()).map(([label, st]) => {
      const att = st.correct + st.incorrect;
      return {
        label,
        total: st.total,
        correct: st.correct,
        incorrect: st.incorrect,
        unanswered: st.unanswered,
        accuracyPercent: att > 0 ? Math.round((st.correct / att) * 100) : 0,
      };
    });

  const practiceSheet: PracticeSheetSnapshot = {
    snapshotId: `ps-${attemptId}`,
    attemptId,
    studentProfileId,
    paperId: paper.id,
    paperTitle: paper.title,
    paperVersion: paper.paperVersion,
    markingSchemeId: markingScheme.id,
    subjectId: paper.subjectId,
    positiveMarks: paper.positiveMarks,
    negativeMarks: paper.negativeMarks,
    maxMarks: Number(maxMarks.toFixed(2)),
    createdAt: submittedAt,
    isImmutableFromMainSheet: true,
    questions: practiceQuestions,
  };

  return {
    attemptId,
    studentProfileId,
    studentName,
    subjectId: paper.subjectId,
    paperId: paper.id,
    paperTitle: paper.title,
    paperVersion: paper.paperVersion,
    markingSchemeId: markingScheme.id,
    submittedAt,
    timeTakenSeconds: Math.max(0, Math.min(paper.durationSeconds, Math.round(timeTakenSeconds))),
    totalDurationSeconds: paper.durationSeconds,
    totalScore,
    maxMarks: Number(maxMarks.toFixed(2)),
    positiveMarksEarned: Number(positiveMarksEarned.toFixed(2)),
    negativeMarksDeducted: Number(negativeMarksDeducted.toFixed(2)),
    correctCount,
    incorrectCount,
    unansweredCount,
    accuracyPercent,
    positiveRule: paper.positiveMarks,
    negativeRule: paper.negativeMarks,
    practiceSheet,
    questionResults,
    chapterBreakdown: toStatsArray(chapterMap),
    difficultyBreakdown: toStatsArray(difficultyMap),
    relatedChapterIds: Array.from(relatedChapterSet),
    relatedDiagramIds: Array.from(relatedDiagramSet),
    relatedStudySheetIds: Array.from(relatedStudySheetSet),
  };
}
