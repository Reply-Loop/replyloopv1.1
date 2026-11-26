import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { hits } from "../audio/cues";
import { Eyebrow, WordReveal } from "../components/motion";
import { Chip, useHit, usePunch } from "../components/ui";
import { useExit } from "../components/layers";
import { Wordmark } from "../components/brand";
import { ClipCard } from "../components/ClipCard";
import { clamp, theme } from "../theme";

const MARQUEE = [
  "liquid12-connected.mp4", "photo13-website.mp4", "liquid14-ownerknowledge.mp4", "ad6-seo.mp4",
  "photo16-thankyou.mp4", "liquid10-homecare.mp4", "ad4-qna.mp4", "photo12-connected.mp4",
];

export const WhatWeDo: React.FC = () => {
  const frame = useCurrentFrame();
  const [h0, h1, h2, h3, h4] = hits("03-what-we-do");
  const brand = useHit(h0, "bouncy");
  const exit = useExit(10);
  const x = interpolate(frame, [0, 170], [40, -560], clamp);
  const chips: Array<[number, React.ReactNode, boolean]> = [
    [h1, "Every Google review answered", false],
    [h2, "16 new creative concepts a month", false],
    [h3, "Google · Facebook · Instagram", false],
    [h4, <span key="p"><b>$499</b> setup · <b>$350</b>/mo</span>, true],
  ];
  return (
    <AbsoluteFill style={exit}>
      <AbsoluteFill style={{ padding: `0 ${theme.layout.gutter}px`, paddingTop: 360 }}>
        <div style={{ opacity: brand, transform: `scale(${interpolate(brand, [0, 1], [0.85, 1]) * usePunch(h0, 0.04)})`, transformOrigin: "0% 50%" }}>
          <Wordmark size={74} delay={h0} />
        </div>
        <WordReveal delay={h0 + 5} per={2}
          text={"We run the marketing\nyou never have time for."}
          highlight={["never"]}
          style={{ marginTop: 34, fontFamily: theme.fonts.display, fontSize: 76, fontWeight: 600, lineHeight: 1.06, letterSpacing: "-0.03em", color: theme.colors.ivory }} />
        <div style={{ marginTop: 22 }}>
          <Eyebrow text="For local service businesses" delay={h0 + 12} color={theme.colors.ivoryDim} />
        </div>
        <div style={{ marginTop: 44, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 18 }}>
          {chips.map(([at, label, active], i) => (
            <div key={i} style={{ transform: `scale(${usePunch(at, active ? 0.08 : 0.04)})`, transformOrigin: "0% 50%" }}>
              <Chip p={useHit(at, "snappy")} active={active}>{label}</Chip>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      {/* Content strip: real deliverables sliding by below the safe zone. */}
      <div style={{ position: "absolute", top: 1330, left: 0, display: "flex", gap: 26, transform: `translateX(${x}px)` }}>
        {MARQUEE.map((src, i) => (
          <ClipCard key={src} src={src} tile startSec={1.2 + (i % 3) * 0.6} width={250} aspect={16 / 9} delay={h0 + 4 + i * 3} radius={22} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
