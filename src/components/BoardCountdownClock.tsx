import {useEffect, useMemo, useState} from 'react';
import {AnimatePresence, motion, useReducedMotion} from 'motion/react';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  RotateCcw,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {APPLE_EASE, APPLE_SPRING} from './FluidPrimitives';
import {
  CBSE_2027_DATE_SHEET,
  evaluateCbse2027Schedule,
  type EvaluatedCbseExam,
} from '../data/cbseDateSheet2027';

const STORAGE_CUSTOM_BOARD_DATE_KEY = 'pcmb_desk_custom_board_date_v1';
const STORAGE_URGENCY_DAYS_KEY = 'pcmb_desk_urgency_days_v1';
const STORAGE_SHOW_PACE_KEY = 'pcmb_desk_show_pace_v1';

function readUrgencyDays(): number {
  try {
    const raw = Number(window.localStorage.getItem(STORAGE_URGENCY_DAYS_KEY));
    if ([15, 30, 60, 90].includes(raw)) return raw;
  } catch {
    // Ignore storage read errors
  }
  return 30;
}

function readShowPaceHint(): boolean {
  try {
    const raw = window.localStorage.getItem(STORAGE_SHOW_PACE_KEY);
    return raw !== 'false';
  } catch {
    return true;
  }
}

interface BoardCountdownClockProps {
  remainingChapters: number;
  totalChapters: number;
  onOpenTracker: () => void;
  onOpenExamHall: () => void;
}

interface BoardTargetInfo {
  targetYear: number;
  targetMs: number;
  prevTargetMs: number;
  isCustom: boolean;
  formattedDate: string;
  subjectLabel: string;
  subjectCode: string;
  timeWindowLabel: string;
  activeExam: EvaluatedCbseExam | null;
}

const PREP_BASELINE_MS = Date.parse('2026-02-16T10:30:00+05:30');

