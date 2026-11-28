import { LoopThread } from "@/components/scenes/LoopThread";
import { SoftShadow, Writing } from "@/components/scenes/illustration/parts";
import { INK, RADIUS, STROKE } from "@/lib/illustration/tokens";

/**
 * Journey vignette 03, dry run (brief §9.3): three proof sheets (2px radius) fanned from one
 * flat brass clip at the top, hairline writing on the front sheet, and a LoopThread in place
 * of the old curl. Design size 480px wide (unit 1).
 *
 * Journey contract (HowItWorksJourneyScene): five [data-v-layer] groups built in order
 * plate (shade, light) -> objects (sheets, clip) -> thread. Every drawn stroke carries
 * data-v-draw, and nothing that belongs to a drawn stroke is left outside the draw set: the
 * thread has no separate shadow path (the old grey ghost). Each pre-baked shadow sits in its
 * object's layer. No ids, so idPrefix is unused.
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

/** Sheets hang from the clip point and fan out at the bottom: back, middle, front. */
const PIVOT = [204, 70] as const;
const SHEET = { w: 152, h: 198 } as const;
const FAN = [-13, -4, 6] as const;
const rd = (v: number) => Math.round(v * 10) / 10;
const sheets = FAN.map((deg) => {
  const a = (deg * Math.PI) / 180;
  // The unrotated sheet hangs centred below the pivot, its top edge 8 units above it.
  const dy = SHEET.h / 2 - 8;
  const cx = rd(PIVOT[0] - dy * Math.sin(a));
  const cy = rd(PIVOT[1] + dy * Math.cos(a));
  return { deg, x: rd(cx - SHEET.w / 2), y: rd(cy - SHEET.h / 2), cx, cy };
});
const R = RADIUS.proof;

/** The clip, in the front sheet's frame (origin at the pivot). */
const CLIP = { w: 46, h: 20 } as const;

export function VignetteDryRun({ className }: Props) {
  const hair = { strokeWidth: STROKE.hair, vectorEffect: "non-scaling-stroke" as const };
  const front = sheets[2];
  return (
    <svg viewBox="0 0 480 360" aria-hidden="true" focusable="false" className={className}>
      <g data-v-layer="1" style={anim} fill={INK.paperShade}>
        {POOL.map(([rx, ry, o]) => (
          <ellipse key={rx} cx="236" cy="190" rx={rx} ry={ry} opacity={o} />
        ))}
      </g>

      <g data-v-layer="2" style={anim}>
        <g fill={INK.paper} transform="matrix(1 .16 .62 1 64 40)">
          <rect width="96" height="160" rx="10" opacity=".5" />
          <rect x="4" y="4" width="88" height="152" rx="6" opacity=".6" />
          <rect x="106" width="96" height="160" rx="10" opacity=".5" />
          <rect x="110" y="4" width="88" height="152" rx="6" opacity=".6" />
        </g>
      </g>

      <g data-v-layer="3" style={anim}>
        <SoftShadow kind="ambient" {...sheets[1]} width={SHEET.w} height={SHEET.h} radius={R} unit={1} rotate={sheets[1].deg} />
        {sheets.map((s, i) => (
          <g key={s.deg}>
            <SoftShadow kind="contact" x={s.x} y={s.y} width={SHEET.w} height={SHEET.h} radius={R} unit={1} rotate={s.deg} />
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
          <Writing x={front.x + 18} y={front.y + 44} width={SHEET.w - 36} unit={1} gap={12} />
        </g>
      </g>

      <g data-v-layer="4" style={anim}>
        <SoftShadow
          kind="contact"
          x={PIVOT[0] - CLIP.w / 2}
          y={PIVOT[1] - 12}
          width={CLIP.w}
          height={CLIP.h}
          radius={3}
          unit={1}
          rotate={front.deg}
        />
        <g transform={`translate(${PIVOT[0]} ${PIVOT[1]}) rotate(${front.deg})`}>
          {/* Wire handle, flat jaw, its shaded lip, one highlight. */}
          <path d="M-14-12V-25Q-14-30-9-30H9Q14-30 14-25V-12" fill="none" stroke={INK.brass} strokeWidth={STROKE.thread} vectorEffect="non-scaling-stroke" />
          <rect x={-CLIP.w / 2} y="-12" width={CLIP.w} height={CLIP.h} rx="3" fill={INK.brass} />
          <rect x={-CLIP.w / 2} y="3" width={CLIP.w} height="5" rx="2" fill={INK.brassShadow} />
          <path d={`M${-CLIP.w / 2 + 4}-9.5h${CLIP.w - 8}`} stroke={INK.brassLight} {...hair} />
        </g>
      </g>

      <g data-v-layer="5" style={anim}>
        <g transform={`scale(${K})`}>
          <LoopThread
            from={k(226, 232)}
            to={k(444, 170)}
            loopAt={k(350, 246)}
            loopScale={0.46 / K}
            rotation={-16}
            stroke={INK.brass}
            partProps={{ "data-v-draw": "true" }}
          />
        </g>
      </g>
    </svg>
  );
}
