# 04 — Visual Bible

**Project:** ALI NAJI — Cinematic Personal Brand Platform
**Version:** 2.0
**Inherits from:** `01` (Constitution, Core Laws), `02` (scenes), and governs alongside `03` (motion)
**Audience:** designers producing comps + engineers implementing the design system. Tokens are named values to translate 1:1; no code.

---

## 1. Visual Concept

**"Invisible engineering, made visible — and nothing more."**

The screen is the inside of a running backend system. **Architecture is the landscape. Data is the atmosphere. Typography is the voice. Cyan is the current running through the machine.** The luxury is entirely in restraint: no gradients-for-decoration, no glassmorphism, no noise textures, no drop shadows. Depth comes from light, scale, and motion — the way it does on a stage.

**Core Law #1 governs every frame: Beauty serves clarity.** Every visual element must explain an engineering idea. The litmus: *point at any element and name the engineering concept it communicates.* If you can't, it's decoration — cut it. A frame that is merely pretty has failed this project.

**Second litmus (the honesty test):** remove the wordmark — does this frame read as *an engineer's mind*, or as a generic dark-mode SaaS page? If it could be anyone's, it fails.

---

## 2. Color System

### 2.1 Core palette
| Token | Value | Name | Role |
|---|---|---|---|
| `ink-0` | `#000000` | Absolute Black | The system's ground / void |
| `ink-1` | `#0A0A0B` | Frame Black | Elevated grounds, overlay panels |
| `ink-2` | `#141416` | Surface Black | Interactive resting surfaces (Index rows, panels) |
| `line-1` | `#26262A` | Hairline | Borders, dividers, inactive diagram strokes |
| `text-2` | `#8B8B92` | Quiet White (55%) | Secondary text, captions, micro-caps |
| `text-1` | `#E9E9EC` | Voice White | Primary body (NOT pure white — vibrates on black) |
| `text-0` | `#FFFFFF` | Pure White | Display headlines + wordmark ONLY |
| `cyan-1` | `#00E5FF` | Electric Cyan | THE accent — the "current" / "live" signal |
| `cyan-2` | `#00B8CC` | Deep Current | Cyan hover/active shift |
| `cyan-glow` | `#00E5FF @ 8–12% α` | Current Glow | The only permitted glow: active-node backdrops, rim |
| `warn-1` | `#B84A3A` (desaturated) | Fault | **The failure state only** — the `-1`, the race's wrongness. Muted, never a bright red alarm |

### 2.2 Semantic color law (this is the whole system)
Color is not palette — it is *state*:
- **Cyan = live / correct / actionable.** The healthy system. The single CTA.
- **Warn = the invisible failure surfacing.** Appears exactly twice (the race in 01.2; optionally one proof) — desaturated, quiet, unsettling, never a klaxon-red. Its rarity is its power.
- **White = the voice** (typography). **Black = the system's space.**
This mapping *is* the thesis rendered in color: a calm cyan system, a quiet wrongness, a return to calm.

### 2.3 The Cyan Rationing Law
Cyan is a laser, not a paint.
1. ≤ **5%** of any viewport at rest (epic beats are the only sanctioned full-frame exceptions, ≤ 1.2s).
2. Cyan only as: hairlines (1–2px), stroke draws, data-flow pulses, the progress timecode, rim light, the CTA, live/active states, the loader underscore.
3. **Never** cyan body text, cyan backgrounds at rest, default cyan icons, or decorative cyan shapes.
4. One cyan *idea* per viewport.
5. Chapter 06 (The Person) is **cyan-free** so its return in 07 is an event.

### 2.4 Contrast compliance
- `text-1`/`ink-0` ~17:1 ✓ · `text-2`/`ink-0` ~5.5:1 ✓ · `cyan-1`/`ink-0` ~12:1 ✓ · `ink-0` on `cyan-1` (CTA hover) ~12:1 ✓ · `warn-1`/`ink-0` ~4.6:1 ✓ (AA for its large-only usage).
- **Text over the system render:** any type over a moving system must sit in a guaranteed-dark **type-safe zone** (§4.3) or carry a subtle scrim. AA is checked against the *darkest and lightest* state of the render behind it. If a scrim is needed, it's specified, not improvised.
- Rule: **if it's text, it passes AA; if it can't, it isn't text — redesign it.**

---

## 3. Typography

### 3.1 Typeface casting
| Role | Voice | Casting | Reference families (final at licensing) |
|---|---|---|---|
| **Display / Identity** | The director | Modern grotesque, tight apertures, dignified all-caps at 12vw | Neue Haas Grotesk Display, Söhne, Suisse Int'l |
| **Text / System** | The engineer | Companion grotesque, readable at 16–20px on dark | Söhne Buch, Suisse Int'l Book, Inter (fallback) |
| **Mono / Machine** | The system speaking | ONLY: micro-caps labels, data values (`STOCK: 1`, `-1`), annotations, timecode. A whisper of terminal, never costume | Söhne Mono, JetBrains Mono, IBM Plex Mono |

