import type {SubjectId} from './pcmbData';

export type PublicationStatus =
  | 'Draft'
  | 'Under Human Review'
  | 'Approved'
  | 'Published'
  | 'Archived';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'Difficult' | 'Very Difficult';

export type QuestionCategory =
  | 'CBSE Board High-Yield'
  | 'Conceptual'
  | 'Application'
  | 'NEET-style'
  | 'Numerical'
  | 'Assertion-Reason'
  | 'Multiple Statement'
  | 'Case-Based'
  | 'Diagram-Based'
  | 'Graph-Based'
  | 'Match-the-Following'
  | 'Data Interpretation'
  | 'Multi-Concept'
  | 'Subjective-to-MCQ Challenge';

export type OriginalMarkCategory = '1M' | '2M' | '3M' | '4M' | '5M';

export type ChapterStudyStatus =
  | 'Not Started'
  | 'In Progress'
  | 'Reviewed'
  | 'Completed';

export type StudyResourceTag =
  | 'High-Yield'
  | 'Important'
  | 'Additional'
  | 'Board-Oriented'
  | 'Competitive-Exam-Oriented';

export interface ApprovalRecord {
  status: PublicationStatus;
  reviewedBy: string;
  reviewerRole: string;
  reviewedAt: string;
  verificationNotes: string;
  version: string;
}

export interface SubjectiveSolution {
  concept: string;
  formulaOrPrinciple: string;
  givenData?: string;
  unitConversion?: string;
  substitutionAndWorking: string[];
  finalResult: string;
  finalUnits?: string;
  keyReason: string;
  commonMistakeToAvoid?: string;
  diagramRefId?: string;
  supplementaryNote?: string;
}

export interface VerifiedQuestion {
  id: string;
  subjectId: SubjectId;
  chapterId: string;
  chapterTitle: string;
  topic: string;
  difficulty: DifficultyLevel;
  questionType: QuestionCategory;
  originalMarkCategory: OriginalMarkCategory;
  sourceTag: 'Original Class 12 CBSE Pattern' | 'Original Concept Application' | 'Original Past-Paper Inspired Challenge';
  highYieldTag: StudyResourceTag;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  diagramRefId?: string;
  approvalStatus: 'Approved' | 'Published';
  subjectiveSolution: SubjectiveSolution;
  relatedStudySheetIds: string[];
}

export interface VerifiedMarkingSchemeEntry {
  questionId: string;
  correctIndex: 0 | 1 | 2 | 3;
  positiveMarks: number;
  negativeMarks: number;
  maxMarks: number;
  stepMarkingBreakdown: string[];
  subjectiveSolution: SubjectiveSolution;
  diagramRefId?: string;
  relatedStudySheetIds: string[];
}

export interface VerifiedMarkingScheme {
  id: string;
  paperId: string;
  subjectId: SubjectId;
  title: string;
  paperVersion: string;
  approvalStatus: PublicationStatus;
  approval: ApprovalRecord;
  entries: Record<string, VerifiedMarkingSchemeEntry>;
}

export interface VerifiedExamPaper {
  id: string;
  subjectId: SubjectId;
  title: string;
  subtitle: string;
  paperVersion: string;
  isMainSheet: true;
  publicationStatus: PublicationStatus;
  approval: ApprovalRecord;
  markingSchemeId: string | null;
  durationSeconds: number;
  positiveMarks: number;
  negativeMarks: number;
  questionIds: string[];
  instructions: string[];
  chapterIdsCovered: string[];
}

/**
 * Stripped question projection exposed to active timed OMR Exam mode.
 * Never includes correctIndex or solution explanations.
 */
export interface ActiveExamQuestionView {
  id: string;
  subjectId: SubjectId;
  chapterId: string;
  chapterTitle: string;
  topic: string;
  difficulty: DifficultyLevel;
  questionType: QuestionCategory;
  originalMarkCategory: OriginalMarkCategory;
  prompt: string;
  options: [string, string, string, string];
  diagramRefId?: string;
}

export interface PracticeSheetQuestionSnapshot {
  questionId: string;
  questionNumber: number;
  subjectId: SubjectId;
  chapterId: string;
  chapterTitle: string;
  topic: string;
  difficulty: DifficultyLevel;
  questionType: QuestionCategory;
  originalMarkCategory: OriginalMarkCategory;
  prompt: string;
  options: [string, string, string, string];
  diagramRefId?: string;
  studentSelectedIndex: number | null;
  markedForReview: boolean;
}

export interface PracticeSheetSnapshot {
  snapshotId: string;
  attemptId: string;
  studentProfileId: string;
  paperId: string;
  paperTitle: string;
  paperVersion: string;
  markingSchemeId: string;
  subjectId: SubjectId;
  positiveMarks: number;
  negativeMarks: number;
  maxMarks: number;
  createdAt: string;
  isImmutableFromMainSheet: true;
  questions: PracticeSheetQuestionSnapshot[];
}

export interface QuestionResultBreakdown {
  questionId: string;
  questionNumber: number;
  chapterId: string;
  chapterTitle: string;
  topic: string;
  difficulty: DifficultyLevel;
  questionType: QuestionCategory;
  originalMarkCategory: OriginalMarkCategory;
  prompt: string;
  options: [string, string, string, string];
  selectedIndex: number | null;
  correctIndex: 0 | 1 | 2 | 3;
  outcome: 'correct' | 'incorrect' | 'unanswered';
  marksAwarded: number;
  maxMarks: number;
  diagramRefId?: string;
  subjectiveSolution: SubjectiveSolution;
  relatedStudySheetIds: string[];
}

export interface CategoryPerformanceStat {
  label: string;
  total: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  accuracyPercent: number;
}

