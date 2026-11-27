import type {DiagramMetadata} from '../v3Diagrams';

export const BIOLOGY_V3_DIAGRAMS: Record<string, DiagramMetadata> = {
  'bio-v3-iud-art-flowchart': {
    id: 'bio-v3-iud-art-flowchart',
    subjectId: 'biology',
    title: 'IUD Contraceptive Mechanisms &amp; ART Decision Pathway',
    caption: 'ZIFT transfers zygote/embryo ≤8 blastomeres into Fallopian tube; IUT transfers embryos &gt;8 blastomeres directly into Uterus.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Flowchart comparing IUD types Lippes Loop, Copper-T, LNG-20 and Assisted Reproductive Technologies GIFT, ZIFT under 8 blastomeres, and IUT over 8 blastomeres">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <rect x="22" y="22" width="185" height="190" rx="6" fill="#ECFDF5" stroke="#059669"/>
  <text x="114" y="42" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#059669">Intra-Uterine Devices</text>
  <text x="32" y="68" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#1E293B">1. Non-medicated (Lippes):</text>
  <text x="38" y="84" font-family="sans-serif" font-size="9.5" fill="#475569">Increases phagocytosis</text>
  <text x="32" y="110" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#1D4ED8">2. Cu-releasing (CuT, Cu7):</text>
  <text x="38" y="126" font-family="sans-serif" font-size="9.5" fill="#475569">Suppresses sperm motility</text>
  <text x="32" y="152" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#A64B33">3. Hormone (LNG-20):</text>
  <text x="38" y="168" font-family="sans-serif" font-size="9.5" fill="#475569">Hostile cervix, no implant</text>
  <text x="32" y="196" font-family="monospace" font-size="9" fill="#059669">Saheli: Non-steroidal weekly</text>
  <rect x="226" y="22" width="192" height="190" rx="6" fill="#EFF6FF" stroke="#1D4ED8"/>
  <text x="322" y="42" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#1D4ED8">ART Embryo Transfer</text>
  <rect x="242" y="58" width="160" height="42" rx="4" fill="#FFFFFF" stroke="#0284C7"/>
  <text x="322" y="75" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#0284C7">ZIFT (≤ 8 blastomeres)</text>
  <text x="322" y="90" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#334155">Into Fallopian Tube</text>
  <rect x="242" y="110" width="160" height="42" rx="4" fill="#FFFFFF" stroke="#DC2626"/>
  <text x="322" y="127" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#DC2626">IUT (&gt; 8 blastomeres)</text>
  <text x="322" y="142" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#334155">Directly into Uterus</text>
  <rect x="242" y="162" width="160" height="36" rx="4" fill="#FFFFFF" stroke="#7C3AED"/>
  <text x="322" y="184" text-anchor="middle" font-family="monospace" font-size="9.5" font-weight="700" fill="#7C3AED">GIFT: Donor ovum in vivo</text>
</svg>`,
  },
  'bio-v3-mendel-linkage': {
    id: 'bio-v3-mendel-linkage',
    subjectId: 'biology',
    title: 'Morgan Gene Linkage Distance vs Independent Assortment Ratio',
    caption: 'Tightly linked white-yellow genes gave only 1.3% recombinants; looser white-miniature wing gave 37.2% (max 50% unlinked).',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Drosophila X-chromosome linkage bar comparison showing 1.3 percent recombination for tight linkage versus 37.2 percent loose linkage">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <text x="220" y="28" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#1E293B">Physical Linkage Distance vs Recombinant % (Morgan)</text>
  <line x1="65" y1="68" x2="365" y2="68" stroke="#1E293B" stroke-width="5" stroke-linecap="round"/>
  <circle cx="95" cy="68" r="6" fill="#DC2626"/>
  <circle cx="115" cy="68" r="6" fill="#0284C7"/>
  <circle cx="315" cy="68" r="6" fill="#059669"/>
  <text x="95" y="54" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#DC2626">y</text>
  <text x="115" y="54" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#0284C7">w</text>
  <text x="315" y="54" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#059669">m</text>
  <rect x="44" y="100" width="170" height="44" rx="4" fill="#FEF2F2" stroke="#DC2626"/>
  <text x="129" y="118" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="700" fill="#DC2626">Cross A (y, w tight)</text>
  <text x="129" y="135" text-anchor="middle" font-family="monospace" font-size="10" fill="#1E293B">98.7% Parental | 1.3% Recomb</text>
  <rect x="228" y="100" width="174" height="44" rx="4" fill="#ECFDF5" stroke="#059669"/>
  <text x="315" y="118" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="700" fill="#059669">Cross B (w, m far)</text>
  <text x="315" y="135" text-anchor="middle" font-family="monospace" font-size="10" fill="#1E293B">62.8% Parental | 37.2% Recomb</text>
  <rect x="34" y="160" width="372" height="58" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
  <text x="220" y="180" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#1E293B">Down (47, +21) | Klinefelter (47, XXY) | Turner (45, XO)</text>
  <text x="220" y="202" text-anchor="middle" font-family="monospace" font-size="10" fill="#4338CA">1 cM = 1% recombination | Independent assortment = 50% (9:3:3:1)</text>
</svg>`,
  },
  'bio-v3-natural-selection-miller': {
    id: 'bio-v3-natural-selection-miller',
    subjectId: 'biology',
    title: 'Three Modes of Natural Selection Curves &amp; Miller-Urey Gases',
    caption: 'Stabilizing narrows the peak around mean; Directional shifts peak one way; Disruptive splits population into two extreme peaks.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Three natural selection bell curves for stabilizing, directional, and disruptive selection above Miller-Urey prebiotic gases">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <line x1="25" y1="138" x2="140" y2="138" stroke="#1E293B" stroke-width="1.4"/>
  <path d="M 32 136 Q 82 132 82 52 Q 82 132 132 136" fill="#DBEAFE" stroke="#1D4ED8" stroke-width="2.2"/>
  <text x="82" y="156" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="700" fill="#1D4ED8">Stabilizing</text>
  <line x1="162" y1="138" x2="278" y2="138" stroke="#1E293B" stroke-width="1.4"/>
  <path d="M 168 136 Q 202 128 212 72 Q 222 128 256 136" fill="none" stroke="#94A3B8" stroke-width="1.4" stroke-dasharray="3,2"/>
  <path d="M 192 136 Q 228 128 242 64 Q 256 128 274 136" fill="#DCFCE7" stroke="#059669" stroke-width="2.2"/>
  <text x="220" y="156" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="700" fill="#059669">Directional →</text>
  <line x1="298" y1="138" x2="415" y2="138" stroke="#1E293B" stroke-width="1.4"/>
  <path d="M 304 136 Q 324 58 340 112 Q 356 132 372 112 Q 388 58 408 136" fill="#FEE2E2" stroke="#DC2626" stroke-width="2.2"/>
  <text x="356" y="156" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="700" fill="#DC2626">Disruptive (2 peaks)</text>
  <rect x="28" y="176" width="384" height="44" rx="6" fill="#FEF3C7" stroke="#D97706"/>
  <text x="220" y="195" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#B45309">Miller-Urey Spark (800°C): CH₄ + H₂ + NH₃ (2:1:2) + H₂O vapour → Amino Acids</text>
  <text x="220" y="212" text-anchor="middle" font-family="monospace" font-size="10" fill="#1E293B">Hardy-Weinberg: p + q = 1 | p² + 2pq + q² = 1 (No drift/selection)</text>
</svg>`,
  },
  'bio-v3-hiv-retrovirus': {
    id: 'bio-v3-hiv-retrovirus',
    subjectId: 'biology',
    title: 'HIV Retrovirus Replication Inside Macrophage (HIV Factory)',
    caption: 'Viral ssRNA converts to proviral DNA via Reverse Transcriptase, integrates into host genome, then infects helper T-lymphocytes (CD4).',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Diagram of HIV retrovirus entering animal macrophage cell, reverse transcription of viral RNA to DNA, host integration, and budding of new viruses">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <circle cx="62" cy="70" r="24" fill="#FEE2E2" stroke="#DC2626" stroke-width="2"/>
  <text x="62" y="68" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="700" fill="#DC2626">HIV</text>
  <text x="62" y="81" text-anchor="middle" font-family="monospace" font-size="8.5" fill="#7F1D1D">ssRNA</text>
  <rect x="115" y="34" width="295" height="156" rx="16" fill="#F8FAFC" stroke="#1E293B" stroke-width="2"/>
  <text x="262" y="54" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#1E293B">Host Macrophage ("HIV Factory")</text>
  <line x1="86" y1="70" x2="145" y2="85" stroke="#DC2626" stroke-width="2"/>
  <polygon points="148,86 139,81 141,89" fill="#DC2626"/>
  <rect x="150" y="72" width="110" height="32" rx="4" fill="#EFF6FF" stroke="#1D4ED8"/>
  <text x="205" y="86" text-anchor="middle" font-family="monospace" font-size="9.5" font-weight="700" fill="#1D4ED8">Reverse Transcriptase</text>
  <text x="205" y="99" text-anchor="middle" font-family="monospace" font-size="9" fill="#334155">Viral RNA → dsDNA</text>
  <line x1="260" y1="88" x2="292" y2="88" stroke="#1D4ED8" stroke-width="1.8"/>
  <rect x="294" y="68" width="98" height="44" rx="20" fill="#ECFDF5" stroke="#059669"/>
  <text x="343" y="87" text-anchor="middle" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#059669">Host Nucleus</text>
  <text x="343" y="100" text-anchor="middle" font-family="monospace" font-size="8.5" fill="#334155">Provirus DNA</text>
  <path d="M 320 112 L 220 145 L 145 145" fill="none" stroke="#D97706" stroke-width="2"/>
  <rect x="145" y="130" width="165" height="38" rx="4" fill="#FEF3C7" stroke="#D97706"/>
  <text x="227" y="147" text-anchor="middle" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#B45309">New Viral RNA + Capsid</text>
  <text x="227" y="160" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#475569">Progeny infects T-helper (CD4) cells</text>
  <text x="220" y="218" text-anchor="middle" font-family="monospace" font-size="10" fill="#334155">Detection: ELISA | Progressive depletion of Helper T-lymphocytes</text>
</svg>`,
  },
  'bio-v3-bod-sewage-biogas': {
    id: 'bio-v3-bod-sewage-biogas',
    subjectId: 'biology',
    title: 'River Sewage Discharge: BOD vs Dissolved Oxygen (DO) Sag Curve',
    caption: 'Heavy aerobic decomposition creates an inverse mirror: sharp BOD peak drops Dissolved Oxygen (DO) causing fish death until recovery.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Graph of Biological Oxygen Demand BOD rising sharply while Dissolved Oxygen drops upon sewage discharge along river distance">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <line x1="55" y1="184" x2="405" y2="184" stroke="#1E293B" stroke-width="1.8"/>
  <line x1="55" y1="26" x2="55" y2="184" stroke="#1E293B" stroke-width="1.8"/>
  <line x1="140" y1="30" x2="140" y2="184" stroke="#A64B33" stroke-width="1.5" stroke-dasharray="4,3"/>
  <text x="145" y="40" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#A64B33">Sewage Outfall</text>
  <path d="M 60 168 L 138 168 Q 165 44 210 66 T 395 164" fill="none" stroke="#DC2626" stroke-width="2.5"/>
  <path d="M 60 58 L 138 58 Q 170 165 215 152 T 395 62" fill="none" stroke="#0284C7" stroke-width="2.5"/>
  <text x="208" y="58" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#DC2626">BOD (Organic Load ↑)</text>
  <text x="218" y="172" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#0284C7">Dissolved O₂ (Fish kill zone)</text>
  <text x="260" y="204" font-family="sans-serif" font-size="10" font-weight="600" fill="#1E293B">Downstream Flow Direction →</text>
  <text x="220" y="226" text-anchor="middle" font-family="monospace" font-size="9.5" fill="#059669">STP Secondary: Flocs lower BOD → Anaerobic Methanogens emit CH₄ biogas</text>
</svg>`,
  },
  'bio-v3-gel-electrophoresis': {
    id: 'bio-v3-gel-electrophoresis',
    subjectId: 'biology',
    title: 'Agarose Gel Electrophoresis &amp; EcoRI Palindromic Sticky Ends',
    caption: 'Negatively charged DNA migrates toward anode (+); smaller kb fragments travel farther down the sieving agarose gel.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Agarose gel electrophoresis tray showing cathode wells on left, anode on right, smallest DNA fragments closest to anode, and EcoRI GAATTC cut site">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <rect x="42" y="34" width="356" height="106" rx="6" fill="#F1F5F9" stroke="#1E293B" stroke-width="2"/>
  <text x="64" y="54" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#DC2626">(-) Cathode Wells</text>
  <text x="342" y="54" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#059669">Anode (+)</text>
  <rect x="64" y="68" width="12" height="18" fill="#1E293B"/>
  <rect x="64" y="98" width="12" height="18" fill="#1E293B"/>
  <rect x="135" y="70" width="8" height="14" fill="#EA580C"/>
  <rect x="210" y="70" width="8" height="14" fill="#EA580C"/>
  <rect x="295" y="70" width="8" height="14" fill="#EA580C"/>
  <rect x="355" y="70" width="6" height="14" fill="#EA580C"/>
  <rect x="175" y="100" width="8" height="14" fill="#1D4ED8"/>
  <rect x="330" y="100" width="6" height="14" fill="#1D4ED8"/>
  <text x="142" y="132" font-family="monospace" font-size="9.5" fill="#475569">Largest kb (slow)</text>
  <text x="320" y="132" font-family="monospace" font-size="9.5" font-weight="700" fill="#059669">Smallest kb (fast)</text>
  <rect x="42" y="152" width="356" height="66" rx="6" fill="#FEF3C7" stroke="#D97706"/>
  <text x="220" y="172" text-anchor="middle" font-family="monospace" font-size="10.5" font-weight="700" fill="#B45309">EcoRI Cut: 5′-G↓AATTC-3′ / 3′-CTTAA↑G-5′ (Sticky Ends)</text>
  <text x="220" y="192" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#1E293B">Stain: Ethidium Bromide + UV → Bright orange DNA bands (Elution)</text>
</svg>`,
  },
  'bio-v3-insulin-maturation': {
    id: 'bio-v3-insulin-maturation',
    subjectId: 'biology',
    title: 'Proinsulin Maturation into Active Humulin &amp; Bt Protoxin Activation',
    caption: 'Eli Lilly expressed Chains A &amp; B separately in E. coli and linked disulphide bonds, bypassing human C-peptide excision.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Conversion of proinsulin with A, B, C peptide chains into mature insulin with A and B chains linked by disulphide bridges">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <rect x="36" y="34" width="160" height="32" rx="14" fill="#DBEAFE" stroke="#1D4ED8" stroke-width="2"/>
  <text x="116" y="54" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1D4ED8">A-Peptide (21 aa)</text>
  <rect x="36" y="92" width="160" height="32" rx="14" fill="#DCFCE7" stroke="#059669" stroke-width="2"/>
  <text x="116" y="112" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#059669">B-Peptide (30 aa)</text>
  <path d="M 196 50 C 236 50, 236 108, 196 108" fill="none" stroke="#DC2626" stroke-width="2.4" stroke-dasharray="4,2"/>
  <text x="242" y="83" font-family="sans-serif" font-size="10" font-weight="700" fill="#DC2626">C-Peptide Removed</text>
  <line x1="80" y1="66" x2="80" y2="92" stroke="#D97706" stroke-width="2.2"/>
  <line x1="150" y1="66" x2="150" y2="92" stroke="#D97706" stroke-width="2.2"/>
  <text x="115" y="83" text-anchor="middle" font-family="monospace" font-size="9.5" font-weight="700" fill="#B45309">S–S Bonds</text>
  <rect x="28" y="148" width="384" height="70" rx="6" fill="#ECFDF5" stroke="#059669"/>
  <text x="220" y="169" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#059669">Bt Cry Toxin (cryIAc / cryIIAb = Cotton Bollworm | cryIAb = Corn Borer)</text>
  <text x="220" y="191" text-anchor="middle" font-family="monospace" font-size="10" fill="#1E293B">Inactive Protoxin ──(Insect ALKALINE Midgut pH)──▶ Active Pore Toxin</text>
</svg>`,
  },
  'bio-v3-age-pyramids': {
    id: 'bio-v3-age-pyramids',
    subjectId: 'biology',
    title: 'Human Population Age Pyramids: Expanding, Stable &amp; Declining',
    caption: 'Base width (pre-reproductive 0–14 yrs) compared with reproductive middle band predicts future population momentum.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Three human population age pyramids comparing triangular expanding, bell-shaped stable, and urn-shaped declining demographics">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <rect x="74" y="54" width="24" height="24" fill="#DC2626"/>
  <rect x="58" y="82" width="56" height="26" fill="#EA580C"/>
  <rect x="38" y="112" width="96" height="32" fill="#F59E0B"/>
  <text x="86" y="164" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#B45309">1. Expanding</text>
  <text x="86" y="179" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#475569">(Broad Pre-reprod)</text>
  <rect x="198" y="54" width="44" height="24" fill="#0284C7"/>
  <rect x="184" y="82" width="72" height="26" fill="#0EA5E9"/>
  <rect x="182" y="112" width="76" height="32" fill="#38BDF8"/>
  <text x="220" y="164" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#0284C7">2. Stable</text>
  <text x="220" y="179" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#475569">(Bell-shaped)</text>
  <rect x="330" y="54" width="48" height="24" fill="#6366F1"/>
  <rect x="318" y="82" width="72" height="26" fill="#818CF8"/>
  <rect x="334" y="112" width="40" height="32" fill="#A5B4FC"/>
  <text x="354" y="164" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#4338CA">3. Declining</text>
  <text x="354" y="179" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#475569">(Urn-shaped narrow base)</text>
  <text x="220" y="216" text-anchor="middle" font-family="monospace" font-size="10" fill="#334155">Top = Post-reproductive | Mid = Reproductive | Bottom = Pre-reproductive</text>
</svg>`,
  },
  'bio-v3-species-area-curve': {
    id: 'bio-v3-species-area-curve',
    subjectId: 'biology',
    title: 'Humboldt Species-Area Relationship (Hyperbola &amp; Log-Log Line)',
    caption: 'S = C A^Z forms rectangular hyperbola directly, linearizing on log scale to log S = log C + Z log A (Z = 0.1–0.2 regional, 0.6–1.2 continental).',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Species richness S versus Area A showing rectangular hyperbola curve S = CA^Z and linear log S = log C + Z log A">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <line x1="58" y1="186" x2="395" y2="186" stroke="#1E293B" stroke-width="1.8"/>
  <line x1="58" y1="26" x2="58" y2="186" stroke="#1E293B" stroke-width="1.8"/>
  <path d="M 58 186 Q 112 72 375 56" fill="none" stroke="#059669" stroke-width="2.6"/>
  <line x1="58" y1="138" x2="375" y2="34" stroke="#1D4ED8" stroke-width="2.2"/>
  <text x="14" y="40" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1E293B">S / log S</text>
  <text x="340" y="204" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1E293B">Area A / log A</text>
  <text x="195" y="114" font-family="monospace" font-size="10.5" font-weight="700" fill="#059669">S = C A^Z (Hyperbola)</text>
  <text x="208" y="48" font-family="monospace" font-size="10.5" font-weight="700" fill="#1D4ED8">log S = log C + Z log A</text>
  <text x="68" y="132" font-family="monospace" font-size="9.5" fill="#1D4ED8">log C</text>
  <text x="220" y="226" text-anchor="middle" font-family="monospace" font-size="10" fill="#A64B33">Slope Z = 0.1–0.2 (region) | 0.6–1.2 (continents) | 1.15 (frugivores)</text>
</svg>`,
  },
};
