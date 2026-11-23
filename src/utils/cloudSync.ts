import QRCode from 'qrcode';
import {
  Timestamp,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {OperationType, db, handleFirestoreError} from '../firebase';
import {ChapterTaskState, SubjectId} from '../data/pcmbData';

export const STORAGE_SYNC_CODE_KEY = 'pcmb_desk_sync_code_v1';
export const STORAGE_AUTO_SYNC_KEY = 'pcmb_desk_auto_sync_v1';
export const STORAGE_LAST_SYNCED_KEY = 'pcmb_desk_last_synced_v1';
export const STORAGE_CUSTOM_BOARD_DATE_KEY = 'pcmb_desk_custom_board_date_v1';

export interface ExamAttemptSummary {
  score: number;
  totalMarks: number;
  accuracy: number;
  timeTakenSeconds: number;
}

export interface SyncableWorkspaceState {
  completedChapters: Record<string, boolean>;
  chapterTasks: Record<string, ChapterTaskState>;
  watchedLectures: Record<string, boolean>;
  bestScores: Partial<Record<SubjectId, ExamAttemptSummary>>;
  dailyChapterLog: Record<string, string[]>;
  customBoardDate: string;
  theme: 'light' | 'dark';
  soundMuted: boolean;
}

export interface SyncSessionDocument {
  syncCode: string;
  completedChapterIds: string[];
  chapterTasks: Record<string, ChapterTaskState>;
  watchedLectureIds: string[];
  bestScores: Partial<Record<SubjectId, ExamAttemptSummary>>;
  dailyChapterLog: Record<string, string[]>;
  customBoardDate: string;
  theme: 'light' | 'dark';
  soundMuted: boolean;
  createdAt?: Timestamp | unknown;
  updatedAt?: Timestamp | unknown;
}

export function isValidSixDigitCode(code: string): boolean {
  return /^\d{6}$/.test(code.trim());
}

export function generateRandomSixDigitCode(): string {
  // Ensures 100000 - 999999 clean 6-digit code
  const num = Math.floor(100000 + Math.random() * 900000);
  return String(num);
}

export function formatSyncCodeDisplay(code: string): string {
  const clean = code.replace(/\D/g, '').slice(0, 6);
  if (clean.length === 6) {
    return `${clean.slice(0, 3)} ${clean.slice(3)}`;
  }
  return clean;
}

export function getSavedSyncCode(): string | null {
  try {
    const val = window.localStorage.getItem(STORAGE_SYNC_CODE_KEY);
    return val && isValidSixDigitCode(val) ? val : null;
  } catch {
    return null;
  }
}

export function getOrCreateLocalSyncCode(): string {
  const existing = getSavedSyncCode();
  if (existing) return existing;
  const fresh = generateRandomSixDigitCode();
  saveLocalSyncCode(fresh);
  return fresh;
}

export function saveLocalSyncCode(code: string): void {
  try {
    window.localStorage.setItem(STORAGE_SYNC_CODE_KEY, code);
  } catch {
    // Ignore storage errors
  }
}

export function getAutoSyncEnabled(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_AUTO_SYNC_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAutoSyncEnabled(enabled: boolean): void {
  try {
    window.localStorage.setItem(STORAGE_AUTO_SYNC_KEY, String(enabled));
  } catch {
    // Ignore storage errors
  }
}

export function getLastSyncedIso(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_LAST_SYNCED_KEY);
  } catch {
    return null;
  }
}

export function setLastSyncedIso(iso: string): void {
  try {
    window.localStorage.setItem(STORAGE_LAST_SYNCED_KEY, iso);
  } catch {
    // Ignore storage errors
  }
}

function sanitizeStateForCloud(
  syncCode: string,
  state: SyncableWorkspaceState,
): Omit<SyncSessionDocument, 'createdAt' | 'updatedAt'> {
  const completedChapterIds = Object.keys(state.completedChapters)
    .filter((k) => Boolean(state.completedChapters[k]) && k.length <= 32)
    .slice(0, 60);

  const chapterTasksEntries = Object.entries(state.chapterTasks)
    .filter(([k]) => k.length <= 32)
    .slice(0, 60);
  const chapterTasks: Record<string, ChapterTaskState> = {};
  for (const [k, v] of chapterTasksEntries) {
    chapterTasks[k] = {
      lecture: Boolean(v.lecture),
      practice: Boolean(v.practice),
      ncert: Boolean(v.ncert),
      pyq: Boolean(v.pyq),
    };
  }

  const watchedLectureIds = Object.keys(state.watchedLectures)
    .filter((k) => Boolean(state.watchedLectures[k]) && k.length <= 32)
    .slice(0, 60);

  const bestScoresEntries = Object.entries(state.bestScores).slice(0, 6);
  const bestScores: Partial<Record<SubjectId, ExamAttemptSummary>> = {};
  for (const [sub, val] of bestScoresEntries) {
    if (val) {
      bestScores[sub as SubjectId] = {
        score: Number(val.score) || 0,
        totalMarks: Number(val.totalMarks) || 0,
        accuracy: Number(val.accuracy) || 0,
        timeTakenSeconds: Number(val.timeTakenSeconds) || 0,
      };
    }
  }

  const dailyEntries = Object.entries(state.dailyChapterLog).slice(-365);
  const dailyChapterLog: Record<string, string[]> = {};
  for (const [dateKey, arr] of dailyEntries) {
    if (Array.isArray(arr) && arr.length > 0) {
      dailyChapterLog[dateKey] = arr.slice(0, 60);
    }
  }

  return {
    syncCode,
    completedChapterIds,
    chapterTasks,
    watchedLectureIds,
    bestScores,
    dailyChapterLog,
    customBoardDate: (state.customBoardDate || '').slice(0, 20),
    theme: state.theme === 'dark' ? 'dark' : 'light',
    soundMuted: Boolean(state.soundMuted),
  };
}

