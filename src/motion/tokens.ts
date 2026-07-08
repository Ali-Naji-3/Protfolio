/**
 * Motion tokens — 1:1 translation of docs/production/03-motion-bible.md §2–§3.
 * The five named curves and the fixed duration scale are the ONLY values
 * animation code may use. Additions require Producer sign-off (03 §11).
 *
 * CSS mirror lives in src/styles/tokens.css — keep both in sync.
 */

/** The five canonical easing curves (03 §2). GSAP-compatible cubic-beziers. */
export const EASE = {
  /** Long, luxurious deceleration — entrances, settles, 80% of everything. */
  glide: [0.16, 1, 0.3, 1],
  /** Gentle in, soft out — cross-fades, opacity, ambient shifts. */
  drift: [0.33, 0, 0.15, 1],
  /** Confident acceleration → clean stop — line draws, data pulses. */
  current: [0.65, 0, 0.15, 1],
  /** Explosive start, hard-braked landing — EPIC beats ONLY. */
  strike: [0.85, 0, 0.1, 1],
} as const satisfies Record<string, readonly [number, number, number, number]>;

/** CSS custom-easing strings for the same curves. */
export const EASE_CSS = Object.fromEntries(
  Object.entries(EASE).map(([name, pts]) => [name, `cubic-bezier(${pts.join(', ')})`]),
) as Record<keyof typeof EASE, string>;

/** GSAP ease strings for the same curves. */
export const EASE_GSAP = Object.fromEntries(
  Object.entries(EASE).map(([name, pts]) => [name, `cubic-bezier(${pts.join(',')})`]),
) as Record<keyof typeof EASE, string>;

/** Fixed duration scale in seconds (03 §3). t6 is the absolute ceiling. */
export const DURATION = {
  t1: 0.15, // micro feedback
  t2: 0.25, // small transitions
  t3: 0.4, // standard entrance/exit
  t4: 0.65, // large element / text block
  t5: 1.0, // scene transitions, chapter cards
  t6: 1.2, // CEILING — EPIC beats only
} as const;

/** Stagger tokens in seconds; groups cap at STAGGER_MAX_ITEMS (03 §3). */
export const STAGGER = { s1: 0.04, s2: 0.08, s3: 0.12 } as const;
export const STAGGER_MAX_ITEMS = 8;

/** All idle/breathing loops share one phase so ambient motion coheres. */
export const IDLE_PERIOD_S = 6;

/** Lenis smoothing targets (03 §4.2). */
export const SCROLL = {
  desktopLerpDurationS: 1.1,
  touchScrubSmoothingS: 0.3,
  renderCatchupS: 0.5,
} as const;

/** Returns true when the visitor prefers reduced motion (03 §10). */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
