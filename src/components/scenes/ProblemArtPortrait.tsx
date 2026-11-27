type Props = { idPrefix?: string; className?: string };

/*
 * Portrait problem art for phones (below 640px; brief §8.3.2). The unanswered card
 * sits top left, the thread descends in an S-curve from its tail, and the reply lands
 * bottom right at the thread's end. Same data-p hooks as ProblemArt, so ProblemScene
 * scrubs either drawing with one timeline. The markup is the finished state.
 * Drawn in the letterpress language (§9.1): flat paper fills, hairline writing with a
 * brass initial, no filters (shadows are pre-baked shapes). Strokes are non-scaling:
 * hairlines 1.25 screen px, the thread 2 screen px. Dust particles are at least
 * 2.4 units wide (over 2.5 screen px at 390px). Lights and shadows stay inside the
 * viewBox, so no gradient is cut off at the drawing's edge.
 */
const CARD = "M32,56H220Q228,56 228,64V164Q228,172 220,172H206L200,194L184,172H32Q24,172 24,164V64Q24,56 32,56Z";
const REPLY = "M140,318H168L160,296L184,318H328Q336,318 336,326V412Q336,420 328,420H140Q132,420 132,412V326Q132,318 140,318Z";
const THREAD = "M200,194C228,208 304,214 286,238C268,262 108,248 100,272C94,290 138,282 160,296";

// [cx, cy, r, light?, opacity]
const DUST: [number, number, number, number, number][] = [
  [38, 30, 1.6, 1, 0.6], [56, 52, 1.2, 0, 0.45], [71, 18, 2, 1, 0.7], [88, 44, 1.4, 0, 0.5],
  [104, 26, 2.2, 1, 0.5], [121, 50, 1.2, 0, 0.4], [137, 14, 1.8, 1, 0.75], [152, 38, 1.3, 0, 0.5],
  [168, 22, 2, 1, 0.55], [184, 48, 1.5, 0, 0.4], [198, 30, 1.2, 1, 0.65], [214, 16, 1.8, 0, 0.35],
];

const hair = { fill: "none", strokeLinecap: "round", vectorEffect: "non-scaling-stroke" } as const;

export function ProblemArtPortrait({ idPrefix = "pp", className }: Props) {
  const id = (s: string) => `${idPrefix}-${s}`;
  const url = (s: string) => `url(#${id(s)})`;
  return (
    <svg viewBox="0 0 360 440" aria-hidden="true" focusable="false" data-art="portrait" className={className}>
      <defs>
        <radialGradient id={id("warm")}>
          <stop offset="0" stopColor="#FFE9C4" stopOpacity="0.4" />
          <stop offset="0.78" stopColor="#FFE9C4" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("cool")}>
          <stop offset="0" stopColor="#3A4048" stopOpacity="0.1" />
          <stop offset="0.78" stopColor="#3A4048" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("shadow")}>
          <stop offset="0.5" stopColor="#1B1F23" stopOpacity="0.1" />
          <stop offset="1" stopColor="#1B1F23" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("haze")} x2="0" y2="1">
          <stop offset="0" stopColor="#8B857C" stopOpacity="0.3" />
          <stop offset="1" stopColor="#8B857C" stopOpacity="0" />
        </linearGradient>
        <clipPath id={id("clip")}>
          <path d={CARD} />
        </clipPath>
      </defs>

      <g data-p="warm-light" opacity="0.95">
        <circle cx="126" cy="120" r="150" fill={url("warm")} />
      </g>

      <g data-p="card">
        <ellipse cx="132" cy="126" rx="130" ry="82" fill={url("shadow")} />
        <path d={CARD} transform="translate(0.5 1)" fill="#1B1F23" opacity="0.12" />
        <path d={CARD} fill="#FBFAF6" stroke="#E2DBCF" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
        <path d="M60,92H195M44,114H172M44,136H133" {...hair} stroke="#1B1F23" strokeOpacity="0.28" strokeWidth="1.25" />
        <path d="M44,92H52" {...hair} stroke="#8A5F1C" strokeWidth="2" />
      </g>

      <g data-p="dust-settled" opacity="0">
        <rect x="24" y="54" width="204" height="44" fill={url("haze")} clipPath={url("clip")} />
      </g>

      <g data-p="dust">
        {DUST.map(([cx, cy, r, light, o], i) => (
          <circle key={i} data-d="1" cx={cx} cy={cy} r={r} fill={light ? "#B3A893" : "#9A9184"} opacity={o} />
        ))}
      </g>

      <g data-p="cool-light" opacity="0">
        {/* r 118 keeps the whole falloff inside the viewBox (cy 120), so nothing is clipped. */}
        <circle cx="126" cy="120" r="118" fill={url("cool")} />
      </g>

      <g data-p="reply">
        <ellipse cx="240" cy="378" rx="130" ry="58" fill={url("shadow")} />
        <path d={REPLY} transform="translate(0.5 1)" fill="#1B1F23" opacity="0.12" />
        <path d={REPLY} fill="#FBFAF6" stroke="#8A5F1C" strokeOpacity="0.85" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
        <path d="M168,347H303M152,369H280M152,391H241" {...hair} stroke="#1B1F23" strokeOpacity="0.28" strokeWidth="1.25" />
        <path d="M152,347H160" {...hair} stroke="#8A5F1C" strokeWidth="2" />
      </g>

      <path
        data-p="thread"
        d={THREAD}
        fill="none"
        stroke="#8A5F1C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
