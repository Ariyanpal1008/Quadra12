import {useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  FileCheck2,
  Play,
  RotateCcw,
  Trophy,
  Zap,
} from 'lucide-react';
import {APPLE_EASE, APPLE_SPRING} from './FluidPrimitives';

export type TourTargetSection = 'overview' | 'subjects' | 'exam' | 'hackers';

type TourStepId =
  | 'clock'
  | 'achievements'
  | 'tracker'
  | 'exam'
  | 'hackers';

interface InteractiveTourTabProps {
  onJumpToSection: (section: TourTargetSection) => void;
}

const TOUR_STEPS: {
  id: TourStepId;
  stepNum: string;
  label: string;
  title: string;
  summary: string;
  targetSection: TourTargetSection;
  ctaLabel: string;
  hotspots: {label: string; detail: string}[];
}[] = [
  {
    id: 'clock',
    stepNum: '01',
    label: 'Board Clock',
    title: 'Live Apple-Style Board Countdown Clock',
    summary:
      'Counts every second down to CBSE Class 12 Boards (16 Feb, 10:30 AM IST) and resets automatically to next year once exam day starts.',
    targetSection: 'overview',
    ctaLabel: 'Open Board Clock on Overview',
    hotspots: [
      {
        label: 'Auto Rollover (Feb 16)',
        detail: 'Switches seamlessly from 2027 → 2028 on Feb 16 at 10:30 AM IST.',
      },
      {
        label: 'Custom Date Toggle',
        detail: 'Tap Auto: Feb 16 if CBSE shifts a future exam start date.',
      },
      {
        label: 'Pace Alert Tiers',
        detail: 'Transitions from Long-Run (>90d) → Crunch (≤90d) → Final Month (≤30d).',
      },
    ],
  },
  {
    id: 'achievements',
    stepNum: '02',
    label: 'Achievements',
    title: 'My Achievements & Milestone Seals',
    summary:
      'Tap the compact My Achievements card on Overview to open all 9 badges, track daily sprint velocity, and monitor >90% exam mastery.',
    targetSection: 'overview',
    ctaLabel: 'Open Overview & My Achievements',
    hotspots: [
      {
        label: 'Quick Learner',
        detail: 'Completing 3–5 chapters in a single calendar day unlocks this seal.',
      },
      {
        label: 'Exam Ready',
        detail: 'Scoring strictly >90% on any official sample paper unlocks Exam Ready.',
      },
      {
        label: 'Live Unlock Toast',
        detail: 'Pops cleanly at the bottom-right from any tab the moment you qualify.',
      },
    ],
  },
  {
    id: 'tracker',
    stepNum: '03',
    label: 'Subject Tracker',
    title: '50 NCERT Chapters × 4 Study Checkpoints',
    summary:
      'Every chapter across Physics (14), Chemistry (10), Biology (13), and Maths (13) includes 4 checkboxes plus a custom SVG diagram plate.',
    targetSection: 'subjects',
    ctaLabel: 'Open Subject Tracker',
    hotspots: [
      {
        label: '4-Stage Checklist',
        detail: 'Lecture done, Practice done, NCERT done, and PYQ done per chapter.',
      },
      {
        label: 'Bulk Subject Bar',
        detail: 'Toggle an entire study stage across a full subject in one click.',
      },
      {
        label: '50 SVG Diagrams',
        detail: 'Click any chapter card or plate to inspect its dedicated study diagram.',
      },
    ],
  },
  {
    id: 'exam',
    stepNum: '04',
    label: 'Exam Hall',
    title: '3-Hour CBSE Sample Papers & Live OMR',
    summary:
      'Write full official CBSE 2026–27 papers side-by-side with a 03:00:00 timer, instant Section A OMR grading, and best score saving.',
    targetSection: 'exam',
    ctaLabel: 'Enter Examination Hall',
    hotspots: [
      {
        label: 'Embedded CBSE PDFs',
        detail: 'Read unmodified official SQPs inline or download PDFs offline.',
      },
      {
        label: 'Interactive OMR Bubbles',
        detail: 'Tap A/B/C/D for Section A to grade automatically against CBSE keys.',
      },
      {
        label: 'Best Score Tracker',
        detail: 'Saves your highest percentage and triggers Exam Ready above 90%.',
      },
    ],
  },
  {
    id: 'hackers',
    stepNum: '05',
    label: '12th Hackers',
    title: '50 One-Shot Lectures Synced to Tracker',
    summary:
      'Stream chapter lectures with unit formulas and timestamps; marking a video done automatically checks Lecture done in Subject Tracker.',
    targetSection: 'hackers',
    ctaLabel: 'Open 12th Hackers',
    hotspots: [
      {
        label: 'Bidirectional Sync',
        detail: 'Watching or marking a lecture updates Subject Tracker automatically.',
      },
      {
        label: '3 Embed Modes',
        detail: 'Switch between Standard, Pure Embed, and No-Cookie if a network blocks YouTube.',
      },
      {
        label: 'Mark Done & Next',
        detail: 'Watch externally on YouTube and advance to the next chapter in one tap.',
      },
    ],
  },
];

