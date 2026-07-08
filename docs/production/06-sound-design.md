# 06 — Sound Design

**Project:** ALI NAJI — Cinematic Personal Brand Platform
**Version:** 2.0 (new in v2)
**Inherits from:** `01` (Constitution, Core Laws), `02` (scenes), `03` (motion sync)
**Audience:** sound designer + the engineer wiring audio. Defines the sonic identity; no code.

---

## 1. Sound Philosophy

**"Interacting with a living system — not watching a trailer."**

Sound follows the exact same law as everything else: **calm, precise, intentional.** It is *precision sound design, never music.* No orchestral score, no cinematic trailer bed, no emotional manipulation. The audio's only job is to let the visitor *hear the system* — and to make one engineering moment (the race condition) as satisfying to hear as it is to see.

**Core Law #7 governs here: silence is a material.** The moments without sound are as designed as the moments with it. Restraint is the instrument.

**Core Law #1 governs here too:** every sound must explain or reinforce an engineering idea (a commit, a fault, a resolution). A sound that decorates nothing is cut.

---

## 2. The Non-Negotiables

1. **In, but optional, and OFF BY DEFAULT.** Browsers block autoplay audio; sound may only begin after the visitor enables it. The site opens silent with a quiet invitation:
   ```
   Experience available with sound
   [ Enable ]
   ```
2. **The muted experience is 100% complete.** Every meaning carried by sound is *already* carried by the visuals (Law: dual legibility; accessibility). Sound *enhances*; it never *informs alone.*
3. **No music.** Not now, not in Phase 2. If it ever feels like a soundtrack, it has failed.
4. **Reduced-motion cousin:** treat `prefers-reduced-motion` users as audio-conservative — never auto-anything; the Enable invitation is the only entry.

---

## 3. The Sonic Identity (palette)

A restrained kit of textures — the "voice" of the system:

| Element | Character |
|---|---|
| **System ambience** (Phase 2 only) | Soft, low, spatial — the system "breathing." Barely-there |
| **Interface interactions** | Clean, dry, mechanical-precise — a well-machined click, not a UI "boop" |
| **Data / transitions** | Light electronic pulses; gentle, weighted movements |
| **The signature (race condition)** | The one emotionally-loaded sequence — see §4 |
| **Silence** | Deliberate. The held breath on the `-1`; the pause before the thesis |

**Tonal rules:** subtle, spatial, mechanical precision, low-mid emphasis (nothing shrill), generous headroom (nothing loud), and *space* — every sound is short and gives way to silence.

---

## 4. The Sonic Signature — The Race Condition

This is the one place sound does real narrative work. It must make a non-engineer *feel* wrongness with zero words, and resolve satisfyingly when Ali fixes it. Synced frame-for-frame with Motion Bible §6 Beats 1–2.

```
ORDER A commits   →  clean confirmation tone        (correct, expected)
ORDER B commits   →  identical confirmation tone     (still feels correct…)
        ── brief silence ──                           (the held breath)
STOCK ticks to -1 →  the DISSONANCE                   ("something is wrong")
```

- **Confirmation tone:** clean, short, satisfying — the sound of a successful commit. Both orders get the *identical* tone (that sameness is the trap: nothing warned us).
- **The dissonance:** NOT an alarm. A subtle, unmistakable wrongness — a detuned partial, an inharmonic beat, a tension that the body reads as "off" before the mind knows why. Quiet. Just enough.
- **The resolution (Chapter 02):** when Ali collapses the flow into the atomic update and the second order fails safely, the dissonance **resolves** — one clean, settled tone. *The engineering solution is sonically satisfying.* Question → answer.

**This single question-and-answer (fault → resolution) is the audio thesis in miniature: the invisible failure, heard and then healed.**

---

## 5. Phase-1 Sound Kit (5–8 sounds — ship this, nothing more)

De-risks launch: minimal, high-quality, **no ambient loop, no music.**

| # | Sound | Trigger | Notes |
|---|---|---|---|
| 1 | **Enable** | Sound turned on | A quiet confirming breath — the system "comes alive." Sets the tonal contract |
| 2 | **Commit tone** | Each order commits (01.2); reused as a general "success/confirm" | The clean confirmation |
| 3 | **Dissonance** | The `-1` fault (01.2); one proof fault (04) | The signature wrongness |
| 4 | **Resolution** | The atomic fix (02.1); proof fixes | The satisfying resolve |
| 5 | **Transition pulse** | Chapter / proof transitions (epic beats 3) | Single low pulse |
| 6 | **Interface tick** | Links, Index open, demo controls | Dry, precise, mechanical |
| 7 | **Reveal tone** | Author reveal (03) / final address (07) | Warmer register shift |
| 8 | **Bloom resolve** *(optional)* | Beat 4 finale (06→07) | One quiet, confident resolve |

Sounds 1–7 are the committed set; 8 is optional if budget allows. **Total audio payload ≤ 300 KB**, lazy-loaded only after Enable (`05` §9).

---

## 6. Phase 2 (only after the site itself feels complete)

- A **subtle spatial ambient layer** — the system's low "breathing," barely perceptible, phased to the 6s idle rhythm (`03` §3).
- Possibly light spatialization (stereo/positional) of data-flow pulses.
- Added **only if** the experience genuinely benefits. If Phase 1 already feels complete, Phase 2 is not built. Less, but unforgettable.

---

## 7. Technical & UX Rules (for the build)

| Rule | Spec |
|---|---|
| Autoplay | Never. Audio context is created/resumed **only** on the Enable gesture |
| Default | Off. State persists across the session (and is remembered on return) |
| Toggle | Always available in the persistent chrome (`02` Index layer); toggling is instant and silent-safe |
| Formats | Web-optimized (e.g. AAC/Opus) with a broadly-decodable fallback; short buffers, preloaded after Enable |
| Latency | Interaction sounds must fire < 50ms after their event or they feel detached |
| Mixing | Generous headroom; no sound approaches "loud"; the dissonance is *unsettling by tone, not volume* |
| Accessibility | Every sound has a visual equivalent already on screen; nothing is audio-only; respects reduced-motion conservatism; a visible mute state |
| Performance | Audio must never cost frames during scrub scenes; decode/schedule off the main render path |

---

## 8. Sound Review Gates

1. **The Music Test:** does any moment feel like a soundtrack or trailer? If yes — cut or redesign.
2. **The Mute Test:** turn it off — is the experience still 100% complete and legible? It must be.
3. **The Clarity Test (Law #1):** name the engineering idea each sound reinforces. Nameless sounds are cut.
4. **The Signature Test:** does the fault→resolution sequence make a non-engineer *feel* wrong, then satisfied, with no words?
5. **The Silence Test:** are the designed silences (the held breath, the pre-thesis pause) intact and respected?

---

*End of Sound Design v2. Phase-1 kit is the launch commitment; Phase 2 is conditional. "Less, but unforgettable."*
