# 05 — Assets Pipeline

**Project:** ALI NAJI — Cinematic Personal Brand Platform
**Version:** 2.0
**Inherits from:** `02` (asset register), `03` (render standard), `04` (art direction), `06` (sound), `07` (identity + AI), `09` (proof content)
**Audience:** production coordinator, designer, the person operating Higgsfield, and the build team. This is the contract for **every asset**: how it's captured/produced, processed, named, delivered, and what its fallback is.

**What changed from v1:** no film shoot, no film crew, no luxury location. Human assets are **real photography of Ali** (identity package) refined under the **Identity Integrity Protocol** (`07`); world/system assets are **rendered in code and/or produced via Higgsfield**; the Trust content is **self-built interactive demonstrations** owned by Ali. Nothing proprietary ever enters the pipeline.

---

## 1. Pipeline Overview

```
CAPTURE/AUTHOR ─▶ VALIDATE ─▶ REFINE ─▶ MASTER ─▶ EXPORT ─▶ QA ─▶ DELIVER ─▶ build
      │              │           │         │         │        │
  real photos    Identity     Higgsfield  archive  web vars  gates
  code demos     Integrity    / grade              (§3–§6)  (§8)
  Higgsfield     Protocol(07)
```

**Immutable rules:**
1. **Identity is validated before anything else happens to a human asset.** No refinement, no placement, no export until it passes `07`.
2. **Master once, derive many.** Everything mastered at maximum quality; web variants derive from masters.
3. **Every asset ships with its fallback** (poster/static/reduced-motion/muted) in the same batch.
4. **Nothing proprietary.** Confidentiality gate (§8) blocks any asset carrying client architecture, schema, code, or business rules.

---

## 2. Asset Register

| ID | Asset | Scene | Priority | Source |
|---|---|---|---|---|
| HUM-00 | **Ground-truth identity package** (front / 45°L / 45°R / profile / full-body / neutral) | reference | **P0 — everything human depends on it** | Real phone photography |
| HUM-01 | Author reveal (validated portrait/clip) | 03 | P0 | Real photo → Higgsfield refine (`07`) |
| HUM-02 | Final address portrait | 07 | P0 | Real photo → Higgsfield refine |
| HUM-03 | Human-beat moment | 06 | P1 | Real photo → light refine |
| SYS-01 | Race-condition system render | 01–02 | **P0 — the hook** | Code render (SVG/canvas/WebGL) |
| SYS-02 | Proof #2 & #3 system renders | 04 | P0 | Code render |
| DEMO-01 | Interactive race-condition demo (self-built) | 02/04 | P0 | Ali's original code |
| DEMO-02/03 | Interactive auth & migration demos | 04 | P1 | Ali's original code |
| GR-01 | Diagram/typographic system language kit | all | P0 | Design |
| SND-01 | Phase-1 sound kit (5–8 sounds) | all | P1 | `06` |
| TY-01 | Licensed font package | all | P0 | Licensing |
| CP-01 | Final copy deck | all | P0 | Copy (draft in `02`) |
| PRF-01 | Proof content (source of truth) | 02,04 | P0 | `09` (Ali supplies real specifics) |
| DOC-01 | Résumé PDF | 07.2 | P1 | Ali |
| MD-01 | Favicon / OG / per-chapter social meta | meta | P2 | Design (`08` deep-linking) |

---

## 3. Human Assets — Real Photography + AI Refinement

**Governed end-to-end by `07` (Identity Integrity Protocol). This section covers capture and delivery only.**

### 3.1 HUM-00 — the ground-truth identity package (do this first, this week)
Real phone photography, natural light, no filter, no AI:
| Shot | Purpose |
|---|---|
| Front portrait | Primary identity anchor |
| Left 45° / Right 45° | Structure, asymmetry |
| Side profile | Nose/jaw/ear geometry |
| Full body | Proportions (wardrobe signature) |
| Neutral expression | The verification baseline |

- Even, soft light (window + one lamp is enough); plain background; wardrobe signature where possible.
- **This package is the reference every future asset is validated against — it is the truth, not a substitute for it.**

