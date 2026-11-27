# Release Notes — Quadra 12 v3.0.0

**Release Date:** November 27, 2026  
**Tag:** `v3.0.0`  
**Target Branch:** `main`  
**APK Artifact:** `Quadra12-v3.0.0-Android.apk` (permanently signed via GitHub Actions)

> **Historical Continuity:** Previous release documentation in [`RELEASE_NOTES_v2.6.2.md`](RELEASE_NOTES_v2.6.2.md) is preserved intact for archival reference, and all 17 legacy v2.6.2 browser `localStorage` keys migrate safely without data loss.

---

## Executive Summary

Quadra 12 v3.0.0 transforms the workspace into a **100% deterministic, offline-capable PCMB study library, 720-question verified exam bank, and governed OMR assessment engine** across Web, Offline PWA, and Signed Android APK — eliminating external Gemini API keys, proxy environment variables, and external grading dependencies.

---

## Major Additions & Changes

### 1. Four Subject Study Libraries (`src/data/studySheets/` & `src/data/diagrams/`)
- Complete study bundles across all **50 NCERT Class 12 chapters**:
  - `physicsStudyLibrary.ts` (14 chapters · 15 formula sheets + **21 full step-by-step textbook derivations** + 29 diagrams/graphs)
  - `chemistryStudyLibrary.ts` (10 chapters · 11 formula/reaction-mechanism sheets + **3 Physical Chemistry derivations** + 19 diagrams/plots)
  - `biologyStudyLibrary.ts` (13 chapters · 13 pathway, genetics & NCERT law sheets + **26 labelled diagrams & graphs**)
  - `mathsStudyLibrary.ts` (13 chapters · 26 formula & standard method sheets + **13 step-by-step proofs/derivations** + 19 graphs/figures)
  - `index.ts` unified registry (`ALL_STUDY_BUNDLES`, lookup helpers by subject/chapter/diagram)
- **Visual Diagram & Graph Library (94 Verified SVGs):** Subject-modular SVG diagram/graph builders (`src/data/diagrams/{physics,chemistry,biology,maths}Diagrams.ts` + `src/data/diagramSvgs.ts`, aggregated in `src/data/v3Diagrams.ts`) rendered cleanly in `ExamDiagrams.tsx`.
- **Subject Tracker Integration (`SubjectTrackerSection.tsx`):**
  - Preserves all 4 existing chapter stage checkboxes (`Lecture`, `Practice`, `NCERT`, `PYQ`).
  - Adds per-student explicit `ChapterStudyStatus` (`Not Started | In Progress | Reviewed | Completed`) that never auto-completes merely by opening study resources.
  - Strictly separates **Formula Sheet**, **Derivation Sheet**, **Diagrams & Graphs**, and **Practice Qs** into dedicated study tabs (never mixed with MCQ Question Papers) and adds a **Complete Subject Formula, Derivation & Diagram Sheet** modal with chapter filter & **Print / Save PDF**.
  - Supports direct deep-linking (`initialChapterId`) from Exam Results back into the chapter Study Library.

### 2. 720-Question Verified Practice Bank (`src/data/questionBank/`)
- `180` verified MCQs per subject (`physicsQuestions*.ts`, `chemistryQuestions*.ts`, `biologyQuestions*.ts`, `mathsQuestions*.ts`, aggregated in `index.ts` → `ALL_VERIFIED_QUESTIONS`, `720` total).
- Powering `PracticeModeView.tsx` with subject/chapter/topic filtering, instant answer explanations, verified formula steps, SVG diagrams, and direct links to the chapter Study Library.

