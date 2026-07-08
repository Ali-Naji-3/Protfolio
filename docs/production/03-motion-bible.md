# 03 — Motion Bible

**Project:** ALI NAJI — Cinematic Personal Brand Platform
**Version:** 2.0
**Inherits from:** `01` (Constitution, Core Laws), `02` (where motion happens), `06` (sound sync)
**Audience:** motion designers + engineers implementing GSAP / ScrollTrigger / Lenis / Three.js. This defines the motion *language*; no code.

---

## 1. Motion Philosophy

**"Motion is the explanation."** In this project motion is not decoration — it is how invisible engineering becomes visible. This is Core Law #1 (Beauty serves clarity) expressed in movement: **every animation must explain an engineering idea.** A move that explains nothing is cut, no matter how pretty.

Three governing ideas:
1. **Weight.** Everything has mass. Nothing pops, bounces, or springs. Elements *arrive* — decelerating into place like a camera settling.
2. **One thing at a time.** Exactly one element owns motion focus at any moment. Ambient motion sits below conscious attention.
3. **The visitor holds the playhead.** Scroll = timeline. Motion plays *because of* the visitor, never *at* them. Time-based motion is reserved for idle states and the four sanctioned epic beats.

### The 80/20 Contract
| Class | Share | Where | Character |
|---|---|---|---|
| **CALM** | 80% | Everything by default | Slow, weighted, quiet, long ease-out |
| **EPIC** | 20% | ONLY the 4 sanctioned beats (`02`) | Fast, decisive, over in ≤ 1.2s, followed by mandatory silence |

Any new motion idea declares its class. EPIC ideas must *replace* one of the four beats — the budget never grows.

---

## 2. The Easing System

Five named curves. No others. Names are canonical across all docs, tickets, and reviews.

| Name | cubic-bezier | Character | Used for |
|---|---|---|---|
| **`glide`** | `0.16, 1.00, 0.30, 1.00` | Long, luxurious deceleration | Entrances, settles — 80% of everything |
| **`drift`** | `0.33, 0.00, 0.15, 1.00` | Gentle in, soft out | Cross-fades, opacity, ambient shifts |
| **`current`** | `0.65, 0.00, 0.15, 1.00` | Confident accel → clean stop | Line/stroke draws, data-flow pulses, progress |
| **`strike`** | `0.85, 0.00, 0.10, 1.00` | Explosive start, hard-braked landing | EPIC beats only. Rationed. |
| **`breath`** | sine in-out | Symmetric, organic | Idle loops: cell pulse, human idle, ambient |

**Forbidden:** bounce, elastic, back-overshoot, spring, per-element random easing, and linear (except inside scrub mappings, §4). Overshoot reads as playful; this project is not playful.

---

## 3. Duration Scale

Fixed scale, base 100ms, ~1.5× steps. No arbitrary values.

| Token | ms | Role |
|---|---|---|
| `t-1` | 150 | Micro feedback: hover, focus, click ack |
| `t-2` | 250 | Small transitions: caption swaps, underlines |
| `t-3` | 400 | Standard element entrance/exit |
| `t-4` | 650 | Large element / text-block entrance |
| `t-5` | 1000 | Scene transitions, chapter cards |
| `t-6` | 1200 | **Ceiling.** EPIC only. Nothing exceeds `t-6`. |

**Stagger:** `s-1`=40ms · `s-2`=80ms · `s-3`=120ms. Groups cap at 8; beyond 8, remainder enters with the 8th.
**Idle rhythm:** all breathing loops on a 6s period (`breath`) so ambient motion phases together.

---

## 4. Scroll Grammar (ScrollTrigger + Lenis)

### 4.1 Prime Directive
**Scroll position maps 1:1 to timeline position. Always.**
- No scroll hijacking — the delta the visitor produces is the delta they get (through Lenis smoothing only).
- No auto-advance (exception: Index navigation, §7).
- No scroll traps — every pin has a fixed su budget (`02` values binding) and releases on schedule. **This includes depth-layer overlays: opening `+ technical depth` must NOT lock the page (see §7 — corrected from v1).**
- Scrubbed animations map linearly inside the scrub; easing lives in *what* values do, not in lag beyond the smoothing below.

