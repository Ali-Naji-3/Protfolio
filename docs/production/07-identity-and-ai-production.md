# 07 — Identity & AI Production Protocol

**Project:** ALI NAJI — Cinematic Personal Brand Platform
**Version:** 2.0 (new in v2)
**Inherits from:** `01` (Core Laws #3 and #4)
**Audience:** anyone producing or approving a visual asset that depicts Ali, and anyone operating Higgsfield. This document is a **governance contract**, not a style guide. It has veto power over any human asset.

---

## 1. Why This Document Exists

The entire project's currency is **truth**. We deliberately killed the "staff engineer in a luxury lobby" because cinematic grandeur amplifies whatever is real, and a false impression collapses credibility. The same risk lives in AI imagery: a synthetic or idealized "Ali" would (a) read as fake even when it isn't, and (b) create a gap between the face on the site and the face that walks into the interview — and that gap costs the interview.

So we adopt one governing standard, ratified in the strategy interview:

> **The story must be true. The visuals must look like the real Ali.**

Engineering claims are 100% real (Law #3). AI-produced imagery is permitted for cinematic quality on a small budget — **only** when the person depicted is unmistakably the real Ali.

---

## 2. The Identity Integrity Protocol (binding)

### 2.1 Ground truth
- The **only** source of identity truth is Ali's **real, unedited photographs** — anchored by the **HUM-00 identity package** (`05` §3.1): front, left 45°, right 45°, side profile, full body, neutral expression, natural light, no filter, no AI.
- The polished cinematic reference image (the one with the Higgsfield watermark) is **NOT ground truth.** It establishes *wardrobe, proportions, and intent only.* It is validated against HUM-00 like any other generated asset.

### 2.2 What AI may change — and what it may never touch
| AI MAY improve | AI must NEVER change |
|---|---|
| Lighting | Facial identity |
| Atmosphere | Eye shape |
| Composition & framing | Jawline |
| Environment (place him in the system world) | Nose |
| Cinematic quality / grade | Hairline & hairstyle |
| Color & mood | Natural skin texture |
| | Age (no older, no younger) |
| | Body proportions / build |

**No beautification. No stylization of the face. No idealization.** If Ali stood next to the asset, a stranger must say *"same person, obviously"* — not *"…is that him?"*

### 2.3 Wardrobe signature (preserve)
Black suit · white T-shirt · white sneakers · silver watch. This is Ali's visual constant across assets. (Wardrobe is *preserved*; the luxury-lobby *environment* it originally appeared in is retired.)

---

## 3. The Production & Validation Workflow

Every human asset (HUM-01/02/03) follows this loop. **No step may be skipped.**

```
1. START from a real photo of Ali (verified against HUM-00).
2. GENERATE / REFINE in Higgsfield — improve light, atmosphere, place in the system world.
3. VALIDATE against HUM-00 (see §4).
        ├─ Unmistakably the real Ali?  → PASS → refine to master → export (05)
        └─ Any identity drift?         → REJECT → regenerate (back to step 2)
4. NEVER deploy an unvalidated human asset.
```

**Standing instruction to the producer (Ali's words, adopted):**
> *"If at any point a generated asset no longer looks unmistakably like me, reject it immediately and regenerate it."*

This is not a soft preference — it is a hard gate with veto power (`05` §8 Identity Gate).

---

## 4. The Validation Checklist (run on every human asset)

Hold the candidate beside the HUM-00 package and confirm — **all must pass:**

- [ ] **Eyes:** shape, spacing, lids match
- [ ] **Nose:** bridge, width, tip match
- [ ] **Jaw & chin:** line and proportion match
- [ ] **Hairline & hairstyle:** match
- [ ] **Skin:** natural texture retained (not airbrushed to plastic)
- [ ] **Age read:** same as real (not idealized younger/older)
- [ ] **Build & proportions:** realistic, match full-body reference
- [ ] **Wardrobe:** black suit / white tee / white sneakers / silver watch present and correct
- [ ] **Expression:** calm, confident, approachable — authentic, not posed-perfect
- [ ] **The stranger test:** would someone who's met Ali say "obviously him"?

Any unchecked box → **reject and regenerate.** Log the reason (`05` MANIFEST).

---

## 5. Higgsfield Usage Rules

| Rule | Detail |
|---|---|
| Scope: allowed | The **world and systems** (atmosphere, backplates, the system environment), and **refining real photos of Ali** within the identity constraints above |
| Scope: forbidden | Inventing a face; animating a face in ways that distort identity; generating "Ali" from prompt alone with no real-photo anchor; any output that fails §4 |
| Credits | Plus plan, ~110 credits — spend deliberately; validation-reject-regenerate can consume credits, so batch and review |
| Reference discipline | Always seed with the real photo / HUM-00; never rely on the polished reference image as the sole seed |
| Output archive | Every accepted asset's generation settings recorded in `05` MANIFEST for reproducibility |
| Confidentiality | Higgsfield prompts must never contain proprietary project details (Law #4) |

---

## 6. Confidentiality Protocol (Law #4 — absolute)

Applies to **all** production, not just imagery:

1. **Default = confidential.** Every detail of CedarERP, Invoverse, or any client/employer work is confidential unless Ali has **explicit written permission** to publish it.
2. **Never published:** proprietary code, architecture diagrams, database schemas, business logic, internal docs, client/company identifying details.
3. **Permitted:** the *class* of problem and the *engineering thinking*, demonstrated on **self-built generic systems** (`09`, `05` §5), plus a factual **credential line** ("applied while working on a real ERP system") with zero internals.
4. **The discipline is part of the demonstration.** A portfolio that respects confidentiality proves the engineer can be trusted with systems — reinforcing the thesis. Leaking would refute it.
5. **The Confidentiality Gate** (`05` §8) can block any asset outright and is not advisory.

---

## 7. Governance Gates (where this document has veto)

| Gate | Location | Power |
|---|---|---|
| Identity Gate | `05` §8, `04` §10 | Blocks any human asset failing §4 |
| Confidentiality Gate | `05` §8 | Blocks any asset carrying proprietary content |
| Honesty principle | `01` Law #3 | Governs whether AI imagery may be used at all for a given asset |

---

*End of Identity & AI Production Protocol v2. This document governs truth in the project. When it conflicts with any aesthetic goal, this document wins.*
