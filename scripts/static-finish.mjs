#!/usr/bin/env node
/**
 * Finishes the static export in out/ for Cloudflare Pages (run by
 * `npm run build:static` after `next build`):
 * - removes the dev-only /styleguide, so the host answers 404 there
 * - writes _headers: content types for the extensionless OG images, long
 *   caching for hashed and immutable assets, and the security headers.
 * The www-to-apex redirect lives in Cloudflare (Bulk Redirects or a Redirect
 * Rule on the zone), not here: Pages _redirects cannot match on the host.
 */
import { existsSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
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

const rules = [
  ["/*", ["X-Content-Type-Options: nosniff", "Referrer-Policy: strict-origin-when-cross-origin", "X-Frame-Options: SAMEORIGIN", "Permissions-Policy: camera=(), microphone=(), geolocation=()"]],
  ["/_next/static/*", ["Cache-Control: public, max-age=31536000, immutable"]],
  ["/media/*", ["Cache-Control: public, max-age=604800"]],
  ["/brand/*", ["Cache-Control: public, max-age=604800"]],
  ["/hdri/*", ["Cache-Control: public, max-age=2592000"]],
  ...ogImages.map((p) => [p, ["Content-Type: image/png", "Cache-Control: public, max-age=86400"]]),
];
writeFileSync(join(out, "_headers"), rules.map(([path, hs]) => [path, ...hs.map((h) => `  ${h}`)].join("\n")).join("\n\n") + "\n");
console.log(`out/: removed /styleguide; _headers with ${ogImages.length} OG image types`);
