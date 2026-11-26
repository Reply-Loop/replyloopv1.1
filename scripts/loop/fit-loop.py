#!/usr/bin/env python3
"""
Derive the ReplyLoop loop curve from the kit's transparent mark.

Input:  assets/social-kit/identity/replyloop-loop-mark-transparent.png (1254x1254 RGBA)
Output: assets/loop/loop-fit.json

Method:
  1. Cast rays from the centre of each lobe; the midpoint of the first opaque run
     is a point on the stroke's centreline. 360 rays per lobe.
  2. Order the samples as one figure-eight: right lobe clockwise from the crossing,
     then left lobe counter-clockwise.
  3. Symmetrise: half a turn later the curve is mirrored in x, z(s+1/2) = -conj(z(s)),
     and the reversed curve is rotated 180 degrees, z(-s) = -z(s).
  4. Least-squares Fourier fit (K=11), skipping rays within 30 degrees of the
     crossing (they graze the other strand). Median fit error ~0.1 px.
  5. Resample by arc length to 256 points. Units: half-width = 1, y up.
  6. Measure the ivory crossing span along the rising strand (s near 0).

Run with: python3 -I scripts/loop/fit-loop.py   (needs Pillow)
"""
import cmath
import json
import math
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "assets/social-kit/identity/replyloop-loop-mark-transparent.png"
OUT = ROOT / "assets/loop/loop-fit.json"

CROSS = (624, 628)  # crossing point in source pixels
LOBES = {"right": 828, "left": 420}  # lobe centre x, same y as crossing
HALF_WIDTH_PX = 389.0  # centreline half-width in source pixels
STROKE_PX = 68.5  # median stroke width in source pixels


def main() -> None:
    im = Image.open(SRC).convert("RGBA")
    w, h = im.size
    px = im.load()

    def opaque(x: float, y: float) -> bool:
        return 0 <= x < w and 0 <= y < h and px[int(x), int(y)][3] > 128

    cx, cy = CROSS

    def lobe(lcx: float) -> dict[int, tuple[float, float]]:
        out = {}
        for deg in range(360):
            a = math.radians(deg)
            r, start = 5.0, None
            while r < 600:
                x, y = lcx + r * math.cos(a), cy - r * math.sin(a)
                if opaque(x, y) and start is None:
                    start = r
                if start is not None and not opaque(x, y):
                    break
                r += 0.5
            if start is not None:
                m = (start + r) / 2
                out[deg] = (lcx + m * math.cos(a), cy - m * math.sin(a))
        return out

    right, left = lobe(LOBES["right"]), lobe(LOBES["left"])
    seq = [right[a % 360] for a in range(180, -180, -1)] + [left[a % 360] for a in range(0, 360)]
    z = [complex((x - cx) / HALF_WIDTH_PX, -(y - cy) / HALF_WIDTH_PX) for x, y in seq]
    n = len(z)
    half = n // 2
    z = [(z[i] - z[(i + half) % n].conjugate() - z[(-i) % n] + z[(half - i) % n].conjugate()) / 4 for i in range(n)]

    keep = [i for i in range(n) if min(i % 360, 360 - i % 360) > 30]
    ks = list(range(-11, 12))
    coeffs = least_squares(
        [[cmath.exp(2j * math.pi * k * i / n) for k in ks] for i in keep],
        [z[i] for i in keep],
    )
    c = dict(zip(ks, coeffs))

    def f(s: float) -> complex:
        return sum(c[k] * cmath.exp(2j * math.pi * k * s) for k in ks)

    errs = sorted(abs(f(i / n) - z[i]) * HALF_WIDTH_PX for i in keep)
    fine = [f(i / 4096) for i in range(4096)]
    seg = [abs(fine[(i + 1) % 4096] - fine[i]) for i in range(4096)]
    total = sum(seg)
    pts, acc, j = [], 0.0, 0
    for k in range(256):
        t = k * total / 256
        while acc + seg[j] < t:
            acc += seg[j]
            j += 1
        u = (t - acc) / seg[j]
        pts.append(fine[j] + (fine[(j + 1) % 4096] - fine[j]) * u)

    window = [i for i in range(256) if min(i, 256 - i) < 256 * 0.15]
    params = []
    for y in range(0, h, 2):
        for x in range(0, w, 2):
            r, g, b, a = px[x, y]
            if a > 200 and r > 215 and g > 205:
                p = complex((x - cx) / HALF_WIDTH_PX, -(y - cy) / HALF_WIDTH_PX)
                i = min(window, key=lambda q: abs(pts[q] - p))
                params.append(((i / 256 + 0.5) % 1) - 0.5)
    params.sort()

    data = {
        "source": "assets/social-kit/identity/replyloop-loop-mark-transparent.png (1254x1254), ray-cast centerline, symmetrized, Fourier K=11, arc-length resampled",
        "fitErrorPx": {"median": round(errs[len(errs) // 2], 3), "max": round(errs[-1], 3)},
        "halfWidthPx": HALF_WIDTH_PX,
        "strokeOverHalfWidth": round(STROKE_PX / HALF_WIDTH_PX, 5),
        "ivoryRange": [round(params[int(len(params) * 0.01)], 4), round(params[int(len(params) * 0.99)], 4)],
        "points": [[round(p.real, 5), round(p.imag, 5)] for p in pts],
    }
    OUT.write_text(json.dumps(data))
    print(f"wrote {OUT.relative_to(ROOT)}: fit median {data['fitErrorPx']['median']} px, ivory {data['ivoryRange']}")


def least_squares(a: list[list[complex]], b: list[complex]) -> list[complex]:
    cols = len(a[0])
    m = [[sum(row[i].conjugate() * row[j] for row in a) for j in range(cols)] for i in range(cols)]
    v = [sum(a[r][i].conjugate() * b[r] for r in range(len(a))) for i in range(cols)]
    for i in range(cols):
        p = m[i][i]
        m[i] = [x / p for x in m[i]]
        v[i] /= p
        for r in range(cols):
            if r != i and m[r][i] != 0:
                fac = m[r][i]
                m[r] = [x - fac * y for x, y in zip(m[r], m[i])]
                v[r] -= fac * v[i]
    return v


if __name__ == "__main__":
    sys.exit(main())
