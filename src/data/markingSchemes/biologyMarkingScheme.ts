import {SubjectMarkingSchemeMap} from './types';
import {MARKING_SCHEME_DIAGRAM_SVGS} from '../diagramSvgs';

export const BIOLOGY_MARKING_SCHEME: SubjectMarkingSchemeMap = {
  // Section A (Q1 – Q16, 1 Mark each)
  'bio-2026-1': {
    questionId: 'bio-2026-1',
    section: 'Section A · Q1',
    maxMarks: 1,
    exactModelAnswer:
      'In the transverse section of a microsporangium, the four anther wall layers from outside to inside are: A = Epidermis (protective outer layer), B = Endothecium (fibrous hygroscopic layer aiding anther dehiscence), C = Middle layers (2–3 ephemeral protective layers), and D = Tapetum (innermost nutritive layer with dense cytoplasm and polyploid/binucleate cells nourishing developing pollen grains).',
    stepMarks: [{label: 'Identify innermost nutritive layer D as Tapetum', marks: 1}],
    finalAnswerValue: 'Layer D = Tapetum (nourishes developing pollen grains)',
    examinerCheckpoints: ['A Epidermis, B Endothecium, C Middle layers, D Tapetum'],
  },
  'bio-2026-2': {
    questionId: 'bio-2026-2',
    section: 'Section A · Q2',
    maxMarks: 1,
    exactModelAnswer:
      'Tubectomy involves cutting and tying/blocking a small segment of both Fallopian tubes (oviducts), preventing the released ovum from reaching the ampulla for fertilisation by sperm.',
    stepMarks: [{label: 'Oviduct transport blockade mechanism', marks: 1}],
    finalAnswerValue: 'Prevents ovum transport and fertilisation in the Fallopian tube',
    examinerCheckpoints: ['Oogenesis & menstrual hormones unaffected', 'Physical gamete block'],
  },
  'bio-2026-3': {
    questionId: 'bio-2026-3',
    section: 'Section A · Q3',
    maxMarks: 1,
    exactModelAnswer:
      'The inner cell mass (ICM) contains stem cells endowed with the potency to differentiate into all three germ layers (ectoderm, mesoderm, endoderm) and form all organs of the embryo proper.',
    stepMarks: [{label: 'Role of Inner Cell Mass (ICM) in blastocyst', marks: 1}],
    finalAnswerValue: 'Differentiates into germ layers and tissues of the embryo proper',
    examinerCheckpoints: ['ICM forms embryo', 'Trophoblast handles implantation'],
  },
  'bio-2026-4': {
    questionId: 'bio-2026-4',
    section: 'Section A · Q4',
    maxMarks: 1,
    exactModelAnswer:
      'When environmental pressure favours individuals at one extreme (e.g., birds with larger, thicker beaks cracking hard seeds during drought), the population distribution curve shifts steadily toward that extreme: Directional selection.',
    stepMarks: [{label: 'Directional selection curve shift recognition', marks: 1}],
    finalAnswerValue: 'Directional selection shifting mean phenotype toward one extreme',
    examinerCheckpoints: ['Peak shifts to longer/larger phenotype extreme'],
  },
  'bio-2026-5': {
    questionId: 'bio-2026-5',
    section: 'Section A · Q5',
    maxMarks: 1,
    exactModelAnswer:
      'In bacterial transcription initiation: A = Promoter region, B = Sigma (σ) initiation factor, C = Core RNA polymerase enzyme, D = DNA template duplex.',
    stepMarks: [{label: 'Correct labeling A, B, C, D of transcription complex', marks: 1}],
    finalAnswerValue: 'A: Promoter, B: Sigma factor, C: RNA polymerase, D: DNA helix',
    examinerCheckpoints: ['σ factor aids promoter recognition', 'Rho terminates'],
  },
  'bio-2026-6': {
    questionId: 'bio-2026-6',
    section: 'Section A · Q6',
    maxMarks: 1,
    exactModelAnswer:
      'In the Avery–MacLeod–McCarty experiment, adding Protease, RNase, or Lipase leaves purified DNA intact so S-type transformation of R-strain still proceeds; ONLY DNase degrades the transforming principle (DNA) and halts transformation. Hence a tube treated with Protease showing "No transformation" is inconsistent.',
    stepMarks: [{label: 'Identify Protease/DNase transformation principle test', marks: 1}],
    finalAnswerValue: 'Tube B (+ Protease showing No transformation) is wrongly marked',
    examinerCheckpoints: ['Only DNase stops bacterial transformation'],
  },
  'bio-2026-7': {
    questionId: 'bio-2026-7',
    section: 'Section A · Q7',
    maxMarks: 1,
    exactModelAnswer:
      'E. coli divides every 20 min. Starting with heavy ¹⁵N–¹⁵N DNA in ¹⁴NH₄Cl medium for 40 min completes 2 rounds of semiconservative replication (4 duplexes): 2 remain ¹⁵N–¹⁴N hybrid (50%) and 2 are ¹⁴N–¹⁴N light (50%).',
    stepMarks: [{label: 'Semiconservative replication proportion after 2 generations (40 min)', marks: 1}],
    finalAnswerValue: '50% hybrid and 50% light',
    examinerCheckpoints: ['2 generations in 40 min', '2 hybrid : 2 light = 50% : 50%'],
  },
  'bio-2026-8': {
    questionId: 'bio-2026-8',
    section: 'Section A · Q8',
    maxMarks: 1,
    exactModelAnswer:
      'Carrier unaffected parents producing both an affected son and an affected daughter rules out sex-linked and dominant patterns, proving autosomal recessive inheritance (e.g., Phenylketonuria / Sickle cell anaemia).',
    stepMarks: [{label: 'Autosomal recessive pedigree deduction', marks: 1}],
    finalAnswerValue: 'Autosomal recessive trait (Phenylketonuria)',
    examinerCheckpoints: ['Unaffected parents + affected female rules out X-linked recessive'],
  },
  'bio-2026-9': {
    questionId: 'bio-2026-9',
    section: 'Section A · Q9',
    maxMarks: 1,
    exactModelAnswer:
      'Cyclic high fever every 3–4 days accompanied by chills coincides with rupture of red blood cells (RBCs) releasing the toxic substance haemozoin during infection by Plasmodium (malaria).',
    stepMarks: [{label: 'Haemozoin toxin & RBC lysis correlation', marks: 1}],
    finalAnswerValue: 'Release of haemozoin following rupture of infected erythrocytes',
    examinerCheckpoints: ['Plasmodium schizogony ruptures RBCs releasing haemozoin'],
  },
  'bio-2026-10': {
    questionId: 'bio-2026-10',
    section: 'Section A · Q10',
    maxMarks: 1,
    exactModelAnswer:
      '1 nucleosome ≈ 200 bp ⇒ 150 nucleosomes = 30,000 bp. Linear length = 30,000 × 0.34 nm = 10,200 nm = 1.02 × 10⁻⁵ m (or 10,200 × 10⁻⁹ m).',
    stepMarks: [{label: 'Base pair count (150 × 200) & 0.34 nm pitch calculation', marks: 1}],
    finalAnswerValue: '30,000 bp and 10,200 × 10⁻⁹ m',
    examinerCheckpoints: ['30,000 bp', '10,200 × 10⁻⁹ m'],
  },
  'bio-2026-11': {
    questionId: 'bio-2026-11',
    section: 'Section A · Q11',
    maxMarks: 1,
    exactModelAnswer:
      'Using an elution/sterile-grade bioreactor or monitoring dissolved oxygen, pH, foam, and sterilising feed ports continuously maintains aseptic monoxenic conditions required in downstream fermentation.',
    stepMarks: [{label: 'Bioreactor sterility & sparger/pH control principle', marks: 1}],
    finalAnswerValue: 'Strict steam sterilisation of media, air filters, and sampling ports',
    examinerCheckpoints: ['Aseptic chemical/physical engineering prevents contamination'],
  },
  'bio-2026-12': {
    questionId: 'bio-2026-12',
    section: 'Section A · Q12',
    maxMarks: 1,
    exactModelAnswer:
      'Cyanobacteria (Anabaena, Nostoc) fix atmospheric nitrogen and add organic matter to flooded paddy fields without chemical runoff, acting as eco-friendly biofertilizers.',
    stepMarks: [{label: 'Biofertilizer selection for paddy fields', marks: 1}],
    finalAnswerValue: 'Inoculating flooded paddy soil with Anabaena / Nostoc biofertilizer',
    examinerCheckpoints: ['Cyanobacteria add fixed nitrogen & organic humus in paddy'],
  },
  'bio-2026-13': {
    questionId: 'bio-2026-13',
    section: 'Section A · Q13',
    maxMarks: 1,
    exactModelAnswer:
      'Both A and R are true: spermatogenesis continues from puberty into old age, whereas oogenesis slows/terminates around menopause (~50 years) because oogonia are fixed before birth and no new oogonia are formed after birth.',
    stepMarks: [{label: 'Assertion-Reason oogenesis oogonial reserve link', marks: 1}],
    finalAnswerValue: 'Both A and R are true and R is the correct explanation of A',
    examinerCheckpoints: ['Finite embryonic oogonia reserve', 'Terminates at menopause'],
  },
  'bio-2026-14': {
    questionId: 'bio-2026-14',
    section: 'Section A · Q14',
    maxMarks: 1,
    exactModelAnswer:
      'Genes situated closer together on the same chromosome show tight physical linkage and very low crossing-over recombination (A is false). Recombination frequency is directly proportional to physical map distance between linked genes (R is true).',
    stepMarks: [{label: 'Morgan genetic map distance vs linkage verification', marks: 1}],
    finalAnswerValue: 'A is false but R is true',
    examinerCheckpoints: ['Recombination % rises with distance', 'Sturtevant genetic mapping'],
  },
  'bio-2026-15': {
    questionId: 'bio-2026-15',
    section: 'Section A · Q15',
    maxMarks: 1,
    exactModelAnswer:
      'Activated sludge flocs are masses of bacteria associated with fungal filaments forming mesh-like structures that vigorously consume biodegradable organic matter in aeration tanks, sharply reducing BOD.',
    stepMarks: [{label: 'Secondary sewage treatment aerobic floc mechanism', marks: 1}],
    finalAnswerValue: 'Both A and R are true and R is the correct explanation of A',
    examinerCheckpoints: ['Bacterial-fungal flocs', 'Aerobic digestion reduces BOD'],
  },
  'bio-2026-16': {
    questionId: 'bio-2026-16',
    section: 'Section A · Q16',
    maxMarks: 1,
    exactModelAnswer:
      'Viruses spread systemically except inside rapidly dividing apical/axillary meristems (high auxin, faster cell division outpaces viral movement), enabling production of virus-free plants via meristem culture.',
    stepMarks: [{label: 'Meristem virus-free culture basis', marks: 1}],
    finalAnswerValue: 'Both A and R are true and R is the correct explanation of A',
    examinerCheckpoints: ['Apical/axillary meristem stays free of virus'],
  },

  // Section B (Q17 – Q21, 2 Marks each)
  'bio-2026-17': {
    questionId: 'bio-2026-17',
    section: 'Section B · Q17',
    maxMarks: 2,
    exactModelAnswer:
      'Emasculation (removal of anthers from bisexual flower buds prior to dehiscence using forceps) prevents self-pollination, while bagging encloses the emasculated bud in a butter-paper bag to exclude unwanted foreign pollen until desired pollen is dusted.\n(OR) Geitonogamy transfers pollen between different flowers of the SAME plant: functionally cross-pollination (needs pollinating agent), genetically similar to autogamy (pollen comes from same genetic parent).',
    stepMarks: [
      {label: 'Purpose of emasculation (prevent self-pollen in bisexual buds)', marks: 1},
      {label: 'Purpose of bagging (prevent contamination by unwanted pollen)', marks: 1},
    ],
    finalAnswerValue: 'Emasculation prevents selfing; Bagging protects stigma purity',
    examinerCheckpoints: ['Bisexual flower requirement', 'Butter-paper bag exclusion'],
  },
  'bio-2026-18': {
    questionId: 'bio-2026-18',
    section: 'Section B · Q18',
    maxMarks: 2,
    exactModelAnswer:
      '(i) Initial count N₀ = 320. Net change ΔN = (Natality + Immigration) − (Mortality + Emigration) = (45 + 25) − (20 + 10) = 70 − 30 = +40 individuals.\n(ii) Final population N₁ = 320 + 40 = 360 deer. Since ΔN > 0, the reserve population is expanding/growing.',
    stepMarks: [
      {label: 'Formula N₁ = N₀ + [(B + I) − (D + E)]', marks: 0.5},
      {label: 'Correct substitution ΔN = +40', marks: 0.5},
      {label: 'Final population = 360 and growing population inference', marks: 1},
    ],
    finalAnswerValue: 'ΔN = +40; Final population = 360 deer (Growing)',
    examinerCheckpoints: ['(45+25)−(20+10) = +40', 'Final count 360'],
  },
  'bio-2026-19': {
    questionId: 'bio-2026-19',
    section: 'Section B · Q19',
    maxMarks: 2,
    exactModelAnswer:
      '(a) Metastasis: Malignant tumour cells detach from the primary mass, travel via blood/lymph, and initiate secondary tumours at distant sites — the most feared property of malignant neoplasms.\n(b) Contact inhibition: Normal cells stop dividing upon contacting neighbouring cells; cancerous cells lose contact inhibition and continue uncontrolled proliferation.',
    stepMarks: [
      {label: 'Definition & significance of metastasis', marks: 1},
      {label: 'Loss of contact inhibition in malignant cells vs normal cells', marks: 1},
    ],
    finalAnswerValue: 'Metastasis spreads secondary tumours; loss of contact inhibition drives proliferation',
    examinerCheckpoints: ['Secondary tumour spread via blood/lymph', 'Loss of contact inhibition'],
  },
  'bio-2026-20': {
    questionId: 'bio-2026-20',
    section: 'Section B · Q20',
    maxMarks: 2,
    exactModelAnswer:
      '(a) Neat diagram of an antibody (H₂L₂) Y-shaped molecule showing two identical heavy chains, two light chains, disulphide bonds (–S–S–), variable antigen-binding sites (Fab) at N-termini, and constant region (Fc).\n(b) Humoral immune response (B-lymphocyte mediated immunity).',
    stepMarks: [
      {label: 'Labeled Y-shaped H₂L₂ diagram with heavy/light chains, S–S bonds & antigen-binding site', marks: 1.5},
      {label: 'Identify humoral / B-cell mediated immune response', marks: 0.5},
    ],
    finalAnswerValue: 'H₂L₂ Y-shaped labeled diagram; Humoral immune response',
    diagramSvg: MARKING_SCHEME_DIAGRAM_SVGS['bio-ms-20'],
    examinerCheckpoints: ['4 chains labeled (2H, 2L)', 'Disulphide bridges & Fab labeled'],
  },
  'bio-2026-21': {
    questionId: 'bio-2026-21',
    section: 'Section B · Q21',
    maxMarks: 2,
    exactModelAnswer:
      '(a) Curve A (J-shaped exponential curve): dN/dt = rN (occurs when food and space resources are unlimited). Curve B (S-shaped / Sigmoid logistic curve): dN/dt = rN((K − N)/K), where K denotes the environment’s carrying capacity (maximum sustainable population).\n(b) Curve B (Sigmoid / Verhulst–Pearl Logistic Growth) is ecologically more realistic because natural habitats always possess finite, limiting resources.',
    stepMarks: [
      {label: '(a) Differential equations for Curve A (dN/dt = rN) & Curve B (dN/dt = rN((K−N)/K)) + K meaning', marks: 1},
      {label: '(b) Identify Curve B as realistic under finite natural resources', marks: 1},
    ],
    finalAnswerValue: 'Curve A: dN/dt = rN; Curve B: dN/dt = rN((K−N)/K); K = Carrying Capacity (Curve B realistic)',
    diagramSvg: MARKING_SCHEME_DIAGRAM_SVGS['bio-ms-21'],
    examinerCheckpoints: ['Both differential equations accurate', 'K defined as carrying capacity', 'Curve B realistic justification'],
  },

  // Section C (Q22 – Q28, 3 Marks each)
  'bio-2026-22': {
    questionId: 'bio-2026-22',
    section: 'Section C · Q22',
    maxMarks: 3,
    exactModelAnswer:
      'Labeled structure of human mature sperm: (1) Head containing elongated haploid nucleus + anterior cap-like acrosome filled with hydrolytic enzymes (hyaluronidase) to dissolve ovum zona/corona; (2) Neck connecting head and middle piece; (3) Middle piece packed with spirally arranged mitochondria generating ATP energy for motility; (4) Tail/flagellum propelling sperm through female genital tract.',
    stepMarks: [
      {label: 'Neat labeled diagram (Head, Acrosome, Nucleus, Middle piece, Mitochondria, Tail)', marks: 1.5},
      {label: 'Functions of Acrosome, Middle piece mitochondria, and Tail', marks: 1.5},
    ],
    finalAnswerValue: 'Labeled spermatozoa diagram + acrosome, mitochondria & tail functions',
    diagramSvg: MARKING_SCHEME_DIAGRAM_SVGS['bio-ms-22'],
    examinerCheckpoints: ['Acrosome hydrolytic enzymes', 'Middle piece mitochondria ATP', 'Tail motility'],
  },
  'bio-2026-23': {
    questionId: 'bio-2026-23',
    section: 'Section C · Q23',
    maxMarks: 3,
    exactModelAnswer:
      'Three stages of PCR: (1) Denaturation (~94–95 °C): breaks H-bonds to separate dsDNA into two single strands; (2) Annealing (~50–60 °C): two short oligonucleotide primers bind specifically to 3′ ends of target complementary sequences; (3) Extension (~72 °C): thermostable Taq DNA polymerase (isolated from Thermus aquaticus) synthesizes new strands using dNTPs. After 3 cycles, 2³ = 8 copies; thermostability preserves enzyme activity through high-heat denaturation.',
    stepMarks: [
      {label: 'Three labeled PCR steps (Denaturation 94 °C, Annealing, Extension 72 °C)', marks: 1.5},
      {label: 'Source & thermostability reason for Taq polymerase (Thermus aquaticus)', marks: 1},
      {label: 'Amplified yield after 3 cycles = 2³ = 8 DNA duplexes', marks: 0.5},
    ],
    finalAnswerValue: 'Denaturation → Annealing → Extension; Thermus aquaticus; 8 copies after 3 cycles',
    diagramSvg: MARKING_SCHEME_DIAGRAM_SVGS['bio-ms-23'],
    examinerCheckpoints: ['94°C / ~55°C / 72°C temperatures', 'Thermus aquaticus', '2³ = 8 copies'],
  },
  'bio-2026-24': {
    questionId: 'bio-2026-24',
    section: 'Section C · Q24',
    maxMarks: 3,
    exactModelAnswer:
      'Parental cross: TtRr (Tall Red) × Ttrr (Tall White).\nGametes: from TtRr → TR, Tr, tR, tr (1/4 each); from Ttrr → Tr, tr (1/2 each).\nPunnett combination gives 8 genotypes with phenotypic ratios:\n• Tall Red (T_Rr): 3/8\n• Tall White (T_rr): 3/8\n• Dwarf Red (ttRr): 1/8\n• Dwarf White (ttrr): 1/8 (Ratio = 3 : 3 : 1 : 1).\nOut of 80 seeds: Tall Red = 30, Tall White = 30, Dwarf Red = 10, Dwarf White = 10.',
    stepMarks: [
      {label: 'Gametes & Punnett square setup for TtRr × Ttrr', marks: 1},
      {label: 'Phenotypic ratio 3 Tall Red : 3 Tall White : 1 Dwarf Red : 1 Dwarf White', marks: 1},
      {label: 'Expected progeny out of 80 seeds: 30, 30, 10, 10', marks: 1},
    ],
    finalAnswerValue: 'Ratio 3:3:1:1; Expected counts: 30, 30, 10, 10 seeds',
    examinerCheckpoints: ['Gametes TR,Tr,tR,tr × Tr,tr', 'Ratio 3:3:1:1', '30, 30, 10, 10'],
  },
  'bio-2026-25': {
    questionId: 'bio-2026-25',
    section: 'Section C · Q25',
    maxMarks: 3,
    exactModelAnswer:
      'Labeled pBR322 diagram highlighting: ori (origin of replication), rop (replication proteins), selectable markers amp^R (with PstI, PvuI) and tet^R (with BamHI, SalI), plus EcoRI/HindIII/ClaI MCS.\nInsertional inactivation: Inserting foreign DNA into the BamHI site within tet^R disrupts tetracycline resistance while amp^R remains functional. Recombinants grow on ampicillin medium but fail to grow when replica-plated onto tetracycline medium.',
    stepMarks: [
      {label: 'Labeled pBR322 plasmid vector (ori, rop, amp^R, tet^R, BamHI)', marks: 1.5},
      {label: 'Selectable marker selection & insertional inactivation of tet^R explained', marks: 1.5},
    ],
    finalAnswerValue: 'pBR322 vector diagram; ampicillin growth + tetracycline sensitivity identifies recombinants',
    diagramSvg: MARKING_SCHEME_DIAGRAM_SVGS['bio-ms-25'],
    examinerCheckpoints: ['ori, amp^R, tet^R, BamHI labeled', 'Insertional inactivation selection logic'],
  },
  'bio-2026-26': {
    questionId: 'bio-2026-26',
    section: 'Section C · Q26',
    maxMarks: 3,
    exactModelAnswer:
      'Lac Operon in absence of lactose: Regulator gene (i) constitutively synthesises active repressor protein which binds tightly to the operator (o) region, physically blocking RNA polymerase from transcribing structural genes z, y, a (operon switched OFF).\nIn presence of lactose (inducer): Lactose/allolactose binds to the repressor, inducing a conformational change that inactivates it so it cannot bind operator o. RNA polymerase freely transcribes lacZ (β-galactosidase), lacY (permease), and lacA (transacetylase).',
    stepMarks: [
      {label: 'Operon OFF state: active repressor blocks operator', marks: 1},
      {label: 'Operon ON state: lactose/allolactose inactivates repressor', marks: 1},
      {label: 'Names/roles of structural genes z, y, a (β-galactosidase, permease, transacetylase)', marks: 1},
    ],
    finalAnswerValue: 'Negative regulation: lactose inducer inactivates repressor allowing z, y, a transcription',
    diagramSvg: MARKING_SCHEME_DIAGRAM_SVGS['bio-ms-26'],
    examinerCheckpoints: ['Allolactose/lactose binds repressor', 'lacZ, lacY, lacA enzymes'],
  },
  'bio-2026-27': {
    questionId: 'bio-2026-27',
    section: 'Section C · Q27',
    maxMarks: 3,
    exactModelAnswer:
      '(a) RNA interference (RNAi) operates in eukaryotic cells as a cellular defence mechanism that silences specific mRNA via complementary double-stranded RNA (dsRNA).\n(b) Nematode Meloidogyne incognita-specific genes are introduced into tobacco plants using Agrobacterium vectors producing both sense and anti-sense RNA; these form dsRNA processed by Dicer into siRNA, recruiting RISC to cleave parasite mRNA so the parasite cannot survive in transgenic roots.',
    stepMarks: [
      {label: 'Definition of RNAi & natural cellular defence role', marks: 1},
      {label: 'Agrobacterium vector introducing sense & antisense RNA → dsRNA', marks: 1},
      {label: 'Silencing of specific nematode mRNA preventing Meloidogyne incognita survival', marks: 1},
    ],
    finalAnswerValue: 'dsRNA sense+antisense silencing of Meloidogyne incognita mRNA in transgenic tobacco',
    examinerCheckpoints: ['Agrobacterium vector', 'Sense + anti-sense form dsRNA', 'Cleaves nematode mRNA'],
  },
  'bio-2026-28': {
    questionId: 'bio-2026-28',
    section: 'Section C · Q28',
    maxMarks: 3,
    exactModelAnswer:
      'Three ecological pyramid types:\n(1) Pyramid of Energy: ALWAYS upright (unidirectional energy flow with 10% transfer law and heat loss at every trophic step).\n(2) Pyramid of Biomass: Generally upright in terrestrial ecosystems, EXCEPT inverted in aquatic (sea) ecosystems where standing crop biomass of microscopic phytoplankton at a given instant is smaller than that of longer-lived zooplankton/fishes.\n(3) Pyramid of Numbers: Mostly upright, EXCEPT inverted/spindle-shaped on a single large tree supporting thousands of insects and birds.',
    stepMarks: [
      {label: 'Pyramid of energy always upright (10% law justification)', marks: 1},
      {label: 'Inverted biomass pyramid in marine/aquatic food chain', marks: 1},
      {label: 'Inverted/spindle number pyramid in tree ecosystem', marks: 1},
    ],
    finalAnswerValue: 'Energy always upright; Marine biomass inverted; Single-tree number inverted',
    diagramSvg: MARKING_SCHEME_DIAGRAM_SVGS['bio-ms-28'],
    examinerCheckpoints: ['Energy never inverted', 'Phytoplankton < zooplankton biomass'],
  },

  // Section D (Q29 – Q30 Case Studies, 4 Marks each)
  'bio-2026-29': {
    questionId: 'bio-2026-29',
    section: 'Section D · Q29',
    maxMarks: 4,
    exactModelAnswer:
      '(i) Peak LH (~Day 14), called the LH surge, induces rupture of mature Graafian follicle and release of the secondary oocyte (ovulation).\n(ii) After ovulation, the empty Graafian follicle transforms under LH influence into the corpus luteum, which secretes large amounts of progesterone.\n(iii) High progesterone maintains thick vascular endometrium for implantation. Without fertilisation, corpus luteum degenerates into corpus albicans, progesterone drops sharply, and endometrium sheds (menstruation).',
    stepMarks: [
      {label: '(i) LH surge & Day 14 ovulation mechanism', marks: 1},
      {label: '(ii) Corpus luteum formation & progesterone rise in luteal phase', marks: 1.5},
      {label: '(iii) Endometrial maintenance and menstrual breakdown upon progesterone fall', marks: 1.5},
    ],
    finalAnswerValue: 'LH surge → ovulation; Corpus luteum → progesterone → endometrial maintenance',
    examinerCheckpoints: ['LH surge Day 14', 'Corpus luteum secretes progesterone', 'Progesterone drop → menses'],
  },
  'bio-2026-30': {
    questionId: 'bio-2026-30',
    section: 'Section D · Q30',
    maxMarks: 4,
    exactModelAnswer:
      '(i) Nucleopolyhedrovirus (genus Baculovirus).\n(ii) Two advantages: (a) Extremely narrow host-range, species-specific insecticidal action; (b) Zero harmful impact on plants, mammals, birds, fish, or non-target beneficial insects (pollinators/parasitoids).\n(iii) Essential in Integrated Pest Management (IPM) within ecologically sensitive orchards/reserves where preserving predatory insects and biodiversity is vital while controlling specific crop-chewing larvae.',
    stepMarks: [
      {label: '(i) Genus Baculovirus / Nucleopolyhedrovirus', marks: 1},
      {label: '(ii) Species-specific narrow spectrum + safe for non-target fauna/beneficial insects', marks: 2},
      {label: '(iii) Role in IPM in ecologically sensitive areas', marks: 1},
    ],
    finalAnswerValue: 'Nucleopolyhedrovirus (Baculovirus); species-specific & safe for non-target organisms in IPM',
    examinerCheckpoints: ['Baculovirus named', 'Non-target safety', 'IPM fit'],
  },

  // Section E (Q31 – Q33 Long Answer, 5 Marks each)
  'bio-2026-31': {
    questionId: 'bio-2026-31',
    section: 'Section E · Q31',
    maxMarks: 5,
    exactModelAnswer:
      'Original template 3′–TAC GGT CAA ACT–5′ gives wild-type mRNA 5′–AUG CCA GUU UGA–3′ → Met – Pro – Val – Stop (3 amino acids).\nMutation A (base substitution at 4th triplet CAA → CTA on template → mRNA codon UAG): Stop codon (nonsense mutation) truncates polypeptide prematurely after Met – Pro (2 amino acids).\nMutation B (single-nucleotide deletion of 7th base C from template → 3′–TAC GGT AAA CT–5′ → mRNA 5′–AUG CCA UUU GA...–3′): Alters reading frame from codon 3 onwards (frameshift mutation: Met – Pro – Phe...), shifting every downstream codon.\nConclusion: Indels not in multiples of 3 alter the entire reading frame (genetic code is read sequentially without punctuation).',
    stepMarks: [
      {label: 'Wild-type mRNA 5′–AUG CCA GUU UGA–3′ & peptide Met–Pro–Val–Stop', marks: 1.5},
      {label: 'Point nonsense mutation analysis (UAG premature stop)', marks: 1.5},
      {label: 'Frameshift mutation upon single base deletion & unpunctuated triplet conclusion', marks: 2},
    ],
    finalAnswerValue: 'Wild: AUG CCA GUU UGA; Subst: nonsense stop; Deletion: reading frameshift',
    examinerCheckpoints: ['Template 3′→5′ vs mRNA 5′→3′ complementarity', 'UAG stop codon', 'Frameshift conclusion'],
  },
  'bio-2026-32': {
    questionId: 'bio-2026-32',
    section: 'Section E · Q32',
    maxMarks: 5,
    exactModelAnswer:
      'Labeled Embryo Sac diagram (chalazal vs micropylar polarity): 3 antipodal cells at chalazal end; large central cell containing two polar nuclei; egg apparatus at micropylar end consisting of 1 central egg cell + 2 flanking synergids carrying filiform apparatus (guides pollen tube entry).\nDouble Fertilisation: (1) Syngamy — first haploid male gamete (n) fuses with egg cell (n) → diploid zygote (2n → embryo); (2) Triple fusion — second haploid male gamete (n) fuses with two polar nuclei (n+n) → triploid Primary Endosperm Nucleus (PEN, 3n → endosperm nourishing developing embryo).',
    stepMarks: [
      {label: 'Neat labeled diagram of 7-celled, 8-nucleate embryo sac (antipodals, polar nuclei, egg, synergids, filiform apparatus)', marks: 2.5},
      {label: 'Syngamy (n + n → 2n zygote) explanation', marks: 1},
      {label: 'Triple fusion (n + 2n → 3n PEN endosperm) & post-fertilisation significance', marks: 1.5},
    ],
    finalAnswerValue: '7-celled 8-nucleate embryo sac; Syngamy (2n) + Triple Fusion (3n PEN)',
    diagramSvg: MARKING_SCHEME_DIAGRAM_SVGS['bio-ms-32'],
    examinerCheckpoints: ['Correct chalazal/micropylar poles', 'Filiform apparatus labeled', '3n PEN explicitly stated'],
  },
  'bio-2026-33': {
    questionId: 'bio-2026-33',
    section: 'Section E · Q33',
    maxMarks: 5,
    exactModelAnswer:
      'The "Evil Quartet" drivers of accelerated species extinction:\n(1) Habitat loss and fragmentation (most critical — e.g., Amazon rainforest cleared for cattle/soybeans shrinks core habitats);\n(2) Over-exploitation (unsustainable harvesting — e.g., Steller’s sea cow, passenger pigeon, marine fish stocks);\n(3) Alien species invasions (non-native species outcompeting natives — e.g., Nile perch in Lake Victoria extirpating >200 cichlid species, or Eichhornia / Parthenium);\n(4) Co-extinctions (obligate mutualists/parasites vanishing when host goes extinct — e.g., plant–pollinator wasps).\nConservation: In-situ protects species inside natural ecosystems (Biosphere reserves, National Parks, Sacred Groves), whereas Ex-situ protects threatened organisms outside habitats (Cryopreservation at −196 °C, Seed banks, Zoological parks).',
    stepMarks: [
      {label: 'Explain all 4 causes of Evil Quartet with one real NCERT example each', marks: 3.5},
      {label: 'Contrast In-situ vs Ex-situ conservation with 1 concrete example each', marks: 1.5},
    ],
    finalAnswerValue: 'Evil Quartet (Habitat loss, Over-exploitation, Alien species, Co-extinction) + In-situ vs Ex-situ',
    examinerCheckpoints: ['All 4 Evil Quartet causes + examples', 'Clear in-situ vs ex-situ distinction'],
  },
};
