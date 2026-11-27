import type {VerifiedQuestion} from '../v3Types';
import {PHYSICS_QUESTIONS_PART_1} from './physicsQuestionsPart1';
import {PHYSICS_QUESTIONS_PART_2} from './physicsQuestionsPart2';

export const PHYSICS_QUESTIONS: VerifiedQuestion[] = [
  ...PHYSICS_QUESTIONS_PART_1,
  ...PHYSICS_QUESTIONS_PART_2,
];
