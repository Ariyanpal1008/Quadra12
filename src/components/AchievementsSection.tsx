import {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {
  ArrowUpRight,
  Award,
  CheckCircle2,
  Compass,
  Crown,
  FileCheck2,
  Flame,
  Layers,
  Lock,
  PlayCircle,
  Trophy,
  X,
  Zap,
} from 'lucide-react';
import {
  AchievementActionTarget,
  AchievementId,
  AchievementStats,
  EvaluatedAchievement,
  formatUnlockDate,
} from '../data/achievements';
import {APPLE_EASE, APPLE_SPRING, AnimatedNumber} from './FluidPrimitives';

type BadgeFilter = 'all' | 'unlocked' | 'locked';

function getBadgeIcon(id: AchievementId, className: string) {
  switch (id) {
    case 'first-step':
      return <Compass className={className} aria-hidden="true" />;
    case 'quick-learner':
      return <Zap className={className} aria-hidden="true" />;
    case 'syllabus-sprinter':
      return <Flame className={className} aria-hidden="true" />;
    case 'four-stage-master':
      return <Layers className={className} aria-hidden="true" />;
    case 'subject-finisher':
      return <Award className={className} aria-hidden="true" />;
    case 'hall-debut':
      return <FileCheck2 className={className} aria-hidden="true" />;
    case 'exam-ready':
      return <Trophy className={className} aria-hidden="true" />;
    case 'oneshot-finisher':
      return <PlayCircle className={className} aria-hidden="true" />;
    case 'quadra-grandmaster':
      return <Crown className={className} aria-hidden="true" />;
  }
}

function getSealClasses(
  tone: EvaluatedAchievement['definition']['accentTone'],
  unlocked: boolean,
): {ring: string; bar: string; label: string} {
  if (!unlocked) {
    return {
      ring: 'bg-[#ECE6D9] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#968E83] dark:text-[#787066]',
      bar: 'bg-[#A64B33] dark:bg-[#D4785E]',
      label: 'text-[#787066] dark:text-[#9C9387]',
    };
  }

  switch (tone) {
    case 'sage':
      return {
        ring: 'bg-[#E8F0EA] dark:bg-[#1C2E22] border-[#3D6B4F] dark:border-[#7AB88F] text-[#23422F] dark:text-[#7AB88F]',
        bar: 'bg-[#3D6B4F] dark:bg-[#7AB88F]',
        label: 'text-[#3D6B4F] dark:text-[#7AB88F]',
      };
    case 'amber':
      return {
        ring: 'bg-[#FBF3E4] dark:bg-[#2D2416] border-[#B7791F] dark:border-[#E6B17A] text-[#8C5A12] dark:text-[#E6B17A]',
        bar: 'bg-[#B7791F] dark:bg-[#E6B17A]',
        label: 'text-[#8C5A12] dark:text-[#E6B17A]',
      };
    case 'slate':
      return {
        ring: 'bg-[#E9ECEF] dark:bg-[#23272B] border-[#4A5568] dark:border-[#94A3B8] text-[#2D3748] dark:text-[#CBD5E1]',
        bar: 'bg-[#4A5568] dark:bg-[#94A3B8]',
        label: 'text-[#4A5568] dark:text-[#CBD5E1]',
      };
    case 'terracotta':
    default:
      return {
        ring: 'bg-[#F7EBE7] dark:bg-[#2F1D19] border-[#A64B33] dark:border-[#D4785E] text-[#A64B33] dark:text-[#D4785E]',
        bar: 'bg-[#A64B33] dark:bg-[#D4785E]',
        label: 'text-[#A64B33] dark:text-[#D4785E]',
      };
  }
}

interface AchievementsTriggerCardProps {
  achievements: EvaluatedAchievement[];
  stats: AchievementStats;
  onOpenModal: () => void;
}

export function AchievementsTriggerCard({
  achievements,
  stats,
  onOpenModal,
}: AchievementsTriggerCardProps) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalBadges = achievements.length;

  return (
    <section aria-labelledby="overview-achievements-heading">
      <motion.button
        type="button"
        onClick={onOpenModal}
        whileHover={{y: -2}}
        whileTap={{scale: 0.99}}
        transition={APPLE_SPRING}
        className="w-full text-left group bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] hover:border-[#A64B33] dark:hover:border-[#D4785E] rounded-xl p-5 sm:p-6 transition-colors apple-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A64B33]"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Left: Kicker, Title & Live Summary */}
          <div className="space-y-1.5 min-w-0">
            <p className="text-xs font-medium tracking-[0.14em] text-[#A64B33] dark:text-[#D4785E]">
              Milestones &amp; Badges
            </p>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2
                id="overview-achievements-heading"
                className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1E1B18] dark:text-[#F5F2EB]"
              >
                My Achievements
              </h2>
              <span className="text-xs font-mono tabular-nums text-[#787066] dark:text-[#9C9387]">
                {unlockedCount} / {totalBadges} Unlocked
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#575048] dark:text-[#CBC3B6]">
              Today&apos;s sprint: {stats.todayChaptersCount}/3 chapters (Quick Learner) ·{' '}
              {stats.bestExamPercentage > 90
                ? 'Exam Ready (>90%) unlocked'
                : 'Score >90% on a sample paper for Exam Ready'}
            </p>
          </div>

          {/* Right: Compact Miniature Seals Preview + Interactive CTA */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-4 shrink-0">
            <div className="flex items-center -space-x-1.5" aria-hidden="true">
              {achievements.map((item) => {
                const seal = getSealClasses(item.definition.accentTone, item.unlocked);
                return (
                  <span
                    key={item.definition.id}
                    title={item.definition.title}
                    className={`w-8 h-8 rounded-full border-2 border-[#FAF8F3] dark:border-[#1E1B18] flex items-center justify-center ring-1 ring-[#DDD6C7] dark:ring-[#332E28] ${seal.ring}`}
                  >
                    {getBadgeIcon(item.definition.id, 'w-3.5 h-3.5')}
                  </span>
                );
              })}
            </div>

            <span className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] group-hover:bg-[#A64B33] dark:group-hover:bg-[#D4785E] dark:group-hover:text-[#161412] transition-colors whitespace-nowrap shrink-0">
              <span>View Achievements</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </span>
          </div>
        </div>
      </motion.button>
    </section>
  );
}

