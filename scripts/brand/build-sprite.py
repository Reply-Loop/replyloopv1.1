#!/usr/bin/env python3
"""
Builds public/brand/sprite.svg: decorative art that repeats across pages, shipped
once instead of inline in every page's HTML and RSC payloads (brief §1.2).

Symbols:
- loop      LOOP_PATH as an open stroke drawing (stroke = currentColor), in the
            mark's own viewBox. Width set by the <use>; stroke width by the
            referencing <svg> through the --loop-stroke custom property.
- wordmark  "ReplyLoop" in Fraunces 500 at the display optical size (opsz 144),
            outlined, so it carries no text node (the brand name is real text
            elsewhere on the page) and needs no font. Fill = currentColor.

Usage: python3 -I scripts/brand/build-sprite.py
Needs fonttools and uharfbuzz (dev only: pip install fonttools uharfbuzz brotli).
Pages reference it as <svg><use href="/brand/sprite.svg#loop" /></svg>.
"""
import io
import pathlib
import re

import uharfbuzz as hb
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = pathlib.Path(__file__).resolve().parents[2]
FONT = ROOT / "src/app/fonts/fraunces-latin-opsz-wght.woff2"
GEOMETRY = ROOT / "src/lib/loop/geometry.generated.ts"
OUT = ROOT / "public/brand/sprite.svg"

WORD = "ReplyLoop"
AXES = {"wght": 500, "opsz": 144}


def wordmark():
    font = TTFont(FONT)
    inst = instantiateVariableFont(font, AXES, inplace=False)
    upem = inst["head"].unitsPerEm
    # Shape with HarfBuzz so kerning matches the browser. HarfBuzz cannot read
    # WOFF2, so hand it the decompressed sfnt (same glyph order as `font`).
    raw = io.BytesIO()
    sfnt = TTFont(FONT)
    sfnt.flavor = None
    sfnt.save(raw)
    blob = hb.Blob(raw.getvalue())
    face = hb.Face(blob)
    hbfont = hb.Font(face)
    hbfont.set_variations(AXES)
    buf = hb.Buffer()
    buf.add_str(WORD)
    buf.guess_segment_properties()
    hb.shape(hbfont, buf, {"kern": True, "liga": True})
    glyphs = inst.getGlyphSet()
    order = inst.getGlyphOrder()
    pen = SVGPathPen(glyphs, ntos=lambda v: f"{v:.1f}".rstrip("0").rstrip("."))
    bounds = BoundsPen(glyphs)
    x = 0
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        name = order[info.codepoint]
        if name == ".notdef":
            raise SystemExit(f"Glyph missing for a character in {WORD!r}: shaping failed")
        # Flip y (font units are y-up) and place at the pen position.
        tp = TransformPen(pen, (1, 0, 0, -1, x + pos.x_offset, -pos.y_offset))
        glyphs[name].draw(tp)
        glyphs[name].draw(TransformPen(bounds, (1, 0, 0, -1, x + pos.x_offset, -pos.y_offset)))
        x += pos.x_advance
    # Tight box around the drawn outlines (ink bounds), rounded out to whole units.
    x0, y0, x1, y1 = (round(v) for v in bounds.bounds)
    return pen.getCommands(), (x0, y0, x1 - x0, y1 - y0), upem


def loop():
    src = GEOMETRY.read_text()
    path = re.search(r'export const LOOP_PATH = "([^"]+)"', src).group(1)
    viewbox = re.search(r'export const LOOP_VIEWBOX = "([^"]+)"', src).group(1)
    return path, viewbox


def main():
    wm_path, (bx, by, bw, bh), _ = wordmark()
    loop_path, loop_vb = loop()
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg">'
        f'<symbol id="loop" viewBox="{loop_vb}">'
        f'<path d="{loop_path}" fill="none" stroke="currentColor" '
        'style="stroke-width:var(--loop-stroke,1.5px)" stroke-linejoin="round" '
        'stroke-linecap="round" vector-effect="non-scaling-stroke"/>'
        "</symbol>"
        f'<symbol id="wordmark" viewBox="{bx} {by} {bw} {bh}">'
        f'<path d="{wm_path}" fill="currentColor"/>'
        "</symbol>"
        "</svg>\n"
    )
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(svg)
    print(f"{OUT.relative_to(ROOT)}: {len(svg)} B raw; wordmark box {bw} x {bh} units")


if __name__ == "__main__":
    main()
