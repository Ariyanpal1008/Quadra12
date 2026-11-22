import {StudyStageKey, SubjectId, SUBJECTS, STUDY_STAGES} from './pcmbData';
import type {ChapterTaskState} from './pcmbData';

export interface ExamScoreSummary {
  score: number;
  totalMarks: number;
  accuracy: number;
  timeTakenSeconds: number;
}

export type AchievementId =
  | 'first-step'
  | 'quick-learner'
  | 'syllabus-sprinter'
  | 'four-stage-master'
  | 'subject-finisher'
  | 'hall-debut'
  | 'exam-ready'
  | 'oneshot-finisher'
  | 'quadra-grandmaster';

export type AchievementCategory = 'Syllabus' | 'Velocity' | 'Mastery' | 'Examination' | 'Lectures';

export type AchievementActionTarget = 'tracker' | 'exam-hall' | 'hackers';

export interface UnlockedAchievementRecord {
  unlockedAt: string;
  detail?: string;
}

export interface AchievementStats {
  todayKey: string;
  todayChaptersCount: number;
  maxDailyChaptersCount: number;
  doneChaptersCount: number;
  totalChaptersCount: number;
  fullStageChaptersCount: number;
  completedSubjectsCount: number;
  papersAttemptedCount: number;
  bestExamPercentage: number;
  watchedLecturesCount: number;
  totalLecturesCount: number;
}

export interface AchievementDefinition {
  id: AchievementId;
  title: string;
  category: AchievementCategory;
  tierLabel: string;
  description: string;
  ruleLabel: string;
  actionLabel: string;
  actionTarget: AchievementActionTarget;
  accentTone: 'terracotta' | 'sage' | 'amber' | 'slate';
  evaluate: (stats: AchievementStats) => {
    satisfied: boolean;
    current: number;
    target: number;
    progressText: string;
    detailText?: string;
  };
}

export interface EvaluatedAchievement {
  definition: AchievementDefinition;
  unlocked: boolean;
  unlockedAt?: string;
  detailText?: string;
  current: number;
  target: number;
  percent: number;
  progressText: string;
}

