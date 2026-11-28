import { ImageResponse } from "next/og";
import type { ReactNode } from "react";
import type { IconName } from "@/components/ui/Icon";
import { loadOgFonts } from "@/lib/og-fonts";
import { INK, RADIUS, SHADOW, WRITING } from "@/lib/illustration/tokens";
import { LOOP_PATH_COMPACT } from "./loop/compact";
import { LOOP_CROSSING_PATH, LOOP_PATH, LOOP_STROKE, LOOP_VIEWBOX } from "./loop/geometry.generated";

/**
 * Open Graph card (brief §8.12): flat charcoal, live Fraunces/Inter text on the left, and a
 * decorative brass-line (#B8894A) stroke drawing of the loop cropped off the right edge, as on
 * the film's title card. Service cards add their emblem object (the same drawings as the hero
 * emblems in src/components/scenes/ServiceEmblem.tsx) in an ivory medallion inside the loop's
 * visible lobe.
 *
 * Rendering notes (satori + resvg, next/og):
 * - Flat vector only: no texture, felt, noise, gradients or filters (they defeat PNG palette
 *   quantisation in scripts/static-finish.mjs and the 70 KB per-card budget).
 * - No baked text: every word is a live text node; the SVG carries shapes only.
 * - Stroke widths are computed in each group's own units instead of vector-effect, so the
 *   result does not depend on resvg's non-scaling-stroke support.
 * - Fonts are the bundled OFL files in assets/fonts (woff; satori cannot read woff2), read
 *   from disk at build, never fetched.
 */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/** Copy a view into its own ArrayBuffer (a cached view can sit inside a larger buffer). */
function exact(view: Uint8Array): ArrayBuffer {
  return view.slice().buffer as ArrayBuffer;
}

const r = (v: number) => Math.round(v * 100) / 100;

/** --color-mist: secondary text on charcoal (not in the illustration INK set). */
const MIST = "#C9C4BA";

/* -------------------------------------------------------------------------------------------- */
/* The loop: LOOP_PATH_COMPACT (half-width 100 units, centred on the crossing), uniformly scaled, */
/* crossing near the right edge so most of the right lobe runs off the card.                      */

const LOOP = {
  /** The crossing, card px. */
  at: [1062, 300] as const,
  /** px per loop unit (half-width 350px; the left lobe spans x 712-1062). */
  k: 3.5,
  /** Line weight in card px (about 1.5px in a 600px-wide feed preview). */
  line: 3,
};

/** The emblem medallion: centred in the left lobe (loop x = -52), clear of the line. */
const MEDALLION = { cx: LOOP.at[0] - 52 * LOOP.k, cy: LOOP.at[1], r: 110 };
/** The 64-unit object drawings at 2.4x (about 154px), centred in the medallion. */
const OBJECT_SCALE = 2.4;

/* -------------------------------------------------------------------------------------------- */
/* Emblem objects (64-unit viewBox, unit = 1). They mirror the drawings in ServiceEmblem.tsx;    */
/* keep the two in step. Hair strokes are 1.25 units (3px at 2.4x).                             */

const HAIR = 1.25;
const edge = { stroke: INK.rule, strokeWidth: HAIR };

/**
 * The contact shadow only (as illustration/parts SoftShadow kind "contact", light from 315 deg):
 * stacked rects, no filter. The ambient layer is left out: at 2x its stepped rects read as a
 * pale square on the medallion, and the extra tints cost palette entries.
 * Plain functions, called as {shadow(...)}: satori accepts only intrinsic elements inside <svg>.
 */
const CONTACT = { k: [1.2, 0.4, -0.4, -1.2], w: [0.16, 0.34, 0.34, 0.16] } as const;

type Box = { x: number; y: number; width: number; height: number; radius: number; rotate?: number };

