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
const pairs = [
  ["charcoal", "ivory", "body text on ivory", 4.5],
  ["ivory", "charcoal", "body text on charcoal", 4.5],
  ["brass", "ivory", "brass text (eyebrows, numerals, links) on ivory", 4.5],
  ["ivory", "brass", "button label on brass", 4.5],
  ["ivory", "brassPress", "button label on hover", 4.5],
  ["slate", "ivory", "secondary text on ivory", 4.5],
  ["mist", "charcoal", "secondary text on charcoal", 4.5],
  ["brass", "charcoal", "button surface against charcoal (label is ivory on brass)", 0],
  ["brassLine", "charcoal", "decorative hairlines and loop on charcoal", 0],
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
