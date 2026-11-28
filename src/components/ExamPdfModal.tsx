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
import type {
  ExamAttemptRecord,
  VerifiedExamPaper,
  VerifiedMarkingScheme,
} from '../data/v3Types';
import {
  QUESTIONS_BY_ID,
  getMarkingSchemeForPaper,
  getVerifiedPaperById,
} from '../data/verifiedPapers';
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
  v3Attempt?: ExamAttemptRecord | null;
  v3Paper?: VerifiedExamPaper | null;
}

export function ExamPdfModal({
  subjectId,
  mode,
  isOpen,
  canViewMarkingScheme = true,
  onClose,
  onSwitchMode,
  v3Attempt = null,
  v3Paper = null,
}: ExamPdfModalProps) {
  const [markingScheme, setMarkingScheme] = useState<SubjectMarkingSchemeMap | null>(null);
  const [isLoadingScheme, setIsLoadingScheme] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfFeedback, setPdfFeedback] = useState<string | null>(null);
  const printableDocRef = useRef<HTMLDivElement>(null);

  const effectiveMode =
    !canViewMarkingScheme && mode === 'marking_scheme' ? 'question_paper' : mode;

  const activeV3Paper: VerifiedExamPaper | null = useMemo(() => {
    if (v3Paper) return v3Paper;
    if (v3Attempt) return getVerifiedPaperById(v3Attempt.paperId) ?? null;
    return null;
  }, [v3Paper, v3Attempt]);

  const activeV3Scheme: VerifiedMarkingScheme | null = useMemo(() => {
    if (!activeV3Paper) return null;
    return getMarkingSchemeForPaper(activeV3Paper) ?? null;
  }, [activeV3Paper]);

  const isV3Mode = Boolean(v3Attempt || activeV3Paper);

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

  useEffect(() => {
    if (!isOpen || isV3Mode || effectiveMode !== 'marking_scheme') return;
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
  }, [isOpen, isV3Mode, effectiveMode, subjectId]);

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

  const docLabel = isV3Mode
    ? effectiveMode === 'question_paper'
      ? 'Practice-Sheet'
      : 'Marking-Scheme'
    : effectiveMode === 'question_paper'
      ? 'Question-Paper'
      : 'Marking-Scheme';

  const modalTitleText = isV3Mode
    ? `${subject.name} (Code ${subject.code}) — ${
        effectiveMode === 'question_paper' ? 'Practice Sheet PDF' : 'Official Marking Scheme PDF'
      }`
    : `${subject.name} (Code ${subject.code}) — ${
        effectiveMode === 'question_paper' ? 'Archive SQP PDF' : 'Archive Marking Scheme PDF'
      }`;

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
            <h2
              id="exam-pdf-modal-title"
              className="text-sm sm:text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB]"
            >
              {modalTitleText}
            </h2>
            <p className="text-[11px] text-[#787066] dark:text-[#9C9387]">
              {isV3Mode
                ? v3Attempt
                  ? `Snapshot ${v3Attempt.practiceSheet.snapshotId} · Candidate: ${v3Attempt.studentName} · Score: ${v3Attempt.totalScore}/${v3Attempt.maxMarks}`
                  : `Main Sheet · ${activeV3Paper?.questionIds.length ?? 0} Verified Questions`
                : `2026–27 SQP Archive · ${totalQuestions} Questions · ${subject.boardTheoryMarks} Marks`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
                {isV3Mode ? 'Practice Sheet' : 'Question Paper'}
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
            disabled={isExportingPdf || (!isV3Mode && effectiveMode === 'marking_scheme' && isLoadingScheme)}
            onClick={async () => {
              if (!printableDocRef.current || isExportingPdf) return;
              setIsExportingPdf(true);
              setPdfFeedback(null);
              const safeSubject = subject.name.replace(/[^A-Za-z0-9]+/g, '-');
              const filename = `Quadra12-${safeSubject}-${subject.code}-${docLabel}.pdf`;
              try {
                const res = await exportElementToA4Pdf(printableDocRef.current, {
                  filename,
                  documentTitle: `Quadra 12 · ${subject.name} (${subject.code}) · ${docLabel.replace('-', ' ')}`,
                });
                setPdfFeedback(
                  `Saved to ${res.savedTo} (${res.pageCount} A4 pages)`,
                );
                window.setTimeout(() => setPdfFeedback(null), 6000);
              } catch (err) {
                if (window.QuadraAndroid?.saveBase64File) {
                  setPdfFeedback(
                    err instanceof Error
                      ? err.message
                      : 'Could not save PDF. Please allow storage permission and try again.',
                  );
                } else {
                  window.print();
                }
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
        {isV3Mode ? (
          effectiveMode === 'question_paper' ? (
            /* ========================================================
               V3.1 PRACTICE SHEET PDF (Immutable Attempt or Main Sheet)
            ======================================================== */
            <div className="space-y-6">
              <div data-pdf-block className="text-center space-y-1 py-2 border-b-2 border-black pb-3">
                <p className="text-[11px] font-sans uppercase tracking-widest text-gray-600">
                  Quadra 12 v3.1 · Verified OMR Practice Sheet
                </p>
                <h1 className="text-lg sm:text-xl font-bold tracking-wide uppercase font-serif">
                  {v3Attempt ? v3Attempt.paperTitle : activeV3Paper?.title}
                </h1>
                <p className="text-xs font-sans text-gray-700">
                  {v3Attempt
                    ? `Candidate: ${v3Attempt.studentName} · Attempt ID: ${v3Attempt.attemptId} · Snapshot: ${v3Attempt.practiceSheet.snapshotId}`
                    : activeV3Paper?.subtitle}
                </p>
                {v3Attempt && (
                  <div className="flex flex-wrap justify-center gap-4 text-xs font-sans font-bold pt-2 border-t border-gray-300 mt-2">
                    <span>Net Score: {v3Attempt.totalScore} / {v3Attempt.maxMarks}</span>
                    <span>Correct: {v3Attempt.correctCount}</span>
                    <span>Incorrect: {v3Attempt.incorrectCount}</span>
                    <span>Unanswered: {v3Attempt.unansweredCount}</span>
                    <span>Accuracy: {v3Attempt.accuracyPercent}%</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {(v3Attempt
                  ? v3Attempt.practiceSheet.questions
                  : (activeV3Paper?.questionIds ?? []).map((id, idx) => {
                      const q = QUESTIONS_BY_ID[id];
                      return {
                        questionId: id,
                        questionNumber: idx + 1,
                        chapterTitle: q?.chapterTitle ?? '',
                        topic: q?.topic ?? '',
                        difficulty: q?.difficulty ?? 'Medium',
                        prompt: q?.prompt ?? '',
                        options: q?.options ?? ['', '', '', ''],
                        diagramRefId: q?.diagramRefId,
                        studentSelectedIndex: null as number | null,
                        markedForReview: false,
                      };
                    })
                ).map((item) => (
                  <div
                    key={item.questionId}
                    data-pdf-block
                    className="print-avoid-break space-y-2 pb-3 border-b border-gray-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[13px] leading-relaxed text-black font-serif whitespace-pre-line">
                        <strong className="font-sans mr-1.5">Q{item.questionNumber}.</strong>
                        {item.prompt}
                      </p>
                      <span className="font-sans text-[10px] font-semibold text-gray-600 shrink-0">
                        [{item.difficulty}]
                      </span>
                    </div>
                    <p className="text-[10.5px] font-sans text-gray-600">
                      Chapter: {item.chapterTitle} · Topic: {item.topic}
                      {v3Attempt
                        ? ` · Student Response: ${
                            item.studentSelectedIndex === null
                              ? 'Unanswered'
                              : `Option (${String.fromCharCode(65 + item.studentSelectedIndex)})`
                          }`
                        : ''}
                    </p>
                    {item.diagramRefId && (
                      <div className="py-1 exam-pdf-diagram-wrap">
                        <ExamDiagram diagramId={item.diagramRefId} />
                      </div>
                    )}
                    <div className="pl-4 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-sans text-gray-900">
                      {item.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-start gap-1.5">
                          <span className="font-bold">({String.fromCharCode(65 + oIdx)})</span>
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ========================================================
               V3.1 MARKING SCHEME PDF (Step Solutions & Key Check)
            ======================================================== */
            <div className="space-y-6">
              <div data-pdf-block className="text-center space-y-1 py-2 border-b-2 border-black pb-3">
                <p className="text-[11px] font-sans uppercase tracking-widest text-gray-600">
                  Quadra 12 v3.1 · Human-Verified Official Marking Scheme
                </p>
                <h1 className="text-lg sm:text-xl font-bold tracking-wide uppercase font-serif">
                  {activeV3Scheme?.title ?? `${activeV3Paper?.title ?? subject.name} — Marking Scheme`}
                </h1>
                <p className="text-xs font-sans text-gray-700">
                  Subject: {subject.name} ({subject.code}) · Approved By:{' '}
                  {activeV3Scheme?.approval.reviewedBy ?? 'AriYan Pal (Keśava Dāsa)'}
                  {v3Attempt
                    ? ` · Candidate: ${v3Attempt.studentName} · Net Score: ${v3Attempt.totalScore}/${v3Attempt.maxMarks}`
                    : ''}
                </p>
              </div>

              <div className="space-y-4">
                {(v3Attempt
                  ? v3Attempt.questionResults.map((r) => ({
                      qNum: r.questionNumber,
                      prompt: r.prompt,
                      correctIndex: r.correctIndex,
                      options: r.options,
                      diagramRefId: r.diagramRefId,
                      sol: r.subjectiveSolution,
                      selectedIndex: r.selectedIndex,
                      outcome: r.outcome,
                      marksAwarded: r.marksAwarded,
                    }))
                  : (activeV3Paper?.questionIds ?? []).map((id, idx) => {
                      const q = QUESTIONS_BY_ID[id];
                      return {
                        qNum: idx + 1,
                        prompt: q.prompt,
                        correctIndex: q.correctIndex,
                        options: q.options,
                        diagramRefId: q.diagramRefId,
                        sol: q.subjectiveSolution,
                        selectedIndex: null as number | null,
                        outcome: null as string | null,
                        marksAwarded: null as number | null,
                      };
                    })
                ).map((item) => {
                  const keyLetter = String.fromCharCode(65 + item.correctIndex);
                  return (
                    <div
                      key={item.qNum}
                      data-pdf-block
                      className="p-3.5 border border-gray-300 rounded-lg print:border-black print-avoid-break space-y-2 font-sans text-xs"
                    >
                      <div className="flex items-center justify-between border-b border-gray-200 pb-1">
                        <span className="font-bold text-sm text-black">
                          Q{item.qNum}. Verified Key: ({keyLetter}) — {item.options[item.correctIndex]}
                        </span>
                        {item.marksAwarded !== null && (
                          <span className="font-mono font-bold text-gray-800">
                            [{item.outcome?.toUpperCase()} · {item.marksAwarded >= 0 ? `+${item.marksAwarded}` : item.marksAwarded}m]
                          </span>
                        )}
                      </div>
                      <p className="font-serif italic text-gray-800 text-[12px]">
                        {item.prompt}
                      </p>
                      <p className="text-gray-900">
                        <strong>Concept &amp; Formula:</strong> {item.sol.concept} —{' '}
                        {item.sol.formulaOrPrinciple}
                      </p>
                      <ol className="list-decimal list-inside space-y-0.5 text-gray-800">
                        {item.sol.substitutionAndWorking.map((step, sIdx) => (
                          <li key={sIdx}>{step}</li>
                        ))}
                      </ol>
                      <p className="font-bold text-emerald-900">
                        Final Result: {item.sol.finalResult}
                        {item.sol.finalUnits ? ` (${item.sol.finalUnits})` : ''}
                      </p>
                      <p className="text-gray-700">
                        <strong>Key Reason:</strong> {item.sol.keyReason}
                      </p>
                      {item.diagramRefId && (
                        <div className="pt-1 exam-pdf-diagram-wrap">
                          <ExamDiagram diagramId={item.diagramRefId} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ) : effectiveMode === 'question_paper' ? (
          /* ========================================================
              LEGACY 2026-27 SQP QUESTION PAPER ARCHIVE VIEW
          ======================================================== */
          <div className="space-y-6">
            <div data-pdf-block className="flex justify-between items-start text-[11px] font-sans pb-3 border-b-2 border-black">
              <div>
                <p className="font-semibold">Series: Q12-2027 (Archive)</p>
                <p className="text-[10px] text-gray-700">Set No. 1 · View-Only SQP Edition</p>
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

            <div data-pdf-block className="text-center space-y-1 py-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-wide uppercase font-serif">
                Central Board of Secondary Education
              </h1>
              <p className="text-xs uppercase tracking-wider font-semibold text-gray-800">
                Senior School Certificate Examination 2026–27 (Archive SQP)
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

            <div data-pdf-block className="p-3.5 border border-gray-400 bg-gray-50/50 text-[11.5px] leading-normal font-sans space-y-1">
              <p className="font-bold underline uppercase tracking-wide">General Instructions:</p>
              <ol className="list-decimal list-inside space-y-0.5 text-gray-800">
                <li>
                  This archive contains <strong>{totalQuestions} questions</strong> in <strong>5 Sections</strong>: A, B, C, D, and E.
                </li>
                <li>
                  <strong>Section A:</strong> Questions 1 to {sectionAQuestions.length} carry 1 mark each.
                </li>
                {sectionRanges.map((sec) => (
                  <li key={sec.code}>
                    <strong>Section {sec.code}:</strong> Questions {sec.first} to {sec.last} are {sec.desc} carrying <strong>{sec.marks} marks</strong> each.
                  </li>
                ))}
              </ol>
            </div>

            <div className="pt-4 space-y-5">
              <div data-pdf-block className="text-center pb-2 border-b-2 border-black">
                <h3 className="font-bold text-sm tracking-wide uppercase">
                  Section A ({sectionAQuestions.length} Marks)
                </h3>
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
                        </div>
                      </div>
                      <span className="font-sans font-bold text-xs text-gray-800 shrink-0">[1]</span>
                    </div>

                    {(q.diagramId || q.questionDiagramSvg) && (
                      <div className="pl-6 py-1 exam-pdf-diagram-wrap">
                        <ExamDiagram diagramId={q.diagramId} svg={q.questionDiagramSvg} />
                      </div>
                    )}

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
                                  {q.caseContext}
                                </div>
                              )}
                              <p className="text-[13px] leading-relaxed text-black font-serif whitespace-pre-line">
                                {q.prompt}
                              </p>
                              {q.orPrompt && (
                                <p className="text-[12.5px] italic leading-relaxed text-black font-serif whitespace-pre-line">
                                  OR: {q.orPrompt}
                                </p>
                              )}
                              {(q.diagramId || q.questionDiagramSvg) && (
                                <div className="py-1 exam-pdf-diagram-wrap">
                                  <ExamDiagram diagramId={q.diagramId} svg={q.questionDiagramSvg} />
                                </div>
                              )}
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
          </div>
        ) : (
          /* ========================================================
              LEGACY 2026-27 SQP MARKING SCHEME ARCHIVE VIEW
          ======================================================== */
          <div className="space-y-6">
            <div data-pdf-block className="text-center space-y-1 py-2 border-b-2 border-black pb-3">
              <h1 className="text-lg sm:text-xl font-bold tracking-wide uppercase font-serif">
                Central Board of Secondary Education
              </h1>
              <h2 className="text-base sm:text-lg font-bold uppercase underline underline-offset-4 pt-1">
                2026–27 Archive Marking Scheme &amp; Step Solutions
              </h2>
              <p className="text-xs font-semibold text-gray-700">
                {subject.name} (Code: {subject.code}) · Theory ({subject.boardTheoryMarks} Marks)
              </p>
            </div>

            {isLoadingScheme ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 font-sans text-xs text-gray-600">
                <Loader2 className="w-6 h-6 animate-spin text-[#A64B33]" />
                <p>Loading {subject.name} archive marking scheme...</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div data-pdf-block className="text-center pb-2 border-b-2 border-black">
                    <h3 className="font-bold text-sm tracking-wide uppercase">
                      Section A — Answer Keys &amp; Explanations
                    </h3>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {sectionAQuestions.map((q) => {
                      const schemeEntry = markingScheme?.[q.id];
                      const correctLetter = String.fromCharCode(65 + q.correctIndex);
                      return (
                        <div key={q.id} data-pdf-block className="py-2.5 print-avoid-break space-y-1 text-xs font-sans">
                          <div className="flex items-start justify-between gap-3">
                            <span className="font-bold text-sm text-black">Q{q.questionNumber}.</span>
                            <div className="flex-1 space-y-1">
                              <p className="font-bold text-emerald-900 text-[13px]">
                                Correct Option: ({correctLetter}) — {q.options[q.correctIndex]}
                              </p>
                              {schemeEntry && (
                                <p className="text-gray-800 font-serif leading-relaxed text-[12.5px] whitespace-pre-line">
                                  <strong>Explanation:</strong> {schemeEntry.exactModelAnswer}
                                </p>
                              )}
                            </div>
                            <span className="font-bold text-gray-700 shrink-0">[1 Mark]</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {(['B', 'C', 'D', 'E'] as const).map((secCode) => {
                  const secQuestions = subjectiveQuestions.filter((q) => q.sectionCode === secCode);
                  if (secQuestions.length === 0) return null;

                  return (
                    <div key={secCode} className="pt-6 space-y-4 print-page-break">
                      <div data-pdf-block data-pdf-page-break="true" className="text-center pb-2 border-b-2 border-black">
                        <h3 className="font-bold text-sm tracking-wide uppercase">
                          Section {secCode} — Step-Wise Mark Distribution
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
                                  Question {q.questionNumber} ({q.chapterTag})
                                </span>
                                <span className="font-bold text-gray-800">[{q.marks} Marks]</span>
                              </div>
                              {schemeEntry && (
                                <div className="space-y-1.5">
                                  <p className="font-serif text-[12px] text-black whitespace-pre-line">
                                    {schemeEntry.exactModelAnswer}
                                  </p>
                                  {schemeEntry.diagramSvg && (
                                    <div className="pt-1 exam-pdf-diagram-wrap">
                                      <ExamDiagram svg={schemeEntry.diagramSvg} />
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
