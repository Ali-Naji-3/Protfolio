/**
 * Cinema module — the director's-cut layer (10 §rules 1/2/4/9).
 *
 *  COLD OPEN  Two true sentences over black, then the film. Plays once per
 *             session; ANY input (wheel, touch, key, click, scroll) skips
 *             it instantly — a film that traps its audience is a lobby.
 *
 *  SCENE CARDS  Each chapter's opening frame: title rises as the card
 *             enters, ghost numeral drifts on a slower parallax layer
 *             (the camera move), everything falls away as the scene ends
 *             — the cut is a dissolve, never a scroll.
 *
 *  LETTERBOX  Bars breathe in while a scene card or the hero pin holds
 *             the frame, and release when the film hands over control
 *             (rule 8: the demos are where the visitor takes the wheel).
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DURATION, EASE_GSAP } from './tokens';
import { on } from './bus';

const SESSION_KEY = 'an:open-seen';

/* ── letterbox ─────────────────────────────────────────────────── */
let barsEngaged = 0;

function setBars(active: boolean): void {
  /* Adjacent scenes may overlap toggles — count, don't fight. */
  barsEngaged = Math.max(0, barsEngaged + (active ? 1 : -1));
  const bars = document.querySelectorAll<HTMLElement>('[data-letterbox]');
  if (bars.length === 0) return;
  gsap.to(bars, {
    height: barsEngaged > 0 ? 'clamp(40px, 5.5vh, 64px)' : 0,
    duration: DURATION.t5,
    ease: EASE_GSAP.glide,
    overwrite: 'auto',
  });
}

/* ── cold open ─────────────────────────────────────────────────── */
function coldOpen(): void {
  const overlay = document.querySelector<HTMLElement>('[data-cold-open]');
  if (!overlay) return;

  let seen = false;
  try {
    seen = sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    seen = false;
  }
  if (seen) return;

  overlay.hidden = false;
  setBars(true);

  const lines = overlay.querySelectorAll<HTMLElement>('[data-open-line]');
  const tl = gsap.timeline({
    onComplete: () => {
      overlay.hidden = true;
      setBars(false);
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        /* fine — it plays again next load */
      }
    },
  });

  lines.forEach((line, i) => {
    tl.to(line, { opacity: 1, duration: DURATION.t4, ease: EASE_GSAP.drift }, i === 0 ? 0.6 : '>')
      .to(line, { opacity: 0, duration: DURATION.t3, ease: EASE_GSAP.drift }, '>+1.6');
  });
  /* the overlay itself dissolves, revealing the wordmark already on stage */
  tl.to(overlay, { opacity: 0, duration: DURATION.t5, ease: EASE_GSAP.glide }, '>+0.2');

  const skip = () => tl.progress(1);
  (['wheel', 'pointerdown', 'keydown', 'touchstart', 'scroll'] as const).forEach((ev) =>
    window.addEventListener(ev, skip, { once: true, passive: true }),
  );
}

/* ── scene cards ───────────────────────────────────────────────── */
function scenes(): void {
  document.querySelectorAll<HTMLElement>('[data-scene-open]').forEach((scene) => {
    const title = scene.querySelector<HTMLElement>('[data-scene-title]');
    const ghost = scene.querySelector<HTMLElement>('[data-scene-ghost]');

    if (title) {
      /* entrance — the frame settles */
      gsap.fromTo(
        title,
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          ease: EASE_GSAP.glide,
          scrollTrigger: { trigger: scene, start: 'top 75%', end: 'top 25%', scrub: true },
        },
      );
      /* exit — dissolve upward as the next shot arrives */
      gsap.to(title, {
        opacity: 0,
        y: -32,
        ease: EASE_GSAP.drift,
        scrollTrigger: { trigger: scene, start: 'bottom 55%', end: 'bottom 25%', scrub: true },
      });
    }

    if (ghost) {
      /* the camera move: numeral travels slower than the page */
      gsap.fromTo(
        ghost,
        { yPercent: 18 },
        {
          yPercent: -18,
          ease: 'none',
          scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    }

    /* Scene footage inherits the hero's dolly grammar (10 §rule-2): a slow
       scrubbed push-in so scrolling THROUGH the scene reads as moving through
       it, not watching a flat autoplay loop. Purely a camera move — the
       looping backdrop keeps playing underneath. */
    const footage = scene.querySelector<HTMLElement>('[data-scene-footage]');
    if (footage) {
      gsap.fromTo(
        footage,
        { scale: 1.04, transformOrigin: '50% 50%' },
        {
          scale: 1.12,
          ease: 'none',
          scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    }

    ScrollTrigger.create({
      trigger: scene,
      start: 'top 55%',
      end: 'bottom 45%',
      onToggle: (self) => setBars(self.isActive),
    });
  });
}

export function initCinema(): void {
  coldOpen();
  scenes();

  /* the hero pin holds the frame too */
  on('cinema:bars-in', () => setBars(true));
  on('cinema:bars-out', () => setBars(false));
}
