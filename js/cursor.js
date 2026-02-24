/**
 * cursor.js
 * Handles: custom circle cursor (visible on scroll), sticky header, back-to-top button.
 * Run AFTER all components are loaded (so header + sections exist in the DOM).
 */

function initCursor() {
  const cursorDot = document.getElementById('cursor-dot');
  if (!cursorDot) {
    console.warn('[cursor] #cursor-dot not found.');
    return;
  }

  // Follow mouse position
  document.addEventListener('mousemove', e => {
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top  = e.clientY + 'px';
  });

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
  const cursorDot = document.getElementById('cursor-dot');
  const backBtn   = document.getElementById('back-to-top');
  const section2  = document.getElementById('case-study');
  const siteHeader = document.getElementById('site-header');
  const dockNav    = document.getElementById('dock-nav');
  let scrollTimer  = null;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
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
    if (backBtn && section2) {
      backBtn.classList.toggle('visible', scrollY >= section2.offsetTop - 200);
    }
  }, { passive: true });
}
