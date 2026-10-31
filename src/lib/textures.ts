// Procedural stand-ins for the design's raster textures. Each is an SVG used as a CSS
// *mask*, so the visible colour still comes from a library token (background-color).

const BAYER_4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

const svgUrl = (w: number, h: number, body: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${body}</svg>`,
  )}")`;

/**
 * Ordered-dither ramp: empty at the top, dense at the bottom. Tiles horizontally;
 * stretch it to the height you want the ramp to cover.
 */
function ditherRamp(cell = 4, cols = 16, rows = 48) {
  let rects = '';
  for (let y = 0; y < rows; y++) {
    const v = Math.pow(y / (rows - 1), 1.6) * 0.95;
    for (let x = 0; x < cols; x++) {
      const t = (BAYER_4[y % 4][x % 4] + 0.5) / 16;
      if (v > t) rects += `<rect x="${x * cell}" y="${y * cell}" width="2" height="2"/>`;
    }
  }
  return svgUrl(cols * cell, rows * cell, rects);
}

/** Even dither field (~35% coverage), for full-surface grain. */
function ditherField(cell = 4, size = 16) {
  let rects = '';
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if ((BAYER_4[y % 4][x % 4] + 0.5) / 16 < 0.35)
        rects += `<rect x="${x * cell}" y="${y * cell}" width="2" height="2"/>`;
    }
  }
  return svgUrl(size * cell, size * cell, rects);
}

/** Stacked chevrons (zig-zag hairlines), 48 × 24 tile. */
function chevrons() {
  const lines = [0, 8, 16]
    .map((o) => `<path d="M0 ${o + 8} L12 ${o} L24 ${o + 8} L36 ${o} L48 ${o + 8}" />`)
    .join('');
  return svgUrl(48, 24, `<g fill="none" stroke="#000" stroke-width="1">${lines}</g>`);
}

export const textures = {
  ditherRamp: ditherRamp(),
  ditherField: ditherField(),
  chevrons: chevrons(),
};