function getTargetInfo(
  nowMs: number,
  customDateIso: string | null,
  activeExam: EvaluatedCbseExam | null,
): BoardTargetInfo {
  if (customDateIso && /^\d{4}-\d{2}-\d{2}$/.test(customDateIso)) {
    const parsedMs = Date.parse(`${customDateIso}T10:30:00+05:30`);
    if (Number.isFinite(parsedMs)) {
      const [yStr, mStr, dStr] = customDateIso.split('-');
      const yearNum = Number(yStr);
      const displayDate = new Date(
        Date.UTC(yearNum, Number(mStr) - 1, Number(dStr)),
      ).toLocaleDateString('en-IN', {
        timeZone: 'UTC',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      return {
        targetYear: yearNum,
        targetMs: parsedMs,
        prevTargetMs: Date.parse(`${yearNum - 1}-02-16T10:30:00+05:30`),
        isCustom: true,
        formattedDate: displayDate,
        subjectLabel: 'Custom Exam Target',
        subjectCode: 'Custom',
        timeWindowLabel: '10:30 AM IST',
        activeExam: null,
      };
    }
  }

  if (activeExam) {
    const idx = CBSE_2027_DATE_SHEET.findIndex((item) => item.id === activeExam.id);
    const prevTargetMs =
      idx > 0 ? CBSE_2027_DATE_SHEET[idx - 1].endMs : PREP_BASELINE_MS;

    return {
      targetYear: 2027,
      targetMs: activeExam.startMs,
      prevTargetMs,
      isCustom: false,
      formattedDate: activeExam.displayDayDate,
      subjectLabel: activeExam.subject,
      subjectCode: activeExam.code,
      timeWindowLabel: activeExam.timeWindowLabel,
      activeExam,
    };
  }

  const finalExam = CBSE_2027_DATE_SHEET[CBSE_2027_DATE_SHEET.length - 1];
  return {
    targetYear: 2027,
    targetMs: finalExam.endMs,
    prevTargetMs: PREP_BASELINE_MS,
    isCustom: false,
    formattedDate: finalExam.displayDayDate,
    subjectLabel: finalExam.subject,
    subjectCode: finalExam.code,
    timeWindowLabel: finalExam.timeWindowLabel,
    activeExam: null,
  };
}

export function RollingClockTile({
  value,
  label,
  urgent = false,
  compact = false,
}: {
  value: string;
  label: string;
  urgent?: boolean;
  compact?: boolean;
}) {
  const prefersReduced = useReducedMotion();
  const [{curr, prev, flipSeq}, setFlipState] = useState(() => ({
    curr: value,
    prev: value,
    flipSeq: 0,
  }));

  useEffect(() => {
    setFlipState((state) => {
      if (state.curr === value) return state;
      return {
        curr: value,
        prev: state.curr,
        flipSeq: state.flipSeq + 1,
      };
    });
  }, [value]);

  const showAnimatedFlip = !prefersReduced && flipSeq > 0;
  const staticTopValue = showAnimatedFlip ? curr : value;
  const staticBottomValue = showAnimatedFlip ? prev : value;

  const topLeafSurface = urgent
    ? 'bg-gradient-to-b from-[#361E1A] to-[#2C1815]'
    : 'bg-gradient-to-b from-[#25211D] to-[#1E1B18] dark:from-[#1C1916] dark:to-[#161412]';
  const bottomLeafSurface = urgent
    ? 'bg-gradient-to-b from-[#291613] to-[#21100E]'
    : 'bg-gradient-to-b from-[#1C1916] to-[#151210] dark:from-[#151210] dark:to-[#0F0D0B]';

  const digitClass = compact
    ? 'font-mono text-lg sm:text-2xl font-semibold tracking-tight text-[#F5F2EB] tabular-nums leading-none select-none'
    : 'font-mono text-2xl sm:text-4xl font-semibold tracking-tight text-[#F5F2EB] tabular-nums leading-none select-none';

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full">
        {/* Stacked Paper Deck Depth Base */}
        <div
          aria-hidden="true"
          className={`absolute inset-x-1.5 -bottom-[3px] h-3 rounded-b-xl border ${
            urgent
              ? 'bg-[#1B0D0B] border-[#59261E]/70'
              : 'bg-[#12100D] border-[#2C2721]/80'
          }`}
        />

        {/* 3D Split-Flap Frame */}
        <div
          className={`split-flap-stage relative w-full ${
            compact ? 'h-14 sm:h-16 rounded-lg' : 'h-18 sm:h-22 rounded-xl'
          } overflow-hidden border shadow-[0_6px_16px_-6px_rgba(20,16,12,0.5)] ${
            urgent
              ? 'bg-[#21100E] border-[#6E3228] dark:border-[#7A3528]'
              : 'bg-[#151210] border-[#332E28] dark:border-[#2E2924]'
          }`}
        >
          {/* 1. Static Top Half (New Digit revealed as old top leaf folds forward) */}
          <div
            className={`absolute inset-x-0 top-0 h-1/2 overflow-hidden ${topLeafSurface}`}
          >
            <div className="absolute inset-x-0 top-0 h-[200%] flex items-center justify-center">
              <span className={digitClass}>{staticTopValue}</span>
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-to-b from-white/[0.06] to-transparent"
            />
            {showAnimatedFlip && (
              <div
                key={`reveal-${flipSeq}`}
                aria-hidden="true"
                className="split-flap-anim-reveal-shadow pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/80"
              />
            )}
          </div>

          {/* 2. Static Bottom Half (Old Digit waiting beneath incoming bottom leaf) */}
          <div
            className={`absolute inset-x-0 bottom-0 h-1/2 overflow-hidden ${bottomLeafSurface}`}
          >
            <div className="absolute inset-x-0 -top-full h-[200%] flex items-center justify-center">
              <span className={digitClass}>{staticBottomValue}</span>
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-gradient-to-t from-black/35 to-transparent"
            />
            {showAnimatedFlip && (
              <div
                key={`under-${flipSeq}`}
                aria-hidden="true"
                className="split-flap-anim-under-shadow pointer-events-none absolute inset-0 bg-black"
              />
            )}
          </div>

          {/* 3. Animated Folding Top Leaf (Old Digit tipping forward down onto center hinge) */}
          {showAnimatedFlip && (
            <div
              key={`top-${flipSeq}`}
              aria-hidden="true"
              className={`split-flap-leaf split-flap-anim-top absolute inset-x-0 top-0 h-1/2 overflow-hidden z-10 border-b border-black/25 ${topLeafSurface}`}
            >
              <div className="absolute inset-x-0 top-0 h-[200%] flex items-center justify-center">
                <span className={digitClass}>{prev}</span>
              </div>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-to-b from-white/[0.07] to-transparent" />
              <div className="split-flap-anim-top-shadow pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 to-black/85" />
            </div>
          )}

          {/* 4. Animated Unfolding Bottom Leaf (New Digit swinging down smoothly to rest) */}
          {showAnimatedFlip && (
            <div
              key={`bot-${flipSeq}`}
              aria-hidden="true"
              className={`split-flap-leaf split-flap-anim-bottom absolute inset-x-0 bottom-0 h-1/2 overflow-hidden z-10 ${bottomLeafSurface}`}
            >
              <div className="absolute inset-x-0 -top-full h-[200%] flex items-center justify-center">
                <span className={digitClass}>{curr}</span>
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-gradient-to-t from-black/35 to-transparent" />
              <div className="split-flap-anim-bottom-shadow pointer-events-none absolute inset-0 bg-gradient-to-b from-black/75 via-black/35 to-transparent" />
            </div>
          )}

          {/* Whisper-Thin Subtle Split Crease & Matte Side Hinges */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-black/28 z-20"
          />
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-[3.5px] h-2 rounded-r-xs border-y border-r z-30 ${
              urgent
                ? 'bg-[#3A1C17] border-white/[0.06]'
                : 'bg-[#231F1B] border-white/[0.06]'
            }`}
          />
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-[3.5px] h-2 rounded-l-xs border-y border-l z-30 ${
              urgent
                ? 'bg-[#3A1C17] border-white/[0.06]'
                : 'bg-[#231F1B] border-white/[0.06]'
            }`}
          />
        </div>
      </div>

      <span
        className={
          compact
            ? 'mt-1.5 text-[10px] font-mono font-medium tracking-[0.1em] uppercase text-[#787066] dark:text-[#9C9387]'
            : 'mt-2 text-[11px] font-mono tracking-[0.12em] uppercase text-[#787066] dark:text-[#9C9387]'
        }
      >
        {label}
      </span>
    </div>
  );
}

export function BoardCountdownClock({
  remainingChapters,
  totalChapters,
  onOpenTracker,
  onOpenExamHall,
}: BoardCountdownClockProps) {
  const prefersReduced = useReducedMotion();
  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const [customDate, setCustomDate] = useState<string | null>(() => {
    try {
      return window.localStorage.getItem(STORAGE_CUSTOM_BOARD_DATE_KEY);
    } catch {
      return null;
    }
  });
  const [urgencyDays, setUrgencyDays] = useState<number>(() => readUrgencyDays());
  const [showPaceHint, setShowPaceHint] = useState<boolean>(() => readShowPaceHint());
  const [showDateEditor, setShowDateEditor] = useState(false);
  const [dateSheetOpen, setDateSheetOpen] = useState(false);
  const [draftDate, setDraftDate] = useState<string>(customDate || '2027-02-16');

  useEffect(() => {
    const tick = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    const handleDateSync = () => {
      try {
        setCustomDate(window.localStorage.getItem(STORAGE_CUSTOM_BOARD_DATE_KEY));
        setUrgencyDays(readUrgencyDays());
        setShowPaceHint(readShowPaceHint());
      } catch {
        // Ignore storage read errors
      }
    };
    window.addEventListener('pcmb-board-date-updated', handleDateSync);

    return () => {
      window.clearInterval(tick);
      window.removeEventListener('pcmb-board-date-updated', handleDateSync);
    };
  }, []);

  useEffect(() => {
    if (!dateSheetOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDateSheetOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [dateSheetOpen]);

  const scheduleState = useMemo(() => evaluateCbse2027Schedule(nowMs), [nowMs]);

  const targetInfo = useMemo(
    () => getTargetInfo(nowMs, customDate, scheduleState.activeExam),
    [nowMs, customDate, scheduleState.activeExam],
  );

  // Automatic removal once all 2027 Board Exams end (Web Application on 9 Apr 2027 at 01:30 PM IST)
  const isScheduleHidden =
    scheduleState.isExpired && (!targetInfo.isCustom || nowMs >= targetInfo.targetMs);

  useEffect(() => {
    if (isScheduleHidden && dateSheetOpen) {
      setDateSheetOpen(false);
    }
  }, [isScheduleHidden, dateSheetOpen]);

  const rawDiffMs = Math.max(0, targetInfo.targetMs - nowMs);
  const totalSecondsRemaining = Math.floor(rawDiffMs / 1000);
  const days = Math.floor(totalSecondsRemaining / 86400);
  const hours = Math.floor((totalSecondsRemaining % 86400) / 3600);
  const minutes = Math.floor((totalSecondsRemaining % 3600) / 60);
  const seconds = totalSecondsRemaining % 60;

  const spanMs = Math.max(1, targetInfo.targetMs - targetInfo.prevTargetMs);
  const elapsedFraction = Math.min(
    1,
    Math.max(0, (nowMs - targetInfo.prevTargetMs) / spanMs),
  );
  const elapsedPercent = Math.round(elapsedFraction * 100);

  const isCritical = days <= urgencyDays;
  const isCrunch = days > urgencyDays && days <= Math.max(urgencyDays + 30, 90);
  const customReached = targetInfo.isCustom && rawDiffMs === 0;
  const activeExamToday = targetInfo.activeExam?.status === 'today';
  const activeExamRunning = Boolean(targetInfo.activeExam?.isInProgress);

  // Dial SVG geometry
  const dialRadius = 52;
  const dialCircumference = 2 * Math.PI * dialRadius;
  const dialOffset = dialCircumference * (1 - elapsedFraction);
  const secondAngle = ((60 - seconds) % 60) * 6;

  const saveCustomDate = (val: string) => {
    const trimmed = val.trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return;
    setCustomDate(trimmed);
    try {
      window.localStorage.setItem(STORAGE_CUSTOM_BOARD_DATE_KEY, trimmed);
      window.dispatchEvent(new Event('pcmb-board-date-updated'));
    } catch {
      // Ignore storage quota errors
    }
    setShowDateEditor(false);
  };

  const resetToOfficial2027DateSheet = () => {
    setCustomDate(null);
    setDraftDate('2027-02-16');
    try {
      window.localStorage.removeItem(STORAGE_CUSTOM_BOARD_DATE_KEY);
      window.dispatchEvent(new Event('pcmb-board-date-updated'));
    } catch {
      // Ignore storage quota errors
    }
    setShowDateEditor(false);
  };

  const paceHint =
    remainingChapters === 0
      ? 'All 50 NCERT chapters marked complete — lock in final paper revisions.'
      : days > 0
        ? `${remainingChapters} of ${totalChapters} chapters remaining across ${days} ${
            days === 1 ? 'day' : 'days'
          }.`
        : `${remainingChapters} of ${totalChapters} chapters remaining — exam bell hours.`;

  const headingText = customReached
    ? 'Target custom exam date reached — switch back to the 2027 Date Sheet.'
    : targetInfo.isCustom
      ? `Countdown to Custom Target · ${targetInfo.formattedDate}.`
      : activeExamRunning
        ? `${targetInfo.subjectLabel} (${targetInfo.subjectCode}) in progress now.`
        : activeExamToday
          ? `Exam Today: ${targetInfo.subjectLabel} (Code ${targetInfo.subjectCode}).`
          : days <= urgencyDays
            ? `Next up: ${targetInfo.subjectLabel} (${targetInfo.subjectCode}) — Final ${urgencyDays}-day sprint.`
            : `Next up: ${targetInfo.subjectLabel} (Code ${targetInfo.subjectCode}).`;

  return (
    <section
      aria-labelledby="board-countdown-heading"
      aria-hidden={isScheduleHidden || undefined}
      style={isScheduleHidden ? {display: 'none'} : undefined}
      className="relative overflow-hidden bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-6 sm:p-8 apple-surface"
    >
      {/* Subtle Ambient Urgency Glow */}
      <div
        aria-hidden="true"
        className={`apple-ambient-orb absolute -top-24 -left-20 w-72 h-72 rounded-full ${
          isCritical
            ? 'bg-[radial-gradient(circle,rgba(179,58,43,0.14)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(240,153,134,0.14)_0%,transparent_70%)]'
            : 'bg-[radial-gradient(circle,rgba(166,75,51,0.11)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(212,120,94,0.13)_0%,transparent_70%)]'
        }`}
      />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Top Metadata & Action Row */}
        <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#DDD6C7] dark:border-[#332E28]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#A64B33] dark:text-[#D4785E]">
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                <span className="live-beacon-ring absolute inline-flex h-full w-full rounded-full bg-[#A64B33] dark:bg-[#D4785E]" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A64B33] dark:bg-[#D4785E]" />
              </span>
              <span className="tracking-[0.08em]">
                Official CBSE Class XII Date Sheet 2027
              </span>
              <span aria-hidden="true" className="text-[#968E83]">
                ·
              </span>
              <span className="font-mono tabular-nums text-[#575048] dark:text-[#CBC3B6]">
                {targetInfo.formattedDate} · {targetInfo.timeWindowLabel}
              </span>
              {!targetInfo.isCustom && (
                <>
                  <span aria-hidden="true" className="text-[#968E83]">
                    ·
                  </span>
                  <span className="font-mono tabular-nums text-[#3D6B4F] dark:text-[#7AB88F]">
                    {scheduleState.completedCount}/8 Completed
                  </span>
                </>
              )}
            </div>

            <h2
              id="board-countdown-heading"
              className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight text-[#1E1B18] dark:text-[#F5F2EB]"
              style={{textWrap: 'balance'}}
            >
              {headingText}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setDateSheetOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-[#A64B33]/40 dark:border-[#D4785E]/40 bg-[#F7EBE7] dark:bg-[#2F1D19] text-[#A64B33] dark:text-[#D4785E] hover:border-[#A64B33] dark:hover:border-[#D4785E] transition-colors whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              <span>View 2027 Date Sheet</span>
            </button>

            <button
              type="button"
              onClick={() => setShowDateEditor((prev) => !prev)}
              aria-expanded={showDateEditor}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB] hover:border-[#A64B33] dark:hover:border-[#D4785E] transition-colors whitespace-nowrap"
            >
              <SlidersHorizontal
                className="w-3.5 h-3.5 text-[#A64B33] dark:text-[#D4785E]"
                aria-hidden="true"
              />
              <span>{targetInfo.isCustom ? 'Custom Date' : 'CBSE 2027 Sync'}</span>
            </button>
          </div>
        </div>

        {/* Optional Inline Date Customizer Drawer */}
        <AnimatePresence>
          {showDateEditor && (
            <motion.div
              initial={{opacity: 0, y: -6}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -6}}
              transition={{duration: 0.18, ease: APPLE_EASE}}
              className="p-4 rounded-xl bg-[#F5F2EB] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <p className="text-xs font-semibold text-[#1E1B18] dark:text-[#F5F2EB] flex items-center gap-1.5">
                  <Calendar
                    className="w-3.5 h-3.5 text-[#A64B33] dark:text-[#D4785E]"
                    aria-hidden="true"
                  />
                  <span>Countdown Schedule Mode</span>
                </p>
                <p className="text-xs text-[#575048] dark:text-[#CBC3B6]">
                  Official CBSE 2027 mode automatically advances from Physics (16 Feb) through Web Application (9 Apr) in IST. Set a custom override date if needed.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <input
                  type="date"
                  value={draftDate}
                  aria-label="Custom board exam target date"
                  onChange={(e) => setDraftDate(e.target.value)}
                  className="px-3 py-1.5 text-xs font-mono rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] text-[#1E1B18] dark:text-[#F5F2EB]"
                />
                <button
                  type="button"
                  onClick={() => saveCustomDate(draftDate)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] hover:opacity-90 whitespace-nowrap"
                >
                  Apply Date
                </button>
                {targetInfo.isCustom && (
                  <button
                    type="button"
                    onClick={resetToOfficial2027DateSheet}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] text-[#A64B33] dark:text-[#D4785E] hover:bg-[#ECE6D9] dark:hover:bg-[#332E28] whitespace-nowrap"
                  >
                    <RotateCcw className="w-3 h-3" aria-hidden="true" />
                    <span>Official 2027 Date Sheet</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Apple StandBy Chronometer + Rolling Flip Digits */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left: Precision Watch Dial */}
          <div className="lg:col-span-4 flex items-center gap-5">
            <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
              <svg
                viewBox="0 0 128 128"
                className="w-full h-full -rotate-90"
                role="img"
                aria-label={`${days} days remaining until ${targetInfo.subjectLabel}`}
              >
                {Array.from({length: 12}).map((_, idx) => {
                  const angle = (idx * 30 * Math.PI) / 180;
                  const x1 = 64 + Math.cos(angle) * 57;
                  const y1 = 64 + Math.sin(angle) * 57;
                  const x2 = 64 + Math.cos(angle) * 61;
                  const y2 = 64 + Math.sin(angle) * 61;
                  return (
                    <line
                      key={idx}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="currentColor"
                      strokeWidth={idx % 3 === 0 ? '2' : '1'}
                      className="text-[#C9C1B2] dark:text-[#4A423A]"
                    />
                  );
                })}

                <circle
                  cx="64"
                  cy="64"
                  r={dialRadius}
                  fill="none"
                  strokeWidth="6"
                  className="stroke-[#E5DFD2] dark:stroke-[#2E2924]"
                />

                <circle
                  cx="64"
                  cy="64"
                  r={dialRadius}
                  fill="none"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={dialCircumference}
                  strokeDashoffset={dialOffset}
                  className={
                    isCritical
                      ? 'stroke-[#B33A2B] dark:stroke-[#F09986] transition-all duration-500'
                      : 'stroke-[#A64B33] dark:stroke-[#D4785E] transition-all duration-500'
                  }
                />

                {!prefersReduced && (
                  <g transform={`rotate(${secondAngle} 64 64)`}>
                    <circle
                      cx={64 + dialRadius}
                      cy="64"
                      r="3.2"
                      className="fill-[#1E1B18] dark:fill-[#F5F2EB]"
                    />
                  </g>
                )}
              </svg>

              <div
                className="absolute inset-0 flex flex-col items-center justify-center text-center"
                style={{perspective: 420}}
              >
                {prefersReduced ? (
                  <span className="font-mono text-2xl sm:text-3xl font-semibold tracking-tight text-[#1E1B18] dark:text-[#F5F2EB] tabular-nums leading-none">
                    {days}
                  </span>
                ) : (
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={days}
                      initial={{rotateX: 70, y: -4, opacity: 0}}
                      animate={{rotateX: 0, y: 0, opacity: 1}}
                      exit={{rotateX: -70, y: 4, opacity: 0}}
                      transition={{duration: 0.34, ease: APPLE_EASE}}
                      className="font-mono text-2xl sm:text-3xl font-semibold tracking-tight text-[#1E1B18] dark:text-[#F5F2EB] tabular-nums leading-none inline-block"
                    >
                      {days}
                    </motion.span>
                  </AnimatePresence>
                )}
                <span className="mt-1 text-[10px] font-mono tracking-[0.12em] uppercase text-[#787066] dark:text-[#9C9387]">
                  Days Left
                </span>
              </div>
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                {activeExamToday ? (
                  <>
                    <AlertTriangle
                      className="w-4 h-4 text-[#B33A2B] dark:text-[#F09986] shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-[#B33A2B] dark:text-[#F09986]">
                      {activeExamRunning ? 'Exam In Progress' : 'Exam Today'}
                    </span>
                  </>
                ) : isCritical ? (
                  <>
                    <AlertTriangle
                      className="w-4 h-4 text-[#B33A2B] dark:text-[#F09986] shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-[#B33A2B] dark:text-[#F09986]">
                      Final {urgencyDays}-Day Alert
                    </span>
                  </>
                ) : isCrunch ? (
                  <>
                    <Flame
                      className="w-4 h-4 text-[#A64B33] dark:text-[#D4785E] shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-[#A64B33] dark:text-[#D4785E]">
                      Crunch Window Active
                    </span>
                  </>
                ) : (
                  <>
                    <Clock
                      className="w-4 h-4 text-[#3D6B4F] dark:text-[#7AB88F] shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-[#3D6B4F] dark:text-[#7AB88F]">
                      Long-Run Preparation
                    </span>
                  </>
                )}
              </div>

              {showPaceHint && (
                <p className="text-xs text-[#575048] dark:text-[#CBC3B6] leading-relaxed">
                  {paceHint}
                </p>
              )}

              <p className="text-[11px] font-mono tabular-nums text-[#787066] dark:text-[#9C9387]">
                {targetInfo.isCustom
                  ? `${elapsedPercent}% of custom span · Custom date active`
                  : `Auto-advances across all 8 CBSE 2027 dates in IST`}
              </p>
            </div>
          </div>

          {/* Right: 4 Apple StandBy Rolling Digit Tiles */}
          <div className="lg:col-span-8 grid grid-cols-4 gap-2.5 sm:gap-4">
            <RollingClockTile
              value={String(days).padStart(2, '0')}
              label="Days"
              urgent={isCritical}
            />
            <RollingClockTile
              value={String(hours).padStart(2, '0')}
              label="Hours"
              urgent={isCritical}
            />
            <RollingClockTile
              value={String(minutes).padStart(2, '0')}
              label="Mins"
              urgent={isCritical}
            />
            <RollingClockTile
              value={String(seconds).padStart(2, '0')}
              label="Secs"
              urgent={isCritical}
            />
          </div>
        </div>

        {/* Bottom Urgency Strip with Direct Actions */}
        <div className="pt-4 border-t border-[#DDD6C7] dark:border-[#332E28] flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[#787066] dark:text-[#9C9387]">
            {customReached
              ? 'Custom exam date reached.'
              : 'Synced to Indian Standard Time (IST / UTC+5:30) · Auto-expires after 9 Apr 2027'}
          </p>

          <div className="flex flex-wrap items-center gap-2.5">
            {customReached && (
              <button
                type="button"
                onClick={resetToOfficial2027DateSheet}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#A64B33] text-[#F5F2EB] hover:bg-[#8E3E29] whitespace-nowrap"
              >
                Reset to 2027 Date Sheet
              </button>
            )}
            <motion.button
              type="button"
              whileTap={{scale: 0.96}}
              transition={APPLE_SPRING}
              onClick={onOpenTracker}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB] hover:border-[#A64B33] dark:hover:border-[#D4785E] transition-colors whitespace-nowrap"
            >
              Finish Remaining Chapters
            </motion.button>
            <motion.button
              type="button"
              whileTap={{scale: 0.96}}
              transition={APPLE_SPRING}
              onClick={onOpenExamHall}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-[#1E1B18] hover:bg-[#332E28] dark:bg-[#F5F2EB] dark:hover:bg-[#E8E2D5] text-[#F5F2EB] dark:text-[#1E1B18] transition-colors whitespace-nowrap"
            >
              Test Yourself in Exam Hall
            </motion.button>
          </div>
        </div>
      </div>

      {/* Official CBSE 2027 Date Sheet Modal */}
      <AnimatePresence>
        {dateSheetOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cbse-datesheet-modal-title"
          >
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 0.18}}
              onClick={() => setDateSheetOpen(false)}
              className="fixed inset-0 bg-[#161412]/75 backdrop-blur-xs"
              aria-hidden="true"
            />

            <motion.div
              initial={{opacity: 0, y: 18, scale: 0.97}}
              animate={{opacity: 1, y: 0, scale: 1}}
              exit={{opacity: 0, y: 12, scale: 0.97}}
              transition={APPLE_SPRING}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] shadow-2xl"
            >
              {/* Modal Header */}
              <div className="px-5 sm:px-6 py-4 border-b border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] flex items-start justify-between gap-4 shrink-0">
                <div>
                  <p className="text-[11px] font-mono tracking-[0.1em] uppercase text-[#A64B33] dark:text-[#D4785E]">
                    CBSE Class 12 Board Schedule · IST (UTC+5:30)
                  </p>
                  <h3
                    id="cbse-datesheet-modal-title"
                    className="mt-1 text-base sm:text-lg font-semibold text-[#1E1B18] dark:text-[#F5F2EB]"
                  >
                    Official CBSE 2027 Date Sheet
                  </h3>
                  <p className="mt-0.5 text-xs text-[#575048] dark:text-[#CBC3B6]">
                    {scheduleState.completedCount} of {scheduleState.exams.length} exams completed · Updates automatically in real time
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setDateSheetOpen(false)}
                  aria-label="Close 2027 Date Sheet"
                  className="p-2 rounded-lg text-[#787066] dark:text-[#9C9387] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB] hover:bg-[#DDD6C7]/35 dark:hover:bg-[#332E28]"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {/* Exam Schedule Rows */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-2.5">
                {scheduleState.exams.map((exam, idx) => {
                  const isCompleted = exam.status === 'completed';
                  const isToday = exam.status === 'today';

                  return (
                    <div
                      key={exam.id}
                      className={`rounded-xl border p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                        isToday
                          ? 'border-[#A64B33] dark:border-[#D4785E] bg-[#F7EBE7]/75 dark:bg-[#2F1D19]/65 shadow-xs'
                          : isCompleted
                            ? 'border-[#DDD6C7]/70 dark:border-[#332E28]/70 bg-[#F5F2EB]/60 dark:bg-[#161412]/50 opacity-65'
                            : exam.isNextUp
                              ? 'border-[#3D6B4F]/50 dark:border-[#7AB88F]/50 bg-[#F5F2EB] dark:bg-[#24201C]'
                              : 'border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C]'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span
                          className={`mt-0.5 w-6 h-6 rounded-md font-mono text-[11px] font-semibold flex items-center justify-center shrink-0 ${
                            isCompleted
                              ? 'bg-[#E8F0EA] dark:bg-[#1C2E22] text-[#23422F] dark:text-[#B6DFC3]'
                              : isToday
                                ? 'bg-[#A64B33] dark:bg-[#D4785E] text-[#F5F2EB] dark:text-[#161412]'
                                : 'bg-[#ECE6D9] dark:bg-[#1E1B18] text-[#575048] dark:text-[#CBC3B6]'
                          }`}
                        >
                          {String(idx + 1).padStart(2, '0')}
                        </span>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p
                              className={`text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB] ${
                                isCompleted ? 'line-through' : ''
                              }`}
                            >
                              {exam.subject}
                            </p>
                            <span className="text-[11px] font-mono text-[#787066] dark:text-[#9C9387]">
                              Code {exam.code}
                            </span>
                          </div>
                          <p
                            className={`mt-0.5 text-xs font-mono tabular-nums text-[#575048] dark:text-[#CBC3B6] ${
                              isCompleted ? 'line-through' : ''
                            }`}
                          >
                            {exam.displayDayDate} · {exam.timeWindowLabel}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#E8F0EA] dark:bg-[#1C2E22] border border-[#3D6B4F]/40 dark:border-[#7AB88F]/40 text-xs font-semibold text-[#23422F] dark:text-[#B6DFC3] whitespace-nowrap">
                            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>✓ Completed</span>
                          </span>
                        ) : isToday ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#A64B33] dark:bg-[#D4785E] text-xs font-semibold text-[#F5F2EB] dark:text-[#161412] whitespace-nowrap">
                            <span>{exam.isInProgress ? 'Exam Today · Live' : 'Exam Today'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] text-xs font-mono font-medium text-[#575048] dark:text-[#CBC3B6] whitespace-nowrap">
                            {exam.isNextUp && (
                              <span className="text-[#A64B33] dark:text-[#D4785E] font-sans font-semibold">
                                Next ·
                              </span>
                            )}
                            <span>
                              {exam.daysLeft} {exam.daysLeft === 1 ? 'Day Left' : 'Days Left'}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Modal Footer */}
              <div className="px-5 sm:px-6 py-3.5 border-t border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] flex flex-wrap items-center justify-between gap-3 shrink-0">
                <span className="text-[11px] text-[#787066] dark:text-[#9C9387]">
                  Verify official circulars anytime on <span className="font-mono">cbse.gov.in</span>
                </span>
                <button
                  type="button"
                  onClick={() => setDateSheetOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] hover:opacity-90"
                >
                  Close Date Sheet
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
