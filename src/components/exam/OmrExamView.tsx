import {useState} from 'react';
import {
  AlertTriangle,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eraser,
  Flag,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import type {
  ActiveExamQuestionView,
  VerifiedExamPaper,
} from '../../data/v3Types';
import {ExamDiagram} from '../ExamDiagrams';
import {playOmrBubbleSound} from '../../utils/soundEffects';

interface OmrExamViewProps {
  paper: VerifiedExamPaper;
  questions: ActiveExamQuestionView[];
  studentName: string;
  answers: Record<string, number>;
  markedForReview: Record<string, boolean>;
  visitedIds: Record<string, boolean>;
  currentIndex: number;
  secondsLeft: number;
  onSelectAnswer: (questionId: string, optionIndex: number) => void;
  onClearAnswer: (questionId: string) => void;
  onToggleMarkForReview: (questionId: string) => void;
  onNavigateIndex: (index: number) => void;
  onSubmitExam: () => void;
  onExitExam: () => void;
}

function formatTimerClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hrs = Math.floor(safe / 3600);
  const mins = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  return [hrs, mins, secs].map((v) => String(v).padStart(2, '0')).join(':');
}

export function OmrExamView({
  paper,
  questions,
  studentName,
  answers,
  markedForReview,
  visitedIds,
  currentIndex,
  secondsLeft,
  onSelectAnswer,
  onClearAnswer,
  onToggleMarkForReview,
  onNavigateIndex,
  onSubmitExam,
  onExitExam,
}: OmrExamViewProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const currentQuestion = questions[currentIndex] ?? questions[0];
  if (!currentQuestion) {
    return null;
  }

  const answeredCount = questions.filter((q) => typeof answers[q.id] === 'number').length;
  const markedCount = questions.filter((q) => Boolean(markedForReview[q.id])).length;
  const visitedCount = questions.filter((q) => Boolean(visitedIds[q.id])).length;
  const notVisitedCount = Math.max(0, questions.length - visitedCount);
  const unansweredCount = questions.length - answeredCount;

  const selectedOption =
    typeof answers[currentQuestion.id] === 'number'
      ? answers[currentQuestion.id]
      : null;
  const isMarked = Boolean(markedForReview[currentQuestion.id]);
  const isLowTime = secondsLeft <= 300;

  return (
    <div className="space-y-6">
      {/* Top Examination Status & Countdown Bar */}
      <div className="bg-[#1E1B18] dark:bg-[#24201C] text-[#F5F2EB] border border-[#332E28] rounded-xl p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#CBC3B6] font-mono">
              <span className="inline-flex items-center gap-1 text-[#7AB88F] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Approved Main Sheet · v{paper.paperVersion}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>Candidate: {studentName}</span>
              <span aria-hidden="true">·</span>
              <span>
                Rule: +{paper.positiveMarks} Correct /{' '}
                {paper.negativeMarks > 0 ? `-${paper.negativeMarks}` : '0'} Wrong
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-[#F5F2EB]">
              {paper.title}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div
              className={`px-3.5 py-2 rounded-lg border font-mono tabular-nums text-base sm:text-lg font-semibold flex items-center gap-2 ${
                isLowTime
                  ? 'border-[#D4785E] bg-[#2F1D19] text-[#F5B7A6]'
                  : 'border-[#332E28] bg-[#161412] text-[#F5F2EB]'
              }`}
              aria-label={`Time remaining ${formatTimerClock(secondsLeft)}`}
            >
              <Clock className="w-4 h-4 text-[#D4785E]" aria-hidden="true" />
              <span>{formatTimerClock(secondsLeft)}</span>
            </div>

            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-[#3D6B4F] hover:bg-[#315940] text-white transition-colors whitespace-nowrap"
            >
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              <span>Review &amp; Submit</span>
            </button>

            <button
              type="button"
              onClick={onExitExam}
              className="px-3 py-2 text-xs font-medium rounded-lg border border-[#3D362F] text-[#CBC3B6] hover:text-white hover:border-[#787066] transition-colors"
            >
              Pause &amp; Exit
            </button>
          </div>
        </div>

        {/* Security Notice Banner */}
        <div className="mt-4 pt-3 border-t border-[#332E28] flex flex-wrap items-center justify-between gap-2 text-xs text-[#9C9387]">
          <span className="inline-flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#D4785E]" aria-hidden="true" />
            <span>
              Answer key &amp; Marking Scheme stay locked until submission. Unanswered items score 0 (even on empty submit, all solutions &amp; PDFs unlock afterwards).
            </span>
          </span>
          <span className="font-mono tabular-nums text-[#F5F2EB]">
            Answered {answeredCount}/{questions.length}
          </span>
        </div>
      </div>

      {/* Two-Zone OMR Simulation Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Active Question & OMR Bubbles */}
        <div className="lg:col-span-8 bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-6 sm:p-7 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#DDD6C7] dark:border-[#332E28]">
            <div>
              <p className="text-xs font-mono text-[#787066] dark:text-[#9C9387] tabular-nums">
                Question {currentIndex + 1} of {questions.length} · {currentQuestion.chapterTitle}
              </p>
              <p className="mt-0.5 text-xs text-[#A64B33] dark:text-[#D4785E] font-medium">
                Topic: {currentQuestion.topic} · {currentQuestion.difficulty} ·{' '}
                {currentQuestion.questionType}
              </p>
            </div>

            <span className="font-mono text-xs font-semibold text-[#1E1B18] dark:text-[#F5F2EB] tabular-nums">
              +{paper.positiveMarks} /{' '}
              {paper.negativeMarks > 0 ? `-${paper.negativeMarks}` : '0'} Marks
            </span>
          </div>

          <div className="space-y-4">
            <p className="text-base sm:text-[17px] leading-relaxed font-medium text-[#1E1B18] dark:text-[#F5F2EB] whitespace-pre-line">
              {currentQuestion.prompt}
            </p>

            {currentQuestion.diagramRefId && (
              <div className="p-3 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-white">
                <ExamDiagram
                  diagramId={currentQuestion.diagramRefId}
                  caption={`Figure for Question ${currentIndex + 1}`}
                />
              </div>
            )}

            {/* OMR Options A, B, C, D */}
            <div className="space-y-2.5 pt-2" role="radiogroup" aria-label={`OMR options for Question ${currentIndex + 1}`}>
              {currentQuestion.options.map((optText, optIdx) => {
                const letter = String.fromCharCode(65 + optIdx);
                const isSelected = selectedOption === optIdx;
                return (
                  <button
                    key={letter}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => {
                      playOmrBubbleSound();
                      onSelectAnswer(currentQuestion.id, optIdx);
                    }}
                    className={`w-full flex items-start gap-3.5 p-3.5 rounded-xl border text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A64B33] ${
                      isSelected
                        ? 'bg-[#ECE6D9] dark:bg-[#2A231E] border-[#A64B33] dark:border-[#D4785E] text-[#1E1B18] dark:text-[#F5F2EB]'
                        : 'bg-[#F5F2EB] dark:bg-[#161412] border-[#DDD6C7] dark:border-[#332E28] text-[#1E1B18] dark:text-[#F5F2EB] hover:border-[#B8AF9F] dark:hover:border-[#4A423A]'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-full border font-mono text-xs font-semibold flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#A64B33] dark:bg-[#D4785E] border-[#A64B33] dark:border-[#D4785E] text-[#FAF8F3] dark:text-[#161412]'
                          : 'bg-[#FAF8F3] dark:bg-[#1E1B18] border-[#B8AF9F] dark:border-[#4A423A] text-[#575048] dark:text-[#CBC3B6]'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="text-sm sm:text-[15px] leading-snug pt-0.5">
                      {optText}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Footer Action Controls */}
          <div className="pt-5 border-t border-[#DDD6C7] dark:border-[#332E28] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={selectedOption === null}
                onClick={() => onClearAnswer(currentQuestion.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[#575048] dark:text-[#CBC3B6] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB] disabled:opacity-45 transition-colors"
              >
                <Eraser className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Clear Bubble</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleMarkForReview(currentQuestion.id)}
                aria-pressed={isMarked}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                  isMarked
                    ? 'bg-[#FBF3E4] dark:bg-[#2D2416] border-[#B7791F] dark:border-[#E6B17A] text-[#8C5A12] dark:text-[#E6B17A]'
                    : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6] hover:border-[#B7791F]'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => onNavigateIndex(currentIndex - 1)}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB] disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Previous</span>
              </button>
              <button
                type="button"
                disabled={currentIndex >= questions.length - 1}
                onClick={() => onNavigateIndex(currentIndex + 1)}
                className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] disabled:opacity-40 transition-opacity"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Question Palette & Live Status Counts */}
        <aside className="lg:col-span-4 bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-5 space-y-5 lg:sticky lg:top-20">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
              OMR Question Palette
            </h3>
            <span className="text-xs font-mono tabular-nums text-[#787066] dark:text-[#9C9387]">
              {questions.length} Items
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg border border-[#B8D0BF] dark:border-[#2F4D39] bg-[#E8F0EA] dark:bg-[#1C2E22] flex items-center justify-between">
              <span className="text-[#23422F] dark:text-[#B6DFC3] font-medium">Answered</span>
              <span className="font-mono font-semibold tabular-nums text-[#23422F] dark:text-[#B6DFC3]">
                {answeredCount}
              </span>
            </div>
            <div className="p-2.5 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] flex items-center justify-between">
              <span className="text-[#575048] dark:text-[#CBC3B6] font-medium">Unanswered</span>
              <span className="font-mono font-semibold tabular-nums text-[#1E1B18] dark:text-[#F5F2EB]">
                {unansweredCount}
              </span>
            </div>
            <div className="p-2.5 rounded-lg border border-[#E6B17A]/60 bg-[#FBF3E4] dark:bg-[#2D2416] flex items-center justify-between">
              <span className="text-[#8C5A12] dark:text-[#E6B17A] font-medium">Marked</span>
              <span className="font-mono font-semibold tabular-nums text-[#8C5A12] dark:text-[#E6B17A]">
                {markedCount}
              </span>
            </div>
            <div className="p-2.5 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#24201C] flex items-center justify-between">
              <span className="text-[#787066] dark:text-[#9C9387] font-medium">Not Visited</span>
              <span className="font-mono font-semibold tabular-nums text-[#787066] dark:text-[#9C9387]">
                {notVisitedCount}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2" role="navigation" aria-label="Question numbers">
            {questions.map((q, idx) => {
              const hasAnswer = typeof answers[q.id] === 'number';
              const isRev = Boolean(markedForReview[q.id]);
              const isCurr = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => onNavigateIndex(idx)}
                  aria-label={`Question ${idx + 1}${hasAnswer ? ', answered' : ''}${isRev ? ', marked for review' : ''}`}
                  className={`relative h-9 rounded-lg border font-mono text-xs font-semibold tabular-nums transition-colors ${
                    isCurr
                      ? 'ring-2 ring-[#A64B33] dark:ring-[#D4785E] border-[#A64B33] dark:border-[#D4785E] bg-[#ECE6D9] dark:bg-[#2E2722] text-[#1E1B18] dark:text-[#F5F2EB]'
                      : isRev
                        ? 'bg-[#FBF3E4] dark:bg-[#2D2416] border-[#B7791F] dark:border-[#E6B17A] text-[#8C5A12] dark:text-[#E6B17A]'
                        : hasAnswer
                          ? 'bg-[#E8F0EA] dark:bg-[#1C2E22] border-[#3D6B4F] dark:border-[#7AB88F] text-[#23422F] dark:text-[#B6DFC3]'
                          : 'bg-[#F5F2EB] dark:bg-[#161412] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6]'
                  }`}
                >
                  {idx + 1}
                  {hasAnswer && isRev && (
                    <Flag
                      className="w-2.5 h-2.5 absolute top-0.5 right-0.5 text-[#3D6B4F] dark:text-[#7AB88F]"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="w-full py-2.5 px-4 rounded-lg bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Submit OMR Sheet
          </button>
        </aside>
      </div>

      {/* Submission Review Confirmation Modal */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="submit-omr-title"
          onClick={() => setConfirmOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#A64B33] dark:text-[#D4785E] shrink-0 mt-0.5" />
              <div>
                <h3
                  id="submit-omr-title"
                  className="text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB]"
                >
                  Confirm Final OMR Submission
                </h3>
                <p className="mt-1 text-xs text-[#575048] dark:text-[#CBC3B6] leading-relaxed">
                  Submitting locks this attempt for {studentName} and creates an immutable Practice Sheet snapshot alongside the human Marking Scheme.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono tabular-nums">
              <div className="p-2.5 rounded-lg bg-[#E8F0EA] dark:bg-[#1C2E22] text-[#23422F] dark:text-[#B6DFC3]">
                <span className="block text-base font-bold">{answeredCount}</span>
                <span>Answered</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F5F2EB] dark:bg-[#24201C] text-[#575048] dark:text-[#CBC3B6]">
                <span className="block text-base font-bold">{unansweredCount}</span>
                <span>Unanswered</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#FBF3E4] dark:bg-[#2D2416] text-[#8C5A12] dark:text-[#E6B17A]">
                <span className="block text-base font-bold">{markedCount}</span>
                <span>Marked</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6]"
              >
                Continue Test
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmOpen(false);
                  onSubmitExam();
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#3D6B4F] hover:bg-[#315940] text-white"
              >
                Lock &amp; View Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
