import type {BoardFrequencyMeta, SubjectId} from './pcmbData';
import {QUESTION_DIAGRAM_SVGS} from './diagramSvgs';

export type SubjectiveQuestionType =
  | 'short'
  | 'numerical'
  | 'diagram'
  | 'derivation_or_proof';

export interface SubjectiveExamQuestion {
  id: string;
  subjectId: SubjectId;
  questionNumber: number;
  section: string;
  sectionCode: 'B' | 'C' | 'D' | 'E';
  questionType: SubjectiveQuestionType;
  marks: number;
  chapterTag: string;
  prompt: string;
  orPrompt?: string;
  caseContext?: string;
  diagramId?: string;
  questionDiagramSvg?: string;
  boardFrequency: BoardFrequencyMeta;
}

export const SUBJECTIVE_QUESTIONS: SubjectiveExamQuestion[] = [
  // =========================================================================
  // PHYSICS (042) — Sections B to E (Q17 – Q33, Total 54 Marks)
  // =========================================================================
  {
    id: 'phy-2026-17',
    subjectId: 'physics',
    questionNumber: 17,
    section: 'Section B · Q17',
    sectionCode: 'B',
    questionType: 'numerical',
    marks: 2,
    chapterTag: 'Ch 08 · Electromagnetic Waves',
    prompt:
      'A plane electromagnetic wave propagates through a non-magnetic transparent dielectric with electric field component E_y = 60 sin(3π × 10¹⁸ t + 1.5π × 10¹⁰ x) V m⁻¹ (SI units). Calculate: (I) the refractive index of the medium, and (II) the wave frequency along with the electromagnetic spectrum band to which it belongs.',
    boardFrequency: {
      count: 'High-Yield Concept • Electromagnetic Waves',
      years: ['2017', '2019', '2023', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'phy-2026-18',
    subjectId: 'physics',
    questionNumber: 18,
    section: 'Section B · Q18',
    sectionCode: 'B',
    questionType: 'short',
    marks: 2,
    chapterTag: 'Ch 03 · Current Electricity',
    prompt:
      'Describe and contrast the trajectory followed by conduction electrons between successive lattice collisions inside a copper wire when: (a) no potential difference is applied across the wire, and (b) a steady electric field E is maintained along the wire.',
    boardFrequency: {
      count: 'Core Concept • Current Electricity',
      years: ['2016', '2018', '2022', '2024'],
      importance: 'Core Concept',
    },
  },
  {
    id: 'phy-2026-19',
    subjectId: 'physics',
    questionNumber: 19,
    section: 'Section B · Q19',
    sectionCode: 'B',
    questionType: 'numerical',
    marks: 2,
    chapterTag: 'Ch 02 · Electrostatic Potential',
    prompt:
      'Two identical stationary point charges +2q and +2q are fixed in vacuum at a separation of 2a. Derive the net electrostatic work performed by an external agent to bring a test charge +q slowly from infinity to the exact midpoint of the line joining them.',
    boardFrequency: {
      count: 'High-Yield Concept • Electrostatic Potential',
      years: ['2016', '2018', '2020', '2023', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'phy-2026-20',
    subjectId: 'physics',
    questionNumber: 20,
    section: 'Section B · Q20',
    sectionCode: 'B',
    questionType: 'diagram',
    marks: 2,
    chapterTag: 'Ch 09 · Ray Optics',
    prompt:
      'Sketch a neat labeled ray diagram demonstrating how an isosceles right-angled glass prism (45°–90°–45°, refractive index n = 1.5) turns a parallel light beam entering its hypotenuse normally through an angle of 180°. Verify the critical angle condition at the reflecting faces.',
    boardFrequency: {
      count: 'High-Yield Concept • Ray Optics',
      years: ['2015', '2017', '2019', '2021', '2023', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'phy-2026-21',
    subjectId: 'physics',
    questionNumber: 21,
    section: 'Section B · Q21',
    sectionCode: 'B',
    questionType: 'derivation_or_proof',
    marks: 2,
    chapterTag: 'Ch 03 · Current Electricity',
    prompt:
      'Starting from the electrostatic force on a free electron in a uniform electric field E, derive the expression for drift velocity v_d in terms of electron charge e, mass m, electric field E, and average relaxation time τ.',
    orPrompt:
      'Draw the experimental V–I characteristic curve of a silicon p–n junction diode under both forward bias and reverse bias, clearly marking the knee voltage and reverse breakdown voltage.',
    boardFrequency: {
      count: 'High-Yield Concept • Current Electricity',
      years: ['2015', '2017', '2018', '2020', '2022', '2024', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'phy-2026-22',
    subjectId: 'physics',
    questionNumber: 22,
    section: 'Section C · Q22',
    sectionCode: 'C',
    questionType: 'derivation_or_proof',
    marks: 3,
    chapterTag: 'Ch 01 · Electric Charges and Fields',
    prompt:
      'An electric dipole consisting of charges ±q separated by length 2a is oriented at angle θ inside a uniform electric field E. Derive the vector expression τ = p × E for the torque acting on it, and specify the orientations corresponding to stable and unstable equilibrium.',
    boardFrequency: {
      count: 'High-Yield Concept • Electric Charges and Fields',
      years: ['2016', '2018', '2019', '2021', '2023', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'phy-2026-23',
    subjectId: 'physics',
    questionNumber: 23,
    section: 'Section C · Q23',
    sectionCode: 'C',
    questionType: 'numerical',
    marks: 3,
    chapterTag: 'Ch 03 · Current Electricity',
    diagramId: 'phy-q23-parallel-cells',
    questionDiagramSvg: QUESTION_DIAGRAM_SVGS['phy-q23-parallel-cells'],
    prompt:
      'In the parallel circuit network shown below, two primary cells having emfs 6 V (internal resistance 1 Ω) and 4 V (internal resistance 2 Ω) are connected with identical polarity to feed an external 5 Ω load resistor. Compute: (a) the current flowing through the 5 Ω load, and (b) the terminal potential difference across the load.',
    boardFrequency: {
      count: 'High-Yield Concept • Current Electricity',
      years: ['2016', '2019', '2021', '2023', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'phy-2026-24',
    subjectId: 'physics',
    questionNumber: 24,
    section: 'Section C · Q24',
    sectionCode: 'C',
    questionType: 'numerical',
    marks: 3,
    chapterTag: 'Ch 13 · Nuclei',
    prompt:
      'The atomic mass of a neutral ¹²₆C atom is taken as exactly 12.00000 u. Given proton mass m_p = 1.00727 u, neutron mass m_n = 1.00866 u, and 1 u = 931.5 MeV/c², calculate: (i) the mass defect Δm in u, (ii) the total nuclear binding energy in MeV, and (iii) the binding energy per nucleon.',
    boardFrequency: {
      count: 'High-Yield Concept • Nuclei',
      years: ['2017', '2019', '2020', '2023', '2024'],
      importance: 'High Yield',
    },
  },
  {
    id: 'phy-2026-25',
    subjectId: 'physics',
    questionNumber: 25,
    section: 'Section C · Q25',
    sectionCode: 'C',
    questionType: 'diagram',
    marks: 3,
    chapterTag: 'Ch 14 · Semiconductor Electronics',
    prompt:
      'Draw the complete circuit schematic of a centre-tapped Full-Wave Rectifier using two junction diodes D₁ and D₂. Explain how current flows unidirectionally through load resistor R_L during alternate half-cycles, and plot the input AC and output rectified waveforms.',
    boardFrequency: {
      count: 'High-Yield Concept • Semiconductor Electronics',
      years: ['2015', '2017', '2019', '2020', '2022', '2024', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'phy-2026-26',
    subjectId: 'physics',
    questionNumber: 26,
    section: 'Section C · Q26',
    sectionCode: 'C',
    questionType: 'derivation_or_proof',
    marks: 3,
    chapterTag: 'Ch 10 · Wave Optics',
    prompt:
      'Using Huygens’ principle of secondary wavelets, draw a clean geometric construction for a plane wavefront refracting from a rarer medium (speed v₁) into a denser medium (speed v₂ < v₁), and prove Snell’s law: sin i / sin r = n₂ / n₁.',
    boardFrequency: {
      count: 'High-Yield Concept • Wave Optics',
      years: ['2016', '2018', '2020', '2022', '2023', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'phy-2026-27',
    subjectId: 'physics',
    questionNumber: 27,
    section: 'Section C · Q27',
    sectionCode: 'C',
    questionType: 'numerical',
    marks: 3,
    chapterTag: 'Ch 04 · Moving Charges and Magnetism',
    prompt:
      'A closely wound circular coil of 50 turns and radius 10 cm carries a steady current of 2 A. It is suspended in a uniform horizontal magnetic field of 0.25 T such that the normal to the coil plane makes an angle of 30° with the field. Calculate: (a) the magnetic dipole moment of the coil, and (b) the magnitude of the torque acting on it.',
    boardFrequency: {
      count: 'Frequent Concept • Moving Charges and Magnetism',
      years: ['2017', '2020', '2022', '2025'],
      importance: 'Frequent',
    },
  },
  {
    id: 'phy-2026-28',
    subjectId: 'physics',
    questionNumber: 28,
    section: 'Section C · Q28',
    sectionCode: 'C',
    questionType: 'short',
    marks: 3,
    chapterTag: 'Ch 05 · Magnetism and Matter',
    prompt:
      'Present a systematic comparison among Diamagnetic, Paramagnetic, and Ferromagnetic solids across three parameters: (1) sign and magnitude of magnetic susceptibility χ, (2) relative permeability μ_r, and (3) specimen movement when placed inside a non-uniform magnetic field.',
    boardFrequency: {
      count: 'High-Yield Concept • Magnetism and Matter',
      years: ['2016', '2018', '2021', '2023', '2024'],
      importance: 'High Yield',
    },
  },
  {
    id: 'phy-2026-29',
    subjectId: 'physics',
    questionNumber: 29,
    section: 'Section D · Q29 (Case Study)',
    sectionCode: 'D',
    questionType: 'short',
    marks: 4,
    chapterTag: 'Ch 14 · Semiconductor Electronics',
    caseContext:
      'An aerospace electronics lab evaluates three crystalline substrates for high-altitude power regulators: Silicon (E_g = 1.1 eV), Gallium Arsenide (E_g = 1.43 eV), and Aluminium Nitride (E_g = 6.2 eV). Controlled impurity doping is tested on ultra-pure Silicon wafers at 300 K.',
    prompt:
      'Answer the following based on energy-band theory:\n(i) Why does Aluminium Nitride behave as an electrical insulator at 300 K despite structural similarity to semiconductors? (1.5M)\n(ii) When pure Silicon is doped with trace pentavalent Phosphorus, explain where the new donor energy level forms and how majority carrier concentration changes. (1.5M)\n(iii) Write the mass-action equilibrium law relating electron concentration n_e, hole concentration n_h, and intrinsic carrier density n_i. (1M)',
    boardFrequency: {
      count: 'High-Yield Concept • Semiconductor Electronics',
      years: ['2018', '2020', '2022', '2024', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'phy-2026-30',
    subjectId: 'physics',
    questionNumber: 30,
    section: 'Section D · Q30 (Case Study)',
    sectionCode: 'D',
    questionType: 'numerical',
    marks: 4,
    chapterTag: 'Ch 11 · Dual Nature of Radiation',
    diagramId: 'phy-q30-photoelectric-graph',
    questionDiagramSvg: QUESTION_DIAGRAM_SVGS['phy-q30-photoelectric-graph'],
    caseContext:
      'During an optical sensor calibration test, monochromatic violet light of wavelength λ = 400 nm illuminates a clean Cesium photocathode whose photoelectric work function is φ₀ = 2.14 eV (producing the photocurrent–potential graph plotted below). Take hc = 1242 eV·nm.',
    prompt:
      'Using Einstein’s photoelectric equation, solve and explain:\n(i) Compute the energy (in eV) of each incident violet photon. (1M)\n(ii) Determine the stopping potential V₀ required to just arrest the fastest emitted photoelectrons. (1M)\n(iii) If the light source power (intensity) is doubled while keeping λ = 400 nm unchanged, state how saturation photocurrent and V₀ respond. (1M)\n(iv) What happens to V₀ if λ is halved from 400 nm to 200 nm? (1M)',
    boardFrequency: {
      count: 'High-Yield Concept • Dual Nature of Radiation',
      years: ['2016', '2018', '2021', '2023', '2024', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'phy-2026-31',
    subjectId: 'physics',
    questionNumber: 31,
    section: 'Section E · Q31',
    sectionCode: 'E',
    questionType: 'derivation_or_proof',
    marks: 5,
    chapterTag: 'Ch 02 · Electrostatic Potential & Capacitance',
    diagramId: 'phy-q31-capacitors',
    questionDiagramSvg: QUESTION_DIAGRAM_SVGS['phy-q31-capacitors'],
    prompt:
      'Part A (2M): Derive by calculus the expression U = ½ C V² for the electrostatic energy stored inside a capacitor charged to potential difference V.\nPart B (3M): As illustrated in the switched capacitor network below, a 6 μF capacitor charged to 100 V is isolated from the supply (switch S₁ opened) and joined in parallel to an uncharged 4 μF capacitor (switch S₂ closed). Find: (i) the final common potential, and (ii) the electrostatic energy lost during charge redistribution.',
    boardFrequency: {
      count: 'High-Yield Concept • Electrostatic Potential & Capacitance',
      years: ['2015', '2017', '2019', '2020', '2022', '2024', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'phy-2026-32',
    subjectId: 'physics',
    questionNumber: 32,
    section: 'Section E · Q32',
    sectionCode: 'E',
    questionType: 'diagram',
    marks: 5,
    chapterTag: 'Ch 09 · Optical Instruments',
    prompt:
      'Draw a neat, labeled ray diagram of a refracting Astronomical Telescope configured in normal adjustment (final image formed at infinity). Using the small-angle approximation, derive the magnifying power formula m = f_o / f_e. Hence determine the magnifying power and total optical tube length when f_o = 120 cm and f_e = 6 cm.',
    boardFrequency: {
      count: 'High-Yield Concept • Optical Instruments',
      years: ['2016', '2018', '2020', '2022', '2024', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'phy-2026-33',
    subjectId: 'physics',
    questionNumber: 33,
    section: 'Section E · Q33',
    sectionCode: 'E',
    questionType: 'derivation_or_proof',
    marks: 5,
    chapterTag: 'Ch 07 · Alternating Current',
    prompt:
      'With a clean phasor diagram, derive the total impedance Z = √(R² + (X_L − X_C)²) for a series LCR circuit driven by an AC voltage v = V_m sin(ωt), and sketch the variation of current amplitude with driving frequency. Further, compute the resonant frequency f₀ if L = 20 mH, C = 50 μF, and R = 10 Ω.',
    boardFrequency: {
      count: 'High-Yield Concept • Alternating Current',
      years: ['2015', '2017', '2018', '2020', '2023', '2024', '2025'],
      importance: 'High Yield',
    },
  },

  // =========================================================================
  // CHEMISTRY (043) — Sections B to E (Q17 – Q33, Total 54 Marks)
  // =========================================================================
  {
    id: 'chem-2026-17',
    subjectId: 'chemistry',
    questionNumber: 17,
    section: 'Section B · Q17',
    sectionCode: 'B',
    questionType: 'short',
    marks: 2,
    chapterTag: 'Ch 04 · d- and f-Block Elements',
    prompt:
      '(a) Write the completely balanced ionic equation for the oxidation of Fe²⁺ ions by dichromate ions (Cr₂O₇²⁻) in acidic medium.\n(b) Account for why Chromium (Z = 24) exhibits a much higher melting point than Zinc (Z = 30).',
    boardFrequency: {
      count: 'High-Yield Concept • d- and f-Block Elements',
      years: ['2016', '2018', '2020', '2023', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'chem-2026-18',
    subjectId: 'chemistry',
    questionNumber: 18,
    section: 'Section B · Q18',
    sectionCode: 'B',
    questionType: 'numerical',
    marks: 2,
    chapterTag: 'Ch 01 · Solutions',
    prompt:
      '1.8 g of pure glucose (molar mass = 180 g mol⁻¹) is dissolved in water to prepare 500 mL of solution at 300 K. Calculate its osmotic pressure in atm (Take R = 0.0821 L atm K⁻¹ mol⁻¹).',
    boardFrequency: {
      count: 'High-Yield Concept • Solutions',
      years: ['2017', '2019', '2021', '2023', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'chem-2026-19',
    subjectId: 'chemistry',
    questionNumber: 19,
    section: 'Section B · Q19',
    sectionCode: 'B',
    questionType: 'short',
    marks: 2,
    chapterTag: 'Ch 09 · Amines',
    prompt:
      'Arrange NH₃, CH₃NH₂, (CH₃)₂NH, and (CH₃)₃N in increasing order of basic strength in aqueous solution, explaining the interplay of inductive, solvation, and steric effects.',
    boardFrequency: {
      count: 'High-Yield Concept • Amines',
      years: ['2015', '2017', '2019', '2021', '2023', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'chem-2026-20',
    subjectId: 'chemistry',
    questionNumber: 20,
    section: 'Section B · Q20',
    sectionCode: 'B',
    questionType: 'derivation_or_proof',
    marks: 2,
    chapterTag: 'Ch 07 · Alcohols, Phenols and Ethers',
    prompt:
      'Write the complete three-step curved-arrow mechanism for the acid-catalysed dehydration of ethanol (CH₃CH₂OH) to ethene (CH₂=CH₂) in the presence of conc. H₂SO₄ at 443 K.',
    boardFrequency: {
      count: 'High-Yield Concept • Alcohols, Phenols and Ethers',
      years: ['2016', '2018', '2020', '2022', '2024', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'chem-2026-21',
    subjectId: 'chemistry',
    questionNumber: 21,
    section: 'Section B · Q21',
    sectionCode: 'B',
    questionType: 'short',
    marks: 2,
    chapterTag: 'Ch 06 · Haloalkanes and Haloarenes',
    prompt:
      'Give crisp chemical reasons for:\n(a) p-Dichlorobenzene has a noticeably higher melting point than its ortho- and meta-isomers.\n(b) Aryl halides are markedly unreactive towards nucleophilic substitution compared to alkyl halides.',
    boardFrequency: {
      count: 'Core Concept • Haloalkanes and Haloarenes',
      years: ['2016', '2018', '2021', '2023', '2024'],
      importance: 'Core Concept',
    },
  },
  {
    id: 'chem-2026-22',
    subjectId: 'chemistry',
    questionNumber: 22,
    section: 'Section C · Q22',
    sectionCode: 'C',
    questionType: 'short',
    marks: 3,
    chapterTag: 'Ch 06 · Haloalkanes and Haloarenes',
    prompt:
      'Account stereochemically and mechanistically for each observation:\n(i) Treating optically active (−)-2-bromooctane with aqueous NaOH yields (+)-octan-2-ol exclusively.\n(ii) Hydrolysis of an optically active halide via SN1 produces a racemic mixture.\n(iii) Allylic halides undergo nucleophilic substitution far more readily via SN1 than n-propyl halides.',
    boardFrequency: {
      count: 'High-Yield Concept • Haloalkanes and Haloarenes',
      years: ['2017', '2019', '2021', '2023', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'chem-2026-23',
    subjectId: 'chemistry',
    questionNumber: 23,
    section: 'Section C · Q23',
    sectionCode: 'C',
    questionType: 'numerical',
    marks: 3,
    chapterTag: 'Ch 03 · Chemical Kinetics',
    prompt:
      'The rate constant of a chemical decomposition reaction triples (k₂ / k₁ = 3) when temperature is raised from 300 K to 310 K. Calculate the activation energy E_a in kJ mol⁻¹ (Given log 3 = 0.4771, R = 8.314 J K⁻¹ mol⁻¹).',
    boardFrequency: {
      count: 'High-Yield Concept • Chemical Kinetics',
      years: ['2015', '2017', '2019', '2022', '2024', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'chem-2026-24',
    subjectId: 'chemistry',
    questionNumber: 24,
    section: 'Section C · Q24',
    sectionCode: 'C',
    questionType: 'short',
    marks: 3,
    chapterTag: 'Ch 08 · Aldehydes, Ketones & Amines',
    prompt:
      'Write balanced equations showing exact reagents and major products for:\n(a) Reimer–Tiemann reaction of phenol.\n(b) Hoffmann bromamide degradation of propanamide (CH₃CH₂CONH₂).\n(c) Rosenmund reduction of benzoyl chloride (C₆H₅COCl).',
    boardFrequency: {
      count: 'High-Yield Concept • Aldehydes, Ketones & Amines',
      years: ['2015', '2016', '2018', '2020', '2022', '2024', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'chem-2026-25',
    subjectId: 'chemistry',
    questionNumber: 25,
    section: 'Section C · Q25',
    sectionCode: 'C',
    questionType: 'diagram',
    marks: 3,
    chapterTag: 'Ch 05 · Coordination Compounds',
    prompt:
      'Sketch the octahedral geometrical isomers (cis and trans) of [CoCl₂(en)₂]⁺ and draw the enantiomeric mirror-image pair for whichever isomer is optically active. Explain briefly why the other geometrical isomer is optically inactive.',
    boardFrequency: {
      count: 'High-Yield Concept • Coordination Compounds',
      years: ['2016', '2018', '2020', '2023', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'chem-2026-26',
    subjectId: 'chemistry',
    questionNumber: 26,
    section: 'Section C · Q26',
    sectionCode: 'C',
    questionType: 'numerical',
    marks: 3,
    chapterTag: 'Ch 02 · Electrochemistry',
    prompt:
      'The electrical resistance of a 0.02 M KCl solution filling a conductivity cell at 298 K is measured as 250 Ω. If the cell constant G* is 1.25 cm⁻¹, calculate: (i) the specific conductivity κ (in S cm⁻¹), and (ii) the molar conductivity Λ_m (in S cm² mol⁻¹).',
    boardFrequency: {
      count: 'High-Yield Concept • Electrochemistry',
      years: ['2016', '2018', '2020', '2022', '2024', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'chem-2026-27',
    subjectId: 'chemistry',
    questionNumber: 27,
    section: 'Section C · Q27',
    sectionCode: 'C',
    questionType: 'short',
    marks: 3,
    chapterTag: 'Ch 10 · Biomolecules',
    prompt:
      '(a) Contrast fibrous and globular proteins in terms of structure and water solubility, giving one example of each.\n(b) Write the zwitterionic structure of glycine.\n(c) Name the covalent linkage connecting adjacent nucleotides along a DNA strand.',
    boardFrequency: {
      count: 'Core Concept • Biomolecules',
      years: ['2016', '2019', '2021', '2023', '2025'],
      importance: 'Core Concept',
    },
  },
  {
    id: 'chem-2026-28',
    subjectId: 'chemistry',
    questionNumber: 28,
    section: 'Section C · Q28',
    sectionCode: 'C',
    questionType: 'short',
    marks: 3,
    chapterTag: 'Ch 04 · d- and f-Block Elements',
    prompt:
      'What is meant by Lanthanoid Contraction? Explain its underlying atomic cause and state two significant chemical consequences observed among transition elements and lanthanoid hydroxides.',
    boardFrequency: {
      count: 'High-Yield Concept • d- and f-Block Elements',
      years: ['2015', '2017', '2019', '2021', '2023', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'chem-2026-29',
    subjectId: 'chemistry',
    questionNumber: 29,
    section: 'Section D · Q29 (Case Study)',
    sectionCode: 'D',
    questionType: 'short',
    marks: 4,
    chapterTag: 'Ch 07 · Phenols & Acidity',
    diagramId: 'chem-q29-pka-scale',
    questionDiagramSvg: QUESTION_DIAGRAM_SVGS['chem-q29-pka-scale'],
    caseContext:
      'A medicinal chemistry group measures aqueous pKₐ values for hydroxy compounds at 298 K (shown in the comparative chart below): Ethanol (15.9), p-Cresol (10.2), Phenol (10.0), p-Nitrophenol (7.1), and 2,4,6-Trinitrophenol / Picric acid (0.4).',
    prompt:
      'Explain these acidity trends clearly:\n(i) Why is phenol ~10⁶ times more acidic than ethanol? (1.5M)\n(ii) Account for why p-cresol has a slightly higher pKₐ (weaker acid) than unsubstituted phenol. (1M)\n(iii) Why does introducing three nitro groups at the 2,4,6-positions make picric acid nearly as strong as mineral acids? (1.5M)',
    boardFrequency: {
      count: 'High-Yield Concept • Phenols & Acidity',
      years: ['2017', '2019', '2021', '2023', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'chem-2026-30',
    subjectId: 'chemistry',
    questionNumber: 30,
    section: 'Section D · Q30 (Case Study)',
    sectionCode: 'D',
    questionType: 'short',
    marks: 4,
    chapterTag: 'Ch 10 · Biomolecules',
    caseContext:
      'A crystalline plant disaccharide X (C₁₂H₂₂O₁₁, [α]_D = +66.5°) dissolves freely in water and gives a negative Tollens’ test. When warmed with dilute HCl, X hydrolyses into an equimolar mixture of two hexoses having opposite signs of optical rotation (+52.5° and −92.4°), reversing the net rotation of the mixture.',
    prompt:
      'Deduce the chemistry of Sugar X:\n(i) Identify disaccharide X. (1M)\n(ii) Explain structurally why X is non-reducing and unreactive towards Tollens’ reagent. (1.5M)\n(iii) Name the two hydrolysis products and explain why the hydrolysate is termed "invert sugar". (1.5M)',
    boardFrequency: {
      count: 'Frequent Concept • Biomolecules',
      years: ['2018', '2020', '2023', '2025'],
      importance: 'Frequent',
    },
  },
  {
    id: 'chem-2026-31',
    subjectId: 'chemistry',
    questionNumber: 31,
    section: 'Section E · Q31',
    sectionCode: 'E',
    questionType: 'short',
    marks: 5,
    chapterTag: 'Ch 08 & 09 · Organic Conversions & Tests',
    prompt:
      '(1) State one simple chemical test (reagent + visible observation) to distinguish:\n  (a) Propanal and Propanone (1M)\n  (b) Phenol and Benzoic acid (1M)\n(2) Carry out the following multi-step organic conversions showing reagents & intermediates:\n  (a) Aniline into Fluorobenzene (1.5M)\n  (b) Benzaldehyde into Cinnamaldehyde (3-phenylprop-2-enal) (1.5M)',
    boardFrequency: {
      count: 'High-Yield Concept • Organic Conversions & Tests',
      years: ['2015', '2017', '2018', '2020', '2022', '2024', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'chem-2026-32',
    subjectId: 'chemistry',
    questionNumber: 32,
    section: 'Section E · Q32',
    sectionCode: 'E',
    questionType: 'diagram',
    marks: 5,
    chapterTag: 'Ch 05 · Coordination Compounds',
    prompt:
      '(a) Draw the Crystal Field Splitting energy-level diagram for an octahedral complex ion, labeling t₂g, e_g, barycentre, and Δ₀ splits. (1.5M)\n(b) Write the electronic configuration and compute CFSE (in terms of Δ₀ and P) for a d⁴ ion when Δ₀ > P and when Δ₀ < P. (1.5M)\n(c) Calculate the spin-only magnetic moments μ (in BM) of [Fe(CN)₆]⁴⁻ and [FeF₆]³⁻. (2M)',
    boardFrequency: {
      count: 'High-Yield Concept • Coordination Compounds',
      years: ['2016', '2018', '2020', '2022', '2024', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'chem-2026-33',
    subjectId: 'chemistry',
    questionNumber: 33,
    section: 'Section E · Q33',
    sectionCode: 'E',
    questionType: 'numerical',
    marks: 5,
    chapterTag: 'Ch 02 · Electrochemistry',
    diagramId: 'chem-q33-galvanic-cell',
    questionDiagramSvg: QUESTION_DIAGRAM_SVGS['chem-q33-galvanic-cell'],
    prompt:
      'Referring to the galvanic cell assembly illustrated below, construct the balanced cell reaction and compute E°_cell, E_cell at 298 K, and standard Gibbs energy Δ_r G° (in kJ mol⁻¹) for:\nMg(s) | Mg²⁺ (0.01 M) || Cu²⁺ (0.001 M) | Cu(s)\nGiven: E°(Mg²⁺/Mg) = −2.36 V, E°(Cu²⁺/Cu) = +0.34 V, 1 F = 96,500 C mol⁻¹.',
    boardFrequency: {
      count: 'High-Yield Concept • Electrochemistry',
      years: ['2015', '2017', '2019', '2021', '2023', '2024', '2025'],
      importance: 'High Yield',
    },
  },

  // =========================================================================
  // BIOLOGY (044) — Sections B to E (Q17 – Q33, Total 54 Marks)
  // =========================================================================
  {
    id: 'bio-2026-17',
    subjectId: 'biology',
    questionNumber: 17,
    section: 'Section B · Q17',
    sectionCode: 'B',
    questionType: 'short',
    marks: 2,
    chapterTag: 'Ch 01 · Reproduction in Flowering Plants',
    prompt:
      'A plant breeder plans artificial hybridisation using a bisexual flower cultivar. Explain the exact steps and biological purpose of emasculation and bagging in this crop improvement programme.',
    orPrompt:
      'How is geitonogamy both functionally similar to cross-pollination and genetically equivalent to self-pollination (autogamy)? Explain briefly.',
    boardFrequency: {
      count: 'High-Yield Concept • Reproduction in Flowering Plants',
      years: ['2016', '2018', '2020', '2023', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'bio-2026-18',
    subjectId: 'biology',
    questionNumber: 18,
    section: 'Section B · Q18',
    sectionCode: 'B',
    questionType: 'numerical',
    marks: 2,
    chapterTag: 'Ch 11 · Organisms and Populations',
    prompt:
      'At the start of a year, a protected deer reserve holds 320 spotted deer. During the year, ecology rangers record 45 births (natality), 20 deaths (mortality), 25 immigrants entering, and 10 emigrants leaving. Calculate the net population change ΔN and final herd count at year-end, stating whether the population is growing or declining.',
    boardFrequency: {
      count: 'Frequent Concept • Organisms and Populations',
      years: ['2017', '2020', '2022', '2025'],
      importance: 'Frequent',
    },
  },
  {
    id: 'bio-2026-19',
    subjectId: 'biology',
    questionNumber: 19,
    section: 'Section B · Q19',
    sectionCode: 'B',
    questionType: 'short',
    marks: 2,
    chapterTag: 'Ch 07 · Human Health and Disease',
    prompt:
      'Distinguish clearly between normal differentiated tissue cells and malignant tumour cells with reference to: (a) metastasis, and (b) contact inhibition.',
    boardFrequency: {
      count: 'High-Yield Concept • Human Health and Disease',
      years: ['2016', '2019', '2021', '2023', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'bio-2026-20',
    subjectId: 'biology',
    questionNumber: 20,
    section: 'Section B · Q20',
    sectionCode: 'B',
    questionType: 'diagram',
    marks: 2,
    chapterTag: 'Ch 07 · Immunity',
    prompt:
      '(a) Draw a neat, fully labeled diagram of an immunoglobulin (H₂L₂ antibody) molecule showing heavy chains, light chains, disulphide bridges, and antigen-binding sites.\n(b) Name the specific arm of acquired immunity mediated by these molecules.',
    boardFrequency: {
      count: 'High-Yield Concept • Immunity',
      years: ['2015', '2017', '2019', '2022', '2024', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'bio-2026-21',
    subjectId: 'biology',
    questionNumber: 21,
    section: 'Section B · Q21',
    sectionCode: 'B',
    questionType: 'diagram',
    marks: 2,
    chapterTag: 'Ch 11 · Organisms & Populations',
    diagramId: 'bio-q21-growth-curve',
    questionDiagramSvg: QUESTION_DIAGRAM_SVGS['bio-q21-growth-curve'],
    prompt:
      'Study the population density versus time growth curves A and B plotted below:\n(a) Write the differential equations governing Curve A (J-shaped) and Curve B (Sigmoid), and state what the dashed asymptote K represents. (1M)\n(b) Which curve represents a more realistic population growth model in natural ecosystems, and why? (1M)',
    boardFrequency: {
      count: 'Core Concept • Organisms & Populations',
      years: ['2016', '2019', '2022', '2024'],
      importance: 'Core Concept',
    },
  },
  {
    id: 'bio-2026-22',
    subjectId: 'biology',
    questionNumber: 22,
    section: 'Section C · Q22',
    sectionCode: 'C',
    questionType: 'diagram',
    marks: 3,
    chapterTag: 'Ch 02 · Human Reproduction',
    prompt:
      'Draw a neat labeled longitudinal diagram of a mature human spermatozoon. Explain the specialized roles of its acrosome, middle piece mitochondria, and flagellar tail in successful fertilisation.',
    boardFrequency: {
      count: 'High-Yield Concept • Human Reproduction',
      years: ['2015', '2017', '2019', '2021', '2023', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'bio-2026-23',
    subjectId: 'biology',
    questionNumber: 23,
    section: 'Section C · Q23',
    sectionCode: 'C',
    questionType: 'diagram',
    marks: 3,
    chapterTag: 'Ch 09 · Biotechnology Principles',
    prompt:
      'Illustrate and explain the three thermal steps of one Polymerase Chain Reaction (PCR) cycle with approximate reaction temperatures. Name the bacterium from which Taq DNA polymerase is isolated and why its thermostability is vital. How many DNA copies result from a single dsDNA template after 3 cycles?',
    boardFrequency: {
      count: 'High-Yield Concept • Biotechnology Principles',
      years: ['2015', '2017', '2018', '2020', '2022', '2024', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'bio-2026-24',
    subjectId: 'biology',
    questionNumber: 24,
    section: 'Section C · Q24',
    sectionCode: 'C',
    questionType: 'numerical',
    marks: 3,
    chapterTag: 'Ch 04 · Principles of Inheritance',
    prompt:
      'In garden pea (Pisum sativum), Tall stem (T) is dominant over dwarf (t) and Red flower (R) is dominant over white (r). A geneticist crosses a dihybrid Tall Red plant (TtRr) with a Tall White plant (Ttrr).\nWrite all gametes formed, construct the Punnett square to derive the phenotypic ratio, and calculate the expected number of seeds of each phenotype out of 80 F₁ seeds harvested.',
    boardFrequency: {
      count: 'High-Yield Concept • Principles of Inheritance',
      years: ['2016', '2018', '2021', '2023', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'bio-2026-25',
    subjectId: 'biology',
    questionNumber: 25,
    section: 'Section C · Q25',
    sectionCode: 'C',
    questionType: 'diagram',
    marks: 3,
    chapterTag: 'Ch 09 · Biotechnology Principles',
    prompt:
      'Sketch a clean, labeled circular map of plasmid cloning vector pBR322 showing ori, rop, amp^R, tet^R, and BamHI site. Explain how insertional inactivation at BamHI allows recombinant colonies to be separated from non-recombinants.',
    boardFrequency: {
      count: 'High-Yield Concept • Biotechnology Principles',
      years: ['2016', '2018', '2020', '2022', '2024', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'bio-2026-26',
    subjectId: 'biology',
    questionNumber: 26,
    section: 'Section C · Q26',
    sectionCode: 'C',
    questionType: 'short',
    marks: 3,
    chapterTag: 'Ch 05 · Molecular Basis of Inheritance',
    diagramId: 'bio-q26-lac-operon',
    questionDiagramSvg: QUESTION_DIAGRAM_SVGS['bio-q26-lac-operon'],
    prompt:
      'Referring to the E. coli Lac Operon genetic locus schematic shown below, explain how the operon switches between its OFF state (absence of lactose) and ON state (presence of lactose inducer), specifying the roles of the i gene repressor and structural genes z, y, and a.',
    boardFrequency: {
      count: 'High-Yield Concept • Molecular Basis of Inheritance',
      years: ['2015', '2017', '2019', '2021', '2023', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'bio-2026-27',
    subjectId: 'biology',
    questionNumber: 27,
    section: 'Section C · Q27',
    sectionCode: 'C',
    questionType: 'short',
    marks: 3,
    chapterTag: 'Ch 10 · Biotechnology Applications',
    prompt:
      '(a) What is RNA interference (RNAi), and what natural biological role does it play inside eukaryotes?\n(b) Outline how Agrobacterium tumefaciens vectors engineer Meloidogyne incognita resistance in transgenic tobacco roots.',
    boardFrequency: {
      count: 'High-Yield Concept • Biotechnology Applications',
      years: ['2017', '2019', '2021', '2023', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'bio-2026-28',
    subjectId: 'biology',
    questionNumber: 28,
    section: 'Section C · Q28',
    sectionCode: 'C',
    questionType: 'short',
    marks: 3,
    chapterTag: 'Ch 12 · Ecosystem',
    diagramId: 'bio-q28-pyramids',
    questionDiagramSvg: QUESTION_DIAGRAM_SVGS['bio-q28-pyramids'],
    prompt:
      'Referring to the ecological pyramids illustrated below, compare the shapes of ecological pyramids of Energy, Biomass, and Number. Justify why the pyramid of energy can never be inverted, whereas a marine pyramid of biomass is typically inverted.',
    boardFrequency: {
      count: 'High-Yield Concept • Ecosystem',
      years: ['2016', '2018', '2020', '2023', '2024'],
      importance: 'High Yield',
    },
  },
  {
    id: 'bio-2026-29',
    subjectId: 'biology',
    questionNumber: 29,
    section: 'Section D · Q29 (Case Study)',
    sectionCode: 'D',
    questionType: 'short',
    marks: 4,
    chapterTag: 'Ch 02 · Human Reproduction',
    diagramId: 'bio-q29-menstrual-graph',
    questionDiagramSvg: QUESTION_DIAGRAM_SVGS['bio-q29-menstrual-graph'],
    caseContext:
      'An endocrinology clinic tracks serum pituitary and ovarian hormone profiles across a 28-day ovarian-uterine cycle (plotted below). A sharp transient spike in Luteinizing Hormone (LH) is recorded on Day 14, followed between Days 15 and 24 by sustained high plasma progesterone.',
    prompt:
      'Interpret the clinical hormone profile:\n(i) Name the Day-14 pituitary event triggered by peak LH and state its immediate ovarian outcome. (1M)\n(ii) Identify the ovarian structure formed post-ovulation that secretes high progesterone during Days 15–24. (1.5M)\n(iii) Explain how progesterone maintains the uterine lining during the luteal phase, and what triggers menstruation if no fertilisation occurs. (1.5M)',
    boardFrequency: {
      count: 'High-Yield Concept • Human Reproduction',
      years: ['2016', '2018', '2020', '2022', '2024', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'bio-2026-30',
    subjectId: 'biology',
    questionNumber: 30,
    section: 'Section D · Q30 (Case Study)',
    sectionCode: 'D',
    questionType: 'short',
    marks: 4,
    chapterTag: 'Ch 08 · Microbes in Human Welfare',
    caseContext:
      'Organic vegetable growers bordering a freshwater wetland sanctuary want to control destructive lepidopteran caterpillars without spraying broad-spectrum organophosphates that kill honeybees, aquatic insects, and songbirds.',
    prompt:
      'Advise the sanctuary agronomists using NCERT biocontrol principles:\n(i) Name the viral genus and specific virus agent deployed as a biological insecticide against caterpillars. (1M)\n(ii) State two distinct ecological advantages of this viral biocontrol over chemical pesticides. (2M)\n(iii) Explain why this agent fits Integrated Pest Management (IPM) in ecologically fragile zones. (1M)',
    boardFrequency: {
      count: 'Frequent Concept • Microbes in Human Welfare',
      years: ['2017', '2020', '2023', '2025'],
      importance: 'Frequent',
    },
  },
  {
    id: 'bio-2026-31',
    subjectId: 'biology',
    questionNumber: 31,
    section: 'Section E · Q31',
    sectionCode: 'E',
    questionType: 'short',
    marks: 5,
    chapterTag: 'Ch 05 · Molecular Basis of Inheritance',
    prompt:
      'Consider a wild-type DNA template strand segment: 3′–TAC GGT CAA ACT–5′.\n(a) Transcribe the exact 5′→3′ mRNA sequence and translate the wild-type amino acid chain (Given mRNA codons: AUG = Met, CCA = Pro, GUU = Val, UUU = Phe, UGA / UAG = Stop). (1.5M)\n(b) Analyse the effect of Mutation A, where template triplet CAA mutates to CTA. (1.5M)\n(c) Analyse Mutation B, where the 7th nucleotide (C of CAA) is deleted from the template strand, and state the genetic-code principle illustrated. (2M)',
    boardFrequency: {
      count: 'High-Yield Concept • Molecular Basis of Inheritance',
      years: ['2016', '2019', '2021', '2023', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'bio-2026-32',
    subjectId: 'biology',
    questionNumber: 32,
    section: 'Section E · Q32',
    sectionCode: 'E',
    questionType: 'diagram',
    marks: 5,
    chapterTag: 'Ch 01 · Sexual Reproduction in Flowering Plants',
    prompt:
      'Draw a neat, fully labeled diagram of a mature 7-celled, 8-nucleate angiosperm embryo sac indicating chalazal and micropylar ends. Using this structure, explain the twin events of Syngamy and Triple Fusion during double fertilisation and state the ploidy and fate of each product.',
    boardFrequency: {
      count: 'High-Yield Concept • Sexual Reproduction in Flowering Plants',
      years: ['2015', '2017', '2019', '2020', '2022', '2024', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'bio-2026-33',
    subjectId: 'biology',
    questionNumber: 33,
    section: 'Section E · Q33',
    sectionCode: 'E',
    questionType: 'short',
    marks: 5,
    chapterTag: 'Ch 13 · Biodiversity and Conservation',
    prompt:
      'Elaborate on the four major drivers of biodiversity loss collectively known as "The Evil Quartet", supporting each driver with one specific documented example. Further, distinguish between In-situ and Ex-situ biodiversity conservation with one example of each approach.',
    boardFrequency: {
      count: 'High-Yield Concept • Biodiversity and Conservation',
      years: ['2016', '2018', '2020', '2022', '2024', '2025'],
      importance: 'High Yield',
    },
  },

  // =========================================================================
  // MATHEMATICS (041) — Sections B to E (Q21 – Q38, Total 60 Marks)
  // =========================================================================
  {
    id: 'math-2026-21',
    subjectId: 'maths',
    questionNumber: 21,
    section: 'Section B · Q21',
    sectionCode: 'B',
    questionType: 'numerical',
    marks: 2,
    chapterTag: 'Ch 07 · Integrals',
    prompt: 'Evaluate the indefinite integral: ∫ dx / (x √(x⁸ − 1)), where x > 1.',
    boardFrequency: {
      count: 'High-Yield Concept • Integrals',
      years: ['2016', '2018', '2021', '2023', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'math-2026-22',
    subjectId: 'maths',
    questionNumber: 22,
    section: 'Section B · Q22',
    sectionCode: 'B',
    questionType: 'derivation_or_proof',
    marks: 2,
    chapterTag: 'Ch 05 · Continuity & Differentiability',
    prompt:
      'If eʸ (x + 2) = 1 (with x > −2), prove that d²y / dx² = (dy / dx)².',
    boardFrequency: {
      count: 'High-Yield Concept • Continuity & Differentiability',
      years: ['2015', '2017', '2019', '2022', '2024', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'math-2026-23',
    subjectId: 'maths',
    questionNumber: 23,
    section: 'Section B · Q23',
    sectionCode: 'B',
    questionType: 'numerical',
    marks: 2,
    chapterTag: 'Ch 11 · 3D Geometry',
    prompt:
      'Find the exact value of k such that the Cartesian lines (x − 2)/3 = (y + 1)/(−4) = (z − 5)/6 and (1 − x)/6 = (y + 3)/8 = (z − 2)/k are parallel to each other.',
    boardFrequency: {
      count: 'Frequent Concept • 3D Geometry',
      years: ['2017', '2019', '2022', '2024'],
      importance: 'Frequent',
    },
  },
  {
    id: 'math-2026-24',
    subjectId: 'maths',
    questionNumber: 24,
    section: 'Section B · Q24',
    sectionCode: 'B',
    questionType: 'numerical',
    marks: 2,
    chapterTag: 'Ch 10 · Vector Algebra',
    prompt:
      'Given vectors a and b satisfying |a × b|² + (a · b)² = 196 and |a| = 7, determine |b|.',
    boardFrequency: {
      count: 'High-Yield Concept • Vector Algebra',
      years: ['2016', '2018', '2020', '2023', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'math-2026-25',
    subjectId: 'maths',
    questionNumber: 25,
    section: 'Section B · Q25',
    sectionCode: 'B',
    questionType: 'short',
    marks: 2,
    chapterTag: 'Ch 12 · Linear Programming',
    diagramId: 'math-q25-lpp-region',
    questionDiagramSvg: QUESTION_DIAGRAM_SVGS['math-q25-lpp-region'],
    prompt:
      'Write the complete system of linear inequations defining the bounded first-quadrant feasible region shown shaded below beneath the line passing through (4, 0) and (0, 6) and the line passing through (6, 0) and (0, 2).',
    boardFrequency: {
      count: 'Core Concept • Linear Programming',
      years: ['2018', '2020', '2023', '2025'],
      importance: 'Core Concept',
    },
  },
  {
    id: 'math-2026-26',
    subjectId: 'maths',
    questionNumber: 26,
    section: 'Section C · Q26',
    sectionCode: 'C',
    questionType: 'numerical',
    marks: 3,
    chapterTag: 'Ch 04 · Determinants',
    prompt:
      'Given matrices A = [[1, −1, 0], [2, 3, 4], [0, 1, 2]] and B = [[2, 2, −4], [−4, 2, −4], [2, −1, 5]], first compute the matrix product AB. Hence use A⁻¹ to solve the linear system:\nx − y = 3\n2x + 3y + 4z = 17\ny + 2z = 7.',
    boardFrequency: {
      count: 'High-Yield Concept • Determinants',
      years: ['2016', '2018', '2020', '2022', '2024', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'math-2026-27',
    subjectId: 'maths',
    questionNumber: 27,
    section: 'Section C · Q27',
    sectionCode: 'C',
    questionType: 'numerical',
    marks: 3,
    chapterTag: 'Ch 06 · Application of Derivatives',
    prompt:
      'Water is flowing at a uniform rate of 4 cm³/s into an inverted right circular conical vessel of total depth 6 cm and top radius 3 cm. Find the rate at which the water level h is rising at the instant when h = 3 cm.',
    boardFrequency: {
      count: 'High-Yield Concept • Application of Derivatives',
      years: ['2016', '2018', '2021', '2023', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'math-2026-28',
    subjectId: 'maths',
    questionNumber: 28,
    section: 'Section C · Q28',
    sectionCode: 'C',
    questionType: 'derivation_or_proof',
    marks: 3,
    chapterTag: 'Ch 05 · Differentiation',
    prompt:
      'Given the parametric curve x = a(cos t + ln tan(t/2)) and y = a sin t (a > 0), find d²y / dx² in terms of parameter t, and evaluate its exact value at t = π/4.',
    boardFrequency: {
      count: 'High-Yield Concept • Differentiation',
      years: ['2015', '2017', '2019', '2021', '2023', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'math-2026-29',
    subjectId: 'maths',
    questionNumber: 29,
    section: 'Section C · Q29',
    sectionCode: 'C',
    questionType: 'derivation_or_proof',
    marks: 3,
    chapterTag: 'Ch 09 · Differential Equations',
    prompt:
      'Find the general solution of the first-order linear differential equation:\nx (dy / dx) + 2y = x² cos x   (x > 0).',
    boardFrequency: {
      count: 'High-Yield Concept • Differential Equations',
      years: ['2016', '2018', '2020', '2022', '2024', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'math-2026-30',
    subjectId: 'maths',
    questionNumber: 30,
    section: 'Section C · Q30',
    sectionCode: 'C',
    questionType: 'numerical',
    marks: 3,
    chapterTag: 'Ch 11 · 3D Geometry',
    diagramId: 'math-q30-perp-foot',
    questionDiagramSvg: QUESTION_DIAGRAM_SVGS['math-q30-perp-foot'],
    prompt:
      'As illustrated in the 3D schematic below, determine the coordinates of the foot M of the perpendicular dropped from point P(0, −3, 0) onto the straight line (x − 1)/2 = (y − 2)/3 = (z − 3)/4. Also compute the shortest perpendicular distance PM.',
    boardFrequency: {
      count: 'High-Yield Concept • 3D Geometry',
      years: ['2015', '2017', '2019', '2022', '2024', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'math-2026-31',
    subjectId: 'maths',
    questionNumber: 31,
    section: 'Section C · Q31',
    sectionCode: 'C',
    questionType: 'diagram',
    marks: 3,
    chapterTag: 'Ch 12 · Linear Programming',
    prompt:
      'Solve the following Linear Programming Problem graphically:\nMinimize Z = 300x + 400y subject to constraints:\n2x + y ≥ 6,   x + 2y ≥ 8,   x ≥ 0,   y ≥ 0.',
    boardFrequency: {
      count: 'High-Yield Concept • Linear Programming',
      years: ['2015', '2017', '2018', '2020', '2022', '2024', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'math-2026-32',
    subjectId: 'maths',
    questionNumber: 32,
    section: 'Section D · Q32',
    sectionCode: 'D',
    questionType: 'derivation_or_proof',
    marks: 5,
    chapterTag: 'Ch 01 · Relations and Functions',
    prompt:
      'Let N be the set of natural numbers and R be the relation defined on N × N by (a, b) R (c, d) if and only if a·d = b·c.\nProve rigorously that R is an equivalence relation on N × N, and write down the equivalence class [(2, 3)].',
    boardFrequency: {
      count: 'High-Yield Concept • Relations and Functions',
      years: ['2016', '2018', '2020', '2022', '2024', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'math-2026-33',
    subjectId: 'maths',
    questionNumber: 33,
    section: 'Section D · Q33',
    sectionCode: 'D',
    questionType: 'derivation_or_proof',
    marks: 5,
    chapterTag: 'Ch 07 · Definite Integrals',
    prompt:
      'Using definite integral properties, evaluate the exact value of:\nI = ∫₀^(π/2) [x / (sin x + cos x)] dx.',
    boardFrequency: {
      count: 'High-Yield Concept • Definite Integrals',
      years: ['2015', '2017', '2019', '2021', '2023', '2024', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'math-2026-34',
    subjectId: 'maths',
    questionNumber: 34,
    section: 'Section D · Q34',
    sectionCode: 'D',
    questionType: 'diagram',
    marks: 5,
    chapterTag: 'Ch 08 · Application of Integrals',
    prompt:
      'Sketch the intersecting graphs of the parabola y² = 4x and the line 2x − y = 4, clearly marking the points of intersection. Using definite integration, compute the exact area of the finite region enclosed between them.',
    boardFrequency: {
      count: 'High-Yield Concept • Application of Integrals',
      years: ['2015', '2017', '2018', '2020', '2022', '2024', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'math-2026-35',
    subjectId: 'maths',
    questionNumber: 35,
    section: 'Section D · Q35',
    sectionCode: 'D',
    questionType: 'numerical',
    marks: 5,
    chapterTag: 'Ch 13 · Bayes’ Theorem',
    prompt:
      'In a regional health screening drive, 5% of participants carry a certain metabolic marker. A rapid diagnostic sensor detects the marker accurately in 95% of true carriers, but also registers a false-positive signal in 2% of healthy participants.\nIf a randomly screened individual receives a positive sensor reading, use Bayes’ Theorem to calculate the probability that the individual truly carries the marker.',
    boardFrequency: {
      count: 'High-Yield Concept • Bayes’ Theorem',
      years: ['2015', '2017', '2019', '2021', '2023', '2024', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'math-2026-36',
    subjectId: 'maths',
    questionNumber: 36,
    section: 'Section E · Q36 (Case Study)',
    sectionCode: 'E',
    questionType: 'numerical',
    marks: 4,
    chapterTag: 'Ch 11 · Skew Lines',
    diagramId: 'math-q36-skew-lines',
    questionDiagramSvg: QUESTION_DIAGRAM_SVGS['math-q36-skew-lines'],
    caseContext:
      'As depicted below, two autonomous agricultural survey drones fly along non-intersecting 3D flight corridors modeled in vector form as:\nL₁: r = (î + 2ĵ + k̂) + λ(î − ĵ + k̂)\nL₂: r = (2î − ĵ − k̂) + μ(2î + ĵ + 2k̂).',
    prompt:
      'Analyse flight safety between corridors L₁ and L₂:\n(i) Extract position vectors a₁, a₂ and direction vectors b₁, b₂. (1M)\n(ii) Compute the cross product b₁ × b₂ and confirm the corridors are skew lines. (1.5M)\n(iii) Calculate the shortest separation distance between the two flight corridors. (1.5M)',
    boardFrequency: {
      count: 'High-Yield Concept • Skew Lines',
      years: ['2016', '2018', '2020', '2022', '2024', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'math-2026-37',
    subjectId: 'maths',
    questionNumber: 37,
    section: 'Section E · Q37 (Case Study)',
    sectionCode: 'E',
    questionType: 'numerical',
    marks: 4,
    chapterTag: 'Ch 06 · Maxima & Minima',
    caseContext:
      'A solar microgrid controller models hourly inverter power output Y (in kW units) as a quadratic function of array operating temperature T (in °C): Y(T) = 48 + 3.6 T − 0.03 T², for 10 ≤ T ≤ 100.',
    prompt:
      'Apply differential calculus to optimize microgrid performance:\n(i) Find the rate of change Y′(T). (1M)\n(ii) Determine the critical temperature T at which output reaches an extremum, and prove using the second derivative test that it is a maximum. (1.5M)\n(iii) Compute the maximum achievable inverter power yield Y_max. (1.5M)',
    boardFrequency: {
      count: 'High-Yield Concept • Maxima & Minima',
      years: ['2018', '2020', '2022', '2024', '2025'],
      importance: 'High Yield',
    },
  },
  {
    id: 'math-2026-38',
    subjectId: 'maths',
    questionNumber: 38,
    section: 'Section E · Q38 (Case Study)',
    sectionCode: 'E',
    questionType: 'numerical',
    marks: 4,
    chapterTag: 'Ch 04 · Determinants & Matrices',
    caseContext:
      'A school bookstore packs three STEM stationery bundles combining Notebooks (x), Pens (y), and Lab Manuals (z):\n• Bundle A (2 Notebooks, 3 Pens, 1 Lab Manual) costs ₹650.\n• Bundle B (1 Notebook, 2 Pens, 3 Lab Manuals) costs ₹610.\n• Bundle C (3 Notebooks, 1 Pen, 2 Lab Manuals) costs ₹600.',
    prompt:
      'Solve for individual item prices using the matrix inverse method:\n(i) Represent the cost constraints as a matrix equation A X = B. (1M)\n(ii) Evaluate determinant |A| to show the pricing system has a unique solution. (1M)\n(iii) Find adj(A) and compute the unit prices x, y, and z (in ₹). (2M)',
    boardFrequency: {
      count: 'High-Yield Concept • Determinants & Matrices',
      years: ['2017', '2019', '2021', '2023', '2025'],
      importance: 'High Yield',
    },
  },
];
