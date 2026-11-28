#!/usr/bin/env node
/**
 * Design-token guard (docs/REDESIGN_PROMPT.md §6.2–6.3). Fails (exit 1) on:
 * - spacing utilities (margin, padding, gap, space-*) off the scale
 *   4, 8, 12, 16, 20, 24, 28, 32, 48, 64, 72, 80, 96, 128, 160 px
 *   (20px is the eyebrow-to-H2 and H2-to-intro gap the same spec sets in §6.2);
 * - visible text under 14px (text-xs, or an arbitrary size below 0.875rem / 14px).
 * Arbitrary spacing written in %, em, var() or calc() is allowed (component
 * dimensions and optical offsets the spec exempts, e.g. the hero loop's py-[8%]).
 * Known exceptions are listed below with a reason and the phase that removes them.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SCAN = ["src"];
const EXT = /\.(tsx|ts|mdx)$/;

// Tailwind spacing steps (× 0.25rem) on the scale, plus 0 and px.
const ALLOWED_STEPS = new Set(["0", "px", "1", "2", "3", "4", "5", "6", "7", "8", "12", "16", "18", "20", "24", "32", "40"]);
const ALLOWED_PX = new Set([0, 1, 4, 8, 12, 16, 20, 24, 28, 32, 48, 64, 72, 80, 96, 128, 160]);

/** file → tokens tolerated until the phase that redraws them. */
const EXCEPTIONS = {};

const SPACING = /(?<![\w-])(-?)((?:m|mx|my|mt|mb|ml|mr|ms|me|p|px|py|pt|pb|pl|pr|ps|pe|gap|gap-x|gap-y|space-x|space-y))-(\[[^\]\s]+\]|[0-9]+(?:\.[0-9]+)?|px)(?![\w.\-[])/g;
const TEXT_SIZE = /(?<![\w-])text-(xs|\[[0-9.]+(?:px|rem)\])(?![\w-])/g;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (EXT.test(name)) out.push(p);
  }
  return out;
}

function arbitraryPx(value) {
  const m = /^\[(-?[0-9.]+)(px|rem)\]$/.exec(value);
  if (!m) return null;
  return m[2] === "rem" ? Number(m[1]) * 16 : Number(m[1]);
}

const problems = [];
for (const file of SCAN.flatMap((d) => walk(join(ROOT, d)))) {
  const rel = relative(ROOT, file);
  const allow = new Set(EXCEPTIONS[rel]?.tokens ?? []);
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const m of line.matchAll(SPACING)) {
      const [token, , , value] = m;
      if (allow.has(token)) continue;
      if (value.startsWith("[")) {
        const px = arbitraryPx(value);
        if (px === null) continue; // %, em, var(), calc(): exempt
        if (!ALLOWED_PX.has(Math.abs(px))) problems.push(`${rel}:${i + 1}  off-scale spacing ${token} (${px}px)`);
      } else if (!ALLOWED_STEPS.has(value)) {
        problems.push(`${rel}:${i + 1}  off-scale spacing ${token} (${Number(value) * 4}px)`);
      }
    }
    for (const m of line.matchAll(TEXT_SIZE)) {
      const [token, size] = m;
      if (allow.has(token)) continue;
      const px = size === "xs" ? 12 : arbitraryPx(size);
      if (px !== null && px < 14) problems.push(`${rel}:${i + 1}  text under 14px ${token} (${px}px)`);
    }
  });
}

for (const [file, { tokens, reason }] of Object.entries(EXCEPTIONS)) {
  console.log(`exception  ${file}: ${tokens.join(", ")} (${reason})`);
}
if (problems.length) {
  console.error(`\nToken check: ${problems.length} problem(s)\n${problems.join("\n")}`);
  process.exit(1);
}
console.log("Token check: spacing on scale, no text under 14px.");