### 3.2 HUM-01/02/03 — cinematic human assets
- Start from a real photo of Ali. Higgsfield may improve **light, atmosphere, composition, and place him inside the system world** — never his identity/proportions (`07`).
- **Validation gate before use:** hold the output beside HUM-00. Unmistakably the same person → proceed. Any drift (jaw, hairline, nose, eyes, age, build) → **reject and regenerate.** No exceptions.
- Delivery: still (AVIF + WebP + JPEG chain, 3 sizes) and, where a living portrait is used, a ≤ 4s loop (H.264 + HEVC/AV1 twin, ≤ 1.5 MB) + poster.
- **Fallback:** validated static portrait. The story never depends on a human clip playing.

### 3.3 Honesty boundary (hard)
- The person on screen is always unmistakably the real Ali. No idealization: no sharper jaw, no changed hairline, no older/younger, no altered build.
- **Concrete reason (not morality — mismatch):** the face on the site must equal the face that walks into the interview. Any gap costs the interview.

---

## 4. System Renders (🧊 SYS-01/02)

Built primarily **in code** (the medium is the argument — Law #2 — so the system is *actually* engineered, not faked video). Higgsfield may produce supporting **atmospheric textures/backplates** only.

| Rule | Spec |
|---|---|
| Technique | Scroll-driven SVG/canvas/WebGL per `03` §5; ≥ 12 legible states across the race sequence |
| Art direction | `04` §5/§6 — system as landscape, ≤ 9 components, orthogonal, warn only for genuine failure |
| Performance | `03` §9 budgets; adaptive point counts; reduced-motion static states |
| Bidirectional | Beautiful backwards (Playhead Check) |
| Fallback | Curated static states (failure + fix as two labeled stills) carry 100% of meaning |
| Proprietary check | Generic abstractions only; no client topology (§8) |

---

## 5. Interactive Demonstrations (⚙️ DEMO-01/02/03)

The Trust content. **Original code written by Ali specifically for this site, owned entirely by him.** These are real, inspectable, public artifacts — they *are* the proof, and they solve the "un-demoable private project" problem.

| Rule | Spec |
|---|---|
| DEMO-01 (race condition) | A generic inventory where the visitor triggers concurrent orders and watches overselling, then toggles the atomic fix and watches zero-rows-affected prevent it. Minimal, self-contained |
| DEMO-02 (security by default) | A generic flow where the safe/valid path is the default; unsafe states unrepresentable |
| DEMO-03 (safe migration) | A generic schema evolving without data loss / breakage (expand-migrate-contract, reversible) |
| Ownership | 100% Ali's original work; publishable as open-source repos (also serve Chapter 05 "Signals") |
| Confidentiality | Zero proprietary logic, schema, or naming from CedarERP/Invoverse. Generic domains only |
| Accessibility | Keyboard-operable, screen-reader labeled, reduced-motion aware (`08`) |
| Fallback | A static annotated diagram of the same demonstration (never interactive-only) |
| Content source | `09-engineering-proofs.md` (Ali finalizes Proof #2/#3 specifics) |

---

## 6. Graphics, Type, Sound

- **GR-01:** SVG, hand-optimized, layers/groups named to animation beats (`node-stock`, `pulse-order-a`) — naming is the animation interface. Desktop (≤9 components) + authored mobile (≤6) editions. Failure/fix states delivered as discrete authored states.
- **TY-01:** license web use for chosen superfamily (`04` §3.1); subset to used cuts; WOFF2 only; total ≤ 220 KB; metric-compatible fallback stack for the unstyled flash.
- **SND-01:** the Phase-1 sound kit, fully specified in `06` (5–8 sounds incl. the race-condition signature). Delivered as web-optimized audio + a silent-experience guarantee (every sound has a visual equivalent).
- **MD-01:** per-chapter OG images (`08` deep-linking) + favicon from the cyan-underscore wordmark; dark-scheme aware.

---

## 7. Content Collection from Ali (blocking inputs)

Collect **before** finalizing 04 (Proofs) and 06 (Person). Deliverable feeds `09` and `CP-01`.

**Proof #1 — Concurrency (DONE — captured in interview, written up in `09`).** Ali to confirm the idempotency/retry detail if it exists (optional depth flourish).

**Proof #2 — Security by default:**
- [ ] The real class of problem (input trust / auth boundary) in plain + precise terms
- [ ] The decision, the trade-off, the honest outcome, the one-line lesson (`09` skeleton)
- [ ] The generic demonstration spec (what DEMO-02 shows)
- [ ] Credential line: which real project it was applied in (named only, zero internals)

**Proof #3 — Safe migration:** same skeleton + DEMO-03 spec + credential line.

**Chapter 05 (Method):** code-review philosophy line · doc-habit line · GitHub/repos links · optional attributed colleague quote (with permission).
**Chapter 06 (Person):** 3 true lines (off-keyboard / learning now / why he builds).
**Chapter 07:** email, availability line, city/timezone, links, DOC-01 résumé PDF, optional scheduling link.

**Confidentiality clearance (every item):** confirm it exposes nothing proprietary. Default = confidential unless Ali explicitly clears it.

---

## 8. QA Gates (per asset, before delivery)

1. **Identity Gate (human assets):** validated against HUM-00 per `07`; any drift → reject/regenerate.
2. **Confidentiality Gate (all assets):** no proprietary code, architecture, schema, business rule, or identifiable client system. Generic/self-built only. *(This gate can block a whole asset — it is not advisory.)*
3. **Clarity Gate (Law #1):** the asset explains an engineering idea; reviewer can name it.
4. **Art-direction Gate:** matches `04` §5/§6 on a calibrated display *and* a cheap laptop (the black-crush killer).
5. **Weight Gate:** within payload budget (§9); over-budget returns to export, never ships "temporarily."
6. **Fallback Gate:** poster/static/reduced-motion/muted counterpart present and correct.
7. **Rights Gate:** fonts licensed; any real person released; résumé cleared.

---

## 9. Naming, Structure, Budgets

```
/assets
  /identity   HUM-00_front.jpg  HUM-00_profile.jpg  …   (ground truth — NEVER deployed; reference only)
  /human      HUM-01_author_validated.avif (+ .webp/.jpg)   HUM-01_author_loop_h264.mp4
  /system     SYS-01_race_states.svg     (code render assets live in the app repo)
  /demos      (DEMO-* are code in the app repo, not binary assets)
  /img        GR-01_diagram-language.svg     MD-01_og_ch01.png
  /fonts      TY-01_[family]-display-500.woff2
  /audio      SND-01_commit.  SND-01_dissonance.  SND-01_resolve.  …
  /docs       DOC-01_ali-naji_resume.pdf
  /masters    (cold storage, never deployed) + MANIFEST.md
```
- Pattern: `{ID}_{descriptor}_{variant}.{ext}` — lowercase, hyphens.
- **Payload budgets (hard):** initial hero (system render is code, so this is mostly JS/CSS + one poster) ≤ **1.5 MB** transfer for first meaningful paint; each human still ≤ 400 KB; human loops ≤ 1.5 MB (lazy-loaded on chapter approach); total human payload ≤ 6 MB desktop / 3.5 MB mobile; Phase-1 audio kit ≤ 300 KB total, lazy-loaded only after Enable.
- Masters in cold storage with `MANIFEST.md` (identity-validation record, refine settings, export settings). Web filenames stable; cache-busting is the build's job.

---

## 10. Delivery Manifest (definition of done)

Pre-production assets phase complete when the build team receives:
- [ ] HUM-00 identity package captured and archived as ground truth
- [ ] All P0/P1 assets per §9, each having passed all §8 gates (Identity + Confidentiality especially)
- [ ] DEMO-01 spec finalized (DEMO-02/03 specs pending Proof #2/#3 content)
- [ ] `MANIFEST.md` — per asset: ID, variants, sizes, checksums, fallback mapping, identity-validation note, license/rights notes
- [ ] `CP-01` final copy deck (every line mapped to a scene ID, display breaks authored)
- [ ] `SND-01` Phase-1 kit per `06`
- [ ] Open-questions log (owner + decision date)

---

*End of Assets Pipeline v2. This document + the others constitute the complete production package. Build may begin when §10 is satisfied — and not one proprietary byte enters the repository.*
