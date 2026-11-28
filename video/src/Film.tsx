import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { LOOP_CROSSING_PATH, LOOP_PATH, LOOP_STROKE, LOOP_VIEWBOX } from "../../src/lib/loop/geometry.generated";
import { theme } from "./theme";

const c = theme.colors;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Seconds -> frames, always from fps (never magic numbers). */
const useT = () => {
  const { fps } = useVideoConfig();
  return (s: number) => Math.round(s * fps);
};

/** Load the brand fonts (same files the site's OG cards use) before the first frame renders. */
function useBrandFonts() {
  const [handle] = useState(() => delayRender("brand fonts"));
  useEffect(() => {
    const faces = [
      new FontFace(theme.fonts.display, `url(${staticFile("fonts/fraunces-latin-500-normal.woff")})`, { weight: "500" }),
      new FontFace(theme.fonts.body, `url(${staticFile("fonts/inter-latin-500-normal.woff")})`, { weight: "500" }),
    ];
    Promise.all(faces.map((f) => f.load()))
      .then((loaded) => loaded.forEach((f) => document.fonts.add(f)))
      .then(() => continueRender(handle))
      // A missing font must fail the render, never fall back silently.
      .catch((err) => cancelRender(err));
  }, [handle]);
}

export const Film = () => {
  useBrandFonts();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = useT();

  // Shot opacities. Exits are quicker than entrances.
  const plateIn = interpolate(frame, [0, 1], [1, 1], clamp);
  const plateOut = interpolate(frame, [t(3.4), t(4.1)], [1, 0], { ...clamp, easing: theme.ease.in });
  // Closing: the plate is back underneath (frame-0 framing) as the charcoal card slides away.
  const plateBack = frame >= durationInFrames - t(2.4) ? 1 : 0;
  const plate = Math.max(plateIn * plateOut, plateBack);
  const cardsOn = interpolate(frame, [t(3.6), t(4.2)], [0, 1], { ...clamp, easing: theme.ease.out });
  const cardsOff = interpolate(frame, [t(8.1), t(8.6)], [1, 0], { ...clamp, easing: theme.ease.in });
  const dark = interpolate(frame, [t(8.0), t(8.9)], [0, 1], { ...clamp, easing: theme.ease.inOut });
  const lift = interpolate(frame, [durationInFrames - t(2.4), durationInFrames - t(1.5)], [0, -1], {
    ...clamp,
    easing: theme.ease.in,
  });
  const darkOff = lift > -1 ? 1 : 0;

  return (
    <AbsoluteFill style={{ background: c.ivory }}>
      {/* 1. Background: ivory paper with a slow warm mesh. */}
      <PaperMesh />
      {/* 2. Assets: the kit's 07 plate (opening and closing shot, identical frames for a seamless loop). */}
      <AbsoluteFill style={{ opacity: plate }}>
        <Plate />
      </AbsoluteFill>
      {/* 3. Graphics: the reply story, then the charcoal title card. */}
      <AbsoluteFill style={{ opacity: cardsOn * cardsOff }}>
        <ReplyStory />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: dark * darkOff, background: c.charcoal, transform: `translateY(${lift * 100}%)` }}>
        <TitleCard />
      </AbsoluteFill>
      {/* 4. Grade, then 5. grain + vignette. */}
      <Grade dark={dark * darkOff * (1 + lift)} />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};

