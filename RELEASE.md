# Quadra 12 v2.6 — Zero-Flicker Hydration, AI Crawler SEO, Deep Linking, Network-First PWA & Apple Glass Mobile Menu

**Tag:** `v2.6`  
**Release Title:** `Quadra 12 v2.6 — Zero-Flicker UI Hydration, AI SEO & Hash Deep Linking, Network-First PWA & Apple Glass Menu`

---

## What's New in v2.6

### 1. Zero-Flicker Overview Hydration & Exact Icon Matching
* **Pixel-Matched Pre-Mount Fallback (`index.html`):** Replicates the mounted React header, typography, and `lucide-react` v0.546.0 SVG geometry so buttons, icons, and spacing remain completely steady on mount.
* **Synchronous Dark Mode & Deep-Link Flash Guard:** Inline `<head>` script applies `dark` and `is-deep-link` classes before first paint.

### 2. AI Crawler Discoverability & Direct Hash Routing
* **AI-Friendly `robots.txt` & JSON-LD `@graph`:** Explicitly enables indexing for search and AI crawlers alongside structured Schema.org metadata and `llms.txt` / `llms-full.txt`.
* **Hash Deep Linking:** Supports `#/overview`, `#/physics`, `#/chemistry`, `#/biology`, `#/mathematics`, `#/exam-hall`, `#/sample-papers`, and `#/12th-hackers`.

### 3. Floating Apple Frosted-Glass Mobile Menu
* **Hazy Backdrop & Translucent Sheet:** Tapping `☰` floats an Apple-style frosted glass sheet over a softly blurred backdrop without pushing the hero section down.

### 4. Network-First PWA Service Worker & Syllabus Chemistry Plate
* **`injectManifest` (`src/sw.js`):** Network-First HTML/JS/CSS updates (`quadra12-v2.6-*` cache) with offline fallback and automatic cleanup of old caches.
* **Chemistry Card Artwork (`chemistry-plate.svg`):** Syllabus-aligned Daniell Cell, Arrhenius Profile, and Octahedral `[ML6]` vector plate.

### 5. Permanently Signed Android APK, Release CI & In-App Update Checker
* **Signed Android APK (`Quadra12-v2.6.0-Android.apk`):** Built via Capacitor 8 + Gradle in `.github/workflows/android-release.yml`, permanently signed using Quadra 12's release keystore (`quadra12-release.jks`), verified via `apksigner`, and published automatically to GitHub Releases on `v*` tags.
* **In-App GitHub Releases Updater:** Compares installed version (`versionName` & `versionCode`) against GitHub Releases API, displays release notes and update notifications, downloads the signed APK with real progress via native `DownloadManager`, and launches Android's system installer confirmation dialog.
* **Complete PCMB Examination Hall:** 137 independently authored questions, 47 vector SVG diagrams, 15-minute Reading Timer, synced A4 PDFs, Sections B–E smart camera/photo uploads with post-grading wipe, and `gemini-3.8-flash` AI step-marking.

---

**Full Changelog:** `v2.5...v2.6.0`  
**Live Web & Offline PWA App:** [https://ariyanpal1008.github.io/Quadra12/](https://ariyanpal1008.github.io/Quadra12/)  
**Free Signed Android APK Download:** [GitHub Releases](https://github.com/Ariyanpal1008/Quadra12/releases/latest)  
**Creator:** Ariyan Pal (Keśava Dāsa) · `ariyanpal090@gmail.com`
