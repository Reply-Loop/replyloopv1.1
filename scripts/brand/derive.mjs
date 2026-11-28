#!/usr/bin/env node
/**
 * Derives the web images the site ships from the brand-kit originals in
 * assets/social-kit (never served directly). Re-run after a kit update:
 *   npm run brand:derive
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("../..", import.meta.url));
const out = join(root, "public/brand");
mkdirSync(out, { recursive: true });

// 06-og-link-preview (1734 x 907): the ribbon loop on the right, cropped for the
// /home-care-agencies hero backdrop. Decorative, alt="", desktop only.
const src = join(root, "assets/social-kit/backgrounds/06-og-link-preview.png");
const crop = { left: 960, top: 0, width: 774, height: 907 };
// The kit paper is a touch pinker than the page ivory (#F8F5EF). Scale each
// channel so the paper's median matches the page, so the fade has no seam.
const IVORY = [0xf8, 0xf5, 0xef];
const { data, info } = await sharp(src).extract({ left: crop.left, top: 0, width: 120, height: 907 }).raw().toBuffer({ resolveWithObject: true });
const paper = [0, 1, 2].map((c) => {
  const v = [];
  for (let i = c; i < data.length; i += info.channels) v.push(data[i]);
  v.sort((a, b) => a - b);
  return v[v.length >> 1];
});
const gain = IVORY.map((t, c) => t / paper[c]);
console.log("paper median", paper, "gain", gain.map((g) => g.toFixed(3)));

// AVIF only, at the crop's native width (never upscaled): brief §1.2, decorative stills.
{
  const w = 774;
  const base = sharp(src).extract(crop).removeAlpha().linear(gain, [0, 0, 0]).resize({ width: w });
  await base.avif({ quality: 50, effort: 6 }).toFile(join(out, `hca-ribbon-${w}.avif`));
}
console.log("public/brand: hca-ribbon-774.avif");