/** Slow, periodic warm light on paper. Periodic in the film length so the loop is seamless. */
const PaperMesh = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const a = (frame / durationInFrames) * Math.PI * 2;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          borderRadius: "50%",
          left: -320 + Math.sin(a) * 40,
          top: -520 + Math.cos(a) * 30,
          filter: "blur(60px)",
          background: `radial-gradient(circle, ${c.warm}66, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          right: -300 - Math.cos(a) * 30,
          bottom: -480,
          filter: "blur(70px)",
          background: `radial-gradient(circle, ${c.ivoryDeep}cc, transparent 65%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * The 07 video-thumbnail plate with Ken Burns. The move runs during the
 * opening; the closing shot holds the frame-0 framing so the loop is seamless.
 * A warm light band crosses once, and a few motes drift.
 */
const Plate = () => {
  const frame = useCurrentFrame();
  const t = useT();
  const k = interpolate(frame, [0, t(4.2)], [0, 1], { ...clamp, easing: theme.ease.inOut });
  const opening = frame < t(6);
  const scale = opening ? 1 + 0.06 * k : 1;
  const pan = opening ? -18 * k : 0;
  const sweep = interpolate(frame, [t(0.4), t(3.6)], [-0.4, 1.3], { ...clamp, easing: theme.ease.inOut });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={staticFile("plates/07-video-thumbnail.png")}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale}) translateX(${pan}px)` }}
      />
      {opening ? (
        <AbsoluteFill
          style={{
            background: `linear-gradient(105deg, transparent ${sweep * 100 - 22}%, ${c.warm}55 ${sweep * 100}%, transparent ${sweep * 100 + 22}%)`,
            mixBlendMode: "soft-light",
          }}
        />
      ) : null}
      {opening ? <Motes /> : null}
    </AbsoluteFill>
  );
};

const Motes = () => {
  const frame = useCurrentFrame();
  const t = useT();
  const fade = interpolate(frame, [t(0.2), t(1), t(3), t(3.8)], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: fade * 0.7 }}>
      {Array.from({ length: 18 }).map((_, i) => {
        const x = 760 + ((i * 97) % 460);
        const y0 = 120 + ((i * 61) % 380);
        const y = y0 + (frame * (0.25 + (i % 5) * 0.06)) % 60;
        const r = 1 + (i % 3) * 0.7;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.sin((frame + i * 13) / 28) * 6,
              top: y,
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              background: i % 2 ? c.ivory : c.mist,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** A message card with plain lines (no words, no stars), lit and shadowed. */
const Card = ({ w, lines, tail, edge }: { w: number; lines: number[]; tail: "left" | "right"; edge?: boolean }) => {
  const h = 46 + lines.length * 26;
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 18,
          background: `linear-gradient(160deg, #FFFDF8, ${c.ivory} 45%, ${c.ivoryDeep})`,
          boxShadow: `0 30px 60px -24px rgba(27,31,35,0.35), 0 2px 0 rgba(255,255,255,0.8) inset`,
          border: edge ? `1.5px solid ${c.brass}` : "1px solid rgba(27,31,35,0.06)",
        }}
      />
      <svg
        width="34"
        height="28"
        viewBox="0 0 34 28"
        style={{ position: "absolute", bottom: -24, [tail]: 34, transform: tail === "left" ? "scaleX(-1)" : undefined }}
      >
        <path d="M0 0 L34 0 L8 26 Z" fill={c.ivoryDeep} />
      </svg>
      <div style={{ position: "absolute", left: 30, top: 28, display: "flex", flexDirection: "column", gap: 16 }}>
        {lines.map((len, i) => (
          <div key={i} style={{ width: len, height: 7, borderRadius: 4, background: c.charcoal, opacity: 0.62 }} />
        ))}
      </div>
    </div>
  );
};

/** Beat B: the thank-you card, then the reply, then the brass thread that joins them. */
const ReplyStory = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useT();
  const a = spring({ frame: frame - t(4.0), fps, config: theme.spring.smooth });
  const b = spring({ frame: frame - t(5.6), fps, config: theme.spring.smooth });
  const draw = interpolate(frame, [t(6.2), t(7.7)], [1, 0], { ...clamp, easing: theme.ease.draw });
  const breathe = Math.sin(frame / 24) * 2.5;
  // Camera push into the thread's loop before the cut to charcoal.
  const push = interpolate(frame, [t(7.6), t(8.6)], [1, 1.35], { ...clamp, easing: theme.ease.in });
  return (
    <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "640px 420px" }}>
      <div
        style={{
          position: "absolute",
          left: 190,
          top: 180,
          opacity: a,
          transform: `translateY(${interpolate(a, [0, 1], [40, 0]) + breathe}px) scale(${interpolate(a, [0, 1], [0.95, 1])})`,
        }}
      >
        <Card w={360} lines={[290, 230, 150]} tail="right" />
      </div>
      <div
        style={{
          position: "absolute",
          left: 760,
          top: 300,
          opacity: b,
          transform: `translateY(${interpolate(b, [0, 1], [34, 0]) - breathe}px) scale(${interpolate(b, [0, 1], [0.95, 1])})`,
        }}
      >
        <Card w={300} lines={[220, 140]} tail="left" edge />
      </div>
      <svg width="1280" height="720" style={{ position: "absolute", inset: 0 }}>
        <path
          d="M492 330 C520 430 600 470 650 440 C700 410 690 360 650 362 C610 364 606 420 660 448 C720 478 780 440 826 412"
          fill="none"
          stroke={c.brass}
          strokeWidth={3.2}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={draw}
        />
      </svg>
    </AbsoluteFill>
  );
};

