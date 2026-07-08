import { defineConfig } from 'astro/config';

// Rendering strategy per docs/production/08-technical-architecture.md §1:
// static output — every claim, proof caption, and contact detail exists in
// the initial HTML without JavaScript. Animation is progressive enhancement
// delivered through islands (GSAP/Lenis load only inside them).
export default defineConfig({
  // TODO(launch): replace with the final personal domain before go-live.
  site: 'https://alinaji.dev',
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
});
