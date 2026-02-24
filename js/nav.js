/**
 * nav.js
 * Handles: smooth scroll on nav link click + active nav highlight on scroll.
 * Run AFTER all components are loaded (so sections exist in the DOM).
 */

function initNav() {
  // Smooth scroll — works for both header nav AND dock nav
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Active highlight — watches sections, updates ALL .nav-link elements
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) {
    console.warn('[nav] No sections or nav links found.');
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        // Select matching links from BOTH header nav and dock nav
        document.querySelectorAll(`.nav-link[href="#${entry.target.id}"]`).forEach(link => {
          link.classList.add('active');
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

function initMobileNav() {
  const toggle  = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (!toggle || !navMenu) return;

  toggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a nav link is clicked
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
    });
  });
}
