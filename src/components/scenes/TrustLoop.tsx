"use client";

import { useEffect, useRef, useState } from "react";
import { useInViewport } from "@/components/motion/useInViewport";
import { useMotion } from "@/components/motion/useMotion";
import { PauseControl } from "@/components/motion/PauseControl";
import { SoftShadow } from "@/components/scenes/illustration/parts";
import { INK, STROKE } from "@/lib/illustration/tokens";
import { LOOP_PATH_COMPACT } from "@/lib/loop/compact";
import { loadGsap, loadMotionPath } from "@/lib/motion/gsap";
import { cn } from "@/lib/cn";
import { setMotionPaused } from "@/lib/motion/state";

/* ---------------------------------------------------------------------------------------------
 * Geometry. The loop is LOOP_PATH_COMPACT (the mark's curve) at a uniform scale of 2: half-width
 * 200 units in a 440 x 184 viewBox, so 1 unit = 1 screen px at the 440px design width. Strokes
 * are non-scaling screen px at every width (§9.1 rule 3).
 *
 * The lap path starts at the top of the right lobe (the end of the compact path's 2nd cubic, an
 * exact quarter point by the path's mirror symmetry), so the four stations sit at lap fractions
 * 0 / .25 / .5 / .75 and no leg wraps past the path's start. Travel follows the mark's direction:
 * Ask (top-left) -> Review (bottom-left) -> through the crossing -> Reply (top-right) ->
 * Learn (bottom-right) -> through the crossing -> Ask.
 * ------------------------------------------------------------------------------------------- */

type Pt = readonly [number, number];

const K = 2;
const VB = { x: -220, y: -92, w: 440, h: 184 } as const;

const CUBICS: Pt[][] = (() => {
  const n = (LOOP_PATH_COMPACT.match(/-?\d*\.?\d+/g) ?? []).map((v) => Number(v) * K);
  const out: Pt[][] = [];
  let p: Pt = [n[0], n[1]];
  for (let i = 2; i + 5 < n.length; i += 6) {
    const c: Pt[] = [p, [n[i], n[i + 1]], [n[i + 2], n[i + 3]], [n[i + 4], n[i + 5]]];
    out.push(c);
    p = c[3];
  }
  return out;
})();

const num = (v: number) => {
  const x = Math.round(v * 10) / 10;
  return String(Object.is(x, -0) ? 0 : x);
};
const xy = (p: Pt) => `${num(p[0])} ${num(p[1])}`;

/** The whole loop as one closed path, starting at the top of the right lobe (Reply). */
const LAP = (() => {
  const order = [...CUBICS.slice(2), ...CUBICS.slice(0, 2)];
  const d = `M${xy(order[0][0])}` + order.map((c) => `C${xy(c[1])} ${xy(c[2])} ${xy(c[3])}`).join("") + "Z";
  return d.replace(/ -/g, "-");
})();

/** Direction chevrons just past the crossing on both strands (both travel upward there). */
const CHEVRONS = (() => {
  const t = 0.55;
  const ARM = 6;
  const SPREAD = (35 * Math.PI) / 180;
  return [CUBICS[0], CUBICS[8]]
    .map(([p0, c1, c2, p3]) => {
      const u = 1 - t;
      const at = (i: 0 | 1) => u * u * u * p0[i] + 3 * u * u * t * c1[i] + 3 * u * t * t * c2[i] + t * t * t * p3[i];
      const dt = (i: 0 | 1) =>
        3 * u * u * (c1[i] - p0[i]) + 6 * u * t * (c2[i] - c1[i]) + 3 * t * t * (p3[i] - c2[i]);
      const tip: Pt = [at(0), at(1)];
      const len = Math.hypot(dt(0), dt(1));
      const [dx, dy] = [dt(0) / len, dt(1) / len];
      const arm = (a: number): Pt => [
        tip[0] - ARM * (dx * Math.cos(a) - dy * Math.sin(a)),
        tip[1] - ARM * (dx * Math.sin(a) + dy * Math.cos(a)),
      ];
      return `M${xy(arm(SPREAD))}L${xy(tip)}L${xy(arm(-SPREAD))}`;
    })
    .join("")
    .replace(/ -/g, "-");
})();

