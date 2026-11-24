export interface StepMarkSplit {
  label: string;
  marks: number;
}

export interface MarkingSchemeEntry {
  questionId: string;
  section: string;
  maxMarks: number;
  exactModelAnswer: string;
  stepMarks: StepMarkSplit[];
  finalAnswerValue?: string;
  diagramSvg?: string;
  examinerCheckpoints: string[];
}

export type SubjectMarkingSchemeMap = Record<string, MarkingSchemeEntry>;
