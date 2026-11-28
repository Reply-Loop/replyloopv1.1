import { INK } from "@/lib/illustration/tokens";
import { LoopThread } from "./LoopThread";
import { LoopDef, Notecard, Writing } from "./illustration/parts";

type Props = { idPrefix?: string; className?: string };

/*
 * Landscape problem art (640px and up; ProblemArtPortrait draws the phone composition).
 * Hooks for ProblemScene's scrub: data-p = warm-light, card, dust-settled, dust (with
 * data-d particles), cool-light, reply, thread (a <g> around the LoopThread parts). The
 * markup is the finished state (reply arrived, thread drawn, warm light, no grey wash);
 * src/styles/problem.css hides the dust wherever no timeline runs and sets the before-state
 * where one will.
 * Letterpress system (§9.1): two flat <Notecard>s (8px radius, 1.25px rule edge, blind-
 * debossed loop sharing one <LoopDef>, hairline writing with a brass initial), pre-baked
 * shadows, no filters. The thread is one <LoopThread> from the unanswered card's right edge,
 * through one undistorted loop, to the reply card's left edge; its parts all start at the
 * crossing, so the scrub grows it outward from the loop. The lights are gradient layers
 * (light, not paper), faded by opacity only. Design size: 1 unit = 1 screen px (lg).
 */

const U = 1;
// The unanswered card (centred on the lights, §8.3.2) and the reply card, which sits higher.
const CARD = { x: 96, y: 124, width: 268, height: 172 } as const;
const REPLY = { x: 624, y: 88, width: 232, height: 148 } as const;
// Thread ends exactly on the paper edges: the card's right edge and the reply's left edge.
const FROM = [CARD.x + CARD.width, 272] as const;
const TO = [REPLY.x, 172] as const;
// Writing: a 14px line gap (Writing's 9px default reads as one smudge at this card size).
const GAP = 14;

// Slate motes over the card, r >= 1 unit (the lift fades each one to 0).
const DUST: [number, number, number][] = [
  [110, 64, 1.5], [148, 98, 1], [186, 50, 2], [224, 86, 1.2], [262, 106, 1.5], [300, 60, 2], [338, 92, 1.2],
];

export function ProblemArt({ idPrefix = "pa", className }: Props) {
  const id = (s: string) => `${idPrefix}-${s}`;
  const url = (s: string) => `url(#${id(s)})`;
  return (
    // overflow visible: the cool light (r 260 around the card, §8.3.2) is taller than the
    // 420-unit box; clipped, its faint edges showed as straight lines mid-scrub.
    <svg viewBox="0 0 960 420" overflow="visible" aria-hidden="true" data-art="landscape" className={className}>
      <defs>
        {/* Bounding-box gradients: centred on each light's circle, radius = the circle's. */}
        <radialGradient id={id("warm")}>
          <stop offset="0" stopColor="#FFE9C4" stopOpacity="0.45" />
          <stop offset="0.45" stopColor="#FFE9C4" stopOpacity="0.15" />
          <stop offset="1" stopColor="#FFE9C4" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("cool")}>
          <stop offset="0" stopColor="#3A4048" stopOpacity="0.1" />
          <stop offset="1" stopColor="#3A4048" stopOpacity="0" />
        </radialGradient>
        <LoopDef id={id("loop")} />
      </defs>

      <circle data-p="warm-light" opacity="0.95" cx="225" cy="215" r="215" fill={url("warm")} />

      <g data-p="card">
        <Notecard {...CARD} unit={U} deboss debossHref={id("loop")} writing={false} />
        <Writing x={124} y={184} width={200} unit={U} gap={GAP} />
      </g>

      {/* Settled dust: a soft grey haze over the top of the card (the cool wash, fitted to the band). */}
      <rect data-p="dust-settled" opacity="0" {...CARD} height="64" fill={url("cool")} />

      {/* fill-opacity, not opacity: problem.css sets the group's opacity (1 before the scrub, 0 when finished). */}
      <g data-p="dust" fill={INK.slate} fillOpacity=".4">
        {DUST.map(([cx, cy, r]) => (
          <circle key={cx} data-d="1" cx={cx} cy={cy} r={r} />
        ))}
      </g>

      {/* Cool light: a soft wash centred on the card (cx 230, cy 210, r 260), opacity only. */}
      <circle data-p="cool-light" opacity="0" cx="230" cy="210" r="260" fill={url("cool")} />

      <g data-p="reply">
        <Notecard {...REPLY} unit={U} deboss debossHref={id("loop")} writing={false} />
        <Writing x={648} y={140} width={170} unit={U} gap={GAP} />
      </g>

      {/* Drawn by DrawSVG, every part '0%' -> '100%' together, outward from the crossing. */}
      <g data-p="thread">
        <LoopThread from={FROM} to={TO} loopAt={[494, 222]} loopScale={0.55} rotation={4} stroke={INK.brass} />
      </g>
    </svg>
  );
}
