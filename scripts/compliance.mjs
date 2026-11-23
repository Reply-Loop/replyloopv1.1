#!/usr/bin/env node
/**
 * Compliance scan. Fails (exit 1) if any rendered page, or any source content
 * file, carries a phrase the brief or the brain forbids.
 *
 * Scans:
 *  1. Every prerendered HTML page in .next/server/app (visible text, title,
 *     meta descriptions, and JSON-LD). Run `npm run build` first.
 *  2. Source content: src/content/**, content/** (MDX posts), and public/*.txt.
 *
 * Sources of the rules: website brief 2026-11-23; Red Lines (2026-11-14);
 * Faith Compass and Brand Voice (2026-11-20, D-024, D-034); Decision Log D-031.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();

/** [label, regex]. Matching any of these fails the scan. */
const rules = [
  // Prices and commercial terms not approved for public pages.
  ["dollar amount", /\$\s?\d/],
  ["price word used as an offer", /\b(starting at|per month|a month|\/mo\b|package price|pricing tiers?|monthly fee|setup fee)\b/i],
  ["commercial term not in the brief", /\b(month[- ]to[- ]month|no (long[- ]term )?contracts?|cancel any ?time)\b/i],
  ["internal plan name", /\b(Essential|Pro)\s+(plan|tier|package)\b/i],
  ["dead offer: free", /\bfree\b/i],
  ["dead offer: trial", /\btrial\b/i],

  // Health and legal claims (P-004 is open; the site is not a lawyer).
  ["legal term: HIPAA", /\bHIPAA\b/i],
  ["legal term: BAA", /\bBAA\b/],
  ["legal term: PHI", /\bPHI\b/],
  ["legal claim: compliant", /\bcomplian(t|ce)\b/i],
  ["legal claim: business associate", /\bbusiness associates?\b/i],
  ["legal claim: we are covered", /\bwe are covered\b/i],
  ["legal citation", /\b(HHS|Nixon Peabody|Bass, Berry)\b/],

  // Patients: never in ReplyLoop's own claims. Singular "a patient" is allowed
  // only in the privacy promise ("never confirms someone is a patient").
  ["patients in a claim", /\bpatients\b/i],
  ["next patient", /\bnext patient\b/i],

  // Scripture (D-024, D-034): none on this site.
  ["scripture word", /\b(KJV|scriptures?|apocrypha(l)?|bible|biblical|verse)\b/i],
  [
    "bible citation",
    /\b(Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|Samuel|Kings|Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|Corinthians|Galatians|Ephesians|Philippians|Colossians|Thessalonians|Timothy|Titus|Philemon|Hebrews|James|Peter|Jude|Revelation|Sirach|Ecclesiasticus|Tobit|Judith|Maccabees|Wisdom)\s+\d+:\d+/,
  ],
  ["verse reference", /\b\d{1,3}:\d{1,3}(-\d{1,3})?\b(?!\s?(am|pm|AM|PM))/],
  [
    "recognizable verse paraphrase",
    /\b(upon (a|the|this) rock|wise man (which|who) built|good and faithful servant|faithful in that which is least|let your light so shine|do unto others|the least of these|seek,? and ye shall|ask,? and it shall be given|thou|thee|thy|unto)\b/i,
  ],

  // Voice bans.
  ["banned word", /\b(hack|hacks|crush|dominate|guarantee[ds]?|synergy|game[- ]changer|leverage)\b/i],
  ["ranking claim", /\brank(ed|ing)?\s*#?\s*1\b|#1\b|number one\b/i],
  ["AI mention (D-031)", /\b(AI|A\.I\.|artificial intelligence|chatbot|GPT|LLM)\b/],
  ["internal mechanics", /\b(needs_human|confidence score|auto-?post(ing)?|fixed-reply)\b/i],
  // Design system v1 (2026-11-20) verify list and claim register holds.
  ["unapproved approval promise", /\b(approves? every reply|you approve what we write|check with you before|with you in control)\b/i],
  ["call name (say intro call)", /\b(discovery call|setup call|consultation|demo)\b/i],
  ["speed claim", /\b(same[- ]day|within minutes|around the clock|24\/7|ready this week)\b/i],
  ["first-client claim", /\bour first client\b/i],
  ["fear framing", /\b(often the last thing|nobody is listening)\b/i],
  ["competitor name", /\b(Reply\.io|ReplyLion|LoopReply)\b/i],

  // Invented proof.
  ["percentage", /\b\d+(\.\d+)?\s?%/],
  ["count of reviews or clients", /\b\d[\d,]*\+?\s+(reviews|five-star|5-star|clients|customers|agencies|businesses|families|owners)\b/i],
  ["star rating claim", /\b\d(\.\d)?\s*(-|\s)?stars? (rating|average)\b|\brated \d(\.\d)?\b/i],
  ["testimonial or trust badge", /\btrusted by\b|\bas seen (in|on)\b/i],

  // Known real names from the brain. Never on the site without written consent.
  ["client or lead name", /\b(Executive Home Care|Jaren|Solstice)\b/i],

  // Street address (none anywhere).
  ["street address", /\b\d{2,5}\s+(E|W|N|S|East|West|North|South)\.?\s+\d{2,5}\b|\b\d{2,5}\s+[A-Z][a-z]+\s+(Street|St\.|Avenue|Ave\.|Road|Rd\.|Boulevard|Blvd\.|Lane|Drive)\b/],

  // Tone.
  ["exclamation point", /!(?!--)/],
];

/** Phrases that are allowed even though a rule above would match them. */
const allow = [
  /confirms? (someone|who) is a patient/i,
  /confirm the reviewer was a patient/i,
  /may be a patient or a patient['’]s family/i,
  /reviewer may be a patient/i,
];

function htmlToText(html) {
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const metas = [...html.matchAll(/<meta[^>]+content="([^"]*)"/g)].map((m) => m[1]);
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "";
  const body = html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ");
  return [title, ...metas, body, ...ld]
    .join("\n")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/[ \t]+/g, " ");
}

function walk(dir, filter, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, filter, out);
    else if (filter(p)) out.push(p);
  }
  return out;
}

