// Self-contained, print-sharp SVG diagrams and graphs for Exam Questions (PCMB)
// Every SVG includes xmlns, viewBox, explicit width/height, and legible typography.

export const QUESTION_DIAGRAM_SVGS: Record<string, string> = {
  // ================= PHYSICS QUESTION DIAGRAMS =================
  'phy-q3-solenoid': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 180" width="400" height="180" role="img" aria-label="Closed metallic solenoid resting coaxially inside a uniform steady magnetic field B">
  <rect x="0" y="0" width="400" height="180" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <defs>
    <marker id="arrowB" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#1D4ED8"/>
    </marker>
  </defs>
  <!-- Uniform steady magnetic field lines -->
  <line x1="30" y1="35" x2="360" y2="35" stroke="#1D4ED8" stroke-width="1.6" marker-end="url(#arrowB)"/>
  <line x1="30" y1="62" x2="360" y2="62" stroke="#1D4ED8" stroke-width="1.6" stroke-dasharray="6 4" marker-end="url(#arrowB)"/>
  <line x1="30" y1="90" x2="365" y2="90" stroke="#787066" stroke-width="1.2" stroke-dasharray="4 3"/>
  <line x1="30" y1="118" x2="360" y2="118" stroke="#1D4ED8" stroke-width="1.6" stroke-dasharray="6 4" marker-end="url(#arrowB)"/>
  <line x1="30" y1="145" x2="360" y2="145" stroke="#1D4ED8" stroke-width="1.6" marker-end="url(#arrowB)"/>
  <!-- Coaxial Solenoid Cylinder -->
  <rect x="110" y="54" width="175" height="72" rx="8" fill="#FAF8F3" fill-opacity="0.82" stroke="#575048" stroke-width="1.5"/>
  <!-- Copper solenoid windings -->
  <ellipse cx="128" cy="90" rx="8" ry="38" fill="none" stroke="#A64B33" stroke-width="2.4"/>
  <ellipse cx="152" cy="90" rx="8" ry="38" fill="none" stroke="#A64B33" stroke-width="2.4"/>
  <ellipse cx="176" cy="90" rx="8" ry="38" fill="none" stroke="#A64B33" stroke-width="2.4"/>
  <ellipse cx="200" cy="90" rx="8" ry="38" fill="none" stroke="#A64B33" stroke-width="2.4"/>
  <ellipse cx="224" cy="90" rx="8" ry="38" fill="none" stroke="#A64B33" stroke-width="2.4"/>
  <ellipse cx="248" cy="90" rx="8" ry="38" fill="none" stroke="#A64B33" stroke-width="2.4"/>
  <ellipse cx="272" cy="90" rx="8" ry="38" fill="none" stroke="#A64B33" stroke-width="2.4"/>
  <!-- Closed circuit connection below -->
  <polyline points="120,124 120,162 280,162 280,124" fill="none" stroke="#1E1B18" stroke-width="2"/>
  <circle cx="200" cy="162" r="10" fill="#FAF8F3" stroke="#1E1B18" stroke-width="1.8"/>
  <text x="195" y="166" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">G</text>
  <text x="315" y="27" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1D4ED8">Steady B (const.)</text>
  <text x="155" y="18" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="600" fill="#1E1B18">Coaxial Closed Solenoid</text>
</svg>`,

  'phy-q7-binding-energy': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 240" width="420" height="240" role="img" aria-label="Binding energy per nucleon versus mass number plot peaking near A = 56 to 62 at 8.75 MeV">
  <rect x="0" y="0" width="420" height="240" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <!-- Grid & Axes -->
  <line x1="60" y1="25" x2="60" y2="195" stroke="#1E1B18" stroke-width="1.8"/>
  <line x1="60" y1="195" x2="390" y2="195" stroke="#1E1B18" stroke-width="1.8"/>
  <!-- Horizontal reference at 8.75 MeV -->
  <line x1="60" y1="45" x2="380" y2="45" stroke="#DDD6C7" stroke-width="1" stroke-dasharray="4 3"/>
  <text x="20" y="49" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="600" fill="#575048">8.75</text>
  <text x="24" y="95" font-family="system-ui, Arial, sans-serif" font-size="10" fill="#575048">6.0</text>
  <text x="24" y="145" font-family="system-ui, Arial, sans-serif" font-size="10" fill="#575048">3.0</text>
  <text x="44" y="198" font-family="system-ui, Arial, sans-serif" font-size="10" fill="#575048">0</text>
  <!-- Y Axis Title -->
  <text x="14" y="152" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1E1B18" transform="rotate(-90 14 152)">BE / A (MeV)</text>
  <!-- X ticks -->
  <text x="128" y="210" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#A64B33">56–62</text>
  <text x="225" y="210" font-family="system-ui, Arial, sans-serif" font-size="10" fill="#575048">140</text>
  <text x="345" y="210" font-family="system-ui, Arial, sans-serif" font-size="10" fill="#575048">238</text>
  <text x="178" y="228" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">Mass Number (A) →</text>
  <!-- BE/A Curve with He-4 spike & broad Fe/Ni peak -->
  <path d="M 62 182 L 72 150 L 79 84 L 86 112 L 96 66 L 114 50 L 140 45 C 180 46, 260 56, 360 72" fill="none" stroke="#A64B33" stroke-width="2.5"/>
  <!-- Highlighted Peak Marker -->
  <line x1="140" y1="45" x2="140" y2="195" stroke="#A64B33" stroke-width="1.2" stroke-dasharray="3 3"/>
  <circle cx="140" cy="45" r="4.5" fill="#A64B33"/>
  <circle cx="79" cy="84" r="3" fill="#1D4ED8"/>
  <circle cx="360" cy="72" r="3" fill="#3D6B4F"/>
  <text x="86" y="79" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="600" fill="#1D4ED8">⁴He</text>
  <text x="148" y="36" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">Broad Apex (Fe-56 / Ni-62)</text>
  <text x="326" y="64" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="600" fill="#3D6B4F">²³⁸U</text>
</svg>`,

  'phy-q9-bridge': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" width="360" height="220" role="img" aria-label="Wheatstone bridge circuit with 4 ohm, 8 ohm, 2 ohm, 4 ohm arms, 7 ohm central resistor, and 12V cell">
  <rect x="0" y="0" width="360" height="220" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <line x1="50" y1="92" x2="180" y2="28" stroke="#1E1B18" stroke-width="2"/>
  <line x1="180" y1="28" x2="310" y2="92" stroke="#1E1B18" stroke-width="2"/>
  <line x1="50" y1="92" x2="180" y2="156" stroke="#1E1B18" stroke-width="2"/>
  <line x1="180" y1="156" x2="310" y2="92" stroke="#1E1B18" stroke-width="2"/>
  <line x1="180" y1="28" x2="180" y2="156" stroke="#575048" stroke-width="2" stroke-dasharray="5 3"/>
  <polyline points="50,92 50,186 164,186" fill="none" stroke="#1E1B18" stroke-width="2"/>
  <polyline points="310,92 310,186 196,186" fill="none" stroke="#1E1B18" stroke-width="2"/>
  <line x1="164" y1="173" x2="164" y2="199" stroke="#1E1B18" stroke-width="2.8"/>
  <line x1="175" y1="180" x2="175" y2="192" stroke="#1E1B18" stroke-width="2.8"/>
  <line x1="184" y1="173" x2="184" y2="199" stroke="#1E1B18" stroke-width="2.8"/>
  <line x1="196" y1="180" x2="196" y2="192" stroke="#1E1B18" stroke-width="2.8"/>
  <circle cx="50" cy="92" r="4" fill="#1E1B18"/>
  <circle cx="310" cy="92" r="4" fill="#1E1B18"/>
  <circle cx="180" cy="28" r="4" fill="#1E1B18"/>
  <circle cx="180" cy="156" r="4" fill="#1E1B18"/>
  <text x="30" y="96" font-family="system-ui, Arial, sans-serif" font-size="13" font-weight="700" fill="#1E1B18">A</text>
  <text x="320" y="96" font-family="system-ui, Arial, sans-serif" font-size="13" font-weight="700" fill="#1E1B18">B</text>
  <text x="95" y="48" font-family="system-ui, Arial, sans-serif" font-size="12" font-weight="700" fill="#A64B33">4 Ω</text>
  <text x="248" y="48" font-family="system-ui, Arial, sans-serif" font-size="12" font-weight="700" fill="#A64B33">8 Ω</text>
  <text x="95" y="146" font-family="system-ui, Arial, sans-serif" font-size="12" font-weight="700" fill="#A64B33">2 Ω</text>
  <text x="248" y="146" font-family="system-ui, Arial, sans-serif" font-size="12" font-weight="700" fill="#A64B33">4 Ω</text>
  <text x="188" y="96" font-family="system-ui, Arial, sans-serif" font-size="12" font-weight="700" fill="#575048">7 Ω</text>
  <text x="166" y="212" font-family="system-ui, Arial, sans-serif" font-size="12" font-weight="700" fill="#1E1B18">12 V</text>
</svg>`,

  'phy-q10-bulbs': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 170" width="360" height="170" role="img" aria-label="Two incandescent lamps L1 (40W, 220V) and L2 (100W, 220V) in series across 220V AC">
  <rect x="0" y="0" width="360" height="170" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <rect x="45" y="52" width="270" height="82" fill="none" stroke="#1E1B18" stroke-width="2"/>
  <circle cx="122" cy="52" r="20" fill="#FAF8F3" stroke="#1E1B18" stroke-width="2"/>
  <text x="114" y="56" font-family="system-ui, Arial, sans-serif" font-size="13" font-weight="700" fill="#A64B33">L₁</text>
  <text x="92" y="22" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="600" fill="#575048">40 W, 220 V</text>
  <circle cx="238" cy="52" r="20" fill="#FAF8F3" stroke="#1E1B18" stroke-width="2"/>
  <text x="230" y="56" font-family="system-ui, Arial, sans-serif" font-size="13" font-weight="700" fill="#A64B33">L₂</text>
  <text x="205" y="22" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="600" fill="#575048">100 W, 220 V</text>
  <circle cx="180" cy="134" r="18" fill="#FAF8F3" stroke="#1E1B18" stroke-width="2"/>
  <path d="M170 134 Q175 125 180 134 T190 134" fill="none" stroke="#1E1B18" stroke-width="2"/>
  <text x="148" y="164" font-family="system-ui, Arial, sans-serif" font-size="12" font-weight="700" fill="#1E1B18">220 V A.C.</text>
</svg>`,

  'phy-q12-semicircle': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 130" width="360" height="130" role="img" aria-label="Long straight wire with semicircular arc of radius 5 cm carrying 3A steady current">
  <rect x="0" y="0" width="360" height="130" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <line x1="30" y1="94" x2="120" y2="94" stroke="#1E1B18" stroke-width="2.4"/>
  <path d="M120 94 A60 60 0 0 1 240 94" fill="none" stroke="#1E1B18" stroke-width="2.4"/>
  <line x1="240" y1="94" x2="330" y2="94" stroke="#1E1B18" stroke-width="2.4"/>
  <circle cx="180" cy="94" r="3.5" fill="#A64B33"/>
  <text x="175" y="114" font-family="system-ui, Arial, sans-serif" font-size="12" font-weight="700" fill="#1E1B18">O</text>
  <line x1="180" y1="94" x2="220" y2="49" stroke="#A64B33" stroke-width="1.8" stroke-dasharray="4 3"/>
  <text x="190" y="80" font-family="system-ui, Arial, sans-serif" font-size="11.5" font-weight="700" fill="#A64B33">r = 5 cm</text>
  <text x="52" y="83" font-family="system-ui, Arial, sans-serif" font-size="12" font-weight="700" fill="#1D4ED8">3 A →</text>
  <text x="275" y="83" font-family="system-ui, Arial, sans-serif" font-size="12" font-weight="700" fill="#1D4ED8">3 A →</text>
</svg>`,

  'phy-q23-parallel-cells': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 200" width="380" height="200" role="img" aria-label="Two parallel cells (6V, 1 ohm) and (4V, 2 ohm) connected across external 5 ohm load">
  <rect x="0" y="0" width="380" height="200" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <!-- Outer junctions -->
  <line x1="65" y1="42" x2="65" y2="164" stroke="#1E1B18" stroke-width="2"/>
  <line x1="315" y1="42" x2="315" y2="164" stroke="#1E1B18" stroke-width="2"/>
  <!-- Top Branch: 6V, 1 ohm -->
  <line x1="65" y1="42" x2="145" y2="42" stroke="#1E1B18" stroke-width="2"/>
  <line x1="145" y1="29" x2="145" y2="55" stroke="#1E1B18" stroke-width="2.8"/>
  <line x1="156" y1="35" x2="156" y2="49" stroke="#1E1B18" stroke-width="2.8"/>
  <line x1="156" y1="42" x2="210" y2="42" stroke="#1E1B18" stroke-width="2"/>
  <rect x="210" y="33" width="46" height="18" rx="3" fill="#FAF8F3" stroke="#A64B33" stroke-width="1.8"/>
  <text x="223" y="46" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">1 Ω</text>
  <line x1="256" y1="42" x2="315" y2="42" stroke="#1E1B18" stroke-width="2"/>
  <text x="132" y="21" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">+ 6 V −</text>
  <!-- Middle Branch: 4V, 2 ohm -->
  <line x1="65" y1="102" x2="145" y2="102" stroke="#1E1B18" stroke-width="2"/>
  <line x1="145" y1="89" x2="145" y2="115" stroke="#1E1B18" stroke-width="2.8"/>
  <line x1="156" y1="95" x2="156" y2="109" stroke="#1E1B18" stroke-width="2.8"/>
  <line x1="156" y1="102" x2="210" y2="102" stroke="#1E1B18" stroke-width="2"/>
  <rect x="210" y="93" width="46" height="18" rx="3" fill="#FAF8F3" stroke="#A64B33" stroke-width="1.8"/>
  <text x="223" y="106" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">2 Ω</text>
  <line x1="256" y1="102" x2="315" y2="102" stroke="#1E1B18" stroke-width="2"/>
  <text x="132" y="81" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">+ 4 V −</text>
  <!-- Bottom Load Branch: 5 ohm -->
  <line x1="65" y1="164" x2="155" y2="164" stroke="#1E1B18" stroke-width="2"/>
  <rect x="155" y="153" width="70" height="22" rx="3" fill="#EEF2FF" stroke="#1D4ED8" stroke-width="2"/>
  <text x="167" y="168" font-family="system-ui, Arial, sans-serif" font-size="11.5" font-weight="700" fill="#1D4ED8">R = 5 Ω</text>
  <line x1="225" y1="164" x2="315" y2="164" stroke="#1E1B18" stroke-width="2"/>
  <circle cx="65" cy="102" r="3.5" fill="#1E1B18"/>
  <circle cx="315" cy="102" r="3.5" fill="#1E1B18"/>
</svg>`,

  'phy-q30-photoelectric-graph': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220" width="400" height="220" role="img" aria-label="Photocurrent versus collector potential graph showing stopping potential -V0 and doubled intensity">
  <rect x="0" y="0" width="400" height="220" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <!-- Axes -->
  <line x1="180" y1="22" x2="180" y2="188" stroke="#1E1B18" stroke-width="1.8"/>
  <line x1="35" y1="175" x2="375" y2="175" stroke="#1E1B18" stroke-width="1.8"/>
  <!-- Curves -->
  <path d="M 90 175 C 122 174, 150 130, 180 120 C 210 112, 260 110, 355 110" fill="none" stroke="#1D4ED8" stroke-width="2.4"/>
  <path d="M 90 175 C 120 173, 148 92, 180 72 C 212 58, 260 55, 355 55" fill="none" stroke="#A64B33" stroke-width="2.4"/>
  <circle cx="90" cy="175" r="4" fill="#1E1B18"/>
  <text x="78" y="194" font-family="system-ui, Arial, sans-serif" font-size="11.5" font-weight="700" fill="#A64B33">−V₀</text>
  <text x="176" y="192" font-family="system-ui, Arial, sans-serif" font-size="11" fill="#575048">0</text>
  <text x="242" y="194" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">Collector Potential (V) →</text>
  <text x="22" y="160" font-family="system-ui, Arial, sans-serif" font-size="10.5" fill="#575048">Retarding (−)</text>
  <text x="188" y="24" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">Photocurrent (I)</text>
  <text x="265" y="46" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">2× Intensity (λ = 400 nm)</text>
  <text x="265" y="102" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1D4ED8">1× Intensity (λ = 400 nm)</text>
</svg>`,

  'phy-q31-capacitors': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 180" width="380" height="180" role="img" aria-label="6 microfarad capacitor charged to 100V connected via switch S2 to an uncharged 4 microfarad capacitor">
  <rect x="0" y="0" width="380" height="180" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <!-- Left supply loop -->
  <polyline points="45,45 45,140 165,140" fill="none" stroke="#1E1B18" stroke-width="1.8"/>
  <polyline points="45,45 85,45" fill="none" stroke="#1E1B18" stroke-width="1.8"/>
  <!-- Switch S1 -->
  <circle cx="85" cy="45" r="3" fill="#1E1B18"/>
  <line x1="85" y1="45" x2="115" y2="30" stroke="#A64B33" stroke-width="2"/>
  <circle cx="120" cy="45" r="3" fill="#1E1B18"/>
  <text x="90" y="22" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">S₁ (Open)</text>
  <!-- 100V battery -->
  <rect x="28" y="80" width="34" height="24" fill="#FAF8F3"/>
  <line x1="33" y1="86" x2="57" y2="86" stroke="#1E1B18" stroke-width="2.8"/>
  <line x1="38" y1="96" x2="52" y2="96" stroke="#1E1B18" stroke-width="2.8"/>
  <text x="10" y="114" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1E1B18">100 V</text>
  <!-- Middle 6 uF branch -->
  <line x1="120" y1="45" x2="215" y2="45" stroke="#1E1B18" stroke-width="1.8"/>
  <line x1="165" y1="45" x2="165" y2="84" stroke="#1E1B18" stroke-width="1.8"/>
  <line x1="149" y1="84" x2="181" y2="84" stroke="#1D4ED8" stroke-width="3"/>
  <line x1="149" y1="95" x2="181" y2="95" stroke="#1D4ED8" stroke-width="3"/>
  <line x1="165" y1="95" x2="165" y2="140" stroke="#1E1B18" stroke-width="1.8"/>
  <text x="186" y="93" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1D4ED8">C₁ = 6 μF</text>
  <!-- Switch S2 -->
  <circle cx="215" cy="45" r="3" fill="#1E1B18"/>
  <line x1="215" y1="45" x2="248" y2="45" stroke="#3D6B4F" stroke-width="2.2"/>
  <circle cx="248" cy="45" r="3" fill="#1E1B18"/>
  <text x="218" y="31" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#3D6B4F">S₂ (Closed)</text>
  <!-- Right 4 uF branch -->
  <polyline points="248,45 310,45 310,84" fill="none" stroke="#1E1B18" stroke-width="1.8"/>
  <line x1="294" y1="84" x2="326" y2="84" stroke="#A64B33" stroke-width="3"/>
  <line x1="294" y1="95" x2="326" y2="95" stroke="#A64B33" stroke-width="3"/>
  <polyline points="310,95 310,140 165,140" fill="none" stroke="#1E1B18" stroke-width="1.8"/>
  <text x="260" y="122" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#A64B33">C₂ = 4 μF (Uncharged)</text>
</svg>`,

  // ================= CHEMISTRY QUESTION DIAGRAMS =================
  'chem-q5-piston': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 175" width="380" height="175" role="img" aria-label="Cylinders (a) and (b) showing gas compressed over liquid solvent by extra weights on piston">
  <rect x="0" y="0" width="380" height="175" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <!-- Cylinder (a) -->
  <rect x="35" y="30" width="125" height="110" fill="#FFFFFF" stroke="#1E1B18" stroke-width="2"/>
  <rect x="36" y="96" width="123" height="43" fill="#D6CFC2"/>
  <line x1="35" y1="48" x2="160" y2="48" stroke="#575048" stroke-width="6"/>
  <rect x="82" y="26" width="32" height="16" fill="#C9B9A5" stroke="#1E1B18" stroke-width="1.5"/>
  <text x="91" y="38" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1E1B18">P₁</text>
  <circle cx="62" cy="68" r="2.2" fill="#1D4ED8"/>
  <circle cx="95" cy="78" r="2.2" fill="#1D4ED8"/>
  <circle cx="130" cy="66" r="2.2" fill="#1D4ED8"/>
  <circle cx="80" cy="118" r="2.2" fill="#1D4ED8"/>
  <text x="90" y="160" font-family="system-ui, Arial, sans-serif" font-size="12" font-weight="700" fill="#1E1B18">(a)</text>
  <!-- Cylinder (b) -->
  <rect x="220" y="30" width="125" height="110" fill="#FFFFFF" stroke="#1E1B18" stroke-width="2"/>
  <rect x="221" y="96" width="123" height="43" fill="#D6CFC2"/>
  <line x1="220" y1="68" x2="345" y2="68" stroke="#575048" stroke-width="6"/>
  <rect x="232" y="47" width="26" height="15" fill="#C9B9A5" stroke="#1E1B18" stroke-width="1.5"/>
  <rect x="269" y="47" width="26" height="15" fill="#C9B9A5" stroke="#1E1B18" stroke-width="1.5"/>
  <rect x="306" y="47" width="26" height="15" fill="#C9B9A5" stroke="#1E1B18" stroke-width="1.5"/>
  <text x="265" y="38" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">P₂ &gt; P₁</text>
  <circle cx="245" cy="82" r="2.2" fill="#1D4ED8"/>
  <circle cx="282" cy="84" r="2.2" fill="#1D4ED8"/>
  <circle cx="318" cy="80" r="2.2" fill="#1D4ED8"/>
  <circle cx="246" cy="112" r="2.2" fill="#1D4ED8"/>
  <circle cx="282" cy="122" r="2.2" fill="#1D4ED8"/>
  <circle cx="318" cy="115" r="2.2" fill="#1D4ED8"/>
  <text x="275" y="160" font-family="system-ui, Arial, sans-serif" font-size="12" font-weight="700" fill="#1E1B18">(b)</text>
</svg>`,

  'chem-q11-kinetics-graph': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220" width="400" height="220" role="img" aria-label="First-order radioactive decay curve showing half-life t_1/2 = 25 min and 87.5 percent decay at 75 min">
  <rect x="0" y="0" width="400" height="220" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <line x1="65" y1="24" x2="65" y2="184" stroke="#1E1B18" stroke-width="1.8"/>
  <line x1="65" y1="184" x2="370" y2="184" stroke="#1E1B18" stroke-width="1.8"/>
  <!-- Exponential Decay Curve: (65, 40) -> (145, 112) -> (225, 148) -> (305, 166) -> (360, 175) -->
  <path d="M 65 40 Q 115 95, 145 112 T 225 148 T 305 166 L 360 175" fill="none" stroke="#A64B33" stroke-width="2.5"/>
  <!-- Half-life markers -->
  <line x1="65" y1="112" x2="145" y2="112" stroke="#575048" stroke-width="1" stroke-dasharray="4 3"/>
  <line x1="145" y1="112" x2="145" y2="184" stroke="#575048" stroke-width="1" stroke-dasharray="4 3"/>
  <line x1="65" y1="166" x2="305" y2="166" stroke="#3D6B4F" stroke-width="1.2" stroke-dasharray="4 3"/>
  <line x1="305" y1="166" x2="305" y2="184" stroke="#3D6B4F" stroke-width="1.2" stroke-dasharray="4 3"/>
  <circle cx="65" cy="40" r="3.5" fill="#1E1B18"/>
  <circle cx="145" cy="112" r="4" fill="#A64B33"/>
  <circle cx="225" cy="148" r="3.5" fill="#A64B33"/>
  <circle cx="305" cy="166" r="4" fill="#3D6B4F"/>
  <!-- Labels -->
  <text x="26" y="44" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1E1B18">[R]₀</text>
  <text x="18" y="116" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="600" fill="#575048">0.5 [R]₀</text>
  <text x="12" y="170" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#3D6B4F">0.125 [R]₀</text>
  <text x="132" y="200" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">25 min</text>
  <text x="212" y="200" font-family="system-ui, Arial, sans-serif" font-size="10" fill="#575048">50 min</text>
  <text x="296" y="200" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#3D6B4F">t = ?</text>
  <text x="185" y="214" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">Time (min) →</text>
  <text x="14" y="135" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1E1B18" transform="rotate(-90 14 135)">[Reactant]</text>
</svg>`,

  'chem-q12-kohlrausch': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220" width="400" height="220" role="img" aria-label="Kohlrausch plot of molar conductivity Lambda_m versus square root of concentration for strong and weak electrolytes">
  <rect x="0" y="0" width="400" height="220" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <line x1="65" y1="22" x2="65" y2="184" stroke="#1E1B18" stroke-width="1.8"/>
  <line x1="65" y1="184" x2="370" y2="184" stroke="#1E1B18" stroke-width="1.8"/>
  <!-- Strong Electrolyte Line -->
  <line x1="65" y1="52" x2="345" y2="96" stroke="#1D4ED8" stroke-width="2.5"/>
  <circle cx="65" cy="52" r="3.5" fill="#1D4ED8"/>
  <!-- Weak Electrolyte Steep Curve -->
  <path d="M 74 34 C 82 110, 120 145, 345 162" fill="none" stroke="#A64B33" stroke-width="2.5"/>
  <!-- 0.1 M dashed vertical marker -->
  <line x1="255" y1="30" x2="255" y2="184" stroke="#575048" stroke-width="1.2" stroke-dasharray="4 3"/>
  <text x="234" y="200" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#575048">√0.1 M</text>
  <text x="195" y="214" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">√c (mol/L)^½ →</text>
  <text x="20" y="135" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18" transform="rotate(-90 20 135)">Λ_m (S cm²/mol)</text>
  <text x="155" y="54" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1D4ED8">Strong Electrolyte (H₂SO₄)</text>
  <text x="135" y="142" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">Weak Electrolyte (CH₃COOH)</text>
</svg>`,

  'chem-q29-pka-scale': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 200" width="420" height="200" role="img" aria-label="Bar comparison of aqueous pKa values at 298 K from Ethanol 15.9 down to Picric acid 0.4">
  <rect x="0" y="0" width="420" height="200" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <text x="18" y="22" font-family="system-ui, Arial, sans-serif" font-size="11.5" font-weight="700" fill="#1E1B18">Measured Aqueous pKₐ Values at 298 K (Lower pKₐ = Stronger Acid)</text>
  <!-- Horizontal Bars -->
  <text x="18" y="52" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="600" fill="#1E1B18">Ethanol</text>
  <rect x="135" y="40" width="238" height="16" rx="3" fill="#787066"/>
  <text x="380" y="52" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1E1B18">15.9</text>

  <text x="18" y="82" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="600" fill="#1E1B18">p-Cresol</text>
  <rect x="135" y="70" width="153" height="16" rx="3" fill="#A64B33"/>
  <text x="295" y="82" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">10.2</text>

  <text x="18" y="112" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="600" fill="#1E1B18">Phenol</text>
  <rect x="135" y="100" width="150" height="16" rx="3" fill="#1D4ED8"/>
  <text x="292" y="112" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1D4ED8">10.0</text>

  <text x="18" y="142" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="600" fill="#1E1B18">p-Nitrophenol</text>
  <rect x="135" y="130" width="106" height="16" rx="3" fill="#3D6B4F"/>
  <text x="248" y="142" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#3D6B4F">7.1</text>

  <text x="18" y="172" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1E1B18">Picric Acid</text>
  <rect x="135" y="160" width="10" height="16" rx="2" fill="#B33A2B"/>
  <text x="152" y="172" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#B33A2B">0.4 (Strongest)</text>
</svg>`,

  'chem-q33-galvanic-cell': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 225" width="420" height="225" role="img" aria-label="Galvanic cell setup with Mg anode in 0.01M Mg2+ and Cu cathode in 0.001M Cu2+ linked by salt bridge">
  <rect x="0" y="0" width="420" height="225" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <!-- Left Beaker (Mg) -->
  <polyline points="45,105 45,195 160,195 160,105" fill="none" stroke="#1E1B18" stroke-width="2"/>
  <rect x="47" y="128" width="111" height="65" fill="#E5E7EB" fill-opacity="0.7"/>
  <rect x="75" y="72" width="18" height="108" fill="#9CA3AF" stroke="#1E1B18" stroke-width="1.6"/>
  <text x="72" y="64" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">Mg(s)</text>
  <text x="56" y="190" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#1E1B18">Mg²⁺ (0.01 M)</text>
  <!-- Right Beaker (Cu) -->
  <polyline points="260,105 260,195 375,195 375,105" fill="none" stroke="#1E1B18" stroke-width="2"/>
  <rect x="262" y="128" width="111" height="65" fill="#DBEAFE" fill-opacity="0.7"/>
  <rect x="326" y="72" width="18" height="108" fill="#C26D4A" stroke="#1E1B18" stroke-width="1.6"/>
  <text x="323" y="64" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#A64B33">Cu(s)</text>
  <text x="268" y="190" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#1D4ED8">Cu²⁺ (0.001 M)</text>
  <!-- Salt Bridge -->
  <path d="M 135 150 L 135 90 Q 135 76 150 76 L 270 76 Q 285 76 285 90 L 285 150" fill="none" stroke="#575048" stroke-width="12" stroke-linecap="round" opacity="0.28"/>
  <path d="M 135 150 L 135 90 Q 135 76 150 76 L 270 76 Q 285 76 285 90 L 285 150" fill="none" stroke="#575048" stroke-width="1.6"/>
  <text x="176" y="96" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#575048">Salt Bridge</text>
  <!-- External Wire & Voltmeter -->
  <polyline points="84,72 84,32 192,32" fill="none" stroke="#1E1B18" stroke-width="1.8"/>
  <polyline points="228,32 335,32 335,72" fill="none" stroke="#1E1B18" stroke-width="1.8"/>
  <circle cx="210" cy="32" r="16" fill="#FAF8F3" stroke="#1E1B18" stroke-width="2"/>
  <text x="205" y="36" font-family="system-ui, Arial, sans-serif" font-size="12" font-weight="700" fill="#1E1B18">V</text>
  <text x="122" y="22" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#3D6B4F">e⁻ flow →</text>
</svg>`,

  // ================= BIOLOGY QUESTION DIAGRAMS =================
  'bio-q1-anther': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 220" width="420" height="220" role="img" aria-label="Sectional diagram of microsporangium anther wall showing layers labeled A, B, C, and D">
  <rect x="0" y="0" width="420" height="220" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <!-- Outer curved microsporangium lobe sector -->
  <path d="M 40 185 A 145 145 0 0 1 285 185" fill="#F2ECE0" stroke="#1E1B18" stroke-width="2"/>
  <path d="M 60 185 A 122 122 0 0 1 265 185" fill="#EAE0CE" stroke="#575048" stroke-width="1.6" stroke-dasharray="5 3"/>
  <path d="M 80 185 A 100 100 0 0 1 245 185" fill="#DFD5C3" stroke="#575048" stroke-width="1.4"/>
  <!-- Innermost Tapetum ring & sporogenous core -->
  <path d="M 98 185 A 78 78 0 0 1 227 185" fill="#FDE68A" fill-opacity="0.55" stroke="#A64B33" stroke-width="2.2"/>
  <circle cx="162" cy="152" r="34" fill="#FAF8F3" stroke="#3D6B4F" stroke-width="1.6"/>
  <circle cx="152" cy="146" r="8" fill="#BBF7D0" stroke="#3D6B4F" stroke-width="1.3"/>
  <circle cx="174" cy="148" r="8" fill="#BBF7D0" stroke="#3D6B4F" stroke-width="1.3"/>
  <circle cx="162" cy="166" r="8" fill="#BBF7D0" stroke="#3D6B4F" stroke-width="1.3"/>
  <!-- Leader lines A, B, C, D -->
  <line x1="205" y1="48" x2="310" y2="42" stroke="#1E1B18" stroke-width="1.4"/>
  <circle cx="205" cy="48" r="2.8" fill="#1E1B18"/>
  <text x="316" y="46" font-family="system-ui, Arial, sans-serif" font-size="12" font-weight="700" fill="#1E1B18">A (Outer layer)</text>

  <line x1="218" y1="74" x2="310" y2="82" stroke="#1E1B18" stroke-width="1.4"/>
  <circle cx="218" cy="74" r="2.8" fill="#1E1B18"/>
  <text x="316" y="86" font-family="system-ui, Arial, sans-serif" font-size="12" font-weight="700" fill="#1E1B18">B (Fibrous layer)</text>

  <line x1="224" y1="99" x2="310" y2="122" stroke="#1E1B18" stroke-width="1.4"/>
  <circle cx="224" cy="99" r="2.8" fill="#1E1B18"/>
  <text x="316" y="126" font-family="system-ui, Arial, sans-serif" font-size="12" font-weight="700" fill="#1E1B18">C (2–3 layers)</text>

  <line x1="212" y1="125" x2="310" y2="162" stroke="#A64B33" stroke-width="1.6"/>
  <circle cx="212" cy="125" r="3" fill="#A64B33"/>
  <text x="316" y="166" font-family="system-ui, Arial, sans-serif" font-size="12" font-weight="700" fill="#A64B33">D (Innermost)</text>

  <text x="68" y="206" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="600" fill="#3D6B4F">Sporogenous / MMC Tissue</text>
</svg>`,

  'bio-q4-giraffe': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 190" width="380" height="190" role="img" aria-label="Natural selection distribution curve shifted rightward toward larger beak depth in drought-adapted finches">
  <rect x="0" y="0" width="380" height="190" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <line x1="48" y1="152" x2="352" y2="152" stroke="#1E1B18" stroke-width="1.8"/>
  <line x1="48" y1="152" x2="48" y2="25" stroke="#1E1B18" stroke-width="1.8"/>
  <!-- Original Ancestral Bell Curve (Dashed) -->
  <path d="M 65 150 C 105 144, 130 55, 160 55 C 190 55, 215 144, 255 150" fill="none" stroke="#787066" stroke-width="1.8" stroke-dasharray="5 4"/>
  <!-- Shifted Drought Selection Peak (Solid Green) -->
  <path d="M 120 150 C 175 144, 220 38, 255 42 C 288 46, 308 112, 332 150" fill="#3D6B4F" fill-opacity="0.14" stroke="#3D6B4F" stroke-width="2.6"/>
  <!-- Shift arrow -->
  <line x1="168" y1="45" x2="236" y2="45" stroke="#A64B33" stroke-width="2"/>
  <polygon points="236,41 245,45 236,49" fill="#A64B33"/>
  <text x="172" y="34" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">Peak Shifts Right</text>
  <text x="115" y="172" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">Beak Depth in Finches (mm) →</text>
  <text x="18" y="128" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1E1B18" transform="rotate(-90 18 128)">No. of Birds →</text>
</svg>`,

  'bio-q5-transcription': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 165" width="380" height="165" role="img" aria-label="Prokaryotic transcription initiation diagram showing A Promoter, B Sigma factor, C RNA polymerase, and D DNA helix">
  <rect x="0" y="0" width="380" height="165" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <line x1="35" y1="54" x2="345" y2="54" stroke="#3D6B4F" stroke-width="3.2"/>
  <line x1="35" y1="72" x2="345" y2="72" stroke="#A64B33" stroke-width="3.2"/>
  <!-- Promoter Region A -->
  <rect x="52" y="50" width="44" height="26" rx="3" fill="#BBF7D0" fill-opacity="0.7" stroke="#3D6B4F" stroke-width="1.4"/>
  <!-- RNA Pol C & Sigma B -->
  <ellipse cx="145" cy="78" rx="44" ry="25" fill="#E8D7B9" stroke="#8C6A3B" stroke-width="2"/>
  <circle cx="122" cy="80" r="12" fill="#D4846A" stroke="#7A3220" stroke-width="1.6"/>
  <text x="117" y="84" font-family="system-ui, Arial, sans-serif" font-size="12" font-weight="700" fill="#1E1B18">σ</text>
  <!-- Leader lines -->
  <line x1="74" y1="76" x2="58" y2="118" stroke="#1E1B18" stroke-width="1.5"/>
  <text x="50" y="136" font-family="system-ui, Arial, sans-serif" font-size="13" font-weight="700" fill="#1E1B18">A</text>
  <line x1="118" y1="92" x2="104" y2="128" stroke="#1E1B18" stroke-width="1.5"/>
  <text x="97" y="144" font-family="system-ui, Arial, sans-serif" font-size="13" font-weight="700" fill="#1E1B18">B</text>
  <line x1="168" y1="98" x2="188" y2="128" stroke="#1E1B18" stroke-width="1.5"/>
  <text x="190" y="144" font-family="system-ui, Arial, sans-serif" font-size="13" font-weight="700" fill="#1E1B18">C</text>
  <line x1="286" y1="74" x2="298" y2="116" stroke="#1E1B18" stroke-width="1.5"/>
  <text x="298" y="134" font-family="system-ui, Arial, sans-serif" font-size="13" font-weight="700" fill="#1E1B18">D</text>
  <text x="45" y="34" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#575048">3′ / 5′ Prokaryotic Transcription Initiation Complex</text>
</svg>`,

  'bio-q6-avery': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 200" width="420" height="200" role="img" aria-label="Four Avery-MacLeod-McCarty assay tubes treated with RNase, Protease, DNase, and Lipase">
  <rect x="0" y="0" width="420" height="200" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <text x="16" y="22" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">Heat-killed S-Extract + Live R-Cells Assay (Recorded Student Lab Results)</text>
  <!-- Tube A -->
  <rect x="28" y="38" width="44" height="92" rx="18" fill="#E0F2FE" stroke="#1E1B18" stroke-width="1.8"/>
  <rect x="29" y="80" width="42" height="49" rx="16" fill="#BAE6FD"/>
  <text x="25" y="148" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">Tube A</text>
  <text x="23" y="163" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#1D4ED8">+ RNase</text>
  <text x="16" y="180" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="600" fill="#3D6B4F">S-colonies ✓</text>
  <!-- Tube B -->
  <rect x="130" y="38" width="44" height="92" rx="18" fill="#FEF3C7" stroke="#A64B33" stroke-width="2"/>
  <rect x="131" y="80" width="42" height="49" rx="16" fill="#FDE68A"/>
  <text x="128" y="148" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">Tube B</text>
  <text x="120" y="163" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#A64B33">+ Protease</text>
  <text x="115" y="180" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="700" fill="#B33A2B">No S-colonies?</text>
  <!-- Tube C -->
  <rect x="234" y="38" width="44" height="92" rx="18" fill="#FEE2E2" stroke="#1E1B18" stroke-width="1.8"/>
  <rect x="235" y="80" width="42" height="49" rx="16" fill="#FECACA"/>
  <text x="232" y="148" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">Tube C</text>
  <text x="228" y="163" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#B33A2B">+ DNase</text>
  <text x="218" y="180" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="600" fill="#575048">No S-colonies</text>
  <!-- Tube D -->
  <rect x="336" y="38" width="44" height="92" rx="18" fill="#DCFCE7" stroke="#1E1B18" stroke-width="1.8"/>
  <rect x="337" y="80" width="42" height="49" rx="16" fill="#BBF7D0"/>
  <text x="334" y="148" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">Tube D</text>
  <text x="330" y="163" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#3D6B4F">+ Lipase</text>
  <text x="322" y="180" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="600" fill="#3D6B4F">S-colonies ✓</text>
</svg>`,

  'bio-q8-pedigree': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 185" width="360" height="185" role="img" aria-label="Human family pedigree chart showing unaffected parents having an affected son and an affected daughter">
  <rect x="0" y="0" width="360" height="185" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <!-- Gen I -->
  <rect x="112" y="22" width="24" height="24" fill="#FAF8F3" stroke="#1E1B18" stroke-width="2"/>
  <circle cx="222" cy="34" r="12" fill="#FAF8F3" stroke="#1E1B18" stroke-width="2"/>
  <line x1="136" y1="34" x2="210" y2="34" stroke="#1E1B18" stroke-width="2"/>
  <line x1="173" y1="34" x2="173" y2="70" stroke="#1E1B18" stroke-width="2"/>
  <line x1="56" y1="70" x2="300" y2="70" stroke="#1E1B18" stroke-width="2"/>
  <!-- Gen II Children -->
  <line x1="56" y1="70" x2="56" y2="94" stroke="#1E1B18" stroke-width="2"/>
  <rect x="44" y="94" width="24" height="24" fill="#1E1B18" stroke="#1E1B18" stroke-width="2"/>
  <line x1="120" y1="70" x2="120" y2="94" stroke="#1E1B18" stroke-width="2"/>
  <circle cx="120" cy="106" r="12" fill="#FAF8F3" stroke="#1E1B18" stroke-width="2"/>
  <line x1="180" y1="70" x2="180" y2="94" stroke="#1E1B18" stroke-width="2"/>
  <circle cx="180" cy="106" r="12" fill="#FAF8F3" stroke="#1E1B18" stroke-width="2"/>
  <line x1="240" y1="70" x2="240" y2="94" stroke="#1E1B18" stroke-width="2"/>
  <circle cx="240" cy="106" r="12" fill="#1E1B18" stroke="#1E1B18" stroke-width="2"/>
  <line x1="300" y1="70" x2="300" y2="94" stroke="#1E1B18" stroke-width="2"/>
  <rect x="288" y="94" width="24" height="24" fill="#FAF8F3" stroke="#1E1B18" stroke-width="2"/>
  <text x="18" y="38" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#575048">Gen I</text>
  <text x="18" y="110" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#575048">Gen II</text>
  <text x="34" y="156" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="600" fill="#575048">Filled symbols = affected (both son &amp; daughter affected)</text>
</svg>`,

  'bio-q21-growth-curve': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220" width="400" height="220" role="img" aria-label="Population growth curves A (J-shaped) and B (S-shaped reaching asymptote K)">
  <rect x="0" y="0" width="400" height="220" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <line x1="58" y1="24" x2="58" y2="182" stroke="#1E1B18" stroke-width="1.8"/>
  <line x1="58" y1="182" x2="375" y2="182" stroke="#1E1B18" stroke-width="1.8"/>
  <!-- Carrying Capacity Line K -->
  <line x1="58" y1="62" x2="370" y2="62" stroke="#575048" stroke-width="1.5" stroke-dasharray="6 4"/>
  <text x="42" y="66" font-family="system-ui, Arial, sans-serif" font-size="12" font-weight="700" fill="#575048">K</text>
  <!-- Curve A: J-shaped -->
  <path d="M 60 176 Q 130 165, 175 110 T 218 28" fill="none" stroke="#A64B33" stroke-width="2.6"/>
  <text x="225" y="38" font-family="system-ui, Arial, sans-serif" font-size="11.5" font-weight="700" fill="#A64B33">Curve A (J-shaped)</text>
  <!-- Curve B: S-shaped Logistic -->
  <path d="M 60 176 C 125 174, 170 120, 215 88 C 255 64, 305 63, 365 63" fill="none" stroke="#3D6B4F" stroke-width="2.6"/>
  <text x="242" y="96" font-family="system-ui, Arial, sans-serif" font-size="11.5" font-weight="700" fill="#3D6B4F">Curve B (Sigmoid)</text>
  <text x="172" y="206" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">Time (t) →</text>
  <text x="18" y="142" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1E1B18" transform="rotate(-90 18 142)">Population Density (N) →</text>
</svg>`,

  'bio-q26-lac-operon': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 175" width="420" height="175" role="img" aria-label="Lac operon DNA locus schematic showing i, p, o, z, y, and a genes with regulator protein X">
  <rect x="0" y="0" width="420" height="175" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <text x="16" y="24" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">Escherichia coli Lac Operon Genetic Locus (5′ → 3′)</text>
  <!-- DNA backbone -->
  <line x1="20" y1="68" x2="400" y2="68" stroke="#1E1B18" stroke-width="2.2"/>
  <!-- Gene blocks -->
  <rect x="30" y="54" width="38" height="28" rx="3" fill="#E0E7FF" stroke="#1D4ED8" stroke-width="1.6"/>
  <text x="46" y="72" font-family="system-ui, Arial, sans-serif" font-size="12" font-weight="700" fill="#1D4ED8">i</text>
  <rect x="86" y="54" width="32" height="28" rx="3" fill="#F3F4F6" stroke="#1E1B18" stroke-width="1.5"/>
  <text x="98" y="72" font-family="system-ui, Arial, sans-serif" font-size="12" font-weight="700" fill="#1E1B18">p</text>
  <rect x="122" y="54" width="34" height="28" rx="3" fill="#FEE2E2" stroke="#A64B33" stroke-width="1.8"/>
  <text x="135" y="72" font-family="system-ui, Arial, sans-serif" font-size="12" font-weight="700" fill="#A64B33">o</text>
  <rect x="168" y="54" width="70" height="28" rx="3" fill="#DCFCE7" stroke="#3D6B4F" stroke-width="1.6"/>
  <text x="198" y="72" font-family="system-ui, Arial, sans-serif" font-size="12" font-weight="700" fill="#3D6B4F">z</text>
  <rect x="242" y="54" width="66" height="28" rx="3" fill="#D1FAE5" stroke="#3D6B4F" stroke-width="1.6"/>
  <text x="271" y="72" font-family="system-ui, Arial, sans-serif" font-size="12" font-weight="700" fill="#3D6B4F">y</text>
  <rect x="312" y="54" width="66" height="28" rx="3" fill="#ECFDF5" stroke="#3D6B4F" stroke-width="1.6"/>
  <text x="341" y="72" font-family="system-ui, Arial, sans-serif" font-size="12" font-weight="700" fill="#3D6B4F">a</text>
  <!-- Repressor binding arrow from i to o -->
  <path d="M 49 84 L 49 124 L 139 124 L 139 86" fill="none" stroke="#A64B33" stroke-width="1.8" stroke-dasharray="4 3"/>
  <circle cx="95" cy="124" r="14" fill="#FECACA" stroke="#A64B33" stroke-width="1.8"/>
  <text x="90" y="128" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#8C2318">R</text>
  <text x="48" y="156" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">Active Repressor Protein (Blocks Operator o when Lactose absent)</text>
</svg>`,

  'bio-q28-pyramids': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 205" width="420" height="205" role="img" aria-label="Comparison of Upright Pyramid of Energy and Inverted Marine Pyramid of Biomass">
  <rect x="0" y="0" width="420" height="205" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <!-- Left: Upright Energy Pyramid -->
  <text x="38" y="24" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#3D6B4F">(I) Pyramid of Energy</text>
  <rect x="85" y="42" width="42" height="26" fill="#DCFCE7" stroke="#3D6B4F" stroke-width="1.6"/>
  <text x="94" y="59" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#1E1B18">10 J</text>
  <rect x="65" y="72" width="82" height="26" fill="#BBF7D0" stroke="#3D6B4F" stroke-width="1.6"/>
  <text x="90" y="89" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#1E1B18">100 J</text>
  <rect x="45" y="102" width="122" height="26" fill="#86EFAC" stroke="#3D6B4F" stroke-width="1.6"/>
  <text x="86" y="119" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#1E1B18">1,000 J</text>
  <rect x="25" y="132" width="162" height="26" fill="#4ADE80" stroke="#3D6B4F" stroke-width="1.6"/>
  <text x="68" y="149" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#1E1B18">10,000 J (Producers)</text>
  <text x="52" y="182" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#575048">Always Upright</text>

  <!-- Right: Inverted Marine Biomass -->
  <text x="230" y="24" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1D4ED8">(II) Marine Biomass Pyramid</text>
  <rect x="242" y="56" width="142" height="36" fill="#BFDBFE" stroke="#1D4ED8" stroke-width="1.6"/>
  <text x="258" y="78" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1E1B18">PC (Zooplankton): 21 g/m²</text>
  <rect x="284" y="104" width="58" height="36" fill="#93C5FD" stroke="#1D4ED8" stroke-width="1.6"/>
  <text x="291" y="126" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#1E1B18">4 g/m²</text>
  <text x="260" y="158" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="600" fill="#1D4ED8">PP (Phytoplankton)</text>
  <text x="266" y="182" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#575048">Inverted in Sea</text>
</svg>`,

  'bio-q29-menstrual-graph': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 210" width="420" height="210" role="img" aria-label="28-day menstrual cycle hormone profile showing Day 14 LH peak and Days 15-24 luteal progesterone surge">
  <rect x="0" y="0" width="420" height="210" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <line x1="48" y1="24" x2="48" y2="170" stroke="#1E1B18" stroke-width="1.8"/>
  <line x1="48" y1="170" x2="390" y2="170" stroke="#1E1B18" stroke-width="1.8"/>
  <!-- Day 14 Marker -->
  <line x1="210" y1="24" x2="210" y2="170" stroke="#A64B33" stroke-width="1.4" stroke-dasharray="4 3"/>
  <!-- LH Curve (Sharp Spike at Day 14) -->
  <path d="M 52 152 L 175 148 Q 198 145, 210 34 Q 222 145, 245 152 L 380 155" fill="none" stroke="#A64B33" stroke-width="2.5"/>
  <!-- Progesterone Curve (Broad Luteal Plateau Days 15-24) -->
  <path d="M 52 162 L 210 160 C 235 155, 250 85, 285 82 C 320 80, 342 125, 378 162" fill="none" stroke="#3D6B4F" stroke-width="2.5"/>
  <circle cx="210" cy="34" r="4" fill="#A64B33"/>
  <text x="220" y="38" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">LH Surge (Day 14)</text>
  <text x="256" y="72" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#3D6B4F">Progesterone (Luteal)</text>
  <text x="46" y="186" font-family="system-ui, Arial, sans-serif" font-size="10" fill="#575048">Day 1</text>
  <text x="195" y="186" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#A64B33">Day 14</text>
  <text x="360" y="186" font-family="system-ui, Arial, sans-serif" font-size="10" fill="#575048">Day 28</text>
  <text x="16" y="128" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#1E1B18" transform="rotate(-90 16 128)">Serum Level →</text>
</svg>`,

  // ================= MATHEMATICS QUESTION DIAGRAMS =================
  'math-q1-graph': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="320" height="220" role="img" aria-label="Strictly increasing curve from (-1, pi/2) through (0, pi) to (1, 3pi/2)">
  <rect x="0" y="0" width="320" height="220" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <line x1="35" y1="178" x2="290" y2="178" stroke="#1E1B18" stroke-width="1.6"/>
  <line x1="160" y1="20" x2="160" y2="200" stroke="#1E1B18" stroke-width="1.6"/>
  <line x1="154" y1="48" x2="166" y2="48" stroke="#1E1B18" stroke-width="1.2"/>
  <line x1="154" y1="95" x2="166" y2="95" stroke="#1E1B18" stroke-width="1.2"/>
  <line x1="154" y1="142" x2="166" y2="142" stroke="#1E1B18" stroke-width="1.2"/>
  <text x="122" y="52" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="600" fill="#1E1B18">3π/2</text>
  <text x="142" y="99" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="600" fill="#1E1B18">π</text>
  <text x="128" y="146" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="600" fill="#1E1B18">π/2</text>
  <text x="167" y="28" font-family="system-ui, Arial, sans-serif" font-size="11.5" font-weight="700" fill="#1E1B18">Y</text>
  <text x="282" y="170" font-family="system-ui, Arial, sans-serif" font-size="11.5" font-weight="700" fill="#1E1B18">X</text>
  <text x="98" y="194" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="600" fill="#1E1B18">−1</text>
  <text x="210" y="194" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="600" fill="#1E1B18">1</text>
  <path d="M 106 142 C 115 110, 140 98, 160 95 C 180 92, 205 80, 214 48" fill="none" stroke="#A64B33" stroke-width="2.6"/>
  <circle cx="106" cy="142" r="3.5" fill="#A64B33"/>
  <circle cx="160" cy="95" r="3.5" fill="#A64B33"/>
  <circle cx="214" cy="48" r="3.5" fill="#A64B33"/>
</svg>`,

  'math-q9-monotonicity': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 205" width="380" height="205" role="img" aria-label="Plot of f(x) = x + 2 cos x on [0, pi] showing local extremum points at pi/6 and 5pi/6">
  <rect x="0" y="0" width="380" height="205" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <line x1="50" y1="168" x2="350" y2="168" stroke="#1E1B18" stroke-width="1.6"/>
  <line x1="50" y1="24" x2="50" y2="180" stroke="#1E1B18" stroke-width="1.6"/>
  <!-- f(x) = x + 2 cos x: x=0->2.0, x=pi/6->2.256, x=5pi/6->0.886, x=pi->1.142 -->
  <path d="M 50 75 Q 72 58, 95 62 C 155 72, 235 128, 295 135 Q 320 137, 340 124" fill="none" stroke="#1D4ED8" stroke-width="2.6"/>
  <line x1="95" y1="62" x2="95" y2="168" stroke="#A64B33" stroke-width="1.2" stroke-dasharray="4 3"/>
  <line x1="295" y1="135" x2="295" y2="168" stroke="#A64B33" stroke-width="1.2" stroke-dasharray="4 3"/>
  <circle cx="95" cy="62" r="4" fill="#A64B33"/>
  <circle cx="295" cy="135" r="4" fill="#A64B33"/>
  <text x="86" y="185" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">π/6</text>
  <text x="282" y="185" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">5π/6</text>
  <text x="336" y="185" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="600" fill="#1E1B18">π</text>
  <text x="44" y="185" font-family="system-ui, Arial, sans-serif" font-size="10.5" fill="#575048">0</text>
  <text x="148" y="88" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1D4ED8">Strictly Decreasing Interval</text>
</svg>`,

  'math-q25-lpp-region': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 230" width="380" height="230" role="img" aria-label="First-quadrant shaded bounded feasible region under lines through (4,0)-(0,6) and (6,0)-(0,2)">
  <rect x="0" y="0" width="380" height="230" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <!-- Origin at (65, 190), scale: 1 unit = 42px X, 25px Y -->
  <line x1="65" y1="20" x2="65" y2="200" stroke="#1E1B18" stroke-width="1.8"/>
  <line x1="45" y1="190" x2="355" y2="190" stroke="#1E1B18" stroke-width="1.8"/>
  <!-- Shaded Bounded Quadrilateral: (0,0)->(65,190), (4,0)->(233,190), (24/7,6/7)->(209,169), (0,2)->(65,140) -->
  <polygon points="65,190 233,190 209,169 65,140" fill="#3D6B4F" fill-opacity="0.22" stroke="#3D6B4F" stroke-width="1.4"/>
  <!-- Line 1: (0,6)->(65,40) to (4,0)->(233,190) -->
  <line x1="65" y1="40" x2="233" y2="190" stroke="#A64B33" stroke-width="2.2"/>
  <!-- Line 2: (0,2)->(65,140) to (6,0)->(317,190) -->
  <line x1="65" y1="140" x2="317" y2="190" stroke="#1D4ED8" stroke-width="2.2"/>
  <circle cx="65" cy="40" r="3.5" fill="#A64B33"/>
  <circle cx="233" cy="190" r="3.5" fill="#A64B33"/>
  <circle cx="65" cy="140" r="3.5" fill="#1D4ED8"/>
  <circle cx="317" cy="190" r="3.5" fill="#1D4ED8"/>
  <circle cx="209" cy="169" r="3.5" fill="#1E1B18"/>
  <text x="72" y="42" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">(0, 6)</text>
  <text x="224" y="208" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">(4, 0)</text>
  <text x="24" y="144" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1D4ED8">(0, 2)</text>
  <text x="308" y="208" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1D4ED8">(6, 0)</text>
  <text x="86" y="176" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#3D6B4F">Feasible Region</text>
</svg>`,

  'math-q30-perp-foot': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 185" width="380" height="185" role="img" aria-label="Perpendicular dropped from point P(0, -3, 0) to foot M on Cartesian 3D line">
  <rect x="0" y="0" width="380" height="185" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <!-- 3D Line L -->
  <line x1="35" y1="145" x2="345" y2="95" stroke="#1D4ED8" stroke-width="2.4"/>
  <!-- Point P and Foot M -->
  <line x1="176" y1="36" x2="191" y2="120" stroke="#A64B33" stroke-width="2" stroke-dasharray="5 3"/>
  <!-- Right angle mark -->
  <polyline points="189,108 202,106 204,118" fill="none" stroke="#1E1B18" stroke-width="1.4"/>
  <circle cx="176" cy="36" r="4.5" fill="#A64B33"/>
  <circle cx="191" cy="120" r="4.5" fill="#1D4ED8"/>
  <text x="188" y="38" font-family="system-ui, Arial, sans-serif" font-size="11.5" font-weight="700" fill="#A64B33">P(0, −3, 0)</text>
  <text x="198" y="138" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1D4ED8">M (Foot of Perpendicular)</text>
  <text x="45" y="164" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="600" fill="#575048">Line L: (x−1)/2 = (y−2)/3 = (z−3)/4</text>
</svg>`,

  'math-q36-skew-lines': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 190" width="380" height="190" role="img" aria-label="Two non-intersecting 3D skew drone flight corridors L1 and L2 separated by shortest distance d">
  <rect x="0" y="0" width="380" height="190" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <!-- Upper Skew Corridor L1 -->
  <line x1="35" y1="55" x2="340" y2="35" stroke="#1D4ED8" stroke-width="2.5"/>
  <circle cx="165" cy="46" r="4" fill="#1D4ED8"/>
  <!-- Lower Skew Corridor L2 -->
  <line x1="40" y1="150" x2="345" y2="122" stroke="#3D6B4F" stroke-width="2.5"/>
  <circle cx="165" cy="138" r="4" fill="#3D6B4F"/>
  <!-- Shortest Distance Perpendicular -->
  <line x1="165" y1="46" x2="165" y2="138" stroke="#A64B33" stroke-width="2" stroke-dasharray="5 3"/>
  <text x="174" y="96" font-family="system-ui, Arial, sans-serif" font-size="11.5" font-weight="700" fill="#A64B33">d (Shortest ⊥ Distance)</text>
  <text x="235" y="28" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1D4ED8">Corridor L₁ (a₁, b₁)</text>
  <text x="235" y="162" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#3D6B4F">Corridor L₂ (a₂, b₂)</text>
</svg>`,
};
