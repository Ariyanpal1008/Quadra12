# Quadra 12 v3.0.0 — Complete PCMB Study Libraries, 720-Q Practice Bank & Deterministic OMR Hall

**Tag:** `v3.0.0`  
**Release Title:** `Quadra 12 v3.0.0 — Study Libraries, 720-Q Exam Bank, Deterministic OMR Governance & Offline PWA`

---

## What's New in v3.0.0

### 1. Separated Formula Sheets, Derivation Sheets & 94 Diagrams (All 50 Chapters)
* **Complete Chapter & Subject Reference Sheets:** Inside **Subject Tracker**, every NCERT chapter features separated **Formula Sheet**, **Derivation Sheet**, **Diagrams & Graphs**, and **Practice Qs** tabs alongside a full-subject **Formula, Derivation & Diagram Sheet** modal with chapter filtering and **Print / Save PDF** support (`Physics`: 21 step-by-step derivations + 29 diagrams/graphs; `Maths`: 13 proofs/derivations + 19 figures; `Chemistry`: 3 Physical Chemistry derivations + 19 plots/mechanisms; `Biology`: 26 labelled pathways/diagrams/graphs; **94 total verified SVG diagrams**).
* **720 Verified Practice Questions (`180` / Subject):** Authoritative single-choice question suites across Physics (`042`), Chemistry (`043`), Biology (`044`), and Mathematics (`041`) powering untimed **Practice Mode** (with instant step-by-step explanations and chapter filters) and published **OMR Mock Papers**.

### 2. Clean Examination Hall, Deterministic OMR Engine & Paper Audit in Settings
* **8 Published Single-Choice OMR Mock Papers:** Competitive Paper I (`+4/−1`) and Board Sprint Paper II (`+1/0`) per subject, governed by `canPublishExamPaper` so only `'Approved'`/`'Published'` Main Sheets with complete Marking Schemes enter live tests. **Verified Paper Audit & Marking-Scheme Standards** (`AuthorReviewPanel`) lives cleanly inside **Settings → Exam & Paper Audit**.
* **Live Answer-Key Stripping & Immutable Snapshots:** Answer keys (`correctIndex`, `subjectiveSolution`) are stripped during active OMR tests (`stripAnswerKeysForActiveExam`) and evaluated deterministically upon submission, generating immutable `PracticeSheetSnapshot`s per student profile and showing `Best` scores on cards once attempted.
* **Unconditional Result Access Even at `0` Marks:** Submitting blank or `0`-mark attempts never restricts access — students immediately receive full explanations, Practice Sheets, Marking Schemes, Study Library deep-links, Diagrams, and both offline A4 PDFs (**Practice Sheet PDF** & **Marking Scheme PDF**).
* **Read-Only 2026–27 CBSE SQP Archive:** Historical v2.6.2 CBSE sample papers remain accessible in a separate read-only Archive tab (`ArchiveExamView.tsx`).

### 3. Zero External AI Dependencies, Multi-Student Profiles & Safe Migration
* **100% Local & Deterministic Evaluation:** Removed all Gemini SDK/failover dependencies (`@google/genai`, `GEMINI_API_KEYS`, `VITE_PROXY_URL`, `/api/exam/grade`).
* **Multi-Student Isolation & Safe Upgrade:** OMR drafts, attempts, snapshots, and explicit `ChapterStudyStatus` (`Not Started | In Progress | Reviewed | Completed`) are isolated per student profile while preserving all **17 legacy v2.6.2 `localStorage` keys** untouched.
* **Web, Offline PWA & Signed Android APK:** Updated Workbox SW (`quadra12-v3.0.0-*`) with clean reload banner, `server.ts` `/api/health` (`version: '3.0.0'`), and permanent Android keystore signing (`versionCode = 3000 + GITHUB_RUN_NUMBER`).

---

**Full Release Notes:** See [`RELEASE_NOTES_v3.0.0.md`](RELEASE_NOTES_v3.0.0.md) *(Historical v2.6.2 notes preserved at [`RELEASE_NOTES_v2.6.2.md`](RELEASE_NOTES_v2.6.2.md))*  
**Live Web & Offline PWA App:** [https://ariyanpal1008.github.io/Quadra12/](https://ariyanpal1008.github.io/Quadra12/)  
**Free Signed Android APK Download:** [GitHub Releases](https://github.com/Ariyanpal1008/Quadra12/releases/tag/v3.0.0)  
**Creator:** AriYan Pal (Keśava Dāsa) · `ariyanpal090@gmail.com`
