import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SCROLL } from './tokens';

export interface ScrubVideoOptions {
  trigger: Element;
  start: string;
  end: string;
  pin?: boolean;
  anticipatePin?: number;
  /** Fires on ScrollTrigger active-state change (e.g. letterbox bars). */
  onToggle?: (active: boolean) => void;
  /** Derive object-fit from decoded video dimensions once metadata loads. */
  manageFit?: boolean;
}

const ASSUMED_FPS = 24;
const FRAME_DELTA_S = 1 / ASSUMED_FPS;
// A scroll-distance lead only buys real buffering *time* if the visitor
// scrolls at a bounded rate. The Hero never shows this gap because its
// trigger's start point sits above the initial scroll position, so it fires
// at parse time — before any scrolling — and gets the cold-open + reaction
// time as a free head start. Deeper scenes get no such head start, so the
// lead must be generous in scroll distance to survive a fast wheel/trackpad
// flick on a cold connection. One token, applied uniformly to every footage
// scene — not a per-scene tune.
const PRELOAD_LEAD_START = 'top bottom+=350%';

/** Landscape fills the frame (cover); portrait shows the full frame (contain) — never crop, never distort. */
export function computeObjectFit(width: number, height: number): 'cover' | 'contain' {
  return width >= height ? 'cover' : 'contain';
}

const isCoarsePointer = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

/** Module-scoped: only one video may hold the seek lock at a time (hard invariant, not a geometry assumption). */
let activeVideo: HTMLVideoElement | null = null;

/**
 * Single source of truth for scroll-driven video playback (extracted from the Hero).
 * Owns: currentTime updates, ScrollTrigger creation, seek coalescing, metadata gating,
 * lazy preload, active-video gating, runtime object-fit, and cleanup.
 */
export function scrubVideo(video: HTMLVideoElement, opts: ScrubVideoOptions): () => void {
  video.pause();
  video.autoplay = false;
  video.loop = false;

  let target = 0;
  let metadataReady =
    video.readyState >= 1 && Number.isFinite(video.duration) && video.duration > 0;

  // object-position stays permanently centered via CSS; only object-fit varies here.
  const applyFit = (): void => {
    if (!opts.manageFit || !video.videoWidth || !video.videoHeight) return;
    video.style.objectFit = computeObjectFit(video.videoWidth, video.videoHeight);
  };

  // video.seeking is the native in-flight flag — no shadow boolean to keep in sync.
  const seekTo = (time: number): void => {
    if (!Number.isFinite(time)) return;
    target = time;
    if (video.seeking) return;
    if (Math.abs(video.currentTime - target) < FRAME_DELTA_S) return;
    video.currentTime = target;
  };

  const onSeeked = (): void => {
    if (Math.abs(video.currentTime - target) >= FRAME_DELTA_S) {
      video.currentTime = target;
    }
  };

  const onLoadedMetadata = (): void => {
    metadataReady = Number.isFinite(video.duration) && video.duration > 0;
    video.pause();
    applyFit();
    ScrollTrigger.refresh();
  };

  video.addEventListener('seeked', onSeeked);
  // Not { once: true }: video.load() (preload trigger below) resets duration
  // to NaN until this fires again — metadataReady must track that reset.
  video.addEventListener('loadedmetadata', onLoadedMetadata);
  if (metadataReady) applyFit();

  const scrubSmoothing = isCoarsePointer()
    ? SCROLL.touchScrubSmoothingS
    : SCROLL.renderCatchupS;

  const trigger = ScrollTrigger.create({
    trigger: opts.trigger,
    start: opts.start,
    end: opts.end,
    pin: opts.pin,
    anticipatePin: opts.anticipatePin,
    scrub: scrubSmoothing,
    onToggle: (self) => {
      if (!self.isActive && activeVideo === video) activeVideo = null;
      opts.onToggle?.(self.isActive);
    },
    onUpdate: (self) => {
      if (!metadataReady) return;
      // self.progress still fires onUpdate outside the active window (clamped
      // 0/1); without this guard a trigger that was never actually entered —
      // e.g. jumped over by a deep-link or refresh landing past it — can
      // claim the lock once and never release it, since onToggle only fires
      // on a genuine isActive transition.
      if (!self.isActive) return;
      if (activeVideo && activeVideo !== video) return;
      activeVideo = video;
      seekTo(self.progress * video.duration);
    },
    // isActive is already false by the time onLeave/onLeaveBack fire, so a
    // fast scroll that lands past the boundary in one step would otherwise
    // skip the final onUpdate — these guarantee the scene actually reaches
    // its final frame (or frame zero, scrolling up) before it releases.
    onLeave: () => seekTo(video.duration),
    onLeaveBack: () => seekTo(0),
  });

  const preloadTrigger = ScrollTrigger.create({
    trigger: opts.trigger,
    start: PRELOAD_LEAD_START,
    once: true,
    onEnter: () => {
      video.preload = 'auto';
      // Only reload if metadata is genuinely missing — load() resets the
      // element (duration goes NaN) and re-opens the race window we're
      // trying to close, so skip it when readyState already has metadata.
      if (video.readyState < 1) {
        metadataReady = false;
        video.load();
      } else {
        /**
         * ── PIPELINE WAKEUP (MICRO-SEEK) ─────────────────────────────────────
         * Why it exists:
         * Under standard browser behavior (especially WebKit/Safari/iOS), when a
         * video is initially rendered with preload="metadata", the browser loads
         * the metadata and suspends the pipeline immediately. Setting preload="auto"
         * dynamically later is typically ignored as an inactive hint.
         *
         * How it works:
         * To force the browser to resume fetching and prime the decode pipeline before
         * the user visually enters the scene, we execute a micro-seek to 0.001 seconds.
         * This forces the media pipeline to fetch the initial byte range from Vercel
         * via HTTP 206, and places the decoded first frame directly into hot memory.
         *
         * Ownership contract:
         * - This is NOT a user-visible seek; it is a one-time pipeline initialization.
         * - Because the preloadTrigger fires far upstream (top bottom+=350%) and runs
         *   exactly once (once: true), the active scrub Trigger is guaranteed to be
         *   inactive (self.isActive === false). Playback control remains completely
         *   undisputed. Modern scrub coordinates overwrite currentTime instantly 
         *   upon entering the viewport.
         * - Future maintainers: DO NOT remove this. It prevents the white/black frame
         *   Vercel loading delay on deep scroll entries.
         *
         * Timing selection:
         * We use setTimeout(wakeup, 0) to push this seek to the end of the current
         * event loop queue. Waking up the media element starts network I/O and hardware
         * decoding overhead. By using setTimeout instead of requestAnimationFrame (which
         * executes during visual rendering pipeline phases) or queueMicrotask (which
         * runs prior to paints), we prevent main-thread layout/scroll stutter.
         */
        const wakeup = () => {
          if (video.currentTime === 0) {
            video.currentTime = 0.001;
          }
        };
        setTimeout(wakeup, 0);
      }
    },
  });

  return function teardown(): void {
    trigger.kill();
    preloadTrigger.kill();
    video.removeEventListener('seeked', onSeeked);
    video.removeEventListener('loadedmetadata', onLoadedMetadata);
    if (activeVideo === video) activeVideo = null;
  };
}
