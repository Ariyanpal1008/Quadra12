// Self-contained, print-sharp labeled SVG reference diagrams for all 4 Marking Schemes
// Every SVG includes xmlns, viewBox, explicit width/height, and legible typography.

export const MARKING_SCHEME_DIAGRAM_SVGS: Record<string, string> = {
  // ================= PHYSICS MARKING SCHEME DIAGRAMS (7) =================
  'phy-ms-20': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 220" width="420" height="220" role="img" aria-label="45-90-45 right-angled glass prism turning incident rays by 180 degrees via two total internal reflections">
  <rect x="0" y="0" width="420" height="220" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <defs>
    <marker id="arrP20" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#A64B33"/>
    </marker>
  </defs>
  <!-- 45-90-45 Isosceles Glass Prism (Hypotenuse at bottom: (75,180) to (345,180), Apex 90 deg at (210,45)) -->
  <polygon points="75,180 345,180 210,45" fill="#E0F2FE" fill-opacity="0.55" stroke="#1E1B18" stroke-width="2.2"/>
  <text x="196" y="69" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">90°</text>
  <text x="102" y="173" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1E1B18">45°</text>
  <text x="298" y="173" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1E1B18">45°</text>
  <!-- Ray entering hypotenuse normally at x=150, y=210 -> y=105 on left face (x=150, y=105) -->
  <line x1="150" y1="210" x2="150" y2="105" stroke="#A64B33" stroke-width="2.2" marker-end="url(#arrP20)"/>
  <!-- TIR 1 across horizontal to right face (270, 105) -->
  <line x1="150" y1="105" x2="270" y2="105" stroke="#A64B33" stroke-width="2.2" marker-end="url(#arrP20)"/>
  <!-- TIR 2 exiting downwards normally through hypotenuse at x=270 -->
  <line x1="270" y1="105" x2="270" y2="210" stroke="#A64B33" stroke-width="2.2" marker-end="url(#arrP20)"/>
  <!-- Normals at reflection points -->
  <line x1="130" y1="125" x2="170" y2="85" stroke="#575048" stroke-width="1.2" stroke-dasharray="4 3"/>
  <line x1="250" y1="85" x2="290" y2="125" stroke="#575048" stroke-width="1.2" stroke-dasharray="4 3"/>
  <text x="16" y="30" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">180° Deviation by Porro Prism (n = 1.5)</text>
  <text x="16" y="48" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="600" fill="#1D4ED8">i = 45° &gt; i_c ≈ 41.8°</text>
  <text x="118" y="205" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">In ↑</text>
  <text x="278" y="205" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">Out ↓</text>
</svg>`,

  'phy-ms-21': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 230" width="420" height="230" role="img" aria-label="Silicon p-n junction diode forward and reverse V-I characteristics curve showing 0.7V knee voltage and breakdown voltage">
  <rect x="0" y="0" width="420" height="230" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <!-- Axes crossing at (210, 120) -->
  <line x1="30" y1="120" x2="395" y2="120" stroke="#1E1B18" stroke-width="1.8"/>
  <line x1="210" y1="20" x2="210" y2="210" stroke="#1E1B18" stroke-width="1.8"/>
  <!-- Forward Bias Curve (+V, +I in mA) -->
  <path d="M 210 120 L 260 118 Q 282 116, 295 85 T 325 28" fill="none" stroke="#3D6B4F" stroke-width="2.6"/>
  <circle cx="268" cy="117" r="3.5" fill="#3D6B4F"/>
  <text x="255" y="136" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#3D6B4F">V_knee ≈ 0.7 V</text>
  <text x="218" y="30" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#3D6B4F">+I (mA)</text>
  <text x="342" y="113" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">+V_F (V)</text>
  <!-- Reverse Bias Curve (-V, -I in uA) -->
  <path d="M 210 120 L 200 128 L 92 132 Q 82 134, 78 160 L 74 205" fill="none" stroke="#A64B33" stroke-width="2.6"/>
  <line x1="84" y1="120" x2="84" y2="145" stroke="#A64B33" stroke-width="1.2" stroke-dasharray="3 3"/>
  <text x="64" y="112" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">−V_br (Breakdown)</text>
  <text x="35" y="113" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1E1B18">−V_R</text>
  <text x="218" y="205" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#A64B33">−I (μA)</text>
  <text x="108" y="150" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="600" fill="#575048">Reverse Saturation</text>
</svg>`,

  'phy-ms-22': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 215" width="420" height="215" role="img" aria-label="Electric dipole +-q oriented at angle theta in uniform electric field E experiencing torque couple with lever arm 2a sin theta">
  <rect x="0" y="0" width="420" height="215" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <defs>
    <marker id="arrB22" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#1D4ED8"/>
    </marker>
    <marker id="arrR22" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#A64B33"/>
    </marker>
  </defs>
  <!-- Uniform E lines -->
  <line x1="35" y1="45" x2="380" y2="45" stroke="#1D4ED8" stroke-width="1.5" stroke-dasharray="6 4" marker-end="url(#arrB22)"/>
  <line x1="35" y1="110" x2="380" y2="110" stroke="#1D4ED8" stroke-width="1.5" stroke-dasharray="6 4" marker-end="url(#arrB22)"/>
  <line x1="35" y1="175" x2="380" y2="175" stroke="#1D4ED8" stroke-width="1.5" stroke-dasharray="6 4" marker-end="url(#arrB22)"/>
  <text x="360" y="34" font-family="system-ui, Arial, sans-serif" font-size="12" font-weight="700" fill="#1D4ED8">E →</text>
  <!-- Dipole Rod from -q (140, 155) to +q (260, 65) -->
  <line x1="140" y1="155" x2="260" y2="65" stroke="#1E1B18" stroke-width="3.2"/>
  <circle cx="140" cy="155" r="7" fill="#1D4ED8"/>
  <circle cx="260" cy="65" r="7" fill="#A64B33"/>
  <!-- Right triangle dashed lines for 2a sin theta -->
  <line x1="140" y1="155" x2="260" y2="155" stroke="#575048" stroke-width="1.3" stroke-dasharray="3 3"/>
  <line x1="260" y1="65" x2="260" y2="155" stroke="#3D6B4F" stroke-width="1.8" stroke-dasharray="4 3"/>
  <!-- Forces +qE and -qE -->
  <line x1="267" y1="65" x2="338" y2="65" stroke="#A64B33" stroke-width="2.2" marker-end="url(#arrR22)"/>
  <line x1="133" y1="155" x2="62" y2="155" stroke="#A64B33" stroke-width="2.2" marker-end="url(#arrR22)"/>
  <text x="282" y="57" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#A64B33">F₁ = +qE</text>
  <text x="58" y="145" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#A64B33">F₂ = −qE</text>
  <text x="132" y="176" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1D4ED8">−q</text>
  <text x="252" y="54" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#A64B33">+q</text>
  <text x="172" y="149" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">θ</text>
  <text x="184" y="102" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">2a</text>
  <text x="268" y="116" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#3D6B4F">2a sin θ</text>
  <text x="16" y="202" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">Torque τ = (qE)(2a sin θ) = pE sin θ = p × E</text>
</svg>`,

  'phy-ms-25': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 245" width="420" height="245" role="img" aria-label="Center-tapped full-wave rectifier circuit with diodes D1 and D2 and input versus rectified output waveforms">
  <rect x="0" y="0" width="420" height="245" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <!-- Left Side: Circuit -->
  <text x="18" y="22" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">Centre-Tapped Full-Wave Rectifier Circuit</text>
  <!-- AC Input & Primary -->
  <circle cx="38" cy="86" r="14" fill="#FAF8F3" stroke="#1E1B18" stroke-width="1.8"/>
  <path d="M 31 86 Q 34.5 79 38 86 T 45 86" fill="none" stroke="#1E1B18" stroke-width="1.6"/>
  <polyline points="38,72 38,52 72,52 72,120 38,120 38,100" fill="none" stroke="#1E1B18" stroke-width="1.8"/>
  <!-- Core -->
  <line x1="84" y1="45" x2="84" y2="127" stroke="#575048" stroke-width="2"/>
  <line x1="90" y1="45" x2="90" y2="127" stroke="#575048" stroke-width="2"/>
  <!-- Secondary + Centre Tap -->
  <polyline points="102,48 145,48" fill="none" stroke="#1E1B18" stroke-width="1.8"/>
  <line x1="102" y1="48" x2="102" y2="124" stroke="#1E1B18" stroke-width="2"/>
  <polyline points="102,124 145,124" fill="none" stroke="#1E1B18" stroke-width="1.8"/>
  <!-- Diode D1 -->
  <polygon points="145,40 145,56 162,48" fill="#A64B33" stroke="#1E1B18" stroke-width="1.4"/>
  <line x1="162" y1="40" x2="162" y2="56" stroke="#1E1B18" stroke-width="2"/>
  <text x="147" y="34" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#A64B33">D₁</text>
  <!-- Diode D2 -->
  <polygon points="145,116 145,132 162,124" fill="#1D4ED8" stroke="#1E1B18" stroke-width="1.4"/>
  <line x1="162" y1="116" x2="162" y2="132" stroke="#1E1B18" stroke-width="2"/>
  <text x="147" y="145" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#1D4ED8">D₂</text>
  <!-- Junction + Load R_L -->
  <polyline points="162,48 192,48 192,124 162,124" fill="none" stroke="#1E1B18" stroke-width="1.8"/>
  <line x1="192" y1="86" x2="215" y2="86" stroke="#1E1B18" stroke-width="1.8"/>
  <line x1="102" y1="86" x2="148" y2="86" stroke="#1E1B18" stroke-width="1.6"/>
  <rect x="148" y="77" width="38" height="18" rx="2" fill="#DCFCE7" stroke="#3D6B4F" stroke-width="1.8"/>
  <text x="159" y="90" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#3D6B4F">R_L</text>
  <polyline points="186,86 192,86" fill="none" stroke="#1E1B18" stroke-width="1.6"/>
  <text x="108" y="80" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="700" fill="#575048">Centre Tap C</text>
  <!-- Right Side: Waveforms -->
  <text x="242" y="22" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">Input AC &amp; Full-Wave Output</text>
  <line x1="242" y1="74" x2="402" y2="74" stroke="#575048" stroke-width="1.2"/>
  <path d="M 244 74 Q 264 42 284 74 T 324 74 T 364 74 T 400 74" fill="none" stroke="#1D4ED8" stroke-width="2"/>
  <text x="244" y="42" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="700" fill="#1D4ED8">Input AC</text>
  <!-- Output -->
  <line x1="242" y1="152" x2="402" y2="152" stroke="#575048" stroke-width="1.2"/>
  <path d="M 244 152 Q 264 118 284 152 Q 304 118 324 152 Q 344 118 364 152 Q 382 118 400 152" fill="#3D6B4F" fill-opacity="0.16" stroke="#3D6B4F" stroke-width="2.2"/>
  <text x="244" y="114" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="700" fill="#3D6B4F">Output DC Pulses (D₁, D₂, D₁, D₂)</text>
  <text x="18" y="192" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="600" fill="#1E1B18">Unidirectional current flows through R_L in BOTH half-cycles.</text>
  <text x="18" y="212" font-family="system-ui, Arial, sans-serif" font-size="10" fill="#575048">+Half: D₁ ON, D₂ OFF  |  −Half: D₂ ON, D₁ OFF</text>
</svg>`,

  'phy-ms-26': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 220" width="420" height="220" role="img" aria-label="Huygens geometric construction for plane wavefront AB refracting to CD across interface XY proving Snell law">
  <rect x="0" y="0" width="420" height="220" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <!-- Interface XY -->
  <line x1="25" y1="115" x2="395" y2="115" stroke="#1E1B18" stroke-width="2.2"/>
  <text x="365" y="106" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1E1B18">XY</text>
  <text x="24" y="34" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1D4ED8">Medium 1 (Rarer, n₁, v₁)</text>
  <text x="24" y="198" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#3D6B4F">Medium 2 (Denser, n₂, v₂ &lt; v₁)</text>
  <!-- Incident Rays A(110,115), B(210, 52) -->
  <line x1="65" y1="45" x2="110" y2="115" stroke="#1D4ED8" stroke-width="2"/>
  <line x1="165" y1="22" x2="275" y2="115" stroke="#1D4ED8" stroke-width="2"/>
  <!-- Incident Wavefront AB perpendicular to rays -->
  <line x1="110" y1="115" x2="210" y2="48" stroke="#A64B33" stroke-width="2.4"/>
  <!-- Secondary wavelet arc from A of radius v2*t -->
  <path d="M 110 176 A 61 61 0 0 0 162 148" fill="none" stroke="#3D6B4F" stroke-width="1.6" stroke-dasharray="4 3"/>
  <!-- Refracted Wavefront EC tangent from C(275,115) to E(150, 162) -->
  <line x1="150" y1="162" x2="275" y2="115" stroke="#3D6B4F" stroke-width="2.4"/>
  <!-- Refracted Rays -->
  <line x1="110" y1="115" x2="176" y2="200" stroke="#3D6B4F" stroke-width="2"/>
  <line x1="275" y1="115" x2="320" y2="195" stroke="#3D6B4F" stroke-width="2"/>
  <!-- Labels -->
  <text x="95" y="112" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">A</text>
  <text x="210" y="42" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">B</text>
  <text x="282" y="110" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">C</text>
  <text x="134" y="168" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#3D6B4F">D</text>
  <text x="234" y="72" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#A64B33">BC = v₁t</text>
  <text x="82" y="148" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#3D6B4F">AD = v₂t</text>
  <text x="155" y="109" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1E1B18">i</text>
  <text x="225" y="128" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1E1B18">r</text>
</svg>`,

  'phy-ms-32': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 210" width="420" height="210" role="img" aria-label="Refracting astronomical telescope in normal adjustment forming final image at infinity with F_o = F_e">
  <rect x="0" y="0" width="420" height="210" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <!-- Principal Axis -->
  <line x1="20" y1="105" x2="400" y2="105" stroke="#575048" stroke-width="1.3" stroke-dasharray="5 3"/>
  <!-- Objective Lens at x=95 (large aperture) -->
  <ellipse cx="95" cy="105" rx="9" ry="72" fill="#E0F2FE" fill-opacity="0.7" stroke="#1D4ED8" stroke-width="2"/>
  <text x="72" y="25" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1D4ED8">Objective (f_o)</text>
  <!-- Eyepiece Lens at x=305 (small aperture) -->
  <ellipse cx="305" cy="105" rx="7" ry="44" fill="#DCFCE7" fill-opacity="0.7" stroke="#3D6B4F" stroke-width="2"/>
  <text x="275" y="50" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#3D6B4F">Eyepiece (f_e)</text>
  <!-- Intermediate Real Image at F_o = F_e (x = 245) -->
  <line x1="245" y1="105" x2="245" y2="138" stroke="#A64B33" stroke-width="2.2"/>
  <polygon points="242,138 245,146 248,138" fill="#A64B33"/>
  <text x="215" y="96" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#A64B33">F_o = F_e</text>
  <!-- Parallel Entering Rays -->
  <line x1="25" y1="54" x2="95" y2="70" stroke="#A64B33" stroke-width="1.7"/>
  <line x1="25" y1="90" x2="95" y2="105" stroke="#A64B33" stroke-width="1.7"/>
  <line x1="25" y1="126" x2="95" y2="140" stroke="#A64B33" stroke-width="1.7"/>
  <!-- Converging through Image Tip (245, 146) to Eyepiece -->
  <line x1="95" y1="70" x2="245" y2="146" stroke="#A64B33" stroke-width="1.7"/>
  <line x1="95" y1="105" x2="245" y2="146" stroke="#A64B33" stroke-width="1.7"/>
  <line x1="95" y1="140" x2="245" y2="146" stroke="#A64B33" stroke-width="1.7"/>
  <!-- Exiting Parallel Rays to Eye at Infinity -->
  <line x1="245" y1="146" x2="305" y2="128" stroke="#3D6B4F" stroke-width="1.7"/>
  <line x1="305" y1="128" x2="392" y2="78" stroke="#3D6B4F" stroke-width="1.7"/>
  <line x1="305" y1="105" x2="392" y2="55" stroke="#3D6B4F" stroke-width="1.7"/>
  <text x="148" y="196" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1E1B18">Tube Length L = f_o + f_e = 126 cm  |  m = f_o / f_e = 20</text>
</svg>`,

  'phy-ms-33': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 220" width="420" height="220" role="img" aria-label="Series LCR phasor diagram and resonance current versus frequency curve">
  <rect x="0" y="0" width="420" height="220" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <!-- Left: Phasor Diagram -->
  <text x="18" y="22" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">Series LCR Phasor</text>
  <line x1="40" y1="115" x2="40" y2="38" stroke="#1D4ED8" stroke-width="2"/>
  <line x1="40" y1="115" x2="40" y2="172" stroke="#787066" stroke-width="2"/>
  <line x1="40" y1="115" x2="155" y2="115" stroke="#3D6B4F" stroke-width="2.2"/>
  <line x1="40" y1="115" x2="145" y2="58" stroke="#A64B33" stroke-width="2.5"/>
  <line x1="40" y1="58" x2="145" y2="58" stroke="#575048" stroke-width="1.2" stroke-dasharray="3 3"/>
  <line x1="145" y1="58" x2="145" y2="115" stroke="#575048" stroke-width="1.2" stroke-dasharray="3 3"/>
  <text x="16" y="42" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#1D4ED8">V_L</text>
  <text x="46" y="64" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="700" fill="#1D4ED8">V_L − V_C</text>
  <text x="16" y="176" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#787066">V_C</text>
  <text x="128" y="129" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#3D6B4F">V_R, I</text>
  <text x="102" y="54" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">V_m</text>
  <text x="78" y="109" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#1E1B18">φ</text>
  <!-- Right: Resonance Curve -->
  <text x="235" y="22" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">Resonance Curve (I_m vs f)</text>
  <line x1="230" y1="36" x2="230" y2="175" stroke="#1E1B18" stroke-width="1.6"/>
  <line x1="230" y1="175" x2="400" y2="175" stroke="#1E1B18" stroke-width="1.6"/>
  <path d="M 235 170 Q 280 162, 305 54 Q 330 162, 385 170" fill="none" stroke="#A64B33" stroke-width="2.5"/>
  <line x1="305" y1="54" x2="305" y2="175" stroke="#A64B33" stroke-width="1.3" stroke-dasharray="4 3"/>
  <circle cx="305" cy="54" r="3.5" fill="#A64B33"/>
  <text x="292" y="191" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">f₀ = 159.15 Hz</text>
  <text x="312" y="58" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#A64B33">I_max (X_L = X_C)</text>
  <text x="18" y="205" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#575048">Z = √(R² + (X_L − X_C)²)  |  Z_min = R at f₀</text>
</svg>`,

  // ================= CHEMISTRY MARKING SCHEME DIAGRAMS (3) =================
  'chem-ms-25': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 220" width="420" height="220" role="img" aria-label="Octahedral trans isomer (achiral) and optically active cis d/l mirror-image enantiomer pair of [CoCl2(en)2]+">
  <rect x="0" y="0" width="420" height="220" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <!-- 1. Trans Isomer (Optically Inactive) -->
  <text x="20" y="22" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#575048">trans-[CoCl₂(en)₂]⁺ (Inactive)</text>
  <circle cx="75" cy="110" r="11" fill="#E0E7FF" stroke="#1D4ED8" stroke-width="1.6"/>
  <text x="68" y="114" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#1E1B18">Co</text>
  <line x1="75" y1="62" x2="75" y2="99" stroke="#1E1B18" stroke-width="1.6"/>
  <line x1="75" y1="121" x2="75" y2="158" stroke="#1E1B18" stroke-width="1.6"/>
  <text x="69" y="55" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">Cl</text>
  <text x="69" y="172" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">Cl</text>
  <!-- Equatorial en rings -->
  <path d="M 42 88 L 65 104 M 42 132 L 65 116" stroke="#1E1B18" stroke-width="1.5"/>
  <path d="M 40 88 Q 22 110 40 132" fill="none" stroke="#3D6B4F" stroke-width="2"/>
  <text x="18" y="113" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="700" fill="#3D6B4F">en</text>
  <path d="M 108 88 L 85 104 M 108 132 L 85 116" stroke="#1E1B18" stroke-width="1.5"/>
  <path d="M 110 88 Q 128 110 110 132" fill="none" stroke="#3D6B4F" stroke-width="2"/>
  <text x="122" y="113" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="700" fill="#3D6B4F">en</text>

  <!-- Divider + cis d/l enantiomer pair -->
  <line x1="158" y1="18" x2="158" y2="205" stroke="#DDD6C7" stroke-width="1.4"/>
  <text x="186" y="22" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1D4ED8">cis d/l Enantiomers (Optically Active Pair)</text>
  <!-- Left cis (d) -->
  <circle cx="218" cy="110" r="10" fill="#E0E7FF" stroke="#1D4ED8" stroke-width="1.6"/>
  <text x="211" y="114" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="700" fill="#1E1B18">Co</text>
  <line x1="218" y1="64" x2="218" y2="100" stroke="#1E1B18" stroke-width="1.5"/>
  <line x1="228" y1="104" x2="256" y2="90" stroke="#1E1B18" stroke-width="1.5"/>
  <text x="212" y="57" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#A64B33">Cl</text>
  <text x="259" y="92" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#A64B33">Cl</text>
  <path d="M 218 120 L 218 156 M 227 116 L 254 134" stroke="#1E1B18" stroke-width="1.5"/>
  <path d="M 218 156 Q 245 162 254 134" fill="none" stroke="#3D6B4F" stroke-width="2"/>
  <path d="M 185 88 L 208 104 M 185 132 L 208 116" stroke="#1E1B18" stroke-width="1.5"/>
  <path d="M 184 88 Q 168 110 184 132" fill="none" stroke="#3D6B4F" stroke-width="2"/>
  <text x="195" y="192" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#1E1B18">d-isomer (+)</text>

  <!-- Mirror -->
  <line x1="286" y1="44" x2="286" y2="178" stroke="#575048" stroke-width="1.6" stroke-dasharray="5 3"/>

  <!-- Right cis (l) -->
  <circle cx="354" cy="110" r="10" fill="#E0E7FF" stroke="#1D4ED8" stroke-width="1.6"/>
  <text x="347" y="114" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="700" fill="#1E1B18">Co</text>
  <line x1="354" y1="64" x2="354" y2="100" stroke="#1E1B18" stroke-width="1.5"/>
  <line x1="344" y1="104" x2="316" y2="90" stroke="#1E1B18" stroke-width="1.5"/>
  <text x="348" y="57" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#A64B33">Cl</text>
  <text x="302" y="92" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#A64B33">Cl</text>
  <path d="M 354 120 L 354 156 M 345 116 L 318 134" stroke="#1E1B18" stroke-width="1.5"/>
  <path d="M 354 156 Q 327 162 318 134" fill="none" stroke="#3D6B4F" stroke-width="2"/>
  <path d="M 387 88 L 364 104 M 387 132 L 364 116" stroke="#1E1B18" stroke-width="1.5"/>
  <path d="M 388 88 Q 404 110 388 132" fill="none" stroke="#3D6B4F" stroke-width="2"/>
  <text x="328" y="192" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#1E1B18">l-isomer (−)</text>
</svg>`,

  'chem-ms-32': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 225" width="420" height="225" role="img" aria-label="Crystal Field Splitting energy level diagram for an octahedral complex showing t2g and eg orbitals with Delta_o and d4 spin states">
  <rect x="0" y="0" width="420" height="225" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <text x="16" y="22" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">Octahedral Crystal Field Splitting (Δ₀) &amp; d⁴ States</text>
  <!-- Free Ion 5 degenerate orbitals -->
  <line x1="25" y1="108" x2="105" y2="108" stroke="#1E1B18" stroke-width="2"/>
  <text x="25" y="126" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="600" fill="#575048">5 Degenerate d</text>
  <!-- Barycentre -->
  <line x1="105" y1="108" x2="292" y2="108" stroke="#575048" stroke-width="1.3" stroke-dasharray="4 3"/>
  <text x="135" y="102" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="600" fill="#575048">Barycentre (E = 0)</text>
  <!-- Split to e_g (+0.6 Delta_o) and t_2g (-0.4 Delta_o) -->
  <line x1="105" y1="108" x2="195" y2="55" stroke="#575048" stroke-width="1.2" stroke-dasharray="3 3"/>
  <line x1="105" y1="108" x2="195" y2="152" stroke="#575048" stroke-width="1.2" stroke-dasharray="3 3"/>
  <!-- e_g level -->
  <line x1="195" y1="55" x2="275" y2="55" stroke="#A64B33" stroke-width="2.6"/>
  <text x="198" y="45" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#A64B33">e_g (+0.6 Δ₀)</text>
  <!-- t_2g level -->
  <line x1="195" y1="152" x2="275" y2="152" stroke="#1D4ED8" stroke-width="2.6"/>
  <text x="195" y="170" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1D4ED8">t₂g (−0.4 Δ₀)</text>
  <!-- Total Delta_o Arrow -->
  <line x1="285" y1="55" x2="285" y2="152" stroke="#1E1B18" stroke-width="1.6"/>
  <text x="292" y="108" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">Δ₀</text>
  <!-- d4 Configurations Box -->
  <rect x="315" y="42" width="92" height="145" rx="6" fill="#FFFFFF" stroke="#DDD6C7" stroke-width="1.4"/>
  <text x="323" y="60" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="700" fill="#3D6B4F">d⁴ (Δ₀ &gt; P):</text>
  <text x="323" y="76" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#1E1B18">t₂g⁴ e_g⁰</text>
  <text x="323" y="92" font-family="system-ui, Arial, sans-serif" font-size="9.5" fill="#575048">CFSE: −1.6Δ₀+P</text>
  <line x1="322" y1="108" x2="400" y2="108" stroke="#DDD6C7" stroke-width="1"/>
  <text x="323" y="128" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="700" fill="#A64B33">d⁴ (Δ₀ &lt; P):</text>
  <text x="323" y="144" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#1E1B18">t₂g³ e_g¹</text>
  <text x="323" y="160" font-family="system-ui, Arial, sans-serif" font-size="9.5" fill="#575048">CFSE: −0.6 Δ₀</text>
  <text x="16" y="206" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="600" fill="#575048">μ([Fe(CN)₆]⁴⁻) = 0 BM (n=0)  |  μ([FeF₆]³⁻) = √35 ≈ 5.92 BM (n=5)</text>
</svg>`,

  'chem-ms-33': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 225" width="420" height="225" role="img" aria-label="Labeled Galvanic Cell Mg/Mg2+ || Cu2+/Cu with salt bridge, anode oxidation, cathode reduction, and electron flow">
  <rect x="0" y="0" width="420" height="225" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <!-- Left Beaker Anode -->
  <polyline points="40,95 40,188 158,188 158,95" fill="none" stroke="#1E1B18" stroke-width="2"/>
  <rect x="42" y="118" width="114" height="68" fill="#E5E7EB" fill-opacity="0.7"/>
  <rect x="68" y="64" width="18" height="106" fill="#9CA3AF" stroke="#1E1B18" stroke-width="1.6"/>
  <text x="48" y="54" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">Anode (−): Mg</text>
  <text x="46" y="182" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="700" fill="#1E1B18">Mg → Mg²⁺ + 2e⁻</text>
  <!-- Right Beaker Cathode -->
  <polyline points="262,95 262,188 380,188 380,95" fill="none" stroke="#1E1B18" stroke-width="2"/>
  <rect x="264" y="118" width="114" height="68" fill="#DBEAFE" fill-opacity="0.7"/>
  <rect x="334" y="64" width="18" height="106" fill="#C26D4A" stroke="#1E1B18" stroke-width="1.6"/>
  <text x="292" y="54" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1D4ED8">Cathode (+): Cu</text>
  <text x="272" y="182" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="700" fill="#1D4ED8">Cu²⁺ + 2e⁻ → Cu</text>
  <!-- Salt Bridge -->
  <path d="M 135 148 L 135 88 Q 135 74 150 74 L 270 74 Q 285 74 285 88 L 285 148" fill="none" stroke="#575048" stroke-width="11" stroke-linecap="round" opacity="0.28"/>
  <path d="M 135 148 L 135 88 Q 135 74 150 74 L 270 74 Q 285 74 285 88 L 285 148" fill="none" stroke="#575048" stroke-width="1.6"/>
  <text x="172" y="95" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="700" fill="#575048">Salt Bridge (KCl)</text>
  <!-- Voltmeter & Wires -->
  <polyline points="77,64 77,26 192,26" fill="none" stroke="#1E1B18" stroke-width="1.8"/>
  <polyline points="228,26 343,26 343,64" fill="none" stroke="#1E1B18" stroke-width="1.8"/>
  <circle cx="210" cy="26" r="14" fill="#FAF8F3" stroke="#1E1B18" stroke-width="2"/>
  <text x="205" y="30" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">V</text>
  <text x="115" y="18" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#3D6B4F">e⁻ flow →</text>
  <text x="245" y="18" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#1E1B18">E° = +2.70 V</text>
  <text x="72" y="212" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#3D6B4F">E_cell = 2.67 V  |  Δ_r G° = −521.1 kJ mol⁻¹</text>
</svg>`,

  // ================= BIOLOGY MARKING SCHEME DIAGRAMS (8) =================
  'bio-ms-20': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 225" width="420" height="225" role="img" aria-label="Labeled Y-shaped immunoglobulin H2L2 antibody structure showing heavy chains, light chains, disulphide bridges, and antigen-binding sites">
  <rect x="0" y="0" width="420" height="225" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <!-- Heavy Chains (Y shape) -->
  <polyline points="198,200 198,118 135,54" fill="none" stroke="#1D4ED8" stroke-width="6" stroke-linecap="round"/>
  <polyline points="222,200 222,118 285,54" fill="none" stroke="#1D4ED8" stroke-width="6" stroke-linecap="round"/>
  <!-- Variable N-terminal heavy tips -->
  <line x1="150" y1="69" x2="135" y2="54" stroke="#A64B33" stroke-width="6" stroke-linecap="round"/>
  <line x1="270" y1="69" x2="285" y2="54" stroke="#A64B33" stroke-width="6" stroke-linecap="round"/>
  <!-- Light Chains -->
  <line x1="115" y1="74" x2="154" y2="112" stroke="#3D6B4F" stroke-width="5" stroke-linecap="round"/>
  <line x1="130" y1="89" x2="115" y2="74" stroke="#A64B33" stroke-width="5" stroke-linecap="round"/>
  <line x1="305" y1="74" x2="266" y2="112" stroke="#3D6B4F" stroke-width="5" stroke-linecap="round"/>
  <line x1="290" y1="89" x2="305" y2="74" stroke="#A64B33" stroke-width="5" stroke-linecap="round"/>
  <!-- Disulphide Bridges (-S-S-) -->
  <line x1="198" y1="128" x2="222" y2="128" stroke="#A64B33" stroke-width="2"/>
  <line x1="198" y1="142" x2="222" y2="142" stroke="#A64B33" stroke-width="2"/>
  <line x1="154" y1="102" x2="174" y2="92" stroke="#A64B33" stroke-width="1.8"/>
  <line x1="266" y1="102" x2="246" y2="92" stroke="#A64B33" stroke-width="1.8"/>
  <!-- Leader labels -->
  <text x="16" y="42" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">Antigen-Binding Site (Fab)</text>
  <line x1="118" y1="47" x2="130" y2="59" stroke="#A64B33" stroke-width="1.3"/>
  <text x="16" y="108" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#3D6B4F">Light Chain (L)</text>
  <line x1="94" y1="104" x2="132" y2="95" stroke="#3D6B4F" stroke-width="1.3"/>
  <text x="278" y="142" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1D4ED8">Heavy Chain (H)</text>
  <line x1="274" y1="140" x2="225" y2="152" stroke="#1D4ED8" stroke-width="1.3"/>
  <text x="278" y="114" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#A64B33">−S−S− Bridges</text>
  <text x="278" y="192" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="600" fill="#575048">H₂L₂ (Humoral Immunity)</text>
</svg>`,

  'bio-ms-21': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 225" width="420" height="225" role="img" aria-label="Labeled exponential J-curve dN/dt = rN and logistic S-curve dN/dt = rN(K-N)/K with carrying capacity K">
  <rect x="0" y="0" width="420" height="225" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <line x1="60" y1="24" x2="60" y2="184" stroke="#1E1B18" stroke-width="1.8"/>
  <line x1="60" y1="184" x2="388" y2="184" stroke="#1E1B18" stroke-width="1.8"/>
  <line x1="60" y1="62" x2="384" y2="62" stroke="#575048" stroke-width="1.5" stroke-dasharray="6 4"/>
  <text x="42" y="66" font-family="system-ui, Arial, sans-serif" font-size="12" font-weight="700" fill="#575048">K</text>
  <!-- Curve A: J-shaped -->
  <path d="M 62 178 Q 132 166, 178 112 T 218 28" fill="none" stroke="#A64B33" stroke-width="2.6"/>
  <text x="224" y="34" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">Curve A: dN/dt = rN (Exponential)</text>
  <!-- Curve B: S-shaped -->
  <path d="M 62 178 C 128 175, 172 122, 218 88 C 258 64, 310 63, 376 63" fill="none" stroke="#3D6B4F" stroke-width="2.6"/>
  <text x="225" y="96" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#3D6B4F">Curve B: dN/dt = rN((K−N)/K)</text>
  <text x="225" y="112" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="600" fill="#3D6B4F">Verhulst–Pearl Logistic Growth</text>
  <text x="242" y="54" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="700" fill="#575048">Carrying Capacity (K)</text>
  <text x="180" y="208" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">Time (t) →</text>
  <text x="18" y="140" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1E1B18" transform="rotate(-90 18 140)">Population (N) →</text>
</svg>`,

  'bio-ms-22': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 190" width="420" height="190" role="img" aria-label="Labeled mature human sperm diagram showing Head, Acrosome, Nucleus, Neck, Middle piece with mitochondria, and Flagellar Tail">
  <rect x="0" y="0" width="420" height="190" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <!-- Head Outline (horizontal from left to right) -->
  <path d="M 38 95 C 38 66, 98 66, 122 82 L 138 85 L 222 85 L 222 105 L 138 105 L 122 108 C 98 124, 38 124, 38 95 Z" fill="#F2ECE0" stroke="#1E1B18" stroke-width="2"/>
  <!-- Acrosome Cap -->
  <path d="M 39 95 C 39 74, 65 72, 74 82 Q 66 95 74 108 C 65 118, 39 116, 39 95 Z" fill="#FDE68A" stroke="#A64B33" stroke-width="1.6"/>
  <!-- Nucleus -->
  <ellipse cx="95" cy="95" rx="20" ry="12" fill="#BFDBFE" stroke="#1D4ED8" stroke-width="1.6"/>
  <!-- Spiral Mitochondria in Middle Piece -->
  <path d="M 148 88 L 156 102 L 166 88 L 176 102 L 186 88 L 196 102 L 206 88 L 216 102" fill="none" stroke="#A64B33" stroke-width="2.2"/>
  <!-- Flagellar Tail -->
  <path d="M 222 95 Q 268 78, 310 95 T 395 95" fill="none" stroke="#1E1B18" stroke-width="3" stroke-linecap="round"/>
  <!-- Labels & Leader lines -->
  <text x="20" y="34" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">Acrosome</text>
  <line x1="48" y1="39" x2="54" y2="76" stroke="#A64B33" stroke-width="1.3"/>
  <text x="90" y="34" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1D4ED8">Nucleus (n)</text>
  <line x1="102" y1="39" x2="96" y2="82" stroke="#1D4ED8" stroke-width="1.3"/>
  <text x="155" y="48" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#3D6B4F">Middle Piece (Mitochondria)</text>
  <line x1="184" y1="53" x2="180" y2="84" stroke="#3D6B4F" stroke-width="1.3"/>
  <text x="315" y="64" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1E1B18">Flagellar Tail</text>
  <line x1="335" y1="69" x2="328" y2="96" stroke="#1E1B18" stroke-width="1.3"/>
  <text x="64" y="152" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#575048">Head</text>
  <text x="115" y="152" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#575048">Neck</text>
  <text x="166" y="152" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#575048">ATP Energy</text>
  <text x="285" y="152" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#575048">Motility</text>
</svg>`,

  'bio-ms-23': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 220" width="420" height="220" role="img" aria-label="Three thermal steps of Polymerase Chain Reaction: Denaturation 94C, Annealing 55C, and Extension 72C with Taq polymerase">
  <rect x="0" y="0" width="420" height="220" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <text x="18" y="22" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1E1B18">Polymerase Chain Reaction (PCR) — 1 Cycle Doubles DNA (2³ = 8 after 3 cycles)</text>
  <!-- Step 1: Denaturation -->
  <rect x="16" y="38" width="118" height="145" rx="8" fill="#FEE2E2" fill-opacity="0.55" stroke="#A64B33" stroke-width="1.6"/>
  <text x="24" y="56" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">1. Denaturation</text>
  <text x="24" y="72" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#1E1B18">94–95 °C (Heat)</text>
  <line x1="28" y1="98" x2="122" y2="98" stroke="#1E1B18" stroke-width="2.4"/>
  <line x1="28" y1="132" x2="122" y2="132" stroke="#1E1B18" stroke-width="2.4"/>
  <text x="30" y="164" font-family="system-ui, Arial, sans-serif" font-size="9.5" fill="#575048">H-bonds break</text>
  <!-- Step 2: Annealing -->
  <rect x="150" y="38" width="118" height="145" rx="8" fill="#E0F2FE" fill-opacity="0.55" stroke="#1D4ED8" stroke-width="1.6"/>
  <text x="162" y="56" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1D4ED8">2. Annealing</text>
  <text x="162" y="72" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#1E1B18">~50–60 °C</text>
  <line x1="162" y1="98" x2="256" y2="98" stroke="#1E1B18" stroke-width="2.4"/>
  <line x1="162" y1="106" x2="190" y2="106" stroke="#A64B33" stroke-width="3"/>
  <line x1="162" y1="138" x2="256" y2="138" stroke="#1E1B18" stroke-width="2.4"/>
  <line x1="228" y1="130" x2="256" y2="130" stroke="#A64B33" stroke-width="3"/>
  <text x="164" y="164" font-family="system-ui, Arial, sans-serif" font-size="9.5" fill="#1D4ED8">Primers bind 3′</text>
  <!-- Step 3: Extension -->
  <rect x="284" y="38" width="120" height="145" rx="8" fill="#DCFCE7" fill-opacity="0.55" stroke="#3D6B4F" stroke-width="1.6"/>
  <text x="294" y="56" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#3D6B4F">3. Extension</text>
  <text x="294" y="72" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#1E1B18">72 °C (Taq Pol)</text>
  <line x1="296" y1="98" x2="390" y2="98" stroke="#1E1B18" stroke-width="2.4"/>
  <line x1="296" y1="106" x2="390" y2="106" stroke="#3D6B4F" stroke-width="2.4"/>
  <line x1="296" y1="138" x2="390" y2="138" stroke="#1E1B18" stroke-width="2.4"/>
  <line x1="296" y1="130" x2="390" y2="130" stroke="#3D6B4F" stroke-width="2.4"/>
  <text x="294" y="164" font-family="system-ui, Arial, sans-serif" font-size="9.5" fill="#3D6B4F">2 dsDNA copies</text>
  <text x="18" y="205" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="600" fill="#575048">Taq polymerase from Thermus aquaticus stays active at high denaturation temperatures.</text>
</svg>`,

  'bio-ms-25': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 225" width="420" height="225" role="img" aria-label="Circular map of cloning vector pBR322 showing ori, rop, ampR, tetR, and BamHI sites">
  <rect x="0" y="0" width="420" height="225" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <!-- Outer Plasmid Ring -->
  <circle cx="210" cy="116" r="70" fill="none" stroke="#1E1B18" stroke-width="4.5"/>
  <!-- Highlighted Arcs -->
  <path d="M 144 92 A 70 70 0 0 1 196 47" fill="none" stroke="#1D4ED8" stroke-width="9"/>
  <path d="M 252 60 A 70 70 0 0 1 278 134" fill="none" stroke="#A64B33" stroke-width="9"/>
  <path d="M 190 183 A 70 70 0 0 1 232 183" fill="none" stroke="#3D6B4F" stroke-width="9"/>
  <path d="M 244 178 A 70 70 0 0 1 264 160" fill="none" stroke="#D97706" stroke-width="9"/>
  <text x="186" y="120" font-family="system-ui, Arial, sans-serif" font-size="13" font-weight="700" fill="#1E1B18">pBR322</text>
  <!-- Labels -->
  <text x="86" y="64" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1D4ED8">amp^R (PstI, PvuI)</text>
  <text x="282" y="62" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#A64B33">tet^R</text>
  <text x="292" y="88" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">← BamHI (Insert site)</text>
  <text x="292" y="114" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="600" fill="#575048">← SalI</text>
  <text x="200" y="34" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#1E1B18">EcoRI · ClaI · HindIII</text>
  <text x="195" y="206" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#3D6B4F">ori</text>
  <text x="268" y="182" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#B45309">rop (PvuII)</text>
</svg>`,

  'bio-ms-26': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 225" width="420" height="225" role="img" aria-label="Lac operon regulation in OFF state without lactose and ON state with lactose inducer">
  <rect x="0" y="0" width="420" height="225" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <!-- Top: OFF State -->
  <text x="16" y="22" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">(A) Absence of Inducer (Lactose) → Operon OFF</text>
  <line x1="18" y1="54" x2="402" y2="54" stroke="#1E1B18" stroke-width="2"/>
  <rect x="26" y="42" width="32" height="24" fill="#E0E7FF" stroke="#1D4ED8"/>
  <text x="39" y="58" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1D4ED8">i</text>
  <rect x="78" y="42" width="28" height="24" fill="#F3F4F6" stroke="#1E1B18"/>
  <text x="89" y="58" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700">p</text>
  <rect x="110" y="42" width="30" height="24" fill="#FEE2E2" stroke="#A64B33"/>
  <text x="121" y="58" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#A64B33">o</text>
  <rect x="152" y="42" width="180" height="24" fill="#F5F2EB" stroke="#787066"/>
  <text x="182" y="58" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#575048">z     |     y     |     a  (Blocked)</text>
  <circle cx="125" cy="84" r="11" fill="#FECACA" stroke="#A64B33" stroke-width="1.6"/>
  <text x="121" y="88" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#8C2318">R</text>
  <text x="145" y="88" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="600" fill="#A64B33">Active Repressor bound to Operator o</text>

  <!-- Bottom: ON State -->
  <line x1="18" y1="112" x2="402" y2="112" stroke="#DDD6C7" stroke-width="1.2"/>
  <text x="16" y="132" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#3D6B4F">(B) Presence of Inducer (Lactose) → Operon ON</text>
  <line x1="18" y1="164" x2="402" y2="164" stroke="#1E1B18" stroke-width="2"/>
  <rect x="26" y="152" width="32" height="24" fill="#E0E7FF" stroke="#1D4ED8"/>
  <text x="39" y="168" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#1D4ED8">i</text>
  <rect x="78" y="152" width="28" height="24" fill="#F3F4F6" stroke="#1E1B18"/>
  <text x="89" y="168" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700">p</text>
  <rect x="110" y="152" width="30" height="24" fill="#DCFCE7" stroke="#3D6B4F"/>
  <text x="121" y="168" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#3D6B4F">o</text>
  <rect x="152" y="152" width="180" height="24" fill="#BBF7D0" stroke="#3D6B4F"/>
  <text x="172" y="168" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1E3B29">z (β-gal) | y (perm) | a (trans)</text>
  <text x="58" y="202" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#3D6B4F">Lactose + R → Inactive Repressor (Polycistronic mRNA transcribed)</text>
</svg>`,

  'bio-ms-28': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 205" width="420" height="205" role="img" aria-label="Three ecological pyramids: Upright Pyramid of Energy, Inverted Marine Biomass Pyramid, and Spindle/Inverted Tree Number Pyramid">
  <rect x="0" y="0" width="420" height="205" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <!-- 1. Energy (Always Upright) -->
  <text x="20" y="24" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#3D6B4F">Energy (Always Upright)</text>
  <rect x="64" y="45" width="32" height="22" fill="#DCFCE7" stroke="#3D6B4F"/>
  <text x="68" y="60" font-family="system-ui, Arial, sans-serif" font-size="9" font-weight="700">10 J</text>
  <rect x="48" y="72" width="64" height="22" fill="#BBF7D0" stroke="#3D6B4F"/>
  <text x="64" y="87" font-family="system-ui, Arial, sans-serif" font-size="9" font-weight="700">100 J</text>
  <rect x="32" y="99" width="96" height="22" fill="#86EFAC" stroke="#3D6B4F"/>
  <text x="60" y="114" font-family="system-ui, Arial, sans-serif" font-size="9" font-weight="700">1,000 J</text>
  <rect x="18" y="126" width="124" height="22" fill="#4ADE80" stroke="#3D6B4F"/>
  <text x="52" y="141" font-family="system-ui, Arial, sans-serif" font-size="9" font-weight="700">10,000 J (PP)</text>
  <text x="34" y="176" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="600" fill="#575048">10% Transfer Law</text>

  <!-- 2. Marine Biomass (Inverted) -->
  <text x="160" y="24" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1D4ED8">Marine Biomass (Inverted)</text>
  <rect x="168" y="60" width="110" height="32" fill="#BFDBFE" stroke="#1D4ED8"/>
  <text x="184" y="80" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="700">PC: 21 g/m²</text>
  <rect x="198" y="102" width="50" height="32" fill="#93C5FD" stroke="#1D4ED8"/>
  <text x="206" y="122" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="700">4 g/m²</text>
  <text x="180" y="176" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="600" fill="#575048">PP (Phytoplankton)</text>

  <!-- 3. Tree Number (Spindle/Inverted) -->
  <text x="304" y="24" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">Tree No. (Spindle)</text>
  <rect x="338" y="54" width="38" height="24" fill="#FED7AA" stroke="#A64B33"/>
  <text x="342" y="70" font-family="system-ui, Arial, sans-serif" font-size="8.5" font-weight="700">Birds</text>
  <rect x="308" y="84" width="98" height="26" fill="#FECACA" stroke="#A64B33"/>
  <text x="328" y="101" font-family="system-ui, Arial, sans-serif" font-size="9" font-weight="700">Insects (Many)</text>
  <rect x="344" y="116" width="26" height="24" fill="#D6D3D1" stroke="#575048"/>
  <text x="347" y="132" font-family="system-ui, Arial, sans-serif" font-size="8.5" font-weight="700">1 Tree</text>
  <text x="322" y="176" font-family="system-ui, Arial, sans-serif" font-size="9.5" font-weight="600" fill="#575048">Inverted Base</text>
</svg>`,

  'bio-ms-32': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 245" width="420" height="245" role="img" aria-label="Mature 7-celled, 8-nucleate angiosperm embryo sac showing chalazal antipodals, central cell polar nuclei, egg apparatus, and filiform apparatus">
  <rect x="0" y="0" width="420" height="245" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <!-- Outer Embryo Sac Wall (centered at x=165) -->
  <ellipse cx="165" cy="122" rx="68" ry="92" fill="#FEFCE8" stroke="#1E1B18" stroke-width="2.2"/>
  <text x="128" y="20" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1E1B18">Chalazal End</text>
  <text x="124" y="232" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">Micropylar End</text>
  <!-- 3 Antipodals at Top -->
  <circle cx="142" cy="48" r="10" fill="#DBEAFE" stroke="#1D4ED8" stroke-width="1.5"/>
  <circle cx="165" cy="44" r="10" fill="#DBEAFE" stroke="#1D4ED8" stroke-width="1.5"/>
  <circle cx="188" cy="48" r="10" fill="#DBEAFE" stroke="#1D4ED8" stroke-width="1.5"/>
  <!-- 2 Polar Nuclei in Central Cell -->
  <circle cx="155" cy="116" r="8" fill="#BBF7D0" stroke="#3D6B4F" stroke-width="1.6"/>
  <circle cx="175" cy="116" r="8" fill="#BBF7D0" stroke="#3D6B4F" stroke-width="1.6"/>
  <!-- Egg Apparatus at Bottom -->
  <circle cx="165" cy="176" r="12" fill="#FECACA" stroke="#A64B33" stroke-width="1.8"/>
  <circle cx="140" cy="192" r="11" fill="#FDE68A" stroke="#B45309" stroke-width="1.6"/>
  <circle cx="190" cy="192" r="11" fill="#FDE68A" stroke="#B45309" stroke-width="1.6"/>
  <!-- Filiform Apparatus spikes inside synergids -->
  <path d="M 136 200 L 140 194 L 144 200 M 186 200 L 190 194 L 194 200" fill="none" stroke="#1E1B18" stroke-width="1.3"/>
  <!-- Leader Lines Right -->
  <line x1="198" y1="48" x2="255" y2="48" stroke="#1D4ED8" stroke-width="1.4"/>
  <text x="260" y="52" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1D4ED8">3 Antipodal Cells (n)</text>
  <line x1="184" y1="116" x2="255" y2="112" stroke="#3D6B4F" stroke-width="1.4"/>
  <text x="260" y="109" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#3D6B4F">2 Polar Nuclei (n + n)</text>
  <text x="260" y="124" font-family="system-ui, Arial, sans-serif" font-size="9.5" fill="#575048">inside Central Cell</text>
  <line x1="177" y1="174" x2="255" y2="164" stroke="#A64B33" stroke-width="1.4"/>
  <text x="260" y="168" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">Egg Cell (n → 2n Zygote)</text>
  <line x1="201" y1="192" x2="255" y2="196" stroke="#B45309" stroke-width="1.4"/>
  <text x="260" y="198" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#B45309">2 Synergids + Filiform App.</text>
</svg>`,

  // ================= MATHEMATICS MARKING SCHEME DIAGRAMS (2) =================
  'math-ms-31': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 245" width="400" height="245" role="img" aria-label="Graphical solution of Linear Programming problem minimizing Z = 300x + 400y with unbounded feasible region and corners A(0,6), B(4/3,10/3), C(8,0)">
  <rect x="0" y="0" width="400" height="245" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <!-- Origin (55, 198); scale: 1 unit X = 32px, 1 unit Y = 22px -->
  <!-- Points: A(0,6)->(55,66), B(4/3,10/3)->(98,125), C(8,0)->(311,198), D(3,0)->(151,198), E(0,4)->(55,110) -->
  <!-- Unbounded Shaded Feasible Region above A->B->C -->
  <polygon points="55,24 385,24 385,198 311,198 98,125 55,66" fill="#3D6B4F" fill-opacity="0.18"/>
  <line x1="55" y1="20" x2="55" y2="215" stroke="#1E1B18" stroke-width="1.8"/>
  <line x1="35" y1="198" x2="388" y2="198" stroke="#1E1B18" stroke-width="1.8"/>
  <!-- Line 1: 2x + y = 6 from (0,6) to (3,0) -->
  <line x1="55" y1="66" x2="151" y2="198" stroke="#A64B33" stroke-width="2.2"/>
  <!-- Line 2: x + 2y = 8 from (0,4) to (8,0) -->
  <line x1="55" y1="110" x2="311" y2="198" stroke="#1D4ED8" stroke-width="2.2"/>
  <!-- Corner Dots -->
  <circle cx="55" cy="66" r="4" fill="#A64B33"/>
  <circle cx="98" cy="125" r="4.5" fill="#1E1B18"/>
  <circle cx="311" cy="198" r="4" fill="#1D4ED8"/>
  <text x="64" y="64" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">A(0, 6): Z=2400</text>
  <text x="108" y="122" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1E1B18">B(4/3, 10/3): Z_min = 5200/3</text>
  <text x="275" y="216" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1D4ED8">C(8, 0): Z=2400</text>
  <text x="192" y="68" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#3D6B4F">Unbounded Feasible Region</text>
</svg>`,

  'math-ms-34': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 245" width="400" height="245" role="img" aria-label="Area bounded by parabola y^2 = 4x and line 2x - y = 4 intersecting at (1, -2) and (4, 4) with horizontal strip dy">
  <rect x="0" y="0" width="400" height="245" rx="10" fill="#FAF8F3" stroke="#DDD6C7" stroke-width="1.5"/>
  <!-- Origin at (85, 145); scale: x unit = 45px, y unit = 25px -->
  <!-- (1,-2)->(130, 195); (0,0)->(85,145); (4,4)->(265,45); (2,0)->(175,145); (0,-4)->(85,245) -->
  <!-- Shaded region bounded by parabola and line -->
  <path d="M 130 195 Q 48 145, 265 45 L 130 195 Z" fill="#3D6B4F" fill-opacity="0.22" stroke="none"/>
  <!-- Axes -->
  <line x1="35" y1="145" x2="365" y2="145" stroke="#1E1B18" stroke-width="1.6"/>
  <line x1="85" y1="20" x2="85" y2="225" stroke="#1E1B18" stroke-width="1.6"/>
  <!-- Parabola y^2 = 4x (upper & lower branches) -->
  <path d="M 265 45 Q 85 95, 85 145 Q 85 195, 195 215" fill="none" stroke="#1D4ED8" stroke-width="2.4"/>
  <!-- Line 2x - y = 4 from (0.6,-2.8) to (4.5,5) -->
  <line x1="112" y1="215" x2="288" y2="20" stroke="#A64B33" stroke-width="2.4"/>
  <!-- Horizontal Strip dy -->
  <rect x="115" y="102" width="102" height="10" fill="#A64B33" fill-opacity="0.35" stroke="#A64B33" stroke-width="1.2"/>
  <!-- Intersection points -->
  <circle cx="130" cy="195" r="4" fill="#1E1B18"/>
  <circle cx="265" cy="45" r="4" fill="#1E1B18"/>
  <text x="142" y="202" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1E1B18">(1, −2)</text>
  <text x="274" y="48" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1E1B18">(4, 4)</text>
  <text x="285" y="112" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#A64B33">Line: x = (y+4)/2</text>
  <text x="285" y="132" font-family="system-ui, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#1D4ED8">Parabola: x = y²/4</text>
  <text x="165" y="96" font-family="system-ui, Arial, sans-serif" font-size="10" font-weight="700" fill="#A64B33">Strip dy</text>
  <text x="195" y="172" font-family="system-ui, Arial, sans-serif" font-size="11" font-weight="700" fill="#3D6B4F">Area = 9 sq. units</text>
</svg>`,
};
