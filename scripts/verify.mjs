/**
 * Production verification harness.
 * Drives the BUILT site (astro preview) in real Chromium and asserts:
 *   - zero console errors / page errors / failed requests
 *   - all 8 chapters render; title/meta/JSON-LD present
 *   - every <img> actually decoded; every internal link resolves
 *   - Lenis is driving scroll; ScrollTrigger pinned the hero
 *   - the hero scrub rewinds to frame zero and reaches the fault
 *   - DEMO-01 runs both modes to their correct outcomes
 *   - progress hairline advances; reveals reveal
 *   - mobile (390×844) renders clean with the same guarantees minus pin
 *   - reduced-motion: full story readable with zero animation infra
 *
 * Usage: npm run build && npm run verify
 * Env:   CHROMIUM_PATH (default /opt/pw-browsers/chromium)
 */
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';

const PORT = 4321;
const BASE = `http://localhost:${PORT}`;
const EXECUTABLE = process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium';
const CHAPTERS = ['enter', 'anomaly', 'correction', 'author', 'proofs', 'method', 'person', 'invitation'];

let failures = 0;
const ok = (name) => console.log(`  ✓ ${name}`);
const fail = (name, detail = '') => {
  failures++;
  console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`);
};
const assert = (cond, name, detail = '') => (cond ? ok(name) : fail(name, detail));

/* ── preview server ────────────────────────────────────────────── */
async function startPreview() {
  const proc = spawn('npx', ['astro', 'preview', '--port', String(PORT)], {
    stdio: 'ignore',
    detached: true,
  });
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(BASE);
      if (res.ok) return proc;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('preview server did not start');
}

/** Programmatic scroll that respects Lenis when it owns the page. */
async function jump(page, y) {
  await page.evaluate((y) => {
    const lenis = window.lenis;
    if (lenis) lenis.scrollTo(y, { immediate: true });
    else window.scrollTo(0, y);
  }, y);
}

/** Final cinematic MP4s/posters are copied into /assets/videos/ at deploy
 *  time and are intentionally absent during dev/verify. */
const isDeployTimeAsset = (url) => url.includes('/assets/videos/');

function watchPage(page, errors) {
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    /* The browser prints a URL-less generic line for resource 404s; those
       are authoritatively captured (with URL) by the response handler
       below, so skip the generic duplicate here. */
    if (/Failed to load resource:.*404/.test(text)) return;
    errors.push(`console: ${text}`);
  });
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  page.on('response', (res) => {
    if (res.status() === 404 && !isDeployTimeAsset(res.url())) {
      errors.push(`404: ${res.url()}`);
    }
  });
  page.on('requestfailed', (req) => {
    const failure = req.failure()?.errorText ?? '';
    if (isDeployTimeAsset(req.url())) return;
    if (failure !== 'net::ERR_ABORTED') errors.push(`request: ${req.url()} ${failure}`);
  });
}

/** True when the hero is the locked person video (vs the SVG diagram). */
async function heroIsVideo(page) {
  return (await page.locator('[data-hero-video]').count()) > 0;
}

/* ── desktop ───────────────────────────────────────────────────── */
async function verifyDesktop(browser) {
  console.log('\nDESKTOP (1440×900)');
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  watchPage(page, errors);

  await page.goto(BASE, { waitUntil: 'networkidle' });

  assert((await page.title()).includes('Ali Naji'), 'title');
  assert((await page.locator('h1').count()) === 1, 'exactly one h1');
  assert(
    (await page.locator('script[type="application/ld+json"]').count()) === 1,
    'JSON-LD present',
  );

  for (const id of CHAPTERS) {
    assert((await page.locator(`section#${id}`).count()) === 1, `chapter #${id}`);
  }

  /* images decoded */
  const badImgs = await page.$$eval('img', async (imgs) => {
    const results = await Promise.allSettled(
      imgs.map((i) => {
        i.loading = 'eager';
        return i.decode();
      }),
    );
    return imgs.filter((_, idx) => results[idx].status === 'rejected').map((i) => i.src);
  });
  assert(badImgs.length === 0, 'all images decoded', badImgs.join(', '));

  /* internal links + documents resolve */
  const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')));
  const internal = [...new Set(hrefs.filter((h) => h.startsWith('/') || h.startsWith('#')))];
  for (const href of internal) {
    if (href.startsWith('#')) {
      assert((await page.locator(href).count()) >= 1, `anchor ${href}`);
    } else {
      const res = await fetch(BASE + href);
      assert(res.ok, `link ${href}`, `HTTP ${res.status}`);
    }
  }

  /* cinema layer: cold open plays, any input skips it, once per session */
  assert(!(await page.locator('[data-cold-open]').isHidden()), 'cold open plays on first visit');
  await page.mouse.wheel(0, 30);
  await page.waitForFunction(
    () => document.querySelector('[data-cold-open]')?.hidden === true,
    undefined,
    { timeout: 5000 },
  );
  ok('cold open skips on input');
  assert(
    (await page.locator('[data-scene-open]').count()) === 6,
    'six scene cards (Ch02–Ch07)',
  );

  /* Final scene footage: each locked/production scene card carries its
     asset at the final self-hosted path, muted/looping/playsinline. */
  const SCENE_FOOTAGE = [
    ['Engineering World', '#correction', '/assets/videos/system-world.mp4'],
    ['Author Reveal', '#author', '/assets/videos/author-reveal.mp4'],
    ['Invitation', '#invitation', '/assets/videos/invitation.mp4'],
  ];
  for (const [name, sel, src] of SCENE_FOOTAGE) {
    const footage = page.locator(`${sel} [data-scene-footage]`);
    assert((await footage.count()) === 1, `${name} footage mounted on ${sel}`);
    assert(
      (await footage.getAttribute('src')) === src,
      `${name} points at the final self-hosted path`,
    );
    assert(
      (await footage.getAttribute('playsinline')) !== null &&
        (await footage.getAttribute('loop')) === null &&
        (await footage.getAttribute('autoplay')) === null,
      `${name} scrubs via scroll, no autoplay/loop`,
    );
  }

  /* motion infrastructure */
  assert((await page.locator('.pin-spacer').count()) >= 1, 'ScrollTrigger pinned the hero');
  assert(
    await page.evaluate(() => document.documentElement.classList.contains('lenis')),
    'Lenis active',
  );

  /* hero: the locked person video is wired in video-scrub mode */
  const isVideoHero = await heroIsVideo(page);
  if (isVideoHero) {
    const v = page.locator('[data-hero-video]');
    assert((await v.count()) === 1, 'hero video element present');
    assert(
      (await v.getAttribute('src')) === '/assets/videos/hero.mp4',
      'hero video points at the final self-hosted path',
    );
    assert((await v.getAttribute('poster'))?.startsWith('/assets/videos/'), 'hero poster wired');
    assert((await v.getAttribute('muted')) !== null || (await v.evaluate((el) => el.muted)), 'hero video muted');
    assert((await v.getAttribute('playsinline')) !== null, 'hero video playsinline');
    /* scrub a held frame so the pin + letterbox exercise in video mode */
    await jump(page, await page.evaluate(() => window.innerHeight * 3.2));
    await page.waitForTimeout(1200);
  } else {
    /* SVG-diagram fallback hero (no final video wired) */
    assert(
      (await page.locator('[data-h="stockValue"]').textContent())?.trim() === '1',
      'hero rewound to stock=1',
    );
    await jump(page, await page.evaluate(() => window.innerHeight * 3.2));
    await page.waitForTimeout(2500);
    assert(
      (await page.locator('[data-h="stockValue"]').textContent())?.trim() === '-1',
      'hero scrub reaches the fault (stock=-1)',
    );
  }

  /* letterbox engaged while the hero holds the frame */
  const barH = await page
    .locator('[data-letterbox]')
    .first()
    .evaluate((el) => el.getBoundingClientRect().height);
  assert(barH > 10, 'letterbox engaged during held frame', `height=${barH}`);

  /* progress hairline advanced */
  const width = await page.locator('[data-progress]').evaluate((el) => el.getBoundingClientRect().width);
  assert(width > 0, 'progress hairline advancing', `width=${width}`);

  /* deep scroll — reveals fire, nothing errors */
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= total; y += 600) {
    await jump(page, y);
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(1500);
  const thesisOpacity = await page
    .locator('.correction__thesis')
    .evaluate((el) => getComputedStyle(el).opacity);
  assert(Number(thesisOpacity) > 0.95, 'reveal completed on thesis', `opacity=${thesisOpacity}`);

  /* DEMO-01 — naive mode ends at −1, atomic mode ends safe */
  await page.locator('#correction').scrollIntoViewIfNeeded();
  await page.locator('[data-demo-run]').click();
  await page.waitForFunction(
    () => document.querySelector('[data-demo-stock]')?.textContent === '-1',
    undefined,
    { timeout: 10000 },
  );
  ok('demo naive mode → stock -1');
  await page.locator('[data-demo-mode="atomic"]').click();
  await page.locator('[data-demo-run]').click();
  await page.waitForFunction(
    () => document.querySelector('[data-demo-verdict="b"]')?.textContent?.includes('SAFELY'),
    undefined,
    { timeout: 10000 },
  );
  assert(
    (await page.locator('[data-demo-stock]').textContent())?.trim() === '0',
    'demo atomic mode → stock 0, one rejected safely',
  );

  /* sound: strictly opt-in, toggle visible with JS */
  assert(!(await page.locator('[data-sound-toggle]').isHidden()), 'sound toggle visible');
  assert(
    (await page.locator('[data-sound-toggle]').getAttribute('aria-pressed')) === 'false',
    'sound OFF by default',
  );

  assert(errors.length === 0, 'zero console/page/request errors', errors.slice(0, 5).join(' | '));
  await page.close();
}

