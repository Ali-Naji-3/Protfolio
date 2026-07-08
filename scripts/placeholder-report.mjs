/**
 * Placeholder audit (asset-manager rule: nothing placeholder ships silently).
 * Scans src/config/assets.ts and lists every asset still marked
 * `placeholder: true`, plus any TODO(...) markers in content/config.
 * Run: npm run report:placeholders
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;

/* ── Assets still placeholder ──────────────────────────────────── */
const assets = readFileSync(join(root, 'src/config/assets.ts'), 'utf8');
const entries = [];
const re = /'([A-Z]{3}-\d{2}\/[a-z]+)':\s*\{([\s\S]*?)\n  \}/g;
let m;
while ((m = re.exec(assets))) {
  entries.push({ id: m[1], placeholder: /placeholder:\s*true/.test(m[2]) });
}

console.log('── Placeholder assets (swap in src/config/assets.ts) ──');
for (const e of entries.filter((e) => e.placeholder)) console.log(`  • ${e.id}`);

/* ── TODO markers awaiting real content ────────────────────────── */
console.log('\n── Content TODOs (never invent — supplied by Ali) ──');
const scan = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) scan(p);
    else if (/\.(ts|astro|mjs)$/.test(name)) {
      readFileSync(p, 'utf8').split('\n').forEach((line, i) => {
        if (line.includes('TODO(')) console.log(`  • ${p.replace(root, '')}:${i + 1} ${line.trim()}`);
      });
    }
  }
};
scan(join(root, 'src'));
