/**
 * effects.js
 * Irregular mosaic grid background — a mix of large and small cells
 * that responds to mouse movement with a soft radial glow.
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
    // Large cells almost always split; small cells rarely do
    const stopChance = Math.min(0.9, depth * 0.3 + (area <= 2 ? 0.8 : 0));
    if (Math.random() < stopChance) return [{ x, y, w, h }];

    const cells = [];

    if (w >= h && w >= 2) {
      // Vertical split with randomized ratio (not just halves)
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
  const BLOCK = 6; // macro block size in units

  for (let row = 0; row < ROWS; row += BLOCK) {
    for (let col = 0; col < COLS; col += BLOCK) {
      const bw = Math.min(BLOCK, COLS - col);
      const bh = Math.min(BLOCK, ROWS - row);
      // Some macro blocks stay whole (large cell) — ~20% chance
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

  /* ── 2. Smooth mouse-glow ── */
  let targetX = 50, targetY = 50;
  let currentX = 50, currentY = 50;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function animate() {
    currentX = lerp(currentX, targetX, 0.06);
    currentY = lerp(currentY, targetY, 0.06);
    grid.style.setProperty('--mx', currentX + '%');
    grid.style.setProperty('--my', currentY + '%');
    requestAnimationFrame(animate);
  }

  document.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth)  * 100;
    targetY = (e.clientY / window.innerHeight) * 100;
  });

  animate();
}
