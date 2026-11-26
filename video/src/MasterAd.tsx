import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cues } from "./audio/cues";
import { BgMesh, Grade, Grain, Grid, Vignette } from "./components/layers";
import { Wordmark } from "./components/brand";
import { Hook } from "./scenes/Hook";
import { Stat } from "./scenes/Stat";
import { WhatWeDo } from "./scenes/WhatWeDo";
import { Setup } from "./scenes/Setup";
import { Monthly } from "./scenes/Monthly";
import { PriceMath } from "./scenes/PriceMath";
import { Control } from "./scenes/Control";
import { CTA } from "./scenes/CTA";
import { clamp, theme } from "./theme";

export const END_HOLD = 45; // frames the end card holds after the last beat
export const MASTER_FRAMES = cues.totalFrames + END_HOLD;

const SCENES: Record<string, React.FC> = {
  "01-hook": Hook,
  "02-stat": Stat,
  "03-what-we-do": WhatWeDo,
  "04-setup-499": Setup,
  "05-monthly-350": Monthly,
  "06-price-math": PriceMath,
  "07-owner-control": Control,
  "08-cta": CTA,
};

// Corporate chrome: wordmark + segmented progress + section counter.
const Chrome: React.FC = () => {
  const frame = useCurrentFrame();
  const secs = cues.sections.slice(0, -1); // hidden on the ivory end card
  const ctaStart = cues.sections[cues.sections.length - 1].startFrame;
  const o = interpolate(frame, [0, 10, ctaStart - 8, ctaStart], [0, 1, 1, 0], clamp);
  const idx = Math.max(0, secs.findIndex((s) => frame >= s.startFrame && frame < s.startFrame + s.durationInFrames));
  return (
    <div style={{ position: "absolute", left: theme.layout.gutter, right: theme.layout.gutter, top: 236, opacity: o }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Wordmark size={34} />
        <div style={{ fontFamily: theme.fonts.body, fontSize: 22, fontWeight: 600, letterSpacing: "0.18em", color: theme.colors.ivoryDim, fontVariantNumeric: "tabular-nums" }}>
          {String(idx + 1).padStart(2, "0")} / {String(secs.length).padStart(2, "0")}
        </div>
      </div>
      <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
        {secs.map((s) => {
          const p = interpolate(frame, [s.startFrame, s.startFrame + s.durationInFrames], [0, 1], clamp);
          return (
            <div key={s.id} style={{ flex: s.durationInFrames, height: 4, borderRadius: 2, background: theme.colors.ivoryFaint, overflow: "hidden" }}>
              <div style={{ width: `${p * 100}%`, height: "100%", background: theme.colors.brass }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const EndCardSoftener: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const ctaStart = cues.sections[cues.sections.length - 1].startFrame;
  const o = interpolate(frame, [ctaStart, ctaStart + 12], [1, 0.25], clamp);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const MasterAd: React.FC<{ withMusic?: boolean }> = ({ withMusic = true }) => (
  <AbsoluteFill style={{ background: theme.colors.bg }}>
    {/* 1. background */}
    <BgMesh />
    <Grid opacity={0.045} />
    {/* 2–3. assets + graphics, one Sequence per section */}
    {cues.sections.map((s, i) => {
      const Scene = SCENES[s.id];
      const last = i === cues.sections.length - 1;
      return (
        <Sequence key={s.id} from={s.startFrame} durationInFrames={s.durationInFrames + (last ? END_HOLD : 0)} name={s.id}>
          <Scene />
        </Sequence>
      );
    })}
    <Chrome />
    {/* 4–5. grade, grain, vignette */}
    <EndCardSoftener>
      <Grade />
      <Vignette />
    </EndCardSoftener>
    <Grain />
    {/* Audio: one lo-fi track per section, sample-aligned on the 90 BPM grid. */}
    {withMusic
      ? cues.sections.map((s) => (
          <Sequence key={`a-${s.id}`} from={s.startFrame} durationInFrames={s.audioFrames} name={`music ${s.id}`}>
            <Audio src={staticFile(s.file)} volume={0.92} />
          </Sequence>
        ))
      : null}
  </AbsoluteFill>
);
