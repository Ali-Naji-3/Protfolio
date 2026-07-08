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
const PRELOAD_LEAD_START = 'top bottom+=80%';

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
