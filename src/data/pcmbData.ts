export type SubjectId = 'physics' | 'chemistry' | 'biology' | 'maths';

export type StudyStageKey = 'lecture' | 'practice' | 'ncert' | 'pyq';

export type ChapterTaskState = Partial<Record<StudyStageKey, boolean>>;

export const STUDY_STAGES: {
  key: StudyStageKey;
  shortLabel: string;
  doneLabel: string;
}[] = [
  {key: 'lecture', shortLabel: 'Lecture', doneLabel: 'Lecture done'},
  {key: 'practice', shortLabel: 'Practice', doneLabel: 'Practice done'},
  {key: 'ncert', shortLabel: 'NCERT', doneLabel: 'NCERT done'},
  {key: 'pyq', shortLabel: 'PYQ', doneLabel: 'PYQ done'},
];

export interface ChapterItem {
  id: string;
  number: string;
  title: string;
  unit: string;
  marksWeightage: number;
  estimatedHours: number;
}

export interface PlaylistLectureItem {
  videoId: string;
  chapterId: string;
  order: number;
  title: string;
}

export interface SubjectConfig {
  id: SubjectId;
  name: string;
  code: string;
  shortLabel: string;
  boardTheoryMarks: number;
  practicalMarks: number;
  totalSqpQuestions: number;
  sectionACount: number;
  samplePaperPdfUrl: string;
  playlistUrl: string;
  playlistId: string;
  playlistVideos: PlaylistLectureItem[];
  imageUrl: string;
  imageAlt: string;
  accentHex: string;
  chapters: ChapterItem[];
}

export interface BoardFrequencyMeta {
  count: string;
  years: string[];
  importance: 'High Yield' | 'Core Concept' | 'Frequent';
}

export interface ExamQuestion {
  id: string;
  subjectId: SubjectId;
  questionNumber: number;
  section: string;
  questionType: 'MCQ' | 'Assertion-Reason';
  marks: number;
  chapterTag: string;
  prompt: string;
  diagramId?: string;
  questionDiagramSvg?: string;
  options: string[];
  correctIndex: number;
  boardFrequency: BoardFrequencyMeta;
}

export interface SubjectiveSectionGroup {
  subjectId: SubjectId;
  sectionName: string;
  marksSummary: string;
  items: {
    qNo: string;
    marks: string;
    text: string;
  }[];
}

export interface LectureTimestamp {
  time: string;
  topic: string;
}

export interface OneShotLecture {
  id: string;
  subjectId: SubjectId;
  episodeNumber: string;
  title: string;
  series: string;
  duration: string;
  chaptersCovered: string;
  chapterIds: string[];
  instructor: string;
  playlistUrl: string;
  playlistId: string;
  keyTakeaways: string[];
  formulasAndNotes: string[];
  timestamps: LectureTimestamp[];
}

