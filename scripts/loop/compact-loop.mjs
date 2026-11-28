#!/usr/bin/env node
/**
 * Prints LOOP_PATH_COMPACT: the mark's loop (LOOP_PATH in src/lib/loop/geometry.generated.ts)
 * as a closed path of 16 cubic Beziers, coordinates rounded to 1 decimal, for inline
 * illustration SVGs where the 128-segment LOOP_PATH (~2.4 KB) is too heavy.
 *
 * Method: the reference curve is LOOP_PATH itself (parsed and densely sampled). The loop is
 * symmetric in x and in y, so one quarter (crossing -> top of the right lobe -> right tip)
 * is fitted and mirrored. Knots sit on the reference curve with its exact unit tangents
 * (so every join is C1-smooth); each segment's two handle lengths are a least-squares fit
 * to the reference samples with nearest-point re-parameterisation, and the interior knot
 * positions (arc-length fractions) are tuned by coordinate descent to minimise the maximum
 * deviation. The check measures the distance from every LOOP_POINTS point (x100, y flipped,
 * i.e. LOOP_PATH's own points) and every dense LOOP_PATH sample to the rounded compact curve.
 *
 * Run: node scripts/loop/compact-loop.mjs   (plain node, no dependencies)
 * Then paste the printed string into src/lib/loop/compact.ts.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const src = readFileSync(join(root, "src/lib/loop/geometry.generated.ts"), "utf8");

const LOOP_PATH = src.match(/export const LOOP_PATH = "([^"]+)"/)[1];
const LOOP_POINTS = JSON.parse(src.match(/export const LOOP_POINTS[^=]*= (\[\[.*?\]\]);/s)[1]);

const QUARTER_SEGMENTS = 4; // x4 quarters = 16 segments

// ---------- geometry helpers ----------
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const mul = (a, k) => [a[0] * k, a[1] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const len = (a) => Math.hypot(a[0], a[1]);
const norm = (a) => mul(a, 1 / len(a));

function bez(c, t) {
  const u = 1 - t;
  return [
    u * u * u * c[0][0] + 3 * u * u * t * c[1][0] + 3 * u * t * t * c[2][0] + t * t * t * c[3][0],
    u * u * u * c[0][1] + 3 * u * u * t * c[1][1] + 3 * u * t * t * c[2][1] + t * t * t * c[3][1],
  ];
}
function bezD(c, t) {
  const u = 1 - t;
  return [
    3 * u * u * (c[1][0] - c[0][0]) + 6 * u * t * (c[2][0] - c[1][0]) + 3 * t * t * (c[3][0] - c[2][0]),
    3 * u * u * (c[1][1] - c[0][1]) + 6 * u * t * (c[2][1] - c[1][1]) + 3 * t * t * (c[3][1] - c[2][1]),
  ];
}
function bezDD(c, t) {
  const u = 1 - t;
  return [
    6 * u * (c[2][0] - 2 * c[1][0] + c[0][0]) + 6 * t * (c[3][0] - 2 * c[2][0] + c[1][0]),
    6 * u * (c[2][1] - 2 * c[1][1] + c[0][1]) + 6 * t * (c[3][1] - 2 * c[2][1] + c[1][1]),
  ];
}

/** Absolute "M x y C ... Z" path -> list of cubic control quads. */
function parseCubics(d) {
  const nums = d.match(/-?\d*\.?\d+(?:e-?\d+)?/gi).map(Number);
  let p = [nums[0], nums[1]];
  const out = [];
  for (let i = 2; i + 5 < nums.length + 0; i += 6) {
    const c = [p, [nums[i], nums[i + 1]], [nums[i + 2], nums[i + 3]], [nums[i + 4], nums[i + 5]]];
    out.push(c);
    p = c[3];
  }
  return out;
}

// ---------- reference curve: dense samples of LOOP_PATH with arc length and tangents ----------
const ref = parseCubics(LOOP_PATH);
const SUB = 40;
const dense = []; // {p, s, tan}
let s = 0;
let prev = null;
for (const c of ref) {
  for (let k = 0; k < SUB; k++) {
    const t = k / SUB;
    const p = bez(c, t);
    if (prev) s += len(sub(p, prev));
    dense.push({ p, s, tan: norm(bezD(c, t)) });
    prev = p;
  }
}

