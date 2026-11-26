import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { hits } from "../audio/cues";
import { Counter, Eyebrow, WordReveal } from "../components/motion";
import { Source, useHit, usePunch } from "../components/ui";
import { useExit } from "../components/layers";
import { theme } from "../theme";

// Derived only from the approved price + one verified public figure:
//   $350 x 12 / 365 = $11.51/day   |   $350 / 16 = $21.88/concept
//   $350 / $37.87 (BLS OEWS May 2025 median, mkt research analysts & marketing specialists) = 9.24 h
const Card: React.FC<{ at: number; children: React.ReactNode; label: React.ReactNode; foot?: React.ReactNode }> = ({ at, children, label, foot }) => {
  const p = useHit(at, "snappy");
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 30, padding: "30px 36px", borderRadius: 30,
      background: "rgba(34,39,44,0.85)", border: `1.5px solid ${theme.colors.ivoryFaint}`,
      opacity: p, transform: `translateX(${interpolate(p, [0, 1], [80, 0])}px) scale(${usePunch(at, 0.05)})`,
      boxShadow: "0 40px 80px -30px rgba(0,0,0,0.7)",
    }}>
      <div style={{ minWidth: 330, fontFamily: theme.fonts.display, fontSize: 92, fontWeight: 600, letterSpacing: "-0.04em", color: theme.colors.brass, lineHeight: 1 }}>
        {children}
      </div>
      <div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: 32, fontWeight: 600, color: theme.colors.ivory, lineHeight: 1.25 }}>{label}</div>
        {foot ? <div style={{ fontFamily: theme.fonts.body, fontSize: 21, color: theme.colors.ivoryDim, marginTop: 8, lineHeight: 1.35 }}>{foot}</div> : null}
      </div>
    </div>
  );
};

export const PriceMath: React.FC = () => {
  const [h0, h1, h2, h3] = hits("06-price-math");
  const exit = useExit(10);
  return (
    <AbsoluteFill style={{ padding: `0 ${theme.layout.gutter}px`, paddingTop: 350, ...exit }}>
      <Eyebrow text="Do the math" index="04" />
      <WordReveal text={"What $350 a month\nactually buys."} highlight={["actually"]} delay={2} per={2}
        style={{ marginTop: 22, fontFamily: theme.fonts.display, fontSize: 80, fontWeight: 600, lineHeight: 1.04, letterSpacing: "-0.03em", color: theme.colors.ivory }} />
      <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: 22 }}>
        <Card at={h0} label="a day" foot="$350 × 12 months ÷ 365 days">
          $<Counter to={11.51} decimals={2} delay={h0} />
        </Card>
        <Card at={h1} label="per creative concept" foot="$350 ÷ 16 concepts, each made for 3 platforms">
          $<Counter to={21.88} decimals={2} delay={h1} />
        </Card>
        <Card at={h2} label={<>Less than 10 hours of a marketing specialist’s pay</>} foot="U.S. median $37.87/hr · BLS OEWS, May 2025">
          &lt;<Counter to={10} delay={h2} />h
        </Card>
      </div>
      <Source p={useHit(h3, "smooth")} style={{ marginTop: 26, fontSize: 24 }}>
        Plus unlimited review responses. No extra fee per review.
      </Source>
    </AbsoluteFill>
  );
};
