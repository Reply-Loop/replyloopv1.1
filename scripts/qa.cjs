#!/usr/bin/env node
/**
 * Site QA against a running production server (`npm run build && npm start`).
 * Usage: npm run qa            (defaults to http://localhost:3000)
 *        QA_BASE=http://localhost:3105 npm run qa
 *
 * Checks every page in the sitemap plus /privacy and /terms, at phone and
 * desktop widths:
 *  - axe-core, WCAG 2.0/2.1/2.2 A and AA rules
 *  - exactly one H1; title, description, canonical present and unique
 *  - the locked homepage H1, word for word
 *  - JSON-LD parses; no street address, geo, rating, or price in any schema
 *  - conversion paths: no <form>; every new-tab link is the cal.com booking URL;
 *    every booking button carries the exact label
 *  - every internal link returns 200; no horizontal scroll at 390px
 *
 * Exits 1 on any failure.
 */
const { chromium } = require("playwright");
const { AxeBuilder } = require("@axe-core/playwright");

const BASE = (process.env.QA_BASE || "http://localhost:3000").replace(/\/$/, "");
const LOCKED_H1 = "Your next customer is reading your unanswered Google reviews.";
const BOOKING = "https://cal.com/hunter-newbold-klaopa/intro-call";
const BOOK_LABEL = "Book an intro call";
const FORBIDDEN_SCHEMA_KEYS = ["streetAddress", "address", "geo", "aggregateRating", "review", "priceRange", "offers"];

let failures = 0;
const fail = (msg) => {
  failures++;
  console.error(`FAIL  ${msg}`);
};

function walkKeys(node, visit, path = "") {
  if (Array.isArray(node)) node.forEach((n, i) => walkKeys(n, visit, `${path}[${i}]`));
  else if (node && typeof node === "object")
    for (const [k, v] of Object.entries(node)) {
      visit(k, v, `${path}.${k}`);
      walkKeys(v, visit, `${path}.${k}`);
    }
}

(async () => {
  const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  paths.push("/privacy", "/terms");
  console.log(`QA on ${BASE}: ${paths.length} pages\n`);

  const browser = await chromium.launch();
  const titles = new Map();
  const descriptions = new Map();
  const internal = new Set();

  for (const path of paths) {
    for (const width of [390, 1280]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      const page = await context.newPage();
      const res = await page.goto(BASE + path, { waitUntil: "networkidle" });
      if (res.status() !== 200) fail(`${path} returned ${res.status()}`);

      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      for (const v of axe.violations)
        fail(`${path} @${width}px axe ${v.id} (${v.impact}): ${v.nodes.length} node(s), e.g. ${v.nodes[0]?.target?.join(" ")}`);

      if (width === 390) {
        const info = await page.evaluate(() => ({
          h1s: [...document.querySelectorAll("h1")].map((h) => h.textContent.trim()),
          title: document.title,
          desc: document.querySelector('meta[name="description"]')?.content || "",
          canonical: document.querySelector('link[rel="canonical"]')?.href || "",
          robots: document.querySelector('meta[name="robots"]')?.content || "",
          forms: document.querySelectorAll("form").length,
          overflow: document.documentElement.scrollWidth > window.innerWidth,
          ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent),
          newTab: [...document.querySelectorAll('a[target="_blank"]')].map((a) => a.href),
          bookButtons: [...document.querySelectorAll('a[data-track="cta_click_book_call"]')].map((a) => ({
            href: a.href,
            label: a.textContent.replace("(opens in a new tab)", "").trim(),
          })),
          links: [...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute("href").split("#")[0]),
        }));

        if (info.h1s.length !== 1) fail(`${path} has ${info.h1s.length} H1s`);
        if (path === "/" && info.h1s[0] !== LOCKED_H1) fail(`homepage H1 is "${info.h1s[0]}"`);
        if (!info.title) fail(`${path} has no title`);
        if (!info.desc) fail(`${path} has no meta description`);
        if (info.title.length > 62) fail(`${path} title is ${info.title.length} chars`);
        if (info.desc.length > 160) fail(`${path} description is ${info.desc.length} chars`);
        if (!info.canonical.endsWith(path === "/" ? "/" : path)) fail(`${path} canonical is ${info.canonical}`);
        if (titles.has(info.title)) fail(`${path} duplicates the title of ${titles.get(info.title)}`);
        if (descriptions.has(info.desc)) fail(`${path} duplicates the description of ${descriptions.get(info.desc)}`);
        titles.set(info.title, path);
        descriptions.set(info.desc, path);
        if (info.forms) fail(`${path} contains a <form>`);
        if (info.overflow) fail(`${path} scrolls horizontally at 390px`);
        for (const href of info.newTab) if (href !== BOOKING) fail(`${path} opens a new tab to ${href}`);
        for (const b of info.bookButtons) {
          if (b.href !== BOOKING) fail(`${path} booking button goes to ${b.href}`);
          if (b.label !== BOOK_LABEL) fail(`${path} booking button says "${b.label}"`);
        }
        for (const raw of info.ld) {
          let data;
          try {
            data = JSON.parse(raw);
          } catch {
            fail(`${path} JSON-LD does not parse`);
            continue;
          }
          walkKeys(data, (k, _v, at) => {
            if (FORBIDDEN_SCHEMA_KEYS.includes(k)) fail(`${path} JSON-LD has "${k}" at ${at}`);
          });
          const service = data["@graph"]?.find((n) => n["@type"] === "ProfessionalService");
          if (service && !(service.telephone && service.email && service.areaServed?.length))
            fail(`${path} ProfessionalService is missing telephone, email, or areaServed`);
        }
        info.links.forEach((l) => internal.add(l));
        console.log(`ok    ${path}  "${info.title}"${info.robots ? `  [${info.robots}]` : ""}`);
      }
      await context.close();
    }
  }

  for (const link of internal) {
    const r = await fetch(BASE + link, { redirect: "manual" });
    if (r.status !== 200) fail(`internal link ${link} returned ${r.status}`);
  }
  console.log(`\nChecked ${internal.size} internal links.`);

  await browser.close();
  console.log(failures ? `\nQA failed: ${failures} problem(s).` : "\nQA passed.");
  process.exit(failures ? 1 : 0);
})();
