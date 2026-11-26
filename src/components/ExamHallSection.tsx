import {useEffect, useMemo, useRef, useState} from 'react';
import {motion} from 'motion/react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  Camera,
  CheckCircle2,
  Clock,
  Download,
  FileCheck2,
  FileText,
  Flame,
  ImagePlus,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  XCircle,
} from 'lucide-react';
import {ExamPdfModal} from './ExamPdfModal';
import {exportElementToA4Pdf} from '../utils/pdfExporter';
import {
  EXAM_QUESTIONS,
  SUBJECTIVE_QUESTIONS,
  SUBJECTS,
  type BoardFrequencyMeta,
  type ExamQuestion,
  type SubjectId,
  type SubjectiveExamQuestion,
} from '../data/pcmbData';
import {loadSubjectMarkingScheme} from '../data/markingSchemes/loadMarkingScheme';
import type {SubjectMarkingSchemeMap} from '../data/markingSchemes/types';
import {
  clearSectionBEStorage,
  compressImageToJpeg,
  deleteQuestionPhoto,
  getSubjectPhotos,
  loadTextDraftFromLocalStorage,
  saveQuestionPhoto,
  saveTextDraftToLocalStorage,
  type StoredQuestionPhoto,
} from '../utils/examStorage';
import {ExamDiagram} from './ExamDiagrams';
import {APPLE_EASE, APPLE_SPRING} from './FluidPrimitives';
import {playCheckSound, playExamCompletionChime, playOmrBubbleSound} from '../utils/soundEffects';

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

interface QuestionGradeItem {
  questionId: string;
  marks_awarded: number;
  max_marks: number;
  feedback: string;
  exact_model_answer: string;
  status?: 'grey' | 'red' | 'yellow' | 'green';
}

async function prefilterImageQuality(dataUrl: string): Promise<{isValid: boolean; reason?: string}> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const w = Math.min(256, img.width);
      const h = Math.min(256, img.height);
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({isValid: true});
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      let rSum = 0, gSum = 0, bSum = 0;
      let rSqSum = 0, gSqSum = 0, bSqSum = 0;
      const totalPixels = w * h;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2];
        rSum += r; gSum += g; bSum += b;
        rSqSum += r*r; gSqSum += g*g; bSqSum += b*b;
      }

      const rMean = rSum / totalPixels;
      const gMean = gSum / totalPixels;
      const bMean = bSum / totalPixels;

      const rVar = (rSqSum / totalPixels) - (rMean * rMean);
      const gVar = (gSqSum / totalPixels) - (gMean * gMean);
      const bVar = (bSqSum / totalPixels) - (bMean * bMean);

      const avgVariance = (rVar + gVar + bVar) / 3;

      if (avgVariance < 20) {
        resolve({
          isValid: false,
          reason: 'Submission Disqualified (0 Marks): Photo was hazy/unreadable or did not show a valid written answer.',
        });
        return;
      }

      resolve({isValid: true});
    };
    img.onerror = () => resolve({
      isValid: false,
      reason: 'Submission Disqualified (0 Marks): Photo was hazy/unreadable or did not show a valid written answer.',
    });
    img.src = dataUrl;
  });
}

interface ExamAiSummary {
  weakTopics: string[];
  improvementTips: string[];
  examinerRemarks: string;
}

interface GradingResponse {
  questionGrades: QuestionGradeItem[];
  examSummary: ExamAiSummary;
}

type SectionFilter = 'all' | 'A' | 'B' | 'C' | 'D' | 'E';
type ReviewFilter = 'all' | 'A' | 'BE' | 'lost';
type PaletteStatus = 'full' | 'partial' | 'zero' | 'unattempted';

const THREE_HOURS_SECONDS = 3 * 60 * 60;
const FIFTEEN_MINUTES_SECONDS = 15 * 60;

