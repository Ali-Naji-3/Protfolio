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
import { scrubVideo } from './video-scrub';

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
function coldOpen(): () => void {
  const noop = (): void => {};
  const overlay = document.querySelector<HTMLElement>('[data-cold-open]');
  if (!overlay) return noop;

  let seen = false;
  try {
    seen = sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    seen = false;
  }
  if (seen) return noop;

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
  const skipEvents = ['wheel', 'pointerdown', 'keydown', 'touchstart', 'scroll'] as const;
  skipEvents.forEach((ev) => window.addEventListener(ev, skip, { once: true, passive: true }));

  return () => {
    tl.kill();
    skipEvents.forEach((ev) => window.removeEventListener(ev, skip));
  };
}

/* ── scene cards ───────────────────────────────────────────────── */
/* Pinned footage scenes hold the frame for a full cinematic beat, same
   contract as the Hero: scroll is the timeline, the section releases only
   after the clip's final frame (delegated to video-scrub.ts). */
const FOOTAGE_PIN_END = '+=170%';

function scenes(): Array<() => void> {
  const teardowns: Array<() => void> = [];

  document.querySelectorAll<HTMLElement>('[data-scene-open]').forEach((scene) => {
    const title = scene.querySelector<HTMLElement>('[data-scene-title]');
    const ghost = scene.querySelector<HTMLElement>('[data-scene-ghost]');
    const footage = scene.querySelector<HTMLVideoElement>('[data-scene-footage]');

    if (footage) {
      if (title) {
        /* rise, hold through the beat, dissolve before the frame releases —
           mapped onto the same pinned range as the footage, not a separate one */
        const tl = gsap.timeline({
          scrollTrigger: { trigger: scene, start: 'top top', end: FOOTAGE_PIN_END, scrub: true },
        });
        tl.fromTo(
          title,
          { opacity: 0, y: 48 },
          { opacity: 1, y: 0, ease: EASE_GSAP.glide, duration: 0.15 },
        )
          .to(title, { opacity: 1, y: 0, duration: 0.55 })
          .to(title, { opacity: 0, y: -32, ease: EASE_GSAP.drift, duration: 0.15 });
        teardowns.push(() => {
          tl.scrollTrigger?.kill();
          tl.kill();
        });
      }

      if (ghost) {
        /* the camera move, same held range as the footage */
        const parallax = gsap.fromTo(
          ghost,
          { yPercent: 18 },
          {
            yPercent: -18,
            ease: 'none',
            scrollTrigger: { trigger: scene, start: 'top top', end: FOOTAGE_PIN_END, scrub: true },
          },
        );
        teardowns.push(() => {
          parallax.scrollTrigger?.kill();
          parallax.kill();
        });
      }

      /* pin is presentation only — video-scrub.ts still initializes,
         preloads and scrubs correctly if pin were ever removed */
      teardowns.push(
        scrubVideo(footage, {
          trigger: scene,
          start: 'top top',
          end: FOOTAGE_PIN_END,
          pin: true,
          anticipatePin: 1,
          onToggle: (active) => setBars(active),
          manageFit: true,
        }),
      );
      return;
    }

    /* placeholder cards (no footage yet): no timeline to scrub, so no pin —
       original in-place scroll grammar */
    if (title) {
      const enter = gsap.fromTo(
        title,
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          ease: EASE_GSAP.glide,
          scrollTrigger: { trigger: scene, start: 'top 75%', end: 'top 25%', scrub: true },
        },
      );
      const exit = gsap.to(title, {
        opacity: 0,
        y: -32,
        ease: EASE_GSAP.drift,
        scrollTrigger: { trigger: scene, start: 'bottom 55%', end: 'bottom 25%', scrub: true },
      });
      teardowns.push(() => {
        enter.scrollTrigger?.kill();
        enter.kill();
        exit.scrollTrigger?.kill();
        exit.kill();
      });
    }

    if (ghost) {
      const parallax = gsap.fromTo(
        ghost,
        { yPercent: 18 },
        {
          yPercent: -18,
          ease: 'none',
          scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
      teardowns.push(() => {
        parallax.scrollTrigger?.kill();
        parallax.kill();
      });
    }

    const letterboxTrigger = ScrollTrigger.create({
      trigger: scene,
      start: 'top 55%',
      end: 'bottom 45%',
      onToggle: (self) => setBars(self.isActive),
    });
    teardowns.push(() => letterboxTrigger.kill());
  });

  return teardowns;
}

/* Stable references: re-subscribing the same fn on repeated initCinema()
   calls (HMR) is a no-op (bus.ts stores handlers in a Set), so this needs
   no unsubscribe path. */
const barsIn = (): void => setBars(true);
const barsOut = (): void => setBars(false);

export function initCinema(): () => void {
  const teardowns = [coldOpen(), ...scenes()];

  /* the hero pin holds the frame too */
  on('cinema:bars-in', barsIn);
  on('cinema:bars-out', barsOut);

  return () => teardowns.forEach((fn) => fn());
}
