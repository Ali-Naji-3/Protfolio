/**
 * Hero scrub controller (02 §Ch01, 03 §5 — the film's first EPIC beat).
 *
 * Pins the Anomaly and scrubs the dramatization over ~2.5 viewports:
 *   act 1  ORDER A reads stock=1, commits, confirms      (calm, current)
 *   act 2  ORDER B does the same — the race is now real  (calm, current)
 *   act 3  both commits land → stock 1 → −1, one flash   (EPIC, strike)
 *   act 4  the reveal line, then the hold line           (calm, glide)
 *
 * VIDEO MODE (M7): if [data-hero-video] exists, the same ScrollTrigger
 * scrubs video.currentTime instead of the SVG timeline. Component markup
 * and this controller need no changes — only assets.ts.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DURATION, EASE_GSAP } from './tokens';
import { emit } from './bus';

const q = <T extends Element>(root: Element, sel: string): T | null =>
  root.querySelector<T>(sel);

export function initHero(): void {
  const mount = document.querySelector<HTMLElement>('[data-hero-mount]');
  const section = document.querySelector<HTMLElement>('#anomaly');
  if (!mount || !section) return;

  const video = q<HTMLVideoElement>(mount, '[data-hero-video]');
  if (video) {
    initVideoScrub(section, video);
    return;
  }

  const system = q<SVGSVGElement>(mount, '[data-hero-system]');
  if (!system) return;

  const part = (name: string) => q<SVGElement>(system, `[data-h="${name}"]`);
  const pathA = part('pathA');
  const pathB = part('pathB');
  const checkA = part('checkA');
  const checkB = part('checkB');
  const readA = part('readA');
  const readB = part('readB');
  const stockValue = part('stockValue');
  const stockCell = part('stockCell');
  const flash = part('flash');
  const reveal = q<HTMLElement>(mount, '[data-hero-reveal]');
  const hold = q<HTMLElement>(mount, '[data-hero-hold]');
  const cue = q<HTMLElement>(mount, '[data-hero-cue]');
  if (!pathA || !pathB || !stockValue || !flash) return;

  /* Rewind to frame zero (server-rendered state is the FINAL frame). */
  gsap.set([pathA, pathB], { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set([checkA, checkB], { opacity: 0 });
  gsap.set([reveal, hold], { opacity: 0, y: 24 });
  stockValue.textContent = '1';
  stockValue.classList.remove('hero__value--fault');
  stockValue.setAttribute('fill', 'var(--text-0)');

  const tl = gsap.timeline({
    defaults: { ease: EASE_GSAP.current },
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=250%',
      pin: true,
      scrub: true,
      anticipatePin: 1,
      /* the pinned stage is a held frame — letterbox engages (10 §4) */
      onToggle: (self) => emit(self.isActive ? 'cinema:bars-in' : 'cinema:bars-out'),
    },
  });

  /* Camera language (10 §rule-2): a slow dolly push-in across the scrub. */
  tl.fromTo(
    system,
    { scale: 1, transformOrigin: '50% 50%' },
    { scale: 1.05, ease: 'none', duration: 3.6 },
    0,
  );

  /* act 1 — ORDER A (0 → 0.2) */
  tl.to(readA, { opacity: 1, duration: DURATION.t2 }, 0)
    .to(pathA, { strokeDashoffset: 0, duration: DURATION.t4 }, 0.05)
    .to(checkA, { opacity: 1, duration: DURATION.t2 }, '>-0.1');

  /* act 2 — ORDER B (0.2 → 0.4): the race becomes real */
  tl.to(readB, { opacity: 1, duration: DURATION.t2 }, 0.9)
    .to(pathB, { strokeDashoffset: 0, duration: DURATION.t4 }, 0.95)
    .to(checkB, { opacity: 1, duration: DURATION.t2 }, '>-0.1');

  /* act 3 — the fault (EPIC beat: strike ease, single flash, ≤ t6) */
  tl.to(stockValue, {
    duration: DURATION.t2,
    ease: EASE_GSAP.strike,
    onStart: () => {
      stockValue.textContent = '-1';
      stockValue.setAttribute('fill', 'var(--warn-1)');
      stockCell?.setAttribute('stroke', 'var(--warn-1)');
      emit('hero:fault');
    },
    onReverseComplete: () => {
      stockValue.textContent = '1';
      stockValue.setAttribute('fill', 'var(--text-0)');
      stockCell?.setAttribute('stroke', 'var(--line-1)');
    },
  }, 1.9)
    .to(flash, { opacity: 0.12, duration: DURATION.t1, ease: EASE_GSAP.strike }, 1.9)
    .to(flash, { opacity: 0, duration: DURATION.t4, ease: EASE_GSAP.drift }, '>');

  /* act 4 — language arrives only after the image has spoken (01 §5) */
  tl.to(reveal, { opacity: 1, y: 0, duration: DURATION.t4, ease: EASE_GSAP.glide }, 2.6)
    .to(hold, { opacity: 1, y: 0, duration: DURATION.t4, ease: EASE_GSAP.glide }, 3.1);

  /* The cue breathes until the visitor commits to the scroll. */
  if (cue) {
    gsap.to(cue, {
      opacity: 0.4,
      duration: 3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    ScrollTrigger.create({
      trigger: section,
      start: 'top top-=1',
      onEnter: () => gsap.to(cue, { autoAlpha: 0, duration: DURATION.t2, overwrite: 'auto' }),
      onLeaveBack: () => gsap.to(cue, { autoAlpha: 1, duration: DURATION.t3, overwrite: 'auto' }),
    });
  }
}

/**
 * Video hero: scrub the MP4's currentTime with the same pin the SVG hero
 * used. The pin + letterbox are created immediately so the held frame and
 * scene grammar behave identically whether or not metadata has loaded yet;
 * currentTime scrubbing engages once the duration is known. Requires a
 * keyframe-dense encode (05 §3.2) for smooth seeking.
 */
function initVideoScrub(section: HTMLElement, video: HTMLVideoElement): void {
  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: '+=250%',
    pin: true,
    scrub: true,
    anticipatePin: 1,
    /* held frame → letterbox engages, same as the SVG hero (10 §4) */
    onToggle: (self) => emit(self.isActive ? 'cinema:bars-in' : 'cinema:bars-out'),
    onUpdate: (self) => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        video.currentTime = self.progress * video.duration;
      }
    },
  });

  /* When metadata arrives after first paint, refresh so the pin measures
     against the settled layout. */
  video.addEventListener(
    'loadedmetadata',
    () => ScrollTrigger.refresh(),
    { once: true },
  );
}
