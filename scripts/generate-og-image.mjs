#!/usr/bin/env node
// ============================================================================
// generate-og-image.mjs — renders the Open Graph image from its SVG source.
//
// Run: npm run og
//
// Renders assets/og/og-image.svg at its intrinsic 1200x630 directly to
// static/og-image.png (no letterboxing, no cropping), then verifies the
// output pixel geometry so a broken render fails loudly instead of
// shipping a mis-cropped social card.
//
// The previous pipeline (qlmanage thumbnail + center crop) produced a
// mis-cropped image; this script replaces it with a deterministic render.
// ============================================================================

import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const SRC = fileURLToPath(new URL('../assets/og/og-image.svg', import.meta.url));
const OUT = fileURLToPath(new URL('../static/og-image.png', import.meta.url));

const W = 1200;
const H = 630;

// --- render -----------------------------------------------------------------
// 4x supersampled render: rasterize the SVG at 4800x2520, then downscale to
// 1200x630 with Lanczos. Flattened onto the obsidian background so the PNG
// is 3-channel RGB with no alpha — social platforms re-encode og-images as
// JPEG, and an opaque alpha channel only adds a compositing variable.
const SCALE = 4;
await sharp(SRC, { density: 72 * SCALE })
  .resize(W, H, { kernel: 'lanczos3' })
  .flatten({ background: '#0A0A0A' })
  .png()
  .toFile(OUT);

// --- verify -----------------------------------------------------------------
const { data, info } = await sharp(OUT).raw().toBuffer({ resolveWithObject: true });
const problems = [];
const px = (x, y) => {
  const i = (y * info.width + x) * info.channels;
  return [data[i], data[i + 1], data[i + 2]];
};
const near = (a, b, tol) => a.every((v, i) => Math.abs(v - b[i]) <= tol);

if (info.width !== W || info.height !== H) {
  problems.push(`dimensions: expected ${W}x${H}, got ${info.width}x${info.height}`);
}

// Background must be obsidian #0A0A0A away from any content.
if (!near(px(20, 620), [10, 10, 10], 12)) {
  problems.push(`background: expected #0A0A0A, got rgb(${px(20, 620).join(',')})`);
}

// Top accent line must be #E07020.
if (!near(px(600, 1), [224, 112, 32], 25)) {
  problems.push(`accent line: expected #E07020, got rgb(${px(600, 1).join(',')})`);
}

// Each text row must contain foreground pixels within its expected band,
// proving the layout is positioned — not shifted or clipped. Gray text
// (#8A8A8A tagline, #555555 footer) is detected as any pixel deviating
// significantly from the obsidian background.
const fgInBand = (y0, y1, x0, x1) => {
  let count = 0;
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const [r, g, b] = px(x, y);
      if (Math.abs(r - 10) > 40 || Math.abs(g - 10) > 40 || Math.abs(b - 10) > 40) count++;
    }
  }
  return count >= 50; // enough to be real text, not an antialiasing speck
};
const bands = [
  ['ENGINEERING (title line 1)', 150, 225, 80, 700],
  ['THE APEX (title line 2)', 230, 305, 80, 700],
  ['tagline', 345, 380, 80, 700],
  ['championship line', 418, 448, 80, 700],
  ['footer (PAHIM RACING / domain)', 538, 568, 80, 1150],
];
for (const [name, y0, y1, x0, x1] of bands) {
  if (!fgInBand(y0, y1, x0, x1)) problems.push(`text band missing: ${name}`);
}

// Nothing may touch the bottom or right edges (no clipped content).
// The top rows are exempt: the full-width accent line lives there by design.
for (let x = 0; x < W; x += 4) {
  for (const y of [H - 1, H - 4]) {
    if (!near(px(x, y), [10, 10, 10], 12)) { problems.push('content clipped at bottom edge'); x = W; break; }
  }
}
for (let y = 8; y < H; y += 4) {
  if (!near(px(W - 1, y), [10, 10, 10], 12) && !near(px(W - 4, y), [10, 10, 10], 12)) {
    problems.push('content clipped at right edge'); break;
  }
}

if (problems.length > 0) {
  console.error(`og-image: ${problems.length} problem(s):\n`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

console.log(`og-image: OK (${W}x${H}, background, accent line, 5 text bands, no edge clipping)`);
