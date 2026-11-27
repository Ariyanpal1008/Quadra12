import type {
  ActiveOmrDraft,
  ChapterStudyStatus,
  ExamAttemptRecord,
  PracticeQuestionAttempt,
  StudentProfile,
  VerifiedExamPaper,
  VerifiedMarkingScheme,
} from '../data/v3Types';

export const V3_STORAGE_KEYS = {
  v2BackupSnapshot: 'quadra12_v2_backup_snapshot_v1',
  profiles: 'quadra12_v3_profiles_v1',
  activeProfileId: 'quadra12_v3_active_profile_v1',
  attempts: 'quadra12_v3_attempts_v1',
  practiceHistory: 'quadra12_v3_practice_history_v1',
  chapterStudyStatus: 'quadra12_v3_chapter_status_v1',
  activeOmrDraft: 'quadra12_v3_active_omr_draft_v1',
  authorDraftPapers: 'quadra12_v3_author_draft_papers_v1',
  authorDraftSchemes: 'quadra12_v3_author_draft_schemes_v1',
} as const;

export const LEGACY_V2_KEYS = [
  'pcmb_desk_completed_chapters_v1',
  'pcmb_desk_chapter_tasks_v1',
  'pcmb_desk_watched_lectures_v1',
  'pcmb_desk_best_scores_v1',
  'pcmb_desk_theme_v1',
  'pcmb_desk_daily_chapter_log_v1',
  'pcmb_desk_achievements_v1',
  'pcmb_desk_custom_board_date_v1',
  'pcmb_desk_urgency_days_v1',
  'pcmb_desk_show_pace_v1',
  'pcmb_desk_embed_mode_v1',
  'pcmb_desk_auto_advance_v1',
  'pcmb_desk_sound_muted_v1',
  'pcmb_desk_sync_code_v1',
  'pcmb_desk_auto_sync_v1',
  'pcmb_desk_last_synced_v1',
  'sectionBE_text_draft',
] as const;

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  id: 'student-default',
  name: 'Primary Student',
  createdAt: '2026-11-27T00:00:00.000Z',
};

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem?(key: string): void;
}

function getSafeStorage(storage?: StorageLike): StorageLike | null {
  if (storage) return storage;
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return null;
}

