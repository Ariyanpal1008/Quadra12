# Quadra 12 v2.5 — Original PCMB Blueprint Papers, 10-Year Board Frequency Badges, Smart Camera Inputs & Gemini 3.8 Flash AI Board Examiner

**Tag:** `v2.5`  
**Release Title:** `Quadra 12 v2.5 — Original PCMB Blueprint Papers, Board Badges & Gemini 3.8 AI Examiner`

---

## 🚀 What's New in v2.5

### 1. 📝 100% Copyright-Safe Original Papers & Board Repeat Frequency Badges
* **Zero Verbatim Text:** All **137 questions** across Physics (33 Qs / 70M), Chemistry (33 Qs / 70M), Biology (33 Qs / 70M), and Mathematics (38 Qs / 80M) rewritten in fresh, original phrasing with new case scenarios and modified numerical values (with all exact recalculated solutions).
* **10-Year Board Appearance Badges:** Every question features a `boardFrequency` badge indicating its 10-year Class 12 board exam appearance record (e.g., `🔥 Asked 5x in Boards • 2016, 2018, 2020, 2023, 2025`).

### 2. 📂 Modular Subject-Wise Marking Scheme Files
* **Dedicated Subject Marking Files:** Built 4 clean, isolated marking scheme files (`physicsMarkingScheme.ts`, `chemistryMarkingScheme.ts`, `biologyMarkingScheme.ts`, `mathsMarkingScheme.ts`).
* **Granular Step-Mark Splits:** Map keyed by `questionId` with exact point allocations (Formula 0.5m, Substitution/Steps 1.0m, Diagram/Labels 1.0m, Final Answer with SI Units 0.5m).
* **Isolated Runtime Loading:** Only loads the active subject's marking scheme into memory upon starting a test, remaining completely hidden until post-submission evaluation.

### 3. 📸 Smart Inputs for Sections B to E (Camera + File Upload)
* **Question Categorization:** Every subjective question is assigned a `questionType` (`short`, `numerical`, `diagram`, or `derivation_or_proof`).
* **Direct Device Camera Capture:** `Take Photo` opens the device camera directly (`capture="environment"`).
* **Gallery / File Upload:** `Upload Image` allows selecting handwritten sheets from file manager or photo gallery.
* **Multi-Page Attachments:** Supports multiple photo sheets per question with thumbnail previews, full-view enlargement, and remove actions, accompanied by an optional equations/notes textarea.

### 4. 💾 Dual Storage System & Accidental Refresh Protection
* **In-Browser Image Compression:** Compresses all captured and uploaded photos (max 1024px width, JPEG 0.7) before storage.
* **Zero LocalStorage Image Clutter:** Text drafts are saved in `localStorage` (`sectionBE_text_draft`), while photos are stored in a dedicated browser `IndexedDB` database (`SectionBE_PhotoStorage`), completely avoiding the 5 MB localStorage ceiling.
* **Accidental Refresh Recovery:** If the tab or browser accidentally reloads, all typed drafts and attached photos are automatically restored so zero student work is lost.

### 5. 🤖 Neutral In-Progress Palette & Gemini 3.8 Flash AI Step-Marking
* **Unbiased Question Palette:** Attempted Section B–E subjective questions stay neutral Blue/Purple while the test is active (never green until graded).
* **Gemini 3.8 Flash Examiner:** Upgraded to `gemini-3.8-flash` with an automated multi-tier resilience fallback pipeline. Bundles student responses, photos, and active subject marking scheme keys into one single structured JSON evaluation.
* **Strict Board Rubrics:**
  * **Physics:** Formula, derivation steps, diagram labels, and SI units.
  * **Chemistry:** Balanced chemical equations, reagents, mechanisms, and key scientific terms.
  * **Biology:** Point-wise scientific keywords and diagram accuracy.
  * **Mathematics:** Formula, theorem application, and step-by-step arithmetic marks.

### 6. 📊 Post-Grading Palette & Comprehensive Results Dashboard
* **Dynamic Palette Colors:**
  * 🟢 **Green** = Full Marks
  * 🟡 **Yellow** = Partial Marks
  * 🔴 **Red** = Zero Marks
  * ⚪ **Grey** = Unattempted
* **Rich Score Analytics:** Total Score & %, Overall Accuracy %, Section A (MCQ) Accuracy %, Sections B–E (Subjective) Accuracy %, and Attempt Breakdown.
* **Examiner Diagnostics:** AI-identified Weak Topics, actionable Improvement Tips, and overall Examiner Remarks.
* **Detailed Question Review:** Step-by-step marks gained/lost, AI examiner commentary, and revealed model answers with mark splits.

### 7. 🧹 Zero-Trace Storage Wipe After Results
* Immediately after AI grading succeeds and the Results Dashboard is mounted, both `SectionBE_PhotoStorage` (IndexedDB) and `sectionBE_text_draft` (localStorage) are safely purged, accompanied by a reminder banner to review or print/save the score report.

### 8. 🧭 Interactive Tour & README Visual Showcase Updates
* **In-App Tour Sandbox:** Upgraded Step 4 in the **Help Desk → Interactive Tour** to a live dual-mode sandbox featuring both Section A OMR audio clicks and Section B–E camera photo attachments with simulated AI step-marking.
* **README & Showcase Sync:** Updated `README.md`, `public/assets/showcase/exam-hall.svg`, and all technical documentation to reflect v2.5 architecture.

---

**Full Changelog:** `v2.4...v2.5`  
**Live Application:** [https://ariyanpal1008.github.io/Quadra12/](https://ariyanpal1008.github.io/Quadra12/)  
**Creator:** AriYan Pal (Keśava Dāsa) · `ariyanpal090@gmail.com`
