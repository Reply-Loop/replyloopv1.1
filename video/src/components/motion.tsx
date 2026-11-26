import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, theme } from "../theme";

// Premium entrance: opacity + rise + scale together.
export const Entrance: React.FC<{
  delay?: number;
  children: React.ReactNode;
  y?: number;
  style?: React.CSSProperties;
  config?: keyof typeof theme.spring;
}> = ({ delay = 0, children, y = 40, style, config = "smooth" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring[config] });
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [y, 0])}px) scale(${interpolate(p, [0, 1], [0.95, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Word-by-word reveal with optional highlighted words (brass).
export const WordReveal: React.FC<{
  text: string;
  delay?: number;
  per?: number;
  style?: React.CSSProperties;
  highlight?: string[];
  italicHighlight?: boolean;
}> = ({ text, delay = 0, per = 3, style, highlight = [], italicHighlight = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = text.split("\n");
  let idx = 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", ...style }}>
      {lines.map((line, li) => (
        <div key={li} style={{ display: "flex", flexWrap: "wrap", columnGap: "0.24em" }}>
          {line.split(" ").map((word, wi) => {
            const i = idx++;
            const p = spring({ frame: frame - delay - i * per, fps, config: theme.spring.snappy });
            const clean = word.replace(/[.,!?:;]/g, "");
            const hl = highlight.includes(clean);
            return (
              <span
                key={wi}
                style={{
                  display: "inline-block",
                  opacity: p,
                  transform: `translateY(${interpolate(p, [0, 1], [34, 0])}px)`,
                  filter: `blur(${interpolate(p, [0, 1], [6, 0])}px)`,
                  color: hl ? theme.colors.brass : undefined,
                  fontStyle: hl && italicHighlight ? "italic" : undefined,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// Brass hairline that draws in from the left.
export const Rule: React.FC<{ delay?: number; width?: number; color?: string; dur?: number }> = ({
  delay = 0, width = 160, color = theme.colors.brass, dur = 22,
}) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [delay, delay + dur], [0, width], { easing: theme.ease.out, ...clamp });
  return <div style={{ height: 3, width: w, background: color, borderRadius: 3 }} />;
};

// Small uppercase eyebrow label with index, e.g. "02 — WHAT YOU GET".
export const Eyebrow: React.FC<{ text: string; index?: string; delay?: number; color?: string }> = ({
  text, index, delay = 0, color = theme.colors.brass,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.smooth });
  const spacing = interpolate(p, [0, 1], [0.5, 0.22]);
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 18, opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-24, 0])}px)`,
        fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 26,
        letterSpacing: `${spacing}em`, textTransform: "uppercase", color,
      }}
    >
      {index ? <span style={{ fontVariantNumeric: "tabular-nums", opacity: 0.9 }}>{index}</span> : null}
      {index ? <span style={{ width: 40, height: 2, background: color, opacity: 0.7 }} /> : null}
      <span>{text}</span>
    </div>
  );
};

// Animated counter with tabular numerals.
export const Counter: React.FC<{
  to: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  style?: React.CSSProperties;
}> = ({ to, delay = 0, prefix = "", suffix = "", decimals = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 30, stiffness: 55, mass: 1 } });
  const v = interpolate(p, [0, 1], [0, to]);
  const shown = p > 0.995 ? to : v;
  return (
    <span style={{ fontVariantNumeric: "tabular-nums lining-nums", ...style }}>
      {prefix}
      {shown.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
};

// Idle breathing helpers.
export const useBreathe = (amp = 0.012, speed = 22) => {
  const frame = useCurrentFrame();
  return 1 + Math.sin(frame / speed) * amp;
};
export const useFloat = (amp = 4, speed = 30, phase = 0) => {
  const frame = useCurrentFrame();
  return Math.sin(frame / speed + phase) * amp;
};