type Station = {
  name: string;
  body: string;
  /** Lap fraction where the bead arrives (Reply arrives at 1, the lap's end). */
  at: number;
  point: Pt;
  side: "top" | "bottom";
};

/** In reading order 1-4. Copy unchanged. */
const STATIONS: Station[] = [
  { name: "Ask", body: "Every customer gets the same review link and the same ask.", at: 0.5, point: CUBICS[9][3], side: "top" },
  { name: "Review", body: "A customer writes on Google, in their own words.", at: 0.75, point: CUBICS[13][3], side: "bottom" },
  { name: "Reply", body: "We answer in your voice. A hard review waits until you have seen the reply.", at: 1, point: CUBICS[1][3], side: "top" },
  { name: "Learn", body: "What customers mention shapes your next posts and your monthly workbook.", at: 0.25, point: CUBICS[5][3], side: "bottom" },
];

/** Where the bead parks: station 04 (the finished state and the timeline's start). */
const PARK = STATIONS[3].point;

/**
 * Node centres sit outside the loop: radius 20 + an 8px gap from the line, in screen px.
 * Nodes are 40px HTML discs with a 1.25px brass ring (§9.1 rule 3 "rings": hair), drawn as an
 * inset box-shadow so it is not snapped to whole device pixels the way a border width is.
 */
const NODE_OFFSET = 28;

/** Motion (§8.5): travel 2.6 s, dwell 1.4 s per station; a 16 s lap. */
const TRAVEL = 2.6;
const STEP = 4;
const LIGHT = 0.36;
const ROW = 0.4;
/** The trail's peak length (lap fraction); the 30% halo is 4 points shorter, so the trail tapers. */
const TRAIL = 0.08;
const TAPER = 0.04;
/** First build starts just after the lap's opening dim, which matches the CSS before-state. */
const START = LIGHT;

/**
 * Before-state for the lit node layers, scoped exactly to where the timeline is built
 * (data-motion=full, GSAP not failed, the scene not marked static). Everywhere else the
 * finished state shows: every station lit, the bead parked at 04, no trail.
 */
const LIT_BEFORE = "[:root[data-motion=full]:not(.rl-gsap-failed)_[data-trust-loop]:not([data-static])_&]:opacity-0";

/**
 * The trust loop on /services/review-replies: Ask, Review, Reply, Learn.
 * The words are an HTML ordered list (one column, 1-4, separated by 1px rules); the diagram is
 * decorative (aria-hidden). With motion fully on and the diagram on screen, one repeating GSAP
 * timeline moves a brass bead along the loop with MotionPathPlugin: it travels 2.6 s (rl.inOut),
 * dwells 1.4 s at each station, the station's lit layer fades in on arrival (360ms rl.soft) and
 * its list row gets a 2px brass bar (400ms). Stations stay lit through the lap, so each lap ends
 * on the finished still, then dims as the bead leaves 04. Only opacity, transforms (the bead) and
 * stroke dashes (the trail) change: no r, fill or stroke tweens.
 * Off screen the timeline pauses where it is. Under Pause motion, reduced motion, static and a
 * GSAP failure the finished still shows; resuming picks up the lap where it stopped.
 * The lap is longer than 5 s, so the shared pause control shows whenever motion can run here.
 */
