import type {VerifiedQuestion} from '../v3Types';
import {BIOLOGY_QUESTIONS_PART_1} from './biologyQuestionsPart1';
import {BIOLOGY_QUESTIONS_PART_2} from './biologyQuestionsPart2';

export const BIOLOGY_QUESTIONS: VerifiedQuestion[] = [
  ...BIOLOGY_QUESTIONS_PART_1,
  ...BIOLOGY_QUESTIONS_PART_2,
];
