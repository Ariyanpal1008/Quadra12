import type {DiagramMetadata} from '../v3Diagrams';

export const MATHS_V3_DIAGRAMS: Record<string, DiagramMetadata> = {
  'math-v3-bijection-mapping': {
    id: 'math-v3-bijection-mapping',
    subjectId: 'maths',
    title: 'Injective (One-One), Surjective (Onto) &amp; Bijective Mappings',
    caption: 'Bijection requires distinct inputs → distinct outputs (f(x₁)=f(x₂) ⇒ x₁=x₂) AND Range = Codomain; finite A→A one-one implies onto.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Arrow mapping diagrams showing Bijective one-one onto versus Many-one non-surjective functions">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <ellipse cx="75" cy="110" rx="34" ry="66" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="1.8"/>
  <ellipse cx="165" cy="110" rx="34" ry="66" fill="#ECFDF5" stroke="#059669" stroke-width="1.8"/>
  <line x1="75" y1="70" x2="162" y2="70" stroke="#1E293B" stroke-width="1.6"/>
  <line x1="75" y1="110" x2="162" y2="145" stroke="#1E293B" stroke-width="1.6"/>
  <line x1="75" y1="150" x2="162" y2="110" stroke="#1E293B" stroke-width="1.6"/>
  <circle cx="75" cy="70" r="3.5" fill="#1D4ED8"/>
  <circle cx="75" cy="110" r="3.5" fill="#1D4ED8"/>
  <circle cx="75" cy="150" r="3.5" fill="#1D4ED8"/>
  <circle cx="165" cy="70" r="3.5" fill="#059669"/>
  <circle cx="165" cy="110" r="3.5" fill="#059669"/>
  <circle cx="165" cy="145" r="3.5" fill="#059669"/>
  <text x="120" y="196" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#059669">Bijective (1-1 &amp; Onto)</text>
  <ellipse cx="275" cy="110" rx="34" ry="66" fill="#FEF2F2" stroke="#DC2626" stroke-width="1.8"/>
  <ellipse cx="365" cy="110" rx="34" ry="66" fill="#FEF3C7" stroke="#D97706" stroke-width="1.8"/>
  <line x1="275" y1="70" x2="362" y2="80" stroke="#1E293B" stroke-width="1.6"/>
  <line x1="275" y1="110" x2="362" y2="80" stroke="#1E293B" stroke-width="1.6"/>
  <line x1="275" y1="150" x2="362" y2="120" stroke="#1E293B" stroke-width="1.6"/>
  <circle cx="275" cy="70" r="3.5" fill="#DC2626"/>
  <circle cx="275" cy="110" r="3.5" fill="#DC2626"/>
  <circle cx="275" cy="150" r="3.5" fill="#DC2626"/>
  <circle cx="365" cy="80" r="3.5" fill="#D97706"/>
  <circle cx="365" cy="120" r="3.5" fill="#D97706"/>
  <circle cx="365" cy="155" r="3.5" fill="#94A3B8"/>
  <text x="320" y="196" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#DC2626">Many-One &amp; Into</text>
  <text x="220" y="222" text-anchor="middle" font-family="monospace" font-size="10" fill="#334155">Total Bijections (n→n) = n! | Reflexive Relations = 2^(n²-n)</text>
</svg>`,
  },
  'math-v3-itf-principal-graphs': {
    id: 'math-v3-itf-principal-graphs',
    subjectId: 'maths',
    title: 'Principal Value Graphs: y = sin⁻¹x, cos⁻¹x &amp; tan⁻¹x',
    caption: 'sin⁻¹x maps [-1,1] → [-π/2, π/2] (increasing); cos⁻¹x maps [-1,1] → [0, π] (decreasing); tan⁻¹x spans (-π/2, π/2).',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Principal value branch graphs of arcsine, arccosine, and arctangent showing horizontal bounds and monotonicity">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <line x1="25" y1="115" x2="145" y2="115" stroke="#1E293B" stroke-width="1.4"/>
  <line x1="85" y1="44" x2="85" y2="178" stroke="#1E293B" stroke-width="1.4"/>
  <path d="M 48 164 Q 82 135 85 115 T 122 66" fill="none" stroke="#1D4ED8" stroke-width="2.4"/>
  <text x="85" y="196" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#1D4ED8">sin⁻¹x ∈ [-π/2, π/2]</text>
  <line x1="162" y1="158" x2="278" y2="158" stroke="#1E293B" stroke-width="1.4"/>
  <line x1="220" y1="44" x2="220" y2="176" stroke="#1E293B" stroke-width="1.4"/>
  <path d="M 184 52 Q 216 95 220 105 T 256 158" fill="none" stroke="#DC2626" stroke-width="2.4"/>
  <text x="220" y="196" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#DC2626">cos⁻¹x ∈ [0, π]</text>
  <line x1="295" y1="115" x2="415" y2="115" stroke="#1E293B" stroke-width="1.4"/>
  <line x1="355" y1="44" x2="355" y2="178" stroke="#1E293B" stroke-width="1.4"/>
  <line x1="295" y1="62" x2="415" y2="62" stroke="#94A3B8" stroke-width="1" stroke-dasharray="3,3"/>
  <line x1="295" y1="168" x2="415" y2="168" stroke="#94A3B8" stroke-width="1" stroke-dasharray="3,3"/>
  <path d="M 300 162 Q 345 152 355 115 Q 365 78 410 68" fill="none" stroke="#059669" stroke-width="2.4"/>
  <text x="355" y="196" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#059669">tan⁻¹x ∈ (-π/2, π/2)</text>
  <text x="220" y="222" text-anchor="middle" font-family="monospace" font-size="10" fill="#334155">Remember: cos⁻¹(-x) = π - cos⁻¹x | sin⁻¹(-x) = -sin⁻¹x</text>
</svg>`,
  },
  'math-v3-matrix-decomp': {
    id: 'math-v3-matrix-decomp',
    subjectId: 'maths',
    title: 'Unique Symmetric + Skew-Symmetric Matrix Decomposition',
    caption: 'Every square matrix A splits uniquely into P = ½(A+A^T) (symmetric across diagonal) and Q = ½(A-A^T) (zeros on main diagonal).',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Structural matrix diagram showing A = P + Q where P has equal off-diagonal elements and Q has zero main diagonal with opposite signs">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <rect x="26" y="42" width="176" height="122" rx="6" fill="#EFF6FF" stroke="#1D4ED8"/>
  <text x="114" y="64" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#1D4ED8">Symmetric P = ½(A+A^T)</text>
  <text x="114" y="96" text-anchor="middle" font-family="monospace" font-size="11" fill="#1E293B">[ a   h   g ]</text>
  <text x="114" y="118" text-anchor="middle" font-family="monospace" font-size="11" fill="#1E293B">[ h   b   f ]</text>
  <text x="114" y="140" text-anchor="middle" font-family="monospace" font-size="11" fill="#1E293B">[ g   f   c ]</text>
  <text x="220" y="114" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="700" fill="#1E293B">+</text>
  <rect x="238" y="42" width="176" height="122" rx="6" fill="#FEF2F2" stroke="#DC2626"/>
  <text x="326" y="64" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#DC2626">Skew Q = ½(A-A^T)</text>
  <text x="326" y="96" text-anchor="middle" font-family="monospace" font-size="11" fill="#1E293B">[  0   p   q ]</text>
  <text x="326" y="118" text-anchor="middle" font-family="monospace" font-size="11" fill="#1E293B">[ -p   0   r ]</text>
  <text x="326" y="140" text-anchor="middle" font-family="monospace" font-size="11" fill="#1E293B">[ -q  -r   0 ]</text>
  <text x="220" y="196" text-anchor="middle" font-family="monospace" font-size="10.5" font-weight="700" fill="#059669">(AB)^T = B^T A^T | Skew-sym diagonal entries are ALWAYS 0</text>
  <text x="220" y="218" text-anchor="middle" font-family="monospace" font-size="10" fill="#334155">Only Zero Matrix O is both Symmetric and Skew-Symmetric</text>
</svg>`,
  },
  'math-v3-determinant-area-system': {
    id: 'math-v3-determinant-area-system',
    subjectId: 'maths',
    title: 'Martin’s Rule &amp; Linear System Consistency Decision Flow',
    caption: 'If |A| ≠ 0, system AX = B is consistent with unique solution X = A⁻¹B; if |A| = 0, (adj A)B distinguishes no solution vs infinite solutions.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Flowchart for solving AX = B showing unique solution when det A nonzero versus inconsistent or infinite cases when det A is zero">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <rect x="135" y="20" width="170" height="36" rx="6" fill="#F8FAFC" stroke="#1E293B" stroke-width="2"/>
  <text x="220" y="42" text-anchor="middle" font-family="monospace" font-size="11" font-weight="700" fill="#1E293B">System A·X = B  → Check |A|</text>
  <line x1="175" y1="56" x2="105" y2="96" stroke="#059669" stroke-width="2"/>
  <line x1="265" y1="56" x2="335" y2="96" stroke="#DC2626" stroke-width="2"/>
  <rect x="24" y="96" width="166" height="62" rx="6" fill="#ECFDF5" stroke="#059669"/>
  <text x="107" y="116" text-anchor="middle" font-family="monospace" font-size="10.5" font-weight="700" fill="#059669">|A| ≠ 0 (Non-Singular)</text>
  <text x="107" y="136" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#1E293B">Consistent &amp; Unique:</text>
  <text x="107" y="151" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#059669">X = (adj A / |A|) B</text>
  <rect x="234" y="96" width="182" height="62" rx="6" fill="#FEF2F2" stroke="#DC2626"/>
  <text x="325" y="116" text-anchor="middle" font-family="monospace" font-size="10.5" font-weight="700" fill="#DC2626">|A| = 0 (Singular)</text>
  <text x="325" y="135" text-anchor="middle" font-family="monospace" font-size="9.5" fill="#1E293B">(adj A)B ≠ O → No Solution</text>
  <text x="325" y="151" text-anchor="middle" font-family="monospace" font-size="9.5" fill="#1E293B">(adj A)B = O → ∞ / None</text>
  <text x="220" y="192" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#1D4ED8">|kA| = kⁿ|A| | |adj A| = |A|^(n-1) | Triangle Area = ½ |det| = 0 if collinear</text>
</svg>`,
  },
  'math-v3-continuity-cusp': {
    id: 'math-v3-continuity-cusp',
    subjectId: 'maths',
    title: 'Continuous Yet Non-Differentiable Corner vs Jump Discontinuity',
    caption: 'Sharp corner f(x) = |x| is unbroken (continuous at x = 0) but slopes jump -1 ≠ +1, so f′(0) fails to exist.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Comparison graph between continuous sharp corner y equals mod x at origin and jump discontinuity curve">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <line x1="25" y1="158" x2="205" y2="158" stroke="#1E293B" stroke-width="1.5"/>
  <line x1="115" y1="36" x2="115" y2="178" stroke="#1E293B" stroke-width="1.5"/>
  <polyline points="42,68 115,158 188,68" fill="none" stroke="#1D4ED8" stroke-width="2.6"/>
  <circle cx="115" cy="158" r="4" fill="#1D4ED8"/>
  <text x="64" y="64" font-family="monospace" font-size="10" font-weight="700" fill="#1D4ED8">LHD = -1</text>
  <text x="136" y="64" font-family="monospace" font-size="10" font-weight="700" fill="#1D4ED8">RHD = +1</text>
  <text x="115" y="196" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="700" fill="#1E293B">f(x)=|x|: Continuous, NOT Diff at 0</text>
  <line x1="235" y1="158" x2="415" y2="158" stroke="#1E293B" stroke-width="1.5"/>
  <line x1="325" y1="36" x2="325" y2="178" stroke="#1E293B" stroke-width="1.5"/>
  <line x1="252" y1="126" x2="322" y2="126" stroke="#DC2626" stroke-width="2.6"/>
  <circle cx="325" cy="126" r="4" fill="#FFFFFF" stroke="#DC2626" stroke-width="2"/>
  <line x1="328" y1="74" x2="398" y2="74" stroke="#DC2626" stroke-width="2.6"/>
  <circle cx="325" cy="74" r="4" fill="#DC2626"/>
  <text x="325" y="196" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="700" fill="#DC2626">LHL ≠ RHL: Discontinuous</text>
  <text x="220" y="222" text-anchor="middle" font-family="monospace" font-size="10" fill="#059669">Theorem: Differentiable ⇒ Always Continuous (Converse False)</text>
</svg>`,
  },
  'math-v3-cone-in-sphere': {
    id: 'math-v3-cone-in-sphere',
    subjectId: 'maths',
    title: 'Optimization Cross-Section: Largest Cone Inscribed in Sphere (R)',
    caption: 'With cone apex-to-base height h = R + x and r² = R² - x², setting dV/dx = 0 gives x = R/3, yielding V_cone = (8/27) V_sphere.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Circular cross-section of a sphere of radius R containing an inscribed isosceles triangle representing the maximum volume cone">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <circle cx="155" cy="116" r="80" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="2.2"/>
  <polygon points="155,36 86,154 224,154" fill="#FEF3C7" fill-opacity="0.7" stroke="#A64B33" stroke-width="2.2"/>
  <line x1="155" y1="36" x2="155" y2="154" stroke="#1E293B" stroke-width="1.5" stroke-dasharray="4,3"/>
  <line x1="155" y1="116" x2="224" y2="154" stroke="#059669" stroke-width="2"/>
  <circle cx="155" cy="116" r="3.5" fill="#1E293B"/>
  <text x="142" y="114" font-family="monospace" font-size="10" font-weight="700" fill="#1E293B">O</text>
  <text x="160" y="82" font-family="monospace" font-size="10" fill="#1D4ED8">R</text>
  <text x="160" y="138" font-family="monospace" font-size="10" font-weight="700" fill="#A64B33">x = R/3</text>
  <text x="195" y="128" font-family="monospace" font-size="10" font-weight="700" fill="#059669">R</text>
  <text x="188" y="168" font-family="monospace" font-size="10" fill="#1E293B">r</text>
  <rect x="262" y="42" width="156" height="148" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
  <text x="340" y="64" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1E293B">Key Constraints</text>
  <text x="340" y="90" text-anchor="middle" font-family="monospace" font-size="10" fill="#059669">r² + x² = R²</text>
  <text x="340" y="114" text-anchor="middle" font-family="monospace" font-size="10" fill="#1D4ED8">h = R + x = 4R/3</text>
  <text x="340" y="138" text-anchor="middle" font-family="monospace" font-size="10" fill="#A64B33">V = ⅓π(R²-x²)(R+x)</text>
  <text x="340" y="166" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#1E293B">Max = (8/27) V_sph</text>
</svg>`,
  },
  'math-v3-definite-integral-king': {
    id: 'math-v3-definite-integral-king',
    subjectId: 'maths',
    title: 'Definite Integral Properties: Reflection (King) &amp; Odd/Even Symmetry',
    caption: 'Reflecting x → (a - x) preserves area identically over [0, a]; odd curves f(-x) = -f(x) cancel +ve/-ve areas over [-a, a].',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Area curves illustrating King property f(a-x) reflection symmetry and odd function zero area cancellation over symmetric bounds">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <line x1="25" y1="158" x2="205" y2="158" stroke="#1E293B" stroke-width="1.5"/>
  <line x1="45" y1="42" x2="45" y2="174" stroke="#1E293B" stroke-width="1.5"/>
  <path d="M 45 148 Q 110 52 185 88 L 185 158 L 45 158 Z" fill="#DBEAFE" stroke="#1D4ED8" stroke-width="2"/>
  <path d="M 45 88 Q 120 52 185 148" fill="none" stroke="#DC2626" stroke-width="2" stroke-dasharray="4,3"/>
  <text x="115" y="190" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#1D4ED8">∫₀ᵃ f(x)dx = ∫₀ᵃ f(a-x)dx</text>
  <line x1="235" y1="112" x2="415" y2="112" stroke="#1E293B" stroke-width="1.5"/>
  <line x1="325" y1="36" x2="325" y2="174" stroke="#1E293B" stroke-width="1.5"/>
  <path d="M 262 156 C 285 156, 305 112, 325 112 C 345 112, 365 68, 388 68" fill="none" stroke="#059669" stroke-width="2.5"/>
  <text x="275" y="146" font-family="monospace" font-size="10" font-weight="700" fill="#DC2626">-Area</text>
  <text x="355" y="88" font-family="monospace" font-size="10" font-weight="700" fill="#059669">+Area</text>
  <text x="325" y="190" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#059669">Odd: ∫_{-a}^{a} f(x)dx = 0</text>
  <text x="220" y="220" text-anchor="middle" font-family="monospace" font-size="10" fill="#334155">Even: ∫_{-a}^{a} f(x)dx = 2 ∫₀ᵃ f(x)dx | Split |x - c| at root x = c</text>
</svg>`,
  },
  'math-v3-ellipse-area-strip': {
    id: 'math-v3-ellipse-area-strip',
    subjectId: 'maths',
    title: 'Area of Ellipse x²/a² + y²/b² = 1 via 4-Quadrant Vertical dx Strip',
    caption: 'Area = 4 ∫₀ᵃ (b/a)√(a² - x²) dx = (4b/a) · (πa²/4) = πab sq. units.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Standard ellipse with first quadrant shaded and vertical differential strip y dx demonstrating total area pi a b">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <ellipse cx="220" cy="112" rx="135" ry="70" fill="#F8FAFC" stroke="#1E293B" stroke-width="2.2"/>
  <path d="M 220 112 L 220 42 A 135 70 0 0 1 355 112 Z" fill="#DBEAFE" stroke="#1D4ED8" stroke-width="1.5"/>
  <rect x="268" y="47" width="14" height="65" fill="#A64B33" fill-opacity="0.7" stroke="#7C2D12"/>
  <line x1="55" y1="112" x2="385" y2="112" stroke="#1E293B" stroke-width="1.6"/>
  <line x1="220" y1="24" x2="220" y2="196" stroke="#1E293B" stroke-width="1.6"/>
  <text x="275" y="128" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#A64B33">dx</text>
  <text x="298" y="78" font-family="monospace" font-size="10" font-weight="700" fill="#1D4ED8">y = (b/a)√(a²-x²)</text>
  <text x="358" y="128" font-family="monospace" font-size="10.5" font-weight="700" fill="#1E293B">(a,0)</text>
  <text x="226" y="34" font-family="monospace" font-size="10.5" font-weight="700" fill="#1E293B">(0,b)</text>
  <text x="220" y="218" text-anchor="middle" font-family="monospace" font-size="10.5" font-weight="700" fill="#059669">Total Area = 4 × Quadrant I = π a b sq. units</text>
</svg>`,
  },
  'math-v3-ode-slope-field': {
    id: 'math-v3-ode-slope-field',
    subjectId: 'maths',
    title: 'Differential Equation General Family vs Particular Solution',
    caption: 'Integrating an nth-order ODE introduces n arbitrary constants (+ C), forming a family; initial value (x₀, y₀) pins one unique curve.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Integral solution curves showing general family C1, C2, C3 and highlighted particular solution passing through point (x0, y0)">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <line x1="55" y1="184" x2="400" y2="184" stroke="#1E293B" stroke-width="1.8"/>
  <line x1="55" y1="24" x2="55" y2="184" stroke="#1E293B" stroke-width="1.8"/>
  <path d="M 75 168 Q 220 155 375 102" fill="none" stroke="#94A3B8" stroke-width="1.8" stroke-dasharray="4,3"/>
  <path d="M 75 138 Q 220 120 375 62" fill="none" stroke="#1D4ED8" stroke-width="2.8"/>
  <path d="M 75 108 Q 220 88 375 30" fill="none" stroke="#94A3B8" stroke-width="1.8" stroke-dasharray="4,3"/>
  <circle cx="220" cy="108" r="5" fill="#DC2626"/>
  <text x="228" y="102" font-family="monospace" font-size="10.5" font-weight="700" fill="#DC2626">(x₀, y₀)</text>
  <text x="335" y="54" font-family="sans-serif" font-size="10" font-weight="700" fill="#1D4ED8">Particular Soln</text>
  <text x="332" y="128" font-family="sans-serif" font-size="10" fill="#64748B">General Family (+C)</text>
  <text x="220" y="216" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#334155">Linear ODE: dy/dx + Py = Q ⇒ IF = e^(∫P dx) | Homogeneous: y = vx</text>
</svg>`,
  },
  'math-v3-vector-dot-cross': {
    id: 'math-v3-vector-dot-cross',
    subjectId: 'maths',
    title: 'Vector Projection (a⃗·b⃗/|b⃗|) &amp; Cross-Product Area (a⃗ × b⃗)',
    caption: 'Dot product measures projection along b⃗; Cross product magnitude |a⃗×b⃗| equals Parallelogram area (triangle = ½|a⃗×b⃗|).',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Geometric diagram of vector projection of a onto b and parallelogram spanned by vectors a and b with perpendicular normal a cross b">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <polygon points="75,168 235,168 305,78 145,78" fill="#EFF6FF" stroke="#93C5FD" stroke-width="1.5"/>
  <line x1="75" y1="168" x2="235" y2="168" stroke="#1E293B" stroke-width="2.6"/>
  <polygon points="238,168 229,163 229,173" fill="#1E293B"/>
  <line x1="75" y1="168" x2="145" y2="78" stroke="#DC2626" stroke-width="2.6"/>
  <polygon points="147,75 138,80 146,85" fill="#DC2626"/>
  <line x1="145" y1="78" x2="145" y2="168" stroke="#059669" stroke-width="1.6" stroke-dasharray="4,3"/>
  <line x1="75" y1="168" x2="145" y2="168" stroke="#059669" stroke-width="3.2"/>
  <line x1="75" y1="168" x2="75" y2="34" stroke="#7C3AED" stroke-width="2.4"/>
  <polygon points="75,30 71,39 79,39" fill="#7C3AED"/>
  <text x="82" y="42" font-family="monospace" font-size="10.5" font-weight="700" fill="#7C3AED">a⃗ × b⃗ (⊥ Area)</text>
  <text x="100" y="122" font-family="monospace" font-size="11" font-weight="700" fill="#DC2626">a⃗</text>
  <text x="195" y="182" font-family="monospace" font-size="11" font-weight="700" fill="#1E293B">b⃗</text>
  <text x="110" y="184" text-anchor="middle" font-family="monospace" font-size="9.5" font-weight="700" fill="#059669">(a⃗·b⃗)/|b⃗|</text>
  <text x="225" y="124" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1D4ED8">Area = |a⃗ × b⃗|</text>
  <text x="220" y="218" text-anchor="middle" font-family="monospace" font-size="10" fill="#334155">Lagrange: |a⃗×b⃗|² + (a⃗·b⃗)² = |a⃗|²|b⃗|² | Triangle = ½|a⃗×b⃗|</text>
</svg>`,
  },
  'math-v3-bayes-tree': {
    id: 'math-v3-bayes-tree',
    subjectId: 'maths',
    title: 'Bayes’ Theorem Partition Tree: Prior P(E_i) to Posterior P(E_k | A)',
    caption: 'Invert causal probability using Bayes ratio P(E_k)·P(A|E_k) divided by Law of Total Probability sum across all hypotheses.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="440" height="240" role="img" aria-label="Probability tree branching from sample space S to partition events E1 and E2 then conditional event A for Bayes Theorem">
  <rect width="440" height="240" fill="#FFFFFF" rx="8"/>
  <circle cx="52" cy="112" r="14" fill="#1E293B"/>
  <text x="52" y="116" text-anchor="middle" font-family="monospace" font-size="11" font-weight="700" fill="#FFFFFF">S</text>
  <line x1="66" y1="106" x2="165" y2="56" stroke="#1D4ED8" stroke-width="2.2"/>
  <line x1="66" y1="118" x2="165" y2="168" stroke="#A64B33" stroke-width="2.2"/>
  <text x="108" y="70" font-family="monospace" font-size="10" font-weight="700" fill="#1D4ED8">P(E₁)</text>
  <text x="108" y="158" font-family="monospace" font-size="10" font-weight="700" fill="#A64B33">P(E₂)</text>
  <rect x="165" y="40" width="52" height="30" rx="5" fill="#EFF6FF" stroke="#1D4ED8"/>
  <text x="191" y="59" text-anchor="middle" font-family="monospace" font-size="11" font-weight="700" fill="#1D4ED8">E₁</text>
  <rect x="165" y="152" width="52" height="30" rx="5" fill="#FEF2F2" stroke="#A64B33"/>
  <text x="191" y="171" text-anchor="middle" font-family="monospace" font-size="11" font-weight="700" fill="#A64B33">E₂</text>
  <line x1="217" y1="55" x2="315" y2="48" stroke="#059669" stroke-width="2.2"/>
  <line x1="217" y1="167" x2="315" y2="160" stroke="#059669" stroke-width="2.2"/>
  <text x="266" y="42" text-anchor="middle" font-family="monospace" font-size="9.5" font-weight="700" fill="#059669">P(A|E₁)</text>
  <text x="266" y="152" text-anchor="middle" font-family="monospace" font-size="9.5" font-weight="700" fill="#059669">P(A|E₂)</text>
  <rect x="315" y="34" width="92" height="30" rx="5" fill="#ECFDF5" stroke="#059669"/>
  <text x="361" y="53" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#059669">E₁ ∩ A</text>
  <rect x="315" y="146" width="92" height="30" rx="5" fill="#ECFDF5" stroke="#059669"/>
  <text x="361" y="165" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#059669">E₂ ∩ A</text>
  <text x="220" y="214" text-anchor="middle" font-family="monospace" font-size="10.5" font-weight="700" fill="#1E293B">P(E₁|A) = P(E₁)P(A|E₁) / [P(E₁)P(A|E₁) + P(E₂)P(A|E₂)]</text>
</svg>`,
  },
};