### 4.2 Smoothing (the "system gate")
- Desktop: Lenis ~1.1s lerp-style smoothing — mass, but stopping intent respected within ~150ms.
- Touch: **native scroll physics.** Scrub smoothing on touch ≤ 0.3s.
- The race-condition system render carries its own ~0.5s catch-up so state-stepping never looks stroboscopic.

### 4.3 Pin choreography
| Rule | Value |
|---|---|
| Pinned scenes | **6 total**, exactly as storyboarded: 01.2 Anomaly, 02.1 Correction, 2× Proof Shot B, 07.1 Address. No new pins without Producer sign-off. |
| Max pin length | 4 su (Anomaly). All others ≤ 3 su |
| Between pins | ≥ 1 su free scroll between any two pins |
| Continuity | Content visually continuous across every pin boundary — no jump on pin/unpin |

### 4.4 Reveal-on-scroll default (the workhorse)
- Trigger at 15% into viewport · opacity 0→1 + translateY 32px→0 · `glide` · `t-4`.
- Text: split by line, stagger `s-2`, max 8 lines.
- **Once only** (re-scroll doesn't re-animate). Exception: scrubbed scenes, which are bidirectional by nature.

---

## 5. The System-Render Standard (replaces v1 "video scrubbing")

There is **no filmed video scrubbing** in v2. The scrubbed sequences (Anomaly, Correction, Proofs) are **rendered systems** — SVG/canvas/WebGL driven by scroll — plus the identity-validated human stills/clips (`07`).

| Rule | Spec |
|---|---|
| Mapping | Scroll progress → system state, linear, bidirectional. Must be beautiful *backwards* (Playhead Check, §11) |
| State floor | The race sequence resolves through enough discrete states that scrubbing never looks like a slideshow (≥ 12 legible states across its su length) |
| Human moments (👤) | Identity-validated stills or ≤ 4s loops (`05`/`07`); if a human clip can't load: validated static portrait — the story survives |
| Idle | On scroll-rest > 300ms: the focal element breathes (`breath`, 6s) so the system never freezes dead |

---

## 6. The Four Epic Beats — Choreography

The entire 20% budget. Each: `strike`, ceiling `t-6`, then **≥ 2s of calm** (the silence after the hit makes it epic). Motion here is *synchronized with sound* (`06`).

| Beat | Choreography | Sound (`06`) | Duration |
|---|---|---|---|
| **1 — The Failure** (01.2) | Stock cell ticks to `-1`; connecting strand desaturates; warning pulse | Two commit tones → **dissonance** | ~1.0s |
| **2 — The Fix** (02.1) | Three-step read→validate→write chain collapses into one atomic cell; B's update yields zero rows and dissolves | Dissonance **resolves** to one settled tone | ~1.2s |
| **3 — Proof transition** (04) | Demonstration lines converge to a point → streak → radial detonation into next Problem | Single low pulse | ~1.0s |
| **4 — The Bloom** (06→07) | Scroll-grown cyan point blooms to full-frame light → resolves into final portrait | One quiet resolve tone | ~1.2s |

Beats 1 and 2 are a *matched pair* (failure → fix): they must feel like a question and its answer, in both motion and sound.

---

## 7. Interaction Motion (micro states)

| Interaction | Motion |
|---|---|
| Link hover | Cyan underline draws L→R, `current`, `t-1`; exit fades (never retracts) |
| Primary button (the one CTA) | Border→fill: cyan floods from left, text inverts to black, `current`, `t-2`; hover-off `drift` |
| Index open/close | Dim `drift` `t-3`; list staggers `s-2`/`glide`/`t-3`; close reverses at `t-2` (exits faster than entrances) |
| Index chapter jump | Smooth-scroll fast-forward; duration scales with distance, 1200–2000ms cap, `glide`; never a teleport |
| `+ technical depth` overlay | Panel slides from right, `glide` `t-4`; **the page does NOT lock** — the panel is a focus-trapped modal layer with its own scroll, background dims to 40%, and closing (`t-3`, or Esc, or scrim click) returns to the exact frame. *(Corrects the v1 scroll-trap contradiction.)* |
| ⚙️ demo controls | Buttons/toggles acknowledge within `t-1`; the demo's own state animates on `current` |
| Click-to-copy email | Swaps to `Copied` for 1.2s with a 1px cyan underline pulse |
| Custom cursor (desktop, optional) | Dot + trailing ring, 80ms lag; over system scenes it labels `INSPECT`. First thing sacrificed to performance |

**Global hover law:** every interactive element acknowledges the pointer within `t-1`.

---

## 8. Ambient Motion (the living system)

- **Data atmosphere (🧊):** near-black particles/points as the system's "air," ultra-slow drift (`breath`, 6s), parallax 0.02× scroll. Must pass the **squint test** — squint and it disappears.
- **Parallax:** max 3 depth layers per scene; deepest 0.85× scroll, nearest 1.05×.
- **Permanently-animating UI:** only the scroll cue and the 1px cyan progress hairline. Everything else is still unless entering, exiting, or interacted with.
- **Law #1 applies to ambience too:** the data atmosphere represents the *system's activity*. It is not sparkle — it's the system breathing.

---

## 9. Performance Contract

Motion quality *is* the thesis (Law #2: the medium is the argument). Broken frames refute Ali faster than no motion.

| Rule | Budget |
|---|---|
| Frame budget | 60fps sustained on mid-tier hardware (2021 laptop / iPhone 12 class); scrub scenes ≥ 50fps |
| Animated properties | `transform`, `opacity`, and SVG stroke props only. **No animated layout properties** (width/height/top/margin) anywhere |
| Simultaneous tweens | ≤ 12 active at any moment |
| WebGL | ≤ 1 draw-call-heavy element on screen at once; point count adaptive (mobile halves; reduced-motion removes) |
| Degradation ladder | 1) drop cursor → 2) halve data-atmosphere → 3) drop parallax → 4) simplify demonstration draw to fade-in. **Never degrade:** legibility of the proofs, typography, CTA feedback, or the failure→fix clarity |

