/**
 * The three chapter objects, adapted from the site's journey vignettes
 * (src/components/scenes/vignettes/*.tsx), each in its vignette's own 480 x 360 coordinates.
 * Draw them inside <Placed scale={s}> and pass unit = 1 / s so strokes, radii and shadows stay
 * at their screen-px tokens. Flat fills, rule-hairline edges, no dark contours (§9.1).
 *
 *  - Voice interview: an open notebook and a pen (charcoal barrel, one brass band, brass nib,
 *    one highlight). The pen's nib is NIB.
 *  - Dry run: three proof sheets (2px radius) fanned from one flat brass clip at PIVOT.
 *  - Go live: a flat brass key (its notecard is the film's opening card, drawn by Film.tsx).
 */
import { INK, RADIUS, STROKE, SoftShadow, Writing } from "./illustration";

/* Voice interview ---------------------------------------------------------------------------- */

const NB = { x: 84, y: 102, w: 300, h: 190, rot: -5 } as const;
const NB_C = `${NB.x + NB.w / 2} ${NB.y + NB.h / 2}`;
export const NIB = [352, 166] as const;
const PEN_A = -54;
const BARREL = { x: 18, len: 150, h: 11 } as const;
const penBox = (() => {
  const d = BARREL.x + BARREL.len / 2;
  const a = (PEN_A * Math.PI) / 180;
  const c = [NIB[0] + d * Math.cos(a), NIB[1] + d * Math.sin(a)];
  return {
    x: c[0] - BARREL.len / 2,
    y: c[1] - BARREL.h / 2,
    width: BARREL.len,
    height: BARREL.h,
    radius: BARREL.h / 2,
    rotate: PEN_A,
  };
})();

export function Notebook({ unit }: { unit: number }) {
  const R = RADIUS.notecard * unit;
  const hair = { strokeWidth: STROKE.hair * unit };
  return (
    <g>
      <SoftShadow kind="ambient" x={NB.x} y={NB.y} width={NB.w} height={NB.h + 3} radius={R} unit={unit} rotate={NB.rot} />
      <SoftShadow kind="contact" x={NB.x} y={NB.y} width={NB.w} height={NB.h + 3} radius={R} unit={unit} rotate={NB.rot} />
      <g transform={`rotate(${NB.rot} ${NB_C})`}>
        <g stroke={INK.rule} {...hair}>
          <rect x={NB.x} y={NB.y + 3} width={NB.w} height={NB.h} rx={R} fill={INK.paperShade} />
          <rect x={NB.x} y={NB.y} width={NB.w} height={NB.h} rx={R} fill={INK.paper} />
        </g>
        <rect x={NB.x + NB.w / 2 - 9} y={NB.y + 0.6} width="18" height={NB.h - 1.2} fill={INK.ivory} />
        <path d={`M${NB.x + NB.w / 2} ${NB.y}v${NB.h}`} stroke={INK.rule} {...hair} />
        <Writing x={NB.x + 22} y={NB.y + 46} width={NB.w / 2 - 44} unit={unit} gap={14} />
        <Writing x={NB.x + NB.w / 2 + 22} y={NB.y + 46} width={NB.w / 2 - 44} unit={unit} gap={14} />
      </g>
      <SoftShadow kind="ambient" {...penBox} unit={unit} />
      <SoftShadow kind="contact" {...penBox} unit={unit} />
      <g transform={`translate(${NIB[0]} ${NIB[1]}) rotate(${PEN_A})`}>
        <path d="M0 0L24-4.4V4.4Z" fill={INK.brass} />
        <rect x={BARREL.x} y={-BARREL.h / 2} width={BARREL.len} height={BARREL.h} rx={BARREL.h / 2} fill={INK.charcoal} />
        <rect x="112" y="-6" width="7" height="12" fill={INK.brass} />
        <path d="M30-2.6H160" stroke={INK.slate} {...hair} />
      </g>
    </g>
  );
}

/* Dry run ------------------------------------------------------------------------------------ */

