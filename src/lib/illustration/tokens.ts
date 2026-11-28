/**
 * Illustration tokens: "Paper and Brass, set like letterpress" (brief §9).
 *
 * Rules every drawing follows (§9.1):
 *  1. Every loop is LOOP_PATH (inline art uses LOOP_PATH_COMPACT, the same curve). Threads are
 *     lead-in curves through one undistorted, uniformly scaled instance (<LoopThread>). No
 *     freehand curls, ovals, rings or waves.
 *  2. Flat fills only: ivory, paper, paper-shade, rule, slate, charcoal, brass; brass-shadow and
 *     brass-light on brass objects only. No gradient fills inside paper shapes.
 *  3. Three stroke sizes in screen px, always with vector-effect="non-scaling-stroke":
 *     hair 1.25 (paper edges, writing, rings), thread 2 (every brass thread), rule 1 (backdrop
 *     and base loops). The same px on mobile.
 *  4. Two shadows, light from 315 deg (upper left), charcoal: contact and ambient. Pre-baked
 *     shapes (<SoftShadow>); no <filter> in illustration SVGs.
 *  5. Radii in screen px: cards 16, notecards and paper 8, proof sheets 2.
 *  6. Three depth layers per scene: plate -> object (one hero object) -> brass thread.
 *  7. Detail budget: <= 12 shapes per object, <= 1 highlight, no dark outlines.
 *  8. No chat bubbles, no grey bars. "Writing" is 3 slate hairlines (opacity .28, lengths
 *     92/78/54%) plus one short brass initial (<Writing>). No glyphs, stars or review text.
 *  9. Every template gets a portrait mobile composition (or a deliberate crop for heroes).
 * 10. Reveal order is plate -> object -> thread; no frame shows an incomplete idea.
 * 11. All art is aria-hidden; meaning lives in nearby HTML.
 *
 * Px tokens are screen px at the drawing's design size. Helpers take a `unit` (viewBox units
 * per screen px) to convert offsets and radii; stroke widths need no conversion because they
 * are non-scaling. Budgets: each inline SVG instance <= 6 KB raw; no filters; no rasters.
 * Hex values mirror the @theme tokens in src/app/globals.css exactly.
 */

/** Stroke widths in screen px; always pair with vectorEffect="non-scaling-stroke". */
export const STROKE = { hair: 1.25, thread: 2, rule: 1 } as const;

/** Illustration palette (exact @theme hex values). */
export const INK = {
  ivory: "#F8F5EF",
  /** Raised card surface on ivory; the notecard fill. */
  paper: "#FBFAF6",
  paperShade: "#EFE6D6",
  rule: "#E2DBCF",
  slate: "#4A4F55",
  charcoal: "#1B1F23",
  brass: "#8A5F1C",
  /** Brass objects only. */
  brassShadow: "#5C3E12",
  /** Brass objects only; one highlight. */
  brassLight: "#C49A5A",
  /** Loop strokes and hairlines on charcoal only. */
  brassLine: "#B8894A",
} as const;

/** Corner radii in screen px. */
export const RADIUS = { card: 16, notecard: 8, proof: 2 } as const;

/** Shadows in screen px, light from 315 deg, colour charcoal (INK.charcoal). */
export const SHADOW = {
  contact: { dx: 0.5, dy: 1, blur: 1.5, opacity: 0.12 },
  ambient: { dx: 6, dy: 12, blur: 18, opacity: 0.12 },
} as const;

/** Hairline "writing": line lengths as fractions of the block width, and line opacity. */
export const WRITING = { lengths: [0.92, 0.78, 0.54], opacity: 0.28 } as const;
