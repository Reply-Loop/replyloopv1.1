type Props = { idPrefix?: string; className?: string };

const anim = { transformBox: "fill-box", transformOrigin: "center" } as const;

const LOWER = "M-70,-92H70V92H-70Z";
const LIFTED = "M-67,-86H67V82Q24,90 -20,86Q-50,84 -67,88Z";
const RIBBON =
  "M138,281C112,288 96,306 74,309C52,312 40,296 48,282C56,269 76,270 78,284C79,293 70,298 63,294";
const LOW_T = "rotate(-7 200 214) translate(200 214)";
const LIFT_T = "translate(286 154) rotate(9)";

export function VignetteDryRun({ idPrefix = "vdr", className }: Props) {
  const id = (s: string) => `${idPrefix}-${s}`;
  const url = (s: string) => `url(#${id(s)})`;
  return (
    <svg viewBox="0 0 480 360" aria-hidden="true" focusable="false" className={className}>
      <defs>
        <linearGradient id={id("cone")} x1="40" y1="0" x2="260" y2="260" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFE9C4" stopOpacity="0.3" />
          <stop offset="0.7" stopColor="#FFE9C4" stopOpacity="0.1" />
          <stop offset="1" stopColor="#FFE9C4" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={id("pool")} cx="210" cy="170" r="200" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFE9C4" stopOpacity="0.42" />
          <stop offset="0.6" stopColor="#FFE9C4" stopOpacity="0.1" />
          <stop offset="1" stopColor="#FFE9C4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("low")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FAF7F1" />
          <stop offset="0.6" stopColor="#F3ECE0" />
          <stop offset="1" stopColor="#E6DCCB" />
        </linearGradient>
        <linearGradient id={id("lift")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FEFCF8" />
          <stop offset="0.5" stopColor="#F8F5EF" />
          <stop offset="1" stopColor="#EFE6D6" />
        </linearGradient>
        <linearGradient id={id("sheen")} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0" stopColor="#FFE9C4" stopOpacity="0.5" />
          <stop offset="0.45" stopColor="#FFE9C4" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id("brass")} x1="44" y1="270" x2="140" y2="312" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#C49A5A" />
          <stop offset="0.5" stopColor="#8A5F1C" />
          <stop offset="1" stopColor="#5C3E12" />
        </linearGradient>
        <filter id={id("soft")} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id={id("float")} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="11" />
        </filter>
        <filter id={id("cast")} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id={id("contact")} x="-10%" y="-10%" width="120%" height="130%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>

      <g data-v-layer="1" style={anim}>
        <path d="M6,-30L76,-30L340,250L120,330Z" fill={url("cone")} filter={url("soft")} />
        <ellipse cx="210" cy="170" rx="200" ry="160" fill={url("pool")} />
      </g>

      <g data-v-layer="2" style={anim}>
        <g transform={LOW_T}>
          <path d={LOWER} transform="translate(7 9)" fill="#1B1F23" opacity="0.14" filter={url("cast")} />
          <path d={LOWER} transform="translate(1.2 2)" fill="#1B1F23" opacity="0.12" filter={url("contact")} />
          <path d={LOWER} transform="translate(0 1.6)" fill="#E6DCCB" />
          <path d={LOWER} fill={url("low")} stroke="#E6DCCB" strokeWidth="0.8" />
          <g stroke="#1B1F23" strokeWidth="2.4" strokeLinecap="round" opacity="0.5">
            <path d="M-52,-64H-10" />
            <path d="M-52,-34H50" />
            <path d="M-52,-18H38" />
            <path d="M-52,-2H12" />
            <path d="M-52,48H30" />
            <path d="M-52,64H-4" />
          </g>
        </g>
      </g>

      <g data-v-layer="3" style={anim}>
        <path d={RIBBON} transform="translate(3 4)" fill="none" stroke="#1B1F23" strokeWidth="4.2" strokeLinecap="round" opacity="0.16" filter={url("contact")} data-v-draw="true" />
        <path d={RIBBON} fill="none" stroke={url("brass")} strokeWidth="4.2" strokeLinecap="round" data-v-draw="true" />
        <path d={RIBBON} transform="translate(-0.5 -0.8)" fill="none" stroke="#C49A5A" strokeWidth="1" strokeLinecap="round" opacity="0.75" data-v-draw="true" />
      </g>

      <g data-v-layer="4" style={anim}>
        <path d={LIFTED} transform="translate(310 190) rotate(11)" fill="#1B1F23" opacity="0.2" filter={url("float")} />
        <g data-v-float="true" style={anim}>
          <g transform={LIFT_T}>
            <path d={LIFTED} transform="translate(0.6 2.4)" fill="#E6DCCB" />
            <path d={LIFTED} fill={url("lift")} stroke="#E6DCCB" strokeWidth="0.8" />
            <path d={LIFTED} fill={url("sheen")} />
            <path d="M-66.6,87V-85.6H66.6" fill="none" stroke="#FFFDF8" strokeWidth="1" strokeLinejoin="round" opacity="0.9" />
            <g stroke="#1B1F23" strokeWidth="2.4" strokeLinecap="round" opacity="0.62">
              <path d="M-49,-56H47" />
              <path d="M-49,-40H29" />
              <path d="M-49,-24H-3" />
            </g>
            <g stroke="#4A4F55" strokeWidth="2" strokeLinecap="round" opacity="0.4">
              <path d="M-49,18H37" />
              <path d="M-49,32H9" />
            </g>
          </g>
        </g>
      </g>

      <g data-v-layer="5" style={anim}>
        <ellipse cx="139" cy="281" rx="3.2" ry="5" fill="#1B1F23" opacity="0.28" filter={url("contact")} />
      </g>
    </svg>
  );
}
