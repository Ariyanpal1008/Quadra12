import {SubjectMarkingSchemeMap} from './types';

export const MATHS_MARKING_SCHEME: SubjectMarkingSchemeMap = {
  // Section A (Q1 – Q20, 1 Mark each)
  'math-2026-1': {
    questionId: 'math-2026-1',
    section: 'Section A · Q1',
    maxMarks: 1,
    exactModelAnswer:
      'Since sin⁻¹ x ∈ [−π/2, π/2], adding π shifts the range to [π/2, 3π/2], strictly increasing from y(−1) = π/2 through y(0) = π to y(1) = 3π/2. Thus y = π + sin⁻¹ x.',
    stepMarks: [{label: 'Inverse trig range shift identification', marks: 1}],
    finalAnswerValue: 'π + sin⁻¹ x',
    examinerCheckpoints: ['sin⁻¹ x range shifted by +π matches [π/2, 3π/2]'],
  },
  'math-2026-2': {
    questionId: 'math-2026-2',
    section: 'Section A · Q2',
    maxMarks: 1,
    exactModelAnswer:
      'For cosec⁻¹(3x), the argument must satisfy |3x| ≥ 1 ⇒ x ≤ −1/3 or x ≥ 1/3, giving (−∞, −1/3] ∪ [1/3, ∞).',
    stepMarks: [{label: 'Domain inequality |3x| ≥ 1', marks: 1}],
    finalAnswerValue: '(−∞, −1/3] ∪ [1/3, ∞)',
    examinerCheckpoints: ['Closed intervals at ±1/3'],
  },
  'math-2026-3': {
    questionId: 'math-2026-3',
    section: 'Section A · Q3',
    maxMarks: 1,
    exactModelAnswer:
      'cos⁻¹(1/2) = π/3 ⇒ ½(π/3) = π/6 ⇒ 2 sin(π/6) = 2(1/2) = 1 ⇒ tan⁻¹(1) = π/4.',
    stepMarks: [{label: 'Nested principal branch evaluation', marks: 1}],
    finalAnswerValue: 'π/4',
    examinerCheckpoints: ['Principal values respected'],
  },
  'math-2026-4': {
    questionId: 'math-2026-4',
    section: 'Section A · Q4',
    maxMarks: 1,
    exactModelAnswer:
      'For a skew-symmetric matrix A = −Aᵀ with A = [[0, 3a, −2], [−6, 0, b], [c, −2, 0]], equating off-diagonal pairs a_ij = −a_ji gives 3a = 6 ⇒ a = 2, c = 2, and b = 2. Hence a + b + c = 2 + 2 + 2 = 6.',
    stepMarks: [{label: 'Skew-symmetry entry matching (a_ij = −a_ji)', marks: 1}],
    finalAnswerValue: '6',
    examinerCheckpoints: ['a = 2, b = 2, c = 2 → a+b+c = 6'],
  },
  'math-2026-5': {
    questionId: 'math-2026-5',
    section: 'Section A · Q5',
    maxMarks: 1,
    exactModelAnswer:
      'Here P = [[3, 1], [0, 2]] ⇒ |P| = 6. With |Q| = 4, |PQ| = |P||Q| = 24. For a 2×2 matrix, |adj(PQ)| = |PQ|^(2−1) = 24.',
    stepMarks: [{label: 'Use |adj(A)| = |A|^(n−1) for n = 2', marks: 1}],
    finalAnswerValue: '24',
    examinerCheckpoints: ['|P| = 6', '|adj(PQ)| = 24'],
  },
  'math-2026-6': {
    questionId: 'math-2026-6',
    section: 'Section A · Q6',
    maxMarks: 1,
    exactModelAnswer:
      '[1  k] [[2, 0], [0, 3]] [[3], [−2]] = [1  k] [[6], [−6]] = 6 − 6k = 0 ⇒ k = 1.',
    stepMarks: [{label: 'Matrix multiplication & linear solve', marks: 1}],
    finalAnswerValue: '1',
    examinerCheckpoints: ['6 − 6k = 0 ⇒ k = 1'],
  },
  'math-2026-7': {
    questionId: 'math-2026-7',
    section: 'Section A · Q7',
    maxMarks: 1,
    exactModelAnswer:
      'Put x = tan θ (tan⁻¹ x = θ). Then sin⁻¹(2x/(1+x²)) = sin⁻¹(sin 2θ) = 2θ for |x| < 1. Derivative w.r.t. tan⁻¹ x (= θ) is d(2θ)/dθ = 2.',
    stepMarks: [{label: 'Trigonometric substitution & chain derivative', marks: 1}],
    finalAnswerValue: '2',
    examinerCheckpoints: ['2θ derivative w.r.t. θ = 2'],
  },
  'math-2026-8': {
    questionId: 'math-2026-8',
    section: 'Section A · Q8',
    maxMarks: 1,
    exactModelAnswer:
      'At x = 2: continuity requires 4a + b = 2b + c. Differentiability requires LHD = 2ax|_{x=2} = 4a equal RHD = b ⇒ b = 4a. Then 4a + 4a = 8a + c ⇒ c = 0. Thus (a, b, c) = (1, 4, 0) works.',
    stepMarks: [{label: 'Continuity & LHD = RHD equations at x = 2', marks: 1}],
    finalAnswerValue: '(1, 4, 0)',
    examinerCheckpoints: ['b = 4a', 'c = 0'],
  },
  'math-2026-9': {
    questionId: 'math-2026-9',
    section: 'Section A · Q9',
    maxMarks: 1,
    exactModelAnswer:
      'For f(x) = x + 2 cos x on [0, π]: f′(x) = 1 − 2 sin x < 0 ⇒ sin x > 1/2 ⇒ x ∈ (π/6, 5π/6).',
    stepMarks: [{label: 'First derivative test f′(x) < 0', marks: 1}],
    finalAnswerValue: '(π/6, 5π/6)',
    examinerCheckpoints: ['sin x > 1/2 on [0, π] ⇒ (π/6, 5π/6)'],
  },
  'math-2026-10': {
    questionId: 'math-2026-10',
    section: 'Section A · Q10',
    maxMarks: 1,
    exactModelAnswer:
      'Derivative 3x² > x³ ⇒ x²(3 − x) > 0. Since x² > 0 for x ≠ 0, we need 3 − x > 0 and x ≠ 0, i.e., x < 3, x ≠ 0 (x ∈ (−∞, 0) ∪ (0, 3)).',
    stepMarks: [{label: 'Polynomial inequality 3x² > x³', marks: 1}],
    finalAnswerValue: '(−∞, 0) ∪ (0, 3)',
    examinerCheckpoints: ['Exclude x = 0 where equality holds'],
  },
  'math-2026-11': {
    questionId: 'math-2026-11',
    section: 'Section A · Q11',
    maxMarks: 1,
    exactModelAnswer:
      'Equation: (d³y/dx³)² + x(dy/dx)⁵ = y⁴. Highest order derivative is 3 (order = 3) and its highest power is 2 (degree = 2).',
    stepMarks: [{label: 'Order & degree identification', marks: 1}],
    finalAnswerValue: 'Order 3, Degree 2',
    examinerCheckpoints: ['Order = 3, Degree = 2'],
  },
  'math-2026-12': {
    questionId: 'math-2026-12',
    section: 'Section A · Q12',
    maxMarks: 1,
    exactModelAnswer:
      '∫ 1/(1 + e³ˣ) dx = ∫ [1 − e³ˣ/(1 + e³ˣ)] dx = x − (1/3) ln(1 + e³ˣ) + C ⇒ K = 1/3.',
    stepMarks: [{label: 'Exponential integral decomposition', marks: 1}],
    finalAnswerValue: '1/3',
    examinerCheckpoints: ['K = 1/3'],
  },
  'math-2026-13': {
    questionId: 'math-2026-13',
    section: 'Section A · Q13',
    maxMarks: 1,
    exactModelAnswer:
      '|3î − pĵ + 4k̂| = √29 ⇒ 9 + p² + 16 = 29 ⇒ p² = 4 ⇒ p = ±2.',
    stepMarks: [{label: 'Vector norm equation', marks: 1}],
    finalAnswerValue: '±2',
    examinerCheckpoints: ['p² = 4 ⇒ p = ±2'],
  },
  'math-2026-14': {
    questionId: 'math-2026-14',
    section: 'Section A · Q14',
    maxMarks: 1,
    exactModelAnswer:
      'For v = √3 î + ĵ, magnitude |v| = √(3 + 1) = 2. Angle with positive x-axis: cos α = √3/2 ⇒ α = π/6.',
    stepMarks: [{label: 'Direction cosine cos α = a_x / |v|', marks: 1}],
    finalAnswerValue: 'π/6',
    examinerCheckpoints: ['cos α = √3/2 ⇒ π/6'],
  },
  'math-2026-15': {
    questionId: 'math-2026-15',
    section: 'Section A · Q15',
    maxMarks: 1,
    exactModelAnswer:
      '(2î + ĵ) × (î − k̂) = −î + 2ĵ − k̂, which is orthogonal to both vectors (dot product = 0). Any non-zero scalar multiple such as î − 2ĵ + k̂ is perpendicular to both.',
    stepMarks: [{label: 'Cross product orthogonality verification', marks: 1}],
    finalAnswerValue: 'î − 2ĵ + k̂',
    examinerCheckpoints: ['Dot product with both given vectors = 0'],
  },
  'math-2026-16': {
    questionId: 'math-2026-16',
    section: 'Section A · Q16',
    maxMarks: 1,
    exactModelAnswer:
      'With independent trials and P(fault) = 1/4, probability of all 3 tested items being defective = (1/4)³ = 1/64.',
    stepMarks: [{label: 'Independent multiplication rule (1/4)³', marks: 1}],
    finalAnswerValue: '1/64',
    examinerCheckpoints: ['(1/4)³ = 1/64'],
  },
  'math-2026-17': {
    questionId: 'math-2026-17',
    section: 'Section A · Q17',
    maxMarks: 1,
    exactModelAnswer:
      'When two dice show sum = 7: {(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)} (6 outcomes). Outcomes containing at least one 5: {(2,5),(5,2)} (2 outcomes). Conditional probability = 2/6 = 1/3.',
    stepMarks: [{label: 'Conditional probability P(E|F) = n(E∩F)/n(F)', marks: 1}],
    finalAnswerValue: '1/3',
    examinerCheckpoints: ['6 sum-7 pairs; 2 contain 5 → 1/3'],
  },
  'math-2026-18': {
    questionId: 'math-2026-18',
    section: 'Section A · Q18',
    maxMarks: 1,
    exactModelAnswer:
      'For independent events P(A) = 1/4, P(B) = p: P(exactly one) = P(A)P(B′) + P(A′)P(B) = (1/4)(1 − p) + (3/4)p = (1 + 2p)/4 = 1/2 ⇒ 1 + 2p = 2 ⇒ p = 1/2.',
    stepMarks: [{label: 'Independent exactly-one probability equation', marks: 1}],
    finalAnswerValue: '1/2',
    examinerCheckpoints: ['p = 1/2'],
  },
  'math-2026-19': {
    questionId: 'math-2026-19',
    section: 'Section A · Q19',
    maxMarks: 1,
    exactModelAnswer:
      '∫₋₂² |x − 3| dx = ∫₋₂² (3 − x) dx = [3x − x²/2]₋₂² = 12 (A is true). R states odd function integral ∫₋ₐᵃ f(x) dx = 0 (true property), yet |x − 3| is neither even nor odd on [−2, 2], so R does not explain A.',
    stepMarks: [{label: 'Definite integral check & odd-function property check', marks: 1}],
    finalAnswerValue: 'Both A and R are true, and R is not the correct explanation of A',
    examinerCheckpoints: ['Value = 12', 'Property true but inapplicable here'],
  },
  'math-2026-20': {
    questionId: 'math-2026-20',
    section: 'Section A · Q20',
    maxMarks: 1,
    exactModelAnswer:
      'Every square matrix A = ½(A + Aᵀ) + ½(A − Aᵀ) decomposes uniquely into symmetric + skew-symmetric parts (A is true). Reason R states diagonal elements of every skew-symmetric matrix are zero (true property), which does not by itself prove the decomposition theorem.',
    stepMarks: [{label: 'Matrix decomposition & skew-symmetric property check', marks: 1}],
    finalAnswerValue: 'Both A and R are true, and R is not the correct explanation of A',
    examinerCheckpoints: ['A = ½(A+Aᵀ)+½(A−Aᵀ)', 'Zero diagonal is true separately'],
  },

  // Section B (Q21 – Q25, 2 Marks each)
  'math-2026-21': {
    questionId: 'math-2026-21',
    section: 'Section B · Q21',
    maxMarks: 2,
    exactModelAnswer:
      'Rewrite I = ∫ dx / (x √(x⁸ − 1)) = ∫ (4x³ dx) / (4 x⁴ √((x⁴)² − 1)). Substitute t = x⁴ ⇒ dt = 4x³ dx.\nI = (1/4) ∫ dt / (t √(t² − 1)) = (1/4) sec⁻¹(t) + C = (1/4) sec⁻¹(x⁴) + C.',
    stepMarks: [
      {label: 'Multiply numerator/denominator by x³ & substitute t = x⁴', marks: 1},
      {label: 'Standard integral ∫ dt/(t√(t²−1)) = sec⁻¹ t ⇒ (1/4) sec⁻¹(x⁴) + C', marks: 1},
    ],
    finalAnswerValue: '(1/4) sec⁻¹(x⁴) + C',
    examinerCheckpoints: ['Substitution t = x⁴', 'Constant of integration + C'],
  },
  'math-2026-22': {
    questionId: 'math-2026-22',
    section: 'Section B · Q22',
    maxMarks: 2,
    exactModelAnswer:
      'Given eʸ (x + 2) = 1 ⇒ eʸ = 1/(x + 2), i.e., y = −ln(x + 2).\nDifferentiating: dy/dx = −1/(x + 2).\nDifferentiating again: d²y/dx² = 1/(x + 2)² = (−dy/dx)² = (dy/dx)². Proved.',
    stepMarks: [
      {label: 'Compute first derivative dy/dx = −1/(x + 2)', marks: 1},
      {label: 'Compute d²y/dx² = 1/(x + 2)² and show equality with (dy/dx)²', marks: 1},
    ],
    finalAnswerValue: 'd²y/dx² = (dy/dx)² proved',
    examinerCheckpoints: ['dy/dx = −(x+2)⁻¹', 'd²y/dx² = +(x+2)⁻² = (dy/dx)²'],
  },
  'math-2026-23': {
    questionId: 'math-2026-23',
    section: 'Section B · Q23',
    maxMarks: 2,
    exactModelAnswer:
      'Put lines in standard symmetric form:\nL₁: (x − 2)/3 = (y + 1)/(−4) = (z − 5)/6 (DRs: 3, −4, 6).\nL₂: (x − 1)/(−6) = (y + 3)/8 = (z − 2)/k (DRs: −6, 8, k).\nFor parallel lines, DRs are proportional: 3/(−6) = (−4)/8 = 6/k ⇒ −1/2 = 6/k ⇒ k = −12.',
    stepMarks: [
      {label: 'Convert both lines to standard Cartesian direction ratios', marks: 1},
      {label: 'Equate proportional DR ratios to obtain k = −12', marks: 1},
    ],
    finalAnswerValue: 'k = −12',
    examinerCheckpoints: ['DR sign check on L₂', 'k = −12'],
  },
  'math-2026-24': {
    questionId: 'math-2026-24',
    section: 'Section B · Q24',
    maxMarks: 2,
    exactModelAnswer:
      'Using Lagrange identity: |a × b|² + (a · b)² = |a|² |b|².\nSubstitute |a × b|² + (a · b)² = 196 and |a| = 7:\n49 |b|² = 196 ⇒ |b|² = 4 ⇒ |b| = 2 (since magnitude ≥ 0).',
    stepMarks: [
      {label: 'State identity |a × b|² + (a · b)² = |a|² |b|²', marks: 1},
      {label: 'Substitute values and solve |b| = 2', marks: 1},
    ],
    finalAnswerValue: '|b| = 2',
    examinerCheckpoints: ['sin²θ + cos²θ identity', '|b| = 2 positive'],
  },
  'math-2026-25': {
    questionId: 'math-2026-25',
    section: 'Section B · Q25',
    maxMarks: 2,
    exactModelAnswer:
      'Since feasible region lies in the 1st quadrant: x ≥ 0, y ≥ 0.\nLine 1 through (4, 0) & (0, 6): x/4 + y/6 = 1 ⇒ 3x + 2y ≤ 12 (towards origin).\nLine 2 through (6, 0) & (0, 2): x/6 + y/2 = 1 ⇒ x + 3y ≥ 6 (away from origin, if shaded above) or 3x + 2y ≤ 12, x + 3y ≤ 6 (matching bounded region below both lines).',
    stepMarks: [
      {label: 'Boundary line equations 3x + 2y = 12 and x + 3y = 6', marks: 1},
      {label: 'Correct inequality signs including x ≥ 0, y ≥ 0', marks: 1},
    ],
    finalAnswerValue: '3x + 2y ≤ 12, x + 3y ≤ 6, x ≥ 0, y ≥ 0',
    examinerCheckpoints: ['Two-intercept form line equations', 'Origin test for ≥ or ≤'],
  },

  // Section C (Q26 – Q31, 3 Marks each)
  'math-2026-26': {
    questionId: 'math-2026-26',
    section: 'Section C · Q26',
    maxMarks: 3,
    exactModelAnswer:
      'Given A = [[1, −1, 0], [2, 3, 4], [0, 1, 2]] and B = [[2, 2, −4], [−4, 2, −4], [2, −1, 5]].\nProduct AB = [[6, 0, 0], [0, 6, 0], [0, 0, 6]] = 6I₃ ⇒ A⁻¹ = (1/6) B.\nWriting the linear system as A X = [[3], [17], [7]], we get X = A⁻¹ [[3], [17], [7]] = (1/6)[[2, 2, −4], [−4, 2, −4], [2, −1, 5]] [[3], [17], [7]] = (1/6)[[12], [−6], [24]] = [[2], [−1], [4]].\nHence x = 2, y = −1, z = 4.',
    stepMarks: [
      {label: 'Compute matrix product AB = 6I₃ accurately', marks: 1},
      {label: 'Deduce A⁻¹ = (1/6) B and set up X = A⁻¹ C', marks: 1},
      {label: 'Solve unique values x = 2, y = −1, z = 4', marks: 1},
    ],
    finalAnswerValue: 'AB = 6I₃; x = 2, y = −1, z = 4',
    examinerCheckpoints: ['AB = 6I₃ verified', 'x = 2, y = −1, z = 4'],
  },
  'math-2026-27': {
    questionId: 'math-2026-27',
    section: 'Section C · Q27',
    maxMarks: 3,
    exactModelAnswer:
      'Inverted cone has semi-vertical angle α with r/h = 3/6 = 1/2 ⇒ r = h/2.\nVolume V = (1/3)π r² h = (1/3)π (h/2)² h = (π/12) h³.\nDifferentiate w.r.t. t: dV/dt = (π/4) h² (dh/dt).\nGiven dV/dt = +4 cm³/s and h = 3 cm:\n4 = (π/4)(9)(dh/dt) ⇒ dh/dt = 16/(9π) cm/s.',
    stepMarks: [
      {label: 'Relate radius to height r = h/2 and substitute V = (π/12) h³', marks: 1},
      {label: 'Differentiate w.r.t. time t: dV/dt = (π/4) h² (dh/dt)', marks: 1},
      {label: 'Evaluate dh/dt = 16/(9π) cm/s at h = 3 cm with unit', marks: 1},
    ],
    finalAnswerValue: 'dh/dt = 16 / (9π) cm/s',
    examinerCheckpoints: ['r = h/2 elimination', 'dV/dt = 4 cm³/s', 'Unit cm/s'],
  },
  'math-2026-28': {
    questionId: 'math-2026-28',
    section: 'Section C · Q28',
    maxMarks: 3,
    exactModelAnswer:
      'Given x = a(cos t + ln tan(t/2)), y = a sin t.\ndx/dt = a(−sin t + 1/(sin(t/2)cos(t/2)) · ½) = a(−sin t + 1/sin t) = a cos²t / sin t.\ndy/dt = a cos t.\ndy/dx = (dy/dt)/(dx/dt) = tan t.\nDifferentiate w.r.t. x: d²y/dx² = sec²t · (dt/dx) = sec²t · [sin t / (a cos²t)] = sin t / (a cos⁴t).\nAt t = π/4: sin(π/4) = 1/√2, cos⁴(π/4) = 1/4 ⇒ d²y/dx² = (1/√2)/(a/4) = 4/(a√2) = 2√2 / a.',
    stepMarks: [
      {label: 'Calculate dx/dt = a cos²t/sin t and dy/dt = a cos t ⇒ dy/dx = tan t', marks: 1.5},
      {label: 'Chain rule for second derivative d²y/dx² = (sec²t)/(dx/dt)', marks: 1},
      {label: 'Evaluate exact value 2√2 / a at t = π/4', marks: 0.5},
    ],
    finalAnswerValue: 'd²y/dx²|_{π/4} = 2√2 / a',
    examinerCheckpoints: ['dy/dx = tan t', 'Remember dt/dx chain factor', '2√2 / a'],
  },
  'math-2026-29': {
    questionId: 'math-2026-29',
    section: 'Section C · Q29',
    maxMarks: 3,
    exactModelAnswer:
      'Linear DE: dy/dx + (2/x) y = x cos x.\nIntegrating Factor IF = e^(∫ 2/x dx) = e^(2 ln x) = x².\nMultiply through & integrate: y · x² = ∫ x³ cos x dx.\nUsing integration by parts repeatedly: ∫ x³ cos x dx = x³ sin x + 3x² cos x − 6x sin x − 6 cos x + C.\nHence y = x sin x + 3 cos x − (6 sin x)/x − (6 cos x)/x² + C x⁻².',
    stepMarks: [
      {label: 'Standard linear form & Integrating Factor IF = x²', marks: 1},
      {label: 'Product rule integral y·x² = ∫ x³ cos x dx', marks: 0.5},
      {label: 'Accurate repeated integration by parts + constant C', marks: 1.5},
    ],
    finalAnswerValue: 'x² y = x³ sin x + 3x² cos x − 6x sin x − 6 cos x + C',
    examinerCheckpoints: ['IF = x²', 'Repeated IBP signs correct', '+ C'],
  },
  'math-2026-30': {
    questionId: 'math-2026-30',
    section: 'Section C · Q30',
    maxMarks: 3,
    exactModelAnswer:
      'Line L: (x − 1)/2 = (y − 2)/3 = (z − 3)/4 = λ gives general point M(2λ + 1, 3λ + 2, 4λ + 3). Given point P(0, −3, 0).\nVector PM = (2λ + 1, 3λ + 5, 4λ + 3). Since PM ⊥ b(2, 3, 4):\n2(2λ + 1) + 3(3λ + 5) + 4(4λ + 3) = 0 ⇒ 29λ + 29 = 0 ⇒ λ = −1.\nFoot of perpendicular M = (−1, −1, −1).\nVector PM = (−1, 2, −1) ⇒ Length |PM| = √((−1)² + 2² + (−1)²) = √6 units.',
    stepMarks: [
      {label: 'Parametric general point M on the line in terms of λ', marks: 1},
      {label: 'Dot product PM · b = 0 to solve λ = −1', marks: 1},
      {label: 'Exact coordinates M(−1, −1, −1) and perpendicular distance √6 units', marks: 1},
    ],
    finalAnswerValue: 'Foot M(−1, −1, −1); Distance = √6 units',
    examinerCheckpoints: ['PM · (2, 3, 4) = 0', 'M = (−1, −1, −1)', '|PM| = √6'],
  },
  'math-2026-31': {
    questionId: 'math-2026-31',
    section: 'Section C · Q31',
    maxMarks: 3,
    exactModelAnswer:
      'Constraints: 2x + y ≥ 6, x + 2y ≥ 8, x ≥ 0, y ≥ 0. Objective: Minimize Z = 300x + 400y.\nIntersection of 2x + y = 6 and x + 2y = 8: (x, y) = (4/3, 10/3).\nUnbounded feasible region corner points:\n• A(0, 6): Z = 2400\n• B(4/3, 10/3): Z = 400 + 4000/3 = 5200/3 ≈ 1733.33\n• C(8, 0): Z = 2400.\nTest open half-plane 300x + 400y < 5200/3: since all coefficients > 0 and unbounded region extends right/up, it has NO common point with the feasible region. Minimum Z = 5200/3 at (4/3, 10/3).',
    stepMarks: [
      {label: 'Accurate feasible region graph & intersection corner point (4/3, 10/3)', marks: 1},
      {label: 'Corner point evaluation table for Z = 300x + 400y', marks: 1},
      {label: 'Unbounded region half-plane check & minimum Z = 5200/3', marks: 1},
    ],
    finalAnswerValue: 'Minimum Z = 5200/3 (≈ 1733.33) at (4/3, 10/3)',
    examinerCheckpoints: ['Corner points (0,6), (4/3, 10/3), (8,0)', 'Unbounded check done'],
  },

  // Section D (Q32 – Q35 Long Answer, 5 Marks each)
  'math-2026-32': {
    questionId: 'math-2026-32',
    section: 'Section D · Q32',
    maxMarks: 5,
    exactModelAnswer:
      'Relation R on N × N: (a, b) R (c, d) ⇔ ad = bc.\n(1) Reflexive: For all (a, b) ∈ N × N, ab = ba ⇒ (a, b) R (a, b).\n(2) Symmetric: (a, b) R (c, d) ⇒ ad = bc ⇒ cb = da ⇒ (c, d) R (a, b).\n(3) Transitive: If ad = bc and cf = de (with positive natural numbers), multiplying gives (ad)(cf) = (bc)(de) ⇒ dividing both sides by cd ≠ 0 gives af = be ⇒ (a, b) R (e, f).\nHence R is an equivalence relation. Equivalence class [(2, 3)] = {(c, d) ∈ N × N : 2d = 3c} = {(2, 3), (4, 6), (6, 9), (8, 12), ...}.',
    stepMarks: [
      {label: 'Prove Reflexivity on N × N', marks: 1},
      {label: 'Prove Symmetry clearly', marks: 1},
      {label: 'Prove Transitivity using ratios or nonzero natural multiplication', marks: 1.5},
      {label: 'Write elements of Equivalence Class [(2, 3)]', marks: 1.5},
    ],
    finalAnswerValue: 'Equivalence relation proved; [(2, 3)] = {(2k, 3k) : k ∈ N} = {(2, 3), (4, 6), (6, 9), ...}',
    examinerCheckpoints: ['Reflexive, Symmetric, Transitive separately proved', 'Equivalence class listed'],
  },
  'math-2026-33': {
    questionId: 'math-2026-33',
    section: 'Section D · Q33',
    maxMarks: 5,
    exactModelAnswer:
      'Evaluate I = ∫₀^(π/2) x / (sin x + cos x) dx.\nUsing King’s property ∫₀^a f(x) dx = ∫₀^a f(a − x) dx:\nI = ∫₀^(π/2) (π/2 − x) / (cos x + sin x) dx.\nAdding both gives 2I = (π/2) ∫₀^(π/2) dx / (sin x + cos x).\nWrite sin x + cos x = √2 cos(x − π/4).\n2I = π/(2√2) ∫₀^(π/2) sec(x − π/4) dx = π/(2√2) [ln|sec(x − π/4) + tan(x − π/4)|]₀^(π/2)\n= π/(2√2) [ln(√2 + 1) − ln(√2 − 1)] = π/(2√2) ln((√2 + 1)² / 1) = (π / √2) ln(√2 + 1).\nHence I = [π / (2√2)] ln(√2 + 1).',
    stepMarks: [
      {label: 'Apply King’s property and add to eliminate x in numerator (2I)', marks: 1.5},
      {label: 'Rewrite sin x + cos x = √2 cos(x − π/4)', marks: 1},
      {label: 'Integrate sec(x − π/4) carefully with limits 0 to π/2', marks: 1.5},
      {label: 'Simplify logarithms to I = [π/(2√2)] ln(√2 + 1)', marks: 1},
    ],
    finalAnswerValue: 'I = [π / (2√2)] ln(√2 + 1)',
    examinerCheckpoints: ['King property used cleanly', 'Limit evaluation & log simplification'],
  },
  'math-2026-34': {
    questionId: 'math-2026-34',
    section: 'Section D · Q34',
    maxMarks: 5,
    exactModelAnswer:
      'Find area bounded by parabola y² = 4x and line 2x − y = 4 (i.e., y = 2x − 4).\nIntersections: (2x − 4)² = 4x ⇒ 4x² − 16x + 16 = 4x ⇒ x² − 5x + 4 = 0 ⇒ x = 1, x = 4.\nPoints: (1, −2) and (4, 4).\nExpress x in terms of y: parabola x = y²/4; line x = (y + 4)/2.\nArea A = ∫₋₂⁴ [(y + 4)/2 − y²/4] dy = [y²/4 + 2y − y³/12]₋₂⁴\nAt y = 4: 4 + 8 − 64/12 = 12 − 16/3 = 20/3.\nAt y = −2: 1 − 4 − (−8/12) = −3 + 2/3 = −7/3.\nArea = 20/3 − (−7/3) = 27/3 = 9 sq. units.',
    stepMarks: [
      {label: 'Find intersection points (1, −2) and (4, 4) + rough sketch', marks: 1.5},
      {label: 'Set up horizontal strip integral ∫₋₂⁴ (x_line − x_parabola) dy', marks: 1.5},
      {label: 'Integrate and compute exact Area = 9 sq. units', marks: 2},
    ],
    finalAnswerValue: 'Area = 9 sq. units',
    examinerCheckpoints: ['Points (1, −2) and (4, 4)', 'Horizontal strip dy preferred', '9 sq. units'],
  },
  'math-2026-35': {
    questionId: 'math-2026-35',
    section: 'Section D · Q35',
    maxMarks: 5,
    exactModelAnswer:
      'Events: E₁ (condition present, P(E₁) = 0.05), E₂ (healthy, P(E₂) = 0.95). Positive screen A:\nP(A|E₁) = 0.95 (sensitivity), P(A|E₂) = 0.02 (false positive).\nBy Bayes’ Theorem:\nP(E₁|A) = [0.05 × 0.95] / [0.05 × 0.95 + 0.95 × 0.02] = 0.0475 / 0.0665 = 475 / 665 = 5 / 7 ≈ 0.714 (71.4%).',
    stepMarks: [
      {label: 'Define events E₁, E₂, A with all prior & conditional probabilities', marks: 1.5},
      {label: 'State Bayes’ Theorem formula', marks: 1},
      {label: 'Correct substitution & simplification P(E₁|A) = 5/7 (≈ 0.714)', marks: 2.5},
    ],
    finalAnswerValue: 'P(Disease | Positive Test) = 5/7 (≈ 0.714)',
    examinerCheckpoints: ['P(E₁)=0.05, P(E₂)=0.95', 'Denominator includes false positive', '5/7'],
  },

  // Section E (Q36 – Q38 Case Studies, 4 Marks each)
  'math-2026-36': {
    questionId: 'math-2026-36',
    section: 'Section E · Q36',
    maxMarks: 4,
    exactModelAnswer:
      'Drone paths:\nL₁: r = (î + 2ĵ + k̂) + λ(î − ĵ + k̂)\nL₂: r = (2î − ĵ − k̂) + μ(2î + ĵ + 2k̂).\nPosition difference a₂ − a₁ = î − 3ĵ − 2k̂.\nCross product b₁ × b₂ = |î  ĵ  k̂; 1 −1 1; 2 1 2| = −3î + 0ĵ + 3k̂.\nMagnitude |b₁ × b₂| = √((−3)² + 0² + 3²) = 3√2.\nScalar triple product |(a₂ − a₁) · (b₁ × b₂)| = |(1)(−3) + (−3)(0) + (−2)(3)| = |−9| = 9.\nShortest distance d = 9 / (3√2) = 3 / √2 = 3√2 / 2 units (≈ 2.12 units).',
    stepMarks: [
      {label: '(i) Extract position vectors a₁, a₂ and direction vectors b₁, b₂', marks: 1},
      {label: '(ii) Verify skew lines (b₁ ≠ k b₂ & non-zero scalar triple product) + b₁ × b₂', marks: 1.5},
      {label: '(iii) Shortest distance formula and final value d = 3√2 / 2 units', marks: 1.5},
    ],
    finalAnswerValue: 'Skew lines; b₁ × b₂ = −3î + 3k̂; Shortest distance = 3√2 / 2 units',
    examinerCheckpoints: ['Cross product b₁ × b₂', 'Numerator |(a₂−a₁)·(b₁×b₂)| = 9', 'd = 3√2/2'],
  },
  'math-2026-37': {
    questionId: 'math-2026-37',
    section: 'Section E · Q37',
    maxMarks: 4,
    exactModelAnswer:
      'Solar microgrid yield: Y(T) = 48 + 3.6 T − 0.03 T².\n(i) Rate of change dY/dT = 3.6 − 0.06 T.\n(ii) Critical point dY/dT = 0 ⇒ 0.06 T = 3.6 ⇒ T = 60 °C.\nSecond derivative test: d²Y/dT² = −0.06 < 0 ⇒ T = 60 °C yields local/global MAXIMUM.\n(iii) Maximum yield Y(60) = 48 + 3.6(60) − 0.03(3600) = 48 + 216 − 108 = 156 units.',
    stepMarks: [
      {label: '(i) First derivative Y′(T) = 3.6 − 0.06 T', marks: 1},
      {label: '(ii) Critical point T = 60 °C verified as maximum using Y″(T) = −0.06 < 0', marks: 1.5},
      {label: '(iii) Maximum power yield Y(60) = 156 units', marks: 1.5},
    ],
    finalAnswerValue: 'Y′(T) = 3.6 − 0.06 T; Critical T = 60 °C (max); Max Yield = 156',
    examinerCheckpoints: ['dY/dT = 3.6 − 0.06T', 'Second derivative negative', 'Y(60) = 156'],
  },
  'math-2026-38': {
    questionId: 'math-2026-38',
    section: 'Section E · Q38',
    maxMarks: 4,
    exactModelAnswer:
      'Let unit prices (₹) of Notebooks (x), Pens (y), and Lab Manuals (z) satisfy:\nKit A: 2x + 3y + z = 650\nKit B: x + 2y + 3z = 610\nKit C: 3x + y + 2z = 600.\nMatrix equation A X = B where A = [[2,3,1],[1,2,3],[3,1,2]].\n|A| = 2(4 − 3) − 3(2 − 9) + 1(1 − 6) = 2 + 21 − 5 = 18 ≠ 0.\nadj(A) = [[1, −5, 7], [7, 1, −5], [−5, 7, 1]].\nX = (1/18) adj(A) [[650], [610], [600]] = (1/18) [[650 − 3050 + 4200], [4550 + 610 − 3000], [−3250 + 4270 + 600]] = (1/18) [[1800], [2160], [1620]] = [[100], [120], [90]].\nPrices: Notebook ₹100, Pen ₹120, Lab Manual ₹90.',
    stepMarks: [
      {label: '(i) Linear system AX = B formulation', marks: 1},
      {label: '(ii) Determinant |A| = 18 ≠ 0 (invertible)', marks: 1},
      {label: '(iii) Adjoint/Inverse A⁻¹ and solved unit prices x = ₹100, y = ₹120, z = ₹90', marks: 2},
    ],
    finalAnswerValue: '|A| = 18; Notebook ₹100, Pen ₹120, Lab Manual ₹90',
    examinerCheckpoints: ['|A| = 18', 'Correct adjoint matrix', 'x=100, y=120, z=90'],
  },
};
