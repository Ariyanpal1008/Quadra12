# Quadra 12 v2.6 — Zero-Flicker Hydration, AI Crawler SEO, Deep Linking, Network-First PWA & Apple Glass Mobile Menu

**Tag:** `v2.6`  
**Release Title:** `Quadra 12 v2.6 — Zero-Flicker UI Hydration, AI SEO & Hash Deep Linking, Network-First PWA & Apple Glass Menu`

---

## What's New in v2.6

### 1. Zero-Flicker Static Overview Shell & Icon Alignment
* **Pixel-Matched Pre-Mount Fallback (`index.html`):** Replicates exact font families, sizing, padding, borders, and `lucide-react` v0.546.0 SVG geometry (`Menu`, `Moon`, `Sun`, `Volume2`, `Settings`, `Download`) so zero icons or layout elements jump during React mount.
* **Synchronous Pre-Paint Theme & Deep-Link Guard:** Synchronous `<head>` script resolves `pcmb_desk_theme_v1` and checks non-Overview deep links before first paint to prevent Light Mode flashes or Overview glimpses.
* **Author & Header Polish:** Standardized creator attribution (`Ariyan Pal (Keśava Dāsa)`) and kept the `32×32` Quadra 12 emblem locked in place during hydration.

### 2. AI Crawler Discoverability & Hash Deep Linking
* **AI-Friendly `robots.txt` & Schema.org `@graph`:** Explicitly permits `Googlebot`, `Google-Extended`, `GPTBot`, `OAI-SearchBot`, `ClaudeBot`, and `PerplexityBot`, paired with structured Schema.org JSON-LD (`WebSite` + `EducationalApplication`) and refreshed `llms.txt` / `llms-full.txt`.
* **Direct Hash Routes (`#/...`):** Direct deep linking on GitHub Pages without 404s across `#/overview`, `#/physics`, `#/chemistry`, `#/biology`, `#/mathematics`, `#/exam-hall`, `#/sample-papers`, and `#/12th-hackers`.

### 3. Floating Apple Frosted-Glass Mobile Menu with Hazy Backdrop
* **Zero Page Push-Down:** Tapping the `≡` three-line menu opens a floating translucent frosted-glass sheet (`backdrop-blur-[22px] saturate(165%)`) anchored cleanly below the sticky navbar without expanding the header downward.
* **Hazy Backdrop Depth:** Blurs and dims the page behind the menu (`backdrop-blur-[6px]`) in both Light and Dark modes, with tap-outside and `Escape` dismissal.

### 4. Network-First Service Worker & Chemistry Syllabus Plate
* **Network-First PWA Strategy (`src/sw.js`):** Switched `vite-plugin-pwa` to `injectManifest` with Network-First HTML/JS/CSS fetching and clean `quadra12-v2.6-*` cache cleanup on activation.
* **Syllabus-Aligned Chemistry Card Plate (`public/chemistry-plate.svg`):** Replaced legacy card artwork with a custom CBSE Class 12 Chemistry vector plate featuring the Daniell Galvanic Cell, Arrhenius Reaction Energy Profile, and Octahedral `[ML6]` Crystal Field Splitting.

### 5. Android APK & Core Workspace v2.6 Sync
* Bumped Android APK build (`Quadra12-v2.6-Android.apk`, `versionName "2.6"`), in-app update checker, and Settings About badge to **Version 2.6**.

---

**Full Changelog:** `v2.5...v2.6`  
**Live Web & Offline PWA App:** [https://ariyanpal1008.github.io/Quadra12/](https://ariyanpal1008.github.io/Quadra12/)  
**Free Android APK Download:** [GitHub Releases (`Quadra12-v2.6-Android.apk`)](https://github.com/Ariyanpal1008/Quadra12/releases/tag/v2.6)  
**Creator:** Ariyan Pal (Keśava Dāsa) · `ariyanpal090@gmail.com`
