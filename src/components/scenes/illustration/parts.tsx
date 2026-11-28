import { INK, RADIUS, SHADOW, STROKE, WRITING } from "@/lib/illustration/tokens";
import { LOOP_PATH_COMPACT } from "@/lib/loop/compact";

/**
 * Shared illustration parts (brief §9.1). Server-safe: plain SVG elements, no hooks.
 * Every geometry prop is in the drawing's viewBox units; `unit` is viewBox units per screen
 * px at the drawing's design size, used to convert the px tokens (offsets, blur, radii, gaps).
 * Stroke widths are screen px and non-scaling, so they need no conversion.
 * No <filter>, no gradients: shadows are pre-baked stacked shapes (rule 4).
 */

const r = (v: number) => {
  const x = Math.round(v * 100) / 100;
  return Object.is(x, -0) ? 0 : x;
};

/* ------------------------------------------------------------------------------------------ */

/**
 * Gaussian falloff approximated by stacked rounded rects: expansions in multiples of sigma
 * (blur / 2) and weights that sum to 1, so the layer opacities sum to the token opacity.
 * Coverage outside the edge steps 0 -> w0 -> w0+w1 ..., tracking 1 - Phi(d / sigma).
 */
const LAYERS = {
  contact: { k: [1.2, 0.4, -0.4, -1.2], w: [0.16, 0.34, 0.34, 0.16] },
  ambient: { k: [1.5, 0.75, 0, -0.75, -1.5], w: [0.12, 0.22, 0.32, 0.22, 0.12] },
} as const;

export type SoftShadowProps = {
  kind: "contact" | "ambient";
  /** The casting object's box, viewBox units. */
  x: number;
  y: number;
  width: number;
  height: number;
  /** The object's corner radius, viewBox units. */
  radius: number;
  /** viewBox units per screen px. */
  unit: number;
  /** Degrees around the object's centre, matching a rotated object; the offset stays at 315 deg light. */
  rotate?: number;
};

/**
 * A pre-baked blurred rounded-rect shadow: one <g fill=charcoal> holding 4 (contact) or
 * 5 (ambient) rects, offset by (dx, dy). No filter. Draw it before (under) its object.
 */
