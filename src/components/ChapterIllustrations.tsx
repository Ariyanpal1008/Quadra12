import React from 'react';

interface ChapterIllustrationProps {
  chapterId: string;
  className?: string;
}

export function ChapterIllustration({
  chapterId,
  className = '',
}: ChapterIllustrationProps) {
  const wrap = (
    label: string,
    svgBody: React.ReactNode,
  ) => (
    <div
      className={`w-full h-full bg-[#ECE6D9] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB] flex items-center justify-center p-2.5 select-none ${className}`}
    >
      <svg
        viewBox="0 0 360 200"
        className="w-full h-full"
        role="img"
        aria-label={label}
      >
        {svgBody}
      </svg>
    </div>
  );

  switch (chapterId) {
    // =========================================================================
    // PHYSICS (14 Chapters)
    // =========================================================================
    case 'phy-1':
      return wrap(
        'Electric Charges and Fields: Electric dipole field lines and Gauss sphere',
        <>
          <circle cx="96" cy="96" r="14" className="fill-[#A64B33] dark:fill-[#D4785E]" />
          <text x="90" y="100" fontSize="11" fontWeight="700" className="fill-[#FAF8F3] dark:fill-[#1E1B18]">+q</text>
          <circle cx="264" cy="96" r="14" fill="currentColor" />
          <text x="257" y="100" fontSize="11" fontWeight="700" className="fill-[#FAF8F3] dark:fill-[#1E1B18]">−q</text>
          <line x1="112" y1="96" x2="246" y2="96" stroke="currentColor" strokeWidth="1.8" />
          <polygon points="186,96 176,91 176,101" fill="currentColor" />
          <path d="M 105 84 C 145 36, 215 36, 255 84" fill="none" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="1.8" />
          <path d="M 105 108 C 145 156, 215 156, 255 108" fill="none" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="1.8" />
          <path d="M 96 80 C 125 14, 235 14, 264 80" fill="none" stroke="currentColor" strokeWidth="1.3" strokeDasharray="4 3" />
          <circle cx="96" cy="96" r="44" fill="none" className="stroke-[#3D6B4F] dark:stroke-[#7AB88F]" strokeWidth="1.4" strokeDasharray="3 3" />
          <text x="116" y="178" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            Φ = ∮E·dA = q_in / ε₀
          </text>
        </>,
      );

    case 'phy-2':
      return wrap(
        'Electrostatic Potential and Capacitance: Parallel-plate capacitor with dielectric',
        <>
          <rect x="92" y="34" width="12" height="126" rx="2" className="fill-[#A64B33] dark:fill-[#D4785E]" />
          <rect x="256" y="34" width="12" height="126" rx="2" fill="currentColor" />
          <rect x="148" y="42" width="64" height="110" rx="3" className="fill-[#DFD7C6] dark:fill-[#332E28] stroke-[#787066]" strokeWidth="1.5" strokeDasharray="4 3" />
          <text x="174" y="102" fontSize="13" fontWeight="700" className="fill-[#575048] dark:fill-[#CBC3B6]">K</text>
          {[54, 78, 120, 144].map((y) => (
            <g key={y}>
              <line x1="112" y1={y} x2="244" y2={y} stroke="currentColor" strokeWidth="1.5" />
              <polygon points={`248,${y} 238,${y - 4} 238,${y + 4}`} fill="currentColor" />
            </g>
          ))}
          <line x1="40" y1="97" x2="92" y2="97" stroke="currentColor" strokeWidth="2" />
          <line x1="268" y1="97" x2="320" y2="97" stroke="currentColor" strokeWidth="2" />
          <text x="64" y="42" fontSize="11" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">+V</text>
          <text x="278" y="42" fontSize="11" fontWeight="700" fill="currentColor">0 V</text>
          <text x="108" y="180" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            C = Kε₀A / d · U = ½CV²
          </text>
        </>,
      );

    case 'phy-3':
      return wrap(
        'Current Electricity: Balanced Wheatstone bridge circuit',
        <>
          <line x1="65" y1="88" x2="180" y2="28" stroke="currentColor" strokeWidth="2" />
          <line x1="180" y1="28" x2="295" y2="88" stroke="currentColor" strokeWidth="2" />
          <line x1="65" y1="88" x2="180" y2="148" stroke="currentColor" strokeWidth="2" />
          <line x1="180" y1="148" x2="295" y2="88" stroke="currentColor" strokeWidth="2" />
          <line x1="180" y1="28" x2="180" y2="148" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="1.8" strokeDasharray="4 3" />
          <circle cx="180" cy="88" r="13" className="fill-[#FAF8F3] dark:fill-[#1E1B18] stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="1.8" />
          <text x="175" y="92" fontSize="11" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">G</text>
          {[
            [65, 88],
            [295, 88],
            [180, 28],
            [180, 148],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="4" fill="currentColor" />
          ))}
          <text x="105" y="48" fontSize="11" fontWeight="600" fill="currentColor">R₁</text>
          <text x="242" y="48" fontSize="11" fontWeight="600" fill="currentColor">R₂</text>
          <text x="105" y="136" fontSize="11" fontWeight="600" fill="currentColor">R₃</text>
          <text x="242" y="136" fontSize="11" fontWeight="600" fill="currentColor">R₄</text>
          <text x="100" y="178" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            R₁/R₂ = R₃/R₄ · I = neAv_d
          </text>
        </>,
      );

    case 'phy-4':
      return wrap(
        'Moving Charges and Magnetism: Circular current loop and axial magnetic field',
        <>
          <ellipse cx="135" cy="95" rx="28" ry="56" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <line x1="45" y1="95" x2="310" y2="95" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="1.8" strokeDasharray="5 3" />
          <polygon points="316,95 304,90 304,100" className="fill-[#A64B33] dark:fill-[#D4785E]" />
          <line x1="135" y1="95" x2="153" y2="54" stroke="currentColor" strokeWidth="1.6" />
          <text x="150" y="72" fontSize="10" fontWeight="600" fill="currentColor">R</text>
          <circle cx="235" cy="95" r="4" className="fill-[#A64B33] dark:fill-[#D4785E]" />
          <line x1="235" y1="95" x2="275" y2="95" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2.4" />
          <text x="255" y="84" fontSize="11" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">B⃗</text>
          <text x="86" y="42" fontSize="11" fontWeight="700" fill="currentColor">I</text>
          <text x="72" y="178" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            B = μ₀IR² / 2(R²+x²)³/² · F = q(v×B)
          </text>
        </>,
      );

    case 'phy-5':
      return wrap(
        'Magnetism and Matter: Bar magnet field lines',
        <>
          <rect x="115" y="78" width="65" height="32" className="fill-[#A64B33] dark:fill-[#D4785E]" />
          <rect x="180" y="78" width="65" height="32" fill="currentColor" />
          <text x="142" y="99" fontSize="12" fontWeight="700" className="fill-[#FAF8F3] dark:fill-[#1E1B18]">N</text>
          <text x="207" y="99" fontSize="12" fontWeight="700" className="fill-[#FAF8F3] dark:fill-[#1E1B18]">S</text>
          <path d="M 115 84 C 70 30, 290 30, 245 84" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M 115 104 C 70 158, 290 158, 245 104" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M 115 78 C 45 8, 315 8, 245 78" fill="none" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="1.4" strokeDasharray="4 3" />
          <polygon points="184,43 174,39 174,47" fill="currentColor" />
          <polygon points="184,145 174,141 174,149" fill="currentColor" />
          <text x="98" y="180" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            τ = m × B · ∮B·dA = 0
          </text>
        </>,
      );

    case 'phy-6':
      return wrap(
        'Electromagnetic Induction: Solenoid coil with moving magnet and Lenz Law',
        <>
          {[170, 192, 214, 236, 258].map((x) => (
            <ellipse key={x} cx={x} cy="92" rx="9" ry="38" fill="none" stroke="currentColor" strokeWidth="2.2" />
          ))}
          <rect x="46" y="79" width="52" height="26" className="fill-[#A64B33] dark:fill-[#D4785E]" />
          <text x="82" y="96" fontSize="11" fontWeight="700" className="fill-[#FAF8F3] dark:fill-[#1E1B18]">N</text>
          <text x="56" y="96" fontSize="11" fontWeight="700" className="fill-[#FAF8F3] dark:fill-[#1E1B18]">S</text>
          <line x1="106" y1="92" x2="146" y2="92" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2.2" />
          <polygon points="150,92 140,87 140,97" className="fill-[#A64B33] dark:fill-[#D4785E]" />
          <text x="115" y="82" fontSize="10" fontWeight="600" className="fill-[#A64B33] dark:fill-[#D4785E]">v⃗</text>
          <circle cx="288" cy="138" r="12" className="fill-[#FAF8F3] dark:fill-[#1E1B18]" stroke="currentColor" strokeWidth="1.6" />
          <text x="283" y="142" fontSize="10" fontWeight="700" fill="currentColor">G</text>
          <polyline points="170,130 170,138 276,138" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <polyline points="258,130 258,138 276,138" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <text x="92" y="178" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            ε = −dΦ_B / dt · ε = Blv
          </text>
        </>,
      );

    case 'phy-7':
      return wrap(
        'Alternating Current: Series LCR phasor diagram and resonance',
        <>
          <line x1="56" y1="100" x2="178" y2="100" stroke="currentColor" strokeWidth="1.8" />
          <line x1="90" y1="30" x2="90" y2="158" stroke="currentColor" strokeWidth="1.8" />
          <line x1="90" y1="100" x2="90" y2="42" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2.4" />
          <polygon points="90,36 86,46 94,46" className="fill-[#A64B33] dark:fill-[#D4785E]" />
          <text x="64" y="54" fontSize="10" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">V_L</text>
          <text x="150" y="114" fontSize="10" fontWeight="700" fill="currentColor">V_R</text>
          <line x1="90" y1="100" x2="156" y2="54" className="stroke-[#3D6B4F] dark:stroke-[#7AB88F]" strokeWidth="2" />
          <text x="158" y="54" fontSize="10" fontWeight="700" className="fill-[#3D6B4F] dark:fill-[#7AB88F]">V_net</text>
          {/* Resonance peak */}
          <line x1="205" y1="142" x2="328" y2="142" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 212 138 Q 252 132 266 44 Q 280 132 320 138" fill="none" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2.2" />
          <line x1="266" y1="44" x2="266" y2="142" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
          <text x="272" y="54" fontSize="9.5" fontWeight="700" fill="currentColor">f₀</text>
          <text x="72" y="180" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            Z = √(R²+(X_L−X_C)²) · f₀ = 1/(2π√LC)
          </text>
        </>,
      );

    case 'phy-8':
      return wrap(
        'Electromagnetic Waves: Orthogonal E and B transverse waves',
        <>
          <line x1="36" y1="100" x2="326" y2="100" stroke="currentColor" strokeWidth="1.6" />
          <polygon points="332,100 322,96 322,104" fill="currentColor" />
          <line x1="56" y1="24" x2="56" y2="162" stroke="currentColor" strokeWidth="1.4" />
          <path d="M 56 100 Q 90 32 124 100 T 192 100 T 260 100 T 320 100" fill="none" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2.4" />
          <path d="M 56 100 Q 90 138 124 100 T 192 100 T 260 100 T 320 100" fill="none" className="stroke-[#3D6B4F] dark:stroke-[#7AB88F]" strokeWidth="2" strokeDasharray="4 2" />
          <text x="90" y="42" fontSize="11" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">E⃗ (y)</text>
          <text x="86" y="148" fontSize="11" fontWeight="700" className="fill-[#3D6B4F] dark:fill-[#7AB88F]">B⃗ (z)</text>
          <text x="314" y="88" fontSize="10" fontWeight="700" fill="currentColor">c</text>
          <text x="88" y="180" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            c = E₀ / B₀ = 1 / √(μ₀ε₀)
          </text>
        </>,
      );

    case 'phy-9':
      return wrap(
        'Ray Optics and Optical Instruments: Prism dispersion and minimum deviation',
        <>
          <polygon points="180,32 114,148 246,148" fill="none" stroke="currentColor" strokeWidth="2.4" />
          <line x1="42" y1="118" x2="146" y2="92" stroke="currentColor" strokeWidth="2.2" />
          <line x1="146" y1="92" x2="214" y2="92" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2" />
          <line x1="214" y1="92" x2="316" y2="112" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2" />
          <line x1="214" y1="92" x2="312" y2="132" className="stroke-[#3D6B4F] dark:stroke-[#7AB88F]" strokeWidth="2" />
          <text x="175" y="56" fontSize="11" fontWeight="700" fill="currentColor">A</text>
          <text x="58" y="102" fontSize="10" fill="currentColor">Ray</text>
          <text x="74" y="178" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            n = sin((A+δ_m)/2) / sin(A/2)
          </text>
        </>,
      );

    case 'phy-10':
      return wrap(
        'Wave Optics: Young double-slit interference pattern',
        <>
          <line x1="92" y1="30" x2="92" y2="74" stroke="currentColor" strokeWidth="3" />
          <line x1="92" y1="84" x2="92" y2="112" stroke="currentColor" strokeWidth="3" />
          <line x1="92" y1="122" x2="92" y2="162" stroke="currentColor" strokeWidth="3" />
          <line x1="274" y1="28" x2="274" y2="164" stroke="currentColor" strokeWidth="2.5" />
          <line x1="92" y1="79" x2="274" y2="96" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="1.6" />
          <line x1="92" y1="117" x2="274" y2="96" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="1.6" />
          <line x1="92" y1="79" x2="274" y2="54" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
          <line x1="92" y1="117" x2="274" y2="54" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
          <path d="M 278 40 C 304 48, 304 60, 278 68 C 314 78, 314 114, 278 124 C 304 132, 304 144, 278 152" fill="none" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2" />
          <text x="68" y="82" fontSize="10" fontWeight="700" fill="currentColor">S₁</text>
          <text x="68" y="120" fontSize="10" fontWeight="700" fill="currentColor">S₂</text>
          <text x="118" y="182" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            Fringe Width β = λD / d
          </text>
        </>,
      );

    case 'phy-11':
      return wrap(
        'Dual Nature of Radiation and Matter: Photoelectric stopping potential vs frequency',
        <>
          <line x1="56" y1="122" x2="314" y2="122" stroke="currentColor" strokeWidth="1.6" />
          <line x1="96" y1="24" x2="96" y2="162" stroke="currentColor" strokeWidth="1.6" />
          <line x1="158" y1="122" x2="286" y2="34" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2.4" />
          <line x1="96" y1="164" x2="158" y2="122" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="1.6" strokeDasharray="4 3" />
          <circle cx="158" cy="122" r="4" className="fill-[#A64B33] dark:fill-[#D4785E]" />
          <text x="150" y="138" fontSize="10" fontWeight="700" fill="currentColor">ν₀</text>
          <text x="64" y="34" fontSize="10" fontWeight="700" fill="currentColor">V₀</text>
          <text x="298" y="136" fontSize="10" fontWeight="700" fill="currentColor">ν</text>
          <text x="210" y="100" fontSize="9.5" className="fill-[#3D6B4F] dark:fill-[#7AB88F]" fontWeight="600">Slope = h/e</text>
          <text x="98" y="182" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            K_max = hν − φ₀ · λ = h/p
          </text>
        </>,
      );

    case 'phy-12':
      return wrap(
        'Atoms: Bohr hydrogen energy levels and spectral transitions',
        <>
          {[144, 96, 66, 46].map((y, idx) => (
            <g key={y}>
              <line x1="78" y1={y} x2="278" y2={y} stroke="currentColor" strokeWidth="1.8" />
              <text x="40" y={y + 4} fontSize="10" fontFamily="monospace" fill="currentColor">n={idx + 1}</text>
              <text x="286" y={y + 4} fontSize="9.5" fontFamily="monospace" className="fill-[#787066] dark:fill-[#9C9387]">
                {['−13.6', '−3.4', '−1.51', '−0.85'][idx]} eV
              </text>
            </g>
          ))}
          <line x1="138" y1="66" x2="138" y2="140" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2" />
          <polygon points="138,144 134,135 142,135" className="fill-[#A64B33] dark:fill-[#D4785E]" />
          <line x1="205" y1="46" x2="205" y2="92" className="stroke-[#3D6B4F] dark:stroke-[#7AB88F]" strokeWidth="2" />
          <polygon points="205,96 201,87 209,87" className="fill-[#3D6B4F] dark:fill-[#7AB88F]" />
          <text x="114" y="118" fontSize="9.5" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">Lyman</text>
          <text x="212" y="78" fontSize="9.5" fontWeight="700" className="fill-[#3D6B4F] dark:fill-[#7AB88F]">Balmer</text>
          <text x="104" y="180" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            E_n = −13.6 / n² eV
          </text>
        </>,
      );

    case 'phy-13':
      return wrap(
        'Nuclei: Binding energy per nucleon vs mass number A',
        <>
          <line x1="48" y1="146" x2="316" y2="146" stroke="currentColor" strokeWidth="1.6" />
          <line x1="48" y1="146" x2="48" y2="28" stroke="currentColor" strokeWidth="1.6" />
          <path d="M 52 138 Q 74 44 128 40 Q 204 42 308 66" fill="none" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2.5" />
          <circle cx="128" cy="40" r="4" className="fill-[#A64B33] dark:fill-[#D4785E]" />
          <text x="122" y="30" fontSize="10" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">⁵⁶Fe (8.75 MeV)</text>
          <text x="270" y="54" fontSize="9.5" fill="currentColor">²³⁸U</text>
          <text x="250" y="160" fontSize="9.5" fill="currentColor">Mass Number A →</text>
          <text x="102" y="182" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            ΔE = Δm·c² · R = R₀A¹/³
          </text>
        </>,
      );

    case 'phy-14':
      return wrap(
        'Semiconductor Electronics: p-n junction diode and full-wave rectifier output',
        <>
          <rect x="44" y="52" width="66" height="64" className="fill-[#A64B33]/20 dark:fill-[#D4785E]/25 stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="1.8" />
          <rect x="110" y="52" width="22" height="64" className="fill-[#DFD7C6] dark:fill-[#332E28]" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" />
          <rect x="132" y="52" width="66" height="64" className="fill-[#3D6B4F]/20 dark:fill-[#7AB88F]/25 stroke-[#3D6B4F] dark:stroke-[#7AB88F]" strokeWidth="1.8" />
          <text x="68" y="88" fontSize="13" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">p</text>
          <text x="160" y="88" fontSize="13" fontWeight="700" className="fill-[#3D6B4F] dark:fill-[#7AB88F]">n</text>
          <text x="74" y="134" fontSize="9.5" fill="currentColor">Depletion Barrier</text>
          {/* Rectified waveform */}
          <line x1="218" y1="114" x2="332" y2="114" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 222 114 Q 240 52 258 114 Q 276 52 294 114 Q 312 52 330 114" fill="none" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2.2" />
          <text x="236" y="134" fontSize="9.5" fill="currentColor">DC Pulsating Out</text>
          <text x="86" y="178" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            n_e · n_h = n_i² · Forward / Reverse Bias
          </text>
        </>,
      );

    // =========================================================================
    // CHEMISTRY (10 Chapters)
    // =========================================================================
    case 'chem-1':
      return wrap(
        'Solutions: Raoult Law vapor pressure graph and osmotic pressure',
        <>
          <line x1="60" y1="146" x2="296" y2="146" stroke="currentColor" strokeWidth="1.6" />
          <line x1="60" y1="146" x2="60" y2="34" stroke="currentColor" strokeWidth="1.6" />
          <line x1="296" y1="146" x2="296" y2="34" stroke="currentColor" strokeWidth="1.6" />
          <line x1="60" y1="146" x2="296" y2="54" className="stroke-[#3D6B4F] dark:stroke-[#7AB88F]" strokeWidth="2" strokeDasharray="4 3" />
          <line x1="60" y1="88" x2="296" y2="146" className="stroke-[#575048] dark:stroke-[#CBC3B6]" strokeWidth="2" strokeDasharray="4 3" />
          <line x1="60" y1="88" x2="296" y2="54" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2.6" />
          <text x="150" y="54" fontSize="10" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">P_total = p₁ + p₂</text>
          <text x="44" y="92" fontSize="9.5" fill="currentColor">p₁°</text>
          <text x="302" y="58" fontSize="9.5" fill="currentColor">p₂°</text>
          <text x="84" y="178" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            p = K_H·x · π = iCRT · ΔT_b = iK_b m
          </text>
        </>,
      );

    case 'chem-2':
      return wrap(
        'Electrochemistry: Daniell Galvanic cell with salt bridge',
        <>
          <rect x="46" y="72" width="84" height="84" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <rect x="48" y="108" width="80" height="46" className="fill-[#D6CFC2] dark:fill-[#332E28]" />
          <rect x="66" y="52" width="14" height="82" className="fill-[#A64B33] dark:fill-[#D4785E]" />
          <rect x="230" y="72" width="84" height="84" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <rect x="232" y="108" width="80" height="46" className="fill-[#C9D6CD] dark:fill-[#26352B]" />
          <rect x="280" y="52" width="14" height="82" className="fill-[#3D6B4F] dark:fill-[#7AB88F]" />
          <path d="M 106 116 L 106 58 Q 180 34 254 58 L 254 116" fill="none" stroke="currentColor" strokeWidth="8" opacity="0.24" />
          <path d="M 106 116 L 106 58 Q 180 34 254 58 L 254 116" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <polyline points="73,52 73,26 287,26 287,52" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="180" cy="26" r="11" className="fill-[#FAF8F3] dark:fill-[#1E1B18]" stroke="currentColor" strokeWidth="1.6" />
          <text x="176" y="30" fontSize="10" fontWeight="700" fill="currentColor">V</text>
          <text x="48" y="46" fontSize="10" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">Zn (−)</text>
          <text x="272" y="46" fontSize="10" fontWeight="700" className="fill-[#3D6B4F] dark:fill-[#7AB88F]">Cu (+)</text>
          <text x="72" y="180" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            E_cell = E° − (0.0591/n)log Q · ΔG° = −nFE°
          </text>
        </>,
      );

    case 'chem-3':
      return wrap(
        'Chemical Kinetics: Activation energy profile and first-order decay',
        <>
          <line x1="48" y1="146" x2="210" y2="146" stroke="currentColor" strokeWidth="1.6" />
          <line x1="48" y1="146" x2="48" y2="34" stroke="currentColor" strokeWidth="1.6" />
          <path d="M 52 106 C 84 106, 98 38, 126 38 C 154 38, 168 128, 204 128" fill="none" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2.4" />
          <line x1="52" y1="106" x2="152" y2="106" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
          <line x1="126" y1="38" x2="126" y2="106" className="stroke-[#3D6B4F] dark:stroke-[#7AB88F]" strokeWidth="1.8" />
          <text x="131" y="78" fontSize="10" fontWeight="700" className="fill-[#3D6B4F] dark:fill-[#7AB88F]">E_a</text>
          {/* Half-life curve */}
          <line x1="234" y1="146" x2="334" y2="146" stroke="currentColor" strokeWidth="1.6" />
          <line x1="234" y1="146" x2="234" y2="42" stroke="currentColor" strokeWidth="1.6" />
          <path d="M 238 48 Q 266 122 330 140" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <text x="252" y="54" fontSize="9.5" fill="currentColor">[R] vs t</text>
          <text x="72" y="180" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            k = (2.303/t)log([R]₀/[R]) · t₁/₂ = 0.693/k
          </text>
        </>,
      );

    case 'chem-4':
      return wrap(
        'The d- and f-Block Elements: Transition metal oxidation states and dichromate',
        <>
          {[
            ['Sc', '+3', 52],
            ['Ti', '+4', 94],
            ['V', '+5', 136],
            ['Cr', '+6', 178],
            ['Mn', '+7', 220],
            ['Fe', '+3', 262],
            ['Cu', '+2', 304],
          ].map(([el, ox, x]) => (
            <g key={el as string}>
              <circle
                cx={x as number}
                cy={el === 'Mn' ? 54 : el === 'Cr' ? 68 : 96}
                r="16"
                className={
                  el === 'Mn' || el === 'Cr'
                    ? 'fill-[#A64B33] dark:fill-[#D4785E]'
                    : 'fill-[#FAF8F3] dark:fill-[#1E1B18] stroke-current'
                }
                strokeWidth="1.8"
              />
              <text
                x={(x as number) - 8}
                y={(el === 'Mn' ? 54 : el === 'Cr' ? 68 : 96) + 4}
                fontSize="10"
                fontWeight="700"
                className={
                  el === 'Mn' || el === 'Cr'
                    ? 'fill-[#FAF8F3] dark:fill-[#1E1B18]'
                    : 'fill-current'
                }
              >
                {el}
              </text>
              <text x={(x as number) - 7} y="138" fontSize="10" fontFamily="monospace" fill="currentColor">
                {ox}
              </text>
            </g>
          ))}
          <text x="64" y="178" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            KMnO₄ · K₂Cr₂O₇ · μ = √(n(n+2)) BM
          </text>
        </>,
      );

    case 'chem-5':
      return wrap(
        'Coordination Compounds: Octahedral crystal field splitting into eg and t2g',
        <>
          <line x1="48" y1="96" x2="128" y2="96" stroke="currentColor" strokeWidth="2.4" />
          <text x="52" y="114" fontSize="9.5" fill="currentColor">5 d-orbitals</text>
          <line x1="128" y1="96" x2="188" y2="50" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
          <line x1="128" y1="96" x2="188" y2="136" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
          {/* e_g */}
          <line x1="194" y1="50" x2="232" y2="50" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2.4" />
          <line x1="242" y1="50" x2="280" y2="50" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2.4" />
          <text x="290" y="54" fontSize="11" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">e_g (+0.6Δ₀)</text>
          {/* t_2g */}
          <line x1="184" y1="136" x2="212" y2="136" className="stroke-[#3D6B4F] dark:stroke-[#7AB88F]" strokeWidth="2.4" />
          <line x1="222" y1="136" x2="250" y2="136" className="stroke-[#3D6B4F] dark:stroke-[#7AB88F]" strokeWidth="2.4" />
          <line x1="260" y1="136" x2="288" y2="136" className="stroke-[#3D6B4F] dark:stroke-[#7AB88F]" strokeWidth="2.4" />
          <text x="294" y="140" fontSize="11" fontWeight="700" className="fill-[#3D6B4F] dark:fill-[#7AB88F]">t₂g</text>
          <line x1="172" y1="52" x2="172" y2="134" stroke="currentColor" strokeWidth="1.4" />
          <text x="150" y="98" fontSize="10" fontWeight="700" fill="currentColor">Δ₀</text>
          <text x="78" y="178" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            Crystal Field Splitting · Strong vs Weak Ligand
          </text>
        </>,
      );

    case 'chem-6':
      return wrap(
        'Haloalkanes and Haloarenes: SN2 backside nucleophilic attack with inversion',
        <>
          <text x="40" y="98" fontSize="12" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">HO⁻</text>
          <line x1="72" y1="94" x2="118" y2="94" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2" strokeDasharray="3 2" />
          <polygon points="122,94 112,89 112,99" className="fill-[#A64B33] dark:fill-[#D4785E]" />
          <text x="148" y="100" fontSize="16" fontWeight="700" fill="currentColor">C</text>
          <line x1="166" y1="94" x2="206" y2="94" stroke="currentColor" strokeWidth="2" />
          <text x="210" y="98" fontSize="12" fontWeight="700" fill="currentColor">Br</text>
          <line x1="154" y1="82" x2="176" y2="48" stroke="currentColor" strokeWidth="1.6" />
          <line x1="154" y1="106" x2="176" y2="140" stroke="currentColor" strokeWidth="1.6" />
          <text x="252" y="98" fontSize="12" fontWeight="700" className="fill-[#3D6B4F] dark:fill-[#7AB88F]">→ HO—C</text>
          <text x="92" y="178" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            SN2: 180° Walden Inversion · Rate = k[RX][Nu⁻]
          </text>
        </>,
      );

    case 'chem-7':
      return wrap(
        'Alcohols, Phenols and Ethers: Phenoxide resonance and Reimer-Tiemann reaction',
        <>
          <polygon points="94,46 130,66 130,108 94,128 58,108 58,66" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <circle cx="94" cy="87" r="21" fill="none" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="1.8" strokeDasharray="4 3" />
          <line x1="94" y1="46" x2="94" y2="26" stroke="currentColor" strokeWidth="2" />
          <text x="84" y="22" fontSize="11" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">OH</text>
          <line x1="150" y1="87" x2="202" y2="87" stroke="currentColor" strokeWidth="1.8" />
          <polygon points="208,87 198,82 198,92" fill="currentColor" />
          <text x="150" y="76" fontSize="9.5" fontFamily="monospace" fill="currentColor">CHCl₃/NaOH</text>
          <polygon points="266,46 302,66 302,108 266,128 230,108 230,66" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <circle cx="266" cy="87" r="21" fill="none" className="stroke-[#3D6B4F] dark:stroke-[#7AB88F]" strokeWidth="1.8" />
          <text x="256" y="22" fontSize="11" fontWeight="700" className="fill-[#3D6B4F] dark:fill-[#7AB88F]">OH</text>
          <line x1="266" y1="46" x2="266" y2="26" stroke="currentColor" strokeWidth="2" />
          <line x1="302" y1="66" x2="324" y2="54" stroke="currentColor" strokeWidth="2" />
          <text x="326" y="54" fontSize="11" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">CHO</text>
          <text x="86" y="178" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            Reimer–Tiemann · Lucas Test: 3° &gt; 2° &gt; 1°
          </text>
        </>,
      );

    case 'chem-8':
      return wrap(
        'Aldehydes, Ketones and Carboxylic Acids: Polarized carbonyl nucleophilic addition',
        <>
          <text x="84" y="96" fontSize="18" fontWeight="700" fill="currentColor">C</text>
          <line x1="104" y1="85" x2="152" y2="85" stroke="currentColor" strokeWidth="2.4" />
          <line x1="104" y1="94" x2="152" y2="94" stroke="currentColor" strokeWidth="2.4" />
          <text x="158" y="96" fontSize="18" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">O</text>
          <text x="84" y="64" fontSize="10" fontWeight="700" className="fill-[#3D6B4F] dark:fill-[#7AB88F]">δ+</text>
          <text x="160" y="64" fontSize="10" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">δ−</text>
          <line x1="78" y1="80" x2="54" y2="56" stroke="currentColor" strokeWidth="1.8" />
          <line x1="78" y1="98" x2="54" y2="122" stroke="currentColor" strokeWidth="1.8" />
          <text x="38" y="52" fontSize="11" fill="currentColor">R</text>
          <text x="38" y="132" fontSize="11" fill="currentColor">H</text>
          <path d="M 92 146 Q 92 118 92 108" fill="none" className="stroke-[#3D6B4F] dark:stroke-[#7AB88F]" strokeWidth="2" />
          <polygon points="92,102 88,112 96,112" className="fill-[#3D6B4F] dark:fill-[#7AB88F]" />
          <text x="78" y="160" fontSize="11" fontWeight="700" className="fill-[#3D6B4F] dark:fill-[#7AB88F]">Nu⁻</text>
          <text x="208" y="84" fontSize="10.5" fontWeight="600" fill="currentColor">Aldol &amp; Cannizzaro</text>
          <text x="208" y="104" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">Tollens · Fehling</text>
          <text x="88" y="182" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            sp² Planar Carbonyl → sp³ Tetrahedral
          </text>
        </>,
      );

    case 'chem-9':
      return wrap(
        'Amines: Diazonium coupling and basicity order',
        <>
          <polygon points="78,50 110,68 110,104 78,122 46,104 46,68" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="78" cy="86" r="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="110" y1="86" x2="132" y2="86" stroke="currentColor" strokeWidth="2" />
          <text x="136" y="90" fontSize="12" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">N₂⁺Cl⁻</text>
          <line x1="188" y1="86" x2="232" y2="86" stroke="currentColor" strokeWidth="1.8" />
          <polygon points="238,86 228,81 228,91" fill="currentColor" />
          <text x="248" y="90" fontSize="12" fontWeight="700" className="fill-[#3D6B4F] dark:fill-[#7AB88F]">Ar–N=N–Ar</text>
          <text x="252" y="110" fontSize="9.5" className="fill-[#575048] dark:fill-[#CBC3B6]">Azo Dye</text>
          <text x="58" y="176" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            Aqueous: (C₂H₅)₂NH &gt; (C₂H₅)₃N &gt; C₂H₅NH₂
          </text>
        </>,
      );

    case 'chem-10':
      return wrap(
        'Biomolecules: Alpha-D-Glucose pyranose ring and peptide linkage',
        <>
          <polygon points="62,92 86,58 142,58 166,92 142,126 86,126" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <circle cx="142" cy="58" r="9" className="fill-[#FAF8F3] dark:fill-[#1E1B18]" />
          <text x="137" y="62" fontSize="11" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">O</text>
          <text x="64" y="46" fontSize="10" fontWeight="600" fill="currentColor">CH₂OH</text>
          <text x="172" y="96" fontSize="10" fontWeight="700" className="fill-[#3D6B4F] dark:fill-[#7AB88F]">OH (α)</text>
          <text x="218" y="76" fontSize="11" fontWeight="700" fill="currentColor">Peptide Bond</text>
          <text x="218" y="100" fontSize="12" fontFamily="monospace" className="fill-[#A64B33] dark:fill-[#D4785E]">—CO—NH—</text>
          <text x="86" y="176" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            Glycosidic · Peptide · Phosphodiester
          </text>
        </>,
      );

    // =========================================================================
    // BIOLOGY (13 Chapters)
    // =========================================================================
    case 'bio-1':
      return wrap(
        'Sexual Reproduction in Flowering Plants: 7-celled 8-nucleate embryo sac',
        <>
          <ellipse cx="128" cy="92" rx="48" ry="60" className="fill-[#FAF8F3] dark:fill-[#1E1B18] stroke-[#3D6B4F] dark:stroke-[#7AB88F]" strokeWidth="2.2" />
          {[110, 128, 146].map((x) => (
            <circle key={x} cx={x} cy="48" r="6" className="fill-[#3D6B4F] dark:fill-[#7AB88F]" />
          ))}
          <circle cx="122" cy="92" r="6" className="fill-[#A64B33] dark:fill-[#D4785E]" />
          <circle cx="134" cy="92" r="6" className="fill-[#A64B33] dark:fill-[#D4785E]" />
          <circle cx="112" cy="134" r="6" className="fill-[#3D6B4F] dark:fill-[#7AB88F]" />
          <circle cx="128" cy="128" r="7.5" className="fill-[#A64B33] dark:fill-[#D4785E]" />
          <circle cx="144" cy="134" r="6" className="fill-[#3D6B4F] dark:fill-[#7AB88F]" />
          <text x="192" y="52" fontSize="10" fontWeight="600" fill="currentColor">Antipodals (3)</text>
          <text x="192" y="96" fontSize="10" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">Polar Nuclei (2n)</text>
          <text x="192" y="136" fontSize="10" fontWeight="600" fill="currentColor">Egg + Synergids</text>
          <text x="72" y="178" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            Syngamy (2n) + Triple Fusion → PEN (3n)
          </text>
        </>,
      );

    case 'bio-2':
      return wrap(
        'Human Reproduction: Menstrual cycle hormonal LH surge',
        <>
          <line x1="48" y1="142" x2="320" y2="142" stroke="currentColor" strokeWidth="1.6" />
          <line x1="48" y1="142" x2="48" y2="30" stroke="currentColor" strokeWidth="1.6" />
          <path d="M 54 128 C 118 126, 150 116, 174 36 C 198 116, 232 128, 312 132" fill="none" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2.5" />
          <path d="M 54 134 C 130 130, 210 120, 246 84 C 276 84, 294 122, 312 134" fill="none" className="stroke-[#3D6B4F] dark:stroke-[#7AB88F]" strokeWidth="2" strokeDasharray="4 3" />
          <line x1="174" y1="36" x2="174" y2="142" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
          <text x="184" y="50" fontSize="10.5" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">LH Surge</text>
          <text x="234" y="76" fontSize="10" fontWeight="700" className="fill-[#3D6B4F] dark:fill-[#7AB88F]">Progesterone</text>
          <text x="156" y="156" fontSize="9.5" fontFamily="monospace" fill="currentColor">Day 14</text>
          <text x="92" y="180" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            Ovulation · Corpus Luteum · Placenta
          </text>
        </>,
      );

    case 'bio-3':
      return wrap(
        'Reproductive Health: Assisted reproductive technologies IVF ZIFT GIFT',
        <>
          {[
            ['IVF–ET', 'In-vitro fusion → >8 blastomeres → Uterus', 48],
            ['ZIFT', 'Zygote / ≤8 blastomeres → Fallopian tube', 92],
            ['GIFT', 'Ovum + Sperm transfer → Fallopian tube', 136],
          ].map(([tag, desc, y]) => (
            <g key={tag as string}>
              <rect x="34" y={(y as number) - 18} width="70" height="28" rx="5" className="fill-[#3D6B4F] dark:fill-[#7AB88F]" />
              <text x="48" y={y as number} fontSize="11" fontWeight="700" className="fill-[#FAF8F3] dark:fill-[#1E1B18]">{tag}</text>
              <text x="116" y={y as number} fontSize="10.5" fill="currentColor">{desc}</text>
            </g>
          ))}
          <text x="68" y="180" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            IUDs · Barrier Methods · ART · MTP Framework
          </text>
        </>,
      );

    case 'bio-4':
      return wrap(
        'Principles of Inheritance and Variation: Autosomal recessive pedigree',
        <>
          <rect x="116" y="24" width="22" height="22" className="fill-[#FAF8F3] dark:fill-[#1E1B18]" stroke="currentColor" strokeWidth="2" />
          <circle cx="232" cy="35" r="11" className="fill-[#FAF8F3] dark:fill-[#1E1B18]" stroke="currentColor" strokeWidth="2" />
          <line x1="138" y1="35" x2="221" y2="35" stroke="currentColor" strokeWidth="2" />
          <line x1="180" y1="35" x2="180" y2="68" stroke="currentColor" strokeWidth="2" />
          <line x1="76" y1="68" x2="284" y2="68" stroke="currentColor" strokeWidth="2" />
          <line x1="76" y1="68" x2="76" y2="94" stroke="currentColor" strokeWidth="2" />
          <rect x="65" y="94" width="22" height="22" className="fill-[#A64B33] dark:fill-[#D4785E]" stroke="currentColor" strokeWidth="2" />
          <line x1="145" y1="68" x2="145" y2="94" stroke="currentColor" strokeWidth="2" />
          <circle cx="145" cy="105" r="11" className="fill-[#FAF8F3] dark:fill-[#1E1B18]" stroke="currentColor" strokeWidth="2" />
          <line x1="215" y1="68" x2="215" y2="94" stroke="currentColor" strokeWidth="2" />
          <circle cx="215" cy="105" r="11" className="fill-[#A64B33] dark:fill-[#D4785E]" stroke="currentColor" strokeWidth="2" />
          <line x1="284" y1="68" x2="284" y2="94" stroke="currentColor" strokeWidth="2" />
          <rect x="273" y="94" width="22" height="22" className="fill-[#FAF8F3] dark:fill-[#1E1B18]" stroke="currentColor" strokeWidth="2" />
          <text x="68" y="176" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            Autosomal Recessive · Dihybrid 9:3:3:1
          </text>
        </>,
      );

    case 'bio-5':
      return wrap(
        'Molecular Basis of Inheritance: DNA replication fork and transcription',
        <>
          <line x1="40" y1="88" x2="146" y2="88" stroke="currentColor" strokeWidth="2.6" />
          <line x1="40" y1="104" x2="146" y2="104" stroke="currentColor" strokeWidth="2.6" />
          <line x1="146" y1="88" x2="298" y2="42" stroke="currentColor" strokeWidth="2.4" />
          <line x1="146" y1="104" x2="298" y2="150" stroke="currentColor" strokeWidth="2.4" />
          {/* Leading */}
          <line x1="286" y1="56" x2="162" y2="92" className="stroke-[#3D6B4F] dark:stroke-[#7AB88F]" strokeWidth="2.2" />
          <text x="195" y="42" fontSize="9.5" fontWeight="700" className="fill-[#3D6B4F] dark:fill-[#7AB88F]">5′→3′ Leading</text>
          {/* Okazaki lagging */}
          <line x1="164" y1="104" x2="206" y2="118" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2.2" />
          <line x1="218" y1="122" x2="262" y2="136" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2.2" />
          <text x="192" y="152" fontSize="9.5" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">Okazaki Fragments</text>
          <text x="86" y="180" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            Chargaff (A+G)/(T+C)=1 · Lac Operon
          </text>
        </>,
      );

    case 'bio-6':
      return wrap(
        'Evolution: Natural selection and Hardy-Weinberg equilibrium',
        <>
          <line x1="48" y1="138" x2="316" y2="138" stroke="currentColor" strokeWidth="1.6" />
          <line x1="48" y1="138" x2="48" y2="30" stroke="currentColor" strokeWidth="1.6" />
          <path d="M 60 134 C 95 130, 122 44, 150 44 C 178 44, 205 130, 240 134" fill="none" stroke="currentColor" strokeWidth="1.8" strokeDasharray="4 3" />
          <path d="M 110 134 C 155 128, 198 38, 232 38 C 266 38, 286 128, 308 134" fill="none" className="stroke-[#3D6B4F] dark:stroke-[#7AB88F]" strokeWidth="2.5" />
          <line x1="150" y1="84" x2="226" y2="84" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2" />
          <polygon points="230,84 220,79 220,89" className="fill-[#A64B33] dark:fill-[#D4785E]" />
          <text x="150" y="74" fontSize="10" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">Directional</text>
          <text x="86" y="178" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            Hardy–Weinberg: p² + 2pq + q² = 1
          </text>
        </>,
      );

    case 'bio-7':
      return wrap(
        'Human Health and Disease: Y-shaped H2L2 antibody immunoglobulin molecule',
        <>
          {/* Heavy chains */}
          <polyline points="122,40 170,96 170,152" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <polyline points="238,40 190,96 190,152" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          {/* Light chains */}
          <line x1="100" y1="54" x2="142" y2="104" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="260" y1="54" x2="218" y2="104" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="3.5" strokeLinecap="round" />
          {/* S-S bonds */}
          <line x1="170" y1="104" x2="190" y2="104" className="stroke-[#3D6B4F] dark:stroke-[#7AB88F]" strokeWidth="2" />
          <line x1="170" y1="116" x2="190" y2="116" className="stroke-[#3D6B4F] dark:stroke-[#7AB88F]" strokeWidth="2" />
          <text x="58" y="34" fontSize="10" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">Antigen-Binding Site</text>
          <text x="208" y="144" fontSize="10" fontWeight="600" fill="currentColor">H₂L₂</text>
          <text x="90" y="178" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            Active vs Passive Immunity · ELISA
          </text>
        </>,
      );

    case 'bio-8':
      return wrap(
        'Microbes in Human Welfare: Anaerobic biogas digester tank',
        <>
          <rect x="106" y="68" width="148" height="84" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M 106 68 Q 180 20 254 68" className="fill-[#C9D6CD] dark:fill-[#26352B]" stroke="currentColor" strokeWidth="2" />
          <rect x="108" y="102" width="144" height="48" className="fill-[#D6CFC2] dark:fill-[#332E28]" />
          <line x1="180" y1="44" x2="180" y2="18" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2.4" />
          <text x="190" y="30" fontSize="10" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">CH₄ + CO₂</text>
          <text x="148" y="130" fontSize="10" fontWeight="600" fill="currentColor">Slurry + Dung</text>
          <text x="72" y="178" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            Methanogens · Sewage BOD Reduction
          </text>
        </>,
      );

    case 'bio-9':
      return wrap(
        'Biotechnology Principles and Processes: pBR322 cloning vector map',
        <>
          <circle cx="116" cy="90" r="46" fill="none" stroke="currentColor" strokeWidth="5" opacity="0.22" />
          <path d="M 116 44 A 46 46 0 0 1 162 90" fill="none" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="5.5" />
          <path d="M 70 90 A 46 46 0 0 1 116 44" fill="none" className="stroke-[#3D6B4F] dark:stroke-[#7AB88F]" strokeWidth="5.5" />
          <text x="93" y="94" fontSize="11" fontWeight="700" fill="currentColor" fontFamily="monospace">pBR322</text>
          <text x="60" y="42" fontSize="9.5" fontWeight="700" className="fill-[#3D6B4F] dark:fill-[#7AB88F]">ampᴿ</text>
          <text x="150" y="42" fontSize="9.5" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">tetᴿ</text>
          <text x="196" y="64" fontSize="10.5" fontWeight="700" fill="currentColor">PCR 3 Steps:</text>
          <text x="196" y="84" fontSize="10" fontFamily="monospace" fill="currentColor">1. Denaturation 94°C</text>
          <text x="196" y="102" fontSize="10" fontFamily="monospace" fill="currentColor">2. Annealing 55°C</text>
          <text x="196" y="120" fontSize="10" fontFamily="monospace" fill="currentColor">3. Extension (Taq)</text>
          <text x="86" y="178" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            EcoRI · BamHI · Gel Electrophoresis
          </text>
        </>,
      );

    case 'bio-10':
      return wrap(
        'Biotechnology and its Applications: Proinsulin processing to mature A and B chains',
        <>
          <rect x="64" y="44" width="128" height="16" rx="4" className="fill-[#3D6B4F] dark:fill-[#7AB88F]" />
          <text x="44" y="56" fontSize="10" fontWeight="700" fill="currentColor">A</text>
          <rect x="64" y="92" width="148" height="16" rx="4" className="fill-[#A64B33] dark:fill-[#D4785E]" />
          <text x="44" y="104" fontSize="10" fontWeight="700" fill="currentColor">B</text>
          <line x1="100" y1="60" x2="100" y2="92" stroke="currentColor" strokeWidth="2" />
          <line x1="164" y1="60" x2="164" y2="92" stroke="currentColor" strokeWidth="2" />
          <text x="105" y="80" fontSize="9" fontWeight="700" fill="currentColor">S–S</text>
          <text x="169" y="80" fontSize="9" fontWeight="700" fill="currentColor">S–S</text>
          <rect x="236" y="64" width="84" height="22" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="242" y="79" fontSize="9.5" fill="currentColor">C-Peptide cut</text>
          <text x="72" y="176" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            rDNA Insulin · Bt Cry1Ac · ADA Gene Therapy
          </text>
        </>,
      );

    case 'bio-11':
      return wrap(
        'Organisms and Populations: Logistic S-curve vs Exponential J-curve',
        <>
          <line x1="56" y1="142" x2="314" y2="142" stroke="currentColor" strokeWidth="1.6" />
          <line x1="56" y1="142" x2="56" y2="30" stroke="currentColor" strokeWidth="1.6" />
          <line x1="56" y1="46" x2="314" y2="46" stroke="currentColor" strokeWidth="1.3" strokeDasharray="4 3" />
          <text x="64" y="40" fontSize="10" fontWeight="700" fill="currentColor">Carrying Capacity (K)</text>
          <path d="M 60 138 Q 140 132 182 32" fill="none" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2.2" />
          <path d="M 60 138 C 140 136, 174 52, 300 48" fill="none" className="stroke-[#3D6B4F] dark:stroke-[#7AB88F]" strokeWidth="2.5" />
          <text x="188" y="38" fontSize="9.5" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">J-Curve</text>
          <text x="234" y="64" fontSize="9.5" fontWeight="700" className="fill-[#3D6B4F] dark:fill-[#7AB88F]">Logistic S-Curve</text>
          <text x="90" y="178" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            dN/dt = rN((K−N)/K)
          </text>
        </>,
      );

    case 'bio-12':
      return wrap(
        'Ecosystem: Ecological energy pyramid 10 percent transfer law',
        <>
          <polygon points="180,28 152,58 208,58" className="fill-[#A64B33] dark:fill-[#D4785E]" />
          <polygon points="146,62 214,62 232,92 128,92" className="fill-[#A64B33]/75 dark:fill-[#D4785E]/75" />
          <polygon points="122,96 238,96 258,126 102,126" className="fill-[#3D6B4F]/80 dark:fill-[#7AB88F]/80" />
          <polygon points="96,130 264,130 286,158 74,158" className="fill-[#3D6B4F] dark:fill-[#7AB88F]" />
          <text x="171" y="51" fontSize="9" fontWeight="700" className="fill-[#FAF8F3] dark:fill-[#1E1B18]">10 J</text>
          <text x="166" y="82" fontSize="9.5" fontWeight="700" className="fill-[#FAF8F3] dark:fill-[#1E1B18]">100 J</text>
          <text x="162" y="116" fontSize="10" fontWeight="700" className="fill-[#FAF8F3] dark:fill-[#1E1B18]">1,000 J</text>
          <text x="148" y="149" fontSize="10" fontWeight="700" className="fill-[#FAF8F3] dark:fill-[#1E1B18]">10,000 J (PP)</text>
          <text x="86" y="182" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            10% Energy Law · GPP − R = NPP
          </text>
        </>,
      );

    case 'bio-13':
      return wrap(
        'Biodiversity and Conservation: Species-area relationship rectangular hyperbola',
        <>
          <line x1="56" y1="142" x2="314" y2="142" stroke="currentColor" strokeWidth="1.6" />
          <line x1="56" y1="142" x2="56" y2="32" stroke="currentColor" strokeWidth="1.6" />
          <path d="M 56 142 Q 92 64 304 50" fill="none" className="stroke-[#3D6B4F] dark:stroke-[#7AB88F]" strokeWidth="2.5" />
          <line x1="66" y1="136" x2="296" y2="44" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="1.8" strokeDasharray="4 3" />
          <text x="174" y="42" fontSize="10" fontWeight="700" className="fill-[#3D6B4F] dark:fill-[#7AB88F]">S = C A^Z</text>
          <text x="150" y="116" fontSize="10" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">log S = log C + Z log A</text>
          <text x="88" y="178" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            Z = 0.1–0.2 · In-Situ vs Ex-Situ
          </text>
        </>,
      );

    // =========================================================================
    // MATHEMATICS (13 Chapters)
    // =========================================================================
    case 'math-1':
      return wrap(
        'Relations and Functions: One-one onto bijection mapping',
        <>
          <ellipse cx="104" cy="92" rx="44" ry="56" fill="none" stroke="currentColor" strokeWidth="2" />
          <ellipse cx="256" cy="92" rx="44" ry="56" fill="none" stroke="currentColor" strokeWidth="2" />
          {[58, 92, 126].map((y, idx) => (
            <g key={y}>
              <circle cx="104" cy={y} r="4" className="fill-[#A64B33] dark:fill-[#D4785E]" />
              <circle cx="256" cy={y} r="4" className="fill-[#3D6B4F] dark:fill-[#7AB88F]" />
              <line x1="108" y1={y} x2="250" y2={[92, 58, 126][idx]} stroke="currentColor" strokeWidth="1.6" />
            </g>
          ))}
          <text x="98" y="28" fontSize="11" fontWeight="700" fill="currentColor">A</text>
          <text x="250" y="28" fontSize="11" fontWeight="700" fill="currentColor">B</text>
          <text x="166" y="34" fontSize="11" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">f: A → B</text>
          <text x="72" y="178" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            Reflexive · Symmetric · Transitive · Bijective
          </text>
        </>,
      );

    case 'math-2':
      return wrap(
        'Inverse Trigonometric Functions: Principal value branch of arcsin x',
        <>
          <line x1="72" y1="95" x2="288" y2="95" stroke="currentColor" strokeWidth="1.5" />
          <line x1="180" y1="28" x2="180" y2="158" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 116 142 C 138 136, 162 114, 180 95 C 198 76, 222 54, 244 48" fill="none" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2.6" />
          <circle cx="116" cy="142" r="4" className="fill-[#A64B33] dark:fill-[#D4785E]" />
          <circle cx="244" cy="48" r="4" className="fill-[#A64B33] dark:fill-[#D4785E]" />
          <text x="186" y="48" fontSize="10" fill="currentColor">π/2</text>
          <text x="186" y="148" fontSize="10" fill="currentColor">−π/2</text>
          <text x="110" y="110" fontSize="10" fill="currentColor">−1</text>
          <text x="240" y="110" fontSize="10" fill="currentColor">1</text>
          <text x="86" y="180" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            y = sin⁻¹x ∈ [−π/2, π/2]
          </text>
        </>,
      );

    case 'math-3':
      return wrap(
        'Matrices: Matrix inverse and symmetric skew-symmetric decomposition',
        <>
          <polyline points="84,42 72,42 72,140 84,140" fill="none" stroke="currentColor" strokeWidth="2.4" />
          <polyline points="198,42 210,42 210,140 198,140" fill="none" stroke="currentColor" strokeWidth="2.4" />
          <text x="92" y="68" fontSize="13" fontFamily="monospace" className="fill-[#A64B33] dark:fill-[#D4785E]">a₁₁  a₁₂  a₁₃</text>
          <text x="92" y="96" fontSize="13" fontFamily="monospace" fill="currentColor">a₂₁  a₂₂  a₂₃</text>
          <text x="92" y="124" fontSize="13" fontFamily="monospace" fill="currentColor">a₃₁  a₃₂  a₃₃</text>
          <text x="226" y="84" fontSize="11" fontWeight="700" fill="currentColor">A = P + Q</text>
          <text x="226" y="106" fontSize="10" fontFamily="monospace" className="fill-[#3D6B4F] dark:fill-[#7AB88F]">P = ½(A+A′)</text>
          <text x="90" y="178" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            (AB)⁻¹ = B⁻¹A⁻¹ · A(adj A) = |A|I
          </text>
        </>,
      );

    case 'math-4':
      return wrap(
        'Determinants: Cramer linear system solution and triangle area',
        <>
          <line x1="78" y1="38" x2="78" y2="138" stroke="currentColor" strokeWidth="2.4" />
          <line x1="172" y1="38" x2="172" y2="138" stroke="currentColor" strokeWidth="2.4" />
          <text x="90" y="64" fontSize="12" fontFamily="monospace" fill="currentColor">x₁  y₁  1</text>
          <text x="90" y="92" fontSize="12" fontFamily="monospace" fill="currentColor">x₂  y₂  1</text>
          <text x="90" y="120" fontSize="12" fontFamily="monospace" fill="currentColor">x₃  y₃  1</text>
          <polygon points="222,126 266,44 308,118" className="fill-[#A64B33]/20 dark:fill-[#D4785E]/25 stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2" />
          <text x="242" y="102" fontSize="10" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">Area Δ</text>
          <text x="86" y="178" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            |kA| = kⁿ|A| · X = A⁻¹B (|A| ≠ 0)
          </text>
        </>,
      );

    case 'math-5':
      return wrap(
        'Continuity and Differentiability: Tangent slope and limit continuity',
        <>
          <line x1="48" y1="142" x2="314" y2="142" stroke="currentColor" strokeWidth="1.6" />
          <line x1="56" y1="142" x2="56" y2="30" stroke="currentColor" strokeWidth="1.6" />
          <path d="M 64 128 Q 140 120 184 72 T 298 44" fill="none" stroke="currentColor" strokeWidth="2.4" />
          <line x1="128" y1="126" x2="246" y2="24" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2" />
          <circle cx="184" cy="72" r="4.5" className="fill-[#A64B33] dark:fill-[#D4785E]" />
          <text x="194" y="84" fontSize="10" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">Slope = f′(c)</text>
          <text x="72" y="178" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            LHL = RHL = f(c) · Chain Rule dy/dx
          </text>
        </>,
      );

    case 'math-6':
      return wrap(
        'Application of Derivatives: Local maximum and minimum stationary points',
        <>
          <line x1="44" y1="142" x2="318" y2="142" stroke="currentColor" strokeWidth="1.6" />
          <path d="M 52 132 C 88 26, 146 26, 180 92 C 214 148, 268 148, 308 48" fill="none" stroke="currentColor" strokeWidth="2.4" />
          <line x1="88" y1="45" x2="144" y2="45" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2" />
          <circle cx="116" cy="45" r="4.5" className="fill-[#A64B33] dark:fill-[#D4785E]" />
          <text x="92" y="34" fontSize="9.5" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">Max (f″&lt;0)</text>
          <line x1="212" y1="129" x2="268" y2="129" className="stroke-[#3D6B4F] dark:stroke-[#7AB88F]" strokeWidth="2" />
          <circle cx="240" cy="129" r="4.5" className="fill-[#3D6B4F] dark:fill-[#7AB88F]" />
          <text x="218" y="116" fontSize="9.5" fontWeight="700" className="fill-[#3D6B4F] dark:fill-[#7AB88F]">Min (f″&gt;0)</text>
          <text x="92" y="178" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            Stationary Point: f′(x) = 0
          </text>
        </>,
      );

    case 'math-7':
      return wrap(
        'Integrals: Definite integral shaded area under curve',
        <>
          <line x1="48" y1="142" x2="316" y2="142" stroke="currentColor" strokeWidth="1.6" />
          <line x1="56" y1="142" x2="56" y2="30" stroke="currentColor" strokeWidth="1.6" />
          <path d="M 104 142 L 104 92 C 148 44, 210 108, 256 54 L 256 142 Z" className="fill-[#A64B33]/20 dark:fill-[#D4785E]/25" />
          <path d="M 68 122 C 118 46, 204 114, 294 42" fill="none" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2.5" />
          <line x1="104" y1="92" x2="104" y2="142" stroke="currentColor" strokeWidth="1.4" strokeDasharray="3 3" />
          <line x1="256" y1="54" x2="256" y2="142" stroke="currentColor" strokeWidth="1.4" strokeDasharray="3 3" />
          <text x="100" y="156" fontSize="10" fontWeight="700" fill="currentColor">a</text>
          <text x="252" y="156" fontSize="10" fontWeight="700" fill="currentColor">b</text>
          <text x="72" y="180" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            ∫₀ᵃ f(x)dx = ∫₀ᵃ f(a−x)dx · King Property
          </text>
        </>,
      );

    case 'math-8':
      return wrap(
        'Application of Integrals: Area bounded between parabola and line',
        <>
          <line x1="52" y1="140" x2="312" y2="140" stroke="currentColor" strokeWidth="1.5" />
          <line x1="88" y1="152" x2="88" y2="28" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 88 140 Q 94 64 268 42 L 88 140 Z" className="fill-[#3D6B4F]/20 dark:fill-[#7AB88F]/25" />
          <path d="M 88 140 Q 92 64 282 40" fill="none" stroke="currentColor" strokeWidth="2.3" />
          <line x1="88" y1="140" x2="274" y2="40" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2" />
          <text x="220" y="34" fontSize="10" fontWeight="700" fill="currentColor">y² = 4ax</text>
          <text x="222" y="88" fontSize="10" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">y = mx</text>
          <text x="86" y="178" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            Area = ∫(y_upper − y_lower) dx
          </text>
        </>,
      );

    case 'math-9':
      return wrap(
        'Differential Equations: Family of solution curves',
        <>
          <line x1="48" y1="140" x2="314" y2="140" stroke="currentColor" strokeWidth="1.6" />
          <line x1="60" y1="148" x2="60" y2="30" stroke="currentColor" strokeWidth="1.6" />
          {[0, 18, 36].map((offset, idx) => (
            <path
              key={offset}
              d={`M 68 ${126 - offset} Q 170 ${122 - offset} 288 ${46 - offset * 0.4}`}
              fill="none"
              className={
                idx === 1
                  ? 'stroke-[#A64B33] dark:stroke-[#D4785E]'
                  : 'stroke-current opacity-55'
              }
              strokeWidth={idx === 1 ? '2.5' : '1.6'}
            />
          ))}
          <text x="108" y="54" fontSize="10.5" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">
            I.F. = e^(∫ P dx)
          </text>
          <text x="86" y="178" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            dy/dx + Py = Q · y(IF) = ∫Q(IF)dx + C
          </text>
        </>,
      );

    case 'math-10':
      return wrap(
        'Vector Algebra: Parallelogram vector addition and cross product normal',
        <>
          <line x1="78" y1="136" x2="226" y2="136" stroke="currentColor" strokeWidth="2.4" />
          <polygon points="232,136 222,131 222,141" fill="currentColor" />
          <line x1="78" y1="136" x2="140" y2="54" stroke="currentColor" strokeWidth="2.4" />
          <polygon points="144,49 134,54 142,60" fill="currentColor" />
          <line x1="140" y1="54" x2="288" y2="54" stroke="currentColor" strokeWidth="1.3" strokeDasharray="4 3" />
          <line x1="226" y1="136" x2="288" y2="54" stroke="currentColor" strokeWidth="1.3" strokeDasharray="4 3" />
          <line x1="78" y1="136" x2="282" y2="58" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2.6" />
          <polygon points="288,54 277,54 282,63" className="fill-[#A64B33] dark:fill-[#D4785E]" />
          <text x="148" y="152" fontSize="10.5" fontWeight="700" fill="currentColor">a⃗</text>
          <text x="94" y="88" fontSize="10.5" fontWeight="700" fill="currentColor">b⃗</text>
          <text x="192" y="84" fontSize="10.5" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">a⃗ + b⃗</text>
          <text x="84" y="180" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            |a×b| = |a||b|sinθ · Area = ½|a×b|
          </text>
        </>,
      );

    case 'math-11':
      return wrap(
        'Three-Dimensional Geometry: Skew lines shortest perpendicular distance',
        <>
          <line x1="56" y1="52" x2="294" y2="88" stroke="currentColor" strokeWidth="2.3" />
          <line x1="66" y1="138" x2="304" y2="104" stroke="currentColor" strokeWidth="2.3" />
          <line x1="180" y1="71" x2="180" y2="122" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2.2" strokeDasharray="4 2" />
          <circle cx="180" cy="71" r="3.5" className="fill-[#A64B33] dark:fill-[#D4785E]" />
          <circle cx="180" cy="122" r="3.5" className="fill-[#A64B33] dark:fill-[#D4785E]" />
          <text x="188" y="100" fontSize="10.5" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">d_min</text>
          <text x="64" y="44" fontSize="10" fontWeight="700" fill="currentColor">L₁: r⃗ = a₁ + λb₁</text>
          <text x="64" y="154" fontSize="10" fontWeight="700" fill="currentColor">L₂: r⃗ = a₂ + μb₂</text>
          <text x="78" y="180" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            d = |(a₂−a₁)·(b₁×b₂)| / |b₁×b₂|
          </text>
        </>,
      );

    case 'math-12':
      return wrap(
        'Linear Programming: Bounded feasible region corner points',
        <>
          <line x1="64" y1="144" x2="296" y2="144" stroke="currentColor" strokeWidth="1.6" />
          <line x1="64" y1="144" x2="64" y2="30" stroke="currentColor" strokeWidth="1.6" />
          <polygon points="64,144 64,66 156,48 214,104 214,144" className="fill-[#A64B33]/20 dark:fill-[#D4785E]/25 stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2.2" />
          <circle cx="156" cy="48" r="4.5" className="fill-[#A64B33] dark:fill-[#D4785E]" />
          <text x="164" y="46" fontSize="10" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">Optimal Corner Z_max</text>
          <text x="96" y="108" fontSize="10" fontWeight="600" fill="currentColor">Feasible Region</text>
          <text x="84" y="178" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            Corner Point Method · Z = ax + by
          </text>
        </>,
      );

    case 'math-13':
      return wrap(
        'Probability: Bayes Theorem probability partition tree',
        <>
          <circle cx="56" cy="92" r="5" fill="currentColor" />
          <line x1="60" y1="90" x2="148" y2="48" stroke="currentColor" strokeWidth="1.8" />
          <line x1="60" y1="94" x2="148" y2="136" stroke="currentColor" strokeWidth="1.8" />
          <text x="154" y="52" fontSize="11" fontWeight="700" fill="currentColor">E₁</text>
          <text x="154" y="140" fontSize="11" fontWeight="700" fill="currentColor">E₂</text>
          <line x1="176" y1="48" x2="264" y2="48" className="stroke-[#3D6B4F] dark:stroke-[#7AB88F]" strokeWidth="2" />
          <line x1="176" y1="136" x2="264" y2="136" className="stroke-[#A64B33] dark:stroke-[#D4785E]" strokeWidth="2" />
          <text x="270" y="52" fontSize="10.5" fontWeight="700" className="fill-[#3D6B4F] dark:fill-[#7AB88F]">P(A|E₁)</text>
          <text x="270" y="140" fontSize="10.5" fontWeight="700" className="fill-[#A64B33] dark:fill-[#D4785E]">P(A|E₂)</text>
          <text x="86" y="42" fontSize="9.5" fill="currentColor">P(E₁)</text>
          <text x="86" y="144" fontSize="9.5" fill="currentColor">P(E₂)</text>
          <text x="64" y="178" fontSize="10" fontFamily="monospace" className="fill-[#575048] dark:fill-[#CBC3B6]">
            P(E_i|A) = P(E_i)P(A|E_i) / ΣP(E_j)P(A|E_j)
          </text>
        </>,
      );

    default:
      return null;
  }
}
