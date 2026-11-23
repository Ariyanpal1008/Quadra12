# Quadra 12 v2.4 — Account-less Cloud Sync, Three.js 3D Study Studio, Interactive Tour & Audio Synthesizer

**Tag:** `v2.4`  
**Release Title:** `Quadra 12 v2.4 — Account-less Cloud Sync, Three.js 3D Study Studio & Audio Synthesizer`

---

## 🚀 What's New in v2.4

### 1. ☁️ Account-less 6-Digit & QR Cloud Sync
* **Instant Device Pairing:** Seamlessly transfer study progress between laptops, tablets, and phones without signing in or creating an account.
* **6-Digit Sync Code & QR Scanner:** Generate a quick 6-digit numeric pairing code or scan a pairing QR code using the built-in browser camera scanner powered by `jsQR`.
* **Offline Backup & Restore:** Export and import complete `.json` backups of all chapter checkboxes, timer settings, and exam scores.

### 2. 🪐 Full-Viewport Three.js 3D Study Studio
* **Antialiased WebGL Visualizer:** Interactive 3D science studio featuring smooth orbit controls, model exploded-view slider, and multiple camera angles (`3/4 View`, `Top View`, `Side View`).
* **5 Interactive 3D Models:**
  * **Physics:** Moving-Coil Galvanometer with magnetic field poles and torsion head.
  * **Chemistry:** $[ML_6]$ Octahedral Coordination Complex with ligand vectors.
  * **Biology:** High-fidelity DNA Double Helix with alternating nucleotide rungs.
  * **Mathematics:** $\vec{a} \times \vec{b}$ Vector Cross Product normal plane & Double Conic Sections.
  * **Grandmaster Trophy:** Polished 3D achievement cup with ambient studio lighting.

### 3. 🔊 Zero-Dependency Web Audio API Micro-Sounds
* **Synthesized Tactile Audio:** Built with native browser `AudioContext` (<200ms duration, zero external audio assets):
  * Checkbox pops & uncheck clicks.
  * Light/Dark mode mechanical switch sound.
  * Examination Hall OMR bubble tap sound.
  * Milestone achievement harmonic chime ($C_5 \to G_5$).
  * Exam countdown timer completion chime.
* **Persistent Mute/Unmute:** Quick sound toggle in the sticky navbar and Settings modal.

### 4. 🧭 Help Desk, Interactive Tour Sandbox & Cloud Suggestion Box
* **Interactive Feature Tour:** Step-by-step visual sandbox to test countdown clocks, chapter checklists, milestone cards, and OMR bubbles before starting study sessions.
* **Community Suggestion Box:** Post feature requests, report bugs, or share exam feedback directly to the creator via Firebase Auth (Google Sign-In) and Cloud Firestore.
* **Creator & Disclaimers Tab:** Clear academic guidance, CBSE disclaimers, and 2027 future roadmap (English Core, Physical Education, Computer Science).

### 5. ⚙️ Official 7-Panel Settings Modal
* Clean slide-over settings modal replacing cluttered navigation menus:
  1. **Cloud Sync:** 6-digit codes, QR camera pairing, and `.json` data import/export.
  2. **Audio & Tactile:** Sound effects master toggle and 6 interactive sound test buttons.
  3. **3D Studio:** Fullscreen Three.js visualizer launcher.
  4. **Exam & Urgency:** Custom board exam date picker and dynamic urgency thresholds (15, 30, 60, 90 days).
  5. **Player & Video:** YouTube player mode selection (Standard, Pure Mode, Privacy-Enhanced) and auto-advance.
  6. **Privacy & Reset:** Real-time `localStorage` storage quota gauge, individual subject reset, and Master Reset with double confirmation.
  7. **About & Links:** Version badge, creator profile, GitHub repository link, and Terms & Conditions.

### 6. 🏆 9 Gamified Milestone Badges (My Achievements)
* Compact trigger card on the Overview dashboard opening a dedicated milestone dialog:
  * **First Step**, **Quick Learner**, **Syllabus Sprinter**, **Four-Stage Purist**, **Subject Champion**, **Hall Debut**, **Exam Ready**, **One-Shot Scholar**, and **Quadra 12 Grandmaster**.
* Non-intrusive floating unlock banners with smooth entrance animations.

### 7. ⏱️ Apple StandBy Live Countdown Clock
* Real-time 1-second countdown chronometer counting down to **16 February at 10:30 AM IST**.
* Automatic annual rollover to subsequent exam years.
* Dynamic daily chapter pace calculator and urgency alerts.

### 8. 📝 Examination Hall (CBSE 2026–27 SQP Simulation)
* Embedded official CBSE 2026–27 Sample Question Paper PDFs across Physics (042), Chemistry (043), Biology (044), and Mathematics (041).
* Realistic 3-hour (`03:00:00`) exam timer with pause, resume, and reset.
* Interactive Section A digital OMR sheet with instant scoring and best-score local storage.

### 9. 🎥 12th Hackers One-Shot Video Workspace
* 50 unit-aligned one-shot lectures curated from top educators.
* Bi-directional synchronization: checking off a video automatically marks the corresponding chapter's `Lecture` task complete in the Subject Tracker.

### 10. 🛡️ Solid Frosted Sticky Header & Standalone Terms Modal
* Upgraded top navigation with frosted blur (`backdrop-filter: blur(10px)`) and subtle border, eliminating text overlap while scrolling.
* Standalone **Terms & Conditions · 2026** modal detailing fair use, non-affiliation with CBSE, and copyright policies.

---

**Live Application:** [https://ariyanpal1008.github.io/Quadra12/](https://ariyanpal1008.github.io/Quadra12/)  
**Creator:** AriYan Pal (Keśava Dāsa) · `ariyanpal090@gmail.com`