---

## 10. Accessibility & Reduced Motion

- **`prefers-reduced-motion: reduce` is a first-class edition**, not a penalty box (`02` parity table). Scrubs → curated stills; reveals → ≤ 400ms `drift` dissolves; epic beats → 200ms dissolves; data-atmosphere and parallax removed; idle loops frozen.
- **No information is motion-only.** Every scrubbed sequence has a static end-state carrying 100% of its meaning (and the race's failure→fix reads as two labeled stills).
- Nothing flashes more than twice per second — including Beat 4's bloom (a single rise, not a strobe).
- Keyboard: focus states use the `t-1` acknowledgment; Index, CTA, and ⚙️ demos fully keyboard-operable; pins never trap focus; depth overlays are proper focus-trapped modals with Esc. Full spec in `08`.

---

## 11. Motion Review Gates

Every scene passes five checks before ship:
1. **The Clarity Check (Law #1):** what engineering idea does this motion explain? One sentence. If none — cut it.
2. **The Ratio Check:** ≥ 80% calm by screen-time; any epic motion is one of the four sanctioned beats.
3. **The Playhead Check:** scroll up — does it reverse gracefully? Scrubbed scenes must be beautiful backwards.
4. **The Legibility Check:** does the failure→fix (and each proof) read correctly at *any* scrub position, not just the endpoints?
5. **The Frame Check:** performance recording on mid-tier hardware; any dropped-frame cluster in a scrub scene blocks sign-off.

---

*End of Motion Bible v2. Curves, durations, budgets binding. Additions require a named class, a duration token, a Clarity-Check sentence, and Producer sign-off.*
