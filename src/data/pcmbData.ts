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

export interface ExamQuestion {
  id: string;
  subjectId: SubjectId;
  questionNumber: number;
  section: string;
  questionType: 'MCQ' | 'Assertion-Reason';
  marks: number;
  prompt: string;
  diagramId?: string;
  options: string[];
  correctIndex: number;
  markingScheme: string;
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
    samplePaperPdfUrl: `${import.meta.env.BASE_URL}assets/aistudio/Physics-SQP_ab406f5a.pdf`,
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
    imageUrl: `${import.meta.env.BASE_URL}src/assets/images/pcmb_physics_wave_1795262271605.jpg`,
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
    samplePaperPdfUrl: `${import.meta.env.BASE_URL}assets/aistudio/Chemistry-SQP_fb94ce8e.pdf`,
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
    imageUrl: `${import.meta.env.BASE_URL}src/assets/images/pcmb_chemistry_science_plate_1795266299124.jpg`,
    imageAlt:
      'Scientific diagram plate showing face-centered cubic crystal lattice, reaction coordinate energy profile, and benzene molecular orbitals',
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
    samplePaperPdfUrl: `${import.meta.env.BASE_URL}assets/aistudio/Biology-SQP_fdc06173.pdf`,
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
    imageUrl: `${import.meta.env.BASE_URL}src/assets/images/pcmb_biology_helix_1795262275401.jpg`,
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
    samplePaperPdfUrl: `${import.meta.env.BASE_URL}assets/aistudio/Maths-SQP_705d2d63.pdf`,
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
    imageUrl: `${import.meta.env.BASE_URL}src/assets/images/pcmb_maths_calculus_1795262273993.jpg`,
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

// Official CBSE Class XII Sample Question Paper (2026–27) — Section A Objective Questions
export const EXAM_QUESTIONS: ExamQuestion[] = [
  // ================= PHYSICS (042) — 16 Official Section A Questions =================
  {
    id: 'phy-2026-1',
    subjectId: 'physics',
    questionNumber: 1,
    section: 'Section A · Q1',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'A point charge +Q is placed at the centre of a spherical Gaussian surface of radius R. If the radius of the sphere is doubled, the electric flux through the surface will:',
    options: ['become half', 'become double', 'remain the same', 'become four times'],
    correctIndex: 2,
    markingScheme:
      'By Gauss’s Law, total electric flux Φ = q_enclosed / ε₀. Since enclosed charge +Q does not change when radius is doubled, electric flux remains the same. (1 mark)',
  },
  {
    id: 'phy-2026-2',
    subjectId: 'physics',
    questionNumber: 2,
    section: 'Section A · Q2',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'If two identical heaters each rated as (1000 W, 220 V) are connected in parallel to 220 V, then the total power consumed is:',
    options: ['200 W', '250 W', '2000 W', '2500 W'],
    correctIndex: 2,
    markingScheme:
      'In parallel combination at rated voltage 220 V, total power P_total = P₁ + P₂ = 1000 W + 1000 W = 2000 W. (1 mark)',
  },
  {
    id: 'phy-2026-3',
    subjectId: 'physics',
    questionNumber: 3,
    section: 'Section A · Q3',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'An infinitely long cylinder is kept parallel to a uniform magnetic field B directed along negative y-axis. What will be the direction of induced current as seen from the y-axis?',
    options: [
      'clockwise of the negative y-axis',
      'anticlockwise of the negative y-axis',
      'no current will be induced',
      'along the direction of the magnetic field',
    ],
    correctIndex: 2,
    markingScheme:
      'Since the magnetic field B is uniform and steady (no change in magnetic flux Φ_B with time, dΦ_B/dt = 0), no emf or current is induced. (1 mark)',
  },
  {
    id: 'phy-2026-4',
    subjectId: 'physics',
    questionNumber: 4,
    section: 'Section A · Q4',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'If electric field associated with an electromagnetic wave is given by E = 30 sin(0.2π × 10⁻⁴ m⁻¹ x − 0.6π × 10⁴ Hz t) ĵ, then the direction of propagation of the wave is along:',
    options: ['î', '-î', 'k̂', '-k̂'],
    correctIndex: 0,
    markingScheme:
      'Comparing with E = E₀ sin(kx − ωt) ĵ, the wave travels along the positive x-axis, i.e., unit vector î. (1 mark)',
  },
  {
    id: 'phy-2026-5',
    subjectId: 'physics',
    questionNumber: 5,
    section: 'Section A · Q5',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'Which one of the following phenomenon is not explained by Huygens’ construction of wave front?',
    options: ['Diffraction', 'Refraction', 'Reflection', 'Origin of spectra'],
    correctIndex: 3,
    markingScheme:
      'Huygens’ wave theory explains reflection, refraction, interference, and diffraction, but cannot explain the origin of atomic spectra (which requires quantum theory). (1 mark)',
  },
  {
    id: 'phy-2026-6',
    subjectId: 'physics',
    questionNumber: 6,
    section: 'Section A · Q6',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'If wave front from star in nearby galaxy is detected by a telescope at the top of some mountain in India then the shape of the wavefront detected will be:',
    options: ['diverging spherical', 'converging spherical', 'plane', 'cylindrical'],
    correctIndex: 2,
    markingScheme:
      'A star lies effectively at infinite distance, so a small portion of its huge spherical wavefront reaching Earth is treated as a plane wavefront. (1 mark)',
  },
  {
    id: 'phy-2026-7',
    subjectId: 'physics',
    questionNumber: 7,
    section: 'Section A · Q7',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'The binding energy per nucleon curve shows a maximum around mass number A = 56. What does this imply about nuclei near iron (Fe)?',
    options: [
      'They are the least stable nuclei.',
      'They are the most tightly bound nuclei.',
      'They undergo spontaneous fission releasing maximum energy.',
      'They cannot participate in nuclear reactions.',
    ],
    correctIndex: 1,
    markingScheme:
      'Higher binding energy per nucleon corresponds to greater nuclear stability; the peak around Fe (A = 56, ~8.75 MeV/nucleon) means those nuclei are the most tightly bound. (1 mark)',
  },
  {
    id: 'phy-2026-8',
    subjectId: 'physics',
    questionNumber: 8,
    section: 'Section A · Q8',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'A ball of superconducting material is dipped in liquid nitrogen and placed near a bar magnet. The direction of the movement of the ball and the magnetic moment would be:',
    options: [
      'Towards the bar magnet · Opposite to that of the bar magnet',
      'Towards the bar magnet · Same direction as that of the bar magnet',
      'Away from the bar magnet · Same direction as that of the bar magnet',
      'Away from the bar magnet · Opposite to that of the bar magnet',
    ],
    correctIndex: 3,
    markingScheme:
      'Superconductors exhibit perfect diamagnetism (Meissner effect, χ = −1). They acquire a magnetic moment opposite to the applied field and are repelled away from the magnet. (1 mark)',
  },
  {
    id: 'phy-2026-9',
    subjectId: 'physics',
    questionNumber: 9,
    section: 'Section A · Q9',
    questionType: 'MCQ',
    marks: 1,
    diagramId: 'phy-q9-bridge',
    prompt:
      'A bridge circuit is shown in the figure (top arms 2 Ω and 4 Ω, bottom arms 3 Ω and 6 Ω, central resistor 5 Ω, connected across an 18 V battery). The total current flowing in the circuit is:',
    options: ['18 A', '5 A', '5/18 A', '18/5 A'],
    correctIndex: 1,
    markingScheme:
      'Since 2/4 = 3/6 = 1/2, the bridge is balanced and zero current flows through the 5 Ω resistor. R_eq = (6 × 9)/(6 + 9) = 18/5 Ω. Current I = V / R_eq = 18 / (18/5) = 5 A. (1 mark)',
  },
  {
    id: 'phy-2026-10',
    subjectId: 'physics',
    questionNumber: 10,
    section: 'Section A · Q10',
    questionType: 'MCQ',
    marks: 1,
    diagramId: 'phy-q10-bulbs',
    prompt:
      'Two electric bulbs, B₁ (200 V, 60 W) and B₂ (200 V, 100 W), are connected in series to an A.C. supply of 200 V. Using their rated voltage–power information, the ratio of their resistances R₁/R₂ is:',
    options: ['5:3', '3:5', '3:4', '4:3'],
    correctIndex: 0,
    markingScheme:
      'Rated resistance R = V² / P. Since both bulbs have the same rated voltage 200 V, R₁/R₂ = P₂/P₁ = 100/60 = 5:3. (1 mark)',
  },
  {
    id: 'phy-2026-11',
    subjectId: 'physics',
    questionNumber: 11,
    section: 'Section A · Q11',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'If nucleus scaled to football size is approximately 22 cm, then the radius of the orbit of electron will be approximately:',
    options: ['22 cm', '22 m', '22 km', '22000 km'],
    correctIndex: 2,
    markingScheme:
      'Atomic radius (~10⁻¹⁰ m) is about 10⁵ times nuclear radius (~10⁻¹⁵ m). Scaling 22 cm (= 0.22 m) by 10⁵ gives 22,000 m = 22 km. (1 mark)',
  },
  {
    id: 'phy-2026-12',
    subjectId: 'physics',
    questionNumber: 12,
    section: 'Section A · Q12',
    questionType: 'MCQ',
    marks: 1,
    diagramId: 'phy-q12-semicircle',
    prompt:
      'A current of 5 A is passing through a long wire which has semicircular loop of radius 10 cm as shown in the figure. The magnetic field produced at the center of the loop is:',
    options: ['2π μT', '4π μT', '5π μT', '8π μT'],
    correctIndex: 2,
    markingScheme:
      'Straight wire sections lie along the line through the center (B = 0). For the semicircular arc, B = (1/2)(μ₀I / 2r) = (4π × 10⁻⁷ × 5)/(4 × 0.1) = 5π × 10⁻⁶ T = 5π μT. (1 mark)',
  },
  {
    id: 'phy-2026-13',
    subjectId: 'physics',
    questionNumber: 13,
    section: 'Section A · Q13',
    questionType: 'Assertion-Reason',
    marks: 1,
    prompt:
      'Assertion (A): In Rutherford’s scattering experiment, most of the alpha particles passed through the gold foil undeflected. Reason (R): The electrons in the atom are very light and do not affect the path of the alpha particles significantly.',
    options: [
      'Both Assertion and Reason are true and Reason is the correct explanation of Assertion.',
      'Both Assertion and Reason are true but Reason is not the correct explanation of Assertion.',
      'Assertion is true but Reason is false.',
      'Both Assertion and Reason are false.',
    ],
    correctIndex: 1,
    markingScheme:
      'Both statements are true, but α-particles pass undeflected primarily because most of the atom is empty space (nucleus occupies a tiny volume), not solely because electrons are light. (1 mark)',
  },
  {
    id: 'phy-2026-14',
    subjectId: 'physics',
    questionNumber: 14,
    section: 'Section A · Q14',
    questionType: 'Assertion-Reason',
    marks: 1,
    prompt:
      'A convex lens of focal length 20 cm (n = 1.5) is immersed in water of refractive index 1.33. Assertion (A): The focal length of the lens increases when it is immersed in water. Reason (R): The focal length of a lens depends on the relative refractive index of the lens material with respect to the surrounding medium, as given by the lens maker’s formula.',
    options: [
      'Both Assertion and Reason are true and Reason is the correct explanation of Assertion.',
      'Both Assertion and Reason are true but Reason is not the correct explanation of Assertion.',
      'Assertion is true but Reason is false.',
      'Both Assertion and Reason are false.',
    ],
    correctIndex: 0,
    markingScheme:
      '1/f = (n₂/n₁ − 1)(1/R₁ − 1/R₂). Since n₂/n₁ decreases in water (1.5/1.33 < 1.5/1), focal length increases. Both A and R are true and R explains A. (1 mark)',
  },
  {
    id: 'phy-2026-15',
    subjectId: 'physics',
    questionNumber: 15,
    section: 'Section A · Q15',
    questionType: 'Assertion-Reason',
    marks: 1,
    prompt:
      'In Young’s double slit experiment, slit separation is 0.25 mm, screen is 1.0 m away, and wavelength is 500 nm. Assertion (A): The fringe width observed on the screen will be 2.0 mm. Reason (R): The fringe width in YDSE is directly proportional to the slit separation and inversely proportional to the wavelength of light.',
    options: [
      'Both Assertion and Reason are true and Reason is the correct explanation of Assertion.',
      'Both Assertion and Reason are true but Reason is not the correct explanation of Assertion.',
      'Assertion is true but Reason is false.',
      'Both Assertion and Reason are false.',
    ],
    correctIndex: 2,
    markingScheme:
      'β = λD/d = (500 × 10⁻⁹ × 1.0)/(0.25 × 10⁻³) = 2.0 mm, so A is true. However, β is directly proportional to λ and inversely proportional to d, so R is false. (1 mark)',
  },
  {
    id: 'phy-2026-16',
    subjectId: 'physics',
    questionNumber: 16,
    section: 'Section A · Q16',
    questionType: 'Assertion-Reason',
    marks: 1,
    prompt:
      'Assertion (A): If a conductor is placed in an external electric field, the electric field inside the conductor becomes infinity in electrostatic equilibrium. Reason (R): Free electrons inside the conductor rearrange themselves in such a way that the internal electric field is in the same direction as that of the external field.',
    options: [
      'Both Assertion and Reason are true and Reason is the correct explanation of Assertion.',
      'Both Assertion and Reason are true but Reason is not the correct explanation of Assertion.',
      'Assertion is true but Reason is false.',
      'Both Assertion and Reason are false.',
    ],
    correctIndex: 3,
    markingScheme:
      'In electrostatic equilibrium, the net electric field inside a conductor is zero (not infinity), because induced free charges create an internal field equal and opposite to the external field. Both A and R are false. (1 mark)',
  },

  // ================= CHEMISTRY (043) — 16 Official Section A Questions =================
  {
    id: 'chem-2026-1',
    subjectId: 'chemistry',
    questionNumber: 1,
    section: 'Section A · Q1',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'The boiling points and pKb values of isomeric amines are: Amine P (bp 329.3 K, pKb 3.00), Amine Q (bp 310.5 K, pKb 9.83), Amine R (bp 350.8 K, pKb 3.22). Which one of the following statements is correct?',
    options: [
      'Amine P is more volatile than amine R, but less basic',
      'Amine R will give white precipitate with Hinsberg reagent, which is soluble in NaOH',
      'Amine Q is more soluble in water as compared to R.',
      'Amine P and Q can be prepared by Gabriel Phthalimide process.',
    ],
    correctIndex: 1,
    markingScheme:
      'Isomeric primary amine R has the highest boiling point (350.8 K) due to extensive intermolecular H-bonding. Primary amines react with Hinsberg reagent (C₆H₅SO₂Cl) to yield an N-alkylbenzenesulphonamide precipitate soluble in NaOH. (1 mark)',
  },
  {
    id: 'chem-2026-2',
    subjectId: 'chemistry',
    questionNumber: 2,
    section: 'Section A · Q2',
    questionType: 'MCQ',
    marks: 1,
    prompt: 'Which of the following complex is tetrahedral in shape?',
    options: ['[Ni(CN)₄]²⁻', '[Cu(NH₃)₄]²⁺', '[NiCl₄]²⁻', '[Co(en)₃]³⁺'],
    correctIndex: 2,
    markingScheme:
      'In [NiCl₄]²⁻, Ni²⁺ (3d⁸) with weak-field Cl⁻ ligands remains unpaired and undergoes sp³ hybridisation, yielding a tetrahedral geometry. (1 mark)',
  },
  {
    id: 'chem-2026-3',
    subjectId: 'chemistry',
    questionNumber: 3,
    section: 'Section A · Q3',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'The quantity of charge required to obtain one mole of metal “M” from M₂O₃ is:',
    options: ['1F', '6F', '3F', '2F'],
    correctIndex: 2,
    markingScheme:
      'In M₂O₃, metal M is in +3 oxidation state: M³⁺ + 3e⁻ → M. Therefore 1 mole of M requires 3 moles of electrons, i.e., 3F charge. (1 mark)',
  },
  {
    id: 'chem-2026-4',
    subjectId: 'chemistry',
    questionNumber: 4,
    section: 'Section A · Q4',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'An organic compound “X” on reaction with chloroform and alcoholic KOH gives foul smelling product. In which of the following cases would compound X be produced?',
    options: [
      'Chloromethane is treated with AgCN.',
      'Nitrobenzene is reduced.',
      'Benzene diazonium chloride is treated with Cu/KCN',
      'Aniline reacts with Acetyl chloride.',
    ],
    correctIndex: 1,
    markingScheme:
      'Carbylamine reaction (CHCl₃ + alc. KOH) is given specifically by primary amines. Reduction of nitrobenzene yields aniline (a 1° aromatic amine). (1 mark)',
  },
  {
    id: 'chem-2026-5',
    subjectId: 'chemistry',
    questionNumber: 5,
    section: 'Section A · Q5',
    questionType: 'MCQ',
    marks: 1,
    diagramId: 'chem-q5-piston',
    prompt:
      'Consider a gas–liquid system in dynamic equilibrium as shown in Fig. 1(a). If the pressure is increased over the solution phase by compressing the gas to a smaller volume as shown in Fig. 1(b), which statement is true?',
    options: [
      'solubility of gas will increase until dynamic equilibrium is reached',
      'solubility of gas will decrease until dynamic equilibrium is reached',
      'solubility of gas will increase until static equilibrium is reached',
      'solubility of gas will decrease until static equilibrium is reached',
    ],
    correctIndex: 0,
    markingScheme:
      'By Henry’s Law, compressing the gas increases partial pressure above the liquid, increasing gas molecules entering the solution until a new dynamic equilibrium is established. (1 mark)',
  },
  {
    id: 'chem-2026-6',
    subjectId: 'chemistry',
    questionNumber: 6,
    section: 'Section A · Q6',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'Aavya carries out hydrolysis of acetyl chloride (CH₃COCl + H₂O → CH₃COOH + HCl) with (i) equimolar amounts of acetyl chloride and water (ii) excess of water. The rate law obeyed in the two cases will be:',
    options: [
      '(i) First order (ii) Second Order',
      '(i) First order (ii) First order',
      '(i) Second order (ii) Second order',
      '(i) Second order (ii) First order',
    ],
    correctIndex: 3,
    markingScheme:
      'With equimolar amounts, rate depends on both [CH₃COCl] and [H₂O] (second order). With excess water, [H₂O] remains practically constant, yielding a pseudo-first order reaction. (1 mark)',
  },
  {
    id: 'chem-2026-7',
    subjectId: 'chemistry',
    questionNumber: 7,
    section: 'Section A · Q7',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'The amino acid HOOC-CH₂-CH₂-CH(NH₂)COOH can be synthesised within our body. Which of the following is true about this amino acid?',
    options: [
      'an acidic and non-essential amino acid.',
      'a neutral and non-essential amino acid.',
      'an acidic and essential amino acid',
      'a neutral and essential amino acid',
    ],
    correctIndex: 0,
    markingScheme:
      'It contains two carboxylic acid (–COOH) groups and one –NH₂ group (acidic), and because it can be synthesized in the body, it is non-essential. (1 mark)',
  },
  {
    id: 'chem-2026-8',
    subjectId: 'chemistry',
    questionNumber: 8,
    section: 'Section A · Q8',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'Identify the Grignard reagent and carbonyl compound which on reaction followed by hydrolysis will give 3-methyl pentan-3-ol: (i) C₂H₅COC₂H₅ + CH₃MgCl (ii) C₂H₅COCH₃ + C₂H₅MgCl (iii) CH₃CHO + C₂H₅CH(MgCl)C₂H₅ (iv) C₂H₅CHO + CH₃CH(MgCl)C₂H₅',
    options: ['(i) and (iii)', '(ii) and (iv)', '(iii) and (iv)', '(i) and (ii)'],
    correctIndex: 3,
    markingScheme:
      '3-methylpentan-3-ol is a tertiary alcohol, which requires a ketone + Grignard reagent: both (i) pentan-3-one + CH₃MgCl and (ii) butan-2-one + C₂H₅MgCl yield 3-methylpentan-3-ol. (1 mark)',
  },
  {
    id: 'chem-2026-9',
    subjectId: 'chemistry',
    questionNumber: 9,
    section: 'Section A · Q9',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'Which one of the following elements will be a strong oxidising agent in its +3 oxidation state? (Atomic no. Cr = 24, Mn = 25, Ti = 22, Fe = 26)',
    options: ['Cr', 'Mn', 'Ti', 'Fe'],
    correctIndex: 1,
    markingScheme:
      'Mn³⁺ (3d⁴) readily accepts an electron to form Mn²⁺ with a stable half-filled 3d⁵ configuration (E° Mn³⁺/Mn²⁺ = +1.57 V), making Mn³⁺ a strong oxidising agent. (1 mark)',
  },
  {
    id: 'chem-2026-10',
    subjectId: 'chemistry',
    questionNumber: 10,
    section: 'Section A · Q10',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'When (–)-2-bromohexane reacts with sodium hydroxide, (+)-hexan-2-ol is formed. Which one of the following observations would be correct?',
    options: [
      'The reaction follows SN2 mechanism and is accompanied by inversion of configuration.',
      'The reaction follows SN1 mechanism and is accompanied by inversion of configuration.',
      'The reaction follows SN2 mechanism and is accompanied by retention of configuration.',
      'The reaction follows SN1 mechanism and is accompanied by retention of configuration.',
    ],
    correctIndex: 0,
    markingScheme:
      'Conversion of optically active (–)-2-bromohexane exclusively into (+)-hexan-2-ol reflects complete inversion of configuration via an SN2 backside nucleophilic attack. (1 mark)',
  },
  {
    id: 'chem-2026-11',
    subjectId: 'chemistry',
    questionNumber: 11,
    section: 'Section A · Q11',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'If half-life of a first order reaction is 16 minutes, how much time does it take to complete 75% of the reaction?',
    options: ['16 min', '32 min', '48 min', '64 min'],
    correctIndex: 1,
    markingScheme:
      'For a first-order reaction, 75% completion equals two half-lives: t₇₅% = 2 × t₁/₂ = 2 × 16 = 32 min. (1 mark)',
  },
  {
    id: 'chem-2026-12',
    subjectId: 'chemistry',
    questionNumber: 12,
    section: 'Section A · Q12',
    questionType: 'MCQ',
    marks: 1,
    prompt: 'Which solution has the highest conductivity?',
    options: ['0.1 M HCl', '0.1 M CH₃COOH', '0.1 M glucose', '0.1 M NH₄OH'],
    correctIndex: 0,
    markingScheme:
      '0.1 M HCl is a strong acid that dissociates completely and produces fast-moving H⁺ ions, giving the highest conductivity. (1 mark)',
  },
  {
    id: 'chem-2026-13',
    subjectId: 'chemistry',
    questionNumber: 13,
    section: 'Section A · Q13',
    questionType: 'Assertion-Reason',
    marks: 1,
    prompt:
      'Assertion (A): Nitration of aniline gives significant amount of meta derivative. Reason (R): –NH₂ is ortho and para directing and highly activating group.',
    options: [
      'Both A and R are true, and R is the correct explanation of A.',
      'Both A and R are true, and R is not the correct explanation of A.',
      'A is true but R is false.',
      'A is false but R is true.',
    ],
    correctIndex: 1,
    markingScheme:
      'Both A and R are true, but meta-nitroaniline forms (~47%) because aniline gets protonated in strongly acidic nitrating mixture to form the meta-directing anilinium ion (–NH₃⁺). (1 mark)',
  },
  {
    id: 'chem-2026-14',
    subjectId: 'chemistry',
    questionNumber: 14,
    section: 'Section A · Q14',
    questionType: 'Assertion-Reason',
    marks: 1,
    prompt:
      'Assertion (A): Permanganate and manganate ions have tetrahedral structure. Reason (R): In permanganate and manganate ions, pi bonding takes place which is due to overlap of p orbitals of oxygen with p orbitals of manganese.',
    options: [
      'Both A and R are true, and R is the correct explanation of A.',
      'Both A and R are true, and R is not the correct explanation of A.',
      'A is true but R is false.',
      'A is false but R is true.',
    ],
    correctIndex: 2,
    markingScheme:
      'MnO₄⁻ and MnO₄²⁻ are indeed tetrahedral (A is true), but π-bonding takes place by overlap of p-orbitals of oxygen with d-orbitals of manganese (pπ–dπ), not p-orbitals of Mn (R is false). (1 mark)',
  },
  {
    id: 'chem-2026-15',
    subjectId: 'chemistry',
    questionNumber: 15,
    section: 'Section A · Q15',
    questionType: 'Assertion-Reason',
    marks: 1,
    prompt:
      'Assertion (A): Miscibility of ethers with water resembles those of alcohols of the same molecular mass. Reason (R): The oxygen of ether can also form hydrogen bonds with water.',
    options: [
      'Both A and R are true, and R is the correct explanation of A.',
      'Both A and R are true, and R is not the correct explanation of A.',
      'A is true but R is false.',
      'A is false but R is true.',
    ],
    correctIndex: 0,
    markingScheme:
      'Lower ethers have comparable water solubility to isomeric alcohols because the ethereal oxygen atom forms hydrogen bonds with water molecules. (1 mark)',
  },
  {
    id: 'chem-2026-16',
    subjectId: 'chemistry',
    questionNumber: 16,
    section: 'Section A · Q16',
    questionType: 'Assertion-Reason',
    marks: 1,
    prompt:
      'Assertion (A): [Co(NH₃)₆]³⁺ is diamagnetic. Reason (R): NH₃ is a strong field ligand and causes pairing of electrons.',
    options: [
      'Both A and R are true, and R is the correct explanation of A.',
      'Both A and R are true, and R is not the correct explanation of A.',
      'A is true but R is false.',
      'A is false but R is true.',
    ],
    correctIndex: 0,
    markingScheme:
      'Co³⁺ (3d⁶) with strong-field NH₃ undergoes spin pairing into t₂g⁶ e_g⁰ (d²sp³), leaving zero unpaired electrons (diamagnetic). (1 mark)',
  },

  // ================= BIOLOGY (044) — 16 Official Section A Questions =================
  {
    id: 'bio-2026-1',
    subjectId: 'biology',
    questionNumber: 1,
    section: 'Section A · Q1',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'A researcher observes that in a particular flowering plant, the pistil matures several days before the stamens in all flowers of the plant. What is the most significant consequence of this timing difference?',
    options: [
      'It guarantees self-pollination',
      'It promotes autogamy',
      'It ensures cross-pollination',
      'It leads to geitonogamy',
    ],
    correctIndex: 2,
    markingScheme:
      'Non-synchronised pollen release and stigma receptivity (protogyny across all flowers) prevents both autogamy and geitonogamy, ensuring cross-pollination (xenogamy). (1 mark)',
  },
  {
    id: 'bio-2026-2',
    subjectId: 'biology',
    questionNumber: 2,
    section: 'Section A · Q2',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'A male patient undergoes a medical procedure where a small section of the vas deferens is cut and tied at both ends. Which of the following effects is the intended and direct result of this procedure?',
    options: [
      'Blockage of sperm transport into the ejaculatory duct and urethra.',
      'Inhibition of testosterone production by the testes.',
      'Suppression of the formation of seminal plasma by accessory glands.',
      'Prevention of spermatogenesis in the seminiferous tubules.',
    ],
    correctIndex: 0,
    markingScheme:
      'Vasectomy blocks gamete transport along the vas deferens while spermatogenesis and testosterone secretion continue normally. (1 mark)',
  },
  {
    id: 'bio-2026-3',
    subjectId: 'biology',
    questionNumber: 3,
    section: 'Section A · Q3',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'During the early stage of human embryonic development, the blastomeres are arranged into an outer layer and an inner group of cells known as the Inner Cell Mass (ICM). What is the fundamental significance of the outer layer, the trophoblast?',
    options: [
      'It is responsible for forming the primary germ layers (ectoderm, mesoderm, endoderm).',
      'It provides essential nutrients to developing embryo and helps in its implantation.',
      'It secretes colostrum which contains antibodies.',
      'It gives rise to all the organs of the future embryo (organogenesis).',
    ],
    correctIndex: 1,
    markingScheme:
      'The trophoblast attaches to the endometrium (implantation), forms chorionic villi/placenta, and draws nutrition for the developing embryo, while the ICM gives rise to the embryo proper. (1 mark)',
  },
  {
    id: 'bio-2026-4',
    subjectId: 'biology',
    questionNumber: 4,
    section: 'Section A · Q4',
    questionType: 'MCQ',
    marks: 1,
    diagramId: 'bio-q4-giraffe',
    prompt:
      'Select the option that gives the correct description of the process of natural selection with respect to the length of the neck of the giraffe shown in the graph.',
    options: [
      'Stabilising selection as giraffes with longer neck lengths are selected further.',
      'Disruptive selection as giraffes with smaller and longer neck lengths are selected.',
      'Directional selection as giraffes with longer neck lengths are selected.',
      'Stabilising selection as giraffes with medium neck lengths are selected.',
    ],
    correctIndex: 2,
    markingScheme:
      'Because the peak shifts toward one extreme (longer neck lengths), the graph illustrates directional selection. (1 mark)',
  },
  {
    id: 'bio-2026-5',
    subjectId: 'biology',
    questionNumber: 5,
    section: 'Section A · Q5',
    questionType: 'MCQ',
    marks: 1,
    diagramId: 'bio-q5-transcription',
    prompt:
      'The initiation step during the process of transcription in bacteria is shown below. Identify A, B, C and D by selecting the correct option:',
    options: [
      'A-RNA polymerase, B-Promoter, C-Sigma factor, D-DNA helix',
      'A-Promoter, B-Sigma factor, C-RNA polymerase, D-DNA helix',
      'A-Promoter, B-RNA polymerase, C-DNA helix, D-Sigma factor',
      'A-Promoter, B-RNA polymerase, C-Sigma factor, D-DNA helix',
    ],
    correctIndex: 1,
    markingScheme:
      'A is the Promoter region at the 5′ upstream end, B is the Sigma (σ) initiation factor, C is RNA polymerase holoenzyme, and D is the DNA double helix. (1 mark)',
  },
  {
    id: 'bio-2026-6',
    subjectId: 'biology',
    questionNumber: 6,
    section: 'Section A · Q6',
    questionType: 'MCQ',
    marks: 1,
    diagramId: 'bio-q6-avery',
    prompt:
      'In the illustration of the Avery, MacLeod and McCarty experiment to identify DNA as the transforming principle, select the tube option (A, B, C, or D) that INCORRECTLY depicts the result of the step.',
    options: [
      'Tube A (RNase + R bacteria → No transformation)',
      'Tube B (Protease + R bacteria → Transformation)',
      'Tube C (DNase + R bacteria → No transformation)',
      'Tube D (Lipase + R bacteria → Transformation)',
    ],
    correctIndex: 0,
    markingScheme:
      'RNase digests RNA, not DNA; therefore DNA remains intact and transformation of R bacteria into S bacteria still occurs. Only DNase prevents transformation. Thus Tube A is depicted incorrectly. (1 mark)',
  },
  {
    id: 'bio-2026-7',
    subjectId: 'biology',
    questionNumber: 7,
    section: 'Section A · Q7',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'A scientist was culturing E. coli in a ¹⁵NH₄Cl medium initially, then shifted E. coli to a ¹⁴NH₄Cl medium. DNA was extracted after 60 minutes of transfer and subjected to density gradient centrifugation. What will be the densities of DNA molecules formed?',
    options: [
      '25% hybrid and 75% light',
      '50% hybrid and 50% light',
      '75% hybrid and 25% light',
      '85% hybrid and 15% light',
    ],
    correctIndex: 0,
    markingScheme:
      'E. coli divides every 20 minutes. After 60 minutes (3 generations), 8 DNA molecules exist: 2 remain ¹⁵N–¹⁴N hybrid (25%) and 6 are fully ¹⁴N–¹⁴N light (75%). (1 mark)',
  },
  {
    id: 'bio-2026-8',
    subjectId: 'biology',
    questionNumber: 8,
    section: 'Section A · Q8',
    questionType: 'MCQ',
    marks: 1,
    diagramId: 'bio-q8-pedigree',
    prompt: 'Study the given pedigree chart and identify the disease represented:',
    options: [
      'Myotonic Dystrophy',
      'Sickle cell anaemia',
      'Haemophilia',
      'Colour blindness',
    ],
    correctIndex: 1,
    markingScheme:
      'Unaffected parents produce both an affected son and an affected daughter, indicating an autosomal recessive trait. Among the options, Sickle cell anaemia is autosomal recessive. (1 mark)',
  },
  {
    id: 'bio-2026-9',
    subjectId: 'biology',
    questionNumber: 9,
    section: 'Section A · Q9',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'A patient with fever, chest pain, cough and breathing difficulty undergoes a chest X-ray. The film shows patchy opacities and reduced clarity of lung fields. Which observation best supports pneumonia?',
    options: [
      'Enlarged heart size',
      'Inflammation or fluid buildup in the lungs',
      'Fractured ribs',
      'Air pockets in the lungs',
    ],
    correctIndex: 1,
    markingScheme:
      'In pneumonia, alveoli become inflamed and filled with fluid, producing patchy opacities and impaired gas exchange. (1 mark)',
  },
  {
    id: 'bio-2026-10',
    subjectId: 'biology',
    questionNumber: 10,
    section: 'Section A · Q10',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'A stretch of euchromatin has 200 nucleosomes. How many base pairs (bp) will be there in the stretch and what would be the length of the typical euchromatin?',
    options: [
      '20,000 bp and 13,000 × 10⁻⁹ m',
      '10,000 bp and 10,000 × 10⁻⁹ m',
      '40,000 bp and 13,600 × 10⁻⁹ m',
      '40,000 bp and 13,900 × 10⁻⁹ m',
    ],
    correctIndex: 2,
    markingScheme:
      '1 nucleosome ≈ 200 bp ⇒ 200 nucleosomes = 40,000 bp. Length = 40,000 × 0.34 nm = 13,600 × 10⁻⁹ m. (1 mark)',
  },
  {
    id: 'bio-2026-11',
    subjectId: 'biology',
    questionNumber: 11,
    section: 'Section A · Q11',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'A biotechnology company grew Streptomyces in a fermenter to produce an antibiotic. From Day 7 onwards, yield dropped sharply while microscopy revealed new bacterial colonies not in the original culture. What measure prevents this in future runs?',
    options: [
      'Increasing temperature only at the end of fermentation to kill contaminants.',
      'Adding antibiotics to the culture so unwanted microbes cannot grow.',
      'Ensuring sterile handling, sterilised equipment, and aseptic transfer before and during fermentation.',
      'Using a genetically modified strain designed to grow faster than contaminants.',
    ],
    correctIndex: 2,
    markingScheme:
      'Maintaining strict bioprocess aseptic control (sterilised vessels, media, air filters, and sterile inoculation) prevents microbial contamination. (1 mark)',
  },
  {
    id: 'bio-2026-12',
    subjectId: 'biology',
    questionNumber: 12,
    section: 'Section A · Q12',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'A rice farmer’s field requires phosphorus, is experiencing severe drought, and is susceptible to root infestation by pathogens. Which technique best addresses all these issues?',
    options: [
      'Adding nitrogen-fixing bacteria to the soil',
      'Applying chemical fertilizers',
      'Adding spores of Glomus to the soil',
      'Flooding the field artificially to mimic normal conditions',
    ],
    correctIndex: 2,
    markingScheme:
      'Glomus (endomycorrhizal fungus) absorbs phosphorus for the plant, improves drought/salinity tolerance, and confers resistance to root-borne pathogens. (1 mark)',
  },
  {
    id: 'bio-2026-13',
    subjectId: 'biology',
    questionNumber: 13,
    section: 'Section A · Q13',
    questionType: 'Assertion-Reason',
    marks: 1,
    prompt:
      'Assertion (A): Spermatogenesis is an ongoing process throughout the reproductive life of a human male, while oogenesis is a discontinuous process. Reason (R): Oogenesis begins during the embryonic stage, gets arrested at prophase-I, resumes after puberty, and is arrested again at metaphase-II.',
    options: [
      'Both A and R are true and R is the correct explanation of A.',
      'Both A and R are true but R is not the correct explanation of A.',
      'A is true but R is false.',
      'A is False but R is true.',
    ],
    correctIndex: 0,
    markingScheme:
      'Both A and R are true; the meiotic arrests at prophase-I and metaphase-II make oogenesis discontinuous compared to continuous spermatogenesis. (1 mark)',
  },
  {
    id: 'bio-2026-14',
    subjectId: 'biology',
    questionNumber: 14,
    section: 'Section A · Q14',
    questionType: 'Assertion-Reason',
    marks: 1,
    prompt:
      'Assertion (A): There is no variation in the percentage recombination due to loosely or tightly linked genes. Reason (R): Linked genes result in occurrence of higher proportion of parental gene combinations.',
    options: [
      'Both A and R are true and R is the correct explanation of A.',
      'Both A and R are true but R is not the correct explanation of A.',
      'A is true but R is false.',
      'A is False but R is true.',
    ],
    correctIndex: 3,
    markingScheme:
      'Tightly linked genes show very low recombination whereas loosely linked genes show higher recombination, so A is false. R is true because linkage preserves parental combinations. (1 mark)',
  },
  {
    id: 'bio-2026-15',
    subjectId: 'biology',
    questionNumber: 15,
    section: 'Section A · Q15',
    questionType: 'Assertion-Reason',
    marks: 1,
    prompt:
      'Assertion (A): The primary goal of sewage treatment is to eliminate all organic matter from the effluent. Reason (R): High BOD indicates a low level of organic matter in the water, which can lead to increased oxygen consumption by microorganisms, potentially harming aquatic life.',
    options: [
      'Both A and R are true and R is the correct explanation of A.',
      'Both A and R are true but R is not the correct explanation of A.',
      'A is true but R is false.',
      'A is False but R is true.',
    ],
    correctIndex: 2,
    markingScheme:
      'High BOD indicates a HIGH (not low) level of organic matter in water, so R is false while A is treated as true within the given options. (1 mark)',
  },
  {
    id: 'bio-2026-16',
    subjectId: 'biology',
    questionNumber: 16,
    section: 'Section A · Q16',
    questionType: 'Assertion-Reason',
    marks: 1,
    prompt:
      'Assertion (A): Tissue culture is used when traditional breeding technique is insufficient to keep pace with the demand of crop improvement. Reason (R): Totipotency is the ability of a single plant cell or explant to regenerate into a whole plant under sterile conditions in nutrient media.',
    options: [
      'Both A and R are true and R is the correct explanation of A.',
      'Both A and R are true but R is not the correct explanation of A.',
      'A is true but R is false.',
      'A is False but R is true.',
    ],
    correctIndex: 0,
    markingScheme:
      'Micropropagation via tissue culture rapidly multiplies crops precisely because plant cells exhibit totipotency under sterile nutrient culture. (1 mark)',
  },

  // ================= MATHEMATICS (041) — 20 Official Section A Questions =================
  {
    id: 'math-2026-1',
    subjectId: 'maths',
    questionNumber: 1,
    section: 'Section A · Q1',
    questionType: 'MCQ',
    marks: 1,
    diagramId: 'math-q1-graph',
    prompt: 'Identify the function whose graph is given below (domain [-1, 1], range [π, 2π]):',
    options: ['cos⁻¹(x/2)', 'cos⁻¹(2x)', 'π − cos⁻¹ x', 'π + cos⁻¹ x'],
    correctIndex: 3,
    markingScheme:
      'Since cos⁻¹ x ∈ [0, π], adding π shifts the range to [π, 2π], matching y(−1) = 2π, y(0) = 3π/2, and y(1) = π. Hence y = π + cos⁻¹ x. (1 mark)',
  },
  {
    id: 'math-2026-2',
    subjectId: 'maths',
    questionNumber: 2,
    section: 'Section A · Q2',
    questionType: 'MCQ',
    marks: 1,
    prompt: 'Domain of the function sec⁻¹(2x) is:',
    options: [
      '(−∞, ∞)',
      '(−1/2, 1/2)',
      '(−∞, −1/2) ∪ (1/2, ∞)',
      '(−∞, −1/2] ∪ [1/2, ∞)',
    ],
    correctIndex: 3,
    markingScheme:
      'sec⁻¹(2x) is defined for |2x| ≥ 1 ⇒ x ≤ −1/2 or x ≥ 1/2, i.e., (−∞, −1/2] ∪ [1/2, ∞). (1 mark)',
  },
  {
    id: 'math-2026-3',
    subjectId: 'maths',
    questionNumber: 3,
    section: 'Section A · Q3',
    questionType: 'MCQ',
    marks: 1,
    prompt: 'Value of cot⁻¹(2 cos(½ sin⁻¹(√3/2))) is:',
    options: ['π/6', 'π/4', 'π/3', 'π/2'],
    correctIndex: 0,
    markingScheme:
      'sin⁻¹(√3/2) = π/3 ⇒ ½(π/3) = π/6 ⇒ 2 cos(π/6) = 2(√3/2) = √3 ⇒ cot⁻¹(√3) = π/6. (1 mark)',
  },
  {
    id: 'math-2026-4',
    subjectId: 'maths',
    questionNumber: 4,
    section: 'Section A · Q4',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'If A = [[2, 1, −2], [3a, 0, 4], [b, 2c, 1]] is a symmetric matrix, then the value of √(6a + 2b + 3c) is:',
    options: ['−2', '2', '±2', '4'],
    correctIndex: 1,
    markingScheme:
      'Symmetry (A = Aᵀ) gives 3a = 1 (a = 1/3), b = −2, 2c = 4 (c = 2). Thus √(6(1/3) + 2(−2) + 3(2)) = √(2 − 4 + 6) = √4 = 2. (1 mark)',
  },
  {
    id: 'math-2026-5',
    subjectId: 'maths',
    questionNumber: 5,
    section: 'Section A · Q5',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'If P and Q are matrices of the same order such that P = [[2, 1], [0, 1]] and |Q| = 3, then find |adj(PQ)|:',
    options: ['−3', '1', '6', '36'],
    correctIndex: 2,
    markingScheme:
      '|P| = 2(1) − 0 = 2, so |PQ| = |P||Q| = 2 × 3 = 6. For a 2×2 matrix, |adj(PQ)| = |PQ|^(2−1) = 6. (1 mark)',
  },
  {
    id: 'math-2026-6',
    subjectId: 'maths',
    questionNumber: 6,
    section: 'Section A · Q6',
    questionType: 'MCQ',
    marks: 1,
    prompt: 'If [1  x] [[1, 0], [0, 2]] [[4], [−1]] = O, then value of x is:',
    options: ['−2', '−1', '1', '2'],
    correctIndex: 3,
    markingScheme:
      '[1  x] · [4, −2]ᵀ = 4 − 2x = 0 ⇒ x = 2. (1 mark)',
  },
  {
    id: 'math-2026-7',
    subjectId: 'maths',
    questionNumber: 7,
    section: 'Section A · Q7',
    questionType: 'MCQ',
    marks: 1,
    prompt: 'The derivative of cos⁻¹(2x² − 1) with respect to cos⁻¹(x) is:',
    options: ['2', '±1', '1/2', '−3'],
    correctIndex: 0,
    markingScheme:
      'Let cos⁻¹(x) = θ, so x = cos θ and cos⁻¹(2x² − 1) = cos⁻¹(cos 2θ) = 2θ. Hence d(2θ)/dθ = 2. (1 mark)',
  },
  {
    id: 'math-2026-8',
    subjectId: 'maths',
    questionNumber: 8,
    section: 'Section A · Q8',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'If f(x) = ax² + b (b ≠ 0) for x ≤ 1, and f(x) = bx² + ax + c for x > 1 is differentiable at x = 1, then which of the following could be a triplet for (a, b, c)?',
    options: ['(3, 2, 0)', '(0, 0, 3)', '(3/2, 2, 0)', '(3, 3/2, 0)'],
    correctIndex: 3,
    markingScheme:
      'Continuity at x = 1 gives a + b = b + a + c ⇒ c = 0. Differentiability gives LHD = 2a = RHD = 2b + a ⇒ a = 2b. Only (3, 3/2, 0) satisfies a = 2b and c = 0. (1 mark)',
  },
  {
    id: 'math-2026-9',
    subjectId: 'maths',
    questionNumber: 9,
    section: 'Section A · Q9',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'If y = a{x + 2a sin(x/a)}, a > 0, x ∈ [0, πa] is a decreasing function, then the interval in which x lies is:',
    options: ['(5π/6, π]', '(2π/3, π]', '(5πa/6, πa]', '(2πa/3, πa]'],
    correctIndex: 3,
    markingScheme:
      'dy/dx = a(1 + 2 cos(x/a)) < 0 ⇒ cos(x/a) < −1/2. For x/a ∈ [0, π], x/a ∈ (2π/3, π] ⇒ x ∈ (2πa/3, πa]. (1 mark)',
  },
  {
    id: 'math-2026-10',
    subjectId: 'maths',
    questionNumber: 10,
    section: 'Section A · Q10',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'The values of x for which the derivative of the function y = x⁴ is greater than the value of the function are:',
    options: ['0 < x < 4', '0 < x ≤ 4', 'x < 0 or x > 4', 'x < 0 or x ≥ 4'],
    correctIndex: 0,
    markingScheme:
      '4x³ > x⁴ ⇒ x³(4 − x) > 0, which holds when both factors are positive, i.e., 0 < x < 4. (1 mark)',
  },
  {
    id: 'math-2026-11',
    subjectId: 'maths',
    questionNumber: 11,
    section: 'Section A · Q11',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'The degree and order of the differential equation y − x(dy/dx)³ = a(y + d²y/dx²)² are respectively:',
    options: ['3, 1', '2, 2', '3, 2', '4, 2'],
    correctIndex: 1,
    markingScheme:
      'Highest-order derivative is d²y/dx² (order = 2) and its highest exponent is 2 (degree = 2). (1 mark)',
  },
  {
    id: 'math-2026-12',
    subjectId: 'maths',
    questionNumber: 12,
    section: 'Section A · Q12',
    questionType: 'MCQ',
    marks: 1,
    prompt: 'If ∫ 1/(1 + e²ˣ) dx = x − P log(1 + e²ˣ) + C, then ‘P’ is equal to:',
    options: ['−1/2', '−1/3', '1/3', '1/2'],
    correctIndex: 3,
    markingScheme:
      'Write 1/(1 + e²ˣ) = 1 − e²ˣ/(1 + e²ˣ). Integrating gives x − ½ log(1 + e²ˣ) + C, so P = 1/2. (1 mark)',
  },
  {
    id: 'math-2026-13',
    subjectId: 'maths',
    questionNumber: 13,
    section: 'Section A · Q13',
    questionType: 'MCQ',
    marks: 1,
    prompt: 'If vector 2î − uĵ + 3k̂ has magnitude 4, then value of ‘u’ is:',
    options: ['1', '√2', '±√3', '±2'],
    correctIndex: 2,
    markingScheme:
      '√(2² + (−u)² + 3²) = 4 ⇒ 4 + u² + 9 = 16 ⇒ u² = 3 ⇒ u = ±√3. (1 mark)',
  },
  {
    id: 'math-2026-14',
    subjectId: 'maths',
    questionNumber: 14,
    section: 'Section A · Q14',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'Angle made by the vector î + ĵ + √2 k̂ with positive direction of z-axis is:',
    options: ['π/6', 'π/4', 'π/3', 'π/2'],
    correctIndex: 1,
    markingScheme:
      'cos γ = √2 / √(1 + 1 + 2) = √2 / 2 = 1/√2 ⇒ γ = π/4. (1 mark)',
  },
  {
    id: 'math-2026-15',
    subjectId: 'maths',
    questionNumber: 15,
    section: 'Section A · Q15',
    questionType: 'MCQ',
    marks: 1,
    prompt: 'A vector perpendicular to the vectors î + ĵ and î − ĵ is:',
    options: ['−2ĵ', '3k̂', '2î', '2î + k̂'],
    correctIndex: 1,
    markingScheme:
      '(î + ĵ) × (î − ĵ) = −2k̂, which is parallel to 3k̂. Hence 3k̂ is perpendicular to both vectors. (1 mark)',
  },
  {
    id: 'math-2026-16',
    subjectId: 'maths',
    questionNumber: 16,
    section: 'Section A · Q16',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'The probability that it rains on a particular day is 1/5. Assuming weather conditions of any two days are independent, find the probability that it rains on three consecutive days.',
    options: ['4/5', '1/5', '1/25', '1/125'],
    correctIndex: 3,
    markingScheme:
      'For independent days, P(rain on 3 consecutive days) = (1/5)³ = 1/125. (1 mark)',
  },
  {
    id: 'math-2026-17',
    subjectId: 'maths',
    questionNumber: 17,
    section: 'Section A · Q17',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'A die is thrown twice. What is the probability that at least one number is 4, given the sum of the numbers appearing is a multiple of 5?',
    options: ['3/5', '4/5', '3/7', '4/7'],
    correctIndex: 3,
    markingScheme:
      'Sample space with sum = 5 or 10: {(1,4),(4,1),(2,3),(3,2),(4,6),(6,4),(5,5)} (7 outcomes). Outcomes containing 4: {(1,4),(4,1),(4,6),(6,4)} (4 outcomes). Probability = 4/7. (1 mark)',
  },
  {
    id: 'math-2026-18',
    subjectId: 'maths',
    questionNumber: 18,
    section: 'Section A · Q18',
    questionType: 'MCQ',
    marks: 1,
    prompt:
      'A and B are two independent events such that P(A) = 1/6, P(B) = k. If the probability of occurrence of exactly one of them is 1/3, then find the value of k.',
    options: ['1/4', '2/3', '3/4', '5/6'],
    correctIndex: 0,
    markingScheme:
      'P(A)P(B′) + P(A′)P(B) = (1/6)(1 − k) + (5/6)k = (1 + 4k)/6 = 1/3 ⇒ 1 + 4k = 2 ⇒ k = 1/4. (1 mark)',
  },
  {
    id: 'math-2026-19',
    subjectId: 'maths',
    questionNumber: 19,
    section: 'Section A · Q19',
    questionType: 'Assertion-Reason',
    marks: 1,
    prompt:
      'Assertion (A): The value of the integral ∫₋₁¹ |x − 2| dx is 4. Reason (R): If f(−x) = f(x) then ∫₋ₐᵃ f(x)dx = 2 ∫₀ᵃ f(x)dx.',
    options: [
      'Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).',
      'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).',
      'Assertion (A) is true but Reason (R) is false.',
      'Assertion (A) is false but Reason (R) is true.',
    ],
    correctIndex: 1,
    markingScheme:
      'On [−1, 1], |x − 2| = 2 − x, so ∫₋₁¹ (2 − x)dx = 4 (A is true). R is a true definite integral property, but |x − 2| is not an even function, so R does not explain A. (1 mark)',
  },
  {
    id: 'math-2026-20',
    subjectId: 'maths',
    questionNumber: 20,
    section: 'Section A · Q20',
    questionType: 'Assertion-Reason',
    marks: 1,
    prompt:
      'Assertion (A): The general solution of a differential equation represents a family of curves. Reason (R): The derivative of an arbitrary constant is zero.',
    options: [
      'Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).',
      'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).',
      'Assertion (A) is true but Reason (R) is false.',
      'Assertion (A) is false but Reason (R) is true.',
    ],
    correctIndex: 1,
    markingScheme:
      'Both A and R are true statements; R explains why differentiating a family of curves removes arbitrary constants when forming a differential equation, rather than why the solution represents a family. (1 mark)',
  },
];

// Official 2026–27 Subjective & Case-Based Questions (Sections B–E) for Complete Paper Practice
export const SUBJECTIVE_SECTIONS: SubjectiveSectionGroup[] = [
  {
    subjectId: 'physics',
    sectionName: 'Sections B to E (Q17 – Q33)',
    marksSummary: '54 Marks · Short Answer, Case-Based & Long Answer',
    items: [
      {qNo: 'Q17', marks: '2', text: 'E = 30 sin(2π×10¹⁸ t + π×10¹⁰ x) Vm⁻¹, B = 10⁻⁷ sin(...) T. Find (I) refractive index of medium and (II) frequency and type of EM wave.'},
      {qNo: 'Q18', marks: '2', text: 'Write the nature of path of free electrons in a conductor in the (a) presence of electric field, (b) absence of electric field.'},
      {qNo: 'Q19', marks: '2', text: 'Two like charges +q and +q are placed at distance d. Find work done by an external agent to bring +q from infinity to the midpoint.'},
      {qNo: 'Q24', marks: '3', text: 'Atomic mass of ¹⁶₈O is 15.99493 u. Calculate the binding energy per nucleon (m_p = 1.00727 u, m_n = 1.00866 u, 1 u = 931.5 MeV/c²).'},
      {qNo: 'Q29', marks: '4', text: 'Case Study: Flexible organic polymer semiconductor films for wearable devices — carrier mobility, band gaps (diamond 5.4 eV vs Si 1.1 eV), and intrinsic equilibrium.'},
      {qNo: 'Q30', marks: '4', text: 'Case Study: Einstein’s photoelectric effect (K_max = hν − φ₀) — work function, intensity independence, and wave theory contradictions.'},
      {qNo: 'Q31–Q33', marks: '15', text: 'Long Answer (3 × 5 Marks): Capacitor combinations & potential gradient; Compound microscope / Astronomical telescope; Step-up transformer & Series LCR resonance.'},
    ],
  },
  {
    subjectId: 'chemistry',
    sectionName: 'Sections B to E (Q17 – Q33)',
    marksSummary: '54 Marks · Short Answer, Case-Based & Long Answer',
    items: [
      {qNo: 'Q17', marks: '2', text: 'Balance SO₃²⁻ + MnO₄⁻ + H⁺ → and explain why titanium melts at a lower temperature than chromium (OR Fe²⁺ + Cr₂O₇²⁻ + H⁺).'},
      {qNo: 'Q23', marks: '3', text: 'From log k vs 1/T data (log k from −4.46 to −2.31 across 1/T = 0.00333 to 0.00294 K⁻¹), calculate activation energy E_a.'},
      {qNo: 'Q24', marks: '3', text: 'Identify name reactions and missing reagents: (I) Aldol condensation of CH₃CHO, (II) Étard reaction of toluene, (III) Wolff–Kishner reduction.'},
      {qNo: 'Q29', marks: '4', text: 'Case Study: Acidity of substituted phenols bar graph (pKa values of cresols, nitrophenols, 2,4-dinitrophenol, halophenols).'},
      {qNo: 'Q30', marks: '4', text: 'Case Study: Identification of plant carbohydrate (soluble, brick-red precipitate with Benedict’s reagent, single monosaccharide on hydrolysis).'},
      {qNo: 'Q31–Q33', marks: '15', text: 'Long Answer (3 × 5 Marks): Aldehyde/ketone identification tests; Coordination isomerism & CFT; Zn–Cu Nernst equation table & Kohlrausch NaCl extrapolation.'},
    ],
  },
  {
    subjectId: 'biology',
    sectionName: 'Sections B to E (Q17 – Q33)',
    marksSummary: '54 Marks · Short Answer, Case-Based & Long Answer',
    items: [
      {qNo: 'Q17', marks: '2', text: 'Compare geitonogamy with cross-pollination and self-pollination (OR emasculation & bagging strategy for hybrid seed production).'},
      {qNo: 'Q19', marks: '2', text: 'Evaluate tumor size, glucose level, oxygen level, and neighboring cell viability dataset.'},
      {qNo: 'Q24', marks: '3', text: 'Dihybrid cross in mice (RrBb × Rrbb): write parental genotypes, Punnett square, phenotypic ratio, and expected count out of 64 offspring.'},
      {qNo: 'Q29', marks: '4', text: 'Case Study: HPO axis hormonal fluctuations, missing LH surge, low progesterone, and irregular menstrual cycles.'},
      {qNo: 'Q30', marks: '4', text: 'Case Study: Biocontrol of cabbage looper caterpillars using species-specific Nucleopolyhedrovirus (Baculovirus) in IPM.'},
      {qNo: 'Q31–Q33', marks: '15', text: 'Long Answer (3 × 5 Marks): DNA coding strand mutations & mRNA translation; β-globin autoradiography / DNA spooling; Four biodiversity threats & composting stages.'},
    ],
  },
  {
    subjectId: 'maths',
    sectionName: 'Sections B to E (Q21 – Q38)',
    marksSummary: '60 Marks · VSA, SA, LA & Case Studies',
    items: [
      {qNo: 'Q21–Q25', marks: '10', text: 'VSA (5 × 2 Marks): ∫ 1/(x√(x⁶−1)) dx; Implicit proof y = ±1; 3D parallel lines; Vector cross-dot identity |b|; LPP feasible region constraints.'},
      {qNo: 'Q26–Q31', marks: '18', text: 'SA (6 × 3 Marks): Matrix product PQ & inverse; Drone surveillance rate of change; Parametric d²y/dx²; Linear DE xdy + (y − x²eˣ)dx = 0; Foot of perpendicular; Graphical LPP.'},
      {qNo: 'Q32–Q35', marks: '20', text: 'LA (4 × 5 Marks): Equivalence relation a²+d² = b²+c² on N×N; Definite integral ∫₋ₐᵃ √((a−x)/(a+x)) dx; Area using integration; Smartwatch false alert Bayes’ Theorem.'},
      {qNo: 'Q36–Q38', marks: '12', text: 'Case Studies (3 × 4 Marks): Skew/parallel laser lines shortest distance; Yamuna WQI quadratic optimization W(x) = 35 + 1.6x − 0.02x²; Matrix inverse fruit basket pricing.'},
    ],
  },
];

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
