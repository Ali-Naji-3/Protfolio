# ALI NAJI — Cinematic Personal Brand Platform

An interactive experience set inside a living backend system. One continuous
page, eight chapters, built around a true story: a read-before-write race
condition that let two customers buy the last item — and the correction that
made the failure impossible.

> Engineering is often about preventing invisible failures rather than
> building visible features.

The creative and technical constitution lives in **`docs/production/`**
(10 documents, v2.0, frozen). This README covers running, verifying, and
finishing the build.

## Stack

- **Astro 7** — static output; all narrative content is server-rendered HTML.
  JavaScript enhances the story, it never carries it.
- **GSAP 3 + ScrollTrigger** — the scroll-scrubbed hero and reveal choreography.
- **Lenis** — smoothed scrolling, driving ScrollTrigger via the GSAP ticker.
- **Three.js** — the atmosphere particle layer. Lazily imported after first
  idle, on motion-permitting fine-pointer desktop viewports only.
- **Web Audio** — the Phase-1 precision sound kit is synthesized in code
  (no audio files). Off by default, strictly opt-in, choice persisted.
- **TypeScript strict** throughout.

## Commands

| Command | Purpose |
| --- | --- |
| `npm install` | install dependencies |
| `npm run dev` | dev server at `localhost:4321` |
| `npm run check` | Astro + TypeScript diagnostics |
| `npm run build` | production build → `dist/` |
| `npm run preview` | serve the production build |
| `npm run verify` | full production verification (see below) |
| `npm run report:placeholders` | list every placeholder asset + content TODO |

`npm run verify` drives the built site in headless Chromium (desktop 1440×900,
mobile 390×844, and `prefers-reduced-motion`) and asserts: zero console/page/
network errors, all chapters render, every image decodes, every link resolves,
Lenis + ScrollTrigger + hero pin active, the hero scrub reaches the fault,
DEMO-01 produces the correct outcome in both modes, and the reduced-motion
edition tells the complete story with no animation infrastructure. Set
`CHROMIUM_PATH` if Chromium is not at `/opt/pw-browsers/chromium`.

## Architecture

```
src/
  config/
    site.ts        identity, contact, chapter registry
    assets.ts      THE ASSET MANAGER — every asset ID → file path
  content/
    copy.ts        every line of copy, mapped to storyboard scene IDs
    proofs.ts      engineering proofs (Problem→Constraint→Decision→
                   Trade-off→Outcome→Lesson); #2/#3 are approved skeletons
  styles/
    tokens.css     Visual Bible tokens (closed palette, type, spacing, motion)
    global.css     reset, voices, focus, reduced-motion contract
  motion/
    tokens.ts      the five eases + duration scale (mirror of tokens.css)
    main.ts        entry: Lenis ⇄ ScrollTrigger, module boot
    hero.ts        pinned hero scrub (SVG timeline or video scrub)
    demo.ts        DEMO-01 race-condition simulation
    reveals.ts     [data-reveal] / [data-reveal-group] / [data-breathe]
    progress.ts    hairline timecode + Index active-chapter state
    audio.ts       opt-in synthesized sound kit + narrative hooks
    atmosphere.ts  lazy Three.js particle depth field
    bus.ts         typed event bus (hero:fault → audio strike, …)
  layouts/BaseLayout.astro     head, SEO, JSON-LD, atmosphere canvas
  components/
    chrome/PersistentChrome.astro   identity, Index (no-JS <details>), progress
    ChapterShell.astro              semantic chapter wrapper
    chapters/Ch00…Ch07              the eight chapters
    islands/HeroStage.astro         the hero system diagram (+ video slot)
    islands/RaceDemo.astro          DEMO-01 markup
```

**Rules the code enforces:**

1. **No hardcoded asset paths.** Components call `getAsset(id)` from
   `src/config/assets.ts`. IDs are canonical (docs/production/05).
2. **No inline copy.** All language lives in `src/content/copy.ts`.
3. **Closed motion vocabulary.** Only the five named eases and the fixed
   duration scale (`src/motion/tokens.ts`). t6 = 1.2 s is the ceiling.
4. **No-JS parity.** The server-rendered document is the complete story;
   the hero's no-JS state is the final frame, not a blank.
5. **Reduced motion is an edition, not a fallback** — no pin, no scrub,
   no atmosphere; everything readable.

## Finishing production (asset replacement)

Every remaining placeholder is registered in `src/config/assets.ts` with
`placeholder: true` — run `npm run report:placeholders` for the live list:

| ID | What replaces it | How |
| --- | --- | --- |
| `SYS-01/poster` | final hero keyframe render | set `src`, `placeholder: false` |
| `SYS-01/scrub` | scroll-scrub MP4 (keyframe-dense encode) | set `src` — HeroStage switches to video mode automatically |
| `HUM-01/author`, `HUM-02/address`, `HUM-03/person` | identity-validated portraits (docs/production/07 protocol) | set `src` |
| `DOC-01/resume` | real résumé PDF | replace `public/assets/docs/ali-naji-resume.pdf` |

Content still owed (marked `TODO` in code, never to be invented):
Proof #2 / #3 technical details (`src/content/proofs.ts`), the three
Chapter 06 person lines and Method signals (`src/content/copy.ts`), the
final domain (`src/config/site.ts` + `astro.config.mjs`).

## Deploying

`npm run build` produces a fully static `dist/` — deploy to any static host
(Netlify, Vercel, Cloudflare Pages, GitHub Pages). Update `site` in
`astro.config.mjs`, `SITE.url` in `src/config/site.ts`, and the URLs in
`public/robots.txt` / `public/sitemap.xml` when the final domain exists.
