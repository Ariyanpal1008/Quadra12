import {useEffect, useMemo, useState} from 'react';
import {AnimatePresence, motion, useReducedMotion} from 'motion/react';
import {
  AlertTriangle,
  Calendar,
  Clock,
  Flame,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import {APPLE_EASE, APPLE_SPRING} from './FluidPrimitives';

const STORAGE_CUSTOM_BOARD_DATE_KEY = 'pcmb_desk_custom_board_date_v1';
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

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
}

function getTargetInfo(
  nowMs: number,
  customDateIso: string | null,
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
      };
    }
  }

  // Compute current calendar year in IST (UTC+05:30) and auto-rollover on Feb 16, 10:30 AM IST
  const istNow = new Date(nowMs + IST_OFFSET_MS);
  const istYear = istNow.getUTCFullYear();
  const thisYearFeb16Ms = Date.parse(`${istYear}-02-16T10:30:00+05:30`);
  const targetYear = nowMs < thisYearFeb16Ms ? istYear : istYear + 1;
  const targetMs = Date.parse(`${targetYear}-02-16T10:30:00+05:30`);
  const prevTargetMs = Date.parse(`${targetYear - 1}-02-16T10:30:00+05:30`);

  return {
    targetYear,
    targetMs,
    prevTargetMs,
    isCustom: false,
    formattedDate: `16 Feb ${targetYear}`,
  };
}

