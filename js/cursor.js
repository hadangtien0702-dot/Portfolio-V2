/**
 * cursor.js
 * Handles: custom circle cursor (visible on scroll), sticky header, back-to-top button.
 * Run AFTER all components are loaded (so header + sections exist in the DOM).
 *
 * PERFORMANCE:
 * - Cursor uses transform: translate(x,y) → GPU composited, zero layout cost
 * - rAF throttle on mousemove to avoid redundant paint calls
 * - section2 offsetTop is cached once at init, not read during scroll
 */

function initCursor() {
  const cursorDot = document.getElementById('cursor-dot');
  if (!cursorDot) {
    console.warn('[cursor] #cursor-dot not found.');
    return;
  }

  let cx = -100, cy = -100;  // off-screen initially
  let rafPending = false;

  function moveCursor() {
    cursorDot.style.transform = `translate(${cx}px, ${cy}px)`;
    rafPending = false;
  }

  document.addEventListener('mousemove', e => {
    // Offset by -50% of cursor size (36px) to center it
    cx = e.clientX - 18;
    cy = e.clientY - 18;
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(moveCursor);
    }
  }, { passive: true });

  // Click shrink effect
  document.addEventListener('mousedown', () => cursorDot.classList.add('clicking'));
  document.addEventListener('mouseup',   () => cursorDot.classList.remove('clicking'));
}

function initBackToTop() {
  const backBtn = document.getElementById('back-to-top');
  if (!backBtn) {
    console.warn('[cursor] #back-to-top not found.');
    return;
  }

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initScrollEffects() {
  const cursorDot  = document.getElementById('cursor-dot');
  const backBtn    = document.getElementById('back-to-top');
  const section2   = document.getElementById('case-study');
  const siteHeader = document.getElementById('site-header');
  const dockNav    = document.getElementById('dock-nav');

  // Cache offsetTop ONCE — never read layout inside scroll callback
  let section2Top = section2 ? section2.offsetTop : Infinity;
  window.addEventListener('resize', () => {
    if (section2) section2Top = section2.offsetTop;
  }, { passive: true });

  let scrollTimer = null;
  let lastScrollY = -1;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Avoid redundant work when scroll value hasn't meaningfully changed
    if (Math.abs(scrollY - lastScrollY) < 1) return;
    lastScrollY = scrollY;

    const isDocked = scrollY > 100;

    // ── Top header: fade out when scrolled ──
    if (siteHeader) siteHeader.classList.toggle('hidden', isDocked);

    // ── Dock pill: slide up when scrolled ──
    if (dockNav) dockNav.classList.toggle('visible', isDocked);

    // ── Cursor glow ──
    if (cursorDot) {
      cursorDot.classList.add('visible');
      document.body.classList.add('is-scrolling');
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        cursorDot.classList.remove('visible');
        document.body.classList.remove('is-scrolling');
      }, 800);
    }

    // ── Back to top ──
    if (backBtn) {
      backBtn.classList.toggle('visible', scrollY >= section2Top - 200);
    }
  }, { passive: true });
}
