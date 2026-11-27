import { CatmullRomCurve3, Vector3 } from "three";
import { LOOP_CROSSING_RANGE, LOOP_POINTS } from "@/lib/loop/geometry.generated";

/**
 * The kit loop as a 3D curve. Same centreline as logo B (half-width 1, y up).
 * At the crossing the rising strand (s=0) lifts toward the camera and the other
 * strand (s=0.5) drops away, so the over-under reads in 3D exactly as the flat
 * mark draws it.
 */
/** The kit stroke is 0.1761 of the half-width (LOOP_STROKE / 100), so the tube silhouette matches the still. */
export const LOOP_TUBE_RADIUS = 0.088;
const LIFT = 0.12; // > radius, so the strands clear each other
const LIFT_WIDTH = 0.07; // fraction of the curve length

function lift(s: number): number {
  const d0 = Math.min(Math.abs(s), Math.abs(1 - s));
  const d5 = Math.abs(s - 0.5);
  const g = (d: number) => Math.exp(-(d * d) / (2 * LIFT_WIDTH * LIFT_WIDTH));
  return LIFT * (g(d0) - g(d5));
}

export function loopPoints(from = 0, to = 1): Vector3[] {
  const n = LOOP_POINTS.length;
  const out: Vector3[] = [];
  const steps = Math.max(2, Math.round((to - from) * n));
  for (let i = 0; i <= steps; i++) {
    let s = from + ((to - from) * i) / steps;
    if (to - from >= 1 && i === steps) break; // closed curve: do not repeat the first point
    s = ((s % 1) + 1) % 1;
    const f = s * n;
    const i0 = Math.floor(f) % n;
    const i1 = (i0 + 1) % n;
    const t = f - Math.floor(f);
    const [x0, y0] = LOOP_POINTS[i0];
    const [x1, y1] = LOOP_POINTS[i1];
    out.push(new Vector3(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, lift(s)));
  }
  return out;
}

export function loopCurve() {
  return new CatmullRomCurve3(loopPoints(), true, "centripetal");
}

/** The crossing band: the rising strand across the crossing (12.5% of the length). */
export function crossingCurve() {
  const [a, b] = LOOP_CROSSING_RANGE;
  return new CatmullRomCurve3(loopPoints(a, b), false, "centripetal");
}
