type Props = { idPrefix?: string; className?: string };

const anim = { transformBox: "fill-box", transformOrigin: "center" } as const;

const PANE_T = "matrix(1.25 0.28 0.55 1 86 52)";
const CARD =
  "M-78,-56H78Q92,-56 92,-42V42Q92,56 78,56H-44L-66,71Q-71,74 -69,68L-62,56H-78Q-92,56 -92,42V-42Q-92,-56 -78,-56Z";
const CARD_T = "translate(298 156) rotate(-3)";
const KEY_T = "translate(156 278) rotate(-12) scale(1.15)";
const BODY = "M13,-3.2H15.5V-5H18.5V-3.2H20.5V-5H23.5V-2.4H84Q87.5,-2.4 87.5,0Q87.5,2.4 84,2.4H83.5V16.5H78.5V10.5H74.5V16.5H69.5V2.4H23.5V5H20.5V3.2H18.5V5H15.5V3.2H13Z";
const LINE = "M-8,200C44,192 82,238 126,236C160,234 178,216 198,208";

export function VignetteGoLive({ idPrefix = "vgl", className }: Props) {
  const id = (s: string) => `${idPrefix}-${s}`;
  const url = (s: string) => `url(#${id(s)})`;
  const key = (fill: string, stroke: string) => (
    <>
      <circle r="10.6" fill="none" stroke={stroke} strokeWidth="6.8" />
      <path d={BODY} fill={fill} />
    </>
  );
  return (
    <svg viewBox="0 0 480 360" aria-hidden="true" focusable="false" className={className}>
      <defs>
        <linearGradient id={id("pane")} x1="0" y1="0" x2="169" y2="189" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFE9C4" stopOpacity="0.34" />
          <stop offset="0.55" stopColor="#FFE9C4" stopOpacity="0.22" />
          <stop offset="1" stopColor="#FFE9C4" stopOpacity="0.05" />
        </linearGradient>
        <radialGradient id={id("glow")} cx="0.45" cy="0.42">
          <stop offset="0" stopColor="#FFE9C4" stopOpacity="0.3" />
          <stop offset="1" stopColor="#FFE9C4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("card")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FEFCF8" />
          <stop offset="0.55" stopColor="#F8F5EF" />
          <stop offset="1" stopColor="#EFE6D6" />
        </linearGradient>
        <linearGradient id={id("brass")} x1="0" y1="-14" x2="0" y2="17" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#C49A5A" />
          <stop offset="0.5" stopColor="#8A5F1C" />
          <stop offset="1" stopColor="#5C3E12" />
        </linearGradient>
        <linearGradient id={id("line")} x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8A5F1C" stopOpacity="0.5" />
          <stop offset="0.6" stopColor="#8A5F1C" />
          <stop offset="1" stopColor="#C49A5A" />
        </linearGradient>
        <radialGradient id={id("glint")}>
          <stop offset="0" stopColor="#FFF8EA" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#FFE9C4" stopOpacity="0.5" />
          <stop offset="1" stopColor="#FFE9C4" stopOpacity="0" />
        </radialGradient>
        <filter id={id("pblur")} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="2.6" />
        </filter>
        <filter id={id("cast")} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id={id("kcast")} x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <filter id={id("contact")} x="-10%" y="-20%" width="120%" height="140%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <g id={id("panes")} transform={PANE_T} filter={url("pblur")} fill={url("pane")}>
          <rect width="80" height="90" />
          <rect x="89" width="80" height="90" />
          <rect y="99" width="80" height="90" />
          <rect x="89" y="99" width="80" height="90" />
          <path d="M80,-6h9v201h-9zM-6,90h181v9h-181z" fill="#1B1F23" fillOpacity="0.04" />
        </g>
        <clipPath id={id("clip")}>
          <path d={CARD} transform={CARD_T} />
        </clipPath>
      </defs>

      <g data-v-layer="1" style={anim}>
        <ellipse cx="240" cy="170" rx="230" ry="160" fill={url("glow")} />
        <use href={`#${id("panes")}`} />
      </g>

      <g data-v-layer="2" style={anim}>
        <path d={CARD} transform="translate(306 166) rotate(-3)" fill="#1B1F23" opacity="0.16" filter={url("cast")} />
        <g transform={CARD_T}>
          <path d={CARD} transform="translate(1 2)" fill="#1B1F23" opacity="0.1" filter={url("contact")} />
          <path d={CARD} transform="translate(0 1.4)" fill="#E6DCCB" />
          <path d={CARD} fill={url("card")} stroke="#E6DCCB" strokeWidth="0.8" />
        </g>
        <g clipPath={url("clip")} opacity="0.7">
          <use href={`#${id("panes")}`} />
        </g>
        <g transform={CARD_T} stroke="#1B1F23" strokeWidth="2.6" strokeLinecap="round" opacity="0.42">
          <path d="M-66,-24H58" />
          <path d="M-66,-6H32" />
          <path d="M-66,12H-6" />
        </g>
      </g>

      <g data-v-layer="3" style={anim}>
        <g transform="translate(161 284) rotate(-12) scale(1.15)" opacity="0.22" filter={url("kcast")}>
          {key("#1B1F23", "#1B1F23")}
        </g>
        <g transform="translate(157.2 279.6) rotate(-12) scale(1.15)" opacity="0.2" filter={url("contact")}>
          {key("#1B1F23", "#1B1F23")}
        </g>
        <g transform={KEY_T}>
          {key(url("brass"), url("brass"))}
          <circle r="13.6" fill="none" stroke="#C49A5A" strokeWidth="0.8" opacity="0.6" />
          <path d="M22,-1.6H83" stroke="#C49A5A" strokeWidth="0.9" strokeLinecap="round" opacity="0.8" />
        </g>
      </g>

      <g data-v-layer="4" style={anim}>
        <path d={LINE} fill="none" stroke={url("line")} strokeWidth="2.6" strokeLinecap="round" data-v-draw="true" />
      </g>

      <g data-v-layer="5" style={anim}>
        <ellipse cx="149" cy="272" rx="9" ry="6" fill={url("glint")} />
        <ellipse cx="200" cy="265" rx="18" ry="3" transform="rotate(-12 200 265)" fill={url("glint")} opacity="0.6" />
      </g>
    </svg>
  );
}
