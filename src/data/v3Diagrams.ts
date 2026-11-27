import {MARKING_SCHEME_DIAGRAM_SVGS, QUESTION_DIAGRAM_SVGS} from './diagramSvgs';
import {PHYSICS_V3_DIAGRAMS} from './diagrams/physicsDiagrams';
import {CHEMISTRY_V3_DIAGRAMS} from './diagrams/chemistryDiagrams';
import {BIOLOGY_V3_DIAGRAMS} from './diagrams/biologyDiagrams';
import {MATHS_V3_DIAGRAMS} from './diagrams/mathsDiagrams';

export interface DiagramMetadata {
  id: string;
  subjectId: 'physics' | 'chemistry' | 'biology' | 'maths';
  title: string;
  caption: string;
  svg: string;
}

const V3_CUSTOM_DIAGRAMS: Record<string, DiagramMetadata> = {
  ...PHYSICS_V3_DIAGRAMS,
  ...CHEMISTRY_V3_DIAGRAMS,
  ...BIOLOGY_V3_DIAGRAMS,
  ...MATHS_V3_DIAGRAMS,
  'phy-v3-equipotential-dipole': {
    id: 'phy-v3-equipotential-dipole',
    subjectId: 'physics',
    title: 'Equipotential Surfaces & Field Lines of Electric Dipole',
    caption: 'Solid blue: Electric field lines (+q → -q); Dashed orange: Equipotential surfaces (close between opposite charges, V = 0 bisecting plane).',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Equipotential surfaces and electric field lines around an electric dipole">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <line x1="220" y1="16" x2="220" y2="224" stroke="#EA580C" stroke-width="2" stroke-dasharray="6,4"/>
  <text x="226" y="30" font-family="sans-serif" font-size="11" font-weight="600" fill="#EA580C">Equipotential Plane V = 0 V</text>
  <ellipse cx="145" cy="120" rx="44" ry="52" fill="none" stroke="#EA580C" stroke-width="1.5" stroke-dasharray="5,4"/>
  <ellipse cx="138" cy="120" rx="28" ry="34" fill="none" stroke="#EA580C" stroke-width="1.5" stroke-dasharray="5,4"/>
  <ellipse cx="295" cy="120" rx="44" ry="52" fill="none" stroke="#EA580C" stroke-width="1.5" stroke-dasharray="5,4"/>
  <ellipse cx="302" cy="120" rx="28" ry="34" fill="none" stroke="#EA580C" stroke-width="1.5" stroke-dasharray="5,4"/>
  <path d="M 145 120 L 295 120" stroke="#1D4ED8" stroke-width="2"/>
  <polygon points="222,120 212,115 212,125" fill="#1D4ED8"/>
  <path d="M 145 110 C 175 62, 265 62, 295 110" fill="none" stroke="#1D4ED8" stroke-width="1.8"/>
  <polygon points="225,74 215,69 215,79" fill="#1D4ED8"/>
  <path d="M 145 130 C 175 178, 265 178, 295 130" fill="none" stroke="#1D4ED8" stroke-width="1.8"/>
  <polygon points="225,166 215,161 215,171" fill="#1D4ED8"/>
  <circle cx="135" cy="120" r="14" fill="#DC2626"/>
  <text x="135" y="124" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="700" fill="#FFFFFF">+q</text>
  <circle cx="305" cy="120" r="14" fill="#1D4ED8"/>
  <text x="305" y="124" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="700" fill="#FFFFFF">-q</text>
  <text x="68" y="216" font-family="monospace" font-size="10.5" fill="#334155">E is always perpendicular to equipotential surfaces (dV = -E·dr)</text>
</svg>`,
  },
  'phy-v3-wheatstone-bridge': {
    id: 'phy-v3-wheatstone-bridge',
    subjectId: 'physics',
    title: 'Balanced Wheatstone Bridge Circuit',
    caption: 'Bridge balance condition: P / Q = R / S when galvanometer current I_g = 0 (V_B = V_D).',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Balanced Wheatstone bridge network with resistors P, Q, R, S and central galvanometer G">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <line x1="90" y1="110" x2="220" y2="40" stroke="#1E293B" stroke-width="2"/>
  <line x1="220" y1="40" x2="350" y2="110" stroke="#1E293B" stroke-width="2"/>
  <line x1="90" y1="110" x2="220" y2="180" stroke="#1E293B" stroke-width="2"/>
  <line x1="220" y1="180" x2="350" y2="110" stroke="#1E293B" stroke-width="2"/>
  <line x1="220" y1="40" x2="220" y2="180" stroke="#A64B33" stroke-width="2"/>
  <circle cx="220" cy="110" r="16" fill="#FAF8F3" stroke="#A64B33" stroke-width="2"/>
  <text x="220" y="114" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="700" fill="#A64B33">G</text>
  <text x="256" y="114" font-family="monospace" font-size="11" fill="#3D6B4F">I_g = 0 at balance</text>
  <rect x="135" y="61" width="32" height="18" rx="3" fill="#EFF6FF" stroke="#1D4ED8"/>
  <text x="151" y="74" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#1D4ED8">P</text>
  <rect x="273" y="61" width="32" height="18" rx="3" fill="#EFF6FF" stroke="#1D4ED8"/>
  <text x="289" y="74" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#1D4ED8">Q</text>
  <rect x="135" y="141" width="32" height="18" rx="3" fill="#EFF6FF" stroke="#1D4ED8"/>
  <text x="151" y="154" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#1D4ED8">R</text>
  <rect x="273" y="141" width="32" height="18" rx="3" fill="#EFF6FF" stroke="#1D4ED8"/>
  <text x="289" y="154" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#1D4ED8">S</text>
  <text x="72" y="114" font-family="sans-serif" font-size="11" font-weight="700" fill="#1E293B">A</text>
  <text x="220" y="28" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#1E293B">B</text>
  <text x="364" y="114" font-family="sans-serif" font-size="11" font-weight="700" fill="#1E293B">C</text>
  <text x="220" y="198" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#1E293B">D</text>
  <path d="M 90 110 L 90 218 L 208 218 M 226 218 L 350 218 L 350 110" fill="none" stroke="#475569" stroke-width="1.6"/>
  <line x1="208" y1="208" x2="208" y2="228" stroke="#1E293B" stroke-width="2.5"/>
  <line x1="226" y1="212" x2="226" y2="224" stroke="#1E293B" stroke-width="2.5"/>
  <text x="370" y="222" font-family="monospace" font-size="10.5" fill="#1E293B">P/Q = R/S</text>
</svg>`,
  },
  'phy-v3-photoelectric-graph': {
    id: 'phy-v3-photoelectric-graph',
    subjectId: 'physics',
    title: 'Stopping Potential (V₀) vs Frequency (ν) for Two Metals',
    caption: 'Both metals share identical slope h/e (6.63×10⁻³⁴ / 1.6×10⁻¹⁹ J·s/C); x-intercept equals threshold frequency ν₀.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Graph of stopping potential V0 in volts on y-axis versus light frequency nu on x-axis for two metals M1 and M2">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <line x1="60" y1="190" x2="405" y2="190" stroke="#1E293B" stroke-width="1.8"/>
  <line x1="60" y1="24" x2="60" y2="215" stroke="#1E293B" stroke-width="1.8"/>
  <text x="330" y="210" font-family="sans-serif" font-size="11" font-weight="600" fill="#1E293B">Frequency ν (Hz)</text>
  <text x="16" y="42" font-family="sans-serif" font-size="11" font-weight="600" fill="#1E293B">V₀ (V)</text>
  <line x1="145" y1="190" x2="275" y2="45" stroke="#1D4ED8" stroke-width="2.4"/>
  <line x1="215" y1="190" x2="345" y2="45" stroke="#A64B33" stroke-width="2.4"/>
  <line x1="60" y1="210" x2="145" y2="190" stroke="#1D4ED8" stroke-width="1" stroke-dasharray="3,3" opacity="0"/>
  <circle cx="145" cy="190" r="3.5" fill="#1D4ED8"/>
  <circle cx="215" cy="190" r="3.5" fill="#A64B33"/>
  <text x="135" y="206" font-family="monospace" font-size="10.5" fill="#1D4ED8">ν₀₁</text>
  <text x="206" y="206" font-family="monospace" font-size="10.5" fill="#A64B33">ν₀₂</text>
  <text x="282" y="54" font-family="sans-serif" font-size="11" font-weight="600" fill="#1D4ED8">Metal A (lower φ₀)</text>
  <text x="350" y="64" font-family="sans-serif" font-size="11" font-weight="600" fill="#A64B33">Metal B</text>
  <text x="72" y="38" font-family="monospace" font-size="10.5" fill="#3D6B4F">Slope = tan θ = h / e (Universal constant)</text>
</svg>`,
  },
  'phy-v3-ydse-setup': {
    id: 'phy-v3-ydse-setup',
    subjectId: 'physics',
    title: 'Young Double Slit Experiment (YDSE) Geometry',
    caption: 'Slit separation d, screen distance D (D ≫ d). Fringe width β = λD / d for coherent sources S₁ and S₂.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 230" width="440" height="230" role="img" aria-label="Young Double Slit Interference setup showing slits S1, S2 separated by d, distance D to screen, and central fringe O">
  <rect width="440" height="230" fill="#FFFFFF" rx="8"/>
  <line x1="120" y1="25" x2="120" y2="85" stroke="#1E293B" stroke-width="4"/>
  <line x1="120" y1="98" x2="120" y2="142" stroke="#1E293B" stroke-width="4"/>
  <line x1="120" y1="155" x2="120" y2="205" stroke="#1E293B" stroke-width="4"/>
  <line x1="370" y1="20" x2="370" y2="210" stroke="#1E293B" stroke-width="3"/>
  <line x1="50" y1="120" x2="370" y2="120" stroke="#94A3B8" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="120" y1="91" x2="370" y2="55" stroke="#1D4ED8" stroke-width="1.8"/>
  <line x1="120" y1="149" x2="370" y2="55" stroke="#A64B33" stroke-width="1.8"/>
  <circle cx="50" cy="120" r="5" fill="#D97706"/>
  <text x="38" y="114" font-family="sans-serif" font-size="11" font-weight="700" fill="#1E293B">S</text>
  <line x1="50" y1="120" x2="120" y2="91" stroke="#D97706" stroke-width="1.4"/>
  <line x1="50" y1="120" x2="120" y2="149" stroke="#D97706" stroke-width="1.4"/>
  <text x="100" y="94" font-family="sans-serif" font-size="11" font-weight="700" fill="#1E293B">S₁</text>
  <text x="100" y="153" font-family="sans-serif" font-size="11" font-weight="700" fill="#1E293B">S₂</text>
  <text x="130" y="124" font-family="monospace" font-size="11" fill="#3D6B4F">d</text>
  <circle cx="370" cy="55" r="4" fill="#1D4ED8"/>
  <text x="380" y="59" font-family="sans-serif" font-size="11" font-weight="700" fill="#1D4ED8">P (nth fringe)</text>
  <text x="380" y="124" font-family="sans-serif" font-size="11" font-weight="700" fill="#1E293B">O (Central Bright)</text>
  <line x1="120" y1="214" x2="370" y2="214" stroke="#475569" stroke-width="1.4"/>
  <text x="236" y="226" font-family="monospace" font-size="11" fill="#1E293B">D ≫ d | β = λD / d</text>
</svg>`,
  },
  'phy-v3-binding-energy-curve': {
    id: 'phy-v3-binding-energy-curve',
    subjectId: 'physics',
    title: 'Binding Energy per Nucleon (MeV) vs Mass Number (A)',
    caption: 'Peak near ⁵⁶Fe (8.75 MeV/nucleon). Light nuclei fuse; heavy nuclei (²³⁵U) fission to increase stability.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 235" width="440" height="235" role="img" aria-label="Binding energy per nucleon versus mass number curve peaking at Fe-56 around 8.75 MeV">
  <rect width="440" height="235" fill="#FFFFFF" rx="8"/>
  <line x1="56" y1="195" x2="412" y2="195" stroke="#1E293B" stroke-width="1.8"/>
  <line x1="56" y1="24" x2="56" y2="195" stroke="#1E293B" stroke-width="1.8"/>
  <text x="328" y="216" font-family="sans-serif" font-size="11" font-weight="600" fill="#1E293B">Mass Number A</text>
  <text x="12" y="34" font-family="sans-serif" font-size="10.5" font-weight="600" fill="#1E293B">BE/A (MeV)</text>
  <path d="M 62 178 L 80 120 L 95 72 L 104 92 L 118 66 L 130 78 L 154 52 C 195 48, 280 58, 392 78" fill="none" stroke="#1D4ED8" stroke-width="2.4"/>
  <circle cx="95" cy="72" r="3.5" fill="#A64B33"/>
  <text x="86" y="64" font-family="monospace" font-size="10" fill="#A64B33">⁴He</text>
  <circle cx="154" cy="52" r="4" fill="#3D6B4F"/>
  <text x="148" y="42" font-family="monospace" font-size="10.5" font-weight="700" fill="#3D6B4F">⁵⁶Fe (~8.75)</text>
  <circle cx="392" cy="78" r="3.5" fill="#D97706"/>
  <text x="366" y="70" font-family="monospace" font-size="10" fill="#D97706">²³⁸U (~7.6)</text>
  <text x="64" y="212" font-family="monospace" font-size="9.5" fill="#475569">0</text>
  <text x="150" y="212" font-family="monospace" font-size="9.5" fill="#475569">56</text>
  <text x="270" y="212" font-family="monospace" font-size="9.5" fill="#475569">150</text>
  <text x="385" y="212" font-family="monospace" font-size="9.5" fill="#475569">240</text>
</svg>`,
  },
  'chem-v3-arrhenius-plot': {
    id: 'chem-v3-arrhenius-plot',
    subjectId: 'chemistry',
    title: 'Arrhenius Plot: ln k vs 1/T',
    caption: 'Linear graph with slope = -E_a / R and y-intercept = ln A.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 225" width="420" height="225" role="img" aria-label="Linear Arrhenius graph of ln k on vertical axis against 1/T on horizontal axis with negative slope minus Ea over R">
  <rect width="420" height="225" fill="#FFFFFF" rx="8"/>
  <line x1="65" y1="185" x2="380" y2="185" stroke="#1E293B" stroke-width="1.8"/>
  <line x1="65" y1="25" x2="65" y2="185" stroke="#1E293B" stroke-width="1.8"/>
  <line x1="65" y1="45" x2="345" y2="165" stroke="#0284C7" stroke-width="2.5"/>
  <circle cx="65" cy="45" r="4" fill="#A64B33"/>
  <text x="74" y="42" font-family="monospace" font-size="11" font-weight="700" fill="#A64B33">Intercept = ln A</text>
  <text x="295" y="204" font-family="sans-serif" font-size="11" font-weight="600" fill="#1E293B">1 / T (K⁻¹)</text>
  <text x="18" y="38" font-family="sans-serif" font-size="11" font-weight="600" fill="#1E293B">ln k</text>
  <text x="185" y="92" font-family="monospace" font-size="11.5" font-weight="700" fill="#0284C7">Slope = -Eₐ / R</text>
  <text x="185" y="109" font-family="sans-serif" font-size="10.5" fill="#475569">log₁₀ k slope = -Eₐ / (2.303 R)</text>
</svg>`,
  },
  'chem-v3-raoult-deviations': {
    id: 'chem-v3-raoult-deviations',
    subjectId: 'chemistry',
    title: 'Raoult’s Law: Positive & Negative Deviations from Ideality',
    caption: 'Dashed lines: Ideal Raoult behaviour. Solid curves illustrate +ve deviation (minimum-boiling azeotrope, e.g. ethanol+water).',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 230" width="430" height="230" role="img" aria-label="Vapour pressure versus mole fraction plot showing ideal Raoult law dashed lines and positive deviation solid curves">
  <rect width="430" height="230" fill="#FFFFFF" rx="8"/>
  <line x1="60" y1="188" x2="365" y2="188" stroke="#1E293B" stroke-width="1.8"/>
  <line x1="60" y1="30" x2="60" y2="188" stroke="#1E293B" stroke-width="1.8"/>
  <line x1="365" y1="30" x2="365" y2="188" stroke="#1E293B" stroke-width="1.8"/>
  <line x1="60" y1="108" x2="365" y2="62" stroke="#64748B" stroke-width="1.5" stroke-dasharray="5,4"/>
  <line x1="60" y1="188" x2="365" y2="62" stroke="#94A3B8" stroke-width="1.2" stroke-dasharray="4,4"/>
  <line x1="60" y1="108" x2="365" y2="188" stroke="#94A3B8" stroke-width="1.2" stroke-dasharray="4,4"/>
  <path d="M 60 108 Q 212 32 365 62" fill="none" stroke="#DC2626" stroke-width="2.4"/>
  <path d="M 60 188 Q 212 100 365 62" fill="none" stroke="#0284C7" stroke-width="1.6"/>
  <path d="M 60 108 Q 212 130 365 188" fill="none" stroke="#059669" stroke-width="1.6"/>
  <text x="155" y="42" font-family="sans-serif" font-size="11" font-weight="700" fill="#DC2626">P_total (+ve deviation, ΔH_mix &gt; 0)</text>
  <text x="48" y="206" font-family="monospace" font-size="10" fill="#1E293B">x₁=1, x₂=0</text>
  <text x="330" y="206" font-family="monospace" font-size="10" fill="#1E293B">x₁=0, x₂=1</text>
  <text x="20" y="110" font-family="monospace" font-size="10" fill="#1E293B">p₁⁰</text>
  <text x="372" y="66" font-family="monospace" font-size="10" fill="#1E293B">p₂⁰</text>
</svg>`,
  },
  'bio-v3-replication-fork': {
    id: 'bio-v3-replication-fork',
    subjectId: 'biology',
    title: 'Semi-Conservative DNA Replication Fork',
    caption: 'DNA Polymerase catalyses polymerisation only in 5′→3′ direction: continuous leading strand & Okazaki fragments on lagging strand.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 220" width="440" height="220" role="img" aria-label="DNA replication fork showing 3' to 5' and 5' to 3' template strands, continuous leading synthesis, and discontinuous Okazaki fragments">
  <rect width="440" height="220" fill="#FFFFFF" rx="8"/>
  <path d="M 60 105 L 180 105 L 355 48" fill="none" stroke="#1E293B" stroke-width="3"/>
  <path d="M 60 115 L 180 115 L 355 172" fill="none" stroke="#1E293B" stroke-width="3"/>
  <line x1="185" y1="100" x2="345" y2="62" stroke="#059669" stroke-width="2.6"/>
  <polygon points="183,101 193,94 195,103" fill="#059669"/>
  <line x1="200" y1="126" x2="245" y2="139" stroke="#DC2626" stroke-width="2.6"/>
  <line x1="258" y1="143" x2="303" y2="156" stroke="#DC2626" stroke-width="2.6"/>
  <line x1="315" y1="160" x2="352" y2="170" stroke="#DC2626" stroke-width="2.6"/>
  <text x="38" y="106" font-family="monospace" font-size="10.5" fill="#1E293B">5′</text>
  <text x="38" y="120" font-family="monospace" font-size="10.5" fill="#1E293B">3′</text>
  <text x="362" y="50" font-family="monospace" font-size="10.5" fill="#1E293B">3′</text>
  <text x="362" y="176" font-family="monospace" font-size="10.5" fill="#1E293B">5′</text>
  <text x="206" y="42" font-family="sans-serif" font-size="11" font-weight="700" fill="#059669">Leading Strand (5′→3′ Continuous)</text>
  <text x="194" y="198" font-family="sans-serif" font-size="11" font-weight="700" fill="#DC2626">Lagging Strand (Okazaki fragments + DNA Ligase)</text>
</svg>`,
  },
  'math-v3-lpp-bounded': {
    id: 'math-v3-lpp-bounded',
    subjectId: 'maths',
    title: 'Corner-Point Feasible Region for Maximization LPP',
    caption: 'Optimal value of linear objective Z = ax + by over a bounded convex polygon occurs at one of the corner points O, A, B, or C.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 230" width="420" height="230" role="img" aria-label="First quadrant bounded feasible region polygon OABC bounded by two linear constraints">
  <rect width="420" height="230" fill="#FFFFFF" rx="8"/>
  <polygon points="70,190 70,86 168,125 220,190" fill="#E0E7FF" stroke="#4338CA" stroke-width="1.5"/>
  <line x1="50" y1="190" x2="365" y2="190" stroke="#1E293B" stroke-width="1.8"/>
  <line x1="70" y1="24" x2="70" y2="210" stroke="#1E293B" stroke-width="1.8"/>
  <line x1="55" y1="80" x2="335" y2="192" stroke="#1D4ED8" stroke-width="1.8"/>
  <line x1="145" y1="30" x2="232" y2="206" stroke="#A64B33" stroke-width="1.8"/>
  <circle cx="70" cy="190" r="3.5" fill="#1E293B"/>
  <circle cx="70" cy="86" r="4" fill="#4338CA"/>
  <circle cx="168" cy="125" r="4" fill="#4338CA"/>
  <circle cx="220" cy="190" r="4" fill="#4338CA"/>
  <text x="52" y="206" font-family="monospace" font-size="10" fill="#1E293B">O(0,0)</text>
  <text x="76" y="78" font-family="monospace" font-size="10" font-weight="700" fill="#4338CA">A(0,4)</text>
  <text x="174" y="122" font-family="monospace" font-size="10" font-weight="700" fill="#4338CA">B(3,2)</text>
  <text x="224" y="206" font-family="monospace" font-size="10" font-weight="700" fill="#4338CA">C(4,0)</text>
  <text x="95" y="168" font-family="sans-serif" font-size="10.5" font-weight="600" fill="#312E81">Bounded Feasible Region</text>
</svg>`,
  },
};

export function getDiagramMetadata(diagramId?: string): DiagramMetadata | null {
  if (!diagramId) return null;
  if (V3_CUSTOM_DIAGRAMS[diagramId]) {
    return V3_CUSTOM_DIAGRAMS[diagramId];
  }
  const existingSvg =
    QUESTION_DIAGRAM_SVGS[diagramId] ?? MARKING_SCHEME_DIAGRAM_SVGS[diagramId];
  if (!existingSvg) return null;
  const inferredSubject: 'physics' | 'chemistry' | 'biology' | 'maths' = diagramId.startsWith('chem')
    ? 'chemistry'
    : diagramId.startsWith('bio')
      ? 'biology'
      : diagramId.startsWith('math')
        ? 'maths'
        : 'physics';
  return {
    id: diagramId,
    subjectId: inferredSubject,
    title: diagramId.replace(/-/g, ' ').toUpperCase(),
    caption: 'Reference Vector Diagram',
    svg: existingSvg,
  };
}

export function getAllV3DiagramIds(): string[] {
  return [
    ...Object.keys(V3_CUSTOM_DIAGRAMS),
    ...Object.keys(QUESTION_DIAGRAM_SVGS),
    ...Object.keys(MARKING_SCHEME_DIAGRAM_SVGS),
  ];
}
