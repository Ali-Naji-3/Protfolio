/**
 * Centralized asset manager (user requirement + 05 §2/§9).
 *
 * RULES:
 *  - Components NEVER hardcode file paths — they call `getAsset(id)`.
 *  - Asset IDs are the canonical IDs from docs/production/05-assets-pipeline.md.
 *  - Replacing a placeholder with a final asset = edit THIS file only
 *    (Milestone 7). Component logic never changes.
 *  - `placeholder: true` marks assets awaiting final production; a build-time
 *    report can list them (M6) so nothing placeholder ships silently.
 */

export type AssetKind = 'image' | 'video' | 'audio' | 'document';

export interface AssetVariant {
  /** Public path (under /public) or external URL. */
  src: string;
  /** Media type hint, e.g. 'image/svg+xml', 'video/mp4'. */
  type?: string;
  /** Media condition for <source>/srcset selection. */
  media?: string;
}

export interface AssetDef {
  id: string;
  kind: AssetKind;
  /** Required for images/videos; describes content for assistive tech. */
  alt: string;
  /** Primary variant — always present, always the safest fallback. */
  src: string;
  type?: string;
  /** Optional additional variants (modern codecs, responsive crops). */
  variants?: AssetVariant[];
  /** Poster/static fallback for videos (05 §3.2: story survives stills). */
  poster?: string;
  /** True while the asset is a stand-in awaiting final production. */
  placeholder: boolean;
  width?: number;
  height?: number;
}

/** Factory for the per-chapter scene-opening footage slots (10 §rule-3). */
function sceneSlot(id: string, alt: string): AssetDef {
  return { id, kind: 'video', alt, src: '', placeholder: true };
}

/**
 * The registry. IDs mirror 05 §2.
 * Placeholder files are code-authored SVGs on the Visual Bible palette —
 * crisp, zero-credit, and honest about being placeholders.
 */
