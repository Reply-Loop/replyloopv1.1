#!/usr/bin/env node
/**
 * Finishes the static export in out/ for Cloudflare Pages (run by
 * `npm run build:static` after `next build`):
 * - removes the dev-only /styleguide, so the host answers 404 there
 * - palette-quantises the OG images (owner decision O4; brief §1.2, §8.12):
 *   the cards are flat vector, so an 8-bit palette PNG looks the same and is
 *   about a third of the size. Budget: each <= 70 KB, all <= 450 KB in out/.
 * - writes _headers: content types for the extensionless OG images, long
 *   caching for hashed and immutable assets, and the security headers.
 * The www-to-apex redirect lives in Cloudflare (Bulk Redirects or a Redirect
 * Rule on the zone), not here: Pages _redirects cannot match on the host.
 */
import { existsSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const out = fileURLToPath(new URL("../out", import.meta.url));
if (!existsSync(out)) {
  console.error("No out/ folder. Run STATIC_EXPORT=1 next build first.");
  process.exit(1);
}

for (const name of ["styleguide.html", "styleguide.txt", "styleguide"]) rmSync(join(out, name), { recursive: true, force: true });

const walk = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
const ogImages = walk(out)
  .map((p) => "/" + relative(out, p).split("\\").join("/"))
  .filter((p) => p.endsWith("/opengraph-image"));

// OG palette quantisation. sharp is a devDependency (already installed; no new
// dependency). A file already in palette form (IHDR colour type 3) is left
// alone, so a second run does not quantise twice, and a file is replaced only
// when the result is smaller. quality 90 lets libimagequant use as few palette
// entries as it needs; on these flat cards the result is visually identical.
const OG_MAX = 70_000;
const OG_TOTAL_MAX = 450_000;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
let sharp = null;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.warn("out/: sharp is not installed (npm install), so the OG images are not quantised");
}
let ogBefore = 0;
let ogAfter = 0;
const ogSizes = [];
for (const p of ogImages) {
  const file = join(out, p);
  const src = readFileSync(file);
  ogBefore += src.length;
  let size = src.length;
  const indexed = src[25] === 3; // IHDR colour type: 3 = palette
  if (sharp && src.subarray(0, 8).equals(PNG_SIGNATURE) && !indexed) {
    const png = await sharp(src).png({ palette: true, quality: 90, effort: 10, compressionLevel: 9 }).toBuffer();
    if (png.length < src.length) {
      writeFileSync(file, png);
      size = png.length;
    }
  }
  ogAfter += size;
  ogSizes.push([p, size]);
}
console.log(`out/: OG images ${ogBefore} B -> ${ogAfter} B (${ogImages.length} files)`);
for (const [p, size] of ogSizes) console.log(`  ${String(size).padStart(7)} B  ${p}`);
const ogOver = ogSizes.filter(([, size]) => size > OG_MAX);
if (ogOver.length || ogAfter > OG_TOTAL_MAX) {
  console.error(
    `out/: OG budget exceeded (each <= ${OG_MAX} B, all <= ${OG_TOTAL_MAX} B): ` +
      (ogOver.length ? ogOver.map(([p, size]) => `${p} ${size} B`).join(", ") : `total ${ogAfter} B`),
  );
  process.exitCode = 1;
}

const rules = [
  ["/*", ["X-Content-Type-Options: nosniff", "Referrer-Policy: strict-origin-when-cross-origin", "X-Frame-Options: SAMEORIGIN", "Permissions-Policy: camera=(), microphone=(), geolocation=()"]],
  ["/_next/static/*", ["Cache-Control: public, max-age=31536000, immutable"]],
  ["/media/*", ["Cache-Control: public, max-age=604800"]],
  ["/brand/*", ["Cache-Control: public, max-age=604800"]],
  ...ogImages.map((p) => [p, ["Content-Type: image/png", "Cache-Control: public, max-age=86400"]]),
];
writeFileSync(join(out, "_headers"), rules.map(([path, hs]) => [path, ...hs.map((h) => `  ${h}`)].join("\n")).join("\n\n") + "\n");
console.log(`out/: removed /styleguide; _headers with ${ogImages.length} OG image types`);
