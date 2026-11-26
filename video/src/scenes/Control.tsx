import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { hits } from "../audio/cues";
import { Eyebrow } from "../components/motion";
import { Check, useHit, usePunch } from "../components/ui";
import { useExit } from "../components/layers";
import { ClipCard } from "../components/ClipCard";
import { clamp, theme } from "../theme";

// Owner control + risk reversal. Every line is a term from the pricing doc.
export const Control: React.FC = () => {
  const frame = useCurrentFrame();
  const [h0, h1, h2, h3] = hits("07-owner-control");
  const exit = useExit(10);
  const lines: Array<[number, string, string]> = [
    [h0, "You approve every batch.", "Nothing posts without your OK."],
    [h1, "Tough reviews wait for you.", "3 stars or lower, and anything sensitive, is held for your approval."],
    [h2, "You keep the keys.", "Your accounts stay yours."],
  ];
  const term = useHit(h3, "bouncy");
  return (
    <AbsoluteFill style={exit}>
      <AbsoluteFill style={{ padding: `0 ${theme.layout.gutter}px`, paddingTop: 350 }}>
        <Eyebrow text="You stay in control" index="05" />
        <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 34 }}>
          {lines.map(([at, title, sub], i) => {
            const p = useHit(at, "snappy");
            const c = interpolate(frame, [at, at + 12], [0, 1], { easing: theme.ease.out, ...clamp });
            return (
              <div key={i} style={{ display: "flex", gap: 26, alignItems: "flex-start", opacity: p, transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${usePunch(at, 0.04)})`, transformOrigin: "0% 50%" }}>
                <div style={{ paddingTop: 10 }}><Check size={52} progress={c} /></div>
                <div>
                  <div style={{ fontFamily: theme.fonts.display, fontSize: 62, fontWeight: 600, color: theme.colors.ivory, letterSpacing: "-0.025em", lineHeight: 1.06 }}>{title}</div>
                  <div style={{ fontFamily: theme.fonts.body, fontSize: 28, color: theme.colors.ivoryDim, marginTop: 10, lineHeight: 1.35, maxWidth: 780 }}>{sub}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{
          marginTop: 46, padding: "30px 36px", borderRadius: 28, background: theme.colors.brass, color: theme.colors.ink,
          opacity: term, transform: `translateY(${interpolate(term, [0, 1], [60, 0])}px) scale(${interpolate(term, [0, 1], [0.9, 1]) * usePunch(h3, 0.05)})`,
          boxShadow: `0 0 70px ${theme.colors.brassGlow}`,
        }}>
          <div style={{ fontFamily: theme.fonts.display, fontSize: 52, fontWeight: 650, letterSpacing: "-0.02em" }}>Month-to-month.</div>
          <div style={{ fontFamily: theme.fonts.body, fontSize: 28, fontWeight: 600, marginTop: 6 }}>Cancel anytime before your next billing date.</div>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: theme.layout.gutter, right: theme.layout.gutter, top: 1420, display: "flex", gap: 22, opacity: 0.85 }}>
        <ClipCard tile src="liquid15-ownercontrol.mp4" startSec={1.2} width={445} aspect={0.75} delay={h0 + 4} radius={24} focusY={62} />
        <ClipCard tile src="photo15-ownercontrol.mp4" startSec={1.2} width={445} aspect={0.75} delay={h0 + 9} radius={24} focusY={62} />
      </div>
    </AbsoluteFill>
  );
};
