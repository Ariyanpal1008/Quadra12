# Quadra 12 v3.1 — Official CBSE 2027 Date Sheet Countdown, Landscape Lecture Player & PCMB Workspace

**Tag:** `v3.1`  
**Release Title:** `Quadra 12 v3.1 — Official CBSE 2027 Date Sheet Countdown, Landscape Full-Screen Player & Deterministic OMR Hall`

---

## What's New in v3.1

### 1. Official CBSE 2027 Date Sheet Countdown on Overview (IST Sync & Auto-Expiry)
* **Live 8-Subject Board Exam Progression:** Synchronizes the Overview Board Countdown Clock in IST (`UTC+05:30`) across all 8 official 2027 CBSE dates — starting with **Physics (`042`) on 16 Feb 2027** through **Web Application (`803`) on 9 Apr 2027** — automatically advancing to the next upcoming subject once each exam ends.
* **Interactive 2027 Date Sheet Modal (`View 2027 Date Sheet`):** Displays all 8 official exams with live IST status badges: **`X Days Left`** (upcoming), **`Exam Today`** (highlighted on exam day), and **`✓ Completed`** (green checkmark with subtle row dimming & strikethrough after exam end time).
* **Automatic Post-Board Clean-Up:** Automatically hides the Overview countdown card and 2027 Date Sheet button (`display: none`) once the final exam (**Web Application** on 9 April 2027 at 01:30 PM IST) finishes. (Examination Hall remains strictly untouched for internal Quadra 12 practice exams.)

### 2. Forced Landscape Full-Screen in "12th Hackers" Video Player
* **Custom Full-Screen Landscape Lock:** Appends `fs=0` to every YouTube embed inside 12th Hackers (`Standard`, `Pure Embed`, `No-Cookie`, and fallback playlist embeds), hides YouTube's built-in fullscreen button, and renders a themed bottom-right **`Full Screen`** control (`#231f1e` / `#f8f5f0`) that locks mobile orientation to `'landscape'` inside a `try...catch` block and automatically unlocks orientation upon exit — even when system Auto-Rotate is turned off.

### 3. Complete PCMB Study Libraries, 720-Q Exam Bank & Deterministic OMR Hall (`v3.1`)
* **50 Chapter Study Libraries & 94 Diagrams:** Separated **Formula Sheet**, **Derivation Sheet**, **Diagrams & Graphs**, and **Practice Qs** tabs alongside full-subject printable sheets and **720 verified MCQs** (`180` per PCMB subject).
* **Governed Deterministic OMR & Offline A4 PDFs:** Human-approved `Published` papers (`+4/−1` & `+1/0`), live key stripping, unconditional result & PDF access even at `0` marks, Settings → Exam & Paper Audit, multi-student profile isolation, and non-destructive preservation of all **17 legacy v2.6.2 keys**.
* **Web, Offline PWA & Signed Android APK:** Updated Workbox SW (`quadra12-v3.1-*`), Express `GET /api/health` (`version: '3.1'`), and permanent Android keystore signing (`versionCode = 3100 + GITHUB_RUN_NUMBER`).

---

**Full Release Notes:** See [`RELEASE_NOTES_v3.1.md`](RELEASE_NOTES_v3.1.md) *(Historical v2.6.2 notes preserved at [`RELEASE_NOTES_v2.6.2.md`](RELEASE_NOTES_v2.6.2.md))*  
**Live Web & Offline PWA App:** [https://ariyanpal1008.github.io/Quadra12/](https://ariyanpal1008.github.io/Quadra12/)  
**Free Signed Android APK Download:** [GitHub Releases](https://github.com/Ariyanpal1008/Quadra12/releases/tag/v3.1)  
**Creator:** AriYan Pal (Keśava Dāsa) · `ariyanpal090@gmail.com`