// Quarter: crossing (s=0) to the right lobe's tip (the point with max x, a quarter of the arc length).
const tipIdx = dense.reduce((bi, d, i) => (d.p[0] > dense[bi].p[0] ? i : bi), 0);
const quarterLen = dense[tipIdx].s;

/** Reference point and unit tangent at arc length s (linear interpolation of dense samples). */
function at(sv) {
  let i = dense.findIndex((d) => d.s >= sv);
  if (i <= 0) return { p: dense[0].p, tan: dense[0].tan };
  const a = dense[i - 1], b = dense[i];
  const f = (sv - a.s) / (b.s - a.s);
  return { p: add(a.p, mul(sub(b.p, a.p), f)), tan: norm(add(mul(a.tan, 1 - f), mul(b.tan, f))) };
}

// Force the symmetric quarter's ends exactly: crossing at (0,0), tip at (x,0) with a vertical tangent.
function knot(sv) {
  if (sv <= 0) return { p: [0, 0], tan: dense[0].tan };
  if (sv >= quarterLen) return { p: [dense[tipIdx].p[0], 0], tan: [0, 1] };
  return at(sv);
}

/** Nearest-point parameter of q on cubic c, starting from t0 (Newton). */
function project(c, q, t0) {
  let t = t0;
  for (let k = 0; k < 8; k++) {
    const d = sub(bez(c, t), q);
    const d1 = bezD(c, t), d2 = bezDD(c, t);
    const num = dot(d, d1);
    const den = dot(d1, d1) + dot(d, d2);
    if (Math.abs(den) < 1e-12) break;
    t = Math.min(1, Math.max(0, t - num / den));
  }
  return t;
}

/** Fit one segment between arc lengths s0 and s1: handle lengths by least squares. */
function fitSegment(s0, s1) {
  const A = knot(s0), B = knot(s1);
  const samples = dense.filter((d) => d.s > s0 && d.s < s1).map((d) => d.p);
  const chord = len(sub(B.p, A.p));
  let a = chord / 3, b = chord / 3;
  let ts = samples.map((_, i) => (i + 1) / (samples.length + 1));
  let c;
  for (let iter = 0; iter < 30; iter++) {
    // Linear least squares in (a, b): P(t) = base(t) + a*B1*T0 - b*B2*T1.
    let m11 = 0, m12 = 0, m22 = 0, r1 = 0, r2 = 0;
    samples.forEach((q, i) => {
      const t = ts[i], u = 1 - t;
      const b0 = u * u * u, b1 = 3 * u * u * t, b2 = 3 * u * t * t, b3 = t * t * t;
      const base = add(mul(A.p, b0 + b1), mul(B.p, b2 + b3));
      const va = mul(A.tan, b1), vb = mul(B.tan, -b2);
      const rv = sub(q, base);
      m11 += dot(va, va); m12 += dot(va, vb); m22 += dot(vb, vb);
      r1 += dot(va, rv); r2 += dot(vb, rv);
    });
    const det = m11 * m22 - m12 * m12;
    if (Math.abs(det) > 1e-12) {
      a = (r1 * m22 - r2 * m12) / det;
      b = (m11 * r2 - m12 * r1) / det;
    }
    c = [A.p, add(A.p, mul(A.tan, a)), sub(B.p, mul(B.tan, b)), B.p];
    ts = samples.map((q, i) => project(c, q, ts[i]));
  }
  return c;
}

function fitQuarter(fracs) {
  const knots = [0, ...fracs.map((f) => f * quarterLen), quarterLen];
  const segs = [];
  for (let i = 0; i < knots.length - 1; i++) segs.push(fitSegment(knots[i], knots[i + 1]));
  return segs;
}

// ---------- assemble the full loop by symmetry ----------
const mirY = ([x, y]) => [x, -y];
const mirX = ([x, y]) => [-x, y];
const rev = (c) => [c[3], c[2], c[1], c[0]];
function fullLoop(q1) {
  const q2 = q1.map((c) => rev(c.map(mirY))).reverse(); // tip -> bottom -> crossing
  const q3 = q1.map((c) => c.map(mirX)); // crossing -> top-left -> left tip
  const q4 = q2.map((c) => c.map(mirX)); // left tip -> bottom-left -> crossing
  return [...q1, ...q2, ...q3, ...q4];
}

