import {useEffect, useMemo, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  Box,
  Check,
  CheckCircle2,
  Circle,
  FileText,
  FlaskConical,
  Layers,
  Maximize2,
  Printer,
  RotateCcw,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import {
  ChapterItem,
  ChapterTaskState,
  STUDY_STAGES,
  SUBJECTS,
  StudyStageKey,
  SubjectId,
} from '../data/pcmbData';
import type {
  ChapterDerivationItem,
  ChapterStudyBundle,
  ChapterStudyStatus,
} from '../data/v3Types';
import {getChapterStudyBundle} from '../data/studySheets';
import {getDiagramMetadata} from '../data/v3Diagrams';
import {getQuestionsForChapter} from '../data/questionBank';
import {
  getActiveStudentProfileId,
  loadChapterStudyStatusMap,
  loadExamAttemptsForStudent,
  setChapterStudyStatus,
} from '../utils/v3Storage';
import {ResilientImage} from './ResilientImage';
import {ChapterIllustration} from './ChapterIllustrations';
import {ExamDiagram} from './ExamDiagrams';
import {APPLE_EASE, APPLE_SPRING, AnimatedNumber} from './FluidPrimitives';

interface SubjectTrackerSectionProps {
  selectedSubjectId?: SubjectId;
  initialChapterId?: string | null;
  onSelectSubject?: (subjectId: SubjectId) => void;
  completedChapters: Record<string, boolean>;
  chapterTasks: Record<string, ChapterTaskState>;
  onToggleChapter: (chapterId: string) => void;
  onToggleChapterTask: (chapterId: string, stage: StudyStageKey) => void;
  onToggleSubjectStage: (subjectId: SubjectId, stage: StudyStageKey) => void;
  onMarkSubjectComplete: (subjectId: SubjectId) => void;
  onResetSubject: (subjectId: SubjectId) => void;
  onEnterExamHallForSubject: (subjectId: SubjectId) => void;
  onOpenThreeLab?: (sceneId: SubjectId) => void;
}

const CHAPTER_STUDY_STATUS_OPTIONS: ChapterStudyStatus[] = [
  'Not Started',
  'In Progress',
  'Reviewed',
  'Completed',
];

function getBundleDerivations(bundle?: ChapterStudyBundle): ChapterDerivationItem[] {
  if (!bundle) return [];
  return [
    ...(bundle.physicsDerivations ?? []),
    ...(bundle.mathsDerivations ?? []),
    ...(bundle.chemistryDerivations ?? []),
  ];
}

function getBundleFormulaCount(bundle?: ChapterStudyBundle): number {
  if (!bundle) return 0;
  return (
    (bundle.physicsFormulas?.length ?? 0) +
    (bundle.mathsFormulas?.length ?? 0) +
    (bundle.mathsMethods?.length ?? 0) +
    (bundle.chemistryItems?.length ?? 0) +
    (bundle.biologyItems?.length ?? 0)
  );
}

export function SubjectTrackerSection({
  selectedSubjectId,
  initialChapterId = null,
  onSelectSubject,
  completedChapters,
  chapterTasks,
  onToggleChapter,
  onToggleChapterTask,
  onToggleSubjectStage,
  onMarkSubjectComplete,
  onResetSubject,
  onEnterExamHallForSubject,
  onOpenThreeLab,
}: SubjectTrackerSectionProps) {
  const [activeSubjectId, setActiveSubjectId] = useState<SubjectId>(
    selectedSubjectId ?? 'physics',
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [previewChapter, setPreviewChapter] = useState<ChapterItem | null>(null);
  const [studyDrawerChapter, setStudyDrawerChapter] = useState<ChapterItem | null>(null);
  const [drawerTab, setDrawerTab] = useState<
    'formulas' | 'derivations' | 'diagrams' | 'questions'
  >('formulas');
  const [showSubjectSheetModal, setShowSubjectSheetModal] = useState(false);
  const [sheetChapterFilter, setSheetChapterFilter] = useState<string>('all');
  const [sheetFocusSection, setSheetFocusSection] = useState<
    'all' | 'formulas' | 'derivations' | 'diagrams'
  >('all');
  const [showSolutionMap, setShowSolutionMap] = useState<Record<string, boolean>>({});
  const [activeProfileId] = useState<string>(() => getActiveStudentProfileId());
  const [studyStatusMap, setStudyStatusMap] = useState<Record<string, ChapterStudyStatus>>(
    () => loadChapterStudyStatusMap(getActiveStudentProfileId()),
  );

  useEffect(() => {
    if (selectedSubjectId) {
      setActiveSubjectId(selectedSubjectId);
      setSheetChapterFilter('all');
    }
  }, [selectedSubjectId]);

  useEffect(() => {
    if (!initialChapterId) return;
    const ownerSubject = SUBJECTS.find((s) =>
      s.chapters.some((c) => c.id === initialChapterId),
    );
    const ch = ownerSubject?.chapters.find((c) => c.id === initialChapterId);
    if (ownerSubject && ch) {
      setActiveSubjectId(ownerSubject.id);
      setStudyDrawerChapter(ch);
      setDrawerTab('formulas');
    }
  }, [initialChapterId]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewChapter(null);
        setStudyDrawerChapter(null);
        setShowSubjectSheetModal(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const activeSubject =
    SUBJECTS.find((s) => s.id === activeSubjectId) ?? SUBJECTS[0];

  const getSubjectStats = (subjectId: SubjectId) => {
    const subject = SUBJECTS.find((s) => s.id === subjectId)!;
    const total = subject.chapters.length;
    const done = subject.chapters.filter((ch) => completedChapters[ch.id]).length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    const isCompleted = total > 0 && done === total;
    const totalMarksCovered = subject.chapters
      .filter((ch) => completedChapters[ch.id])
      .reduce((acc, ch) => acc + ch.marksWeightage, 0);
    const totalMarks = subject.chapters.reduce(
      (acc, ch) => acc + ch.marksWeightage,
      0,
    );
    return {total, done, percent, isCompleted, totalMarksCovered, totalMarks};
  };

  const activeStats = getSubjectStats(activeSubject.id);

  const filteredChapters = activeSubject.chapters.filter((ch) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      ch.title.toLowerCase().includes(q) ||
      ch.unit.toLowerCase().includes(q) ||
      ch.number.includes(q)
    );
  });

  const totalAllChapters = SUBJECTS.reduce((sum, s) => sum + s.chapters.length, 0);
  const doneAllChapters = SUBJECTS.reduce(
    (sum, s) => sum + s.chapters.filter((ch) => completedChapters[ch.id]).length,
    0,
  );
  const overallPercent = Math.round((doneAllChapters / totalAllChapters) * 100);
  const completedSubjectsCount = SUBJECTS.filter(
    (s) => getSubjectStats(s.id).isCompleted,
  ).length;

  const activeStudyBundle = useMemo(
    () => (studyDrawerChapter ? getChapterStudyBundle(studyDrawerChapter.id) : undefined),
    [studyDrawerChapter],
  );

  const activeBundleDerivations = useMemo(
    () => getBundleDerivations(activeStudyBundle),
    [activeStudyBundle],
  );

  const activeBundleFormulaCount = useMemo(
    () => getBundleFormulaCount(activeStudyBundle),
    [activeStudyBundle],
  );

  const subjectSheetEntries = useMemo(
    () =>
      activeSubject.chapters
        .filter((ch) => sheetChapterFilter === 'all' || ch.id === sheetChapterFilter)
        .map((chapter) => ({
          chapter,
          bundle: getChapterStudyBundle(chapter.id),
        })),
    [activeSubject, sheetChapterFilter],
  );

  const activeChapterQuestions = useMemo(
    () =>
      studyDrawerChapter
        ? getQuestionsForChapter(activeSubject.id, studyDrawerChapter.id)
        : [],
    [activeSubject.id, studyDrawerChapter],
  );

  const pastAttemptsForSubject = useMemo(
    () =>
      loadExamAttemptsForStudent(activeProfileId).filter(
        (att) => att.subjectId === activeSubject.id,
      ),
    [activeProfileId, activeSubject.id],
  );

  const handleExplicitStudyStatusChange = (
    chapterId: string,
    status: ChapterStudyStatus,
  ) => {
    const updated = setChapterStudyStatus(activeProfileId, chapterId, status);
    setStudyStatusMap(updated);
  };

  return (
    <section aria-labelledby="tracker-heading" className="space-y-8">
      {/* Header & Overall PCMB Progress Summary */}
      <div className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-6 sm:p-8 apple-surface">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 text-xs font-medium tracking-[0.12em] text-[#A64B33] dark:text-[#D4785E]">
              <span className="w-5 h-px bg-[#A64B33] dark:bg-[#D4785E] shrink-0" aria-hidden="true" />
              <span>CBSE Class 12 Syllabus · Study Library, Diagrams &amp; Chapter Matrix</span>
            </div>
            <h1
              id="tracker-heading"
              className="mt-2.5 text-2xl sm:text-3xl font-semibold tracking-tight text-[#1E1B18] dark:text-[#F5F2EB]"
            >
              PCMB Subject{' '}
              <em className="italic font-medium text-[#A64B33] dark:text-[#D4785E]">
                Tracker
              </em>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#575048] dark:text-[#CBC3B6] max-w-[65ch]">
              Check off completed chapters, inspect dedicated NCERT Formula, Derivation,
              Reaction, Genetics &amp; Method sheets anytime (without auto-completing
              chapters), and review past attempts directly per chapter.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#DDD6C7] dark:border-[#332E28]">
            <div>
              <p className="text-xs text-[#787066] dark:text-[#9C9387]">Overall PCMB</p>
              <p className="mt-1 text-2xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB] font-mono tabular-nums">
                <AnimatedNumber value={overallPercent} suffix="%" />
              </p>
            </div>
            <div>
              <p className="text-xs text-[#787066] dark:text-[#9C9387]">Chapters Done</p>
              <p className="mt-1 text-2xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB] font-mono tabular-nums">
                <AnimatedNumber value={doneAllChapters} />/{totalAllChapters}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#787066] dark:text-[#9C9387]">Subjects Completed</p>
              <p className="mt-1 text-2xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB] font-mono tabular-nums">
                <AnimatedNumber value={completedSubjectsCount} />/4
              </p>
            </div>
          </div>
        </div>

        {/* 4 Subject Progress Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SUBJECTS.map((subject, idx) => {
            const stats = getSubjectStats(subject.id);
            const isSelected = subject.id === activeSubjectId;
            return (
              <motion.button
                key={subject.id}
                type="button"
                initial={{opacity: 0, y: 16}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, amount: 0.08}}
                whileHover={{y: -3}}
                whileTap={{scale: 0.98}}
                transition={{
                  duration: 0.38,
                  delay: idx * 0.05,
                  ease: APPLE_EASE,
                  y: APPLE_SPRING,
                }}
                onClick={() => {
                  setActiveSubjectId(subject.id);
                  setSearchQuery('');
                  onSelectSubject?.(subject.id);
                }}
                aria-pressed={isSelected}
                className={`relative text-left p-4 rounded-xl border transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A64B33] ${
                  isSelected
                    ? 'bg-[#ECE6D9] dark:bg-[#28231F] border-[#A64B33] dark:border-[#D4785E]'
                    : 'bg-[#F5F2EB] dark:bg-[#161412] border-[#DDD6C7] dark:border-[#332E28] hover:border-[#B8AF9F] dark:hover:border-[#4A423A]'
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="tracker-active-subject-accent"
                    transition={APPLE_SPRING}
                    className="absolute inset-x-4 top-0 h-[2px] rounded-b-full bg-[#A64B33] dark:bg-[#D4785E]"
                  />
                )}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB]"
                    style={{fontFamily: 'var(--font-display)'}}
                  >
                    {subject.name}
                  </span>
                  {stats.isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#3D6B4F] dark:text-[#7AB88F]">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>Completed</span>
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-[#787066] dark:text-[#9C9387] tabular-nums">
                      {stats.done}/{stats.total}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs text-[#787066] dark:text-[#9C9387] font-mono tabular-nums">
                  Code {subject.code} · {stats.percent}%
                </p>

                <div
                  className="mt-3 h-1.5 w-full bg-[#DDD6C7] dark:bg-[#332E28] rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={stats.percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${subject.name} completion progress`}
                >
                  <motion.div
                    initial={false}
                    animate={{scaleX: stats.percent / 100}}
                    transition={{type: 'spring', stiffness: 125, damping: 21}}
                    className={`h-full w-full origin-left rounded-full ${
                      stats.isCompleted
                        ? 'bg-[#3D6B4F] dark:bg-[#7AB88F] progress-shimmer'
                        : 'bg-[#A64B33] dark:bg-[#D4785E]'
                    }`}
                  />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Subject Overview Plate & Progress Banner */}
      <div className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl overflow-hidden transition-colors duration-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-[#DDD6C7] dark:border-[#332E28] bg-[#ECE6D9] dark:bg-[#24201C]">
            <ResilientImage
              src={activeSubject.imageUrl}
              alt={activeSubject.imageAlt}
              fallbackTitle={`${activeSubject.name} Overview Plate`}
              className="w-full aspect-[16/9] lg:h-full object-cover"
            />
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#787066] dark:text-[#9C9387]">
                <span>Subject Code {activeSubject.code}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">
                  {activeSubject.chapters.length} Chapters &amp; Study Libraries
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">
                  Theory {activeSubject.boardTheoryMarks}M + Practical{' '}
                  {activeSubject.practicalMarks}M
                </span>
                <span aria-hidden="true">·</span>
                {activeStats.isCompleted ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-[#3D6B4F] dark:text-[#7AB88F]">
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Section Completed</span>
                  </span>
                ) : (
                  <span>In Progress</span>
                )}
              </div>

              <h2 className="mt-2.5 text-2xl font-semibold tracking-tight text-[#1E1B18] dark:text-[#F5F2EB]">
                {activeSubject.name} Overview &amp; Study Library
              </h2>

              <div className="mt-4 max-w-xl">
                <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                  <span className="text-[#575048] dark:text-[#CBC3B6]">
                    {activeStats.isCompleted
                      ? `All ${activeStats.total} chapters completed`
                      : `${activeStats.done} of ${activeStats.total} chapters completed`}
                  </span>
                  <span
                    className={`font-mono tabular-nums font-semibold ${
                      activeStats.isCompleted
                        ? 'text-[#3D6B4F] dark:text-[#7AB88F]'
                        : 'text-[#A64B33] dark:text-[#D4785E]'
                    }`}
                  >
                    <AnimatedNumber value={activeStats.percent} suffix="%" />
                  </span>
                </div>
                <div className="h-2 w-full bg-[#E5DFD2] dark:bg-[#2E2924] rounded-full overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{scaleX: activeStats.percent / 100}}
                    transition={{type: 'spring', stiffness: 125, damping: 21}}
                    className={`h-full w-full origin-left rounded-full ${
                      activeStats.isCompleted
                        ? 'bg-[#3D6B4F] dark:bg-[#7AB88F] progress-shimmer'
                        : 'bg-[#A64B33] dark:bg-[#D4785E]'
                    }`}
                  />
                </div>
                <p className="mt-2 text-xs text-[#787066] dark:text-[#9C9387] font-mono tabular-nums">
                  Board Weightage Covered: {activeStats.totalMarksCovered} /{' '}
                  {activeStats.totalMarks} Marks · Past Subject Attempts:{' '}
                  {pastAttemptsForSubject.length}
                </p>
              </div>

              {/* Subject-Level 4 Done Boxes */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {STUDY_STAGES.map((stage) => {
                  const stageDoneCount = activeSubject.chapters.filter((ch) =>
                    Boolean(chapterTasks[ch.id]?.[stage.key]),
                  ).length;
                  const allStageDone =
                    activeStats.total > 0 && stageDoneCount === activeStats.total;
                  const partialStageDone =
                    stageDoneCount > 0 && stageDoneCount < activeStats.total;

                  return (
                    <motion.button
                      key={stage.key}
                      type="button"
                      role="checkbox"
                      aria-checked={allStageDone}
                      whileTap={{scale: 0.96}}
                      transition={APPLE_SPRING}
                      onClick={() =>
                        onToggleSubjectStage(activeSubject.id, stage.key)
                      }
                      className={`flex flex-col justify-between gap-1.5 p-3 rounded-lg border text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A64B33] ${
                        allStageDone
                          ? 'bg-[#E8F0EA] dark:bg-[#1C2E22] border-[#3D6B4F] dark:border-[#7AB88F] text-[#23422F] dark:text-[#B6DFC3]'
                          : 'bg-[#F5F2EB] dark:bg-[#161412] border-[#DDD6C7] dark:border-[#332E28] text-[#1E1B18] dark:text-[#F5F2EB] hover:border-[#B8AF9F] dark:hover:border-[#4A423A]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 w-full">
                        <span
                          aria-hidden="true"
                          className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${
                            allStageDone
                              ? 'bg-[#3D6B4F] dark:bg-[#7AB88F] border-[#3D6B4F] dark:border-[#7AB88F] text-[#F5F2EB] dark:text-[#161412]'
                              : partialStageDone
                                ? 'border-[#A64B33] dark:border-[#D4785E] bg-[#A64B33]/10 dark:bg-[#D4785E]/15'
                                : 'border-[#B8AF9F] dark:border-[#575048] bg-[#FAF8F3] dark:bg-[#1E1B18]'
                          }`}
                        >
                          {allStageDone ? (
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          ) : partialStageDone ? (
                            <span className="w-2 h-0.5 bg-[#A64B33] dark:bg-[#D4785E] rounded-xs" />
                          ) : null}
                        </span>
                        <span className="text-[11px] font-mono tabular-nums text-[#787066] dark:text-[#9C9387]">
                          {stageDoneCount}/{activeStats.total}
                        </span>
                      </div>
                      <span className="text-xs font-medium">{stage.doneLabel}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence>
              {activeStats.isCompleted && (
                <motion.div
                  initial={{opacity: 0, y: -8, scale: 0.98}}
                  animate={{opacity: 1, y: 0, scale: 1}}
                  exit={{opacity: 0, y: -6, scale: 0.98}}
                  transition={{duration: 0.24, ease: [0.16, 1, 0.3, 1]}}
                  className="p-4 rounded-lg bg-[#E8F0EA] dark:bg-[#1C2E22] border border-[#B8D0BF] dark:border-[#2F4D39] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      className="w-5 h-5 text-[#3D6B4F] dark:text-[#7AB88F] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#23422F] dark:text-[#B6DFC3]">
                        {activeSubject.name} Progress Completed (100%)
                      </p>
                      <p className="text-xs text-[#315940] dark:text-[#8FC4A1] mt-0.5">
                        All {activeStats.total} chapters finished. Launch a timed OMR mock paper in Examination Hall.
                      </p>
                    </div>
                  </div>
                  <motion.button
                    type="button"
                    whileTap={{scale: 0.97}}
                    onClick={() => onEnterExamHallForSubject(activeSubject.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#F5F2EB] bg-[#3D6B4F] hover:bg-[#315940] rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>Attempt OMR Paper</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <p className="text-xs text-[#787066] dark:text-[#9C9387]">
                Click Study Library on any chapter for formula sheets, derivations, diagrams &amp; practice solutions
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <motion.button
                  type="button"
                  whileTap={{scale: 0.97}}
                  onClick={() => {
                    setSheetChapterFilter('all');
                    setSheetFocusSection('all');
                    setShowSubjectSheetModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[#3D6B4F]/45 dark:border-[#7AB88F]/45 bg-[#E8F0EA] dark:bg-[#1C2E22] text-[#23422F] dark:text-[#B6DFC3] hover:bg-[#3D6B4F] hover:text-[#F5F2EB] dark:hover:bg-[#7AB88F] dark:hover:text-[#161412] transition-colors whitespace-nowrap"
                >
                  <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Formula, Derivation &amp; Diagram Sheet</span>
                </motion.button>
                {onOpenThreeLab && (
                  <motion.button
                    type="button"
                    whileTap={{scale: 0.97}}
                    onClick={() => onOpenThreeLab(activeSubject.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[#A64B33]/50 dark:border-[#D4785E]/50 bg-[#F7EBE7] dark:bg-[#2F1D19] text-[#A64B33] dark:text-[#D4785E] hover:bg-[#A64B33] hover:text-[#FAF8F3] dark:hover:bg-[#D4785E] dark:hover:text-[#161412] transition-colors whitespace-nowrap"
                  >
                    <Box className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>3D Lab Model</span>
                  </motion.button>
                )}
                <motion.button
                  type="button"
                  whileTap={{scale: 0.97}}
                  onClick={() => onEnterExamHallForSubject(activeSubject.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB] whitespace-nowrap"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Examination Hall</span>
                </motion.button>
                {!activeStats.isCompleted ? (
                  <motion.button
                    type="button"
                    whileTap={{scale: 0.97}}
                    onClick={() => onMarkSubjectComplete(activeSubject.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#F5F2EB] dark:text-[#1E1B18] bg-[#1E1B18] hover:bg-[#332E28] dark:bg-[#F5F2EB] dark:hover:bg-[#E8E2D5] rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Mark All Complete</span>
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    whileTap={{scale: 0.97}}
                    onClick={() => onResetSubject(activeSubject.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#575048] dark:text-[#CBC3B6] bg-[#F5F2EB] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB] rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Reset Subject</span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Checklist Card */}
      <div className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl overflow-hidden transition-colors duration-200">
        <div className="px-6 py-5 border-b border-[#DDD6C7] dark:border-[#332E28] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1E1B18] dark:text-[#F5F2EB]">
              {activeSubject.name} Chapter Checklist &amp; Study Sheets
            </h2>
            <p className="mt-1 text-xs text-[#787066] dark:text-[#9C9387]">
              {activeSubject.chapters.length} NCERT chapters · Opening study sheets never marks a chapter complete automatically
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              className="w-4 h-4 text-[#787066] dark:text-[#9C9387] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeSubject.name} chapters or units...`}
              aria-label={`Search ${activeSubject.name} chapters`}
              className="w-full pl-9 pr-3.5 py-2 text-sm bg-[#F5F2EB] dark:bg-[#161412] border border-[#DDD6C7] dark:border-[#332E28] rounded-lg text-[#1E1B18] dark:text-[#F5F2EB] placeholder:text-[#968E83] dark:placeholder:text-[#787066] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#A64B33]"
            />
          </div>
        </div>

        {filteredChapters.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm font-medium text-[#1E1B18] dark:text-[#F5F2EB]">
              No chapters match &ldquo;{searchQuery}&rdquo;
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-3 px-4 py-2 text-xs font-medium text-[#A64B33] dark:text-[#D4785E] hover:underline"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#DDD6C7] dark:divide-[#332E28]">
            {filteredChapters.map((chapter) => {
              const isDone = Boolean(completedChapters[chapter.id]);
              const explicitStudyStatus: ChapterStudyStatus =
                studyStatusMap[chapter.id] ?? (isDone ? 'Completed' : 'Not Started');
              const bundle = getChapterStudyBundle(chapter.id);
              const chapterQCount = getQuestionsForChapter(
                activeSubject.id,
                chapter.id,
              ).length;

              return (
                <motion.div
                  key={chapter.id}
                  initial={{opacity: 0, y: 12}}
                  whileInView={{opacity: 1, y: 0}}
                  viewport={{once: true, amount: 0.04}}
                  transition={{duration: 0.28, ease: APPLE_EASE}}
                  className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-5 sm:px-6 py-4 transition-colors duration-150 ${
                    isDone
                      ? 'bg-[#F5F2EB]/70 dark:bg-[#24201C]/60'
                      : 'bg-[#FAF8F3] dark:bg-[#1E1B18] hover:bg-[#F5F2EB] dark:hover:bg-[#24201C]/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => setPreviewChapter(chapter)}
                      aria-label={`Inspect illustration for Chapter ${chapter.number}: ${chapter.title}`}
                      className="group relative w-full sm:w-44 aspect-[16/9] rounded-lg overflow-hidden border border-[#DDD6C7] dark:border-[#332E28] bg-[#ECE6D9] dark:bg-[#24201C] shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A64B33]"
                    >
                      <ChapterIllustration chapterId={chapter.id} />
                      <span
                        aria-hidden="true"
                        className="absolute bottom-1.5 right-1.5 inline-flex items-center justify-center w-6 h-6 rounded-md bg-[#FAF8F3]/90 dark:bg-[#1E1B18]/90 border border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6] opacity-75 group-hover:opacity-100 transition-opacity"
                      >
                        <Maximize2 className="w-3 h-3" />
                      </span>
                    </button>

                    <div className="flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() => onToggleChapter(chapter.id)}
                        aria-pressed={isDone}
                        className="flex items-start sm:items-center gap-3.5 text-left w-full min-w-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A64B33]"
                      >
                        <span className="mt-0.5 sm:mt-0 shrink-0">
                          {isDone ? (
                            <CheckCircle2
                              className="w-5 h-5 text-[#3D6B4F] dark:text-[#7AB88F]"
                              aria-hidden="true"
                            />
                          ) : (
                            <Circle
                              className="w-5 h-5 text-[#A8A095] dark:text-[#787066]"
                              aria-hidden="true"
                            />
                          )}
                        </span>

                        <div className="min-w-0">
                          <p
                            className={`text-sm sm:text-base font-medium ${
                              isDone
                                ? 'text-[#787066] dark:text-[#9C9387] line-through'
                                : 'text-[#1E1B18] dark:text-[#F5F2EB]'
                            }`}
                          >
                            <span className="font-mono text-xs text-[#787066] dark:text-[#9C9387] mr-2.5 tabular-nums">
                              Ch {chapter.number}
                            </span>
                            {chapter.title}
                          </p>
                          <p className="mt-0.5 text-xs text-[#787066] dark:text-[#9C9387]">
                            {chapter.unit}
                            <span aria-hidden="true"> · </span>
                            <span className="font-mono tabular-nums">
                              ~{chapter.marksWeightage} Marks
                            </span>
                            <span aria-hidden="true"> · </span>
                            <span className="font-mono tabular-nums">
                              {chapterQCount} Verified Qs
                            </span>
                          </p>
                        </div>
                      </button>

                      {/* 4 Stage Checkboxes */}
                      <div className="mt-3 sm:pl-8.5 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
                        {STUDY_STAGES.map((stage) => {
                          const stageDone = Boolean(chapterTasks[chapter.id]?.[stage.key]);
                          return (
                            <motion.button
                              key={stage.key}
                              type="button"
                              role="checkbox"
                              aria-checked={stageDone}
                              whileTap={{scale: 0.94}}
                              transition={APPLE_SPRING}
                              onClick={() => onToggleChapterTask(chapter.id, stage.key)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A64B33] ${
                                stageDone
                                  ? 'bg-[#E8F0EA] dark:bg-[#1C2E22] border-[#3D6B4F] dark:border-[#7AB88F] text-[#23422F] dark:text-[#B6DFC3]'
                                  : 'bg-[#FAF8F3] dark:bg-[#161412] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6] hover:border-[#B8AF9F] dark:hover:border-[#4A423A]'
                              }`}
                            >
                              <span
                                aria-hidden="true"
                                className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center shrink-0 transition-colors ${
                                  stageDone
                                    ? 'bg-[#3D6B4F] dark:bg-[#7AB88F] border-[#3D6B4F] dark:border-[#7AB88F] text-[#F5F2EB] dark:text-[#161412]'
                                    : 'border-[#B8AF9F] dark:border-[#575048] bg-[#F5F2EB] dark:bg-[#1E1B18]'
                                }`}
                              >
                                {stageDone && <Check className="w-2.5 h-2.5 stroke-[2.75]" />}
                              </span>
                              <span>{stage.doneLabel}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: Study Library Drawer + Explicit Study Status + Done Toggle */}
                  <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2.5 shrink-0">
                    {bundle && (
                      <button
                        type="button"
                        onClick={() => {
                          setStudyDrawerChapter(chapter);
                          setDrawerTab('formulas');
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#A64B33]/40 dark:border-[#D4785E]/40 bg-[#F7EBE7] dark:bg-[#2F1D19] text-[#A64B33] dark:text-[#D4785E] hover:bg-[#A64B33] hover:text-white transition-colors whitespace-nowrap"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Study Sheets &amp; Diagrams</span>
                      </button>
                    )}

                    <select
                      value={explicitStudyStatus}
                      aria-label={`Study status for ${chapter.title}`}
                      onChange={(e) =>
                        handleExplicitStudyStatusChange(
                          chapter.id,
                          e.target.value as ChapterStudyStatus,
                        )
                      }
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] text-[#1E1B18] dark:text-[#F5F2EB]"
                    >
                      {CHAPTER_STUDY_STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>

                    <motion.button
                      type="button"
                      whileTap={{scale: 0.95}}
                      onClick={() => onToggleChapter(chapter.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                        isDone
                          ? 'bg-[#FAF8F3] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB]'
                          : 'bg-[#1E1B18] dark:bg-[#F5F2EB] border-[#1E1B18] dark:border-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] hover:bg-[#332E28] dark:hover:bg-[#E8E2D5]'
                      }`}
                    >
                      {isDone ? 'Undo' : 'Mark Done'}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Chapter Study Sheets, Derivations, Diagrams & Practice Drawer Modal */}
      <AnimatePresence>
        {studyDrawerChapter && activeStudyBundle && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.18}}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto"
            onClick={() => setStudyDrawerChapter(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="study-drawer-title"
          >
            <motion.div
              initial={{opacity: 0, y: 14, scale: 0.98}}
              animate={{opacity: 1, y: 0, scale: 1}}
              exit={{opacity: 0, y: 10, scale: 0.98}}
              transition={{duration: 0.2, ease: [0.16, 1, 0.3, 1]}}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] flex items-start justify-between gap-4 shrink-0">
                <div>
                  <p className="text-xs font-mono text-[#A64B33] dark:text-[#D4785E]">
                    {activeSubject.name} · Ch {studyDrawerChapter.number} · {studyDrawerChapter.unit}
                  </p>
                  <h2
                    id="study-drawer-title"
                    className="mt-0.5 text-lg font-semibold text-[#1E1B18] dark:text-[#F5F2EB]"
                  >
                    {studyDrawerChapter.title} — Study Reference Sheets
                  </h2>
                  <p className="mt-1 text-xs text-[#575048] dark:text-[#CBC3B6]">
                    Dedicated formula sheets, complete derivations, and diagrams (Study Notes, not a question paper · Status: {studyStatusMap[studyDrawerChapter.id] ?? (completedChapters[studyDrawerChapter.id] ? 'Completed' : 'Not Started')}).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStudyDrawerChapter(null)}
                  aria-label="Close Study Library"
                  className="p-2 rounded-lg text-[#575048] dark:text-[#CBC3B6] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 py-3 border-b border-[#DDD6C7] dark:border-[#332E28] flex flex-wrap gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setDrawerTab('formulas')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border whitespace-nowrap ${
                    drawerTab === 'formulas'
                      ? 'bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] border-[#1E1B18] dark:border-[#F5F2EB]'
                      : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6]'
                  }`}
                >
                  <FlaskConical className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Formula Sheet ({activeBundleFormulaCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerTab('derivations')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border whitespace-nowrap ${
                    drawerTab === 'derivations'
                      ? 'bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] border-[#1E1B18] dark:border-[#F5F2EB]'
                      : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Derivation Sheet ({activeBundleDerivations.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerTab('diagrams')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border whitespace-nowrap ${
                    drawerTab === 'diagrams'
                      ? 'bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] border-[#1E1B18] dark:border-[#F5F2EB]'
                      : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6]'
                  }`}
                >
                  <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Diagrams &amp; Graphs ({activeStudyBundle.diagramIds.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerTab('questions')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border whitespace-nowrap ${
                    drawerTab === 'questions'
                      ? 'bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] border-[#1E1B18] dark:border-[#F5F2EB]'
                      : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Practice Qs ({activeChapterQuestions.length})</span>
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
                {drawerTab === 'formulas' && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C]">
                      <p className="text-[11px] font-mono uppercase tracking-wider text-[#3D6B4F] dark:text-[#7AB88F]">
                        Formula &amp; Concept Reference Sheet · Study Revision
                      </p>
                      <p className="mt-1 text-xs sm:text-sm text-[#575048] dark:text-[#CBC3B6] leading-relaxed">
                        {activeStudyBundle.summary}
                      </p>
                    </div>

                    {activeStudyBundle.physicsFormulas?.map((pf) => (
                      <div
                        key={pf.id}
                        className="p-4 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] space-y-2.5"
                      >
                        <h3 className="font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                          {pf.title}
                        </h3>
                        <p className="font-mono text-xs p-2.5 rounded bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] text-[#A64B33] dark:text-[#D4785E]">
                          {pf.equation}
                        </p>
                        {pf.symbols.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#575048] dark:text-[#CBC3B6]">
                            {pf.symbols.map((su, idx) => (
                              <div key={idx} className="font-mono">
                                <span className="font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                                  {su.symbol}:
                                </span>{' '}
                                {su.meaning} ({su.siUnit})
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-[#575048] dark:text-[#CBC3B6]">
                          <strong>Applicability:</strong> {pf.applicability} ·{' '}
                          {pf.shortExplanation}
                        </p>
                        {pf.diagramRefId && <ExamDiagram diagramId={pf.diagramRefId} />}
                        <p className="text-xs text-[#1E1B18] dark:text-[#F5F2EB]">
                          <strong>Worked Example:</strong> {pf.workedExample}
                        </p>
                        <p className="text-xs text-[#8C5A12] dark:text-[#E6B17A]">
                          <strong>Common Mistakes:</strong> {pf.commonMistakes.join(' · ')}
                        </p>
                      </div>
                    ))}

                    {activeStudyBundle.chemistryItems?.map((ci) => (
                      <div
                        key={ci.id}
                        className="p-4 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] space-y-2.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                            {ci.title}
                          </h3>
                          <span className="text-[11px] font-mono text-[#787066] dark:text-[#9C9387]">
                            {ci.kind.replace(/-/g, ' ')}
                          </span>
                        </div>
                        <p className="font-mono text-xs p-2.5 rounded bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] text-[#A64B33] dark:text-[#D4785E]">
                          {ci.equationOrReaction}
                        </p>
                        <p className="text-xs text-[#575048] dark:text-[#CBC3B6]">
                          <strong>Conditions / Reagents:</strong> {ci.conditionsOrUnits} ·{' '}
                          {ci.reagentsOrSymbols.join(', ')}
                        </p>
                        {ci.mechanismOrSteps.length > 0 && (
                          <ol className="list-decimal list-inside space-y-1 text-xs text-[#575048] dark:text-[#CBC3B6]">
                            {ci.mechanismOrSteps.map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ol>
                        )}
                        <p className="text-xs text-[#1E1B18] dark:text-[#F5F2EB]">
                          <strong>Outcome &amp; Example:</strong> {ci.productOrOutcome} —{' '}
                          {ci.workedExample}
                        </p>
                        {ci.exceptionsOrTrends.length > 0 && (
                          <p className="text-xs text-[#3D6B4F] dark:text-[#7AB88F]">
                            <strong>Trends &amp; Exceptions:</strong>{' '}
                            {ci.exceptionsOrTrends.join(' · ')}
                          </p>
                        )}
                        {ci.diagramRefId && <ExamDiagram diagramId={ci.diagramRefId} />}
                        <p className="text-xs text-[#8C5A12] dark:text-[#E6B17A]">
                          <strong>Mistakes to Avoid:</strong> {ci.commonMistakes.join(' · ')}
                        </p>
                      </div>
                    ))}

                    {activeStudyBundle.biologyItems?.map((bi) => (
                      <div
                        key={bi.id}
                        className="p-4 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] space-y-2.5"
                      >
                        <h3 className="font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                          {bi.title}
                        </h3>
                        <p className="text-xs text-[#1E1B18] dark:text-[#F5F2EB]">
                          {bi.coreStatementOrLaw}
                        </p>
                        <ol className="list-decimal list-inside space-y-1 text-xs text-[#575048] dark:text-[#CBC3B6]">
                          {bi.structuredStepsOrLabels.map((st, idx) => (
                            <li key={idx}>{st}</li>
                          ))}
                        </ol>
                        {bi.quantitativeFormulaOrCross && (
                          <p className="font-mono text-xs p-2 rounded bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] text-[#A64B33] dark:text-[#D4785E]">
                            {bi.quantitativeFormulaOrCross}
                          </p>
                        )}
                        {bi.importantComparisonsOrExceptions.length > 0 && (
                          <p className="text-xs text-[#3D6B4F] dark:text-[#7AB88F]">
                            <strong>NCERT Key Comparisons:</strong>{' '}
                            {bi.importantComparisonsOrExceptions.join(' · ')}
                          </p>
                        )}
                        {bi.workedExample && (
                          <p className="text-xs text-[#1E1B18] dark:text-[#F5F2EB]">
                            <strong>Worked Illustration:</strong> {bi.workedExample}
                          </p>
                        )}
                        {bi.diagramRefId && <ExamDiagram diagramId={bi.diagramRefId} />}
                        <p className="text-xs text-[#8C5A12] dark:text-[#E6B17A]">
                          <strong>Common Mistakes:</strong> {bi.commonMistakes.join(' · ')}
                        </p>
                      </div>
                    ))}

                    {activeStudyBundle.mathsFormulas?.map((mf) => (
                      <div
                        key={mf.id}
                        className="p-4 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] space-y-2.5"
                      >
                        <h3 className="font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                          {mf.title}
                        </h3>
                        <p className="font-mono text-xs p-2.5 rounded bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] text-[#A64B33] dark:text-[#D4785E]">
                          {mf.expression}
                        </p>
                        <p className="text-xs text-[#575048] dark:text-[#CBC3B6]">
                          <strong>Domain &amp; Conditions:</strong> {mf.domainAndConditions} ·{' '}
                          {mf.workedExample}
                        </p>
                        {mf.commonMistakes.length > 0 && (
                          <p className="text-xs text-[#8C5A12] dark:text-[#E6B17A]">
                            <strong>Common Mistakes:</strong> {mf.commonMistakes.join(' · ')}
                          </p>
                        )}
                      </div>
                    ))}

                    {activeStudyBundle.mathsMethods?.map((mm) => (
                      <div
                        key={mm.id}
                        className="p-4 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] space-y-2.5"
                      >
                        <h3 className="font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                          Standard Method: {mm.questionTypeTitle}
                        </h3>
                        <p className="font-mono text-xs p-2 rounded bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] text-[#A64B33] dark:text-[#D4785E]">
                          Standard Form: {mm.standardForm}
                        </p>
                        <ol className="list-decimal list-inside space-y-1 text-xs text-[#1E1B18] dark:text-[#F5F2EB]">
                          {mm.stepByStepMethod.map((st, idx) => (
                            <li key={idx}>{st}</li>
                          ))}
                        </ol>
                        {mm.diagramRefId && <ExamDiagram diagramId={mm.diagramRefId} />}
                        <p className="text-xs text-[#3D6B4F] dark:text-[#7AB88F]">
                          <strong>Solved Illustration:</strong> {mm.solvedExample}
                        </p>
                        {mm.commonMistakes.length > 0 && (
                          <p className="text-xs text-[#8C5A12] dark:text-[#E6B17A]">
                            <strong>Common Mistakes:</strong> {mm.commonMistakes.join(' · ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {drawerTab === 'derivations' && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C]">
                      <p className="text-[11px] font-mono uppercase tracking-wider text-[#A64B33] dark:text-[#D4785E]">
                        Step-by-Step Derivation Sheet · Not a Question Paper
                      </p>
                      <p className="mt-1 text-xs text-[#575048] dark:text-[#CBC3B6]">
                        Complete worked textbook derivations with given geometry/setup, physical/mathematical principles, intermediate steps, boxed final result, special cases, and graph interpretation.
                      </p>
                    </div>

                    {activeBundleDerivations.length > 0 ? (
                      activeBundleDerivations.map((deriv, dIdx) => (
                        <article
                          key={deriv.id}
                          className="p-4 sm:p-5 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] space-y-3"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <h3 className="text-sm sm:text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                              {dIdx + 1}. {deriv.title}
                            </h3>
                            <span className="px-2 py-0.5 text-[11px] font-mono rounded border border-[#A64B33]/35 bg-[#F7EBE7] dark:bg-[#2F1D19] text-[#A64B33] dark:text-[#D4785E] tabular-nums whitespace-nowrap">
                              {deriv.typicalBoardMarks}
                            </span>
                          </div>

                          <p className="text-xs text-[#575048] dark:text-[#CBC3B6]">
                            <strong className="text-[#1E1B18] dark:text-[#F5F2EB]">
                              Objective:
                            </strong>{' '}
                            {deriv.conceptObjective}
                          </p>

                          <div className="p-3 rounded-lg bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] space-y-1.5 text-xs">
                            <p className="text-[#1E1B18] dark:text-[#F5F2EB]">
                              <strong>Setup &amp; Configuration:</strong> {deriv.givenSetup}
                            </p>
                            {deriv.assumptionsAndConditions.length > 0 && (
                              <p className="text-[#575048] dark:text-[#CBC3B6]">
                                <strong>Assumptions &amp; Conditions:</strong>{' '}
                                {deriv.assumptionsAndConditions.join(' · ')}
                              </p>
                            )}
                            {deriv.physicalPrinciplesUsed.length > 0 && (
                              <p className="text-[#575048] dark:text-[#CBC3B6]">
                                <strong>Principles Used:</strong>{' '}
                                {deriv.physicalPrinciplesUsed.join(' · ')}
                              </p>
                            )}
                          </div>

                          {deriv.diagramRefId && (
                            <div>
                              <ExamDiagram diagramId={deriv.diagramRefId} />
                            </div>
                          )}

                          <div>
                            <p className="text-xs font-semibold text-[#1E1B18] dark:text-[#F5F2EB] mb-1.5">
                              Complete Derivation Steps:
                            </p>
                            <ol className="list-decimal list-inside space-y-1.5 text-xs text-[#1E1B18] dark:text-[#F5F2EB] leading-relaxed">
                              {deriv.stepByStepSteps.map((st, idx) => (
                                <li key={idx}>{st}</li>
                              ))}
                            </ol>
                          </div>

                          {deriv.intermediateResults.length > 0 && (
                            <p className="text-xs text-[#575048] dark:text-[#CBC3B6]">
                              <strong>Key Intermediate Results:</strong>{' '}
                              {deriv.intermediateResults.join(' | ')}
                            </p>
                          )}

                          <div className="p-3 rounded-lg bg-[#E8F0EA] dark:bg-[#1C2E22] border border-[#3D6B4F]/40 dark:border-[#7AB88F]/40">
                            <p className="text-[11px] font-mono uppercase tracking-wider text-[#315940] dark:text-[#8FC4A1]">
                              Final Boxed Result
                            </p>
                            <p className="mt-1 font-mono text-xs sm:text-sm font-semibold text-[#23422F] dark:text-[#B6DFC3]">
                              {deriv.finalFormulaWithUnits}
                            </p>
                          </div>

                          {deriv.specialCases.length > 0 && (
                            <p className="text-xs text-[#575048] dark:text-[#CBC3B6]">
                              <strong>Special Cases:</strong> {deriv.specialCases.join(' · ')}
                            </p>
                          )}

                          {deriv.physicalMeaningAndGraph && (
                            <p className="text-xs text-[#1E1B18] dark:text-[#F5F2EB]">
                              <strong>Graph &amp; Physical Meaning:</strong>{' '}
                              {deriv.physicalMeaningAndGraph}
                            </p>
                          )}

                          {deriv.commonMistakes.length > 0 && (
                            <p className="text-xs text-[#8C5A12] dark:text-[#E6B17A]">
                              <strong>Common Pitfalls:</strong> {deriv.commonMistakes.join(' · ')}
                            </p>
                          )}
                        </article>
                      ))
                    ) : (
                      <div className="p-5 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] space-y-3">
                        <p className="text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                          Conceptual, Diagrammatic &amp; Reaction-Focused Chapter
                        </p>
                        <p className="text-xs text-[#575048] dark:text-[#CBC3B6] leading-relaxed">
                          In NCERT Class 12 {activeSubject.name}, this chapter emphasises pathways, labelled biological/chemical structures, reaction mechanisms, and graphical interpretation rather than algebraic derivations. Use the Formula Sheet and Diagrams &amp; Graphs tabs above for complete revision.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setDrawerTab('formulas')}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#A64B33]/40 bg-[#F7EBE7] dark:bg-[#2F1D19] text-[#A64B33] dark:text-[#D4785E]"
                          >
                            Open Formula &amp; Pathway Sheet
                          </button>
                          <button
                            type="button"
                            onClick={() => setDrawerTab('diagrams')}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#3D6B4F]/40 bg-[#E8F0EA] dark:bg-[#1C2E22] text-[#23422F] dark:text-[#B6DFC3]"
                          >
                            Open Diagrams &amp; Graphs ({activeStudyBundle.diagramIds.length})
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {drawerTab === 'diagrams' && (
                  <div className="space-y-4">
                    <div className="p-3 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#ECE6D9] dark:bg-[#24201C] aspect-[16/9]">
                      <ChapterIllustration chapterId={studyDrawerChapter.id} className="p-4" />
                    </div>
                    {activeStudyBundle.diagramIds.map((dId) => {
                      const diagMeta = getDiagramMetadata(dId);
                      return (
                        <div
                          key={dId}
                          className="p-4 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#161412] space-y-2"
                        >
                          {diagMeta && (
                            <h3 className="text-xs sm:text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                              {diagMeta.title}
                            </h3>
                          )}
                          <ExamDiagram diagramId={dId} />
                        </div>
                      );
                    })}
                  </div>
                )}

                {drawerTab === 'questions' && (
                  <div className="space-y-3">
                    {activeChapterQuestions.map((q, idx) => {
                      const revealed = Boolean(showSolutionMap[q.id]);
                      return (
                        <div
                          key={q.id}
                          className="p-4 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2 text-xs font-mono text-[#787066] dark:text-[#9C9387]">
                            <span>
                              Q{idx + 1} · {q.topic} · {q.difficulty} · {q.questionType}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setShowSolutionMap((prev) => ({
                                  ...prev,
                                  [q.id]: !prev[q.id],
                                }))
                              }
                              className="text-xs font-semibold text-[#A64B33] dark:text-[#D4785E] hover:underline"
                            >
                              {revealed ? 'Hide Marking Solution' : 'View Marking Solution'}
                            </button>
                          </div>
                          <p className="font-medium text-[#1E1B18] dark:text-[#F5F2EB]">
                            {q.prompt}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#575048] dark:text-[#CBC3B6]">
                            {q.options.map((opt, oIdx) => (
                              <div key={oIdx}>
                                <strong>({String.fromCharCode(65 + oIdx)})</strong> {opt}
                              </div>
                            ))}
                          </div>
                          {revealed && (
                            <div className="p-3 rounded-lg bg-[#E8F0EA]/70 dark:bg-[#1C2E22]/50 border border-[#B8D0BF] dark:border-[#2F4D39] text-xs space-y-1">
                              <p className="font-semibold text-[#23422F] dark:text-[#B6DFC3]">
                                Key: ({String.fromCharCode(65 + q.correctIndex)}) ·{' '}
                                {q.subjectiveSolution.finalResult}
                              </p>
                              <p className="text-[#1E1B18] dark:text-[#F5F2EB]">
                                {q.subjectiveSolution.formulaOrPrinciple} —{' '}
                                {q.subjectiveSolution.keyReason}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complete Subject Formula, Derivation & Diagram Reference Sheet Modal */}
      <AnimatePresence>
        {showSubjectSheetModal && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.18}}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-2 sm:p-6 overflow-y-auto"
            onClick={() => setShowSubjectSheetModal(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="subject-sheet-modal-title"
          >
            <motion.div
              initial={{opacity: 0, y: 14, scale: 0.98}}
              animate={{opacity: 1, y: 0, scale: 1}}
              exit={{opacity: 0, y: 10, scale: 0.98}}
              transition={{duration: 0.2, ease: [0.16, 1, 0.3, 1]}}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] flex flex-wrap items-start justify-between gap-4 shrink-0">
                <div>
                  <p className="text-xs font-mono text-[#3D6B4F] dark:text-[#7AB88F]">
                    {activeSubject.name} (Code {activeSubject.code}) · Study Reference Sheet (Not a Question Paper)
                  </p>
                  <h2
                    id="subject-sheet-modal-title"
                    className="mt-0.5 text-lg sm:text-xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB]"
                  >
                    {activeSubject.name} Complete Formula, Derivation &amp; Diagram Sheet
                  </h2>
                  <p className="mt-1 text-xs text-[#575048] dark:text-[#CBC3B6]">
                    All {activeSubject.chapters.length} NCERT chapters organised by formulas, step-by-step derivations, and labelled diagrams &amp; graphs.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] text-[#1E1B18] dark:text-[#F5F2EB] hover:bg-[#ECE6D9] dark:hover:bg-[#28231F] whitespace-nowrap"
                  >
                    <Printer className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Print / Save PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSubjectSheetModal(false)}
                    aria-label="Close Full Subject Formula and Derivation Sheet"
                    className="p-2 rounded-lg text-[#575048] dark:text-[#CBC3B6] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Filter Toolbar */}
              <div className="px-6 py-3 border-b border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      {id: 'all', label: 'All Sections'},
                      {id: 'formulas', label: 'Formulas & Laws'},
                      {id: 'derivations', label: 'Derivations'},
                      {id: 'diagrams', label: 'Diagrams & Graphs'},
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSheetFocusSection(item.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border whitespace-nowrap ${
                        sheetFocusSection === item.id
                          ? 'bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] border-[#1E1B18] dark:border-[#F5F2EB]'
                          : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <select
                  value={sheetChapterFilter}
                  aria-label="Filter sheet by chapter"
                  onChange={(e) => setSheetChapterFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] text-[#1E1B18] dark:text-[#F5F2EB] max-w-full sm:max-w-xs"
                >
                  <option value="all">
                    All {activeSubject.chapters.length} Chapters
                  </option>
                  {activeSubject.chapters.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      Ch {ch.number}: {ch.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-6 overflow-y-auto space-y-8 text-xs sm:text-sm">
                {subjectSheetEntries.map(({chapter, bundle}) => {
                  if (!bundle) return null;
                  const chDerivations = getBundleDerivations(bundle);
                  const showFormulas =
                    sheetFocusSection === 'all' || sheetFocusSection === 'formulas';
                  const showDerivations =
                    sheetFocusSection === 'all' || sheetFocusSection === 'derivations';
                  const showDiagrams =
                    sheetFocusSection === 'all' || sheetFocusSection === 'diagrams';

                  return (
                    <section
                      key={chapter.id}
                      className="pb-6 border-b border-[#DDD6C7] dark:border-[#332E28] last:border-b-0 space-y-4"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-base sm:text-lg font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                          <span className="font-mono text-xs text-[#A64B33] dark:text-[#D4785E] mr-2 tabular-nums">
                            Ch {chapter.number}
                          </span>
                          {chapter.title}
                        </h3>
                        <span className="text-xs font-mono text-[#787066] dark:text-[#9C9387] tabular-nums">
                          {chapter.unit} · {getBundleFormulaCount(bundle)} formulas ·{' '}
                          {chDerivations.length} derivations · {bundle.diagramIds.length} diagrams
                        </span>
                      </div>

                      <p className="text-xs text-[#575048] dark:text-[#CBC3B6]">
                        {bundle.summary}
                      </p>

                      {showFormulas && (
                        <div className="space-y-2.5">
                          <h4 className="text-xs font-mono uppercase tracking-wider text-[#3D6B4F] dark:text-[#7AB88F]">
                            Formula &amp; Core Reference Sheet
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {bundle.physicsFormulas?.map((pf) => (
                              <div
                                key={pf.id}
                                className="p-3.5 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] space-y-1.5"
                              >
                                <p className="font-semibold text-xs text-[#1E1B18] dark:text-[#F5F2EB]">
                                  {pf.title}
                                </p>
                                <p className="font-mono text-xs text-[#A64B33] dark:text-[#D4785E]">
                                  {pf.equation}
                                </p>
                                <p className="text-[11px] text-[#575048] dark:text-[#CBC3B6]">
                                  {pf.applicability} · {pf.workedExample}
                                </p>
                              </div>
                            ))}
                            {bundle.mathsFormulas?.map((mf) => (
                              <div
                                key={mf.id}
                                className="p-3.5 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] space-y-1.5"
                              >
                                <p className="font-semibold text-xs text-[#1E1B18] dark:text-[#F5F2EB]">
                                  {mf.title}
                                </p>
                                <p className="font-mono text-xs text-[#A64B33] dark:text-[#D4785E]">
                                  {mf.expression}
                                </p>
                                <p className="text-[11px] text-[#575048] dark:text-[#CBC3B6]">
                                  {mf.domainAndConditions} · {mf.workedExample}
                                </p>
                              </div>
                            ))}
                            {bundle.mathsMethods?.map((mm) => (
                              <div
                                key={mm.id}
                                className="p-3.5 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] space-y-1.5"
                              >
                                <p className="font-semibold text-xs text-[#1E1B18] dark:text-[#F5F2EB]">
                                  Method: {mm.questionTypeTitle}
                                </p>
                                <p className="font-mono text-xs text-[#A64B33] dark:text-[#D4785E]">
                                  {mm.standardForm}
                                </p>
                                <p className="text-[11px] text-[#575048] dark:text-[#CBC3B6]">
                                  {mm.solvedExample}
                                </p>
                              </div>
                            ))}
                            {bundle.chemistryItems?.map((ci) => (
                              <div
                                key={ci.id}
                                className="p-3.5 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] space-y-1.5"
                              >
                                <p className="font-semibold text-xs text-[#1E1B18] dark:text-[#F5F2EB]">
                                  {ci.title}
                                </p>
                                <p className="font-mono text-xs text-[#A64B33] dark:text-[#D4785E]">
                                  {ci.equationOrReaction}
                                </p>
                                <p className="text-[11px] text-[#575048] dark:text-[#CBC3B6]">
                                  {ci.conditionsOrUnits} · {ci.productOrOutcome}
                                </p>
                              </div>
                            ))}
                            {bundle.biologyItems?.map((bi) => (
                              <div
                                key={bi.id}
                                className="p-3.5 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] space-y-1.5"
                              >
                                <p className="font-semibold text-xs text-[#1E1B18] dark:text-[#F5F2EB]">
                                  {bi.title}
                                </p>
                                <p className="text-[11px] text-[#1E1B18] dark:text-[#F5F2EB]">
                                  {bi.coreStatementOrLaw}
                                </p>
                                {bi.quantitativeFormulaOrCross && (
                                  <p className="font-mono text-xs text-[#A64B33] dark:text-[#D4785E]">
                                    {bi.quantitativeFormulaOrCross}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {showDerivations && chDerivations.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-xs font-mono uppercase tracking-wider text-[#A64B33] dark:text-[#D4785E]">
                            Step-by-Step Derivations ({chDerivations.length})
                          </h4>
                          {chDerivations.map((deriv) => (
                            <div
                              key={deriv.id}
                              className="p-4 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] space-y-2"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="font-semibold text-xs sm:text-sm text-[#1E1B18] dark:text-[#F5F2EB]">
                                  {deriv.title}
                                </p>
                                <span className="text-[11px] font-mono text-[#787066] dark:text-[#9C9387]">
                                  {deriv.typicalBoardMarks}
                                </span>
                              </div>
                              <p className="text-xs text-[#575048] dark:text-[#CBC3B6]">
                                <strong>Setup:</strong> {deriv.givenSetup}
                              </p>
                              <ol className="list-decimal list-inside space-y-1 text-xs text-[#1E1B18] dark:text-[#F5F2EB]">
                                {deriv.stepByStepSteps.map((st, idx) => (
                                  <li key={idx}>{st}</li>
                                ))}
                              </ol>
                              <p className="font-mono text-xs font-semibold text-[#3D6B4F] dark:text-[#7AB88F]">
                                Final Result: {deriv.finalFormulaWithUnits}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {showDiagrams && bundle.diagramIds.length > 0 && (
                        <div className="space-y-2.5">
                          <h4 className="text-xs font-mono uppercase tracking-wider text-[#575048] dark:text-[#CBC3B6]">
                            Diagrams &amp; Graphs ({bundle.diagramIds.length})
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {bundle.diagramIds.map((dId) => {
                              const diagMeta = getDiagramMetadata(dId);
                              return (
                                <div
                                  key={dId}
                                  className="p-3 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#161412] space-y-1"
                                >
                                  {diagMeta && (
                                    <p className="text-xs font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                                      {diagMeta.title}
                                    </p>
                                  )}
                                  <ExamDiagram diagramId={dId} />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapter Scientific Illustration Lightbox Modal */}
      <AnimatePresence>
        {previewChapter && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.18}}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#161412]/70 dark:bg-black/80 backdrop-blur-xs p-4 sm:p-6"
            onClick={() => setPreviewChapter(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="chapter-plate-modal-title"
          >
            <motion.div
              initial={{opacity: 0, y: 14, scale: 0.98}}
              animate={{opacity: 1, y: 0, scale: 1}}
              exit={{opacity: 0, y: 10, scale: 0.98}}
              transition={{duration: 0.2, ease: [0.16, 1, 0.3, 1]}}
              className="relative w-full max-w-2xl bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[#DDD6C7] dark:border-[#332E28]">
                <div>
                  <p className="text-xs text-[#787066] dark:text-[#9C9387] font-mono tabular-nums">
                    {activeSubject.name} · Ch {previewChapter.number} · {previewChapter.unit}
                  </p>
                  <h2
                    id="chapter-plate-modal-title"
                    className="mt-0.5 text-lg font-semibold text-[#1E1B18] dark:text-[#F5F2EB]"
                  >
                    {previewChapter.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewChapter(null)}
                  aria-label="Close chapter illustration"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[#575048] dark:text-[#CBC3B6] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB] hover:bg-[#ECE6D9] dark:hover:bg-[#24201C]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="aspect-[16/9] w-full bg-[#ECE6D9] dark:bg-[#24201C] border-b border-[#DDD6C7] dark:border-[#332E28]">
                <ChapterIllustration chapterId={previewChapter.id} className="p-4 sm:p-6" />
              </div>

              <div className="px-6 py-4 space-y-3 bg-[#F5F2EB]/70 dark:bg-[#24201C]/70">
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <span className="text-xs font-mono tabular-nums text-[#787066] dark:text-[#9C9387]">
                    Weightage ~{previewChapter.marksWeightage} Marks ·{' '}
                    {previewChapter.estimatedHours}h study
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const ch = previewChapter;
                        setPreviewChapter(null);
                        setStudyDrawerChapter(ch);
                        setDrawerTab('formulas');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[#A64B33]/50 bg-[#F7EBE7] dark:bg-[#2F1D19] text-[#A64B33] dark:text-[#D4785E]"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Open Study Sheets</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleChapter(previewChapter.id)}
                      className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                        completedChapters[previewChapter.id]
                          ? 'bg-[#E8F0EA] dark:bg-[#1C2E22] border-[#3D6B4F] dark:border-[#7AB88F] text-[#23422F] dark:text-[#B6DFC3]'
                          : 'bg-[#1E1B18] dark:bg-[#F5F2EB] border-[#1E1B18] dark:border-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18]'
                      }`}
                    >
                      {completedChapters[previewChapter.id]
                        ? 'Completed (Click to Undo)'
                        : 'Mark Chapter Completed'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
