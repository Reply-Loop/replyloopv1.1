#!/usr/bin/env node
/**
 * Stand-in texture tiles until ASSET_BRIEF #1 (ivory paper) and #3 (charcoal felt)
 * exist. The tile IS the surface: the band's colour plus a little baked grain (no
 * blend mode, no opacity in CSS, painted beneath content).
 *
 *   node scripts/brand/textures.mjs
 *
 * Seamless by construction:
 * - the grain is seeded noise, softened by a blur that runs over a 3×3 wrap of the
 *   tile (in its own sharp pipeline: within one pipeline sharp would crop before it
 *   blurs, and the clamped edges would show as seams);
 * - the tile is stored LOSSLESS (palette PNG). Lossy AVIF/WebP compress opposite
 *   edges independently and smooth the interior more than the edges, which left a
 *   visible line every tile. With only a few grey levels the lossless tile stays
 *   small at 128px.
 * Writes public/brand/textures/{paper,felt}-128.png and prints each tile's darkest
 * and lightest 1% pixel, so text contrast on the grain can be checked
 * (scripts/contrast.mjs, brief §6.7). TEX_DEBUG=<dir> also writes the raw tile.
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const SIZE = 128;
const OUT = new URL("../../public/brand/textures/", import.meta.url).pathname;

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

/**
 * base: surface colour. levels: grain offsets in 8-bit steps, symmetric around 0
 * and each covering an equal share of pixels, so the tile's mean is the surface
 * colour. blur: fibre softness in px.
 */
async function tile({ name, base, levels, blur, seed }) {
  const rand = rng(seed);
  const n = SIZE * SIZE;
  const noise = new Uint8Array(n);
  for (let i = 0; i < n; i++) noise[i] = Math.round(rand() * 255);

  // 3×3 wrap, blurred in its own pipeline, centre cropped in a second one.
  const W = SIZE * 3;
  const big = Buffer.alloc(W * W);
  for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) big[y * W + x] = noise[(y % SIZE) * SIZE + (x % SIZE)];
  const blurred = await sharp(big, { raw: { width: W, height: W, channels: 1 } }).blur(blur).extractChannel(0).raw().toBuffer();
  const soft = await sharp(blurred, { raw: { width: W, height: W, channels: 1 } })
    .extract({ left: SIZE, top: SIZE, width: SIZE, height: SIZE })
    .extractChannel(0)
    .raw()
    .toBuffer();

  // Rank-map the softened field onto the grey offsets.
  const order = Array.from(soft.keys()).sort((a, b) => soft[a] - soft[b]);
  const offset = new Int8Array(n);
  order.forEach((idx, rank) => {
    offset[idx] = levels[Math.min(levels.length - 1, Math.floor((rank / n) * levels.length))];
  });

  const [r, g, b] = hex(base);
  const px = Buffer.alloc(n * 3);
  for (let i = 0; i < n; i++) {
    const v = offset[i];
    px[i * 3] = Math.max(0, Math.min(255, r + v));
    px[i * 3 + 1] = Math.max(0, Math.min(255, g + v));
    px[i * 3 + 2] = Math.max(0, Math.min(255, b + v));
  }
  mkdirSync(OUT, { recursive: true });
  const img = () => sharp(px, { raw: { width: SIZE, height: SIZE, channels: 3 } });
  if (process.env.TEX_DEBUG) await img().png().toFile(`${process.env.TEX_DEBUG}/${name}-raw.png`);
  const file = `${OUT}${name}-${SIZE}.png`;
  const info = await img()
    .png({ palette: true, colours: levels.length, dither: 0, compressionLevel: 9, effort: 10 })
    .toFile(file);

  // The palette must hold every colour exactly.
  const decoded = await sharp(file).removeAlpha().raw().toBuffer();
  if (Buffer.compare(decoded, px) !== 0) throw new Error(`${name}: palette PNG is not lossless`);
  const L = (R, G, B) => {
    const f = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(R) + 0.7152 * f(G) + 0.0722 * f(B);
  };
  const rows = [];
  for (let i = 0; i < n; i++) rows.push([px[i * 3], px[i * 3 + 1], px[i * 3 + 2]]);
  rows.sort((a, c) => L(...a) - L(...c));
  const toHex = (p) => "#" + p.map((c) => c.toString(16).padStart(2, "0")).join("").toUpperCase();
  console.log(
    `${name}: ${info.size} B, darkest 1% ${toHex(rows[Math.floor(n * 0.01)])}, lightest 1% ${toHex(rows[Math.floor(n * 0.99)])}`,
  );
}

await tile({ name: "paper", base: "#F8F5EF", levels: [-3, -1, 0, 1, 3], blur: 0.6, seed: 11 });
await tile({ name: "felt", base: "#1B1F23", levels: [-2, -1, 0, 1, 2], blur: 0.9, seed: 23 });
