/**
 * Atmosphere — the depth layer (04 §6: the world is a system, felt not shown).
 *
 * A sparse Three.js particle field drifting slowly behind the content, with
 * a whisper of pointer parallax. It obeys the restraint laws:
 *  - loads ONLY on capable, motion-permitting, fine-pointer viewports;
 *  - Three.js is imported dynamically after first idle — it never taxes
 *    first paint or mobile visitors (08 §2 performance budget);
 *  - near-black on black: presence, not spectacle (Law: beauty serves clarity);
 *  - pauses entirely when the tab is hidden.
 */
import { prefersReducedMotion } from './tokens';

export function initAtmosphere(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-atmosphere]');
  if (!canvas) return;

  const capable =
    !prefersReducedMotion() &&
    window.matchMedia('(pointer: fine)').matches &&
    window.innerWidth >= 1024 &&
    !(navigator as { connection?: { saveData?: boolean } }).connection?.saveData;
  if (!capable) return;

  const boot = () => void start(canvas).catch(() => {});
  if ('requestIdleCallback' in window) requestIdleCallback(boot, { timeout: 3000 });
  else setTimeout(boot, 1500);
}

async function start(canvas: HTMLCanvasElement): Promise<void> {
  const THREE = await import('three');

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 60);
  camera.position.z = 14;

  const COUNT = 550;
  const positions = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 44;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 26;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x00e5ff,
    size: 0.045,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  let targetX = 0;
  let targetY = 0;
  window.addEventListener('pointermove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 0.35;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.2;
  }, { passive: true });

  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);

  let raf = 0;
  const t0 = performance.now();
  const frame = () => {
    const t = (performance.now() - t0) / 1000;
    /* geological drift — one full breath every IDLE-scale period */
    points.rotation.y = t * 0.008 + targetX * 0.3;
    points.rotation.x = Math.sin(t * 0.05) * 0.02 + targetY * 0.3;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };
  frame();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else frame();
  });
}
