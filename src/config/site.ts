/**
 * Site-wide metadata and contact configuration.
 * Single place to update identity/contact facts (08 §4, 02 Ch.07).
 */
export const SITE = {
  name: 'ALI NAJI',
  title: 'Ali Naji — Backend Software Engineer',
  description:
    'Backend software engineer. I build systems that fail safely — ' +
    'engineering is often about preventing invisible failures rather than building visible features.',
  /** TODO(launch): final domain — must match astro.config.mjs `site`. */
  url: 'https://alinaji.dev',
  thesis:
    'Engineering is often about preventing invisible failures rather than building visible features.',
  role: 'Software Engineer',
  focus: 'Backend',
  stack: ['NestJS', 'TypeScript', 'PostgreSQL', 'Prisma'],
} as const;

export const CONTACT = {
  /** TODO(content): confirm final contact email with Ali (05 §7). */
  email: 'alialnaji2025@gmail.com',
  availability: 'Open to backend / software engineering roles.',
  responsePromise: 'I reply within 24 hours.',
  /** TODO(content): confirm links with Ali (05 §7). */
  github: 'https://github.com/Ali-Naji-3',
  linkedin: '',
  /** Optional scheduling link (08 defaults). Empty = hidden. */
  scheduling: '',
} as const;

/** Chapter registry — ids drive anchors, the Index menu, and progress. */
export const CHAPTERS = [
  { id: 'enter', num: '00', title: 'Enter' },
  { id: 'anomaly', num: '01', title: 'The Anomaly' },
  { id: 'correction', num: '02', title: 'The Correction' },
  { id: 'author', num: '03', title: 'The Author' },
  { id: 'proofs', num: '04', title: 'The Proofs' },
  { id: 'method', num: '05', title: 'The Method' },
  { id: 'person', num: '06', title: 'The Person' },
  { id: 'invitation', num: '07', title: 'The Invitation' },
] as const;

export type ChapterId = (typeof CHAPTERS)[number]['id'];
