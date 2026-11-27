# Quadra 12 v2.6.2 — Release Notes

**Tag:** `v2.6.2`  
**Release Title:** `Quadra 12 v2.6.2 — Server-Side Five-Project Failover, Strict Quota Compliance & Gatekeeper Hardening`

---

## What's New in v2.6.2

### 1. Shared Backend Proxy Serving Website, PWA & Android APK
* **Frontend Configuration (`VITE_PROXY_URL` Only):** Web, PWA (`src/sw.js`), and Android APK builds use only `VITE_PROXY_URL` and carry no Gemini API keys in source code, Vite build variables, browser storage, or compiled assets.
* **Server-Side Secret Boundary (`GEMINI_API_KEYS`):** Five separate Google Cloud project keys (`Project 1` → `Project 5`, or fallback `GEMINI_API_KEY`) are stored exclusively in server-side environment variables, never logged or returned in API payloads, and accessed via origin-allowlisted CORS on `server.ts`.
* **Production Runtime:** `package.json` configures `"start": "tsx server.ts"` with `tsx` in production `dependencies`, paired with `GET /api/health` and `POST /api/exam/grade`.

### 2. Sequential Five-Project Failover & Strict Google Quota Compliance
* **Free-Tier Models Only:** Evaluates subjective papers using free-tier models (`gemini-3.1-flash-lite`, `gemini-4-hydrogen`) with no paid models or paid billing fallback.
* **Temporary Outage Failover (`500` / `502` / `503` / `504` / timeout):** Attempts `Project 1` → `Project 2` → `Project 3` → `Project 4` → `Project 5` sequentially when a temporary upstream outage occurs, applies exponential cooldowns, and recovers back to `Project 1` after reset.
* **HTTP `429 RESOURCE_EXHAUSTED` Compliance:** Respects Google's `retryDelay` / `Retry-After` guidance and stops without switching projects to evade exhausted quotas, activating Self-Check Mode until the quota resets.
* **Authentication Error Isolation (`401` / `403`):** Permanently invalid credentials are disabled for the server process lifetime rather than repeatedly retried, and key details are never exposed.

### 3. 1-Call Batch Grading, Gatekeepers & Deterministic Self-Check Mode
* **Local Section A MCQs:** Graded 100% locally in JavaScript (0 API calls).
* **Gatekeepers:** Canvas blank/blurry photo pre-filtering, deterministic gibberish/symbol-spam disqualification, and strict examiner checks (`temperature: 0.0` where supported) lock invalid inputs—including patterns, textures, fabric, and keyboard mash—at `0 Marks (Red)` with no Self-Check credit.
* **Strict Self-Check Mode Fallback:** Activates only when offline or when Gemini evaluation cannot proceed under quota/service rules. Valid pending answers start at `0` marks (no artificial partial credit), deterministic keyword/final-value checks run locally, manual **Full Marks (Green)**, **Partial Marks (Yellow)**, and **Incorrect (Red)** buttons appear where eligible, and the UI clearly states Gemini AI evaluation was unavailable.

### 4. Backend Deployment & GitHub Workflows
* Host `server.ts` on Render with Build Command `npm install --legacy-peer-deps && npm run build`, Start Command `npm start`, `NODE_ENV=production`, and `GEMINI_API_KEYS` set in server environment variables.
* Configure `VITE_PROXY_URL` (no trailing `/`) in GitHub **Settings → Secrets and variables → Actions**; `.github/workflows/deploy.yml` and `.github/workflows/android-release.yml` preserve all signing and release steps while reading only `VITE_PROXY_URL`.

---

**Full Changelog:** `v2.6.1...v2.6.2`  
**Live Web & Offline PWA App:** [https://ariyanpal1008.github.io/Quadra12/](https://ariyanpal1008.github.io/Quadra12/)  
**Free Signed Android APK Download:** [GitHub Releases](https://github.com/Ariyanpal1008/Quadra12/releases/tag/v2.6.2)  
**Creator:** Ariyan Pal (Keśava Dāsa) · `ariyanpal090@gmail.com`
