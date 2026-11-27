import type {VerifiedQuestion} from '../v3Types';
import {CHEMISTRY_QUESTIONS_PART_1} from './chemistryQuestionsPart1';
import {CHEMISTRY_QUESTIONS_PART_2} from './chemistryQuestionsPart2';

export const CHEMISTRY_QUESTIONS: VerifiedQuestion[] = [
  ...CHEMISTRY_QUESTIONS_PART_1,
  ...CHEMISTRY_QUESTIONS_PART_2,
];
