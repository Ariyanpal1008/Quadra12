import {useEffect, useMemo, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {CheckCircle2, Download, FileText, Loader2, Printer, X} from 'lucide-react';
import {
  EXAM_QUESTIONS,
  SUBJECTIVE_QUESTIONS,
  SUBJECTS,
  type ExamQuestion,
  type SubjectId,
  type SubjectiveExamQuestion,
} from '../data/pcmbData';
import {loadSubjectMarkingScheme} from '../data/markingSchemes/loadMarkingScheme';
import type {SubjectMarkingSchemeMap} from '../data/markingSchemes/types';
import {exportElementToA4Pdf} from '../utils/pdfExporter';
import {ExamDiagram} from './ExamDiagrams';

interface ExamPdfModalProps {
  subjectId: SubjectId;
  mode: 'question_paper' | 'marking_scheme';
  isOpen: boolean;
  canViewMarkingScheme?: boolean;
  onClose: () => void;
  onSwitchMode?: (newMode: 'question_paper' | 'marking_scheme') => void;
}

export function ExamPdfModal({
  subjectId,
  mode,
  isOpen,
  canViewMarkingScheme = true,
  onClose,
  onSwitchMode,
}: ExamPdfModalProps) {
  const [markingScheme, setMarkingScheme] = useState<SubjectMarkingSchemeMap | null>(null);
  const [isLoadingScheme, setIsLoadingScheme] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfFeedback, setPdfFeedback] = useState<string | null>(null);
  const printableDocRef = useRef<HTMLDivElement>(null);

  const effectiveMode =
    !canViewMarkingScheme && mode === 'marking_scheme' ? 'question_paper' : mode;

  // Sync body class for @media print scoping
  useEffect(() => {
    if (!isOpen) return;
    document.body.classList.add('exam-pdf-modal-open');
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.classList.remove('exam-pdf-modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Load marking scheme if in marking_scheme mode
  useEffect(() => {
    if (!isOpen || effectiveMode !== 'marking_scheme') return;
    let active = true;
    setIsLoadingScheme(true);
    loadSubjectMarkingScheme(subjectId)
      .then((scheme) => {
        if (active) {
          setMarkingScheme(scheme);
          setIsLoadingScheme(false);
        }
      })
      .catch(() => {
        if (active) setIsLoadingScheme(false);
      });
    return () => {
      active = false;
    };
  }, [isOpen, mode, subjectId]);

  const subject = useMemo(() => {
    return SUBJECTS.find((s) => s.id === subjectId) ?? SUBJECTS[0];
  }, [subjectId]);

  const sectionAQuestions: ExamQuestion[] = useMemo(() => {
    return EXAM_QUESTIONS.filter((q) => q.subjectId === subjectId).sort(
      (a, b) => a.questionNumber - b.questionNumber,
    );
  }, [subjectId]);

  const subjectiveQuestions: SubjectiveExamQuestion[] = useMemo(() => {
    return SUBJECTIVE_QUESTIONS.filter((q) => q.subjectId === subjectId).sort(
      (a, b) => a.questionNumber - b.questionNumber,
    );
  }, [subjectId]);

  const totalQuestions = sectionAQuestions.length + subjectiveQuestions.length;

  const sectionRanges = useMemo(() => {
    return (['B', 'C', 'D', 'E'] as const)
      .map((code) => {
        const items = subjectiveQuestions.filter((q) => q.sectionCode === code);
        if (items.length === 0) return null;
        const first = items[0].questionNumber;
        const last = items[items.length - 1].questionNumber;
        const marks = items[0].marks;
        const desc =
          code === 'B'
            ? 'Very Short Answer questions'
            : code === 'C'
              ? 'Short Answer questions'
              : code === 'D'
                ? 'Case-Based questions'
                : 'Long Answer questions';
        return {code, first, last, count: items.length, marks, desc};
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [subjectiveQuestions]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      id="exam-pdf-modal-portal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex flex-col items-center justify-start p-3 sm:p-6 print:p-0 print:bg-white print:static print:inset-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exam-pdf-modal-title"
    >
      {/* Top Floating Control Bar (Hidden on print) */}
      <div className="w-full max-w-4xl bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl px-4 sm:px-6 py-3.5 mb-4 shadow-xl flex flex-wrap items-center justify-between gap-3 sticky top-2 z-10 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#A64B33]/10 dark:bg-[#D4785E]/15 flex items-center justify-center text-[#A64B33] dark:text-[#D4785E]">
            {effectiveMode === 'question_paper' ? (
              <FileText className="w-4 h-4" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#3D6B4F] dark:text-[#7AB88F]" />
            )}
          </div>
          <div>
            <h2 id="exam-pdf-modal-title" className="text-sm sm:text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
              {subject.name} (Code {subject.code}) —{' '}
              {effectiveMode === 'question_paper' ? 'Question Paper PDF' : 'Marking Scheme PDF'}
            </h2>
            <p className="text-[11px] text-[#787066] dark:text-[#9C9387]">
              100% Synced to 3-Hour Exam Dataset · {totalQuestions} Questions · {subject.boardTheoryMarks} Marks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode switch pills if student is allowed to switch */}
          {canViewMarkingScheme && onSwitchMode && (
            <div className="inline-flex rounded-lg p-0.5 bg-[#F5F2EB] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] text-xs">
              <button
                type="button"
                onClick={() => onSwitchMode('question_paper')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  effectiveMode === 'question_paper'
                    ? 'bg-[#1E1B18] text-[#F5F2EB] dark:bg-[#F5F2EB] dark:text-[#1E1B18] shadow-xs'
                    : 'text-[#575048] dark:text-[#CBC3B6] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB]'
                }`}
              >
                Question Paper
              </button>
              <button
                type="button"
                onClick={() => onSwitchMode('marking_scheme')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  effectiveMode === 'marking_scheme'
                    ? 'bg-[#1E1B18] text-[#F5F2EB] dark:bg-[#F5F2EB] dark:text-[#1E1B18] shadow-xs'
                    : 'text-[#575048] dark:text-[#CBC3B6] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB]'
                }`}
              >
                Marking Scheme
              </button>
            </div>
          )}

          <button
            type="button"
            disabled={isExportingPdf || (effectiveMode === 'marking_scheme' && isLoadingScheme)}
            onClick={async () => {
              if (!printableDocRef.current || isExportingPdf) return;
              setIsExportingPdf(true);
              setPdfFeedback(null);
              const docLabel =
                effectiveMode === 'question_paper' ? 'Question-Paper' : 'Marking-Scheme';
              const safeSubject = subject.name.replace(/[^A-Za-z0-9]+/g, '-');
              const filename = `Quadra12-${safeSubject}-${subject.code}-${docLabel}.pdf`;
              try {
                const res = await exportElementToA4Pdf(printableDocRef.current, {
                  filename,
                  documentTitle: `Quadra 12 · ${subject.name} (${subject.code}) · ${
                    effectiveMode === 'question_paper' ? 'Question Paper' : 'Marking Scheme'
                  }`,
                });
                setPdfFeedback(`Saved ${res.filename} (${res.pageCount} A4 pages)`);
                window.setTimeout(() => setPdfFeedback(null), 5000);
              } catch {
                // Fallback to system print if PDF canvas export encounters a browser block
                window.print();
              } finally {
                setIsExportingPdf(false);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#3D6B4F] hover:bg-[#315940] disabled:opacity-60 text-white shadow-xs transition-colors"
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            title="Open browser print dialog"
            aria-label="Open browser print dialog"
            className="hidden sm:inline-flex items-center justify-center p-1.5 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[#575048] dark:text-[#CBC3B6] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB] transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#575048] dark:text-[#CBC3B6] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB] rounded-lg hover:bg-[#E5DFD2] dark:hover:bg-[#332E28] transition-colors"
            aria-label="Close PDF Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {pdfFeedback && (
          <div className="w-full pt-2 mt-1 border-t border-[#DDD6C7]/70 dark:border-[#332E28] text-[11px] font-medium text-[#3D6B4F] dark:text-[#7AB88F] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{pdfFeedback}</span>
          </div>
        )}
      </div>

      {/* Main Printable A4 Paper Document */}
      <div
        id="printable-exam-document"
        ref={printableDocRef}
        className="w-full max-w-4xl bg-white text-[#111827] shadow-2xl rounded-xl p-6 sm:p-12 font-serif text-[13px] leading-relaxed border border-[#DDD6C7] print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:w-full print:rounded-none"
      >
        {/* ========================================================
            1. OFFICIAL CBSE BOARD QUESTION PAPER VIEW
        ======================================================== */}
        {effectiveMode === 'question_paper' ? (
          <div className="space-y-6">
            {/* Top Serial & Roll Number Boxes */}
            <div data-pdf-block className="flex justify-between items-start text-[11px] font-sans pb-3 border-b-2 border-black">
              <div>
                <p className="font-semibold">Series: Q12-2027</p>
                <p className="text-[10px] text-gray-700">Set No. 1 · Blueprint Edition</p>
              </div>
              <div className="text-center font-bold">
                <span className="px-2 py-0.5 border border-black rounded text-xs">
                  Code No. {subject.code}/1
                </span>
              </div>
              <div className="border border-black px-3 py-1 text-right">
                <span className="text-[10px] text-gray-600 block">Roll No.</span>
                <span className="font-mono tracking-widest">[ _ _ _ _ _ _ _ ]</span>
              </div>
            </div>

            {/* Main Board Title Header */}
            <div data-pdf-block className="text-center space-y-1 py-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-wide uppercase font-serif">
                Central Board of Secondary Education
              </h1>
              <p className="text-xs uppercase tracking-wider font-semibold text-gray-800">
                Senior School Certificate Examination 2026–27 (Practice Mock)
              </p>
              <h2 className="text-base sm:text-lg font-bold uppercase underline underline-offset-4 pt-1">
                {subject.name} (Theory)
              </h2>
              <p className="text-xs font-semibold text-gray-700">
                Subject Code: {subject.code}
              </p>

              <div className="flex justify-between items-center text-xs font-bold pt-3 px-2 border-t border-b border-black mt-2">
                <span>Time Allowed: 3 Hours (+15 Mins Reading)</span>
                <span>Maximum Marks: {subject.boardTheoryMarks}</span>
              </div>
            </div>

            {/* General Instructions Box */}
            <div data-pdf-block className="p-3.5 border border-gray-400 bg-gray-50/50 text-[11.5px] leading-normal font-sans space-y-1">
              <p className="font-bold underline uppercase tracking-wide">General Instructions:</p>
              <ol className="list-decimal list-inside space-y-0.5 text-gray-800">
                <li>
                  <strong>15-Minute Reading Time:</strong> Candidates are allotted 15 minutes of cool-off / reading time. No writing is permitted during this interval.
                </li>
                <li>
                  This question paper contains <strong>{totalQuestions} questions</strong> in <strong>5 Sections</strong>: A, B, C, D, and E. All questions are compulsory.
                </li>
                <li>
                  <strong>Section A:</strong> Questions 1 to {sectionAQuestions.length} are Multiple Choice and Assertion-Reason questions carrying <strong>1 mark</strong> each.
                </li>
                {sectionRanges.map((sec) => (
                  <li key={sec.code}>
                    <strong>Section {sec.code}:</strong> Questions {sec.first} to {sec.last} are {sec.desc} carrying <strong>{sec.marks} marks</strong> each.
                  </li>
                ))}
                <li>
                  There is no overall choice. However, internal choices have been provided in certain questions.
                </li>
                <li>
                  Use of calculators, log tables, and electronic devices is strictly prohibited.
                </li>
              </ol>
            </div>

            {/* SECTION A */}
            <div className="pt-4 space-y-5">
              <div data-pdf-block className="text-center pb-2 border-b-2 border-black">
                <h3 className="font-bold text-sm tracking-wide uppercase">
                  Section A ({sectionAQuestions.length} Marks)
                </h3>
                <p className="text-[11px] font-sans text-gray-700">
                  Questions 1 to {sectionAQuestions.length} carry 1 mark each. Select the correct option.
                </p>
              </div>

              <div className="space-y-4">
                {sectionAQuestions.map((q) => (
                  <div key={q.id} data-pdf-block className="print-avoid-break space-y-1.5 pb-3 border-b border-gray-200">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2 flex-1">
                        <span className="font-bold text-sm font-sans shrink-0">{q.questionNumber}.</span>
                        <div className="space-y-1 flex-1">
                          <p className="text-[13px] leading-relaxed text-black font-serif whitespace-pre-line">
                            {q.prompt}
                          </p>
                          <span className="inline-block text-[10px] font-sans font-medium text-[#7A3528] bg-[#FBF0ED] border border-[#E5B8AC] px-2 py-0.5 rounded print:border-gray-300 print:bg-transparent">
                            {q.boardFrequency.count} (Board Trend: {q.boardFrequency.years.join(', ')})
                          </span>
                        </div>
                      </div>
                      <span className="font-sans font-bold text-xs text-gray-800 shrink-0">[1]</span>
                    </div>

                    {(q.diagramId || q.questionDiagramSvg) && (
                      <div className="pl-6 py-1 exam-pdf-diagram-wrap">
                        <ExamDiagram diagramId={q.diagramId} svg={q.questionDiagramSvg} />
                      </div>
                    )}

                    {/* 4 Options Grid */}
                    <div className="pl-6 grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-xs font-sans text-gray-900">
                      {q.options.map((opt, oIdx) => {
                        const letter = String.fromCharCode(65 + oIdx);
                        return (
                          <div key={letter} className="flex items-start gap-2">
                            <span className="font-bold shrink-0">({letter})</span>
                            <span className="leading-snug">{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTIONS B, C, D, E */}
            {(['B', 'C', 'D', 'E'] as const).map((secCode) => {
              const secQuestions = subjectiveQuestions.filter((q) => q.sectionCode === secCode);
              if (secQuestions.length === 0) return null;

              const totalSecMarks = secQuestions.reduce((sum, q) => sum + q.marks, 0);

              return (
                <div key={secCode} className="pt-5 space-y-4 print-page-break">
                  <div data-pdf-block data-pdf-page-break="true" className="text-center pb-2 border-b-2 border-black">
                    <h3 className="font-bold text-sm tracking-wide uppercase">
                      Section {secCode} ({totalSecMarks} Marks)
                    </h3>
                    <p className="text-[11px] font-sans text-gray-700">
                      {secCode === 'B' && 'Questions carry 2 marks each. Very Short Answer (VSA).'}
                      {secCode === 'C' && 'Questions carry 3 marks each. Short Answer (SA).'}
                      {secCode === 'D' && 'Case-Based Questions carrying 4 marks each.'}
                      {secCode === 'E' && 'Long Answer questions carrying 5 marks each.'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {secQuestions.map((q) => (
                      <div key={q.id} data-pdf-block className="print-avoid-break space-y-2 pb-3 border-b border-gray-200">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2 flex-1">
                            <span className="font-bold text-sm font-sans shrink-0">{q.questionNumber}.</span>
                            <div className="space-y-1.5 flex-1">
                              {q.caseContext && (
                                <div className="p-2.5 border-l-2 border-gray-700 bg-gray-50 text-[12px] text-gray-900 font-serif leading-relaxed print:bg-transparent">
                                  <span className="block text-[10px] font-sans font-bold uppercase tracking-wider text-gray-700 mb-0.5">
                                    Case Study Passage
                                  </span>
                                  {q.caseContext}
                                </div>
                              )}
                              <p className="text-[13px] leading-relaxed text-black font-serif whitespace-pre-line">
                                {q.prompt}
                              </p>
                              {q.orPrompt && (
                                <div className="mt-1.5 pt-1.5 border-t border-dashed border-gray-300 space-y-1">
                                  <span className="inline-block text-[10px] font-sans font-bold tracking-widest uppercase text-gray-800">
                                    OR
                                  </span>
                                  <p className="text-[13px] leading-relaxed text-black font-serif whitespace-pre-line">
                                    {q.orPrompt}
                                  </p>
                                </div>
                              )}
                              {(q.diagramId || q.questionDiagramSvg) && (
                                <div className="py-1 exam-pdf-diagram-wrap">
                                  <ExamDiagram diagramId={q.diagramId} svg={q.questionDiagramSvg} />
                                </div>
                              )}
                              <span className="inline-block text-[10px] font-sans font-medium text-[#7A3528] bg-[#FBF0ED] border border-[#E5B8AC] px-2 py-0.5 rounded print:border-gray-300 print:bg-transparent">
                                {q.boardFrequency.count} (Board Trend: {q.boardFrequency.years.join(', ')})
                              </span>
                            </div>
                          </div>
                          <span className="font-sans font-bold text-xs text-gray-800 shrink-0">[{q.marks}]</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Document End Marker */}
            <div data-pdf-block className="pt-6 text-center text-xs font-bold tracking-widest uppercase font-sans border-t border-black">
              *** END OF QUESTION PAPER · QUADRA 12 ORIGINAL BLUEPRINT ***
            </div>
          </div>
        ) : (
          /* ========================================================
              2. OFFICIAL CBSE MARKING SCHEME & STEP SOLUTIONS VIEW
          ======================================================== */
          <div className="space-y-6">
            {/* Header */}
            <div data-pdf-block className="text-center space-y-1 py-2 border-b-2 border-black pb-3">
              <h1 className="text-lg sm:text-xl font-bold tracking-wide uppercase font-serif">
                Central Board of Secondary Education
              </h1>
              <p className="text-xs uppercase tracking-wider font-semibold text-gray-800">
                Senior School Certificate Examination 2026–27
              </p>
              <h2 className="text-base sm:text-lg font-bold uppercase underline underline-offset-4 pt-1">
                Marking Scheme &amp; Step-Wise Model Solutions
              </h2>
              <p className="text-xs font-semibold text-gray-700">
                {subject.name} (Code: {subject.code}) · Theory (Max Marks: {subject.boardTheoryMarks})
              </p>
            </div>

            {/* Examiner Guidance Notice */}
            <div data-pdf-block className="p-3 border border-emerald-300 bg-emerald-50/50 text-[11.5px] font-sans space-y-1 text-emerald-950">
              <p className="font-bold uppercase tracking-wider">Instructions for Examiners:</p>
              <p className="leading-relaxed">
                The marking scheme provides step-wise marks distribution. Award full credit for every valid intermediate formula, scientific reasoning, derivation steps, labeled diagram, and final answer with correct SI units. Do not penalize if arithmetic slips in a later step if foundational principles are accurate.
              </p>
            </div>

            {isLoadingScheme ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 font-sans text-xs text-gray-600">
                <Loader2 className="w-6 h-6 animate-spin text-[#A64B33]" />
                <p>Loading {subject.name} modular marking scheme file...</p>
              </div>
            ) : (
              <>
                {/* SECTION A MARKING SCHEME */}
                <div className="space-y-4">
                  <div data-pdf-block className="text-center pb-2 border-b-2 border-black">
                    <h3 className="font-bold text-sm tracking-wide uppercase">
                      Section A — Official Answer Keys &amp; Explanations
                    </h3>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {sectionAQuestions.map((q) => {
                      const schemeEntry = markingScheme?.[q.id];
                      const correctLetter = String.fromCharCode(65 + q.correctIndex);
                      const correctText = q.options[q.correctIndex] ?? '';

                      return (
                        <div key={q.id} data-pdf-block className="py-2.5 print-avoid-break space-y-1 text-xs font-sans">
                          <div className="flex items-start justify-between gap-3">
                            <span className="font-bold text-sm text-black">Q{q.questionNumber}.</span>
                            <div className="flex-1 space-y-1">
                              <p className="font-bold text-emerald-900 text-[13px]">
                                Correct Option: ({correctLetter}) — {correctText}
                              </p>
                              {schemeEntry ? (
                                <>
                                  <p className="text-gray-800 font-serif leading-relaxed text-[12.5px] whitespace-pre-line">
                                    <strong>Model Explanation:</strong> {schemeEntry.exactModelAnswer}
                                  </p>
                                  {schemeEntry.diagramSvg && (
                                    <div className="pt-1 exam-pdf-diagram-wrap">
                                      <ExamDiagram
                                        svg={schemeEntry.diagramSvg}
                                        caption={`Reference Diagram — Question ${q.questionNumber}`}
                                      />
                                    </div>
                                  )}
                                </>
                              ) : null}
                            </div>
                            <span className="font-bold text-gray-700 shrink-0">[1 Mark]</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SECTIONS B TO E MARKING SCHEME */}
                {(['B', 'C', 'D', 'E'] as const).map((secCode) => {
                  const secQuestions = subjectiveQuestions.filter((q) => q.sectionCode === secCode);
                  if (secQuestions.length === 0) return null;

                  return (
                    <div key={secCode} className="pt-6 space-y-4 print-page-break">
                      <div data-pdf-block data-pdf-page-break="true" className="text-center pb-2 border-b-2 border-black">
                        <h3 className="font-bold text-sm tracking-wide uppercase">
                          Section {secCode} — Step-Wise Mark Distribution &amp; Model Answers
                        </h3>
                      </div>

                      <div className="space-y-4 font-sans text-xs">
                        {secQuestions.map((q) => {
                          const schemeEntry = markingScheme?.[q.id];

                          return (
                            <div
                              key={q.id}
                              data-pdf-block
                              className="p-3.5 border border-gray-300 rounded-lg bg-gray-50/40 print:border-black print:bg-transparent print-avoid-break space-y-2"
                            >
                              <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
                                <span className="font-bold text-sm text-black">
                                  Question {q.questionNumber} (Section {q.sectionCode} · {q.chapterTag})
                                </span>
                                <span className="font-bold text-gray-800">[{q.marks} Marks]</span>
                              </div>

                              <p className="text-gray-700 italic text-[11.5px] font-serif whitespace-pre-line">
                                {q.prompt}
                              </p>

                              {schemeEntry && (
                                <>
                                  {/* Step-by-Step Mark Breakdown Table */}
                                  <div className="pt-1">
                                    <p className="font-bold text-[11px] uppercase text-gray-800 mb-1">
                                      Step-by-Step Marks Distribution:
                                    </p>
                                    <div className="border border-gray-200 rounded overflow-hidden">
                                      <table className="w-full text-left text-[11px]">
                                        <thead className="bg-gray-100 border-b border-gray-200 text-gray-700">
                                          <tr>
                                            <th className="py-1 px-2.5 font-semibold">Evaluation Step / Criterion</th>
                                            <th className="py-1 px-2.5 font-semibold text-right w-24">Marks Split</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                          {schemeEntry.stepMarks.map((sm, sIdx) => (
                                            <tr key={sIdx}>
                                              <td className="py-1 px-2.5 text-gray-800">{sm.label}</td>
                                              <td className="py-1 px-2.5 text-right font-mono font-bold text-emerald-800">
                                                +{sm.marks} m
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>

                                  {/* Exact Model Answer */}
                                  <div className="pt-1.5">
                                    <p className="font-bold text-[11px] uppercase text-gray-800">
                                      Exact Model Answer / Solution:
                                    </p>
                                    <div className="mt-1 p-2.5 bg-white border border-gray-200 rounded text-[12px] font-serif leading-relaxed text-black whitespace-pre-line">
                                      {schemeEntry.exactModelAnswer}
                                    </div>
                                    {schemeEntry.finalAnswerValue && (
                                      <p className="mt-1 text-[11px] font-mono font-semibold text-emerald-900">
                                        Final Expected Value / Key: {schemeEntry.finalAnswerValue}
                                      </p>
                                    )}
                                    {schemeEntry.diagramSvg && (
                                      <div className="pt-2 exam-pdf-diagram-wrap">
                                        <ExamDiagram
                                          svg={schemeEntry.diagramSvg}
                                          caption={`Labeled Reference Diagram — Question ${q.questionNumber}`}
                                        />
                                      </div>
                                    )}
                                  </div>

                                  {/* Examiner Checkpoints */}
                                  {schemeEntry.examinerCheckpoints.length > 0 && (
                                    <div className="pt-1 text-[11px] text-gray-700">
                                      <p className="font-bold uppercase text-[10px] text-gray-600">
                                        Examiner Checkpoints:
                                      </p>
                                      <ul className="list-disc list-inside space-y-0.5 mt-0.5">
                                        {schemeEntry.examinerCheckpoints.map((cp, cpIdx) => (
                                          <li key={cpIdx}>{cp}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Marking Scheme End Marker */}
                <div data-pdf-block className="pt-6 text-center text-xs font-bold tracking-widest uppercase font-sans border-t border-black">
                  *** END OF MARKING SCHEME · STRICT STEP EVALUATION GUIDELINES ***
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
