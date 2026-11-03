"use client";

let audioCtx: AudioContext | null = null;
let lastPlayTime = 0;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Authentic 1994 Retro PC Mechanical Click Synthesizer.
 * Emulates the tactile mechanical microswitch of a vintage IBM/Mac mouse.
 */
export function playRetroClick(variant: "click" | "soft" | "beep" = "click") {
  const nowMs = Date.now();
  if (nowMs - lastPlayTime < 18) return; // Prevent double trigger
  lastPlayTime = nowMs;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const t = ctx.currentTime;

    // 1. Sharp mechanical microswitch impulse (high transient snap)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Subtle pitch jitter (+-4%) for organic tactile variance
    const pitchJitter = (Math.random() - 0.5) * 140;
    const startFreq = 1800 + pitchJitter;

    osc.type = "square";
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(340, t + 0.022);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(2400 + pitchJitter, t);
    filter.Q.setValueAtTime(3.2, t);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.026);

    // 2. Plastic mouse/keyboard chassis body thump (low resonance)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = "triangle";
    subOsc.frequency.setValueAtTime(160, t);
    subOsc.frequency.exponentialRampToValueAtTime(45, t + 0.032);

    subGain.gain.setValueAtTime(0.14, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);

    subOsc.start(t);
    subOsc.stop(t + 0.036);
  } catch {
    // Ignore audio permission/context errors gracefully
  }
}

