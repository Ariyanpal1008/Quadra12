import type {SubjectId} from '../pcmbData';
import type {ChapterStudyBundle, StudyResourceTag} from '../v3Types';
import {PHYSICS_STUDY_LIBRARY} from './physicsStudyLibrary';
import {CHEMISTRY_STUDY_LIBRARY} from './chemistryStudyLibrary';
import {BIOLOGY_STUDY_LIBRARY} from './biologyStudyLibrary';
import {MATHS_STUDY_LIBRARY} from './mathsStudyLibrary';

export const ALL_STUDY_BUNDLES: ChapterStudyBundle[] = [
  ...PHYSICS_STUDY_LIBRARY,
  ...CHEMISTRY_STUDY_LIBRARY,
  ...BIOLOGY_STUDY_LIBRARY,
  ...MATHS_STUDY_LIBRARY,
];

export function getStudyLibraryBySubject(subjectId: SubjectId): ChapterStudyBundle[] {
  return ALL_STUDY_BUNDLES.filter((bundle) => bundle.subjectId === subjectId);
}

export function getChapterStudyBundle(chapterId: string): ChapterStudyBundle | undefined {
  return ALL_STUDY_BUNDLES.find((bundle) => bundle.chapterId === chapterId);
}

export interface FlattenedStudyItem {
  id: string;
  subjectId: SubjectId;
  chapterId: string;
  chapterTitle: string;
  kindLabel: string;
  title: string;
  tags: StudyResourceTag[];
  diagramRefId?: string;
}

export function listAllStudyItemsForSubject(subjectId: SubjectId): FlattenedStudyItem[] {
  const bundles = getStudyLibraryBySubject(subjectId);
  const items: FlattenedStudyItem[] = [];
  for (const b of bundles) {
    for (const pf of b.physicsFormulas ?? []) {
      items.push({
        id: pf.id,
        subjectId,
        chapterId: b.chapterId,
        chapterTitle: b.chapterTitle,
        kindLabel: 'Formula Sheet',
        title: pf.title,
        tags: pf.tags,
        diagramRefId: pf.diagramRefId,
      });
    }
    for (const pd of b.physicsDerivations ?? []) {
      items.push({
        id: pd.id,
        subjectId,
        chapterId: b.chapterId,
        chapterTitle: b.chapterTitle,
        kindLabel: 'Derivation Sheet',
        title: pd.title,
        tags: pd.tags,
        diagramRefId: pd.diagramRefId,
      });
    }
    for (const ci of b.chemistryItems ?? []) {
      items.push({
        id: ci.id,
        subjectId,
        chapterId: b.chapterId,
        chapterTitle: b.chapterTitle,
        kindLabel:
          ci.kind === 'physical-formula'
            ? 'Physical Formula'
            : ci.kind === 'organic-reaction'
              ? 'Organic Reaction'
              : ci.kind === 'inorganic-reference'
                ? 'Inorganic Quick Ref'
                : 'Biomolecules Ref',
        title: ci.title,
        tags: ci.tags,
        diagramRefId: ci.diagramRefId,
      });
    }
    for (const bi of b.biologyItems ?? []) {
      items.push({
        id: bi.id,
        subjectId,
        chapterId: b.chapterId,
        chapterTitle: b.chapterTitle,
        kindLabel:
          bi.kind === 'diagram-sheet'
            ? 'Diagram Sheet'
            : bi.kind === 'process-sheet'
              ? 'Process Sheet'
              : bi.kind === 'genetics-sheet'
                ? 'Genetics Sheet'
                : bi.kind === 'quantitative-biology'
                  ? 'Quantitative Biology'
                  : 'NCERT High-Yield',
        title: bi.title,
        tags: bi.tags,
        diagramRefId: bi.diagramRefId,
      });
    }
    for (const mf of b.mathsFormulas ?? []) {
      items.push({
        id: mf.id,
        subjectId,
        chapterId: b.chapterId,
        chapterTitle: b.chapterTitle,
        kindLabel: 'Maths Formula',
        title: mf.title,
        tags: mf.tags,
        diagramRefId: mf.diagramRefId,
      });
    }
    for (const mm of b.mathsMethods ?? []) {
      items.push({
        id: mm.id,
        subjectId,
        chapterId: b.chapterId,
        chapterTitle: b.chapterTitle,
        kindLabel: 'Method Sheet',
        title: mm.questionTypeTitle,
        tags: mm.tags,
        diagramRefId: mm.diagramRefId,
      });
    }
  }
  return items;
}

export {
  PHYSICS_STUDY_LIBRARY,
  CHEMISTRY_STUDY_LIBRARY,
  BIOLOGY_STUDY_LIBRARY,
  MATHS_STUDY_LIBRARY,
};
