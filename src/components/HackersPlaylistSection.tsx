import {useCallback, useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ListVideo,
  Play,
  Search,
  X,
} from 'lucide-react';
import {
  ChapterTaskState,
  HACKERS_PLAYLIST,
  OneShotLecture,
  SUBJECTS,
  SubjectConfig,
  SubjectId,
} from '../data/pcmbData';
import {ResilientImage} from './ResilientImage';
import {EmbedPlayerMode, YouTubeSyncPlayer} from './YouTubeSyncPlayer';
import {APPLE_EASE, APPLE_SPRING, AnimatedNumber} from './FluidPrimitives';

const STORAGE_EMBED_MODE_KEY = 'pcmb_desk_embed_mode_v1';
const STORAGE_AUTO_ADVANCE_KEY = 'pcmb_desk_auto_advance_v1';

function readStoredEmbedMode(): EmbedPlayerMode {
  try {
    const val = window.localStorage.getItem(STORAGE_EMBED_MODE_KEY);
    if (val === 'standard' || val === 'pure' || val === 'nocookie') return val;
  } catch {
    // Ignore storage read errors
  }
  return 'standard';
}

function readStoredAutoAdvance(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_AUTO_ADVANCE_KEY) !== 'false';
  } catch {
    return true;
  }
}

interface HackersPlaylistSectionProps {
  watchedLectures: Record<string, boolean>;
  chapterTasks: Record<string, ChapterTaskState>;
  onToggleWatched: (lectureId: string) => void;
  onSetChapterLectureDone: (chapterId: string, done: boolean) => void;
}

type FilterOption = 'all' | SubjectId;

const FILTER_TABS: {id: FilterOption; label: string}[] = [
  {id: 'all', label: 'All PCMB'},
  {id: 'physics', label: 'Physics'},
  {id: 'chemistry', label: 'Chemistry'},
  {id: 'biology', label: 'Biology'},
  {id: 'maths', label: 'Mathematics'},
];