/** Beat C: charcoal title card in the manner of the cover master. Brass is the line only, never text. */
const TitleCard = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useT();
  const line = interpolate(frame, [t(8.6), t(10.6)], [1, 0], { ...clamp, easing: theme.ease.draw });
  const mark = spring({ frame: frame - t(9.0), fps, config: theme.spring.gentle });
  const word = spring({ frame: frame - t(9.4), fps, config: theme.spring.gentle });
  const tagline = "Keep the thank you alive.".split(" ");
  const breathe = 1 + Math.sin(frame / 30) * 0.004;
  return (
    <AbsoluteFill>
      {/* The thin brass infinity line, cropped at the right edge (cover master). */}
      <svg viewBox={LOOP_VIEWBOX} style={{ position: "absolute", width: 820, right: -260, top: 196 }}>
        <path
          d={LOOP_PATH}
          fill="none"
          stroke={c.brassLine}
          strokeWidth={0.5}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={line}
        />
      </svg>
      <div style={{ position: "absolute", left: 150, top: 262, transform: `scale(${breathe})`, transformOrigin: "left center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: mark, transform: `translateY(${interpolate(mark, [0, 1], [24, 0])}px)` }}>
          <svg viewBox={LOOP_VIEWBOX} style={{ height: 46 }}>
            <path d={LOOP_PATH} fill="none" stroke={c.brass} strokeWidth={LOOP_STROKE} strokeLinejoin="round" />
            <path d={LOOP_CROSSING_PATH} fill="none" stroke={c.ivory} strokeWidth={LOOP_STROKE + 0.4} />
          </svg>
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontWeight: 500,
              fontSize: 96,
              letterSpacing: "-0.02em",
              lineHeight: 1.04,
              color: c.ivory,
              opacity: word,
              transform: `translateY(${interpolate(word, [0, 1], [18, 0])}px)`,
            }}
          >
            ReplyLoop
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 26 }}>
          {tagline.map((w, i) => {
            const p = spring({ frame: frame - t(10.2) - i * 4, fps, config: theme.spring.smooth });
            return (
              <span
                key={i}
                style={{
                  fontFamily: theme.fonts.body,
                  fontWeight: 500,
                  fontSize: 38,
                  color: c.mist,
                  opacity: p,
                  transform: `translateY(${interpolate(p, [0, 1], [16, 0])}px)`,
                  display: "inline-block",
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Warm soft-light grade; slightly stronger on the charcoal card. */
const Grade = ({ dark }: { dark: number }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: c.brass, mixBlendMode: "soft-light", opacity: 0.08 + dark * 0.08 }} />
    <AbsoluteFill
      style={{ background: "linear-gradient(180deg, rgba(27,31,35,0.05), transparent 30%, transparent 70%, rgba(27,31,35,0.1))" }}
    />
  </AbsoluteFill>
);

/** Procedural grain. Offset cycles every 4 frames, so frame 0 and the last+1 frame match. */
const Grain = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  const o = (frame % 4) * 55;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: noise,
        backgroundSize: "220px",
        backgroundPosition: `${o}px ${(o * 2) % 220}px`,
        opacity: 0.06,
        mixBlendMode: "multiply",
      }}
    />
  );
};

const Vignette = () => (
  <AbsoluteFill
    style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 58%, rgba(27,31,35,0.18) 100%)" }}
  />
);
