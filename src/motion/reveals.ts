/**
 * Reveal choreography (03 §5 — the calm 80%).
 * Any element carrying [data-reveal] enters with the standard rise:
 * opacity 0→1, y 24→0, glide, t4. Groups ([data-reveal-group]) stagger
 * their direct children with s2, capped at STAGGER_MAX_ITEMS (03 §3).
 *
 * Also owns the shared idle breath (IDLE_PERIOD_S) on [data-breathe].
 */
import { gsap } from 'gsap';
import { DURATION, EASE_GSAP, IDLE_PERIOD_S, STAGGER, STAGGER_MAX_ITEMS } from './tokens';

export function initReveals(): void {
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((elem) => {
    gsap.fromTo(
      elem,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: DURATION.t4,
        ease: EASE_GSAP.glide,
        scrollTrigger: { trigger: elem, start: 'top 82%', once: true },
      },
    );
  });

  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    const items = [...group.children].slice(0, STAGGER_MAX_ITEMS);
    if (items.length === 0) return;
    gsap.fromTo(
      items,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: DURATION.t4,
        ease: EASE_GSAP.glide,
        stagger: STAGGER.s2,
        scrollTrigger: { trigger: group, start: 'top 82%', once: true },
      },
    );
  });

  /* One shared breath — all ambient loops cohere on a single phase (03 §3). */
  const breathers = document.querySelectorAll<HTMLElement>('[data-breathe]');
  if (breathers.length > 0) {
    gsap.to(breathers, {
      opacity: 0.35,
      duration: IDLE_PERIOD_S / 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }
}
