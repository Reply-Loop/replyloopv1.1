/**
 * The site's illustration parts, adapted for the film (brief §9.1, "Paper and Brass, set like
 * letterpress"). Copied from src/components/scenes/illustration/parts.tsx and
 * src/components/scenes/LoopThread.tsx, because the video bundle cannot resolve the site's "@/"
 * alias. Tokens and loop geometry are imported straight from the site by relative path (those
 * files import nothing), so the film can never drift from the site's palette or loop.
 *
 * Differences from the site helpers:
 * - No vector-effect. The film draws in an 800 x 450 viewBox scaled to the 1280 x 720 frame, so
 *   one unit is one screen px when the film plays about 800px wide on the page (its usual size),
 *   and the px tokens (strokes, radii, shadows) apply as they do on the site.
 * - Stroke widths are multiplied by `unit`, so a group drawn at another scale passes
 *   unit = 1 / scale and keeps the token widths on screen.
 * - The thread passes through LOOP_PATH itself (not the compact fit), uniformly scaled.
 */
import type { ReactNode } from "react";
import { INK, RADIUS, SHADOW, STROKE, WRITING } from "../../src/lib/illustration/tokens";
import { LOOP_PATH } from "../../src/lib/loop/geometry.generated";

export { INK, RADIUS, STROKE };

const r = (v: number) => {
  const x = Math.round(v * 100) / 100;
  return Object.is(x, -0) ? 0 : x;
};

/* Shadows ------------------------------------------------------------------------------------ */

const LAYERS = {
  contact: { k: [1.2, 0.4, -0.4, -1.2], w: [0.16, 0.34, 0.34, 0.16] },
  ambient: { k: [1.5, 0.75, 0, -0.75, -1.5], w: [0.12, 0.22, 0.32, 0.22, 0.12] },
} as const;

type Box = { x: number; y: number; width: number; height: number };

/** Pre-baked blurred rounded-rect shadow (stacked rects, no filter), light from 315 deg. */
export function SoftShadow({
  kind,
  x,
  y,
  width,
  height,
  radius,
  unit = 1,
  rotate,
}: Box & { kind: "contact" | "ambient"; radius: number; unit?: number; rotate?: number }) {
  const s = SHADOW[kind];
  const { k, w } = LAYERS[kind];
  const sigma = (s.blur / 2) * unit;
  const ox = x + s.dx * unit;
  const oy = y + s.dy * unit;
  const transform = rotate ? `rotate(${r(rotate)} ${r(ox + width / 2)} ${r(oy + height / 2)})` : undefined;
  return (
    <g fill={INK.charcoal} transform={transform}>
      {k.map((kk, i) => {
        const e = kk * sigma;
        if (width + 2 * e <= 0 || height + 2 * e <= 0) return null;
        return (
          <rect
            key={i}
            x={r(ox - e)}
            y={r(oy - e)}
            width={r(width + 2 * e)}
            height={r(height + 2 * e)}
            rx={r(Math.max(0, radius + e))}
            opacity={Math.round(w[i] * s.opacity * 10000) / 10000}
          />
        );
      })}
    </g>
  );
}

/* Writing ------------------------------------------------------------------------------------ */

/** 3 slate hairlines (92/78/54%, opacity .28) plus a short brass initial. No glyphs. */
export function Writing({
  x,
  y,
  width,
  unit = 1,
  gap = 9,
}: {
  x: number;
  y: number;
  width: number;
  unit?: number;
  gap?: number;
}) {
  const step = gap * unit;
  return (
    <g fill="none" stroke={INK.slate} strokeOpacity={WRITING.opacity} strokeWidth={STROKE.hair * unit} strokeLinecap="butt">
      {WRITING.lengths.map((l, i) => (
        <path key={i} d={`M${r(x)} ${r(y + i * step)}h${r(width * l)}`} />
      ))}
      <path d={`M${r(x)} ${r(y)}h${r(width * 0.08)}`} stroke={INK.brass} strokeOpacity={1} />
    </g>
  );
}

/* Notecard ----------------------------------------------------------------------------------- */

/**
 * A flat letterpress notecard: shared shadows, paper fill, 8px radius, 1.25px rule edge, a
 * blind-debossed loop in the top-right corner (paper-shade groove + paper highlight offset 0.5px)
 * and hairline writing with a brass initial.
 */
export function Notecard({ x, y, width, height, unit = 1, rotate = 0 }: Box & { unit?: number; rotate?: number }) {
  const radius = RADIUS.notecard * unit;
  const cx = x + width / 2;
  const cy = y + height / 2;
  const halfW = Math.min(width * 0.11, height * 0.36);
  const halfH = (halfW * 40.74) / 100;
  const m = width * 0.08;
  const lx = x + width - m - halfW;
  const ly = y + m + halfH;
  const s = halfW / 100;
  const hl = 0.5 * unit;
  const pad = width * 0.1;
  const writingWidth = width - 2 * pad - 2 * halfW - pad * 0.5;
  return (
    <g>
      <SoftShadow kind="ambient" x={x} y={y} width={width} height={height} radius={radius} unit={unit} rotate={rotate} />
      <SoftShadow kind="contact" x={x} y={y} width={width} height={height} radius={radius} unit={unit} rotate={rotate} />
      <g transform={`rotate(${r(rotate)} ${r(cx)} ${r(cy)})`}>
        <rect
          x={r(x)}
          y={r(y)}
          width={r(width)}
          height={r(height)}
          rx={r(radius)}
          fill={INK.paper}
          stroke={INK.rule}
          strokeWidth={STROKE.hair * unit}
        />
        <path
          d={LOOP_PATH}
          transform={`translate(${r(lx)} ${r(ly)}) scale(${s.toFixed(4)})`}
          fill="none"
          stroke={INK.paperShade}
          strokeWidth={(STROKE.rule * unit) / s}
        />
        <path
          d={LOOP_PATH}
          transform={`translate(${r(lx + hl)} ${r(ly + hl)}) scale(${s.toFixed(4)})`}
          fill="none"
          stroke={INK.paper}
          strokeWidth={(0.5 * unit) / s}
        />
        <Writing x={x + pad} y={y + height * 0.3} width={writingWidth} unit={unit} />
      </g>
    </g>
  );
}

