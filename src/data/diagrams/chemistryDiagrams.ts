import type {DiagramMetadata} from '../v3Diagrams';

export const CHEMISTRY_V3_DIAGRAMS: Record<string, DiagramMetadata> = {
  'chem-v3-colligative-bp-fp': {
    id: 'chem-v3-colligative-bp-fp',
    subjectId: 'chemistry',
    title: 'Boiling Point Elevation (ΔT_b) &amp; Freezing Point Depression (ΔT_f)',
    caption: 'Adding non-volatile solute lowers solvent vapour pressure across all T, depressing freezing point T_f and raising boiling point T_b.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Vapour pressure versus temperature graph showing pure solvent vs solution boiling point elevation and freezing point depression">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <line x1="55" y1="190" x2="405" y2="190" stroke="#1E293B" stroke-width="1.8"/>
  <line x1="55" y1="28" x2="55" y2="190" stroke="#1E293B" stroke-width="1.8"/>
  <line x1="55" y1="68" x2="395" y2="68" stroke="#64748B" stroke-width="1.2" stroke-dasharray="4,3"/>
  <text x="348" y="61" font-family="monospace" font-size="10" font-weight="700" fill="#475569">1 atm (760 mm)</text>
  <path d="M 92 175 L 145 142 Q 230 108 310 50" fill="none" stroke="#1D4ED8" stroke-width="2.4"/>
  <path d="M 122 156 Q 232 126 355 54" fill="none" stroke="#DC2626" stroke-width="2.4"/>
  <line x1="122" y1="156" x2="122" y2="190" stroke="#DC2626" stroke-width="1" stroke-dasharray="3,3"/>
  <line x1="145" y1="142" x2="145" y2="190" stroke="#1D4ED8" stroke-width="1" stroke-dasharray="3,3"/>
  <line x1="286" y1="68" x2="286" y2="190" stroke="#1D4ED8" stroke-width="1" stroke-dasharray="3,3"/>
  <line x1="335" y1="68" x2="335" y2="190" stroke="#DC2626" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="12" y="42" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1E293B">VP</text>
  <text x="385" y="206" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1E293B">T(K)</text>
  <text x="115" y="204" font-family="monospace" font-size="9.5" fill="#DC2626">T_f</text>
  <text x="142" y="204" font-family="monospace" font-size="9.5" fill="#1D4ED8">T_f°</text>
  <text x="278" y="204" font-family="monospace" font-size="9.5" fill="#1D4ED8">T_b°</text>
  <text x="330" y="204" font-family="monospace" font-size="9.5" fill="#DC2626">T_b</text>
  <text x="195" y="88" font-family="sans-serif" font-size="10" font-weight="700" fill="#1D4ED8">Pure Solvent</text>
  <text x="242" y="135" font-family="sans-serif" font-size="10" font-weight="700" fill="#DC2626">Solution</text>
  <text x="220" y="226" text-anchor="middle" font-family="monospace" font-size="10" fill="#334155">ΔT_f = i K_f m | ΔT_b = i K_b m</text>
</svg>`,
  },
  'chem-v3-catalyst-activation': {
    id: 'chem-v3-catalyst-activation',
    subjectId: 'chemistry',
    title: 'Catalyzed vs Uncatalyzed Activation Energy Profile',
    caption: 'Catalyst provides an alternate transition-state pathway with lower activation energy E_a′, leaving ΔH and K_eq unchanged.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Potential energy vs reaction progress graph showing uncatalyzed high barrier versus catalyzed lower activation energy path">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <line x1="55" y1="190" x2="400" y2="190" stroke="#1E293B" stroke-width="1.8"/>
  <line x1="55" y1="24" x2="55" y2="190" stroke="#1E293B" stroke-width="1.8"/>
  <path d="M 75 115 Q 195 -10 345 158" fill="none" stroke="#DC2626" stroke-width="2.4"/>
  <path d="M 75 115 Q 195 45 345 158" fill="none" stroke="#059669" stroke-width="2.4" stroke-dasharray="5,3"/>
  <line x1="55" y1="115" x2="145" y2="115" stroke="#94A3B8" stroke-width="1" stroke-dasharray="3,3"/>
  <line x1="195" y1="53" x2="195" y2="115" stroke="#DC2626" stroke-width="1.4"/>
  <line x1="215" y1="80" x2="215" y2="115" stroke="#059669" stroke-width="1.4"/>
  <text x="16" y="38" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1E293B">PE</text>
  <text x="72" y="108" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1E293B">Reactants</text>
  <text x="330" y="172" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1E293B">Products</text>
  <text x="148" y="45" font-family="monospace" font-size="10" font-weight="700" fill="#DC2626">Uncatalyzed E_a</text>
  <text x="222" y="92" font-family="monospace" font-size="10" font-weight="700" fill="#059669">Catalyzed E_a′</text>
  <text x="275" y="142" font-family="monospace" font-size="10" fill="#1D4ED8">ΔH unchanged</text>
  <text x="220" y="218" text-anchor="middle" font-family="monospace" font-size="10" fill="#334155">Reaction Coordinate | Catalyst speeds k_f &amp; k_b equally</text>
</svg>`,
  },
  'chem-v3-chromate-e0-trends': {
    id: 'chem-v3-chromate-e0-trends',
    subjectId: 'chemistry',
    title: '3d Series E°(M²⁺/M) Anomaly Chart &amp; Chromate-Dichromate Equilibrium',
    caption: 'Unique positive E°(Cu²⁺/Cu) = +0.34 V explains why Cu resists non-oxidizing HCl; Mn/Zn show extra d⁵/d¹⁰ stability dips.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Plot of standard electrode potentials E0 M2+ over M across 3d metals Ti to Zn showing positive +0.34V spike at Copper">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <line x1="48" y1="80" x2="410" y2="80" stroke="#1E293B" stroke-width="1.5"/>
  <line x1="48" y1="26" x2="48" y2="178" stroke="#1E293B" stroke-width="1.6"/>
  <text x="12" y="84" font-family="monospace" font-size="10" font-weight="700" fill="#1E293B">0.0V</text>
  <text x="10" y="45" font-family="monospace" font-size="10" fill="#DC2626">+0.4V</text>
  <text x="10" y="160" font-family="monospace" font-size="10" fill="#1D4ED8">-1.2V</text>
  <polyline points="68,162 110,148 152,126 194,146 236,102 278,94 320,96 362,52 400,124" fill="none" stroke="#1D4ED8" stroke-width="2.4"/>
  <circle cx="194" cy="146" r="4" fill="#059669"/>
  <circle cx="362" cy="52" r="4.5" fill="#DC2626"/>
  <circle cx="400" cy="124" r="4" fill="#059669"/>
  <text x="68" y="176" text-anchor="middle" font-family="monospace" font-size="9.5">Ti</text>
  <text x="110" y="176" text-anchor="middle" font-family="monospace" font-size="9.5">V</text>
  <text x="152" y="176" text-anchor="middle" font-family="monospace" font-size="9.5">Cr</text>
  <text x="194" y="176" text-anchor="middle" font-family="monospace" font-size="9.5" fill="#059669">Mn</text>
  <text x="236" y="176" text-anchor="middle" font-family="monospace" font-size="9.5">Fe</text>
  <text x="278" y="176" text-anchor="middle" font-family="monospace" font-size="9.5">Co</text>
  <text x="320" y="176" text-anchor="middle" font-family="monospace" font-size="9.5">Ni</text>
  <text x="362" y="176" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#DC2626">Cu</text>
  <text x="400" y="176" text-anchor="middle" font-family="monospace" font-size="9.5">Zn</text>
  <text x="348" y="40" font-family="monospace" font-size="10" font-weight="700" fill="#DC2626">+0.34 V</text>
  <text x="180" y="162" font-family="monospace" font-size="9.5" fill="#059669">-1.18 V</text>
  <rect x="48" y="192" width="360" height="32" rx="4" fill="#FEF3C7" stroke="#D97706"/>
  <text x="228" y="212" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#B45309">2 CrO₄²⁻ (Yellow, OH⁻) + 2 H⁺ ⇌ Cr₂O₇²⁻ (Orange, H⁺) + H₂O</text>
</svg>`,
  },
  'chem-v3-cft-tetrahedral': {
    id: 'chem-v3-cft-tetrahedral',
    subjectId: 'chemistry',
    title: 'Crystal Field Splitting: Octahedral (Δ_o) vs Tetrahedral (Δ_t)',
    caption: 'In tetrahedral fields, e orbitals sit below t₂ with smaller gap Δ_t = (4/9) Δ_o, so low-spin pairing rarely forms.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Energy splitting comparison between octahedral eg above t2g and inverted tetrahedral t2 above e">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <line x1="175" y1="115" x2="265" y2="115" stroke="#1E293B" stroke-width="2.2"/>
  <text x="220" y="106" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="700" fill="#1E293B">Free Ion 5×d</text>
  <line x1="65" y1="55" x2="125" y2="55" stroke="#DC2626" stroke-width="2.6"/>
  <line x1="65" y1="158" x2="135" y2="158" stroke="#1D4ED8" stroke-width="2.6"/>
  <line x1="175" y1="115" x2="125" y2="55" stroke="#94A3B8" stroke-width="1" stroke-dasharray="3,3"/>
  <line x1="175" y1="115" x2="135" y2="158" stroke="#94A3B8" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="95" y="44" text-anchor="middle" font-family="monospace" font-size="10.5" font-weight="700" fill="#DC2626">e_g (+0.6 Δ_o)</text>
  <text x="95" y="176" text-anchor="middle" font-family="monospace" font-size="10.5" font-weight="700" fill="#1D4ED8">t_2g (-0.4 Δ_o)</text>
  <text x="95" y="112" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#334155">Octahedral Δ_o</text>
  <line x1="305" y1="82" x2="375" y2="82" stroke="#DC2626" stroke-width="2.6"/>
  <line x1="315" y1="146" x2="375" y2="146" stroke="#1D4ED8" stroke-width="2.6"/>
  <line x1="265" y1="115" x2="305" y2="82" stroke="#94A3B8" stroke-width="1" stroke-dasharray="3,3"/>
  <line x1="265" y1="115" x2="315" y2="146" stroke="#94A3B8" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="342" y="70" text-anchor="middle" font-family="monospace" font-size="10.5" font-weight="700" fill="#DC2626">t₂ (+2/5 Δ_t)</text>
  <text x="342" y="164" text-anchor="middle" font-family="monospace" font-size="10.5" font-weight="700" fill="#1D4ED8">e (-3/5 Δ_t)</text>
  <text x="342" y="116" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#059669">Tetrahedral Δ_t</text>
  <text x="220" y="218" text-anchor="middle" font-family="monospace" font-size="10.5" font-weight="700" fill="#A64B33">Δ_t = (4/9) Δ_o (Usually Δ_t &lt; Pairing Energy P → High Spin)</text>
</svg>`,
  },
  'chem-v3-sn1-sn2-energy': {
    id: 'chem-v3-sn1-sn2-energy',
    subjectId: 'chemistry',
    title: 'SN1 Two-Step Carbocation Profile vs SN2 One-Step Inversion',
    caption: 'SN2 passes through single pentavalent TS (100% inversion); SN1 forms sp² planar carbocation valley giving racemization.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Energy profile comparing single-step SN2 concerted transition state and two-step SN1 carbocation intermediate">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <line x1="42" y1="192" x2="205" y2="192" stroke="#1E293B" stroke-width="1.5"/>
  <line x1="42" y1="36" x2="42" y2="192" stroke="#1E293B" stroke-width="1.5"/>
  <path d="M 52 135 Q 120 35 190 165" fill="none" stroke="#1D4ED8" stroke-width="2.4"/>
  <circle cx="121" cy="84" r="4" fill="#1D4ED8"/>
  <text x="121" y="54" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="700" fill="#1D4ED8">SN2 Single TS</text>
  <text x="121" y="210" text-anchor="middle" font-family="monospace" font-size="9.5" fill="#1D4ED8">1° &gt; 2° &gt; 3° | Inversion</text>
  <line x1="235" y1="192" x2="412" y2="192" stroke="#1E293B" stroke-width="1.5"/>
  <line x1="235" y1="36" x2="235" y2="192" stroke="#1E293B" stroke-width="1.5"/>
  <path d="M 245 142 Q 282 40 315 112 Q 345 72 398 168" fill="none" stroke="#DC2626" stroke-width="2.4"/>
  <circle cx="315" cy="112" r="4" fill="#059669"/>
  <text x="278" y="48" text-anchor="middle" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#DC2626">TS₁ (Slow)</text>
  <text x="315" y="132" text-anchor="middle" font-family="monospace" font-size="9.5" font-weight="700" fill="#059669">R⁺ (sp²)</text>
  <text x="355" y="75" text-anchor="middle" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#DC2626">TS₂</text>
  <text x="325" y="210" text-anchor="middle" font-family="monospace" font-size="9.5" fill="#DC2626">SN1: 3° &gt; 2° &gt; 1° | Racemic</text>
</svg>`,
  },
  'chem-v3-reimer-hi-ether': {
    id: 'chem-v3-reimer-hi-ether',
    subjectId: 'chemistry',
    title: 'Anisole HI Cleavage Resonance Lock &amp; Alcohol Dehydration T-Map',
    caption: 'Partial double-bond sp² C–O in anisole never breaks with HI (gives Phenol + CH₃I); ethanol dehydration shifts 413 K ether vs 443 K ethene.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Reaction pathway schematic for anisole HI cleavage to phenol plus methyl iodide and ethanol acid dehydration at 413K versus 443K">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <rect x="24" y="24" width="392" height="86" rx="6" fill="#EFF6FF" stroke="#1D4ED8"/>
  <text x="220" y="46" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#1D4ED8">HI Cleavage of Unsymmetrical Ethers (SN2 vs SN1)</text>
  <text x="220" y="68" text-anchor="middle" font-family="monospace" font-size="10.5" fill="#1E293B">C₆H₅–O–CH₃ + HI  →  C₆H₅–OH (Phenol) + CH₃I  [Strong sp² Ar–O]</text>
  <text x="220" y="90" text-anchor="middle" font-family="monospace" font-size="10.5" fill="#DC2626">(CH₃)₃C–O–CH₃ + HI → (CH₃)₃C–I + CH₃OH  [SN1 3° carbocation]</text>
  <rect x="24" y="124" width="392" height="92" rx="6" fill="#ECFDF5" stroke="#059669"/>
  <text x="220" y="146" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#059669">Ethanol + Conc. H₂SO₄ Temperature Control</text>
  <text x="220" y="170" text-anchor="middle" font-family="monospace" font-size="10.5" fill="#1E293B">413 K (Excess EtOH, SN2) → CH₃CH₂–O–CH₂CH₃ (Diethyl Ether)</text>
  <text x="220" y="194" text-anchor="middle" font-family="monospace" font-size="10.5" fill="#A64B33">443 K (Elimination)      → CH₂=CH₂ (Ethene) + H₂O</text>
</svg>`,
  },
  'chem-v3-carbonyl-polarity': {
    id: 'chem-v3-carbonyl-polarity',
    subjectId: 'chemistry',
    title: 'Carbonyl Nucleophilic Addition &amp; Carboxylic Acid Strength Bar Chart',
    caption: 'Electron-withdrawing -I halogens stabilize carboxylate RCOO⁻ (lowering pK_a); aldehydes react faster than bulky ketones.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Carboxylic acid pKa strength bar comparison showing trichloroacetic acid strongest down to acetic acid">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <text x="220" y="28" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#1E293B">Carboxylic Acid pKₐ (Lower pKₐ = Stronger Acid via -I Effect)</text>
  <line x1="70" y1="168" x2="395" y2="168" stroke="#1E293B" stroke-width="1.6"/>
  <rect x="85" y="148" width="44" height="20" fill="#DC2626" rx="2"/>
  <rect x="165" y="106" width="44" height="62" fill="#D97706" rx="2"/>
  <rect x="245" y="76" width="44" height="92" fill="#0284C7" rx="2"/>
  <rect x="325" y="54" width="44" height="114" fill="#64748B" rx="2"/>
  <text x="107" y="142" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#DC2626">0.7</text>
  <text x="187" y="100" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#D97706">2.9</text>
  <text x="267" y="70" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#0284C7">3.75</text>
  <text x="347" y="48" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#475569">4.76</text>
  <text x="107" y="185" text-anchor="middle" font-family="monospace" font-size="9.5">CCl₃COOH</text>
  <text x="187" y="185" text-anchor="middle" font-family="monospace" font-size="9.5">CH₂ClCOOH</text>
  <text x="267" y="185" text-anchor="middle" font-family="monospace" font-size="9.5">HCOOH</text>
  <text x="347" y="185" text-anchor="middle" font-family="monospace" font-size="9.5">CH₃COOH</text>
  <text x="220" y="216" text-anchor="middle" font-family="monospace" font-size="10" fill="#334155">Carbonyl Nu⁻ Reactivity: HCHO &gt; CH₃CHO &gt; CH₃COCH₃ &gt; PhCHO</text>
</svg>`,
  },
  'chem-v3-amine-basicity': {
    id: 'chem-v3-amine-basicity',
    subjectId: 'chemistry',
    title: 'Aqueous Amine Basicity Strength Chart (pK_b Values at 298 K)',
    caption: 'Solvation + Steric + +I balance places 2° secondary amines FIRST in water: Et₂NH (pK_b 3.0) &gt; Et₃N (3.25) &gt; EtNH₂ (3.29).',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Bar chart of aqueous pKb basicity comparison for ethylamines and methylamines showing secondary amines most basic">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <text x="220" y="26" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#1E293B">Aqueous pK_b (Lower pK_b = STRONGER Base)</text>
  <line x1="48" y1="170" x2="405" y2="170" stroke="#1E293B" stroke-width="1.6"/>
  <rect x="64" y="122" width="48" height="48" fill="#059669" rx="2"/>
  <rect x="132" y="114" width="48" height="56" fill="#0284C7" rx="2"/>
  <rect x="200" y="112" width="48" height="58" fill="#0284C7" rx="2"/>
  <rect x="268" y="88" width="48" height="82" fill="#D97706" rx="2"/>
  <rect x="336" y="42" width="48" height="128" fill="#DC2626" rx="2"/>
  <text x="88" y="116" text-anchor="middle" font-family="monospace" font-size="9.5" font-weight="700" fill="#059669">3.00</text>
  <text x="156" y="108" text-anchor="middle" font-family="monospace" font-size="9.5" font-weight="700" fill="#0284C7">3.25</text>
  <text x="224" y="106" text-anchor="middle" font-family="monospace" font-size="9.5" font-weight="700" fill="#0284C7">3.29</text>
  <text x="292" y="82" text-anchor="middle" font-family="monospace" font-size="9.5" font-weight="700" fill="#D97706">4.75</text>
  <text x="360" y="36" text-anchor="middle" font-family="monospace" font-size="9.5" font-weight="700" fill="#DC2626">9.38</text>
  <text x="88" y="185" text-anchor="middle" font-family="monospace" font-size="9">Et₂NH (2°)</text>
  <text x="156" y="185" text-anchor="middle" font-family="monospace" font-size="9">Et₃N (3°)</text>
  <text x="224" y="185" text-anchor="middle" font-family="monospace" font-size="9">EtNH₂ (1°)</text>
  <text x="292" y="185" text-anchor="middle" font-family="monospace" font-size="9">NH₃</text>
  <text x="360" y="185" text-anchor="middle" font-family="monospace" font-size="9">Aniline</text>
  <text x="220" y="216" text-anchor="middle" font-family="monospace" font-size="10" fill="#334155">Methyl in water: Me₂NH &gt; MeNH₂ &gt; Me₃N &gt; NH₃ | Gas phase: 3° &gt; 2° &gt; 1°</text>
</svg>`,
  },
  'chem-v3-glucose-zwitterion': {
    id: 'chem-v3-glucose-zwitterion',
    subjectId: 'chemistry',
    title: 'α/β-D-Glucopyranose Anomers &amp; Amino Acid Zwitterion',
    caption: 'C1–C5 cyclic hemiacetal closes the free aldehyde; α-D (+112°) and β-D (+19°) equilibrate via mutarotation to +52.5°.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Cyclic Haworth pyranose ring of alpha and beta D-glucose anomers beside dipolar zwitterion structure of amino acids">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <polygon points="75,78 135,55 188,78 175,132 95,132" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="2"/>
  <circle cx="135" cy="55" r="9" fill="#FFFFFF" stroke="#1D4ED8" stroke-width="1.5"/>
  <text x="135" y="59" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#DC2626">O</text>
  <text x="194" y="82" font-family="monospace" font-size="10" font-weight="700" fill="#1E293B">C1 (Anomeric)</text>
  <text x="182" y="114" font-family="monospace" font-size="10" font-weight="700" fill="#059669">α: OH down | β: OH up</text>
  <text x="132" y="156" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1D4ED8">Glucopyranose Ring</text>
  <rect x="242" y="44" width="176" height="114" rx="6" fill="#FEF3C7" stroke="#D97706"/>
  <text x="330" y="68" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#B45309">Amino Acid Zwitterion</text>
  <text x="330" y="96" text-anchor="middle" font-family="monospace" font-size="11" font-weight="700" fill="#1E293B">⁺H₃N–CH(R)–COO⁻</text>
  <text x="330" y="120" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#475569">Amphoteric neutral dipole</text>
  <text x="330" y="140" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#475569">at Isoelectric Point pI</text>
  <text x="220" y="210" text-anchor="middle" font-family="monospace" font-size="10" fill="#334155">DNA Bases: A=T (2 H-bonds), G≡C (3 H-bonds) | RNA has Uracil (U)</text>
</svg>`,
  },
};