const REGISTRY = {
  /** Hero keyframe direction (visual direction only, per Producer). */
  'SYS-01/poster': {
    id: 'SYS-01/poster',
    kind: 'image',
    alt: 'Inside a backend system: two orders both marked successful converge on a stock cell reading -1 — an impossible value. Something is wrong.',
    src: '/assets/placeholders/sys-01-anomaly.svg',
    type: 'image/svg+xml',
    placeholder: true,
    width: 1920,
    height: 1080,
  },
  /** Hero video — APPROVED, LOCKED (Seedance 2.0, identity-anchored).
   *  The MP4 + poster are copied to public/assets/videos/ at deploy time;
   *  the project is wired around this final path now (files not required
   *  during dev). HeroStage switches to scroll-scrub video mode on a
   *  non-empty src — architecture, poster, and reduced-motion fallback
   *  unchanged. */
  'SYS-01/scrub': {
    id: 'SYS-01/scrub',
    kind: 'video',
    alt: 'Ali Naji — a slow cinematic camera orbit through a dark, minimal architectural space.',
    src: '/assets/videos/hero.mp4',
    type: 'video/mp4',
    poster: '/assets/videos/hero-poster.jpg',
    placeholder: false,
  },
  'HUM-01/author': {
    id: 'HUM-01/author',
    kind: 'image',
    alt: 'Ali Naji, backend software engineer, standing inside the abstract system he corrected.',
    src: '/assets/placeholders/hum-01-author.svg',
    type: 'image/svg+xml',
    placeholder: true,
    width: 960,
    height: 1200,
  },
  'HUM-02/address': {
    id: 'HUM-02/address',
    kind: 'image',
    alt: 'Ali Naji, facing the camera — calm and direct.',
    src: '/assets/placeholders/hum-02-address.svg',
    type: 'image/svg+xml',
    placeholder: true,
    width: 960,
    height: 1200,
  },
  'HUM-03/person': {
    id: 'HUM-03/person',
    kind: 'image',
    alt: 'Ali Naji away from the keyboard.',
    src: '/assets/placeholders/hum-03-person.svg',
    type: 'image/svg+xml',
    placeholder: true,
    width: 1200,
    height: 900,
  },
  /* ── Scene-opening footage slots (10 §rule-3) ──────────────────
     Every chapter opens with a full-screen scene card carrying one of
     these mounts. Empty src ⇒ the card renders as a code-authored title
     scene. Real footage (2–4s loop, palette-graded per 04) ⇒ set src.  */
  /** Engineering World — APPROVED, LOCKED (kling3_0, text-to-video).
   *  The visual bridge between the Hero and the first engineering chapter:
   *  a slow dolly through the abstract backend as it becomes visible. The
   *  MP4 is copied to public/assets/videos/ at deploy time; the project is
   *  wired around this final path now (file not required during dev). The
   *  scene card plays it as a graded, looping backdrop behind the title. */
  'SCN-02/open': {
    id: 'SCN-02/open',
    kind: 'video',
    alt: 'Inside the system: an abstract backend becomes visible as light travels through its channels.',
    src: '/assets/videos/system-world.mp4',
    type: 'video/mp4',
    placeholder: false,
  },
  /** Author Reveal — final production slot (Kling, identity-anchored).
   *  The engineer behind the world the visitor just moved through: one
   *  continuous slow push-in, eye contact near the final second. The MP4
   *  is copied to public/assets/videos/ at deploy time; the project is
   *  wired around this final path now (file not required during dev). */
  'SCN-03/open': {
    id: 'SCN-03/open',
    kind: 'video',
    alt: 'Ali Naji — the engineer behind the system, standing calmly in a dark architectural space as the camera slowly moves in.',
    src: '/assets/videos/author-reveal.mp4',
    type: 'video/mp4',
    placeholder: false,
  },
  'SCN-04/open': sceneSlot('SCN-04/open', 'Further proofs, drawn from real production work.'),
  'SCN-05/open': sceneSlot('SCN-05/open', 'The operating principles.'),
  'SCN-06/open': sceneSlot('SCN-06/open', 'Away from the keyboard.'),
  /** Invitation — final production slot (Kling). The film's last scene:
   *  calm confidence and a genuine invitation to start a conversation.
   *  Copied to public/assets/videos/ at deploy time; wired around the
   *  final path now (file not required during dev). */
  'SCN-07/open': {
    id: 'SCN-07/open',
    kind: 'video',
    alt: 'The invitation — a quiet, open architectural space holding a single point of light, calm and unhurried.',
    src: '/assets/videos/invitation.mp4',
    type: 'video/mp4',
    placeholder: false,
  },

  /** Social share card (MD-01) — code-rendered on the Visual Bible palette. */
  'MD-01/og': {
    id: 'MD-01/og',
    kind: 'image',
    alt: 'Ali Naji — backend engineer. I prevent the invisible failures.',
    src: '/assets/og/default.png',
    type: 'image/png',
    placeholder: false,
    width: 1200,
    height: 630,
  },
  'DOC-01/resume': {
    id: 'DOC-01/resume',
    kind: 'document',
    alt: 'Ali Naji — résumé (PDF).',
    src: '/assets/docs/ali-naji-resume.pdf',
    type: 'application/pdf',
    placeholder: true,
  },
  /** SND-01 kit lands in M5 (audio island) / M7 (final sounds). */
} as const satisfies Record<string, AssetDef>;

export type AssetId = keyof typeof REGISTRY;

/** The only sanctioned way to obtain an asset. */
export function getAsset(id: AssetId): AssetDef {
  return REGISTRY[id];
}

/** Type guard for dynamically-built IDs (e.g. per-chapter scene slots). */
export function hasAsset(id: string): id is AssetId {
  return id in REGISTRY;
}

/** All assets still marked placeholder — used by the M6 build report. */
export function listPlaceholders(): AssetDef[] {
  return Object.values(REGISTRY).filter((a) => a.placeholder);
}
