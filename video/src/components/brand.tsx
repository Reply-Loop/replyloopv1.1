import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, theme } from "../theme";

// Lemniscate (infinity loop) path, drawn on with stroke-dash: the "loop" motif.
const loopPath = (w: number, h: number) => {
  const pts: string[] = [];
  const steps = 240;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2 - Math.PI / 2;
    const d = 1 + Math.sin(t) ** 2;
    const x = (Math.cos(t) / d) * (w / 2) + w / 2;
    const y = ((Math.sin(t) * Math.cos(t)) / d) * h + h / 2;
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return pts.join(" ");
};

export const LoopLine: React.FC<{
  width?: number;
  delay?: number;
  dur?: number;
  stroke?: number;
  color?: string;
  glow?: boolean;
  runner?: boolean;
}> = ({ width = 600, delay = 0, dur = 40, stroke = 6, color = theme.colors.brass, glow = false, runner = true }) => {
  const frame = useCurrentFrame();
  const h = width * 0.62;
  const p = interpolate(frame, [delay, delay + dur], [0, 1], { easing: theme.ease.inOut, ...clamp });
  const LEN = 2000;
  const runnerT = ((frame - delay) / 90) % 1;
  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} style={{ overflow: "visible", filter: glow ? `drop-shadow(0 0 22px ${theme.colors.brassGlow})` : undefined }}>
      <path d={loopPath(width - stroke * 2, h - stroke * 2)} transform={`translate(${stroke},${stroke})`}
        fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
        pathLength={LEN} strokeDasharray={LEN} strokeDashoffset={LEN * (1 - p)} />
      {runner && p >= 1 ? (
        <path d={loopPath(width - stroke * 2, h - stroke * 2)} transform={`translate(${stroke},${stroke})`}
          fill="none" stroke={theme.colors.ivory} strokeWidth={stroke + 2} strokeLinecap="round"
          pathLength={LEN} strokeDasharray={`60 ${LEN - 60}`} strokeDashoffset={-LEN * runnerT} opacity={0.9} />
      ) : null}
    </svg>
  );
};

// Official raster mark (speech-bubble infinity) with spring scale-in.
export const Mark: React.FC<{ height?: number; delay?: number; style?: React.CSSProperties }> = ({
  height = 40, delay = 0, style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.bouncy });
  return (
    <Img src={staticFile("brand/mark.png")}
      style={{ height, width: height * (1650 / 800), opacity: Math.min(1, p * 1.4), transform: `scale(${interpolate(p, [0, 1], [0.6, 1])})`, ...style }} />
  );
};

export const Wordmark: React.FC<{ size?: number; delay?: number; color?: string }> = ({
  size = 40, delay = 0, color = theme.colors.ivory,
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.35 }}>
    <Mark height={size * 0.78} delay={delay} />
    <span style={{ fontFamily: theme.fonts.display, fontSize: size, fontWeight: 560, color, letterSpacing: "-0.01em" }}>
      ReplyLoop
    </span>
  </div>
);
