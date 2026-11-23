interface ExamDiagramProps {
  diagramId: string;
}

export function ExamDiagram({diagramId}: ExamDiagramProps) {
  switch (diagramId) {
    case 'phy-q9-bridge':
      return (
        <div className="my-3 p-4 bg-[#FAF8F3] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] rounded-lg inline-block">
          <svg
            viewBox="0 0 320 200"
            className="w-full max-w-[300px] h-auto text-[#1E1B18] dark:text-[#F5F2EB]"
            role="img"
            aria-label="Bridge circuit with 4 ohm, 8 ohm, 2 ohm, 4 ohm arms, 7 ohm central resistor, and 12V battery"
          >
            {/* Diamond arms */}
            <line x1="40" y1="85" x2="160" y2="25" stroke="currentColor" strokeWidth="2" />
            <line x1="160" y1="25" x2="280" y2="85" stroke="currentColor" strokeWidth="2" />
            <line x1="40" y1="85" x2="160" y2="145" stroke="currentColor" strokeWidth="2" />
            <line x1="160" y1="145" x2="280" y2="85" stroke="currentColor" strokeWidth="2" />
            {/* Central 7 ohm */}
            <line
              x1="160"
              y1="25"
              x2="160"
              y2="145"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            {/* Battery rails */}
            <polyline points="40,85 40,175 148,175" fill="none" stroke="currentColor" strokeWidth="2" />
            <polyline points="280,85 280,175 172,175" fill="none" stroke="currentColor" strokeWidth="2" />
            {/* Battery plates */}
            <line x1="148" y1="162" x2="148" y2="188" stroke="currentColor" strokeWidth="2.5" />
            <line x1="158" y1="169" x2="158" y2="181" stroke="currentColor" strokeWidth="2.5" />
            <line x1="164" y1="162" x2="164" y2="188" stroke="currentColor" strokeWidth="2.5" />
            <line x1="172" y1="169" x2="172" y2="181" stroke="currentColor" strokeWidth="2.5" />
            {/* Nodes */}
            <circle cx="40" cy="85" r="3.5" fill="currentColor" />
            <circle cx="280" cy="85" r="3.5" fill="currentColor" />
            <circle cx="160" cy="25" r="3.5" fill="currentColor" />
            <circle cx="160" cy="145" r="3.5" fill="currentColor" />
            {/* Labels */}
            <text x="24" y="89" fontSize="12" fontWeight="600" fill="currentColor">A</text>
            <text x="288" y="89" fontSize="12" fontWeight="600" fill="currentColor">B</text>
            <text x="82" y="45" fontSize="12" fontWeight="600" className="fill-[#A64B33] dark:fill-[#D4785E]">4 Ω</text>
            <text x="220" y="45" fontSize="12" fontWeight="600" className="fill-[#A64B33] dark:fill-[#D4785E]">8 Ω</text>
            <text x="82" y="135" fontSize="12" fontWeight="600" className="fill-[#A64B33] dark:fill-[#D4785E]">2 Ω</text>
            <text x="220" y="135" fontSize="12" fontWeight="600" className="fill-[#A64B33] dark:fill-[#D4785E]">4 Ω</text>
            <text x="167" y="89" fontSize="12" fontWeight="600" className="fill-[#575048] dark:fill-[#CBC3B6]">7 Ω</text>
            <text x="148" y="198" fontSize="12" fontWeight="600" fill="currentColor">12 V</text>
          </svg>
        </div>
      );

    case 'phy-q10-bulbs':
      return (
        <div className="my-3 p-4 bg-[#FAF8F3] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] rounded-lg inline-block">
          <svg
            viewBox="0 0 320 150"
            className="w-full max-w-[300px] h-auto text-[#1E1B18] dark:text-[#F5F2EB]"
            role="img"
            aria-label="Two lamps L1 (220V, 40W) and L2 (220V, 100W) connected in series across a 220V AC mains"
          >
            <rect x="40" y="45" width="240" height="75" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="110" cy="45" r="18" className="fill-[#FAF8F3] dark:fill-[#1E1B18]" stroke="currentColor" strokeWidth="2" />
            <text x="103" y="49" fontSize="12" fontWeight="600" className="fill-[#A64B33] dark:fill-[#D4785E]">L₁</text>
            <text x="82" y="18" fontSize="10" className="fill-[#575048] dark:fill-[#CBC3B6]">40W, 220V</text>
            <circle cx="210" cy="45" r="18" className="fill-[#FAF8F3] dark:fill-[#1E1B18]" stroke="currentColor" strokeWidth="2" />
            <text x="203" y="49" fontSize="12" fontWeight="600" className="fill-[#A64B33] dark:fill-[#D4785E]">L₂</text>
            <text x="180" y="18" fontSize="10" className="fill-[#575048] dark:fill-[#CBC3B6]">100W, 220V</text>
            <circle cx="160" cy="120" r="16" className="fill-[#FAF8F3] dark:fill-[#1E1B18]" stroke="currentColor" strokeWidth="2" />
            <path d="M151 120 Q155.5 112 160 120 T169 120" fill="none" stroke="currentColor" strokeWidth="2" />
            <text x="128" y="146" fontSize="12" fontWeight="600" fill="currentColor">220 V A.C.</text>
          </svg>
        </div>
      );

    case 'phy-q12-semicircle':
      return (
        <div className="my-3 p-4 bg-[#FAF8F3] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] rounded-lg inline-block">
          <svg
            viewBox="0 0 320 110"
            className="w-full max-w-[300px] h-auto text-[#1E1B18] dark:text-[#F5F2EB]"
            role="img"
            aria-label="Long straight conductor with semicircular arc of radius 5 cm carrying 3A steady current"
          >
            <line x1="25" y1="80" x2="105" y2="80" stroke="currentColor" strokeWidth="2" />
            <path d="M105 80 A55 55 0 0 1 215 80" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="215" y1="80" x2="295" y2="80" stroke="currentColor" strokeWidth="2" />
            <circle cx="160" cy="80" r="3" className="fill-[#A64B33] dark:fill-[#D4785E]" />
            <text x="155" y="96" fontSize="11" fontWeight="600" fill="currentColor">O</text>
            <line
              x1="160"
              y1="80"
              x2="195"
              y2="38"
              className="stroke-[#A64B33] dark:stroke-[#D4785E]"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <text x="165" y="70" fontSize="11" fontWeight="600" className="fill-[#A64B33] dark:fill-[#D4785E]">5 cm</text>
            <text x="42" y="72" fontSize="12" fontWeight="600" fill="currentColor">3 A →</text>
          </svg>
        </div>
      );

    case 'math-q1-graph':
      return (
        <div className="my-3 p-4 bg-[#FAF8F3] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] rounded-lg inline-block">
          <svg
            viewBox="0 0 260 210"
            className="w-full max-w-[250px] h-auto text-[#1E1B18] dark:text-[#F5F2EB]"
            role="img"
            aria-label="Graph from x = -1 to 1 increasing smoothly from y = pi/2 through pi at x = 0 to y = 3pi/2 at x = 1"
          >
            {/* X & Y Axes */}
            <line x1="30" y1="165" x2="240" y2="165" stroke="currentColor" strokeWidth="1.5" />
            <line x1="135" y1="15" x2="135" y2="190" stroke="currentColor" strokeWidth="1.5" />
            {/* Y ticks: 3pi/2 = 45, pi = 90, pi/2 = 135 */}
            <line x1="130" y1="45" x2="140" y2="45" stroke="currentColor" strokeWidth="1" />
            <line x1="130" y1="90" x2="140" y2="90" stroke="currentColor" strokeWidth="1" />
            <line x1="130" y1="135" x2="140" y2="135" stroke="currentColor" strokeWidth="1" />
            <text x="102" y="49" fontSize="10.5" fill="currentColor">3π/2</text>
            <text x="118" y="94" fontSize="10.5" fill="currentColor">π</text>
            <text x="106" y="139" fontSize="10.5" fill="currentColor">π/2</text>
            <text x="142" y="25" fontSize="11" fontWeight="600" fill="currentColor">Y</text>
            <text x="232" y="158" fontSize="11" fontWeight="600" fill="currentColor">X</text>
            <text x="82" y="179" fontSize="11" fill="currentColor">−1</text>
            <text x="178" y="179" fontSize="11" fill="currentColor">1</text>
            {/* Smooth increasing inverse-sine shifted by +pi */}
            <path
              d="M 88 135 C 96 105, 118 93, 135 90 C 152 87, 174 75, 182 45"
              fill="none"
              className="stroke-[#A64B33] dark:stroke-[#D4785E]"
              strokeWidth="2.5"
            />
            <circle cx="88" cy="135" r="3" className="fill-[#A64B33] dark:fill-[#D4785E]" />
            <circle cx="135" cy="90" r="3" className="fill-[#A64B33] dark:fill-[#D4785E]" />
            <circle cx="182" cy="45" r="3" className="fill-[#A64B33] dark:fill-[#D4785E]" />
          </svg>
        </div>
      );

    case 'chem-q5-piston':
      return (
        <div className="my-3 p-4 bg-[#FAF8F3] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] rounded-lg inline-block">
          <svg
            viewBox="0 0 320 140"
            className="w-full max-w-[300px] h-auto text-[#1E1B18] dark:text-[#F5F2EB]"
            role="img"
            aria-label="Two cylinders (a) and (b) showing gas compressed into smaller volume above solvent by adding external weights on piston"
          >
            <rect x="25" y="20" width="110" height="95" fill="none" stroke="currentColor" strokeWidth="2" />
            <rect x="26" y="75" width="108" height="39" className="fill-[#D6CFC2] dark:fill-[#3D362F]" />
            <line x1="25" y1="35" x2="135" y2="35" className="stroke-[#787066] dark:stroke-[#9C9387]" strokeWidth="5" />
            <rect x="65" y="14" width="30" height="14" className="fill-[#C9B9A5] dark:fill-[#574E45]" stroke="currentColor" />
            <text x="72" y="25" fontSize="9" fontWeight="600" fill="currentColor">P₁</text>
            <text x="74" y="132" fontSize="11" fontWeight="600" fill="currentColor">(a)</text>
            <rect x="185" y="20" width="110" height="95" fill="none" stroke="currentColor" strokeWidth="2" />
            <rect x="186" y="75" width="108" height="39" className="fill-[#D6CFC2] dark:fill-[#3D362F]" />
            <line x1="185" y1="52" x2="295" y2="52" className="stroke-[#787066] dark:stroke-[#9C9387]" strokeWidth="5" />
            <rect x="195" y="34" width="24" height="13" className="fill-[#C9B9A5] dark:fill-[#574E45]" stroke="currentColor" />
            <rect x="228" y="34" width="24" height="13" className="fill-[#C9B9A5] dark:fill-[#574E45]" stroke="currentColor" />
            <rect x="261" y="34" width="24" height="13" className="fill-[#C9B9A5] dark:fill-[#574E45]" stroke="currentColor" />
            <text x="234" y="132" fontSize="11" fontWeight="600" fill="currentColor">(b)</text>
          </svg>
        </div>
      );

    case 'bio-q4-giraffe':
      return (
        <div className="my-3 p-4 bg-[#FAF8F3] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] rounded-lg inline-block">
          <svg
            viewBox="0 0 280 150"
            className="w-full max-w-[270px] h-auto text-[#1E1B18] dark:text-[#F5F2EB]"
            role="img"
            aria-label="Natural selection distribution curve shifted right toward larger beak depth in drought-adapted finches"
          >
            <line x1="40" y1="120" x2="255" y2="120" stroke="currentColor" strokeWidth="1.5" />
            <line x1="40" y1="120" x2="40" y2="20" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M 55 118 C 110 112, 165 25, 200 28 C 225 30, 238 80, 248 118"
              fill="none"
              className="stroke-[#3D6B4F] dark:stroke-[#7AB88F]"
              strokeWidth="2.5"
            />
            <text x="72" y="138" fontSize="11" fill="currentColor">Beak depth in finches →</text>
            <text x="14" y="96" fontSize="10" fill="currentColor" transform="rotate(-90 14 96)">
              No. of birds →
            </text>
          </svg>
        </div>
      );

    case 'bio-q5-transcription':
      return (
        <div className="my-3 p-4 bg-[#FAF8F3] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] rounded-lg inline-block">
          <svg
            viewBox="0 0 320 130"
            className="w-full max-w-[300px] h-auto text-[#1E1B18] dark:text-[#F5F2EB]"
            role="img"
            aria-label="Transcription initiation diagram showing Promoter A, Sigma factor B, RNA polymerase C, and DNA helix D"
          >
            <line x1="30" y1="45" x2="290" y2="45" stroke="#3D6B4F" strokeWidth="3" />
            <line x1="30" y1="60" x2="290" y2="60" stroke="#A64B33" strokeWidth="3" />
            <rect x="45" y="42" width="35" height="21" fill="#D5E3D8" opacity="0.8" />
            <text x="36" y="96" fontSize="12" fontWeight="700" fill="currentColor">A</text>
            <line x1="42" y1="84" x2="55" y2="62" stroke="currentColor" strokeWidth="1.5" />
            <ellipse cx="110" cy="65" rx="34" ry="20" fill="#E8D7B9" stroke="#8C6A3B" strokeWidth="2" />
            <circle cx="96" cy="67" r="10" fill="#D4846A" stroke="#7A3220" strokeWidth="1.5" />
            <text x="92" y="71" fontSize="11" fontWeight="700" fill="#1E1B18">σ</text>
            <line x1="76" y1="106" x2="92" y2="78" stroke="currentColor" strokeWidth="1.5" />
            <text x="68" y="120" fontSize="12" fontWeight="700" fill="currentColor">B</text>
            <line x1="152" y1="98" x2="128" y2="78" stroke="currentColor" strokeWidth="1.5" />
            <text x="155" y="108" fontSize="12" fontWeight="700" fill="currentColor">C</text>
            <line x1="255" y1="92" x2="245" y2="64" stroke="currentColor" strokeWidth="1.5" />
            <text x="256" y="105" fontSize="12" fontWeight="700" fill="currentColor">D</text>
          </svg>
        </div>
      );

    case 'bio-q6-avery':
      return (
        <div className="my-3 p-4 bg-[#FAF8F3] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] rounded-lg text-xs text-[#1E1B18] dark:text-[#F5F2EB] space-y-1.5 font-mono">
          <p className="font-semibold font-sans text-xs text-[#575048] dark:text-[#CBC3B6]">
            Assay Tubes (Heat-killed smooth extract + live rough pneumococci):
          </p>
          <p>Tube A: + RNase → Reported Result: &ldquo;Transformation observed&rdquo;</p>
          <p>Tube B: + Protease → Reported Result: &ldquo;No transformation&rdquo;</p>
          <p>Tube C: + DNase → Reported Result: &ldquo;No transformation&rdquo;</p>
          <p>Tube D: + Lipase → Reported Result: &ldquo;Transformation observed&rdquo;</p>
        </div>
      );

    case 'bio-q8-pedigree':
      return (
        <div className="my-3 p-4 bg-[#FAF8F3] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] rounded-lg inline-block">
          <svg
            viewBox="0 0 300 160"
            className="w-full max-w-[290px] h-auto text-[#1E1B18] dark:text-[#F5F2EB]"
            role="img"
            aria-label="Pedigree chart showing unaffected parents having an affected son and an affected daughter"
          >
            <rect x="95" y="15" width="22" height="22" className="fill-[#FAF8F3] dark:fill-[#1E1B18]" stroke="currentColor" strokeWidth="2" />
            <circle cx="185" cy="26" r="11" className="fill-[#FAF8F3] dark:fill-[#1E1B18]" stroke="currentColor" strokeWidth="2" />
            <line x1="117" y1="26" x2="174" y2="26" stroke="currentColor" strokeWidth="2" />
            <line x1="145" y1="26" x2="145" y2="60" stroke="currentColor" strokeWidth="2" />
            <line x1="40" y1="60" x2="255" y2="60" stroke="currentColor" strokeWidth="2" />
            <line x1="40" y1="60" x2="40" y2="80" stroke="currentColor" strokeWidth="2" />
            <rect x="29" y="80" width="22" height="22" fill="currentColor" stroke="currentColor" strokeWidth="2" />
            <line x1="100" y1="60" x2="100" y2="80" stroke="currentColor" strokeWidth="2" />
            <circle cx="100" cy="91" r="11" className="fill-[#FAF8F3] dark:fill-[#1E1B18]" stroke="currentColor" strokeWidth="2" />
            <line x1="155" y1="60" x2="155" y2="80" stroke="currentColor" strokeWidth="2" />
            <circle cx="155" cy="91" r="11" className="fill-[#FAF8F3] dark:fill-[#1E1B18]" stroke="currentColor" strokeWidth="2" />
            <line x1="205" y1="60" x2="205" y2="80" stroke="currentColor" strokeWidth="2" />
            <circle cx="205" cy="91" r="11" fill="currentColor" stroke="currentColor" strokeWidth="2" />
            <line x1="255" y1="60" x2="255" y2="80" stroke="currentColor" strokeWidth="2" />
            <rect x="244" y="80" width="22" height="22" className="fill-[#FAF8F3] dark:fill-[#1E1B18]" stroke="currentColor" strokeWidth="2" />
            <text x="20" y="135" fontSize="11" className="fill-[#575048] dark:fill-[#9C9387]">
              Filled symbols = affected individuals (both son &amp; daughter affected)
            </text>
          </svg>
        </div>
      );

    default:
      return null;
  }
}
