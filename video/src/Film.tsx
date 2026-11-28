import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { LOOP_PATH } from "../../src/lib/loop/geometry.generated";
import { INK, Notecard, Placed, loopThreadPath, STROKE } from "./illustration";
import { Key, NIB, Notebook, ProofSheets } from "./objects";
import { theme } from "./theme";

/**
 * The brand film, Phase 8 re-cut (brief §8.3.3). 16 s, 30 fps, 1280 x 720, seamless loop:
 * the last frame flows into frame 0, and frame 0 is the poster.
 *
 *  0-4 s   Window-light plate (vector: soft light panes on a warm paper-shade pool, the left
 *          half fading into exact ivory, no vignette) with one letterpress notecard, right of
 *          centre.
 *  4-10 s  The card steps aside and the three chapters arrive as objects (voice interview:
 *          notebook and pen; dry run: proof sheets in a brass clip; go live: the notecard and a
 *          brass key). Then one brass LoopThread draws from the pen's nib, closes into LOOP_PATH
 *          and runs on to the key.
 *  10-16 s A charcoal lockup card lifts in over the scene (translateY 100% -> 0, 0.7 s, ease
 *          0.16,1,0.3,1) while the cards underneath dim to 0.6: a brass-line stroke drawing of
 *          LOOP_PATH draws on, cropped off the right edge (as on the OG cards), with the
 *          "ReplyLoop" wordmark and "Based in Salt Lake County, Utah.". Under cover the scene
 *          resets to its frame-0 state; the lockup lifts away and reveals it.
 *
 * Words on screen, in order: "ReplyLoop", "Based in Salt Lake County, Utah." Nothing else. The
 * HTML caption (src/components/film/FilmFeature.tsx) carries exactly these, in this order.
 *
 * Flat vector throughout: no grain, no vignette, no raster plate (the film budget is
 * 450,000 B per file).
 */

const c = theme.colors;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** The scene's drawing space: one unit = one screen px when the film plays 800px wide. */
const VB = { w: 800, h: 450 } as const;

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

/* Layout (VB units) ------------------------------------------------------------------------- */

/**
 * The notecard: alone at frame 0, right of centre (centre at 58% of the width), then the go-live
 * chapter's card. Its left edge sits at about 32% of the width (rotation included), so the open
 * space beside it stays under the brief's 35%.
 */
const CARD_OPEN = { x: 258, y: 92, width: 404, height: 262, rotate: -3 } as const;
const CARD_CHAPTER = { x: 568, y: 136, width: 180, height: 117, rotate: -3 } as const;

/** Chapter objects: vignette drawings placed at a uniform scale. */
const NOTEBOOK = { x: -6, y: 102, scale: 0.56 } as const;
const PROOFS = { x: 274, y: 88, scale: 0.62 } as const;
const KEY = { x: 659, y: 369, rot: -10 } as const;

/**
 * The thread: from the pen's nib (upper left), through one LOOP_PATH (uniform scale, the site's
 * small tilt), to the key's bow (lower right). It enters the crossing on the falling strand, so
 * neither lead crosses a lobe: the loop reads as the mark, not a tangle.
 */
const THREAD = loopThreadPath({
  from: [NOTEBOOK.x + NIB[0] * NOTEBOOK.scale, NOTEBOOK.y + NIB[1] * NOTEBOOK.scale],
  to: [KEY.x - 9, KEY.y - 9],
  loopAt: [285, 305],
  loopScale: 0.56,
  rotation: -12,
  strand: "falling",
});

/* Film --------------------------------------------------------------------------------------- */