function RollingClockTile({
  value,
  label,
  urgent = false,
}: {
  value: string;
  label: string;
  urgent?: boolean;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative w-full h-18 sm:h-22 rounded-xl overflow-hidden flex items-center justify-center border shadow-xs ${
          urgent
            ? 'bg-[#2C1815] dark:bg-[#2A1613] border-[#6E3228] dark:border-[#7A3528]'
            : 'bg-[#1E1B18] dark:bg-[#141210] border-[#332E28] dark:border-[#2E2924]'
        }`}
      >
        {/* Subtle Apple glass top highlight & split-flap center crease */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.08] to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/45"
        />

        {prefersReduced ? (
          <span className="font-mono text-2xl sm:text-4xl font-semibold tracking-tight text-[#F5F2EB] tabular-nums">
            {value}
          </span>
        ) : (
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={value}
              initial={{y: 12, opacity: 0}}
              animate={{y: 0, opacity: 1}}
              exit={{y: -12, opacity: 0}}
              transition={{duration: 0.19, ease: APPLE_EASE}}
              className="relative z-10 font-mono text-2xl sm:text-4xl font-semibold tracking-tight text-[#F5F2EB] tabular-nums"
            >
              {value}
            </motion.span>
          </AnimatePresence>
        )}
      </div>

      <span className="mt-2 text-[11px] font-mono tracking-[0.12em] uppercase text-[#787066] dark:text-[#9C9387]">
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
  const [showDateEditor, setShowDateEditor] = useState(false);
  const [draftDate, setDraftDate] = useState<string>(customDate || '2027-02-16');

  useEffect(() => {
    const tick = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => window.clearInterval(tick);
  }, []);

  const targetInfo = useMemo(
    () => getTargetInfo(nowMs, customDate),
    [nowMs, customDate],
  );

  const rawDiffMs = Math.max(0, targetInfo.targetMs - nowMs);
  const totalSecondsRemaining = Math.floor(rawDiffMs / 1000);
  const days = Math.floor(totalSecondsRemaining / 86400);
  const hours = Math.floor((totalSecondsRemaining % 86400) / 3600);
  const minutes = Math.floor((totalSecondsRemaining % 3600) / 60);
  const seconds = totalSecondsRemaining % 60;

  const yearSpanMs = Math.max(1, targetInfo.targetMs - targetInfo.prevTargetMs);
  const elapsedFraction = Math.min(
    1,
    Math.max(0, (nowMs - targetInfo.prevTargetMs) / yearSpanMs),
  );
  const elapsedPercent = Math.round(elapsedFraction * 100);

  const isCritical = days <= 30;
  const isCrunch = days > 30 && days <= 90;
  const customReached = targetInfo.isCustom && rawDiffMs === 0;

  // Dial SVG geometry
  const dialRadius = 52;
  const dialCircumference = 2 * Math.PI * dialRadius;
  const dialOffset = dialCircumference * (1 - elapsedFraction);
  const secondAngle = ((60 - seconds) % 60) * 6; // :00 lands cleanly at 12 o'clock and sweeps clockwise

  const saveCustomDate = (val: string) => {
    const trimmed = val.trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return;
    setCustomDate(trimmed);
    try {
      window.localStorage.setItem(STORAGE_CUSTOM_BOARD_DATE_KEY, trimmed);
    } catch {
      // Ignore storage quota errors
    }
    setShowDateEditor(false);
  };

  const resetToAutoFeb16 = () => {
    setCustomDate(null);
    setDraftDate(`${targetInfo.targetYear}-02-16`);
    try {
      window.localStorage.removeItem(STORAGE_CUSTOM_BOARD_DATE_KEY);
    } catch {
      // Ignore storage quota errors
    }
    setShowDateEditor(false);
  };

  const paceHint =
    remainingChapters === 0
      ? 'All 50 NCERT chapters marked complete — lock in 3-hour CBSE sample papers.'
      : days > 0
        ? `${remainingChapters} of ${totalChapters} chapters remaining across ${days} ${
            days === 1 ? 'day' : 'days'
          }.`
        : `${remainingChapters} of ${totalChapters} chapters remaining — final hours before exam bell.`;

  return (
    <section
      aria-labelledby="board-countdown-heading"
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
          <div>
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-[#A64B33] dark:text-[#D4785E]">
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                <span className="live-beacon-ring absolute inline-flex h-full w-full rounded-full bg-[#A64B33] dark:bg-[#D4785E]" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A64B33] dark:bg-[#D4785E]" />
              </span>
              <span className="tracking-[0.1em]">
                Live Board Countdown · CBSE Class XII {targetInfo.targetYear}
              </span>
              <span aria-hidden="true" className="text-[#968E83]">
                ·
              </span>
              <span className="font-mono tabular-nums text-[#575048] dark:text-[#CBC3B6]">
                {targetInfo.formattedDate} · 10:30 AM IST
              </span>
            </div>

            <h2
              id="board-countdown-heading"
              className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight text-[#1E1B18] dark:text-[#F5F2EB]"
              style={{textWrap: 'balance'}}
            >
              {customReached
                ? 'Target exam day reached — switch back to the auto cycle.'
                : days <= 30
                  ? 'Final 30 days to Class 12 Boards.'
                  : days <= 90
                    ? 'Board exam clock is ticking — final 90-day sprint.'
                    : `Every second toward CBSE Class 12 Boards ${targetInfo.targetYear}.`}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowDateEditor((prev) => !prev)}
              aria-expanded={showDateEditor}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB] hover:border-[#A64B33] dark:hover:border-[#D4785E] transition-colors whitespace-nowrap"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#A64B33] dark:text-[#D4785E]" aria-hidden="true" />
              <span>{targetInfo.isCustom ? 'Custom Date' : 'Auto: Feb 16'}</span>
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
                  <Calendar className="w-3.5 h-3.5 text-[#A64B33] dark:text-[#D4785E]" aria-hidden="true" />
                  <span>Exam Start Date Schedule</span>
                </p>
                <p className="text-xs text-[#575048] dark:text-[#CBC3B6]">
                  Auto mode targets 16 Feb at 10:30 AM IST and resets automatically to 16 Feb next year once boards start. Adjust if a year shifts date.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <input
                  type="date"
                  value={draftDate}
                  aria-label="Custom board exam start date"
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
                    onClick={resetToAutoFeb16}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] text-[#A64B33] dark:text-[#D4785E] hover:bg-[#ECE6D9] dark:hover:bg-[#332E28] whitespace-nowrap"
                  >
                    <RotateCcw className="w-3 h-3" aria-hidden="true" />
                    <span>Auto Feb 16</span>
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
                aria-label={`${days} days remaining, ${elapsedPercent} percent of annual exam cycle elapsed`}
              >
                {/* Dial tick marks (every 30 deg / 12 hour markers) */}
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

                {/* Background track */}
                <circle
                  cx="64"
                  cy="64"
                  r={dialRadius}
                  fill="none"
                  strokeWidth="6"
                  className="stroke-[#E5DFD2] dark:stroke-[#2E2924]"
                />

                {/* Annual cycle elapsed arc */}
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

                {/* Sweeping live seconds hand marker */}
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

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-mono text-2xl sm:text-3xl font-semibold tracking-tight text-[#1E1B18] dark:text-[#F5F2EB] tabular-nums leading-none">
                  {days}
                </span>
                <span className="mt-1 text-[10px] font-mono tracking-[0.12em] uppercase text-[#787066] dark:text-[#9C9387]">
                  Days Left
                </span>
              </div>
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                {isCritical ? (
                  <>
                    <AlertTriangle
                      className="w-4 h-4 text-[#B33A2B] dark:text-[#F09986] shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-[#B33A2B] dark:text-[#F09986]">
                      Final Month Alert
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

              <p className="text-xs text-[#575048] dark:text-[#CBC3B6] leading-relaxed">
                {paceHint}
              </p>

              <p className="text-[11px] font-mono tabular-nums text-[#787066] dark:text-[#9C9387]">
                {targetInfo.isCustom
                  ? `${elapsedPercent}% of custom span · Custom date active`
                  : `${elapsedPercent}% of prep year gone · Auto-resets to ${
                      targetInfo.targetYear + 1
                    } on Feb 16`}
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
              : 'Synced to Indian Standard Time (IST) · Updates live every second'}
          </p>

          <div className="flex flex-wrap items-center gap-2.5">
            {customReached && (
              <button
                type="button"
                onClick={resetToAutoFeb16}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#A64B33] text-[#F5F2EB] hover:bg-[#8E3E29] whitespace-nowrap"
              >
                Reset to Auto Feb 16 Cycle
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
    </section>
  );
}
