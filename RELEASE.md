# Quadra 12 v2.6.2 — Server-Side Five-Project Gemini Failover & Grading Gatekeeper

**Tag:** `v2.6.2`  
**Release Title:** `Quadra 12 v2.6.2 — Server-Side Five-Project Failover, Strict Quota Compliance & Gatekeeper Hardening`

---

## What's New in v2.6.2

### 1. Shared Backend Architecture (Website + Offline PWA + Android APK)
* **Frontend (`VITE_PROXY_URL` Only):** Web, PWA, and Android APK builds contain zero Gemini API keys and use only `VITE_PROXY_URL` to reach the shared Express backend (`server.ts`). Never place Gemini API keys in `VITE_*` variables, browser storage, APK assets, or GitHub Pages builds.
* **Server-Side Keys (`GEMINI_API_KEYS`):** Up to five separate Google Cloud project keys (`Project 1` → `Project 5`) or fallback `GEMINI_API_KEY` are read solely from backend environment variables, never logged or returned in API responses, and protected by origin-allowlisted CORS (`https://localhost`, `capacitor://localhost`, `https://ariyanpal1008.github.io`, `APP_URL`, `ALLOWED_ORIGINS`).
* **Production Startup:** Uses `"start": "tsx server.ts"` with `tsx` installed in production `dependencies` plus `GET /api/health` for deployment readiness checks.

### 2. Five-Project Sequential Failover & Strict Quota Compliance
* **Free-Tier Models Only:** Uses `gemini-3.1-flash-lite` and `gemini-4-hydrogen` (no paid billing or paid models).
* **Temporary Service Errors (`500` / `502` / `503` / `504` / timeout):** Fails over sequentially (`Project 1` → `Project 2` → `Project 3` → `Project 4` → `Project 5`) with exponential backoff and resumes automatically from `Project 1` once cooldowns expire.
* **HTTP `429 RESOURCE_EXHAUSTED` Quota Compliance:** Honors Google's `retryDelay` / `Retry-After` window on the affected project and stops immediately without rotating across remaining projects to evade quotas, triggering Self-Check Mode until the quota window resets.
* **Invalid Credentials (`401` / `403`):** Distinguishes credential rejections from transient outages and disables invalid keys for the server process lifetime without repeatedly retrying them or exposing secret details.

### 3. Deterministic Self-Check Mode & Gatekeepers
* **Strict Activation:** Triggers **only** when the device is offline or when Gemini evaluation cannot proceed under the implemented quota/service-failure rules—never during normal online AI grading.
* **Zero Artificial Credit & Honest Disclosure:** Pending Self-Check answers start at `0` marks (never automatic partial credit), provide manual **Full Marks (Green)**, **Partial Marks (Yellow)**, and **Incorrect (Red)** buttons where eligible, perform local deterministic validation/keyword comparison, and clearly inform students that Gemini AI evaluation was unavailable.
* **Pattern, Texture & Symbol-Spam Gatekeeper:** Local HTML5 Canvas blank/blur pre-filter, deterministic gibberish/symbol-spam filter, and strict examiner rules (`temperature: 0.0` on supported models) lock invalid submissions at `0 Marks (Red)`.

### 4. Backend Deployment & GitHub Actions Setup
1. Deploy `server.ts` on Render (or equivalent Node host) with Build Command `npm install --legacy-peer-deps && npm run build`, Start Command `npm start`, `NODE_ENV=production`, and `GEMINI_API_KEYS=key1,key2,key3,key4,key5`.
2. Add `VITE_PROXY_URL` (deployed backend URL, no trailing `/`) in GitHub **Settings → Secrets and variables → Actions** for both `.github/workflows/deploy.yml` and `.github/workflows/android-release.yml`.

---

**Full Changelog:** `v2.6.1...v2.6.2`  
**Live Web & Offline PWA App:** [https://ariyanpal1008.github.io/Quadra12/](https://ariyanpal1008.github.io/Quadra12/)  
**Free Signed Android APK Download:** [GitHub Releases](https://github.com/Ariyanpal1008/Quadra12/releases/tag/v2.6.2)  
**Creator:** Ariyan Pal (Keśava Dāsa) · `ariyanpal090@gmail.com`
