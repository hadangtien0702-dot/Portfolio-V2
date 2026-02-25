/**
 * effects.js
 * Irregular mosaic grid background — a mix of large and small cells
 * that responds to mouse movement with a soft radial glow.
 *
 * PERFORMANCE:
 * - rAF loop only runs when mouse has moved (dirty flag) and stops
 *   automatically once lerp has converged — no idle CPU drain.
 */

function initGridBackground() {
  const grid = document.getElementById('grid-bg');
  if (!grid) return;

  /* ── 1. Build an SVG mosaic of irregular cells ── */
  const UNIT = 40;   // base unit size in px
  const COLS = 32;   // total unit columns in the tile
  const ROWS = 22;   // total unit rows in the tile
  const LINE = 'rgba(255,255,255,0.07)';

  /**
   * Recursive BSP subdivision.
   * Returns array of { x, y, w, h } in UNIT-grid coordinates.
   */
  function subdivide(x, y, w, h, depth) {
    const area = w * h;

    // Minimum cell: 1×1 unit — always a leaf
    if (area <= 1) return [{ x, y, w, h }];

    // Chance to stop splitting (higher depth = more likely to stop)
    const stopChance = Math.min(0.9, depth * 0.3 + (area <= 2 ? 0.8 : 0));
    if (Math.random() < stopChance) return [{ x, y, w, h }];

    const cells = [];

    if (w >= h && w >= 2) {
      const ratios = [1/3, 1/2, 2/3];
      const ratio  = ratios[Math.floor(Math.random() * ratios.length)];
      const left   = Math.max(1, Math.round(w * ratio));
      const right  = w - left;
      if (right < 1) return [{ x, y, w, h }];
      cells.push(...subdivide(x,        y, left,  h, depth + 1));
      cells.push(...subdivide(x + left, y, right, h, depth + 1));
    } else if (h >= 2) {
      const ratios = [1/3, 1/2, 2/3];
      const ratio  = ratios[Math.floor(Math.random() * ratios.length)];
      const top    = Math.max(1, Math.round(h * ratio));
      const bottom = h - top;
      if (bottom < 1) return [{ x, y, w, h }];
      cells.push(...subdivide(x, y,       w, top,    depth + 1));
      cells.push(...subdivide(x, y + top, w, bottom, depth + 1));
    } else {
      return [{ x, y, w, h }];
    }

    return cells;
  }

  // Seed the BSP with large macro-blocks (4×4 to 6×6) for strong size contrast
  const cells = [];
  const BLOCK = 6;

  for (let row = 0; row < ROWS; row += BLOCK) {
    for (let col = 0; col < COLS; col += BLOCK) {
      const bw = Math.min(BLOCK, COLS - col);
      const bh = Math.min(BLOCK, ROWS - row);
      if (Math.random() < 0.2) {
        cells.push({ x: col, y: row, w: bw, h: bh });
      } else {
        cells.push(...subdivide(col, row, bw, bh, 0));
      }
    }
  }

  // Build SVG tile
  const W = COLS * UNIT;
  const H = ROWS * UNIT;

  const rects = cells.map(c => {
    const px = c.x * UNIT;
    const py = c.y * UNIT;
    const pw = c.w * UNIT;
    const ph = c.h * UNIT;
    return `<rect x="${px + 0.5}" y="${py + 0.5}" width="${pw - 1}" height="${ph - 1}" fill="none" stroke="${LINE}" stroke-width="1"/>`;
  }).join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${rects}</svg>`;
  const encoded = 'data:image/svg+xml,' + encodeURIComponent(svg);

  grid.style.backgroundImage  = `url("${encoded}")`;
  grid.style.backgroundSize   = `${W}px ${H}px`;
  grid.style.backgroundRepeat = 'repeat';

  /* ── 2. Smooth mouse-glow — idle-aware rAF ── */
  let targetX = 50, targetY = 50;
  let currentX = 50, currentY = 50;
  let dirty = false;       // true when lerp hasn't converged yet
  let rafId = null;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function animate() {
    rafId = null;

    const newX = lerp(currentX, targetX, 0.06);
    const newY = lerp(currentY, targetY, 0.06);

    // Only update CSS if value changed meaningfully (> 0.05%)
    const dX = Math.abs(newX - currentX);
    const dY = Math.abs(newY - currentY);

    currentX = newX;
    currentY = newY;

    grid.style.setProperty('--mx', currentX.toFixed(2) + '%');
    grid.style.setProperty('--my', currentY.toFixed(2) + '%');

    // Keep looping only if we haven't converged
    if (dX > 0.02 || dY > 0.02) {
      rafId = requestAnimationFrame(animate);
    } else {
      dirty = false;  // converged — stop the loop
    }
  }

  document.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth)  * 100;
    targetY = (e.clientY / window.innerHeight) * 100;

    // Only schedule rAF if not already running
    if (!dirty) {
      dirty = true;
      rafId = requestAnimationFrame(animate);
    }
  }, { passive: true });
}
