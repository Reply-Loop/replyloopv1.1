import { INK } from "@/lib/illustration/tokens";
import { LoopThread } from "./LoopThread";
import { LoopDef, Notecard, Writing } from "./illustration/parts";

type Props = { idPrefix?: string; className?: string };

/*
 * Portrait problem art for phones (below 640px; brief §8.3.2). The unanswered card sits
 * top left, the thread leaves its right edge and descends in an S-curve through one
 * undistorted loop, and the reply lands bottom right at the thread's end (its top edge).
 * Same data-p hooks as ProblemArt (thread is a <g> around the LoopThread parts), so
 * ProblemScene scrubs either drawing with one timeline. The markup is the finished state.
 * Letterpress system (§9.1): flat <Notecard>s with a blind-debossed loop (one shared
 * <LoopDef>) and hairline writing with a brass initial, pre-baked shadows, no filters.
 * Strokes are non-scaling: hairlines 1.25 screen px, the thread 2. Design size: 360px wide
 * (1 unit = 1 px; at 390px every px token is 8% larger, so radii, offsets and gaps round
 * to whole units and the markup stays small). Dust motes are r >= 1.4 units (>= 1.5 screen
 * px at 390px).
 * Lights and shadows stay inside the viewBox, so nothing is cut off at the drawing's edge.
 */

const U = 1;
const CARD = { x: 24, y: 52, width: 204, height: 128 } as const;
const REPLY = { x: 136, y: 300, width: 200, height: 112 } as const;
// Thread ends exactly on the paper edges: the card's right edge and the reply's top edge.
const FROM = [CARD.x + CARD.width, 132] as const;
const TO = [200, REPLY.y] as const;
const GAP = 12;

// Motes above the card, r >= 1.4 units (the lift fades each one to 0).
const DUST: [number, number, number][] = [
  [40, 30, 1.6], [66, 46, 1.4], [92, 18, 2], [118, 38, 1.4], [144, 14, 1.8], [170, 44, 1.4], [196, 24, 2], [220, 40, 1.5],
];

export function ProblemArtPortrait({ idPrefix = "pp", className }: Props) {
  const id = (s: string) => `${idPrefix}-${s}`;
  const url = (s: string) => `url(#${id(s)})`;
  return (
    <svg viewBox="0 0 360 440" aria-hidden="true" data-art="portrait" className={className}>
      <defs>
        <radialGradient id={id("warm")}>
          <stop offset="0" stopColor="#FFE9C4" stopOpacity="0.4" />
          <stop offset="0.78" stopColor="#FFE9C4" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("cool")}>
          <stop offset="0" stopColor="#3A4048" stopOpacity="0.1" />
          <stop offset="0.78" stopColor="#3A4048" stopOpacity="0" />
        </radialGradient>
        <LoopDef id={id("loop")} />
      </defs>

      <circle data-p="warm-light" opacity="0.95" cx="126" cy="120" r="150" fill={url("warm")} />

      <g data-p="card">
        <Notecard {...CARD} unit={U} deboss debossHref={id("loop")} writing={false} />
        <Writing x={46} y={108} width={160} unit={U} gap={GAP} />
      </g>

      {/* Settled dust: a soft grey haze over the top of the card (the cool wash, fitted to the band). */}
      <rect data-p="dust-settled" opacity="0" {...CARD} height="52" fill={url("cool")} />

      {/* fill-opacity, not opacity: problem.css sets the group's opacity (1 before the scrub, 0 when finished). */}
      <g data-p="dust" fill={INK.slate} fillOpacity=".4">
        {DUST.map(([cx, cy, r]) => (
          <circle key={cx} data-d="1" cx={cx} cy={cy} r={r} />
        ))}
      </g>

      {/* r 118 keeps the whole falloff inside the viewBox (cy 120), so nothing is clipped. */}
      <circle data-p="cool-light" opacity="0" cx="126" cy="120" r="118" fill={url("cool")} />

      <g data-p="reply">
        <Notecard {...REPLY} unit={U} deboss debossHref={id("loop")} writing={false} />
        <Writing x={158} y={348} width={156} unit={U} gap={GAP} />
      </g>

      {/* Drawn by DrawSVG, every part '0%' -> '100%' together, outward from the crossing. */}
      <g data-p="thread">
        <LoopThread from={FROM} to={TO} loopAt={[274, 226]} loopScale={0.5} rotation={184} stroke={INK.brass} />
      </g>
    </svg>
  );
}
