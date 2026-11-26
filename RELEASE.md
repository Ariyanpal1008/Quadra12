# Quadra 12 v2.6.1 — Install Button Relocation & Header Polish

**Tag:** `v2.6.1`  
**Release Title:** `Quadra 12 v2.6.1 — Install Button Relocation & Clean Header Polish`

---

## What's New in v2.6.1

### 1. Clean Header Polish (Install Button Relocation)
* **Removed Standalone Green Install Button:** Removed the green "Install App" button from the main desktop navigation header, mobile floating glass menu, and pre-mount static HTML shell (`index.html`).
* **Uncluttered Navigation:** The top header is now clean, calm, and distraction-free across Website, PWA, and Android APK (matching the brand aesthetic with Moon/Sun toggle, Sound chronometer chime, Settings gear, and Enter Exam Hall).

### 2. Streamlined Settings Installation Hub (`Settings → About`)
* **Exclusive Access via Settings:** All app installation functionality is now organized inside **Settings → About**, keeping the workspace header minimal while preserving 100% of the installation capabilities.
* **Native PWA Flow:** Supports standard Chromium/Edge `beforeinstallprompt` installation with one-tap trigger.
* **iOS Safari Guided Installation:** Includes visual step-by-step guidance for iPhone and iPad users (*Share → Add to Home Screen*).
* **Graceful Fallback & Instructions:** For browsers that do not fire ambient prompts, comprehensive 1-2-3 instructions guide students to install via Chrome's three-dot menu or download the signed Android APK.
* **Installed State Detection:** Automatically detects standalone display mode and displays `Running in Installed App Mode`.

### 3. Preserved PWA Standards & Browser-Native Installation
* **Native Browser Menus Unaffected:** Full compatibility with Chrome/Edge three-dot menu (*"Install app"* or *"Add to Home screen"*).
* **Service Worker & Manifest Retained:** Preserved Web App Manifest (`manifest.json`), network-first caching (`src/sw.js` cache bumped to `quadra12-v2.6.1-*`), and offline capabilities across all 50 NCERT chapters.

### 4. Signed Android APK Update (`Quadra12-v2.6.1-Android.apk`)
* **Permanent Keystore Signing:** Preserves `io.github.ariyanpal1008.quadra12` and the release keystore signature for in-place updates over existing installations without uninstalling.
* **In-App Updater Synced:** In-app update checker detects `v2.6.1` release directly from GitHub Releases.

---

**Full Changelog:** `v2.6.0...v2.6.1`  
**Live Web & Offline PWA App:** [https://ariyanpal1008.github.io/Quadra12/](https://ariyanpal1008.github.io/Quadra12/)  
**Free Signed Android APK Download:** [GitHub Releases](https://github.com/Ariyanpal1008/Quadra12/releases/latest)  
**Creator:** Ariyan Pal (Keśava Dāsa) · `ariyanpal090@gmail.com`
