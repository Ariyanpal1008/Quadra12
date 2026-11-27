import {useState} from 'react';
import {motion} from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  FileCheck2,
  FileText,
  Flame,
  Play,
  RotateCcw,
  Trophy,
  Zap,
} from 'lucide-react';
import {playCheckSound, playOmrBubbleSound} from '../utils/soundEffects';

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
        detail: 'Switches seamlessly from 2027 → 2028 on Feb 16 at 10:30 AM IST without resetting student study logs.',
      },
      {
        label: 'Custom Date Toggle',
        detail: 'Tap Auto: Feb 16 to set a custom board schedule if your specific stream starts on a different date.',
      },
      {
        label: 'Pace Alert Tiers',
        detail: 'Dynamically shifts urgency from Long-Run (>90d) → Crunch (≤90d) → Final Month (≤30d) based on remaining days.',
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
        label: 'Quick Learner Badge',
        detail: 'Completing 3 or more chapters in a single calendar day unlocks the Quick Learner seal.',
      },
      {
        label: 'Exam Ready Distinction',
        detail: 'Scoring strictly >90% on any full Examination Hall blueprint paper unlocks the Exam Ready trophy.',
      },
      {
        label: 'Reversible Unlock Toast',
        detail: 'Floats non-intrusively from any view upon qualification; dynamically relocks if a checkbox was clicked by mistake.',
      },
    ],
  },
  {
    id: 'tracker',
    stepNum: '03',
    label: 'Subject Tracker',
    title: '50 NCERT Chapters × 4 Study Checkpoints',
    summary:
      'Every chapter across Physics (14), Chemistry (10), Biology (13), and Mathematics (13) includes 4 checkpoints plus a custom SVG diagram plate.',
    targetSection: 'subjects',
    ctaLabel: 'Open Subject Tracker',
    hotspots: [
      {
        label: '4-Stage Checklist',
        detail: 'Lecture done, Practice done, NCERT done, and PYQ done per chapter (200 total checkpoints).',
      },
      {
        label: 'Bulk Subject Action Bar',
        detail: 'Toggle an entire study stage across all chapters of a subject in one click with audio confirmation.',
      },
      {
        label: '50 Chapter Study Libraries & SVG Diagrams',
        detail: 'Open curated chapter study summaries, formulas, SVG diagrams, and verified practice questions right inside the tracker.',
      },
    ],
  },
  {
    id: 'exam',
    stepNum: '04',
    label: 'Exam Hall',
    title: 'Verified PCMB OMR, 720-Q Practice Mode & Local PDFs',
    summary:
      'Write human-approved OMR papers with deterministic scoring, drill 720 verified questions (180 per subject) in Practice Mode, browse the 2026–27 SQP Archive, and download Practice Sheet & Marking Scheme A4 PDFs at any score.',
    targetSection: 'exam',
    ctaLabel: 'Enter Examination Hall',
    hotspots: [
      {
        label: 'Human-Approved Governance & OMR Engine',
        detail: 'Only Published papers with complete Marking Schemes admit live OMR tests; answer keys stay stripped until submission.',
      },
      {
        label: 'Practice Mode (720 Verified Questions)',
        detail: 'Switch cleanly to untimed chapter MCQ drills with immediate step-by-step explanations and diagram inspection.',
      },
      {
        label: 'Unconditional Access at 0 Marks',
        detail: 'Even on an empty 0-mark attempt, Results unlock your Practice Sheet, Marking Scheme, Study Libraries, and Diagrams.',
      },
      {
        label: 'Offline Practice Sheet & Marking Scheme PDFs',
        detail: 'Generate clean printable A4 PDFs locally with jsPDF and immutable Practice Sheet snapshots per student profile.',
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
        detail: 'Watching or marking a lecture updates Subject Tracker automatically in real-time.',
      },
      {
        label: '3 Player Embed Modes',
        detail: 'Switch between Standard, Pure Embed, and No-Cookie (youtube-nocookie.com) if school networks restrict YouTube.',
      },
      {
        label: 'Mark Done & Next Shortcut',
        detail: 'Check off the current chapter lecture and auto-advance to the next chapter in one smooth tap.',
      },
    ],
  },
];

