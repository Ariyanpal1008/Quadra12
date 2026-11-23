import {SubjectMarkingSchemeMap} from './types';

export const CHEMISTRY_MARKING_SCHEME: SubjectMarkingSchemeMap = {
  // Section A (Q1 – Q16)
  'chem-2026-1': {
    questionId: 'chem-2026-1',
    section: 'Section A · Q1',
    maxMarks: 1,
    exactModelAnswer:
      'Isomeric primary amine (high bp 350.8 K due to maximum intermolecular H-bonding) reacts with Hinsberg reagent (C₆H₅SO₂Cl) to yield an N-alkylbenzenesulphonamide containing an acidic N–H proton, making it soluble in aqueous KOH/NaOH.',
    stepMarks: [{label: 'Hinsberg solubility of 1° amine sulphonamide in alkali', marks: 1}],
    finalAnswerValue: 'Amine R (1°) forms an alkali-soluble white precipitate with Hinsberg reagent',
    examinerCheckpoints: ['Primary amine highest bp', 'Sulphonamide soluble in NaOH'],
  },
  'chem-2026-2': {
    questionId: 'chem-2026-2',
    section: 'Section A · Q2',
    maxMarks: 1,
    exactModelAnswer:
      'In [NiCl₄]²⁻, Ni²⁺ has 3d⁸ configuration. Weak-field Cl⁻ ligands do not cause pairing of d-electrons, so Ni²⁺ undergoes sp³ hybridisation, forming a paramagnetic tetrahedral complex.',
    stepMarks: [{label: 'sp³ hybridisation with weak-field Cl⁻', marks: 1}],
    finalAnswerValue: '[NiCl₄]²⁻',
    examinerCheckpoints: ['Weak field ligand Cl⁻ leaves 2 unpaired electrons', 'sp³ tetrahedral'],
  },
  'chem-2026-3': {
    questionId: 'chem-2026-3',
    section: 'Section A · Q3',
    maxMarks: 1,
    exactModelAnswer:
      'In Cr₂O₇²⁻, Cr is in +6 oxidation state: Cr⁶⁺ + 6e⁻ → Cr(s). Therefore, reducing 1 mole of Cr⁶⁺ requires 6 moles of electrons = 6 F of charge.',
    stepMarks: [{label: 'Oxidation state +6 reduction stoichiometry', marks: 1}],
    finalAnswerValue: '6 F',
    examinerCheckpoints: ['6 electrons per Cr atom → 6 F'],
  },
  'chem-2026-4': {
    questionId: 'chem-2026-4',
    section: 'Section A · Q4',
    maxMarks: 1,
    exactModelAnswer:
      'The carbylamine test (CHCl₃ + alc. KOH forming foul-smelling isocyanide) is given specifically by primary aliphatic or aromatic amines. Complete reduction of nitrobenzene yields aniline (a 1° amine).',
    stepMarks: [{label: 'Carbylamine specificity for 1° amines', marks: 1}],
    finalAnswerValue: 'Catalytic/acidic reduction of nitrobenzene to aniline',
    examinerCheckpoints: ['Only 1° amines give carbylamine test'],
  },
  'chem-2026-5': {
    questionId: 'chem-2026-5',
    section: 'Section A · Q5',
    maxMarks: 1,
    exactModelAnswer:
      'By Henry’s Law (p = K_H x), increasing external piston pressure increases gas partial pressure above the solvent, raising dissolved gas concentration until a new dynamic equilibrium is attained.',
    stepMarks: [{label: 'Henry’s law pressure-solubility relationship', marks: 1}],
    finalAnswerValue: 'Dissolved gas concentration increases until dynamic equilibrium is restored',
    examinerCheckpoints: ['Dynamic equilibrium', 'Higher pressure → higher solubility'],
  },
  'chem-2026-6': {
    questionId: 'chem-2026-6',
    section: 'Section A · Q6',
    maxMarks: 1,
    exactModelAnswer:
      'With equimolar ethyl acetate and water, rate depends on both [ester] and [H₂O] (second order). With large excess water, [H₂O] remains effectively constant, yielding pseudo-first order kinetics.',
    stepMarks: [{label: 'Second order vs pseudo-first order', marks: 1}],
    finalAnswerValue: '(i) Second order, (ii) First order (pseudo-first order)',
    examinerCheckpoints: ['Excess water makes kinetics pseudo-first order'],
  },
  'chem-2026-7': {
    questionId: 'chem-2026-7',
    section: 'Section A · Q7',
    maxMarks: 1,
    exactModelAnswer:
      'Lysine contains two basic amino (–NH₂) groups and only one –COOH group (making it a basic amino acid), and since humans cannot synthesise it, it is an essential amino acid.',
    stepMarks: [{label: 'Basicity & dietary essential classification', marks: 1}],
    finalAnswerValue: 'Basic and essential amino acid',
    examinerCheckpoints: ['More –NH₂ than –COOH → basic', 'Must come from diet → essential'],
  },
  'chem-2026-8': {
    questionId: 'chem-2026-8',
    section: 'Section A · Q8',
    maxMarks: 1,
    exactModelAnswer:
      '2-methylbutan-2-ol is a tertiary alcohol prepared from a ketone + Grignard reagent: both propanone + C₂H₅MgBr and butan-2-one + CH₃MgBr yield 2-methylbutan-2-ol upon hydrolysis.',
    stepMarks: [{label: 'Ketone + Grignard synthesis of 3° alcohol', marks: 1}],
    finalAnswerValue: 'Propanone + C₂H₅MgBr AND Butan-2-one + CH₃MgBr',
    examinerCheckpoints: ['Both combinations add to give C₅ 3° alcohol'],
  },
  'chem-2026-9': {
    questionId: 'chem-2026-9',
    section: 'Section A · Q9',
    maxMarks: 1,
    exactModelAnswer:
      'Ce⁴⁺ (4f⁰) strongly oxidises substances in aqueous solution by readily gaining an electron to revert to the stable lanthanoid +3 state (Ce³⁺, E° Ce⁴⁺/Ce³⁺ = +1.74 V).',
    stepMarks: [{label: 'Stability of +3 lanthanoid oxidation state', marks: 1}],
    finalAnswerValue: 'Cerium (+4 state: Ce⁴⁺)',
    examinerCheckpoints: ['Ce⁴⁺ → Ce³⁺ high reduction potential'],
  },
  'chem-2026-10': {
    questionId: 'chem-2026-10',
    section: 'Section A · Q10',
    maxMarks: 1,
    exactModelAnswer:
      'Stereospecific conversion of (+)-2-chlorobutane exclusively into (−)-butan-2-ol proceeds via concerted backside nucleophilic substitution (SN2 mechanism) with complete inversion of configuration.',
    stepMarks: [{label: 'SN2 Walden inversion identification', marks: 1}],
    finalAnswerValue: 'SN2 mechanism with complete inversion of configuration',
    examinerCheckpoints: ['100% inversion → SN2'],
  },
  'chem-2026-11': {
    questionId: 'chem-2026-11',
    section: 'Section A · Q11',
    maxMarks: 1,
    exactModelAnswer:
      'For first-order kinetics, 87.5% completion leaves 12.5% (1/8 = (1/2)³), equal to 3 half-lives: t₈₇.₅% = 3 × t₁/₂ = 3 × 25 = 75 min.',
    stepMarks: [{label: 'First-order half-life multiple (3 × 25 min)', marks: 1}],
    finalAnswerValue: '75 min',
    examinerCheckpoints: ['87.5% = 3 half-lives', '3 × 25 = 75 min'],
  },
  'chem-2026-12': {
    questionId: 'chem-2026-12',
    section: 'Section A · Q12',
    maxMarks: 1,
    exactModelAnswer:
      'In dilute aqueous solution, 0.1 M H₂SO₄ is a strong electrolyte producing twice the H⁺ ion concentration (high ionic mobility), giving greater molar/specific conductance than weak acids or non-electrolytes.',
    stepMarks: [{label: 'Strong acid complete dissociation & H⁺ mobility', marks: 1}],
    finalAnswerValue: '0.1 M H₂SO₄',
    examinerCheckpoints: ['Strong diprotic electrolyte → highest conductivity'],
  },
  'chem-2026-13': {
    questionId: 'chem-2026-13',
    section: 'Section A · Q13',
    maxMarks: 1,
    exactModelAnswer:
      'Direct nitration of aniline forms ~47% m-nitroaniline because acidic HNO₃/H₂SO₄ protonates –NH₂ to –NH₃⁺ (strongly meta-directing). Thus A is true, R is true, but R does not explain meta formation.',
    stepMarks: [{label: 'Anilinium ion formation explanation', marks: 1}],
    finalAnswerValue: 'Both A and R are true, and R is not the correct explanation of A',
    examinerCheckpoints: ['Protonation forms meta-directing –NH₃⁺'],
  },
  'chem-2026-14': {
    questionId: 'chem-2026-14',
    section: 'Section A · Q14',
    maxMarks: 1,
    exactModelAnswer:
      'Both CrO₄²⁻ and Cr₂O₇²⁻ have tetrahedral coordination around Cr (A true), and Cr–O π-bonding involves overlap of filled oxygen 2p orbitals with empty chromium 3d orbitals (pπ–dπ), not p orbitals of Cr (R false).',
    stepMarks: [{label: 'pπ–dπ overlap identification', marks: 1}],
    finalAnswerValue: 'A is true but R is false',
    examinerCheckpoints: ['pπ–dπ bonding, not pπ–pπ'],
  },
  'chem-2026-15': {
    questionId: 'chem-2026-15',
    section: 'Section A · Q15',
    maxMarks: 1,
    exactModelAnswer:
      'Lower ethers dissolve in water roughly like alcohols of matching molar mass because the lone pairs on ethereal oxygen form hydrogen bonds with water molecules.',
    stepMarks: [{label: 'Ether-water H-bonding explanation', marks: 1}],
    finalAnswerValue: 'Both A and R are true, and R is the correct explanation of A',
    examinerCheckpoints: ['Oxygen lone pairs accept H-bonds from water'],
  },
  'chem-2026-16': {
    questionId: 'chem-2026-16',
    section: 'Section A · Q16',
    maxMarks: 1,
    exactModelAnswer:
      '[Fe(CN)₆]⁴⁻ contains Fe²⁺ (3d⁶) with strong-field CN⁻ ligands causing spin pairing into t₂g⁶ e_g⁰ (0 unpaired electrons, diamagnetic).',
    stepMarks: [{label: 'Low-spin t₂g⁶ configuration check', marks: 1}],
    finalAnswerValue: 'Both A and R are true, and R is the correct explanation of A',
    examinerCheckpoints: ['Strong-field CN⁻ pairs all six 3d electrons'],
  },

  // Section B (Q17 – Q21, 2 Marks each)
  'chem-2026-17': {
    questionId: 'chem-2026-17',
    section: 'Section B · Q17',
    maxMarks: 2,
    exactModelAnswer:
      '(a) Balanced ionic equation: 6 Fe²⁺ + Cr₂O₇²⁻ + 14 H⁺ → 6 Fe³⁺ + 2 Cr³⁺ + 7 H₂O.\n(b) Chromium (3d⁵4s¹) has six unpaired electrons participating in strong metallic bonding, whereas zinc (3d¹⁰4s²) has zero unpaired d-electrons and weak metallic bonding, so Cr has a much higher melting point.',
    stepMarks: [
      {label: 'Balanced ionic redox equation (6 Fe²⁺ : 1 Cr₂O₇²⁻ : 14 H⁺)', marks: 1},
      {label: 'Unpaired d-electron metallic bonding explanation for Cr vs Zn', marks: 1},
    ],
    finalAnswerValue: '6 Fe²⁺ + Cr₂O₇²⁻ + 14 H⁺ → 6 Fe³⁺ + 2 Cr³⁺ + 7 H₂O',
    examinerCheckpoints: ['Stoichiometry 6, 1, 14 → 6, 2, 7', '3d⁵ vs filled 3d¹⁰'],
  },
  'chem-2026-18': {
    questionId: 'chem-2026-18',
    section: 'Section B · Q18',
    maxMarks: 2,
    exactModelAnswer:
      'Moles of glucose n = 1.8 g / 180 g mol⁻¹ = 0.01 mol.\nVolume V = 500 mL = 0.5 L ⇒ Molarity C = 0.01 / 0.5 = 0.02 M.\nOsmotic pressure π = C R T = 0.02 × 0.0821 × 300 = 0.4926 atm (≈ 0.493 atm).',
    stepMarks: [
      {label: 'Molarity C = 0.02 M', marks: 0.5},
      {label: 'Formula π = C R T and substitution', marks: 0.5},
      {label: 'Final answer π = 0.493 atm (or ~49.9 kPa) with unit', marks: 1},
    ],
    finalAnswerValue: 'π = 0.493 atm (0.4926 atm)',
    examinerCheckpoints: ['n = 0.01 mol', 'V = 0.5 L', 'π = 0.493 atm'],
  },
  'chem-2026-19': {
    questionId: 'chem-2026-19',
    section: 'Section B · Q19',
    maxMarks: 2,
    exactModelAnswer:
      'Increasing basicity in aqueous solution: NH₃ < (CH₃)₃N < CH₃NH₂ < (CH₃)₂NH.\nReason: Electron-releasing +I effect of methyl groups increases N electron density, while hydration/solvation energy stabilizes protonated ions in order 1° > 2° > 3° and steric hindrance opposes protonation of 3° amine. Combined effect makes secondary (CH₃)₂NH strongest.',
    stepMarks: [
      {label: 'Correct increasing order NH₃ < (CH₃)₃N < CH₃NH₂ < (CH₃)₂NH', marks: 1},
      {label: 'Justification combining +I, H-bonding solvation & steric factors', marks: 1},
    ],
    finalAnswerValue: 'NH₃ < (CH₃)₃N < CH₃NH₂ < (CH₃)₂NH',
    examinerCheckpoints: ['2° > 1° > 3° > NH₃ for methylamines in water', 'Solvation + steric + inductive effects mentioned'],
  },
  'chem-2026-20': {
    questionId: 'chem-2026-20',
    section: 'Section B · Q20',
    maxMarks: 2,
    exactModelAnswer:
      'Step 1 (Protonation): CH₃CH₂OH + H⁺ ⇌ CH₃CH₂–O⁺H₂ (fast).\nStep 2 (Carbocation formation): CH₃CH₂–O⁺H₂ → CH₃CH₂⁺ + H₂O (slow, r.d.s.).\nStep 3 (Deprotonation): CH₃CH₂⁺ → CH₂=CH₂ + H⁺ (elimination of proton restores catalyst).',
    stepMarks: [
      {label: 'Step 1: Protonation of ethanol with arrow notation', marks: 0.5},
      {label: 'Step 2: Slow loss of H₂O forming ethyl carbocation', marks: 1},
      {label: 'Step 3: Deprotonation yielding ethene + H⁺', marks: 0.5},
    ],
    finalAnswerValue: '3-step E1 dehydration yielding CH₂=CH₂ + H⁺',
    examinerCheckpoints: ['Protonated alcohol intermediate', 'Ethyl carbocation r.d.s.', 'Ethene product'],
  },
  'chem-2026-21': {
    questionId: 'chem-2026-21',
    section: 'Section B · Q21',
    maxMarks: 2,
    exactModelAnswer:
      '(a) p-Dichlorobenzene has a symmetrical molecular shape that packs much more tightly into a crystal lattice, requiring greater thermal energy to melt.\n(b) Haloarenes resist nucleophilic substitution due to: (i) resonance stabilization imparting partial double-bond character to the C–X bond, (ii) sp²-hybridised carbon holding C–X tightly, and (iii) instability of phenyl cation.',
    stepMarks: [
      {label: '(a) Crystal lattice packing symmetry of p-isomer', marks: 1},
      {label: '(b) Partial double-bond C–X character by resonance & sp² C', marks: 1},
    ],
    finalAnswerValue: 'Crystal packing symmetry; Resonance + sp² C–X strength',
    examinerCheckpoints: ['Symmetry → close lattice packing', 'Resonance partial double bond'],
  },

  // Section C (Q22 – Q28, 3 Marks each)
  'chem-2026-22': {
    questionId: 'chem-2026-22',
    section: 'Section C · Q22',
    maxMarks: 3,
    exactModelAnswer:
      '(i) (−)-2-Bromooctane undergoes SN2 concerted backside attack by OH⁻ forming (+)-octan-2-ol with 100% inversion of configuration (single step, rate = k[RX][OH⁻]).\n(ii) In SN1, optically active halide passes through a planar sp² carbocation intermediate allowing front and back attack, yielding racemic mixture.\n(iii) Allylic halides hydrolyse rapidly via SN1 because the allylic carbocation (CH₂=CH–CH₂⁺) is stabilized by resonance delocalisation.',
    stepMarks: [
      {label: 'SN2 backside attack & inversion in (−)-2-bromooctane', marks: 1},
      {label: 'Planar carbocation racemisation in SN1', marks: 1},
      {label: 'Resonance stability of allylic carbocation', marks: 1},
    ],
    finalAnswerValue: 'SN2 inversion; SN1 racemisation; Resonance-stabilized allyl cation',
    examinerCheckpoints: ['Planar carbocation → racemisation', 'Resonance stabilization of allylic cation'],
  },
  'chem-2026-23': {
    questionId: 'chem-2026-23',
    section: 'Section C · Q23',
    maxMarks: 3,
    exactModelAnswer:
      'Arrhenius equation: log(k₂/k₁) = [E_a / (2.303 R)] × [(T₂ − T₁) / (T₁ T₂)].\nHere k₂/k₁ = 3, T₁ = 300 K, T₂ = 310 K, R = 8.314 J K⁻¹ mol⁻¹.\nlog 3 = 0.4771 = [E_a / (2.303 × 8.314)] × [10 / (300 × 310)].\nE_a = 0.4771 × 2.303 × 8.314 × 9300 = 84,930 J/mol ≈ 84.93 kJ/mol.',
    stepMarks: [
      {label: 'Correct two-temperature Arrhenius formula', marks: 1},
      {label: 'Substitution of T₁ = 300 K, T₂ = 310 K, log 3 = 0.4771', marks: 1},
      {label: 'Calculated E_a = 84.93 kJ/mol with SI unit', marks: 1},
    ],
    finalAnswerValue: 'E_a = 84.93 kJ mol⁻¹ (84,930 J mol⁻¹)',
    examinerCheckpoints: ['Arrhenius log formula', 'T in Kelvin', 'E_a ≈ 84.9 kJ/mol'],
  },
  'chem-2026-24': {
    questionId: 'chem-2026-24',
    section: 'Section C · Q24',
    maxMarks: 3,
    exactModelAnswer:
      '(a) Reimer–Tiemann: Phenol + CHCl₃ + aq. NaOH (340 K), followed by H₃O⁺ → Salicylaldehyde (2-hydroxybenzaldehyde).\n(b) Hoffmann bromamide: CH₃CH₂CONH₂ + Br₂ + 4 KOH → CH₃CH₂NH₂ (ethanamine) + K₂CO₃ + 2 KBr + 2 H₂O.\n(c) Rosenmund reduction: C₆H₅COCl + H₂ (Pd/BaSO₄, boiling xylene) → C₆H₅CHO (benzaldehyde) + HCl.',
    stepMarks: [
      {label: '(a) Reimer–Tiemann reagents & salicylaldehyde product', marks: 1},
      {label: '(b) Hoffmann bromamide ethanamine product & Br₂/KOH', marks: 1},
      {label: '(c) Rosenmund Pd/BaSO₄ catalyst & benzaldehyde product', marks: 1},
    ],
    finalAnswerValue: 'Salicylaldehyde; Ethanamine; Benzaldehyde',
    examinerCheckpoints: ['CHCl₃/NaOH → salicylaldehyde', 'One less carbon amine', 'Pd-BaSO₄ poisoned catalyst'],
  },
  'chem-2026-25': {
    questionId: 'chem-2026-25',
    section: 'Section C · Q25',
    maxMarks: 3,
    exactModelAnswer:
      'Geometrical isomers of [CoCl₂(en)₂]⁺: trans-isomer (two Cl⁻ ligands at 180° opposite positions, two en chelating rings equatorial) and cis-isomer (two Cl⁻ ligands adjacent at 90°).\nOptical isomerism: The trans-isomer possesses a plane/center of symmetry and is optically INACTIVE (meso/achiral). The cis-isomer lacks symmetry and exists as non-superimposable d- and l-enantiomeric mirror-image pairs.',
    stepMarks: [
      {label: 'Octahedral cis and trans drawings of [CoCl₂(en)₂]⁺', marks: 1.5},
      {label: 'Optical d and l mirror-image structures for cis-isomer', marks: 1},
      {label: 'Identify trans-isomer as optically inactive due to symmetry', marks: 0.5},
    ],
    finalAnswerValue: 'cis (d/l optically active pair); trans (optically inactive)',
    examinerCheckpoints: ['Octahedral chelate rings drawn accurately', 'trans is optically inactive'],
  },
  'chem-2026-26': {
    questionId: 'chem-2026-26',
    section: 'Section C · Q26',
    maxMarks: 3,
    exactModelAnswer:
      'Given C = 0.02 M, R = 250 Ω, cell constant G* = 1.25 cm⁻¹.\nConductivity κ = G* / R = 1.25 / 250 = 0.005 S cm⁻¹ (or 5 × 10⁻³ S cm⁻¹).\nMolar conductivity Λ_m = (1000 × κ) / C = (1000 × 0.005) / 0.02 = 250 S cm² mol⁻¹.',
    stepMarks: [
      {label: 'Formula κ = G* / R and calculation 0.005 S cm⁻¹', marks: 1.5},
      {label: 'Formula Λ_m = 1000κ / M and answer 250 S cm² mol⁻¹ with units', marks: 1.5},
    ],
    finalAnswerValue: 'κ = 0.005 S cm⁻¹; Λ_m = 250 S cm² mol⁻¹',
    examinerCheckpoints: ['κ = 0.005 S cm⁻¹', 'Λ_m = 250 S cm² mol⁻¹'],
  },
  'chem-2026-27': {
    questionId: 'chem-2026-27',
    section: 'Section C · Q27',
    maxMarks: 3,
    exactModelAnswer:
      '(a) Fibrous proteins (e.g., keratin, myosin): elongated polypeptide chains held by H- and disulphide bonds, water-insoluble. Globular proteins (e.g., insulin, albumin): folded spherical shape, usually water-soluble.\n(b) Zwitterion of glycine: Dipolar ion H₃N⁺–CH₂–COO⁻ formed by internal proton transfer.\n(c) Nucleotides in DNA are linked by 3′–5′ phosphodiester bonds.',
    stepMarks: [
      {label: 'Fibrous vs globular proteins + examples', marks: 1},
      {label: 'Zwitterion formula H₃N⁺–CH₂–COO⁻', marks: 1},
      {label: '3′–5′ phosphodiester linkage', marks: 1},
    ],
    finalAnswerValue: 'Fibrous vs Globular; H₃N⁺–CH₂–COO⁻; 3′–5′ phosphodiester bond',
    examinerCheckpoints: ['Water solubility contrast', 'Correct dipolar ion formula', 'Phosphodiester bond'],
  },
  'chem-2026-28': {
    questionId: 'chem-2026-28',
    section: 'Section C · Q28',
    maxMarks: 3,
    exactModelAnswer:
      'Lanthanoid Contraction: Gradual steady decrease in atomic and ionic radii (Ln³⁺) across the 4f series from La to Lu.\nCause: Imperfect/poor shielding of outer valence electrons by 4f orbitals as nuclear charge increases across the series.\nConsequences: (1) Post-lanthanoid 4d and 5d pairs (Zr/Hf, Nb/Ta) exhibit nearly identical atomic radii and chemical properties; (2) Covalent character increases so basicity of hydroxides Ln(OH)₃ decreases from La(OH)₃ to Lu(OH)₃.',
    stepMarks: [
      {label: 'Definition of lanthanoid contraction', marks: 1},
      {label: 'Cause: poor 4f shielding vs increasing nuclear charge', marks: 1},
      {label: 'Any two valid consequences (e.g., Zr/Hf radii, hydroxide basicity)', marks: 1},
    ],
    finalAnswerValue: 'Poor 4f shielding; identical 4d/5d radii & decreasing Ln(OH)₃ basicity',
    examinerCheckpoints: ['Poor 4f shielding named', 'Zr and Hf nearly equal size', 'La(OH)₃ most basic'],
  },

  // Section D (Q29 – Q30 Case Studies, 4 Marks each)
  'chem-2026-29': {
    questionId: 'chem-2026-29',
    section: 'Section D · Q29',
    maxMarks: 4,
    exactModelAnswer:
      '(i) Phenoxide ion (C₆H₅O⁻) is resonance-stabilized by charge dispersal over the ortho/para carbons of the benzene ring, whereas alkoxide (C₂H₅O⁻) has negative charge localized on oxygen, making phenol (pKₐ 10.0) far more acidic than ethanol (15.9).\n(ii) –CH₃ at para position exerts +I and hyperconjugation, intensifying negative charge on phenoxide and lowering acidity (p-cresol pKₐ 10.2 > phenol 10.0).\n(iii) Three electron-withdrawing –NO₂ groups (−R, −I) at o/p positions strongly delocalize the negative charge in picrate ion, making 2,4,6-trinitrophenol extraordinarily acidic (pKₐ 0.4).',
    stepMarks: [
      {label: 'Phenoxide resonance stabilization vs localized alkoxide', marks: 1.5},
      {label: 'Destabilization by +I methyl group in p-cresol', marks: 1},
      {label: 'Strong −R/−I stabilization by three nitro groups in picric acid', marks: 1.5},
    ],
    finalAnswerValue: 'pKₐ order reflects phenoxide charge delocalization vs +I/−R effects',
    examinerCheckpoints: ['Resonance of phenoxide', '+I destabilizes p-cresoxide', '−R of NO₂ groups'],
  },
  'chem-2026-30': {
    questionId: 'chem-2026-30',
    section: 'Section D · Q30',
    maxMarks: 4,
    exactModelAnswer:
      '(i) Sugar X is Sucrose (α-D-glucopyranosyl β-D-fructofuranoside).\n(ii) Sucrose is a non-reducing sugar because both the C₁ aldehyde group of glucose and C₂ ketonic group of fructose are locked in a C1–C2 glycosidic bond, leaving no free hemiacetal group to reduce Tollens’ reagent.\n(iii) Hydrolysis equation: C₁₂H₂₂O₁₁ + H₂O → C₆H₁₂O₆ (D-(+)-glucose, +52.5°) + C₆H₁₂O₆ (D-(−)-fructose, −92.4°). Net specific rotation reverses from dextrorotatory (+66.5°) to laevorotatory (invert sugar).',
    stepMarks: [
      {label: 'Identify Sugar X as Sucrose', marks: 1},
      {label: 'Explain C1–C2 glycosidic linkage locks reducing ends', marks: 1.5},
      {label: 'Hydrolysis products & inversion of optical rotation (+ to −)', marks: 1.5},
    ],
    finalAnswerValue: 'Sucrose; C1–C2 linkage non-reducing; Invert sugar',
    examinerCheckpoints: ['Sucrose identified', 'No free aldehyde/hemiacetal', 'D-(+)-glucose + D-(−)-fructose inversion'],
  },

  // Section E (Q31 – Q33 Long Answer, 5 Marks each)
  'chem-2026-31': {
    questionId: 'chem-2026-31',
    section: 'Section E · Q31',
    maxMarks: 5,
    exactModelAnswer:
      '(1) Tests: (a) Propanal vs Propanone: Warm with Tollens’ reagent ([Ag(NH₃)₂]⁺) — Propanal gives a bright silver mirror; Propanone does not (or Iodoform test: Propanone gives yellow CHI₃ ppt with I₂/NaOH).\n(b) Phenol vs Benzoic acid: Treat with aq. NaHCO₃ — Benzoic acid gives brisk effervescence of CO₂; Phenol does not (or neutral FeCl₃ gives violet colour with phenol).\n(2) Conversions:\n(a) Aniline + NaNO₂ + HCl (273–278 K) → Benzenediazonium chloride; treat with HBF₄ then Δ → Fluorobenzene (Balz–Schiemann).\n(b) Benzaldehyde + CH₃CHO (dil. NaOH, Δ) → Cinnamaldehyde (3-phenylprop-2-enal) + H₂O.',
    stepMarks: [
      {label: 'Propanal vs Propanone distinction test & observation', marks: 1},
      {label: 'Phenol vs Benzoic acid distinction test & observation', marks: 1},
      {label: 'Conversion of Aniline to Fluorobenzene (diazotisation + HBF₄/Δ)', marks: 1.5},
      {label: 'Conversion of Benzaldehyde to 3-phenylprop-2-enal (crossed aldol)', marks: 1.5},
    ],
    finalAnswerValue: 'Tollens’/Iodoform; NaHCO₃/FeCl₃; Balz–Schiemann; Cross-Aldol condensation',
    examinerCheckpoints: ['Exact observation named in each test', '273–278 K diazotisation', 'Balanced steps'],
  },
  'chem-2026-32': {
    questionId: 'chem-2026-32',
    section: 'Section E · Q32',
    maxMarks: 5,
    exactModelAnswer:
      '(a) Octahedral CFT Diagram: Five degenerate d-orbitals split under octahedral ligand field into higher-energy doubly degenerate e_g (d_x²−y², d_z², +0.6 Δ₀) and lower-energy triply degenerate t₂g (d_xy, d_yz, d_zx, −0.4 Δ₀).\n(b) For d⁴: Strong field (Δ₀ > P) → t₂g⁴ e_g⁰, CFSE = 4(−0.4 Δ₀) + P = −1.6 Δ₀ + P. Weak field (Δ₀ < P) → t₂g³ e_g¹, CFSE = 3(−0.4) + 1(+0.6) = −0.6 Δ₀.\n(c) [Fe(CN)₆]⁴⁻ has Fe²⁺(d⁶) low-spin (t₂g⁶ e_g⁰), n = 0 ⇒ μ = 0 BM (diamagnetic). [FeF₆]³⁻ has Fe³⁺(d⁵) weak field (t₂g³ e_g²), n = 5 ⇒ μ = √(5×7) = √35 ≈ 5.92 BM.',
    stepMarks: [
      {label: 'Labeled CFT octahedral energy diagram with +3/5 Δ₀ & −2/5 Δ₀', marks: 1.5},
      {label: 'CFSE calculation for d⁴ strong field (−1.6 Δ₀ + P) & weak field (−0.6 Δ₀)', marks: 1.5},
      {label: 'Magnetic moments μ = 0 BM ([Fe(CN)₆]⁴⁻) and √35 ≈ 5.92 BM ([FeF₆]³⁻)', marks: 2},
    ],
    finalAnswerValue: 'CFSE d⁴: −1.6 Δ₀ + P (SF), −0.6 Δ₀ (WF); μ = 0 BM & 5.92 BM',
    examinerCheckpoints: ['t₂g below e_g barycenter', 'Pairing energy P included if Δ₀ > P', 'n = 0 vs n = 5'],
  },
  'chem-2026-33': {
    questionId: 'chem-2026-33',
    section: 'Section E · Q33',
    maxMarks: 5,
    exactModelAnswer:
      'Cell reaction: Mg(s) + Cu²⁺(aq) → Mg²⁺(aq) + Cu(s), n = 2.\nStandard EMF: E°_cell = E°_cathode − E°_anode = 0.34 − (−2.36) = +2.70 V.\nNernst Equation at 298 K: E_cell = E°_cell − (0.0591 / 2) log([Mg²⁺]/[Cu²⁺]) = 2.70 − 0.02955 log(0.01 / 0.001) = 2.70 − 0.02955 log(10) = 2.70 − 0.02955 = 2.67045 V (≈ 2.67 V).\nStandard Gibbs energy: Δ_r G° = −n F E°_cell = −2 × 96500 × 2.70 = −521,100 J mol⁻¹ = −521.1 kJ mol⁻¹.',
    stepMarks: [
      {label: 'Balanced cell reaction (n = 2) and E°_cell = +2.70 V', marks: 1},
      {label: 'Nernst equation setup with Q = [Mg²⁺]/[Cu²⁺] = 10', marks: 1.5},
      {label: 'Final E_cell = 2.67 V with SI unit', marks: 1},
      {label: 'Δ_r G° = −n F E°_cell = −521.1 kJ mol⁻¹', marks: 1.5},
    ],
    finalAnswerValue: 'E°_cell = 2.70 V; E_cell = 2.67 V; Δ_r G° = −521.1 kJ mol⁻¹',
    examinerCheckpoints: ['n = 2', 'Q = 10', 'E_cell = 2.67 V', 'Δ_r G° = −521.1 kJ mol⁻¹'],
  },
};
