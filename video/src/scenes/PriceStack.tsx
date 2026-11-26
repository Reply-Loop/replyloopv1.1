import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { hits } from "../audio/cues";
import { Counter, Eyebrow } from "../components/motion";
import { Check, useHit, usePunch } from "../components/ui";
import { usePanel } from "../components/visuals";
import { useExit } from "../components/layers";
import { clamp, theme } from "../theme";

export type StackItem = { title: string; visual: (at: number) => React.ReactNode; visualTop?: number };

// Value stack: price lands on the first thump, each line item lands on its own
// accent (row checks off + its feature visual takes the stage), and the final
// big thump recaps the price with the billing terms in plain view.
export const PriceStack: React.FC<{
  sectionId: string;
  index: string;
  eyebrow: string;
  amount: number;
  unit: string;
  unitSub: string;
  items: StackItem[];
  recap: React.ReactNode;
}> = ({ sectionId, index, eyebrow, amount, unit, unitSub, items, recap }) => {
  const frame = useCurrentFrame();
  const h = hits(sectionId);
  const h0 = h[0];
  const itemHits = h.slice(1, 1 + items.length);
  const recapAt = h[h.length - 1];
  const price = useHit(h0, "bouncy");
  const recapP = useHit(recapAt, "bouncy");
  const exit = useExit(10);
  const rowH = items.length > 4 ? 66 : 78;
  return (
    <AbsoluteFill style={exit}>
      <AbsoluteFill style={{ padding: `0 ${theme.layout.gutter}px`, paddingTop: 340 }}>
        <Eyebrow text={eyebrow} index={index} delay={0} />
        <div style={{ marginTop: 18, display: "flex", alignItems: "flex-end", gap: 26, transform: `scale(${interpolate(price, [0, 1], [0.75, 1]) * usePunch(h0, 0.05) * usePunch(recapAt, 0.07)})`, transformOrigin: "0% 100%", opacity: price }}>
          <Counter to={amount} delay={h0} prefix="$"
            style={{ fontFamily: theme.fonts.display, fontSize: 200, fontWeight: 600, letterSpacing: "-0.045em", lineHeight: 0.92, color: theme.colors.brass, textShadow: `0 0 ${40 + 60 * recapP}px ${theme.colors.brassGlow}` }} />
          <div style={{ paddingBottom: 18 }}>
            <div style={{ fontFamily: theme.fonts.display, fontSize: 54, fontWeight: 600, color: theme.colors.ivory, lineHeight: 1, letterSpacing: "-0.02em" }}>{unit}</div>
            <div style={{ fontFamily: theme.fonts.body, fontSize: 26, fontWeight: 500, color: theme.colors.ivoryDim, marginTop: 10 }}>{unitSub}</div>
          </div>
        </div>
        {/* Ledger */}
        <div style={{ marginTop: 34, borderTop: `1.5px solid ${theme.colors.hairline}` }}>
          {items.map((it, i) => {
            const at = itemHits[i];
            const p = useHit(at, "snappy");
            const active = frame >= at && (i === items.length - 1 ? frame < recapAt : frame < itemHits[i + 1]);
            const check = interpolate(frame, [at, at + 10], [0, 1], { easing: theme.ease.out, ...clamp });
            return (
              <div key={i} style={{
                height: rowH, display: "flex", alignItems: "center", gap: 22, borderBottom: `1.5px solid ${theme.colors.hairline}`,
                opacity: interpolate(p, [0, 1], [0.18, 1]),
                transform: `translateX(${interpolate(p, [0, 1], [-18, 0])}px) scale(${usePunch(at, 0.035)})`, transformOrigin: "0% 50%",
              }}>
                <Check size={38} progress={check} />
                <div style={{ fontFamily: theme.fonts.body, fontSize: items.length > 4 ? 31 : 34, fontWeight: active ? 680 : 520, color: active ? theme.colors.ivory : theme.colors.ivoryDim, letterSpacing: "-0.005em" }}>
                  {it.title}
                </div>
                {active ? <div style={{ marginLeft: "auto", width: 10, height: 10, borderRadius: 5, background: theme.colors.brass, boxShadow: `0 0 20px ${theme.colors.brass}` }} /> : null}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {/* Feature visuals, one per line item */}
      {items.map((it, i) => {
        const at = itemHits[i];
        const to = i === items.length - 1 ? recapAt : itemHits[i + 1];
        const { visible, style } = usePanel(at, to);
        if (!visible) return null;
        return (
          <div key={i} style={{ position: "absolute", left: theme.layout.gutter, right: theme.layout.gutter, top: it.visualTop ?? (items.length > 4 ? 1070 : 1000), display: "flex", justifyContent: "center", ...style }}>
            {it.visual(at)}
          </div>
        );
      })}
      {/* Recap card */}
      {frame >= recapAt - 1 ? (
        <div style={{ position: "absolute", left: theme.layout.gutter, right: theme.layout.gutter, top: items.length > 4 ? 1070 : 1000, opacity: recapP, transform: `translateY(${interpolate(recapP, [0, 1], [60, 0])}px) scale(${interpolate(recapP, [0, 1], [0.92, 1])})` }}>
          <div style={{ borderRadius: 32, padding: "40px 44px", background: `linear-gradient(135deg, rgba(201,154,75,0.22), rgba(34,39,44,0.92))`, border: `1.5px solid ${theme.colors.brass}`, boxShadow: `0 0 80px rgba(201,154,75,0.18), 0 50px 100px -30px rgba(0,0,0,0.8)` }}>
            {recap}
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