function readJson<T>(key: string, fallback: T, storage?: StorageLike): T {
  const store = getSafeStorage(storage);
  if (!store) return fallback;
  try {
    const raw = store.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T, storage?: StorageLike): void {
  const store = getSafeStorage(storage);
  if (!store) return;
  try {
    store.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or private-mode errors safely
  }
}

/**
 * Safely preserves all v2.6.2 localStorage user data without mutating or deleting
 * any existing key, and creates a one-time read-only backup snapshot if none exists yet.
 */
export function ensureV2ToV3SafeMigration(storage?: StorageLike): {
  migrated: boolean;
  preservedKeyCount: number;
} {
  const store = getSafeStorage(storage);
  if (!store) return {migrated: false, preservedKeyCount: 0};

  const preserved: Record<string, string> = {};
  for (const key of LEGACY_V2_KEYS) {
    const val = store.getItem(key);
    if (val !== null) {
      preserved[key] = val;
    }
  }

  const existingBackup = store.getItem(V3_STORAGE_KEYS.v2BackupSnapshot);
  if (!existingBackup && Object.keys(preserved).length > 0) {
    writeJson(
      V3_STORAGE_KEYS.v2BackupSnapshot,
      {
        capturedAt: new Date().toISOString(),
        sourceVersion: '2.6.2',
        keys: preserved,
      },
      store,
    );
  }

  // Ensure default student profile exists without overwriting existing profiles
  const profiles = loadStudentProfiles(store);
  if (profiles.length === 0) {
    writeJson(V3_STORAGE_KEYS.profiles, [DEFAULT_STUDENT_PROFILE], store);
  }
  if (!store.getItem(V3_STORAGE_KEYS.activeProfileId)) {
    store.setItem(V3_STORAGE_KEYS.activeProfileId, DEFAULT_STUDENT_PROFILE.id);
  }

  return {
    migrated: Object.keys(preserved).length > 0,
    preservedKeyCount: Object.keys(preserved).length,
  };
}

export function loadStudentProfiles(storage?: StorageLike): StudentProfile[] {
  const profiles = readJson<StudentProfile[]>(
    V3_STORAGE_KEYS.profiles,
    [DEFAULT_STUDENT_PROFILE],
    storage,
  );
  if (!Array.isArray(profiles) || profiles.length === 0) {
    return [DEFAULT_STUDENT_PROFILE];
  }
  return profiles;
}

export function createStudentProfile(
  name: string,
  storage?: StorageLike,
): StudentProfile {
  const cleanName = name.trim().slice(0, 48) || 'Student Profile';
  const existing = loadStudentProfiles(storage);
  const newProfile: StudentProfile = {
    id: `student-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    name: cleanName,
    createdAt: new Date().toISOString(),
  };
  const updated = [...existing, newProfile];
  writeJson(V3_STORAGE_KEYS.profiles, updated, storage);
  setActiveStudentProfileId(newProfile.id, storage);
  return newProfile;
}

export function getActiveStudentProfileId(storage?: StorageLike): string {
  const store = getSafeStorage(storage);
  if (!store) return DEFAULT_STUDENT_PROFILE.id;
  const saved = store.getItem(V3_STORAGE_KEYS.activeProfileId);
  const profiles = loadStudentProfiles(store);
  if (saved && profiles.some((p) => p.id === saved)) {
    return saved;
  }
  return profiles[0]?.id ?? DEFAULT_STUDENT_PROFILE.id;
}

export function setActiveStudentProfileId(
  profileId: string,
  storage?: StorageLike,
): void {
  const store = getSafeStorage(storage);
  if (!store) return;
  store.setItem(V3_STORAGE_KEYS.activeProfileId, profileId);
}

/**
 * Attempts are stored as an append-only array keyed by attemptId + studentProfileId,
 * preventing one student's attempts or Practice Sheets from ever overwriting another's.
 */
export function loadAllExamAttempts(storage?: StorageLike): ExamAttemptRecord[] {
  const records = readJson<ExamAttemptRecord[]>(V3_STORAGE_KEYS.attempts, [], storage);
  return Array.isArray(records) ? records : [];
}

export function loadExamAttemptsForStudent(
  studentProfileId: string,
  storage?: StorageLike,
): ExamAttemptRecord[] {
  return loadAllExamAttempts(storage).filter(
    (attempt) => attempt.studentProfileId === studentProfileId,
  );
}

export function appendExamAttemptRecord(
  attempt: ExamAttemptRecord,
  storage?: StorageLike,
): ExamAttemptRecord[] {
  const all = loadAllExamAttempts(storage);
  // Protect against duplicate attemptId overwrite
  const filtered = all.filter((item) => item.attemptId !== attempt.attemptId);
  const next = [attempt, ...filtered];
  writeJson(V3_STORAGE_KEYS.attempts, next, storage);
  return next;
}

export function loadActiveOmrDraft(
  studentProfileId: string,
  storage?: StorageLike,
): ActiveOmrDraft | null {
  const map = readJson<Record<string, ActiveOmrDraft>>(
    V3_STORAGE_KEYS.activeOmrDraft,
    {},
    storage,
  );
  return map[studentProfileId] ?? null;
}

export function saveActiveOmrDraft(
  draft: ActiveOmrDraft,
  storage?: StorageLike,
): void {
  const map = readJson<Record<string, ActiveOmrDraft>>(
    V3_STORAGE_KEYS.activeOmrDraft,
    {},
    storage,
  );
  map[draft.studentProfileId] = draft;
  writeJson(V3_STORAGE_KEYS.activeOmrDraft, map, storage);
}

export function clearActiveOmrDraft(
  studentProfileId: string,
  storage?: StorageLike,
): void {
  const map = readJson<Record<string, ActiveOmrDraft>>(
    V3_STORAGE_KEYS.activeOmrDraft,
    {},
    storage,
  );
  delete map[studentProfileId];
  writeJson(V3_STORAGE_KEYS.activeOmrDraft, map, storage);
}

export function loadPracticeHistory(
  studentProfileId: string,
  storage?: StorageLike,
): PracticeQuestionAttempt[] {
  const map = readJson<Record<string, PracticeQuestionAttempt[]>>(
    V3_STORAGE_KEYS.practiceHistory,
    {},
    storage,
  );
  const list = map[studentProfileId];
  return Array.isArray(list) ? list : [];
}

export function recordPracticeQuestionAttempt(
  studentProfileId: string,
  entry: PracticeQuestionAttempt,
  storage?: StorageLike,
): PracticeQuestionAttempt[] {
  const map = readJson<Record<string, PracticeQuestionAttempt[]>>(
    V3_STORAGE_KEYS.practiceHistory,
    {},
    storage,
  );
  const existing = Array.isArray(map[studentProfileId]) ? map[studentProfileId] : [];
  const next = [entry, ...existing].slice(0, 1500);
  map[studentProfileId] = next;
  writeJson(V3_STORAGE_KEYS.practiceHistory, map, storage);
  return next;
}

export function loadChapterStudyStatusMap(
  studentProfileId: string,
  storage?: StorageLike,
): Record<string, ChapterStudyStatus> {
  const map = readJson<Record<string, Record<string, ChapterStudyStatus>>>(
    V3_STORAGE_KEYS.chapterStudyStatus,
    {},
    storage,
  );
  return map[studentProfileId] ?? {};
}

export function setChapterStudyStatus(
  studentProfileId: string,
  chapterId: string,
  status: ChapterStudyStatus,
  storage?: StorageLike,
): Record<string, ChapterStudyStatus> {
  const map = readJson<Record<string, Record<string, ChapterStudyStatus>>>(
    V3_STORAGE_KEYS.chapterStudyStatus,
    {},
    storage,
  );
  const current = map[studentProfileId] ?? {};
  const next = {...current, [chapterId]: status};
  map[studentProfileId] = next;
  writeJson(V3_STORAGE_KEYS.chapterStudyStatus, map, storage);
  return next;
}

export function loadAuthorDraftPapers(storage?: StorageLike): VerifiedExamPaper[] {
  const list = readJson<VerifiedExamPaper[]>(V3_STORAGE_KEYS.authorDraftPapers, [], storage);
  return Array.isArray(list) ? list : [];
}

export function saveAuthorDraftPaper(
  paper: VerifiedExamPaper,
  storage?: StorageLike,
): VerifiedExamPaper[] {
  const existing = loadAuthorDraftPapers(storage).filter((p) => p.id !== paper.id);
  const next = [paper, ...existing];
  writeJson(V3_STORAGE_KEYS.authorDraftPapers, next, storage);
  return next;
}

export function loadAuthorDraftSchemes(storage?: StorageLike): VerifiedMarkingScheme[] {
  const list = readJson<VerifiedMarkingScheme[]>(V3_STORAGE_KEYS.authorDraftSchemes, [], storage);
  return Array.isArray(list) ? list : [];
}

export function saveAuthorDraftScheme(
  scheme: VerifiedMarkingScheme,
  storage?: StorageLike,
): VerifiedMarkingScheme[] {
  const existing = loadAuthorDraftSchemes(storage).filter((s) => s.id !== scheme.id);
  const next = [scheme, ...existing];
  writeJson(V3_STORAGE_KEYS.authorDraftSchemes, next, storage);
  return next;
}
