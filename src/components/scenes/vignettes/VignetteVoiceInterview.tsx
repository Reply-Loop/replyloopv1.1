import { LoopThread } from "@/components/scenes/LoopThread";
import { SoftShadow, Writing } from "@/components/scenes/illustration/parts";
import { INK, RADIUS, STROKE } from "@/lib/illustration/tokens";

/**
 * Journey vignette 02, voice interview (brief §9.3): an open notebook with a rule hairline
 * edge and the shared shadows (no dark contour), a pen of six shapes (charcoal barrel, one
 * brass band, brass nib, one highlight, its contact and ambient shadows), and the loop the
 * pen has just written, as a LoopThread ending at the nib. Design size 480px wide (unit 1).
 *
 * Journey contract (HowItWorksJourneyScene): five [data-v-layer] groups built in order
 * plate (shade, light) -> objects (notebook, pen) -> thread; the thread carries data-v-draw.
 * Each shadow sits in its object's layer. No ids, so idPrefix is unused.
 */
type Props = { idPrefix?: string; className?: string };

const anim = { transformBox: "fill-box", transformOrigin: "center" } as const;

/** Thread space: see VignetteIntroCall (keeps each draw path's screen scale below 1). */
const K = 0.9;
const k = (x: number, y: number) => [x / K, y / K] as const;

const POOL = [
  [214, 152, 0.14],
  [200, 140, 0.16],
  [186, 128, 0.18],
  [172, 116, 0.2],
] as const;

/** The notebook spread, unrotated, and its turn about its centre. */
const NB = { x: 84, y: 102, w: 300, h: 190, rot: -5 } as const;
const NB_C = `${NB.x + NB.w / 2} ${NB.y + NB.h / 2}`;
const NB_R = RADIUS.notecard;

/** The pen: nib at NIB, barrel running up-right at PEN_A degrees. */
const NIB = [352, 166] as const;
const PEN_A = -54;
const BARREL = { x: 18, len: 150, h: 11 } as const;
const penCentre = (() => {
  const d = BARREL.x + BARREL.len / 2;
  const a = (PEN_A * Math.PI) / 180;
  return [NIB[0] + d * Math.cos(a), NIB[1] + d * Math.sin(a)] as const;
})();
const penBox = {
  x: penCentre[0] - BARREL.len / 2,
  y: penCentre[1] - BARREL.h / 2,
  width: BARREL.len,
  height: BARREL.h,
  radius: BARREL.h / 2,
  unit: 1,
  rotate: PEN_A,
};

export function VignetteVoiceInterview({ className }: Props) {
  const hair = { strokeWidth: STROKE.hair, vectorEffect: "non-scaling-stroke" as const };
  return (
    <svg viewBox="0 0 480 360" aria-hidden="true" focusable="false" className={className}>
      <g data-v-layer="1" style={anim} fill={INK.paperShade}>
        {POOL.map(([rx, ry, o]) => (
          <ellipse key={rx} cx="240" cy="190" rx={rx} ry={ry} opacity={o} />
        ))}
      </g>

      <g data-v-layer="2" style={anim}>
        <g fill={INK.paper} transform="matrix(1 .16 .62 1 70 46)">
          <rect width="96" height="156" rx="10" opacity=".5" />
          <rect x="4" y="4" width="88" height="148" rx="6" opacity=".6" />
          <rect x="106" width="96" height="156" rx="10" opacity=".5" />
          <rect x="110" y="4" width="88" height="148" rx="6" opacity=".6" />
        </g>
      </g>

      <g data-v-layer="3" style={anim}>
        <SoftShadow kind="ambient" x={NB.x} y={NB.y} width={NB.w} height={NB.h + 3} radius={NB_R} unit={1} rotate={NB.rot} />
        <SoftShadow kind="contact" x={NB.x} y={NB.y} width={NB.w} height={NB.h + 3} radius={NB_R} unit={1} rotate={NB.rot} />
        <g transform={`rotate(${NB.rot} ${NB_C})`}>
          {/* Page block edge, then the spread: flat paper, rule hairline edges, no dark contour. */}
          {/* vector-effect does not inherit, so it sits on each stroked rect, not on the group. */}
          <g stroke={INK.rule} strokeWidth={STROKE.hair}>
            <rect x={NB.x} y={NB.y + 3} width={NB.w} height={NB.h} rx={NB_R} fill={INK.paperShade} vectorEffect="non-scaling-stroke" />
            <rect x={NB.x} y={NB.y} width={NB.w} height={NB.h} rx={NB_R} fill={INK.paper} vectorEffect="non-scaling-stroke" />
          </g>
          {/* The gutter: a flat paper-shade fold and one rule hairline. */}
          <rect x={NB.x + NB.w / 2 - 9} y={NB.y + 0.6} width="18" height={NB.h - 1.2} fill={INK.ivory} />
          <path d={`M${NB.x + NB.w / 2} ${NB.y}v${NB.h}`} stroke={INK.rule} {...hair} />
          <Writing x={NB.x + 22} y={NB.y + 46} width={NB.w / 2 - 44} unit={1} gap={14} />
        </g>
      </g>

      <g data-v-layer="4" style={anim}>
        <SoftShadow kind="ambient" {...penBox} />
        <SoftShadow kind="contact" {...penBox} />
        <g transform={`translate(${NIB[0]} ${NIB[1]}) rotate(${PEN_A})`}>
          <path d="M0 0L24-4.4V4.4Z" fill={INK.brass} />
          <rect x={BARREL.x} y={-BARREL.h / 2} width={BARREL.len} height={BARREL.h} rx={BARREL.h / 2} fill={INK.charcoal} />
          <rect x="112" y="-6" width="7" height="12" fill={INK.brass} />
          <path d="M30-2.6H160" stroke={INK.slate} {...hair} />
        </g>
      </g>

      <g data-v-layer="5" style={anim}>
        <g transform={`scale(${K})`}>
          <LoopThread
            from={k(262, 262)}
            to={k(NIB[0], NIB[1])}
            loopAt={k(312, 212)}
            loopScale={0.36 / K}
            rotation={-14}
            stroke={INK.brass}
            partProps={{ "data-v-draw": "true" }}
          />
        </g>
      </g>
    </svg>
  );
}
