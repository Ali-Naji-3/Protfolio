# 02 — Storyboard

**Project:** ALI NAJI — Cinematic Personal Brand Platform
**Version:** 2.0
**Inherits from:** `01-creative-brief.md` (Constitution + Core Laws)
**Feeds:** `03` (motion), `04` (visual), `05` (assets), `06` (sound), `09` (proof content)

---

## 0. How to Read This

The site is one continuous scroll experience set **inside a living backend system**. **Scroll is the playhead.**

- Timing is in **scroll units (su)**: `1 su = one viewport height of scroll travel`. Total ≈ **32 su** (~2:45–3:00 at natural pace; but see Motion Bible §4 — the *visitor* controls pace, we never fake seconds).
- Each scene lists: duration, phase, on-screen, motion intent, **sound** cue, **copy** (working draft), and exit.
- Asset tags: 🧊 code/3D/system-render · 🖼 graphic/typographic · 👤 real Ali (identity-validated) · 🔊 sound event · ⚙️ interactive demo (self-built, owned by Ali — `09`).
- **Dual-legibility note** appears on every technical scene: the *emotional* read (non-engineer) and the *precise* read (engineer) must both be satisfied.
- **Law #1 check** (Beauty serves clarity) is implicit on every scene: if an element explains no engineering idea, it does not ship.

### Journey map

```
su:  0    1            5        8         12                  22        26      29    32
     |----|------------|--------|---------|-------------------|---------|-------|-----|
     00   01           02       03        04                  05        06      07
     Enter The Anomaly  The      The       The Proofs          The       The     The
          (race cond.)  Correct. Author    (auth · migration)  Method    Person  Invitation
     ───────WONDER──────────────▶──────────────TRUST───────────────────────▶──ACTION──▶
```

---

## CHAPTER 00 — ENTER

**Duration:** time-based, ~1.2–2.0s (hard cap 3.5s) · **Phase:** — · **Job:** tone before content; establish the world is a *system*.

### 00.1 — Boot
- Pure black. Silence. 🖼
- A single cyan hairline draws across center — a system coming online — and resolves into the wordmark `ALI NAJI` (white), cyan underscore settling beneath, dimming to 20%.
- If assets still loading: the underscore becomes a quiet left→right fill. No spinner, no percentage.

### 00.2 — The Sound Invitation
- Beneath the wordmark, once interactive:
  ```
  Experience available with sound
  [ Enable ]
  ```
- Calm, confident, dismissible. Declining is one keystroke or a scroll. 🔊 (Enabling this is the *only* place audio can begin — browsers block autoplay; see `06`.)
- **Exit:** black lifts like a curtain (vertical mask) directly into 01.1 — one continuous shot into the system.

---

## CHAPTER 01 — THE ANOMALY

**Duration:** 4 su (pinned) · su 1–5 · **Phase:** Wonder (peak) · **Job:** the race condition, *felt*. This is Proof #1's problem statement, told as cinema.

### 01.1 — Stock = 1 (pre-scroll idle)
- 🧊 We are inside the system. Abstract, precise: a single data cell glows softly at center — labeled, in micro-caps, `STOCK: 1`. Around it, the faint geometry of an inventory system as landscape (dark, orthogonal, calm). Cyan present only as the "live" pulse of the one cell.
- 🖼 Top-left, satisfying the 8-second signal: `ALI NAJI` / `SOFTWARE ENGINEER · BACKEND`. Top-right: **Index**, **Contact**, **sound toggle** — persistent from here to the end.
- 🔊 Soft system ambience (if enabled): a low, steady presence. The single cell has a faint periodic pulse.

### 01.2 — Two orders, one item (scroll-scrubbed, su 1→4)
- 🧊 As the visitor scrolls, **two order requests** enter from opposite edges — labeled `ORDER A`, `ORDER B` — traveling toward the `STOCK: 1` cell at the *same* instant.
- Both read the cell (both see `1`). Both pass validation (a checkmark blooms on each — 🔊 **commit tone**, clean, for A). Both commit (🔊 **second commit tone**, identical). Two sales confirmed.
- Then the reveal: the stock cell ticks to `-1`. A value that cannot exist. 🔊 **the dissonance** — not an alarm, just an unmistakable wrongness. A single cyan strand between the two orders flickers to a warning desaturation.
- **Dual legibility:**
  - *Emotional (non-engineer):* two people bought the last one. The counter went below zero. *Something is wrong.* No words needed.
  - *Precise (engineer):* a read-before-write race — both transactions read stock=1 before either wrote. Classic lost-update.
