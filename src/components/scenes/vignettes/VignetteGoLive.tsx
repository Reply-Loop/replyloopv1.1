import { LoopThread } from "@/components/scenes/LoopThread";
import { LoopDef, Notecard, SoftShadow } from "@/components/scenes/illustration/parts";
import { INK, STROKE } from "@/lib/illustration/tokens";

/**
 * Journey vignette 04, go live (brief §9.3): a letterpress notecard with a blind-debossed
 * loop, a flat brass key (INK.brass, the same brass as the pen band in vignette 02) and a
 * LoopThread tying the key to the card, over a window-light plate. ASSET_BRIEF #2 (the
 * window-light still) does not exist yet, so the plate is an SVG stand-in: a soft
 * paper-shade pool and four window panes of paper light, flat fills at fixed opacities (the
 * timeline only fades the layer). Design size 480px wide (unit 1).
 *
 * Journey contract (HowItWorksJourneyScene): five [data-v-layer] groups built in order
 * plate (shade, light) -> objects (card, key) -> thread; the thread carries data-v-draw.
 * Each shadow sits in its object's layer. The one id (the deboss loop) is idPrefix-scoped.
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

/** Window panes (2 x 2) in the light's skew: each a soft outer and a firmer inner rect. */
const PANES = [
  [0, 0],
  [92, 0],
  [0, 112],
  [92, 112],
] as const;

/** The key: bow centre and turn; shaft along +x in its own frame. */
const KEY = { x: 116, y: 262, rot: -10 } as const;
const BOW = "M-13 0a13 13 0 1 0 26 0a13 13 0 1 0-26 0ZM-5.5 0a5.5 5.5 0 1 1 11 0a5.5 5.5 0 1 1-11 0Z";
const BLADE = "M11-2.8H80V12H74V6.5H68V12H62V2.8H11Z";
/** The blade's shadow box, centred on the blade as turned about the bow. */
const BLADE_BOX = (() => {
  const a = (KEY.rot * Math.PI) / 180;
  const [lx, ly] = [46, 2];
  const cx = KEY.x + lx * Math.cos(a) - ly * Math.sin(a);
  const cy = KEY.y + lx * Math.sin(a) + ly * Math.cos(a);
  return { x: Math.round(cx - 35), y: Math.round(cy - 4), width: 70, height: 8 };
})();

export function VignetteGoLive({ idPrefix = "vgl", className }: Props) {
  const loopId = `${idPrefix}-loop`;
  return (
    <svg viewBox="0 0 480 360" aria-hidden="true" focusable="false" className={className}>
      <defs>
        <LoopDef id={loopId} />
      </defs>

      <g data-v-layer="1" style={anim} fill={INK.paperShade}>
        {POOL.map(([rx, ry, o]) => (
          <ellipse key={rx} cx="240" cy="184" rx={rx} ry={ry} opacity={o} />
        ))}
      </g>

      <g data-v-layer="2" style={anim}>
        <g fill={INK.paper} transform="matrix(1 .16 .62 1 84 34)">
          {PANES.map(([x, y]) => (
            <g key={`${x} ${y}`}>
              <rect x={x} y={y} width="84" height="104" rx="9" opacity=".5" />
              <rect x={x + 4} y={y + 4} width="76" height="96" rx="5" opacity=".65" />
            </g>
          ))}
        </g>
      </g>

      <g data-v-layer="3" style={anim}>
        <Notecard x={252} y={70} width={184} height={118} unit={1} rotate={-3} deboss debossHref={loopId} />
      </g>

      <g data-v-layer="4" style={anim}>
        <SoftShadow kind="contact" x={KEY.x - 13} y={KEY.y - 13} width={26} height={26} radius={13} unit={1} />
        <SoftShadow kind="contact" {...BLADE_BOX} radius={2} unit={1} rotate={KEY.rot} />
        <g transform={`translate(${KEY.x} ${KEY.y}) rotate(${KEY.rot})`} fill={INK.brass}>
          <path d={BOW} fillRule="evenodd" />
          <path d={BLADE} />
          <path d="M14-1.4H77" stroke={INK.brassLight} strokeWidth={STROKE.hair} vectorEffect="non-scaling-stroke" />
        </g>
      </g>

      <g data-v-layer="5" style={anim}>
        <g transform={`scale(${K})`}>
          <LoopThread
            from={k(KEY.x + 2, KEY.y - 9)}
            to={k(300, 142)}
            loopAt={k(214, 200)}
            loopScale={0.42 / K}
            rotation={-14}
            stroke={INK.brass}
            partProps={{ "data-v-draw": "true" }}
          />
        </g>
      </g>
    </svg>
  );
}