function shadow({ x, y, width, height, radius, rotate }: Box) {
  const s = SHADOW.contact;
  const sigma = s.blur / 2;
  const ox = x + s.dx;
  const oy = y + s.dy;
  return (
    <g fill={INK.charcoal} transform={rotate ? `rotate(${r(rotate)} ${r(ox + width / 2)} ${r(oy + height / 2)})` : undefined}>
      {CONTACT.k.map((kk, i) => {
        const e = kk * sigma;
        return (
          <rect
            key={i}
            x={r(ox - e)}
            y={r(oy - e)}
            width={r(width + 2 * e)}
            height={r(height + 2 * e)}
            rx={r(Math.max(0, radius + e))}
            opacity={Math.round(CONTACT.w[i] * s.opacity * 10000) / 10000}
          />
        );
      })}
    </g>
  );
}

/** Hairline "writing": three slate lines (92/78/54%, opacity .28) and a short brass initial. */
function writing({ x, y, width, gap }: { x: number; y: number; width: number; gap: number }) {
  return (
    <g fill="none" strokeWidth={HAIR}>
      {WRITING.lengths.map((l, i) => (
        <path key={i} d={`M${r(x)} ${r(y + i * gap)}h${r(width * l)}`} stroke={INK.slate} strokeOpacity={WRITING.opacity} />
      ))}
      <path d={`M${r(x)} ${r(y)}h${r(width * 0.08)}`} stroke={INK.brass} />
    </g>
  );
}

/** Review replies: a notecard with a blind-debossed loop (Notecard deboss, unit 1). */
function repliesObject() {
  const card = { x: 7, y: 13, width: 50, height: 38 };
  const rc = RADIUS.notecard;
  const halfW = Math.min(card.width * 0.11, card.height * 0.36);
  const m = card.width * 0.08;
  const lx = card.x + card.width - m - halfW;
  const ly = card.y + m + (halfW * 40.74) / 100;
  const s = halfW / 100;
  const pad = card.width * 0.1;
  return (
    <>
      {shadow({ ...card, radius: rc, rotate: -4 })}
      <g transform={`rotate(-4 ${card.x + card.width / 2} ${card.y + card.height / 2})`}>
        <rect {...card} rx={rc} fill={INK.paper} {...edge} />
        <path d={LOOP_PATH_COMPACT} transform={`translate(${r(lx)} ${r(ly)}) scale(${r(s * 1000) / 1000})`} fill="none" stroke={INK.paperShade} strokeWidth={r(1 / s)} />
        <path d={LOOP_PATH_COMPACT} transform={`translate(${r(lx + 0.5)} ${r(ly + 0.5)}) scale(${r(s * 1000) / 1000})`} fill="none" stroke={INK.paper} strokeWidth={r(0.5 / s)} />
        {writing({ x: card.x + pad, y: card.y + card.height * 0.3, width: card.width - 2.5 * pad - 2 * halfW, gap: 9 })}
      </g>
    </>
  );
}

/** Social content: three fanned proof cards about a pivot below their centre. */
const PROOF = { w: 30, h: 38, pivot: [33, 50] as const, reach: 17, fan: [-18, -4, 11] as const };
const proofs = PROOF.fan.map((deg) => {
  const a = (deg * Math.PI) / 180;
  const cx = r(PROOF.pivot[0] + PROOF.reach * Math.sin(a));
  const cy = r(PROOF.pivot[1] - PROOF.reach * Math.cos(a));
  return { deg, cx, cy, x: r(cx - PROOF.w / 2), y: r(cy - PROOF.h / 2) };
});

function socialObject() {
  const front = proofs[2];
  const box = { width: PROOF.w, height: PROOF.h, radius: RADIUS.proof };
  return (
    <>
      {proofs.map((p, i) => (
        <g key={p.deg}>
          {shadow({ x: p.x, y: p.y, rotate: p.deg, ...box })}
          <rect
            x={p.x}
            y={p.y}
            width={PROOF.w}
            height={PROOF.h}
            rx={RADIUS.proof}
            transform={`rotate(${p.deg} ${p.cx} ${p.cy})`}
            fill={i === 2 ? INK.paper : INK.ivory}
            {...edge}
          />
        </g>
      ))}
      <g transform={`rotate(${front.deg} ${front.cx} ${front.cy})`}>
        {writing({ x: front.x + 5, y: front.y + 11, width: 20, gap: 6.5 })}
      </g>
    </>
  );
}

