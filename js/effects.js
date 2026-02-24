/**
 * effects.js
 * Handles: Interactive grid background that responds to mouse movement.
 */

function initGridBackground() {
  const grid = document.getElementById('grid-bg');
  if (!grid) return;

  let targetX = 50, targetY = 50;
  let currentX = 50, currentY = 50;
  let rafId = null;

  // Smooth lerp animation loop
  function lerp(a, b, t) { return a + (b - a) * t; }

  function animate() {
    currentX = lerp(currentX, targetX, 0.06);
    currentY = lerp(currentY, targetY, 0.06);
    grid.style.setProperty('--mx', currentX + '%');
    grid.style.setProperty('--my', currentY + '%');
    rafId = requestAnimationFrame(animate);
  }

  document.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth) * 100;
    targetY = (e.clientY / window.innerHeight) * 100;
  });

  animate();
}
