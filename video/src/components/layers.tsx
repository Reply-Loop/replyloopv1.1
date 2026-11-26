import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, theme } from "../theme";

// Layer 1: slow-drifting warm mesh on charcoal. Never a flat background.
export const BgMesh: React.FC<{ tone?: "dark" | "ivory"; intensity?: number }> = ({
  tone = "dark",
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 55) * 60;
  const d2 = Math.cos(frame / 70) * 50;
  const d3 = Math.sin(frame / 90 + 1) * 40;
  const dark = tone === "dark";
  return (
    <AbsoluteFill style={{ background: dark ? theme.colors.bg : theme.colors.ivory, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute", width: 1500, height: 1500, borderRadius: "50%",
          top: -620 + d3, left: -520 + d1, filter: "blur(60px)",
          background: `radial-gradient(circle, ${dark ? "rgba(201,154,75,0.20)" : "rgba(201,154,75,0.22)"} , transparent 62%)`,
          opacity: intensity,
        }}
      />
      <div
        style={{
          position: "absolute", width: 1300, height: 1300, borderRadius: "50%",
          bottom: -560, right: -520 - d2, filter: "blur(80px)",
          background: `radial-gradient(circle, ${dark ? "rgba(120,96,60,0.22)" : "rgba(138,95,28,0.12)"}, transparent 65%)`,
          opacity: intensity,
        }}
      />
      <div
        style={{
          position: "absolute", width: 900, height: 900, borderRadius: "50%",
          top: 700 + d2 * 0.5, left: 300 - d3, filter: "blur(90px)",
          background: `radial-gradient(circle, ${dark ? "rgba(40,48,56,0.9)" : "rgba(255,255,255,0.7)"}, transparent 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// Thin engineering grid, very faint: reads "designed system", not decoration.
export const Grid: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => {
  const frame = useCurrentFrame();
  const shift = (frame * 0.25) % 120;
  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundImage: `linear-gradient(${theme.colors.ivory} 1px, transparent 1px), linear-gradient(90deg, ${theme.colors.ivory} 1px, transparent 1px)`,
        backgroundSize: "120px 120px",
        backgroundPosition: `0px ${shift}px`,
        maskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
      }}
    />
  );
};

// Layer 4: color grade.
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: theme.colors.brass, mixBlendMode: "soft-light", opacity: 0.12 }} />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.28), transparent 18%, transparent 78%, rgba(0,0,0,0.34))",
      }}
    />
  </AbsoluteFill>
);

// Layer 5a: procedural grain.
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none", backgroundImage: noise, backgroundSize: "220px",
        backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
        opacity: 0.06, mixBlendMode: "overlay",
      }}
    />
  );
};

// Layer 5b: vignette (topmost).
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.38) 100%)",
    }}
  />
);

// Scene-level exit: everything lifts and fades faster than it entered.
export const useExit = (frames = 10) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const y = interpolate(frame, [durationInFrames - frames, durationInFrames], [0, -40], {
    easing: theme.ease.in, ...clamp,
  });
  const o = interpolate(frame, [durationInFrames - frames, durationInFrames], [1, 0], {
    easing: theme.ease.in, ...clamp,
  });
  const blur = interpolate(frame, [durationInFrames - frames, durationInFrames], [0, 6], clamp);
  return { transform: `translateY(${y}px)`, opacity: o, filter: `blur(${blur}px)` } as React.CSSProperties;
};