/** Local SEO: a tri-fold paper map with two hairline roads and a flat brass pin. */
function seoObject() {
  return (
    <>
      {shadow({ x: 8, y: 17, width: 48, height: 37, radius: 0 })}
      <g strokeLinejoin="round" {...edge}>
        <path d="M8 17l16 4v33l-16-4z" fill={INK.paper} />
        <path d="M24 21l16-4v33l-16 4z" fill={INK.paperShade} />
        <path d="M40 17l16 4v33l-16-4z" fill={INK.paper} />
      </g>
      <path
        d="M8 41c6-1 11 2 16 2.5S34 38 40 37s12 3 16 2.5M15 18.8c1 11-2 21 1 33"
        fill="none"
        stroke={INK.slate}
        strokeOpacity={0.28}
        strokeWidth={HAIR}
      />
      {shadow({ x: 43, y: 36.5, width: 9, height: 3, radius: 1.5 })}
      <path d="M44 38c-2.4-3.4-6.5-7.2-6.5-12a6.5 6.5 0 0 1 13 0c0 4.8-4.1 8.6-6.5 12z" fill={INK.brass} />
      <path d="M44 38c2.4-3.4 6.5-7.2 6.5-12a6.5 6.5 0 0 0-6.5-6.5z" fill={INK.brassShadow} />
      <circle cx={44} cy={26} r={2.4} fill={INK.paper} />
      <path d="M39.6 24.4a4.6 4.6 0 0 1 2.9-3.3" fill="none" stroke={INK.brassLight} strokeLinecap="round" strokeWidth={HAIR} />
    </>
  );
}

/** Websites: an open ivory door with a brass knob and threshold. */
function websitesObject() {
  return (
    <>
      {shadow({ x: 16, y: 8, width: 28, height: 42, radius: 1 })}
      <rect x={16} y={8} width={28} height={42} rx={1} fill={INK.paper} {...edge} />
      <rect x={20} y={12} width={20} height={38} fill={INK.paperShade} {...edge} />
      {shadow({ x: 40, y: 9, width: 11, height: 44, radius: 0 })}
      <path d="M40 12l11-4v46l-11-4z" fill={INK.ivory} strokeLinejoin="round" {...edge} />
      <path d="M42.5 15.6l6-2.1v14l-6 1.3z" fill="none" strokeLinejoin="round" {...edge} />
      <circle cx={48.8} cy={33} r={1.3} fill={INK.brass} />
      <rect x={17} y={50} width={26} height={3.5} rx={0.75} fill={INK.brass} />
      <rect x={17} y={52} width={26} height={1.5} rx={0.75} fill={INK.brassShadow} />
      <path d="M18.5 50.8h23" stroke={INK.brassLight} strokeWidth={HAIR} />
    </>
  );
}

/** Owner Q&A videos: a brass-trimmed notecard on a small brass easel. */
function videosObject() {
  const card = { x: 11, y: 17, width: 42, height: 30 };
  const rc = RADIUS.notecard;
  return (
    <>
      <path d="M31.4 46h1.8l3.4 13h-1.8z" fill={INK.brassShadow} />
      <path d="M31.2 5h1.6L18.6 59h-2.4zM31.2 5h1.6l15 54h-2.4z" fill={INK.brass} />
      {shadow({ ...card, radius: rc })}
      <rect {...card} rx={rc} fill={INK.paper} {...edge} />
      <rect x={14} y={20} width={36} height={24} rx={rc - 3} fill="none" stroke={INK.brass} strokeWidth={HAIR} />
      {writing({ x: 18, y: 27.5, width: 26, gap: 6 })}
      {shadow({ x: 9, y: 46.5, width: 46, height: 3, radius: 0.75 })}
      <rect x={9} y={46.5} width={46} height={3} rx={0.75} fill={INK.brass} />
      <rect x={9} y={48.5} width={46} height={1.5} rx={0.75} fill={INK.brassShadow} />
      <path d="M10.5 47.3h43" stroke={INK.brassLight} strokeWidth={HAIR} />
    </>
  );
}

