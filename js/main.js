/**
 * main.js
 * Entry point. Coordinates loading order:
 *  1. Load all HTML components (loader.js)
 *  2. Init navigation (nav.js)
 *  3. Init cursor, sticky header, back-to-top (cursor.js)
 *
 * To debug a specific feature, open its file directly.
 */

window.addEventListener('DOMContentLoaded', async () => {
  // Step 1: Load all HTML components into the page
  await loadAllComponents();  // defined in loader.js

  // Step 2: Init nav (sections now exist in DOM)
  initNav();                  // defined in nav.js
  initMobileNav();            // defined in nav.js — hamburger for mobile

  // Step 3: Init UI effects (cursor, header, back-to-top, grid)
  initCursor();               // defined in cursor.js
  initBackToTop();            // defined in cursor.js
  initScrollEffects();        // defined in cursor.js
  initGridBackground();       // defined in effects.js
});