export function InteractiveTourTab({onJumpToSection}: InteractiveTourTabProps) {
  const [stepIdx, setStepIdx] = useState(0);
  const [activeHotspotIdx, setActiveHotspotIdx] = useState(0);

  // Ephemeral preview states for sandbox simulation (never mutates real study logs)
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
  const [simExamTab, setSimExamTab] = useState<'omr' | 'practice'>('omr');
  const [simShowExplanation, setSimShowExplanation] = useState(true);
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
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#A64B33]/10 text-[#A64B33] dark:text-[#D4785E] border border-[#A64B33]/20">
              Interactive Tour
            </span>
            <span className="text-xs text-[#787066] dark:text-[#9C9387]">Safe Sandbox Mode</span>
          </div>
          <h3 className="mt-1 text-base sm:text-lg font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
            {currentStep.stepNum}. {currentStep.title}
          </h3>
          <p className="mt-1 text-xs text-[#575048] dark:text-[#CBC3B6] leading-relaxed max-w-2xl">
            {currentStep.summary}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onJumpToSection(currentStep.targetSection)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 self-start sm:self-auto shadow-xs"
        >
          <span>{currentStep.ctaLabel}</span>
          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Segmented Step Switcher */}
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
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                isCurrent
                  ? 'bg-[#FAF8F3] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB] shadow-xs border border-[#DDD6C7] dark:border-[#332E28] font-semibold'
                  : 'text-[#575048] dark:text-[#CBC3B6] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB]'
              }`}
            >
              {step.stepNum}. {step.label}
            </button>
          );
        })}
      </div>

      {/* Main Split: Interactive Canvas (Left) + Clickable Hotspots (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Stable Interactive Screenshot Preview Canvas */}
        <div className="lg:col-span-7 min-w-0 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] p-4 sm:p-5 flex flex-col justify-between gap-4 min-h-[380px] sm:min-h-[460px]">
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#DDD6C7] dark:border-[#332E28] text-[11px] font-mono text-[#787066] dark:text-[#9C9387]">
            <span>Live Interactive Preview</span>
            <span className="text-[#A64B33] dark:text-[#D4785E]">Tap elements to test</span>
          </div>

          <div className="flex-1 flex flex-col justify-center py-1">
            {/* STEP 1: BOARD CLOCK */}
            {currentStep.id === 'clock' && (
              <div className="rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-mono text-[#A64B33] dark:text-[#D4785E]">
                      CBSE Class XII 2027 · 16 Feb 10:30 AM IST
                    </p>
                    <p className="text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                      {simClockUrgent ? 'Final Month Alert (≤ 30 days)' : 'Crunch Window Active (85 days)'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSimClockUrgent((prev) => !prev)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB] hover:border-[#A64B33] whitespace-nowrap shrink-0 self-start sm:self-auto"
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
                        className={`py-3 rounded-lg border font-mono text-lg sm:text-2xl font-bold tabular-nums text-[#F5F2EB] transition-colors ${
                          simClockUrgent
                            ? 'bg-[#2C1815] border-[#7A3528]'
                            : 'bg-[#1E1B18] border-[#332E28]'
                        }`}
                      >
                        {tile.val}
                      </div>
                      <span className="mt-1 block text-[10px] font-mono font-medium text-[#787066] dark:text-[#9C9387]">
                        {tile.lbl}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#DDD6C7]/60 dark:border-[#332E28]/60 flex items-center gap-2 text-xs text-[#575048] dark:text-[#CBC3B6]">
                  <Clock className="w-3.5 h-3.5 text-[#A64B33] dark:text-[#D4785E] shrink-0" aria-hidden="true" />
                  <span>Annual Rollover: Resets automatically to 16 Feb 2028 when 2027 exams begin.</span>
                </div>
              </div>
            )}

            {/* STEP 2: ACHIEVEMENTS */}
            {currentStep.id === 'achievements' && (
              <div className="rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] p-4 sm:p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    className={`rounded-lg border p-3.5 transition-colors ${
                      simDailyChapters >= 3
                        ? 'border-[#B7791F] dark:border-[#E6B17A] bg-[#FBF3E4]/70 dark:bg-[#2D2416]/60'
                        : 'border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                        Quick Learner
                      </span>
                      <Zap
                        className={`w-4 h-4 shrink-0 ${
                          simDailyChapters >= 3 ? 'text-[#8C5A12] dark:text-[#E6B17A]' : 'text-[#968E83]'
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] font-mono tabular-nums text-[#575048] dark:text-[#CBC3B6]">
                      {simDailyChapters >= 3
                        ? `✓ Unlocked · ${simDailyChapters} chapters today`
                        : `Progress: ${simDailyChapters} / 3 chapters today`}
                    </p>
                  </div>

                  <div
                    className={`rounded-lg border p-3.5 transition-colors ${
                      simExamPct > 90
                        ? 'border-[#A64B33] dark:border-[#D4785E] bg-[#F7EBE7]/80 dark:bg-[#2F1D19]/70'
                        : 'border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                        Exam Ready
                      </span>
                      <Trophy
                        className={`w-4 h-4 shrink-0 ${
                          simExamPct > 90 ? 'text-[#A64B33] dark:text-[#D4785E]' : 'text-[#968E83]'
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] font-mono tabular-nums text-[#575048] dark:text-[#CBC3B6]">
                      {simExamPct > 90
                        ? `✓ Unlocked · Scored ${simExamPct}% in Exam Hall`
                        : `Best: ${simExamPct}% · Need >90% to unlock`}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSimDailyChapters((prev) => (prev >= 5 ? 1 : prev + 1))}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB] hover:border-[#A64B33] whitespace-nowrap"
                  >
                    +1 Chapter Today ({simDailyChapters})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimExamPct((prev) => (prev > 90 ? 88 : 94))}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB] hover:border-[#A64B33] whitespace-nowrap"
                  >
                    {simExamPct > 90 ? 'Test 88% Score' : 'Simulate 94% Sample Paper'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SUBJECT TRACKER */}
            {currentStep.id === 'tracker' && (
              <div className="rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#DDD6C7] dark:border-[#332E28]">
                  <div className="min-w-0">
                    <p className="text-[11px] font-mono text-[#787066] dark:text-[#9C9387]">
                      Physics 042 · Chapter 01
                    </p>
                    <p className="text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB] truncate">
                      Electric Charges and Fields
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#3D6B4F] dark:text-[#7AB88F] tabular-nums shrink-0">
                    {stagePct}% ({stageDoneCount}/4)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                        onClick={() => {
                          const nextVal = !simStages[st.key];
                          playCheckSound(nextVal);
                          setSimStages((prev) => ({
                            ...prev,
                            [st.key]: nextVal,
                          }));
                        }}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-medium transition-colors text-left ${
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
                        <span className="truncate">{st.label}</span>
                      </button>
                    );
                  })}
                </div>

                {stageDoneCount === 4 ? (
                  <p className="text-xs font-medium text-[#3D6B4F] dark:text-[#7AB88F] flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>All 4 stages ticked — chapter auto-completes with golden seal!</span>
                  </p>
                ) : (
                  <p className="text-xs text-[#787066] dark:text-[#9C9387]">
                    Tap each stage above to hear the native Web Audio synthesizer pop.
                  </p>
                )}
              </div>
            )}

            {/* STEP 4: EXAMINATION HALL v3.0.0 */}
            {currentStep.id === 'exam' && (
              <div className="rounded-xl border border-[#332E28] bg-[#1E1B18] text-[#F5F2EB] p-4 sm:p-5 space-y-3.5">
                {/* Header with paper title, timer, and tab selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-[#332E28]">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileCheck2 className="w-4 h-4 text-[#D4785E] shrink-0" aria-hidden="true" />
                    <span className="text-xs font-semibold truncate">
                      Physics Competitive Paper I (Code 042)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <span className="font-mono text-xs text-[#CBC3B6] tabular-nums bg-[#24201C] px-2 py-0.5 rounded border border-[#332E28]">
                      ⏱ 00:44:12
                    </span>
                    <div className="inline-flex rounded-md p-0.5 bg-[#24201C] border border-[#332E28] text-[11px]">
                      <button
                        type="button"
                        onClick={() => setSimExamTab('omr')}
                        className={`px-2.5 py-0.5 rounded transition-colors ${
                          simExamTab === 'omr'
                            ? 'bg-[#3D6B4F] text-[#F5F2EB] font-semibold'
                            : 'text-[#CBC3B6] hover:text-white'
                        }`}
                      >
                        OMR Exam
                      </button>
                      <button
                        type="button"
                        onClick={() => setSimExamTab('practice')}
                        className={`px-2.5 py-0.5 rounded transition-colors ${
                          simExamTab === 'practice'
                            ? 'bg-[#A64B33] text-[#F5F2EB] font-semibold'
                            : 'text-[#CBC3B6] hover:text-white'
                        }`}
                      >
                        Practice + PDF
                      </button>
                    </div>
                  </div>
                </div>

                {simExamTab === 'omr' ? (
                  <div className="rounded-lg border border-[#332E28] bg-[#24201C] p-3.5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <span className="text-xs font-mono text-[#D4785E] font-semibold shrink-0">
                        Q01 · Verified Question (+4 / −1)
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-[#3A1E18] border border-[#7A3528] text-[#F09986] self-start sm:self-auto leading-snug">
                        <Flame className="w-2.5 h-2.5 shrink-0" />
                        <span>Published · Electrostatics · Key Stripped Live</span>
                      </span>
                    </div>

                    <p className="text-xs text-[#CBC3B6] leading-relaxed">
                      Two point charges +2q and +2q are placed at distance 2a. Determine the net electric potential at their midpoint:
                    </p>

                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-2">
                        {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                          const selected = simOmrPick === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                playOmrBubbleSound();
                                setSimOmrPick(opt);
                              }}
                              className={`w-9 h-9 rounded-full border font-mono text-xs font-bold transition-all ${
                                selected
                                  ? opt === 'B'
                                    ? 'bg-[#3D6B4F] border-[#7AB88F] text-[#F5F2EB] ring-2 ring-[#7AB88F]/40'
                                    : 'bg-[#A64B33] border-[#D4785E] text-[#F5F2EB]'
                                  : 'bg-[#1E1B18] border-[#4A423A] text-[#CBC3B6] hover:border-[#D4785E]'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      <div className="p-2 rounded bg-[#1E1B18] border border-[#332E28] flex items-center justify-between text-xs font-mono">
                        <span className="text-[#9C9387]">
                          Marked: <strong className="text-white">{simOmrPick ?? 'None'}</strong>
                        </span>
                        <span className={simOmrPick === 'B' ? 'text-[#7AB88F] font-semibold' : 'text-[#D4785E]'}>
                          {simOmrPick === 'B' ? '✓ Deterministic Key Match (+4 Marks)' : 'Marking Scheme Key: B'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-[#332E28] bg-[#24201C] p-3.5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <span className="text-xs font-mono text-[#7AB88F] font-semibold shrink-0">
                        Result · Practice Sheet + Marking Scheme Unlocked
                      </span>
                      <span className="text-[10px] font-mono text-[#CBC3B6]">
                        Available even at 0 marks
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#332E28]">
                      <button
                        type="button"
                        onClick={() => setSimShowExplanation((prev) => !prev)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#3D6B4F] bg-[#1C2E22] text-[#B6DFC3] text-xs font-medium"
                      >
                        <BookOpen className="w-3.5 h-3.5 shrink-0" />
                        <span>{simShowExplanation ? 'Hide Marking Rule' : 'Inspect Marking Scheme'}</span>
                      </button>

                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#4A423A] bg-[#1E1B18] text-[#F5F2EB] text-xs font-mono">
                        <FileText className="w-3.5 h-3.5 text-[#D4785E]" />
                        <span>Practice Sheet PDF · Marking Scheme PDF</span>
                      </span>
                    </div>

                    {simShowExplanation && (
                      <div className="p-3 rounded-lg bg-[#161412] border border-[#7AB88F]/40 space-y-1.5 text-xs">
                        <p className="font-mono text-[#7AB88F] font-semibold">
                          Deterministic Solution · Ch 1 Electrostatic Potential
                        </p>
                        <p className="text-[11px] text-[#CBC3B6] leading-relaxed">
                          Potential is scalar: V = V₁ + V₂ = k(2q)/a + k(2q)/a = 4kq/a = q / (πε₀a). Linked directly to Physics Study Library + Diagram viewer.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STEP 5: 12TH HACKERS */}
            {currentStep.id === 'hackers' && (
              <div className="rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] p-4 sm:p-5 space-y-4">
                <div className="rounded-lg bg-[#1E1B18] text-[#F5F2EB] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 rounded-full bg-[#A64B33] flex items-center justify-center shrink-0">
                      <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">
                        01. Electric Charges &amp; Fields · One-Shot
                      </p>
                      <p className="text-[11px] font-mono text-[#CBC3B6]">
                        Engine: {simEmbedMode}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSimLectureDone((prev) => !prev)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto ${
                      simLectureDone
                        ? 'bg-[#3D6B4F] text-[#F5F2EB]'
                        : 'bg-[#F5F2EB] text-[#1E1B18]'
                    }`}
                  >
                    {simLectureDone ? '✓ Lecture Synced' : 'Mark Done & Next'}
                  </button>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[11px] font-mono text-[#787066] dark:text-[#9C9387]">
                    Choose YouTube Embed Engine:
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {(['Standard', 'Pure Embed', 'No-Cookie'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setSimEmbedMode(mode)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                          simEmbedMode === mode
                            ? 'bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] border-transparent font-semibold shadow-xs'
                            : 'bg-[#F5F2EB] dark:bg-[#24201C] text-[#575048] dark:text-[#CBC3B6] border-[#DDD6C7] dark:border-[#332E28]'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Step Navigation Bar */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#DDD6C7] dark:border-[#332E28]">
            <button
              type="button"
              onClick={() => selectStep((stepIdx - 1 + TOUR_STEPS.length) % TOUR_STEPS.length)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] text-[#1E1B18] dark:text-[#F5F2EB] hover:border-[#A64B33] whitespace-nowrap transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Previous</span>
            </button>
            <span className="text-xs font-mono font-semibold tabular-nums text-[#787066] dark:text-[#9C9387]">
              Step {stepIdx + 1} of {TOUR_STEPS.length}
            </span>
            <button
              type="button"
              onClick={() => selectStep((stepIdx + 1) % TOUR_STEPS.length)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] text-[#1E1B18] dark:text-[#F5F2EB] hover:border-[#A64B33] whitespace-nowrap transition-colors"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Right: Clickable Feature Hotspots */}
        <div className="lg:col-span-5 min-w-0 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#24201C]/70 p-4 sm:p-5 flex flex-col justify-between gap-4 min-h-[380px] sm:min-h-[460px]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold tracking-wider uppercase text-[#A64B33] dark:text-[#D4785E]">
                Feature Hotspots
              </p>
              <span className="text-[11px] font-mono text-[#787066] dark:text-[#9C9387]">
                Click to expand
              </span>
            </div>

            <div className="space-y-2">
              {currentStep.hotspots.map((spot, idx) => {
                const selected = idx === activeHotspotIdx;
                return (
                  <button
                    key={spot.label}
                    type="button"
                    onClick={() => setActiveHotspotIdx(idx)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selected
                        ? 'bg-[#F5F2EB] dark:bg-[#1E1B18] border-[#A64B33] dark:border-[#D4785E] shadow-xs'
                        : 'bg-transparent border-[#DDD6C7] dark:border-[#332E28] hover:border-[#B8AF9F] dark:hover:border-[#4A423A]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs font-semibold ${selected ? 'text-[#A64B33] dark:text-[#D4785E]' : 'text-[#1E1B18] dark:text-[#F5F2EB]'}`}>
                        {spot.label}
                      </p>
                      {selected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A64B33] dark:bg-[#D4785E] shrink-0" />
                      )}
                    </div>
                    {selected && (
                      <p className="mt-1.5 text-xs text-[#575048] dark:text-[#CBC3B6] leading-relaxed">
                        {spot.detail}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reset Preview Controls */}
          <div className="pt-3 border-t border-[#DDD6C7] dark:border-[#332E28] flex items-center justify-between gap-2 text-xs text-[#787066] dark:text-[#9C9387]">
            <span className="truncate font-mono">{activeHotspot.label}</span>
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
                setSimExamTab('omr');
                setSimShowExplanation(true);
              }}
              className="inline-flex items-center gap-1 text-[#A64B33] dark:text-[#D4785E] hover:underline whitespace-nowrap shrink-0 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset Sandbox</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
