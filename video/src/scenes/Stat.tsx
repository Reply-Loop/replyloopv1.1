import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { hits } from "../audio/cues";
import { Counter, Eyebrow, WordReveal } from "../components/motion";
import { Source, useHit, usePunch } from "../components/ui";
import { useExit } from "../components/layers";
import { LoopLine } from "../components/brand";
import { theme } from "../theme";

// Verified: BrightLocal Local Consumer Review Survey 2026 (Feb 11, 2026;
// 1,002 US adults): "89% of consumers expect business owners to respond to reviews."
export const Stat: React.FC = () => {
  const [h0, h1] = hits("02-stat");
  const big = useHit(h0, "bouncy");
  const q = useHit(h1, "smooth");
  const exit = useExit(10);
  return (
    <AbsoluteFill style={{ padding: `0 ${theme.layout.gutter}px`, paddingTop: 380, ...exit }}>
      <Eyebrow text="The reality" index="01" />
      <div style={{ marginTop: 30, display: "flex", alignItems: "flex-end", transform: `scale(${interpolate(big, [0, 1], [0.7, 1]) * usePunch(h0, 0.05)})`, transformOrigin: "0% 100%", opacity: big }}>
        <Counter to={89} delay={h0} suffix="%"
          style={{ fontFamily: theme.fonts.display, fontSize: 330, fontWeight: 600, letterSpacing: "-0.05em", lineHeight: 0.9, color: theme.colors.brass, textShadow: `0 0 80px ${theme.colors.brassGlow}` }} />
      </div>
      <WordReveal delay={h0 + 6} per={2}
        text={"of consumers expect business\nowners to respond to reviews."}
        style={{ marginTop: 26, fontFamily: theme.fonts.display, fontSize: 60, fontWeight: 500, lineHeight: 1.12, letterSpacing: "-0.02em", color: theme.colors.ivory }} />
      <Source p={useHit(h0 + 14, "smooth")} style={{ marginTop: 26 }}>
        BrightLocal Local Consumer Review Survey 2026 · 1,002 U.S. adults
      </Source>
      <div style={{ marginTop: 70, display: "flex", alignItems: "center", gap: 30, opacity: q, transform: `translateY(${interpolate(q, [0, 1], [30, 0])}px)` }}>
        <div style={{ fontFamily: theme.fonts.display, fontStyle: "italic", fontSize: 66, fontWeight: 500, color: theme.colors.ivory, letterSpacing: "-0.02em" }}>
          Who’s answering yours?
        </div>
      </div>
      <div style={{ position: "absolute", right: -120, top: 1260, opacity: 0.35 }}>
        <LoopLine width={700} delay={0} dur={60} stroke={3} runner={false} />
      </div>
    </AbsoluteFill>
  );
};
