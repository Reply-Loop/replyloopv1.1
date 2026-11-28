import type { ReactNode } from "react";
import { InView } from "@/components/motion/InView";
import { LoopThread } from "@/components/scenes/LoopThread";
import { Notecard, SoftShadow, Writing } from "@/components/scenes/illustration/parts";
import { Icon, type IconName } from "@/components/ui/Icon";
import { INK, RADIUS, STROKE } from "@/lib/illustration/tokens";
import { LOOP_PATH_COMPACT } from "@/lib/loop/compact";
import { LOOP_VIEWBOX } from "@/lib/loop/geometry.generated";

/**
 * Page-hero art (desktop), brief §9.3 and §8.5. Decorative; server-rendered; aria-hidden via
 * <InView>. Follows the illustration rules in src/lib/illustration/tokens.ts.
 *
 * - Service variants: the loop as a 1px rule-colour backdrop with the brass comet, and a
 *   bespoke 64px object in an ivory medallion (--shadow-object) on the loop's right lobe.
 * - "about": one object, two notecards joined by a <LoopThread> (no backdrop loop).
 * - "loop": the backdrop loop and comet only, 240px wide (FAQ, contact).
 *
 * The comet (.loop-comet, CSS only, keyframes in globals.css) fakes a taper with three stacked
 * dashes on the same path, all linear on one 18s cycle: 9/91 at 100%, 14/86 at 35% offset +3,
 * 20/80 at 12% offset +6. The offsets ride on animation-delay (the keyframes set an absolute
 * dashoffset), so the dashes move as one. Gating is the existing .loop-comet rules: running only
 * with motion fully on and on screen, frozen in place when paused, parked when reduced. The
 * inline dashoffsets are the parked state wherever no animation applies; motion-reduce:animate-none
 * keeps that parked state under the OS setting even before the head script runs. No filters.
 * The comet's width is set per breakpoint in viewBox units (see COMET_WIDTH), not non-scaling.
 */

export type EmblemVariant = "replies" | "social" | "seo" | "websites" | "videos" | "about" | "loop";

/** The service pages pass page.icon; each service icon maps to its object. */
const ICON_VARIANT: Partial<Record<IconName, EmblemVariant>> = {
  reply: "replies",
  social: "social",
  pin: "seo",
  browser: "websites",
  video: "videos",
  loop: "loop",
};

type Props = {
  /** Legacy selector (page.icon): mapped to a variant; an unmapped icon keeps the old icon medallion. */
  icon?: IconName;
  /** Explicit variant; wins over `icon` and `pair`. */
  variant?: EmblemVariant;
  /** Legacy (/about): the two-notecard object. */
  pair?: boolean;
};

const BOX =
  "reveal-art pointer-events-none absolute top-1/2 right-[max(2rem,calc((100%-72rem)/2+2rem))] hidden -translate-y-1/2 lg:block";
const MEDALLION =
  "absolute top-1/2 left-[73.5%] flex size-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border border-rule bg-ivory shadow-object xl:size-28";

const nss = "non-scaling-stroke" as const;
const hair = { strokeWidth: STROKE.hair, vectorEffect: nss };
const edge = { stroke: INK.rule, ...hair };

/* -------------------------------------------------------------------------------------------- */
/* Backdrop loop and comet                                                                       */

/** One comet cycle in seconds and the parked spot (pathLength 100), as in globals.css. */
const PERIOD = 18;
const PARK = 60;
/** Drawn back to front: the faint wide-tail dashes first, the lead dash on top. */
const COMET = [
  { dash: "20 80", lag: 6, opacity: 0.12 },
  { dash: "14 86", lag: 3, opacity: 0.35 },
  { dash: "9 91", lag: 0, opacity: 1 },
] as const;

/**
 * The comet's 2px (STROKE.thread) width in viewBox units, per rendered width of the 221.61-unit
 * LOOP_VIEWBOX: 384px (lg, 24rem) 1.154, 448px (xl, 28rem) 0.989, 240px ("loop") 1.847.
 * The comet cannot use non-scaling-stroke: Chrome then applies pathLength to the user-space
 * length but dashes in screen space, so "9 91" repeats about twice around the loop.
 */
const COMET_WIDTH = {
  wide: "[stroke-width:1.154px] xl:[stroke-width:0.989px]",
  quiet: "[stroke-width:1.847px]",
} as const;

