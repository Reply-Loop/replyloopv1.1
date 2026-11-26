import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { hits } from "../audio/cues";
import { Counter, Eyebrow, WordReveal } from "../components/motion";
import { Chip, useHit, usePunch } from "../components/ui";
import { useExit } from "../components/layers";
import { Wordmark } from "../components/brand";
import { ClipCard } from "../components/ClipCard";
import { theme } from "../theme";

// 15s Reels cutdown, beat 2: what we do, three chips on three beats.
export const Cut15What: React.FC = () => {
  const [h0, h1, h2, h3] = hits("c15-02-what");
  const brand = useHit(h0, "bouncy");
  const exit = useExit(8);
  const chips: Array<[number, string]> = [
    [h1, "Every Google review answered"],
    [h2, "16 new creative concepts a month"],
    [h3, "Google · Facebook · Instagram"],
  ];
  return (
    <AbsoluteFill style={exit}>
      <AbsoluteFill style={{ padding: `0 ${theme.layout.gutter}px`, paddingTop: 360 }}>
        <div style={{ opacity: brand, transform: `scale(${interpolate(brand, [0, 1], [0.85, 1]) * usePunch(h0, 0.05)})`, transformOrigin: "0% 50%" }}>
          <Wordmark size={74} delay={h0} />
        </div>
        <WordReveal delay={h0 + 3} per={2} text={"We run the marketing\nyou never have time for."} highlight={["never"]}
          style={{ marginTop: 34, fontFamily: theme.fonts.display, fontSize: 76, fontWeight: 600, lineHeight: 1.06, letterSpacing: "-0.03em", color: theme.colors.ivory }} />
        <div style={{ marginTop: 48, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 18 }}>
          {chips.map(([at, label], i) => (
            <div key={i} style={{ transform: `scale(${usePunch(at, 0.05)})`, transformOrigin: "0% 50%" }}>
              <Chip p={useHit(at, "snappy")}>{label}</Chip>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 1330, left: theme.layout.gutter, display: "flex", gap: 22 }}>
        {["liquid12-connected.mp4", "photo14-ownerknowledge.mp4", "liquid16-thankyou.mp4"].map((src, i) => (
          <ClipCard key={src} tile src={src} startSec={1.2} width={290} aspect={1.25} delay={h0 + 2 + i * 4} radius={22} focusY={40} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// 15s Reels cutdown, beat 3: both prices, each on its own thump, with terms.
export const Cut15Price: React.FC = () => {
  const [h0, h1, h2] = hits("c15-03-price");
  const a = useHit(h0, "bouncy");
  const b = useHit(h1, "bouncy");
  const c = useHit(h2, "smooth");
  const exit = useExit(8);
  const priceStyle: React.CSSProperties = {
    fontFamily: theme.fonts.display, fontSize: 190, fontWeight: 600, letterSpacing: "-0.045em", lineHeight: 0.92, color: theme.colors.brass,
  };
  return (
    <AbsoluteFill style={{ padding: `0 ${theme.layout.gutter}px`, paddingTop: 360, ...exit }}>
      <Eyebrow text="Simple pricing" index="$" />
      <div style={{ marginTop: 26, opacity: a, transform: `translateY(${interpolate(a, [0, 1], [50, 0])}px) scale(${usePunch(h0, 0.05)})`, transformOrigin: "0% 50%" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 24 }}>
          <Counter to={499} delay={h0} prefix="$" style={{ ...priceStyle, opacity: interpolate(b, [0, 1], [1, 0.75]) }} />
          <div style={{ paddingBottom: 16, fontFamily: theme.fonts.display, fontSize: 50, fontWeight: 600, color: theme.colors.ivory, lineHeight: 1.05 }}>
            one-time<br />setup
          </div>
        </div>
      </div>
      <div style={{ height: 2, background: theme.colors.hairline, margin: "30px 0" }} />
      <div style={{ opacity: b, transform: `translateY(${interpolate(b, [0, 1], [50, 0])}px) scale(${usePunch(h1, 0.06)})`, transformOrigin: "0% 50%" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 24 }}>
          <Counter to={350} delay={h1} prefix="$" style={{ ...priceStyle, textShadow: `0 0 70px ${theme.colors.brassGlow}` }} />
          <div style={{ paddingBottom: 16, fontFamily: theme.fonts.display, fontSize: 50, fontWeight: 600, color: theme.colors.ivory, lineHeight: 1.05 }}>
            /month<br />per location
          </div>
        </div>
        <div style={{ marginTop: 18, fontFamily: theme.fonts.body, fontSize: 30, fontWeight: 600, color: theme.colors.ivory }}>
          Month-to-month. Cancel anytime before your next billing date.
        </div>
      </div>
      <div style={{ marginTop: 36, display: "flex", gap: 16, flexWrap: "wrap", opacity: c, transform: `translateY(${interpolate(c, [0, 1], [30, 0])}px)` }}>
        {["About $11.51 a day", "Unlimited review replies", "You approve everything"].map((t) => (
          <div key={t} style={{ padding: "14px 24px", borderRadius: 999, border: `1.5px solid ${theme.colors.ivoryFaint}`, background: "rgba(248,245,239,0.06)", fontFamily: theme.fonts.body, fontSize: 27, fontWeight: 600, color: theme.colors.ivory }}>
            {t}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