function LectureVisualPlate({
  lecture,
  subject,
}: {
  lecture: OneShotLecture;
  subject: SubjectConfig;
}) {
  // Use topic-matched vector monograph plates where the subject's overview plate covers a different unit
  // (e.g. Electrostatics shouldn't show a Triangular Prism).
  switch (lecture.id) {
    case 'hk-phy-1':
      return (
        <div className="w-full h-full bg-[#ECE6D9] dark:bg-[#24201C] flex items-center justify-center p-4">
          <svg
            viewBox="0 0 360 200"
            className="w-full h-full text-[#1E1B18] dark:text-[#F5F2EB]"
            role="img"
            aria-label="Electrostatics parallel-plate capacitor with electric field lines and dielectric slab"
          >
            {/* Capacitor Plates */}
            <rect x="92" y="34" width="12" height="132" rx="2" className="fill-[#A64B33] dark:fill-[#D4785E]" />
            <rect x="256" y="34" width="12" height="132" rx="2" fill="currentColor" />
            {/* Dielectric Slab */}
            <rect x="148" y="42" width="64" height="116" rx="3" className="fill-[#DFD7C6] dark:fill-[#332E28] stroke-[#787066]" strokeWidth="1.5" strokeDasharray="4 3" />
            <text x="172" y="104" fontSize="13" fontWeight="600" className="fill-[#575048] dark:fill-[#CBC3B6]">K</text>
            {/* Uniform Electric Field Arrows */}
            {[54, 78, 124, 148].map((y) => (
              <g key={y}>
                <line x1="112" y1={y} x2="244" y2={y} stroke="currentColor" strokeWidth="1.6" />
                <polygon points={`248,${y} 238,${y - 4} 238,${y + 4}`} fill="currentColor" />
              </g>
            ))}
            {/* Terminal Leads */}
            <line x1="40" y1="100" x2="92" y2="100" stroke="currentColor" strokeWidth="2" />
            <line x1="268" y1="100" x2="320" y2="100" stroke="currentColor" strokeWidth="2" />
            <text x="64" y="42" fontSize="12" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">+Q</text>
            <text x="278" y="42" fontSize="12" fontWeight="700" fill="currentColor">−Q</text>
            <text x="122" y="185" fontSize="10" className="fill-[#575048] dark:fill-[#CBC3B6]" fontFamily="monospace">
              E = σ / (Kε₀) · C = Kε₀A / d
            </text>
          </svg>
        </div>
      );

    case 'hk-phy-2':
      return (
        <div className="w-full h-full bg-[#ECE6D9] dark:bg-[#24201C] flex items-center justify-center p-4">
          <svg
            viewBox="0 0 360 200"
            className="w-full h-full text-[#1E1B18] dark:text-[#F5F2EB]"
            role="img"
            aria-label="Solenoid magnetic field lines and AC phasor diagram"
          >
            {/* Axis & Field Lines */}
            <line x1="36" y1="95" x2="324" y2="95" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="1.8" strokeDasharray="5 3" />
            <polygon points="330,95 318,90 318,100" className="fill-[#A64B33] dark:fill-[#D4785E]" />
            {/* Solenoid Coils */}
            {[90, 118, 146, 174, 202, 230, 258].map((x) => (
              <ellipse
                key={x}
                cx={x}
                cy="95"
                rx="11"
                ry="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              />
            ))}
            <text x="40" y="76" fontSize="12" fontWeight="700" fill="currentColor">S</text>
            <text x="296" y="76" fontSize="12" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">N → B</text>
            <text x="102" y="176" fontSize="10" className="fill-[#575048] dark:fill-[#CBC3B6]" fontFamily="monospace">
              B = μ₀ n I · f₀ = 1 / (2π√LC)
            </text>
          </svg>
        </div>
      );

    case 'hk-chem-1':
      return (
        <div className="w-full h-full bg-[#ECE6D9] dark:bg-[#24201C] flex items-center justify-center p-4">
          <svg
            viewBox="0 0 360 200"
            className="w-full h-full text-[#1E1B18] dark:text-[#F5F2EB]"
            role="img"
            aria-label="Daniell electrochemical cell and first-order chemical kinetics graph"
          >
            {/* Left: Daniell Cell */}
            <rect x="26" y="70" width="66" height="84" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <rect x="28" y="106" width="62" height="46" className="fill-[#D6CFC2] dark:fill-[#332E28]" />
            <rect x="44" y="54" width="12" height="78" className="fill-[#A64B33] dark:fill-[#D4785E]" />
            <rect x="116" y="70" width="66" height="84" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <rect x="118" y="106" width="62" height="46" className="fill-[#C9D6CD] dark:fill-[#26352B]" />
            <rect x="150" y="54" width="12" height="78" className="fill-[#3D6B4F] dark:fill-[#7AB88F]" />
            {/* Salt Bridge */}
            <path d="M 74 114 L 74 60 Q 104 42 134 60 L 134 114" fill="none" stroke="currentColor" strokeWidth="7" opacity="0.28" />
            <path d="M 74 114 L 74 60 Q 104 42 134 60 L 134 114" fill="none" stroke="currentColor" strokeWidth="1.5" />
            {/* Wire */}
            <polyline points="50,54 50,28 156,28 156,54" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="104" cy="28" r="11" className="fill-[#FAF8F3] dark:fill-[#1E1B18]" stroke="currentColor" strokeWidth="1.5" />
            <text x="100" y="32" fontSize="10" fontWeight="700" fill="currentColor">V</text>
            <text x="36" y="170" fontSize="10" fill="currentColor" fontFamily="monospace">Zn | Zn²⁺ || Cu²⁺ | Cu</text>

            {/* Right: Kinetics Rate Plot */}
            <line x1="224" y1="148" x2="338" y2="148" stroke="currentColor" strokeWidth="1.6" />
            <line x1="224" y1="148" x2="224" y2="44" stroke="currentColor" strokeWidth="1.6" />
            <path d="M 228 54 Q 256 122 332 142" fill="none" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2.4" />
            <text x="234" y="48" fontSize="9.5" className="fill-[#575048] dark:fill-[#CBC3B6]" fontFamily="monospace">ln[R] vs t</text>
            <text x="242" y="170" fontSize="10" fill="currentColor" fontFamily="monospace">t₁/₂ = 0.693/k</text>
          </svg>
        </div>
      );

    case 'hk-chem-3':
      return (
        <div className="w-full h-full bg-[#ECE6D9] dark:bg-[#24201C] flex items-center justify-center p-4">
          <svg
            viewBox="0 0 360 200"
            className="w-full h-full text-[#1E1B18] dark:text-[#F5F2EB]"
            role="img"
            aria-label="Organic chemistry benzene resonance, nucleophilic carbonyl attack, and peptide bond"
          >
            {/* Benzene Hexagon */}
            <polygon
              points="96,42 136,65 136,111 96,134 56,111 56,65"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            />
            <circle cx="96" cy="88" r="24" fill="none" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2" strokeDasharray="5 3" />
            <line x1="136" y1="65" x2="176" y2="44" stroke="currentColor" strokeWidth="2" />
            <text x="180" y="48" fontSize="12" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">CHO</text>

            {/* Arrow */}
            <line x1="176" y1="92" x2="226" y2="92" stroke="currentColor" strokeWidth="1.8" />
            <polygon points="232,92 222,87 222,97" fill="currentColor" />
            <text x="176" y="83" fontSize="9.5" className="fill-[#575048] dark:fill-[#CBC3B6]" fontFamily="monospace">SN2 / Aldol</text>

            {/* Carbonyl tetrahedral */}
            <text x="252" y="88" fontSize="15" fontWeight="700" fill="currentColor">C</text>
            <line x1="264" y1="74" x2="294" y2="56" stroke="currentColor" strokeWidth="1.8" />
            <line x1="268" y1="80" x2="298" y2="62" stroke="currentColor" strokeWidth="1.8" />
            <text x="300" y="60" fontSize="13" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">O</text>
            <line x1="264" y1="94" x2="296" y2="114" stroke="currentColor" strokeWidth="1.8" />
            <text x="300" y="122" fontSize="12" fontWeight="600" fill="currentColor">NH₂</text>
            <text x="58" y="170" fontSize="10" className="fill-[#575048] dark:fill-[#CBC3B6]" fontFamily="monospace">
              Resonance · Carbonyls · Biomolecules
            </text>
          </svg>
        </div>
      );

    case 'hk-bio-1':
      return (
        <div className="w-full h-full bg-[#ECE6D9] dark:bg-[#24201C] flex items-center justify-center p-4">
          <svg
            viewBox="0 0 360 200"
            className="w-full h-full text-[#1E1B18] dark:text-[#F5F2EB]"
            role="img"
            aria-label="7-celled 8-nucleate embryo sac and Day 14 LH hormone surge curve"
          >
            {/* Left: 7-celled 8-nucleate Embryo Sac */}
            <ellipse cx="96" cy="92" rx="46" ry="62" className="fill-[#FAF8F3] dark:fill-[#1E1B18] stroke-[#3D6B4F] dark:stroke-[#7AB88F]" strokeWidth="2.2" />
            {/* 3 Antipodals */}
            {[78, 96, 114].map((x) => (
              <circle key={x} cx={x} cy="48" r="6" className="fill-[#3D6B4F] dark:fill-[#7AB88F]" opacity="0.8" />
            ))}
            {/* Polar nuclei */}
            <circle cx="90" cy="92" r="6" className="fill-[#A64B33] dark:fill-[#D4785E]" />
            <circle cx="102" cy="92" r="6" className="fill-[#A64B33] dark:fill-[#D4785E]" />
            {/* Egg + Synergids */}
            <circle cx="80" cy="134" r="6" className="fill-[#3D6B4F] dark:fill-[#7AB88F]" opacity="0.8" />
            <circle cx="96" cy="128" r="7.5" className="fill-[#A64B33] dark:fill-[#D4785E]" />
            <circle cx="112" cy="134" r="6" className="fill-[#3D6B4F] dark:fill-[#7AB88F]" opacity="0.8" />
            <text x="50" y="176" fontSize="9.5" fill="currentColor" fontFamily="monospace">7-Celled · 8-Nucleate</text>

            {/* Right: LH Surge Curve */}
            <line x1="186" y1="146" x2="334" y2="146" stroke="currentColor" strokeWidth="1.6" />
            <line x1="186" y1="146" x2="186" y2="42" stroke="currentColor" strokeWidth="1.6" />
            <path d="M 190 134 C 228 132, 246 124, 258 48 C 270 124, 290 134, 330 136" fill="none" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2.4" />
            <line x1="258" y1="48" x2="258" y2="146" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <text x="272" y="64" fontSize="10" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">LH Surge</text>
            <text x="234" y="176" fontSize="9.5" fill="currentColor" fontFamily="monospace">Day 14 Ovulation</text>
          </svg>
        </div>
      );

    case 'hk-bio-3':
      return (
        <div className="w-full h-full bg-[#ECE6D9] dark:bg-[#24201C] flex items-center justify-center p-4">
          <svg
            viewBox="0 0 360 200"
            className="w-full h-full text-[#1E1B18] dark:text-[#F5F2EB]"
            role="img"
            aria-label="pBR322 cloning vector plasmid map and logistic population growth S-curve"
          >
            {/* Left: pBR322 Plasmid */}
            <circle cx="96" cy="92" r="46" fill="none" stroke="currentColor" strokeWidth="5" opacity="0.25" />
            <path d="M 96 46 A 46 46 0 0 1 142 92" fill="none" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="5.5" />
            <path d="M 50 92 A 46 46 0 0 1 96 46" fill="none" className="stroke-[#3D6B4F] dark:stroke-[#7AB88F]" strokeWidth="5.5" />
            <text x="74" y="95" fontSize="11" fontWeight="700" fill="currentColor" fontFamily="monospace">pBR322</text>
            <text x="42" y="42" fontSize="9.5" className="fill-[#3D6B4F] dark:fill-[#7AB88F]" fontWeight="700">ampᴿ</text>
            <text x="128" y="42" fontSize="9.5" className="fill-[#A64B33] dark:fill-[#D4785E]" fontWeight="700">tetᴿ</text>
            <text x="86" y="156" fontSize="9.5" fill="currentColor" fontFamily="monospace">ori · rop</text>

            {/* Right: Verhulst-Pearl Logistic S-Curve */}
            <line x1="196" y1="146" x2="334" y2="146" stroke="currentColor" strokeWidth="1.6" />
            <line x1="196" y1="146" x2="196" y2="42" stroke="currentColor" strokeWidth="1.6" />
            <line x1="196" y1="54" x2="334" y2="54" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 3" />
            <text x="204" y="49" fontSize="9.5" fontWeight="700" fill="currentColor">K (Carrying Capacity)</text>
            <path d="M 200 142 C 242 140, 254 62, 326 56" fill="none" className="stroke-[#3D6B4F] dark:stroke-[#7AB88F]" strokeWidth="2.5" />
            <text x="212" y="174" fontSize="9.5" fill="currentColor" fontFamily="monospace">dN/dt = rN((K−N)/K)</text>
          </svg>
        </div>
      );

    case 'hk-math-1':
      return (
        <div className="w-full h-full bg-[#ECE6D9] dark:bg-[#24201C] flex items-center justify-center p-4">
          <svg
            viewBox="0 0 360 200"
            className="w-full h-full text-[#1E1B18] dark:text-[#F5F2EB]"
            role="img"
            aria-label="3 by 3 matrix inverse formula and inverse sine principal branch curve"
          >
            {/* Left: Matrix A */}
            <polyline points="42,46 32,46 32,140 42,140" fill="none" stroke="currentColor" strokeWidth="2.2" />
            <polyline points="146,46 156,46 156,140 146,140" fill="none" stroke="currentColor" strokeWidth="2.2" />
            <text x="48" y="72" fontSize="13" fontFamily="monospace" className="fill-[#A64B33] dark:fill-[#D4785E]">a₁₁  a₁₂  a₁₃</text>
            <text x="48" y="98" fontSize="13" fontFamily="monospace" fill="currentColor">a₂₁  a₂₂  a₂₃</text>
            <text x="48" y="124" fontSize="13" fontFamily="monospace" fill="currentColor">a₃₁  a₃₂  a₃₃</text>
            <text x="44" y="172" fontSize="10" fill="currentColor" fontFamily="monospace">A⁻¹ = adj(A) / |A|</text>

            {/* Right: sin^-1(x) curve */}
            <line x1="204" y1="95" x2="334" y2="95" stroke="currentColor" strokeWidth="1.4" />
            <line x1="269" y1="38" x2="269" y2="152" stroke="currentColor" strokeWidth="1.4" />
            <path d="M 224 138 C 242 134, 258 112, 269 95 C 280 78, 296 56, 314 52" fill="none" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2.4" />
            <circle cx="224" cy="138" r="3" className="fill-[#A64B33] dark:fill-[#D4785E]" />
            <circle cx="314" cy="52" r="3" className="fill-[#A64B33] dark:fill-[#D4785E]" />
            <text x="218" y="172" fontSize="10" fill="currentColor" fontFamily="monospace">sin⁻¹x ∈ [−π/2, π/2]</text>
          </svg>
        </div>
      );

    case 'hk-math-3':
      return (
        <div className="w-full h-full bg-[#ECE6D9] dark:bg-[#24201C] flex items-center justify-center p-4">
          <svg
            viewBox="0 0 360 200"
            className="w-full h-full text-[#1E1B18] dark:text-[#F5F2EB]"
            role="img"
            aria-label="Linear programming bounded feasible region polygon and 3D skew lines shortest distance"
          >
            {/* Left: LPP Feasible Region */}
            <line x1="36" y1="148" x2="170" y2="148" stroke="currentColor" strokeWidth="1.6" />
            <line x1="36" y1="148" x2="36" y2="34" stroke="currentColor" strokeWidth="1.6" />
            <polygon points="36,148 36,72 94,58 134,108 134,148" className="fill-[#A64B33]/20 dark:fill-[#D4785E]/25 stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2" />
            <circle cx="94" cy="58" r="3.5" className="fill-[#A64B33] dark:fill-[#D4785E]" />
            <text x="98" y="54" fontSize="9.5" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">Z max</text>
            <text x="42" y="174" fontSize="10" fill="currentColor" fontFamily="monospace">LPP Feasible Region</text>

            {/* Right: Skew lines & Bayes */}
            <line x1="202" y1="54" x2="326" y2="90" stroke="currentColor" strokeWidth="2" />
            <line x1="210" y1="138" x2="334" y2="104" stroke="currentColor" strokeWidth="2" />
            <line x1="266" y1="73" x2="266" y2="122" className="stroke-[#3D6B4F] dark:stroke-[#7AB88F]" strokeWidth="2" strokeDasharray="3 2" />
            <text x="272" y="100" fontSize="10" fontWeight="700" className="fill-[#3D6B4F] dark:fill-[#7AB88F]">d min</text>
            <text x="206" y="174" fontSize="10" fill="currentColor" fontFamily="monospace">|(a₂−a₁)·(b₁×b₂)|/|b₁×b₂|</text>
          </svg>
        </div>
      );

    default:
      // Optics (hk-phy-3), Lattice/Coordination (hk-chem-2), Genetics/DNA (hk-bio-2), Calculus (hk-math-2)
      return (
        <ResilientImage
          src={subject.imageUrl}
          alt={subject.imageAlt}
          fallbackTitle={lecture.title}
          className="w-full h-full object-cover"
        />
      );
  }
}

