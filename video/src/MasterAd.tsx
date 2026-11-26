import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CueSet, cues, cues15 } from "./audio/cues";
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
import { Cut15Price, Cut15What } from "./scenes/Cut15";
import { clamp, theme } from "./theme";

export const END_HOLD = 45; // frames the master end card holds after the last beat
export const MASTER_FRAMES = cues.totalFrames + END_HOLD;
export const REELS15_HOLD = 10;
export const REELS15_FRAMES = cues15.totalFrames + REELS15_HOLD; // 450 = 15.0s

const MASTER_SCENES: Record<string, React.FC> = {
  "01-hook": () => <Hook sectionId="01-hook" />,
  "02-stat": Stat,
  "03-what-we-do": WhatWeDo,
  "04-setup-499": Setup,
  "05-monthly-350": Monthly,
  "06-price-math": PriceMath,
  "07-owner-control": Control,
  "08-cta": () => <CTA sectionId="08-cta" />,
};

const REELS15_SCENES: Record<string, React.FC> = {
  "c15-01-hook": () => <Hook sectionId="c15-01-hook" />,
  "c15-02-what": Cut15What,
  "c15-03-price": Cut15Price,
  "c15-04-cta": () => <CTA sectionId="c15-04-cta" />,
};

// Corporate chrome: wordmark + segmented progress + section counter.
const Chrome: React.FC<{ set: CueSet }> = ({ set }) => {
  const frame = useCurrentFrame();
  const secs = set.sections.slice(0, -1); // hidden on the ivory end card
  const ctaStart = set.sections[set.sections.length - 1].startFrame;
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

const EndCardSoftener: React.FC<{ set: CueSet; children: React.ReactNode }> = ({ set, children }) => {
  const frame = useCurrentFrame();
  const ctaStart = set.sections[set.sections.length - 1].startFrame;
  const o = interpolate(frame, [ctaStart, ctaStart + 12], [1, 0.25], clamp);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

// One timeline for any edit: scenes and per-section music both come from the cue set.
// Music versions on disk (public/music/<version>/), all on the same beat grid and
// accent cues: "v2-clean" (default), "alt-a-warm", "alt-b-bright", "alt-c-dusty",
// and "v1-original" (first delivery, kept for reference).
export const MUSIC_VERSIONS = ["v2-clean", "alt-a-warm", "alt-b-bright", "alt-c-dusty", "v1-original"] as const;
export type MusicVersion = (typeof MUSIC_VERSIONS)[number];
type AdProps = { withMusic?: boolean; musicVersion?: MusicVersion };

const AdTimeline: React.FC<{ set: CueSet; scenes: Record<string, React.FC>; hold: number; withMusic: boolean; musicVersion: MusicVersion }> = ({
  set, scenes, hold, withMusic, musicVersion,
}) => (
  <AbsoluteFill style={{ background: theme.colors.bg }}>
    {/* 1. background */}
    <BgMesh />
    <Grid opacity={0.045} />
    {/* 2–3. assets + graphics, one Sequence per section */}
    {set.sections.map((s, i) => {
      const Scene = scenes[s.id];
      const last = i === set.sections.length - 1;
      return (
        <Sequence key={s.id} from={s.startFrame} durationInFrames={s.durationInFrames + (last ? hold : 0)} name={s.id}>
          <Scene />
        </Sequence>
      );
    })}
    <Chrome set={set} />
    {/* 4–5. grade, grain, vignette */}
    <EndCardSoftener set={set}>
      <Grade />
      <Vignette />
    </EndCardSoftener>
    <Grain />
    {/* Audio: one lo-fi track per section, sample-aligned on the 90 BPM grid. */}
    {withMusic
      ? set.sections.map((s) => (
          <Sequence key={`a-${s.id}`} from={s.startFrame} durationInFrames={s.audioFrames} name={`music ${s.id}`}>
            <Audio src={staticFile(`music/${musicVersion}/section-${s.id}.wav`)} volume={musicVersion === "v1-original" ? 0.92 : 1} />
          </Sequence>
        ))
      : null}
  </AbsoluteFill>
);

export const MasterAd: React.FC<AdProps> = ({ withMusic = true, musicVersion = "v2-clean" }) => (
  <AdTimeline set={cues} scenes={MASTER_SCENES} hold={END_HOLD} withMusic={withMusic} musicVersion={musicVersion} />
);

export const Reels15: React.FC<AdProps> = ({ withMusic = true, musicVersion = "v2-clean" }) => (
  <AdTimeline set={cues15} scenes={REELS15_SCENES} hold={REELS15_HOLD} withMusic={withMusic} musicVersion={musicVersion} />
);
