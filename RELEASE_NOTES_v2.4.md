# Quadra 12 — v2.4 Official Release Notes

**Tag:** `v2.4`  
**Title:** `Quadra 12 v2.4 — Official Settings, Account-less Cloud Sync (6-Digit + QR) & 3D Study Studio`

## What's New in v2.4

### 1. Official Settings (Clean `☰ → Settings` Flow)
- Streamlined the `☰` three-lines menu (`Overview`, `Subject Tracker`, `Examination Hall`, `12th Hackers`, `Settings`, `About the Creator`, `Help Desk`), removing redundant controls before tapping Settings.
- Organized Settings into 7 clear panels:
  1. **Cloud Sync (No Sign-In Needed):** Cross-device pairing between laptops (6-digit numeric Sync Code) and phones (scannable `?sync=XXXXXX` QR Code) powered by Cloud Firestore (`syncSessions/{syncCode}`), plus Auto-Sync toggle and `.json` offline Export/Restore.
  2. **Audio & Tactile Feedbacks:** Mute/Unmute toggle, 6 interactive Web Audio micro-sound testers, and Light/Dark workspace theme switcher.
  3. **3D Studio:** Interactive Three.js WebGL models with OrbitControls, camera presets, and an Explode Model slider for Physics, Chemistry, Biology, Mathematics, and the Grandmaster Trophy.
  4. **Exam & Urgency:** Custom board exam countdown target date, Official Feb 16 reset, configurable **Urgency Alert Window** (`15 / 30 / 60 / 90 days`), and Daily Chapter Pace toggle.
  5. **Player & Video:** Persistent default 12th Hackers embed mode (`Standard Sync`, `Pure Embed`, `Privacy No-Cookie`) and Auto-Advance Next Lecture switch.
  6. **Privacy & Reset:** Live `localStorage` Quota Meter (`KB / MB` out of `5 MB`), isolated single-subject resets (resets only Physics, Chemistry, Biology, or Math + its exam score), and **Master Reset (Danger Zone)** with a 2-step double-confirmation pop-up.
  7. **About & Links:** `Version 2.4` stamp, creator credit (`AriYan Pal / Keśava Dāsa`), and quick buttons for **Terms & Conditions · 2026** and the **Official GitHub Repository**.

### 2. Bug Fixes & Stability
- Single-subject reset now cleanly removes that subject's Examination Hall best score alongside its completed chapters, checkpoints, and daily log.
- Master Reset immediately resets Exam Countdown, Urgency, and Video Player switches inside Settings with zero stale UI state.
- Dynamic achievement locking/unlocking properly relocks badges if accidental clicks are unchecked.
- Proper WebGL geometry, texture, and `RoomEnvironment` disposal in Three.js 3D Studio modals.
- Full AI assistant & crawler synchronization across `index.html`, `public/llms.txt`, `public/llms-full.txt`, and `README.md`.
