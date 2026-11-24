import type {SubjectId} from '../data/pcmbData';

export const SECTION_BE_TEXT_DRAFT_KEY = 'sectionBE_text_draft';
export const PHOTO_STORAGE_DB_NAME = 'SectionBE_PhotoStorage';
export const PHOTO_STORAGE_STORE_NAME = 'photos';
const PHOTO_STORAGE_DB_VERSION = 1;

export interface StoredQuestionPhoto {
  id: string;
  subjectId: SubjectId;
  questionId: string;
  fileName: string;
  mimeType: 'image/jpeg';
  base64Data: string;
  dataUrl: string;
  sizeBytes: number;
  createdAt: number;
}

export interface SectionBETextDraft {
  subjectId: SubjectId;
  omrAnswers: Record<string, number>;
  textAnswers: Record<string, string>;
  secondsLeft: number;
  isPaused: boolean;
  activeSectionFilter: 'all' | 'A' | 'B' | 'C' | 'D' | 'E';
  isReadingTime?: boolean;
  readingSecondsLeft?: number;
  updatedAt: number;
}

/**
 * Compresses an uploaded or camera-captured image in the browser:
 * - max width 1024px (preserving aspect ratio)
 * - JPEG quality 0.7
 * Returns base64 string (without data URI prefix) + full preview dataUrl.
 */
export async function compressImageToJpeg(
  file: File,
  maxWidth = 1024,
  quality = 0.7,
): Promise<{
  dataUrl: string;
  base64Data: string;
  mimeType: 'image/jpeg';
  sizeBytes: number;
}> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Could not decode selected image.'));
      el.src = objectUrl;
    });

    const naturalW = img.naturalWidth || img.width || 1;
    const naturalH = img.naturalHeight || img.height || 1;
    const scale = naturalW > maxWidth ? maxWidth / naturalW : 1;
    const targetW = Math.max(1, Math.round(naturalW * scale));
    const targetH = Math.max(1, Math.round(naturalH * scale));

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Browser 2D canvas unavailable for image compression.');
    }

    // White background prevents transparent PNGs from turning black in JPEG
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetW, targetH);
    ctx.drawImage(img, 0, 0, targetW, targetH);

    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    const commaIdx = dataUrl.indexOf(',');
    const base64Data = commaIdx >= 0 ? dataUrl.slice(commaIdx + 1) : dataUrl;
    const sizeBytes = Math.round((base64Data.length * 3) / 4);

    return {
      dataUrl,
      base64Data,
      mimeType: 'image/jpeg',
      sizeBytes,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/* ==================== localStorage Draft (Text Only) ==================== */

export function saveTextDraftToLocalStorage(draft: SectionBETextDraft): void {
  try {
    // Strictly persist text/MCQ/timer metadata — NEVER store images inside localStorage
    const textOnlyPayload: SectionBETextDraft = {
      subjectId: draft.subjectId,
      omrAnswers: draft.omrAnswers,
      textAnswers: draft.textAnswers,
      secondsLeft: draft.secondsLeft,
      isPaused: draft.isPaused,
      activeSectionFilter: draft.activeSectionFilter,
      updatedAt: Date.now(),
    };
    window.localStorage.setItem(
      SECTION_BE_TEXT_DRAFT_KEY,
      JSON.stringify(textOnlyPayload),
    );
  } catch {
    // Ignore storage quota / privacy mode errors
  }
}

export function loadTextDraftFromLocalStorage(): SectionBETextDraft | null {
  try {
    const raw = window.localStorage.getItem(SECTION_BE_TEXT_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SectionBETextDraft>;
    if (!parsed || !parsed.subjectId) return null;
    return {
      subjectId: parsed.subjectId,
      omrAnswers:
        parsed.omrAnswers && typeof parsed.omrAnswers === 'object'
          ? parsed.omrAnswers
          : {},
      textAnswers:
        parsed.textAnswers && typeof parsed.textAnswers === 'object'
          ? parsed.textAnswers
          : {},
      secondsLeft:
        typeof parsed.secondsLeft === 'number' && parsed.secondsLeft > 0
          ? parsed.secondsLeft
          : 3 * 60 * 60,
      isPaused: Boolean(parsed.isPaused),
      activeSectionFilter: parsed.activeSectionFilter ?? 'all',
      updatedAt:
        typeof parsed.updatedAt === 'number' ? parsed.updatedAt : Date.now(),
    };
  } catch {
    return null;
  }
}

/* ==================== IndexedDB Storage (Compressed Photos Only) ==================== */

function openPhotoDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB is unavailable in this browser.'));
      return;
    }

    const request = window.indexedDB.open(
      PHOTO_STORAGE_DB_NAME,
      PHOTO_STORAGE_DB_VERSION,
    );

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PHOTO_STORAGE_STORE_NAME)) {
        const store = db.createObjectStore(PHOTO_STORAGE_STORE_NAME, {
          keyPath: 'id',
        });
        store.createIndex('subjectId', 'subjectId', {unique: false});
        store.createIndex('questionId', 'questionId', {unique: false});
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error('Failed to open SectionBE_PhotoStorage'));
  });
}

