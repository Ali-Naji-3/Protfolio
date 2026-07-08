/**
 * Copy deck (CP-01) — every line mapped to a storyboard scene ID.
 * Source of truth: docs/production/02-storyboard.md (working draft) and
 * docs/production/09-engineering-proofs.md (proof content).
 *
 * RULES:
 *  - Components render copy from here, never inline strings, so the final
 *    copy pass (05 §7) touches one file.
 *  - Lines marked TODO(ali) await real content and MUST NOT be invented.
 */
import { SITE } from '@config/site';

export const COPY = {
  /* ── 00 · Enter ─────────────────────────────────────────────── */
  enter: {
    /* Cold open (10 §rule-1): two timed cards over black, then the name.
       Both lines are literally true — that is why they work. */
    coldOpen: ['What follows is a true story.', 'It happened inside a backend system.'],
    soundInvitation: 'Experience available with sound',
    soundEnable: 'Enable',
    soundDecline: 'Continue without sound',
  },

  /* ── 01 · The Anomaly ───────────────────────────────────────── */
  anomaly: {
    stockLabel: 'STOCK',
    orderA: 'ORDER A',
    orderB: 'ORDER B',
    reveal: 'Two customers. One item. The system sold both.',
    hold: "This is the kind of failure no one sees — until it's too late.",
    identity: `${SITE.name}`,
    identityRole: 'SOFTWARE ENGINEER · BACKEND',
    scrollCue: 'SCROLL',
  },

  /* ── 02 · The Correction ────────────────────────────────────── */
  correction: {
    thesis: SITE.thesis,
    depthAffordance: '+ How I actually fixed this',
    demoHint: 'Run the race yourself — then toggle the fix.',
  },

  /* ── 03 · The Author ────────────────────────────────────────── */
  author: {
    intro: "I'm Ali. I build backends that fail safely.",
    facts: [
      'Early-career backend engineer. NestJS, PostgreSQL, TypeScript.',
      "I've worked on real ERP, inventory, payments, and auth systems.",
      "I care most about the failures you can't see.",
    ],
  },

  /* ── 05 · The Method ────────────────────────────────────────── */
  method: {
    principles: [
      {
        headline: 'I design for the engineer who inherits this.',
        elaboration: 'Maintainability is empathy across time.',
      },
      {
        headline: 'Constraints are the spec.',
        elaboration: 'Real engineering happens inside limits, not despite them.',
      },
      {
        headline: 'I fix the class of bug, not the instance.',
        elaboration:
          'One endpoint patched is a bug fixed; every path audited is a failure made impossible.',
      },
    ],
    signalsTitle: 'Signals',
    // TODO(ali): code-review philosophy line, doc-habit line,
    // optional attributed colleague quote (05 §7).
    signals: [
      { label: 'GitHub', href: 'https://github.com/Ali-Naji-3' },
    ],
  },

  /* ── 06 · The Person ────────────────────────────────────────── */
  person: {
    // TODO(ali): the 3 true lines — off-keyboard / learning now / why he
    // builds (05 §7). Placeholders are structural, clearly marked, and
    // must be replaced before launch.
    lines: [
      '[Off-keyboard line — supplied by Ali]',
      '[Currently-learning line — supplied by Ali]',
      '[Why-he-builds line — supplied by Ali]',
    ],
  },

  /* ── 07 · The Invitation ────────────────────────────────────── */
  invitation: {
    address: ["You've seen how I think.", "Let's talk about what you're building."],
    cta: 'Start a conversation',
    copied: 'COPIED',
    endThesis: 'Prevent the invisible failures.',
    footer: `Built to be honest — ${new Date().getFullYear()}`,
  },
} as const;