/* LoopThread --------------------------------------------------------------------------------- */

type Pt = readonly [number, number];
type Cubic = readonly [Pt, Pt, Pt, Pt];

/** LOOP_PATH as absolute cubics (it is M + C only), parsed once. */
const LOOP_CUBICS: Cubic[] = (() => {
  const n = (LOOP_PATH.match(/-?\d*\.?\d+/g) ?? []).map(Number);
  const out: Cubic[] = [];
  let p: Pt = [n[0], n[1]];
  for (let i = 2; i + 5 < n.length; i += 6) {
    const c: Cubic = [p, [n[i], n[i + 1]], [n[i + 2], n[i + 3]], [n[i + 4], n[i + 5]]];
    out.push(c);
    p = c[3];
  }
  return out;
})();

/**
 * The same cubics, the same curve, entered on the crossing's other strand: start at the crossing's
 * second pass (the left lobe first), then run the whole list backwards. The path then leaves the
 * crossing heading down-right (+x, +y) instead of up-right, so a thread can run from upper left to
 * lower right through a level loop without a lead cutting across a lobe. Every point is still a
 * point of LOOP_PATH: no mirroring, no distortion.
 */
const LOOP_CUBICS_FALLING: Cubic[] = (() => {
  const half = LOOP_CUBICS.findIndex((c, i) => i > 0 && c[3][0] === 0 && c[3][1] === 0) + 1;
  const shifted = [...LOOP_CUBICS.slice(half), ...LOOP_CUBICS.slice(0, half)];
  return shifted.reverse().map(([a, b, c, d]): Cubic => [d, c, b, a]);
})();

const pt = (p: Pt) => `${r(p[0])} ${r(p[1])}`;
const cub = (a: Pt, b: Pt, c: Pt) => `C${pt(a)} ${pt(b)} ${pt(c)}`;

/**
 * One path: lead-in from `from` to the crossing (arriving along the loop's tangent), the whole
 * of LOOP_PATH (uniform scale, optional rotation about the crossing), and a lead-out to `to`.
 * Same construction as the site's loopThreadParts().all. `strand` picks which of the crossing's
 * two strands the thread enters on: "rising" (the site's default, lower left to upper right) or
 * "falling" (upper left to lower right).
 */
export function loopThreadPath({
  from,
  to,
  loopAt,
  loopScale,
  rotation = 0,
  strand = "rising",
}: {
  from: Pt;
  to: Pt;
  loopAt: Pt;
  loopScale: number;
  rotation?: number;
  strand?: "rising" | "falling";
}) {
  const cubics = strand === "falling" ? LOOP_CUBICS_FALLING : LOOP_CUBICS;
  const rad = (rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const place = ([x, y]: Pt): Pt => [loopAt[0] + loopScale * (x * cos - y * sin), loopAt[1] + loopScale * (x * sin + y * cos)];
  const [c0, c1] = cubics[0];
  const tx = c1[0] - c0[0];
  const ty = c1[1] - c0[1];
  const tl = Math.hypot(tx, ty);
  const t: Pt = [(tx * cos - ty * sin) / tl, (tx * sin + ty * cos) / tl];
  const C = loopAt;
  const dIn = Math.hypot(C[0] - from[0], C[1] - from[1]) / 3;
  const in1: Pt = [from[0] + (C[0] - from[0]) / 3, from[1] + (C[1] - from[1]) / 3];
  const in2: Pt = [C[0] - t[0] * dIn, C[1] - t[1] * dIn];
  const dOut = Math.hypot(to[0] - C[0], to[1] - C[1]) / 3;
  const out1: Pt = [C[0] + t[0] * dOut, C[1] + t[1] * dOut];
  const out2: Pt = [to[0] + (C[0] - to[0]) / 3, to[1] + (C[1] - to[1]) / 3];
  const body = cubics.map(([, a, b, c]) => cub(place(a), place(b), place(c))).join("");
  return `M${pt(from)}${cub(in1, in2, C)}${body}${cub(out1, out2, to)}`;
}

/** A group drawn at `scale` about the origin, then moved to (x, y). Children use unit = 1 / scale. */
export const Placed = ({ x, y, scale, children }: { x: number; y: number; scale: number; children: ReactNode }) => (
  <g transform={`translate(${r(x)} ${r(y)}) scale(${scale})`}>{children}</g>
);
