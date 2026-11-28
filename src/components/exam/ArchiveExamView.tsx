import {useEffect, useMemo, useState} from 'react';
import {Archive, Download, Eye, FileText, Loader2, Lock} from 'lucide-react';
import {
  EXAM_QUESTIONS,
  SUBJECTIVE_QUESTIONS,
  SUBJECTS,
  type SubjectId,
} from '../../data/pcmbData';
import {loadSubjectMarkingScheme} from '../../data/markingSchemes/loadMarkingScheme';
import type {SubjectMarkingSchemeMap} from '../../data/markingSchemes/types';
import {ExamDiagram} from '../ExamDiagrams';
import {ExamPdfModal} from '../ExamPdfModal';

interface ArchiveExamViewProps {
  initialSubjectId?: SubjectId;
}

export function ArchiveExamView({initialSubjectId = 'physics'}: ArchiveExamViewProps) {
  const [subjectId, setSubjectId] = useState<SubjectId>(initialSubjectId);
  const [showSchemeAnswers, setShowSchemeAnswers] = useState(true);
  const [schemeMap, setSchemeMap] = useState<SubjectMarkingSchemeMap | null>(null);
  const [loadingScheme, setLoadingScheme] = useState(false);
  const [pdfModal, setPdfModal] = useState<{
    open: boolean;
    mode: 'question_paper' | 'marking_scheme';
  }>({open: false, mode: 'question_paper'});

  useEffect(() => {
    let active = true;
    setLoadingScheme(true);
    loadSubjectMarkingScheme(subjectId)
      .then((res) => {
        if (active) {
          setSchemeMap(res);
          setLoadingScheme(false);
        }
      })
      .catch(() => {
        if (active) setLoadingScheme(false);
      });
    return () => {
      active = false;
    };
  }, [subjectId]);

  const subject = SUBJECTS.find((s) => s.id === subjectId) ?? SUBJECTS[0];

  const sectionA = useMemo(
    () =>
      EXAM_QUESTIONS.filter((q) => q.subjectId === subjectId).sort(
        (a, b) => a.questionNumber - b.questionNumber,
      ),
    [subjectId],
  );

  const sectionBE = useMemo(
    () =>
      SUBJECTIVE_QUESTIONS.filter((q) => q.subjectId === subjectId).sort(
        (a, b) => a.questionNumber - b.questionNumber,
      ),
    [subjectId],
  );

  return (
    <div className="space-y-6">
      <div className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#787066] dark:text-[#9C9387]">
              <Archive className="w-3.5 h-3.5 text-[#A64B33] dark:text-[#D4785E]" />
              <span>2026–27 Legacy SQP Archive · Strictly View-Only (Non-Interactive)</span>
            </div>
            <h2 className="mt-1 text-xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
              CBSE 2026–27 SQP Archive — {subject.name} (Code {subject.code})
            </h2>
            <p className="mt-1 text-xs text-[#575048] dark:text-[#CBC3B6]">
              Historical reference from Quadra 12 v2.6.2. Read the complete Section A–E questions,
              diagrams, and verified step-marking scheme below or export the printable PDFs. Live
              interactive testing runs exclusively on v3.1 OMR &amp; Practice modes.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 shrink-0">
            {SUBJECTS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSubjectId(s.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  s.id === subjectId
                    ? 'bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] border-[#1E1B18] dark:border-[#F5F2EB]'
                    : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6]'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-[#DDD6C7] dark:border-[#332E28] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPdfModal({open: true, mode: 'question_paper'})}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Legacy SQP Question PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setPdfModal({open: true, mode: 'marking_scheme'})}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB]"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Legacy Marking Scheme PDF</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowSchemeAnswers((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#E8F0EA] dark:bg-[#1C2E22] border border-[#3D6B4F] dark:border-[#7AB88F] text-[#23422F] dark:text-[#B6DFC3]"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>
              {showSchemeAnswers ? 'Hide Scheme Solutions' : 'Show Scheme Solutions'}
            </span>
          </button>
        </div>
      </div>

      {/* View-Only Section A */}
      <div className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#DDD6C7] dark:border-[#332E28] pb-3">
          <h3 className="text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
            Section A ({sectionA.length} Questions · View-Only Reference)
          </h3>
          <span className="inline-flex items-center gap-1 text-xs font-mono text-[#787066] dark:text-[#9C9387]">
            <Lock className="w-3.5 h-3.5" />
            <span>Read-Only</span>
          </span>
        </div>

        <div className="divide-y divide-[#DDD6C7] dark:divide-[#332E28]">
          {sectionA.map((q) => {
            const scheme = schemeMap?.[q.id];
            return (
              <div key={q.id} className="py-4 space-y-2.5 text-sm">
                <p className="font-medium text-[#1E1B18] dark:text-[#F5F2EB] whitespace-pre-line">
                  <span className="font-mono font-bold mr-2">Q{q.questionNumber}.</span>
                  {q.prompt}
                </p>

                {(q.diagramId || q.questionDiagramSvg) && (
                  <div className="p-2.5 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-white max-w-lg">
                    <ExamDiagram diagramId={q.diagramId} svg={q.questionDiagramSvg} />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#575048] dark:text-[#CBC3B6]">
                  {q.options.map((opt, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 rounded border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412]"
                    >
                      <strong className="mr-1.5">({String.fromCharCode(65 + idx)})</strong>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>

                {showSchemeAnswers && (
                  <div className="p-3 rounded-lg bg-[#E8F0EA]/70 dark:bg-[#1C2E22]/50 border border-[#B8D0BF] dark:border-[#2F4D39] text-xs space-y-1">
                    <p className="font-semibold text-[#23422F] dark:text-[#B6DFC3]">
                      Verified Answer: ({String.fromCharCode(65 + q.correctIndex)}){' '}
                      {q.options[q.correctIndex]}
                    </p>
                    {scheme?.exactModelAnswer && (
                      <p className="text-[#1E1B18] dark:text-[#F5F2EB]">
                        {scheme.exactModelAnswer}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* View-Only Sections B to E */}
      <div className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#DDD6C7] dark:border-[#332E28] pb-3">
          <h3 className="text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
            Sections B–E Subjective Questions ({sectionBE.length} Questions · View-Only Reference)
          </h3>
          {loadingScheme && <Loader2 className="w-4 h-4 animate-spin text-[#A64B33]" />}
        </div>

        <div className="divide-y divide-[#DDD6C7] dark:divide-[#332E28]">
          {sectionBE.map((q) => {
            const scheme = schemeMap?.[q.id];
            return (
              <div key={q.id} className="py-4 space-y-2.5 text-sm">
                <div className="flex items-center justify-between gap-2 text-xs font-mono text-[#787066] dark:text-[#9C9387]">
                  <span>
                    Q{q.questionNumber} · Section {q.sectionCode} · {q.chapterTag}
                  </span>
                  <span className="font-semibold">[{q.marks} Marks]</span>
                </div>
                {q.caseContext && (
                  <p className="p-3 rounded-lg bg-[#F5F2EB] dark:bg-[#161412] border border-[#DDD6C7] dark:border-[#332E28] text-xs text-[#575048] dark:text-[#CBC3B6]">
                    {q.caseContext}
                  </p>
                )}
                <p className="font-medium text-[#1E1B18] dark:text-[#F5F2EB] whitespace-pre-line">
                  {q.prompt}
                </p>
                {q.orPrompt && (
                  <p className="text-xs sm:text-sm text-[#575048] dark:text-[#CBC3B6] italic whitespace-pre-line">
                    OR: {q.orPrompt}
                  </p>
                )}

                {showSchemeAnswers && scheme && (
                  <div className="p-3 rounded-lg bg-[#E8F0EA]/70 dark:bg-[#1C2E22]/50 border border-[#B8D0BF] dark:border-[#2F4D39] text-xs space-y-1.5">
                    <p className="font-semibold text-[#23422F] dark:text-[#B6DFC3]">
                      Step-Wise Marking Scheme:
                    </p>
                    <ul className="list-disc list-inside text-[#1E1B18] dark:text-[#F5F2EB]">
                      {scheme.stepMarks.map((st, sIdx) => (
                        <li key={sIdx}>
                          {st.label} (+{st.marks}m)
                        </li>
                      ))}
                    </ul>
                    <p className="text-[#1E1B18] dark:text-[#F5F2EB] whitespace-pre-line">
                      <strong>Model Answer:</strong> {scheme.exactModelAnswer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <ExamPdfModal
        isOpen={pdfModal.open}
        subjectId={subjectId}
        mode={pdfModal.mode}
        canViewMarkingScheme
        onClose={() => setPdfModal((prev) => ({...prev, open: false}))}
        onSwitchMode={(mode) => setPdfModal({open: true, mode})}
      />
    </div>
  );
}
