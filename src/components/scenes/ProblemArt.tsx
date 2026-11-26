type Props = { idPrefix?: string; className?: string };

const anim = { transformBox: "fill-box", transformOrigin: "center" } as const;

// Message card with a speech tail (bottom right) and the reply card (tail bottom left).
const CARD =
  "M96,128Q96,116 108,116H352Q364,116 364,128V286Q364,298 352,298H330L322,326L300,298H108Q96,298 96,286Z";
const REPLY =
  "M650,160Q650,150 660,150H862Q872,150 872,160V276Q872,286 862,286H712L690,312L682,286H660Q650,286 650,276Z";
const THREAD =
  "M322,326C370,352 438,356 492,338C546,320 566,284 542,264C518,244 478,258 484,290C490,324 558,344 616,334C652,329 676,322 690,312";

// [cx, cy, r, ivory?, opacity]
const DUST: [number, number, number, number, number][] = [
  [104, 62, 1.4, 1, 0.6], [122, 88, 0.9, 0, 0.4], [139, 48, 1.8, 1, 0.7], [151, 101, 1.2, 0, 0.5],
  [168, 70, 2.2, 1, 0.45], [183, 40, 1, 0, 0.35], [196, 92, 1.6, 1, 0.75], [210, 58, 0.8, 0, 0.5],
  [224, 106, 1.3, 1, 0.55], [238, 76, 2, 0, 0.4], [251, 44, 1.1, 1, 0.65], [262, 96, 1.7, 0, 0.3],
  [276, 64, 0.9, 1, 0.8], [290, 84, 1.5, 0, 0.5], [303, 50, 2.1, 1, 0.4], [318, 102, 1, 0, 0.6],
  [331, 72, 1.4, 1, 0.7], [346, 56, 0.8, 0, 0.45], [114, 108, 1.9, 0, 0.35], [132, 74, 1.1, 1, 0.5],
  [176, 112, 0.9, 1, 0.6], [203, 34, 1.5, 0, 0.3], [231, 52, 1.2, 1, 0.75], [258, 118, 2, 1, 0.4],
  [284, 38, 1.3, 0, 0.55], [309, 80, 0.8, 1, 0.65], [339, 110, 1.6, 0, 0.5], [356, 86, 1.1, 1, 0.4],
];