### 3. Human-Approved Governance, Deterministic OMR & Archive (`src/components/exam/`)
- **8 Published Single-Choice OMR Mock Papers (`src/data/verifiedPapers.ts`):** Competitive Paper I (`+4/−1`) and Board Sprint Paper II (`+1/0`) per subject, paired with complete `VerifiedMarkingScheme`s, clean `Quadra 12` branding, and subject cards displaying `Best` scores only after an attempt exists.
- **Publication Gatekeeper (`canPublishExamPaper` in `src/utils/examEvaluator.ts`):** Live OMR exams only admit `'Approved'`/`'Published'` Main Sheets with complete `'Approved'`/`'Published'` Marking Schemes. **Verified Paper Audit & Marking-Scheme Standards** (`AuthorReviewPanel.tsx`) is housed inside **Settings → Exam & Paper Audit**, keeping the student Examination Hall clutter-free.
- **Live Answer-Key Stripping (`stripAnswerKeysForActiveExam`):** Removes `correctIndex` and solution text while a live OMR exam session runs (`OmrExamView.tsx`).
- **Deterministic Grading & Unconditional 0-Mark Access (`evaluateOmrSubmission` & `ExamResultView.tsx`):**
  - Computes exact scores (`+4/−1` or `+1/0`), option-level diagnostics, and immutable `PracticeSheetSnapshot`s per student profile.
  - Guarantees unconditional post-submission access (even on `0`-mark or empty submissions) to Question Explanations, Marking Schemes, Immutable Practice Sheets, Study Libraries, SVG Diagrams, and offline PDF downloads.
- **2026–27 CBSE SQP Archive (`ArchiveExamView.tsx`):** Strictly read-only archival tab preserving historical CBSE Sample Question Papers without mixing them into active governed assessments.

### 4. Local A4 PDF Generation & Multi-Student Profiles
- **Local A4 PDFs (`ExamPdfModal.tsx`):** Export clean A4 **Practice Sheet PDF** (from immutable snapshot or untouched Main Sheet) and **Marking Scheme PDF** completely offline via `jsPDF` (and `QuadraAndroid.saveBase64File` on Android).
- **Per-Student Persistence & Migration (`src/utils/v3Storage.ts`):**
  - Student profile switcher & creator inside `ExamHallSection.tsx` isolating OMR drafts, attempts, snapshots, and `ChapterStudyStatus`.
  - Non-destructive `ensureV2ToV3SafeMigration()` preserves all 17 legacy v2.6.2 `localStorage` keys (`LEGACY_V2_KEYS`).

### 5. Zero External Exam AI Dependencies & Infrastructure Updates
- Deleted `server/geminiFailover.ts`, `server/geminiFailover.test.ts`, `@google/genai`, `/api/exam/grade`, `GEMINI_API_KEYS`, `GEMINI_API_KEY`, `VITE_GEMINI_API_KEYS`, and `VITE_PROXY_URL`.
- Updated `server.ts` (`GET /api/health` returning `version: '3.0.0'`, `mode: 'deterministic-local-exam-engine'`), `.env.example`, `.github/workflows/deploy.yml`, and `.github/workflows/android-release.yml` (monotonic `VERSION_CODE = 3000 + GITHUB_RUN_NUMBER`).
- Preserved permanent Android signing (`ANDROID_KEYSTORE_BASE64`, `ANDROID_KEY_ALIAS`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_PASSWORD`), Firebase Cloud Sync (`syncSessions`), Help Desk (`changeRequests`), 12th Hackers playlists, 3D WebGL Lab, Web Audio sound effects, Achievements, and Board Countdown.
- Updated PWA cache (`src/sw.js`: `quadra12-v3.0.0-*`) and `src/main.tsx` + `src/App.tsx` for smooth `"Offline App Update Ready"` reload prompts.

---

## Verification Checklist

1. `bun install --frozen-lockfile` succeeds cleanly with `@google/genai` removed.
2. `npm test` (`tsx --test tests/v3ExamSystem.test.ts`) passes all governance, 720-question bank, 50-chapter study library, deterministic scoring (including `0`-mark unconditional access), multi-student isolation, v2.6.2 key preservation, and server health assertions.
3. TypeScript check & `npm run lint` report zero errors.
4. `npm run build` produces clean static + Service Worker bundle in `dist/`.
5. `npx tsx server.ts` starts cleanly in production mode and responds HTTP `200` on `GET /api/health`.
