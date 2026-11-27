import {useMemo, useState} from 'react';
import {
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  Filter,
  RotateCcw,
  Target,
  XCircle,
} from 'lucide-react';
import {SUBJECTS, type SubjectId} from '../../data/pcmbData';
import type {
  DifficultyLevel,
  PracticeQuestionAttempt,
  QuestionCategory,
  VerifiedQuestion,
} from '../../data/v3Types';
import {ALL_VERIFIED_QUESTIONS} from '../../data/questionBank';
import {ExamDiagram} from '../ExamDiagrams';
import {playOmrBubbleSound} from '../../utils/soundEffects';

type PracticeSubMode =
  | 'chapter'
  | 'topic'
  | 'mixed'
  | 'incorrect'
  | 'history';

interface PracticeModeViewProps {
  subjectId: SubjectId;
  onSelectSubject: (subjectId: SubjectId) => void;
  studentName: string;
  practiceHistory: PracticeQuestionAttempt[];
  onRecordPracticeAttempt: (entry: PracticeQuestionAttempt) => void;
  onOpenChapterInTracker: (subjectId: SubjectId, chapterId: string) => void;
}

export function PracticeModeView({
  subjectId,
  onSelectSubject,
  studentName,
  practiceHistory,
  onRecordPracticeAttempt,
  onOpenChapterInTracker,
}: PracticeModeViewProps) {
  const [practiceMode, setPracticeMode] = useState<PracticeSubMode>('chapter');
  const [chapterFilter, setChapterFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | DifficultyLevel>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | QuestionCategory>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [localPicks, setLocalPicks] = useState<Record<string, number>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  const subjectQuestions = useMemo(
    () => ALL_VERIFIED_QUESTIONS.filter((q) => q.subjectId === subjectId),
    [subjectId],
  );

  const subjectChapters = useMemo(
    () => SUBJECTS.find((s) => s.id === subjectId)?.chapters ?? [],
    [subjectId],
  );

  const availableTopics = useMemo(() => {
    const base =
      chapterFilter === 'all'
        ? subjectQuestions
        : subjectQuestions.filter((q) => q.chapterId === chapterFilter);
    return Array.from(new Set(base.map((q) => q.topic))).sort();
  }, [subjectQuestions, chapterFilter]);

  const availableCategories = useMemo(
    () => Array.from(new Set(subjectQuestions.map((q) => q.questionType))).sort(),
    [subjectQuestions],
  );

  const incorrectQuestionIds = useMemo(() => {
    const latestById = new Map<string, PracticeQuestionAttempt>();
    for (const item of practiceHistory) {
      if (item.subjectId === subjectId && !latestById.has(item.questionId)) {
        latestById.set(item.questionId, item);
      }
    }
    return new Set(
      Array.from(latestById.values())
        .filter((it) => !it.isCorrect)
        .map((it) => it.questionId),
    );
  }, [practiceHistory, subjectId]);

  const filteredQuestions = useMemo<VerifiedQuestion[]>(() => {
    return subjectQuestions.filter((q) => {
      if (practiceMode === 'incorrect' && !incorrectQuestionIds.has(q.id)) {
        return false;
      }
      if (chapterFilter !== 'all' && q.chapterId !== chapterFilter) return false;
      if (topicFilter !== 'all' && q.topic !== topicFilter) return false;
      if (difficultyFilter !== 'all' && q.difficulty !== difficultyFilter) return false;
      if (categoryFilter !== 'all' && q.questionType !== categoryFilter) return false;
      return true;
    });
  }, [
    subjectQuestions,
    practiceMode,
    incorrectQuestionIds,
    chapterFilter,
    topicFilter,
    difficultyFilter,
    categoryFilter,
  ]);

  const safeIndex = Math.min(activeIndex, Math.max(0, filteredQuestions.length - 1));
  const currentQ = filteredQuestions[safeIndex];
  const currentPick = currentQ ? localPicks[currentQ.id] : undefined;
  const solutionVisible = currentQ ? Boolean(revealedSolutions[currentQ.id]) : false;

  const subjectHistory = useMemo(
    () => practiceHistory.filter((item) => item.subjectId === subjectId),
    [practiceHistory, subjectId],
  );

  const handleSubjectSwitch = (nextSub: SubjectId) => {
    onSelectSubject(nextSub);
    setChapterFilter('all');
    setTopicFilter('all');
    setDifficultyFilter('all');
    setCategoryFilter('all');
    setActiveIndex(0);
  };

  const handlePickOption = (q: VerifiedQuestion, optionIndex: number) => {
    playOmrBubbleSound();
    setLocalPicks((prev) => ({...prev, [q.id]: optionIndex}));
    setRevealedSolutions((prev) => ({...prev, [q.id]: true}));
    onRecordPracticeAttempt({
      questionId: q.id,
      subjectId: q.subjectId,
      chapterId: q.chapterId,
      selectedIndex: optionIndex,
      isCorrect: optionIndex === q.correctIndex,
      attemptedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Practice Filters & Sub-Mode Header */}
      <div className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-mono text-[#A64B33] dark:text-[#D4785E]">
              Practice Question Bank · Profile: {studentName}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
              Practice Mode &amp; Topic Mastery
            </h2>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {SUBJECTS.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => handleSubjectSwitch(sub.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  sub.id === subjectId
                    ? 'bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] border-[#1E1B18] dark:border-[#F5F2EB]'
                    : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6]'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>

        {/* Practice Mode Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-t border-b border-[#DDD6C7] dark:border-[#332E28] py-3">
          {(
            [
              {id: 'chapter', label: 'Chapter Practice'},
              {id: 'topic', label: 'Topic Practice'},
              {id: 'mixed', label: 'Mixed Mock Practice'},
              {
                id: 'incorrect',
                label: `Incorrect Revision (${incorrectQuestionIds.size})`,
              },
              {
                id: 'history',
                label: `Previous Attempts (${subjectHistory.length})`,
              },
            ] as {id: PracticeSubMode; label: string}[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setPracticeMode(tab.id);
                setActiveIndex(0);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                practiceMode === tab.id
                  ? 'bg-[#ECE6D9] dark:bg-[#2C2520] border-[#A64B33] dark:border-[#D4785E] text-[#A64B33] dark:text-[#D4785E]'
                  : 'bg-[#F5F2EB] dark:bg-[#161412] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        {practiceMode !== 'history' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <label className="text-xs space-y-1">
              <span className="text-[#787066] dark:text-[#9C9387] font-medium block">
                Chapter Filter
              </span>
              <select
                value={chapterFilter}
                onChange={(e) => {
                  setChapterFilter(e.target.value);
                  setTopicFilter('all');
                  setActiveIndex(0);
                }}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] text-[#1E1B18] dark:text-[#F5F2EB]"
              >
                <option value="all">All Chapters ({subjectChapters.length})</option>
                {subjectChapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    Ch {ch.number}: {ch.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs space-y-1">
              <span className="text-[#787066] dark:text-[#9C9387] font-medium block">
                Topic Filter
              </span>
              <select
                value={topicFilter}
                onChange={(e) => {
                  setTopicFilter(e.target.value);
                  setActiveIndex(0);
                }}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] text-[#1E1B18] dark:text-[#F5F2EB]"
              >
                <option value="all">All Topics ({availableTopics.length})</option>
                {availableTopics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs space-y-1">
              <span className="text-[#787066] dark:text-[#9C9387] font-medium block">
                Difficulty
              </span>
              <select
                value={difficultyFilter}
                onChange={(e) => {
                  setDifficultyFilter(e.target.value as 'all' | DifficultyLevel);
                  setActiveIndex(0);
                }}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] text-[#1E1B18] dark:text-[#F5F2EB]"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Difficult">Difficult</option>
                <option value="Very Difficult">Very Difficult</option>
              </select>
            </label>

            <label className="text-xs space-y-1">
              <span className="text-[#787066] dark:text-[#9C9387] font-medium block">
                Question Category
              </span>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value as 'all' | QuestionCategory);
                  setActiveIndex(0);
                }}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] text-[#1E1B18] dark:text-[#F5F2EB]"
              >
                <option value="all">All Categories</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>

      {/* Previous-Attempt Review Sub-View */}
      {practiceMode === 'history' ? (
        <div className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
              Practice History — {studentName}
            </h3>
            <span className="text-xs font-mono tabular-nums text-[#787066] dark:text-[#9C9387]">
              {subjectHistory.length} Logged Responses
            </span>
          </div>

          {subjectHistory.length === 0 ? (
            <p className="text-sm text-[#575048] dark:text-[#CBC3B6] py-6 text-center">
              No practice questions answered in this subject for {studentName} yet. Answer any question in Chapter or Topic Practice to log accuracy here.
            </p>
          ) : (
            <div className="divide-y divide-[#DDD6C7] dark:divide-[#332E28]">
              {subjectHistory.slice(0, 40).map((entry, idx) => {
                const q = subjectQuestions.find((item) => item.id === entry.questionId);
                if (!q) return null;
                return (
                  <div
                    key={`${entry.questionId}-${entry.attemptedAt}-${idx}`}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-mono text-[#787066] dark:text-[#9C9387]">
                        {q.chapterTitle} · {q.topic} · Selected (
                        {String.fromCharCode(65 + entry.selectedIndex)})
                      </p>
                      <p className="text-sm text-[#1E1B18] dark:text-[#F5F2EB] truncate">
                        {q.prompt}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold shrink-0 ${
                        entry.isCorrect
                          ? 'text-[#3D6B4F] dark:text-[#7AB88F]'
                          : 'text-[#B43C2E] dark:text-[#E57B6E]'
                      }`}
                    >
                      {entry.isCorrect ? (
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                      <span>
                        {entry.isCorrect
                          ? 'Correct'
                          : `Incorrect (Key ${String.fromCharCode(65 + q.correctIndex)})`}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : filteredQuestions.length === 0 || !currentQ ? (
        <div className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-8 text-center space-y-3">
          <Filter className="w-6 h-6 text-[#A64B33] dark:text-[#D4785E] mx-auto" />
          <p className="text-sm font-medium text-[#1E1B18] dark:text-[#F5F2EB]">
            No questions match the current filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setPracticeMode('chapter');
              setChapterFilter('all');
              setTopicFilter('all');
              setDifficultyFilter('all');
              setCategoryFilter('all');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] text-[#A64B33] dark:text-[#D4785E]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <div className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-6 sm:p-7 space-y-5">
          {/* Question Navigator & Metadata Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#DDD6C7] dark:border-[#332E28]">
            <div className="space-y-0.5">
              <p className="text-xs font-mono text-[#787066] dark:text-[#9C9387] tabular-nums">
                Practice Item {safeIndex + 1} of {filteredQuestions.length} ·{' '}
                {currentQ.chapterTitle}
              </p>
              <p className="text-xs text-[#A64B33] dark:text-[#D4785E] font-medium">
                {currentQ.topic} · {currentQ.difficulty} · {currentQ.questionType} ·{' '}
                {currentQ.highYieldTag}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setRevealedSolutions((prev) => ({
                    ...prev,
                    [currentQ.id]: !prev[currentQ.id],
                  }))
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB]"
              >
                {solutionVisible ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Hide Solution</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Show Solution</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onOpenChapterInTracker(currentQ.subjectId, currentQ.chapterId)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[#575048] dark:text-[#CBC3B6] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB]"
              >
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Open Chapter Study</span>
              </button>
            </div>
          </div>

          <p className="text-base sm:text-[17px] leading-relaxed font-medium text-[#1E1B18] dark:text-[#F5F2EB] whitespace-pre-line">
            {currentQ.prompt}
          </p>

          {currentQ.diagramRefId && (
            <div className="p-3 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-white">
              <ExamDiagram diagramId={currentQ.diagramRefId} />
            </div>
          )}

          {/* Options with Immediate Practice Verification */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, oIdx) => {
              const letter = String.fromCharCode(65 + oIdx);
              const picked = currentPick === oIdx;
              const isCorrectOption = oIdx === currentQ.correctIndex;
              const showStatus = currentPick !== undefined || solutionVisible;

              let rowClasses =
                'bg-[#F5F2EB] dark:bg-[#161412] border-[#DDD6C7] dark:border-[#332E28] text-[#1E1B18] dark:text-[#F5F2EB]';
              if (showStatus && isCorrectOption) {
                rowClasses =
                  'bg-[#E8F0EA] dark:bg-[#1C2E22] border-[#3D6B4F] dark:border-[#7AB88F] text-[#23422F] dark:text-[#B6DFC3]';
              } else if (showStatus && picked && !isCorrectOption) {
                rowClasses =
                  'bg-[#FDECE9] dark:bg-[#2F1815] border-[#B43C2E] dark:border-[#E57B6E] text-[#7D2419] dark:text-[#F6B7AF]';
              }

              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => handlePickOption(currentQ, oIdx)}
                  className={`w-full flex items-center justify-between gap-3 p-3.5 rounded-xl border text-left transition-colors ${rowClasses}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs font-bold shrink-0 pt-0.5">
                      ({letter})
                    </span>
                    <span className="text-sm leading-snug">{opt}</span>
                  </div>
                  {showStatus && isCorrectOption && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold shrink-0">
                      <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                      <span>Correct</span>
                    </span>
                  )}
                  {showStatus && picked && !isCorrectOption && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold shrink-0">
                      <XCircle className="w-4 h-4" aria-hidden="true" />
                      <span>Your Pick</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Subjective-Style Solution Reveal */}
          {solutionVisible && (
            <div className="p-4 sm:p-5 rounded-xl border border-[#B8D0BF] dark:border-[#2F4D39] bg-[#E8F0EA]/60 dark:bg-[#1C2E22]/50 space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-center gap-2 font-semibold text-[#23422F] dark:text-[#B6DFC3]">
                <Target className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>
                  Step-by-Step Verified Solution · Answer Key: Option{' '}
                  {String.fromCharCode(65 + currentQ.correctIndex)}
                </span>
              </div>
              <p className="text-[#1E1B18] dark:text-[#F5F2EB]">
                <strong>Concept &amp; Formula:</strong> {currentQ.subjectiveSolution.concept} —{' '}
                {currentQ.subjectiveSolution.formulaOrPrinciple}
              </p>
              {currentQ.subjectiveSolution.givenData && (
                <p className="text-[#575048] dark:text-[#CBC3B6]">
                  <strong>Given:</strong> {currentQ.subjectiveSolution.givenData}
                </p>
              )}
              <ol className="list-decimal list-inside space-y-1 text-[#1E1B18] dark:text-[#F5F2EB]">
                {currentQ.subjectiveSolution.substitutionAndWorking.map((step, sIdx) => (
                  <li key={sIdx}>{step}</li>
                ))}
              </ol>
              <p className="font-semibold text-[#23422F] dark:text-[#B6DFC3]">
                Final Result: {currentQ.subjectiveSolution.finalResult}
                {currentQ.subjectiveSolution.finalUnits
                  ? ` (${currentQ.subjectiveSolution.finalUnits})`
                  : ''}
              </p>
              <p className="text-[#575048] dark:text-[#CBC3B6]">
                <strong>Key Reason:</strong> {currentQ.subjectiveSolution.keyReason}
              </p>
              {currentQ.subjectiveSolution.commonMistakeToAvoid && (
                <p className="text-[#8C5A12] dark:text-[#E6B17A]">
                  <strong>Common Mistake to Avoid:</strong>{' '}
                  {currentQ.subjectiveSolution.commonMistakeToAvoid}
                </p>
              )}
            </div>
          )}

          {/* Question Pagination Footer */}
          <div className="pt-4 border-t border-[#DDD6C7] dark:border-[#332E28] flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-mono text-[#787066] dark:text-[#9C9387] tabular-nums">
              Showing {safeIndex + 1} / {filteredQuestions.length} matching questions
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={safeIndex === 0}
                onClick={() => setActiveIndex(Math.max(0, safeIndex - 1))}
                className="px-3.5 py-2 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB] disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={safeIndex >= filteredQuestions.length - 1}
                onClick={() =>
                  setActiveIndex(Math.min(filteredQuestions.length - 1, safeIndex + 1))
                }
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] disabled:opacity-40"
              >
                Next Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