const r1 = (v) => {
  const x = Math.round(v * 10) / 10;
  return Object.is(x, -0) ? 0 : x;
};
const roundLoop = (segs) => segs.map((c) => c.map(([x, y]) => [r1(x), r1(y)]));

function fmt(segs) {
  const n = (v) => String(v);
  const pair = ([x, y]) => `${n(x)}${y < 0 ? "" : " "}${n(y)}`;
  const join = (pts) =>
    pts.reduce((acc, p, i) => {
      const s2 = pair(p);
      if (i === 0) return s2;
      return acc + (p[0] < 0 ? "" : " ") + s2;
    }, "");
  let d = `M${pair(segs[0][0])}`;
  for (const c of segs) d += `C${join([c[1], c[2], c[3]])}`;
  return `${d}Z`;
}

/** Max distance from a set of points to a set of cubic segments. */
function maxDev(points, segs) {
  const poly = [];
  for (const c of segs) for (let k = 0; k <= 400; k++) poly.push(bez(c, k / 400));
  let worst = 0;
  for (const q of points) {
    let best = Infinity;
    for (let i = 0; i < poly.length - 1; i++) {
      const a = poly[i], b = poly[i + 1];
      const ab = sub(b, a);
      const t = Math.max(0, Math.min(1, dot(sub(q, a), ab) / dot(ab, ab)));
      const dd = len(sub(q, add(a, mul(ab, t))));
      if (dd < best) best = dd;
    }
    if (best > worst) worst = best;
  }
  return worst;
}

// Quarter-only error (fast) for the knot search, against the dense reference in the quarter.
const quarterRef = dense.filter((d) => d.s <= quarterLen).map((d) => d.p).filter((_, i) => i % 4 === 0);
const quarterErr = (fracs) => maxDev(quarterRef, fitQuarter(fracs));

// Start from even arc-length knots, then coordinate descent on the interior knots.
let fracs = Array.from({ length: QUARTER_SEGMENTS - 1 }, (_, i) => (i + 1) / QUARTER_SEGMENTS);
let err = quarterErr(fracs);
for (let step = 0.04; step > 0.001; step /= 2) {
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 0; i < fracs.length; i++) {
      for (const dir of [-1, 1]) {
        const tryF = fracs.slice();
        tryF[i] += dir * step;
        const lo = i === 0 ? 0.02 : tryF[i - 1] + 0.02;
        const hi = i === fracs.length - 1 ? 0.98 : tryF[i + 1] - 0.02;
        if (tryF[i] < lo || tryF[i] > hi) continue;
        const e = quarterErr(tryF);
        if (e < err - 1e-6) {
          err = e;
          fracs = tryF;
          improved = true;
        }
      }
    }
  }
}

const compact = roundLoop(fullLoop(fitQuarter(fracs)));
const d = fmt(compact);

const pointsSvg = LOOP_POINTS.map(([x, y]) => [x * 100, -y * 100]);
const devPoints = maxDev(pointsSvg, compact);
const devDense = maxDev(dense.filter((_, i) => i % 2 === 0).map((x) => x.p), compact);

const xs = [], ys = [];
for (const c of compact) for (let k = 0; k <= 200; k++) {
  const p = bez(c, k / 200);
  xs.push(p[0]);
  ys.push(p[1]);
}
const r2 = (v) => Math.round(v * 100) / 100;
const bounds = {
  x: [r2(Math.min(...xs)), r2(Math.max(...xs))],
  y: [r2(Math.min(...ys)), r2(Math.max(...ys))],
};

console.log(d);
console.error(
  JSON.stringify(
    {
      segments: compact.length,
      chars: d.length,
      knotFractions: fracs.map((f) => Math.round(f * 1000) / 1000),
      maxDeviationFromLoopPoints: Math.round(devPoints * 1000) / 1000,
      maxDeviationFromDenseLoopPath: Math.round(devDense * 1000) / 1000,
      startTangent: norm(sub(compact[0][1], compact[0][0])).map((v) => Math.round(v * 1e4) / 1e4),
      bounds,
    },
    null,
    2,
  ),
);
