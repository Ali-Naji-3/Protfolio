/**
 * DEMO-01 behavior — a faithful (simplified) simulation of the race.
 *
 * NAIVE mode replays the real bug: both requests read stock = 1, both pass
 * validation, both write. Stock lands at −1.
 * ATOMIC mode replays the real fix: both requests race one conditional
 * UPDATE; the row count tells each request whether it won. One confirms,
 * one fails safely, and the constraint makes −1 unrepresentable.
 *
 * Timing uses the motion duration scale so even a demo obeys the bible.
 */
import { DURATION } from './tokens';
import { emit } from './bus';

type Mode = 'naive' | 'atomic';
type Lane = 'a' | 'b';

const STEP_MS = DURATION.t3 * 1000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function initDemo(): void {
  const root = document.querySelector<HTMLElement>('[data-race-demo]');
  if (!root) return;

  const el = {
    run: root.querySelector<HTMLButtonElement>('[data-demo-run]')!,
    modes: [...root.querySelectorAll<HTMLButtonElement>('[data-demo-mode]')],
    stock: root.querySelector<HTMLElement>('[data-demo-stock]')!,
    constraint: root.querySelector<HTMLElement>('[data-demo-constraint]')!,
    readout: root.querySelector<HTMLElement>('[data-demo-readout]')!,
    trace: {
      a: root.querySelector<HTMLElement>('[data-demo-trace="a"]')!,
      b: root.querySelector<HTMLElement>('[data-demo-trace="b"]')!,
    },
    verdict: {
      a: root.querySelector<HTMLElement>('[data-demo-verdict="a"]')!,
      b: root.querySelector<HTMLElement>('[data-demo-verdict="b"]')!,
    },
  };
  if (!el.run || !el.stock) return;

  let mode: Mode = 'naive';
  let running = false;

  const setMode = (next: Mode) => {
    mode = next;
    el.modes.forEach((btn) => {
      const active = btn.dataset.demoMode === next;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    el.constraint.hidden = next !== 'atomic';
    reset();
  };

  const setStock = (value: number) => {
    el.stock.textContent = String(value);
    el.stock.classList.toggle('is-fault', value < 0);
  };

  const trace = async (lane: Lane, line: string) => {
    const li = document.createElement('li');
    li.className = 'is-live';
    li.textContent = line;
    el.trace[lane].appendChild(li);
    await sleep(STEP_MS / 2);
    li.classList.remove('is-live');
  };

  const verdict = (lane: Lane, text: string, ok: boolean) => {
    el.verdict[lane].textContent = text;
    el.verdict[lane].classList.toggle('is-ok', ok);
    el.verdict[lane].classList.toggle('is-fault', !ok);
  };

  const reset = () => {
    setStock(1);
    (['a', 'b'] as const).forEach((lane) => {
      el.trace[lane].innerHTML = '';
      el.verdict[lane].textContent = '';
      el.verdict[lane].classList.remove('is-ok', 'is-fault');
    });
    el.readout.textContent = '';
  };

  const runNaive = async () => {
    /* Both requests interleave: read → validate → write. */
    await trace('a', 'BEGIN');
    await trace('b', 'BEGIN');
    await trace('a', 'SELECT stock → 1');
    await trace('b', 'SELECT stock → 1');
    await trace('a', 'stock ≥ 1 ✓ · proceed');
    await trace('b', 'stock ≥ 1 ✓ · proceed');
    await trace('a', 'UPDATE stock = 0');
    setStock(0);
    await trace('b', 'UPDATE stock = -1');
    setStock(-1);
    verdict('a', 'CONFIRMED', true);
    verdict('b', 'CONFIRMED', true);
    emit('demo:fault');
    el.readout.textContent =
      'Both orders succeeded. Stock is −1 — the system sold an item that does not exist, and nothing raised an error.';
  };

  const runAtomic = async () => {
    /* Both requests race ONE conditional statement; rows-affected decides. */
    await trace('a', 'BEGIN');
    await trace('b', 'BEGIN');
    await trace('a', 'UPDATE … SET stock = stock − 1');
    await trace('b', 'UPDATE … SET stock = stock − 1');
    await trace('a', 'WHERE stock ≥ 1 → 1 row');
    setStock(0);
    await trace('b', 'WHERE stock ≥ 1 → 0 rows');
    await trace('a', 'COMMIT');
    await trace('b', 'ROLLBACK');
    verdict('a', 'CONFIRMED', true);
    verdict('b', 'REJECTED — SAFELY', false);
    emit('demo:safe');
    el.readout.textContent =
      'The database decided the race atomically: one order won, the other affected zero rows and failed safely. Stock can never go below zero — the constraint makes the impossible state unrepresentable.';
  };

  el.modes.forEach((btn) =>
    btn.addEventListener('click', () => {
      if (!running) setMode(btn.dataset.demoMode as Mode);
    }),
  );

  el.run.addEventListener('click', async () => {
    if (running) return;
    running = true;
    el.run.disabled = true;
    reset();
    try {
      await (mode === 'naive' ? runNaive() : runAtomic());
    } finally {
      running = false;
      el.run.disabled = false;
    }
  });
}
