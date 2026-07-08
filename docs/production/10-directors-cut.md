# 10 — Director's Cut Addendum (v2.1)

**Status:** RATIFIED — supersedes presentation guidance in 02/03/04 where they
conflict; all Core Laws, the Identity Protocol (07), and the confidentiality
rules (Law #4) remain fully in force.

## The direction change

> The website is no longer the hero. The film is the hero.
> The website becomes the stage that presents the film.

The visitor should feel they entered a short film, not a website. The target
feeling is a Netflix title sequence or a premium product film — never
"a portfolio."

## The ten rules → implementation mapping

| # | Rule | Where it lives |
| --- | --- | --- |
| 1 | Full-screen cinematic opening | Cold-open sequence (Ch00): timed title cards over black, once per session, skippable by any input, absent under reduced motion / no-JS |
| 2 | Camera language is the storytelling tool | Slow dolly push-in on the pinned hero; parallax ghost numerals on scene cards; scenes fade through black, never "scroll away" |
| 3 | Every chapter begins with video → interactive | Each chapter opens with a full-screen SCENE CARD carrying a registered video mount (`SCN-xx/open` in the asset manager). Empty src ⇒ code-rendered title scene. Real footage ⇒ one-line registry edit |
| 4 | Scrolling = moving through scenes | Scene cards + letterbox engagement make scroll read as cuts and camera moves, not page travel |
| 5 | Continuous cinematic motion | Existing motion bible (5 eases, duration scale) unchanged — the vocabulary was already filmic |
| 6 | Typography as subtitles | New `subtitle` voice: minimal, centered, timed. Hero copy delivered as timed subtitles during the scrub |
| 7 | Real footage as emotional anchor | HUM scene slots registered and waiting (Identity Protocol 07 governs capture). Until then, code-rendered scenes carry structure, never fake humanity |
| 8 | Demos emerge from the film | DEMO-01 arrives inside Chapter 02's scene flow after the letterbox releases — the film hands the controls to the visitor |
| 9 | Invisible transitions | Scene-card exit fades overlap content reveals; letterbox bars breathe in/out with scenes |
| 10 | "Never think portfolio" | Cold open + letterbox + subtitles + scene grammar + film grain — the page never shows a "section," only scenes |

## New surfaces (all placeholder-aware)

- `SCN-02/open` … `SCN-07/open` — per-chapter opening footage slots (empty)
- Letterbox layer, film-grain layer (code-only, palette-pure)
- Cold-open copy lines in `src/content/copy.ts` (`enter.coldOpen`)

## What real footage unlocks later

Each `SCN-xx/open` MP4 (2–4 s, loopable, palette-graded per 04) drops into
`assets.ts`; the scene card automatically layers the title over the footage.
No component changes. Hero scrub MP4 path unchanged from 08/M2.
