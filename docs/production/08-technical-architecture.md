# 08 — Technical Architecture

**Project:** ALI NAJI — Cinematic Personal Brand Platform
**Version:** 2.0 (new in v2)
**Inherits from:** `01` (Law #2: the medium is the argument), `03` (motion/perf), `05` (assets)
**Audience:** the senior frontend engineer building the site. This closes the render/SEO/accessibility/analytics/stack decisions the strategy interview deferred to defaults. Recommendations, not prescriptions — but the *requirements* are binding.

**Guiding principle (Law #2):** the site's own engineering *is* the proof that Ali is a good engineer. A slow, inaccessible, or un-crawlable portfolio refutes the thesis louder than any copy affirms it. **Build this like the system it describes: correct, fast, and designed for the maintainer.**

---

## 1. Rendering Strategy (binding requirement)

**The content must be server-rendered.** Every claim, proof caption, principle, and contact detail exists in the initial HTML **without JavaScript.** Animation is *progressive enhancement* over already-present content.

Why this is non-negotiable:
- **SEO / discoverability:** a portfolio must be found. Content injected only on scroll is invisible to crawlers.
- **Shareability:** recruiters share links; the target must render meaningfully server-side.
- **Resilience & accessibility:** the story survives JS failure, slow connections, and assistive tech.
- **The thesis:** a backend engineer who ships a client-only SPA with no SSR undercuts his own "systems" claim.

**Recommended stack:** **Astro** (islands architecture — ships near-zero JS by default, server-renders content, hydrates only the interactive islands: the system renders, demos, sound, scroll orchestration). Next.js (App Router, RSC) is an acceptable alternative if the team prefers React throughout. **Decision owner: the build engineer**; either satisfies the requirement.

- Animation libraries (GSAP, ScrollTrigger, Lenis, Three.js) load only for the interactive islands, lazily, after content paint.
- The interactive demonstrations (`05` §5) are self-contained islands; their fallback static diagrams are server-rendered.

---

## 2. Performance Budget (binding)

| Metric | Target |
|---|---|
| First meaningful paint (content + hero poster) | < 2.5s on 4G |
| Transfer for first meaningful paint | ≤ 1.5 MB (`05` §9) |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.05 |
| Interaction to Next Paint | < 200ms |
| Animation frame rate | 60fps mid-tier; ≥ 50fps in scrub scenes (`03` §9) |
| Total JS (initial) | Minimized via islands; animation libs deferred |
| Fonts | ≤ 220 KB WOFF2, subset (`04` §3.1), `font-display: swap` with metric-compatible fallback |
| Audio | ≤ 300 KB, lazy after Enable (`06`) |

**Loading orchestration:** cold open + first content paint first; hero system render hydrates next; human assets and later chapters lazy-load on approach; audio only after Enable. On slow connections the cold open never blocks past its 3.5s cap — content is already in the HTML.

---

## 3. Accessibility (binding — WCAG 2.1 AA minimum)

The scrubbed, pinned narrative must be fully usable without a mouse, without motion, and without sound.

| Requirement | Spec |
|---|---|
| Semantic DOM | Proper landmarks + heading hierarchy; reading order is logical and **independent of scroll position** — a screen reader linearizes the whole story top to bottom |
| Content parity | 100% of information present without scroll-driven reveal (reveal is enhancement); every proof has a static, labeled equivalent |
| Keyboard | Full operation: Index chapter nav, CTA, ⚙️ demos, sound toggle, depth overlays. Visible focus (`04` §8). No focus traps in pins; depth overlays are proper focus-trapped modals with Esc |
| Skip link | "Skip to content" and quick access to Contact from the top |
| Reduced motion | `prefers-reduced-motion` first-class edition (`03` §10) — content parity, no penalty |
| Sound | Off by default; every sound has an on-screen visual equivalent; visible mute state (`06`) |
| Media | Human assets have descriptive alt; decorative system atmosphere is `aria-hidden` |
| Color | Never the sole information carrier (the failure is also labeled `-1`, not only warn-colored) |
| Contrast | AA against actual backgrounds, including over renders (`04` §2.4) |

---

## 4. SEO, Metadata & Deep-Linking

| Requirement | Spec |
|---|---|
| Per-chapter URLs | Stable fragment/route per chapter so a recruiter can share "the concurrency demo," not just the homepage |
| Per-chapter OG/Twitter meta | Each shareable section has its own preview image (`05` MD-01) + title/description |
| Structured data | `Person` + `WebSite` schema.org JSON-LD (name, job title = Software Engineer, sameAs: GitHub/LinkedIn) |
| Title/description | Honest, keyword-sane ("Ali Naji — Backend Software Engineer"), no stuffing |
| Sitemap / robots | Present; nothing important disallowed |
| Canonical | Single canonical URL; www/non-www + trailing-slash normalized |
| Résumé | DOC-01 linked and crawlable |

---

## 5. Analytics & Measurement (privacy-respecting)

The KPI is conversion ("I want to interview this engineer"); you can't tune what you don't measure.

- **Tooling:** privacy-first, cookieless, no PII (e.g. Plausible, Fathom, or self-hosted equivalent). No invasive tracking on a trust-based site.
- **Events:** scroll depth / chapter completion, `Enable sound` rate, `+ technical depth` opens, ⚙️ demo interactions, CTA clicks, résumé downloads, email copies.
- **Purpose:** find the drop-off, learn whether the proofs land, measure whether the ask converts. Review, then tune.

---

## 6. Browser & Device Support

| Tier | Support |
|---|---|
| Baseline | Latest 2 versions of Chrome, Safari, Firefox, Edge (desktop + mobile) |
| Full experience | Modern engines with WebGL + good scroll perf |
| Graceful degradation | Older/low-power: degradation ladder (`03` §9); reduced-motion edition; static proof diagrams. **Content and contact never degrade** |
| Media formats | AVIF/WebP with JPEG fallback (posters); short human loops H.264 with HEVC/AV1 twins where decoded; **feature-detect, never assume** AV1/HEVC decode |
| No-JS | Full content, all copy, all proofs (static), contact — everything but the animation |

---

## 7. Hosting, Build & Ops

| Concern | Recommendation |
|---|---|
| Hosting | Static/edge (Vercel, Netlify, or Cloudflare Pages) — global CDN, instant TLS, preview deploys |
| Domain | A clean personal domain; enforce HTTPS + HSTS |
| CI | Lint + typecheck + Lighthouse/perf budget check on PR (the site should pass its own quality gate — Law #2) |
| Assets | Immutable, content-hashed, long-cache; images responsive `srcset` |
| Repo hygiene | **No proprietary content, ever** (Law #4). Demos are original, publishable. `.gitignore` masters |
| Error/empty states | Graceful offline/slow states; the cold open never hangs past its cap |
| Privacy | Minimal data, clear (short) privacy note if analytics used |

---

## 8. Definition of "Well-Built" (the medium is the argument)

Before launch, the site must pass the standard Ali would hold his own code to:
1. **Lighthouse:** Performance, Accessibility, Best-Practices, SEO all ≥ 95.
2. **Keyboard-only walkthrough:** the entire story + contact reachable, no traps.
3. **Screen-reader walkthrough:** the narrative linearizes coherently; proofs are comprehensible.
4. **No-JS walkthrough:** all content and contact present.
5. **Slow-4G walkthrough:** content fast; enhancement arrives progressively; nothing hangs.
6. **Repo audit:** zero proprietary bytes; demos original and clean.

If the site doesn't pass the bar Ali sets for production systems, it refutes his thesis. It must pass.

---

*End of Technical Architecture v2. Requirements binding; stack recommendations are the build engineer's to finalize within them.*