export function ProblemArt({ idPrefix = "pa", className }: Props) {
  const id = (s: string) => `${idPrefix}-${s}`;
  const url = (s: string) => `url(#${id(s)})`;
  return (
    <svg viewBox="0 0 960 420" aria-hidden="true" focusable="false" className={className}>
      <defs>
        <radialGradient id={id("warm")} cx="225" cy="215" r="215" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFE9C4" stopOpacity="0.45" />
          <stop offset="0.45" stopColor="#FFE9C4" stopOpacity="0.15" />
          <stop offset="1" stopColor="#FFE9C4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("paper")} x1="96" y1="116" x2="364" y2="326" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFDF9" />
          <stop offset="0.55" stopColor="#F8F5EF" />
          <stop offset="1" stopColor="#E6DCCB" />
        </linearGradient>
        <linearGradient id={id("rpaper")} x1="650" y1="150" x2="872" y2="310" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FEFCF8" />
          <stop offset="0.6" stopColor="#F6F1E8" />
          <stop offset="1" stopColor="#E6DCCB" />
        </linearGradient>
        <linearGradient id={id("sheen")} x1="0" y1="0" x2="0.9" y2="0.7">
          <stop offset="0" stopColor="#FFE9C4" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#FFE9C4" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id("shade")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.6" stopColor="#5C3E12" stopOpacity="0" />
          <stop offset="1" stopColor="#5C3E12" stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id={id("haze")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8B857C" stopOpacity="0.32" />
          <stop offset="1" stopColor="#8B857C" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id("brass")} x1="322" y1="250" x2="680" y2="350" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#C49A5A" />
          <stop offset="0.5" stopColor="#8A5F1C" />
          <stop offset="1" stopColor="#5C3E12" />
        </linearGradient>
        <filter id={id("cast")} x="-20%" y="-20%" width="140%" height="150%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id={id("contact")} x="-10%" y="-10%" width="120%" height="130%">
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
        <filter id={id("grain")} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
          <feColorMatrix values="0 0 0 0 0.42 0 0 0 0 0.36 0 0 0 0 0.28 0 0 0 0.5 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        <filter id={id("blur")} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id={id("feather")} x="-5%" y="-10%" width="110%" height="120%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
        <clipPath id={id("clip")}>
          <path d={CARD} />
        </clipPath>
      </defs>

      <g data-p="warm-light" style={anim}>
        <circle cx="225" cy="215" r="215" fill={url("warm")} />
      </g>

      <g data-p="card" style={anim}>
        <path d={CARD} transform="translate(16 20)" fill="#1B1F23" opacity="0.16" filter={url("cast")} />
        <path d={CARD} transform="translate(1.5 2.5)" fill="#1B1F23" opacity="0.14" filter={url("contact")} />
        <path d={CARD} transform="translate(0 2)" fill="#E6DCCB" />
        <path d={CARD} fill={url("paper")} />
        <path d={CARD} fill={url("sheen")} opacity="0.4" />
        <path d={CARD} fill={url("shade")} />
        <path d={CARD} fill="#fff" filter={url("grain")} opacity="0.16" />
        <path d={CARD} fill="none" stroke="#E6DCCB" strokeWidth="1" />
        <path d="M108,117.5H352" stroke="#FFFFFF" strokeOpacity="0.9" strokeWidth="1.2" strokeLinecap="round" />
        <g stroke="#1B1F23" strokeWidth="4.6" strokeLinecap="round" opacity="0.78">
          <path d="M130,170H318" />
          <path d="M130,204H290" />
          <path d="M130,238H226" />
        </g>
      </g>

      <g data-p="dust-settled" opacity="0" style={anim}>
        <g clipPath={url("clip")}>
          <rect x="96" y="114" width="268" height="58" fill={url("haze")} />
          <rect x="100" y="112" width="260" height="10" fill="#8B857C" opacity="0.18" filter={url("contact")} />
        </g>
      </g>

      <g data-p="dust" style={anim}>
        {DUST.map(([cx, cy, r, iv, o], i) => (
          <circle key={i} data-d="1" cx={cx} cy={cy} r={r} fill={iv ? "#EFE6D6" : "#9A9184"} stroke={iv ? "#B3A893" : "none"} strokeWidth="0.5" opacity={o} />
        ))}
      </g>

      <g data-p="reply" opacity="0" style={anim}>
        <path d={REPLY} transform="translate(13 16)" fill="#1B1F23" opacity="0.15" filter={url("cast")} />
        <path d={REPLY} transform="translate(1.2 2)" fill="#1B1F23" opacity="0.13" filter={url("contact")} />
        <path d={REPLY} transform="translate(0 1.6)" fill="#E6DCCB" />
        <path d={REPLY} fill={url("rpaper")} />
        <path d={REPLY} fill={url("sheen")} opacity="0.35" />
        <path d={REPLY} fill={url("shade")} />
        <path d={REPLY} fill="none" stroke="#8A5F1C" strokeWidth="1" strokeOpacity="0.85" />
        <path d="M662,151.5H860" stroke="#C49A5A" strokeOpacity="0.7" strokeWidth="0.8" strokeLinecap="round" />
        <g stroke="#1B1F23" strokeWidth="4.2" strokeLinecap="round" opacity="0.72">
          <path d="M680,196H836" />
          <path d="M680,228H778" />
        </g>
      </g>

      <path
        data-p="thread"
        data-v-draw="true"
        d={THREAD}
        fill="none"
        stroke={url("brass")}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <g data-p="cool-light" opacity="0" style={anim}>
        <rect x="60" y="50" width="840" height="320" rx="160" fill="#262B31" opacity="0.06" filter={url("feather")} />
      </g>
    </svg>
  );
}
