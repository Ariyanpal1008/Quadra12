/**
 * Lightweight, zero-dependency Web Audio API sound synthesizer for Quadra 12.
 * Synthesizes Apple-style subtle, tactile micro-interactions on the fly.
 * No external .mp3 files required.
 */

const STORAGE_MUTE_KEY = 'pcmb_desk_sound_muted_v1';

let audioCtx: AudioContext | null = null;
let isMutedState = false;

// Initialize mute state from localStorage
try {
  const saved = window.localStorage.getItem(STORAGE_MUTE_KEY);
  isMutedState = saved === 'true';
} catch {
  isMutedState = false;
}

/**
 * Returns or creates the shared AudioContext, ensuring browser autoplay policy is satisfied.
 */
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  try {
    if (!audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as {webkitAudioContext: typeof AudioContext}).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }

    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {
        // Autoplay policy prevented immediate resume; will resume on next user gesture
      });
    }

    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Call on any user gesture to unlock AudioContext
 */
export function unlockAudioContext(): void {
  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  } catch {
    // Ignore unlock errors
  }
}

export function isSoundMuted(): boolean {
  return isMutedState;
}

export function setSoundMuted(muted: boolean): void {
  isMutedState = muted;
  try {
    window.localStorage.setItem(STORAGE_MUTE_KEY, String(muted));
  } catch {
    // Ignore storage errors
  }
}

export function toggleSoundMuted(): boolean {
  const next = !isMutedState;
  setSoundMuted(next);
  if (!next) {
    // Play a friendly soft confirmation pop when unmuting
    playCheckSound(true);
  }
  return next;
}

/**
 * Tactile pop on checking (~60ms, 580Hz -> 160Hz)
 * Softer reverse tick on unchecking (~45ms, 220Hz -> 320Hz)
 */
export function playCheckSound(checked: boolean): void {
  if (isMutedState) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (checked) {
      // Crisp, tactile pop: rapid pitch sweep down
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(560, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.055);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.065);
    } else {
      // Softer reverse tick
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch {
    // Graceful fallback if Web Audio fails
  }
}

/**
 * Subtle mechanical switch click (~40ms) for Theme Switch
 */
export function playThemeSwitchSound(isDark: boolean): void {
  if (isMutedState) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Two rapid mini-pulses simulating physical mechanical click
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(isDark ? 880 : 1050, now);
    osc1.frequency.exponentialRampToValueAtTime(350, now + 0.02);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(isDark ? 550 : 700, now + 0.015);
    osc2.frequency.exponentialRampToValueAtTime(200, now + 0.038);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.042);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.025);

    osc2.start(now + 0.015);
    osc2.stop(now + 0.042);
  } catch {
    // Fallback
  }
}

/**
 * Soft muted tap sound when selecting an OMR bubble option
 */
export function playOmrBubbleSound(): void {
  if (isMutedState) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(130, now + 0.045);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.055);
  } catch {
    // Fallback
  }
}

/**
 * Warm, two-note harmonic chime (C5: ~523Hz -> G5: ~784Hz, soft decay ~300ms)
 * Triggered on Achievement Unlocked and 100% Subject Mastery
 */
export function playAchievementChime(): void {
  if (isMutedState) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Note 1: C5 (523.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now);

    gain1.gain.setValueAtTime(0.11, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.29);

    // Note 2: G5 (783.99 Hz) with gentle harmonic shimmer
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(783.99, now + 0.08);

    gain2.gain.setValueAtTime(0.12, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.39);
  } catch {
    // Fallback
  }
}

export function playMasteryChime(): void {
  // Same warm celebration harmonic chime
  playAchievementChime();
}

/**
 * Gentle, non-jarring bell chime when the 3-hour exam countdown reaches 00:00:00
 */
export function playExamCompletionChime(): void {
  if (isMutedState) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Gentle multi-tone bell (D5: 587.3Hz + A5: 880Hz + D6: 1174.6Hz)
    const freqs = [587.33, 880.0, 1174.66];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      const peakGain = 0.12 / (idx + 1);
      gain.gain.setValueAtTime(peakGain, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75 + idx * 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.04);
      osc.stop(now + 0.85 + idx * 0.1);
    });
  } catch {
    // Fallback
  }
}
