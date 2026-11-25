import {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {
  ArrowRight,
  Box,
  Check,
  CheckCircle2,
  Circle,
  Maximize2,
  RotateCcw,
  Search,
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
import {ResilientImage} from './ResilientImage';
import {ChapterIllustration} from './ChapterIllustrations';
import {APPLE_EASE, APPLE_SPRING, AnimatedNumber} from './FluidPrimitives';

interface SubjectTrackerSectionProps {
  selectedSubjectId?: SubjectId;
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

export function SubjectTrackerSection({
  selectedSubjectId,
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

  useEffect(() => {
    if (selectedSubjectId) {
      setActiveSubjectId(selectedSubjectId);
    }
  }, [selectedSubjectId]);

  useEffect(() => {
    if (!previewChapter) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewChapter(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [previewChapter]);

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

  return (
    <section aria-labelledby="tracker-heading" className="space-y-8">
      {/* Header & Overall PCMB Progress Summary */}
      <div className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-6 sm:p-8 apple-surface">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 text-xs font-medium tracking-[0.12em] text-[#A64B33] dark:text-[#D4785E]">
              <span className="w-5 h-px bg-[#A64B33] dark:bg-[#D4785E] shrink-0" aria-hidden="true" />
              <span>CBSE Class 12 Syllabus · Physics, Chemistry, Biology &amp; Mathematics</span>
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
              Check off completed NCERT chapters below. Every chapter includes a
              topic-matched study illustration—click any plate to expand and review its
              key formula.
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

      {/* Subject Overview Plate & Progress Banner (Strictly Above Chapter Checklist) */}
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
                  {activeSubject.chapters.length} Chapters &amp; Illustrations
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
                {activeSubject.name} Overview &amp; Progress
              </h2>

              {/* Subject Progress Bar */}
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
                  {activeStats.totalMarks} Marks
                </p>
              </div>

              {/* Subject-Level 4 Done Boxes: Lecture, Practice, NCERT, PYQ */}
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
                            <motion.span
                              initial={{scale: 0.4, opacity: 0}}
                              animate={{scale: 1, opacity: 1}}
                              transition={APPLE_SPRING}
                            >
                              <Check className="w-3 h-3 stroke-[2.5]" />
                            </motion.span>
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

            {/* Completed Banner when subject hits 100% */}
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
                        All {activeStats.total} chapters in this section are finished. Test
                        your preparation with the official CBSE sample paper.
                      </p>
                    </div>
                  </div>
                  <motion.button
                    type="button"
                    whileTap={{scale: 0.97}}
                    onClick={() => onEnterExamHallForSubject(activeSubject.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#F5F2EB] bg-[#3D6B4F] hover:bg-[#315940] rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>Attempt Sample Paper</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <p className="text-xs text-[#787066] dark:text-[#9C9387]">
                Subject overview diagram shown above · Individual chapter diagrams below
              </p>

              <div className="flex flex-wrap items-center gap-2">
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

      {/* Chapter Checklist Card (Strictly Below Subject Overview Banner) */}
      <div className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl overflow-hidden transition-colors duration-200">
        <div className="px-6 py-5 border-b border-[#DDD6C7] dark:border-[#332E28] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1E1B18] dark:text-[#F5F2EB]">
              {activeSubject.name} Chapter Checklist
            </h2>
            <p className="mt-1 text-xs text-[#787066] dark:text-[#9C9387]">
              {activeSubject.chapters.length} NCERT chapters · Click any diagram to inspect
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

        {/* Chapter Table / Checklist with Dedicated Chapter Illustration Plate */}
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
              return (
                <motion.div
                  key={chapter.id}
                  initial={{opacity: 0, y: 12}}
                  whileInView={{opacity: 1, y: 0}}
                  viewport={{once: true, amount: 0.04}}
                  transition={{duration: 0.28, ease: APPLE_EASE}}
                  className={`flex flex-col md:flex-row md:items-center justify-between gap-4 px-5 sm:px-6 py-4 transition-colors duration-150 ${
                    isDone
                      ? 'bg-[#F5F2EB]/70 dark:bg-[#24201C]/60'
                      : 'bg-[#FAF8F3] dark:bg-[#1E1B18] hover:bg-[#F5F2EB] dark:hover:bg-[#24201C]/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1 min-w-0">
                    {/* Chapter Scientific Illustration Thumbnail (Clickable to Expand) */}
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
                              {chapter.estimatedHours}h study
                            </span>
                          </p>
                        </div>
                      </button>

                      {/* Per-Chapter 4 Done Checkboxes: Lecture, Practice, NCERT, PYQ */}
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
                                {stageDone && (
                                  <motion.span
                                    initial={{scale: 0.4, opacity: 0}}
                                    animate={{scale: 1, opacity: 1}}
                                    transition={APPLE_SPRING}
                                  >
                                    <Check className="w-2.5 h-2.5 stroke-[2.75]" />
                                  </motion.span>
                                )}
                              </span>
                              <span>{stage.doneLabel}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3.5 shrink-0">
                    <span
                      className={`text-xs font-medium ${
                        isDone
                          ? 'text-[#3D6B4F] dark:text-[#7AB88F]'
                          : 'text-[#787066] dark:text-[#9C9387]'
                      }`}
                    >
                      {isDone ? 'Completed' : 'Pending'}
                    </span>

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
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {STUDY_STAGES.map((stage) => {
                    const stageDone = Boolean(
                      chapterTasks[previewChapter.id]?.[stage.key],
                    );
                    return (
                      <button
                        key={stage.key}
                        type="button"
                        role="checkbox"
                        aria-checked={stageDone}
                        onClick={() =>
                          onToggleChapterTask(previewChapter.id, stage.key)
                        }
                        className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A64B33] ${
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
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <span className="text-xs font-mono tabular-nums text-[#787066] dark:text-[#9C9387]">
                    Weightage ~{previewChapter.marksWeightage} Marks ·{' '}
                    {previewChapter.estimatedHours}h study
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {onOpenThreeLab && (
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewChapter(null);
                          onOpenThreeLab(activeSubject.id);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[#A64B33]/50 dark:border-[#D4785E]/50 bg-[#F7EBE7] dark:bg-[#2F1D19] text-[#A64B33] dark:text-[#D4785E] hover:bg-[#A64B33] hover:text-[#FAF8F3] transition-colors whitespace-nowrap"
                      >
                        <Box className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>View 3D Model</span>
                      </button>
                    )}
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