export type OgObject = "replies" | "social" | "seo" | "websites" | "videos";

const OBJECTS: Record<OgObject, () => ReactNode> = {
  replies: repliesObject,
  social: socialObject,
  seo: seoObject,
  websites: websitesObject,
  videos: videosObject,
};

/** Service pages pass page.icon (as ServiceEmblem does); each service icon maps to its object. */
const ICON_OBJECT: Partial<Record<IconName, OgObject>> = {
  reply: "replies",
  social: "social",
  pin: "seo",
  browser: "websites",
  video: "videos",
};

/* -------------------------------------------------------------------------------------------- */

/** The decorative art layer: one SVG the size of the card, behind the text. No text inside. */
function Art({ object }: { object?: OgObject }) {
  const drawObject = object ? OBJECTS[object] : undefined;
  const o = (64 * OBJECT_SCALE) / 2;
  return (
    <svg
      width={ogSize.width}
      height={ogSize.height}
      viewBox={`0 0 ${ogSize.width} ${ogSize.height}`}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <path
        d={LOOP_PATH_COMPACT}
        transform={`translate(${LOOP.at[0]} ${LOOP.at[1]}) scale(${LOOP.k})`}
        fill="none"
        stroke={INK.brassLine}
        strokeWidth={r(LOOP.line / LOOP.k)}
        strokeLinejoin="round"
      />
      {drawObject ? (
        <>
          <circle cx={MEDALLION.cx} cy={MEDALLION.cy} r={MEDALLION.r} fill={INK.ivory} />
          <g transform={`translate(${MEDALLION.cx - o} ${MEDALLION.cy - o}) scale(${OBJECT_SCALE})`}>
            {drawObject()}
          </g>
        </>
      ) : null}
    </svg>
  );
}

export async function renderOg({ eyebrow, title, object }: { eyebrow: string; title: string; object?: OgObject }) {
  const { fraunces, inter } = await loadOgFonts();
  // The text column ends left of the loop's lobe (x 712), so long titles step down sooner.
  const titleSize = title.length > 70 ? 50 : title.length > 45 ? 58 : 70;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          background: INK.charcoal,
          padding: "72px 80px",
          color: INK.ivory,
          fontFamily: "Inter",
        }}
      >
        <Art object={object} />
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* The mark in today's brass fill (owner decision §13.1 pending: not recoloured). */}
          <svg width="74" height="34" viewBox={LOOP_VIEWBOX} fill="none">
            <path d={LOOP_PATH} stroke={INK.brass} strokeWidth={LOOP_STROKE} strokeLinejoin="round" />
            <path d={LOOP_CROSSING_PATH} stroke={INK.ivory} strokeWidth={LOOP_STROKE + 0.4} />
          </svg>
          <div style={{ fontFamily: "Fraunces", fontSize: 38 }}>ReplyLoop</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 580 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28 }}>
            <div style={{ width: 56, height: 2, background: INK.brassLine }} />
            <div style={{ fontSize: 24, letterSpacing: 4, textTransform: "uppercase", color: MIST }}>{eyebrow}</div>
          </div>
          <div style={{ fontFamily: "Fraunces", fontSize: titleSize, lineHeight: 1.08 }}>{title}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: MIST }}>
          <div>Keep the thank you alive.</div>
          <div>reply-loop.com</div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Fraunces", data: exact(fraunces), style: "normal", weight: 500 },
        { name: "Inter", data: exact(inter), style: "normal", weight: 500 },
      ],
    },
  );
}

/** A service page's card: its eyebrow and H1 (locked copy) with its emblem object. */
export function renderServiceOg(page: { eyebrow: string; h1: string; icon: IconName }) {
  return renderOg({ eyebrow: page.eyebrow, title: page.h1, object: ICON_OBJECT[page.icon] });
}
