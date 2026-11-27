import {getDiagramMetadata} from '../data/v3Diagrams';

interface ExamDiagramProps {
  diagramId?: string;
  svg?: string;
  caption?: string;
  alt?: string;
}

export function ExamDiagram({diagramId, svg, caption, alt}: ExamDiagramProps) {
  const meta = diagramId ? getDiagramMetadata(diagramId) : null;
  const resolvedSvg = svg ?? meta?.svg;
  if (!resolvedSvg) return null;

  const resolvedCaption = caption ?? meta?.caption;
  const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(resolvedSvg)}`;
  const accessibleLabel =
    alt ?? resolvedCaption ?? (diagramId ? `Exam figure ${diagramId}` : 'Scientific reference diagram');

  return (
    <figure className="my-3 p-3 bg-[#FAF8F3] border border-[#DDD6C7] rounded-lg inline-block max-w-full print-avoid-break">
      <img
        src={dataUri}
        alt={accessibleLabel}
        className="w-full max-w-[440px] h-auto block mx-auto rounded-sm bg-white"
      />
      {resolvedCaption && (
        <figcaption className="mt-2 pt-1.5 border-t border-[#E5DFD2] text-[11px] font-sans font-medium text-[#575048] text-center">
          {resolvedCaption}
        </figcaption>
      )}
    </figure>
  );
}