export const SUBJECTS: SubjectConfig[] = [
  {
    id: 'physics',
    name: 'Physics',
    code: '042',
    shortLabel: 'PHY',
    boardTheoryMarks: 70,
    practicalMarks: 30,
    totalSqpQuestions: 33,
    sectionACount: 16,
    samplePaperPdfUrl: `${import.meta.env?.BASE_URL ?? './'}assets/aistudio/Physics-SQP_ab406f5a.pdf`,
    playlistUrl:
      'https://www.youtube.com/playlist?list=PLDFtjdbvBWcYSFSWAmmApY25zg5A1Q7Df',
    playlistId: 'PLDFtjdbvBWcYSFSWAmmApY25zg5A1Q7Df',
    playlistVideos: [
      {order: 1, videoId: 'i_yT6CpUOTk', chapterId: 'phy-1', title: 'Electric Charges and Fields'},
      {order: 2, videoId: '5Wj95zTraZI', chapterId: 'phy-2', title: 'Electrostatic Potential and Capacitance'},
      {order: 3, videoId: 'ANz7YYAZzrM', chapterId: 'phy-3', title: 'Current Electricity'},
      {order: 4, videoId: 'LSJIX_tSdPY', chapterId: 'phy-4', title: 'Moving Charges & Magnetism'},
      {order: 5, videoId: '-ik_b6qN5b4', chapterId: 'phy-6', title: 'Electromagnetic Induction'},
      {order: 6, videoId: 'jZeRVBO0ymI', chapterId: 'phy-7', title: 'Alternating Current'},
      {order: 7, videoId: 'JfJRMqx_YHE', chapterId: 'phy-5', title: 'Magnetism and Matter'},
      {order: 8, videoId: 'alFEgW-gE9M', chapterId: 'phy-8', title: 'Electromagnetic Waves'},
      {order: 9, videoId: 'ovfNP_TqolM', chapterId: 'phy-9', title: 'Ray Optics and Optical Instruments'},
      {order: 10, videoId: '2gumHdFXums', chapterId: 'phy-10', title: 'Wave Optics'},
      {order: 11, videoId: '6GaLVcWIVzw', chapterId: 'phy-11', title: 'Dual Nature of Radiation and Matter'},
      {order: 12, videoId: '03PgdzPn-XE', chapterId: 'phy-14', title: 'Semiconductor Electronics'},
      {order: 13, videoId: 'uf2UvFqUoXE', chapterId: 'phy-12', title: 'Atoms'},
      {order: 14, videoId: 'kHz5ZoBeSVs', chapterId: 'phy-13', title: 'Nuclei'},
    ],
    imageUrl: `${import.meta.env?.BASE_URL ?? './'}src/assets/images/pcmb_physics_wave_1795262271605.jpg`,
    imageAlt:
      'Scientific illustration of optical prism dispersion and electromagnetic wave propagation',
    accentHex: '#1D4ED8',
    chapters: [
      {id: 'phy-1', number: '01', title: 'Electric Charges and Fields', unit: 'Electrostatics', marksWeightage: 8, estimatedHours: 7},
      {id: 'phy-2', number: '02', title: 'Electrostatic Potential and Capacitance', unit: 'Electrostatics', marksWeightage: 8, estimatedHours: 8},
      {id: 'phy-3', number: '03', title: 'Current Electricity', unit: 'Current Electricity', marksWeightage: 8, estimatedHours: 7},
      {id: 'phy-4', number: '04', title: 'Moving Charges and Magnetism', unit: 'Magnetism', marksWeightage: 9, estimatedHours: 8},
      {id: 'phy-5', number: '05', title: 'Magnetism and Matter', unit: 'Magnetism', marksWeightage: 4, estimatedHours: 4},
      {id: 'phy-6', number: '06', title: 'Electromagnetic Induction', unit: 'EMI & AC', marksWeightage: 6, estimatedHours: 6},
      {id: 'phy-7', number: '07', title: 'Alternating Current', unit: 'EMI & AC', marksWeightage: 7, estimatedHours: 7},
      {id: 'phy-8', number: '08', title: 'Electromagnetic Waves', unit: 'EM Waves', marksWeightage: 3, estimatedHours: 3},
      {id: 'phy-9', number: '09', title: 'Ray Optics and Optical Instruments', unit: 'Optics', marksWeightage: 10, estimatedHours: 9},
      {id: 'phy-10', number: '10', title: 'Wave Optics', unit: 'Optics', marksWeightage: 8, estimatedHours: 7},
      {id: 'phy-11', number: '11', title: 'Dual Nature of Radiation and Matter', unit: 'Modern Physics', marksWeightage: 5, estimatedHours: 4},
      {id: 'phy-12', number: '12', title: 'Atoms', unit: 'Modern Physics', marksWeightage: 4, estimatedHours: 4},
      {id: 'phy-13', number: '13', title: 'Nuclei', unit: 'Modern Physics', marksWeightage: 4, estimatedHours: 4},
      {id: 'phy-14', number: '14', title: 'Semiconductor Electronics', unit: 'Electronic Devices', marksWeightage: 7, estimatedHours: 6},
    ],
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    code: '043',
    shortLabel: 'CHEM',
    boardTheoryMarks: 70,
    practicalMarks: 30,
    totalSqpQuestions: 33,
    sectionACount: 16,
    samplePaperPdfUrl: `${import.meta.env?.BASE_URL ?? './'}assets/aistudio/Chemistry-SQP_fb94ce8e.pdf`,
    playlistUrl:
      'https://youtube.com/playlist?list=PLDFtjdbvBWcZRN2GOwVFow4tMdeytVHjs',
    playlistId: 'PLDFtjdbvBWcZRN2GOwVFow4tMdeytVHjs',
    playlistVideos: [
      {order: 1, videoId: 'U_dJxj895Jw', chapterId: 'chem-1', title: 'Solutions'},
      {order: 2, videoId: '_CVRAZ1b4qg', chapterId: 'chem-2', title: 'Electrochemistry'},
      {order: 3, videoId: 'Xz8wjFX6S_0', chapterId: 'chem-3', title: 'Chemical Kinetics'},
      {order: 4, videoId: 'Fz3YCSbrHqc', chapterId: 'chem-4', title: 'The d- and f-Block Elements'},
      {order: 5, videoId: 't38_SGflTak', chapterId: 'chem-5', title: 'Coordination Compounds'},
      {order: 6, videoId: 'cB9sbMu6R04', chapterId: 'chem-6', title: 'Haloalkanes & Haloarenes'},
      {order: 7, videoId: 'JBGnunZzCUM', chapterId: 'chem-7', title: 'Alcohols, Phenols & Ethers'},
      {order: 8, videoId: 'LUhUM_Vw4Oo', chapterId: 'chem-8', title: 'Aldehydes, Ketones & Carboxylic Acids'},
      {order: 9, videoId: 'OBqFtHYhSYM', chapterId: 'chem-9', title: 'Amines'},
      {order: 10, videoId: 'ZzSHpxjH6Kg', chapterId: 'chem-10', title: 'Biomolecules'},
    ],
    imageUrl: `${import.meta.env?.BASE_URL ?? './'}chemistry-plate.svg`,
    imageAlt:
      'Scientific diagram plate showing an Electrochemical Daniell Galvanic Cell, Chemical Kinetics reaction coordinate energy profile, and Octahedral [ML6] coordination complex',
    accentHex: '#0284C7',
    chapters: [
      {id: 'chem-1', number: '01', title: 'Solutions', unit: 'Physical Chemistry', marksWeightage: 7, estimatedHours: 6},
      {id: 'chem-2', number: '02', title: 'Electrochemistry', unit: 'Physical Chemistry', marksWeightage: 9, estimatedHours: 8},
      {id: 'chem-3', number: '03', title: 'Chemical Kinetics', unit: 'Physical Chemistry', marksWeightage: 7, estimatedHours: 6},
      {id: 'chem-4', number: '04', title: 'The d- and f-Block Elements', unit: 'Inorganic Chemistry', marksWeightage: 7, estimatedHours: 6},
      {id: 'chem-5', number: '05', title: 'Coordination Compounds', unit: 'Inorganic Chemistry', marksWeightage: 7, estimatedHours: 7},
      {id: 'chem-6', number: '06', title: 'Haloalkanes and Haloarenes', unit: 'Organic Chemistry', marksWeightage: 6, estimatedHours: 6},
      {id: 'chem-7', number: '07', title: 'Alcohols, Phenols and Ethers', unit: 'Organic Chemistry', marksWeightage: 6, estimatedHours: 7},
      {id: 'chem-8', number: '08', title: 'Aldehydes, Ketones and Carboxylic Acids', unit: 'Organic Chemistry', marksWeightage: 8, estimatedHours: 9},
      {id: 'chem-9', number: '09', title: 'Amines', unit: 'Organic Chemistry', marksWeightage: 6, estimatedHours: 5},
      {id: 'chem-10', number: '10', title: 'Biomolecules', unit: 'Organic Chemistry', marksWeightage: 7, estimatedHours: 5},
    ],
  },
  {
    id: 'biology',
    name: 'Biology',
    code: '044',
    shortLabel: 'BIO',
    boardTheoryMarks: 70,
    practicalMarks: 30,
    totalSqpQuestions: 33,
    sectionACount: 16,
    samplePaperPdfUrl: `${import.meta.env?.BASE_URL ?? './'}assets/aistudio/Biology-SQP_fdc06173.pdf`,
    playlistUrl:
      'https://youtube.com/playlist?list=PLDFtjdbvBWcbJbcIzsKAcT3CzImf90qHK',
    playlistId: 'PLDFtjdbvBWcbJbcIzsKAcT3CzImf90qHK',
    playlistVideos: [
      {order: 1, videoId: 'FWaOU7X6B0E', chapterId: 'bio-2', title: 'Human Reproduction'},
      {order: 2, videoId: 'N84u3PcLffc', chapterId: 'bio-1', title: 'Sexual Reproduction in Flowering Plants'},
      {order: 3, videoId: 'ZbaGJT4EScs', chapterId: 'bio-3', title: 'Reproductive Health'},
      {order: 4, videoId: 'CvTstNChMww', chapterId: 'bio-4', title: 'Principles of Inheritance & Variation'},
      {order: 5, videoId: 'WJPaKue8Fws', chapterId: 'bio-7', title: 'Human Health and Disease'},
      {order: 6, videoId: '5qCpewUFNk0', chapterId: 'bio-5', title: 'Molecular Basis of Inheritance'},
      {order: 7, videoId: 'o334PgHRINA', chapterId: 'bio-9', title: 'Biotechnology: Principles and Processes'},
      {order: 8, videoId: '4uErIyc5XGs', chapterId: 'bio-8', title: 'Microbes in Human Welfare'},
      {order: 9, videoId: '_HpS_SyziO4', chapterId: 'bio-10', title: 'Biotechnology and Its Applications'},
      {order: 10, videoId: 'mezR5ap9aPg', chapterId: 'bio-11', title: 'Organisms and Populations'},
      {order: 11, videoId: 'HXJFVRiT3Hc', chapterId: 'bio-12', title: 'Ecosystem'},
      {order: 12, videoId: 'DaNhRwRui3Q', chapterId: 'bio-6', title: 'Evolution'},
      {order: 13, videoId: 'uvzFdsyZ_xo', chapterId: 'bio-13', title: 'Biodiversity & Conservation'},
    ],
    imageUrl: `${import.meta.env?.BASE_URL ?? './'}src/assets/images/pcmb_biology_helix_1795262275401.jpg`,
    imageAlt:
      'Plant vascular cross-section and DNA double helix scientific diagram',
    accentHex: '#059669',
    chapters: [
      {id: 'bio-1', number: '01', title: 'Sexual Reproduction in Flowering Plants', unit: 'Reproduction', marksWeightage: 6, estimatedHours: 5},
      {id: 'bio-2', number: '02', title: 'Human Reproduction', unit: 'Reproduction', marksWeightage: 5, estimatedHours: 5},
      {id: 'bio-3', number: '03', title: 'Reproductive Health', unit: 'Reproduction', marksWeightage: 5, estimatedHours: 3},
      {id: 'bio-4', number: '04', title: 'Principles of Inheritance and Variation', unit: 'Genetics & Evolution', marksWeightage: 8, estimatedHours: 7},
      {id: 'bio-5', number: '05', title: 'Molecular Basis of Inheritance', unit: 'Genetics & Evolution', marksWeightage: 8, estimatedHours: 8},
      {id: 'bio-6', number: '06', title: 'Evolution', unit: 'Genetics & Evolution', marksWeightage: 4, estimatedHours: 4},
      {id: 'bio-7', number: '07', title: 'Human Health and Disease', unit: 'Biology & Human Welfare', marksWeightage: 7, estimatedHours: 6},
      {id: 'bio-8', number: '08', title: 'Microbes in Human Welfare', unit: 'Biology & Human Welfare', marksWeightage: 5, estimatedHours: 3},
      {id: 'bio-9', number: '09', title: 'Biotechnology: Principles and Processes', unit: 'Biotechnology', marksWeightage: 6, estimatedHours: 5},
      {id: 'bio-10', number: '10', title: 'Biotechnology and its Applications', unit: 'Biotechnology', marksWeightage: 6, estimatedHours: 4},
      {id: 'bio-11', number: '11', title: 'Organisms and Populations', unit: 'Ecology', marksWeightage: 4, estimatedHours: 4},
      {id: 'bio-12', number: '12', title: 'Ecosystem', unit: 'Ecology', marksWeightage: 3, estimatedHours: 3},
      {id: 'bio-13', number: '13', title: 'Biodiversity and Conservation', unit: 'Ecology', marksWeightage: 3, estimatedHours: 3},
    ],
  },
  {
    id: 'maths',
    name: 'Mathematics',
    code: '041',
    shortLabel: 'MATH',
    boardTheoryMarks: 80,
    practicalMarks: 20,
    totalSqpQuestions: 38,
    sectionACount: 20,
    samplePaperPdfUrl: `${import.meta.env?.BASE_URL ?? './'}assets/aistudio/Maths-SQP_705d2d63.pdf`,
    playlistUrl:
      'https://youtube.com/playlist?list=PLDFtjdbvBWcYl4qyXjD83PU3IRauDbChW',
    playlistId: 'PLDFtjdbvBWcYl4qyXjD83PU3IRauDbChW',
    playlistVideos: [
      {order: 1, videoId: '2zHpum8F5RA', chapterId: 'math-3', title: 'Matrices'},
      {order: 2, videoId: 'pafeee3O6u8', chapterId: 'math-4', title: 'Determinants'},
      {order: 3, videoId: 'a8YasMSWFvc', chapterId: 'math-1', title: 'Relations and Functions'},
      {order: 4, videoId: '4Aml6yd4tDY', chapterId: 'math-2', title: 'Inverse Trigonometric Functions'},
      {order: 5, videoId: 'cIxHoVCUN1M', chapterId: 'math-5', title: 'Continuity and Differentiability'},
      {order: 6, videoId: 'uVEOu40lYEY', chapterId: 'math-6', title: 'Application of Derivatives'},
      {order: 7, videoId: 'dBglfhVX6kI', chapterId: 'math-7', title: 'Integrals'},
      {order: 8, videoId: '-tcuZsZqXZk', chapterId: 'math-8', title: 'Application of Integrals'},
      {order: 9, videoId: 'EEudvNSWzXE', chapterId: 'math-9', title: 'Differential Equations'},
      {order: 10, videoId: 'B5Rq-af5R14', chapterId: 'math-10', title: 'Vectors'},
      {order: 11, videoId: '7ggiHx1dEok', chapterId: 'math-11', title: 'Three-Dimensional Geometry'},
      {order: 12, videoId: '98ngGuFd9Vg', chapterId: 'math-12', title: 'Linear Programming'},
      {order: 13, videoId: '_YJr2t_1NTU', chapterId: 'math-13', title: 'Probability'},
    ],
    imageUrl: `${import.meta.env?.BASE_URL ?? './'}src/assets/images/pcmb_maths_calculus_1795262273993.jpg`,
    imageAlt:
      'Three-dimensional calculus surface curves and vector coordinate axes',
    accentHex: '#4338CA',
    chapters: [
      {id: 'math-1', number: '01', title: 'Relations and Functions', unit: 'Relations & Functions', marksWeightage: 4, estimatedHours: 5},
      {id: 'math-2', number: '02', title: 'Inverse Trigonometric Functions', unit: 'Relations & Functions', marksWeightage: 4, estimatedHours: 4},
      {id: 'math-3', number: '03', title: 'Matrices', unit: 'Algebra', marksWeightage: 5, estimatedHours: 5},
      {id: 'math-4', number: '04', title: 'Determinants', unit: 'Algebra', marksWeightage: 5, estimatedHours: 6},
      {id: 'math-5', number: '05', title: 'Continuity and Differentiability', unit: 'Calculus', marksWeightage: 8, estimatedHours: 8},
      {id: 'math-6', number: '06', title: 'Application of Derivatives', unit: 'Calculus', marksWeightage: 7, estimatedHours: 7},
      {id: 'math-7', number: '07', title: 'Integrals', unit: 'Calculus', marksWeightage: 9, estimatedHours: 10},
      {id: 'math-8', number: '08', title: 'Application of Integrals', unit: 'Calculus', marksWeightage: 5, estimatedHours: 4},
      {id: 'math-9', number: '09', title: 'Differential Equations', unit: 'Calculus', marksWeightage: 6, estimatedHours: 6},
      {id: 'math-10', number: '10', title: 'Vector Algebra', unit: 'Vectors & 3D Geometry', marksWeightage: 7, estimatedHours: 5},
      {id: 'math-11', number: '11', title: 'Three-Dimensional Geometry', unit: 'Vectors & 3D Geometry', marksWeightage: 7, estimatedHours: 7},
      {id: 'math-12', number: '12', title: 'Linear Programming', unit: 'Linear Programming', marksWeightage: 5, estimatedHours: 3},
      {id: 'math-13', number: '13', title: 'Probability', unit: 'Probability', marksWeightage: 8, estimatedHours: 7},
    ],
  },
];

