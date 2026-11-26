# Quadra 12 v2.6.2 — Examination Hall PCMB Grading Engine Upgrade

**Tag:** `v2.6.2`  
**Release Title:** `Quadra 12 v2.6.2 — Advanced CBSE PCMB Grading Engine, 5-Key Gemini Pool & 1-Call Batch Grading`

---

## What's New in v2.6.2

### 1. Website + PWA + APK Compatibility & Key Protection
* **Secure Environment Variables:** Stored 5 Gemini API keys in `.env` as `VITE_GEMINI_API_KEYS`, ensuring `.env` and `.env.local` are listed in `.gitignore` so GitHub never exposes private keys publicly.
* **Offline PWA & APK Fallback:** Service Worker caches Question PDFs and Marking Scheme PDFs for fast offline access. If an exam is submitted offline, it automatically opens "Marking Scheme Self-Check Mode" without throwing network errors.

### 2. 1-Call Batch Grading (33-Question PCB & 38-Question Maths)
* **Local Section A MCQs:** Graded instantly in JavaScript (0 API calls).
* **HTML5 Canvas Pre-Filter:** Automatically detects blank or extremely blurry subjective photos in Sections B–E and flags them as "red" (0 marks) with exact rejection feedback: `"Submission Disqualified (0 Marks): Photo was hazy/unreadable or did not show a valid written answer."`
* **Single Batch Request:** Valid photos are compressed (max 800px width, 0.75 JPEG quality) and sent together in ONE single structured JSON batch request mapping each image to its question number and official marking scheme steps.

### 3. 5-Key Gemini Pool & Unlimited Peak Fallback
* **Round-Robin Key Rotation:** Picks a starting key at random per submission and automatically retries silently across the 5-key pool on HTTP 429 rate limits or temporary errors.
* **Self-Check Fallback Mode:** If all keys hit peak rate limits or the device is offline, switches seamlessly to Marking Scheme Self-Check Mode with side-by-side grading buttons.

### 4. Strict Examiner System Prompt (`temperature: 0.0` + JSON)
* **Zero Guessing & Strict Image Gatekeeper:** Instantly disqualifies invalid objects (phone screens, hands, walls) and hazy/unreadable handwriting (`0 marks`).
* **Precise Step-Marking:** Enforces strict partial marking ("yellow") only when steps match the official Marking Scheme PDF steps 100% legibly.

---

**Full Changelog:** `v2.6.1...v2.6.2`  
**Live Web & Offline PWA App:** [https://ariyanpal1008.github.io/Quadra12/](https://ariyanpal1008.github.io/Quadra12/)  
**Free Signed Android APK Download:** [GitHub Releases](https://github.com/Ariyanpal1008/Quadra12/releases/tag/v2.6.2)  
**Creator:** Ariyan Pal (Keśava Dāsa) · `ariyanpal090@gmail.com`
