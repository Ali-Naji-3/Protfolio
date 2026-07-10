import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SCROLL } from './tokens';

/**
 * ── MILESTONE 0 — TEMPORARY RUNTIME INSTRUMENTATION ─────────────────────────
 * Proves or disproves the production-freeze RCA (buffer starvation on random-
 * access seek, video.load() resource-restart, metadataReady gate dropping
 * updates while pinned). Opt-in only (?scrubdebug=1) — zero listeners, zero
 * console output, zero branching cost in the hot path when disabled.
 * Fully removable: delete this block + every `scrubLog(...)` call site once
 * the RCA is confirmed or revised (see plan §Milestone 0).
 */
const SCRUB_DEBUG =
  typeof window !== 'undefined' &&
  (window.location.search.includes('scrubdebug') ||
    (window as unknown as { __SCRUB_DEBUG?: boolean }).__SCRUB_DEBUG === true);

interface ScrubLogEntry {
  t: number;
  event: string;
  [key: string]: unknown;
}

const videoDebugId = (video: HTMLVideoElement): string => {
  const src = video.currentSrc || video.src || 'unknown';
  return (src.split('/').pop() || 'unknown').replace(/\.[^.]+$/, '');
};

const bufferedRanges = (video: HTMLVideoElement): Array<[number, number]> => {
  const ranges: Array<[number, number]> = [];
  for (let i = 0; i < video.buffered.length; i++) {
    ranges.push([video.buffered.start(i), video.buffered.end(i)]);
  }
  return ranges;
};

const isTimeBuffered = (video: HTMLVideoElement, time: number): boolean => {
  for (let i = 0; i < video.buffered.length; i++) {
    if (time >= video.buffered.start(i) && time <= video.buffered.end(i)) return true;
  }
  return false;
};

