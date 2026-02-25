/**
 * animations.js
 * Scroll-triggered entrance animations using IntersectionObserver.
 * Hero section gets staggered load animation on DOMContentLoaded.
 * All animations use only transform + opacity (GPU-accelerated).
 *
 * PERFORMANCE:
 * - initSectionReveal: fire-once (unobserve after visible) — no toggle
 *   on scroll-up to avoid continuous repaints.
 */

/* ─────────────────────────────────────────
   HERO: staggered entrance on page load
───────────────────────────────────────── */
function initHeroAnimation() {
  const targets = [
    { sel: '.hero-eyebrow',    delay: 0 },
    { sel: '.hero-title',      delay: 80 },
    { sel: '.hero-tags',       delay: 180 },
    { sel: '.hero-center',     delay: 120 },
    { sel: '.hero-tagline',    delay: 160 },
    { sel: '.hero-sub',        delay: 240 },
    { sel: '.cta',             delay: 320 },
  ];

  targets.forEach(({ sel, delay }) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.classList.add('anim-ready');          // set initial hidden state
    setTimeout(() => el.classList.add('anim-in'), delay + 100);
  });
}

/* ─────────────────────────────────────────
   SCROLL: fade-up entrance for sections
───────────────────────────────────────── */
function initScrollAnimations() {
  const selectors = [
    '.section-page h2',
    '.section-page p',
    '.section-page .coming-soon',
  ];

  const elements = document.querySelectorAll(selectors.join(','));
  if (!elements.length) return;

  elements.forEach(el => el.classList.add('anim-ready'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-in');
        observer.unobserve(entry.target); // fire once — no re-trigger
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px',
  });

  elements.forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────────
   SECTION REVEAL: entire sections fade in
   Fire-once: unobserve after visible to
   prevent continuous repaint on scroll.
───────────────────────────────────────── */
function initSectionReveal() {
  const sections = document.querySelectorAll('section[id]:not(#hero)');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
        observer.unobserve(entry.target); // fire once, no toggle
      }
    });
  }, { threshold: 0.08 });

  sections.forEach(s => {
    s.classList.add('section-hidden');
    observer.observe(s);
  });
}