export function SoftShadow({ kind, x, y, width, height, radius, unit, rotate }: SoftShadowProps) {
  const s = SHADOW[kind];
  const { k, w } = LAYERS[kind];
  const sigma = (s.blur / 2) * unit;
  const ox = x + s.dx * unit;
  const oy = y + s.dy * unit;
  const transform = rotate
    ? `rotate(${r(rotate)} ${r(ox + width / 2)} ${r(oy + height / 2)})`
    : undefined;
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

/* ------------------------------------------------------------------------------------------ */

export type WritingProps = {
  /** Left end of the lines, viewBox units. */
  x: number;
  /** The first line's y, viewBox units. */
  y: number;
  /** The writing block's width (line 1 is 92% of it), viewBox units. */
  width: number;
  /** viewBox units per screen px. */
  unit: number;
  /** Line gap in screen px. Default 9. */
  gap?: number;
  /** Extra attributes on each of the 4 strokes (draw hooks, e.g. { "data-v-draw": "true" }). */
  partProps?: Record<string, string>;
};

/**
 * Hairline "writing" (rule 8): 3 slate hairlines at 92/78/54% of `width`, opacity .28, plus a
 * short brass initial (8% of `width`) at the start of line 1, drawn on top. 4 strokes in one
 * <g>; butt caps, so a zero-length dash paints nothing in a draw before-state.
 */
export function Writing({ x, y, width, unit, gap = 9, partProps }: WritingProps) {
  const step = gap * unit;
  const p = { vectorEffect: "non-scaling-stroke" as const, ...partProps };
  return (
    <g
      fill="none"
      stroke={INK.slate}
      strokeOpacity={WRITING.opacity}
      strokeWidth={STROKE.hair}
      strokeLinecap="butt"
    >
      {WRITING.lengths.map((l, i) => (
        <path key={i} d={`M${r(x)} ${r(y + i * step)}h${r(width * l)}`} {...p} />
      ))}
      <path d={`M${r(x)} ${r(y)}h${r(width * 0.08)}`} stroke={INK.brass} strokeOpacity={1} {...p} />
    </g>
  );
}

/* ------------------------------------------------------------------------------------------ */

/**
 * The loop as a reusable def: put <LoopDef id="..."/> in the SVG's <defs> once and pass the
 * same id to <Notecard debossHref> so several notecards share one copy of the path data.
 * Stroke comes from each <use>; vector-effect is set here because it does not inherit.
 */
export function LoopDef({ id }: { id: string }) {
  return <path id={id} d={LOOP_PATH_COMPACT} fill="none" vectorEffect="non-scaling-stroke" />;
}

export type NotecardProps = {
  /** The card's box, viewBox units (unrotated). */
  x: number;
  y: number;
  width: number;
  height: number;
  /** viewBox units per screen px. */
  unit: number;
  /** Card fill: "paper" on ivory grounds (default), "ivory" on paper grounds. */
  surface?: "paper" | "ivory";
  /** Blind-debossed loop in a corner. Default false. */
  deboss?: boolean;
  /** Default "tr". */
  debossCorner?: "tr" | "br";
  /** Id of a <LoopDef> in this SVG's <defs>: the deboss then uses <use> instead of inline data. */
  debossHref?: string;
  /** Hairline writing with a brass initial. Default true. */
  writing?: boolean;
  /** Degrees around the card's centre. */
  rotate?: number;
  className?: string;
};

/**
 * A flat letterpress notecard (rule 2, 5, 7): ambient + contact <SoftShadow>, a flat card with
 * an 8px radius and a 1.25px rule-colour edge, an optional blind-debossed loop (1px paper-shade
 * groove with a 0.5px paper highlight offset 0.5px down-right on top, so the groove's shadow
 * sits on its upper-left wall, as a pressed-in line lit from 315 deg), and <Writing>.
 *
 * Shape count (excluding shadow rects): card 1 + deboss 2 + writing 4 = 7 (<= 12).
 * Paper is the lightest palette tone, so it is the highlight on either surface.
 */
export function Notecard({
  x,
  y,
  width,
  height,
  unit,
  surface = "paper",
  deboss = false,
  debossCorner = "tr",
  debossHref,
  writing = true,
  rotate,
  className,
}: NotecardProps) {
  const radius = RADIUS.notecard * unit;
  const cx = x + width / 2;
  const cy = y + height / 2;

  // Deboss: loop half-width 11% of the card (capped so it stays under 30% of the height).
  const halfW = Math.min(width * 0.11, height * 0.36);
  const halfH = (halfW * 40.74) / 100;
  const m = width * 0.08;
  const lx = x + width - m - halfW;
  const ly = debossCorner === "tr" ? y + m + halfH : y + height - m - halfH;
  const s = Number((halfW / 100).toFixed(4));
  const hl = 0.5 * unit;
  const loopAttrs = { fill: "none", vectorEffect: "non-scaling-stroke" as const };

  // Writing: left-aligned, first line at 30% of the height; clears a top-right deboss.
  const pad = width * 0.1;
  const writingWidth =
    deboss && debossCorner === "tr" ? width - 2 * pad - 2 * halfW - pad * 0.5 : width - 2 * pad;

  const body = (
    <>
      <rect
        x={r(x)}
        y={r(y)}
        width={r(width)}
        height={r(height)}
        rx={r(radius)}
        fill={surface === "ivory" ? INK.ivory : INK.paper}
        stroke={INK.rule}
        strokeWidth={STROKE.hair}
        vectorEffect="non-scaling-stroke"
      />
      {deboss &&
        (debossHref ? (
          <>
            <use
              href={`#${debossHref}`}
              transform={`translate(${r(lx)} ${r(ly)}) scale(${s})`}
              stroke={INK.paperShade}
              strokeWidth={STROKE.rule}
            />
            <use
              href={`#${debossHref}`}
              transform={`translate(${r(lx + hl)} ${r(ly + hl)}) scale(${s})`}
              stroke={INK.paper}
              strokeWidth={0.5}
            />
          </>
        ) : (
          <>
            <path
              d={LOOP_PATH_COMPACT}
              transform={`translate(${r(lx)} ${r(ly)}) scale(${s})`}
              stroke={INK.paperShade}
              strokeWidth={STROKE.rule}
              {...loopAttrs}
            />
            <path
              d={LOOP_PATH_COMPACT}
              transform={`translate(${r(lx + hl)} ${r(ly + hl)}) scale(${s})`}
              stroke={INK.paper}
              strokeWidth={0.5}
              {...loopAttrs}
            />
          </>
        ))}
      {writing && <Writing x={x + pad} y={y + height * 0.3} width={writingWidth} unit={unit} />}
    </>
  );

  return (
    <g className={className}>
      <SoftShadow kind="ambient" x={x} y={y} width={width} height={height} radius={radius} unit={unit} rotate={rotate} />
      <SoftShadow kind="contact" x={x} y={y} width={width} height={height} radius={radius} unit={unit} rotate={rotate} />
      {rotate ? <g transform={`rotate(${r(rotate)} ${r(cx)} ${r(cy)})`}>{body}</g> : body}
    </g>
  );
}
