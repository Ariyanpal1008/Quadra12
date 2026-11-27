import type {VerifiedQuestion} from '../v3Types';
import {MATHS_QUESTIONS_PART_1} from './mathsQuestionsPart1';
import {MATHS_QUESTIONS_PART_2} from './mathsQuestionsPart2';

export const MATHS_QUESTIONS: VerifiedQuestion[] = [
  ...MATHS_QUESTIONS_PART_1,
  ...MATHS_QUESTIONS_PART_2,
];
