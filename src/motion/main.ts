/**
 * Motion system entry point — the only script the page loads.
 *
 * Boot order matters:
 *  1. GSAP plugins register.
 *  2. Lenis takes over scrolling and drives ScrollTrigger (03 §4.2).
 *  3. Narrative modules initialize over the server-rendered document —
 *     they enhance the story, they never carry it (08 §1).
 *
 * Reduced motion (03 §10 — "first-class edition"): no Lenis, no pin, no
 * scrub, no atmosphere. The document reads top-to-bottom, complete. Only
 * the functional enhancements (demo, audio opt-in, copy-email) remain.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { prefersReducedMotion, SCROLL } from './tokens';
import { initCinema } from './cinema';
import { initHero } from './hero';
import { initDemo } from './demo';
import { initReveals } from './reveals';
import { initProgress } from './progress';
import { initAudio } from './audio';
import { initAtmosphere } from './atmosphere';

function boot(): void {
  /* Functional enhancements — motion preference does not gate function. */
  initDemo();
  initAudio();
  initCopyEmail();

  if (prefersReducedMotion()) return;

  gsap.registerPlugin(ScrollTrigger);

  /* Lenis drives the frame; ScrollTrigger listens (03 §4.2). */
  const lenis = new Lenis({
    duration: SCROLL.desktopLerpDurationS,
    touchMultiplier: 1.2,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  /* Expose for programmatic control (verification harness, debugging).
     Anything that must move the page while Lenis is live goes through it. */
  const debugWindow = window as unknown as {
    lenis?: Lenis;
    ScrollTrigger?: typeof ScrollTrigger;
  };
  debugWindow.lenis = lenis;
  debugWindow.ScrollTrigger = ScrollTrigger;

  /* Native smooth-scroll would fight Lenis for anchor jumps. */
  document.documentElement.style.scrollBehavior = 'auto';
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href')!);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: 0 });
      }
    });
  });

  /* ORDER MATTERS: the hero creates the page's only PIN, and ScrollTrigger
     recalculates in creation order — pin-owning triggers must exist before
     any trigger positioned below the pin, or their offsets go stale. */
  initHero();
  initCinema();
  initReveals();
  initProgress();
  initAtmosphere();

  /* Layout settles (fonts, images) → measurements refresh once. */
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

/** Click-to-copy on the email ledger row (02 §Ch07). */
function initCopyEmail(): void {
  const link = document.querySelector<HTMLAnchorElement>('[data-copy-email]');
  if (!link || !navigator.clipboard) return;
  const email = link.dataset.copyEmail!;
  const original = link.textContent;
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(email).then(() => {
      link.textContent = 'COPIED';
      setTimeout(() => {
        link.textContent = original;
      }, 1200);
    }).catch(() => {
      /* clipboard refused — fall back to the mailto default next click */
      window.location.href = link.href;
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
