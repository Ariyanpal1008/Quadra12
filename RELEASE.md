# Quadra 12 — v2.5 Official Release Notes

**Tag:** `v2.5`  
**Title:** `Quadra 12 v2.5 — 100% Original Copyright-Safe PCMB Papers, Smart Sections B–E Camera/Upload Inputs, Dual Storage Refresh Protection & gemini-3.8-flash AI Board Examiner`

## What's New in v2.5

### 1. 100% Copyright-Safe Original Papers & Board Repeat Frequency Badges
- Rewrote all **137 questions** across Physics (33 Qs / 70M), Chemistry (33 Qs / 70M), Biology (33 Qs / 70M), and Mathematics (38 Qs / 80M) in fresh, original wording with new case-study scenarios and modified numerical values (recalculating all exact new answers) so zero text is copied verbatim from official CBSE PDFs.
- Added a `boardFrequency` metadata field (`count`, `years`, `importance`) to every question and rendered a clean badge beside each question header (e.g., `🔥 Asked 5x in Boards • 2016, 2018, 2020, 2023, 2025`).

### 2. Four Modular Subject-Wise Marking Scheme Files
- Created 4 separate subject marking scheme files (`physicsMarkingScheme.ts`, `chemistryMarkingScheme.ts`, `biologyMarkingScheme.ts`, `mathsMarkingScheme.ts`) keyed by `questionId` with step-by-step mark splits (`stepMarks`: Formula 0.5m, Substitution/Steps 1m, Diagram/Labels 1m, Final Answer with SI Unit 0.5m).
- Dynamically loads ONLY the active subject's marking scheme file upon test start and keeps it completely concealed until post-submission review.

### 3. Smart Inputs for Sections B to E (Text + Direct Camera + File Upload)
- Assigned a `questionType` (`short`, `numerical`, `diagram`, or `derivation_or_proof`) to every subjective question.
- For `diagram` and `derivation_or_proof` questions, prominently renders two action buttons at the top: **Take Photo** (`<input type="file" accept="image/*" capture="environment" />`) and **Upload Image** (`<input type="file" accept="image/*" />`) with multi-page thumbnail previews, delete buttons, and an optional text box below. For `short` and `numerical` questions, shows the text box first with photo buttons below.

### 4. Dual Storage System & Accidental Refresh Protection
- In-browser image compression (max width 1024px, JPEG quality 0.7).
- Uses `localStorage` (`sectionBE_text_draft`) strictly for typed text and a dedicated IndexedDB database (`SectionBE_PhotoStorage`) strictly for attached photos (zero images in `localStorage`).
- Accidental Refresh Protection: Automatically restores typed text and attached photos if the student accidentally reloads the page before submitting.

### 5. Neutral Active Palette & `gemini-3.8-flash` AI Step-Marking
- Attempted Section B–E questions remain neutral Blue/Purple while in progress (never green).
- On **Submit Test**, bundles Section A OMR choices, Sections B–E questions, active subject marking keys, typed text, and compressed photos into one structured JSON request to `gemini-3.8-flash` (`POST /api/exam/grade`), returning strict JSON with `questionGrades` and `examSummary`.

### 6. Post-Grading Palette & Comprehensive Results Dashboard
- Palette colors update based on actual marks earned: **Green** = Full marks, **Yellow** = Partial marks, **Red** = Zero marks, **Grey** = Unattempted.
- Results summary displays Total Score & %, Overall Accuracy %, Section A & B–E Accuracy %, Attempt Breakdown counts, AI Weak Topics, Improvement Tips, Examiner Remarks, and Question-by-Question Review with AI feedback and step-by-step model answers.

### 7. Complete Storage Wipe ONLY After Checking
- Completely deletes and clears `SectionBE_PhotoStorage` (IndexedDB) and `sectionBE_text_draft` (localStorage) ONLY AFTER `Submit Test` -> AI grading succeeds -> Results Screen renders, accompanied by a reminder banner to review or print/save results.
