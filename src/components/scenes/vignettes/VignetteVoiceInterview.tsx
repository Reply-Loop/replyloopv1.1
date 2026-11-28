type Props = { idPrefix?: string; className?: string };

const anim = { transformBox: "fill-box", transformOrigin: "center" } as const;
const NB = "translate(220 200) rotate(-6) scale(0.94)";
const PEN = "translate(74 2) rotate(-38)";
const rules = [-58, -44, -30, -16, -2, 12, 26, 40, 54, 68];

export function VignetteVoiceInterview({ idPrefix = "vvi", className }: Props) {
  const id = (s: string) => `${idPrefix}-${s}`;
  const u = (s: string) => `url(#${id(s)})`;
  return (
    <svg viewBox="0 0 480 360" aria-hidden="true" focusable="false" className={className}>
      <defs>
        <radialGradient id={id("glow")} cx="0.3" cy="0.24" r="0.62">
          <stop offset="0" stopColor="#FFE9C4" stopOpacity="0.3" />
          <stop offset="0.55" stopColor="#FFE9C4" stopOpacity="0.1" />
          <stop offset="1" stopColor="#FFE9C4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("pl")} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor="#FBF8F3" />
          <stop offset="0.75" stopColor="#F3ECE0" />
          <stop offset="1" stopColor="#E6DCCB" />
        </linearGradient>
        <linearGradient id={id("pr")} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor="#E6DCCB" />
          <stop offset="0.22" stopColor="#F1E9DC" />
          <stop offset="1" stopColor="#F6F1E8" />
        </linearGradient>
        <linearGradient id={id("gut")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1B1F23" stopOpacity="0" />
          <stop offset="0.5" stopColor="#1B1F23" stopOpacity="0.22" />
          <stop offset="1" stopColor="#1B1F23" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id("ch")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5A6066" />
          <stop offset="0.32" stopColor="#2A2F34" />
          <stop offset="0.7" stopColor="#1B1F23" />
          <stop offset="1" stopColor="#121518" />
        </linearGradient>
        <linearGradient id={id("br")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E2C38E" />
          <stop offset="0.35" stopColor="#C49A5A" />
          <stop offset="0.7" stopColor="#8A5F1C" />
          <stop offset="1" stopColor="#5C3E12" />
        </linearGradient>
        <radialGradient id={id("hl")}>
          <stop offset="0" stopColor="#FFE9C4" stopOpacity="0.85" />
          <stop offset="1" stopColor="#FFE9C4" stopOpacity="0" />
        </radialGradient>
        <filter id={id("sh")} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id={id("ps")} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="2.6" />
        </filter>
      </defs>

      <g data-v-layer="1" style={anim}>
        <rect width="480" height="360" fill={u("glow")} />
      </g>

      <g data-v-layer="2" style={anim}>
        <g transform={NB}>
          <rect x="-150" y="-92" width="308" height="196" rx="6" transform="translate(6 8)" fill="#1B1F23" opacity="0.2" filter={u("sh")} />
          <path d="M-150 -95C-100 -98 -30 -98 0 -89C30 -98 100 -98 150 -95Q154 -95 154 -91L154 95Q154 99 150 99L-150 99Q-154 99 -154 95L-154 -91Q-154 -95 -150 -95Z" fill="#2A2F34" />
          <path d="M-152 -91C-100 -94 -30 -95 0 -87C30 -95 100 -94 152 -91L152 98L-152 98Z" fill="#D6C9B3" />
          <path d="M-151 -91C-100 -94 -30 -95 0 -87L0 97L-151 96Z" fill="#E6DCCB" />
          <path d="M151 -91C100 -94 30 -95 0 -87L0 97L151 96Z" fill="#E0D5C2" />
          <path d="M-149 -92C-100 -95 -30 -96 0 -87L0 94C-30 92 -100 93 -149 94Z" fill={u("pl")} />
          <path d="M149 -92C100 -95 30 -96 0 -87L0 94C30 92 100 93 149 94Z" fill={u("pr")} />
          <g stroke="#4A4F55" strokeWidth="0.6" opacity="0.32" fill="none">
            {rules.map((y) => (
              <path key={y} d={`M-136 ${y}C-80 ${y - 1} -30 ${y - 1} -12 ${y + 1}M12 ${y + 1}C30 ${y - 1} 80 ${y - 1} 136 ${y}`} />
            ))}
          </g>
          <rect x="-22" y="-92" width="44" height="188" fill={u("gut")} />
          <path d="M0 -86L0 93" stroke="#5C3E12" strokeWidth="0.5" opacity="0.25" />
          <path d="M126 94L149 94L149 70C145 82 137 90 126 94Z" fill="#E0D5C2" />
          <path d="M126 94C133 88 138 80 149 70C147 78 143 85 139 89C135 92 131 93.5 126 94Z" fill="#F8F5EF" />
          <path d="M126 94C133 88 138 80 149 70" stroke="#1B1F23" strokeWidth="0.6" fill="none" opacity="0.18" />
          <path d="M-149 -92C-100 -95 -30 -96 -1 -88" stroke="#FFFFFF" strokeWidth="0.8" fill="none" opacity="0.6" />
        </g>
      </g>

      <g data-v-layer="3" style={anim}>
        <g transform={NB}>
          <path d="M0 0L186 -6.5L186 6.5Z" transform="translate(74 2) rotate(-31) translate(2 3)" fill="#1B1F23" opacity="0.22" filter={u("ps")} />
          <g transform={PEN}>
            <path d="M0 0C6 -1.2 14 -3 20 -4.6C25 -6.2 30 -6.6 33 -5.6L33 5.6C30 6.6 25 6.2 20 4.6C14 3 6 1.2 0 0Z" fill={u("br")} />
            <path d="M1.5 0L21 0" stroke="#5C3E12" strokeWidth="0.6" />
            <circle cx="22.3" cy="0" r="1.2" fill="#1B1F23" />
            <path d="M32 -5.4C38 -6.2 46 -6.3 52 -6.2L52 6.2C46 6.3 38 6.2 32 5.4Z" fill={u("ch")} />
            <rect x="52" y="-6.6" width="3" height="13.2" fill={u("br")} />
            <rect x="55" y="-7" width="70" height="14" rx="1.4" fill={u("ch")} />
            <rect x="125" y="-7.6" width="4.4" height="15.2" fill={u("br")} />
            <path d="M129.4 -7.6L176 -7.4C183 -7.2 186 -4 186 0C186 4 183 7.2 176 7.4L129.4 7.6Z" fill={u("ch")} />
            <rect x="174" y="-7.4" width="1.8" height="14.8" fill={u("br")} opacity="0.85" />
            <g fill="#F8F5EF" opacity="0.26">
              <rect x="35" y="-4" width="16" height="1" rx="0.5" />
              <rect x="57" y="-4.9" width="66" height="1.3" rx="0.6" />
              <rect x="132" y="-5.2" width="41" height="1.3" rx="0.6" />
            </g>
            <path d="M140 -8.6L178 -8.6" stroke="#1B1F23" strokeWidth="2.6" strokeLinecap="round" opacity="0.3" />
            <path d="M141 -10.6L177 -10.2C179 -10.2 179.6 -9.4 179 -8.4" stroke={u("br")} strokeWidth="2.4" strokeLinecap="round" fill="none" />
            <circle cx="141.4" cy="-10" r="2.1" fill={u("br")} />
          </g>
        </g>
      </g>

      <g data-v-layer="4" style={anim}>
        <g transform={NB}>
          <path
            data-v-draw="true"
            d="M74 2C78 22 98 34 116 30C134 26 137 5 122 3C105 1 101 27 118 41C127 49 136 52 143 51"
            fill="none"
            stroke="#8A5F1C"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>

      <g data-v-layer="5" style={anim}>
        <g transform={NB}>
          <g transform={PEN}>
            <ellipse cx="13" cy="-1.5" rx="16" ry="5" fill={u("hl")} opacity="0.7" />
            <path d="M5 -1.4C11 -2.6 18 -3.8 25 -4.4" stroke="#FFF4DE" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.8" />
          </g>
        </g>
      </g>
    </svg>
  );
}
