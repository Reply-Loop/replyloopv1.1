type Props = { idPrefix?: string; className?: string };

const anim = { transformBox: "fill-box", transformOrigin: "center" } as const;

const LEFT =
  "M64,96H192Q206,96 206,110V156Q206,170 192,170H190Q194,180 204,187Q184,184 170,170H64Q50,170 50,156V110Q50,96 64,96Z";
const RIGHT =
  "M318,220H416Q430,220 430,234V274Q430,288 416,288H318Q304,288 304,274V258Q294,254 286,249Q296,244 304,236V234Q304,220 318,220Z";
const LOOP =
  "M208,191C216,214 244,230 266,220C288,210 290,180 270,170C250,160 232,178 242,202C250,222 266,240 282,247";

export function VignetteIntroCall({ idPrefix = "vic", className }: Props) {
  const id = (s: string) => `${idPrefix}-${s}`;
  const url = (s: string) => `url(#${id(s)})`;
  return (
    <svg viewBox="0 0 480 360" aria-hidden="true" focusable="false" className={className}>
      <defs>
        <linearGradient id={id("cone")} x1="40" y1="0" x2="250" y2="260" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFE9C4" stopOpacity="0.3" />
          <stop offset="0.7" stopColor="#FFE9C4" stopOpacity="0.1" />
          <stop offset="1" stopColor="#FFE9C4" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={id("pool")} cx="170" cy="160" r="190" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFE9C4" stopOpacity="0.45" />
          <stop offset="0.6" stopColor="#FFE9C4" stopOpacity="0.1" />
          <stop offset="1" stopColor="#FFE9C4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("paper")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FCFAF6" />
          <stop offset="0.55" stopColor="#F8F5EF" />
          <stop offset="1" stopColor="#EFE6D6" />
        </linearGradient>
        <linearGradient id={id("paper2")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F8F5EF" />
          <stop offset="1" stopColor="#E6DCCB" />
        </linearGradient>
        <linearGradient id={id("brass")} x1="206" y1="166" x2="286" y2="248" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#C49A5A" />
          <stop offset="0.5" stopColor="#8A5F1C" />
          <stop offset="1" stopColor="#5C3E12" />
        </linearGradient>
        <radialGradient id={id("glint")}>
          <stop offset="0" stopColor="#FFE9C4" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#C49A5A" stopOpacity="0.35" />
          <stop offset="1" stopColor="#C49A5A" stopOpacity="0" />
        </radialGradient>
        <filter id={id("soft")} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id={id("core")} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id={id("cast")} x="-20%" y="-30%" width="140%" height="160%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id={id("contact")} x="-10%" y="-10%" width="120%" height="130%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>

      <g data-v-layer="1" style={anim}>
        <path d="M6,-30L70,-30L330,250L120,320Z" fill={url("cone")} filter={url("soft")} />
        <path d="M22,-30L50,-30L250,190L160,226Z" fill={url("cone")} opacity="0.55" filter={url("core")} />
        <ellipse cx="170" cy="160" rx="190" ry="150" fill={url("pool")} />
      </g>

      <g data-v-layer="2" style={anim}>
        <path d={LEFT} transform="translate(9 12)" fill="#1B1F23" opacity="0.16" filter={url("cast")} />
        <path d={LEFT} transform="translate(1.5 2.5)" fill="#1B1F23" opacity="0.12" filter={url("contact")} />
        <path d={LEFT} transform="translate(0 2)" fill="#E6DCCB" />
        <path d={LEFT} fill={url("paper")} stroke="#E6DCCB" strokeWidth="0.8" />
        <g stroke="#1B1F23" strokeWidth="2.6" strokeLinecap="round" opacity="0.66">
          <path d="M70,117H178" />
          <path d="M70,133H162" />
          <path d="M70,149H124" />
        </g>
      </g>

      <g data-v-layer="3" style={anim}>
        <path d={RIGHT} transform="translate(9 12)" fill="#1B1F23" opacity="0.15" filter={url("cast")} />
        <path d={RIGHT} transform="translate(1.5 2.5)" fill="#1B1F23" opacity="0.12" filter={url("contact")} />
        <path d={RIGHT} transform="translate(0 2)" fill="#E6DCCB" />
        <path d={RIGHT} fill={url("paper2")} stroke="#E6DCCB" strokeWidth="0.8" />
        <g stroke="#1B1F23" strokeWidth="2.6" strokeLinecap="round" opacity="0.58">
          <path d="M324,243H408" />
          <path d="M324,259H372" />
        </g>
      </g>

      <g data-v-layer="4" style={anim}>
        <path d={LOOP} transform="translate(3 4)" fill="none" stroke="#1B1F23" strokeWidth="2.5" strokeLinecap="round" opacity="0.14" filter={url("contact")} data-v-draw="true" />
        <path d={LOOP} fill="none" stroke={url("brass")} strokeWidth="2.5" strokeLinecap="round" data-v-draw="true" />
      </g>

      <g data-v-layer="5" data-v-float="true" style={anim}>
        <circle cx="262" cy="168" r="11" fill={url("glint")} />
        <circle cx="261.5" cy="167.6" r="1.3" fill="#FFE9C4" />
      </g>
    </svg>
  );
}