export async function saveQuestionPhoto(
  photo: StoredQuestionPhoto,
): Promise<void> {
  const db = await openPhotoDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(PHOTO_STORAGE_STORE_NAME, 'readwrite');
      const store = tx.objectStore(PHOTO_STORAGE_STORE_NAME);
      store.put(photo);
      tx.oncomplete = () => resolve();
      tx.onerror = () =>
        reject(tx.error ?? new Error('Failed saving photo to IndexedDB'));
    });
  } finally {
    db.close();
  }
}

export async function getSubjectPhotos(
  subjectId: SubjectId,
): Promise<Record<string, StoredQuestionPhoto[]>> {
  const db = await openPhotoDatabase();
  try {
    return await new Promise<Record<string, StoredQuestionPhoto[]>>(
      (resolve, reject) => {
        const tx = db.transaction(PHOTO_STORAGE_STORE_NAME, 'readonly');
        const store = tx.objectStore(PHOTO_STORAGE_STORE_NAME);
        const index = store.index('subjectId');
        const req = index.getAll(subjectId);

        req.onsuccess = () => {
          const grouped: Record<string, StoredQuestionPhoto[]> = {};
          const records = (req.result ?? []) as StoredQuestionPhoto[];
          records.sort((a, b) => a.createdAt - b.createdAt);
          for (const rec of records) {
            if (!grouped[rec.questionId]) grouped[rec.questionId] = [];
            grouped[rec.questionId].push(rec);
          }
          resolve(grouped);
        };
        req.onerror = () =>
          reject(req.error ?? new Error('Failed reading photos from IndexedDB'));
      },
    );
  } finally {
    db.close();
  }
}

export async function deleteQuestionPhoto(photoId: string): Promise<void> {
  const db = await openPhotoDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(PHOTO_STORAGE_STORE_NAME, 'readwrite');
      const store = tx.objectStore(PHOTO_STORAGE_STORE_NAME);
      store.delete(photoId);
      tx.oncomplete = () => resolve();
      tx.onerror = () =>
        reject(tx.error ?? new Error('Failed deleting photo from IndexedDB'));
    });
  } finally {
    db.close();
  }
}

/**
 * Completely clears both localStorage text drafts ('sectionBE_text_draft') and
 * IndexedDB photos ('SectionBE_PhotoStorage'). Invoked ONLY after AI grading
 * succeeds and the Final Results Screen renders (or when explicitly starting fresh).
 */
export async function clearSectionBEStorage(): Promise<void> {
  try {
    window.localStorage.removeItem(SECTION_BE_TEXT_DRAFT_KEY);
  } catch {
    // Ignore
  }

  try {
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      const db = await openPhotoDatabase();
      try {
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction(PHOTO_STORAGE_STORE_NAME, 'readwrite');
          tx.objectStore(PHOTO_STORAGE_STORE_NAME).clear();
          tx.oncomplete = () => resolve();
          tx.onerror = () =>
            reject(tx.error ?? new Error('Failed clearing photo store'));
        });
      } finally {
        db.close();
      }
    }
  } catch {
    // Ignore IDB clear issues cleanly
  }
}