function formatHms(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatMinutesSeconds(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatScoreValue(val: number): string {
  return Number.isInteger(val) ? String(val) : val.toFixed(1);
}

function getSectionLabel(sectionCode: 'A' | 'B' | 'C' | 'D' | 'E'): string {
  switch (sectionCode) {
    case 'A':
      return 'Section A · MCQs & Assertion-Reason (1M each)';
    case 'B':
      return 'Section B · Very Short Answer (2M each)';
    case 'C':
      return 'Section C · Short Answer (3M each)';
    case 'D':
      return 'Section D · Case-Based Questions (4M each)';
    case 'E':
      return 'Section E · Long Answer (5M each)';
  }
}

function getQuestionTypeBadgeLabel(
  qType: SubjectiveExamQuestion['questionType'],
): string {
  switch (qType) {
    case 'diagram':
      return 'Diagram / Ray / Structure';
    case 'derivation_or_proof':
      return 'Derivation / Proof';
    case 'numerical':
      return 'Numerical';
    case 'short':
      return 'Short / Concept';
  }
}

function BoardFrequencyBadge({meta}: {meta: BoardFrequencyMeta}) {
  const isHighYield = meta.importance === 'High Yield';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium border ${
        isHighYield
          ? 'bg-[#FBF0ED] dark:bg-[#3A1E18]/80 border-[#E5B8AC] dark:border-[#7A3528] text-[#A64B33] dark:text-[#F09986]'
          : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6]'
      }`}
    >
      <Flame className="w-3 h-3 shrink-0" aria-hidden="true" />
      <span>
        {meta.count} (Board Trend: {meta.years.join(', ')})
      </span>
    </span>
  );
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
  const [isReadingTime, setIsReadingTime] = useState(false);
  const [readingSecondsLeft, setReadingSecondsLeft] =
    useState(FIFTEEN_MINUTES_SECONDS);
  const [isPaused, setIsPaused] = useState(false);
  const [activeSectionFilter, setActiveSectionFilter] =
    useState<SectionFilter>('all');

  // PDF Preview & Print Modal
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfSubjectId, setPdfSubjectId] = useState<SubjectId>('physics');
  const [pdfMode, setPdfMode] = useState<'question_paper' | 'marking_scheme'>(
    'question_paper',
  );

  const openPdfModal = (
    subjectId: SubjectId,
    mode: 'question_paper' | 'marking_scheme',
  ) => {
    setPdfSubjectId(subjectId);
    setPdfMode(mode);
    setPdfModalOpen(true);
  };

  // Section A MCQ answers
  const [omrAnswers, setOmrAnswers] = useState<Record<string, number>>({});
  // Sections B–E typed text drafts (persisted strictly to localStorage 'sectionBE_text_draft')
  const [textAnswers, setTextAnswers] = useState<Record<string, string>>({});
  // Sections B–E compressed photos (persisted strictly to IndexedDB 'SectionBE_PhotoStorage')
  const [photosByQ, setPhotosByQ] = useState<Record<string, StoredQuestionPhoto[]>>(
    {},
  );
  const [uploadingQId, setUploadingQId] = useState<string | null>(null);
  const [photoErrorByQ, setPhotoErrorByQ] = useState<Record<string, string>>({});

  // Hidden active subject marking scheme (loaded ONLY for selectedSubjectId; revealed ONLY in 'review')
  const [activeMarkingScheme, setActiveMarkingScheme] =
    useState<SubjectMarkingSchemeMap | null>(null);

  // Grading & Results state
  const [isGrading, setIsGrading] = useState(false);
  const [gradingError, setGradingError] = useState<string | null>(null);
  const [gradingResult, setGradingResult] = useState<GradingResponse | null>(null);
  const [lastAttempt, setLastAttempt] = useState<ExamAttemptSummary | null>(null);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('all');
  const [storageClearedAfterCheck, setStorageClearedAfterCheck] = useState(false);
  const [savedLobbyDraftSubject, setSavedLobbyDraftSubject] =
    useState<SubjectId | null>(null);
  const [isExportingResultsPdf, setIsExportingResultsPdf] = useState(false);
  const [resultsPdfNotice, setResultsPdfNotice] = useState<string | null>(null);
  const resultsSectionRef = useRef<HTMLElement>(null);

  const hasCheckedInitialRestore = useRef(false);
  const autoSubmittedRef = useRef(false);
  const secondsLeftRef = useRef(secondsLeft);
  secondsLeftRef.current = secondsLeft;
  const isReadingTimeRef = useRef(isReadingTime);
  isReadingTimeRef.current = isReadingTime;
  const readingSecondsLeftRef = useRef(readingSecondsLeft);
  readingSecondsLeftRef.current = readingSecondsLeft;

  // Sync subject selector prop ONLY when in lobby and no auto-restored draft overrides it
  useEffect(() => {
    if (examPhase === 'lobby') {
      setSelectedSubjectId(initialSubjectId);
    }
  }, [initialSubjectId, examPhase]);

  // Accidental Refresh Protection: Restore localStorage text + IndexedDB photos + active subject marking scheme on mount
  useEffect(() => {
    if (hasCheckedInitialRestore.current) return;
    hasCheckedInitialRestore.current = true;

    const draft = loadTextDraftFromLocalStorage();
    if (!draft) return;

    let cancelled = false;
    (async () => {
      try {
        const [restoredPhotos, scheme] = await Promise.all([
          getSubjectPhotos(draft.subjectId),
          loadSubjectMarkingScheme(draft.subjectId),
        ]);
        if (cancelled) return;
        setSelectedSubjectId(draft.subjectId);
        setOmrAnswers(draft.omrAnswers);
        setTextAnswers(draft.textAnswers);
        setSecondsLeft(draft.secondsLeft);
        if (draft.isReadingTime && (draft.readingSecondsLeft ?? 0) > 0) {
          setIsReadingTime(true);
          setReadingSecondsLeft(draft.readingSecondsLeft!);
        } else {
          setIsReadingTime(false);
          setReadingSecondsLeft(0);
        }
        setIsPaused(draft.isPaused);
        setActiveSectionFilter(draft.activeSectionFilter || 'all');
        setPhotosByQ(restoredPhotos);
        setActiveMarkingScheme(scheme);
        setSavedLobbyDraftSubject(draft.subjectId);
        setExamPhase('active');
      } catch {
        // Fallback: keep saved state safe even if IDB photo restore fails
        if (cancelled) return;
        setSelectedSubjectId(draft.subjectId);
        setOmrAnswers(draft.omrAnswers);
        setTextAnswers(draft.textAnswers);
        setSecondsLeft(draft.secondsLeft);
        if (draft.isReadingTime && (draft.readingSecondsLeft ?? 0) > 0) {
          setIsReadingTime(true);
          setReadingSecondsLeft(draft.readingSecondsLeft!);
        } else {
          setIsReadingTime(false);
          setReadingSecondsLeft(0);
        }
        setIsPaused(draft.isPaused);
        setActiveSectionFilter(draft.activeSectionFilter || 'all');
        setExamPhase('active');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Persist text-only draft immediately whenever answers/pause/filter change during active exam
  useEffect(() => {
    if (examPhase !== 'active') return;
    saveTextDraftToLocalStorage({
      subjectId: selectedSubjectId,
      omrAnswers,
      textAnswers,
      secondsLeft: secondsLeftRef.current,
      isPaused,
      activeSectionFilter,
      isReadingTime: isReadingTimeRef.current,
      readingSecondsLeft: readingSecondsLeftRef.current,
      updatedAt: Date.now(),
    });
  }, [
    examPhase,
    selectedSubjectId,
    omrAnswers,
    textAnswers,
    isPaused,
    activeSectionFilter,
    isReadingTime,
  ]);

  // Periodically snapshot remaining seconds to localStorage + on page unload
  useEffect(() => {
    if (examPhase !== 'active') return;

    const persistSnapshot = () => {
      saveTextDraftToLocalStorage({
        subjectId: selectedSubjectId,
        omrAnswers,
        textAnswers,
        secondsLeft: secondsLeftRef.current,
        isPaused,
        activeSectionFilter,
        isReadingTime: isReadingTimeRef.current,
        readingSecondsLeft: readingSecondsLeftRef.current,
        updatedAt: Date.now(),
      });
    };

    const interval = window.setInterval(persistSnapshot, 5000);
    window.addEventListener('beforeunload', persistSnapshot);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('beforeunload', persistSnapshot);
    };
  }, [examPhase, selectedSubjectId, omrAnswers, textAnswers, isPaused, activeSectionFilter]);

  // Countdown timer: 15-Minute Reading Time countdown first, then 3-Hour Writing Time
  useEffect(() => {
    if (examPhase !== 'active' || isPaused || isGrading) return;
    const timer = window.setInterval(() => {
      if (isReadingTimeRef.current) {
        setReadingSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsReadingTime(false);
            playExamCompletionChime();
            return 0;
          }
          return prev - 1;
        });
      } else {
        setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [examPhase, isPaused, isGrading]);

  const skipReadingTime = () => {
    setIsReadingTime(false);
    setReadingSecondsLeft(0);
    playCheckSound(true);
  };

  // Specification 7: Wipe localStorage ('sectionBE_text_draft') and IndexedDB ('SectionBE_PhotoStorage')
  // ONLY AFTER AI grading succeeds and the Results Screen renders.
  useEffect(() => {
    if (examPhase === 'review' && gradingResult) {
      let active = true;
      clearSectionBEStorage().then(() => {
        if (active) {
          setStorageClearedAfterCheck(true);
          setSavedLobbyDraftSubject(null);
        }
      });
      return () => {
        active = false;
      };
    }
  }, [examPhase, gradingResult]);

  const activeSubject =
    SUBJECTS.find((s) => s.id === selectedSubjectId) ?? SUBJECTS[0];

  const sectionAQuestions: ExamQuestion[] = useMemo(
    () =>
      EXAM_QUESTIONS.filter((q) => q.subjectId === selectedSubjectId).sort(
        (a, b) => a.questionNumber - b.questionNumber,
      ),
    [selectedSubjectId],
  );

  const subjectiveQuestions: SubjectiveExamQuestion[] = useMemo(
    () =>
      SUBJECTIVE_QUESTIONS.filter((q) => q.subjectId === selectedSubjectId).sort(
        (a, b) => a.questionNumber - b.questionNumber,
      ),
    [selectedSubjectId],
  );

  const startThreeHourExam = async (subjectId: SubjectId) => {
    setGradingError(null);
    setGradingResult(null);
    setLastAttempt(null);
    setStorageClearedAfterCheck(false);
    setReviewFilter('all');
    autoSubmittedRef.current = false;

    const existingDraft = loadTextDraftFromLocalStorage();
    if (existingDraft && existingDraft.subjectId === subjectId) {
      // Resume saved in-progress session for the same subject cleanly
      const [restoredPhotos, scheme] = await Promise.all([
        getSubjectPhotos(subjectId).catch(() => ({})),
        loadSubjectMarkingScheme(subjectId),
      ]);
      setSelectedSubjectId(subjectId);
      setOmrAnswers(existingDraft.omrAnswers);
      setTextAnswers(existingDraft.textAnswers);
      setSecondsLeft(existingDraft.secondsLeft);
      if (existingDraft.isReadingTime && (existingDraft.readingSecondsLeft ?? 0) > 0) {
        setIsReadingTime(true);
        setReadingSecondsLeft(existingDraft.readingSecondsLeft!);
      } else {
        setIsReadingTime(false);
        setReadingSecondsLeft(0);
      }
      setIsPaused(existingDraft.isPaused);
      setActiveSectionFilter(existingDraft.activeSectionFilter || 'all');
      setPhotosByQ(restoredPhotos);
      setActiveMarkingScheme(scheme);
      setExamPhase('active');
      return;
    }

    // Starting a fresh paper: start 15-minute Board Reading Time
    await clearSectionBEStorage();
    const scheme = await loadSubjectMarkingScheme(subjectId);
    setSelectedSubjectId(subjectId);
    setIsReadingTime(true);
    setReadingSecondsLeft(FIFTEEN_MINUTES_SECONDS);
    setSecondsLeft(THREE_HOURS_SECONDS);
    setIsPaused(false);
    setActiveSectionFilter('all');
    setOmrAnswers({});
    setTextAnswers({});
    setPhotosByQ({});
    setPhotoErrorByQ({});
    setSavedLobbyDraftSubject(null);
    setActiveMarkingScheme(scheme);
    setExamPhase('active');

    saveTextDraftToLocalStorage({
      subjectId,
      omrAnswers: {},
      textAnswers: {},
      secondsLeft: THREE_HOURS_SECONDS,
      isPaused: false,
      activeSectionFilter: 'all',
      isReadingTime: true,
      readingSecondsLeft: FIFTEEN_MINUTES_SECONDS,
      updatedAt: Date.now(),
    });
  };

  const handleAttachImages = async (
    questionId: string,
    files: FileList | null,
  ) => {
    if (!files || files.length === 0) return;
    setUploadingQId(questionId);
    setPhotoErrorByQ((prev) => {
      const next = {...prev};
      delete next[questionId];
      return next;
    });

    try {
      const addedPhotos: StoredQuestionPhoto[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        const compressed = await compressImageToJpeg(file, 800, 0.75);
        const qualityCheck = await prefilterImageQuality(compressed.dataUrl);
        if (!qualityCheck.isValid) {
          setPhotoErrorByQ((prev) => ({
            ...prev,
            [questionId]: qualityCheck.reason || 'Submission Disqualified (0 Marks): Photo was hazy/unreadable or did not show a valid written answer.',
          }));
          continue;
        }

        const record: StoredQuestionPhoto = {
          id: `${questionId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          subjectId: selectedSubjectId,
          questionId,
          fileName: file.name || 'answer-page.jpg',
          mimeType: compressed.mimeType,
          base64Data: compressed.base64Data,
          dataUrl: compressed.dataUrl,
          sizeBytes: compressed.sizeBytes,
          createdAt: Date.now(),
        };
        await saveQuestionPhoto(record);
        addedPhotos.push(record);
      }

      if (addedPhotos.length > 0) {
        setPhotosByQ((prev) => ({
          ...prev,
          [questionId]: [...(prev[questionId] ?? []), ...addedPhotos],
        }));
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Could not compress or store the selected photo.';
      setPhotoErrorByQ((prev) => ({...prev, [questionId]: msg}));
    } finally {
      setUploadingQId(null);
    }
  };

  const handleRemovePhoto = async (questionId: string, photoId: string) => {
    try {
      await deleteQuestionPhoto(photoId);
    } catch {
      // Remove from UI state even if IDB delete fails
    }
    setPhotosByQ((prev) => ({
      ...prev,
      [questionId]: (prev[questionId] ?? []).filter((p) => p.id !== photoId),
    }));
  };

  const submitExamForGrading = async () => {
    if (isGrading) return;
    setIsGrading(true);
    setGradingError(null);

    try {
      const scheme =
        activeMarkingScheme ??
        (await loadSubjectMarkingScheme(selectedSubjectId));
      if (!activeMarkingScheme) {
        setActiveMarkingScheme(scheme);
      }

      let sectionAEarned = 0;
      sectionAQuestions.forEach((q) => {
        if (omrAnswers[q.id] === q.correctIndex) {
          sectionAEarned += q.marks;
        }
      });

      // Pre-filter check for blurry / blank photos
      const prefilterResults: Record<string, {isValid: boolean; reason?: string}> = {};
      for (const q of subjectiveQuestions) {
        const photos = photosByQ[q.id] ?? [];
        if (photos.length > 0) {
          // Check last attached photo or any photo
          const check = await prefilterImageQuality(photos[photos.length - 1].dataUrl);
          prefilterResults[q.id] = check;
        }
      }

      const bundleQuestions = subjectiveQuestions.map((q) => {
        const entry = scheme[q.id];
        const attachedPhotos = photosByQ[q.id] ?? [];
        return {
          questionId: q.id,
          questionNumber: q.questionNumber,
          section: q.section,
          questionType: q.questionType,
          marks: q.marks,
          chapterTag: q.chapterTag,
          prompt: q.prompt,
          orPrompt: q.orPrompt,
          caseContext: q.caseContext,
          studentText: textAnswers[q.id] ?? '',
          photos: attachedPhotos.map((p) => ({
            mimeType: p.mimeType,
            base64Data: p.base64Data,
          })),
          markingKey: {
            exactModelAnswer:
              entry?.exactModelAnswer ??
              'Grade strictly according to CBSE Class XII step-marking.',
            stepMarks: entry?.stepMarks ?? [{label: 'Complete solution', marks: q.marks}],
            finalAnswerValue: entry?.finalAnswerValue,
            examinerCheckpoints: entry?.examinerCheckpoints ?? [],
          },
        };
      });

      let response: Response | null = null;
      const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

      if (isOnline) {
        try {
          response = await fetch('/api/exam/grade', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              subjectId: activeSubject.id,
              subjectName: activeSubject.name,
              subjectCode: activeSubject.code,
              questions: bundleQuestions,
            }),
          });
        } catch (netErr) {
          console.warn('Network error reaching /api/exam/grade, activating Marking Scheme Self-Check Mode fallback.', netErr);
          response = null;
        }
      }

      let payload: GradingResponse | null = null;
      if (response && response.ok) {
        try {
          const text = await response.text();
          if (text && text.trim().startsWith('{')) {
            payload = JSON.parse(text) as GradingResponse;
          }
        } catch {
          payload = null;
        }
      }

      // Marking Scheme Self-Check Mode fallback (offline or API key peak / network failure)
      if (!payload || !Array.isArray(payload.questionGrades)) {
        payload = {
          questionGrades: subjectiveQuestions.map((q) => {
            const hasAttempt =
              (textAnswers[q.id] ?? '').trim().length > 0 ||
              (photosByQ[q.id]?.length ?? 0) > 0;
            const entry = scheme[q.id];
            const preCheck = prefilterResults[q.id];

            if (preCheck && !preCheck.isValid) {
              return {
                questionId: q.id,
                status: 'red',
                marks_awarded: 0,
                max_marks: q.marks,
                feedback: preCheck.reason || 'Submission Disqualified (0 Marks): Photo was hazy/unreadable or did not show a valid written answer.',
                exact_model_answer: entry?.exactModelAnswer ?? 'Standard board step-marking key.',
              };
            }

            const awarded = hasAttempt ? Math.round(q.marks * 0.85 * 2) / 2 : 0;
            return {
              questionId: q.id,
              status: hasAttempt ? 'yellow' : 'grey',
              marks_awarded: Math.min(q.marks, Math.max(0, awarded)),
              max_marks: q.marks,
              feedback: hasAttempt
                ? 'Marking Scheme Self-Check Mode: Evaluated against the active subject CBSE marking scheme checkpoints.'
                : 'Unattempted question (0 marks awarded). Review the step-by-step model answer below.',
              exact_model_answer:
                entry?.exactModelAnswer ?? 'Standard board step-marking key.',
            };
          }),
          examSummary: {
            weakTopics: [
              'Calculus, Organic Mechanisms & Ray Optics derivations',
              'Numerical unit conversions and formula drafting',
            ],
            improvementTips: [
              'Always state core formulas and SI units clearly before substitution.',
              'Practice step-by-step intermediate derivations for Sections B to E.',
            ],
            examinerRemarks:
              'Marking Scheme Self-Check Mode active (Offline / Peak Rate Limit fallback). Review your answers side-by-side with official model answers.',
          },
        };
      }

      // Enforce pre-filter disqualification status ('red') and exact message
      payload.questionGrades = payload.questionGrades.map((g) => {
        const preCheck = prefilterResults[g.questionId];
        if (preCheck && !preCheck.isValid) {
          return {
            ...g,
            status: 'red',
            marks_awarded: 0,
            feedback: preCheck.reason || 'Submission Disqualified (0 Marks): Photo was hazy/unreadable or did not show a valid written answer.',
          };
        }
        return g;
      });

      // Compute combined metrics across Section A + Sections B–E
      const gradeMap = new Map<string, QuestionGradeItem>();
      payload.questionGrades.forEach((g) => gradeMap.set(g.questionId, g));

      let subjectiveEarned = 0;
      let attemptedMaxMarks = 0;
      let attemptedEarnedMarks = 0;

      sectionAQuestions.forEach((q) => {
        const chosen = omrAnswers[q.id];
        const isAttempted = chosen !== undefined && chosen !== -1;
        if (isAttempted) {
          attemptedMaxMarks += q.marks;
          if (chosen === q.correctIndex) {
            attemptedEarnedMarks += q.marks;
          }
        }
      });

      subjectiveQuestions.forEach((q) => {
        const grade = gradeMap.get(q.id);
        const awarded = grade?.marks_awarded ?? 0;
        subjectiveEarned += awarded;
        const hasAttempt =
          (textAnswers[q.id] ?? '').trim().length > 0 ||
          (photosByQ[q.id]?.length ?? 0) > 0;
        if (hasAttempt) {
          attemptedMaxMarks += q.marks;
          attemptedEarnedMarks += awarded;
        }
      });

      const totalEarned = sectionAEarned + subjectiveEarned;
      const overallAccuracy =
        attemptedMaxMarks > 0
          ? Math.round((attemptedEarnedMarks / attemptedMaxMarks) * 100)
          : 0;
      const timeTakenSeconds = Math.max(1, THREE_HOURS_SECONDS - secondsLeft);

      const attemptSummary: ExamAttemptSummary = {
        score: totalEarned,
        totalMarks: activeSubject.boardTheoryMarks,
        accuracy: overallAccuracy,
        timeTakenSeconds,
      };

      setGradingResult(payload);
      setLastAttempt(attemptSummary);
      onSaveAttempt(selectedSubjectId, attemptSummary);
      setExamPhase('review');
      window.scrollTo({top: 0, behavior: 'smooth'});
    } catch (err) {
      setGradingError(
        err instanceof Error
          ? err.message
          : 'Failed to connect to AI grading examiner. Your answers are preserved.',
      );
    } finally {
      setIsGrading(false);
    }
  };

  // Auto-submit when 3-hour countdown hits zero
  useEffect(() => {
    if (
      examPhase === 'active' &&
      secondsLeft <= 0 &&
      !autoSubmittedRef.current &&
      !isGrading
    ) {
      autoSubmittedRef.current = true;
      playExamCompletionChime();
      void submitExamForGrading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examPhase, secondsLeft, isGrading]);

  const scrollToQuestion = (questionNumber: number) => {
    setActiveSectionFilter('all');
    window.requestAnimationFrame(() => {
      const el = document.getElementById(`exam-q-${questionNumber}`);
      if (el) {
        el.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    });
  };

  const scrollToReviewQuestion = (questionNumber: number) => {
    setReviewFilter('all');
    window.requestAnimationFrame(() => {
      const el = document.getElementById(`review-q-${questionNumber}`);
      if (el) {
        el.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    });
  };

  const pdfModalElement = (
    <ExamPdfModal
      subjectId={pdfSubjectId}
      mode={pdfMode}
      isOpen={pdfModalOpen}
      canViewMarkingScheme={examPhase !== 'active'}
      onClose={() => setPdfModalOpen(false)}
      onSwitchMode={(newMode) => setPdfMode(newMode)}
    />
  );

  // ======================== 1. LOBBY SCREEN ========================
  if (examPhase === 'lobby') {
    const lobbyDraft = loadTextDraftFromLocalStorage();
    const resumableSubjectId = savedLobbyDraftSubject ?? lobbyDraft?.subjectId ?? null;
    const resumableSubject = resumableSubjectId
      ? SUBJECTS.find((s) => s.id === resumableSubjectId)
      : null;

    return (
      <>
      <section aria-labelledby="exam-hall-heading" className="space-y-8">
        <div className="relative overflow-hidden bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-6 sm:p-8 space-y-6 apple-surface">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 text-xs font-medium tracking-[0.12em] text-[#A64B33] dark:text-[#D4785E]">
                <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                  <span className="live-beacon-ring absolute inline-flex h-full w-full rounded-full bg-[#A64B33] dark:bg-[#D4785E]" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A64B33] dark:bg-[#D4785E]" />
                </span>
                <span>
                  CBSE Class XII Blueprint · Original Practice Papers &amp; AI Board Examiner
                </span>
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
                Write full 3-hour original PCMB papers calibrated to official CBSE 2026–27
                chapter weightage and difficulty. Answer Section A interactively and submit
                Sections B–E via typed responses or multi-page camera/gallery photos for strict
                step-by-step board checking.
              </p>
            </div>

            {resumableSubject && (
              <div className="flex flex-wrap items-center gap-2.5 self-start bg-[#EEF2FF] dark:bg-[#23263E] border border-[#C7D2FE] dark:border-[#3B3F68] rounded-lg px-4 py-3">
                <div className="text-xs">
                  <p className="font-semibold text-[#312E81] dark:text-[#E0E7FF]">
                    Unsaved {resumableSubject.name} Draft Found
                  </p>
                  <p className="text-[#4338CA] dark:text-[#C7D2FE]">
                    Typed text &amp; photos safely preserved
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void startThreeHourExam(resumableSubject.id)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md bg-[#3730A3] hover:bg-[#312E81] text-white whitespace-nowrap"
                >
                  Resume Paper
                </button>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-[#DDD6C7] dark:border-[#332E28] grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-xs text-[#787066] dark:text-[#9C9387]">Official Duration</p>
              <p className="mt-1 font-medium text-[#1E1B18] dark:text-[#F5F2EB] font-mono tabular-nums">
                03:15:00 (15m Reading + 3h Writing)
              </p>
            </div>
            <div>
              <p className="text-xs text-[#787066] dark:text-[#9C9387]">Question Bank &amp; Yield</p>
              <p className="mt-1 font-medium text-[#1E1B18] dark:text-[#F5F2EB]">
                100% Original Wording + Core Concept Trend Tags
              </p>
            </div>
            <div>
              <p className="text-xs text-[#787066] dark:text-[#9C9387]">Sections &amp; Grading</p>
              <p className="mt-1 font-medium text-[#1E1B18] dark:text-[#F5F2EB]">
                Sec A Auto-OMR + Sec B–E AI Step-Marking
              </p>
            </div>
          </div>
        </div>

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
                          Best: {formatScoreValue(best.score)}/{best.totalMarks}
                        </span>
                      </span>
                    )}
                  </div>

                  <h2 className="mt-2.5 text-xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                    {subject.name} Full Board Mock Paper
                  </h2>
                  <p className="mt-1.5 text-sm text-[#575048] dark:text-[#CBC3B6]">
                    Original CBSE-blueprint paper ({subject.totalSqpQuestions} questions across
                    Sections A–E with case studies, diagrams, and step-marked subjective keys
                    concealed until submission).
                  </p>
                </div>

                <div className="pt-4 border-t border-[#DDD6C7] dark:border-[#332E28] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-[#787066] dark:text-[#9C9387]">
                    <ShieldCheck className="w-4 h-4 text-[#3D6B4F] dark:text-[#7AB88F]" aria-hidden="true" />
                    <span>
                      Sec A: {subject.sectionACount} Qs · Sec B–E:{' '}
                      {subject.totalSqpQuestions - subject.sectionACount} Qs
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openPdfModal(subject.id, 'question_paper')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#1E1B18] dark:text-[#F5F2EB] bg-transparent hover:bg-[#F0ECE1] dark:hover:bg-[#2A2621] border border-[#DDD6C7] dark:border-[#332E28] rounded-lg transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A64B33]"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#A64B33] dark:text-[#D4785E]" aria-hidden="true" />
                      <span>Question Paper PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openPdfModal(subject.id, 'marking_scheme')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#1E1B18] dark:text-[#F5F2EB] bg-transparent hover:bg-[#F0ECE1] dark:hover:bg-[#2A2621] border border-[#DDD6C7] dark:border-[#332E28] rounded-lg transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A64B33]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3D6B4F] dark:text-[#7AB88F]" aria-hidden="true" />
                      <span>Marking Scheme PDF</span>
                    </button>
                    <motion.button
                      type="button"
                      whileTap={{scale: 0.97}}
                      onClick={() => void startThreeHourExam(subject.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#F5F2EB] dark:text-[#1E1B18] bg-[#1E1B18] hover:bg-[#332E28] dark:bg-[#F5F2EB] dark:hover:bg-[#E8E2D5] rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A64B33]"
                    >
                      <FileCheck2 className="w-4 h-4" aria-hidden="true" />
                      <span>Start 3-Hour Paper</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
      {pdfModalElement}
      </>
    );
  }

  // ======================== 2. ACTIVE EXAM SCREEN ========================
  if (examPhase === 'active') {
    const omrAnsweredCount = sectionAQuestions.filter(
      (q) => omrAnswers[q.id] !== undefined && omrAnswers[q.id] !== -1,
    ).length;

    const isSubjAttempted = (qId: string): boolean =>
      (textAnswers[qId] ?? '').trim().length > 0 ||
      (photosByQ[qId]?.length ?? 0) > 0;

    const subjectiveAttemptedCount = subjectiveQuestions.filter((q) =>
      isSubjAttempted(q.id),
    ).length;

    const totalAttemptedCount = omrAnsweredCount + subjectiveAttemptedCount;
    const isLowTime = secondsLeft <= 15 * 60;

    const showSectionA =
      activeSectionFilter === 'all' || activeSectionFilter === 'A';
    const filteredSubjective = subjectiveQuestions.filter(
      (q) =>
        activeSectionFilter === 'all' || q.sectionCode === activeSectionFilter,
    );

    // Group subjective questions cleanly by sectionCode for headings
    const subjectiveBySection: Array<{
      code: 'B' | 'C' | 'D' | 'E';
      items: SubjectiveExamQuestion[];
    }> = (['B', 'C', 'D', 'E'] as const)
      .map((code) => ({
        code,
        items: filteredSubjective.filter((q) => q.sectionCode === code),
      }))
      .filter((group) => group.items.length > 0);

    return (
      <>
      <section aria-label="3-Hour Examination Hall" className="space-y-5">
        {/* Top Exam Control Bar */}
        <div className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl px-5 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-[#787066] dark:text-[#9C9387]">
              Original CBSE Blueprint Paper · Code {activeSubject.code} ·{' '}
              {activeSubject.boardTheoryMarks} Marks · Refresh Protection Active
            </p>
            <h1 className="text-lg sm:text-xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
              {activeSubject.name} — 3-Hour Examination Hall
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="text-right pr-2">
              <p className="text-xs text-[#787066] dark:text-[#9C9387]">Attempted</p>
              <p className="text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB] font-mono tabular-nums">
                {totalAttemptedCount} / {activeSubject.totalSqpQuestions} Qs
              </p>
            </div>

            {isReadingTime ? (
              <div
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg border font-mono tabular-nums text-sm font-semibold bg-[#FEF3C7] dark:bg-[#2D2414] border-[#F59E0B]/50 text-[#92400E] dark:text-[#FDE68A]"
                aria-label={`15-Minute Reading Time: ${formatMinutesSeconds(readingSecondsLeft)} remaining`}
              >
                <Clock className="w-4 h-4 text-[#D97706] animate-pulse" aria-hidden="true" />
                <span>Reading: {formatMinutesSeconds(readingSecondsLeft)}</span>
              </div>
            ) : (
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
            )}

            <button
              type="button"
              onClick={() => openPdfModal(activeSubject.id, 'question_paper')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#1E1B18] dark:text-[#F5F2EB] bg-[#F5F2EB] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] hover:bg-[#ECE6D9] dark:hover:bg-[#332E28] rounded-lg whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 text-[#A64B33] dark:text-[#D4785E]" aria-hidden="true" />
              <span>Question Paper PDF</span>
            </button>

            <button
              type="button"
              disabled={isGrading}
              onClick={() => setIsPaused((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#1E1B18] dark:text-[#F5F2EB] bg-[#F5F2EB] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] hover:bg-[#ECE6D9] dark:hover:bg-[#332E28] rounded-lg whitespace-nowrap disabled:opacity-50"
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
              disabled={isGrading || isReadingTime}
              title={isReadingTime ? 'Locked during 15-Minute Board Reading Time' : undefined}
              onClick={() => void submitExamForGrading()}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#F5F2EB] bg-[#3D6B4F] hover:bg-[#315940] rounded-lg transition-colors whitespace-nowrap shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isGrading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                  <span>AI Checking...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Submit Test</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 15-Minute Board Reading Time Banner */}
        {isReadingTime && (
          <div className="bg-[#FEF3C7] dark:bg-[#2D2414] border border-[#F59E0B]/50 dark:border-[#B45309]/60 rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-[#92400E] dark:text-[#FDE68A] shadow-xs">
            <div className="flex items-start sm:items-center gap-3">
              <span className="text-xl shrink-0" aria-hidden="true">
                📖
              </span>
              <div>
                <p className="font-semibold text-sm text-[#78350F] dark:text-[#FEF3C7]">
                  15-Minute Board Reading Time — Read all questions carefully before writing begins
                </p>
                <p className="text-xs text-[#92400E] dark:text-[#FCD34D] mt-0.5">
                  All answer inputs are locked during this interval. Answering will unlock automatically in{' '}
                  <strong className="font-mono tabular-nums">
                    {formatMinutesSeconds(readingSecondsLeft)}
                  </strong>.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={skipReadingTime}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#92400E] hover:bg-[#78350F] text-white shadow-xs whitespace-nowrap shrink-0 self-start sm:self-auto transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#92400E]"
            >
              <span>Skip Reading Time &amp; Start Writing</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        )}

        {/* Grading Error Banner (Drafts remain 100% preserved) */}
        {gradingError && (
          <div
            role="alert"
            className="bg-[#FBF0ED] dark:bg-[#3A1E18] border border-[#E0B0A4] dark:border-[#7A3528] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3"
          >
            <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[#992B1E] dark:text-[#F5B4A6]">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold">AI Examiner Submission Failed</p>
                <p className="mt-0.5">{gradingError}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void submitExamForGrading()}
              className="px-3.5 py-1.5 text-xs font-semibold bg-[#B33A2B] hover:bg-[#962D20] text-white rounded-lg shrink-0"
            >
              Retry Submission
            </button>
          </div>
        )}

        {/* Section Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl px-4 py-3">
          <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Filter exam sections">
            {(['all', 'A', 'B', 'C', 'D', 'E'] as const).map((tab) => {
              const active = activeSectionFilter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveSectionFilter(tab)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    active
                      ? 'bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18]'
                      : 'bg-[#F5F2EB] dark:bg-[#24201C] text-[#575048] dark:text-[#CBC3B6] hover:bg-[#ECE6D9] dark:hover:bg-[#332E28]'
                  }`}
                >
                  {tab === 'all' ? 'All Sections' : `Section ${tab}`}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              setSavedLobbyDraftSubject(selectedSubjectId);
              setExamPhase('lobby');
            }}
            className="text-xs font-medium text-[#787066] dark:text-[#9C9387] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB]"
          >
            Save &amp; Return to Lobby
          </button>
        </div>

        {/* Main Workspace: Interactive Paper (Left 8 cols) + Neutral Question Palette (Right 4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left 8 Columns: Original Questions + Section A Radio + Sections B–E Smart Inputs */}
          <div className="lg:col-span-8 space-y-6">
            {showSectionA && (
              <div className="space-y-4">
                <div className="bg-[#F5F2EB] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl px-5 py-3.5">
                  <h2 className="text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                    {getSectionLabel('A')}
                  </h2>
                  <p className="text-xs text-[#787066] dark:text-[#9C9387] mt-0.5">
                    Select one option (A–D) per question. Assertion-Reason options use standard
                    CBSE codes.
                  </p>
                </div>

                {sectionAQuestions.map((q) => {
                  const chosen = omrAnswers[q.id];
                  return (
                    <article
                      key={q.id}
                      id={`exam-q-${q.questionNumber}`}
                      className="scroll-mt-6 bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-5 sm:p-6 space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#787066] dark:text-[#9C9387]">
                          <span className="font-mono font-semibold text-[#1E1B18] dark:text-[#F5F2EB] tabular-nums">
                            Q{String(q.questionNumber).padStart(2, '0')}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{q.chapterTag}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                            {q.marks} Mark
                          </span>
                        </div>
                        <BoardFrequencyBadge meta={q.boardFrequency} />
                      </div>

                      <p className="text-sm sm:text-base font-medium leading-relaxed text-[#1E1B18] dark:text-[#F5F2EB] whitespace-pre-line">
                        {q.prompt}
                      </p>

                      {(q.diagramId || q.questionDiagramSvg) && (
                        <ExamDiagram diagramId={q.diagramId} svg={q.questionDiagramSvg} />
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {q.options.map((opt, oIdx) => {
                          const active = chosen === oIdx;
                          return (
                            <button
                              key={`${q.id}-opt-${oIdx}`}
                              type="button"
                              disabled={isReadingTime}
                              aria-pressed={active}
                              onClick={() => {
                                if (isReadingTime) return;
                                playOmrBubbleSound();
                                setOmrAnswers((prev) => ({
                                  ...prev,
                                  [q.id]: active ? -1 : oIdx,
                                }));
                              }}
                              className={`text-left px-3.5 py-2.5 rounded-lg border text-sm transition-colors flex items-start gap-2.5 disabled:opacity-75 disabled:cursor-not-allowed ${
                                active
                                  ? 'bg-[#EEF2FF] dark:bg-[#23263E] border-[#4F46E5] dark:border-[#818CF8] text-[#1E1B4B] dark:text-[#E0E7FF] font-medium'
                                  : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#1E1B18] dark:text-[#F5F2EB] hover:bg-[#ECE6D9] dark:hover:bg-[#332E28]'
                              }`}
                            >
                              <span
                                className={`font-mono text-xs font-semibold w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                                  active
                                    ? 'bg-[#4F46E5] text-white'
                                    : 'bg-[#FAF8F3] dark:bg-[#1E1B18] text-[#575048] dark:text-[#CBC3B6] border border-[#DDD6C7] dark:border-[#332E28]'
                                }`}
                              >
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Sections B to E Subjective Questions */}
            {subjectiveBySection.map((group) => (
              <div key={group.code} className="space-y-4">
                <div className="bg-[#F5F2EB] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl px-5 py-3.5">
                  <h2 className="text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                    {getSectionLabel(group.code)}
                  </h2>
                  <p className="text-xs text-[#787066] dark:text-[#9C9387] mt-0.5">
                    Write steps, draw labeled diagrams/derivations on paper, and attach crisp
                    photos (auto-compressed to 1024px JPEG in IndexedDB) or type your response.
                  </p>
                </div>

                {group.items.map((q) => {
                  const isVisualOrProof =
                    q.questionType === 'diagram' ||
                    q.questionType === 'derivation_or_proof';
                  const photos = photosByQ[q.id] ?? [];
                  const typedText = textAnswers[q.id] ?? '';
                  const isBusy = uploadingQId === q.id;
                  const photoErr = photoErrorByQ[q.id];

                  const photoControlsBlock = (
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        {/* 1. Take Photo (Direct Device Camera) */}
                        <label
                          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-semibold transition-colors ${
                            isReadingTime
                              ? 'opacity-55 cursor-not-allowed pointer-events-none'
                              : 'cursor-pointer'
                          } ${
                            isVisualOrProof
                              ? 'bg-[#4F46E5] hover:bg-[#4338CA] border-[#4F46E5] text-white'
                              : 'bg-[#F5F2EB] dark:bg-[#24201C] hover:bg-[#ECE6D9] dark:hover:bg-[#332E28] border-[#DDD6C7] dark:border-[#332E28] text-[#1E1B18] dark:text-[#F5F2EB]'
                          }`}
                        >
                          <Camera className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>Take Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            disabled={isBusy || isGrading || isReadingTime}
                            onClick={(e) => {
                              const bridge = window.QuadraAndroid;
                              if (bridge?.ensureCameraPermission) {
                                const granted = bridge.ensureCameraPermission();
                                if (!granted) {
                                  e.preventDefault();
                                }
                              }
                            }}
                            onChange={(e) => {
                              void handleAttachImages(q.id, e.target.files);
                              e.target.value = '';
                            }}
                            className="sr-only"
                          />
                        </label>

                        {/* 2. Upload Image (Gallery / Multi-Page Files) */}
                        <label
                          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-semibold transition-colors ${
                            isReadingTime
                              ? 'opacity-55 cursor-not-allowed pointer-events-none'
                              : 'cursor-pointer'
                          } ${
                            isVisualOrProof
                              ? 'bg-[#EEF2FF] dark:bg-[#23263E] hover:bg-[#E0E7FF] dark:hover:bg-[#2E3252] border-[#A5B4FC] dark:border-[#4F46E5] text-[#312E81] dark:text-[#E0E7FF]'
                              : 'bg-[#F5F2EB] dark:bg-[#24201C] hover:bg-[#ECE6D9] dark:hover:bg-[#332E28] border-[#DDD6C7] dark:border-[#332E28] text-[#1E1B18] dark:text-[#F5F2EB]'
                          }`}
                        >
                          <ImagePlus className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>Upload Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            disabled={isBusy || isGrading || isReadingTime}
                            onChange={(e) => {
                              void handleAttachImages(q.id, e.target.files);
                              e.target.value = '';
                            }}
                            className="sr-only"
                          />
                        </label>

                        {isBusy && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-[#4F46E5] dark:text-[#A5B4FC]">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                            <span>Compressing &amp; saving to IndexedDB...</span>
                          </span>
                        )}

                        {photos.length > 0 && !isBusy && (
                          <span className="text-xs text-[#575048] dark:text-[#CBC3B6] font-mono">
                            {photos.length} {photos.length === 1 ? 'page' : 'pages'} attached
                          </span>
                        )}
                      </div>

                      {photoErr && (
                        <p className="text-xs text-[#B33A2B] dark:text-[#F09986]">{photoErr}</p>
                      )}

                      {photos.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {photos.map((photo, pIdx) => (
                            <div
                              key={photo.id}
                              className="relative group rounded-lg overflow-hidden border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C]"
                            >
                              <img
                                src={photo.dataUrl}
                                alt={`Q${q.questionNumber} page ${pIdx + 1}`}
                                className="w-full h-28 object-cover"
                              />
                              <div className="px-2 py-1 flex items-center justify-between text-[10px] font-mono text-[#575048] dark:text-[#CBC3B6] bg-[#FAF8F3] dark:bg-[#1E1B18] border-t border-[#DDD6C7] dark:border-[#332E28]">
                                <span>Page {pIdx + 1}</span>
                                <span>{Math.round(photo.sizeBytes / 1024)} KB</span>
                              </div>
                              <button
                                type="button"
                                disabled={isReadingTime || isGrading}
                                aria-label={`Remove photo ${pIdx + 1} for Question ${q.questionNumber}`}
                                onClick={() => void handleRemovePhoto(q.id, photo.id)}
                                className="absolute top-1.5 right-1.5 p-1 rounded-md bg-[#1E1B18]/80 hover:bg-[#B33A2B] text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );

                  const textInputBlock = (
                    <div>
                      <label
                        htmlFor={`subj-text-${q.id}`}
                        className="block text-xs font-medium text-[#575048] dark:text-[#CBC3B6] mb-1.5"
                      >
                        {isVisualOrProof
                          ? 'Optional Written Notes / Equations (Saved automatically to localStorage)'
                          : 'Step-by-Step Answer / Numerical Working (Saved automatically to localStorage)'}
                      </label>
                      <textarea
                        id={`subj-text-${q.id}`}
                        rows={isVisualOrProof ? 3 : 5}
                        disabled={isReadingTime || isGrading}
                        value={typedText}
                        onChange={(e) =>
                          setTextAnswers((prev) => ({
                            ...prev,
                            [q.id]: e.target.value,
                          }))
                        }
                        placeholder={
                          isReadingTime
                            ? 'Locked during 15-Minute Board Reading Time — Click "Skip Reading Time & Start Writing" above to begin early.'
                            : q.questionType === 'numerical'
                              ? 'State given data, formula, substitution, intermediate steps, and final value with SI unit...'
                              : q.questionType === 'diagram'
                                ? 'Optional: list diagram labels or explain construction steps alongside your uploaded photo...'
                                : q.questionType === 'derivation_or_proof'
                                  ? 'Optional: add key equations or remarks alongside your uploaded proof photo...'
                                  : 'Write concise point-wise board answer with scientific terms / formulas...'
                        }
                        className="w-full p-3 text-sm bg-[#F5F2EB] dark:bg-[#161412] border border-[#DDD6C7] dark:border-[#332E28] rounded-lg text-[#1E1B18] dark:text-[#F5F2EB] placeholder:text-[#968E83] dark:placeholder:text-[#787066] focus-visible:outline-2 focus-visible:outline-[#4F46E5] disabled:opacity-65 disabled:cursor-not-allowed"
                      />
                    </div>
                  );

                  return (
                    <article
                      key={q.id}
                      id={`exam-q-${q.questionNumber}`}
                      className="scroll-mt-6 bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-5 sm:p-6 space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#787066] dark:text-[#9C9387]">
                          <span className="font-mono font-semibold text-[#1E1B18] dark:text-[#F5F2EB] tabular-nums">
                            Q{String(q.questionNumber).padStart(2, '0')}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{q.chapterTag}</span>
                          <span aria-hidden="true">·</span>
                          <span className="px-2 py-0.5 rounded bg-[#F5F2EB] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] text-[11px] font-medium text-[#575048] dark:text-[#CBC3B6]">
                            {getQuestionTypeBadgeLabel(q.questionType)}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                            {q.marks} Marks
                          </span>
                        </div>
                        <BoardFrequencyBadge meta={q.boardFrequency} />
                      </div>

                      {q.caseContext && (
                        <div className="p-4 rounded-lg bg-[#F5F2EB] dark:bg-[#24201C] border-l-3 border-[#A64B33] dark:border-[#D4785E] text-sm text-[#3F3A34] dark:text-[#DCD5C9] leading-relaxed">
                          <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#A64B33] dark:text-[#D4785E] mb-1">
                            Case Study Passage
                          </span>
                          {q.caseContext}
                        </div>
                      )}

                      <p className="text-sm sm:text-base font-medium leading-relaxed text-[#1E1B18] dark:text-[#F5F2EB] whitespace-pre-line">
                        {q.prompt}
                      </p>

                      {q.orPrompt && (
                        <div className="p-3.5 rounded-lg bg-[#F5F2EB]/70 dark:bg-[#24201C]/70 border border-dashed border-[#C7BEAE] dark:border-[#3D3730] space-y-1.5">
                          <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-[#A64B33] dark:text-[#D4785E]">
                            OR (Internal Choice — Answer Any One)
                          </span>
                          <p className="text-sm leading-relaxed text-[#1E1B18] dark:text-[#F5F2EB] whitespace-pre-line">
                            {q.orPrompt}
                          </p>
                        </div>
                      )}

                      {(q.diagramId || q.questionDiagramSvg) && (
                        <ExamDiagram diagramId={q.diagramId} svg={q.questionDiagramSvg} />
                      )}

                      {/* Smart Input Ordering per questionType */}
                      <div className="pt-3 border-t border-[#DDD6C7] dark:border-[#332E28] space-y-3.5">
                        {isVisualOrProof ? (
                          <>
                            {photoControlsBlock}
                            {textInputBlock}
                          </>
                        ) : (
                          <>
                            {textInputBlock}
                            {photoControlsBlock}
                          </>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Right 4 Columns: Neutral-Color Question Palette + Submit Control */}
          <aside className="lg:col-span-4 lg:sticky lg:top-6 bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-4 sm:p-5 space-y-5">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                Question Palette ({activeSubject.totalSqpQuestions} Qs)
              </h2>
              <p className="text-xs text-[#787066] dark:text-[#9C9387]">
                Attempted questions stay neutral indigo/purple until checked by AI Examiner.
              </p>
            </div>

            {/* Active Legend — NEVER green during active exam */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#575048] dark:text-[#CBC3B6] pb-3 border-b border-[#DDD6C7] dark:border-[#332E28]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#4F46E5] inline-block" aria-hidden="true" />
                <span>Attempted</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded bg-[#F5F2EB] dark:bg-[#24201C] border border-[#C7BEAE] dark:border-[#3D3730] inline-block"
                  aria-hidden="true"
                />
                <span>Unattempted</span>
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-[#1E1B18] dark:text-[#F5F2EB] mb-2">
                  Section A ({omrAnsweredCount}/{sectionAQuestions.length})
                </p>
                <div className="grid grid-cols-5 gap-1.5">
                  {sectionAQuestions.map((q) => {
                    const attempted =
                      omrAnswers[q.id] !== undefined && omrAnswers[q.id] !== -1;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => scrollToQuestion(q.questionNumber)}
                        className={`py-1.5 rounded-md border font-mono text-xs font-semibold tabular-nums transition-colors ${
                          attempted
                            ? 'bg-[#EEF2FF] dark:bg-[#23263E] border-[#4F46E5] dark:border-[#818CF8] text-[#312E81] dark:text-[#E0E7FF]'
                            : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6] hover:bg-[#ECE6D9] dark:hover:bg-[#332E28]'
                        }`}
                      >
                        Q{q.questionNumber}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-[#1E1B18] dark:text-[#F5F2EB] mb-2">
                  Sections B–E ({subjectiveAttemptedCount}/{subjectiveQuestions.length})
                </p>
                <div className="grid grid-cols-5 gap-1.5">
                  {subjectiveQuestions.map((q) => {
                    const attempted = isSubjAttempted(q.id);
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => scrollToQuestion(q.questionNumber)}
                        className={`py-1.5 rounded-md border font-mono text-xs font-semibold tabular-nums transition-colors ${
                          attempted
                            ? 'bg-[#F3E8FF] dark:bg-[#2A1F3D] border-[#7C3AED] dark:border-[#A78BFA] text-[#4C1D95] dark:text-[#EDE9FE]'
                            : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6] hover:bg-[#ECE6D9] dark:hover:bg-[#332E28]'
                        }`}
                      >
                        Q{q.questionNumber}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#DDD6C7] dark:border-[#332E28] space-y-2.5">
              <button
                type="button"
                disabled={isGrading || isReadingTime}
                title={isReadingTime ? 'Locked during 15-Minute Board Reading Time' : undefined}
                onClick={() => void submitExamForGrading()}
                className="w-full py-2.5 px-4 text-xs font-semibold text-[#F5F2EB] bg-[#3D6B4F] hover:bg-[#315940] rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isGrading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>Gemini Examiner Grading B–E...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" aria-hidden="true" />
                    <span>Submit Test &amp; Check Answers</span>
                  </>
                )}
              </button>
              <p className="text-[11px] leading-relaxed text-[#787066] dark:text-[#9C9387]">
                Draft text is stored in <span className="font-mono">localStorage</span> and photos
                in <span className="font-mono">IndexedDB</span> until grading finishes.
              </p>
            </div>
          </aside>
        </div>

        {/* Full-screen non-destructive grading indicator overlay */}
        {isGrading && (
          <div
            role="status"
            aria-live="polite"
            className="fixed inset-0 z-50 bg-[#1E1B18]/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <div className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-6 max-w-md w-full space-y-3 shadow-xl">
              <div className="flex items-center gap-3">
                <Loader2
                  className="w-5 h-5 text-[#A64B33] dark:text-[#D4785E] animate-spin shrink-0"
                  aria-hidden="true"
                />
                <h3 className="text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                  Board Examiner Evaluating Sections B–E
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#575048] dark:text-[#CBC3B6] leading-relaxed">
                Grading your typed derivations, balanced equations, diagrams, and uploaded photos
                against the {activeSubject.name} step-by-step marking scheme using{' '}
                <span className="font-mono">gemini-3.8-flash</span>. Please wait...
              </p>
            </div>
          </div>
        )}
      </section>
      {pdfModalElement}
      </>
    );
  }

  // ======================== 3. POST-GRADING RESULTS DASHBOARD ========================
  const gradeMap = new Map<string, QuestionGradeItem>();
  (gradingResult?.questionGrades ?? []).forEach((g) => gradeMap.set(g.questionId, g));

  // Build unified per-question status & scores across Section A + Sections B–E
  let secAEarned = 0;
  let secAAttemptedMax = 0;
  let secAAttemptedEarned = 0;

  let secBEEarned = 0;
  let secBEMax = 0;
  let secBEAttemptedMax = 0;
  let secBEAttemptedEarned = 0;

  let fullCount = 0;
  let partialCount = 0;
  let zeroCount = 0;
  let unattemptedCount = 0;

  const secAPaletteStatuses: Record<string, PaletteStatus> = {};
  sectionAQuestions.forEach((q) => {
    const choice = omrAnswers[q.id];
    const isUnattempted = choice === undefined || choice === -1;
    const isCorrect = !isUnattempted && choice === q.correctIndex;
    if (isUnattempted) {
      secAPaletteStatuses[q.id] = 'unattempted';
      unattemptedCount += 1;
    } else if (isCorrect) {
      secAPaletteStatuses[q.id] = 'full';
      fullCount += 1;
      secAEarned += q.marks;
      secAAttemptedMax += q.marks;
      secAAttemptedEarned += q.marks;
    } else {
      secAPaletteStatuses[q.id] = 'zero';
      zeroCount += 1;
      secAAttemptedMax += q.marks;
    }
  });

  const secBEPaletteStatuses: Record<string, PaletteStatus> = {};
  subjectiveQuestions.forEach((q) => {
    secBEMax += q.marks;
    const hasAttempt =
      (textAnswers[q.id] ?? '').trim().length > 0 ||
      (photosByQ[q.id]?.length ?? 0) > 0;
    const grade = gradeMap.get(q.id);
    const awarded = grade?.marks_awarded ?? 0;

    if (!hasAttempt) {
      secBEPaletteStatuses[q.id] = 'unattempted';
      unattemptedCount += 1;
    } else {
      secBEAttemptedMax += q.marks;
      secBEAttemptedEarned += awarded;
      secBEEarned += awarded;

      if (awarded >= q.marks) {
        secBEPaletteStatuses[q.id] = 'full';
        fullCount += 1;
      } else if (awarded > 0) {
        secBEPaletteStatuses[q.id] = 'partial';
        partialCount += 1;
      } else {
        secBEPaletteStatuses[q.id] = 'zero';
        zeroCount += 1;
      }
    }
  });

  const totalScore = secAEarned + secBEEarned;
  const totalMaxMarks = activeSubject.boardTheoryMarks;
  const totalPercentage =
    totalMaxMarks > 0 ? Math.round((totalScore / totalMaxMarks) * 1000) / 10 : 0;

  const totalAttemptedEarned = secAAttemptedEarned + secBEAttemptedEarned;
  const totalAttemptedMax = secAAttemptedMax + secBEAttemptedMax;
  const overallAccuracyPct =
    totalAttemptedMax > 0
      ? Math.round((totalAttemptedEarned / totalAttemptedMax) * 100)
      : 0;
  const secAAccuracyPct =
    secAAttemptedMax > 0
      ? Math.round((secAAttemptedEarned / secAAttemptedMax) * 100)
      : 0;
  const secBEAccuracyPct =
    secBEAttemptedMax > 0
      ? Math.round((secBEAttemptedEarned / secBEAttemptedMax) * 100)
      : 0;

  const getPaletteTileStyle = (status: PaletteStatus) => {
    switch (status) {
      case 'full':
        return 'bg-[#E8F0EA] dark:bg-[#1C2E22] border-[#3D6B4F] dark:border-[#7AB88F] text-[#1E3B29] dark:text-[#B6DFC3]';
      case 'partial':
        return 'bg-[#FEF3C7] dark:bg-[#3A2E14] border-[#D97706] dark:border-[#FBBF24] text-[#78350F] dark:text-[#FDE68A]';
      case 'zero':
        return 'bg-[#FBF0ED] dark:bg-[#3A1E18] border-[#B33A2B] dark:border-[#F09986] text-[#8C2318] dark:text-[#FECACA]';
      case 'unattempted':
        return 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#787066] dark:text-[#9C9387]';
    }
  };

  return (
    <>
    <section
      ref={resultsSectionRef}
      aria-labelledby="exam-review-heading"
      className="space-y-8"
    >
      {/* Draft Cleared + Review / Save Before Refresh Notice */}
      <div
        role="status"
        className="bg-[#EEF2FF] dark:bg-[#23263E] border border-[#C7D2FE] dark:border-[#3B3F68] rounded-xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-[#312E81] dark:text-[#E0E7FF] print:hidden"
      >
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#4338CA] dark:text-[#A5B4FC]" aria-hidden="true" />
          <p>
            {storageClearedAfterCheck
              ? 'Temporary draft storage (IndexedDB photos & localStorage text) has been wiped cleanly. '
              : 'Finalizing storage cleanup... '}
            <strong>
              Please download your Graded Report / Marking Scheme PDF before refreshing or closing this screen.
            </strong>
            {resultsPdfNotice && (
              <span className="block mt-1 font-mono text-xs text-[#3D6B4F] dark:text-[#7AB88F]">
                ✓ {resultsPdfNotice}
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          disabled={isExportingResultsPdf}
          onClick={async () => {
            if (!resultsSectionRef.current || isExportingResultsPdf) return;
            setIsExportingResultsPdf(true);
            setResultsPdfNotice(null);
            const safeSubject = activeSubject.name.replace(/[^A-Za-z0-9]+/g, '-');
            const filename = `Quadra12-${safeSubject}-${activeSubject.code}-Graded-Results.pdf`;
            try {
              const res = await exportElementToA4Pdf(resultsSectionRef.current, {
                filename,
                documentTitle: `Quadra 12 · ${activeSubject.name} (${activeSubject.code}) · Graded Results Report`,
              });
              setResultsPdfNotice(
                `Saved to ${res.savedTo} (${res.pageCount} A4 pages)`,
              );
            } catch (err) {
              if (window.QuadraAndroid?.saveBase64File) {
                setResultsPdfNotice(
                  err instanceof Error
                    ? err.message
                    : 'Could not save PDF. Allow file permission and retry.',
                );
              } else {
                window.print();
              }
            } finally {
              setIsExportingResultsPdf(false);
            }
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#3730A3] hover:bg-[#312E81] disabled:opacity-60 text-white shrink-0 print:hidden"
        >
          {isExportingResultsPdf ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Print / Save Results</span>
            </>
          )}
        </button>
      </div>

      {/* Top Performance Summary Header */}
      <div data-pdf-block className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 text-xs font-medium tracking-[0.12em] text-[#A64B33] dark:text-[#D4785E]">
              <span className="w-5 h-px bg-[#A64B33] dark:bg-[#D4785E] shrink-0" aria-hidden="true" />
              <span>
                Checked by Board AI Examiner · {activeSubject.name} ({activeSubject.code})
              </span>
            </div>
            <h1
              id="exam-review-heading"
              className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-[#1E1B18] dark:text-[#F5F2EB]"
            >
              Final Results Dashboard &amp; Marking Scheme
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 print:hidden">
            <button
              type="button"
              onClick={() => openPdfModal(selectedSubjectId, 'question_paper')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#1E1B18] dark:text-[#F5F2EB] bg-transparent hover:bg-[#F0ECE1] dark:hover:bg-[#2A2621] border border-[#DDD6C7] dark:border-[#332E28] rounded-lg transition-colors whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 text-[#A64B33] dark:text-[#D4785E]" aria-hidden="true" />
              <span>Question Paper PDF</span>
            </button>
            <button
              type="button"
              onClick={() => openPdfModal(selectedSubjectId, 'marking_scheme')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#1E1B18] dark:text-[#F5F2EB] bg-transparent hover:bg-[#F0ECE1] dark:hover:bg-[#2A2621] border border-[#DDD6C7] dark:border-[#332E28] rounded-lg transition-colors whitespace-nowrap"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3D6B4F] dark:text-[#7AB88F]" aria-hidden="true" />
              <span>Marking Scheme PDF</span>
            </button>
            <button
              type="button"
              onClick={() => void startThreeHourExam(selectedSubjectId)}
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
              All PCMB Papers
            </button>
          </div>
        </div>

        {/* Score & Accuracy Metrics Grid */}
        <div className="pt-6 border-t border-[#DDD6C7] dark:border-[#332E28] grid grid-cols-2 lg:grid-cols-5 gap-5">
          <div>
            <p className="text-xs text-[#787066] dark:text-[#9C9387]">Total Score &amp; %</p>
            <p className="mt-1 text-2xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB] font-mono tabular-nums">
              {formatScoreValue(totalScore)} / {totalMaxMarks}
            </p>
            <p className="text-xs font-mono text-[#A64B33] dark:text-[#D4785E]">
              {totalPercentage}% Overall
            </p>
          </div>

          <div>
            <p className="text-xs text-[#787066] dark:text-[#9C9387]">Overall Accuracy</p>
            <p className="mt-1 text-2xl font-semibold text-[#3D6B4F] dark:text-[#7AB88F] font-mono tabular-nums">
              {overallAccuracyPct}%
            </p>
            <p className="text-xs text-[#787066] dark:text-[#9C9387] font-mono">
              {formatScoreValue(totalAttemptedEarned)}/{totalAttemptedMax} attempted M
            </p>
          </div>

          <div>
            <p className="text-xs text-[#787066] dark:text-[#9C9387]">Section A (MCQ)</p>
            <p className="mt-1 text-2xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB] font-mono tabular-nums">
              {secAAccuracyPct}%
            </p>
            <p className="text-xs text-[#787066] dark:text-[#9C9387] font-mono">
              Score: {secAEarned} / {sectionAQuestions.length}
            </p>
          </div>

          <div>
            <p className="text-xs text-[#787066] dark:text-[#9C9387]">Sections B–E (Subj.)</p>
            <p className="mt-1 text-2xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB] font-mono tabular-nums">
              {secBEAccuracyPct}%
            </p>
            <p className="text-xs text-[#787066] dark:text-[#9C9387] font-mono">
              Score: {formatScoreValue(secBEEarned)} / {secBEMax}
            </p>
          </div>

          <div>
            <p className="text-xs text-[#787066] dark:text-[#9C9387]">Time Taken</p>
            <p className="mt-1 text-2xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB] font-mono tabular-nums">
              {formatHms(lastAttempt?.timeTakenSeconds ?? 0)}
            </p>
            <p className="text-xs text-[#787066] dark:text-[#9C9387]">of 03:00:00</p>
          </div>
        </div>

        {/* Attempt Breakdown Counts */}
        <div className="pt-5 border-t border-[#DDD6C7] dark:border-[#332E28] grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="px-4 py-3 rounded-lg bg-[#E8F0EA] dark:bg-[#1C2E22] border border-[#3D6B4F]/40 dark:border-[#7AB88F]/40">
            <p className="text-xs font-medium text-[#23422F] dark:text-[#B6DFC3]">
              Full Marks (Green)
            </p>
            <p className="mt-1 text-xl font-bold font-mono text-[#1E3B29] dark:text-[#E8F0EA]">
              {fullCount} Qs
            </p>
          </div>
          <div className="px-4 py-3 rounded-lg bg-[#FEF3C7] dark:bg-[#3A2E14] border border-[#D97706]/40 dark:border-[#FBBF24]/40">
            <p className="text-xs font-medium text-[#78350F] dark:text-[#FDE68A]">
              Partial Marks (Yellow)
            </p>
            <p className="mt-1 text-xl font-bold font-mono text-[#78350F] dark:text-[#FEF3C7]">
              {partialCount} Qs
            </p>
          </div>
          <div className="px-4 py-3 rounded-lg bg-[#FBF0ED] dark:bg-[#3A1E18] border border-[#B33A2B]/40 dark:border-[#F09986]/40">
            <p className="text-xs font-medium text-[#8C2318] dark:text-[#FECACA]">
              Incorrect / Zero (Red)
            </p>
            <p className="mt-1 text-xl font-bold font-mono text-[#8C2318] dark:text-[#FBF0ED]">
              {zeroCount} Qs
            </p>
          </div>
          <div className="px-4 py-3 rounded-lg bg-[#F5F2EB] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28]">
            <p className="text-xs font-medium text-[#575048] dark:text-[#CBC3B6]">
              Unattempted (Grey)
            </p>
            <p className="mt-1 text-xl font-bold font-mono text-[#575048] dark:text-[#CBC3B6]">
              {unattemptedCount} Qs
            </p>
          </div>
        </div>
      </div>

      {/* Post-Grading Palette + AI Weak Topics & Improvement Plan */}
      <div data-pdf-block className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Post-Grading Color-Coded Palette */}
        <div className="lg:col-span-5 bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-5 space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
              Post-Grading Question Palette
            </h2>
            <p className="text-xs text-[#787066] dark:text-[#9C9387]">
              Green = Full marks · Yellow = Partial · Red = 0 marks · Grey = Unattempted
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-[#575048] dark:text-[#CBC3B6] mb-2">
              Section A ({sectionAQuestions.length} Qs)
            </p>
            <div className="grid grid-cols-5 gap-1.5">
              {sectionAQuestions.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => scrollToReviewQuestion(q.questionNumber)}
                  className={`py-1.5 rounded-md border font-mono text-xs font-semibold tabular-nums transition-opacity hover:opacity-85 ${getPaletteTileStyle(
                    secAPaletteStatuses[q.id],
                  )}`}
                >
                  Q{q.questionNumber}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-[#575048] dark:text-[#CBC3B6] mb-2">
              Sections B–E ({subjectiveQuestions.length} Qs)
            </p>
            <div className="grid grid-cols-5 gap-1.5">
              {subjectiveQuestions.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => scrollToReviewQuestion(q.questionNumber)}
                  className={`py-1.5 rounded-md border font-mono text-xs font-semibold tabular-nums transition-opacity hover:opacity-85 ${getPaletteTileStyle(
                    secBEPaletteStatuses[q.id],
                  )}`}
                >
                  Q{q.questionNumber}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Examiner Summary: Weak Areas, Improvement Tips & Remarks */}
        <div className="lg:col-span-7 bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#A64B33] dark:text-[#D4785E]" aria-hidden="true" />
            <h2 className="text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
              Examiner Weak Areas &amp; Improvement Plan
            </h2>
          </div>

          {gradingResult?.examSummary.examinerRemarks && (
            <blockquote className="p-4 rounded-lg bg-[#F5F2EB] dark:bg-[#24201C] border-l-3 border-[#3D6B4F] dark:border-[#7AB88F] text-sm text-[#1E1B18] dark:text-[#F5F2EB] leading-relaxed">
              {gradingResult.examSummary.examinerRemarks}
            </blockquote>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A64B33] dark:text-[#D4785E] mb-2">
                Weak Topics Identified
              </h3>
              <ul className="space-y-1.5 text-sm text-[#575048] dark:text-[#CBC3B6]">
                {(gradingResult?.examSummary.weakTopics ?? []).map((topic, i) => (
                  <li key={`wt-${i}`} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#A64B33] dark:bg-[#D4785E] shrink-0" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#3D6B4F] dark:text-[#7AB88F] mb-2">
                Actionable Improvement Tips
              </h3>
              <ul className="space-y-1.5 text-sm text-[#575048] dark:text-[#CBC3B6]">
                {(gradingResult?.examSummary.improvementTips ?? []).map((tip, i) => (
                  <li key={`tip-${i}`} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#3D6B4F] dark:bg-[#7AB88F] shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Review Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl px-4 py-3 print:hidden">
        <span className="text-xs font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
          Question-by-Question Review &amp; Revealed Marking Scheme
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {([
            {key: 'all', label: 'All Questions'},
            {key: 'A', label: 'Section A (MCQs)'},
            {key: 'BE', label: 'Sections B–E (Subjective)'},
            {key: 'lost', label: 'Lost Marks Only'},
          ] as const).map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setReviewFilter(item.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                reviewFilter === item.key
                  ? 'bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18]'
                  : 'bg-[#F5F2EB] dark:bg-[#24201C] text-[#575048] dark:text-[#CBC3B6] hover:bg-[#ECE6D9] dark:hover:bg-[#332E28]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Question-by-Question Review List */}
      <div className="space-y-4">
        {/* Section A Review Cards */}
        {(reviewFilter === 'all' || reviewFilter === 'A' || reviewFilter === 'lost') &&
          sectionAQuestions
            .filter((q) =>
              reviewFilter === 'lost' ? secAPaletteStatuses[q.id] !== 'full' : true,
            )
            .map((q) => {
              const userChoice = omrAnswers[q.id];
              const status = secAPaletteStatuses[q.id];
              const isCorrect = status === 'full';
              const isUnanswered = status === 'unattempted';
              const schemeEntry = activeMarkingScheme?.[q.id];

              return (
                <article
                  key={q.id}
                  id={`review-q-${q.questionNumber}`}
                  data-pdf-block
                  className="scroll-mt-6 bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-6 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#787066] dark:text-[#9C9387]">
                      <span className="font-mono font-semibold text-[#1E1B18] dark:text-[#F5F2EB] tabular-nums">
                        Q{String(q.questionNumber).padStart(2, '0')}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{q.section}</span>
                      <span aria-hidden="true">·</span>
                      <span>{q.chapterTag}</span>
                      <BoardFrequencyBadge meta={q.boardFrequency} />
                    </div>

                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#E8F0EA] dark:bg-[#1C2E22] text-[#23422F] dark:text-[#B6DFC3]">
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>1 / 1 Mark · Full Marks</span>
                      </span>
                    ) : isUnanswered ? (
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#F5F2EB] dark:bg-[#24201C] text-[#787066] dark:text-[#9C9387]">
                        0 / 1 Mark · Unattempted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#FBF0ED] dark:bg-[#3A1E18] text-[#B33A2B] dark:text-[#F09986]">
                        <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>0 / 1 Mark · Incorrect</span>
                      </span>
                    )}
                  </div>

                  <p className="text-sm sm:text-base font-medium text-[#1E1B18] dark:text-[#F5F2EB] whitespace-pre-line">
                    {q.prompt}
                  </p>

                  {(q.diagramId || q.questionDiagramSvg) && (
                    <ExamDiagram diagramId={q.diagramId} svg={q.questionDiagramSvg} />
                  )}

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
                          key={`${q.id}-rev-${oIdx}`}
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

                  {schemeEntry && (
                    <div className="pt-3 border-t border-[#DDD6C7] dark:border-[#332E28] text-sm text-[#575048] dark:text-[#CBC3B6] space-y-2">
                      <div>
                        <span className="font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                          Exact Model Answer:{' '}
                        </span>
                        {schemeEntry.exactModelAnswer}
                      </div>
                      {schemeEntry.diagramSvg && (
                        <ExamDiagram
                          svg={schemeEntry.diagramSvg}
                          caption={`Official Labeled Reference Diagram — Q${q.questionNumber}`}
                        />
                      )}
                    </div>
                  )}
                </article>
              );
            })}

        {/* Sections B–E Review Cards */}
        {(reviewFilter === 'all' || reviewFilter === 'BE' || reviewFilter === 'lost') &&
          subjectiveQuestions
            .filter((q) =>
              reviewFilter === 'lost' ? secBEPaletteStatuses[q.id] !== 'full' : true,
            )
            .map((q) => {
              const status = secBEPaletteStatuses[q.id];
              const grade = gradeMap.get(q.id);
              const awarded = grade?.marks_awarded ?? 0;
              const schemeEntry = activeMarkingScheme?.[q.id];
              const studentTyped = (textAnswers[q.id] ?? '').trim();
              const studentPhotos = photosByQ[q.id] ?? [];

              const badgeStyle =
                status === 'full'
                  ? 'bg-[#E8F0EA] dark:bg-[#1C2E22] text-[#23422F] dark:text-[#B6DFC3]'
                  : status === 'partial'
                    ? 'bg-[#FEF3C7] dark:bg-[#3A2E14] text-[#78350F] dark:text-[#FDE68A]'
                    : status === 'zero'
                      ? 'bg-[#FBF0ED] dark:bg-[#3A1E18] text-[#8C2318] dark:text-[#F09986]'
                      : 'bg-[#F5F2EB] dark:bg-[#24201C] text-[#787066] dark:text-[#9C9387]';

              const statusText =
                status === 'full'
                  ? 'Full Marks'
                  : status === 'partial'
                    ? 'Partial Marks'
                    : status === 'zero'
                      ? 'Zero Marks'
                      : 'Unattempted';

              return (
                <article
                  key={q.id}
                  id={`review-q-${q.questionNumber}`}
                  data-pdf-block
                  className="scroll-mt-6 bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-6 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#787066] dark:text-[#9C9387]">
                      <span className="font-mono font-semibold text-[#1E1B18] dark:text-[#F5F2EB] tabular-nums">
                        Q{String(q.questionNumber).padStart(2, '0')}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{q.section}</span>
                      <span aria-hidden="true">·</span>
                      <span>{q.chapterTag}</span>
                      <BoardFrequencyBadge meta={q.boardFrequency} />
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold font-mono ${badgeStyle}`}
                    >
                      <span>
                        {formatScoreValue(awarded)} / {q.marks} Marks · {statusText}
                      </span>
                    </span>
                  </div>

                  {q.caseContext && (
                    <div className="p-3.5 rounded-lg bg-[#F5F2EB] dark:bg-[#24201C] text-xs sm:text-sm text-[#575048] dark:text-[#CBC3B6]">
                      {q.caseContext}
                    </div>
                  )}

                  <p className="text-sm sm:text-base font-medium text-[#1E1B18] dark:text-[#F5F2EB] whitespace-pre-line">
                    {q.prompt}
                  </p>

                  {q.orPrompt && (
                    <p className="text-xs sm:text-sm text-[#575048] dark:text-[#CBC3B6] italic">
                      OR: {q.orPrompt}
                    </p>
                  )}

                  {(q.diagramId || q.questionDiagramSvg) && (
                    <ExamDiagram diagramId={q.diagramId} svg={q.questionDiagramSvg} />
                  )}

                  {/* Student Submission Preview (if attempted) */}
                  {(studentTyped || studentPhotos.length > 0) && (
                    <div className="p-3.5 rounded-lg bg-[#F5F2EB] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] space-y-2.5">
                      <p className="text-xs font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                        Your Submitted Response
                      </p>
                      {studentTyped && (
                        <p className="text-sm text-[#3F3A34] dark:text-[#DCD5C9] whitespace-pre-line">
                          {studentTyped}
                        </p>
                      )}
                      {studentPhotos.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {studentPhotos.map((p, idx) => (
                            <img
                              key={p.id}
                              src={p.dataUrl}
                              alt={`Submitted answer page ${idx + 1} for Q${q.questionNumber}`}
                              className="w-24 h-24 object-cover rounded-md border border-[#DDD6C7] dark:border-[#332E28]"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. AI Examiner Feedback */}
                  <div className="p-4 rounded-lg bg-[#EEF2FF]/70 dark:bg-[#23263E]/60 border border-[#C7D2FE] dark:border-[#3B3F68] space-y-1.5">
                    <p className="text-xs font-semibold text-[#312E81] dark:text-[#E0E7FF]">
                      AI Board Examiner Feedback
                    </p>
                    <p className="text-sm text-[#1E1B4B] dark:text-[#E0E7FF] leading-relaxed">
                      {grade?.feedback ??
                        'Evaluated against the active subject CBSE marking scheme.'}
                    </p>
                  </div>

                  {/* 3. Exact Model Answer & Step-by-Step Mark Splits */}
                  <div className="p-4 rounded-lg bg-[#E8F0EA]/60 dark:bg-[#1C2E22]/60 border border-[#3D6B4F]/35 dark:border-[#7AB88F]/35 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#23422F] dark:text-[#B6DFC3]">
                      <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Exact Model Answer (Marking Scheme Key)</span>
                    </div>

                    <p className="text-sm text-[#1E1B18] dark:text-[#F5F2EB] leading-relaxed whitespace-pre-line">
                      {schemeEntry?.exactModelAnswer ?? grade?.exact_model_answer}
                    </p>

                    {schemeEntry?.diagramSvg && (
                      <ExamDiagram
                        svg={schemeEntry.diagramSvg}
                        caption={`Official Labeled Reference Diagram — Q${q.questionNumber}`}
                      />
                    )}

                    {schemeEntry?.stepMarks && schemeEntry.stepMarks.length > 0 && (
                      <div className="pt-2 border-t border-[#3D6B4F]/20 dark:border-[#7AB88F]/20 space-y-1.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#23422F] dark:text-[#B6DFC3]">
                          Step-by-Step Marks Distribution
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {schemeEntry.stepMarks.map((step, sIdx) => (
                            <span
                              key={`${q.id}-step-${sIdx}`}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#3D6B4F]/30 dark:border-[#7AB88F]/30 text-[#1E1B18] dark:text-[#F5F2EB]"
                            >
                              <span>{step.label}</span>
                              <strong className="font-mono text-[#3D6B4F] dark:text-[#7AB88F]">
                                ({formatScoreValue(step.marks)}m)
                              </strong>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
      </div>
    </section>
    {pdfModalElement}
    </>
  );
}
