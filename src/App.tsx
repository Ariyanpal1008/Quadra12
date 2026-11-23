import {useEffect, useMemo, useRef, useState} from 'react';
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
  Trophy,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  isSoundMuted,
  playAchievementChime,
  playCheckSound,
  playMasteryChime,
  playThemeSwitchSound,
  toggleSoundMuted,
  unlockAudioContext,
} from './utils/soundEffects';
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
import {TermsModal} from './components/TermsModal';
import {ResilientImage} from './components/ResilientImage';
import {BoardCountdownClock} from './components/BoardCountdownClock';
import {
  AchievementsModal,
  AchievementsTriggerCard,
} from './components/AchievementsSection';
import {
  ACHIEVEMENTS,
  AchievementActionTarget,
  AchievementId,
  UnlockedAchievementRecord,
  computeAchievementStats,
  evaluateAllAchievements,
  getLocalDateKey,
} from './data/achievements';
import {
  APPLE_EASE,
  APPLE_SPRING,
  AnimatedNumber,
  ScrollRevealBand,
} from './components/FluidPrimitives';

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
const STORAGE_DAILY_LOG_KEY = 'pcmb_desk_daily_chapter_log_v1';
const STORAGE_ACHIEVEMENTS_KEY = 'pcmb_desk_achievements_v1';

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
  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    restDelta: 0.001,
  });
  const colOneY = useTransform(smoothScroll, [0, 1], [16, -16]);
  const colTwoY = useTransform(smoothScroll, [0, 1], [-16, 16]);

  return (
    <div ref={containerRef} className="lg:col-span-5 grid grid-cols-2 gap-3.5">
      {SUBJECTS.map((subject, idx) => (
        <motion.button
          key={subject.id}
          type="button"
          onClick={() => onSelectSubject(subject.id)}
          initial={{opacity: 0, y: 18, scale: 0.96}}
          animate={{opacity: 1, y: 0, scale: 1}}
          style={{y: idx % 2 === 0 ? colOneY : colTwoY}}
          whileHover={{y: -4, scale: 1.02}}
          whileTap={{scale: 0.97}}
          transition={{
            opacity: {duration: 0.45, delay: 0.08 + idx * 0.05, ease: APPLE_EASE},
            scale: APPLE_SPRING,
            y: APPLE_SPRING,
          }}
          className="text-left group overflow-hidden rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] apple-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A64B33]"
        >
          <div className="overflow-hidden border-b border-[#DDD6C7] dark:border-[#332E28]">
            <ResilientImage
              src={subject.imageUrl}
              alt={subject.imageAlt}
              fallbackTitle={subject.name}
              className="w-full h-24 sm:h-28 object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
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
  const [achievementsModalOpen, setAchievementsModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(isSoundMuted);

  useEffect(() => {
    const handleFirstGesture = () => {
      unlockAudioContext();
    };
    window.addEventListener('click', handleFirstGesture, {once: true});
    window.addEventListener('keydown', handleFirstGesture, {once: true});
    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

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

  const [dailyChapterLog, setDailyChapterLog] = useState<Record<string, string[]>>(() =>
    readStoredJson<Record<string, string[]>>(STORAGE_DAILY_LOG_KEY, {}),
  );

  const [unlockedAchievements, setUnlockedAchievements] = useState<
    Partial<Record<AchievementId, UnlockedAchievementRecord>>
  >(() =>
    readStoredJson<Partial<Record<AchievementId, UnlockedAchievementRecord>>>(
      STORAGE_ACHIEVEMENTS_KEY,
      {},
    ),
  );

  const [recentUnlockToast, setRecentUnlockToast] = useState<{
    title: string;
    detail: string;
    extraCount: number;
  } | null>(null);

  const hasEvaluatedInitialAchievementsRef = useRef(false);

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

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_DAILY_LOG_KEY,
        JSON.stringify(dailyChapterLog),
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [dailyChapterLog]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_ACHIEVEMENTS_KEY,
        JSON.stringify(unlockedAchievements),
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [unlockedAchievements]);

  const navigateTo = (view: ActiveView) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const recordDailyChapterChanges = (
    addedIds: string[],
    removedIds: string[] = [],
  ) => {
    if (addedIds.length === 0 && removedIds.length === 0) return;
    const todayKey = getLocalDateKey();
    setDailyChapterLog((prev) => {
      const next = {...prev};
      const existingToday = Array.isArray(next[todayKey]) ? next[todayKey] : [];
      const nextTodaySet = new Set(existingToday);
      addedIds.forEach((id) => nextTodaySet.add(id));
      removedIds.forEach((id) => nextTodaySet.delete(id));
      next[todayKey] = Array.from(nextTodaySet);

      if (removedIds.length > 0) {
        const removedSet = new Set(removedIds);
        Object.keys(next).forEach((key) => {
          if (Array.isArray(next[key])) {
            next[key] = next[key].filter((id) => !removedSet.has(id));
          }
        });
      }

      return next;
    });
  };

  const handleToggleChapter = (chapterId: string) => {
    const nextDone = !completedChapters[chapterId];
    playCheckSound(nextDone);
    setCompletedChapters((prev) => {
      const next = {...prev};
      if (nextDone) {
        next[chapterId] = true;
      } else {
        delete next[chapterId];
      }
      return next;
    });
    if (nextDone) {
      recordDailyChapterChanges([chapterId]);
    } else {
      recordDailyChapterChanges([], [chapterId]);
    }
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

  const handleToggleChapterTask = (chapterId: string, stage: StudyStageKey) => {
    const current = chapterTasks[chapterId] ?? {};
    const nextState = !current[stage];
    playCheckSound(nextState);
    const updatedChapter: ChapterTaskState = {
      ...current,
      [stage]: nextState,
    };
    const nextTasks = {
      ...chapterTasks,
      [chapterId]: updatedChapter,
    };
    setChapterTasks(nextTasks);

    const allStagesDone = STUDY_STAGES.every((s) => Boolean(updatedChapter[s.key]));
    if (allStagesDone && !completedChapters[chapterId]) {
      setCompletedChapters((chPrev) =>
        chPrev[chapterId] ? chPrev : {...chPrev, [chapterId]: true},
      );
      recordDailyChapterChanges([chapterId]);
    } else if (!allStagesDone && completedChapters[chapterId]) {
      setCompletedChapters((chPrev) => {
        const chNext = {...chPrev};
        delete chNext[chapterId];
        return chNext;
      });
      recordDailyChapterChanges([], [chapterId]);
    }
    if (stage === 'lecture') {
      syncEpisodeWatchedFromTasks(nextTasks);
    }
  };

  const handleToggleSubjectStage = (subjectId: SubjectId, stage: StudyStageKey) => {
    const subject = SUBJECTS.find((s) => s.id === subjectId);
    if (!subject) return;

    const allAlreadyDone = subject.chapters.every((ch) =>
      Boolean(chapterTasks[ch.id]?.[stage]),
    );
    const nextValue = !allAlreadyDone;
    playCheckSound(nextValue);
    const nextTasks = {...chapterTasks};
    const newlyCompletedIds: string[] = [];
    const newlyUncompletedIds: string[] = [];

    subject.chapters.forEach((ch) => {
      const updatedChapter: ChapterTaskState = {
        ...(nextTasks[ch.id] ?? {}),
        [stage]: nextValue,
      };
      nextTasks[ch.id] = updatedChapter;
      const allStagesDone = STUDY_STAGES.every((s) => Boolean(updatedChapter[s.key]));
      if (allStagesDone && !completedChapters[ch.id]) {
        newlyCompletedIds.push(ch.id);
      } else if (!allStagesDone && completedChapters[ch.id]) {
        newlyUncompletedIds.push(ch.id);
      }
    });

    setChapterTasks(nextTasks);

    if (newlyCompletedIds.length > 0) {
      setCompletedChapters((chPrev) => {
        const chNext = {...chPrev};
        newlyCompletedIds.forEach((id) => {
          chNext[id] = true;
        });
        return chNext;
      });
      recordDailyChapterChanges(newlyCompletedIds);
    }
    if (newlyUncompletedIds.length > 0) {
      setCompletedChapters((chPrev) => {
        const chNext = {...chPrev};
        newlyUncompletedIds.forEach((id) => {
          delete chNext[id];
        });
        return chNext;
      });
      recordDailyChapterChanges([], newlyUncompletedIds);
    }
    if (stage === 'lecture') {
      syncEpisodeWatchedFromTasks(nextTasks);
    }
  };

  const handleMarkSubjectComplete = (subjectId: SubjectId) => {
    playMasteryChime();
    const subject = SUBJECTS.find((s) => s.id === subjectId);
    if (!subject) return;

    const newlyCompletedIds = subject.chapters
      .filter((ch) => !completedChapters[ch.id])
      .map((ch) => ch.id);

    setCompletedChapters((prev) => {
      const next = {...prev};
      subject.chapters.forEach((ch) => {
        next[ch.id] = true;
      });
      return next;
    });

    if (newlyCompletedIds.length > 0) {
      recordDailyChapterChanges(newlyCompletedIds);
    }

    const nextTasks = {...chapterTasks};
    subject.chapters.forEach((ch) => {
      nextTasks[ch.id] = {
        lecture: true,
        practice: true,
        ncert: true,
        pyq: true,
      };
    });
    setChapterTasks(nextTasks);
    syncEpisodeWatchedFromTasks(nextTasks);
  };

  const handleResetSubject = (subjectId: SubjectId) => {
    playCheckSound(false);
    const subject = SUBJECTS.find((s) => s.id === subjectId);
    if (!subject) return;

    const resetIds = subject.chapters.map((ch) => ch.id);

    setCompletedChapters((prev) => {
      const next = {...prev};
      resetIds.forEach((id) => {
        delete next[id];
      });
      return next;
    });

    recordDailyChapterChanges([], resetIds);

    const nextTasks = {...chapterTasks};
    resetIds.forEach((id) => {
      delete nextTasks[id];
    });
    setChapterTasks(nextTasks);
    syncEpisodeWatchedFromTasks(nextTasks);
  };

  const handleSetChapterLectureDone = (chapterId: string, done: boolean) => {
    if (Boolean(chapterTasks[chapterId]?.lecture) === done) {
      return;
    }
    playCheckSound(done);
    const updatedChapter: ChapterTaskState = {
      ...(chapterTasks[chapterId] ?? {}),
      lecture: done,
    };
    const nextTasks = {
      ...chapterTasks,
      [chapterId]: updatedChapter,
    };
    setChapterTasks(nextTasks);

    const allStagesDone = STUDY_STAGES.every((s) => Boolean(updatedChapter[s.key]));
    if (allStagesDone && !completedChapters[chapterId]) {
      setCompletedChapters((chPrev) =>
        chPrev[chapterId] ? chPrev : {...chPrev, [chapterId]: true},
      );
      recordDailyChapterChanges([chapterId]);
    } else if (!allStagesDone && completedChapters[chapterId]) {
      setCompletedChapters((chPrev) => {
        const chNext = {...chPrev};
        delete chNext[chapterId];
        return chNext;
      });
      recordDailyChapterChanges([], [chapterId]);
    }
    syncEpisodeWatchedFromTasks(nextTasks);
  };

  const handleToggleWatched = (lectureId: string) => {
    const episode = HACKERS_PLAYLIST.find((ep) => ep.id === lectureId);
    const nextWatched = !watchedLectures[lectureId];
    playCheckSound(nextWatched);
    setWatchedLectures((prev) => ({
      ...prev,
      [lectureId]: nextWatched,
    }));

    if (episode && episode.chapterIds.length > 0) {
      const nextTasks = {...chapterTasks};
      const newlyCompletedIds: string[] = [];
      const newlyUncompletedIds: string[] = [];
      episode.chapterIds.forEach((chId) => {
        const updatedChapter: ChapterTaskState = {
          ...(nextTasks[chId] ?? {}),
          lecture: nextWatched,
        };
        nextTasks[chId] = updatedChapter;
        const allStagesDone = STUDY_STAGES.every((s) => Boolean(updatedChapter[s.key]));
        if (allStagesDone && !completedChapters[chId]) {
          newlyCompletedIds.push(chId);
        } else if (!allStagesDone && completedChapters[chId]) {
          newlyUncompletedIds.push(chId);
        }
      });
      setChapterTasks(nextTasks);

      if (newlyCompletedIds.length > 0) {
        setCompletedChapters((chPrev) => {
          const chNext = {...chPrev};
          newlyCompletedIds.forEach((id) => {
            chNext[id] = true;
          });
          return chNext;
        });
        recordDailyChapterChanges(newlyCompletedIds);
      }
      if (newlyUncompletedIds.length > 0) {
        setCompletedChapters((chPrev) => {
          const chNext = {...chPrev};
          newlyUncompletedIds.forEach((id) => {
            delete chNext[id];
          });
          return chNext;
        });
        recordDailyChapterChanges([], newlyUncompletedIds);
      }
    }
  };

  const handleSaveExamAttempt = (
    subjectId: SubjectId,
    summary: ExamAttemptSummary,
  ) => {
    setBestScores((prev) => {
      const existing = prev[subjectId];
      const existingPct = existing
        ? existing.totalMarks > 0
          ? existing.score / existing.totalMarks
          : existing.accuracy / 100
        : -1;
      const incomingPct =
        summary.totalMarks > 0
          ? summary.score / summary.totalMarks
          : summary.accuracy / 100;
      if (!existing || incomingPct >= existingPct) {
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

  const todayKey = getLocalDateKey();
  const achievementStats = useMemo(
    () =>
      computeAchievementStats({
        completedChapters,
        chapterTasks,
        bestScores,
        dailyChapterLog,
        todayKey,
      }),
    [completedChapters, chapterTasks, bestScores, dailyChapterLog, todayKey],
  );

  const evaluatedAchievements = useMemo(
    () => evaluateAllAchievements(achievementStats, unlockedAchievements),
    [achievementStats, unlockedAchievements],
  );

  useEffect(() => {
    setUnlockedAchievements((prevMap) => {
      const nextMap: Partial<Record<AchievementId, UnlockedAchievementRecord>> = {};
      const newlyUnlocked: {
        id: AchievementId;
        title: string;
        detail: string;
      }[] = [];

      ACHIEVEMENTS.forEach((def) => {
        const result = def.evaluate(achievementStats);
        if (result.satisfied) {
          const prevRecord = prevMap[def.id];
          nextMap[def.id] = {
            unlockedAt: prevRecord?.unlockedAt ?? new Date().toISOString(),
            detail: result.detailText,
          };
          if (!prevRecord) {
            newlyUnlocked.push({
              id: def.id,
              title: def.title,
              detail: result.detailText ?? def.description,
            });
          }
        }
      });

      const prevKeys = Object.keys(prevMap);
      const nextKeys = Object.keys(nextMap);
      const hasChanged =
        prevKeys.length !== nextKeys.length ||
        prevKeys.some((k) => !nextMap[k as AchievementId]) ||
        nextKeys.some((k) => !prevMap[k as AchievementId]);

      if (!hasChanged) {
        return prevMap;
      }

      if (hasEvaluatedInitialAchievementsRef.current) {
        if (newlyUnlocked.length > 0) {
          playAchievementChime();
          const latest = newlyUnlocked[newlyUnlocked.length - 1];
          setRecentUnlockToast({
            title: latest.title,
            detail: latest.detail,
            extraCount: newlyUnlocked.length - 1,
          });
        } else {
          // If unclicked and achievement was locked, dismiss active toast
          setRecentUnlockToast(null);
        }
      }

      return nextMap;
    });

    hasEvaluatedInitialAchievementsRef.current = true;
  }, [achievementStats]);

  useEffect(() => {
    if (!recentUnlockToast) return;
    const timer = window.setTimeout(() => {
      setRecentUnlockToast(null);
    }, 6500);
    return () => window.clearTimeout(timer);
  }, [recentUnlockToast]);

  const handleOpenAchievementsModal = () => {
    setRecentUnlockToast(null);
    setAchievementsModalOpen(true);
  };

  const handleAchievementAction = (target: AchievementActionTarget) => {
    setAchievementsModalOpen(false);
    navigateTo(target);
  };

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
        <header className="sticky top-0 z-40 bg-[#FAF8F5] dark:bg-[#121212] supports-[backdrop-filter]:bg-[#FAF8F5]/96 dark:supports-[backdrop-filter]:bg-[#121212]/96 apple-glass-bar border-b border-[rgba(0,0,0,0.06)] dark:border-[#2C2C2E] transition-colors duration-300">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
            {/* Zone 1: Brand icon + wordmark */}
            <motion.button
              type="button"
              whileHover={{scale: 1.03}}
              whileTap={{scale: 0.96}}
              transition={APPLE_SPRING}
              onClick={() => navigateTo('overview')}
              className="inline-flex items-center gap-2.5 text-lg font-semibold tracking-tight text-[#1E1B18] dark:text-[#F5F2EB] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A64B33]"
              style={{fontFamily: 'var(--font-display)'}}
            >
              <img
                src={`${import.meta.env.BASE_URL}src/assets/images/quadra_12_icon_1795347655892.jpg`}
                alt="Quadra 12 emblem"
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-lg object-cover border border-[#DDD6C7] dark:border-[#332E28] shrink-0 shadow-xs"
              />
              <span>Quadra 12</span>
            </motion.button>

            {/* Zone 2: 4 concise single-line nav links with gliding spring indicator */}
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
                    className={`relative py-2 transition-colors duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A64B33] ${
                      isCurrent
                        ? 'text-[#A64B33] dark:text-[#D4785E]'
                        : 'text-[#575048] dark:text-[#CBC3B6] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB]'
                    }`}
                  >
                    {item.label}
                    {isCurrent && (
                      <motion.span
                        layoutId="primary-nav-indicator"
                        transition={APPLE_SPRING}
                        className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-[#A64B33] dark:bg-[#D4785E]"
                      />
                    )}
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
                onClick={() => {
                  const nextTheme = theme === 'dark' ? 'light' : 'dark';
                  playThemeSwitchSound(nextTheme === 'dark');
                  setTheme(nextTheme);
                }}
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

              {/* Header Mute / Unmute Toggle */}
              <motion.button
                type="button"
                role="switch"
                aria-checked={!isMuted}
                aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
                title={isMuted ? 'Sound muted (click to unmute)' : 'Sound enabled (click to mute)'}
                whileHover={{y: -1}}
                whileTap={{scale: 0.95}}
                transition={{duration: 0.15}}
                onClick={() => {
                  const nextMuted = toggleSoundMuted();
                  setIsMuted(nextMuted);
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB] hover:bg-[#ECE6D9] dark:hover:bg-[#332E28] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A64B33]"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-4 h-4 text-[#787066] dark:text-[#9C9387]" aria-hidden="true" />
                    <span className="sr-only sm:not-sr-only text-[11px] font-mono">Muted</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-[#A64B33] dark:text-[#D4785E]" aria-hidden="true" />
                    <span className="sr-only sm:not-sr-only text-[11px] font-mono">Sound</span>
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
                <div className="pt-2 mt-2 border-t border-[#DDD6C7] dark:border-[#332E28] space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openHelpDesk('about');
                    }}
                    className="w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg text-[#1E1B18] dark:text-[#F5F2EB] hover:bg-[#ECE6D9]/60 dark:hover:bg-[#24201C] flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#A64B33] dark:text-[#D4785E]" aria-hidden="true" />
                    <span>About the Creator</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openHelpDesk('guide');
                    }}
                    className="w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg text-[#575048] dark:text-[#CBC3B6] hover:bg-[#ECE6D9]/60 dark:hover:bg-[#24201C] flex items-center gap-2"
                  >
                    <HelpCircle className="w-4 h-4 text-[#A64B33] dark:text-[#D4785E]" aria-hidden="true" />
                    <span>Help Desk</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const nextMuted = toggleSoundMuted();
                      setIsMuted(nextMuted);
                    }}
                    className="w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg text-[#575048] dark:text-[#CBC3B6] hover:bg-[#ECE6D9]/60 dark:hover:bg-[#24201C] flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-[#787066] dark:text-[#9C9387]" aria-hidden="true" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-[#A64B33] dark:text-[#D4785E]" aria-hidden="true" />
                      )}
                      <span>Sound Effects</span>
                    </span>
                    <span className="text-xs font-mono text-[#787066] dark:text-[#9C9387]">
                      {isMuted ? 'Muted' : 'Enabled'}
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <AnimatePresence mode="wait">
            {activeView === 'overview' && (
              <motion.div
                key="overview"
                initial={{opacity: 0, y: 14, scale: 0.992}}
                animate={{opacity: 1, y: 0, scale: 1}}
                exit={{opacity: 0, y: -10, scale: 0.992}}
                transition={{duration: 0.3, ease: APPLE_EASE}}
                className="space-y-14"
              >
                {/* Hero Workspace Overview — Warm Editorial Monograph with Ambient Motion */}
                <section className="relative overflow-hidden bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-6 sm:p-8 lg:p-12 apple-surface">
                  <div
                    aria-hidden="true"
                    className="apple-ambient-orb absolute -top-28 -right-24 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(166,75,51,0.12)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(212,120,94,0.14)_0%,transparent_70%)]"
                  />
                  <div
                    aria-hidden="true"
                    style={{animationDelay: '-7s'}}
                    className="apple-ambient-orb absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(61,107,79,0.08)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(122,184,143,0.1)_0%,transparent_70%)]"
                  />

                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
                    <div className="lg:col-span-7 flex flex-col justify-between">
                      <div>
                        <motion.div
                          initial={{opacity: 0, y: 10}}
                          animate={{opacity: 1, y: 0}}
                          transition={{duration: 0.45, ease: APPLE_EASE}}
                          className="flex items-center gap-3 text-xs font-medium tracking-[0.14em] text-[#A64B33] dark:text-[#D4785E]"
                        >
                          <span
                            className="w-6 h-px bg-[#A64B33] dark:bg-[#D4785E] shrink-0"
                            aria-hidden="true"
                          />
                          <span>Quadra 12 · CBSE Class 12 PCMB · Created by AriYan Pal (Keśava Dāsa)</span>
                        </motion.div>

                        <motion.h1
                          initial={{opacity: 0, y: 14}}
                          animate={{opacity: 1, y: 0}}
                          transition={{duration: 0.52, delay: 0.06, ease: APPLE_EASE}}
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
                        </motion.h1>

                        <motion.div
                          initial={{opacity: 0, y: 12}}
                          animate={{opacity: 1, y: 0}}
                          transition={{duration: 0.52, delay: 0.12, ease: APPLE_EASE}}
                          className="mt-6 pt-6 border-t border-[#DDD6C7] dark:border-[#332E28]"
                        >
                          <p className="text-base leading-relaxed text-[#575048] dark:text-[#CBC3B6] max-w-[58ch]">
                            Track every NCERT chapter across Physics, Chemistry, Biology,
                            and Mathematics, write official CBSE 2026–27 sample papers
                            inside the 3-hour Examination Hall, and revise with the 12th
                            Hackers one-shot series.
                          </p>
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{opacity: 0, y: 12}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5, delay: 0.18, ease: APPLE_EASE}}
                        className="mt-8 flex flex-wrap items-center gap-4"
                      >
                        <motion.button
                          type="button"
                          whileHover={{y: -2, scale: 1.015}}
                          whileTap={{scale: 0.965}}
                          transition={APPLE_SPRING}
                          onClick={() => navigateTo('tracker')}
                          className="inline-flex items-center gap-2.5 px-5 py-2.5 text-sm font-medium text-[#F5F2EB] dark:text-[#1E1B18] bg-[#1E1B18] hover:bg-[#332E28] dark:bg-[#F5F2EB] dark:hover:bg-[#E8E2D5] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
                        >
                          <span>Open Subject Tracker</span>
                          <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </motion.button>

                        <motion.button
                          type="button"
                          whileHover={{y: -1}}
                          whileTap={{scale: 0.97}}
                          transition={APPLE_SPRING}
                          onClick={scrollToSubjects}
                          className="group inline-flex items-center gap-2 text-sm font-medium text-[#1E1B18] dark:text-[#F5F2EB] hover:text-[#A64B33] dark:hover:text-[#D4785E] transition-colors whitespace-nowrap shrink-0"
                        >
                          <span>Explore subjects</span>
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-[#C9C1B2] dark:border-[#4A423A] transition-transform duration-300 group-hover:translate-y-0.5">
                            <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                          </span>
                        </motion.button>
                      </motion.div>
                    </div>

                    {/* 4-Quadrant PCMB Preview Grid with Live Scroll Parallax */}
                    <HeroPreviewQuadrant
                      onSelectSubject={() => navigateTo('tracker')}
                    />
                  </div>

                  {/* 4-Column PCMB Summary Metrics with Live Spring Counters */}
                  <div className="relative z-10 mt-10 pt-8 border-t border-[#DDD6C7] dark:border-[#332E28] grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <p className="text-xs text-[#787066] dark:text-[#9C9387]">Overall Syllabus</p>
                      <p className="mt-1 text-2xl sm:text-3xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB] font-mono tabular-nums">
                        <AnimatedNumber value={overallProgress} suffix="%" />
                      </p>
                      <p className="mt-0.5 text-xs text-[#787066] dark:text-[#9C9387] font-mono tabular-nums">
                        <AnimatedNumber value={doneChapters} />/{totalChapters} chapters
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#787066] dark:text-[#9C9387]">Subjects Completed</p>
                      <p className="mt-1 text-2xl sm:text-3xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB] font-mono tabular-nums">
                        <AnimatedNumber value={completedSubjects} /> / 4
                      </p>
                      <p className="mt-0.5 text-xs text-[#787066] dark:text-[#9C9387]">
                        Auto-completed at 100%
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#787066] dark:text-[#9C9387]">CBSE Sample Papers</p>
                      <p className="mt-1 text-2xl sm:text-3xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB] font-mono tabular-nums">
                        <AnimatedNumber value={papersAttempted} /> / 4
                      </p>
                      <p className="mt-0.5 text-xs text-[#787066] dark:text-[#9C9387]">
                        Full 3-hour CBSE PDFs
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#787066] dark:text-[#9C9387]">12th Hackers Watched</p>
                      <p className="mt-1 text-2xl sm:text-3xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB] font-mono tabular-nums">
                        <AnimatedNumber value={watchedLecturesCount} /> / {totalPlaylistVideos}
                      </p>
                      <p className="mt-0.5 text-xs text-[#787066] dark:text-[#9C9387]">
                        Auto-synced with Lecture done
                      </p>
                    </div>
                  </div>
                </section>

                {/* Live Apple StandBy–Inspired Board Exam Countdown Clock */}
                <BoardCountdownClock
                  remainingChapters={totalChapters - doneChapters}
                  totalChapters={totalChapters}
                  onOpenTracker={() => navigateTo('tracker')}
                  onOpenExamHall={() => navigateTo('exam-hall')}
                />

                {/* Subject Progress Grid — Selected Subjects Editorial Catalogue */}
                <section aria-labelledby="overview-subjects-heading" className="space-y-6">
                  <motion.div
                    initial={{opacity: 0, y: 14}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true, amount: 0.1}}
                    transition={{duration: 0.28, ease: APPLE_EASE}}
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
                          viewport={{once: true, amount: 0.06}}
                          whileHover={{y: -4}}
                          transition={{
                            duration: 0.48,
                            delay: idx * 0.06,
                            ease: APPLE_EASE,
                            y: APPLE_SPRING,
                          }}
                          className="group bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl overflow-hidden flex flex-col justify-between apple-surface"
                        >
                          <div>
                            <div className="aspect-[16/9] border-b border-[#DDD6C7] dark:border-[#332E28] bg-[#ECE6D9] dark:bg-[#24201C] overflow-hidden">
                              <ResilientImage
                                src={subject.imageUrl}
                                alt={subject.imageAlt}
                                fallbackTitle={subject.name}
                                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
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
                                    <AnimatedNumber value={pct} suffix="%" />
                                  </span>
                                )}
                              </div>

                              <div className="mt-3.5 h-1.5 w-full bg-[#E5DFD2] dark:bg-[#2E2924] rounded-full overflow-hidden">
                                <motion.div
                                  initial={false}
                                  animate={{scaleX: pct / 100}}
                                  transition={{type: 'spring', stiffness: 120, damping: 20}}
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
                                    <motion.button
                                      key={stage.key}
                                      type="button"
                                      role="checkbox"
                                      aria-checked={allStageDone}
                                      whileTap={{scale: 0.95}}
                                      transition={APPLE_SPRING}
                                      onClick={() =>
                                        handleToggleSubjectStage(subject.id, stage.key)
                                      }
                                      className={`flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg border text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A64B33] ${
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
                                        <span className="text-xs font-medium truncate">
                                          {stage.doneLabel}
                                        </span>
                                      </span>
                                      <span className="text-[11px] font-mono tabular-nums text-[#787066] dark:text-[#9C9387] shrink-0">
                                        {stageDone}/{total}
                                      </span>
                                    </motion.button>
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

                {/* Compact Milestones & Badges Trigger Card — Opens Full Achievements Interface on Tap */}
                <AchievementsTriggerCard
                  achievements={evaluatedAchievements}
                  stats={achievementStats}
                  onOpenModal={() => setAchievementsModalOpen(true)}
                />

                {/* Signature Dark Espresso Editorial Feature Band (Examination Hall) with Scroll Scale Reveal */}
                <ScrollRevealBand>
                  <section className="relative overflow-hidden bg-[#1E1B18] dark:bg-[#24201C] text-[#F5F2EB] border border-[#332E28] rounded-xl p-8 sm:p-10 lg:p-12 apple-surface">
                    <div
                      aria-hidden="true"
                      className="apple-ambient-orb absolute -top-24 -right-16 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(212,120,94,0.18)_0%,transparent_70%)]"
                    />
                    <div className="relative z-10 max-w-2xl">
                      <div className="flex items-center gap-3 text-xs font-medium tracking-[0.14em] text-[#CBC3B6]">
                        <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                          <span className="live-beacon-ring absolute inline-flex h-full w-full rounded-full bg-[#D4785E]" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4785E]" />
                        </span>
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
                          whileHover={{y: -2, scale: 1.015}}
                          whileTap={{scale: 0.965}}
                          transition={APPLE_SPRING}
                          onClick={() => navigateTo('exam-hall')}
                          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-[#1E1B18] bg-[#F5F2EB] hover:bg-[#E8E2D5] rounded-lg transition-colors whitespace-nowrap"
                        >
                          <FileCheck2 className="w-4 h-4" aria-hidden="true" />
                          <span>Open Examination Hall</span>
                          <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                        </motion.button>
                      </div>
                    </div>
                  </section>
                </ScrollRevealBand>

                {/* Closing Editorial Callout Band — 12th Hackers Playlist with Scroll Scale Reveal */}
                <ScrollRevealBand>
                  <section className="relative overflow-hidden bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-8 sm:p-10 lg:p-12 apple-surface">
                    <div
                      aria-hidden="true"
                      style={{animationDelay: '-4s'}}
                      className="apple-ambient-orb absolute -bottom-24 -right-16 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(166,75,51,0.1)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(212,120,94,0.12)_0%,transparent_70%)]"
                    />
                    <div className="relative z-10 max-w-xl">
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
                          whileHover={{y: -2, scale: 1.015}}
                          whileTap={{scale: 0.965}}
                          transition={APPLE_SPRING}
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
                  </section>
                </ScrollRevealBand>
              </motion.div>
            )}

            {activeView === 'tracker' && (
              <motion.div
                key="tracker"
                initial={{opacity: 0, y: 14, scale: 0.992}}
                animate={{opacity: 1, y: 0, scale: 1}}
                exit={{opacity: 0, y: -10, scale: 0.992}}
                transition={{duration: 0.28, ease: APPLE_EASE}}
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
                initial={{opacity: 0, y: 14, scale: 0.992}}
                animate={{opacity: 1, y: 0, scale: 1}}
                exit={{opacity: 0, y: -10, scale: 0.992}}
                transition={{duration: 0.28, ease: APPLE_EASE}}
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
                initial={{opacity: 0, y: 14, scale: 0.992}}
                animate={{opacity: 1, y: 0, scale: 1}}
                exit={{opacity: 0, y: -10, scale: 0.992}}
                transition={{duration: 0.28, ease: APPLE_EASE}}
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
                  <div className="flex items-center gap-2.5">
                    <img
                      src={`${import.meta.env.BASE_URL}src/assets/images/quadra_12_icon_1795347655892.jpg`}
                      alt="Quadra 12 emblem"
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-lg object-cover border border-[#DDD6C7] dark:border-[#332E28] shrink-0"
                    />
                    <p
                      className="text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB]"
                      style={{fontFamily: 'var(--font-display)'}}
                    >
                      Quadra 12
                    </p>
                  </div>
                  <p className="mt-1.5 text-xs text-[#787066] dark:text-[#9C9387]">
                    Class 12 CBSE Syllabus Tracker · Examination Hall · 12th Hackers Playlist
                  </p>
                </div>
                {/* Help Desk, Disclaimers & Change Request Dock */}
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB] hover:border-[#A64B33] transition-colors whitespace-nowrap"
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] hover:opacity-90 transition-opacity whitespace-nowrap"
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

            {/* Coming in 2027 Announcement Card */}
            <div className="my-4 rounded-[12px] p-[14px_16px] bg-[#F2EFE9] dark:bg-[#1C1C1E] border border-[#E2DDD5] dark:border-[#2C2C2E] flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3.5 transition-colors">
              <span className="inline-flex items-center justify-center bg-[#1E1E1E] text-[#FFFFFF] text-[11px] font-medium px-2.5 py-0.5 rounded-full shrink-0 self-start sm:self-center">
                New Subjects in 2027
              </span>
              <p className="text-xs sm:text-[13px] text-[#5C5C5C] dark:text-[#A1A1A6] leading-relaxed">
                Currently focused on 2026–27 Board Exams. English Core, Physical Education, Computer Science, Fine Arts &amp; more will be added right after exams!
              </p>
            </div>

            <div className="pt-4 border-t border-[#DDD6C7]/70 dark:border-[#332E28] space-y-1.5 text-[11px] text-[#787066] dark:text-[#9C9387]">
              <p className="font-medium text-[#1E1B18] dark:text-[#F5F2EB]">
                © 2026 Quadra 12 · <span className="font-semibold text-[#A64B33] dark:text-[#D4785E]">Creator: AriYan Pal (Keśava Dāsa)</span>
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setTermsModalOpen(true)}
                  className="font-mono text-[11px] text-[#486581] dark:text-[#829AB1] hover:text-[#2E475D] dark:hover:text-[#BCCCDC] underline underline-offset-2 transition-colors cursor-pointer text-left"
                >
                  Terms &amp; Conditions · 2026
                </button>
                <a
                  href="https://github.com/Ariyanpal1008/Quadra12"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub repository"
                  className="group inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#1E1B18] dark:text-[#F5F2EB] hover:text-[#A64B33] dark:hover:text-[#D4785E] transition-colors"
                >
                  <img
                    src={`${import.meta.env.BASE_URL}assets/aistudio/Octicons-mark-github_12794390.svg`}
                    alt="GitHub"
                    className="w-4 h-4 dark:invert shrink-0 transition-transform duration-200 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <span className="font-bold underline underline-offset-2">GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </footer>

        <HelpDeskModal
          isOpen={helpDeskOpen}
          initialTab={helpDeskTab}
          onClose={() => setHelpDeskOpen(false)}
          onNavigateSection={handleHelpDeskNavigate}
        />

        <AchievementsModal
          isOpen={achievementsModalOpen}
          achievements={evaluatedAchievements}
          stats={achievementStats}
          onClose={() => setAchievementsModalOpen(false)}
          onNavigateTarget={handleAchievementAction}
        />

        <TermsModal
          isOpen={termsModalOpen}
          onClose={() => setTermsModalOpen(false)}
        />

        {/* Non-intrusive Live Achievement Unlock Toast */}
        <AnimatePresence>
          {recentUnlockToast && (
            <motion.aside
              role="status"
              aria-live="polite"
              initial={{opacity: 0, y: 20, scale: 0.96}}
              animate={{opacity: 1, y: 0, scale: 1}}
              exit={{opacity: 0, y: 14, scale: 0.96}}
              transition={APPLE_SPRING}
              className="fixed bottom-4 right-4 z-50 w-[min(360px,calc(100vw-2rem))] rounded-xl border border-[#C9C1B2] dark:border-[#4A423A] bg-[#FAF8F3] dark:bg-[#1E1B18] p-4 shadow-lg"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full border border-[#B7791F] dark:border-[#E6B17A] bg-[#FBF3E4] dark:bg-[#2D2416] text-[#8C5A12] dark:text-[#E6B17A] flex items-center justify-center shrink-0">
                  <Trophy className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-mono text-[#A64B33] dark:text-[#D4785E]">
                    Achievement Unlocked
                    {recentUnlockToast.extraCount > 0
                      ? ` · +${recentUnlockToast.extraCount} more`
                      : ''}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB] truncate">
                    {recentUnlockToast.title}
                  </p>
                  <p className="mt-0.5 text-xs text-[#575048] dark:text-[#CBC3B6] line-clamp-2">
                    {recentUnlockToast.detail}
                  </p>
                  <div className="mt-2.5 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleOpenAchievementsModal}
                      className="text-xs font-medium text-[#A64B33] dark:text-[#D4785E] hover:underline whitespace-nowrap"
                    >
                      View Badges →
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecentUnlockToast(null)}
                      className="text-xs text-[#787066] dark:text-[#9C9387] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB] whitespace-nowrap"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRecentUnlockToast(null)}
                  aria-label="Dismiss achievement notification"
                  className="text-[#787066] dark:text-[#9C9387] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB] p-1 rounded-md shrink-0"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