export function InteractiveTourTab({onJumpToSection}: InteractiveTourTabProps) {
  const [stepIdx, setStepIdx] = useState(0);
  const [activeHotspotIdx, setActiveHotspotIdx] = useState(0);

  // Ephemeral interactive preview states (never mutates student's saved localStorage)
  const [simClockUrgent, setSimClockUrgent] = useState(false);
  const [simDailyChapters, setSimDailyChapters] = useState(2);
  const [simExamPct, setSimExamPct] = useState(88);
  const [simStages, setSimStages] = useState({
    lecture: true,
    practice: true,
    ncert: false,
    pyq: false,
  });
  const [simOmrPick, setSimOmrPick] = useState<'A' | 'B' | 'C' | 'D' | null>('B');
  const [simEmbedMode, setSimEmbedMode] = useState<'Standard' | 'Pure Embed' | 'No-Cookie'>('Standard');
  const [simLectureDone, setSimLectureDone] = useState(false);

  const currentStep = TOUR_STEPS[stepIdx];
  const activeHotspot = currentStep.hotspots[activeHotspotIdx] ?? currentStep.hotspots[0];

  const selectStep = (nextIdx: number) => {
    setStepIdx(nextIdx);
    setActiveHotspotIdx(0);
  };

  const stageDoneCount = Object.values(simStages).filter(Boolean).length;
  const stagePct = Math.round((stageDoneCount / 4) * 100);

  return (
    <div className="space-y-5">
      {/* Header & Step Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DDD6C7] dark:border-[#332E28]">
        <div>
          <p className="text-xs font-medium tracking-[0.12em] text-[#A64B33] dark:text-[#D4785E]">
            Interactive Visual Walkthrough · Sandbox Preview
          </p>
          <h3 className="mt-1 text-base sm:text-lg font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
            {currentStep.stepNum}. {currentStep.title}
          </h3>
          <p className="mt-1 text-xs text-[#575048] dark:text-[#CBC3B6] leading-relaxed">
            {currentStep.summary}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onJumpToSection(currentStep.targetSection)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <span>{currentStep.ctaLabel}</span>
          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Interactive Segmented Step Switcher */}
      <div
        role="tablist"
        aria-label="Interactive walkthrough steps"
        className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412]"
      >
        {TOUR_STEPS.map((step, idx) => {
          const isCurrent = idx === stepIdx;
          return (
            <button
              key={step.id}
              type="button"
              role="tab"
              aria-selected={isCurrent}
              onClick={() => selectStep(idx)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                isCurrent
                  ? 'bg-[#FAF8F3] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB] shadow-xs border border-[#DDD6C7] dark:border-[#332E28]'
                  : 'text-[#575048] dark:text-[#CBC3B6] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB]'
              }`}
            >
              {step.stepNum}. {step.label}
            </button>
          );
        })}
      </div>

      {/* Main Split: Interactive Screenshot Canvas + Clickable Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Live Interactive Screenshot Preview */}
        <div className="lg:col-span-7 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] p-4 sm:p-5 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#DDD6C7] dark:border-[#332E28] text-[11px] font-mono text-[#787066] dark:text-[#9C9387]">
            <span>Interactive Preview · Tap elements below to test</span>
            <span>Safe Sandbox Mode</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{opacity: 0, y: 8}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -6}}
              transition={{duration: 0.2, ease: APPLE_EASE}}
              className="flex-1 flex flex-col justify-center"
            >
              {/* STEP 1: BOARD CLOCK */}
              {currentStep.id === 'clock' && (
                <div className="rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] p-4 sm:p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-mono text-[#A64B33] dark:text-[#D4785E]">
                        CBSE Class XII 2027 · 16 Feb 10:30 AM IST
                      </p>
                      <p className="text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                        {simClockUrgent
                          ? 'Final Month Alert (≤ 30 days)'
                          : 'Crunch Window Active (85 days)'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSimClockUrgent((prev) => !prev)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB] hover:border-[#A64B33] whitespace-nowrap shrink-0"
                    >
                      {simClockUrgent ? 'Switch to 85 Days' : 'Simulate Final 30 Days'}
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[
                      {val: simClockUrgent ? '24' : '85', lbl: 'DAYS'},
                      {val: simClockUrgent ? '06' : '14', lbl: 'HOURS'},
                      {val: '32', lbl: 'MINS'},
                      {val: '09', lbl: 'SECS'},
                    ].map((tile) => (
                      <div key={tile.lbl} className="text-center">
                        <div
                          className={`py-3 rounded-lg border font-mono text-xl sm:text-2xl font-semibold tabular-nums text-[#F5F2EB] transition-colors ${
                            simClockUrgent
                              ? 'bg-[#2C1815] border-[#7A3528]'
                              : 'bg-[#1E1B18] border-[#332E28]'
                          }`}
                        >
                          {tile.val}
                        </div>
                        <span className="mt-1 block text-[10px] font-mono text-[#787066] dark:text-[#9C9387]">
                          {tile.lbl}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-[#575048] dark:text-[#CBC3B6] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#A64B33] dark:text-[#D4785E] shrink-0" aria-hidden="true" />
                    <span>Automatically resets to 16 Feb 2028 when 2027 exams begin.</span>
                  </p>
                </div>
              )}

              {/* STEP 2: ACHIEVEMENTS */}
              {currentStep.id === 'achievements' && (
                <div className="rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] p-4 sm:p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      className={`rounded-lg border p-3.5 transition-colors ${
                        simDailyChapters >= 3
                          ? 'border-[#B7791F] dark:border-[#E6B17A] bg-[#FBF3E4]/60 dark:bg-[#2D2416]/50'
                          : 'border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                          Quick Learner
                        </span>
                        <Zap
                          className={`w-4 h-4 ${
                            simDailyChapters >= 3
                              ? 'text-[#8C5A12] dark:text-[#E6B17A]'
                              : 'text-[#968E83]'
                          }`}
                          aria-hidden="true"
                        />
                      </div>
                      <p className="mt-1 text-[11px] font-mono tabular-nums text-[#575048] dark:text-[#CBC3B6]">
                        {simDailyChapters >= 3
                          ? `Unlocked · ${simDailyChapters} chapters today`
                          : `Today: ${simDailyChapters} / 3 chapters`}
                      </p>
                    </div>

                    <div
                      className={`rounded-lg border p-3.5 transition-colors ${
                        simExamPct > 90
                          ? 'border-[#A64B33] dark:border-[#D4785E] bg-[#F7EBE7]/70 dark:bg-[#2F1D19]/60'
                          : 'border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                          Exam Ready
                        </span>
                        <Trophy
                          className={`w-4 h-4 ${
                            simExamPct > 90
                              ? 'text-[#A64B33] dark:text-[#D4785E]'
                              : 'text-[#968E83]'
                          }`}
                          aria-hidden="true"
                        />
                      </div>
                      <p className="mt-1 text-[11px] font-mono tabular-nums text-[#575048] dark:text-[#CBC3B6]">
                        {simExamPct > 90
                          ? `Unlocked · Scored ${simExamPct}%`
                          : `Best: ${simExamPct}% · Need >90%`}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setSimDailyChapters((prev) => (prev >= 5 ? 1 : prev + 1))
                      }
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB] hover:border-[#A64B33] whitespace-nowrap shrink-0"
                    >
                      +1 Chapter Today ({simDailyChapters})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimExamPct((prev) => (prev > 90 ? 88 : 94))}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB] hover:border-[#A64B33] whitespace-nowrap shrink-0"
                    >
                      {simExamPct > 90 ? 'Test 88% Score' : 'Simulate 94% Sample Paper'}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: SUBJECT TRACKER */}
              {currentStep.id === 'tracker' && (
                <div className="rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-mono text-[#787066] dark:text-[#9C9387]">
                        Physics 042 · Chapter 01
                      </p>
                      <p className="text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                        Electric Charges and Fields
                      </p>
                    </div>
                    <span className="text-xs font-mono font-semibold text-[#3D6B4F] dark:text-[#7AB88F] tabular-nums">
                      {stagePct}% ({stageDoneCount}/4)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        {key: 'lecture', label: 'Lecture done'},
                        {key: 'practice', label: 'Practice done'},
                        {key: 'ncert', label: 'NCERT done'},
                        {key: 'pyq', label: 'PYQ done'},
                      ] as const
                    ).map((st) => {
                      const checked = simStages[st.key];
                      return (
                        <button
                          key={st.key}
                          type="button"
                          onClick={() =>
                            setSimStages((prev) => ({
                              ...prev,
                              [st.key]: !prev[st.key],
                            }))
                          }
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap ${
                            checked
                              ? 'bg-[#E8F0EA] dark:bg-[#1C2E22] border-[#3D6B4F] dark:border-[#7AB88F] text-[#23422F] dark:text-[#B6DFC3]'
                              : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#1E1B18] dark:text-[#F5F2EB]'
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 ${
                              checked
                                ? 'bg-[#3D6B4F] border-[#3D6B4F] text-[#F5F2EB]'
                                : 'border-[#B8AF9F] dark:border-[#575048]'
                            }`}
                          >
                            {checked && <Check className="w-3 h-3" aria-hidden="true" />}
                          </span>
                          <span>{st.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {stageDoneCount === 4 && (
                    <p className="text-xs font-medium text-[#3D6B4F] dark:text-[#7AB88F] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>All 4 stages ticked — chapter auto-completes!</span>
                    </p>
                  )}
                </div>
              )}

              {/* STEP 4: EXAMINATION HALL */}
              {currentStep.id === 'exam' && (
                <div className="rounded-xl border border-[#332E28] bg-[#1E1B18] text-[#F5F2EB] p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-[#D4785E]" aria-hidden="true" />
                      <span className="text-xs font-semibold">
                        Physics Official 2026–27 SQP · Section A
                      </span>
                    </div>
                    <span className="font-mono text-xs text-[#CBC3B6] tabular-nums">
                      02:59:42
                    </span>
                  </div>

                  <div className="rounded-lg border border-[#332E28] bg-[#24201C] p-3.5 space-y-3">
                    <p className="text-xs text-[#CBC3B6]">
                      Sample Question Q1: Two charges +q and -q form an electric dipole. Tap an OMR bubble:
                    </p>
                    <div className="flex items-center gap-2.5">
                      {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                        const selected = simOmrPick === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setSimOmrPick(opt)}
                            className={`w-9 h-9 rounded-full border font-mono text-xs font-semibold transition-colors ${
                              selected
                                ? opt === 'B'
                                  ? 'bg-[#3D6B4F] border-[#7AB88F] text-[#F5F2EB]'
                                  : 'bg-[#A64B33] border-[#D4785E] text-[#F5F2EB]'
                                : 'bg-[#1E1B18] border-[#4A423A] text-[#CBC3B6] hover:border-[#D4785E]'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                      <span className="ml-2 text-xs font-mono text-[#CBC3B6]">
                        {simOmrPick === 'B'
                          ? 'Correct (+1 Mark · Key: B)'
                          : simOmrPick
                            ? `Selected ${simOmrPick} · Key is B`
                            : 'Tap a bubble'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: 12TH HACKERS */}
              {currentStep.id === 'hackers' && (
                <div className="rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] p-4 sm:p-5 space-y-4">
                  <div className="rounded-lg bg-[#1E1B18] text-[#F5F2EB] p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-9 h-9 rounded-full bg-[#A64B33] flex items-center justify-center shrink-0">
                        <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">
                          01. Electric Charges &amp; Fields · One-Shot
                        </p>
                        <p className="text-[11px] font-mono text-[#CBC3B6]">
                          Mode: {simEmbedMode}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSimLectureDone((prev) => !prev)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                        simLectureDone
                          ? 'bg-[#3D6B4F] text-[#F5F2EB]'
                          : 'bg-[#F5F2EB] text-[#1E1B18]'
                      }`}
                    >
                      {simLectureDone ? '✓ Lecture Synced' : 'Mark Done & Next'}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {(['Standard', 'Pure Embed', 'No-Cookie'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setSimEmbedMode(mode)}
                        className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                          simEmbedMode === mode
                            ? 'bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] border-transparent'
                            : 'bg-[#F5F2EB] dark:bg-[#24201C] text-[#575048] dark:text-[#CBC3B6] border-[#DDD6C7] dark:border-[#332E28]'
                        }`}
                      >
                        Player: {mode}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#DDD6C7] dark:border-[#332E28]">
            <button
              type="button"
              onClick={() =>
                selectStep((stepIdx - 1 + TOUR_STEPS.length) % TOUR_STEPS.length)
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] text-[#1E1B18] dark:text-[#F5F2EB] hover:border-[#A64B33] whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Previous</span>
            </button>
            <span className="text-xs font-mono tabular-nums text-[#787066] dark:text-[#9C9387]">
              {stepIdx + 1} / {TOUR_STEPS.length}
            </span>
            <button
              type="button"
              onClick={() => selectStep((stepIdx + 1) % TOUR_STEPS.length)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] text-[#1E1B18] dark:text-[#F5F2EB] hover:border-[#A64B33] whitespace-nowrap"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Right: Clickable Feature Hotspots */}
        <div className="lg:col-span-5 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#24201C]/70 p-4 sm:p-5 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <p className="text-xs font-medium tracking-[0.1em] text-[#A64B33] dark:text-[#D4785E]">
              Interactive Hotspots · Click to Inspect
            </p>
            <div className="space-y-2">
              {currentStep.hotspots.map((spot, idx) => {
                const selected = idx === activeHotspotIdx;
                return (
                  <motion.button
                    key={spot.label}
                    type="button"
                    whileTap={{scale: 0.985}}
                    transition={APPLE_SPRING}
                    onClick={() => setActiveHotspotIdx(idx)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selected
                        ? 'bg-[#F5F2EB] dark:bg-[#1E1B18] border-[#A64B33] dark:border-[#D4785E]'
                        : 'bg-transparent border-[#DDD6C7] dark:border-[#332E28] hover:border-[#B8AF9F] dark:hover:border-[#4A423A]'
                    }`}
                  >
                    <p className="text-xs font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                      {spot.label}
                    </p>
                    {selected && (
                      <p className="mt-1 text-xs text-[#575048] dark:text-[#CBC3B6] leading-relaxed">
                        {spot.detail}
                      </p>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#DDD6C7] dark:border-[#332E28] flex items-center justify-between gap-2 text-xs text-[#787066] dark:text-[#9C9387]">
            <span className="truncate">{activeHotspot.label}</span>
            <button
              type="button"
              onClick={() => {
                setSimClockUrgent(false);
                setSimDailyChapters(2);
                setSimExamPct(88);
                setSimStages({
                  lecture: true,
                  practice: true,
                  ncert: false,
                  pyq: false,
                });
                setSimOmrPick('B');
                setSimEmbedMode('Standard');
                setSimLectureDone(false);
              }}
              className="inline-flex items-center gap-1 text-[#A64B33] dark:text-[#D4785E] hover:underline whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3 h-3" aria-hidden="true" />
              <span>Reset Preview</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