function LoopBackdrop({ size }: { size: keyof typeof COMET_WIDTH }) {
  return (
    <svg viewBox={LOOP_VIEWBOX} className="block h-auto w-full overflow-visible" focusable="false">
      <path d={LOOP_PATH_COMPACT} fill="none" stroke={INK.rule} strokeWidth={STROKE.rule} vectorEffect={nss} />
      <g fill="none" stroke={INK.brass} className={COMET_WIDTH[size]}>
        {COMET.map((c) => {
          const at = PARK - c.lag;
          return (
            <path
              key={c.dash}
              d={LOOP_PATH_COMPACT}
              pathLength={100}
              className="loop-comet motion-reduce:animate-none"
              strokeOpacity={c.opacity < 1 ? c.opacity : undefined}
              strokeLinecap={c.lag ? undefined : "round"}
              style={{
                strokeDasharray: c.dash,
                strokeDashoffset: -at,
                animationDelay: `${Math.round(-at * PERIOD) / 100}s`,
              }}
            />
          );
        })}
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------------------------- */
/* 64px objects (viewBox 0 0 64 64 at 64px, so unit = 1). Light from 315 deg. <= 12 shapes each, */
/* <= 1 highlight, flat fills, shadows pre-baked (<SoftShadow>), no dark outlines.               */

function ObjectSvg({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 64 64" className="block size-16 overflow-visible" focusable="false">
      {children}
    </svg>
  );
}

/** Review replies: a notecard with a blind-debossed loop. Shapes: card, deboss 2, writing 4 = 7. */
function RepliesObject() {
  return (
    <ObjectSvg>
      <Notecard x={7} y={13} width={50} height={38} unit={1} deboss rotate={-4} />
    </ObjectSvg>
  );
}

/**
 * Social content: three fanned proof cards (2px radius) about a pivot below their centre.
 * `reach`: pivot to the unrotated card centre (the pivot sits 2 units above the bottom edge).
 */
const PROOF = { w: 30, h: 38, pivot: [33, 50] as const, reach: 17, fan: [-18, -4, 11] as const };
const proofs = PROOF.fan.map((deg) => {
  const a = (deg * Math.PI) / 180;
  const d = PROOF.reach;
  const cx = Math.round((PROOF.pivot[0] + d * Math.sin(a)) * 10) / 10;
  const cy = Math.round((PROOF.pivot[1] - d * Math.cos(a)) * 10) / 10;
  return { deg, cx, cy, x: Math.round((cx - PROOF.w / 2) * 10) / 10, y: Math.round((cy - PROOF.h / 2) * 10) / 10 };
});

/** Shapes: 3 sheets + writing 4 = 7. */
function SocialObject() {
  const mid = proofs[1];
  const front = proofs[2];
  const box = { width: PROOF.w, height: PROOF.h, radius: RADIUS.proof, unit: 1 };
  return (
    <ObjectSvg>
      <SoftShadow kind="ambient" x={mid.x} y={mid.y} rotate={mid.deg} {...box} />
      {proofs.map((p, i) => (
        <g key={p.deg}>
          <SoftShadow kind="contact" x={p.x} y={p.y} rotate={p.deg} {...box} />
          <rect
            x={p.x}
            y={p.y}
            width={PROOF.w}
            height={PROOF.h}
            rx={RADIUS.proof}
            transform={`rotate(${p.deg} ${p.cx} ${p.cy})`}
            fill={i === 2 ? INK.paper : INK.ivory}
            {...edge}
          />
        </g>
      ))}
      <g transform={`rotate(${front.deg} ${front.cx} ${front.cy})`}>
        <Writing x={front.x + 5} y={front.y + 11} width={20} unit={1} gap={6.5} />
      </g>
    </ObjectSvg>
  );
}

/**
 * Local SEO: a tri-fold paper map (the panel facing away from the light in paper-shade) with two
 * hairline roads and a flat brass pin (shaded right half, paper hole, one highlight).
 * Shapes: panels 3, roads 1, pin 3, highlight 1 = 8.
 */
function SeoObject() {
  return (
    <ObjectSvg>
      <SoftShadow kind="ambient" x={8} y={17} width={48} height={37} radius={0} unit={1} />
      <SoftShadow kind="contact" x={8} y={17} width={48} height={37} radius={0} unit={1} />
      <g strokeLinejoin="round" {...edge}>
        <path d="M8 17l16 4v33l-16-4z" fill={INK.paper} />
        <path d="M24 21l16-4v33l-16 4z" fill={INK.paperShade} />
        <path d="M40 17l16 4v33l-16-4z" fill={INK.paper} />
      </g>
      <path
        d="M8 41c6-1 11 2 16 2.5S34 38 40 37s12 3 16 2.5M15 18.8c1 11-2 21 1 33"
        fill="none"
        stroke={INK.slate}
        strokeOpacity={0.28}
        {...hair}
      />
      <SoftShadow kind="contact" x={43} y={36.5} width={9} height={3} radius={1.5} unit={1} />
      <path d="M44 38c-2.4-3.4-6.5-7.2-6.5-12a6.5 6.5 0 0 1 13 0c0 4.8-4.1 8.6-6.5 12z" fill={INK.brass} />
      <path d="M44 38c2.4-3.4 6.5-7.2 6.5-12a6.5 6.5 0 0 0-6.5-6.5z" fill={INK.brassShadow} />
      <circle cx={44} cy={26} r={2.4} fill={INK.paper} />
      <path d="M39.6 24.4a4.6 4.6 0 0 1 2.9-3.3" fill="none" stroke={INK.brassLight} strokeLinecap="round" {...hair} />
    </ObjectSvg>
  );
}

/**
 * Websites: an open ivory door. Paper frame, paper-shade doorway, the leaf swung out on its
 * right hinge (taller at its near, free edge), a brass knob and a brass threshold with its
 * shaded lip and one highlight. Shapes: frame, doorway, leaf, panel, knob, threshold, lip,
 * highlight = 8.
 */
function WebsitesObject() {
  return (
    <ObjectSvg>
      <SoftShadow kind="ambient" x={16} y={8} width={35} height={46} radius={1} unit={1} />
      <SoftShadow kind="contact" x={16} y={8} width={28} height={42} radius={1} unit={1} />
      <rect x={16} y={8} width={28} height={42} rx={1} fill={INK.paper} {...edge} />
      <rect x={20} y={12} width={20} height={38} fill={INK.paperShade} {...edge} />
      <SoftShadow kind="contact" x={40} y={9} width={11} height={44} radius={0} unit={1} />
      <path d="M40 12l11-4v46l-11-4z" fill={INK.ivory} strokeLinejoin="round" {...edge} />
      <path d="M42.5 15.6l6-2.1v14l-6 1.3z" fill="none" strokeLinejoin="round" {...edge} />
      <circle cx={48.8} cy={33} r={1.3} fill={INK.brass} />
      <rect x={17} y={50} width={26} height={3.5} rx={0.75} fill={INK.brass} />
      <rect x={17} y={52} width={26} height={1.5} rx={0.75} fill={INK.brassShadow} />
      <path d="M18.5 50.8h23" stroke={INK.brassLight} {...hair} />
    </ObjectSvg>
  );
}

/**
 * Owner Q&A videos: a brass-trimmed notecard on a small brass easel (no devices, no people).
 * Shapes: back leg, front legs, card, trim, writing 4, ledge, lip, highlight = 11.
 */
function VideosObject() {
  const card = { x: 11, y: 17, width: 42, height: 30 };
  const rc = RADIUS.notecard;
  return (
    <ObjectSvg>
      <path d="M31.4 46h1.8l3.4 13h-1.8z" fill={INK.brassShadow} />
      <path d="M31.2 5h1.6L18.6 59h-2.4zM31.2 5h1.6l15 54h-2.4z" fill={INK.brass} />
      <SoftShadow kind="ambient" {...card} radius={rc} unit={1} />
      <SoftShadow kind="contact" {...card} radius={rc} unit={1} />
      <rect {...card} rx={rc} fill={INK.paper} {...edge} />
      <rect x={14} y={20} width={36} height={24} rx={rc - 3} fill="none" stroke={INK.brass} {...hair} />
      <Writing x={18} y={27.5} width={26} unit={1} gap={6} />
      <SoftShadow kind="contact" x={9} y={46.5} width={46} height={3} radius={0.75} unit={1} />
      <rect x={9} y={46.5} width={46} height={3} rx={0.75} fill={INK.brass} />
      <rect x={9} y={48.5} width={46} height={1.5} rx={0.75} fill={INK.brassShadow} />
      <path d="M10.5 47.3h43" stroke={INK.brassLight} {...hair} />
    </ObjectSvg>
  );
}

const OBJECTS: Record<"replies" | "social" | "seo" | "websites" | "videos", () => ReactNode> = {
  replies: RepliesObject,
  social: SocialObject,
  seo: SeoObject,
  websites: WebsitesObject,
  videos: VideosObject,
};

/* -------------------------------------------------------------------------------------------- */
/* About: two notecards joined by one LoopThread. Design size 416px wide (unit 448/416).        */

const ABOUT_UNIT = 1.08;

function AboutObject() {
  return (
    <svg viewBox="0 0 448 216" className="block h-auto w-full overflow-visible" focusable="false">
      <Notecard x={24} y={96} width={144} height={100} unit={ABOUT_UNIT} rotate={-5} />
      <Notecard x={280} y={20} width={144} height={100} unit={ABOUT_UNIT} rotate={4} />
      <LoopThread from={[148, 172]} to={[302, 104]} loopAt={[225, 136]} loopScale={0.4} rotation={-8} stroke={INK.brass} />
    </svg>
  );
}

/* -------------------------------------------------------------------------------------------- */

export function ServiceEmblem({ icon, variant, pair = false }: Props) {
  const v: EmblemVariant | undefined = variant ?? (pair ? "about" : icon ? ICON_VARIANT[icon] : "loop");

  if (v === "about") {
    return (
      <InView className={`${BOX} w-[24rem] xl:w-[28rem]`}>
        <AboutObject />
      </InView>
    );
  }
  if (v === "loop") {
    return (
      <InView className={`${BOX} w-60`}>
        <LoopBackdrop size="quiet" />
      </InView>
    );
  }

  const Obj = v ? OBJECTS[v] : undefined;
  return (
    <InView className={`${BOX} w-[24rem] xl:w-[28rem]`}>
      <LoopBackdrop size="wide" />
      <span className={MEDALLION}>
        {Obj ? <Obj /> : icon ? <Icon name={icon} className="size-9 text-brass xl:size-10" /> : null}
      </span>
    </InView>
  );
}
