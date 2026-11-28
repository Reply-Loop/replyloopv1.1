import { STROKE } from "@/lib/illustration/tokens";
import { LOOP_PATH_COMPACT } from "@/lib/loop/compact";

/**
 * <LoopThread> (brief §9.2): a brass thread that runs from `from`, through one undistorted,
 * uniformly scaled instance of the mark's loop (LOOP_PATH_COMPACT), to `to`. Server-safe: no
 * hooks, no client code. Returns a <g> for use inside an existing <svg> (which is aria-hidden).
 *
 * The leads meet the loop tangentially: the loop starts and ends at its crossing travelling
 * along the same direction, so the lead-in arrives along that tangent and the lead-out leaves
 * along it; the far control point of each lead aims at the endpoint at a third of the distance.
 *
 * drawFrom "crossing" (default) emits three paths whose data all START at the crossing (loop,
 * lead-in reversed, lead-out; data-thread-part="loop" | "in" | "out"), so any per-path draw
 * (dashoffset 1 -> 0 with pathLength 1, or DrawSVG "0%" -> "100%") grows outward from the
 * crossing and a half-drawn state reads as a forming loop, never a smile or an arc.
 * drawFrom "start" emits one merged path from `from` through the whole loop to `to`
 * (data-thread-part="all"), in absolute coordinates, for a single draw or a travelling bead.
 *
 * Caps are butt so a zero-length dash paints nothing in a draw before-state.
 */

type Pt = readonly [number, number];
type Cubic = readonly [Pt, Pt, Pt, Pt];

export type LoopThreadProps = {
  /** Thread start, in the parent SVG's viewBox units. */
  from: Pt;
  /** Thread end, in viewBox units. */
  to: Pt;
  /** Where the loop's crossing sits, in viewBox units. */
  loopAt: Pt;
  /** Uniform scale: 1 = loop half-width of 100 units (0.3 gives a 60-unit-wide loop). */
  loopScale: number;
  /** Degrees, clockwise (SVG), around the crossing. Default 0. */
  rotation?: number;
  /** Default "crossing". */
  drawFrom?: "crossing" | "start";
  /** Default "currentColor". */
  stroke?: string;
  /** Screen px (non-scaling). Default STROKE.thread. */
  strokeWidth?: number;
  className?: string;
  /** Extra attributes on every emitted path, e.g. { "data-v-draw": "true", pathLength: "1" }. */
  partProps?: Record<string, string>;
};

export type LoopThreadGeometry = {
  /** The loop in its own units (LOOP_PATH_COMPACT); pair with loopTransform. */
  loop: string;
  /** "translate(..) rotate(..) scale(..)" placing `loop` in the parent's units. */
  loopTransform: string;
  /** The loop already transformed into the parent's units (starts and ends at the crossing). */
  loopAbs: string;
  /** Lead-in, from `from` to the crossing. */
  leadIn: string;
  /** Lead-in reversed: from the crossing back to `from`. */
  leadInReversed: string;
  /** Lead-out, from the crossing to `to`. */
  leadOut: string;
  /** One path: `from` -> crossing -> whole loop -> crossing -> `to`, absolute units. */
  all: string;
  /** The crossing, in the parent's units. */
  crossing: Pt;
  /** Unit tangent at the crossing: the direction of travel into and out of the loop. */
  tangent: Pt;
};

/** LOOP_PATH_COMPACT as cubics (absolute M/C/Z only), parsed once. */
const LOOP_CUBICS: Cubic[] = (() => {
  const n = (LOOP_PATH_COMPACT.match(/-?\d*\.?\d+/g) ?? []).map(Number);
  const out: Cubic[] = [];
  let p: Pt = [n[0], n[1]];
  for (let i = 2; i + 5 < n.length; i += 6) {
    const c: Cubic = [p, [n[i], n[i + 1]], [n[i + 2], n[i + 3]], [n[i + 4], n[i + 5]]];
    out.push(c);
    p = c[3];
  }
  return out;
})();

const r = (v: number) => {
  const x = Math.round(v * 100) / 100;
  return Object.is(x, -0) ? 0 : x;
};
const pt = (p: Pt) => `${r(p[0])} ${r(p[1])}`;
const cub = (a: Pt, b: Pt, c: Pt) => `C${pt(a)} ${pt(b)} ${pt(c)}`;

export function loopThreadParts({
  from,
  to,
  loopAt,
  loopScale,
  rotation = 0,
}: Pick<LoopThreadProps, "from" | "to" | "loopAt" | "loopScale" | "rotation">): LoopThreadGeometry {
  const rad = (rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  // Same order as the SVG transform: scale, then rotate, then translate.
  const place = ([x, y]: Pt): Pt => [
    loopAt[0] + loopScale * (x * cos - y * sin),
    loopAt[1] + loopScale * (x * sin + y * cos),
  ];

  const [c0, c1] = LOOP_CUBICS[0];
  const tx = c1[0] - c0[0];
  const ty = c1[1] - c0[1];
  const tl = Math.hypot(tx, ty);
  const tangent: Pt = [(tx * cos - ty * sin) / tl, (tx * sin + ty * cos) / tl];
  const C = loopAt;

  // Lead-in: from -> crossing, arriving along the tangent.
  const dIn = Math.hypot(C[0] - from[0], C[1] - from[1]) / 3;
  const in1: Pt = [from[0] + (C[0] - from[0]) / 3, from[1] + (C[1] - from[1]) / 3];
  const in2: Pt = [C[0] - tangent[0] * dIn, C[1] - tangent[1] * dIn];
  // Lead-out: crossing -> to, leaving along the tangent.
  const dOut = Math.hypot(to[0] - C[0], to[1] - C[1]) / 3;
  const out1: Pt = [C[0] + tangent[0] * dOut, C[1] + tangent[1] * dOut];
  const out2: Pt = [to[0] + (C[0] - to[0]) / 3, to[1] + (C[1] - to[1]) / 3];

  const loopBody = LOOP_CUBICS.map(([, a, b, c]) => cub(place(a), place(b), place(c))).join("");
  const transform =
    `translate(${pt(loopAt)})` +
    (rotation ? ` rotate(${r(rotation)})` : "") +
    ` scale(${Number(loopScale.toFixed(4))})`;

  return {
    loop: LOOP_PATH_COMPACT,
    loopTransform: transform,
    loopAbs: `M${pt(C)}${loopBody}`,
    leadIn: `M${pt(from)}${cub(in1, in2, C)}`,
    leadInReversed: `M${pt(C)}${cub(in2, in1, from)}`,
    leadOut: `M${pt(C)}${cub(out1, out2, to)}`,
    all: `M${pt(from)}${cub(in1, in2, C)}${loopBody}${cub(out1, out2, to)}`,
    crossing: C,
    tangent,
  };
}

export function LoopThread({
  drawFrom = "crossing",
  stroke = "currentColor",
  strokeWidth = STROKE.thread,
  className,
  partProps,
  ...geometry
}: LoopThreadProps) {
  const g = loopThreadParts(geometry);
  const path = { vectorEffect: "non-scaling-stroke" as const, ...partProps };
  return (
    <g
      className={className}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="butt"
      strokeLinejoin="round"
    >
      {drawFrom === "start" ? (
        <path d={g.all} {...path} data-thread-part="all" />
      ) : (
        <>
          <path d={g.loop} transform={g.loopTransform} {...path} data-thread-part="loop" />
          <path d={g.leadInReversed} {...path} data-thread-part="in" />
          <path d={g.leadOut} {...path} data-thread-part="out" />
        </>
      )}
    </g>
  );
}