export function getLocalDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function computeAchievementStats({
  completedChapters,
  chapterTasks,
  bestScores,
  dailyChapterLog,
  todayKey,
}: {
  completedChapters: Record<string, boolean>;
  chapterTasks: Record<string, ChapterTaskState>;
  bestScores: Partial<Record<SubjectId, ExamScoreSummary>>;
  dailyChapterLog: Record<string, string[]>;
  todayKey: string;
}): AchievementStats {
  const totalChaptersCount = SUBJECTS.reduce((sum, s) => sum + s.chapters.length, 0);
  const doneChaptersCount = SUBJECTS.reduce(
    (sum, s) => sum + s.chapters.filter((ch) => Boolean(completedChapters[ch.id])).length,
    0,
  );

  const fullStageChaptersCount = SUBJECTS.reduce(
    (sum, s) =>
      sum +
      s.chapters.filter((ch) =>
        STUDY_STAGES.every((stage: {key: StudyStageKey}) =>
          Boolean(chapterTasks[ch.id]?.[stage.key]),
        ),
      ).length,
    0,
  );

  const completedSubjectsCount = SUBJECTS.filter((s) =>
    s.chapters.every((ch) => Boolean(completedChapters[ch.id])),
  ).length;

  const scoreValues = Object.values(bestScores).filter(
    (item): item is ExamScoreSummary => Boolean(item),
  );
  const papersAttemptedCount = scoreValues.length;
  const bestExamPercentage = scoreValues.reduce((maxPct, item) => {
    const pct =
      item.totalMarks > 0 ? (item.score / item.totalMarks) * 100 : item.accuracy;
    return Math.max(maxPct, pct);
  }, 0);

  const watchedLecturesCount = SUBJECTS.reduce(
    (sum, s) =>
      sum +
      s.playlistVideos.filter((v) => Boolean(chapterTasks[v.chapterId]?.lecture)).length,
    0,
  );
  const totalLecturesCount = SUBJECTS.reduce(
    (sum, s) => sum + s.playlistVideos.length,
    0,
  );

  const todayChaptersCount = (dailyChapterLog[todayKey] ?? []).length;
  const maxDailyChaptersCount = Object.values(dailyChapterLog).reduce(
    (maxCount, ids) => Math.max(maxCount, Array.isArray(ids) ? ids.length : 0),
    0,
  );

  return {
    todayKey,
    todayChaptersCount,
    maxDailyChaptersCount,
    doneChaptersCount,
    totalChaptersCount,
    fullStageChaptersCount,
    completedSubjectsCount,
    papersAttemptedCount,
    bestExamPercentage,
    watchedLecturesCount,
    totalLecturesCount,
  };
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first-step',
    title: 'First Step',
    category: 'Syllabus',
    tierLabel: 'Tier I',
    description: 'Complete your first Class 12 NCERT chapter in any PCMB subject.',
    ruleLabel: '1 chapter completed',
    actionLabel: 'Open Subject Tracker',
    actionTarget: 'tracker',
    accentTone: 'sage',
    evaluate: (stats) => ({
      satisfied: stats.doneChaptersCount >= 1,
      current: Math.min(stats.doneChaptersCount, 1),
      target: 1,
      progressText:
        stats.doneChaptersCount >= 1
          ? `${stats.doneChaptersCount} chapters completed`
          : '0 / 1 chapter',
      detailText: 'Started Class 12 syllabus mastery',
    }),
  },
  {
    id: 'quick-learner',
    title: 'Quick Learner',
    category: 'Velocity',
    tierLabel: 'Daily Sprint',
    description: 'Complete 3 to 5 chapters within a single calendar day.',
    ruleLabel: '3+ chapters in one day',
    actionLabel: 'Check Chapters Today',
    actionTarget: 'tracker',
    accentTone: 'amber',
    evaluate: (stats) => {
      const peak = Math.max(stats.todayChaptersCount, stats.maxDailyChaptersCount);
      return {
        satisfied: peak >= 3,
        current: Math.min(peak, 3),
        target: 3,
        progressText:
          peak >= 3
            ? `Best day: ${peak} chapters (Today: ${stats.todayChaptersCount})`
            : `Today: ${stats.todayChaptersCount} / 3 chapters`,
        detailText: `${peak} chapters finished in one day`,
      };
    },
  },
  {
    id: 'syllabus-sprinter',
    title: 'Syllabus Sprinter',
    category: 'Velocity',
    tierLabel: 'Tier II',
    description: 'Push a single-day study sprint to 5 completed chapters.',
    ruleLabel: '5 chapters in one day',
    actionLabel: 'Boost Daily Sprint',
    actionTarget: 'tracker',
    accentTone: 'terracotta',
    evaluate: (stats) => {
      const peak = Math.max(stats.todayChaptersCount, stats.maxDailyChaptersCount);
      return {
        satisfied: peak >= 5,
        current: Math.min(peak, 5),
        target: 5,
        progressText:
          peak >= 5
            ? `Peak day: ${peak} chapters`
            : `Today: ${stats.todayChaptersCount} · Best: ${peak} / 5`,
        detailText: `${peak} chapters cleared in a single day`,
      };
    },
  },
  {
    id: 'four-stage-master',
    title: 'Four-Stage Purist',
    category: 'Mastery',
    tierLabel: 'Depth',
    description: 'Complete Lecture, Practice, NCERT, and PYQ on 5 chapters.',
    ruleLabel: '5 full 4-stage chapters',
    actionLabel: 'Complete 4 Stages',
    actionTarget: 'tracker',
    accentTone: 'sage',
    evaluate: (stats) => ({
      satisfied: stats.fullStageChaptersCount >= 5,
      current: Math.min(stats.fullStageChaptersCount, 5),
      target: 5,
      progressText: `${stats.fullStageChaptersCount} / 5 chapters at 4/4 stages`,
      detailText: `${stats.fullStageChaptersCount} chapters verified across all 4 stages`,
    }),
  },
  {
    id: 'subject-finisher',
    title: 'Subject Champion',
    category: 'Mastery',
    tierLabel: 'Tier II',
    description: 'Finish 100% of chapters in Physics, Chemistry, Biology, or Maths.',
    ruleLabel: '1 full PCMB subject',
    actionLabel: 'Finish a Subject',
    actionTarget: 'tracker',
    accentTone: 'amber',
    evaluate: (stats) => ({
      satisfied: stats.completedSubjectsCount >= 1,
      current: Math.min(stats.completedSubjectsCount, 1),
      target: 1,
      progressText: `${stats.completedSubjectsCount} / 1 subject at 100%`,
      detailText: `${stats.completedSubjectsCount} of 4 subjects completed`,
    }),
  },
  {
    id: 'hall-debut',
    title: 'Hall Debut',
    category: 'Examination',
    tierLabel: 'CBSE SQP',
    description: 'Submit your first official 2026–27 sample paper inside Examination Hall.',
    ruleLabel: '1 sample paper submitted',
    actionLabel: 'Enter Exam Hall',
    actionTarget: 'exam-hall',
    accentTone: 'slate',
    evaluate: (stats) => ({
      satisfied: stats.papersAttemptedCount >= 1,
      current: Math.min(stats.papersAttemptedCount, 1),
      target: 1,
      progressText: `${stats.papersAttemptedCount} / 4 papers attempted`,
      detailText: 'Completed an official CBSE sample paper',
    }),
  },
  {
    id: 'exam-ready',
    title: 'Exam Ready',
    category: 'Examination',
    tierLabel: 'Honours >90%',
    description: 'Score strictly above 90% on an official CBSE sample question paper.',
    ruleLabel: 'Score >90% on a paper',
    actionLabel: 'Take Sample Paper',
    actionTarget: 'exam-hall',
    accentTone: 'terracotta',
    evaluate: (stats) => {
      const roundedBest = Math.round(stats.bestExamPercentage * 10) / 10;
      const satisfied = stats.bestExamPercentage > 90;
      return {
        satisfied,
        current: satisfied ? 91 : Math.min(Math.floor(stats.bestExamPercentage), 90),
        target: 91,
        progressText:
          stats.papersAttemptedCount === 0
            ? 'No paper scored yet · Target >90%'
            : `Best score: ${roundedBest}% · Target >90%`,
        detailText: `Scored ${roundedBest}% in Examination Hall`,
      };
    },
  },
  {
    id: 'oneshot-finisher',
    title: 'One-Shot Scholar',
    category: 'Lectures',
    tierLabel: '12th Hackers',
    description: 'Complete 10 chapters of the 12th Hackers one-shot lecture series.',
    ruleLabel: '10 lectures watched',
    actionLabel: 'Watch 12th Hackers',
    actionTarget: 'hackers',
    accentTone: 'slate',
    evaluate: (stats) => ({
      satisfied: stats.watchedLecturesCount >= 10,
      current: Math.min(stats.watchedLecturesCount, 10),
      target: 10,
      progressText: `${stats.watchedLecturesCount} / 10 lectures watched`,
      detailText: `${stats.watchedLecturesCount} one-shot lectures completed`,
    }),
  },
  {
    id: 'quadra-grandmaster',
    title: 'Quadra 12 Grandmaster',
    category: 'Syllabus',
    tierLabel: 'Capstone',
    description: 'Complete all 50 chapters across Physics, Chemistry, Biology & Maths.',
    ruleLabel: 'All 50 PCMB chapters',
    actionLabel: 'Track Full Syllabus',
    actionTarget: 'tracker',
    accentTone: 'terracotta',
    evaluate: (stats) => ({
      satisfied: stats.totalChaptersCount > 0 && stats.doneChaptersCount >= stats.totalChaptersCount,
      current: stats.doneChaptersCount,
      target: stats.totalChaptersCount,
      progressText: `${stats.doneChaptersCount} / ${stats.totalChaptersCount} chapters done`,
      detailText: '100% Class 12 PCMB Syllabus Mastered',
    }),
  },
];

export function evaluateAllAchievements(
  stats: AchievementStats,
  unlockedMap: Partial<Record<AchievementId, UnlockedAchievementRecord>>,
): EvaluatedAchievement[] {
  return ACHIEVEMENTS.map((definition) => {
    const result = definition.evaluate(stats);
    const saved = unlockedMap[definition.id];
    const unlocked = Boolean(saved) || result.satisfied;
    const rawPercent =
      result.target > 0 ? Math.round((result.current / result.target) * 100) : 0;
    const percent = unlocked ? 100 : Math.min(99, Math.max(0, rawPercent));

    return {
      definition,
      unlocked,
      unlockedAt: saved?.unlockedAt,
      detailText: saved?.detail ?? (result.satisfied ? result.detailText : undefined),
      current: result.current,
      target: result.target,
      percent,
      progressText: result.progressText,
    };
  });
}

export function formatUnlockDate(iso?: string): string {
  if (!iso) return 'Unlocked';
  const ts = Date.parse(iso);
  if (!Number.isFinite(ts)) return 'Unlocked';
  return new Date(ts).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}
