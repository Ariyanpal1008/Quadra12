import {useEffect, useMemo, useState} from 'react';
import {
  Archive,
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  FileCheck2,
  History,
  Play,
  Sparkles,
  UserPlus,
  Users,
} from 'lucide-react';
import {SUBJECTS, type SubjectId} from '../data/pcmbData';
import type {
  ActiveExamQuestionView,
  ExamAttemptRecord,
  PracticeQuestionAttempt,
  StudentProfile,
  VerifiedExamPaper,
} from '../data/v3Types';
import {
  QUESTIONS_BY_ID,
  getApprovedPapersForSubject,
  getMarkingSchemeForPaper,
  getVerifiedPaperById,
} from '../data/verifiedPapers';
import {
  canPublishExamPaper,
  evaluateOmrSubmission,
  stripAnswerKeysForActiveExam,
} from '../utils/examEvaluator';
import {
  appendExamAttemptRecord,
  clearActiveOmrDraft,
  createStudentProfile,
  getActiveStudentProfileId,
  loadActiveOmrDraft,
  loadExamAttemptsForStudent,
  loadPracticeHistory,
  loadStudentProfiles,
  recordPracticeQuestionAttempt,
  saveActiveOmrDraft,
  setActiveStudentProfileId,
} from '../utils/v3Storage';
import {playExamCompletionChime} from '../utils/soundEffects';
import {ExamPdfModal} from './ExamPdfModal';
import {OmrExamView} from './exam/OmrExamView';
import {PracticeModeView} from './exam/PracticeModeView';
import {ExamResultView} from './exam/ExamResultView';
import {ArchiveExamView} from './exam/ArchiveExamView';

interface ExamAttemptSummary {
  score: number;
  totalMarks: number;
  accuracy: number;
  timeTakenSeconds: number;
}

interface ExamHallSectionProps {
  initialSubjectId?: SubjectId;
  bestScores: Partial<Record<SubjectId, ExamAttemptSummary>>;
  onSaveAttempt: (subjectId: SubjectId, summary: ExamAttemptSummary) => void;
  onOpenChapterInTracker?: (subjectId: SubjectId, chapterId: string) => void;
  onActiveStudentChange?: (profileId: string) => void;
}

type ExamHallMode = 'omr_hall' | 'practice' | 'archive_sqp';