One superfamily across all three (e.g. Söhne + Söhne Mono) is preferred — rhythm coherence + halved payload.

### 3.2 Type scale (desktop @1440w; fluid between breakpoints)
| Token | Size / Line | Weight | Case & tracking | Use |
|---|---|---|---|---|
| `display-1` | clamp 72→128 / 0.95 | 500 | Caps, -1% | Name, chapter numerals |
| `display-2` | clamp 48→80 / 1.0 | 500 | Sentence, -1% | Thesis line, Problem statements, final address |
| `display-3` | clamp 32→48 / 1.1 | 500 | Sentence, -0.5% | Principle headlines, outcome figures |
| `title-1` | 24 / 1.25 | 500 | Sentence | Panel titles, Index names |
| `body-1` | 18 / 1.6 | 400 | Sentence, ≤ 34em | Long-form depth layers |
| `body-2` | 16 / 1.55 | 400 | Sentence, ≤ 34em | Standard body |
| `caption` | 13 / 1.4 | 400 | Sentence | Annotations, footnotes |
| `micro-caps` | 11 / 1.2 | 500 mono | ALL CAPS, +12% tracking | Labels, data values, stack, `SCROLL` |

### 3.3 Typographic laws
1. White display type is the protagonist whenever Ali isn't on screen. Scale is the drama — no gradients-in-text, no outlines, no shadows.
2. Max two type sizes per viewport (+ micro-caps furniture).
3. Line-by-line reveal is the only permitted text-animation style — **except** the single typewriter line in 01.3 (the "no one sees this failure" beat), a sanctioned signature.
4. Body measures 26–34em. Display line breaks are authored in the copy deck, never left to the renderer.
5. Data values (`STOCK: 1`, `-1`, `0`) use tabular mono figures — they must read as *the system's own output*, not designed text.

---

## 4. Layout & Grid

### 4.1 The system grid
- 12-column fluid, 96px max outer margins (desktop), 24px gutters; → 6 col / 20px (tablet) → 4 col / 16px (mobile).
- **Cinematic margin law:** content never touches the outer 8% except full-bleed system renders. The empty edge is the letterbox.
- Vertical rhythm: 8px base; spacing tokens `space-8/16/24/32/48/64/96/160`.

### 4.2 Composition grammar
| Scene type | Composition |
|---|---|
| The Anomaly / Correction (01–02) | Full-bleed system render; data cell at optical center; type anchored to a dark type-safe column |
| Statement viewports (thesis, principles) | Single centered block, cols 3–10, +5% optical lift |
| Proof demonstrations (04 Shot B) | Demo cols 1–8; annotation rail cols 9–12 (Decision → Trade-off steps) |
| Author / Address (03, 07) | Real Ali composited into the system; type anchored to grid, off his eyeline |
| The Ledger (07.2) | Left-aligned single column, cols 2–7 — the most conventional layout in the film; practicality IS the design here |

### 4.3 Z-model (depth without shadows)
Back → front: `ink-0 ground → data atmosphere (🧊) → system render → cyan-glow effects → real Ali (👤, when present) → typography → UI chrome → overlay panels`.
Typography always in front of the render. Every scene with type over a render defines a **type-safe zone** kept dark across all render states.

---

## 5. The World: Art Direction for "System as Environment"

Binding art direction for every 🧊 system render. **This replaces v1's luxury-headquarters direction entirely.**

| Attribute | Direction |
|---|---|
| Metaphor | The inside of a running backend: cells, flows, transactions, boundaries — abstract, orthogonal, precise. Not sci-fi, not a "data center," not neon cyberpunk |
| Structure | Architecture as landscape: components as hairline nodes, connections as thin lines, data as traveling cyan pulses. Built on the 8px module |
| Light | The system emits its own light: nodes glow faintly when "live," dim when idle. No external "sun." Contrast high, blacks true black |
| Atmosphere | Data as air: ultra-subtle drifting points (squint test). Represents system activity, never sparkle |
| The failure | When wrongness appears (the `-1`), the system's cyan calm gives way to desaturated `warn-1` — quietly, like a held breath |
| Forbidden | Neon cyberpunk, Matrix rain, glossy 3D servers, isometric AWS-icon soup, gamer RGB, lens flares, any "expensive room" |

**Where the real Ali appears (👤):** he is composited *into* this system (identity-validated per `07`), lit plainly and honestly. The cinema is the light and composition on a real person inside an abstract world — never a staged luxury location. His wardrobe signature (black suit, white tee, white sneakers, silver watch) is his visual constant.

---

## 6. Iconography & the Diagram Language

