import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { hits } from "../audio/cues";
import { WordReveal } from "../components/motion";
import { useHit, usePunch } from "../components/ui";
import { LoopLine, Wordmark } from "../components/brand";
import { BgMesh } from "../components/layers";
import { theme } from "../theme";

export const BOOKING_URL = "cal.com/hunter-newbold-klaopa/intro-call";

// Ivory end card. Thump 1: the call to action. Thump 2: the brand bookend.
export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const [h0, h1] = hits("08-cta");
  const btn = useHit(h0 + 4, "bouncy");
  const brand = useHit(h1, "bouncy");
  const wipe = interpolate(frame, [0, 12], [0, 100], { extrapolateRight: "clamp", easing: theme.ease.out });
  const glow = 0.6 + 0.4 * Math.sin(frame / 10);
  return (
    <AbsoluteFill style={{ clipPath: `circle(${wipe * 1.6}% at 50% 40%)` }}>
      <BgMesh tone="ivory" />
      <AbsoluteFill style={{ padding: `0 ${theme.layout.gutter}px`, paddingTop: 350, color: theme.colors.ink }}>
        <WordReveal text={"Let’s look at your\nbusiness together."} highlight={["together"]} delay={h0} per={2}
          style={{ fontFamily: theme.fonts.display, fontSize: 88, fontWeight: 600, lineHeight: 1.04, letterSpacing: "-0.03em", color: theme.colors.ink }} />
        <div style={{ marginTop: 50, transform: `scale(${interpolate(btn, [0, 1], [0.8, 1]) * usePunch(h0 + 4, 0.05)})`, transformOrigin: "0% 50%", opacity: btn }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 22, padding: "30px 46px", borderRadius: 999,
            background: theme.colors.brassDeep, color: theme.colors.ivory, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 44,
            boxShadow: `0 0 ${50 * glow}px rgba(138,95,28,0.45), 0 30px 60px -20px rgba(0,0,0,0.35)`,
          }}>
            Book your intro call
            <svg width="40" height="40" viewBox="0 0 40 40"><path d="M10 20h20M22 12l8 8-8 8" stroke={theme.colors.ivory} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div style={{ marginTop: 22, fontFamily: theme.fonts.body, fontSize: 30, fontWeight: 600, color: theme.colors.brassDeep, letterSpacing: "0.01em" }}>
            {BOOKING_URL}
          </div>
        </div>
        <div style={{ marginTop: 46, paddingTop: 28, borderTop: "1.5px solid rgba(27,31,35,0.14)", fontFamily: theme.fonts.body, fontSize: 28, lineHeight: 1.5, color: "#4A4D52", opacity: btn }}>
          <b style={{ color: theme.colors.ink }}>$499</b> one-time setup · <b style={{ color: theme.colors.ink }}>$350</b>/month per location
          <br />Month-to-month. Cancel anytime before your next billing date.
        </div>
        <div style={{ marginTop: 56, display: "flex", alignItems: "center", gap: 30, opacity: brand, transform: `translateY(${interpolate(brand, [0, 1], [30, 0])}px) scale(${usePunch(h1, 0.04)})`, transformOrigin: "0% 50%" }}>
          <Wordmark size={62} delay={h1} color={theme.colors.ink} />
          <div style={{ width: 2, height: 56, background: "rgba(27,31,35,0.2)" }} />
          <div style={{ fontFamily: theme.fonts.display, fontStyle: "italic", fontSize: 40, color: theme.colors.brassDeep }}>Keep the thank-you alive.</div>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 190, top: 1330, opacity: 0.5 }}>
        <LoopLine width={700} delay={h1} dur={40} stroke={5} color={theme.colors.brassDeep} />
      </div>
    </AbsoluteFill>
  );
};
