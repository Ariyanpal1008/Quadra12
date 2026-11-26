# Quadra 12 (v2.6.2)

[![Release](https://img.shields.io/badge/Release-v2.6.2-crimson.svg?style=flat-square)](https://github.com/Ariyanpal1008/Quadra12/releases/tag/v2.6.2)
[![Platforms](https://img.shields.io/badge/Platforms-Web%20%7C%20Offline%20PWA%20%7C%20Android%20APK%20(Free)-A64B33.svg?style=flat-square)](#10-installable-offline-pwa--free-standalone-android-apk-app-0)
[![License](https://img.shields.io/badge/License-Independent%20Student%20Workspace-blue.svg?style=flat-square)](#disclaimers-terms--conditions-copyright-privacy--ai-fair-use)
[![Framework](https://img.shields.io/badge/Stack-React%2019%20%7C%20Vite%20%7C%20Tailwind%20v4-emerald.svg?style=flat-square)](#tech-stack)
[![AI Engine](https://img.shields.io/badge/AI%20Examiner-Gemini%20Flash%20(5--Key%20Pool)-indigo.svg?style=flat-square)](https://aistudio.google.com/)

> **Quadra 12 v2.6.2 Active Release:** Features the advanced Examination Hall grading engine upgrade across all CBSE Class 12 PCMB Sample Papers (33-question PCB & 38-question Maths), featuring 5-key Gemini API pooling (`VITE_GEMINI_API_KEYS`), 1-call batch grading, canvas blank/blurry image pre-filtering with strict rejection feedback, offline PWA/APK self-check fallback, `temperature: 0.0` strict step-marking against official Marking Scheme PDFs, **Installable Offline PWA App**, and a **Free Standalone Android `.apk` App (`Quadra12-v2.6.2-Android.apk`)**.

- **Current Version:** `v2.6.2` (Active Release)
- **Live Web & PWA App:** [https://ariyanpal1008.github.io/Quadra12/](https://ariyanpal1008.github.io/Quadra12/) *(Installable offline on Android, iOS/iPadOS, Windows & macOS)*  
- **Free Android `.apk` Download:** [GitHub Releases (`Quadra12-v2.6.2-Android.apk`)](https://github.com/Ariyanpal1008/Quadra12/releases/tag/v2.6.2) *(100% Free — `$0`, no Play Store fees)*  
- **GitHub Repository:** [https://github.com/Ariyanpal1008/Quadra12](https://github.com/Ariyanpal1008/Quadra12)  
- **AI Summary (llms.txt):** [https://ariyanpal1008.github.io/Quadra12/llms.txt](https://ariyanpal1008.github.io/Quadra12/llms.txt)  
- **Full AI Knowledge Base (llms-full.txt):** [https://ariyanpal1008.github.io/Quadra12/llms-full.txt](https://ariyanpal1008.github.io/Quadra12/llms-full.txt)  
- **Creator:** Ariyan Pal (Keśava Dāsa) · `ariyanpal090@gmail.com`  
- **Copyright:** © 2026 Quadra 12 · Creator: Ariyan Pal (Keśava Dāsa)

Quadra 12 is a calm, distraction-free Class 12 CBSE PCMB (Physics 042, Chemistry 043, Biology 044, and Mathematics 041) academic preparation workspace available as a **Web App**, an **Installable Offline PWA App**, and a **Free Standalone Android `.apk` App**. It brings together an Apple StandBy–inspired **Live Board Exam Countdown Clock**, a gamified **My Achievements** milestone system, comprehensive syllabus tracking across all 50 NCERT chapters, independently authored PCMB mock papers with real visual vector diagrams, 15-minute Reading Timer, synced downloadable A4 PDFs, and AI step-marking in a 3-hour **Examination Hall**, plus 50 synced **12th Hackers** one-shot video lectures in one unified application.

---

## Visual Showcase (Click Any Card to Launch Live)

> Click any visual preview below to launch **Quadra 12** directly, or explore the in-app **Help Desk → Interactive Tour** to test real interactive widgets, countdown clocks, milestone seals, and OMR bubbles.

| Overview: Live Board Clock & Achievements | Subject Tracker: 50 Chapters & SVG Plates |
| :---: | :---: |
| [![Quadra 12 Live Board Countdown Clock and My Achievements Preview](public/assets/showcase/overview-clock-achievements-v25.svg)](https://ariyanpal1008.github.io/Quadra12/) | [![Quadra 12 Subject Tracker 50 Chapters and SVG Diagrams Preview](public/assets/showcase/subject-tracker-v25.svg)](https://ariyanpal1008.github.io/Quadra12/) |
| **Live 1s Chronometer** (`16 Feb · 10:30 AM IST`, auto `2027 → 2028` rollover) + **My Achievements** (`Quick Learner`, `Exam Ready`). | **50 NCERT Chapters × 4 Stages** (`Lecture`, `Practice`, `NCERT`, `PYQ`) + 50 bespoke interactive vector study plates. |

| Examination Hall: Original Papers, PDFs & AI Examiner | 12th Hackers & Help Desk Interactive Tour |
| :---: | :---: |
| [![Quadra 12 Examination Hall v2.6 Original Mock Papers, Synced PDFs, SVG Diagrams and AI Examiner Preview](public/assets/showcase/exam-hall-v25.svg)](https://ariyanpal1008.github.io/Quadra12/) | [![Quadra 12 12th Hackers Playlist and Help Desk Suggestion Box Preview](public/assets/showcase/hackers-playlist-v25.svg)](https://ariyanpal1008.github.io/Quadra12/) |
| **Independently Authored PCMB Papers**, **15-Min Reading Timer**, **Synced A4 PDF Downloads**, **Vector SVG Diagrams**, **Smart Camera/Upload Inputs**, and **Gemini 3.8 AI Step-Marking**. | **50 One-Shot Lectures** synced to `Lecture done`, 3 player embed modes, **Interactive Tour**, & Cloud Suggestion Box. |

<details>
<summary><strong>Step-by-Step Interactive Guide — How to Use Quadra 12</strong></summary>

1. **Live Board Exam Countdown Clock (`Overview`):** Counts every second down to **16 Feb at 10:30 AM IST**. Features rolling flip-clock digits, pacing urgency badges, and an **Auto: Feb 16 / Custom Date** picker. It automatically rolls over to the next year's exam once the current date passes.
2. **My Achievements (`Overview`):** Click the compact **My Achievements** card to inspect all **9 Milestone Seals**, including **First Step**, **Quick Learner** (`3–5` chapters in one day), **Syllabus Sprinter** (`5` chapters in a single calendar day), **Four-Stage Purist**, **Subject Champion**, **Hall Debut**, **Exam Ready** (`>90%` score on a mock paper), **One-Shot Scholar**, and **Quadra 12 Grandmaster** (`50/50` chapters). Live unlock banners notify you from any view.
3. **Subject Tracker:** Expand Physics (`14`), Chemistry (`10`), Biology (`13`), or Mathematics (`13`) chapters. Check off **Lecture**, **Practice**, **NCERT**, and **PYQ** checkpoints, view subject-level progress percentages, or inspect each chapter's custom interactive SVG illustration.
4. **Examination Hall:** Select Physics (`042`), Chemistry (`043`), Biology (`044`), or Mathematics (`041`) to launch a 3-hour timed mock paper (starting with a **15-minute Reading Time** cool-off timer with an instant skip option) or export the **100% synced Question Paper PDF** and **Marking Scheme PDF** directly from each subject card. Includes real SVG diagrams & graphs, syllabus concept trend tags, Section A OMR bubble auto-grading, Sections B–E smart camera/photo uploads (`IndexedDB`) + typed drafts (`localStorage`), and `gemini-3.8-flash` AI step-by-step evaluation against 4 modular marking schemes. Download your Graded Report PDF before refreshing or closing results.
5. **12th Hackers:** Stream unit-curated one-shot video lectures with key formulas, summaries, and timestamps. Checking off a lecture automatically updates `Lecture done` in the Subject Tracker.
6. **Help Desk & Interactive Tour:** Access the **Help Desk** to explore the interactive visual tour sandbox, read syllabus notes, submit suggestions or bug reports via Google Sign-In, or access the Creator Inbox.
7. **Terms & Conditions:** Tap the dull blue **Terms & Conditions · 2026** link in the footer to review personal educational self-assessment rules, zero-server browser storage privacy, Copyright, Fair Use, and Takedown Policy.
8. **GitHub Repository:** Click the official bold **GitHub** link in the footer to inspect source code, contribute, or star the repository.
9. **Install Offline PWA / Free Android APK:** Open **Settings → About** (or your browser's three-dot menu) to install Quadra 12 offline on Android, iPhone/iPad (*Add to Home Screen*), Windows, or macOS — or download `Quadra12-v2.6.1-Android.apk` from [GitHub Releases](https://github.com/Ariyanpal1008/Quadra12/releases/tag/v2.6.1) (saves A4 PDFs straight into `Downloads/Quadra12/`).

</details>

---

## About the Creator

I am **AriYan Pal (Keśava Dāsa)** (`ariyanpal090@gmail.com`), a Class 12 student preparing for board exams.

- **The Problem:** Staying organized across Physics, Chemistry, Biology, and Mathematics without getting overwhelmed by clutter, ads, or disorienting apps was a major challenge during board prep.
- **The Solution:** I created **Quadra 12** to provide a calm, aesthetic, and completely focused study sanctuary tailored for Class 12 PCMB students.

---

## Key Features & Capabilities

### 1. Live Board Exam Countdown Clock
- Apple StandBy–inspired minimalist chronometer updating every second with rolling flip-card digits.
- Targets official CBSE Board Exam kick-off: **16 February at 10:30 AM IST**.
- Intelligent annual rollover: automatically resets to **16 February 2028** once 2027 exams begin.
- Built-in **Auto: Feb 16 / Custom Date** selector allowing students to adjust target dates if official schedules shift.
- Dynamic daily chapter pace calculator and urgency indicator.

### 2. Gamified Milestone Badges (My Achievements)
- Accessible via a compact overview trigger card that opens a dedicated milestone dialog.
- 9 milestone seals:
  - **First Step:** Complete your first chapter across all 4 stages.
  - **Quick Learner:** Complete 3 or more chapters in a single calendar day.
  - **Syllabus Sprinter:** Complete 5 or more chapters in a single day.
  - **Four-Stage Purist:** Check off Lecture, Practice, NCERT, and PYQ for 10 chapters.
  - **Subject Champion:** Achieve 100% completion in any single subject.
  - **Hall Debut:** Complete your first 3-hour Examination Hall paper.
  - **Exam Ready:** Score 90% or higher on an Examination Hall paper.
  - **One-Shot Scholar:** Watch and complete 25 12th Hackers lectures.
  - **Quadra 12 Grandmaster:** Complete all 50 chapters across Physics, Chemistry, Biology, and Mathematics.
- Non-intrusive floating unlock toast notifications with soundless, smooth Motion entrance.

### 3. Subject Tracker (50 NCERT Chapters)
- Detailed tracking for **Physics (042)**, **Chemistry (043)**, **Biology (044)**, and **Mathematics (041)**.
- 4 study stages per chapter: **Lecture**, **Practice**, **NCERT Intext/Exercises**, and **PYQs**.
- 50 custom-crafted interactive SVG vector study diagrams providing visual recall for key concepts.
- 100% completion celebration banner with subtle gold shimmer.

### 4. Examination Hall (Original PCMB Papers, Synced PDFs & AI Board Examiner v2.6)
- **Independently Authored Original Papers & Visual Vector Diagrams:** 137 fresh, copyright-safe questions across Physics, Chemistry, Biology, and Mathematics paired with **27 crisp embedded SVG question diagrams/graphs** and **20 labeled reference SVG solution diagrams** (rendered cleanly both on screen and in A4 PDF prints).
- **15-Minute CBSE Reading Time Timer:** Every 3-hour paper opens in authentic cool-off Reading Mode (all answer inputs safely locked) with a one-click **"Skip Reading Time & Start Writing"** button.
- **100% Synced Question Paper PDF & Marking Scheme PDF:** Each subject card exposes downloadable A4 **Question Paper PDF** and **Marking Scheme PDF** previews generated directly from the exact live question & marking scheme datasets (with the Marking Scheme securely locked during active exams until submission).
- **Syllabus Concept & Board Trend Tags:** Every question displays a transparent concept importance & board trend tag (e.g., `High-Yield Concept • Electric Charges and Fields (Board Trend: 2016–2025)`).
- **Sections B–E Smart Inputs & Dual Storage:** Direct device camera capture (`Take Photo`) and gallery upload (`Upload Image`) compressed client-side into browser `IndexedDB` (`SectionBE_PhotoStorage`), plus typed drafts in `localStorage` (`sectionBE_text_draft`) for accidental refresh recovery and **automatic permanent zero-trace wipe** the moment AI grading finishes (zero server storage).
- **AI Board Examiner (`gemini-3.8-flash`):** Step-by-step grading anchored strictly to 4 modular subject marking schemes, returning color-coded palette feedback (Green / Yellow / Red / Grey), model answers, reference SVG diagrams, and a one-click **Graded Results PDF** export.

### 5. 12th Hackers One-Shot Video Workspace
- Curated queue of 50 comprehensive one-shot YouTube lectures aligned with the latest syllabus.
- Bidirectional synchronization: marking a video done checks off the chapter's `Lecture` task in the Subject Tracker.
- 3 playback options: Standard Player, Pure Mode, and Privacy-Enhanced (`youtube-nocookie.com`).
- Direct "Open on YouTube" and "Mark Done & Next" shortcuts.

### 6. Help Desk, Interactive Tour & Standalone Terms Modal
- 5 clean Help Desk tabs: **Interactive Guide**, **Interactive Tour** (sandbox preview widgets), **Creator & Disclaimers**, **Suggest Addition / Change**, and **Creator Inbox**.
- Dedicated **Upcoming 2027 App Updates** section inside About & Disclaimers noting upcoming 5th/6th subject additions (English Core, Physical Education, Computer Science, Fine Arts) and community suggestions post-boards.
- Standalone **Terms & Conditions · 2026** modal accessible directly from the footer with fair use and copyright takedown details.
- Footer features high-resolution official vector **GitHub** logo (`Octicons-mark-github_12794390.svg`) linking to the GitHub repository.

### 7. Footer 2027 Announcement & Non-Overlap Sticky Header
- **Footer "Coming in 2027" Card:** Positioned above the copyright line, featuring a dark pill badge `New Subjects in 2027` and a warm-cream secondary container announcing future post-board subject expansions (English Core, Physical Education, Computer Science, Fine Arts).
- **Solid Frosted Header (No Text Overlap):** Upgraded sticky top navigation bar with `#FAF8F5` (Light) and `#121212` (Dark) background, `backdrop-filter: blur(10px)`, and subtle bottom divider (`rgba(0,0,0,0.06)`), preventing underlying headings and cards from clashing or overlapping during scrolling on desktop and mobile.

### 8. Zero-Dependency Web Audio API Sound System
- **Synthesized Micro-Interactions (<200ms):** Native browser `AudioContext` synthesizes tactile sounds on the fly with no external audio files required.
  - **Chapter Checkboxes (Lecture, Practice, NCERT, PYQ):** Crisp, low-volume tactile pop (sine/triangle rapid pitch sweep, ~60ms) on check, softer reverse tick on uncheck.
  - **Theme Switch (Light/Dark Mode):** Subtle mechanical switch click (~40ms).
  - **OMR Bubble Selection (Examination Hall):** Soft, muted option tap sound (~45ms).
  - **Achievement Unlocked & 100% Subject Mastery:** Warm, two-note harmonic chime (C5 → G5, soft decay ~300ms).
  - **Exam Timer Completion:** Gentle, non-jarring multi-tone bell chime when the 3-hour timer reaches `00:00:00`.
- **Header Sound Toggle:** Compact mute/unmute button (🔊 / 🔇) in the sticky navbar directly next to the theme toggle, persisted in `localStorage`.
- **Subtle Haptics:** Subtle gain levels (0.08–0.15 max) and automatic gesture unlock compliant with browser autoplay policies.

### 9. Official Settings (v2.6), Account-less Cloud Sync & Three.js 3D Study Studio
- **Floating Apple Frosted-Glass `☰` Menu & Settings:** Tapping `☰` opens a translucent Apple frosted-glass sheet over a softly hazy backdrop (zero layout jump) with `Overview`, `Subject Tracker`, `Examination Hall`, `12th Hackers`, **`Settings`**, **`About the Creator`**, and **`Help Desk`**. Tapping **Settings** opens all 7 organized panels:
  1. **Cloud Sync:** Transfer progress between laptops (using a **6-digit numeric Sync Code**) and phones (using a **scannable QR code** `?sync=XXXXXX`) without signing in. Includes an optional small **Camera QR Scanner icon** right beside the 6-digit code input (requests browser camera permission *"Only this time / While using"* strictly on click, decodes with `jsQR`, and shuts off the camera immediately after pairing), plus Auto-Sync and `.json` offline backup export/restore.
  2. **Audio & Tactile:** Sound mute/unmute toggle, 6 interactive Web Audio micro-sound test buttons, and Light/Dark appearance switch.
  3. **3D Studio:** Full-viewport Three.js WebGL interactive studio featuring silky-smooth antialiased rendering, damped OrbitControls, a collapsible **left-side project switcher rail**, camera presets (`3/4`, `Top`, `Side`), auto-orbit toggle, and an Explode Model slider across **Physics** (Moving-Coil Galvanometer), **Chemistry** (`[ML₆]` Octahedral Complex), **Biology** (DNA Double Helix), **Mathematics** (`a × b` Cross Product & Double Cone), and the **Grandmaster Achievement Trophy**.
  4. **Exam & Urgency:** Custom board exam countdown date selector, Official Feb 16 reset, **Urgency Alert Window** (`15 / 30 / 60 / 90 days`), and Daily Chapter Pace Hint toggle.
  5. **Player & Video:** Persistent default YouTube embed engine (`Standard Sync`, `Pure Embed`, or `Privacy No-Cookie`) and Auto-Advance Next Lecture toggle.
  6. **Privacy & Reset:** Live `localStorage` **Storage Quota Meter** (`KB / MB` out of `5 MB`), **Reset Single Subject** controls (reset Physics, Chemistry, Biology, or Math individually without affecting other subjects), and **Master Reset (Danger Zone)** protected by a **double-confirmation pop-up**.
  7. **About & Links:** **Version 2.6** badge, creator stamp (`Ariyan Pal / Keśava Dāsa`), dedicated **Install App (Free Offline PWA & Android APK)** card, and quick launch buttons for **Terms & Conditions · 2026** and the **Official GitHub Repository**.

### 10. Installable Offline PWA & Free Standalone Android `.apk` App (`$0`)
- **Offline Progressive Web App (PWA):** Powered by `vite-plugin-pwa` (`injectManifest` via `src/sw.js`) enforcing Network-First HTML/JS/CSS updates with offline precaching for chapter tracking, countdown timer, SVG plates, and Google Fonts, plus custom `#1D1C17` brand icons (`192×192`, `512×512`, maskable safe-zone icon, and `180×180` Apple Touch Icon).
- **1-Tap In-App Install & Offline Banner:** Built-in **Install App** trigger in the desktop navbar, `☰` mobile menu, and `Settings → About` (plus an automatic iOS Safari *Share → Add to Home Screen* modal guide and a live **Offline Mode** indicator when disconnected).
- **Free Standalone Android `.apk` (`Quadra12-v2.6.0-Android.apk`):** Automatically built, permanently signed with Quadra 12's release keystore, and verified via `apksigner` in `.github/workflows/android-release.yml` on `main` pushes and `v*` releases. Includes native Android `CAMERA`, `READ_MEDIA_IMAGES`, `REQUEST_INSTALL_PACKAGES`, and storage permissions, `<queries>` camera/PDF/installer intents, plus a `QuadraAndroid` bridge (`MainActivity.java`) for `Downloads/Quadra12/` A4 PDF saving and in-app GitHub Releases APK update downloads.

---

## System Architecture

```text
Quadra12/
├── .github/workflows/
│   ├── android-release.yml                # Signed Capacitor + Gradle Android APK CI & Release
│   └── deploy.yml                         # Automated GitHub Pages CI/CD workflow (Node 22)
├── public/
│   ├── assets/
│   │   ├── aistudio/                      # Vector brand assets & media resources
│   │   └── showcase/                      # Zero-overflow v2.6 SVG preview cards for README
│   ├── apple-touch-icon.png               # 180×180 iOS Safari home screen icon
│   ├── favicon.svg                        # Scalable SVG brand emblem
│   ├── google5e9a994eb74ab809.html        # Google Search Console verification token
│   ├── llms.txt                           # Structured summary for AI assistants & search indexers
│   ├── llms-full.txt                      # Full structured knowledge base for LLMs
│   ├── pwa-192x192.png                    # Standard 192×192 PWA icon
│   ├── pwa-512x512.png                    # Standard 512×512 PWA icon
│   ├── pwa-maskable-512x512.png           # Padded adaptive maskable Android PWA icon
│   ├── robots.txt                         # Search engine crawler instructions
│   └── sitemap.xml                        # XML sitemap for SEO discovery
├── src/
│   ├── components/
│   │   ├── AchievementsSection.tsx        # Compact trigger card & Achievements dialog
│   │   ├── BoardCountdownClock.tsx        # Apple StandBy live countdown chronometer
│   │   ├── ChapterIllustrations.tsx       # 50 bespoke chapter SVG illustrations
│   │   ├── ErrorBoundary.tsx              # Robust fallback boundary for errors
│   │   ├── ExamDiagrams.tsx               # Embedded vector SVG diagram & graph renderer
│   │   ├── ExamHallSection.tsx            # 3-hr exam hall, 15m reading timer, camera & AI grading
│   │   ├── ExamPdfModal.tsx               # 100% synced A4 Question Paper & Marking Scheme PDFs
│   │   ├── FluidPrimitives.tsx            # Apple springs, animated numbers & scroll reveals
│   │   ├── HackersPlaylistSection.tsx     # 12th Hackers playlist and notes interface
│   │   ├── HelpDeskModal.tsx              # Guide, Tour, Disclaimers & Feedback modal
│   │   ├── InteractiveTourTab.tsx         # Interactive feature sandbox walkthrough
│   │   ├── ResilientImage.tsx             # Fault-tolerant image component
│   │   ├── SettingsModal.tsx              # Official Settings (6-digit + QR Cloud Sync, Audio, Data)
│   │   ├── SubjectTrackerSection.tsx      # 50-chapter PCMB syllabus tracker
│   │   ├── TermsModal.tsx                 # Standalone Terms & Conditions dialog
│   │   ├── ThreeLabModal.tsx              # Interactive Three.js 3D WebGL Study Studio
│   │   └── YouTubeSyncPlayer.tsx          # Multi-mode synchronized video player
│   ├── data/
│   │   ├── achievements.ts                # 9 milestone rules & unlock velocity logic
│   │   ├── diagramSvgs.ts                 # Barrel exports for 47 question & marking SVG diagrams
│   │   ├── diagramSvgsPart1.ts            # 27 PCMB question diagrams & graphs
│   │   ├── diagramSvgsPart2.ts            # 20 PCMB marking scheme reference diagrams
│   │   ├── pcmbData.ts                    # Canonical syllabus, chapters, & unified exam exports
│   │   ├── sectionAQuestions.ts           # 68 original Section A questions with SVG refs
│   │   ├── subjectiveQuestions.ts         # 69 original Sections B–E questions with SVG refs
│   │   └── markingSchemes/
│   │       ├── loadMarkingScheme.ts       # Lazy subject-isolated marking scheme loader
│   │       ├── physicsMarkingScheme.ts    # Physics marking scheme with step splits & SVGs
│   │       ├── chemistryMarkingScheme.ts  # Chemistry marking scheme with step splits & SVGs
│   │       ├── biologyMarkingScheme.ts    # Biology marking scheme with step splits & SVGs
│   │       └── mathsMarkingScheme.ts      # Mathematics marking scheme with step splits & SVGs
│   ├── utils/
│   │   ├── cloudSync.ts                   # Account-less 6-digit + QR Firestore sync & JSON backup
│   │   ├── examStorage.ts                 # Dual browser storage (localStorage + IndexedDB + wipe)
│   │   ├── pdfExporter.ts                 # Block-aware A4 PDF generator (html2canvas-pro + jsPDF)
│   │   └── soundEffects.ts                # Zero-dependency Web Audio API micro-sound synthesizer
│   ├── App.tsx                            # Root application layout, navigation & footer
│   ├── firebase.ts                        # Firebase Auth (Google Sign-In) & Firestore integration
│   ├── index.css                          # Tailwind CSS v4 & A4 @media print rules
│   └── main.tsx                           # React entry point with ErrorBoundary
├── firebase-applet-config.json            # Public Firebase client config
├── firebase-blueprint.json                # Cloud Firestore database schema
├── firestore.rules                        # Secure Firestore security rules
├── index.html                             # SEO meta tags, OpenGraph, Twitter Cards & JSON-LD
├── package.json                           # NPM dependencies and scripts
└── vite.config.ts                         # Vite configuration with relative base: './'
```

---

## Data & Persistence Architecture

### 1. Local Browser Storage (`localStorage`)
All personal study records, timestamps, and exam scores are preserved locally in the student's browser with zero login required:

| Key | Type | Description |
| :--- | :--- | :--- |
| `pcmb_desk_completed_chapters_v1` | `Record<string, boolean>` | Map of completed chapter IDs |
| `pcmb_desk_chapter_tasks_v1` | `Record<string, ChapterTaskState>` | 4-stage task checkboxes per chapter (`lecture`, `practice`, `ncert`, `pyq`) |
| `pcmb_desk_watched_lectures_v1` | `Record<string, boolean>` | Watched status for all 50 one-shot lectures |
| `pcmb_desk_best_scores_v1` | `Partial<Record<SubjectId, ExamAttemptSummary>>` | Highest examination score and accuracy per subject |
| `pcmb_desk_daily_chapter_log_v1` | `Record<string, string[]>` | Daily completed chapter history (`YYYY-MM-DD`) for sprint achievements |
| `pcmb_desk_achievements_v1` | `Partial<Record<AchievementId, UnlockedAchievementRecord>>` | Timestamps and metadata of unlocked milestone seals |
| `pcmb_desk_custom_board_date_v1` | `string` (`YYYY-MM-DD`) | User-configured exam countdown date override |
| `pcmb_desk_urgency_days_v1` | `'15' \| '30' \| '60' \| '90'` | Countdown final alert threshold window |
| `pcmb_desk_show_pace_v1` | `'true' \| 'false'` | Daily chapter pacing summary visibility |
| `pcmb_desk_embed_mode_v1` | `'standard' \| 'pure' \| 'nocookie'` | Default 12th Hackers YouTube embed player |
| `pcmb_desk_auto_advance_v1` | `'true' \| 'false'` | Auto-advance next lecture upon completion |
| `pcmb_desk_sound_muted_v1` | `string` (`'true'` \| `'false'`) | User sound effects mute/unmute preference |
| `pcmb_desk_theme_v1` | `'light' \| 'dark'` | UI theme preference |
| `pcmb_desk_sync_code_v1` | `string` (`6 digits`) | Active account-less Cloud Sync pairing code |
| `pcmb_desk_auto_sync_v1` | `'true' \| 'false'` | Debounced automatic Cloud Sync toggle |
| `pcmb_desk_last_synced_v1` | `string` (ISO timestamp) | Timestamp of last successful Cloud Sync operation |
| `sectionBE_text_draft` | `Record<string, string>` | Temporary active exam typed drafts (auto-wiped immediately after AI grading) |
| `IndexedDB: SectionBE_PhotoStorage` | Compressed JPEG Blobs | Temporary Sections B–E photo uploads (zero server storage, auto-wiped post-grading) |

### 2. Cloud Firestore (`syncSessions` & `changeRequests` Collections)
- **`syncSessions/{syncCode}`:** Account-less cross-device synchronization keyed by a 6-digit numeric code (and QR code URL `?sync=XXXXXX`). Collection listing (`allow list: if false`) is strictly blocked so user sync sessions cannot be enumerated or scraped.
- **`changeRequests`:** Used for user suggestions and change requests submitted via Google Sign-In:

- `authorUid` (`string`) — Submitter's Firebase Auth UID.
- `authorName` (`string`) — Submitter's display name.
- `category` (`'addition' | 'change' | 'syllabus_fix' | 'bug_report'`) — Category of suggestion.
- `targetSection` (`'general' | 'overview' | 'subjects' | 'exam' | 'hackers'`) — Relevant app section.
- `title` (`string`, 3–120 chars) — Suggestion title.
- `details` (`string`, 5–1500 chars) — Detailed feedback or report.
- `status` (`'new' | 'planned' | 'added'`) — Status badge.
- `creatorNote` (`string`, max 500 chars) — Official response note from the creator.
- `createdAt` / `updatedAt` — Firestore server timestamps.

---

## Tech Stack

- **Framework:** React 19, TypeScript
- **Bundler:** Vite 8 (configured with `base: './'` for GitHub Pages)
- **3D, PDF & QR Pairing:** Three.js (`WebGLRenderer`, `OrbitControls`, `RoomEnvironment`), `jsPDF` + `html2canvas-pro` (A4 PDF exports), `qrcode`, & `jsqr` (in-app camera QR scanner)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Animations:** Motion (`motion/react`) with custom Apple spring presets
- **Icons:** Lucide Icons & official Octicons GitHub SVG
- **Backend / Authentication:** Firebase Authentication (Google Sign-In) & Cloud Firestore
- **Deployment & App Packaging:** GitHub Pages via `.github/workflows/deploy.yml`, Offline PWA via `vite-plugin-pwa`, & Permanently Signed Android `.apk` via `.github/workflows/android-release.yml` (Capacitor + Gradle)
- **SEO & Discoverability:** Canonical links, OpenGraph, Twitter Cards, Schema.org `WebApplication` JSON-LD, `llms.txt`, `llms-full.txt`, `robots.txt`, and `sitemap.xml`

---

## Release v2.6.2 Highlights

- **Examination Hall PCMB Grading Engine (`v2.6.2`):** Upgraded 1-call batch grading for both 33-question PCB and 38-question Mathematics papers using a 5-key Gemini API pool (`VITE_GEMINI_API_KEYS` in git-ignored `.env`) with automatic 10s failover across active Gemini Vision models (`gemini-3.1-flash-lite`, `gemini-3.8-flash`, `gemini-4-hydrogen`).
- **Pattern, Texture & Symbol-Spam Gatekeeper (`v2.6.2`):** Local HTML5 Canvas blank/blur pre-filter + strict AI Examiner gatekeeper (`temperature: 0.0`) immediately disqualifies decorative patterns, textures, cloth/bedsheets, invalid objects, hazy photos, and symbol-spam/gibberish text at `0 Marks (Red)`.
- **Offline & Peak Rate-Limit Self-Check Mode (`v2.6.2`):** Interactive **Full Marks (Green)**, **Partial Marks (Yellow)**, and **Incorrect (Red)** self-check buttons activate strictly when offline or when all 5 keys hit rate limits (starting valid pending answers at `0`, never fake partial credit).
- **Zero-Flicker Static Overview Shell, AI SEO & Frosted Glass Menu (`v2.6`–`v2.6.1`):** Clean header polish with installation relocated to **Settings → About**, `robots.txt` AI crawler permissions, Schema.org `@graph` JSON-LD, hash deep linking, network-first PWA Service Worker (`src/sw.js`), and free standalone Android APK (`Quadra12-v2.6.2-Android.apk`). (See `RELEASE_NOTES_v2.6.2.md` and `RELEASE.md` for full release notes.)

---

## Local Development & Build

```bash
# 1. Clone repository
git clone https://github.com/Ariyanpal1008/Quadra12.git
cd Quadra12

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Start local development server
npm run dev

# 4. Type check with TypeScript compiler
npm run lint

# 5. Build for production (outputs to dist/)
npm run build
```

---

## Disclaimers, Terms &amp; Conditions (Copyright, Privacy &amp; AI Fair Use)

- **Independent Student Initiative:** Quadra 12 is an independent, non-commercial educational study workspace. All Class 12 PCMB mock papers, step-by-step marking schemes, and AI evaluations are provided strictly for personal educational self-assessment. Always verify official circulars and syllabus announcements on [cbse.gov.in](https://cbse.gov.in).
- **Independently Authored Material & Intellectual Property:** All Class 12 PCMB mock papers, questions, case scenarios, numericals, embedded SVG diagrams/graphs, and step marking schemes on Quadra 12 are independently authored copyright-safe content. 12th Hackers YouTube lecture playlists belong to their respective educators and creators.
- **Privacy, Browser Storage & Save Reminder (Zero Server Storage):** Typed drafts (`localStorage`) and attached photos (`IndexedDB`) stay solely inside the student's own browser during the exam for refresh protection, and are automatically and permanently wiped the moment AI grading finishes (zero server storage). Download your Graded Report / Marking Scheme PDF before refreshing or closing the results screen.
- **AI Board Examiner Disclaimer:** Sections B to E subjective evaluation is performed by Gemini AI Vision (`gemini-3.1-flash-lite` / `gemini-3.8-flash` / `gemini-4-hydrogen`) as an automated practice examiner strictly for personal study guidance and self-assessment.
- **Copyright Claims & Takedown Policy:** If you are a copyright owner or authorized agent and believe any content on Quadra 12 infringes your copyright, please contact `ariyanpal090@gmail.com` for prompt resolution.

---

© 2026 Quadra 12 · Creator: AriYan Pal (Keśava Dāsa)
