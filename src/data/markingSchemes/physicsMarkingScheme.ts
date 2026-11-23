import {SubjectMarkingSchemeMap} from './types';

export const PHYSICS_MARKING_SCHEME: SubjectMarkingSchemeMap = {
  // Section A (Q1 – Q16)
  'phy-2026-1': {
    questionId: 'phy-2026-1',
    section: 'Section A · Q1',
    maxMarks: 1,
    exactModelAnswer:
      'By Gauss’s Law, Φ_E = q_enclosed / ε₀. Tripling the Gaussian sphere radius from r to 3r does not alter the enclosed charge +2q, so the total flux remains unchanged.',
    stepMarks: [{label: 'Correct law & independence of radius', marks: 1}],
    finalAnswerValue: 'Remains unchanged (2q / ε₀)',
    examinerCheckpoints: ['State Gauss’s Law Φ = q_in / ε₀', 'Flux independent of surface size'],
  },
  'phy-2026-2': {
    questionId: 'phy-2026-2',
    section: 'Section A · Q2',
    maxMarks: 1,
    exactModelAnswer:
      'In parallel across the rated 240 V mains, both appliances receive 240 V independently. P_total = P₁ + P₂ = 1200 W + 800 W = 2000 W.',
    stepMarks: [{label: 'Parallel power addition P = P₁ + P₂', marks: 1}],
    finalAnswerValue: '2000 W',
    examinerCheckpoints: ['Both heaters operate at full rated 240 V'],
  },
  'phy-2026-3': {
    questionId: 'phy-2026-3',
    section: 'Section A · Q3',
    maxMarks: 1,
    exactModelAnswer:
      'A uniform steady magnetic field produces constant flux (dΦ_B/dt = 0) through the coaxial solenoid. By Faraday’s Law, induced emf e = −dΦ_B/dt = 0, so zero current is induced.',
    stepMarks: [{label: 'Zero rate of change of magnetic flux', marks: 1}],
    finalAnswerValue: 'No current is induced',
    examinerCheckpoints: ['dΦ_B/dt = 0 in steady field'],
  },
  'phy-2026-4': {
    questionId: 'phy-2026-4',
    section: 'Section A · Q4',
    maxMarks: 1,
    exactModelAnswer:
      'In B_y = 2.0 × 10⁻⁷ sin(0.5π × 10³ z + 1.5π × 10¹¹ t), the phase is (kz + ωt), indicating propagation in the negative z-direction (−k̂).',
    stepMarks: [{label: 'Wave propagation sign rule (kz + ωt → −z)', marks: 1}],
    finalAnswerValue: '−k̂ (negative z-axis)',
    examinerCheckpoints: ['Same sign of z and t terms denotes −z direction'],
  },
  'phy-2026-5': {
    questionId: 'phy-2026-5',
    section: 'Section A · Q5',
    maxMarks: 1,
    exactModelAnswer:
      'Huygens’ secondary wavelet theory explains reflection, refraction, interference, and diffraction, but cannot account for the quantum emission of photoelectric electrons.',
    stepMarks: [{label: 'Wave vs photon quantum limitation', marks: 1}],
    finalAnswerValue: 'Photoelectric emission',
    examinerCheckpoints: ['Photoelectric effect requires Planck-Einstein photon model'],
  },
  'phy-2026-6': {
    questionId: 'phy-2026-6',
    section: 'Section A · Q6',
    maxMarks: 1,
    exactModelAnswer:
      'A narrow linear slit acts as a line source of light, emitting secondary wavelets tangent to concentric cylinders around the slit axis, producing a cylindrical wavefront.',
    stepMarks: [{label: 'Line source wavefront geometry', marks: 1}],
    finalAnswerValue: 'Cylindrical wavefront',
    examinerCheckpoints: ['Narrow slit → cylindrical wavefront'],
  },
  'phy-2026-7': {
    questionId: 'phy-2026-7',
    section: 'Section A · Q7',
    maxMarks: 1,
    exactModelAnswer:
      'The maximum binding energy per nucleon (~8.75 MeV near Fe-56 / Ni-62) signifies maximum nuclear binding stability, making medium-mass nuclei resistant to spontaneous fission or fusion.',
    stepMarks: [{label: 'BE/A maximum stability interpretation', marks: 1}],
    finalAnswerValue: 'Most tightly bound and maximally stable nuclei',
    examinerCheckpoints: ['Peak BE/A corresponds to greatest stability'],
  },
  'phy-2026-8': {
    questionId: 'phy-2026-8',
    section: 'Section A · Q8',
    maxMarks: 1,
    exactModelAnswer:
      'Below critical temperature T_c, niobium becomes a superconductor exhibiting perfect diamagnetism (Meissner effect, χ = −1). It develops a magnetic moment opposite to the external magnet and moves away (repelled).',
    stepMarks: [{label: 'Meissner effect & repulsion', marks: 1}],
    finalAnswerValue: 'Pushed away; magnetic moment opposite to magnet field',
    examinerCheckpoints: ['Superconductors are perfect diamagnets'],
  },
  'phy-2026-9': {
    questionId: 'phy-2026-9',
    section: 'Section A · Q9',
    maxMarks: 1,
    exactModelAnswer:
      'Ratio check: R₁/R₂ = 4/8 = 1/2 and R₃/R₄ = 2/4 = 1/2. The bridge is balanced, so zero current passes through the 7 Ω arm. Top branch = 4 + 8 = 12 Ω; bottom branch = 2 + 4 = 6 Ω. R_eq = (12 × 6)/(12 + 6) = 4 Ω. Total current I = 12 V / 4 Ω = 3 A.',
    stepMarks: [{label: 'Balanced bridge check & I = V / R_eq', marks: 1}],
    finalAnswerValue: '3 A',
    examinerCheckpoints: ['4/8 = 2/4 balanced', 'R_eq = 4 Ω', 'I = 3 A'],
  },
  'phy-2026-10': {
    questionId: 'phy-2026-10',
    section: 'Section A · Q10',
    maxMarks: 1,
    exactModelAnswer:
      'Rated filament resistance R = V² / P. Since both lamps are rated at 220 V, R₁/R₂ = P₂/P₁ = 100 W / 40 W = 5 : 2.',
    stepMarks: [{label: 'Inverse relation R ∝ 1/P at equal V_rated', marks: 1}],
    finalAnswerValue: '5 : 2',
    examinerCheckpoints: ['R = V²/P', 'Ratio 100/40 = 5:2'],
  },
  'phy-2026-11': {
    questionId: 'phy-2026-11',
    section: 'Section A · Q11',
    maxMarks: 1,
    exactModelAnswer:
      'Atomic radius (~10⁻¹⁰ m) is 10⁵ times nuclear radius (~10⁻¹⁵ m). Scaling 3.6 cm (= 0.036 m) by 10⁵ yields 3600 m = 3.6 km.',
    stepMarks: [{label: '10⁵ scale ratio calculation', marks: 1}],
    finalAnswerValue: '3.6 km',
    examinerCheckpoints: ['Scale factor 10⁵', '0.036 × 10⁵ m = 3.6 km'],
  },
  'phy-2026-12': {
    questionId: 'phy-2026-12',
    section: 'Section A · Q12',
    maxMarks: 1,
    exactModelAnswer:
      'Straight wire segments point directly through center O (Biot–Savart contribution = 0). Semicircle contribution B = (1/2)(μ₀ I / 2r) = (4π × 10⁻⁷ × 3) / (4 × 0.05) = 6π × 10⁻⁶ T = 6π μT.',
    stepMarks: [{label: 'Biot–Savart semicircle formula & SI evaluation', marks: 1}],
    finalAnswerValue: '6π μT',
    examinerCheckpoints: ['B = μ₀I / (4r)', 'r = 0.05 m gives 6π μT'],
  },
  'phy-2026-13': {
    questionId: 'phy-2026-13',
    section: 'Section A · Q13',
    maxMarks: 1,
    exactModelAnswer:
      'Assertion (A) is true because >99.8% of the atom is empty space. Reason (R) is false because light electrons cannot backscatter heavy α-particles; large deflections are due to the dense positively charged nucleus.',
    stepMarks: [{label: 'Assertion true, Reason false identification', marks: 1}],
    finalAnswerValue: 'A is true but R is false',
    examinerCheckpoints: ['Electrons are too light to cause large-angle α-recoil'],
  },
  'phy-2026-14': {
    questionId: 'phy-2026-14',
    section: 'Section A · Q14',
    maxMarks: 1,
    exactModelAnswer:
      'By Lens Maker’s formula, 1/f = (n_lens/n_med − 1)(1/R₁ − 1/R₂). When n_med = 1.65 > n_lens = 1.50, (n_lens/n_med − 1) turns negative, reversing convex convergence into divergence. Both A and R are true and R explains A.',
    stepMarks: [{label: 'Relative refractive index inversion', marks: 1}],
    finalAnswerValue: 'Both A and R are true and R is the correct explanation of A',
    examinerCheckpoints: ['n_glass < n_CS₂ reverses sign of focal length'],
  },
  'phy-2026-15': {
    questionId: 'phy-2026-15',
    section: 'Section A · Q15',
    maxMarks: 1,
    exactModelAnswer:
      'Fringe width β = λD/d = (600 × 10⁻⁹ × 1.5)/(0.30 × 10⁻³) = 3.0 × 10⁻³ m = 3.0 mm (A is true). However, β is proportional to D and inversely proportional to d, so R is false.',
    stepMarks: [{label: 'β = λD/d calculation and proportionality check', marks: 1}],
    finalAnswerValue: 'A is true but R is false',
    examinerCheckpoints: ['β = 3.0 mm', 'β ∝ 1/d'],
  },
  'phy-2026-16': {
    questionId: 'phy-2026-16',
    section: 'Section A · Q16',
    maxMarks: 1,
    exactModelAnswer:
      'Inside a closed metallic conductor cavity without charge, electric field vanishes everywhere (electrostatic shielding) because free surface charges induce an equal and opposite internal field canceling the external field.',
    stepMarks: [{label: 'Electrostatic equilibrium shielding proof', marks: 1}],
    finalAnswerValue: 'Both A and R are true and R is the correct explanation of A',
    examinerCheckpoints: ['Net internal E = 0 in static equilibrium'],
  },

  // Section B (Q17 – Q21, 2 Marks each)
  'phy-2026-17': {
    questionId: 'phy-2026-17',
    section: 'Section B · Q17',
    maxMarks: 2,
    exactModelAnswer:
      '(I) From E_y = 60 sin(3π×10¹⁸ t + 1.5π×10¹⁰ x), ω = 3π×10¹⁸ rad/s and k = 1.5π×10¹⁰ m⁻¹. Wave speed v = ω/k = 2.0 × 10⁸ m/s. Refractive index n = c/v = (3×10⁸)/(2×10⁸) = 1.5.\n(II) Frequency ν = ω/(2π) = (3π×10¹⁸)/(2π) = 1.5 × 10¹⁸ Hz, which lies in the X-ray region of the EM spectrum.',
    stepMarks: [
      {label: 'Identify ω and k & compute wave speed v = ω/k', marks: 0.5},
      {label: 'Refractive index n = c/v = 1.5', marks: 0.5},
      {label: 'Calculate frequency ν = 1.5 × 10¹⁸ Hz', marks: 0.5},
      {label: 'Correct EM region identification (X-rays)', marks: 0.5},
    ],
    finalAnswerValue: 'n = 1.5; ν = 1.5 × 10¹⁸ Hz (X-rays)',
    examinerCheckpoints: ['n = 1.5 dimensionless', 'ν = 1.5 × 10¹⁸ Hz', 'X-rays'],
  },
  'phy-2026-18': {
    questionId: 'phy-2026-18',
    section: 'Section B · Q18',
    maxMarks: 2,
    exactModelAnswer:
      '(a) Absence of external electric field: Conduction electrons undergo random thermal motion and follow straight-line paths between successive ionic collisions (net average displacement = 0).\n(b) Presence of electric field: Electrons experience constant electrostatic force F = −eE opposite to E, tracing slightly curved parabolic paths between collisions with a net drift toward the positive potential.',
    stepMarks: [
      {label: '(a) Straight-line paths in absence of E-field', marks: 1},
      {label: '(b) Curved/parabolic paths opposite E in presence of E-field', marks: 1},
    ],
    finalAnswerValue: 'Straight lines (E = 0); Curved/Parabolic opposite to E (E ≠ 0)',
    examinerCheckpoints: ['Straight line when E=0', 'Curved/parabolic opposite E when E≠0'],
  },
  'phy-2026-19': {
    questionId: 'phy-2026-19',
    section: 'Section B · Q19',
    maxMarks: 2,
    exactModelAnswer:
      'Midpoint lies at distance a from each +2q charge. Net electrostatic potential at midpoint V = (1/4πε₀)(2q/a) + (1/4πε₀)(2q/a) = q / (πε₀a). External work done to bring test charge +q from infinity (V_∞ = 0) to midpoint: W = q · V = q² / (πε₀a).',
    stepMarks: [
      {label: 'Formula for electrostatic potential at midpoint due to two charges', marks: 0.5},
      {label: 'Compute net V_mid = q / (πε₀a)', marks: 0.5},
      {label: 'Work formula W = q·(V_mid − V_∞)', marks: 0.5},
      {label: 'Final expression q² / (πε₀a) with correct algebraic factor', marks: 0.5},
    ],
    finalAnswerValue: 'W = q² / (πε₀a)',
    examinerCheckpoints: ['Distance a from each charge', 'V_mid = q/(πε₀a)', 'W = q²/(πε₀a)'],
  },
  'phy-2026-20': {
    questionId: 'phy-2026-20',
    section: 'Section B · Q20',
    maxMarks: 2,
    exactModelAnswer:
      'Critical angle for glass-air (n = 1.5): sin i_c = 1/1.5 = 2/3 ⇒ i_c ≈ 41.8°. Ray entering hypotenuse normally passes undeviated, strikes the two 45° slanted faces at angle of incidence i = 45° > i_c, undergoes total internal reflection twice (90° + 90° = 180°), and exits parallel and opposite to the incident ray.',
    stepMarks: [
      {label: 'Neat ray diagram showing 45°-90°-45° prism with incident normal rays & arrows', marks: 1},
      {label: 'Verify i = 45° > i_c ≈ 41.8° at both reflecting faces', marks: 1},
    ],
    finalAnswerValue: '180° deviation via two TIR reflections at 45° (> 41.8°)',
    examinerCheckpoints: ['Arrows shown on rays', 'i_c ≈ 41.8° verified', '180° turn shown clearly'],
  },
  'phy-2026-21': {
    questionId: 'phy-2026-21',
    section: 'Section B · Q21',
    maxMarks: 2,
    exactModelAnswer:
      'Drift velocity: Force F = −eE produces acceleration a = −eE/m. Averaging over all free electrons with mean relaxation time τ between collisions, v_d = a·τ = −(eEτ)/m (magnitude v_d = eEτ/m).\n(OR) Forward bias (V > V_knee ~0.7 V Si): exponential current rise; Reverse bias: tiny μA saturation current until Zener/avalanche breakdown voltage.',
    stepMarks: [
      {label: 'Acceleration expression a = −eE/m', marks: 0.5},
      {label: 'Definition of relaxation time τ and thermal average v_avg = 0', marks: 0.5},
      {label: 'Final derivation v_d = −(eEτ)/m', marks: 1},
    ],
    finalAnswerValue: 'v_d = eEτ / m (opposite to E)',
    examinerCheckpoints: ['a = −eE/m', 'Average thermal velocity = 0', 'v_d = −(eE/m)τ'],
  },

  // Section C (Q22 – Q28, 3 Marks each)
  'phy-2026-22': {
    questionId: 'phy-2026-22',
    section: 'Section C · Q22',
    maxMarks: 3,
    exactModelAnswer:
      'Dipole of charges +q and −q separated by 2a at angle θ to uniform E: Force on +q is +qE and on −q is −qE (net F = 0). Forces form a couple with perpendicular lever arm 2a sin θ. Torque τ = (qE)(2a sin θ) = pE sin θ, or τ = p × E. Stable equilibrium: θ = 0° (p ∥ E, U = −pE minimum); Unstable equilibrium: θ = 180° (p anti-parallel to E, U = +pE maximum).',
    stepMarks: [
      {label: 'Labeled diagram showing +q, −q, forces ±qE, and moment arm 2a sin θ', marks: 1},
      {label: 'Couple torque derivation τ = pE sin θ = p × E', marks: 1},
      {label: 'Stable (θ = 0°) and unstable (θ = 180°) equilibrium conditions', marks: 1},
    ],
    finalAnswerValue: 'τ = p × E; Stable θ = 0°, Unstable θ = 180°',
    examinerCheckpoints: ['Diagram with 2a sin θ arm', 'τ = p × E', 'θ = 0° & θ = 180°'],
  },
  'phy-2026-23': {
    questionId: 'phy-2026-23',
    section: 'Section C · Q23',
    maxMarks: 3,
    exactModelAnswer:
      'For two cells in parallel: ε_eq = (ε₁r₂ + ε₂r₁)/(r₁ + r₂) = (6×2 + 4×1)/(1 + 2) = 16/3 V ≈ 5.33 V. Equivalent internal resistance r_eq = (1×2)/(1+2) = 2/3 Ω. Circuit current through external R = 5 Ω: I = ε_eq / (R + r_eq) = (16/3) / (5 + 2/3) = 16/17 A ≈ 0.94 A. Terminal p.d. V = I·R = (16/17)×5 = 80/17 V ≈ 4.71 V.',
    stepMarks: [
      {label: 'Formula & value for ε_eq = 16/3 V and r_eq = 2/3 Ω (or Kirchhoff loop setup)', marks: 1},
      {label: 'Substitution & current I = 16/17 A (0.94 A)', marks: 1},
      {label: 'Terminal potential difference V = 80/17 V (4.71 V) with SI units', marks: 1},
    ],
    finalAnswerValue: 'I = 16/17 A (0.94 A), V = 80/17 V (4.71 V)',
    examinerCheckpoints: ['ε_eq = 16/3 V', 'I = 0.94 A', 'V = 4.71 V'],
  },
  'phy-2026-24': {
    questionId: 'phy-2026-24',
    section: 'Section C · Q24',
    maxMarks: 3,
    exactModelAnswer:
      'Nucleus ¹²₆C has Z = 6 protons and N = 6 neutrons.\nMass defect Δm = [6 m_p + 6 m_n] − M_C = [6(1.00727) + 6(1.00866)] − 12.00000 = (6.04362 + 6.05196) − 12.00000 = 0.09558 u.\nTotal Binding Energy = Δm × 931.5 = 0.09558 × 931.5 = 89.033 MeV.\nBinding Energy per nucleon = 89.033 / 12 = 7.42 MeV/nucleon.',
    stepMarks: [
      {label: 'Mass defect formula Δm = Z m_p + (A−Z) m_n − M_nucleus', marks: 0.5},
      {label: 'Correct calculation Δm = 0.09558 u', marks: 1},
      {label: 'Total BE = 89.033 MeV', marks: 0.5},
      {label: 'BE per nucleon = 7.42 MeV/nucleon with units', marks: 1},
    ],
    finalAnswerValue: '7.42 MeV/nucleon',
    examinerCheckpoints: ['Δm = 0.09558 u', 'Total BE = 89.03 MeV', 'BE/A = 7.42 MeV'],
  },
  'phy-2026-25': {
    questionId: 'phy-2026-25',
    section: 'Section C · Q25',
    maxMarks: 3,
    exactModelAnswer:
      'Center-tapped Full-Wave Rectifier uses step-down transformer with center-tap C and two diodes D₁, D₂ across secondary A and B joined to load R_L. Positive half-cycle: A positive, B negative ⇒ D₁ forward-biased (conducts), D₂ reverse-biased. Negative half-cycle: B positive, A negative ⇒ D₂ forward-biased (conducts), D₁ reverse-biased. Current flows unidirectionally through R_L on both half-cycles.',
    stepMarks: [
      {label: 'Labeled circuit diagram (center-tap transformer, D₁, D₂, R_L)', marks: 1.5},
      {label: 'Working in positive & negative half-cycles', marks: 0.5},
      {label: 'Input AC and unidirectional full-wave rectified output waveform', marks: 1},
    ],
    finalAnswerValue: 'Center-tap FWR diagram + alternating D₁/D₂ conduction + waveforms',
    examinerCheckpoints: ['Center tap drawn', 'Unidirectional current arrow through R_L', 'Two-pulse output waveform'],
  },
  'phy-2026-26': {
    questionId: 'phy-2026-26',
    section: 'Section C · Q26',
    maxMarks: 3,
    exactModelAnswer:
      'Incident plane wavefront AB strikes boundary XY at angle i. Secondary wavelet from A travels distance BC = v₁t in medium 1 while secondary wavelet from A travels AD = v₂t in medium 2 (v₂ < v₁). From right triangles ABC and ADC, sin i = v₁t/AC and sin r = v₂t/AC ⇒ sin i / sin r = v₁/v₂ = n₂/n₁ (Snell’s Law).',
    stepMarks: [
      {label: 'Labeled Huygens wavefront diagram showing AB, CD, radii v₁t and v₂t', marks: 1},
      {label: 'Geometric expressions for sin i and sin r', marks: 1},
      {label: 'Derivation of sin i / sin r = v₁/v₂ = n₂/n₁', marks: 1},
    ],
    finalAnswerValue: 'sin i / sin r = v₁ / v₂ = n₂ / n₁',
    examinerCheckpoints: ['Tangential refracted wavefront CD', 'Equal travel time t', 'Snell’s law proven'],
  },
  'phy-2026-27': {
    questionId: 'phy-2026-27',
    section: 'Section C · Q27',
    maxMarks: 3,
    exactModelAnswer:
      'Given N = 50, r = 0.10 m, I = 2 A, B = 0.25 T, θ = 30°.\nArea A = πr² = π(0.10)² = 0.01π m² ≈ 0.03142 m².\nMagnetic dipole moment M = N I A = 50 × 2 × 0.01π = π A·m² ≈ 3.14 A·m².\nTorque τ = N I A B sin θ = π × 0.25 × sin 30° = π × 0.25 × 0.5 = 0.125π N·m ≈ 0.393 N·m.',
    stepMarks: [
      {label: 'Formula for magnetic moment M = N I A & torque τ = M B sin θ', marks: 1},
      {label: 'Calculate M = π A·m² (3.14 A·m²)', marks: 1},
      {label: 'Calculate τ = 0.125π N·m (0.393 N·m) with SI units', marks: 1},
    ],
    finalAnswerValue: 'M = 3.14 A·m²; τ = 0.393 N·m',
    examinerCheckpoints: ['M = 3.14 A·m²', 'sin 30° = 0.5', 'τ = 0.393 N·m'],
  },
  'phy-2026-28': {
    questionId: 'phy-2026-28',
    section: 'Section C · Q28',
    maxMarks: 3,
    exactModelAnswer:
      'Diamagnetic: χ small & negative (−1 ≤ χ < 0), 0 ≤ μ_r < 1, moves from stronger to weaker region in non-uniform B-field.\nParamagnetic: χ small & positive, μ_r slightly > 1, moves weakly from weaker to stronger region.\nFerromagnetic: χ very large & positive (≫ 1), μ_r ≫ 1, drawn strongly into stronger magnetic field region.',
    stepMarks: [
      {label: 'Susceptibility χ signs & magnitude comparison (1m)', marks: 1},
      {label: 'Relative permeability μ_r comparison (1m)', marks: 1},
      {label: 'Motion in non-uniform magnetic field (1m)', marks: 1},
    ],
    finalAnswerValue: 'Diamagnetic / Paramagnetic / Ferromagnetic property table',
    examinerCheckpoints: ['Negative χ for diamagnetic', 'Weak vs strong positive χ', 'Direction in non-uniform field'],
  },

  // Section D (Q29 – Q30 Case Studies, 4 Marks each)
  'phy-2026-29': {
    questionId: 'phy-2026-29',
    section: 'Section D · Q29',
    maxMarks: 4,
    exactModelAnswer:
      '(i) AlN has a large forbidden energy gap E_g = 6.2 eV (≫ 3 eV), so thermal energy at 300 K (~0.026 eV) is far too small to excite valence electrons across to the conduction band, making it an insulator.\n(ii) Doping silicon (E_g = 1.1 eV) with pentavalent phosphorus creates discrete donor levels ~0.045 eV below the conduction band edge; electrons become majority carriers (n_e ≫ n_h).\n(iii) By mass-action law at thermal equilibrium: n_e · n_h = n_i².',
    stepMarks: [
      {label: '(i) Large band gap E_g = 6.2 eV prevents thermal excitation', marks: 1.5},
      {label: '(ii) Donor energy level just below conduction band & n_e ≫ n_h', marks: 1.5},
      {label: '(iii) Mass-action law n_e · n_h = n_i²', marks: 1},
    ],
    finalAnswerValue: 'E_g = 6.2 eV insulator; donor level ~0.045 eV below CB; n_e·n_h = n_i²',
    examinerCheckpoints: ['Large gap prevents excitation', 'Pentavalent → n-type donor level', 'n_e · n_h = n_i²'],
  },
  'phy-2026-30': {
    questionId: 'phy-2026-30',
    section: 'Section D · Q30',
    maxMarks: 4,
    exactModelAnswer:
      '(i) Incident photon energy E = hc / λ = 1242 / 400 = 3.105 eV.\n(ii) Stopping potential: eV₀ = E − φ₀ = 3.105 − 2.14 = 0.965 eV ⇒ V₀ = 0.965 V.\n(iii) Doubling light intensity at fixed λ doubles the number of incident photons per second, doubling saturation photocurrent while leaving K_max and V₀ unchanged.\n(iv) Halving λ doubles photon energy E to 6.21 eV, increasing K_max and V₀ (to 4.07 V).',
    stepMarks: [
      {label: 'Photon energy E = 3.105 eV', marks: 1},
      {label: 'Stopping potential V₀ = 0.965 V using Einstein equation', marks: 1},
      {label: 'Effect of doubling intensity (current doubles, V₀ unchanged)', marks: 1},
      {label: 'Effect of halving wavelength (V₀ increases)', marks: 1},
    ],
    finalAnswerValue: 'E = 3.105 eV; V₀ = 0.965 V; Intensity ↑ ⇒ I_sat ↑, V₀ const',
    examinerCheckpoints: ['E = 3.105 eV', 'V₀ = 0.965 V', 'Zero change in V₀ with intensity'],
  },

  // Section E (Q31 – Q33 Long Answer, 5 Marks each)
  'phy-2026-31': {
    questionId: 'phy-2026-31',
    section: 'Section E · Q31',
    maxMarks: 5,
    exactModelAnswer:
      'Part A (Derivation): Work dW to transfer dq at potential v = q/C is dW = (q/C)dq. Integrating q from 0 to Q gives U = Q²/(2C) = ½ CV² = ½ QV.\nPart B (Numerical): C₁ = 6 μF, V₁ = 100 V ⇒ Q₁ = 600 μC; U_i = ½(6×10⁻⁶)(100)² = 0.030 J. Parallel combination C_eq = 6 + 4 = 10 μF. Common potential V = 600 μC / 10 μF = 60 V. Final energy U_f = ½(10×10⁻⁶)(60)² = 0.018 J. Energy dissipated = 0.030 − 0.018 = 0.012 J (12 mJ) as heat/EM radiation.',
    stepMarks: [
      {label: 'Integration derivation of U = Q²/(2C) = ½ CV²', marks: 2},
      {label: 'Common potential V = 60 V', marks: 1},
      {label: 'Initial energy U_i = 0.030 J and final energy U_f = 0.018 J', marks: 1},
      {label: 'Energy lost ΔU = 0.012 J (12 mJ) with SI unit', marks: 1},
    ],
    finalAnswerValue: 'U = ½ CV²; V = 60 V; Energy lost = 0.012 J (12 mJ)',
    examinerCheckpoints: ['Integration dW = (q/C)dq', 'V_common = 60 V', 'ΔU = 0.012 J'],
  },
  'phy-2026-32': {
    questionId: 'phy-2026-32',
    section: 'Section E · Q32',
    maxMarks: 5,
    exactModelAnswer:
      'Diagram: Objective lens (large aperture & long f_o) forms real inverted image at its focus F_o, which coincides with eyepiece focus F_e for normal adjustment (final image at ∞).\nMagnification derivation: m = β / α ≈ tan β / tan α = (h/f_e) / (h/f_o) = f_o / f_e.\nNumerical: Given f_o = 120 cm, f_e = 6 cm ⇒ Magnifying power |m| = 120 / 6 = 20. Tube length L = f_o + f_e = 120 + 6 = 126 cm.',
    stepMarks: [
      {label: 'Neat labeled ray diagram of Astronomical Telescope in normal adjustment', marks: 2},
      {label: 'Magnifying power derivation m = f_o / f_e', marks: 1.5},
      {label: 'Magnification m = 20 and tube length L = 126 cm', marks: 1.5},
    ],
    finalAnswerValue: 'm = f_o/f_e = 20; Tube length L = 126 cm',
    examinerCheckpoints: ['Arrows on parallel rays entering & exiting', 'F_o = F_e labeled', 'm = 20, L = 126 cm'],
  },
  'phy-2026-33': {
    questionId: 'phy-2026-33',
    section: 'Section E · Q33',
    maxMarks: 5,
    exactModelAnswer:
      'Phasor Derivation: Voltage across R, L, C gives resultant peak V_m = √(V_R² + (V_L − V_C)²) = I_m √(R² + (X_L − X_C)²), hence Z = √(R² + (X_L − X_C)²). At resonance X_L = X_C ⇒ ω₀L = 1/(ω₀C) ⇒ f₀ = 1/(2π√(LC)).\nGraph: Current amplitude curve peaks at f₀ (sharper peak for smaller R).\nNumerical: L = 20 mH = 0.02 H, C = 50 μF = 5×10⁻⁵ F ⇒ LC = 10⁻⁶ s² ⇒ ω₀ = 1000 rad/s ⇒ f₀ = 1000/(2π) = 500/π ≈ 159.15 Hz.',
    stepMarks: [
      {label: 'Phasor diagram and impedance derivation Z = √(R² + (X_L − X_C)²)', marks: 2},
      {label: 'Resonance condition & f₀ = 1/(2π√(LC)) plus resonance curve', marks: 1.5},
      {label: 'Calculation f₀ ≈ 159.15 Hz with unit', marks: 1.5},
    ],
    finalAnswerValue: 'Z = √(R² + (X_L−X_C)²); f₀ = 159.15 Hz',
    examinerCheckpoints: ['Phasor V_L opposite V_C', 'f₀ formula', 'f₀ ≈ 159.15 Hz'],
  },
};
