import type {SubjectId} from '../pcmbData';
import type {
  DifficultyLevel,
  OriginalMarkCategory,
  QuestionCategory,
  StudyResourceTag,
  VerifiedQuestion,
} from '../v3Types';

export interface CompactQuestionInput {
  id: string;
  subjectId: SubjectId;
  chapterId: string;
  chapterTitle: string;
  topic: string;
  difficulty: DifficultyLevel;
  questionType: QuestionCategory;
  originalMarkCategory: OriginalMarkCategory;
  highYieldTag?: StudyResourceTag;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  diagramRefId?: string;
  concept: string;
  formula: string;
  given?: string;
  unitConv?: string;
  steps: string[];
  finalResult: string;
  finalUnits?: string;
  keyReason: string;
  mistake?: string;
  studyIds?: string[];
}

export function makeQ(input: CompactQuestionInput): VerifiedQuestion {
  return {
    id: input.id,
    subjectId: input.subjectId,
    chapterId: input.chapterId,
    chapterTitle: input.chapterTitle,
    topic: input.topic,
    difficulty: input.difficulty,
    questionType: input.questionType,
    originalMarkCategory: input.originalMarkCategory,
    sourceTag:
      input.questionType === 'Subjective-to-MCQ Challenge'
        ? 'Original Past-Paper Inspired Challenge'
        : input.questionType === 'CBSE Board High-Yield'
          ? 'Original Class 12 CBSE Pattern'
          : 'Original Concept Application',
    highYieldTag: input.highYieldTag ?? 'High-Yield',
    prompt: input.prompt,
    options: input.options,
    correctIndex: input.correctIndex,
    diagramRefId: input.diagramRefId,
    approvalStatus: 'Published',
    relatedStudySheetIds: input.studyIds ?? [],
    subjectiveSolution: {
      concept: input.concept,
      formulaOrPrinciple: input.formula,
      givenData: input.given,
      unitConversion: input.unitConv,
      substitutionAndWorking: input.steps,
      finalResult: input.finalResult,
      finalUnits: input.finalUnits,
      keyReason: input.keyReason,
      commonMistakeToAvoid: input.mistake,
      diagramRefId: input.diagramRefId,
    },
  };
}
