import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, theme } from "../theme";

// Spring helper anchored on an accent frame (visual lands with the thump).
export const useHit = (at: number, config: keyof typeof theme.spring = "snappy", lead = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - (at - lead), fps, config: theme.spring[config] });
};

// "Thump" pulse: a quick scale punch that decays right after an accent.
export const usePunch = (at: number, amount = 0.06) => {
  const frame = useCurrentFrame();
  const d = frame - at;
  if (d < 0) return 1;
  return 1 + amount * Math.exp(-d / 5) * Math.cos(d / 2.2);
};

export const Stars: React.FC<{ n?: number; size?: number; color?: string }> = ({
  n = 5, size = 30, color = theme.colors.brass,
}) => (
  <div style={{ display: "flex", gap: size * 0.18 }}>
    {Array.from({ length: n }).map((_, i) => (
      <svg key={i} width={size} height={size} viewBox="0 0 24 24">
        <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z" fill={color} />
      </svg>
    ))}
  </div>
);

export const Check: React.FC<{ size?: number; progress?: number; color?: string }> = ({
  size = 40, progress = 1, color = theme.colors.brass,
}) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="18" fill="none" stroke={color} strokeWidth="2.5" opacity={0.35 + 0.65 * progress} />
    <path d="M12 20.5l5.5 5.5L28.5 14" fill="none" stroke={color} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"
      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
  </svg>
);

// Generic sample Google review card (clearly labelled as a sample).
export const ReviewCard: React.FC<{
  name: string;
  text: string;
  replied: number; // 0..1 transition from "No reply yet" to replied
  reply?: string;
  width?: number;
  style?: React.CSSProperties;
}> = ({ name, text, replied, reply, width = 820, style }) => {
  const frame = useCurrentFrame();
  const pulse = 0.65 + 0.35 * Math.sin(frame / 5);
  const typed = reply ? reply.slice(0, Math.floor(interpolate(replied, [0.1, 1], [0, reply.length], clamp))) : "";
  return (
    <div
      style={{
        width, borderRadius: 30, padding: "34px 38px", background: "rgba(248,245,239,0.97)",
        color: theme.colors.ink, boxShadow: "0 40px 90px -25px rgba(0,0,0,0.8)", fontFamily: theme.fonts.body,
        position: "relative", ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 62, height: 62, borderRadius: 31, background: "#D9CDB8", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 28, color: "#6B5634" }}>
          {name[0]}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 650, fontSize: 28 }}>{name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
            <Stars size={24} color="#C08A2E" />
            <span style={{ fontSize: 21, color: "#7A766E" }}>Google review</span>
          </div>
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "0.12em", color: "#9A958C", border: "1.5px solid #CFC8BB", borderRadius: 8, padding: "4px 10px" }}>
          SAMPLE
        </div>
      </div>
      <div style={{ fontSize: 30, lineHeight: 1.35, marginTop: 22, color: "#2A2D31" }}>{text}</div>
      <div style={{ marginTop: 24, position: "relative", minHeight: 64 }}>
        {replied < 0.05 ? (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "12px 20px", borderRadius: 999, background: "rgba(212,106,90,0.12)", color: "#B4483A", fontWeight: 650, fontSize: 24 }}>
            <span style={{ width: 12, height: 12, borderRadius: 6, background: "#C9574A", opacity: pulse }} />
            No reply yet
          </div>
        ) : (
          <div style={{ borderLeft: `4px solid ${theme.colors.brassDeep}`, paddingLeft: 20, opacity: interpolate(replied, [0, 0.15], [0, 1], clamp) }}>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.08em", color: theme.colors.brassDeep, textTransform: "uppercase" }}>
              Owner reply · in your voice
            </div>
            <div style={{ fontSize: 27, lineHeight: 1.35, marginTop: 8, color: "#3A3D41" }}>
              {typed}
              {replied < 1 ? <span style={{ opacity: frame % 16 < 8 ? 1 : 0 }}>|</span> : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// A pill/chip.
export const Chip: React.FC<{ children: React.ReactNode; p: number; active?: boolean; style?: React.CSSProperties }> = ({
  children, p, active = false, style,
}) => (
  <div
    style={{
      display: "inline-flex", alignItems: "center", gap: 14, padding: "18px 28px", borderRadius: 999,
      fontFamily: theme.fonts.body, fontSize: 32, fontWeight: 600,
      color: active ? theme.colors.ink : theme.colors.ivory,
      background: active ? theme.colors.brass : "rgba(248,245,239,0.06)",
      border: `1.5px solid ${active ? theme.colors.brass : theme.colors.ivoryFaint}`,
      opacity: p, transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px) scale(${interpolate(p, [0, 1], [0.85, 1])})`,
      boxShadow: active ? `0 0 50px ${theme.colors.brassGlow}` : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

// Fine-print source line.
export const Source: React.FC<{ children: React.ReactNode; p: number; style?: React.CSSProperties }> = ({ children, p, style }) => (
  <div
    style={{
      fontFamily: theme.fonts.body, fontSize: 22, lineHeight: 1.4, color: theme.colors.ivoryDim,
      opacity: p * 0.9, transform: `translateY(${interpolate(p, [0, 1], [12, 0])}px)`, ...style,
    }}
  >
    {children}
  </div>
);
