/**
 * The film's timecode: 1px progress hairline (02 "Index" layer) plus the
 * Index menu's sense of "now" — the chapter currently on screen gets
 * aria-current, and clicking a chapter closes the menu.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initProgress(): void {
  const bar = document.querySelector<HTMLElement>('[data-progress]');
  if (bar) {
    gsap.to(bar, {
      width: '100%',
      ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true },
    });
  }

  /* Active-chapter tracking for the Index menu. */
  const links = new Map<string, HTMLAnchorElement>();
  document
    .querySelectorAll<HTMLAnchorElement>('[data-chapter-link]')
    .forEach((a) => links.set(a.dataset.chapterLink!, a));

  document.querySelectorAll<HTMLElement>('section[data-chapter]').forEach((section) => {
    const id = section.dataset.chapter!;
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => {
        const link = links.get(id);
        if (!link) return;
        if (self.isActive) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      },
    });
  });

  /* Close the Index after in-page navigation. */
  const index = document.querySelector<HTMLDetailsElement>('[data-index]');
  if (index) {
    links.forEach((a) => a.addEventListener('click', () => index.removeAttribute('open')));
  }
}
