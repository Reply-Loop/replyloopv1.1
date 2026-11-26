#!/usr/bin/env node
/**
 * Lighthouse mobile, median of N runs per page, after one discarded warm-up run.
 * Usage: QA_BASE=http://localhost:3000 RUNS=5 node scripts/perf.mjs / /home-care-agencies
 * Needs a running production server (npm run build && npm start).
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = (process.env.QA_BASE || "http://localhost:3000").replace(/\/$/, "");
const runs = Number(process.env.RUNS || 5);
const chrome = process.env.CHROME_PATH || "/opt/pw-browsers/chromium";
const paths = process.argv.slice(2).length ? process.argv.slice(2) : ["/", "/home-care-agencies"];
const dir = mkdtempSync(join(tmpdir(), "rl-perf-"));
const median = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];

function run(url, out) {
  execFileSync(
    "npx",
    ["lighthouse", url, "--quiet", "--form-factor=mobile", "--output=json", `--output-path=${out}`,
      "--chrome-flags=--headless=new --no-sandbox"],
    { env: { ...process.env, CHROME_PATH: chrome }, stdio: "ignore" },
  );
  const r = JSON.parse(readFileSync(out, "utf8"));
  const items = r.audits["network-requests"]?.details?.items ?? [];
  return {
    perf: r.categories.performance.score * 100,
    a11y: r.categories.accessibility.score * 100,
    bp: r.categories["best-practices"].score * 100,
    seo: r.categories.seo.score * 100,
    lcp: r.audits["largest-contentful-paint"].numericValue,
    cls: r.audits["cumulative-layout-shift"].numericValue,
    tbt: r.audits["total-blocking-time"].numericValue,
    js: items.filter((i) => i.resourceType === "Script").reduce((s, i) => s + (i.transferSize || 0), 0),
    bytes: r.audits["total-byte-weight"].numericValue,
  };
}

const rows = [];
for (const path of paths) {
  const url = base + path;
  run(url, join(dir, "warm.json"));
  const results = Array.from({ length: runs }, (_, i) => run(url, join(dir, `${i}.json`)));
  const m = (k) => median(results.map((r) => r[k]));
  rows.push({
    page: path,
    perf: Math.round(m("perf")), a11y: Math.round(m("a11y")), bp: Math.round(m("bp")), seo: Math.round(m("seo")),
    lcp: `${(m("lcp") / 1000).toFixed(2)} s`, cls: m("cls").toFixed(3), tbt: `${Math.round(m("tbt"))} ms`,
    js: `${Math.round(m("js") / 1024)} KB`, total: `${Math.round(m("bytes") / 1024)} KB`,
    perfRuns: results.map((r) => Math.round(r.perf)).join("/"),
  });
}
console.log(`Lighthouse mobile, median of ${runs} warm runs (${base})`);
console.table(rows);
