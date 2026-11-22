import {useEffect, useRef, useState} from 'react';
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  FileCheck2,
  HelpCircle,
  Menu,
  MessageSquarePlus,
  Moon,
  Play,
  ShieldCheck,
  Sun,
  X,
} from 'lucide-react';
import {
  ChapterTaskState,
  HACKERS_PLAYLIST,
  STUDY_STAGES,
  SUBJECTS,
  StudyStageKey,
  SubjectId,
} from './data/pcmbData';
import {SubjectTrackerSection} from './components/SubjectTrackerSection';
import {ExamHallSection} from './components/ExamHallSection';
import {HackersPlaylistSection} from './components/HackersPlaylistSection';
import {
  HelpDeskModal,
  HelpDeskTab,
  NavSection,
} from './components/HelpDeskModal';
import {ResilientImage} from './components/ResilientImage';

type ActiveView = 'overview' | 'tracker' | 'exam-hall' | 'hackers';

interface ExamAttemptSummary {
  score: number;
  totalMarks: number;
  accuracy: number;
  timeTakenSeconds: number;
}

const STORAGE_CHAPTERS_KEY = 'pcmb_desk_completed_chapters_v1';
const STORAGE_CHAPTER_TASKS_KEY = 'pcmb_desk_chapter_tasks_v1';
const STORAGE_LECTURES_KEY = 'pcmb_desk_watched_lectures_v1';
const STORAGE_SCORES_KEY = 'pcmb_desk_best_scores_v1';
const STORAGE_THEME_KEY = 'pcmb_desk_theme_v1';

type ThemeMode = 'light' | 'dark';

function getInitialTheme(): ThemeMode {
  try {
    const saved = window.localStorage.getItem(STORAGE_THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }
  } catch {
    // Ignore storage access errors
  }
  return 'light';
}

function readStoredJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function HeroPreviewQuadrant({
  onSelectSubject,
}: {
  onSelectSubject: (subjectId: SubjectId) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const {scrollYProgress} = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const colOneY = useTransform(scrollYProgress, [0, 1], [10, -10]);
  const colTwoY = useTransform(scrollYProgress, [0, 1], [-10, 10]);

  return (
    <div ref={containerRef} className="lg:col-span-5 grid grid-cols-2 gap-3.5">
      {SUBJECTS.map((subject, idx) => (
        <motion.button
          key={subject.id}
          type="button"
          onClick={() => onSelectSubject(subject.id)}
          style={{y: idx % 2 === 0 ? colOneY : colTwoY}}
          whileHover={{y: -3}}
          transition={{duration: 0.18, ease: [0.16, 1, 0.3, 1]}}
          className="text-left group overflow-hidden rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A64B33]"
        >
          <div className="overflow-hidden border-b border-[#DDD6C7] dark:border-[#332E28]">
            <ResilientImage
              src={subject.imageUrl}
              alt={subject.imageAlt}
              fallbackTitle={subject.name}
              className="w-full h-24 sm:h-28 object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </div>
          <div className="px-3 py-2 flex items-center justify-between gap-2">
            <span
              className="text-xs font-semibold text-[#1E1B18] dark:text-[#F5F2EB] truncate"
              style={{fontFamily: 'var(--font-display)'}}
            >
              {subject.name}
            </span>
            <span className="text-[11px] font-mono tabular-nums text-[#787066] dark:text-[#9C9387]">
              {String(idx + 1).padStart(2, '0')}
            </span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [examTargetSubject, setExamTargetSubject] = useState<SubjectId>('physics');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [helpDeskOpen, setHelpDeskOpen] = useState(false);
  const [helpDeskTab, setHelpDeskTab] = useState<HelpDeskTab>('guide');

  const openHelpDesk = (tab: HelpDeskTab) => {
    setHelpDeskTab(tab);
    setHelpDeskOpen(true);
  };

  const handleHelpDeskNavigate = (section: NavSection) => {
    const viewMap: Record<NavSection, ActiveView> = {
      overview: 'overview',
      subjects: 'tracker',
      exam: 'exam-hall',
      hackers: 'hackers',
    };
    navigateTo(viewMap[section]);
  };

  const {scrollYProgress} = useScroll();
  const scrollScaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  const [completedChapters, setCompletedChapters] = useState<Record<string, boolean>>(() =>
    readStoredJson<Record<string, boolean>>(STORAGE_CHAPTERS_KEY, {}),
  );

  const [chapterTasks, setChapterTasks] = useState<
    Record<string, ChapterTaskState>
  >(() =>
    readStoredJson<Record<string, ChapterTaskState>>(STORAGE_CHAPTER_TASKS_KEY, {}),
  );

  const [watchedLectures, setWatchedLectures] = useState<Record<string, boolean>>(() =>
    readStoredJson<Record<string, boolean>>(STORAGE_LECTURES_KEY, {}),
  );

  const [bestScores, setBestScores] = useState<
    Partial<Record<SubjectId, ExamAttemptSummary>>
  >(() =>
    readStoredJson<Partial<Record<SubjectId, ExamAttemptSummary>>>(
      STORAGE_SCORES_KEY,
      {},
    ),
  );

  useEffect(() => {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    try {
      window.localStorage.setItem(STORAGE_THEME_KEY, theme);
    } catch {
      // Ignore storage quota errors
    }
  }, [theme]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_CHAPTERS_KEY,
        JSON.stringify(completedChapters),
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [completedChapters]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_CHAPTER_TASKS_KEY,
        JSON.stringify(chapterTasks),
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [chapterTasks]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_LECTURES_KEY,
        JSON.stringify(watchedLectures),
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [watchedLectures]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_SCORES_KEY, JSON.stringify(bestScores));
    } catch {
      // Ignore storage quota errors
    }
  }, [bestScores]);

  const navigateTo = (view: ActiveView) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const handleToggleChapter = (chapterId: string) => {
    setCompletedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const handleToggleChapterTask = (chapterId: string, stage: StudyStageKey) => {
    setChapterTasks((prev) => {
      const current = prev[chapterId] ?? {};
      const updatedChapter: ChapterTaskState = {
        ...current,
        [stage]: !current[stage],
      };
      const allFourDone = STUDY_STAGES.every((s) => Boolean(updatedChapter[s.key]));
      if (allFourDone) {
        setCompletedChapters((chPrev) =>
          chPrev[chapterId] ? chPrev : {...chPrev, [chapterId]: true},
        );
      }
      return {
        ...prev,
        [chapterId]: updatedChapter,
      };
    });
  };

  const handleToggleSubjectStage = (subjectId: SubjectId, stage: StudyStageKey) => {
    const subject = SUBJECTS.find((s) => s.id === subjectId);
    if (!subject) return;

    setChapterTasks((prev) => {
      const allAlreadyDone = subject.chapters.every((ch) =>
        Boolean(prev[ch.id]?.[stage]),
      );
      const nextValue = !allAlreadyDone;
      const next = {...prev};
      const newlyCompletedIds: string[] = [];

      subject.chapters.forEach((ch) => {
        const updatedChapter: ChapterTaskState = {
          ...(next[ch.id] ?? {}),
          [stage]: nextValue,
        };
        next[ch.id] = updatedChapter;
        if (STUDY_STAGES.every((s) => Boolean(updatedChapter[s.key]))) {
          newlyCompletedIds.push(ch.id);
        }
      });

      if (newlyCompletedIds.length > 0) {
        setCompletedChapters((chPrev) => {
          const chNext = {...chPrev};
          newlyCompletedIds.forEach((id) => {
            chNext[id] = true;
          });
          return chNext;
        });
      }

      return next;
    });
  };

  const handleMarkSubjectComplete = (subjectId: SubjectId) => {
    const subject = SUBJECTS.find((s) => s.id === subjectId);
    if (!subject) return;
    setCompletedChapters((prev) => {
      const next = {...prev};
      subject.chapters.forEach((ch) => {
        next[ch.id] = true;
      });
      return next;
    });
    setChapterTasks((prev) => {
      const next = {...prev};
      subject.chapters.forEach((ch) => {
        next[ch.id] = {
          lecture: true,
          practice: true,
          ncert: true,
          pyq: true,
        };
      });
      return next;
    });
  };

  const handleResetSubject = (subjectId: SubjectId) => {
    const subject = SUBJECTS.find((s) => s.id === subjectId);
    if (!subject) return;
    setCompletedChapters((prev) => {
      const next = {...prev};
      subject.chapters.forEach((ch) => {
        delete next[ch.id];
      });
      return next;
    });
    setChapterTasks((prev) => {
      const next = {...prev};
      subject.chapters.forEach((ch) => {
        delete next[ch.id];
      });
      return next;
    });
  };

  const syncEpisodeWatchedFromTasks = (
    tasksMap: Record<string, ChapterTaskState>,
  ) => {
    setWatchedLectures((prev) => {
      let changed = false;
      const next = {...prev};
      HACKERS_PLAYLIST.forEach((ep) => {
        if (ep.chapterIds.length === 0) return;
        const allDone = ep.chapterIds.every((id) => Boolean(tasksMap[id]?.lecture));
        if (Boolean(next[ep.id]) !== allDone) {
          next[ep.id] = allDone;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  };

  const handleSetChapterLectureDone = (chapterId: string, done: boolean) => {
    setChapterTasks((prev) => {
      if (Boolean(prev[chapterId]?.lecture) === done) {
        return prev;
      }
      const updatedChapter: ChapterTaskState = {
        ...(prev[chapterId] ?? {}),
        lecture: done,
      };
      if (STUDY_STAGES.every((s) => Boolean(updatedChapter[s.key]))) {
        setCompletedChapters((chPrev) =>
          chPrev[chapterId] ? chPrev : {...chPrev, [chapterId]: true},
        );
      }
      const next = {
        ...prev,
        [chapterId]: updatedChapter,
      };
      syncEpisodeWatchedFromTasks(next);
      return next;
    });
  };

  const handleToggleWatched = (lectureId: string) => {
    const episode = HACKERS_PLAYLIST.find((ep) => ep.id === lectureId);
    const nextWatched = !watchedLectures[lectureId];
    setWatchedLectures((prev) => ({
      ...prev,
      [lectureId]: nextWatched,
    }));

    if (episode && episode.chapterIds.length > 0) {
      setChapterTasks((prev) => {
        const next = {...prev};
        const newlyCompletedIds: string[] = [];
        episode.chapterIds.forEach((chId) => {
          const updatedChapter: ChapterTaskState = {
            ...(next[chId] ?? {}),
            lecture: nextWatched,
          };
          next[chId] = updatedChapter;
          if (
            nextWatched &&
            STUDY_STAGES.every((s) => Boolean(updatedChapter[s.key]))
          ) {
            newlyCompletedIds.push(chId);
          }
        });
        if (newlyCompletedIds.length > 0) {
          setCompletedChapters((chPrev) => {
            const chNext = {...chPrev};
            newlyCompletedIds.forEach((id) => {
              chNext[id] = true;
            });
            return chNext;
          });
        }
        return next;
      });
    }
  };

  const handleSaveExamAttempt = (
    subjectId: SubjectId,
    summary: ExamAttemptSummary,
  ) => {
    setBestScores((prev) => {
      const existing = prev[subjectId];
      if (!existing || summary.score >= existing.score) {
        return {...prev, [subjectId]: summary};
      }
      return prev;
    });
  };

  const handleEnterExamForSubject = (subjectId: SubjectId) => {
    setExamTargetSubject(subjectId);
    navigateTo('exam-hall');
  };

  const scrollToSubjects = () => {
    const el = document.getElementById('overview-subjects-heading');
    if (el) {
      el.scrollIntoView({behavior: 'smooth', block: 'start'});
    } else {
      navigateTo('tracker');
    }
  };

  // Computed PCMB metrics
  const totalChapters = SUBJECTS.reduce((sum, s) => sum + s.chapters.length, 0);
  const doneChapters = SUBJECTS.reduce(
    (sum, s) => sum + s.chapters.filter((ch) => completedChapters[ch.id]).length,
    0,
  );
  const overallProgress = Math.round((doneChapters / totalChapters) * 100);
  const completedSubjects = SUBJECTS.filter((s) =>
    s.chapters.every((ch) => completedChapters[ch.id]),
  ).length;
  const papersAttempted = Object.keys(bestScores).length;
  const watchedLecturesCount = SUBJECTS.reduce(
    (sum, s) =>
      sum + s.playlistVideos.filter((v) => Boolean(chapterTasks[v.chapterId]?.lecture)).length,
    0,
  );
  const totalPlaylistVideos = SUBJECTS.reduce(
    (sum, s) => sum + s.playlistVideos.length,
    0,
  );

  const navItems: {id: ActiveView; label: string}[] = [
    {id: 'overview', label: 'Overview'},
    {id: 'tracker', label: 'Subject Tracker'},
    {id: 'exam-hall', label: 'Examination Hall'},
    {id: 'hackers', label: '12th Hackers'},
  ];

  const isDark = theme === 'dark';

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-[#F5F2EB] dark:bg-[#161412] text-[#1E1B18] dark:text-[#F5F2EB] transition-colors duration-200">
        {/* Top Bar Contract: strictly 3 zones separated by gap-8 */}
        <header className="sticky top-0 z-40 bg-[#F5F2EB]/95 dark:bg-[#161412]/95 backdrop-blur-xs border-b border-[#DDD6C7] dark:border-[#332E28] transition-colors duration-200">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
            {/* Zone 1: Single text element wordmark */}
            <button
              type="button"
              onClick={() => navigateTo('overview')}
              className="text-lg font-semibold tracking-tight text-[#1E1B18] dark:text-[#F5F2EB] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A64B33]"
              style={{fontFamily: 'var(--font-display)'}}
            >
              Quadra 12
            </button>

            {/* Zone 2: 4 concise single-line nav links */}
            <nav
              aria-label="Primary Navigation"
              className="hidden md:flex items-center gap-7 text-sm font-medium"
            >
              {navItems.map((item) => {
                const isCurrent = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigateTo(item.id)}
                    aria-current={isCurrent ? 'page' : undefined}
                    className={`py-1 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A64B33] ${
                      isCurrent
                        ? 'text-[#A64B33] dark:text-[#D4785E] underline underline-offset-8 decoration-2'
                        : 'text-[#575048] dark:text-[#CBC3B6] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB] hover:underline underline-offset-8'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Zone 3: Theme Switch + Primary Action */}
            <div className="flex items-center gap-2.5 shrink-0">
              <motion.button
                type="button"
                role="switch"
                aria-checked={isDark}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                whileHover={{y: -1}}
                whileTap={{scale: 0.95}}
                transition={{duration: 0.15}}
                onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
                className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB] hover:bg-[#ECE6D9] dark:hover:bg-[#332E28] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A64B33]"
              >
                {isDark ? (
                  <>
                    <Sun className="w-4 h-4 text-[#E6B17A]" aria-hidden="true" />
                    <span className="hidden sm:inline">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-[#575048]" aria-hidden="true" />
                    <span className="hidden sm:inline">Dark</span>
                  </>
                )}
              </motion.button>

              <motion.button
                type="button"
                whileHover={{y: -1}}
                whileTap={{scale: 0.97}}
                transition={{duration: 0.15}}
                onClick={() => navigateTo('exam-hall')}
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-medium text-[#F5F2EB] dark:text-[#1E1B18] bg-[#1E1B18] hover:bg-[#332E28] dark:bg-[#F5F2EB] dark:hover:bg-[#E8E2D5] rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A64B33]"
              >
                Enter Exam Hall
              </motion.button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Live Scroll Progress Bar */}
          <motion.div
            aria-hidden="true"
            style={{scaleX: scrollScaleX}}
            className="h-[2px] w-full origin-left bg-[#A64B33] dark:bg-[#D4785E]"
          />

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{opacity: 0, y: -8}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -6}}
                transition={{duration: 0.18, ease: [0.16, 1, 0.3, 1]}}
                className="md:hidden border-t border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] px-4 py-3 space-y-1"
              >
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigateTo(item.id)}
                    className={`w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg ${
                      activeView === item.id
                        ? 'bg-[#ECE6D9] dark:bg-[#2D2621] text-[#A64B33] dark:text-[#D4785E]'
                        : 'text-[#1E1B18] dark:text-[#F5F2EB] hover:bg-[#ECE6D9]/60 dark:hover:bg-[#24201C]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <AnimatePresence mode="wait">
            {activeView === 'overview' && (
              <motion.div
                key="overview"
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -8}}
                transition={{duration: 0.2, ease: [0.16, 1, 0.3, 1]}}
                className="space-y-14"
              >
                {/* Hero Workspace Overview — Warm Editorial Monograph Composition */}
                <section className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-6 sm:p-8 lg:p-12 transition-colors duration-200">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
                    <div className="lg:col-span-7 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 text-xs font-medium tracking-[0.14em] text-[#A64B33] dark:text-[#D4785E]">
                          <span
                            className="w-6 h-px bg-[#A64B33] dark:bg-[#D4785E] shrink-0"
                            aria-hidden="true"
                          />
                          <span>Quadra 12 · CBSE Class 12 PCMB · Created by AriYan Pal (Keśava Dāsa)</span>
                        </div>

                        <h1
                          className="mt-4 font-semibold tracking-tight text-[#1E1B18] dark:text-[#F5F2EB] leading-[1.06]"
                          style={{
                            fontSize: 'clamp(2.25rem, 4.1vw, 3.5rem)',
                            textWrap: 'balance',
                          }}
                        >
                          Board mastery,{' '}
                          <em className="italic font-medium text-[#A64B33] dark:text-[#D4785E]">
                            deliberately
                          </em>{' '}
                          paced.
                        </h1>

                        <div className="mt-6 pt-6 border-t border-[#DDD6C7] dark:border-[#332E28]">
                          <p className="text-base leading-relaxed text-[#575048] dark:text-[#CBC3B6] max-w-[58ch]">
                            Track every NCERT chapter across Physics, Chemistry, Biology,
                            and Mathematics, write official CBSE 2026–27 sample papers
                            inside the 3-hour Examination Hall, and revise with the 12th
                            Hackers one-shot series.
                          </p>
                        </div>
                      </div>

                      <div className="mt-8 flex flex-wrap items-center gap-4">
                        <motion.button
                          type="button"
                          whileHover={{y: -1}}
                          whileTap={{scale: 0.97}}
                          transition={{duration: 0.15}}
                          onClick={() => navigateTo('tracker')}
                          className="inline-flex items-center gap-2.5 px-5 py-2.5 text-sm font-medium text-[#F5F2EB] dark:text-[#1E1B18] bg-[#1E1B18] hover:bg-[#332E28] dark:bg-[#F5F2EB] dark:hover:bg-[#E8E2D5] rounded-lg transition-colors whitespace-nowrap shrink-0"
                        >
                          <span>Open Subject Tracker</span>
                          <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </motion.button>

                        <motion.button
                          type="button"
                          whileHover={{y: -1}}
                          whileTap={{scale: 0.97}}
                          transition={{duration: 0.15}}
                          onClick={scrollToSubjects}
                          className="inline-flex items-center gap-2 text-sm font-medium text-[#1E1B18] dark:text-[#F5F2EB] hover:text-[#A64B33] dark:hover:text-[#D4785E] transition-colors whitespace-nowrap shrink-0"
                        >
                          <span>Explore subjects</span>
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-[#C9C1B2] dark:border-[#4A423A]">
                            <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                          </span>
                        </motion.button>
                      </div>
                    </div>

                    {/* 4-Quadrant PCMB Preview Grid with Live Scroll Parallax */}
                    <HeroPreviewQuadrant
                      onSelectSubject={() => navigateTo('tracker')}
                    />
                  </div>

                  {/* 4-Column PCMB Summary Metrics */}
                  <div className="mt-10 pt-8 border-t border-[#DDD6C7] dark:border-[#332E28] grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <p className="text-xs text-[#787066] dark:text-[#9C9387]">Overall Syllabus</p>
                      <p className="mt-1 text-2xl sm:text-3xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB] font-mono tabular-nums">
                        {overallProgress}%
                      </p>
                      <p className="mt-0.5 text-xs text-[#787066] dark:text-[#9C9387] font-mono tabular-nums">
                        {doneChapters}/{totalChapters} chapters
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#787066] dark:text-[#9C9387]">Subjects Completed</p>
                      <p className="mt-1 text-2xl sm:text-3xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB] font-mono tabular-nums">
                        {completedSubjects} / 4
                      </p>
                      <p className="mt-0.5 text-xs text-[#787066] dark:text-[#9C9387]">
                        Auto-completed at 100%
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#787066] dark:text-[#9C9387]">CBSE Sample Papers</p>
                      <p className="mt-1 text-2xl sm:text-3xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB] font-mono tabular-nums">
                        {papersAttempted} / 4
                      </p>
                      <p className="mt-0.5 text-xs text-[#787066] dark:text-[#9C9387]">
                        Full 3-hour CBSE PDFs
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#787066] dark:text-[#9C9387]">12th Hackers Watched</p>
                      <p className="mt-1 text-2xl sm:text-3xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB] font-mono tabular-nums">
                        {watchedLecturesCount} / {totalPlaylistVideos}
                      </p>
                      <p className="mt-0.5 text-xs text-[#787066] dark:text-[#9C9387]">
                        Auto-synced with Lecture done
                      </p>
                    </div>
                  </div>
                </section>

                {/* Subject Progress Grid — Selected Subjects Editorial Catalogue */}
                <section aria-labelledby="overview-subjects-heading" className="space-y-6">
                  <motion.div
                    initial={{opacity: 0, y: 14}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: false, amount: 0.2}}
                    transition={{duration: 0.28, ease: [0.16, 1, 0.3, 1]}}
                    className="pb-5 border-b border-[#DDD6C7] dark:border-[#332E28] flex flex-wrap items-end justify-between gap-4"
                  >
                    <div>
                      <p className="text-xs font-medium tracking-[0.14em] text-[#A64B33] dark:text-[#D4785E]">
                        A Closer Look
                      </p>
                      <h2
                        id="overview-subjects-heading"
                        className="mt-1.5 text-2xl sm:text-3xl font-semibold tracking-tight text-[#1E1B18] dark:text-[#F5F2EB]"
                      >
                        Subject progress by section
                      </h2>
                      <p className="mt-1 text-sm text-[#575048] dark:text-[#CBC3B6]">
                        Complete every chapter in a subject to mark that section Completed.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigateTo('tracker')}
                      className="text-sm font-medium text-[#A64B33] dark:text-[#D4785E] hover:underline whitespace-nowrap"
                    >
                      Manage all chapters →
                    </button>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                    {SUBJECTS.map((subject, idx) => {
                      const total = subject.chapters.length;
                      const done = subject.chapters.filter(
                        (ch) => completedChapters[ch.id],
                      ).length;
                      const pct = Math.round((done / total) * 100);
                      const isCompleted = done === total;
                      const best = bestScores[subject.id];
                      const indexLabel = String(idx + 1).padStart(2, '0');

                      return (
                        <motion.article
                          key={subject.id}
                          initial={{opacity: 0, y: 20}}
                          whileInView={{opacity: 1, y: 0}}
                          viewport={{once: false, amount: 0.15}}
                          whileHover={{y: -2}}
                          transition={{
                            duration: 0.3,
                            delay: idx * 0.05,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl overflow-hidden flex flex-col justify-between transition-colors duration-200"
                        >
                          <div>
                            <div className="aspect-[16/9] border-b border-[#DDD6C7] dark:border-[#332E28] bg-[#ECE6D9] dark:bg-[#24201C] overflow-hidden">
                              <ResilientImage
                                src={subject.imageUrl}
                                alt={subject.imageAlt}
                                fallbackTitle={subject.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="p-6">
                              <div className="flex items-baseline justify-between gap-4">
                                <h3 className="text-xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                                  {subject.name}
                                </h3>
                                <span className="text-xs font-mono tabular-nums text-[#787066] dark:text-[#9C9387]">
                                  {indexLabel}
                                </span>
                              </div>

                              <div className="mt-1 flex items-center justify-between gap-3">
                                <span className="text-xs tracking-wide text-[#787066] dark:text-[#9C9387] font-mono tabular-nums">
                                  Code {subject.code} · {done}/{total} Chapters
                                </span>
                                {isCompleted ? (
                                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3D6B4F] dark:text-[#7AB88F]">
                                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                                    <span>Completed</span>
                                  </span>
                                ) : (
                                  <span className="text-xs font-mono font-semibold text-[#A64B33] dark:text-[#D4785E] tabular-nums">
                                    {pct}%
                                  </span>
                                )}
                              </div>

                              <div className="mt-3.5 h-1.5 w-full bg-[#E5DFD2] dark:bg-[#2E2924] rounded-full overflow-hidden">
                                <motion.div
                                  initial={false}
                                  animate={{scaleX: pct / 100}}
                                  transition={{duration: 0.35, ease: [0.16, 1, 0.3, 1]}}
                                  className={`h-full w-full origin-left rounded-full ${
                                    isCompleted
                                      ? 'bg-[#3D6B4F] dark:bg-[#7AB88F] progress-shimmer'
                                      : 'bg-[#A64B33] dark:bg-[#D4785E]'
                                  }`}
                                />
                              </div>

                              {/* 4 Subject Study Boxes: Lecture, Practice, NCERT, PYQ */}
                              <div className="mt-4 grid grid-cols-2 gap-2">
                                {STUDY_STAGES.map((stage) => {
                                  const stageDone = subject.chapters.filter((ch) =>
                                    Boolean(chapterTasks[ch.id]?.[stage.key]),
                                  ).length;
                                  const allStageDone = total > 0 && stageDone === total;
                                  const partialStageDone =
                                    stageDone > 0 && stageDone < total;

                                  return (
                                    <button
                                      key={stage.key}
                                      type="button"
                                      role="checkbox"
                                      aria-checked={allStageDone}
                                      onClick={() =>
                                        handleToggleSubjectStage(subject.id, stage.key)
                                      }
                                      className={`flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg border text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A64B33] ${
                                        allStageDone
                                          ? 'bg-[#E8F0EA] dark:bg-[#1C2E22] border-[#3D6B4F] dark:border-[#7AB88F] text-[#23422F] dark:text-[#B6DFC3]'
                                          : 'bg-[#F5F2EB] dark:bg-[#161412] border-[#DDD6C7] dark:border-[#332E28] text-[#1E1B18] dark:text-[#F5F2EB] hover:border-[#B8AF9F] dark:hover:border-[#4A423A]'
                                      }`}
                                    >
                                      <span className="flex items-center gap-2 min-w-0">
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
                                        <span className="text-xs font-medium truncate">
                                          {stage.doneLabel}
                                        </span>
                                      </span>
                                      <span className="text-[11px] font-mono tabular-nums text-[#787066] dark:text-[#9C9387] shrink-0">
                                        {stageDone}/{total}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          <div className="px-6 py-4 border-t border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB]/60 dark:bg-[#24201C]/70 flex flex-wrap items-center justify-between gap-3">
                            <span className="text-xs text-[#787066] dark:text-[#9C9387] font-mono tabular-nums">
                              {best
                                ? `Sample Paper Best: ${best.score}/${best.totalMarks}`
                                : 'Sample paper not attempted'}
                            </span>

                            <div className="flex items-center gap-2">
                              <motion.button
                                type="button"
                                whileTap={{scale: 0.96}}
                                onClick={() => navigateTo('tracker')}
                                className="px-3 py-1.5 text-xs font-medium text-[#1E1B18] dark:text-[#F5F2EB] bg-[#FAF8F3] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#3D362F] hover:bg-[#ECE6D9] dark:hover:bg-[#332E28] rounded-lg whitespace-nowrap"
                              >
                                Update Chapters
                              </motion.button>
                              <motion.button
                                type="button"
                                whileTap={{scale: 0.96}}
                                onClick={() => handleEnterExamForSubject(subject.id)}
                                className="px-3 py-1.5 text-xs font-medium text-[#F5F2EB] dark:text-[#1E1B18] bg-[#1E1B18] hover:bg-[#332E28] dark:bg-[#F5F2EB] dark:hover:bg-[#E8E2D5] rounded-lg whitespace-nowrap"
                              >
                                Sample Paper
                              </motion.button>
                            </div>
                          </div>
                        </motion.article>
                      );
                    })}
                  </div>
                </section>

                {/* Signature Dark Espresso Editorial Feature Band (Examination Hall) */}
                <motion.section
                  initial={{opacity: 0, y: 20}}
                  whileInView={{opacity: 1, y: 0}}
                  viewport={{once: false, amount: 0.15}}
                  transition={{duration: 0.3, ease: [0.16, 1, 0.3, 1]}}
                  className="bg-[#1E1B18] dark:bg-[#24201C] text-[#F5F2EB] border border-[#332E28] rounded-xl p-8 sm:p-10 lg:p-12"
                >
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-3 text-xs font-medium tracking-[0.14em] text-[#CBC3B6]">
                      <span className="w-6 h-px bg-[#8A8075] shrink-0" aria-hidden="true" />
                      <span>Official CBSE 2026–27 SQPs · 03:00:00 Timer</span>
                    </div>

                    <h2
                      className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-[#F5F2EB] leading-[1.1]"
                      style={{textWrap: 'balance'}}
                    >
                      Inside the{' '}
                      <em className="italic font-medium text-[#D4785E]">
                        examination hall.
                      </em>
                    </h2>

                    <div className="mt-6 pt-6 border-t border-[#332E28]">
                      <p className="text-sm sm:text-base text-[#CBC3B6] leading-relaxed">
                        Write the complete, unmodified 3-hour CBSE 2026–27 Sample Question
                        Papers across Physics, Chemistry, Biology, and Mathematics. The
                        original CBSE PDF stays embedded beside an interactive 33/38
                        question OMR &amp; written checklist and instant Section A grading.
                      </p>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      <motion.button
                        type="button"
                        whileHover={{y: -1}}
                        whileTap={{scale: 0.97}}
                        onClick={() => navigateTo('exam-hall')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-[#1E1B18] bg-[#F5F2EB] hover:bg-[#E8E2D5] rounded-lg transition-colors whitespace-nowrap"
                      >
                        <FileCheck2 className="w-4 h-4" aria-hidden="true" />
                        <span>Open Examination Hall</span>
                        <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                      </motion.button>
                    </div>
                  </div>
                </motion.section>

                {/* Closing Editorial Callout Band — 12th Hackers Playlist */}
                <motion.section
                  initial={{opacity: 0, y: 20}}
                  whileInView={{opacity: 1, y: 0}}
                  viewport={{once: false, amount: 0.15}}
                  transition={{duration: 0.3, ease: [0.16, 1, 0.3, 1]}}
                  className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-8 sm:p-10 lg:p-12 transition-colors duration-200"
                >
                  <div className="max-w-xl">
                    <div className="flex items-center gap-3 text-xs font-medium tracking-[0.14em] text-[#A64B33] dark:text-[#D4785E]">
                      <span
                        className="w-6 h-px bg-[#A64B33] dark:bg-[#D4785E] shrink-0"
                        aria-hidden="true"
                      />
                      <span>Official YouTube Series · PCMB</span>
                    </div>

                    <h2
                      className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-[#1E1B18] dark:text-[#F5F2EB] leading-[1.1]"
                      style={{textWrap: 'balance'}}
                    >
                      Ready for{' '}
                      <em className="italic font-medium text-[#A64B33] dark:text-[#D4785E]">
                        one-shot
                      </em>{' '}
                      revision?
                    </h2>

                    <p className="mt-4 text-sm sm:text-base text-[#575048] dark:text-[#CBC3B6] leading-relaxed">
                      Stream the official 12th Hackers playlists for Physics, Chemistry,
                      Biology, and Mathematics with chapter formulas, timestamps, and
                      completion tracking.
                    </p>

                    <div className="mt-7">
                      <motion.button
                        type="button"
                        whileHover={{y: -1}}
                        whileTap={{scale: 0.97}}
                        onClick={() => navigateTo('hackers')}
                        className="w-full sm:w-auto min-w-[260px] inline-flex items-center justify-between gap-4 px-5 py-3 text-sm font-medium text-[#F5F2EB] dark:text-[#1E1B18] bg-[#1E1B18] hover:bg-[#332E28] dark:bg-[#F5F2EB] dark:hover:bg-[#E8E2D5] rounded-lg transition-colors whitespace-nowrap"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Play className="w-4 h-4" aria-hidden="true" />
                          <span>Open 12th Hackers Playlist</span>
                        </span>
                        <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                      </motion.button>
                    </div>
                  </div>
                </motion.section>
              </motion.div>
            )}

            {activeView === 'tracker' && (
              <motion.div
                key="tracker"
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -8}}
                transition={{duration: 0.2, ease: [0.16, 1, 0.3, 1]}}
              >
                <SubjectTrackerSection
                  completedChapters={completedChapters}
                  chapterTasks={chapterTasks}
                  onToggleChapter={handleToggleChapter}
                  onToggleChapterTask={handleToggleChapterTask}
                  onToggleSubjectStage={handleToggleSubjectStage}
                  onMarkSubjectComplete={handleMarkSubjectComplete}
                  onResetSubject={handleResetSubject}
                  onEnterExamHallForSubject={handleEnterExamForSubject}
                />
              </motion.div>
            )}

            {activeView === 'exam-hall' && (
              <motion.div
                key="exam-hall"
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -8}}
                transition={{duration: 0.2, ease: [0.16, 1, 0.3, 1]}}
              >
                <ExamHallSection
                  initialSubjectId={examTargetSubject}
                  bestScores={bestScores}
                  onSaveAttempt={handleSaveExamAttempt}
                />
              </motion.div>
            )}

            {activeView === 'hackers' && (
              <motion.div
                key="hackers"
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -8}}
                transition={{duration: 0.2, ease: [0.16, 1, 0.3, 1]}}
              >
                <HackersPlaylistSection
                  watchedLectures={watchedLectures}
                  chapterTasks={chapterTasks}
                  onToggleWatched={handleToggleWatched}
                  onSetChapterLectureDone={handleSetChapterLectureDone}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="border-t border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] py-8 mt-12 transition-colors duration-200">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div>
                  <p
                    className="text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB]"
                    style={{fontFamily: 'var(--font-display)'}}
                  >
                    Quadra 12
                  </p>
                  <p className="mt-1 text-xs text-[#787066] dark:text-[#9C9387]">
                    Class 12 CBSE Syllabus Tracker · Examination Hall · 12th Hackers Playlist
                  </p>
                  <p className="mt-1.5 text-xs font-medium text-[#575048] dark:text-[#CBC3B6]">
                    © 2026 Quadra 12 · Invented November 2026 · Creator:{' '}
                    <span className="text-[#A64B33] dark:text-[#D4785E]">
                      AriYan Pal (Keśava Dāsa)
                    </span>
                  </p>
                  <p className="mt-1.5 text-xs text-[#575048] dark:text-[#CBC3B6] leading-relaxed">
                    About the creator: I am a Class 12 student studying in Class 12. From my own real struggle to keep board prep organized, I built this app for students struggling to find one clean study tracker.
                  </p>
                </div>

                {/* Help Desk, Disclaimers & Change Request Dock anchored beside Creator attribution */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => openHelpDesk('guide')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB] hover:border-[#A64B33] transition-colors"
                  >
                    <HelpCircle
                      className="w-3.5 h-3.5 text-[#A64B33] dark:text-[#D4785E]"
                      aria-hidden="true"
                    />
                    <span>Help Desk</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openHelpDesk('about')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB] hover:border-[#A64B33] transition-colors"
                  >
                    <ShieldCheck
                      className="w-3.5 h-3.5 text-[#A64B33] dark:text-[#D4785E]"
                      aria-hidden="true"
                    />
                    <span>About &amp; Disclaimers</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openHelpDesk('suggest')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] hover:opacity-90 transition-opacity"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Suggest Addition / Change</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-[#575048] dark:text-[#CBC3B6] shrink-0">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigateTo(item.id)}
                    className="hover:text-[#1E1B18] dark:hover:text-[#F5F2EB] transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#DDD6C7]/70 dark:border-[#332E28] text-[11px] text-[#787066] dark:text-[#9C9387] leading-relaxed">
              Disclaimer: Quadra 12 is an independent Class 12 student study workspace. Official CBSE Sample Question Papers and 12th Hackers YouTube lectures belong to their respective owners and are organized here solely for revision convenience. Built by AriYan Pal (Keśava Dāsa) with partial AI-assisted development support; your study progress saves locally in your browser.
            </div>
          </div>
        </footer>

        <HelpDeskModal
          isOpen={helpDeskOpen}
          initialTab={helpDeskTab}
          onClose={() => setHelpDeskOpen(false)}
          onNavigateSection={handleHelpDeskNavigate}
        />
      </div>
    </MotionConfig>
  );
}
