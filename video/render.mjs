// Renders the brand film into ../public/media: H.264 MP4, VP9 WebM, and an AVIF poster.
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
const common = { composition, serveUrl, browserExecutable, muted: true, enforceAudioTrack: false };

// The film is silent and decorative; small files matter more than pixel-peeping.
const mp4 = path.join(outDir, "brand-film.mp4");
await renderMedia({ ...common, codec: "h264", crf: 26, pixelFormat: "yuv420p", x264Preset: "slow", outputLocation: mp4 });
console.log("mp4", kb(mp4));

const webm = path.join(outDir, "brand-film.webm");
await renderMedia({ ...common, codec: "vp9", crf: 36, pixelFormat: "yuv420p", outputLocation: webm });
console.log("webm", kb(webm));

// Poster: frame 0, which is also the loop point, so poster -> playback is seamless.
const png = path.join(tmpDir, "poster.png");
await renderStill({ composition, serveUrl, browserExecutable, frame: 0, output: png });
const require = createRequire(path.resolve(here, "../package.json"));
const sharp = require("sharp");
const avif = path.join(outDir, "brand-film-poster.avif");
await sharp(png).avif({ quality: 55, effort: 6 }).toFile(avif);
rmSync(png);
console.log("poster", kb(avif));