export {EXAM_QUESTIONS} from './sectionAQuestions';
export {
  SUBJECTIVE_QUESTIONS,
  type SubjectiveExamQuestion,
  type SubjectiveQuestionType,
} from './subjectiveQuestions';

export const SUBJECTIVE_SECTIONS: SubjectiveSectionGroup[] = [];

export const HACKERS_PLAYLIST: OneShotLecture[] = [
  // PHYSICS — PLDFtjdbvBWcYSFSWAmmApY25zg5A1Q7Df
  {
    id: 'hk-phy-1',
    subjectId: 'physics',
    episodeNumber: 'Episode 01',
    title: 'Electrostatics & Capacitance Complete One-Shot',
    series: '12th Hackers · Physics',
    duration: '02h 18m',
    chaptersCovered: 'Ch 01 Electric Charges · Ch 02 Potential & Capacitance',
    chapterIds: ['phy-1', 'phy-2'],
    instructor: '12th Hackers Faculty',
    playlistUrl:
      'https://www.youtube.com/playlist?list=PLDFtjdbvBWcYSFSWAmmApY25zg5A1Q7Df',
    playlistId: 'PLDFtjdbvBWcYSFSWAmmApY25zg5A1Q7Df',
    keyTakeaways: [
      'Gauss Law derivations for infinite line, plane sheet, and spherical shell',
      'Equipotential surfaces and dipole torque/potential energy formulas',
      'Dielectric slab insertion in parallel-plate capacitors (battery connected vs disconnected)',
    ],
    formulasAndNotes: [
      'Flux Φ = q_in / ε₀',
      'Capacitance with dielectric: C = Kε₀A / d',
      'Energy density u = ½ ε₀ E²',
    ],
    timestamps: [
      {time: '00:00', topic: 'Coulomb Law & Vector Superposition'},
      {time: '34:15', topic: 'Gauss Law Board Derivations'},
      {time: '01:12:40', topic: 'Electrostatic Potential & Dipole Work'},
      {time: '01:46:10', topic: 'Capacitor Combinations & Dielectric PYQs'},
    ],
  },
  {
    id: 'hk-phy-2',
    subjectId: 'physics',
    episodeNumber: 'Episode 02',
    title: 'Current Electricity, Magnetism & EMI One-Shot',
    series: '12th Hackers · Physics',
    duration: '02h 42m',
    chaptersCovered: 'Ch 03 Current · Ch 04–05 Magnetism · Ch 06–07 EMI & AC',
    chapterIds: ['phy-3', 'phy-4', 'phy-5', 'phy-6', 'phy-7'],
    instructor: '12th Hackers Faculty',
    playlistUrl:
      'https://www.youtube.com/playlist?list=PLDFtjdbvBWcYSFSWAmmApY25zg5A1Q7Df',
    playlistId: 'PLDFtjdbvBWcYSFSWAmmApY25zg5A1Q7Df',
    keyTakeaways: [
      'Drift velocity, Kirchhoff loop rules, and Wheatstone bridge balance proofs',
      'Biot-Savart Law on circular loop axis & Ampere Circuital Law solenoid derivation',
      'LCR phasor diagrams, resonance condition, and transformer efficiency numericals',
    ],
    formulasAndNotes: [
      'I = n e A v_d',
      'B_center = μ₀ I / (2R)',
      'Resonant frequency f₀ = 1 / (2π √(LC))',
    ],
    timestamps: [
      {time: '00:00', topic: 'Drift Velocity & Kirchhoff Circuit Solving'},
      {time: '48:20', topic: 'Force Between Parallel Currents & Moving Coil Galvanometer'},
      {time: '01:36:00', topic: 'Faraday Laws, Lenz Law & Self-Inductance'},
      {time: '02:09:45', topic: 'Series LCR Impedance & Quality Factor'},
    ],
  },
  {
    id: 'hk-phy-3',
    subjectId: 'physics',
    episodeNumber: 'Episode 03',
    title: 'Ray & Wave Optics + Modern Physics & Semiconductors',
    series: '12th Hackers · Physics',
    duration: '02h 55m',
    chaptersCovered: 'Ch 09–10 Optics · Ch 11–14 Dual Nature, Atoms, Nuclei & Semiconductors',
    chapterIds: ['phy-8', 'phy-9', 'phy-10', 'phy-11', 'phy-12', 'phy-13', 'phy-14'],
    instructor: '12th Hackers Faculty',
    playlistUrl:
      'https://www.youtube.com/playlist?list=PLDFtjdbvBWcYSFSWAmmApY25zg5A1Q7Df',
    playlistId: 'PLDFtjdbvBWcYSFSWAmmApY25zg5A1Q7Df',
    keyTakeaways: [
      'Refraction at spherical surface, Lens Maker’s formula, and prism minimum deviation',
      'Huygens reflection/refraction proof and YDSE fringe width derivation',
      'Full-wave rectifier circuit diagrams and p-n junction depletion barrier analysis',
    ],
    formulasAndNotes: [
      '1/f = (n₂/n₁ - 1)(1/R₁ - 1/R₂)',
      'Fringe width β = λD / d',
      'de Broglie wavelength λ = h / √(2m q V)',
    ],
    timestamps: [
      {time: '00:00', topic: 'Compound Microscope & Astronomical Telescope Ray Diagrams'},
      {time: '56:10', topic: 'Huygens Principle, YDSE & Single-Slit Diffraction'},
      {time: '01:48:30', topic: 'Bohr Radius, Binding Energy & Photoelectric Graphs'},
      {time: '02:25:00', topic: 'p-n Junction, Half & Full Wave Rectifier'},
    ],
  },

  // CHEMISTRY — PLDFtjdbvBWcZRN2GOwVFow4tMdeytVHjs
  {
    id: 'hk-chem-1',
    subjectId: 'chemistry',
    episodeNumber: 'Episode 01',
    title: 'Physical Chemistry Complete Marathon',
    series: '12th Hackers · Chemistry',
    duration: '02h 10m',
    chaptersCovered: 'Ch 01 Solutions · Ch 02 Electrochemistry · Ch 03 Kinetics',
    chapterIds: ['chem-1', 'chem-2', 'chem-3'],
    instructor: '12th Hackers Faculty',
    playlistUrl:
      'https://youtube.com/playlist?list=PLDFtjdbvBWcZRN2GOwVFow4tMdeytVHjs',
    playlistId: 'PLDFtjdbvBWcZRN2GOwVFow4tMdeytVHjs',
    keyTakeaways: [
      'Raoult’s law deviations, azeotropes, and van’t Hoff factor numericals',
      'Nernst equation ΔG° = -nFE°cell and Kohlrausch weak-electrolyte graphs',
      'Zero & first-order integrated rate equations and Arrhenius activation energy plots',
    ],
    formulasAndNotes: [
      'π = i C R T',
      'E_cell = E°_cell - (0.0591 / n) log Q',
      'k = (2.303 / t) log([R]₀ / [R])',
    ],
    timestamps: [
      {time: '00:00', topic: 'Henry Law & Colligative Properties Numericals'},
      {time: '44:00', topic: 'Nernst Equation, Fuel Cells & Conductance'},
      {time: '01:28:15', topic: 'First-Order Half-Life & Pseudo-First-Order Reactions'},
    ],
  },
  {
    id: 'hk-chem-2',
    subjectId: 'chemistry',
    episodeNumber: 'Episode 02',
    title: 'd & f Block + Coordination Compounds One-Shot',
    series: '12th Hackers · Chemistry',
    duration: '01h 54m',
    chaptersCovered: 'Ch 04 d- & f-Block · Ch 05 Coordination Compounds',
    chapterIds: ['chem-4', 'chem-5'],
    instructor: '12th Hackers Faculty',
    playlistUrl:
      'https://youtube.com/playlist?list=PLDFtjdbvBWcZRN2GOwVFow4tMdeytVHjs',
    playlistId: 'PLDFtjdbvBWcZRN2GOwVFow4tMdeytVHjs',
    keyTakeaways: [
      'Lanthanoid contraction trends, KMnO₄ & K₂Cr₂O₇ oxidizing reactions in acidic medium',
      'IUPAC nomenclature, geometrical/optical isomerism in octahedral complexes',
      'Valence Bond Theory (VBT) hybridization and Crystal Field Splitting (Δ₀ vs P)',
    ],
    formulasAndNotes: [
      'Spin-only magnetic moment μ = √(n(n+2)) BM',
      'Strong field ligands (CN⁻, CO, en): Δ₀ > P (low spin)',
      'Weak field ligands (I⁻, Br⁻, Cl⁻, F⁻): Δ₀ < P (high spin)',
    ],
    timestamps: [
      {time: '00:00', topic: 'Transition Metal Oxidation States & Electrode Potentials'},
      {time: '38:40', topic: 'KMnO₄ & K₂Cr₂O₇ Preparation + Balancing'},
      {time: '01:05:20', topic: 'IUPAC Naming, Isomerism & Crystal Field Theory'},
    ],
  },
  {
    id: 'hk-chem-3',
    subjectId: 'chemistry',
    episodeNumber: 'Episode 03',
    title: 'Organic Name Reactions, Conversions & Biomolecules',
    series: '12th Hackers · Chemistry',
    duration: '02h 48m',
    chaptersCovered: 'Ch 06–09 Organic Chemistry · Ch 10 Biomolecules',
    chapterIds: ['chem-6', 'chem-7', 'chem-8', 'chem-9', 'chem-10'],
    instructor: '12th Hackers Faculty',
    playlistUrl:
      'https://youtube.com/playlist?list=PLDFtjdbvBWcZRN2GOwVFow4tMdeytVHjs',
    playlistId: 'PLDFtjdbvBWcZRN2GOwVFow4tMdeytVHjs',
    keyTakeaways: [
      'SN1 vs SN2 stereochemistry, Lucas test, Reimer-Tiemann, and Kolbe reaction',
      'Aldol, Cannizzaro, Clemmensen, Rosenmund, and Hinsberg distinction tests',
      'Glucose cyclic structure, peptide linkage, and DNA vs RNA base pairing',
    ],
    formulasAndNotes: [
      'Basicity order in aqueous phase: (C₂H₅)₂NH > (C₂H₅)₃N > C₂H₅NH₂ > NH₃',
      'Tollens & Fehling tests distinguish Aldehydes from Ketones',
      'Glycosidic, Peptide & Phosphodiester linkages',
    ],
    timestamps: [
      {time: '00:00', topic: 'Haloalkanes, SN1/SN2 & Alcohol Dehydration Mechanisms'},
      {time: '55:10', topic: 'Aldehydes, Ketones & Carboxylic Acid Acidity Order'},
      {time: '01:49:00', topic: 'Amines Basicity, Diazonium Salts & Coupling Reactions'},
      {time: '02:21:30', topic: 'Carbohydrates, Proteins & Nucleic Acids'},
    ],
  },

  // BIOLOGY — PLDFtjdbvBWcbJbcIzsKAcT3CzImf90qHK
  {
    id: 'hk-bio-1',
    subjectId: 'biology',
    episodeNumber: 'Episode 01',
    title: 'Reproduction Unit Complete One-Shot',
    series: '12th Hackers · Biology',
    duration: '01h 58m',
    chaptersCovered: 'Ch 01 Flowering Plants · Ch 02 Human Reproduction · Ch 03 Reproductive Health',
    chapterIds: ['bio-1', 'bio-2', 'bio-3'],
    instructor: '12th Hackers Faculty',
    playlistUrl:
      'https://youtube.com/playlist?list=PLDFtjdbvBWcbJbcIzsKAcT3CzImf90qHK',
    playlistId: 'PLDFtjdbvBWcbJbcIzsKAcT3CzImf90qHK',
    keyTakeaways: [
      'Microsporogenesis, megasporogenesis, 7-celled 8-nucleate embryo sac, and double fertilization',
      'Spermatogenesis vs oogenesis hormonal control (GnRH, LH, FSH) and menstrual cycle',
      'Contraceptive methods (IUDs, hormonal pills) and Assisted Reproductive Technologies (IVF, ZIFT, GIFT)',
    ],
    formulasAndNotes: [
      'Triple fusion: Male gamete (n) + Polar nuclei (2n) → PEN (3n)',
      'LH Surge on Day 14 triggers ovulation',
      'MTP legal framework & Amniocentesis safeguards',
    ],
    timestamps: [
      {time: '00:00', topic: 'Anther Structure, Pollination Agents & Double Fertilization'},
      {time: '45:30', topic: 'Gametogenesis, Menstrual Cycle & Placental Hormones'},
      {time: '01:28:00', topic: 'IUDs, Sterilization & ART Case-Based Questions'},
    ],
  },
  {
    id: 'hk-bio-2',
    subjectId: 'biology',
    episodeNumber: 'Episode 02',
    title: 'Genetics, Molecular Inheritance & Evolution One-Shot',
    series: '12th Hackers · Biology',
    duration: '02h 35m',
    chaptersCovered: 'Ch 04 Inheritance · Ch 05 Molecular Basis · Ch 06 Evolution',
    chapterIds: ['bio-4', 'bio-5', 'bio-6'],
    instructor: '12th Hackers Faculty',
    playlistUrl:
      'https://youtube.com/playlist?list=PLDFtjdbvBWcbJbcIzsKAcT3CzImf90qHK',
    playlistId: 'PLDFtjdbvBWcbJbcIzsKAcT3CzImf90qHK',
    keyTakeaways: [
      'Incomplete dominance, codominance, linkage maps, and Mendelian pedigree analysis',
      'Hershey-Chase experiment, semi-conservative replication, transcription & Lac Operon',
      'Hardy-Weinberg equilibrium equation and adaptive radiation examples',
    ],
    formulasAndNotes: [
      'Hardy-Weinberg: p² + 2pq + q² = 1 (with p + q = 1)',
      'Chargaff Rule: (A + G) / (T + C) = 1',
      'AUG acts as start codon (Methionine); UAA, UAG, UGA are stop codons',
    ],
    timestamps: [
      {time: '00:00', topic: 'Mendelian Crosses, Sex Determination & Pedigree Solving'},
      {time: '54:15', topic: 'DNA Packaging, Replication Fork & Genetic Code'},
      {time: '01:44:20', topic: 'Lac Operon & DNA Fingerprinting (VNTR)'},
      {time: '02:10:40', topic: 'Hardy-Weinberg Principle & Human Evolution'},
    ],
  },
  {
    id: 'hk-bio-3',
    subjectId: 'biology',
    episodeNumber: 'Episode 03',
    title: 'Biotechnology, Human Health & Ecology Marathon',
    series: '12th Hackers · Biology',
    duration: '02h 12m',
    chaptersCovered: 'Ch 07–08 Welfare · Ch 09–10 Biotech · Ch 11–13 Ecology',
    chapterIds: ['bio-7', 'bio-8', 'bio-9', 'bio-10', 'bio-11', 'bio-12', 'bio-13'],
    instructor: '12th Hackers Faculty',
    playlistUrl:
      'https://youtube.com/playlist?list=PLDFtjdbvBWcbJbcIzsKAcT3CzImf90qHK',
    playlistId: 'PLDFtjdbvBWcbJbcIzsKAcT3CzImf90qHK',
    keyTakeaways: [
      'Active vs passive immunity, HIV replication in macrophages, and biogas/sewage treatment',
      'pBR322 vector map, gel electrophoresis, PCR steps, Bt cotton, and ADA gene therapy',
      'Logistic vs exponential population growth curves, ecological pyramids, and biodiversity hotspots',
    ],
    formulasAndNotes: [
      'Exponential: dN/dt = rN | Logistic: dN/dt = rN((K - N)/K)',
      'Species-Area Relationship: log S = log C + Z log A',
      '10% Energy Transfer Law across trophic levels',
    ],
    timestamps: [
      {time: '00:00', topic: 'Immunity, ELISA, Cancer & Microbes in Sewage'},
      {time: '48:50', topic: 'Restriction Enzymes, pBR322 & PCR Amplification'},
      {time: '01:26:10', topic: 'Bt Cry Genes, RNAi & Recombinant Insulin'},
      {time: '01:48:00', topic: 'Population Interactions, Energy Pyramids & Conservation'},
    ],
  },

  // MATHEMATICS — PLDFtjdbvBWcYl4qyXjD83PU3IRauDbChW
  {
    id: 'hk-math-1',
    subjectId: 'maths',
    episodeNumber: 'Episode 01',
    title: 'Relations, Functions, Matrices & Determinants One-Shot',
    series: '12th Hackers · Maths',
    duration: '02h 05m',
    chaptersCovered: 'Ch 01 Relations · Ch 02 Inverse Trig · Ch 03 Matrices · Ch 04 Determinants',
    chapterIds: ['math-1', 'math-2', 'math-3', 'math-4'],
    instructor: '12th Hackers Faculty',
    playlistUrl:
      'https://youtube.com/playlist?list=PLDFtjdbvBWcYl4qyXjD83PU3IRauDbChW',
    playlistId: 'PLDFtjdbvBWcYl4qyXjD83PU3IRauDbChW',
    keyTakeaways: [
      'Equivalence relations (reflexive, symmetric, transitive) and bijection proofs',
      'Principal value branch tables for all six inverse trigonometric functions',
      'Solving linear systems AX = B via matrix inverse and determinant properties',
    ],
    formulasAndNotes: [
      'A(adj A) = |A| I',
      '|kA| = kⁿ |A| (for order n × n)',
      'A⁻¹ = adj(A) / |A| (for |A| ≠ 0)',
    ],
    timestamps: [
      {time: '00:00', topic: 'Equivalence Relations & One-One Onto Proofs'},
      {time: '39:10', topic: 'Inverse Trigonometric Domain & Principal Values'},
      {time: '01:12:00', topic: 'Symmetric/Skew-Symmetric Matrix Decomposition'},
      {time: '01:38:45', topic: '5-Mark Martin’s Rule Linear System Questions'},
    ],
  },
  {
    id: 'hk-math-2',
    subjectId: 'maths',
    episodeNumber: 'Episode 02',
    title: 'Complete Calculus Mastery (Differentiation to Differential Eqns)',
    series: '12th Hackers · Maths',
    duration: '03h 15m',
    chaptersCovered: 'Ch 05–09 Continuity, AOD, Integrals, AOI & Differential Equations',
    chapterIds: ['math-5', 'math-6', 'math-7', 'math-8', 'math-9'],
    instructor: '12th Hackers Faculty',
    playlistUrl:
      'https://youtube.com/playlist?list=PLDFtjdbvBWcYl4qyXjD83PU3IRauDbChW',
    playlistId: 'PLDFtjdbvBWcYl4qyXjD83PU3IRauDbChW',
    keyTakeaways: [
      'Parametric differentiation, logarithmic derivatives, and absolute maxima/minima word problems',
      'Integration by parts, partial fractions, and definite integral King/Queen properties',
      'Area bounded by parabola/ellipse/lines and Linear Differential Equations (Integrating Factor)',
    ],
    formulasAndNotes: [
      '∫ eˣ [f(x) + f′(x)] dx = eˣ f(x) + C',
      'Integrating Factor IF = e^(∫ P dx) for dy/dx + Py = Q',
      '∫₀ᵃ f(x) dx = ∫₀ᵃ f(a - x) dx',
    ],
    timestamps: [
      {time: '00:00', topic: 'Continuity at Points & Second-Order Derivatives'},
      {time: '52:30', topic: 'Increasing/Decreasing Intervals & Mensuration Maxima'},
      {time: '01:44:00', topic: 'Special Integrals & Definite Integral Properties'},
      {time: '02:38:20', topic: 'Area Under Curves & Homogeneous/Linear Differential Equations'},
    ],
  },
  {
    id: 'hk-math-3',
    subjectId: 'maths',
    episodeNumber: 'Episode 03',
    title: 'Vectors, 3D Geometry, LPP & Bayes Probability One-Shot',
    series: '12th Hackers · Maths',
    duration: '02h 14m',
    chaptersCovered: 'Ch 10 Vectors · Ch 11 3D Geometry · Ch 12 LPP · Ch 13 Probability',
    chapterIds: ['math-10', 'math-11', 'math-12', 'math-13'],
    instructor: '12th Hackers Faculty',
    playlistUrl:
      'https://youtube.com/playlist?list=PLDFtjdbvBWcYl4qyXjD83PU3IRauDbChW',
    playlistId: 'PLDFtjdbvBWcYl4qyXjD83PU3IRauDbChW',
    keyTakeaways: [
      'Dot & cross product area formulas, projection vectors, and unit perpendicular vectors',
      'Shortest distance between skew lines and foot of perpendicular from a point to a line',
      'Graphical feasible region corner-point theorem and Bayes’ Theorem board problems',
    ],
    formulasAndNotes: [
      'Skew lines shortest distance: d = |(a₂ - a₁) · (b₁ × b₂)| / |b₁ × b₂|',
      'Bayes’ Theorem: P(E_i | A) = [P(E_i)P(A|E_i)] / Σ P(E_j)P(A|E_j)',
      'Mean of Random Variable E(X) = Σ x_i p_i',
    ],
    timestamps: [
      {time: '00:00', topic: 'Vector Algebra Dot/Cross Products & Unit Vectors'},
      {time: '41:20', topic: '3D Line Equations, Skew Distance & Image of a Point'},
      {time: '01:25:00', topic: 'Linear Programming Bounded & Unbounded Regions'},
      {time: '01:46:15', topic: 'Conditional Probability, Bayes’ Theorem & Distributions'},
    ],
  },
];