const scrubLog = (video: HTMLVideoElement, event: string, extra?: Record<string, unknown>): void => {
  if (!SCRUB_DEBUG) return;
  const id = videoDebugId(video);
  const w = window as unknown as { __scrubLog?: Record<string, ScrubLogEntry[]> };
  w.__scrubLog ??= {};
  w.__scrubLog[id] ??= [];
  const entry: ScrubLogEntry = {
    t: performance.now(),
    event,
    currentTime: video.currentTime,
    readyState: video.readyState,
    networkState: video.networkState,
    buffered: bufferedRanges(video),
    ...extra,
  };
  w.__scrubLog[id].push(entry);
  // eslint-disable-next-line no-console -- gated debug instrumentation, removed with this block
  console.debug(`[scrub:${id}]`, event, entry);
};
/* ── END MILESTONE 0 SETUP (usage is threaded through scrubVideo below) ──── */

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

  // MILESTONE 0: `trigger` is assigned after ScrollTrigger.create() below, but
  // onLoadedMetadata (async callback) always runs after this closure returns,
  // so the reference is populated by the time it reads it. Read-only — does
  // not change playback behavior, only lets the log answer "did metadata
  // arrive before or after the scene was pinned/active".
  let trigger: ScrollTrigger | undefined;
  // MILESTONE 0: timestamp of the most recent 'seeking' event, to compute
  // seeking→seeked latency without altering the coalescing logic.
  let seekingStartedAt = 0;
  // Set while primePipeline walks the timeline to warm cold byte ranges before
  // entry; suppresses the onSeeked catch-up so warm seeks don't fight it.
  let warming = false;

  // object-position stays permanently centered via CSS; only object-fit varies here.
  const applyFit = (): void => {
    if (!opts.manageFit || !video.videoWidth || !video.videoHeight) return;
    video.style.objectFit = computeObjectFit(video.videoWidth, video.videoHeight);
  };

  // video.seeking is the native in-flight flag — no shadow boolean to keep in sync.
  const seekTo = (time: number, source?: string): void => {
    if (!Number.isFinite(time)) return;
    target = time;
    if (video.seeking) {
      scrubLog(video, 'seekTo-suppressed-already-seeking', { target: time, source });
      return;
    }
    if (Math.abs(video.currentTime - target) < FRAME_DELTA_S) return;
    // MILESTONE 0: proves/disproves the Primary hypothesis — is the seek
    // target already inside a buffered byte range at the moment we ask for
    // it? Guarded by SCRUB_DEBUG here (not just inside scrubLog) so the
    // isTimeBuffered() scan never runs on the hot scroll path when disabled.
    if (SCRUB_DEBUG) {
      scrubLog(video, 'seekTo', {
        target: time,
        source,
        targetBuffered: isTimeBuffered(video, time),
      });
    }
    video.currentTime = target;
  };

  const onSeeked = (): void => {
    if (warming) return;
    scrubLog(video, 'seeked', {
      target,
      seekingLatencyMs: seekingStartedAt ? performance.now() - seekingStartedAt : null,
    });
    if (Math.abs(video.currentTime - target) >= FRAME_DELTA_S) {
      video.currentTime = target;
    }
  };

  // One-time pipeline warm-up during the preload lead window. Primes the decode
  // pipeline AND buffers the timeline so a deep scrub doesn't hit a cold byte
  // range. Gated on the preload trigger having fired AND metadata present.
  // Never calls video.load() — on a cold connection it would abort the in-flight
  // fetch and restart resource selection (the RCA-confirmed slow-path harm). If
  // metadata isn't ready yet, onLoadedMetadata retries this.
  //
  // A head-only micro-seek is enough for the small clips (hero, system-world):
  // preload='auto' residents them fully, so a deep seek is already buffered. The
  // large clips (author-reveal, invitation) suspend with the tail cold, so a
  // scrub into the back half hits an unbuffered range and freezes. So we walk a
  // few points across the duration to pull those ranges into buffer ahead of
  // entry — skipping any already resident (small clips do nothing), aborting the
  // instant the scene goes active, and finishing at the head so it opens on
  // frame 0.
  let preloadFired = false;
  let wokeUp = false;
  const primePipeline = (): void => {
    if (wokeUp || !preloadFired || video.readyState < 1 || !Number.isFinite(video.duration)) return;
    wokeUp = true;
    scrubLog(video, 'preload-branch-microseek');
    const steps = [0.25, 0.5, 0.75, 0.999].map((f) => f * video.duration);
    warming = true;
    let i = 0;
    const walk = (): void => {
      if (!warming) return;
      // scene reached: hand the timeline straight back to the scrub
      if (trigger?.isActive) {
        warming = false;
        if (metadataReady) seekTo(trigger.progress * video.duration, 'warm-abort');
        return;
      }
      if (i >= steps.length) {
        warming = false;
        if (video.currentTime !== 0) video.currentTime = 0.001;
        return;
      }
      const pos = steps[i++];
      // already resident (small clip, or already warmed) → next, no network
      if (isTimeBuffered(video, pos)) {
        walk();
        return;
      }
      const onWarmSeeked = (): void => {
        video.removeEventListener('seeked', onWarmSeeked);
        walk();
      };
      video.addEventListener('seeked', onWarmSeeked);
      // defer so a warm seek never fights an in-flight seek
      setTimeout(() => {
        if (warming) video.currentTime = pos;
      }, 0);
    };
    setTimeout(walk, 0);
  };

  const onLoadedMetadata = (): void => {
    metadataReady = Number.isFinite(video.duration) && video.duration > 0;
    scrubLog(video, 'loadedmetadata-handled', {
      metadataReady,
      triggerActive: trigger?.isActive ?? null,
      triggerProgress: trigger?.progress ?? null,
    });
    video.pause();
    applyFit();
    // If metadata resolves while the visitor is already inside the pinned
    // scene, nothing else re-asserts the frame, so a stationary visitor would
    // stay frozen on the poster. Re-seek to the current progress explicitly.
    // (Replaces an unconditional ScrollTrigger.refresh() that only served as an
    // incidental re-kick and could re-pin mid-scene.)
    if (metadataReady && trigger?.isActive) {
      seekTo(trigger.progress * video.duration, 'loadedmetadata-rekick');
    }
    primePipeline();
  };

  video.addEventListener('seeked', onSeeked);
  // Not { once: true }: a stationary visitor whose metadata resolves mid-scene
  // relies on this handler to re-seek to the current progress, and metadataReady
  // must track any later re-fire.
  video.addEventListener('loadedmetadata', onLoadedMetadata);
  if (metadataReady) applyFit();

  // MILESTONE 0: raw lifecycle listeners, opt-in only — zero cost when
  // SCRUB_DEBUG is false (the array below is never created/attached).
  const debugListeners: Array<[string, EventListener]> = [];
  if (SCRUB_DEBUG) {
    const rawEvents = [
      'loadstart',
      'loadeddata',
      'canplay',
      'canplaythrough',
      'progress',
      'suspend',
      'waiting',
      'stalled',
      'emptied',
      'abort',
      'error',
      'durationchange',
    ] as const;
    rawEvents.forEach((ev) => {
      const handler: EventListener = () => scrubLog(video, ev);
      video.addEventListener(ev, handler);
      debugListeners.push([ev, handler]);
    });
    const onSeeking: EventListener = () => {
      seekingStartedAt = performance.now();
      scrubLog(video, 'seeking', { target });
    };
    video.addEventListener('seeking', onSeeking);
    debugListeners.push(['seeking', onSeeking]);
  }

  const scrubSmoothing = isCoarsePointer()
    ? SCROLL.touchScrubSmoothingS
    : SCROLL.renderCatchupS;

  trigger = ScrollTrigger.create({
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
      if (!metadataReady) {
        // MILESTONE 0: proves/disproves whether onUpdate ever fires while the
        // scene is actively pinned but metadata hasn't resolved yet (A4/A5).
        if (self.isActive) {
          scrubLog(video, 'onUpdate-skipped-metadataNotReady', {
            triggerProgress: self.progress,
            triggerActive: self.isActive,
          });
        }
        return;
      }
      // self.progress still fires onUpdate outside the active window (clamped
      // 0/1); without this guard a trigger that was never actually entered —
      // e.g. jumped over by a deep-link or refresh landing past it — can
      // claim the lock once and never release it, since onToggle only fires
      // on a genuine isActive transition.
      if (!self.isActive) return;
      if (activeVideo && activeVideo !== video) return;
      activeVideo = video;
      seekTo(self.progress * video.duration, 'onUpdate');
    },
    // isActive is already false by the time onLeave/onLeaveBack fire, so a
    // fast scroll that lands past the boundary in one step would otherwise
    // skip the final onUpdate — these guarantee the scene actually reaches
    // its final frame (or frame zero, scrolling up) before it releases.
    onLeave: () => seekTo(video.duration, 'onLeave'),
    onLeaveBack: () => seekTo(0, 'onLeaveBack'),
  });

  const preloadTrigger = ScrollTrigger.create({
    trigger: opts.trigger,
    start: PRELOAD_LEAD_START,
    once: true,
    onEnter: () => {
      scrubLog(video, 'preload-trigger-fired', { readyState: video.readyState });
      // Bump the hint so buffering continues; never call video.load() — on a
      // cold connection it would abort an in-flight metadata/body fetch and
      // restart resource selection, adding latency exactly when the network is
      // slowest. primePipeline() micro-seeks now if metadata is present,
      // otherwise onLoadedMetadata retries it once metadata arrives.
      preloadFired = true;
      video.preload = 'auto';
      primePipeline();
    },
  });

  return function teardown(): void {
    warming = false;
    trigger?.kill();
    preloadTrigger.kill();
    video.removeEventListener('seeked', onSeeked);
    video.removeEventListener('loadedmetadata', onLoadedMetadata);
    // MILESTONE 0: symmetric cleanup for the gated debug listeners.
    debugListeners.forEach(([ev, handler]) => video.removeEventListener(ev, handler));
    if (activeVideo === video) activeVideo = null;
  };
}