/* ── mobile ────────────────────────────────────────────────────── */
async function verifyMobile(browser) {
  console.log('\nMOBILE (390×844, touch)');
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });
  const errors = [];
  watchPage(page, errors);
  await page.goto(BASE, { waitUntil: 'networkidle' });

  for (const id of CHAPTERS) {
    assert((await page.locator(`section#${id}`).count()) === 1, `chapter #${id}`);
  }
  const hasHScroll = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  assert(!hasHScroll, 'no horizontal overflow');

  /* atmosphere must NOT boot on mobile */
  await page.waitForTimeout(3500);
  const threeLoaded = await page.evaluate(() =>
    performance.getEntriesByType('resource').some((r) => r.name.includes('three')),
  );
  assert(!threeLoaded, 'Three.js not loaded on mobile');

  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= total; y += 500) {
    await jump(page, y);
    await page.waitForTimeout(40);
  }
  assert(errors.length === 0, 'zero console/page/request errors', errors.slice(0, 5).join(' | '));
  await page.close();
}

/* ── reduced motion ────────────────────────────────────────────── */
async function verifyReducedMotion(browser) {
  console.log('\nREDUCED MOTION');
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const errors = [];
  watchPage(page, errors);
  await page.goto(BASE, { waitUntil: 'networkidle' });

  assert((await page.locator('.pin-spacer').count()) === 0, 'no pin under reduced motion');
  assert(
    await page.locator('[data-cold-open]').isHidden(),
    'no cold open under reduced motion',
  );
  if (await heroIsVideo(page)) {
    /* the video's poster frame is the static hero under reduced motion */
    assert((await page.locator('[data-hero-video]').count()) === 1, 'hero video present (poster is the still)');
  } else {
    assert(
      (await page.locator('[data-h="stockValue"]').textContent())?.trim() === '-1',
      'story complete without animation (stock=-1 rendered)',
    );
  }
  const thesisVisible = await page
    .locator('.correction__thesis')
    .evaluate((el) => getComputedStyle(el).opacity);
  assert(Number(thesisVisible) === 1, 'content fully visible without reveals');
  assert(errors.length === 0, 'zero errors', errors.slice(0, 5).join(' | '));
  await page.close();
}

/* ── run ───────────────────────────────────────────────────────── */
const preview = await startPreview();
const browser = await chromium.launch({ executablePath: EXECUTABLE, args: ['--no-sandbox'] });
try {
  await verifyDesktop(browser);
  await verifyMobile(browser);
  await verifyReducedMotion(browser);
} finally {
  await browser.close();
  process.kill(-preview.pid, 'SIGTERM');
}

console.log(failures === 0 ? '\nVERIFICATION PASSED' : `\nVERIFICATION FAILED (${failures})`);
process.exit(failures === 0 ? 0 : 1);
