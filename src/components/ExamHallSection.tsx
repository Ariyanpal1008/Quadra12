import {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileCheck2,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import {EXAM_QUESTIONS, SUBJECTS, SubjectId} from '../data/pcmbData';
import {ExamDiagram} from './ExamDiagrams';
import {APPLE_EASE, APPLE_SPRING} from './FluidPrimitives';
import {playExamCompletionChime, playOmrBubbleSound} from '../utils/soundEffects';

interface ExamAttemptSummary {
  score: number;
  totalMarks: number;
  accuracy: number;
  timeTakenSeconds: number;
}

interface ExamHallSectionProps {
  initialSubjectId?: SubjectId;
  bestScores: Partial<Record<SubjectId, ExamAttemptSummary>>;
  onSaveAttempt: (subjectId: SubjectId, summary: ExamAttemptSummary) => void;
}

const THREE_HOURS_SECONDS = 3 * 60 * 60; // 03:00:00 (10,800 seconds)
const CBSE_OFFICIAL_SQP_PORTAL =
  'https://cbseacademic.nic.in/SQP_CLASSXII_2026-27.html';

function formatHms(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function ExamHallSection({
  initialSubjectId = 'physics',
  bestScores,
  onSaveAttempt,
}: ExamHallSectionProps) {
  const [selectedSubjectId, setSelectedSubjectId] =
    useState<SubjectId>(initialSubjectId);
  const [examPhase, setExamPhase] = useState<'lobby' | 'active' | 'review'>('lobby');
  const [secondsLeft, setSecondsLeft] = useState(THREE_HOURS_SECONDS);
  const [isPaused, setIsPaused] = useState(false);

  // Section A (Q1–Q16 / Q1–Q20) OMR answers
  const [omrAnswers, setOmrAnswers] = useState<Record<string, number>>({});
  // Sections B–E (Q17–Q33 / Q21–Q38) written completion checklist
  const [writtenDone, setWrittenDone] = useState<Record<number, boolean>>({});
  const [sheetTab, setSheetTab] = useState<'omr' | 'written'>('omr');
  const [roughNotes, setRoughNotes] = useState('');
  const [selfWrittenMarks, setSelfWrittenMarks] = useState<string>('');
  const [lastAttempt, setLastAttempt] = useState<ExamAttemptSummary | null>(null);

  useEffect(() => {
    setSelectedSubjectId(initialSubjectId);
  }, [initialSubjectId]);

  const activeSubject =
    SUBJECTS.find((s) => s.id === selectedSubjectId) ?? SUBJECTS[0];
  const sectionAQuestions = EXAM_QUESTIONS.filter(
    (q) => q.subjectId === selectedSubjectId,
  );

  const writtenStartQ = activeSubject.sectionACount + 1;
  const writtenQuestionNumbers = Array.from(
    {length: activeSubject.totalSqpQuestions - activeSubject.sectionACount},
    (_, idx) => writtenStartQ + idx,
  );
  const maxWrittenMarks =
    activeSubject.boardTheoryMarks - activeSubject.sectionACount;

  const finalizeExam = () => {
    let sectionAScore = 0;
    sectionAQuestions.forEach((q) => {
      if (omrAnswers[q.id] === q.correctIndex) {
        sectionAScore += q.marks;
      }
    });

    const hasSelfWrittenMarks = selfWrittenMarks.trim() !== '';
    const parsedWritten = Math.min(
      maxWrittenMarks,
      Math.max(0, Number(selfWrittenMarks) || 0),
    );
    const totalScore = sectionAScore + parsedWritten;
    const totalMarks = activeSubject.boardTheoryMarks;
    const accuracy = Math.round((sectionAScore / sectionAQuestions.length) * 100);
    const timeTakenSeconds = THREE_HOURS_SECONDS - secondsLeft;

    const summary: ExamAttemptSummary = {
      score: sectionAScore,
      totalMarks: sectionAQuestions.length,
      accuracy,
      timeTakenSeconds: Math.max(1, timeTakenSeconds),
    };
    setLastAttempt({
      ...summary,
      score: hasSelfWrittenMarks ? totalScore : sectionAScore,
      totalMarks: hasSelfWrittenMarks ? totalMarks : sectionAQuestions.length,
    });
    onSaveAttempt(selectedSubjectId, summary);
    setExamPhase('review');
  };

  useEffect(() => {
    if (examPhase !== 'active' || isPaused) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [examPhase, isPaused]);

  useEffect(() => {
    if (examPhase === 'active' && secondsLeft <= 0) {
      playExamCompletionChime();
      finalizeExam();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examPhase, secondsLeft]);

  const startThreeHourExam = (subjectId: SubjectId) => {
    setSelectedSubjectId(subjectId);
    setSecondsLeft(THREE_HOURS_SECONDS);
    setIsPaused(false);
    setOmrAnswers({});
    setWrittenDone({});
    setSheetTab('omr');
    setRoughNotes('');
    setSelfWrittenMarks('');
    setLastAttempt(null);
    setExamPhase('active');
  };

  if (examPhase === 'lobby') {
    return (
      <section aria-labelledby="exam-hall-heading" className="space-y-8">
        <div className="relative overflow-hidden bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-6 sm:p-8 space-y-6 apple-surface">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 text-xs font-medium tracking-[0.12em] text-[#A64B33] dark:text-[#D4785E]">
                <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                  <span className="live-beacon-ring absolute inline-flex h-full w-full rounded-full bg-[#A64B33] dark:bg-[#D4785E]" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A64B33] dark:bg-[#D4785E]" />
                </span>
                <span>Official CBSE Class XII Sample Question Papers · Session 2026–27</span>
              </div>
              <h1
                id="exam-hall-heading"
                className="mt-2.5 text-2xl sm:text-3xl font-semibold tracking-tight text-[#1E1B18] dark:text-[#F5F2EB]"
              >
                3-Hour{' '}
                <em className="italic font-medium text-[#A64B33] dark:text-[#D4785E]">
                  Examination Hall
                </em>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-[#575048] dark:text-[#CBC3B6]">
                Write the full, unmodified 3-hour CBSE 2026–27 Sample Question Paper.
                The original official CBSE PDF is embedded directly inside the exam desk
                alongside an interactive 33/38-question OMR &amp; written checklist.
              </p>
            </div>

            <a
              href={CBSE_OFFICIAL_SQP_PORTAL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-[#1E1B18] dark:text-[#F5F2EB] bg-[#F5F2EB] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] hover:bg-[#ECE6D9] dark:hover:bg-[#332E28] rounded-lg transition-colors whitespace-nowrap shrink-0 self-start"
            >
              <ShieldCheck className="w-4 h-4 text-[#3D6B4F] dark:text-[#7AB88F]" aria-hidden="true" />
              <span>Verify on Official CBSE Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#787066] dark:text-[#9C9387]" aria-hidden="true" />
            </a>
          </div>

          <div className="pt-6 border-t border-[#DDD6C7] dark:border-[#332E28] grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-xs text-[#787066] dark:text-[#9C9387]">Official Duration</p>
              <p className="mt-1 font-medium text-[#1E1B18] dark:text-[#F5F2EB] font-mono tabular-nums">
                03:00:00 (Full 3 Hours)
              </p>
            </div>
            <div>
              <p className="text-xs text-[#787066] dark:text-[#9C9387]">Question Paper Integrity</p>
              <p className="mt-1 font-medium text-[#1E1B18] dark:text-[#F5F2EB]">
                Unmodified Original CBSE 2026–27 PDFs
              </p>
            </div>
            <div>
              <p className="text-xs text-[#787066] dark:text-[#9C9387]">Sections Included</p>
              <p className="mt-1 font-medium text-[#1E1B18] dark:text-[#F5F2EB]">
                All Sections A, B, C, D &amp; E (33 / 38 Qs)
              </p>
            </div>
          </div>
        </div>

        {/* 4 Full 3-Hour Subject Paper Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SUBJECTS.map((subject, idx) => {
            const best = bestScores[subject.id];

            return (
              <motion.div
                key={subject.id}
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, amount: 0.06}}
                whileHover={{y: -4}}
                transition={{
                  duration: 0.42,
                  delay: idx * 0.05,
                  ease: APPLE_EASE,
                  y: APPLE_SPRING,
                }}
                className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] hover:border-[#A64B33]/65 dark:hover:border-[#D4785E]/65 rounded-xl p-6 flex flex-col justify-between gap-6 apple-surface"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-[#787066] dark:text-[#9C9387] font-mono tabular-nums">
                      Code {subject.code} · {subject.totalSqpQuestions} Questions ·{' '}
                      {subject.boardTheoryMarks} Marks
                    </span>
                    {best && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#3D6B4F] dark:text-[#7AB88F] font-mono tabular-nums">
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>
                          Sec A Best: {best.score}/{best.totalMarks}
                        </span>
                      </span>
                    )}
                  </div>

                  <h2 className="mt-2.5 text-xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                    {subject.name} Official 2026–27 SQP
                  </h2>
                  <p className="mt-1.5 text-sm text-[#575048] dark:text-[#CBC3B6]">
                    Full 3-hour paper embedded verbatim from CBSE (Sections A–E,{' '}
                    {subject.totalSqpQuestions} compulsory questions with internal
                    choices) plus interactive Section A OMR grading.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#DDD6C7] dark:border-[#332E28] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4 text-xs">
                    <a
                      href={subject.samplePaperPdfUrl}
                      download
                      className="inline-flex items-center gap-1 font-medium text-[#575048] dark:text-[#CBC3B6] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB]"
                    >
                      <Download className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Download PDF</span>
                    </a>
                    <a
                      href={CBSE_OFFICIAL_SQP_PORTAL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-[#575048] dark:text-[#CBC3B6] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB]"
                    >
                      <span>cbseacademic.nic.in</span>
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  </div>

                  <motion.button
                    type="button"
                    whileTap={{scale: 0.97}}
                    onClick={() => startThreeHourExam(subject.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#F5F2EB] dark:text-[#1E1B18] bg-[#1E1B18] hover:bg-[#332E28] dark:bg-[#F5F2EB] dark:hover:bg-[#E8E2D5] rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A64B33]"
                  >
                    <FileCheck2 className="w-4 h-4" aria-hidden="true" />
                    <span>Start 3-Hour Paper</span>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    );
  }

  if (examPhase === 'active') {
    const omrAnsweredCount = sectionAQuestions.filter(
      (q) => omrAnswers[q.id] !== undefined && omrAnswers[q.id] !== -1,
    ).length;
    const writtenDoneCount = writtenQuestionNumbers.filter(
      (n) => writtenDone[n],
    ).length;
    const totalTrackedDone = omrAnsweredCount + writtenDoneCount;
    const isLowTime = secondsLeft <= 15 * 60;

    return (
      <section aria-label="3-Hour Examination Hall" className="space-y-5">
        {/* Top 3-Hour Exam Hall Control Bar */}
        <div className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl px-5 py-4 flex flex-wrap items-center justify-between gap-4 transition-colors duration-200">
          <div>
            <p className="text-xs text-[#787066] dark:text-[#9C9387]">
              Official CBSE 2026–27 Question Paper · Code {activeSubject.code} ·{' '}
              {activeSubject.boardTheoryMarks} Marks
            </p>
            <h1 className="text-lg sm:text-xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
              {activeSubject.name} — Full 3-Hour Examination Hall
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="text-right pr-2">
              <p className="text-xs text-[#787066] dark:text-[#9C9387]">Tracked Progress</p>
              <p className="text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB] font-mono tabular-nums">
                {totalTrackedDone} / {activeSubject.totalSqpQuestions} Qs
              </p>
            </div>

            <div
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border font-mono tabular-nums text-sm font-semibold ${
                isLowTime
                  ? 'bg-[#FBF0ED] dark:bg-[#3A1E18] border-[#E0B0A4] dark:border-[#7A3528] text-[#B33A2B] dark:text-[#F09986]'
                  : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#1E1B18] dark:text-[#F5F2EB]'
              }`}
              aria-live="off"
            >
              <Clock className="w-4 h-4" aria-hidden="true" />
              <span>{formatHms(secondsLeft)}</span>
            </div>

            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#1E1B18] dark:text-[#F5F2EB] bg-[#F5F2EB] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] hover:bg-[#ECE6D9] dark:hover:bg-[#332E28] rounded-lg whitespace-nowrap"
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Pause</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={finalizeExam}
              className="px-4 py-2 text-xs font-medium text-[#F5F2EB] bg-[#3D6B4F] hover:bg-[#315940] rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Submit 3-Hour Paper
            </button>
          </div>
        </div>

        {/* Two-Zone 3-Hour Exam Workspace: Embedded Official CBSE PDF + Full 33/38 Q Response Sheet */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Zone: Exact Embedded Official CBSE 2026-27 PDF */}
          <div className="lg:col-span-8 bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl overflow-hidden flex flex-col">
            <div className="px-5 py-3 bg-[#F5F2EB] dark:bg-[#24201C] border-b border-[#DDD6C7] dark:border-[#332E28] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-[#575048] dark:text-[#CBC3B6]">
                <ShieldCheck className="w-4 h-4 text-[#3D6B4F] dark:text-[#7AB88F]" aria-hidden="true" />
                <span className="font-medium text-[#1E1B18] dark:text-[#F5F2EB]">
                  Original CBSE 2026–27 Official PDF ({activeSubject.totalSqpQuestions}{' '}
                  Questions)
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <a
                  href={activeSubject.samplePaperPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-[#1E1B18] dark:text-[#F5F2EB] hover:text-[#A64B33] dark:hover:text-[#D4785E]"
                >
                  <span>Open PDF</span>
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
                <a
                  href={activeSubject.samplePaperPdfUrl}
                  download
                  className="inline-flex items-center gap-1 font-medium text-[#A64B33] dark:text-[#D4785E] hover:underline"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Download</span>
                </a>
                <a
                  href={CBSE_OFFICIAL_SQP_PORTAL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-[#575048] dark:text-[#CBC3B6] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB]"
                >
                  <span>Official CBSE Site</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="flex-1 min-h-[760px] bg-[#ECE6D9] dark:bg-[#24201C]">
              <iframe
                src={activeSubject.samplePaperPdfUrl}
                title={`Official CBSE 2026-27 ${activeSubject.name} Question Paper PDF`}
                className="w-full h-[760px] border-0"
              />
            </div>
          </div>

          {/* Right Zone: Full 33 / 38 Question Response & OMR Sheet */}
          <aside className="lg:col-span-4 bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl flex flex-col max-h-[812px]">
            <div className="p-4 border-b border-[#DDD6C7] dark:border-[#332E28] space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                  Answer Sheet ({activeSubject.totalSqpQuestions} Qs)
                </h2>
                <button
                  type="button"
                  onClick={() => setExamPhase('lobby')}
                  className="text-xs font-medium text-[#787066] dark:text-[#9C9387] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB]"
                >
                  Exit Hall
                </button>
              </div>

              <div
                role="group"
                aria-label="Answer sheet sections"
                className="grid grid-cols-2 gap-1 p-1 bg-[#ECE6D9] dark:bg-[#24201C] rounded-lg"
              >
                <button
                  type="button"
                  onClick={() => setSheetTab('omr')}
                  className={`py-1.5 px-2 text-xs font-medium rounded-md transition-colors ${
                    sheetTab === 'omr'
                      ? 'bg-[#FAF8F3] dark:bg-[#1E1B18] text-[#1E1B18] dark:text-[#F5F2EB] shadow-xs'
                      : 'text-[#575048] dark:text-[#9C9387] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB]'
                  }`}
                >
                  Sec A OMR ({omrAnsweredCount}/{sectionAQuestions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSheetTab('written')}
                  className={`py-1.5 px-2 text-xs font-medium rounded-md transition-colors ${
                    sheetTab === 'written'
                      ? 'bg-[#FAF8F3] dark:bg-[#1E1B18] text-[#1E1B18] dark:text-[#F5F2EB] shadow-xs'
                      : 'text-[#575048] dark:text-[#9C9387] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB]'
                  }`}
                >
                  Sec B–E ({writtenDoneCount}/{writtenQuestionNumbers.length})
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <AnimatePresence mode="wait">
                {sheetTab === 'omr' ? (
                  <motion.div
                    key="omr-tab"
                    initial={{opacity: 0, x: -6}}
                    animate={{opacity: 1, x: 0}}
                    exit={{opacity: 0, x: 6}}
                    transition={{duration: 0.16, ease: [0.16, 1, 0.3, 1]}}
                    className="space-y-3"
                  >
                    <p className="text-xs text-[#787066] dark:text-[#9C9387]">
                      Bubble your Section A answers (Q1–Q{sectionAQuestions.length}) as
                      you read the CBSE PDF on the left. Auto-graded upon submission.
                    </p>
                    <div className="divide-y divide-[#DDD6C7] dark:divide-[#332E28] border border-[#DDD6C7] dark:border-[#332E28] rounded-lg">
                      {sectionAQuestions.map((q) => {
                        const chosen = omrAnswers[q.id];
                        return (
                          <div
                            key={q.id}
                            className="flex items-center justify-between gap-2 px-3 py-2.5"
                          >
                            <span className="font-mono text-xs font-semibold text-[#1E1B18] dark:text-[#F5F2EB] w-10 tabular-nums">
                              Q{String(q.questionNumber).padStart(2, '0')}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {['A', 'B', 'C', 'D'].map((letter, idx) => {
                                const active = chosen === idx;
                                return (
                                  <motion.button
                                    key={letter}
                                    type="button"
                                    whileTap={{scale: 0.92}}
                                    aria-label={`Question ${q.questionNumber} option ${letter}`}
                                    aria-pressed={active}
                                    onClick={() => {
                                      playOmrBubbleSound();
                                      setOmrAnswers((prev) => ({
                                        ...prev,
                                        [q.id]: active ? -1 : idx,
                                      }));
                                    }}
                                    className={`w-8 h-8 rounded-md font-mono text-xs font-semibold border transition-colors ${
                                      active
                                        ? 'bg-[#A64B33] dark:bg-[#D4785E] border-[#A64B33] dark:border-[#D4785E] text-[#F5F2EB] dark:text-[#1E1B18]'
                                        : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6] hover:bg-[#ECE6D9] dark:hover:bg-[#332E28]'
                                    }`}
                                  >
                                    {letter}
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="written-tab"
                    initial={{opacity: 0, x: 6}}
                    animate={{opacity: 1, x: 0}}
                    exit={{opacity: 0, x: -6}}
                    transition={{duration: 0.16, ease: [0.16, 1, 0.3, 1]}}
                    className="space-y-3"
                  >
                    <p className="text-xs text-[#787066] dark:text-[#9C9387]">
                      Write Sections B–E answers (Q{writtenStartQ}–Q
                      {activeSubject.totalSqpQuestions}) on your physical answer booklet
                      and check each completed question below.
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {writtenQuestionNumbers.map((qNum) => {
                        const done = Boolean(writtenDone[qNum]);
                        return (
                          <motion.button
                            key={qNum}
                            type="button"
                            whileTap={{scale: 0.95}}
                            aria-pressed={done}
                            onClick={() =>
                              setWrittenDone((prev) => ({
                                ...prev,
                                [qNum]: !prev[qNum],
                              }))
                            }
                            className={`py-2 px-2 rounded-lg border font-mono text-xs font-semibold tabular-nums flex items-center justify-center gap-1 transition-colors ${
                              done
                                ? 'bg-[#E8F0EA] dark:bg-[#1C2E22] border-[#3D6B4F] dark:border-[#7AB88F] text-[#23422F] dark:text-[#B6DFC3]'
                                : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6] hover:bg-[#ECE6D9] dark:hover:bg-[#332E28]'
                            }`}
                          >
                            {done && (
                              <CheckCircle2
                                className="w-3.5 h-3.5 shrink-0"
                                aria-hidden="true"
                              />
                            )}
                            <span>Q{qNum}</span>
                          </motion.button>
                        );
                      })}
                    </div>

                    <div className="pt-3">
                      <label
                        htmlFor="exam-rough-notes"
                        className="block text-xs font-medium text-[#1E1B18] dark:text-[#F5F2EB] mb-1.5"
                      >
                        Rough Work / Formula Scratchpad
                      </label>
                      <textarea
                        id="exam-rough-notes"
                        rows={5}
                        value={roughNotes}
                        onChange={(e) => setRoughNotes(e.target.value)}
                        placeholder="Jot intermediate values, constants, or questions to revisit..."
                        className="w-full p-3 text-xs bg-[#F5F2EB] dark:bg-[#161412] border border-[#DDD6C7] dark:border-[#332E28] rounded-lg text-[#1E1B18] dark:text-[#F5F2EB] placeholder:text-[#968E83] dark:placeholder:text-[#787066] focus-visible:outline-2 focus-visible:outline-[#A64B33]"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-4 border-t border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB]/80 dark:bg-[#24201C] space-y-2.5">
              <div className="flex items-center justify-between gap-2 text-xs">
                <label htmlFor="self-written-marks" className="text-[#575048] dark:text-[#CBC3B6]">
                  Self-Check Sec B–E (/{maxWrittenMarks}M, optional)
                </label>
                <input
                  id="self-written-marks"
                  type="number"
                  min={0}
                  max={maxWrittenMarks}
                  value={selfWrittenMarks}
                  onChange={(e) => setSelfWrittenMarks(e.target.value)}
                  placeholder="0"
                  className="w-16 px-2 py-1 text-right font-mono text-xs bg-[#FAF8F3] dark:bg-[#1E1B18] text-[#1E1B18] dark:text-[#F5F2EB] border border-[#DDD6C7] dark:border-[#332E28] rounded-md"
                />
              </div>

              <button
                type="button"
                onClick={finalizeExam}
                className="w-full py-2.5 px-4 text-xs font-medium text-[#F5F2EB] bg-[#3D6B4F] hover:bg-[#315940] rounded-lg transition-colors"
              >
                Submit &amp; Check Section A Answers
              </button>
            </div>
          </aside>
        </div>
      </section>
    );
  }

  // Review & Marking Scheme Screen
  const writtenCompletedCount = writtenQuestionNumbers.filter(
    (n) => writtenDone[n],
  ).length;
  const sectionAScoreCount = sectionAQuestions.filter(
    (q) => omrAnswers[q.id] === q.correctIndex,
  ).length;

  return (
    <section aria-labelledby="exam-review-heading" className="space-y-8">
      <div className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-6 sm:p-8 transition-colors duration-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 text-xs font-medium tracking-[0.12em] text-[#A64B33] dark:text-[#D4785E]">
              <span className="w-5 h-px bg-[#A64B33] dark:bg-[#D4785E] shrink-0" aria-hidden="true" />
              <span>
                Official CBSE 2026–27 SQP Evaluation · {activeSubject.name} ({activeSubject.code})
              </span>
            </div>
            <h1
              id="exam-review-heading"
              className="mt-2.5 text-2xl sm:text-3xl font-semibold tracking-tight text-[#1E1B18] dark:text-[#F5F2EB]"
            >
              3-Hour Exam Summary &amp; Section A Marking Scheme
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={CBSE_OFFICIAL_SQP_PORTAL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#1E1B18] dark:text-[#F5F2EB] bg-[#F5F2EB] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] hover:bg-[#ECE6D9] dark:hover:bg-[#332E28] rounded-lg whitespace-nowrap"
            >
              <span>Official CBSE Marking Scheme</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={() => startThreeHourExam(selectedSubjectId)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#F5F2EB] dark:text-[#1E1B18] bg-[#1E1B18] hover:bg-[#332E28] dark:bg-[#F5F2EB] dark:hover:bg-[#E8E2D5] rounded-lg transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Retake 3-Hour Paper</span>
            </button>
            <button
              type="button"
              onClick={() => setExamPhase('lobby')}
              className="px-4 py-2 text-xs font-medium text-[#575048] dark:text-[#CBC3B6] bg-[#FAF8F3] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB] rounded-lg transition-colors whitespace-nowrap"
            >
              All 2026–27 Papers
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-[#DDD6C7] dark:border-[#332E28] grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-[#787066] dark:text-[#9C9387]">Section A OMR Score</p>
            <p className="mt-1 text-2xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB] font-mono tabular-nums">
              {sectionAScoreCount} / {sectionAQuestions.length}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#787066] dark:text-[#9C9387]">Written Qs Checked (B–E)</p>
            <p className="mt-1 text-2xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB] font-mono tabular-nums">
              {writtenCompletedCount} / {writtenQuestionNumbers.length}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#787066] dark:text-[#9C9387]">
              {selfWrittenMarks.trim() !== '' ? 'Total Self-Evaluated' : 'Section A Accuracy'}
            </p>
            <p className="mt-1 text-2xl font-semibold text-[#A64B33] dark:text-[#D4785E] font-mono tabular-nums">
              {selfWrittenMarks.trim() !== '' && lastAttempt
                ? `${lastAttempt.score} / ${lastAttempt.totalMarks}`
                : `${lastAttempt?.accuracy ?? 0}%`}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#787066] dark:text-[#9C9387]">Time Elapsed (of 03:00:00)</p>
            <p className="mt-1 text-2xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB] font-mono tabular-nums">
              {formatHms(lastAttempt?.timeTakenSeconds ?? 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Section A Question-by-Question Official Answers */}
      <div className="space-y-4">
        {sectionAQuestions.map((q) => {
          const userChoice = omrAnswers[q.id];
          const isCorrect = userChoice === q.correctIndex;
          const isUnanswered = userChoice === undefined || userChoice === -1;

          return (
            <motion.div
              key={q.id}
              initial={{opacity: 0, y: 14}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, amount: 0.05}}
              transition={{duration: 0.28, ease: APPLE_EASE}}
              className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-6 space-y-4 transition-colors duration-200"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#787066] dark:text-[#9C9387]">
                  <span className="font-mono font-semibold text-[#1E1B18] dark:text-[#F5F2EB] tabular-nums">
                    Q{String(q.questionNumber).padStart(2, '0')}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{q.section}</span>
                  <span aria-hidden="true">·</span>
                  <span>{q.questionType}</span>
                </div>

                {isCorrect ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3D6B4F] dark:text-[#7AB88F]">
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    <span>Correct (+1 Mark)</span>
                  </span>
                ) : isUnanswered ? (
                  <span className="text-xs font-semibold text-[#787066] dark:text-[#9C9387]">
                    Unattempted (0 Marks)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B33A2B] dark:text-[#F09986]">
                    <XCircle className="w-4 h-4" aria-hidden="true" />
                    <span>Incorrect (0 Marks)</span>
                  </span>
                )}
              </div>

              <p className="text-sm sm:text-base font-medium text-[#1E1B18] dark:text-[#F5F2EB]">
                {q.prompt}
              </p>

              {q.diagramId && <ExamDiagram diagramId={q.diagramId} />}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm">
                {q.options.map((opt, oIdx) => {
                  const isAnswerOption = oIdx === q.correctIndex;
                  const isUserPick = oIdx === userChoice;
                  let rowStyle =
                    'border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[#575048] dark:text-[#CBC3B6]';
                  if (isAnswerOption) {
                    rowStyle =
                      'border-[#3D6B4F] dark:border-[#7AB88F] bg-[#E8F0EA] dark:bg-[#1C2E22] text-[#23422F] dark:text-[#B6DFC3] font-medium';
                  } else if (isUserPick && !isCorrect) {
                    rowStyle =
                      'border-[#E0B0A4] dark:border-[#7A3528] bg-[#FBF0ED] dark:bg-[#3A1E18] text-[#B33A2B] dark:text-[#F09986]';
                  }

                  return (
                    <div
                      key={opt}
                      className={`px-3.5 py-2.5 rounded-lg border flex items-center justify-between gap-2 ${rowStyle}`}
                    >
                      <span>
                        <strong className="font-mono mr-2">
                          {String.fromCharCode(65 + oIdx)}.
                        </strong>
                        {opt}
                      </span>
                      {isAnswerOption && (
                        <span className="text-xs font-semibold shrink-0">Answer</span>
                      )}
                      {isUserPick && !isAnswerOption && (
                        <span className="text-xs font-semibold shrink-0">Your Pick</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-[#DDD6C7] dark:border-[#332E28] text-sm text-[#575048] dark:text-[#CBC3B6]">
                <span className="font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                  CBSE Marking Scheme:{' '}
                </span>
                {q.markingScheme}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