interface AchievementsModalProps {
  isOpen: boolean;
  achievements: EvaluatedAchievement[];
  stats: AchievementStats;
  onClose: () => void;
  onNavigateTarget: (target: AchievementActionTarget) => void;
}

export function AchievementsModal({
  isOpen,
  achievements,
  stats,
  onClose,
  onNavigateTarget,
}: AchievementsModalProps) {
  const [filter, setFilter] = useState<BadgeFilter>('all');

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalBadges = achievements.length;
  const lockedCount = totalBadges - unlockedCount;
  const masteryPct = Math.round((unlockedCount / totalBadges) * 100);

  const visibleBadges = achievements.filter((item) => {
    if (filter === 'unlocked') return item.unlocked;
    if (filter === 'locked') return !item.unlocked;
    return true;
  });

  const nextToUnlock =
    achievements
      .filter((a) => !a.unlocked)
      .sort((a, b) => b.percent - a.percent)[0] ?? null;

  const handleGoToTarget = (target: AchievementActionTarget) => {
    onClose();
    onNavigateTarget(target);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="achievements-modal-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.2}}
            onClick={onClose}
            className="fixed inset-0 bg-[#161412]/70 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Modal Sheet */}
          <motion.div
            initial={{opacity: 0, y: 18, scale: 0.975}}
            animate={{opacity: 1, y: 0, scale: 1}}
            exit={{opacity: 0, y: 12, scale: 0.98}}
            transition={APPLE_SPRING}
            className="relative z-10 w-full max-w-[1040px] max-h-[90vh] flex flex-col overflow-hidden rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] text-[#1E1B18] dark:text-[#F5F2EB] shadow-2xl"
          >
            {/* Header */}
            <div className="px-5 sm:px-7 py-4 border-b border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full border border-[#B7791F] dark:border-[#E6B17A] bg-[#FBF3E4] dark:bg-[#2D2416] text-[#8C5A12] dark:text-[#E6B17A] flex items-center justify-center shrink-0">
                  <Trophy className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium tracking-[0.14em] text-[#A64B33] dark:text-[#D4785E]">
                    Milestones &amp; Badges
                  </p>
                  <h2
                    id="achievements-modal-title"
                    className="text-lg sm:text-xl font-semibold tracking-tight text-[#1E1B18] dark:text-[#F5F2EB] truncate"
                  >
                    My Achievements · {unlockedCount} / {totalBadges}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close achievements interface"
                className="w-9 h-9 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[#575048] dark:text-[#CBC3B6] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB] flex items-center justify-center shrink-0 transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
              {/* Summary Strip + Segmented Filter Tabs */}
              <div className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-5 space-y-5">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                  <div>
                    <p className="text-xs text-[#787066] dark:text-[#9C9387]">
                      Badges Unlocked
                    </p>
                    <p className="mt-1 text-2xl font-semibold font-mono tabular-nums text-[#1E1B18] dark:text-[#F5F2EB]">
                      <AnimatedNumber value={unlockedCount} /> / {totalBadges}
                    </p>
                    <p className="mt-0.5 text-xs font-mono tabular-nums text-[#787066] dark:text-[#9C9387]">
                      <AnimatedNumber value={masteryPct} suffix="%" /> complete
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#787066] dark:text-[#9C9387]">
                      Today&apos;s Chapter Sprint
                    </p>
                    <p className="mt-1 text-2xl font-semibold font-mono tabular-nums text-[#1E1B18] dark:text-[#F5F2EB]">
                      <AnimatedNumber value={stats.todayChaptersCount} />
                      <span className="text-sm font-normal text-[#787066] dark:text-[#9C9387]">
                        {' '}
                        / 3
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs font-mono tabular-nums text-[#787066] dark:text-[#9C9387]">
                      Best day: {stats.maxDailyChaptersCount} chapters
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#787066] dark:text-[#9C9387]">
                      Top Sample Paper
                    </p>
                    <p className="mt-1 text-2xl font-semibold font-mono tabular-nums text-[#1E1B18] dark:text-[#F5F2EB]">
                      {stats.papersAttemptedCount > 0
                        ? `${Math.round(stats.bestExamPercentage * 10) / 10}%`
                        : '—'}
                    </p>
                    <p className="mt-0.5 text-xs text-[#787066] dark:text-[#9C9387]">
                      {stats.bestExamPercentage > 90
                        ? 'Exam Ready (>90%) cleared'
                        : 'Score >90% for Exam Ready'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#787066] dark:text-[#9C9387]">
                      Closest Next Badge
                    </p>
                    {nextToUnlock ? (
                      <>
                        <p className="mt-1 text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB] truncate">
                          {nextToUnlock.definition.title}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            handleGoToTarget(nextToUnlock.definition.actionTarget)
                          }
                          className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[#A64B33] dark:text-[#D4785E] hover:underline whitespace-nowrap"
                        >
                          <span>{nextToUnlock.definition.actionLabel}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="mt-1 text-sm font-semibold text-[#3D6B4F] dark:text-[#7AB88F]">
                          All 9 Badges Earned
                        </p>
                        <p className="mt-0.5 text-xs text-[#787066] dark:text-[#9C9387]">
                          Full Class 12 honour roll complete
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#DDD6C7] dark:border-[#332E28] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="h-1.5 w-full bg-[#E5DFD2] dark:bg-[#2E2924] rounded-full overflow-hidden">
                      <motion.div
                        initial={false}
                        animate={{scaleX: masteryPct / 100}}
                        transition={{type: 'spring', stiffness: 120, damping: 20}}
                        className="h-full w-full origin-left rounded-full bg-[#A64B33] dark:bg-[#D4785E]"
                      />
                    </div>
                  </div>

                  <div
                    role="tablist"
                    aria-label="Filter achievement badges"
                    className="inline-flex items-center gap-1 p-1 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#ECE6D9]/70 dark:bg-[#24201C] self-start sm:self-auto shrink-0"
                  >
                    {(
                      [
                        {id: 'all', label: `All (${totalBadges})`},
                        {id: 'unlocked', label: `Unlocked (${unlockedCount})`},
                        {id: 'locked', label: `Locked (${lockedCount})`},
                      ] as {id: BadgeFilter; label: string}[]
                    ).map((tab) => {
                      const active = filter === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          onClick={() => setFilter(tab.id)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                            active
                              ? 'bg-[#FAF8F3] dark:bg-[#1E1B18] text-[#1E1B18] dark:text-[#F5F2EB] shadow-xs'
                              : 'text-[#575048] dark:text-[#CBC3B6] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB]'
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Badges Grid */}
              {visibleBadges.length === 0 ? (
                <div className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-8 text-center">
                  <p className="text-sm font-medium text-[#1E1B18] dark:text-[#F5F2EB]">
                    {filter === 'unlocked'
                      ? 'No badges unlocked yet — complete a chapter or submit a sample paper to earn your first seal.'
                      : 'Every single badge is unlocked — your Quadra 12 honour roll is complete.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setFilter('all')}
                    className="mt-3 px-4 py-2 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] text-[#1E1B18] dark:text-[#F5F2EB] hover:border-[#A64B33] transition-colors whitespace-nowrap"
                  >
                    Show all {totalBadges} badges
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {visibleBadges.map((item, idx) => {
                    const {definition, unlocked, unlockedAt, percent, progressText} =
                      item;
                    const seal = getSealClasses(definition.accentTone, unlocked);

                    return (
                      <motion.article
                        key={definition.id}
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        transition={{
                          duration: 0.24,
                          delay: Math.min(idx * 0.025, 0.18),
                          ease: APPLE_EASE,
                        }}
                        className={`rounded-xl border p-4 sm:p-5 flex flex-col justify-between gap-4 transition-colors ${
                          unlocked
                            ? 'bg-[#FAF8F3] dark:bg-[#1E1B18] border-[#C9C1B2] dark:border-[#4A423A]'
                            : 'bg-[#FAF8F3]/75 dark:bg-[#1A1714] border-[#DDD6C7] dark:border-[#2C2722]'
                        }`}
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#787066] dark:text-[#9C9387]">
                                <span>{definition.category}</span>
                                <span aria-hidden="true">·</span>
                                <span>{definition.tierLabel}</span>
                              </div>
                              <h3 className="mt-1 text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                                {definition.title}
                              </h3>
                            </div>

                            <div
                              className={`w-11 h-11 rounded-full border flex items-center justify-center shrink-0 ${seal.ring}`}
                            >
                              {getBadgeIcon(definition.id, 'w-5 h-5')}
                            </div>
                          </div>

                          <p className="text-xs leading-relaxed text-[#575048] dark:text-[#CBC3B6]">
                            {definition.description}
                          </p>
                        </div>

                        <div className="space-y-2.5 pt-3 border-t border-[#DDD6C7]/80 dark:border-[#2E2924]">
                          <div className="flex items-center justify-between gap-2 text-[11px] font-mono tabular-nums">
                            <span className="text-[#575048] dark:text-[#CBC3B6] truncate">
                              {progressText}
                            </span>
                            <span className={`font-semibold shrink-0 ${seal.label}`}>
                              {percent}%
                            </span>
                          </div>

                          <div className="h-1.5 w-full bg-[#E5DFD2] dark:bg-[#2E2924] rounded-full overflow-hidden">
                            <motion.div
                              initial={false}
                              animate={{scaleX: percent / 100}}
                              transition={{type: 'spring', stiffness: 120, damping: 20}}
                              className={`h-full w-full origin-left rounded-full ${seal.bar}`}
                            />
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-0.5 text-xs">
                            {unlocked ? (
                              <span
                                className={`inline-flex items-center gap-1.5 font-medium ${seal.label}`}
                              >
                                <CheckCircle2
                                  className="w-3.5 h-3.5 shrink-0"
                                  aria-hidden="true"
                                />
                                <span>Unlocked {formatUnlockDate(unlockedAt)}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-[#787066] dark:text-[#9C9387]">
                                <Lock
                                  className="w-3.5 h-3.5 shrink-0"
                                  aria-hidden="true"
                                />
                                <span>{definition.ruleLabel}</span>
                              </span>
                            )}

                            {!unlocked && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleGoToTarget(definition.actionTarget)
                                }
                                className="inline-flex items-center gap-1 font-medium text-[#A64B33] dark:text-[#D4785E] hover:underline whitespace-nowrap shrink-0"
                              >
                                <span>Go</span>
                                <ArrowUpRight
                                  className="w-3.5 h-3.5"
                                  aria-hidden="true"
                                />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