export const PIVOT = [204, 70] as const;
const SHEET = { w: 152, h: 198 } as const;
const FAN = [-13, -4, 6] as const;
const rd = (v: number) => Math.round(v * 10) / 10;
const sheets = FAN.map((deg) => {
  const a = (deg * Math.PI) / 180;
  const dy = SHEET.h / 2 - 8;
  const cx = rd(PIVOT[0] - dy * Math.sin(a));
  const cy = rd(PIVOT[1] + dy * Math.cos(a));
  return { deg, x: rd(cx - SHEET.w / 2), y: rd(cy - SHEET.h / 2), cx, cy };
});
const CLIP = { w: 46, h: 20 } as const;

export function ProofSheets({ unit }: { unit: number }) {
  const R = RADIUS.proof * unit;
  const hair = { strokeWidth: STROKE.hair * unit };
  const front = sheets[2];
  return (
    <g>
      <SoftShadow kind="ambient" {...sheets[1]} width={SHEET.w} height={SHEET.h} radius={R} unit={unit} rotate={sheets[1].deg} />
      {sheets.map((s, i) => (
        <g key={s.deg}>
          <SoftShadow kind="contact" x={s.x} y={s.y} width={SHEET.w} height={SHEET.h} radius={R} unit={unit} rotate={s.deg} />
          <rect
            x={s.x}
            y={s.y}
            width={SHEET.w}
            height={SHEET.h}
            rx={R}
            transform={`rotate(${s.deg} ${s.cx} ${s.cy})`}
            fill={i === 2 ? INK.paper : INK.ivory}
            stroke={INK.rule}
            {...hair}
          />
        </g>
      ))}
      <g transform={`rotate(${front.deg} ${front.cx} ${front.cy})`}>
        <Writing x={front.x + 18} y={front.y + 44} width={SHEET.w - 36} unit={unit} gap={12} />
        <Writing x={front.x + 18} y={front.y + 104} width={SHEET.w - 36} unit={unit} gap={12} />
      </g>
      <SoftShadow
        kind="contact"
        x={PIVOT[0] - CLIP.w / 2}
        y={PIVOT[1] - 12}
        width={CLIP.w}
        height={CLIP.h}
        radius={3}
        unit={unit}
        rotate={front.deg}
      />
      <g transform={`translate(${PIVOT[0]} ${PIVOT[1]}) rotate(${front.deg})`}>
        <path d="M-14-12V-25Q-14-30-9-30H9Q14-30 14-25V-12" fill="none" stroke={INK.brass} strokeWidth={STROKE.thread * unit} />
        <rect x={-CLIP.w / 2} y="-12" width={CLIP.w} height={CLIP.h} rx="3" fill={INK.brass} />
        <rect x={-CLIP.w / 2} y="3" width={CLIP.w} height="5" rx="2" fill={INK.brassShadow} />
        <path d={`M${-CLIP.w / 2 + 4}-9.5h${CLIP.w - 8}`} stroke={INK.brassLight} {...hair} />
      </g>
    </g>
  );
}

/* Go live: the key --------------------------------------------------------------------------- */

const BOW = "M-13 0a13 13 0 1 0 26 0a13 13 0 1 0-26 0ZM-5.5 0a5.5 5.5 0 1 1 11 0a5.5 5.5 0 1 1-11 0Z";
const BLADE = "M11-2.8H80V12H74V6.5H68V12H62V2.8H11Z";

/** The key with its bow centred on the origin, shaft along +x, turned by `rot` degrees. */
export function Key({ rot, unit }: { rot: number; unit: number }) {
  const a = (rot * Math.PI) / 180;
  const cx = 46 * Math.cos(a) - 2 * Math.sin(a);
  const cy = 46 * Math.sin(a) + 2 * Math.cos(a);
  return (
    <g>
      <SoftShadow kind="contact" x={-13} y={-13} width={26} height={26} radius={13} unit={unit} />
      <SoftShadow kind="contact" x={cx - 35} y={cy - 4} width={70} height={8} radius={2} unit={unit} rotate={rot} />
      <g transform={`rotate(${rot})`} fill={INK.brass}>
        <path d={BOW} fillRule="evenodd" />
        <path d={BLADE} />
        <path d="M14-1.4H77" stroke={INK.brassLight} strokeWidth={STROKE.hair * unit} />
      </g>
    </g>
  );
}
