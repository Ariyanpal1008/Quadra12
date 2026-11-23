import type {SubjectId} from '../pcmbData';
import type {SubjectMarkingSchemeMap} from './types';

/**
 * Dynamically imports ONLY the active subject's marking scheme when a student
 * launches or resumes that paper — keeping the other 3 subjects out of memory
 * and keeping all marking keys concealed from the student until post-submission.
 */
export async function loadSubjectMarkingScheme(
  subjectId: SubjectId,
): Promise<SubjectMarkingSchemeMap> {
  switch (subjectId) {
    case 'physics': {
      const mod = await import('./physicsMarkingScheme');
      return mod.PHYSICS_MARKING_SCHEME;
    }
    case 'chemistry': {
      const mod = await import('./chemistryMarkingScheme');
      return mod.CHEMISTRY_MARKING_SCHEME;
    }
    case 'biology': {
      const mod = await import('./biologyMarkingScheme');
      return mod.BIOLOGY_MARKING_SCHEME;
    }
    case 'maths': {
      const mod = await import('./mathsMarkingScheme');
      return mod.MATHS_MARKING_SCHEME;
    }
  }
}
