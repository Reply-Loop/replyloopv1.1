#!/usr/bin/env node
/**
 * WCAG 2.2 contrast check for every color pairing the site uses.
 * Fails (exit 1) if a pairing used for text drops below 4.5:1, or a
 * pairing used for UI or meaningful graphics drops below 3:1.
 * Decorative-only pairings are reported but never fail the build.
 */
const tokens = {
  charcoal: "#1B1F23",
  ivory: "#F8F5EF",
  brass: "#8A5F1C",
  brassPress: "#74501A",
  brassLine: "#B8894A",
  slate: "#4A4F55",
  mist: "#C9C4BA",
  rule: "#E2DBCF",
  ink2: "#262B30",
  ivory2: "#F2EDE4",
  paper: "#FBFAF6",
  paperShade: "#EFE6D6",
  ink3: "#2F353B",
};

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function ratio(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

// [foreground, background, use, minimum]
// 4.5 = text, 3 = large text and UI only, 0 = reported, never fails (decorative, or never used as text).
const pairs = [
  ["charcoal", "ivory", "body text on ivory", 4.5],
  ["charcoal", "paper", "body text on raised cards", 4.5],
  ["charcoal", "ivory2", "body text on the alternate light band", 4.5],
  ["ivory", "charcoal", "body text on charcoal", 4.5],
  ["ivory", "ink2", "text on raised surfaces on charcoal", 4.5],
  ["ivory", "ink3", "text on hover surfaces on charcoal", 4.5],
  ["brass", "ivory", "brass text (eyebrows, numerals, links) on ivory", 4.5],
  ["brass", "paper", "brass text on raised cards", 4.5],
  ["brass", "ivory2", "brass text on the alternate light band", 4.5],
  ["brass", "paperShade", "brass on paper shade: large text and UI only, avoid body text", 3],
  ["ivory", "brass", "button label on brass", 4.5],
  ["ivory", "brassPress", "button label on hover", 4.5],
  ["slate", "ivory", "secondary text on ivory", 4.5],
  ["slate", "paper", "secondary text on raised cards", 4.5],
  ["slate", "ivory2", "secondary text on the alternate light band", 4.5],
  ["slate", "paperShade", "secondary text on paper shade", 4.5],
  ["mist", "charcoal", "secondary text on charcoal", 4.5],
  ["mist", "ink2", "secondary text on raised surfaces on charcoal", 4.5],
  ["mist", "ink3", "secondary text on hover surfaces on charcoal", 4.5],
  ["charcoal", "ivory", "pause-control icon on its light chip", 3],
  ["ivory", "ink2", "pause-control icon on its dark chip", 3],
  ["brassLine", "charcoal", "decorative hairlines and loop on charcoal (never text)", 0],
  ["brassLine", "ink2", "decorative hairlines on raised dark surfaces (never text)", 0],
  ["brass", "charcoal", "NEVER text: button surface against charcoal only (label is ivory on brass)", 0],
  ["brass", "ink2", "NEVER text on raised dark surfaces", 0],
  ["brassLine", "ivory", "NEVER: brass-line is decorative and charcoal-only", 0],
];

let failed = false;
console.log("Contrast check (WCAG 2.2)\n");
for (const [fg, bg, use, min] of pairs) {
  const r = ratio(tokens[fg], tokens[bg]);
  const pass = r >= min;
  if (!pass) failed = true;
  const verdict = min === 0 ? "info " : pass ? "pass " : "FAIL ";
  console.log(
    `${verdict} ${r.toFixed(2).padStart(5)}:1  ${fg} ${tokens[fg]} on ${bg} ${tokens[bg]}  (${use}${min ? `, needs ${min}:1` : ", not used for text"})`,
  );
}

console.log(
  "\nRule: brass #8A5F1C is never used as text on charcoal. Darkening it would lower that ratio further,",
);
console.log("so on charcoal, text is ivory or mist, and brass appears only as the button surface and hairlines.");

if (failed) {
  console.error("\nContrast check failed.");
  process.exit(1);
}
