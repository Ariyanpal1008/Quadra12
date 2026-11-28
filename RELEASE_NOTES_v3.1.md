# Release Notes — Quadra 12 v3.1

**Release Date:** November 28, 2026  
**Tag:** `v3.1`  
**Target Branch:** `main`  
**APK Artifact:** `Quadra12-v3.1-Android.apk` (permanently signed via GitHub Actions)

> **Historical Continuity:** Previous release documentation in [`RELEASE_NOTES_v2.6.2.md`](RELEASE_NOTES_v2.6.2.md) is preserved intact for archival reference, and all 17 legacy v2.6.2 browser `localStorage` keys migrate safely without data loss.

---

## Executive Summary

Quadra 12 `v3.1` unifies the codebase cleanly on version `3.1`, synchronizes the Overview Board Exam Countdown directly with the **Official 2027 CBSE Class 12 Date Sheet** (with live IST status tracking, automatic completion checkmarks, subject rollover, and automatic post-board expiry), upgrades the **12th Hackers** YouTube player to force mobile **Landscape Full-Screen** playback cleanly even with Auto-Rotate off, and preserves the entire deterministic PCMB OMR Examination Hall, 50-chapter Study Libraries, 720-question Verified Bank, Offline PWA, and Signed Android APK pipeline.

---

## Major Additions & Changes in v3.1

### 1. Official CBSE 2027 Date Sheet Countdown (`src/data/cbseDateSheet2027.ts` & `BoardCountdownClock.tsx`)
- Syncs Overview's countdown clock strictly to IST (`UTC+05:30`) across all 8 official 2027 CBSE Board Exam dates:
  1. Physics (`042`) — Tuesday, 16 Feb 2027 (`10:30 AM – 01:30 PM IST`)
  2. Physical Education (`048`) — Thursday, 18 Feb 2027 (`10:30 AM – 01:30 PM IST`)
  3. Fine Arts (`049 / 050 / 051 / 052`) — Wednesday, 24 Feb 2027 (`10:30 AM – 12:30 PM IST`)
  4. Chemistry (`043`) — Saturday, 27 Feb 2027 (`10:30 AM – 01:30 PM IST`)
  5. Mathematics / Applied Mathematics (`041 / 241`) — Tuesday, 9 Mar 2027 (`10:30 AM – 01:30 PM IST`)
  6. Biology (`044`) — Thursday, 25 Mar 2027 (`10:30 AM – 01:30 PM IST`)
  7. Computer Science (`083`) — Wednesday, 31 Mar 2027 (`10:30 AM – 01:30 PM IST`)
  8. Web Application (`803`) — Friday, 9 Apr 2027 (`10:30 AM – 01:30 PM IST`)
- Adds a **`View 2027 Date Sheet`** modal displaying live IST statuses (`X Days Left`, `Exam Today` highlight, and green `✓ Completed` with row dimming & strikethrough once an exam ends).
- Automatically advances the Overview countdown to the next upcoming exam after each paper finishes, and hides the countdown card + Date Sheet button (`display: none`) after **9 April 2027 at 01:30 PM IST**.
- Leaves **Examination Hall** completely untouched for internal Quadra 12 mock tests.

### 2. Forced Landscape Full-Screen Player in 12th Hackers (`YouTubeSyncPlayer.tsx` & `HackersPlaylistSection.tsx`)
- Appends `fs=0` to every YouTube embed URL in 12th Hackers (`standard`, `pure`, `nocookie`, and playlist fallback).
- Wraps every player iframe in a `position: relative` container with a custom Quadra 12-themed **`Full Screen`** button (`#231f1e` background, `#f8f5f0` text, rounded corners) hidden while full-screen is active.
- Enters full-screen (`requestFullscreen()` / `webkitRequestFullscreen()`) and calls `await screen.orientation.lock('landscape')` safely inside `try...catch`, then automatically unlocks orientation via `screen.orientation.unlock()` on `fullscreenchange` / `webkitfullscreenchange`.
- Preserves playlist switching, chapter formula overlays, chapter timestamps, and `enablejsapi=1` completion tracking.

### 3. Unified Version `3.1` Hygiene & Core Platform
- Updated `package.json`, `APP_VERSION` (`src/constants/version.ts`), `server.ts` (`GET /api/health` → `'3.1'`), `src/sw.js` (`quadra12-v3.1-*`), `index.html`, `ExamPdfModal.tsx`, `ArchiveExamView.tsx`, `HelpDeskModal.tsx` (About & Disclaimers), `TermsModal.tsx`, `App.tsx`, `InteractiveTourTab.tsx`, `.github/workflows/*`, `scripts/configure-android.mjs` (`versionCode = 3100 + GITHUB_RUN_NUMBER`), `public/llms*.txt`, and `README.md`.
- Retains all 4 PCMB Study Libraries (50 NCERT chapters, 94 SVGs), 720 Verified Questions (`180` per subject), Human-Approved OMR Engine, Unconditional `0`-mark result & A4 PDF export, Multi-Student Isolation, and legacy v2.6.2 migration.
