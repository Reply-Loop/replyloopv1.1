// Renders the brand film into ../public/media: H.264 MP4, VP9 WebM, and AVIF + WebP posters.
// Budget (brief §1.2): each video file <= 450,000 B; film plus both posters <= 859,457 B. The
// script measures and fails if a file is over.
// Usage: npm run render   (CHROME=/path/to/headless-shell to override the browser)
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { existsSync, mkdirSync, rmSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(here, "../public/media");
const tmpDir = path.resolve(here, "out");
mkdirSync(outDir, { recursive: true });
mkdirSync(tmpDir, { recursive: true });

const HEADLESS_SHELL =
  "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const browserExecutable = process.env.CHROME ?? (existsSync(HEADLESS_SHELL) ? HEADLESS_SHELL : null);

const id = "BrandFilm";
const serveUrl = await bundle({ entryPoint: path.join(here, "src/index.ts") });
const composition = await selectComposition({ serveUrl, id, browserExecutable });

const kb = (f) => `${Math.round(statSync(f).size / 1024)} KB`;
const common = { composition, serveUrl, browserExecutable, muted: true, enforceAudioTrack: false, colorSpace: "bt709" };

// Poster first (cheap, and fails fast): frame 0, which is also the loop point,
// so poster -> playback is seamless. AVIF with a WebP fallback (layered <picture>).
const png = path.join(tmpDir, "poster.png");
await renderStill({ composition, serveUrl, browserExecutable, frame: 0, output: png });
const require = createRequire(path.join(here, "package.json"));
const sharp = require("sharp");
const avif = path.join(outDir, "brand-film-poster.avif");
await sharp(png).avif({ quality: 55, effort: 6 }).toFile(avif);
const webp = path.join(outDir, "brand-film-poster.webp");
await sharp(png).webp({ quality: 76, smartSubsample: true }).toFile(webp);
rmSync(png);
console.log("poster", kb(avif), "webp", kb(webp));

// The film is silent, decorative and flat vector, so it compresses well: the CRFs below are
// set for clean hairlines and gradients while staying well inside the byte budget.
const mp4 = path.join(outDir, "brand-film.mp4");
await renderMedia({ ...common, codec: "h264", crf: 20, pixelFormat: "yuv420p", x264Preset: "veryslow", outputLocation: mp4 });
console.log("mp4", kb(mp4));

const webm = path.join(outDir, "brand-film.webm");
await renderMedia({ ...common, codec: "vp9", crf: 30, pixelFormat: "yuv420p", outputLocation: webm });
console.log("webm", kb(webm));

const files = [mp4, webm, avif, webp];
const total = files.reduce((n, f) => n + statSync(f).size, 0);
for (const f of [mp4, webm]) {
  if (statSync(f).size > 450_000) throw new Error(`${path.basename(f)} is ${statSync(f).size} B, over 450,000 B`);
}
if (total > 859_457) throw new Error(`film plus posters is ${total} B, over 859,457 B`);
console.log("total", total, "B (budget 859,457 B)");
