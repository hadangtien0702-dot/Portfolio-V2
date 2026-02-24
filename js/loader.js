/**
 * loader.js
 * Loads HTML component files into their root containers.
 * Order is sequential to guarantee correct render order.
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
  await loadComponent('header-root', 'components/header.html');

  // Sections load in strict order: 1 → 2 → 3 → 4 → 5
  await loadComponent('main-root', 'components/hero.html');
  await loadComponent('main-root', 'components/case-study.html');
  await loadComponent('main-root', 'components/growth-timeline.html');
  await loadComponent('main-root', 'components/video-system.html');
  await loadComponent('main-root', 'components/creative-works.html');

  await loadComponent('footer-root', 'components/footer.html');
}
