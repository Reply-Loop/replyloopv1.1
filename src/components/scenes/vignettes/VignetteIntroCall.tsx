import { LoopThread } from "@/components/scenes/LoopThread";
import { Notecard } from "@/components/scenes/illustration/parts";
import { INK } from "@/lib/illustration/tokens";

/**
 * Journey vignette 01, intro call (brief §9.3): two letterpress notecards joined by one
 * LoopThread drawn from the crossing. Design size 480px wide (unit 1), the sticky stage's
 * width; the same SVG renders in the stacked layout.
 *
 * Journey contract (HowItWorksJourneyScene): five [data-v-layer] groups built in order
 * plate (shade, light) -> objects (card, card) -> thread; every stroke the timeline draws
 * carries data-v-draw. Each shadow sits in its object's layer. No ids, so idPrefix is unused.
 */
type Props = { idPrefix?: string; className?: string };

const anim = { transformBox: "fill-box", transformOrigin: "center" } as const;

/**
 * Thread space: the thread's coordinates are divided by K and the group scales by K, so the
 * picture is unchanged but each path's screen scale stays below 1 at the widest sticky stage
 * (about 505px). Chrome applies a pathLength-normalised dash in screen px on a
 * non-scaling-stroke path, so above scale 1 the dash would end short of the path's end.
 */
const K = 0.9;
const k = (x: number, y: number) => [x / K, y / K] as const;

/** Plate: a soft paper-shade pool (stacked ellipses, flat fills) and two window-light panes. */
const POOL = [
  [214, 152, 0.14],
  [200, 140, 0.16],
  [186, 128, 0.18],
  [172, 116, 0.2],
] as const;

export function VignetteIntroCall({ className }: Props) {
  return (
    <svg viewBox="0 0 480 360" aria-hidden="true" focusable="false" className={className}>
      <g data-v-layer="1" style={anim} fill={INK.paperShade}>
        {POOL.map(([rx, ry, o]) => (
          <ellipse key={rx} cx="240" cy="184" rx={rx} ry={ry} opacity={o} />
        ))}
      </g>

      <g data-v-layer="2" style={anim}>
        <g fill={INK.paper} transform="matrix(1 .16 .62 1 96 52)">
          <rect width="92" height="150" rx="10" opacity=".5" />
          <rect x="4" y="4" width="84" height="142" rx="6" opacity=".6" />
          <rect x="102" width="92" height="150" rx="10" opacity=".5" />
          <rect x="106" y="4" width="84" height="142" rx="6" opacity=".6" />
        </g>
      </g>

      <g data-v-layer="3" style={anim}>
        <Notecard x={40} y={176} width={164} height={106} unit={1} rotate={-4} />
      </g>

      <g data-v-layer="4" style={anim}>
        <Notecard x={278} y={70} width={164} height={106} unit={1} rotate={3} />
      </g>

      <g data-v-layer="5" style={anim}>
        <g transform={`scale(${K})`}>
          <LoopThread
            from={k(156, 262)}
            to={k(326, 140)}
            loopAt={k(238, 182)}
            loopScale={0.54 / K}
            rotation={-14}
            stroke={INK.brass}
            partProps={{ "data-v-draw": "true" }}
          />
        </g>
      </g>
    </svg>
  );
}
