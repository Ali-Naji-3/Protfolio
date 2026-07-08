/**
 * Engineering proofs content — 1:1 from docs/production/09-engineering-proofs.md.
 * Proof #1 is complete (interview-sourced). Proofs #2/#3 are APPROVED
 * SKELETONS: fields marked pending render as clearly-labeled structure,
 * never invented content (Producer directive: accuracy over completeness).
 */

export interface ProofStep {
  label: 'Problem' | 'Constraint' | 'Decision' | 'Trade-off' | 'Outcome' | 'Lesson';
  text: string;
  /** True while awaiting Ali's real technical details. */
  pending?: boolean;
}

export interface Proof {
  id: string;
  num: string;
  title: string;
  lens: string;
  /** The emotional read — lands with zero technical words (dual legibility). */
  emotionalRead: string;
  steps: ProofStep[];
  credential: string;
  /** Long-form depth layer for engineers (opt-in overlay). */
  depth?: string[];
  complete: boolean;
}

export const PROOFS: Proof[] = [
  {
    id: 'concurrency',
    num: '01',
    title: 'Preventing Overselling',
    lens: 'CONCURRENCY · CORRECTNESS UNDER LOAD',
    emotionalRead:
      'Two customers buy the last item at the same instant. Both succeed. The system just sold something that didn’t exist.',
    steps: [
      {
        label: 'Problem',
        text: 'A classic read-before-write race: both requests read stock = 1, both passed validation, both committed. Two sales, one item.',
      },
      {
        label: 'Constraint',
        text: 'Under normal traffic the flow worked. The failure only appears under concurrent requests — invisible in testing, silent in production, expensive when it bites.',
      },
      {
        label: 'Decision',
        text: 'Move the invariant down to the database: an atomic conditional update inside a transaction. The decrement succeeds only if sufficient stock still exists; otherwise it affects zero rows and the operation fails safely. A database-level constraint makes negative stock unrepresentable — defense in depth.',
      },
      {
        label: 'Trade-off',
        text: 'Inventory writes became slightly more complex, and stronger transactional guarantees carry a cost. Correctness mattered more than write-throughput headroom — for inventory, overselling is unacceptable.',
      },
      {
        label: 'Outcome',
        text: 'Overselling became impossible through the normal application flow. Every stock-mutation path was audited — not just the endpoint that surfaced the bug — so the guarantee holds system-wide.',
      },
      {
        label: 'Lesson',
        text: 'I fix the class of bug, not the instance.',
      },
    ],
    credential: 'Solved this class of problem while working on a real ERP system.',
    depth: [
      'The pattern: a conditional UPDATE guarded by the availability check itself (affected-rows tells you who won the race), executed inside a transaction.',
      'Verification: reproduced concurrent purchase scenarios and confirmed inventory can never go negative — then reviewed every stock mutation path to apply the same guarantee consistently.',
      'Defense in depth: even if future logic is wrong, the database constraint refuses impossible inventory states.',
    ],
    complete: true,
  },
  {
    id: 'security',
    num: '02',
    title: 'Security by Default',
    lens: 'DATA INTEGRITY · AUTHENTICATION',
    emotionalRead:
      'A system that trusts its inputs is a system waiting to be broken — and you don’t find out until someone does.',
    steps: [
      { label: 'Problem', text: 'Awaiting real technical details from production work.', pending: true },
      { label: 'Constraint', text: 'Pending.', pending: true },
      { label: 'Decision', text: 'Pending.', pending: true },
      { label: 'Trade-off', text: 'Pending.', pending: true },
      { label: 'Outcome', text: 'Pending.', pending: true },
      { label: 'Lesson', text: 'Pending.', pending: true },
    ],
    credential: 'Applied while hardening authentication on a real production system.',
    complete: false,
  },
  {
    id: 'migration',
    num: '03',
    title: 'Safe Migration',
    lens: 'EVOLVING A LIVE SYSTEM',
    emotionalRead:
      'Changing a running system is surgery on a patient who’s awake — one wrong move and you lose data or break everything that depends on it.',
    steps: [
      { label: 'Problem', text: 'Awaiting real technical details from production work.', pending: true },
      { label: 'Constraint', text: 'Pending.', pending: true },
      { label: 'Decision', text: 'Pending.', pending: true },
      { label: 'Trade-off', text: 'Pending.', pending: true },
      { label: 'Outcome', text: 'Pending.', pending: true },
      { label: 'Lesson', text: 'Pending.', pending: true },
    ],
    credential: 'Applied while performing migration audits on a real ERP system.',
    complete: false,
  },
];