- **Copy**, arriving small at su ~3:
  > *Two customers. One item. The system sold both.*

### 01.3 — Hold on the wrongness (su 4→5)
- The `-1` holds, quietly pulsing the desaturated warning. Silence swells (Law #7).
- 🖼 One line types on — the only typewriter moment permitted in the film (a sanctioned signature, per `04`):
  > *This is the kind of failure no one sees — until it's too late.*
- **Exit:** pin releases into Chapter 02.

---

## CHAPTER 02 — THE CORRECTION

**Duration:** 3 su (pinned) · su 5–8 · **Phase:** Wonder → Trust · **Job:** Ali closes the race. Visual *and* sonic resolution. Proof #1 completes; the thesis is earned before it's spoken.

### 02.1 — Moving the invariant down (scroll-scrubbed)
- 🧊 The system re-architects itself as the visitor scrolls. The read→validate→write path (three separate steps, shown as a fragile chain in 01) **collapses into a single atomic step** at the database cell: the decrement now happens *only if* stock still suffices, inside one transaction.
- When `ORDER A` and `ORDER B` race again: A's atomic update succeeds; B's update affects **zero rows** and fails safely — B dissolves gracefully, no sale. The cell holds at `0`. Never negative.
- 🖼 A second, quieter layer draws: a CHECK-style guard around the cell — *impossible states made unrepresentable* (defense in depth).
- 🔊 **Resolution:** the dissonance from 01.2 resolves — one clean, settled tone. The engineering solution is *sonically* satisfying, not just visually.
- **Dual legibility:**
  - *Emotional:* the wrongness is gone; the system feels calm, correct, safe.
  - *Precise:* atomic conditional update inside a transaction + a constraint that makes negative stock unrepresentable; every mutation path audited, not just one endpoint.

### 02.2 — The thesis, earned (su 7→8)
- 🖼 The system settles to stillness. One line, the film's spine, arrives — *after* the visitor has felt why it's true:
  > **"Engineering is often about preventing invisible failures rather than building visible features."**
- **Depth affordance:** a quiet `+ How I actually fixed this` opens the Proof #1 technical layer (from `09`) — the real mechanism, the trade-off, the verification — for engineers. Opt-in. (No proprietary code; a self-built, generic demonstration — see `09` and ⚙️ below.)
- ⚙️ **Interactive demo hook:** engineers can trigger the race themselves on a self-built generic inventory and watch it fail, then toggle the fix and watch zero-rows-affected save it. Owned entirely by Ali; violates no confidentiality.
- **Exit:** the thesis line shrinks and anchors; the system "turns to look at its author." Transition to the human reveal.

---

## CHAPTER 03 — THE AUTHOR

**Duration:** 4 su · su 8–12 · **Phase:** Trust (bridge) · **Job:** reveal the real Ali as the engineer who closed the race. System → Signal → **Human**.

### 03.1 — The reveal (su 8–10)
- 👤 The abstract system recedes to depth; from within it, the **real Ali** resolves — identity-validated per `07`, wardrobe signature intact — placed *inside* the system, not in a room. Plainly, honestly lit. Subtle real movement (a breath, a calm settle). Cinematic quality via light and composition, never via faking him.
- The environment behind him is the system we just watched him fix — data as atmosphere, at low intensity so he's the subject (Law: one subject per frame, `04`).
- 🖼 Copy, first person, present tense:
  > *I'm Ali. I build backends that fail safely.*
- 🔊 The sonic tone shifts — from "system" texture to a warmer, human register (still restrained).

### 03.2 — Who he is, honestly (su 10–12)
- 🖼 Three short, true lines (no inflation):
  > *Early-career backend engineer. NestJS, PostgreSQL, TypeScript.*
  > *I've worked on real ERP, inventory, payments, and auth systems.*
  > *I care most about the failures you can't see.*
- **Exit:** chapter card `THE PROOFS` rises. The system re-intensifies around him as we return to engineering.

---

## CHAPTER 04 — THE PROOFS

**Duration:** 10 su · su 12–22 · **Phase:** Trust (core) · **Job:** the motif — the *same philosophy* proven through different lenses. Two further proofs (concurrency was Chapter 01–02). Each is a **self-built, public demonstration** governed by `09`; **no private project internals appear.**

> Each proof renders the `09` skeleton on screen: **Problem → Constraint → Decision → Trade-off → Outcome → Lesson.** The *structure repeating* is itself the argument — a disciplined mind, viewed three times.

### Proof shot-grammar (identical for each — ~5 su each)

**Shot A — The Problem (1 su)** — near-black; one line naming an invisible failure in plain language (the *emotional* read). Micro-caps beneath: the proof's lens (`DATA INTEGRITY & SECURITY`, `SAFE MIGRATION`).

**Shot B — The Demonstration (2.5 su, pinned)** — 🧊⚙️ a self-built generic system animates the failure and the fix as the visitor scrolls, on the same diagram language as Chapter 01–02. Right-rail annotation steps through **Decision → Trade-off** (the *precise* read). 🔊 each proof has a small sonic beat echoing the commit/dissonance/resolution grammar. Optional `+ technical depth` layer (from `09`).

**Shot C — Outcome & Lesson (1.5 su)** — the demonstration recedes to a faint backdrop; the honest **Outcome** and the one-line **Lesson** land. **Credential line** (small, factual): *"Applied while working on a real ERP system"* — named as credit, **zero internals shown.**

### The two proofs

**Proof #2 — Security by default** (lens: data integrity & auth)
- Problem (emotional): *"A system that trusts its inputs is a system waiting to be broken."*
- Demonstration: a generic auth/validation flow where the safe path is the *default* — invalid or unauthorized states are unrepresentable, not merely checked. (Exact content: `09` §Proof-2; Ali to finalize real specifics.)

**Proof #3 — Safe migration** (lens: evolving a live system)
- Problem (emotional): *"Changing a running system is surgery on a patient who's awake."*
- Demonstration: a generic migration that evolves a schema without losing a row or breaking backward compatibility — audit, expand-migrate-contract, reversible steps. (Exact content: `09` §Proof-3; Ali to finalize.)

### Transitions between proofs (part of the 20% epic budget)
One decisive beat each: the outgoing demonstration's lines converge to a single point that streaks and detonates into the next Problem line. Repeated identically A→B — repetition makes it a **motif, not a trick** (`03` §6). 🔊 a single low pulse per transition.

**Exit:** chapter card `THE METHOD`.

---

## CHAPTER 05 — THE METHOD

**Duration:** 4 su · su 22–26 · **Phase:** Trust (consolidation) — aimed at Engineering Managers · **Job:** how he works. Convert "thinks well" into "works well with others."

### 05.1 — Operating principles (su 22–24)
- 🖼 A calm vertical run of short, true stances — each headline + two-line elaboration + one hairline micro-illustration that *explains* the idea (Law #1):
  1. **"I design for the engineer who inherits this."** — *Maintainability is empathy across time.*
  2. **"Constraints are the spec."** — *Real engineering happens inside limits, not despite them.*
  3. **"I fix the class of bug, not the instance."** — *One endpoint patched is a bug fixed; every path audited is a failure made impossible.* (Directly from the CedarERP concurrency story — earned, not borrowed.)

### 05.2 — Signals (su 24–26)
- 🖼 Concrete, verifiable signals for EMs — each one line + affordance: code-review philosophy, documentation habit, GitHub/open-source (the self-built demos live here as real, inspectable repos), and — if available and permitted — one attributed colleague line.
- **Anti-trope law:** no skill bars, no logo wall. Stack competence was shown *in context* inside the proofs.
- **Exit:** the light warms; card `THE PERSON`.

---

## CHAPTER 06 — THE PERSON

**Duration:** 3 su · su 26–29 · **Phase:** Trust (warmth) — the quietest chapter by design · **Job:** groundedness. Short; overstaying kills it.

### 06.1 — Off duty (su 26–28)
- 👤 One honest, natural moment of the real Ali away from the system — warmer register, the one place blacks lift slightly. Cyan absent from this chapter (its return in 07 lands harder).
- 🖼 Three short, true, first-person lines (Ali supplies): what he does off-keyboard · what he's learning now · one honest sentence about why he builds.

### 06.2 — The turn (su 28–29)
- The frame darkens back toward system-black; a single cyan point appears center and begins to grow with scroll. Anticipation. No copy. 🔊 a slow rising sub-tone.

---

## CHAPTER 07 — THE INVITATION

**Duration:** 3 su · su 29–32, then end-frame · **Phase:** Action · **Job:** one confident ask. Sanctioned epic beat.

### 07.1 — The address (su 29–31, pinned)
- The cyan point blooms to a brief full-frame light (the film's brightest single moment, ≤ 1.0s), resolving into:
- 👤 A final, closer, honest portrait of the real Ali inside the system — direct, calm. 🔊 one quiet resolve tone.
- 🖼 Three scroll-staged lines:
  1. *You've seen how I think.*
  2. *Let's talk about what you're building.*
  3. **[ START A CONVERSATION ]** — the film's only filled button (`04` §8).

### 07.2 — The ledger (su 31–32, free scroll)
Practical closing block, zero cinematic tricks (recruiters land here via Contact too, so it stands alone):
- **Email** (click-to-copy + mailto) · **optional scheduling link** · **availability** (*"Open to backend / software engineering roles — remote or [city]"*) · **GitHub · LinkedIn · résumé PDF** · response promise · timezone.

### 07.3 — End frame (su 32+)
- Black. The wordmark returns with the cyan underscore, and beneath it the thesis:
  > *"Prevent the invisible failures."*
- Footer micro-line: copyright, Index link, and a quiet, true `Built to be honest — [year]`. The experience closes where it opened.

---

## PERSISTENT LAYER — THE INDEX

From 01.1 onward, top-right, always:
- **Index (≡):** full-screen chapter menu over a dimmed frame; chapters as credits with progress ticks. Selecting smooth-scrolls the playhead (fast-forward, never a hard cut).
- **Contact:** jumps to 07.2 — the recruiter's 10-second path from anywhere.
- **Sound toggle:** enable/disable at any time; state persists.
- **Progress:** 1px cyan hairline along the top edge — the timecode.

---

## Sanctioned Epic Moments (the entire 20% budget — exhaustive)

| # | Location | Beat |
|---|---|---|
| 1 | 01.2 | The `-1` reveal + the dissonance (the failure lands) |
| 2 | 02.1 | The atomic collapse + sonic resolution (the fix lands) |
| 3 | 04, Proof #2→#3 transition | Converge → streak → detonation |
| 4 | 06→07 | Cyan bloom → full-frame light → the address |

Everything else is CALM (`03` §1).

---

## Dual-Legibility Ledger (every technical scene must pass both)

| Scene | Emotional read (non-engineer) | Precise read (engineer) |
|---|---|---|
| 01.2 | "Two people bought the last one; the count went negative — something's wrong" | Read-before-write race / lost update |
| 02.1 | "The wrongness is gone; it feels safe now" | Atomic conditional update in a txn + unrepresentable-negative constraint; all paths audited |
| 04 Proof #2 | "It won't trust bad input" | Security/validation by default; invalid states unrepresentable |
| 04 Proof #3 | "He can change a live system without breaking it" | Expand-migrate-contract, reversible, backward-compatible |

If either column is empty for any scene, the scene is not done.

---

## Mobile & Reduced-Motion Parity (adapt the *how*, never the *what*)

| Desktop | Mobile | Reduced-motion |
|---|---|---|
| Scroll-scrubbed race (01–02) | Same, simplified element count, portrait comp | Renders the key states as curated stills + captions; no scrub |
| Self-drawing demonstrations (04) | Fewer simultaneous strokes | Complete diagrams; captions step without line-draw |
| Author reveal (03) | Portrait-crop of the identity-validated asset | Static validated portrait + all copy |
| Epic beats 1–4 | Kept, ≤ 0.8s | 0.4s dissolves |
| System-render atmosphere (🧊) | Density halved | Removed |
| Sound | Same, off by default | Same; all audio has visual equivalent |

No chapter, copy line, proof, or contact affordance is ever absent on any device or preference.

---

## Scene → Asset Register (full specs in `05`, `06`, `09`)

| ID | Scene | Asset | Type |
|---|---|---|---|
| SYS-01 | 01–02 | Race-condition system render + interactive demo | 🧊⚙️ |
| SYS-02 | 04 | Proof #2 & #3 system renders + demos | 🧊⚙️ |
| HUM-01 | 03 | Author reveal (identity-validated) | 👤 |
| HUM-02 | 07 | Final address portrait | 👤 |
| HUM-03 | 06 | Human-beat moment | 👤 |
| GR-01 | 01–07 | Diagram/typographic system language | 🖼 |
| SND-01 | all | Phase-1 sound kit (5–8 sounds) incl. race-condition signature | 🔊 |
| CP-01 | all | Final copy deck (this doc = working draft) | text |
| PRF-01 | 02,04 | Proof content (source of truth) | `09` |
| DOC-01 | 07.2 | Résumé PDF | file |

---

*End of Storyboard v2. su timings binding for planning (±15% tuning with Producer sign-off). Copy in quotes is working draft; final pass after Ali finalizes Proof #2/#3 and the Chapter 06 human lines.*
