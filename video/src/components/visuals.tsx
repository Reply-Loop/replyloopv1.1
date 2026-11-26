import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { clamp, theme } from "../theme";
import { Check, ReviewCard, Stars } from "./ui";
import { Mark } from "./brand";

// Shown/hidden window for a panel that lives between two accent frames.
export const usePanel = (from: number, to: number | null) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [from, from + 14], [0, 1], { easing: theme.ease.out, ...clamp });
  const outP = to === null ? 0 : interpolate(frame, [to - 8, to], [0, 1], { easing: theme.ease.in, ...clamp });
  return {
    visible: frame >= from - 1 && (to === null || frame < to),
    style: {
      opacity: inP * (1 - outP),
      transform: `translateY(${interpolate(inP, [0, 1], [60, 0]) - outP * 40}px) scale(${interpolate(inP, [0, 1], [0.94, 1])})`,
    } as React.CSSProperties,
  };
};

const Panel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; light?: boolean }> = ({ children, style, light }) => (
  <div
    style={{
      borderRadius: 32, padding: 36,
      background: light ? "rgba(248,245,239,0.97)" : "rgba(34,39,44,0.88)",
      border: `1.5px solid ${light ? "transparent" : theme.colors.ivoryFaint}`,
      boxShadow: "0 50px 100px -30px rgba(0,0,0,0.75)", backdropFilter: "blur(10px)",
      fontFamily: theme.fonts.body, color: light ? theme.colors.ink : theme.colors.ivory, ...style,
    }}
  >
    {children}
  </div>
);