export function ExamHallSection({
  initialSubjectId = 'physics',
  bestScores,
  onSaveAttempt,
  onOpenChapterInTracker,
  onActiveStudentChange,
}: ExamHallSectionProps) {
  const [hallMode, setHallMode] = useState<ExamHallMode>('omr_hall');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(initialSubjectId);

  // Student Profiles (strict isolation of attempts, practice sheets & history)
  const [profiles, setProfiles] = useState<StudentProfile[]>(() => loadStudentProfiles());
  const [activeProfileId, setActiveProfileId] = useState<string>(() =>
    getActiveStudentProfileId(),
  );
  const [creatingProfile, setCreatingProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  // Attempt history & Practice history for active student
  const [studentAttempts, setStudentAttempts] = useState<ExamAttemptRecord[]>(() =>
    loadExamAttemptsForStudent(getActiveStudentProfileId()),
  );
  const [practiceHistory, setPracticeHistory] = useState<PracticeQuestionAttempt[]>(() =>
    loadPracticeHistory(getActiveStudentProfileId()),
  );

  // Live Active Exam State
  const [activeAttemptId, setActiveAttemptId] = useState<string | null>(null);
  const [activePaperId, setActivePaperId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [visitedIds, setVisitedIds] = useState<Record<string, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);

  // Completed Result State
  const [viewingResult, setViewingResult] = useState<ExamAttemptRecord | null>(null);

  // PDF Export Modal State
  const [pdfState, setPdfState] = useState<{
    open: boolean;
    mode: 'question_paper' | 'marking_scheme';
    paper: VerifiedExamPaper | null;
    attempt: ExamAttemptRecord | null;
    canViewScheme: boolean;
  }>({
    open: false,
    mode: 'question_paper',
    paper: null,
    attempt: null,
    canViewScheme: false,
  });

  useEffect(() => {
    setSelectedSubject(initialSubjectId);
  }, [initialSubjectId]);

  const activeProfile = useMemo(
    () => profiles.find((p) => p.id === activeProfileId) ?? profiles[0],
    [profiles, activeProfileId],
  );

  // Refresh per-profile attempts & resume draft if present when profile switches
  useEffect(() => {
    setStudentAttempts(loadExamAttemptsForStudent(activeProfileId));
    setPracticeHistory(loadPracticeHistory(activeProfileId));
    setViewingResult(null);

    const draft = loadActiveOmrDraft(activeProfileId);
    if (draft && !draft.isSubmitted && getVerifiedPaperById(draft.paperId)) {
      setActiveAttemptId(draft.attemptId);
      setActivePaperId(draft.paperId);
      setAnswers(draft.answers);
      setMarkedForReview(draft.markedForReview);
      setCurrentIndex(draft.currentIndex);
      setSecondsLeft(draft.secondsLeft);
      const qIds = getVerifiedPaperById(draft.paperId)?.questionIds ?? [];
      const firstId = qIds[draft.currentIndex];
      setVisitedIds(firstId ? {[firstId]: true} : {});
    } else {
      setActiveAttemptId(null);
      setActivePaperId(null);
      setAnswers({});
      setMarkedForReview({});
      setVisitedIds({});
      setCurrentIndex(0);
      setSecondsLeft(0);
    }
  }, [activeProfileId]);

  const approvedPapers = useMemo(
    () => getApprovedPapersForSubject(selectedSubject),
    [selectedSubject],
  );

  const activePaper = useMemo(
    () => (activePaperId ? getVerifiedPaperById(activePaperId) ?? null : null),
    [activePaperId],
  );

  const strippedActiveQuestions: ActiveExamQuestionView[] = useMemo(() => {
    if (!activePaper) return [];
    return stripAnswerKeysForActiveExam(activePaper, QUESTIONS_BY_ID);
  }, [activePaper]);

  const handleCompleteExamSubmission = () => {
    if (!activePaper || !activeAttemptId) return;
    const scheme = getMarkingSchemeForPaper(activePaper);
    if (!scheme) return;

    const gate = canPublishExamPaper(activePaper, scheme, QUESTIONS_BY_ID);
    if (!gate.allowed) return;

    const timeTakenSeconds = Math.max(0, activePaper.durationSeconds - secondsLeft);
    const result = evaluateOmrSubmission({
      attemptId: activeAttemptId,
      studentProfileId: activeProfileId,
      studentName: activeProfile.name,
      paper: activePaper,
      markingScheme: scheme,
      questionsById: QUESTIONS_BY_ID,
      studentAnswers: answers,
      markedForReview,
      timeTakenSeconds,
    });

    const updated = appendExamAttemptRecord(result);
    clearActiveOmrDraft(activeProfileId);
    playExamCompletionChime();

    setStudentAttempts(updated.filter((a) => a.studentProfileId === activeProfileId));
    setViewingResult(result);
    setActiveAttemptId(null);
    setActivePaperId(null);

    const subjectMax = result.maxMarks > 0 ? result.maxMarks : 1;
    const prevBest = bestScores[result.subjectId];
    if (!prevBest || result.totalScore >= prevBest.score) {
      onSaveAttempt(result.subjectId, {
        score: result.totalScore,
        totalMarks: subjectMax,
        accuracy: result.accuracyPercent,
        timeTakenSeconds: result.timeTakenSeconds,
      });
    }
  };

  // Live exam countdown timer
  useEffect(() => {
    if (!activeAttemptId || !activePaper) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activeAttemptId, activePaper]);

  // Auto-submit when timer expires
  useEffect(() => {
    if (activeAttemptId && activePaper && secondsLeft === 0) {
      handleCompleteExamSubmission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, activeAttemptId, activePaper]);

  // Persist active OMR draft cleanly per studentProfileId
  useEffect(() => {
    if (!activeAttemptId || !activePaper) return;
    saveActiveOmrDraft({
      attemptId: activeAttemptId,
      studentProfileId: activeProfileId,
      paperId: activePaper.id,
      paperVersion: activePaper.paperVersion,
      answers,
      markedForReview,
      currentIndex,
      secondsLeft,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSubmitted: false,
    });
  }, [
    activeAttemptId,
    activePaper,
    activeProfileId,
    answers,
    markedForReview,
    currentIndex,
    secondsLeft,
  ]);

  const handleLaunchPaper = (paper: VerifiedExamPaper) => {
    const scheme = getMarkingSchemeForPaper(paper);
    const gate = canPublishExamPaper(paper, scheme, QUESTIONS_BY_ID);
    if (!gate.allowed) return;

    const freshId = `att-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const firstQId = paper.questionIds[0];

    setViewingResult(null);
    setActiveAttemptId(freshId);
    setActivePaperId(paper.id);
    setAnswers({});
    setMarkedForReview({});
    setCurrentIndex(0);
    setSecondsLeft(paper.durationSeconds);
    setVisitedIds(firstQId ? {[firstQId]: true} : {});
  };

  const handleSwitchProfile = (profileId: string) => {
    setActiveStudentProfileId(profileId);
    setActiveProfileId(profileId);
    onActiveStudentChange?.(profileId);
  };

  const handleCreateProfile = () => {
    if (!newProfileName.trim()) return;
    const created = createStudentProfile(newProfileName);
    setProfiles(loadStudentProfiles());
    setActiveProfileId(created.id);
    onActiveStudentChange?.(created.id);
    setNewProfileName('');
    setCreatingProfile(false);
  };

  const handleRecordPractice = (entry: PracticeQuestionAttempt) => {
    const next = recordPracticeQuestionAttempt(activeProfileId, entry);
    setPracticeHistory(next);
  };

  // Active Timed OMR Exam View takes precedence inside Exam Hall
  if (hallMode === 'omr_hall' && activeAttemptId && activePaper) {
    return (
      <section aria-label="Active OMR Examination">
        <OmrExamView
          paper={activePaper}
          questions={strippedActiveQuestions}
          studentName={activeProfile.name}
          answers={answers}
          markedForReview={markedForReview}
          visitedIds={visitedIds}
          currentIndex={currentIndex}
          secondsLeft={secondsLeft}
          onSelectAnswer={(qId, optIdx) =>
            setAnswers((prev) => ({...prev, [qId]: optIdx}))
          }
          onClearAnswer={(qId) =>
            setAnswers((prev) => {
              const next = {...prev};
              delete next[qId];
              return next;
            })
          }
          onToggleMarkForReview={(qId) =>
            setMarkedForReview((prev) => ({...prev, [qId]: !prev[qId]}))
          }
          onNavigateIndex={(idx) => {
            setCurrentIndex(idx);
            const targetId = strippedActiveQuestions[idx]?.id;
            if (targetId) {
              setVisitedIds((prev) => ({...prev, [targetId]: true}));
            }
          }}
          onSubmitExam={handleCompleteExamSubmission}
          onExitExam={() => {
            setActiveAttemptId(null);
            setActivePaperId(null);
          }}
        />
      </section>
    );
  }

  return (
    <section aria-labelledby="exam-hall-heading" className="space-y-8">
      {/* Top Mode & Student Profile Control Panel */}
      <div className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-3 text-xs font-medium tracking-[0.12em] text-[#A64B33] dark:text-[#D4785E]">
              <span className="w-5 h-px bg-[#A64B33] dark:bg-[#D4785E] shrink-0" aria-hidden="true" />
              <span>Quadra 12 · Verified Local OMR, Practice Mode &amp; SQP Archive</span>
            </div>
            <h1
              id="exam-hall-heading"
              className="mt-2.5 text-2xl sm:text-3xl font-semibold tracking-tight text-[#1E1B18] dark:text-[#F5F2EB]"
            >
              Examination{' '}
              <em className="italic font-medium text-[#A64B33] dark:text-[#D4785E]">
                Hall
              </em>
            </h1>
            <p className="mt-2 text-sm text-[#575048] dark:text-[#CBC3B6] max-w-[68ch]">
              Attempt human-approved OMR Main Sheets with deterministic scoring, drill 720
              chapter-tagged PCMB questions in Practice Mode, or inspect the read-only 2026–27
              CBSE SQP Archive. Every submitted attempt unlocks full solutions, Study Libraries,
              Diagrams, and A4 PDFs—even at 0 marks.
            </p>
          </div>

          {/* Active Student Profile Selector */}
          <div className="p-3.5 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] space-y-2.5 shrink-0 min-w-[260px]">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 font-medium text-[#575048] dark:text-[#CBC3B6]">
                <Users className="w-3.5 h-3.5 text-[#A64B33] dark:text-[#D4785E]" />
                <span>Active Student Profile</span>
              </span>
              <button
                type="button"
                onClick={() => setCreatingProfile((prev) => !prev)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#A64B33] dark:text-[#D4785E] hover:underline"
              >
                <UserPlus className="w-3 h-3" />
                <span>New Profile</span>
              </button>
            </div>

            <select
              value={activeProfileId}
              aria-label="Select Student Profile"
              onChange={(e) => handleSwitchProfile(e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] text-[#1E1B18] dark:text-[#F5F2EB]"
            >
              {profiles.map((prof) => (
                <option key={prof.id} value={prof.id}>
                  {prof.name}
                </option>
              ))}
            </select>

            {creatingProfile && (
              <div className="flex items-center gap-1.5 pt-1">
                <input
                  type="text"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="Student name..."
                  className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] text-[#1E1B18] dark:text-[#F5F2EB]"
                />
                <button
                  type="button"
                  onClick={handleCreateProfile}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18]"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3 Mode Switcher Tabs + Author Governance Toggle */}
        <div className="pt-4 border-t border-[#DDD6C7] dark:border-[#332E28] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setHallMode('omr_hall')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-colors ${
                hallMode === 'omr_hall'
                  ? 'bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] border-[#1E1B18] dark:border-[#F5F2EB]'
                  : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6]'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Timed OMR Examination Hall</span>
            </button>

            <button
              type="button"
              onClick={() => setHallMode('practice')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-colors ${
                hallMode === 'practice'
                  ? 'bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] border-[#1E1B18] dark:border-[#F5F2EB]'
                  : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Practice Mode (720 Qs)</span>
            </button>

            <button
              type="button"
              onClick={() => setHallMode('archive_sqp')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-colors ${
                hallMode === 'archive_sqp'
                  ? 'bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] border-[#1E1B18] dark:border-[#F5F2EB]'
                  : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6]'
              }`}
            >
              <Archive className="w-4 h-4" />
              <span>2026–27 SQP Archive (View-Only)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Timed OMR Exam Hall (Result or Lobby) */}
      {hallMode === 'omr_hall' && (
        <>
          {viewingResult ? (
            <ExamResultView
              attempt={viewingResult}
              onExportPracticePdf={(att) =>
                setPdfState({
                  open: true,
                  mode: 'question_paper',
                  paper: getVerifiedPaperById(att.paperId) ?? null,
                  attempt: att,
                  canViewScheme: true,
                })
              }
              onExportMarkingSchemePdf={(att) =>
                setPdfState({
                  open: true,
                  mode: 'marking_scheme',
                  paper: getVerifiedPaperById(att.paperId) ?? null,
                  attempt: att,
                  canViewScheme: true,
                })
              }
              onOpenChapterInTracker={(subId, chId) =>
                onOpenChapterInTracker?.(subId, chId)
              }
              onRetakeOrNewExam={() => setViewingResult(null)}
            />
          ) : (
            <div className="space-y-6">
              {/* Subject Selector Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {SUBJECTS.map((sub) => {
                  const isActive = sub.id === selectedSubject;
                  const best = bestScores[sub.id];
                  const subCount = getApprovedPapersForSubject(sub.id).length;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSelectedSubject(sub.id)}
                      className={`flex flex-col justify-center text-left p-3 sm:p-4 rounded-xl border transition-colors ${
                        isActive
                          ? 'bg-[#ECE6D9] dark:bg-[#28231F] border-[#A64B33] dark:border-[#D4785E]'
                          : 'bg-[#FAF8F3] dark:bg-[#1E1B18] border-[#DDD6C7] dark:border-[#332E28]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5 sm:gap-2 min-w-0">
                        <span className="text-[13px] sm:text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB] whitespace-nowrap">
                          {sub.name}
                        </span>
                        <span className="text-[11px] sm:text-xs font-mono text-[#787066] dark:text-[#9C9387] whitespace-nowrap shrink-0 tabular-nums">
                          {subCount} Papers
                        </span>
                      </div>
                      {best && (
                        <p className="mt-1 text-xs font-mono text-[#787066] dark:text-[#9C9387] tabular-nums">
                          Best: {best.score}/{best.totalMarks}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Approved Exam Hall Main Sheets for Active Subject */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {approvedPapers.map((paper) => (
                  <article
                    key={paper.id}
                    className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-6 flex flex-col justify-between gap-5"
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                        <span className="inline-flex items-center gap-1 text-[#3D6B4F] dark:text-[#7AB88F] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>{paper.publicationStatus} · Human Approved</span>
                        </span>
                        <span className="text-[#787066] dark:text-[#9C9387] tabular-nums">
                          +{paper.positiveMarks} /{' '}
                          {paper.negativeMarks > 0 ? `-${paper.negativeMarks}` : '0'} ·{' '}
                          {Math.round(paper.durationSeconds / 60)} mins
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                          {paper.title}
                        </h3>
                        <p className="mt-1 text-xs text-[#575048] dark:text-[#CBC3B6]">
                          {paper.subtitle}
                        </p>
                      </div>

                      <ul className="space-y-1 text-xs text-[#575048] dark:text-[#CBC3B6] list-disc list-inside">
                        {paper.instructions.slice(0, 2).map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-[#DDD6C7] dark:border-[#332E28] flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-[#787066] dark:text-[#9C9387] font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{paper.questionIds.length} OMR Questions</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setPdfState({
                              open: true,
                              mode: 'question_paper',
                              paper,
                              attempt: null,
                              canViewScheme: false,
                            })
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB]"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Main Sheet PDF</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleLaunchPaper(paper)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-[#A64B33] hover:bg-[#8E3F2B] dark:bg-[#D4785E] dark:text-[#161412] text-white transition-colors"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Start OMR Exam</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Isolated Student Attempt History */}
              <div className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-[#A64B33] dark:text-[#D4785E]" />
                    <h3 className="text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                      Submitted Attempts — {activeProfile.name}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-[#787066] dark:text-[#9C9387] tabular-nums">
                    {studentAttempts.length} Stored Attempts (Isolated Profile)
                  </span>
                </div>

                {studentAttempts.length === 0 ? (
                  <p className="text-xs sm:text-sm text-[#575048] dark:text-[#CBC3B6] py-3">
                    No OMR exam attempts recorded under {activeProfile.name} yet. Start any approved paper above to save an immutable Practice Sheet snapshot and full breakdown.
                  </p>
                ) : (
                  <div className="divide-y divide-[#DDD6C7] dark:divide-[#332E28]">
                    {studentAttempts.map((att) => (
                      <div
                        key={att.attemptId}
                        className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-[#1E1B18] dark:text-[#F5F2EB]">
                            {att.paperTitle}
                          </p>
                          <p className="text-xs font-mono text-[#787066] dark:text-[#9C9387] tabular-nums">
                            {new Date(att.submittedAt).toLocaleString()} · Score:{' '}
                            {att.totalScore}/{att.maxMarks} ({att.accuracyPercent}%) ·{' '}
                            {att.practiceSheet.snapshotId}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              setPdfState({
                                open: true,
                                mode: 'question_paper',
                                paper: getVerifiedPaperById(att.paperId) ?? null,
                                attempt: att,
                                canViewScheme: true,
                              })
                            }
                            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB]"
                          >
                            Practice Sheet PDF
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setPdfState({
                                open: true,
                                mode: 'marking_scheme',
                                paper: getVerifiedPaperById(att.paperId) ?? null,
                                attempt: att,
                                canViewScheme: true,
                              })
                            }
                            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#3D6B4F] bg-[#E8F0EA] dark:bg-[#1C2E22] text-[#23422F] dark:text-[#B6DFC3]"
                          >
                            Marking Scheme PDF
                          </button>
                          <button
                            type="button"
                            onClick={() => setViewingResult(att)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18]"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Inspect Result</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Mode 2: Practice Mode (All 720 Verified Questions) */}
      {hallMode === 'practice' && (
        <PracticeModeView
          subjectId={selectedSubject}
          onSelectSubject={setSelectedSubject}
          studentName={activeProfile.name}
          practiceHistory={practiceHistory}
          onRecordPracticeAttempt={handleRecordPractice}
          onOpenChapterInTracker={(subId, chId) =>
            onOpenChapterInTracker?.(subId, chId)
          }
        />
      )}

      {/* Mode 3: 2026-27 Legacy SQP Archive (Strictly View-Only) */}
      {hallMode === 'archive_sqp' && (
        <ArchiveExamView initialSubjectId={selectedSubject} />
      )}

      {/* Unified A4 PDF Exporter Modal */}
      <ExamPdfModal
        isOpen={pdfState.open}
        subjectId={pdfState.attempt?.subjectId ?? pdfState.paper?.subjectId ?? selectedSubject}
        mode={pdfState.mode}
        canViewMarkingScheme={pdfState.canViewScheme}
        v3Attempt={pdfState.attempt}
        v3Paper={pdfState.paper}
        onClose={() => setPdfState((prev) => ({...prev, open: false}))}
        onSwitchMode={(newMode) =>
          setPdfState((prev) => ({...prev, mode: newMode}))
        }
      />
    </section>
  );
}
