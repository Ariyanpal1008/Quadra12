import type {DiagramMetadata} from '../v3Diagrams';

export const PHYSICS_V3_DIAGRAMS: Record<string, DiagramMetadata> = {
  'phy-v3-gauss-shell': {
    id: 'phy-v3-gauss-shell',
    subjectId: 'physics',
    title: 'Gauss’s Law: Spherical Shell Electric Field E vs Distance r',
    caption: 'Inside hollow conducting shell (r < R), q_enc = 0 so E = 0; at surface r = R, E_max = kQ/R²; outside (r > R), E drops as 1/r².',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Graph of electric field E versus radial distance r for a uniformly charged thin spherical shell of radius R">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <circle cx="95" cy="95" r="42" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="2.2" stroke-dasharray="4,2"/>
  <circle cx="95" cy="95" r="34" fill="#FFFFFF" stroke="#94A3B8" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="95" y="99" text-anchor="middle" font-family="monospace" font-size="11" font-weight="700" fill="#1E293B">E_in = 0</text>
  <text x="95" y="46" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1D4ED8">+Q Shell (R)</text>
  <line x1="185" y1="190" x2="412" y2="190" stroke="#1E293B" stroke-width="1.8"/>
  <line x1="185" y1="28" x2="185" y2="190" stroke="#1E293B" stroke-width="1.8"/>
  <line x1="255" y1="54" x2="255" y2="190" stroke="#A64B33" stroke-width="1.4" stroke-dasharray="4,3"/>
  <line x1="185" y1="189" x2="255" y2="189" stroke="#DC2626" stroke-width="3"/>
  <path d="M 255 54 Q 295 142 405 178" fill="none" stroke="#1D4ED8" stroke-width="2.6"/>
  <circle cx="255" cy="54" r="4" fill="#1D4ED8"/>
  <text x="166" y="42" font-family="sans-serif" font-size="11" font-weight="700" fill="#1E293B">E</text>
  <text x="385" y="206" font-family="sans-serif" font-size="11" font-weight="700" fill="#1E293B">r</text>
  <text x="247" y="206" font-family="monospace" font-size="10.5" font-weight="700" fill="#A64B33">r = R</text>
  <text x="264" y="56" font-family="monospace" font-size="10" font-weight="700" fill="#1D4ED8">kQ/R² = σ/ε₀</text>
  <text x="305" y="128" font-family="monospace" font-size="10.5" fill="#1D4ED8">E ∝ 1/r²</text>
  <text x="45" y="224" font-family="monospace" font-size="10" fill="#334155">Gauss Shell Flux: Φ = ∮ E·dA = Q_enc / ε₀</text>
</svg>`,
  },
  'phy-v3-dielectric-capacitor': {
    id: 'phy-v3-dielectric-capacitor',
    subjectId: 'physics',
    title: 'Parallel-Plate Capacitor with Partial Dielectric Slab (t &lt; d)',
    caption: 'Net potential drop V = E₀(d - t) + (E₀/K)t yields C = ε₀A / (d - t + t/K). Conductor limit K → ∞ gives ε₀A/(d - t).',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Parallel plate capacitor with thickness t dielectric slab of constant K inside plate separation d">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <rect x="84" y="36" width="12" height="146" fill="#DC2626" rx="2"/>
  <rect x="336" y="36" width="12" height="146" fill="#1D4ED8" rx="2"/>
  <text x="72" y="112" font-family="monospace" font-size="11" font-weight="700" fill="#DC2626">+σ</text>
  <text x="354" y="112" font-family="monospace" font-size="11" font-weight="700" fill="#1D4ED8">-σ</text>
  <rect x="165" y="42" width="105" height="134" fill="#FEF3C7" stroke="#D97706" stroke-width="2" rx="3"/>
  <text x="217" y="64" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#B45309">Dielectric (K)</text>
  <text x="217" y="114" text-anchor="middle" font-family="monospace" font-size="11" font-weight="700" fill="#B45309">E = E₀ / K</text>
  <line x1="104" y1="88" x2="156" y2="88" stroke="#0284C7" stroke-width="2"/>
  <polygon points="158,88 150,84 150,92" fill="#0284C7"/>
  <line x1="278" y1="88" x2="328" y2="88" stroke="#0284C7" stroke-width="2"/>
  <polygon points="330,88 322,84 322,92" fill="#0284C7"/>
  <text x="130" y="78" text-anchor="middle" font-family="monospace" font-size="10.5" fill="#0284C7">E₀</text>
  <text x="303" y="78" text-anchor="middle" font-family="monospace" font-size="10.5" fill="#0284C7">E₀</text>
  <line x1="165" y1="192" x2="270" y2="192" stroke="#D97706" stroke-width="1.5"/>
  <text x="217" y="205" text-anchor="middle" font-family="monospace" font-size="10.5" fill="#B45309">t</text>
  <line x1="90" y1="212" x2="342" y2="212" stroke="#1E293B" stroke-width="1.5"/>
  <text x="217" y="226" text-anchor="middle" font-family="monospace" font-size="10.5" font-weight="700" fill="#1E293B">d (Total separation) | C = ε₀A / (d - t + t/K)</text>
</svg>`,
  },
  'phy-v3-circular-loop-b': {
    id: 'phy-v3-circular-loop-b',
    subjectId: 'physics',
    title: 'Biot-Savart Axial Magnetic Field B(x) of Circular Loop',
    caption: 'Opposing transverse components dB cos θ cancel; axial components dB sin θ sum to B = μ₀IR² / [2(R²+x²)^(3/2)].',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Circular current loop of radius R and axial point P at distance x with Biot-Savart magnetic field vectors and axial B versus x profile">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <ellipse cx="105" cy="115" rx="22" ry="68" fill="none" stroke="#1E293B" stroke-width="2.6"/>
  <line x1="55" y1="115" x2="275" y2="115" stroke="#64748B" stroke-width="1.2" stroke-dasharray="4,3"/>
  <line x1="105" y1="47" x2="235" y2="115" stroke="#0284C7" stroke-width="1.8"/>
  <line x1="105" y1="183" x2="235" y2="115" stroke="#0284C7" stroke-width="1.8"/>
  <line x1="235" y1="115" x2="270" y2="75" stroke="#DC2626" stroke-width="2"/>
  <line x1="235" y1="115" x2="270" y2="155" stroke="#DC2626" stroke-width="2"/>
  <line x1="235" y1="115" x2="295" y2="115" stroke="#059669" stroke-width="2.8"/>
  <polygon points="298,115 289,110 289,120" fill="#059669"/>
  <circle cx="235" cy="115" r="3.5" fill="#1E293B"/>
  <text x="105" y="38" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1E293B">Loop (R, I)</text>
  <text x="168" y="74" font-family="monospace" font-size="10" fill="#0284C7">r = √(R²+x²)</text>
  <text x="275" y="78" font-family="monospace" font-size="10" fill="#DC2626">dB</text>
  <text x="272" y="106" font-family="monospace" font-size="10.5" font-weight="700" fill="#059669">Net B_x</text>
  <text x="168" y="130" font-family="monospace" font-size="10" fill="#475569">x</text>
  <line x1="305" y1="175" x2="425" y2="175" stroke="#1E293B" stroke-width="1.4"/>
  <line x1="365" y1="60" x2="365" y2="185" stroke="#1E293B" stroke-width="1.4"/>
  <path d="M 310 168 Q 345 162 365 76 Q 385 162 420 168" fill="none" stroke="#1D4ED8" stroke-width="2.2"/>
  <text x="365" y="52" text-anchor="middle" font-family="monospace" font-size="9.5" font-weight="700" fill="#1D4ED8">B_max = μ₀NI/(2R)</text>
  <text x="365" y="192" text-anchor="middle" font-family="monospace" font-size="9.5" fill="#475569">x = 0</text>
  <text x="45" y="222" font-family="monospace" font-size="10" fill="#334155">dB cos θ cancels; Σ dB sin θ sums cleanly along coil axis</text>
</svg>`,
  },
  'phy-v3-magnetic-materials': {
    id: 'phy-v3-magnetic-materials',
    subjectId: 'physics',
    title: 'Magnetic Susceptibility χ vs T &amp; Ferromagnetic B–H Loop',
    caption: 'Diamagnets have constant small negative χ; Paramagnets obey Curie Law χ = C/T; Ferromagnets trace non-linear retentivity/coercivity hysteresis.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Curie law susceptibility graph comparing diamagnet and paramagnet next to ferromagnetic B-H hysteresis loop">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <line x1="45" y1="138" x2="205" y2="138" stroke="#1E293B" stroke-width="1.6"/>
  <line x1="45" y1="36" x2="45" y2="176" stroke="#1E293B" stroke-width="1.6"/>
  <path d="M 55 44 Q 82 118 195 130" fill="none" stroke="#0284C7" stroke-width="2.4"/>
  <line x1="45" y1="158" x2="195" y2="158" stroke="#DC2626" stroke-width="2.2"/>
  <text x="115" y="64" font-family="sans-serif" font-size="10" font-weight="700" fill="#0284C7">Para (χ ∝ 1/T)</text>
  <text x="86" y="173" font-family="sans-serif" font-size="10" font-weight="700" fill="#DC2626">Dia (χ &lt; 0 const)</text>
  <text x="28" y="45" font-family="monospace" font-size="10.5" fill="#1E293B">χ</text>
  <text x="195" y="150" font-family="monospace" font-size="10" fill="#1E293B">T(K)</text>
  <line x1="245" y1="115" x2="415" y2="115" stroke="#1E293B" stroke-width="1.5"/>
  <line x1="330" y1="32" x2="330" y2="195" stroke="#1E293B" stroke-width="1.5"/>
  <path d="M 255 170 C 295 170, 290 60, 405 55 C 365 65, 370 165, 255 170 Z" fill="#EFF6FF" fill-opacity="0.55" stroke="#4338CA" stroke-width="2.2"/>
  <text x="336" y="42" font-family="monospace" font-size="10" font-weight="700" fill="#4338CA">B</text>
  <text x="410" y="128" font-family="monospace" font-size="10" font-weight="700" fill="#4338CA">H</text>
  <text x="336" y="75" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#A64B33">Retentivity</text>
  <text x="262" y="109" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#3D6B4F">Coercivity</text>
  <text x="65" y="222" font-family="monospace" font-size="10" fill="#334155">μᵣ = 1 + χ | Electromagnets use soft iron (thin loop, low loss)</text>
</svg>`,
  },
  'phy-v3-coaxial-solenoids': {
    id: 'phy-v3-coaxial-solenoids',
    subjectId: 'physics',
    title: 'Coaxial Solenoids Mutual Inductance &amp; Motional EMF Rail',
    caption: 'Outer coil S₂ creates uniform field B₂ = μ₀n₂I₂ solely over inner coil area πr₁², proving M = μ₀n₁n₂πr₁²l.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Long coaxial solenoids S1 inside S2 illustrating shared magnetic flux area pi r1 squared and mutual inductance M">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <rect x="65" y="38" width="310" height="118" rx="14" fill="#F8FAFC" stroke="#1E293B" stroke-width="2.4"/>
  <rect x="105" y="66" width="230" height="62" rx="8" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="2.4"/>
  <line x1="75" y1="97" x2="365" y2="97" stroke="#64748B" stroke-width="1" stroke-dasharray="5,4"/>
  <line x1="120" y1="84" x2="320" y2="84" stroke="#059669" stroke-width="1.8"/>
  <polygon points="322,84 314,80 314,88" fill="#059669"/>
  <line x1="120" y1="110" x2="320" y2="110" stroke="#059669" stroke-width="1.8"/>
  <polygon points="322,110 314,106 314,114" fill="#059669"/>
  <text x="220" y="54" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#1E293B">Outer Solenoid S₂ (radius r₂, turns/m n₂, current I₂)</text>
  <text x="220" y="101" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#1D4ED8">Inner Solenoid S₁ (radius r₁, area A₁ = πr₁²)</text>
  <text x="220" y="144" text-anchor="middle" font-family="monospace" font-size="10.5" fill="#059669">Uniform B₂ = μ₀ n₂ I₂</text>
  <text x="220" y="182" text-anchor="middle" font-family="monospace" font-size="11" font-weight="700" fill="#A64B33">M₁₂ = M₂₁ = μ₀ n₁ n₂ π r₁² l (uses INNER radius r₁!)</text>
  <text x="220" y="208" text-anchor="middle" font-family="monospace" font-size="10" fill="#334155">Motional EMF on sliding rod length l at speed v ⊥ B: ε = B l v</text>
</svg>`,
  },
  'phy-v3-em-wave-capacitor': {
    id: 'phy-v3-em-wave-capacitor',
    subjectId: 'physics',
    title: 'Transverse Electromagnetic Wave (E ⊥ B ⊥ k) &amp; Displacement Current',
    caption: 'Oscillating E along Y and B along Z stay in phase propagating along +X at c = E₀/B₀ = 1/√(μ₀ε₀).',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Transverse electromagnetic wave showing perpendicular electric field E along y and magnetic field B along z propagating along x">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <line x1="40" y1="118" x2="395" y2="118" stroke="#1E293B" stroke-width="1.8"/>
  <polygon points="398,118 390,114 390,122" fill="#1E293B"/>
  <line x1="65" y1="24" x2="65" y2="205" stroke="#1E293B" stroke-width="1.5"/>
  <line x1="65" y1="118" x2="25" y2="178" stroke="#64748B" stroke-width="1.4"/>
  <path d="M 65 118 Q 105 28 145 118 T 225 118 T 305 118 T 385 118" fill="none" stroke="#DC2626" stroke-width="2.4"/>
  <path d="M 65 118 Q 105 162 145 118 T 225 118 T 305 118 T 385 118" fill="none" stroke="#0284C7" stroke-width="2.2" stroke-dasharray="5,3"/>
  <line x1="105" y1="118" x2="105" y2="75" stroke="#DC2626" stroke-width="1.6"/>
  <line x1="185" y1="118" x2="185" y2="161" stroke="#DC2626" stroke-width="1.6"/>
  <text x="72" y="34" font-family="sans-serif" font-size="11" font-weight="700" fill="#DC2626">E_y (Electric)</text>
  <text x="16" y="192" font-family="sans-serif" font-size="11" font-weight="700" fill="#0284C7">B_z (Magnetic)</text>
  <text x="355" y="106" font-family="sans-serif" font-size="11" font-weight="700" fill="#1E293B">c (E⃗ × B⃗)</text>
  <text x="220" y="218" text-anchor="middle" font-family="monospace" font-size="10.5" font-weight="700" fill="#3D6B4F">I_d = ε₀(dΦ_E/dt) | c = E₀/B₀ = 1/√(μ₀ε₀)</text>
</svg>`,
  },
  'phy-v3-lens-prism-ray': {
    id: 'phy-v3-lens-prism-ray',
    subjectId: 'physics',
    title: 'Equiconvex Lens Refraction &amp; Prism Minimum Deviation δ vs i Curve',
    caption: 'Prism deviation reaches unique minimum δ_m when angle of incidence equals emergence (i = e) and internal ray travels parallel to base.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Ray path through prism at minimum deviation i equals e next to plot of deviation angle delta versus incidence angle i">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <polygon points="118,45 48,175 188,175" fill="#EFF6FF" stroke="#1E293B" stroke-width="2.2"/>
  <polyline points="26,142 86,105 150,105 210,142" fill="none" stroke="#DC2626" stroke-width="2.2"/>
  <line x1="86" y1="105" x2="155" y2="62" stroke="#94A3B8" stroke-width="1.2" stroke-dasharray="4,3"/>
  <text x="118" y="36" text-anchor="middle" font-family="monospace" font-size="11" font-weight="700" fill="#1E293B">A</text>
  <text x="118" y="98" text-anchor="middle" font-family="monospace" font-size="10" fill="#1D4ED8">r₁ = r₂ = A/2</text>
  <text x="38" y="128" font-family="monospace" font-size="10" fill="#DC2626">i</text>
  <text x="192" y="128" font-family="monospace" font-size="10" fill="#DC2626">e = i</text>
  <line x1="248" y1="185" x2="418" y2="185" stroke="#1E293B" stroke-width="1.6"/>
  <line x1="248" y1="36" x2="248" y2="185" stroke="#1E293B" stroke-width="1.6"/>
  <path d="M 270 55 Q 325 170 405 72" fill="none" stroke="#A64B33" stroke-width="2.4"/>
  <circle cx="328" cy="121" r="4" fill="#3D6B4F"/>
  <line x1="248" y1="121" x2="328" y2="121" stroke="#3D6B4F" stroke-width="1.3" stroke-dasharray="4,3"/>
  <text x="232" y="45" font-family="monospace" font-size="11" font-weight="700" fill="#1E293B">δ</text>
  <text x="255" y="116" font-family="monospace" font-size="10.5" font-weight="700" fill="#3D6B4F">δ_m</text>
  <text x="322" y="200" font-family="monospace" font-size="10" fill="#1E293B">i = e</text>
  <text x="396" y="200" font-family="monospace" font-size="10.5" fill="#1E293B">i</text>
  <text x="220" y="224" text-anchor="middle" font-family="monospace" font-size="10" fill="#334155">n = sin[(A+δ_m)/2] / sin(A/2) | 1/f = (n₂/n₁ - 1)(1/R₁ - 1/R₂)</text>
</svg>`,
  },
  'phy-v3-diffraction-intensity': {
    id: 'phy-v3-diffraction-intensity',
    subjectId: 'physics',
    title: 'Single-Slit Diffraction Intensity Profile vs YDSE Interference',
    caption: 'Diffraction central maximum is twice as wide (2λ/a) with rapidly falling secondary maxima; minima lie at θ = ±nλ/a.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Single slit diffraction intensity graph versus path angle showing tall central peak and smaller secondary maxima">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <line x1="35" y1="184" x2="405" y2="184" stroke="#1E293B" stroke-width="1.8"/>
  <line x1="220" y1="26" x2="220" y2="184" stroke="#1E293B" stroke-width="1.6"/>
  <path d="M 45 184 Q 70 172 95 184 Q 122 150 150 184 C 175 184, 194 38, 220 38 C 246 38, 265 184, 290 184 Q 318 150 345 184 Q 370 172 395 184" fill="#EFF6FF" fill-opacity="0.7" stroke="#1D4ED8" stroke-width="2.4"/>
  <text x="228" y="42" font-family="sans-serif" font-size="11" font-weight="700" fill="#1D4ED8">Central Max (I₀)</text>
  <text x="150" y="201" text-anchor="middle" font-family="monospace" font-size="10" fill="#A64B33">-λ/a</text>
  <text x="290" y="201" text-anchor="middle" font-family="monospace" font-size="10" fill="#A64B33">+λ/a</text>
  <text x="95" y="201" text-anchor="middle" font-family="monospace" font-size="10" fill="#64748B">-2λ/a</text>
  <text x="345" y="201" text-anchor="middle" font-family="monospace" font-size="10" fill="#64748B">+2λ/a</text>
  <line x1="150" y1="168" x2="290" y2="168" stroke="#059669" stroke-width="1.6"/>
  <text x="220" y="162" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#059669">Width = 2λD/a</text>
  <text x="220" y="224" text-anchor="middle" font-family="monospace" font-size="10" fill="#334155">Diffraction minima: a sin θ = nλ | YDSE maxima equal intensity (4I₀)</text>
</svg>`,
  },
  'phy-v3-bohr-levels': {
    id: 'phy-v3-bohr-levels',
    subjectId: 'physics',
    title: 'Hydrogen Bohr Energy Levels &amp; Lyman / Balmer / Paschen Series',
    caption: 'Bound electron energies E_n = -13.6/n² eV converge toward 0 eV ionization continuum as n → ∞.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Hydrogen atom energy level diagram showing E1 minus 13.6 eV up to E infinity 0 eV and Lyman, Balmer, Paschen transitions">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <line x1="65" y1="34" x2="365" y2="34" stroke="#64748B" stroke-width="1.4" stroke-dasharray="4,3"/>
  <line x1="65" y1="54" x2="365" y2="54" stroke="#1E293B" stroke-width="1.6"/>
  <line x1="65" y1="78" x2="365" y2="78" stroke="#1E293B" stroke-width="1.8"/>
  <line x1="65" y1="118" x2="365" y2="118" stroke="#1E293B" stroke-width="2"/>
  <line x1="65" y1="194" x2="365" y2="194" stroke="#1E293B" stroke-width="2.4"/>
  <text x="18" y="38" font-family="monospace" font-size="10" fill="#475569">n=∞  0 eV</text>
  <text x="18" y="58" font-family="monospace" font-size="10" fill="#1E293B">n=4 -0.85</text>
  <text x="18" y="82" font-family="monospace" font-size="10" fill="#1E293B">n=3 -1.51</text>
  <text x="18" y="122" font-family="monospace" font-size="10" fill="#1E293B">n=2 -3.40</text>
  <text x="14" y="198" font-family="monospace" font-size="10.5" font-weight="700" fill="#DC2626">n=1 -13.6</text>
  <line x1="120" y1="118" x2="120" y2="190" stroke="#7C3AED" stroke-width="2"/>
  <polygon points="120,193 116,185 124,185" fill="#7C3AED"/>
  <line x1="145" y1="78" x2="145" y2="190" stroke="#7C3AED" stroke-width="2"/>
  <polygon points="145,193 141,185 149,185" fill="#7C3AED"/>
  <text x="132" y="213" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="700" fill="#7C3AED">Lyman (UV)</text>
  <line x1="220" y1="78" x2="220" y2="114" stroke="#DC2626" stroke-width="2"/>
  <polygon points="220,117 216,109 224,109" fill="#DC2626"/>
  <line x1="245" y1="54" x2="245" y2="114" stroke="#0284C7" stroke-width="2"/>
  <polygon points="245,117 241,109 249,109" fill="#0284C7"/>
  <text x="232" y="136" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="700" fill="#DC2626">Balmer (Visible)</text>
  <line x1="320" y1="54" x2="320" y2="74" stroke="#D97706" stroke-width="2"/>
  <polygon points="320,77 316,69 324,69" fill="#D97706"/>
  <text x="322" y="96" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="700" fill="#D97706">Paschen (IR)</text>
  <text x="220" y="232" text-anchor="middle" font-family="monospace" font-size="10" fill="#334155">1/λ = R(1/n_f² - 1/n_i²) | r_n = 0.529 n²/Z Å</text>
</svg>`,
  },
};