// Presence audit: each channel gets scanned and checked (no scores invented).
export const AuditVisual: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const rows = ["Google Business Profile", "Google reviews", "Facebook page", "Instagram", "Website"];
  return (
    <Panel style={{ width: 912 }}>
      <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.16em", color: theme.colors.brass, textTransform: "uppercase" }}>Online presence audit</div>
      <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 16 }}>
        {rows.map((r, i) => {
          const s = at + 6 + i * 5;
          const scan = interpolate(frame, [s, s + 10], [0, 1], { easing: theme.ease.out, ...clamp });
          return (
            <div key={r} style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <Check size={36} progress={scan} />
              <div style={{ fontSize: 30, fontWeight: 550, flex: 1, opacity: 0.4 + 0.6 * scan }}>{r}</div>
              <div style={{ width: 180, height: 8, borderRadius: 4, background: theme.colors.ivoryFaint, overflow: "hidden" }}>
                <div style={{ width: `${scan * 100}%`, height: "100%", background: theme.colors.brass }} />
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

// Historical replies: a stack of past reviews getting answered.
export const BacklogVisual: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const r = (k: number) => interpolate(frame, [at + 4 + k * 10, at + 30 + k * 10], [0, 1], clamp);
  return (
    <div style={{ position: "relative", width: 912, height: 470 }}>
      <div style={{ position: "absolute", top: 0, left: 40, transform: "scale(0.9) rotate(2deg)", opacity: 0.55 }}>
        <ReviewCard width={860} name="Priya K." text="Friendly team and fair pricing." replied={r(2)} reply="Thank you, Priya!" />
      </div>
      <div style={{ position: "absolute", top: 70, left: 0 }}>
        <ReviewCard width={912} name="Dana M." text="They fit us in the same week and did great work." replied={r(0)}
          reply="Thanks, Dana! We're glad the timing worked out for you." />
      </div>
    </div>
  );
};

// Pseudo-QR (deterministic pattern with finder squares). Decorative only.
const QR: React.FC<{ size: number; color: string }> = ({ size, color }) => {
  const n = 25; const c = size / n; const cells: React.ReactNode[] = [];
  let s = 7;
  const r = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const finder = (x: number, y: number) => x < 7 && y < 7 || x >= n - 7 && y < 7 || x < 7 && y >= n - 7;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    if (finder(x, y)) continue;
    if (r() > 0.52) cells.push(<rect key={`${x}-${y}`} x={x * c} y={y * c} width={c} height={c} fill={color} />);
  }
  const F = (x: number, y: number) => (
    <g key={`f${x}${y}`}>
      <rect x={x * c} y={y * c} width={7 * c} height={7 * c} fill={color} />
      <rect x={(x + 1) * c} y={(y + 1) * c} width={5 * c} height={5 * c} fill="#F8F5EF" />
      <rect x={(x + 2) * c} y={(y + 2) * c} width={3 * c} height={3 * c} fill={color} />
    </g>
  );
  return <svg width={size} height={size}>{cells}{F(0, 0)}{F(n - 7, 0)}{F(0, n - 7)}</svg>;
};

// Review QR stand + NFC tap card, with a phone tapping it.
export const QrNfcVisual: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const tap = interpolate(frame, [at + 12, at + 26], [0, 1], { easing: theme.ease.out, ...clamp });
  const ripple = (frame - (at + 26)) / 24;
  return (
    <div style={{ position: "relative", width: 912, height: 470, display: "flex", gap: 34, alignItems: "flex-start" }}>
      <Panel light style={{ width: 400, height: 440, display: "flex", flexDirection: "column", alignItems: "center", padding: 30 }}>
        <div style={{ fontFamily: theme.fonts.display, fontSize: 34, fontWeight: 600 }}>How did we do?</div>
        <div style={{ fontSize: 20, color: "#7A766E", marginTop: 6 }}>Scan to leave a Google review</div>
        <div style={{ marginTop: 22 }}><QR size={250} color="#1B1F23" /></div>
      </Panel>
      <div style={{ position: "relative" }}>
        <div style={{ width: 470, height: 290, borderRadius: 26, background: `linear-gradient(135deg, #23272C, #14171A)`, border: `1.5px solid ${theme.colors.brass}`, boxShadow: "0 40px 80px -25px rgba(0,0,0,0.8)", padding: 30, position: "relative", transform: "rotate(-4deg)" }}>
          <Mark height={56} />
          <div style={{ fontFamily: theme.fonts.display, fontSize: 38, color: theme.colors.ivory, marginTop: 26 }}>Tap to review</div>
          <div style={{ fontFamily: theme.fonts.body, fontSize: 20, color: theme.colors.ivoryDim, marginTop: 8 }}>NFC tap card + QR</div>
          {ripple > 0 && ripple < 2 ? [0, 0.5].map((o) => {
            const rp = (ripple + o) % 1;
            return <div key={o} style={{ position: "absolute", right: 60 - rp * 60, top: 80 - rp * 60, width: 80 + rp * 120, height: 80 + rp * 120, borderRadius: "50%", border: `3px solid ${theme.colors.brass}`, opacity: 1 - rp }} />;
          }) : null}
        </div>
        {/* phone */}
        <div style={{ position: "absolute", left: 250, top: interpolate(tap, [0, 1], [380, 120]), width: 190, height: 360, borderRadius: 34, background: "#0E1013", border: "5px solid #3A3F45", boxShadow: "0 30px 60px -20px rgba(0,0,0,0.9)", transform: `rotate(${interpolate(tap, [0, 1], [14, 6])}deg)`, overflow: "hidden" }}>
          <div style={{ margin: 14, height: 300, borderRadius: 22, background: theme.colors.ivory, padding: 16, fontFamily: theme.fonts.body }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#3A3D41" }}>Rate your visit</div>
            <div style={{ marginTop: 10 }}><Stars size={26} color="#C08A2E" /></div>
            <div style={{ marginTop: 14, height: 10, width: "90%", background: "#DDD6CA", borderRadius: 5 }} />
            <div style={{ marginTop: 8, height: 10, width: "70%", background: "#DDD6CA", borderRadius: 5 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Platform tiles (GBP / Facebook / Instagram), drawn in theme colours.
export const PlatformTiles: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const items: Array<{ label: string; glyph: React.ReactNode }> = [
    { label: "Google Business Profile", glyph: "G" },
    { label: "Facebook", glyph: "f" },
    { label: "Instagram", glyph: <svg key="ig" width="54" height="54" viewBox="0 0 54 54"><rect x="5" y="5" width="44" height="44" rx="13" fill="none" stroke="#C99A4B" strokeWidth="4.5"/><circle cx="27" cy="27" r="10" fill="none" stroke="#C99A4B" strokeWidth="4.5"/><circle cx="40" cy="14" r="3" fill="#C99A4B"/></svg> },
  ];
  return (
    <div style={{ display: "flex", gap: 24 }}>
      {items.map((it, i) => {
        const p = interpolate(frame, [at + i * 4, at + i * 4 + 14], [0, 1], { easing: theme.ease.out, ...clamp });
        return (
          <div key={it.label} style={{ width: 288, height: 230, borderRadius: 28, background: "rgba(34,39,44,0.9)", border: `1.5px solid ${theme.colors.ivoryFaint}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, opacity: p, transform: `translateY(${(1 - p) * 50}px)` }}>
            <div style={{ width: 92, height: 92, borderRadius: 24, border: `3px solid ${theme.colors.brass}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 56, color: theme.colors.brass }}>
              {it.glyph}
            </div>
            <div style={{ fontFamily: theme.fonts.body, fontSize: 24, fontWeight: 600, color: theme.colors.ivory, textAlign: "center", padding: "0 16px", lineHeight: 1.2 }}>{it.label}</div>
          </div>
        );
      })}
    </div>
  );
};

// Workbook: an open report document, pages riffling.
export const WorkbookVisual: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const sections = ["What we published", "What people asked", "Review themes", "Next month’s plan"];
  return (
    <Panel light style={{ width: 760 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: theme.fonts.display, fontSize: 40, fontWeight: 600 }}>Organic growth workbook</div>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.12em", color: theme.colors.brassDeep }}>MONTHLY</div>
      </div>
      <div style={{ height: 3, width: 120, background: theme.colors.brassDeep, marginTop: 16 }} />
      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 18 }}>
        {sections.map((s, i) => {
          const p = interpolate(frame, [at + 6 + i * 5, at + 16 + i * 5], [0, 1], { easing: theme.ease.out, ...clamp });
          return (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 18, opacity: p, transform: `translateX(${(1 - p) * 30}px)` }}>
              <div style={{ fontVariantNumeric: "tabular-nums", fontSize: 22, color: theme.colors.brassDeep, fontWeight: 700 }}>0{i + 1}</div>
              <div style={{ fontSize: 30, fontWeight: 560, flex: 1 }}>{s}</div>
              <div style={{ width: 160, height: 10, borderRadius: 5, background: "#E4DDD0" }} />
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

// Revision rounds: draft -> round 1 -> round 2 -> approved.
export const RevisionVisual: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const steps = ["Draft", "Revision 1", "Revision 2", "Approved"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, width: 912 }}>
      {steps.map((s, i) => {
        const p = interpolate(frame, [at + i * 7, at + i * 7 + 12], [0, 1], { easing: theme.ease.out, ...clamp });
        const last = i === steps.length - 1;
        return (
          <React.Fragment key={s}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: 0.25 + 0.75 * p }}>
              <div style={{ width: 92, height: 92, borderRadius: 46, background: last ? theme.colors.brass : "transparent", border: `3px solid ${theme.colors.brass}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.8 + 0.2 * p})` }}>
                {last ? <Check size={56} progress={p} color={theme.colors.ink} /> : <span style={{ fontFamily: theme.fonts.display, fontSize: 40, color: theme.colors.brass, fontWeight: 600 }}>{i === 0 ? "0" : i}</span>}
              </div>
              <div style={{ fontFamily: theme.fonts.body, fontSize: 24, fontWeight: 600, color: theme.colors.ivory }}>{s}</div>
            </div>
            {!last ? <div style={{ flex: 1, height: 3, background: theme.colors.ivoryFaint, margin: "0 10px 40px", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, width: `${interpolate(frame, [at + i * 7 + 4, at + i * 7 + 12], [0, 100], clamp)}%`, background: theme.colors.brass }} />
            </div> : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Publish or hand-off: a split choice, both lead to the same price tag.
export const PublishVisual: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 16], [0, 1], { easing: theme.ease.out, ...clamp });
  const q = interpolate(frame, [at + 10, at + 26], [0, 1], { easing: theme.ease.out, ...clamp });
  const Opt: React.FC<{ title: string; sub: string; prog: number }> = ({ title, sub, prog }) => (
    <Panel style={{ width: 430, opacity: prog, transform: `translateY(${(1 - prog) * 40}px)` }}>
      <div style={{ fontFamily: theme.fonts.display, fontSize: 40, fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: 24, color: theme.colors.ivoryDim, marginTop: 10, lineHeight: 1.35 }}>{sub}</div>
    </Panel>
  );
  return (
    <div style={{ width: 912 }}>
      <div style={{ display: "flex", gap: 52, alignItems: "stretch" }}>
        <Opt title="We publish it" sub="Scheduled to your Google, Facebook & Instagram." prog={p} />
        <Opt title="Or you do" sub="Get the finished files to post yourself." prog={q} />
      </div>
      <div style={{ marginTop: 28, textAlign: "center", fontFamily: theme.fonts.body, fontSize: 30, fontWeight: 650, letterSpacing: "0.14em", color: theme.colors.brass, opacity: q }}>SAME PRICE</div>
    </div>
  );
};