const targets = [];

// 1. Rendered pages. The dev-only gallery and Next internals are skipped.
const appOut = join(root, ".next/server/app");
if (!existsSync(appOut)) {
  console.error("No build output. Run `npm run build` before `npm run check:compliance`.");
  process.exit(1);
}
for (const file of walk(appOut, (p) => p.endsWith(".html"))) {
  const rel = relative(appOut, file);
  if (/^(styleguide|_global-error|_not-found)/.test(rel)) continue;
  targets.push({ file: `rendered:/${rel.replace(/(index)?\.html$/, "")}`, text: htmlToText(readFileSync(file, "utf8")) });
}
for (const file of walk(appOut, (p) => /\.(txt|xml)\.body$/.test(p) || p.endsWith("llms.txt.body"))) {
  targets.push({ file: `rendered:/${relative(appOut, file)}`, text: readFileSync(file, "utf8") });
}

// 2. Source content.
for (const dir of ["src/content", "content"]) {
  for (const file of walk(join(root, dir), (p) => /\.(ts|tsx|md|mdx)$/.test(p))) {
    const raw = readFileSync(file, "utf8");
    // Strip code comments in .ts files so rule notes do not trip the scan.
    const text = file.endsWith(".ts") ? raw.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "") : raw;
    targets.push({ file: relative(root, file), text });
  }
}
for (const file of walk(join(root, "public"), (p) => p.endsWith(".txt"))) {
  targets.push({ file: relative(root, file), text: readFileSync(file, "utf8") });
}

let failures = 0;
for (const { file, text } of targets) {
  const lines = text.split("\n");
  for (const line of lines) {
    let cleaned = line;
    for (const a of allow) cleaned = cleaned.replace(new RegExp(a.source, "gi"), " ");
    for (const [label, re] of rules) {
      const m = cleaned.match(re);
      if (m) {
        failures++;
        const at = Math.max(0, m.index - 50);
        console.error(`FAIL  ${label}  in ${file}\n      …${cleaned.slice(at, m.index + 70).trim()}…`);
      }
    }
  }
}

console.log(`\nCompliance scan: ${targets.length} files checked, ${failures} problem${failures === 1 ? "" : "s"}.`);
if (failures) process.exit(1);