export async function pushSyncSession(
  syncCode: string,
  state: SyncableWorkspaceState,
): Promise<string> {
  if (!isValidSixDigitCode(syncCode)) {
    throw new Error('Sync code must be exactly 6 digits.');
  }
  const path = `syncSessions/${syncCode}`;
  const ref = doc(db, 'syncSessions', syncCode);
  const cleanPayload = sanitizeStateForCloud(syncCode, state);

  try {
    const existingSnap = await getDoc(ref);
    if (existingSnap.exists()) {
      await updateDoc(ref, {
        completedChapterIds: cleanPayload.completedChapterIds,
        chapterTasks: cleanPayload.chapterTasks,
        watchedLectureIds: cleanPayload.watchedLectureIds,
        bestScores: cleanPayload.bestScores,
        dailyChapterLog: cleanPayload.dailyChapterLog,
        customBoardDate: cleanPayload.customBoardDate,
        theme: cleanPayload.theme,
        soundMuted: cleanPayload.soundMuted,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(ref, {
        ...cleanPayload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    const nowIso = new Date().toISOString();
    setLastSyncedIso(nowIso);
    return nowIso;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function pullSyncSession(syncCode: string): Promise<{
  state: SyncableWorkspaceState;
  updatedAtIso: string;
} | null> {
  if (!isValidSixDigitCode(syncCode)) {
    throw new Error('Sync code must be exactly 6 digits.');
  }
  const path = `syncSessions/${syncCode}`;
  const ref = doc(db, 'syncSessions', syncCode);

  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return null;
    }
    const data = snap.data() as SyncSessionDocument;

    const completedChapters: Record<string, boolean> = {};
    if (Array.isArray(data.completedChapterIds)) {
      data.completedChapterIds.forEach((id) => {
        completedChapters[id] = true;
      });
    }

    const watchedLectures: Record<string, boolean> = {};
    if (Array.isArray(data.watchedLectureIds)) {
      data.watchedLectureIds.forEach((id) => {
        watchedLectures[id] = true;
      });
    }

    let updatedAtIso = new Date().toISOString();
    if (
      data.updatedAt &&
      typeof (data.updatedAt as Timestamp).toDate === 'function'
    ) {
      updatedAtIso = (data.updatedAt as Timestamp).toDate().toISOString();
    }

    return {
      state: {
        completedChapters,
        chapterTasks: data.chapterTasks ?? {},
        watchedLectures,
        bestScores: data.bestScores ?? {},
        dailyChapterLog: data.dailyChapterLog ?? {},
        customBoardDate:
          typeof data.customBoardDate === 'string' ? data.customBoardDate : '',
        theme: data.theme === 'dark' ? 'dark' : 'light',
        soundMuted: Boolean(data.soundMuted),
      },
      updatedAtIso,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export function buildSyncShareUrl(syncCode: string): string {
  if (typeof window === 'undefined') {
    return `https://ariyanpal1008.github.io/Quadra12/?sync=${syncCode}`;
  }
  const url = new URL(window.location.href);
  url.searchParams.set('sync', syncCode);
  return url.toString();
}

export async function generateSyncQrDataUrl(
  syncCode: string,
  darkMode: boolean,
): Promise<string> {
  const shareUrl = buildSyncShareUrl(syncCode);
  return QRCode.toDataURL(shareUrl, {
    width: 240,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: {
      dark: darkMode ? '#161412' : '#1E1B18',
      light: '#FFFFFF',
    },
  });
}

export function buildOfflineBackupPayload(state: SyncableWorkspaceState): string {
  return JSON.stringify(
    {
      app: 'Quadra 12',
      version: 1,
      exportedAt: new Date().toISOString(),
      data: state,
    },
    null,
    2,
  );
}

export function parseOfflineBackupPayload(
  rawJson: string,
): SyncableWorkspaceState | null {
  try {
    const parsed = JSON.parse(rawJson) as {
      app?: string;
      data?: Partial<SyncableWorkspaceState>;
    };
    const payload = parsed?.data;
    if (!payload || typeof payload !== 'object') return null;
    return {
      completedChapters:
        payload.completedChapters && typeof payload.completedChapters === 'object'
          ? payload.completedChapters
          : {},
      chapterTasks:
        payload.chapterTasks && typeof payload.chapterTasks === 'object'
          ? payload.chapterTasks
          : {},
      watchedLectures:
        payload.watchedLectures && typeof payload.watchedLectures === 'object'
          ? payload.watchedLectures
          : {},
      bestScores:
        payload.bestScores && typeof payload.bestScores === 'object'
          ? payload.bestScores
          : {},
      dailyChapterLog:
        payload.dailyChapterLog && typeof payload.dailyChapterLog === 'object'
          ? payload.dailyChapterLog
          : {},
      customBoardDate:
        typeof payload.customBoardDate === 'string'
          ? payload.customBoardDate
          : '',
      theme: payload.theme === 'dark' ? 'dark' : 'light',
      soundMuted: Boolean(payload.soundMuted),
    };
  } catch {
    return null;
  }
}
