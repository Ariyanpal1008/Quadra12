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

### 3. 5-Key Gemini Pool & Peak Fallback
* **Automatic Failover:** Random starting key with automatic silent retry across the 5-key pool on HTTP 429 rate limits.
* **Self-Check Mode:** Unlimited free grading fallback when offline or during peak traffic.

### 4. Strict Examiner System Prompt (`temperature: 0.0` + JSON)
* **Zero Halucination / Strict Gatekeeper:** Enforces strict step-marking against the official Marking Scheme PDF data.

---

**Full Changelog:** `v2.6.1...v2.6.2`  
**Live Web & Offline PWA App:** [https://ariyanpal1008.github.io/Quadra12/](https://ariyanpal1008.github.io/Quadra12/)  
**Free Signed Android APK Download:** [GitHub Releases](https://github.com/Ariyanpal1008/Quadra12/releases/latest)  
**Creator:** Ariyan Pal (Keśava Dāsa) · `ariyanpal090@gmail.com`
