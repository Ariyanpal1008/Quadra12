import {useMemo, useState} from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  FileCheck2,
  FileText,
  MinusCircle,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import type {ExamAttemptRecord} from '../../data/v3Types';
import type {SubjectId} from '../../data/pcmbData';
import {getChapterStudyBundle} from '../../data/studySheets';
import {ExamDiagram} from '../ExamDiagrams';
import {getDiagramMetadata} from '../../data/v3Diagrams';

interface ExamResultViewProps {
  attempt: ExamAttemptRecord;
  onExportPracticePdf: (attempt: ExamAttemptRecord) => void;
  onExportMarkingSchemePdf: (attempt: ExamAttemptRecord) => void;
  onOpenChapterInTracker: (subjectId: SubjectId, chapterId: string) => void;
  onRetakeOrNewExam: () => void;
}

function formatDuration(seconds: number): string {
  const safe = Math.max(0, Math.round(seconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}m ${String(secs).padStart(2, '0')}s`;
}

export function ExamResultView({
  attempt,
  onExportPracticePdf,
  onExportMarkingSchemePdf,
  onOpenChapterInTracker,
  onRetakeOrNewExam,
}: ExamResultViewProps) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'solutions' | 'practice_sheet' | 'study_diagrams'
  >('overview');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    attempt.questionResults[0]?.questionId ?? null,
  );

  const relatedChapters = useMemo(() => {
    return attempt.relatedChapterIds
      .map((id) => getChapterStudyBundle(id))
      .filter((b): b is NonNullable<typeof b> => Boolean(b));
  }, [attempt.relatedChapterIds]);

  const validDiagramIds = useMemo(() => {
    return attempt.relatedDiagramIds.filter((id) => Boolean(getDiagramMetadata(id)));
  }, [attempt.relatedDiagramIds]);

  return (
    <div className="space-y-6">
      {/* Unconditional Score & Resource Header Banner (Strictly enabled at 0 or negative marks) */}
      <div className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-6 sm:p-7 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#3D6B4F] dark:text-[#7AB88F]">
              <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>
                Deterministic Evaluation Complete · Profile: {attempt.studentName} · Attempt ID:{' '}
                {attempt.attemptId}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
              {attempt.paperTitle}
            </h2>
            <p className="text-xs text-[#787066] dark:text-[#9C9387] font-mono tabular-nums">
              Submitted {new Date(attempt.submittedAt).toLocaleString()} · Time Taken:{' '}
              {formatDuration(attempt.timeTakenSeconds)} · Rules: +{attempt.positiveRule} /{' '}
              {attempt.negativeRule > 0 ? `-${attempt.negativeRule}` : '0'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onExportPracticePdf(attempt)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB] hover:border-[#A64B33] transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Practice Sheet PDF</span>
            </button>
            <button
              type="button"
              onClick={() => onExportMarkingSchemePdf(attempt)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#3D6B4F] hover:bg-[#315940] text-white transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Marking Scheme PDF</span>
            </button>
            <button
              type="button"
              onClick={onRetakeOrNewExam}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Exam Hall Home</span>
            </button>
          </div>
        </div>

        {/* 6 Core Numeric Telemetry Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 font-mono tabular-nums">
          <div className="p-3.5 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412]">
            <p className="text-[11px] font-sans text-[#787066] dark:text-[#9C9387]">Net Score</p>
            <p className="mt-1 text-xl font-bold text-[#1E1B18] dark:text-[#F5F2EB]">
              {attempt.totalScore} / {attempt.maxMarks}
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-[#B8D0BF] dark:border-[#2F4D39] bg-[#E8F0EA] dark:bg-[#1C2E22]">
            <p className="text-[11px] font-sans text-[#23422F] dark:text-[#B6DFC3]">
              Positive Marks
            </p>
            <p className="mt-1 text-xl font-bold text-[#23422F] dark:text-[#B6DFC3]">
              +{attempt.positiveMarksEarned}
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-[#E5B8AC] dark:border-[#5E2A22] bg-[#FBF0ED] dark:bg-[#2A1916]">
            <p className="text-[11px] font-sans text-[#7A3528] dark:text-[#F6B7AF]">
              Negative Deducted
            </p>
            <p className="mt-1 text-xl font-bold text-[#7A3528] dark:text-[#F6B7AF]">
              -{attempt.negativeMarksDeducted}
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412]">
            <p className="text-[11px] font-sans text-[#787066] dark:text-[#9C9387]">Accuracy</p>
            <p className="mt-1 text-xl font-bold text-[#1E1B18] dark:text-[#F5F2EB]">
              {attempt.accuracyPercent}%
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412]">
            <p className="text-[11px] font-sans text-[#787066] dark:text-[#9C9387]">
              Correct / Wrong
            </p>
            <p className="mt-1 text-xl font-bold text-[#1E1B18] dark:text-[#F5F2EB]">
              {attempt.correctCount} / {attempt.incorrectCount}
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412]">
            <p className="text-[11px] font-sans text-[#787066] dark:text-[#9C9387]">Unanswered</p>
            <p className="mt-1 text-xl font-bold text-[#1E1B18] dark:text-[#F5F2EB]">
              {attempt.unansweredCount}
            </p>
          </div>
        </div>

        {/* Unconditional Zero-Mark Guarantee Notice */}
        <div className="p-3.5 rounded-lg border border-[#B8D0BF] dark:border-[#2F4D39] bg-[#E8F0EA]/60 dark:bg-[#1C2E22]/50 text-xs text-[#23422F] dark:text-[#B6DFC3] flex flex-wrap items-center justify-between gap-2">
          <span>
            Unconditional Learning Access: Your Practice Sheet snapshot, human Marking Scheme,
            Practice Sheet PDF, Marking Scheme PDF, Study Sheets, and SVG Diagrams are always unlocked—even at 0 marks.
          </span>
          <span className="font-mono font-semibold">
            Snapshot ID: {attempt.practiceSheet.snapshotId}
          </span>
        </div>

        {/* Sub-Tabs */}
        <div className="flex flex-wrap gap-2 pt-1">
          {(
            [
              {id: 'overview', label: 'Chapter & Difficulty Breakdown'},
              {
                id: 'solutions',
                label: `Marking Scheme & Solutions (${attempt.questionResults.length})`,
              },
              {
                id: 'practice_sheet',
                label: `Immutable Practice Sheet (${attempt.practiceSheet.questions.length})`,
              },
              {
                id: 'study_diagrams',
                label: `Study Sheets (${relatedChapters.length}) & Diagrams (${validDiagramIds.length})`,
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] border-[#1E1B18] dark:border-[#F5F2EB]'
                  : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Chapter & Difficulty Breakdown */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-5 space-y-4">
            <h3 className="text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
              Chapter Breakdown
            </h3>
            <div className="divide-y divide-[#DDD6C7] dark:divide-[#332E28] text-xs">
              {attempt.chapterBreakdown.map((stat) => (
                <div key={stat.label} className="py-2.5 flex items-center justify-between gap-3">
                  <span className="font-medium text-[#1E1B18] dark:text-[#F5F2EB]">
                    {stat.label}
                  </span>
                  <span className="font-mono tabular-nums text-[#575048] dark:text-[#CBC3B6] shrink-0">
                    {stat.correct}/{stat.total} Right · {stat.incorrect} Wrong ·{' '}
                    {stat.accuracyPercent}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-5 space-y-4">
            <h3 className="text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
              Difficulty Breakdown
            </h3>
            <div className="divide-y divide-[#DDD6C7] dark:divide-[#332E28] text-xs">
              {attempt.difficultyBreakdown.map((stat) => (
                <div key={stat.label} className="py-2.5 flex items-center justify-between gap-3">
                  <span className="font-medium text-[#1E1B18] dark:text-[#F5F2EB]">
                    {stat.label}
                  </span>
                  <span className="font-mono tabular-nums text-[#575048] dark:text-[#CBC3B6] shrink-0">
                    {stat.correct} Correct · {stat.incorrect} Wrong · {stat.unanswered} Blank ·{' '}
                    {stat.accuracyPercent}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Question-by-Question Marking Scheme & Subjective Solutions */}
      {activeTab === 'solutions' && (
        <div className="space-y-3">
          {attempt.questionResults.map((res) => {
            const isOpen = expandedQuestionId === res.questionId;
            return (
              <div
                key={res.questionId}
                className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedQuestionId(isOpen ? null : res.questionId)}
                  className="w-full px-5 py-4 text-left flex items-start justify-between gap-4 hover:bg-[#F5F2EB] dark:hover:bg-[#24201C] transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="font-bold text-[#1E1B18] dark:text-[#F5F2EB]">
                        Q{res.questionNumber}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#787066] dark:text-[#9C9387]">
                        {res.chapterTitle} ({res.difficulty})
                      </span>
                      <span aria-hidden="true">·</span>
                      {res.outcome === 'correct' ? (
                        <span className="inline-flex items-center gap-1 text-[#3D6B4F] dark:text-[#7AB88F] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Correct (+{res.marksAwarded})</span>
                        </span>
                      ) : res.outcome === 'incorrect' ? (
                        <span className="inline-flex items-center gap-1 text-[#B43C2E] dark:text-[#E57B6E] font-semibold">
                          <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Incorrect ({res.marksAwarded})</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#787066] dark:text-[#9C9387]">
                          <MinusCircle className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Unanswered (0)</span>
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-[#1E1B18] dark:text-[#F5F2EB]">
                      {res.prompt}
                    </p>
                  </div>

                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#787066] shrink-0 mt-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#787066] shrink-0 mt-1" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-2 border-t border-[#DDD6C7] dark:border-[#332E28] space-y-4 text-xs sm:text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {res.options.map((opt, oIdx) => {
                        const letter = String.fromCharCode(65 + oIdx);
                        const isKey = oIdx === res.correctIndex;
                        const isPick = oIdx === res.selectedIndex;
                        return (
                          <div
                            key={letter}
                            className={`p-2.5 rounded-lg border text-xs ${
                              isKey
                                ? 'bg-[#E8F0EA] dark:bg-[#1C2E22] border-[#3D6B4F] dark:border-[#7AB88F] text-[#23422F] dark:text-[#B6DFC3]'
                                : isPick
                                  ? 'bg-[#FDECE9] dark:bg-[#2F1815] border-[#B43C2E] dark:border-[#E57B6E] text-[#7D2419] dark:text-[#F6B7AF]'
                                  : 'bg-[#F5F2EB] dark:bg-[#161412] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6]'
                            }`}
                          >
                            <span className="font-mono font-bold mr-1.5">({letter})</span>
                            <span>{opt}</span>
                            {isKey && <strong className="ml-2">[Verified Key]</strong>}
                            {isPick && !isKey && <strong className="ml-2">[Your Pick]</strong>}
                          </div>
                        );
                      })}
                    </div>

                    {res.diagramRefId && (
                      <div className="p-3 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-white">
                        <ExamDiagram diagramId={res.diagramRefId} />
                      </div>
                    )}

                    <div className="p-4 rounded-lg bg-[#F5F2EB] dark:bg-[#161412] border border-[#DDD6C7] dark:border-[#332E28] space-y-2">
                      <p className="font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                        Subjective Marking Breakdown · {res.subjectiveSolution.concept}
                      </p>
                      <p className="text-[#575048] dark:text-[#CBC3B6]">
                        <strong>Formula / Principle:</strong>{' '}
                        {res.subjectiveSolution.formulaOrPrinciple}
                      </p>
                      {res.subjectiveSolution.givenData && (
                        <p className="text-[#575048] dark:text-[#CBC3B6]">
                          <strong>Given:</strong> {res.subjectiveSolution.givenData}
                        </p>
                      )}
                      <ol className="list-decimal list-inside space-y-1 text-[#1E1B18] dark:text-[#F5F2EB]">
                        {res.subjectiveSolution.substitutionAndWorking.map((step, sIdx) => (
                          <li key={sIdx}>{step}</li>
                        ))}
                      </ol>
                      <p className="font-semibold text-[#3D6B4F] dark:text-[#7AB88F]">
                        Final Answer: {res.subjectiveSolution.finalResult}
                        {res.subjectiveSolution.finalUnits
                          ? ` (${res.subjectiveSolution.finalUnits})`
                          : ''}
                      </p>
                      <p className="text-[#575048] dark:text-[#CBC3B6]">
                        <strong>Key Reason:</strong> {res.subjectiveSolution.keyReason}
                      </p>
                      {res.subjectiveSolution.commonMistakeToAvoid && (
                        <p className="text-[#8C5A12] dark:text-[#E6B17A]">
                          <strong>Avoid Mistake:</strong>{' '}
                          {res.subjectiveSolution.commonMistakeToAvoid}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => onOpenChapterInTracker(attempt.subjectId, res.chapterId)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A64B33] dark:text-[#D4785E] hover:underline"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Revise {res.chapterTitle} in Subject Tracker</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Immutable Practice Sheet Snapshot */}
      {activeTab === 'practice_sheet' && (
        <div className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#DDD6C7] dark:border-[#332E28]">
            <div>
              <h3 className="text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#A64B33] dark:text-[#D4785E]" />
                <span>Immutable Practice Sheet Snapshot ({attempt.studentName})</span>
              </h3>
              <p className="text-xs text-[#787066] dark:text-[#9C9387] font-mono">
                Main Sheet ID: {attempt.paperId} (untouched) · Snapshot:{' '}
                {attempt.practiceSheet.snapshotId}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onExportPracticePdf(attempt)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Practice Sheet PDF</span>
            </button>
          </div>

          <div className="divide-y divide-[#DDD6C7] dark:divide-[#332E28]">
            {attempt.practiceSheet.questions.map((pq) => (
              <div key={pq.questionId} className="py-3.5 space-y-1.5 text-xs sm:text-sm">
                <p className="font-medium text-[#1E1B18] dark:text-[#F5F2EB]">
                  <span className="font-mono font-bold mr-2">Q{pq.questionNumber}.</span>
                  {pq.prompt}
                </p>
                <p className="text-xs font-mono text-[#787066] dark:text-[#9C9387]">
                  Recorded Response:{' '}
                  {pq.studentSelectedIndex === null
                    ? 'Blank / Unanswered'
                    : `Option (${String.fromCharCode(65 + pq.studentSelectedIndex)})`}{' '}
                  {pq.markedForReview ? '· Marked for Review' : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Linked Chapter Study Sheets, Diagrams & Direct Subject Tracker Links */}
      {activeTab === 'study_diagrams' && (
        <div className="space-y-6">
          <div className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-6 space-y-4">
            <h3 className="text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB] flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-[#3D6B4F] dark:text-[#7AB88F]" />
              <span>Related NCERT Chapter Study Libraries</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {relatedChapters.map((bundle) => (
                <div
                  key={bundle.chapterId}
                  className="p-4 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] flex flex-col justify-between gap-3"
                >
                  <div>
                    <p className="text-xs font-mono text-[#787066] dark:text-[#9C9387]">
                      Ch {bundle.chapterNumber} · {bundle.unit}
                    </p>
                    <h4 className="mt-0.5 text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                      {bundle.chapterTitle}
                    </h4>
                    <p className="mt-1 text-xs text-[#575048] dark:text-[#CBC3B6] line-clamp-2">
                      {bundle.summary}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenChapterInTracker(bundle.subjectId, bundle.chapterId)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A64B33] dark:text-[#D4785E] hover:underline self-start"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open Chapter Study Sheets &amp; Tracker</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {validDiagramIds.length > 0 && (
            <div className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-6 space-y-4">
              <h3 className="text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                Referenced Scientific Diagrams &amp; Graphs ({validDiagramIds.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {validDiagramIds.map((dId) => (
                  <div
                    key={dId}
                    className="p-3 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-white"
                  >
                    <ExamDiagram diagramId={dId} caption={`Diagram Reference: ${dId}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