export interface ExamAttemptRecord {
  attemptId: string;
  studentProfileId: string;
  studentName: string;
  subjectId: SubjectId;
  paperId: string;
  paperTitle: string;
  paperVersion: string;
  markingSchemeId: string;
  submittedAt: string;
  timeTakenSeconds: number;
  totalDurationSeconds: number;
  totalScore: number;
  maxMarks: number;
  positiveMarksEarned: number;
  negativeMarksDeducted: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  accuracyPercent: number;
  positiveRule: number;
  negativeRule: number;
  practiceSheet: PracticeSheetSnapshot;
  questionResults: QuestionResultBreakdown[];
  chapterBreakdown: CategoryPerformanceStat[];
  difficultyBreakdown: CategoryPerformanceStat[];
  relatedChapterIds: string[];
  relatedDiagramIds: string[];
  relatedStudySheetIds: string[];
}

export interface StudentProfile {
  id: string;
  name: string;
  createdAt: string;
}

export interface PracticeQuestionAttempt {
  questionId: string;
  subjectId: SubjectId;
  chapterId: string;
  selectedIndex: number;
  isCorrect: boolean;
  attemptedAt: string;
}

export interface ActiveOmrDraft {
  attemptId: string;
  studentProfileId: string;
  paperId: string;
  paperVersion: string;
  answers: Record<string, number>;
  markedForReview: Record<string, boolean>;
  currentIndex: number;
  secondsLeft: number;
  startedAt: string;
  updatedAt: string;
  isSubmitted: boolean;
}

/* ==================== Study Library Schemas (Parts 10–13) ==================== */

export interface PhysicsFormulaItem {
  id: string;
  chapterId: string;
  title: string;
  equation: string;
  symbols: {symbol: string; meaning: string; siUnit: string}[];
  applicability: string;
  shortExplanation: string;
  relatedFormulas: string[];
  workedExample: string;
  commonMistakes: string[];
  prerequisiteNote?: string;
  supplementaryNote?: string;
  tags: StudyResourceTag[];
  diagramRefId?: string;
  relatedQuestionIds: string[];
  challengeQuestionIds: string[];
}

export interface PhysicsDerivationItem {
  id: string;
  chapterId: string;
  title: string;
  conceptObjective: string;
  diagramDescription: string;
  diagramRefId?: string;
  assumptionsAndConditions: string[];
  givenSetup: string;
  physicalPrinciplesUsed: string[];
  stepByStepSteps: string[];
  intermediateResults: string[];
  finalFormulaWithUnits: string;
  specialCases: string[];
  physicalMeaningAndGraph: string;
  typicalBoardMarks: string;
  commonMistakes: string[];
  supplementaryNote?: string;
  tags: StudyResourceTag[];
  relatedQuestionIds: string[];
  challengeQuestionIds: string[];
}

export interface ChemistryStudyItem {
  id: string;
  chapterId: string;
  kind: 'physical-formula' | 'organic-reaction' | 'inorganic-reference' | 'biomolecule-reference';
  title: string;
  equationOrReaction: string;
  reagentsOrSymbols: string[];
  conditionsOrUnits: string;
  mechanismOrSteps: string[];
  productOrOutcome: string;
  exceptionsOrTrends: string[];
  workedExample: string;
  commonMistakes: string[];
  tags: StudyResourceTag[];
  diagramRefId?: string;
  relatedQuestionIds: string[];
  challengeQuestionIds: string[];
}

export interface BiologyStudyItem {
  id: string;
  chapterId: string;
  kind:
    | 'diagram-sheet'
    | 'process-sheet'
    | 'genetics-sheet'
    | 'quantitative-biology'
    | 'ncert-high-yield';
  title: string;
  coreStatementOrLaw: string;
  structuredStepsOrLabels: string[];
  quantitativeFormulaOrCross?: string;
  workedExample?: string;
  importantComparisonsOrExceptions: string[];
  commonMistakes: string[];
  tags: StudyResourceTag[];
  diagramRefId?: string;
  relatedQuestionIds: string[];
  challengeQuestionIds: string[];
}

export interface MathsFormulaItem {
  id: string;
  chapterId: string;
  title: string;
  expression: string;
  domainAndConditions: string;
  variablesMeaning: string;
  workedExample: string;
  commonMistakes: string[];
  tags: StudyResourceTag[];
  diagramRefId?: string;
  relatedQuestionIds: string[];
  challengeQuestionIds: string[];
}

export interface MathsMethodItem {
  id: string;
  chapterId: string;
  questionTypeTitle: string;
  standardForm: string;
  whenToRecognize: string;
  stepByStepMethod: string[];
  keySubstitutionsOrFormulas: string[];
  edgeCasesAndConditions: string[];
  solvedExample: string;
  verificationTips: string;
  commonMistakes: string[];
  tags: StudyResourceTag[];
  diagramRefId?: string;
  relatedQuestionIds: string[];
  challengeQuestionIds: string[];
}

export type ChapterDerivationItem = PhysicsDerivationItem;

export interface ChapterStudyBundle {
  subjectId: SubjectId;
  chapterId: string;
  chapterNumber: string;
  chapterTitle: string;
  unit: string;
  summary: string;
  diagramIds: string[];
  physicsFormulas?: PhysicsFormulaItem[];
  physicsDerivations?: PhysicsDerivationItem[];
  chemistryItems?: ChemistryStudyItem[];
  chemistryDerivations?: ChapterDerivationItem[];
  biologyItems?: BiologyStudyItem[];
  mathsFormulas?: MathsFormulaItem[];
  mathsDerivations?: ChapterDerivationItem[];
  mathsMethods?: MathsMethodItem[];
  supplementaryItems?: string[];
}