### 6.1 Icons
Almost none: Index (≡), close (×), external-link (↗), copy, download, play/reset (for ⚙️ demos). 1.5px stroke, geometric, squared terminals, 24px grid, `text-2` at rest → `text-1` on hover. Never filled, never cyan at rest.

### 6.2 The diagram / system language (the visual signature)
One language across Anomaly, Correction, and all Proofs — this is what makes the site recognizably *this* site:
| Element | Spec |
|---|---|
| Components / cells | 1.5px hairline rects, `line-1` at rest → `text-2` when active; labels in mono micro-caps |
| Data values | Mono tabular, rendered as the system's output (`STOCK: 1`) |
| Connections | 1px lines; data-flow = 3px cyan pulses traveling the path (`current`) |
| Active node | Stroke → `cyan-1` + `cyan-glow` backdrop — one at a time, synced to annotation |
| Failure state | Node/value → `warn-1`, desaturated; the only place warn appears |
| Grid & routing | 8px module; orthogonal routing (45° only for a single emphasis path) |
| Density cap | ≤ 9 components per diagram. A real system has 40; the diagram's job is the *decision*, not the census. Simplification is the demonstration of skill (Law #1) |
| Bans | No isometric 3D, no service-category color-coding, no vendor icons |

---

## 7. Imagery Rules

1. **The real Ali appears exactly three times** (03 reveal, 06 human beat, 07 address). Scarcity preserves the cinema; three appearances read as *casting*, not vanity.
2. **No stock imagery, ever.** If a visual can't be rendered, diagrammed, typeset, or is not a validated image of the real Ali, it doesn't exist.
3. **No proprietary anything.** Every system render is a *generic, self-built abstraction* — never a depiction of CedarERP/Invoverse internals (Law #4; `05`/`09`).
4. All human imagery passes the Identity Integrity Protocol (`07`) before it's placed.

---

## 8. Component States

| Component | Rest | Hover/Focus | Active |
|---|---|---|---|
| **Primary CTA** `[ START A CONVERSATION ]` | `text-0`, 1px `cyan-1` border, transparent, ≥ 56px height | Cyan floods L→R, label → `ink-0` | Fill holds, damped settle to 0.99 (not a bounce) |
| Text links | `text-1`, no underline | Cyan underline draws | — |
| Index / Contact / sound chrome | mono micro-caps, `text-2` | `text-1` + underline | Active state marked |
| Index rows | `title-1` `text-2`, hairline separators | text → `text-0`; numeral → `cyan-1` | Current chapter: 2px cyan tick |
| `+ technical depth` | `caption` `text-2` + `+` glyph | `text-1`; `+` rotates 45° (the one earned micro-gesture — means "expand") | Modal panel per `03` §7 |
| ⚙️ demo controls | mono label, hairline border | `text-1` + cyan border | State animates on `current` |
| Focus (keyboard) | — | 1px `cyan-1` outline, 4px offset, square — unmistakable | — |
| Copy-email | `text-1` mono | underline draws | swaps to `COPIED` |

**One-CTA law:** `[ START A CONVERSATION ]` is the only filled button in the entire experience. Everything else is text and hairlines. The hierarchy of asks is absolute.

---

## 9. Responsive Art Direction (re-direction, not reflow)

| Frame | Desktop (≥1200) | Tablet (768–1199) | Mobile (<768) |
|---|---|---|---|
| Anomaly/Correction | Full-bleed landscape render | Landscape holds | Portrait-composed render; data cell centered; type below |
| Proofs (04) | Demo + right annotation rail | Annotation below demo | Demo simplifies to ≤ 6 components (authored variant); annotation full-width steps |
| Author/Address | Ali composited landscape | Holds | Portrait-crop validated asset; type stacked off eyeline |
| Margins / rhythm | 96px | 48px | 16px, spacing ×0.75 |
| Type | Reference scale | Fluid | `display-1` floor 44px; body floor 16px |

**Law:** mobile is a re-direction of the same experience. Ch. 01–02 (the hook), 04 (the proofs), and 07 (the ask) get authored mobile comps.

---

## 10. Visual QA Gates

Every comp and built scene passes:
1. **The Clarity Gate (Law #1):** name the engineering idea each element explains. Nameless elements are cut.
2. **The Honesty Gate:** remove the wordmark — does it read as *this engineer's mind*, not generic dark SaaS?
3. **The Cyan Audit:** ≤ 5% coverage, one cyan idea, semantic use only; warn used only for genuine failure.
4. **The Squint Test:** squint → one subject + one supporting element. Three competing things → recompose.
5. **The Contrast Gate:** every text node passes AA against the *actual darkest and lightest* state behind it (including over the render).
6. **The Identity Gate (👤 scenes):** the person is unmistakably the real Ali per `07`, or it doesn't ship.

---

*End of Visual Bible v2. Tokens and laws binding. The palette is closed — no fourth hue beyond black/white/cyan(+the rationed warn). New tokens require Producer sign-off.*
