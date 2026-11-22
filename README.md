# Quadra 12

**Live Website:** [https://ariyanpal1008.github.io/Quadra12/](https://ariyanpal1008.github.io/Quadra12/)  
**Repository:** [https://github.com/Ariyanpal1008/Quadra12](https://github.com/Ariyanpal1008/Quadra12)  
**Creator:** AriYan Pal (Keśava Dāsa) · `© 2026 Quadra 12` (Invented November 2026)

Quadra 12 is an independent Class 12 CBSE PCMB (Physics, Chemistry, Biology, and Mathematics) study workspace. It unifies syllabus tracking across 50 NCERT chapters, full-length official CBSE 2026–27 Sample Question Paper practice inside a timed Examination Hall, and 50 synced **12th Hackers** one-shot video lectures in one calm, distraction-free web application.

---

## About the Creator

I am a Class 12 student currently preparing for board exams.

- **The Problem:** Keeping board exam preparation organized and finding one clean, distraction-free study tracker was a real struggle.
- **The Solution:** I built this app to solve that exact problem for myself and other students facing the same challenge.

---

## System Overview (For AI Assistants & Developers)

Quadra 12 is a **client-first React + TypeScript + Vite SPA** styled with **Tailwind CSS v4** and animated with **Motion**, deployed statically to **GitHub Pages** with **Firebase Authentication & Cloud Firestore** powering community suggestions and the Creator Inbox.

### Core Modules & Views

| View / Module | Primary File(s) | Purpose & Capabilities |
| :--- | :--- | :--- |
| **App Shell & Overview** | `src/App.tsx` | Sticky 3-zone navigation, Light/Dark theme switcher, top mobile `☰` menu (with direct **About the Creator** and **Help Desk** links), combined PCMB mastery metrics (50 chapters / 200 stage checkboxes), subject summary cards, and quick navigation. |
| **Subject Tracker** | `src/components/SubjectTrackerSection.tsx`<br>`src/components/ChapterIllustrations.tsx` | Tracks **50 NCERT Class 12 chapters** (Physics 14, Chemistry 10, Biology 13, Maths 13) across 4 stages (`lecture`, `practice`, `ncert`, `pyq`), bulk subject-level stage toggles, completion shimmer at 100%, and 50 bespoke SVG study diagrams. |
| **Examination Hall** | `src/components/ExamHallSection.tsx`<br>`src/components/ExamDiagrams.tsx` | Embedded official **CBSE 2026–27 Sample Question Paper PDFs**, 3-hour (`03:00:00`) live exam timer, interactive OMR / question checklist, automatic Section A evaluation, and per-subject best score tracking. |
| **12th Hackers** | `src/components/HackersPlaylistSection.tsx`<br>`src/components/YouTubeSyncPlayer.tsx` | Curated unit cards and playlist queue for all 50 one-shot lectures, bidirectionally synced with the `lecture` checkpoint in Subject Tracker. Supports 3 embed player modes (`standard`, `pure`, `nocookie`), YouTube `postMessage` completion detection, and a quick **"Open on YouTube" + "Mark Done & Next"** workflow. |
| **Help Desk & Feedback** | `src/components/HelpDeskModal.tsx`<br>`src/firebase.ts` | 4-tab support modal: **Help Desk** (guide to all 4 views), **Creator & Disclaimers** (About the Creator + credits), **Suggest Addition / Change** (Google Sign-In Firestore form + `mailto:` fallback), and **Creator Inbox** (unlocked for verified creator admin). |

---

## Data & State Architecture

### 1. Local Browser Persistence (`localStorage`)
All student study data saves locally in the browser with zero account required:

| Key | Data Stored |
| :--- | :--- |
| `pcmb_desk_completed_chapters_v1` | `Record<string, boolean>` — chapter-level completion map |
| `pcmb_desk_chapter_tasks_v1` | `Record<string, { lecture?, practice?, ncert?, pyq? }>` — 4-stage progress per chapter |
| `pcmb_desk_watched_lectures_v1` | `Record<string, boolean>` — episode watched state synced with `lecture` tasks |
| `pcmb_desk_best_scores_v1` | `Partial<Record<SubjectId, ExamAttemptSummary>>` — highest Examination Hall score per subject |
| `pcmb_desk_theme_v1` | `'light' \| 'dark'` — UI theme preference |

### 2. Cloud Firestore (`changeRequests` Collection)
Used strictly for community suggestions & change requests inside the Help Desk modal (`firestore.rules` enforces authenticated ownership and creator-only moderation):

- `authorUid` (`string`) — Firebase Auth UID of submitter
- `authorName` (`string`) — display name
- `category` (`'addition' | 'change' | 'syllabus_fix' | 'bug_report'`)
- `targetSection` (`'general' | 'overview' | 'subjects' | 'exam' | 'hackers'`)
- `title` (`string`, 3–120 chars)
- `details` (`string`, 5–1500 chars)
- `status` (`'new' | 'planned' | 'added'`)
- `creatorNote` (`string`, max 500 chars)
- `createdAt` / `updatedAt` (Firestore server timestamps)

---

## Project Structure

```text
Quadra12/
├── .github/workflows/deploy.yml       # Automated GitHub Pages build & deploy (Node 22)
├── public/
│   ├── assets/                        # Static CBSE 2026-27 PDFs & subject artwork
│   ├── google5e9a994eb74ab809.html    # Google Search Console ownership verification
│   ├── robots.txt                     # Search crawler directives
│   └── sitemap.xml                    # Canonical sitemap for Search Console
├── src/
│   ├── components/
│   │   ├── ChapterIllustrations.tsx   # Bespoke chapter vector diagrams
│   │   ├── ErrorBoundary.tsx          # React error boundary for Firestore/UI errors
│   │   ├── ExamDiagrams.tsx           # Exam visual aids
│   │   ├── ExamHallSection.tsx        # 3-hour CBSE SQP workspace + OMR grader
│   │   ├── HackersPlaylistSection.tsx # 12th Hackers playlist & notes view
│   │   ├── HelpDeskModal.tsx          # Guide, About Creator, Suggestions & Inbox modal
│   │   ├── ResilientImage.tsx         # Image loader with fallback
│   │   ├── SubjectTrackerSection.tsx  # 50-chapter PCMB tracker & SVG modal
│   │   └── YouTubeSyncPlayer.tsx      # Multi-mode YouTube iframe + completion listener
│   ├── data/
│   │   └── pcmbData.ts                # Canonical CBSE PCMB syllabus, SQP & playlist data
│   ├── App.tsx                        # Main workspace controller, navigation & footer
│   ├── firebase.ts                    # Firebase App, Auth (Google) & Firestore setup
│   ├── index.css                      # Tailwind CSS v4 tokens, typography & shimmer keyframes
│   └── main.tsx                       # Root React mount wrapped in ErrorBoundary
├── firebase-applet-config.json        # Public Firebase client configuration
├── firebase-blueprint.json            # Firestore schema blueprint
├── firestore.rules                    # Production Firestore security rules
├── index.html                         # SEO metadata, OpenGraph, Twitter & JSON-LD schema
├── package.json                       # Scripts & dependencies
└── vite.config.ts                     # Vite build with relative `base: './'` for GitHub Pages
```

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite 8
- **Styling & Motion:** Tailwind CSS v4 (`@tailwindcss/vite`), Lucide Icons, Motion (`motion/react`)
- **Backend / Cloud:** Firebase Authentication (Google Sign-In) & Cloud Firestore
- **Hosting & CI/CD:** GitHub Pages via `.github/workflows/deploy.yml`
- **SEO & Discovery:** Canonical `<link>`, OpenGraph, Twitter Card, Schema.org `WebApplication` JSON-LD, `robots.txt`, and `sitemap.xml`

---

## Local Development & Build

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Start local dev server on port 3000
npm run dev

# 3. Type-check
npm run lint

# 4. Build production bundle into dist/
npm run build
```

> **GitHub Pages Note:** `vite.config.ts` uses `base: './'` and `pcmbData.ts` resolves static asset URLs with `import.meta.env.BASE_URL` so all assets and CBSE PDFs load cleanly under `/Quadra12/`.

---

## Disclaimers & Credits

- **Independent Student Initiative:** Quadra 12 is an educational study tracker and practice tool. Always verify official CBSE circulars, exam dates, and syllabus updates on `cbse.gov.in`.
- **Third-Party Content Ownership:** Official CBSE 2026–27 Sample Question Papers belong to CBSE, and all 12th Hackers YouTube playlists belong to their respective educators and creators; Quadra 12 organizes links and embeds solely for student revision convenience.
- **Development Note:** Conceived, structured, and curated by AriYan Pal (Keśava Dāsa) with partial AI-assisted development support.

---

© 2026 **Quadra 12** · Invented November 2026 · Creator: **AriYan Pal (Keśava Dāsa)** (`ariyanpal090@gmail.com`)
