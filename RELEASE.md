# Quadra 12 v2.6.2 — Advanced CBSE PCMB Examination Hall Grading Engine

**Tag:** `v2.6.2`  
**Release Title:** `Quadra 12 v2.6.2 — Examination Hall Grading Engine Upgrade, 5-Key Gemini Pool & 1-Call Batch Grading`

---

## What's New in v2.6.2

### 1. Website + PWA + APK Compatibility & Key Protection
* **Secure Environment Variables:** Stored 5 Gemini API keys in `.env` as `VITE_GEMINI_API_KEYS`, ensuring `.env` and `.env.local` are git-ignored.
* **Offline APK & PWA Self-Check:** Service Worker caches question and marking scheme PDFs; offline submissions automatically trigger Marking Scheme Self-Check Mode.

### 2. 1-Call Batch Grading (PCB & Maths)
* **Local Section A MCQs:** Graded 100% locally in JavaScript (0 API calls).
* **Canvas Pre-Filter:** Blurry or blank photos in Sections B–E are caught on HTML5 Canvas and disqualified with the exact message: `"Submission Disqualified (0 Marks): Photo was hazy/unreadable or did not show a valid written answer."`
* **Single Batch Request:** Valid images are compressed to 800px width and sent in ONE single JSON batch request per exam.

### 3. 5-Key Gemini Pool & Interactive Self-Check Fallback
* **Automatic Failover:** Random starting key with 10s per-key failover across the 5-key pool and active Gemini Vision models (`gemini-3.1-flash-lite`, `gemini-3.8-flash`, `gemini-4-hydrogen`).
* **Strict Offline / Rate-Limit Self-Check Mode:** Triggers **only** when the device is offline or all 5 API keys exceed rate limits (`429`/`503`)—never during normal online AI grading. Starts valid pending answers at `0` marks with side-by-side **Full Marks (Green)**, **Partial Marks (Yellow)**, and **Incorrect (Red)** buttons.

### 4. Strict Examiner System Prompt & Gatekeeper (`temperature: 0.0` + JSON)
* **Pattern, Texture & Symbol-Spam Gatekeeper:** Instantly disqualifies patterns, textures, cloth/bedsheets, invalid objects, hazy photos, and symbol-spam/gibberish text at `0 Marks (Red)` (never eligible for Self-Check credit).
* **Strict Step-Marking:** Enforces exact step-marking against the official Marking Scheme PDF data.

---

**Full Changelog:** `v2.6.1...v2.6.2`  
**Live Web & Offline PWA App:** [https://ariyanpal1008.github.io/Quadra12/](https://ariyanpal1008.github.io/Quadra12/)  
**Free Signed Android APK Download:** [GitHub Releases](https://github.com/Ariyanpal1008/Quadra12/releases/latest)  
**Creator:** Ariyan Pal (Keśava Dāsa) · `ariyanpal090@gmail.com`