export const Film = () => {
  useBrandFonts();
  const frame = useCurrentFrame();
  const t = useT();

  // The lockup: lifts in, holds, lifts away. Under cover the scene resets to frame 0.
  const liftIn = interpolate(frame, [t(10), t(10.7)], [1, 0], { ...clamp, easing: theme.ease.out });
  const liftOut = interpolate(frame, [t(14.8), t(15.6)], [0, -1], { ...clamp, easing: theme.ease.inOut });
  const lockupY = frame < t(14.8) ? liftIn : liftOut;
  const lockupOn = frame >= t(10) && frame < t(15.6);
  const covered = frame >= t(10.7);

  // Cards underneath dim to 0.6 as the lockup arrives (never lower) and brighten as it leaves.
  const dim = covered
    ? interpolate(frame, [t(14.8), t(15.6)], [0.6, 1], { ...clamp, easing: theme.ease.inOut })
    : interpolate(frame, [t(10), t(10.7)], [1, 0.6], { ...clamp, easing: theme.ease.out });

  return (
    <AbsoluteFill style={{ background: INK.ivory }}>
      <svg viewBox={`0 0 ${VB.w} ${VB.h}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <WindowLight />
        <g opacity={dim}>{covered ? <Opening /> : <Scene />}</g>
      </svg>
      {lockupOn ? <Lockup y={lockupY} /> : null}
    </AbsoluteFill>
  );
};

/* Plate -------------------------------------------------------------------------------------- */

/**
 * Window light on paper (stands in for ASSET_BRIEF #2, which does not exist): a warm
 * paper-shade pool graded in from the right, with four window panes of paper light falling
 * across it, soft-edged. The left 30% is exact ivory (#F8F5EF), so the poster's top-left pixel
 * is the page colour. The light drifts on a 16 s period, so the loop stays seamless.
 */
const PANES = [
  [0, 0],
  [124, 0],
  [0, 148],
  [124, 148],
] as const;

const WindowLight = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const a = (frame / durationInFrames) * Math.PI * 2;
  const drift = Math.sin(a) * 9;
  return (
    <g>
      <defs>
        <linearGradient id="pool" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0.36" stopColor={INK.paperShade} stopOpacity="0" />
          <stop offset="0.78" stopColor={INK.paperShade} stopOpacity="0.9" />
          <stop offset="1" stopColor={INK.paperShade} stopOpacity="1" />
        </linearGradient>
        <linearGradient id="paneFade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0.3" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="paneMask" maskUnits="userSpaceOnUse" x="0" y="0" width={VB.w} height={VB.h}>
          <rect width={VB.w} height={VB.h} fill="url(#paneFade)" />
        </mask>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <rect width={VB.w} height={VB.h} fill={INK.ivory} />
      <rect width={VB.w} height={VB.h} fill="url(#pool)" />
      <g mask="url(#paneMask)">
        <g filter="url(#soft)" fill={INK.paper} transform={`translate(${drift} 0) matrix(1 .14 .58 1 244 22)`}>
          {PANES.map(([x, y]) => (
            <rect key={`${x} ${y}`} x={x} y={y} width="112" height="136" rx="3" opacity="0.95" />
          ))}
        </g>
      </g>
    </g>
  );
};

/* Scene: opening card -> chapters -> thread -------------------------------------------------- */

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/** Frame-0 state: the notecard alone. */
const Opening = () => <Notecard {...CARD_OPEN} />;

const Scene = () => {
  const frame = useCurrentFrame();
  const t = useT();

  const move = interpolate(frame, [t(4), t(5)], [0, 1], { ...clamp, easing: theme.ease.inOut });
  const card = {
    x: lerp(CARD_OPEN.x, CARD_CHAPTER.x, move),
    y: lerp(CARD_OPEN.y, CARD_CHAPTER.y, move),
    width: lerp(CARD_OPEN.width, CARD_CHAPTER.width, move),
    height: lerp(CARD_OPEN.height, CARD_CHAPTER.height, move),
    rotate: CARD_OPEN.rotate,
  };

  // Chapters arrive in order (a short lift, no bounce), then the thread draws: plate -> objects -> thread.
  const arrive = (s: number) => interpolate(frame, [t(s), t(s + 0.7)], [0, 1], { ...clamp, easing: theme.ease.out });
  const nb = arrive(4.3);
  const pr = arrive(4.6);
  const ky = arrive(4.9);
  const draw = interpolate(frame, [t(5.5), t(9)], [1, 0], { ...clamp, easing: theme.ease.draw });

  return (
    <g>
      <Notecard {...card} />
      {nb > 0 ? (
        <g opacity={nb} transform={`translate(0 ${(1 - nb) * 14})`}>
          <Placed {...NOTEBOOK}>
            <Notebook unit={1 / NOTEBOOK.scale} />
          </Placed>
        </g>
      ) : null}
      {pr > 0 ? (
        <g opacity={pr} transform={`translate(0 ${(1 - pr) * 14})`}>
          <Placed {...PROOFS}>
            <ProofSheets unit={1 / PROOFS.scale} />
          </Placed>
        </g>
      ) : null}
      {ky > 0 ? (
        <g opacity={ky} transform={`translate(${KEY.x} ${KEY.y + (1 - ky) * 14})`}>
          <Key rot={KEY.rot} unit={1} />
        </g>
      ) : null}
      {draw < 1 ? (
        <path
          d={THREAD}
          fill="none"
          stroke={INK.brass}
          strokeWidth={STROKE.thread}
          strokeLinecap="butt"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={draw}
        />
      ) : null}
    </g>
  );
};

/* Lockup ------------------------------------------------------------------------------------- */

/** The lockup's loop: crossing near the right edge, the right lobe running off the frame. */
const LOCKUP_LOOP = { at: [1132, 360] as const, k: 3.5, line: 3.6 };

/**
 * Charcoal lockup card (flat: no felt raster, no noise, for the byte budget). Brass-line is a
 * decorative line only, never text. Ivory wordmark in Fraunces, mist sentence in Inter.
 * `y` is the card's offset as a fraction of the frame height (1 = below, 0 = in place, -1 = above).
 */
const Lockup = ({ y }: { y: number }) => {
  const frame = useCurrentFrame();
  const t = useT();
  const line = interpolate(frame, [t(10.5), t(12.3)], [1, 0], { ...clamp, easing: theme.ease.draw });
  const word = interpolate(frame, [t(10.9), t(11.6)], [0, 1], { ...clamp, easing: theme.ease.out });
  const place = interpolate(frame, [t(11.3), t(12)], [0, 1], { ...clamp, easing: theme.ease.out });
  return (
    <AbsoluteFill
      style={{
        background: c.charcoal,
        transform: `translateY(${y * 100}%)`,
        // The lifted card's edge reads against the paper below it.
        boxShadow: `0 0 36px rgba(27,31,35,${(0.18 * Math.min(1, (1 - Math.abs(y)) * 4)).toFixed(3)})`,
      }}
    >
      <svg viewBox="0 0 1280 720" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        {/* Not drawn at all before the draw starts: Chrome paints a speck at a full dash offset. */}
        {line < 0.999 ? (
          <path
            d={LOOP_PATH}
            transform={`translate(${LOCKUP_LOOP.at[0]} ${LOCKUP_LOOP.at[1]}) scale(${LOCKUP_LOOP.k})`}
            fill="none"
            stroke={INK.brassLine}
            strokeWidth={LOCKUP_LOOP.line / LOCKUP_LOOP.k}
            strokeLinecap="butt"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={line}
          />
        ) : null}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 136,
          top: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontWeight: 500,
            fontSize: 112,
            letterSpacing: "-0.02em",
            lineHeight: 1.04,
            color: c.ivory,
            opacity: word,
            transform: `translateY(${(1 - word) * 16}px)`,
          }}
        >
          ReplyLoop
        </div>
        <div
          style={{
            marginTop: 22,
            fontFamily: theme.fonts.body,
            fontWeight: 500,
            fontSize: 32,
            lineHeight: 1.3,
            color: c.mist,
            opacity: place,
            transform: `translateY(${(1 - place) * 12}px)`,
          }}
        >
          Based in Salt Lake County, Utah.
        </div>
      </div>
    </AbsoluteFill>
  );
};
