/**
 * Audio architecture (06 — "Less, but unforgettable").
 *
 * CONTRACT (06 §2): sound is OFF by default, always. It starts only from an
 * explicit visitor gesture ("[ Enable ]" or the chrome toggle), persists the
 * choice, and degrades to silence with zero errors when unavailable.
 *
 * Phase-1 kit: four precision sounds SYNTHESIZED with Web Audio — no files,
 * no credits, no network. M7 may replace synthesis with designed samples by
 * routing `play()` through the asset manager; the public surface
 * (enable/disable/play) is stable.
 *
 *   hum      — the system's room tone (two detuned low sines, barely there)
 *   confirm  — precise tick: sound just turned on / a safe path resolved
 *   strike   — the fault: a dry, low thud (hero + demo fault beats)
 *   resolve  — the correction landing: clean, short, certain
 */
import { on } from './bus';

const STORAGE_KEY = 'an:sound';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let humNodes: { osc: OscillatorNode[]; gain: GainNode } | null = null;
let enabled = false;

function ensureContext(): boolean {
  if (ctx) return true;
  try {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
    return true;
  } catch {
    return false; /* no audio available — silence, no errors (06 §2) */
  }
}

function startHum(): void {
  if (!ctx || !master || humNodes) return;
  const gain = ctx.createGain();
  gain.gain.value = 0;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 160;
  const oscs = [55, 55.7].map((freq) => {
    const osc = ctx!.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(filter);
    osc.start();
    return osc;
  });
  filter.connect(gain);
  gain.connect(master);
  /* fade the room tone in over ~2s — presence, not announcement */
  gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2);
  humNodes = { osc: oscs, gain };
}

function stopHum(): void {
  if (!ctx || !humNodes) return;
  const { osc, gain } = humNodes;
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
  const stopAt = ctx.currentTime + 0.5;
  osc.forEach((o) => o.stop(stopAt));
  humNodes = null;
}

/** Short enveloped tone — the building block of the precision kit. */
function tone(freq: number, durS: number, peak: number, type: OscillatorType = 'sine'): void {
  if (!enabled || !ctx || !master) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(peak, ctx.currentTime + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durS);
  osc.connect(gain);
  gain.connect(master);
  osc.start();
  osc.stop(ctx.currentTime + durS + 0.05);
}

const kit = {
  confirm(): void {
    tone(1320, 0.12, 0.12);
  },
  strike(): void {
    /* dry, low, singular — the wound, not an explosion (06 §4) */
    tone(72, 0.5, 0.4);
    tone(50, 0.7, 0.3, 'triangle');
  },
  resolve(): void {
    tone(880, 0.18, 0.14);
    setTimeout(() => tone(1320, 0.22, 0.1), 90);
  },
};

function setEnabled(next: boolean, opts: { persist?: boolean } = {}): void {
  enabled = next && ensureContext();
  if (enabled && ctx?.state === 'suspended') void ctx.resume();
  if (enabled) {
    startHum();
    kit.confirm();
  } else {
    stopHum();
  }
  if (opts.persist !== false) {
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off');
    } catch {
      /* private mode etc. — the choice just doesn't persist */
    }
  }
  syncUi();
}

function syncUi(): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-sound-toggle]');
  if (toggle) {
    toggle.hidden = false;
    toggle.setAttribute('aria-pressed', String(enabled));
    toggle.textContent = enabled ? 'Sound · On' : 'Sound · Off';
  }
  const invitation = document.querySelector<HTMLElement>('[data-sound-invitation]');
  if (invitation) invitation.hidden = enabled;
}

export function initAudio(): void {
  if (typeof AudioContext === 'undefined') return; /* keep everything hidden */

  const invitation = document.querySelector<HTMLElement>('[data-sound-invitation]');
  if (invitation) invitation.hidden = false;

  document
    .querySelector<HTMLButtonElement>('[data-sound-enable]')
    ?.addEventListener('click', () => setEnabled(true));

  document.querySelector<HTMLButtonElement>('[data-sound-toggle]')?.addEventListener('click', () => {
    setEnabled(!enabled);
  });

  /* Returning visitor who opted in: restore on their FIRST gesture — the
     browser requires one, and the stored choice makes it consent. */
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch {
    stored = null;
  }
  if (stored === 'on') {
    const resume = () => setEnabled(true, { persist: false });
    window.addEventListener('pointerdown', resume, { once: true });
    window.addEventListener('keydown', resume, { once: true });
  }

  /* Narrative hooks — the fault has a sound; so does the correction. */
  on('hero:fault', () => kit.strike());
  on('demo:fault', () => kit.strike());
  on('demo:safe', () => kit.resolve());

  syncUi();
}
