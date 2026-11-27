import type {SubjectId} from '../pcmbData';
import type {VerifiedQuestion} from '../v3Types';
import {PHYSICS_QUESTIONS} from './physicsQuestions';
import {CHEMISTRY_QUESTIONS} from './chemistryQuestions';
import {BIOLOGY_QUESTIONS} from './biologyQuestions';
import {MATHS_QUESTIONS} from './mathsQuestions';

export {
  PHYSICS_QUESTIONS,
  CHEMISTRY_QUESTIONS,
  BIOLOGY_QUESTIONS,
  MATHS_QUESTIONS,
};

export const ALL_VERIFIED_QUESTIONS: VerifiedQuestion[] = [
  ...PHYSICS_QUESTIONS,
  ...CHEMISTRY_QUESTIONS,
  ...BIOLOGY_QUESTIONS,
  ...MATHS_QUESTIONS,
];

const QUESTION_MAP = new Map<string, VerifiedQuestion>(
  ALL_VERIFIED_QUESTIONS.map((q) => [q.id, q]),
);

export function getQuestionsBySubject(subjectId: SubjectId): VerifiedQuestion[] {
  return ALL_VERIFIED_QUESTIONS.filter((q) => q.subjectId === subjectId);
}

export function getVerifiedQuestionById(id: string): VerifiedQuestion | undefined {
  return QUESTION_MAP.get(id);
}

export function getQuestionsForChapter(
  subjectId: SubjectId,
  chapterId: string,
): VerifiedQuestion[] {
  return ALL_VERIFIED_QUESTIONS.filter(
    (q) => q.subjectId === subjectId && q.chapterId === chapterId,
  );
}
