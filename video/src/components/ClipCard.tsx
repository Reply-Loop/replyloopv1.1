import React from "react";
import { OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, theme } from "../theme";

// A source clip shown as a framed "deliverable" card: rounded mask, hairline
// border, deep shadow, slow push-in (Ken Burns), spring entrance.
export const ClipCard: React.FC<{
  src: string;
  startSec: number;
  width: number;
  aspect?: number; // h / w
  delay?: number;
  zoom?: [number, number];
  radius?: number;
  rotate?: number;
  muted?: boolean;
  focusY?: number; // objectPosition Y %
  playbackRate?: number;
  style?: React.CSSProperties;
  label?: string;
  tile?: boolean;
}> = ({
  src, startSec, width, aspect = 16 / 9, delay = 0, zoom = [1.0, 1.06], radius = 34,
  rotate = 0, focusY = 50, playbackRate = 1, style, label, tile = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.smooth });
  const scale = interpolate(frame, [0, durationInFrames], zoom, { easing: theme.ease.inOut, ...clamp });
  const h = width * aspect;
  return (
    <div
      style={{
        width, height: h, borderRadius: radius, overflow: "hidden", position: "relative",
        border: `1.5px solid ${theme.colors.ivoryFaint}`,
        boxShadow: "0 50px 100px -30px rgba(0,0,0,0.75), 0 0 0 1px rgba(0,0,0,0.4)",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [70, 0])}px) scale(${interpolate(p, [0, 1], [0.92, 1])}) rotate(${rotate}deg)`,
        background: theme.colors.panel,
        ...style,
      }}
    >
      <Sequence from={Math.floor(delay)} layout="none">
      <OffthreadVideo
        src={staticFile(`${tile ? "tiles" : "src"}/${src}`)}
        startFrom={Math.round(startSec * fps)}
        muted
        playbackRate={playbackRate}
        style={{
          width: "100%", height: "100%", objectFit: "cover", objectPosition: `50% ${focusY}%`,
          transform: `scale(${scale})`, filter: "saturate(1.05) contrast(1.05)",
        }}
      />
      </Sequence>
      {label ? (
        <div
          style={{
            position: "absolute", left: 22, bottom: 22, padding: "10px 18px", borderRadius: 999,
            background: "rgba(20,23,26,0.78)", backdropFilter: "blur(8px)",
            border: `1px solid ${theme.colors.ivoryFaint}`, color: theme.colors.ivory,
            fontFamily: theme.fonts.body, fontSize: 22, fontWeight: 600, letterSpacing: "0.04em",
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};