export function TrustLoop({ className }: { className?: string }) {
  const { mode, ambient, paused } = useMotion();
  const scene = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const base = useRef<SVGPathElement>(null);
  const trail = useRef<SVGPathElement>(null);
  const halo = useRef<SVGPathElement>(null);
  const bead = useRef<SVGGElement>(null);
  const lit = useRef<(HTMLSpanElement | null)[]>([]);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const timeline = useRef<{ play(): unknown; pause(): unknown } | null>(null);
  const saved = useRef<number | null>(null);
  const running = useRef(false);
  const onScreen = useInViewport(scene, "0px");
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const run = ambient && ready && onScreen;
  const controllable = mode === "full" || mode === "paused";

  // GSAP core loads on mount in every mode, as useGsapScene does: the root carries
  // data-gsap-scene, so the head script's 3 s failure timer runs on window load (and voids the
  // before-state if the bundles never arrive). MotionPathPlugin loads only once motion is full.
  useEffect(() => {
    loadGsap().catch(() => setFailed(true));
  }, []);

  useEffect(() => {
    if (!ambient || ready) return;
    let live = true;
    loadMotionPath().then(
      () => live && setReady(true),
      () => live && setFailed(true),
    );
    return () => {
      live = false;
    };
  }, [ambient, ready]);

  // Build the lap while motion is fully on; revert to the finished still otherwise.
  useEffect(() => {
    if (!ambient || !ready) return;
    const root = document.documentElement;
    const s = svg.current;
    const path = base.current;
    const b = bead.current;
    const tr = trail.current;
    const ha = halo.current;
    const lits = lit.current;
    const rows = bars.current;
    if (!s || !path || !b || !tr || !ha || root.classList.contains("rl-gsap-failed")) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    loadGsap().then(({ gsap }) => {
      if (cancelled || root.classList.contains("rl-gsap-failed")) return;
      const L = path.getTotalLength();
      // Non-scaling strokes dash in screen px, so dashes are sized from the drawing's scale.
      let scale = s.getBoundingClientRect().width / VB.w || 1;
      const ro = new ResizeObserver(([e]) => {
        if (e.contentRect.width) scale = e.contentRect.width / VB.w;
      });
      ro.observe(s);
      const dash = (el: SVGPathElement, from: number, to: number) => {
        const P = L * scale;
        const d = Math.max(0, to - from) * P;
        el.style.strokeDasharray = `${d} ${P - d}`;
        el.style.strokeDashoffset = String(-from * P);
      };

      let tl!: gsap.core.Timeline;
      const ctx = gsap.context(() => {
        tl = gsap.timeline({ repeat: -1, paused: true });
        const soft = { ease: "rl.soft", immediateRender: false } as const;
        // Lap opening: the lit stations dim and row 04 clears as the bead leaves 04.
        tl.fromTo(lits.filter(Boolean), { opacity: 1 }, { opacity: 0, duration: LIGHT, ...soft }, 0);
        tl.fromTo(rows[3], { opacity: 1 }, { opacity: 0, duration: ROW, ...soft }, 0);
        STATIONS.forEach((st, i) => {
          const from = STATIONS[(i + 3) % 4].at % 1;
          const to = st.at;
          const leg: gsap.core.Tween = gsap.to(b, {
            motionPath: { path, start: from, end: to, offsetX: -PARK[0], offsetY: -PARK[1] },
            duration: TRAVEL,
            ease: "rl.inOut",
            onUpdate: () => {
              // The trail grows with speed and settles into the bead on arrival.
              const r = leg.ratio;
              const p = from + (to - from) * r;
              const len = Math.min(TRAIL * 4 * r * (1 - r), p - from);
              dash(tr, p - len, p);
              dash(ha, p - Math.max(0, len - TAPER), p);
            },
          });
          const arrive = i * STEP + TRAVEL;
          tl.add(leg, i * STEP);
          tl.fromTo(lits[i], { opacity: 0 }, { opacity: 1, duration: LIGHT, ...soft }, arrive);
          tl.fromTo(rows[i], { opacity: 0 }, { opacity: 1, duration: ROW, ...soft }, arrive);
          if (i > 0) tl.fromTo(rows[i - 1], { opacity: 1 }, { opacity: 0, duration: ROW, ...soft }, arrive);
        });
        tl.set({}, {}, STATIONS.length * STEP);
        tl.time(saved.current ?? START);
      }, scene);

      timeline.current = tl;
      if (running.current) tl.play();
      cleanup = () => {
        saved.current = tl.time();
        timeline.current = null;
        ro.disconnect();
        ctx.revert();
        for (const el of [tr, ha]) {
          el.style.removeProperty("stroke-dasharray");
          el.style.removeProperty("stroke-dashoffset");
        }
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [ambient, ready]);

  // Play on screen; pause in place off screen.
  useEffect(() => {
    running.current = run;
    if (run) timeline.current?.play();
    else timeline.current?.pause();
  }, [run]);

  return (
    <div
      data-trust-loop=""
      data-gsap-scene=""
      data-static={failed ? "" : undefined}
      className={cn("grid items-center gap-y-12 lg:grid-cols-12 lg:gap-x-8", className)}
    >
      <div ref={scene} className="relative lg:col-span-6">
        <div aria-hidden className="mx-auto max-w-[560px] pt-12 pb-16">
          <div className="relative">
            <svg
              ref={svg}
              viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
              focusable="false"
              className="block h-auto w-full overflow-visible"
            >
              <path ref={base} d={LAP} fill="none" stroke={INK.rule} strokeWidth={STROKE.rule} vectorEffect="non-scaling-stroke" />
              <path
                d={CHEVRONS}
                fill="none"
                stroke={INK.brass}
                strokeWidth={STROKE.hair}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              <g fill="none" stroke={INK.brass} strokeLinecap="butt" strokeDasharray="0 99999">
                <path ref={halo} d={LAP} strokeWidth={4} strokeOpacity={0.3} vectorEffect="non-scaling-stroke" />
                <path ref={trail} d={LAP} strokeWidth={STROKE.thread} vectorEffect="non-scaling-stroke" />
              </g>
              <g transform={`translate(${xy(PARK)})`}>
                <g ref={bead}>
                  <SoftShadow kind="contact" x={-4.5} y={-4.5} width={9} height={9} radius={4.5} unit={1} />
                  <circle r={4.5} fill={INK.ivory} />
                  <circle r={3} fill={INK.brass} />
                </g>
              </g>
            </svg>
            {STATIONS.map((st, i) => {
              const x = ((st.point[0] - VB.x) / VB.w) * 100;
              const y = ((st.point[1] - VB.y) / VB.h) * 100;
              return (
                <span
                  key={st.name}
                  className="absolute grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ivory font-serif text-[15px] leading-none text-brass shadow-[inset_0_0_0_1.25px_var(--color-brass)]"
                  style={{
                    left: `${x.toFixed(2)}%`,
                    top: `calc(${y.toFixed(2)}% ${st.side === "top" ? "-" : "+"} ${NODE_OFFSET}px)`,
                  }}
                >
                  {i + 1}
                  <span
                    ref={(el) => {
                      lit.current[i] = el;
                    }}
                    className={cn(
                      "absolute inset-0 grid place-items-center rounded-full bg-brass text-ivory",
                      LIT_BEFORE,
                    )}
                  >
                    {i + 1}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
        {controllable ? (
          <PauseControl label="Pause motion" pressed={paused} onToggle={() => setMotionPaused(!paused)} tone="light" />
        ) : null}
      </div>
      <ol className="border-t border-rule lg:col-span-6">
        {STATIONS.map((st, i) => (
          <li key={st.name} className="relative border-b border-rule py-6 pl-6">
            <span
              ref={(el) => {
                bars.current[i] = el;
              }}
              aria-hidden
              className="absolute inset-y-0 left-0 w-0.5 bg-brass opacity-0"
            />
            <p className="flex items-baseline gap-3">
              <span aria-hidden className="font-serif text-lg text-brass">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-serif text-h3 font-medium">{st.name}</span>
            </p>
            <p className="mt-2 text-slate">{st.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
