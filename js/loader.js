/**
 * loader.js
 * Loads HTML component files into their root containers.
 * Sections load in PARALLEL (Promise.all) for faster page display.
 * Only the header is awaited first to ensure it renders before content.
 */

async function loadComponent(id, path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status} loading ${path}`);
    const html = await res.text();
    document.getElementById(id).insertAdjacentHTML('beforeend', html);
  } catch (e) {
    console.error(`[loader] Failed to load "${path}":`, e);
  }
}

async function loadAllComponents() {
  // Header first — must render before content
  await loadComponent('header-root', 'components/header.html');

  // Load all sections in PARALLEL → much faster page display
  await Promise.all([
    loadComponent('main-root', 'components/hero.html'),
    loadComponent('main-root', 'components/case-study.html'),
    loadComponent('main-root', 'components/growth-timeline.html'),
    loadComponent('main-root', 'components/video-system.html'),
    loadComponent('main-root', 'components/creative-works.html'),
    loadComponent('footer-root', 'components/footer.html'),
  ]);
}