export function HackersPlaylistSection({
  watchedLectures,
  chapterTasks,
  onToggleWatched,
  onSetChapterLectureDone,
}: HackersPlaylistSectionProps) {
  const [filter, setFilter] = useState<FilterOption>('all');
  const [search, setSearch] = useState('');
  const [activeLecture, setActiveLecture] = useState<OneShotLecture | null>(null);
  const [activeEpisodeVideoIdx, setActiveEpisodeVideoIdx] = useState(0);
  const [activePlaylistSubject, setActivePlaylistSubject] =
    useState<SubjectConfig | null>(null);
  const [selectedPlaylistIdx, setSelectedPlaylistIdx] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(() =>
    readStoredAutoAdvance(),
  );
  const [embedMode, setEmbedMode] = useState<EmbedPlayerMode>(() =>
    readStoredEmbedMode(),
  );
  const [isNestedPreview, setIsNestedPreview] = useState(false);
  const [standaloneUrl, setStandaloneUrl] = useState('');
  const [externalOpenedChapter, setExternalOpenedChapter] = useState<{
    chapterId: string;
    title: string;
    mode: 'playlist' | 'episode';
  } | null>(null);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const cycleEmbedMode = () => {
    setEmbedMode((m) => {
      const next: EmbedPlayerMode =
        m === 'standard' ? 'pure' : m === 'pure' ? 'nocookie' : 'standard';
      try {
        window.localStorage.setItem(STORAGE_EMBED_MODE_KEY, next);
      } catch {
        // Ignore
      }
      return next;
    });
  };

  useEffect(() => {
    const syncPlayerPrefs = () => {
      setEmbedMode(readStoredEmbedMode());
      setAutoAdvance(readStoredAutoAdvance());
    };
    window.addEventListener('pcmb-player-prefs-updated', syncPlayerPrefs);
    return () =>
      window.removeEventListener('pcmb-player-prefs-updated', syncPlayerPrefs);
  }, []);

  const embedModeLabel =
    embedMode === 'standard'
      ? 'Player: Standard'
      : embedMode === 'pure'
        ? 'Player: Pure Embed'
        : 'Player: No-Cookie';

  useEffect(() => {
    try {
      setIsNestedPreview(window.self !== window.top);
      setStandaloneUrl(window.location.href);
    } catch {
      setIsNestedPreview(true);
    }
  }, []);

  useEffect(() => {
    if (!activeLecture && !activePlaylistSubject) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveLecture(null);
        setActivePlaylistSubject(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [activeLecture, activePlaylistSubject]);

  useEffect(() => {
    if (!syncNotice) return;
    const timer = window.setTimeout(() => setSyncNotice(null), 5000);
    return () => window.clearTimeout(timer);
  }, [syncNotice]);

  const openSubjectPlaylistModal = (subject: SubjectConfig) => {
    const firstUnwatched = subject.playlistVideos.findIndex(
      (v) => !chapterTasks[v.chapterId]?.lecture,
    );
    setSelectedPlaylistIdx(firstUnwatched >= 0 ? firstUnwatched : 0);
    setExternalOpenedChapter(null);
    setSyncNotice(null);
    setActivePlaylistSubject(subject);
  };

  const openEpisodeModal = (lecture: OneShotLecture) => {
    setActiveEpisodeVideoIdx(0);
    setExternalOpenedChapter(null);
    setSyncNotice(null);
    setActiveLecture(lecture);
  };

  const handlePlaylistVideoCompleted = useCallback(
    (completedVideoId: string) => {
      if (!activePlaylistSubject) return;
      const idx = activePlaylistSubject.playlistVideos.findIndex(
        (v) => v.videoId === completedVideoId,
      );
      const item =
        idx >= 0
          ? activePlaylistSubject.playlistVideos[idx]
          : activePlaylistSubject.playlistVideos[selectedPlaylistIdx];
      if (!item) return;

      onSetChapterLectureDone(item.chapterId, true);
      setSyncNotice(
        `Synced: "${item.title}" marked Watched & Lecture done in Subject Tracker.`,
      );

      if (
        autoAdvance &&
        idx >= 0 &&
        idx < activePlaylistSubject.playlistVideos.length - 1
      ) {
        setSelectedPlaylistIdx(idx + 1);
      }
    },
    [
      activePlaylistSubject,
      autoAdvance,
      onSetChapterLectureDone,
      selectedPlaylistIdx,
    ],
  );

  const handleEpisodeVideoCompleted = useCallback(
    (completedVideoId: string) => {
      if (!activeLecture) return;
      const subject = SUBJECTS.find((s) => s.id === activeLecture.subjectId);
      const episodeVideos =
        subject?.playlistVideos.filter((v) =>
          activeLecture.chapterIds.includes(v.chapterId),
        ) ?? [];
      const idx = episodeVideos.findIndex((v) => v.videoId === completedVideoId);
      const item =
        idx >= 0 ? episodeVideos[idx] : episodeVideos[activeEpisodeVideoIdx];
      if (!item) return;

      onSetChapterLectureDone(item.chapterId, true);
      setSyncNotice(
        `Synced: "${item.title}" marked Watched & Lecture done in Subject Tracker.`,
      );

      if (autoAdvance && idx >= 0 && idx < episodeVideos.length - 1) {
        setActiveEpisodeVideoIdx(idx + 1);
      }
    },
    [activeEpisodeVideoIdx, activeLecture, autoAdvance, onSetChapterLectureDone],
  );

  const filteredLectures = HACKERS_PLAYLIST.filter((lecture) => {
    const matchesSubject = filter === 'all' || lecture.subjectId === filter;
    if (!matchesSubject) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      lecture.title.toLowerCase().includes(q) ||
      lecture.chaptersCovered.toLowerCase().includes(q) ||
      lecture.series.toLowerCase().includes(q)
    );
  });

  const totalPlaylistVideos = SUBJECTS.reduce(
    (sum, s) => sum + s.playlistVideos.length,
    0,
  );
  const watchedPlaylistVideos = SUBJECTS.reduce(
    (sum, s) =>
      sum +
      s.playlistVideos.filter((v) => Boolean(chapterTasks[v.chapterId]?.lecture))
        .length,
    0,
  );

  const getSubjectMeta = (subjectId: SubjectId) =>
    SUBJECTS.find((s) => s.id === subjectId) ?? SUBJECTS[0];

  return (
    <section aria-labelledby="hackers-heading" className="space-y-8">
      {/* Header & Official 12th Hackers Playlist Strip */}
      <div className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-6 sm:p-8 space-y-6 transition-colors duration-200">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 text-xs font-medium tracking-[0.12em] text-[#A64B33] dark:text-[#D4785E]">
              <span className="w-5 h-px bg-[#A64B33] dark:bg-[#D4785E] shrink-0" aria-hidden="true" />
              <span>12th Hackers Official YouTube Playlists · Auto-Synced with Lecture Done</span>
            </div>
            <h1
              id="hackers-heading"
              className="mt-2.5 text-2xl sm:text-3xl font-semibold tracking-tight text-[#1E1B18] dark:text-[#F5F2EB]"
            >
              12th Hackers{' '}
              <em className="italic font-medium text-[#A64B33] dark:text-[#D4785E]">
                One-Shot
              </em>{' '}
              Playlist
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#575048] dark:text-[#CBC3B6] max-w-[65ch]">
              Browse every chapter lecture across all four official 12th Hackers
              YouTube playlists inside Quadra 12. Finishing a lecture in the player
              automatically marks it watched and updates your Subject Tracker.
            </p>
          </div>

          <div className="flex items-center gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#DDD6C7] dark:border-[#332E28]">
            <div>
              <p className="text-xs text-[#787066] dark:text-[#9C9387]">Playlist Lectures Watched</p>
              <p className="mt-1 text-2xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB] font-mono tabular-nums">
                <AnimatedNumber value={watchedPlaylistVideos} /> / {totalPlaylistVideos}
              </p>
            </div>
          </div>
        </div>

        {/* 4 Official Subject Playlist Launchers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {SUBJECTS.map((subject, idx) => {
            const subTotal = subject.playlistVideos.length;
            const subDone = subject.playlistVideos.filter((v) =>
              Boolean(chapterTasks[v.chapterId]?.lecture),
            ).length;
            const subPct = subTotal === 0 ? 0 : Math.round((subDone / subTotal) * 100);

            return (
              <motion.div
                key={subject.id}
                initial={{opacity: 0, y: 18}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, amount: 0.06}}
                whileHover={{y: -3}}
                transition={{
                  duration: 0.4,
                  delay: idx * 0.05,
                  ease: APPLE_EASE,
                  y: APPLE_SPRING,
                }}
                className="p-4 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] flex flex-col justify-between gap-4 apple-surface"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-[#787066] dark:text-[#9C9387] font-mono tabular-nums">
                    <span>Code {subject.code} · {subTotal} Lectures</span>
                    <span
                      className={
                        subDone === subTotal
                          ? 'text-[#3D6B4F] dark:text-[#7AB88F] font-semibold'
                          : ''
                      }
                    >
                      {subDone}/{subTotal}
                    </span>
                  </div>
                  <h2 className="mt-1 text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                    12th Hackers {subject.name}
                  </h2>
                  <div className="mt-2.5 h-1.5 w-full bg-[#DDD6C7] dark:bg-[#332E28] rounded-full overflow-hidden">
                    <motion.div
                      initial={false}
                      animate={{scaleX: subPct / 100}}
                      transition={{type: 'spring', stiffness: 120, damping: 20}}
                      className={`h-full w-full origin-left rounded-full ${
                        subDone === subTotal
                          ? 'bg-[#3D6B4F] dark:bg-[#7AB88F] progress-shimmer'
                          : 'bg-[#A64B33] dark:bg-[#D4785E]'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <motion.button
                    type="button"
                    whileTap={{scale: 0.96}}
                    onClick={() => openSubjectPlaylistModal(subject)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#F5F2EB] dark:text-[#1E1B18] bg-[#1E1B18] hover:bg-[#332E28] dark:bg-[#F5F2EB] dark:hover:bg-[#E8E2D5] rounded-lg transition-colors whitespace-nowrap"
                  >
                    <ListVideo className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Watch Playlist</span>
                  </motion.button>
                  <a
                    href={subject.playlistUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${subject.name} 12th Hackers playlist on YouTube`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#575048] dark:text-[#CBC3B6] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB] whitespace-nowrap"
                  >
                    <span>YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Filter Bar & Search with Gliding Segmented Pill */}
        <div className="pt-4 border-t border-[#DDD6C7] dark:border-[#332E28] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div
            role="group"
            aria-label="Filter playlist by subject"
            className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#ECE6D9] dark:bg-[#24201C] rounded-lg self-start"
          >
            {FILTER_TABS.map((tab) => {
              const isSelected = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  aria-pressed={isSelected}
                  className={`relative px-3.5 py-2 text-xs font-medium rounded-md transition-colors duration-200 whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'text-[#1E1B18] dark:text-[#F5F2EB]'
                      : 'text-[#575048] dark:text-[#9C9387] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB]'
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="hackers-filter-pill"
                      transition={APPLE_SPRING}
                      className="absolute inset-0 rounded-md bg-[#FAF8F3] dark:bg-[#1E1B18] shadow-xs"
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72">
            <Search
              className="w-4 h-4 text-[#787066] dark:text-[#9C9387] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search topic or chapter..."
              aria-label="Search 12th Hackers lectures"
              className="w-full pl-9 pr-3.5 py-2 text-sm bg-[#F5F2EB] dark:bg-[#161412] border border-[#DDD6C7] dark:border-[#332E28] rounded-lg text-[#1E1B18] dark:text-[#F5F2EB] placeholder:text-[#968E83] dark:placeholder:text-[#787066] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#A64B33]"
            />
          </div>
        </div>
      </div>

      {/* Playlist Episode Grid */}
      {filteredLectures.length === 0 ? (
        <div className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-10 text-center">
          <p className="text-sm font-medium text-[#1E1B18] dark:text-[#F5F2EB]">
            No lectures found matching &ldquo;{search}&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => {
              setFilter('all');
              setSearch('');
            }}
            className="mt-3 px-4 py-2 text-xs font-medium text-[#A64B33] dark:text-[#D4785E] hover:underline"
          >
            Show All Lectures
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLectures.map((lecture, idx) => {
            const subject = getSubjectMeta(lecture.subjectId);
            const episodeChapterDoneCount = lecture.chapterIds.filter((id) =>
              Boolean(chapterTasks[id]?.lecture),
            ).length;
            const isWatched =
              Boolean(watchedLectures[lecture.id]) ||
              (lecture.chapterIds.length > 0 &&
                episodeChapterDoneCount === lecture.chapterIds.length);

            return (
              <motion.article
                key={lecture.id}
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, amount: 0.06}}
                whileHover={{y: -4}}
                transition={{
                  duration: 0.42,
                  delay: (idx % 3) * 0.05,
                  ease: APPLE_EASE,
                  y: APPLE_SPRING,
                }}
                className="group bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl overflow-hidden flex flex-col justify-between apple-surface hover:border-[#B8AF9F] dark:hover:border-[#4A423A]"
              >
                <div>
                  <div className="relative aspect-[16/9] border-b border-[#DDD6C7] dark:border-[#332E28] overflow-hidden bg-[#ECE6D9] dark:bg-[#24201C]">
                    <LectureVisualPlate lecture={lecture} subject={subject} />
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#787066] dark:text-[#9C9387]">
                      <span>{subject.name}</span>
                      <span aria-hidden="true">·</span>
                      <span>{lecture.episodeNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {episodeChapterDoneCount}/{lecture.chapterIds.length} lectures
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-semibold leading-snug text-[#1E1B18] dark:text-[#F5F2EB]">
                      {lecture.title}
                    </h2>

                    <p className="text-xs text-[#575048] dark:text-[#CBC3B6] leading-relaxed">
                      {lecture.chaptersCovered}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-4 border-t border-[#DDD6C7] dark:border-[#332E28] flex items-center justify-between gap-3 bg-[#F5F2EB]/70 dark:bg-[#24201C]/70">
                  <button
                    type="button"
                    onClick={() => onToggleWatched(lecture.id)}
                    aria-pressed={isWatched}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      isWatched
                        ? 'text-[#3D6B4F] dark:text-[#7AB88F]'
                        : 'text-[#575048] dark:text-[#CBC3B6] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB]'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    <span>{isWatched ? 'Watched' : 'Mark Watched'}</span>
                  </button>

                  <motion.button
                    type="button"
                    whileTap={{scale: 0.96}}
                    onClick={() => openEpisodeModal(lecture)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#F5F2EB] dark:text-[#1E1B18] bg-[#1E1B18] hover:bg-[#332E28] dark:bg-[#F5F2EB] dark:hover:bg-[#E8E2D5] rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    <Play className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Watch &amp; Notes</span>
                  </motion.button>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}

      {/* Official Full YouTube Playlist Theater Modal (With Clickable Lecture Queue & Auto-Sync) */}
      <AnimatePresence>
        {activePlaylistSubject && (() => {
          const videos = activePlaylistSubject.playlistVideos;
          const safeIdx = Math.min(selectedPlaylistIdx, Math.max(0, videos.length - 1));
          const currentVideo = videos[safeIdx];
          const doneInPlaylist = videos.filter((v) =>
            Boolean(chapterTasks[v.chapterId]?.lecture),
          ).length;
          const isCurrentDone = currentVideo
            ? Boolean(chapterTasks[currentVideo.chapterId]?.lecture)
            : false;

          return (
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 0.18}}
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#161412]/70 dark:bg-black/80 backdrop-blur-xs p-3 sm:p-6"
              onClick={() => setActivePlaylistSubject(null)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="playlist-player-title"
            >
              <motion.div
                initial={{opacity: 0, y: 14, scale: 0.98}}
                animate={{opacity: 1, y: 0, scale: 1}}
                exit={{opacity: 0, y: 10, scale: 0.98}}
                transition={{duration: 0.2, ease: [0.16, 1, 0.3, 1]}}
                className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-wrap items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-[#DDD6C7] dark:border-[#332E28] shrink-0">
                  <div>
                    <p className="text-xs text-[#787066] dark:text-[#9C9387] font-mono tabular-nums">
                      Official 12th Hackers Series · Code {activePlaylistSubject.code} · {doneInPlaylist}/{videos.length} Watched
                    </p>
                    <h2
                      id="playlist-player-title"
                      className="text-lg font-semibold text-[#1E1B18] dark:text-[#F5F2EB]"
                    >
                      12th Hackers — {activePlaylistSubject.name} Full Playlist
                    </h2>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={cycleEmbedMode}
                      title="Cycle between Standard Sync, Pure YouTube Embed, and No-Cookie Embed"
                      className="px-3 py-2 text-xs font-medium text-[#575048] dark:text-[#CBC3B6] bg-[#F5F2EB] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB] rounded-lg whitespace-nowrap"
                    >
                      {embedModeLabel}
                    </button>
                    <a
                      href={
                        currentVideo
                          ? `https://www.youtube.com/watch?v=${currentVideo.videoId}&list=${activePlaylistSubject.playlistId}`
                          : activePlaylistSubject.playlistUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        if (currentVideo) {
                          setExternalOpenedChapter({
                            chapterId: currentVideo.chapterId,
                            title: currentVideo.title,
                            mode: 'playlist',
                          });
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#1E1B18] dark:text-[#F5F2EB] bg-[#F5F2EB] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] hover:bg-[#ECE6D9] dark:hover:bg-[#332E28] rounded-lg whitespace-nowrap"
                    >
                      <span>Open on YouTube</span>
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setActivePlaylistSubject(null)}
                      aria-label="Close playlist player"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[#575048] dark:text-[#CBC3B6] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB] hover:bg-[#ECE6D9] dark:hover:bg-[#24201C]"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto flex-1">
                  {/* Left: Synced YouTube Player & Controls */}
                  <div className="lg:col-span-8 flex flex-col border-b lg:border-b-0 lg:border-r border-[#DDD6C7] dark:border-[#332E28]">
                    <div className="aspect-video w-full bg-[#161412]">
                      {currentVideo && (
                        <YouTubeSyncPlayer
                          videoId={currentVideo.videoId}
                          title={`12th Hackers ${activePlaylistSubject.name} — ${currentVideo.title}`}
                          embedMode={embedMode}
                          onVideoCompleted={handlePlaylistVideoCompleted}
                        />
                      )}
                    </div>

                    <div className="p-4 sm:p-5 space-y-3 bg-[#FAF8F3] dark:bg-[#1E1B18]">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-mono tabular-nums text-[#A64B33] dark:text-[#D4785E]">
                            Lecture {String(safeIdx + 1).padStart(2, '0')} of {videos.length} · Auto-marks Lecture done on finish
                          </p>
                          <h3 className="mt-0.5 text-base sm:text-lg font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                            {currentVideo?.title}
                          </h3>
                        </div>

                        {currentVideo && (
                          <button
                            type="button"
                            onClick={() =>
                              onSetChapterLectureDone(
                                currentVideo.chapterId,
                                !isCurrentDone,
                              )
                            }
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                              isCurrentDone
                                ? 'bg-[#E8F0EA] dark:bg-[#1C2E22] border-[#3D6B4F] dark:border-[#7AB88F] text-[#23422F] dark:text-[#B6DFC3]'
                                : 'bg-[#1E1B18] dark:bg-[#F5F2EB] border-[#1E1B18] dark:border-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18]'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>
                              {isCurrentDone
                                ? 'Watched · Lecture done'
                                : 'Mark Lecture Watched'}
                            </span>
                          </button>
                        )}
                      </div>

                      {syncNotice && (
                        <div className="px-3.5 py-2.5 rounded-lg bg-[#E8F0EA] dark:bg-[#1C2E22] border border-[#B8D0BF] dark:border-[#2F4D39] text-xs font-medium text-[#23422F] dark:text-[#B6DFC3] flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                          <span>{syncNotice}</span>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={safeIdx <= 0}
                            onClick={() => setSelectedPlaylistIdx((i) => Math.max(0, i - 1))}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB] disabled:opacity-40"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Previous</span>
                          </button>
                          <button
                            type="button"
                            disabled={safeIdx >= videos.length - 1}
                            onClick={() =>
                              setSelectedPlaylistIdx((i) =>
                                Math.min(videos.length - 1, i + 1),
                              )
                            }
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB] disabled:opacity-40"
                          >
                            <span>Next Lecture</span>
                            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>

                        <label className="inline-flex items-center gap-2 text-xs text-[#575048] dark:text-[#CBC3B6] cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={autoAdvance}
                            onChange={(e) => setAutoAdvance(e.target.checked)}
                            className="accent-[#A64B33] rounded"
                          />
                          <span>Auto-play next lecture</span>
                        </label>
                      </div>

                      {externalOpenedChapter?.mode === 'playlist' && (
                        <div className="px-3.5 py-2.5 rounded-lg bg-[#E8F0EA] dark:bg-[#1C2E22] border border-[#B8D0BF] dark:border-[#2F4D39] flex flex-wrap items-center justify-between gap-2 text-xs text-[#23422F] dark:text-[#B6DFC3]">
                          <span>
                            Watching <strong>{externalOpenedChapter.title}</strong> on YouTube?
                          </span>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                onSetChapterLectureDone(externalOpenedChapter.chapterId, true);
                                setSyncNotice(
                                  `Synced: "${externalOpenedChapter.title}" marked Watched & Lecture done.`,
                                );
                                setExternalOpenedChapter(null);
                                if (safeIdx < videos.length - 1) {
                                  setSelectedPlaylistIdx(safeIdx + 1);
                                }
                              }}
                              className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-[#3D6B4F] text-[#F5F2EB] hover:bg-[#315940]"
                            >
                              Mark Done &amp; Next
                            </button>
                            <button
                              type="button"
                              onClick={() => setExternalOpenedChapter(null)}
                              className="px-2 py-1 text-[11px] font-medium hover:underline"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="px-3.5 py-2.5 rounded-lg bg-[#F5F2EB] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] flex flex-wrap items-center justify-between gap-2.5 text-[11px] text-[#575048] dark:text-[#CBC3B6]">
                        <span>
                          If the embed spins endlessly, an ad-blocker/browser shield or nested preview frame is blocking YouTube&rsquo;s pre-roll ad check. Try cycling <strong className="text-[#1E1B18] dark:text-[#F5F2EB]">{embedModeLabel}</strong>, pausing shields/ad-block for this site, or opening in a full tab.
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          {isNestedPreview && standaloneUrl && (
                            <a
                              href={standaloneUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 font-medium rounded-md bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] hover:opacity-90 whitespace-nowrap"
                            >
                              <span>Open Quadra 12 in Full Tab</span>
                              <ExternalLink className="w-3 h-3" aria-hidden="true" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Complete Clickable Playlist Queue */}
                  <div className="lg:col-span-4 flex flex-col bg-[#F5F2EB]/60 dark:bg-[#161412]/70 max-h-[380px] lg:max-h-[560px]">
                    <div className="px-4 py-3 border-b border-[#DDD6C7] dark:border-[#332E28] flex items-center justify-between gap-2 shrink-0">
                      <span className="text-xs font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                        All {videos.length} Playlist Lectures
                      </span>
                      <span className="text-[11px] font-mono tabular-nums text-[#787066] dark:text-[#9C9387]">
                        {doneInPlaylist}/{videos.length} done
                      </span>
                    </div>

                    <div className="overflow-y-auto divide-y divide-[#DDD6C7] dark:divide-[#332E28] flex-1">
                      {videos.map((vid, vIdx) => {
                        const isPlaying = vIdx === safeIdx;
                        const isDone = Boolean(chapterTasks[vid.chapterId]?.lecture);
                        return (
                          <div
                            key={vid.videoId}
                            className={`flex items-center gap-2.5 px-3.5 py-2.5 transition-colors ${
                              isPlaying
                                ? 'bg-[#ECE6D9] dark:bg-[#28231F]'
                                : 'hover:bg-[#ECE6D9]/60 dark:hover:bg-[#24201C]'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => setSelectedPlaylistIdx(vIdx)}
                              className="flex items-center gap-2.5 flex-1 min-w-0 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A64B33]"
                            >
                              <span
                                className={`text-[11px] font-mono tabular-nums w-5 shrink-0 ${
                                  isPlaying
                                    ? 'font-bold text-[#A64B33] dark:text-[#D4785E]'
                                    : 'text-[#787066] dark:text-[#9C9387]'
                                }`}
                              >
                                {String(vIdx + 1).padStart(2, '0')}
                              </span>
                              <img
                                src={`https://i.ytimg.com/vi/${vid.videoId}/mqdefault.jpg`}
                                alt=""
                                loading="lazy"
                                className="w-16 aspect-video rounded object-cover border border-[#DDD6C7] dark:border-[#332E28] shrink-0 bg-[#ECE6D9] dark:bg-[#24201C]"
                              />
                              <div className="min-w-0 flex-1">
                                <p
                                  className={`text-xs font-medium leading-snug line-clamp-2 ${
                                    isPlaying
                                      ? 'text-[#A64B33] dark:text-[#D4785E]'
                                      : 'text-[#1E1B18] dark:text-[#F5F2EB]'
                                  }`}
                                >
                                  {vid.title}
                                </p>
                                <p className="mt-0.5 text-[10px] font-mono text-[#787066] dark:text-[#9C9387]">
                                  {isPlaying
                                    ? 'Now Playing'
                                    : isDone
                                      ? 'Watched · Lecture done'
                                      : 'One-Shot Lecture'}
                                </p>
                              </div>
                            </button>

                            <button
                              type="button"
                              role="checkbox"
                              aria-checked={isDone}
                              aria-label={`Mark ${vid.title} as ${isDone ? 'unwatched' : 'watched'}`}
                              onClick={() =>
                                onSetChapterLectureDone(vid.chapterId, !isDone)
                              }
                              className={`w-6 h-6 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                isDone
                                  ? 'bg-[#3D6B4F] dark:bg-[#7AB88F] border-[#3D6B4F] dark:border-[#7AB88F] text-[#F5F2EB] dark:text-[#161412]'
                                  : 'border-[#B8AF9F] dark:border-[#575048] bg-[#FAF8F3] dark:bg-[#1E1B18] text-transparent hover:border-[#A64B33]'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Episode Study Workspace + Embedded Chapter Lecture Switcher Modal */}
      <AnimatePresence>
        {activeLecture && (() => {
          const subject = getSubjectMeta(activeLecture.subjectId);
          const episodeVideos = subject.playlistVideos.filter((v) =>
            activeLecture.chapterIds.includes(v.chapterId),
          );
          const safeEpIdx = Math.min(
            activeEpisodeVideoIdx,
            Math.max(0, episodeVideos.length - 1),
          );
          const currentEpVideo = episodeVideos[safeEpIdx];
          const currentEpDone = currentEpVideo
            ? Boolean(chapterTasks[currentEpVideo.chapterId]?.lecture)
            : false;

          return (
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 0.18}}
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#161412]/70 dark:bg-black/80 backdrop-blur-xs p-4 sm:p-6"
              onClick={() => setActiveLecture(null)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="lecture-modal-title"
            >
              <motion.div
                initial={{opacity: 0, y: 14, scale: 0.98}}
                animate={{opacity: 1, y: 0, scale: 1}}
                exit={{opacity: 0, y: 10, scale: 0.98}}
                transition={{duration: 0.2, ease: [0.16, 1, 0.3, 1]}}
                className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-[#FAF8F3] dark:bg-[#1E1B18] px-6 py-4 border-b border-[#DDD6C7] dark:border-[#332E28]">
                  <div className="flex items-center gap-2 text-xs text-[#787066] dark:text-[#9C9387]">
                    <span>{activeLecture.series}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeLecture.episodeNumber}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{episodeVideos.length} Chapter Videos</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={cycleEmbedMode}
                      title="Cycle between Standard Sync, Pure YouTube Embed, and No-Cookie Embed"
                      className="px-2.5 py-1.5 text-xs font-medium text-[#575048] dark:text-[#CBC3B6] bg-[#F5F2EB] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB] rounded-lg whitespace-nowrap"
                    >
                      {embedModeLabel}
                    </button>
                    <a
                      href={
                        currentEpVideo
                          ? `https://www.youtube.com/watch?v=${currentEpVideo.videoId}&list=${activeLecture.playlistId}`
                          : activeLecture.playlistUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        if (currentEpVideo) {
                          setExternalOpenedChapter({
                            chapterId: currentEpVideo.chapterId,
                            title: currentEpVideo.title,
                            mode: 'episode',
                          });
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#A64B33] dark:text-[#D4785E] hover:underline whitespace-nowrap"
                    >
                      <span>Watch on YouTube</span>
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setActiveLecture(null)}
                      aria-label="Close lecture workspace"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[#575048] dark:text-[#CBC3B6] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB] hover:bg-[#ECE6D9] dark:hover:bg-[#24201C]"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-5">
                  <div>
                    <h2
                      id="lecture-modal-title"
                      className="text-xl sm:text-2xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB]"
                    >
                      {activeLecture.title}
                    </h2>
                    <p className="mt-1.5 text-sm text-[#575048] dark:text-[#CBC3B6]">
                      {activeLecture.chaptersCovered}
                    </p>
                  </div>

                  {/* Chapter Video Tabs inside this Episode */}
                  {episodeVideos.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-[#787066] dark:text-[#9C9387]">
                        Select chapter lecture from this unit ({episodeVideos.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {episodeVideos.map((vid, vIdx) => {
                          const isSelected = vIdx === safeEpIdx;
                          const isVidDone = Boolean(chapterTasks[vid.chapterId]?.lecture);
                          return (
                            <button
                              key={vid.videoId}
                              type="button"
                              onClick={() => setActiveEpisodeVideoIdx(vIdx)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                                isSelected
                                  ? 'bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] border-[#1E1B18] dark:border-[#F5F2EB]'
                                  : isVidDone
                                    ? 'bg-[#E8F0EA] dark:bg-[#1C2E22] border-[#3D6B4F] dark:border-[#7AB88F] text-[#23422F] dark:text-[#B6DFC3]'
                                    : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#1E1B18] dark:text-[#F5F2EB] hover:border-[#B8AF9F]'
                              }`}
                            >
                              {isVidDone && (
                                <Check className="w-3 h-3 shrink-0" aria-hidden="true" />
                              )}
                              <span>{vid.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Synced YouTube Player for the Selected Chapter Video */}
                  <div className="aspect-video w-full rounded-xl overflow-hidden border border-[#DDD6C7] dark:border-[#332E28] bg-[#161412]">
                    {currentEpVideo ? (
                      <YouTubeSyncPlayer
                        videoId={currentEpVideo.videoId}
                        title={currentEpVideo.title}
                        embedMode={embedMode}
                        onVideoCompleted={handleEpisodeVideoCompleted}
                      />
                    ) : (
                      <iframe
                        src={`https://www.youtube.com/embed/videoseries?list=${activeLecture.playlistId}`}
                        title={activeLecture.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    )}
                  </div>

                  {currentEpVideo && (
                    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-lg bg-[#F5F2EB] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28]">
                      <div className="text-xs text-[#575048] dark:text-[#CBC3B6]">
                        Playing:{' '}
                        <span className="font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                          {currentEpVideo.title}
                        </span>{' '}
                        · Auto-syncs with Subject Tracker Lecture done
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          onSetChapterLectureDone(
                            currentEpVideo.chapterId,
                            !currentEpDone,
                          )
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                          currentEpDone
                            ? 'bg-[#E8F0EA] dark:bg-[#1C2E22] border-[#3D6B4F] dark:border-[#7AB88F] text-[#23422F] dark:text-[#B6DFC3]'
                            : 'bg-[#FAF8F3] dark:bg-[#1E1B18] border-[#DDD6C7] dark:border-[#332E28] text-[#1E1B18] dark:text-[#F5F2EB]'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>
                          {currentEpDone
                            ? 'Lecture done (Click to Undo)'
                            : 'Mark This Lecture Done'}
                        </span>
                      </button>
                    </div>
                  )}

                  {externalOpenedChapter?.mode === 'episode' && (
                    <div className="px-3.5 py-2.5 rounded-lg bg-[#E8F0EA] dark:bg-[#1C2E22] border border-[#B8D0BF] dark:border-[#2F4D39] flex flex-wrap items-center justify-between gap-2 text-xs text-[#23422F] dark:text-[#B6DFC3]">
                      <span>
                        Watching <strong>{externalOpenedChapter.title}</strong> on YouTube?
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            onSetChapterLectureDone(externalOpenedChapter.chapterId, true);
                            setSyncNotice(
                              `Synced: "${externalOpenedChapter.title}" marked Watched & Lecture done.`,
                            );
                            setExternalOpenedChapter(null);
                            if (safeEpIdx < episodeVideos.length - 1) {
                              setActiveEpisodeVideoIdx(safeEpIdx + 1);
                            }
                          }}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-[#3D6B4F] text-[#F5F2EB] hover:bg-[#315940]"
                        >
                          Mark Done &amp; Next
                        </button>
                        <button
                          type="button"
                          onClick={() => setExternalOpenedChapter(null)}
                          className="px-2 py-1 text-[11px] font-medium hover:underline"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="px-3.5 py-2.5 rounded-lg bg-[#F5F2EB] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] flex flex-wrap items-center justify-between gap-2.5 text-[11px] text-[#575048] dark:text-[#CBC3B6]">
                    <span>
                      Embed spinning endlessly? Pause ad-blockers/shields for this site (blocked ads stall embedded YouTube), switch <strong className="text-[#1E1B18] dark:text-[#F5F2EB]">{embedModeLabel}</strong>, or open in a full browser tab.
                    </span>
                    {isNestedPreview && standaloneUrl && (
                      <a
                        href={standaloneUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 font-medium rounded-md bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] hover:opacity-90 whitespace-nowrap shrink-0"
                      >
                        <span>Open Quadra 12 in Full Tab</span>
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                    )}
                  </div>

                  {syncNotice && (
                    <div className="px-3.5 py-2.5 rounded-lg bg-[#E8F0EA] dark:bg-[#1C2E22] border border-[#B8D0BF] dark:border-[#2F4D39] text-xs font-medium text-[#23422F] dark:text-[#B6DFC3] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{syncNotice}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div>
                      <h3 className="text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                        High-Yield Board Topics
                      </h3>
                      <ul className="mt-2.5 space-y-2 text-sm text-[#575048] dark:text-[#CBC3B6]">
                        {activeLecture.keyTakeaways.map((point) => (
                          <li key={point} className="flex items-start gap-2">
                            <span className="text-[#A64B33] dark:text-[#D4785E]" aria-hidden="true">–</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                        Key Formulas &amp; Facts
                      </h3>
                      <ul className="mt-2.5 space-y-2 text-xs sm:text-sm font-mono text-[#1E1B18] dark:text-[#F5F2EB]">
                        {activeLecture.formulasAndNotes.map((formula) => (
                          <li
                            key={formula}
                            className="px-3 py-2 rounded-lg bg-[#F5F2EB] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28]"
                          >
                            {formula}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#DDD6C7] dark:border-[#332E28] flex flex-wrap items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveLecture(null)}
                      className="px-4 py-2 text-xs font-medium text-[#575048] dark:text-[#CBC3B6] bg-[#FAF8F3] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB] rounded-lg"
                    >
                      Close
                    </button>
                    <motion.button
                      type="button"
                      whileTap={{scale: 0.97}}
                      onClick={() => {
                        onToggleWatched(activeLecture.id);
                        setActiveLecture(null);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#F5F2EB] bg-[#3D6B4F] hover:bg-[#315940] rounded-lg"
                    >
                      <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                      <span>
                        {watchedLectures[activeLecture.id]
                          ? 'Mark Episode Unwatched'
                          : 'Complete All Chapters in Episode'}
                      </span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </section>
  );
}
