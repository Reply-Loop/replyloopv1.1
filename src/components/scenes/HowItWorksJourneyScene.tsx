"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { Step } from "@/components/ui/StepList";
import { useGsapScene } from "@/components/motion/useGsapScene";
import { useMotion } from "@/components/motion/useMotion";
import { loadDrawSVG } from "@/lib/motion/gsap";
import { LOOP_PATH, LOOP_POINTS } from "@/lib/loop/geometry.generated";

/** Must match the CSS media query that turns on the sticky stage (src/styles/journey.css). */
export const JOURNEY_QUERY = "(min-width: 1024px) and (min-height: 40em)";

/** The stage SVGs' viewBox (both layers share it, with preserveAspectRatio slice). */
const VB_W = 320;
const VB_H = 200;
const VIEWBOX = `${-VB_W / 2} ${-VB_H / 2} ${VB_W} ${VB_H}`;

/** Camera zoom on the journey loop, and where along the loop (0..1) the trip runs. */
const ZOOM = 2.6;
const S_FROM = 0.03;
const S_TO = 0.97;
/**
 * Where the camera holds the bead, in viewBox units: in the gutter right of the
 * vignette (brief: about +20). Re-measured from the layout on every refresh, so the
 * bead sits mid-gutter at any stage size; this is only the fallback.
 */
const FOCUS_X = 14;

/**
 * Chapter timing, in timeline units (brief §8.3.5). Chapter i turns over at T(i):
 * the old text leaves over [T-.16, T], the new text arrives from T+.03, the old
 * vignette leaves from T-.1, the new layers build from T+.08 and the strokes draw
 * from T+.3. Everything has settled by T+.66, then a .35 stillness window holds
 * the text at opacity 1 and the camera still. Chapter 1 is built by the arrival
 * trigger, so its stillness starts at 0.
 */
const SETTLE = 0.66;
const STILL = 0.35;
const EXIT = 0.16;

/**
 * The loop sampler: the same arc-length interpolation as loopPoints() in
 * src/components/hero/loopCurve.ts (LOOP_POINTS, half-width 1, y up), without
 * three. Returns LOOP_PATH coordinates (half-width 100, y down). The camera and
 * the bead both read it, so they can never drift apart.
 */
function loopPoint(s: number): [number, number] {
  const n = LOOP_POINTS.length;
  const f = (((s % 1) + 1) % 1) * n;
  const i0 = Math.floor(f) % n;
  const i1 = (i0 + 1) % n;
  const t = f - Math.floor(f);
  const [x0, y0] = LOOP_POINTS[i0];
  const [x1, y1] = LOOP_POINTS[i1];
  return [(x0 + (x1 - x0) * t) * 100, -(y0 + (y1 - y0) * t) * 100];
}

/** The camera at p=0 with the fallback focus: server-rendered, so the loop paints already framed (no jump at build). */
const CAM_AT_START = (() => {
  const [x, y] = loopPoint(S_FROM);
  return `translate(${(FOCUS_X - x * ZOOM).toFixed(3)} ${(-y * ZOOM).toFixed(3)}) scale(${ZOOM})`;
})();

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "How it works" as a journey along the loop.
 *
 * Layout is pure CSS and final before first paint: on wide, tall-enough
 * screens with motion on (html[data-motion] is set by the head script), the
 * wrapper is tall and the stage is position: sticky. No JS pin, so no layout
 * shift, no pin spacer, and scroll restoration and #links stay correct.
 * GSAP only scrubs one timeline: the chapter text sequence (opacity and y on the
 * children of .journey-text; every li stays at opacity 1, so every step stays in
 * the accessibility tree and find-in-page), the vignette layers, the camera and
 * bead along the loop, and the progress track. A second, small trigger builds
 * chapter 1's art as the stage arrives, before the pin.
 *
 * Phones, short screens, large text, reduced motion, no JS, or a failed GSAP
 * load: the same markup, stacked.
 */
/**
 * The client half of the journey: the stage, the scrub and the bead. The vignettes are
 * server-rendered by HowItWorksJourney and passed in, so their SVG stays out of the JS.
 */
export function HowItWorksJourneyScene({ steps, vignettes }: { steps: Step[]; vignettes: ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scroll } = useMotion();
  // The vignette threads use non-scaling strokes, whose pathLength-normalised dashes Chrome
  // measures in screen px; DrawSVG measures the real on-screen length instead. If the
  // plugin cannot load, the scene still builds and the strokes simply show drawn.
  const [draw, setDraw] = useState<"pending" | "ok" | "none">("pending");
  useEffect(() => {
    if (!scroll || draw !== "pending") return;
    let live = true;
    loadDrawSVG().then(
      () => live && setDraw("ok"),
      () => live && setDraw("none"),
    );
    return () => {
      live = false;
    };
  }, [scroll, draw]);

  useGsapScene(
    ref,
    ({ gsap }) => {
      const root = ref.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(JOURNEY_QUERY, () => {
        const stage = root.querySelector<HTMLElement>("[data-journey-stage]");
        // CSS decides the mode; if the stage is not sticky, build nothing and let the finished state show.
        if (!stage || getComputedStyle(stage).position !== "sticky") {
          root.setAttribute("data-animated", "");
          return () => root.removeAttribute("data-animated");
        }
        const items = gsap.utils.toArray<HTMLElement>("[data-step]", root);
        const loop = root.querySelector<SVGSVGElement>("[data-journey-loop]");
        const beadLayer = root.querySelector<SVGSVGElement>("[data-journey-bead-layer]");
        const camGroup = root.querySelector<SVGGElement>("[data-journey-cam]");
        const bead = root.querySelector<SVGGElement>("[data-journey-bead]");
        const pulse = root.querySelector<SVGGElement>("[data-journey-pulse]");
        const tracks = gsap.utils.toArray<HTMLElement>("[data-journey-track]", root);
        if (!loop || !beadLayer || !camGroup || !bead || !pulse || !items.length) return;
        const n = items.length;
        const restAt = (i: number) => (n > 1 ? i / (n - 1) : 0);

        // Bead in the gutter between the vignette and text columns, in viewBox units.
        let focusX = FOCUS_X;
        const measure = () => {
          const box = loop.getBoundingClientRect();
          const cs = getComputedStyle(items[0]);
          const col = parseFloat(cs.gridTemplateColumns);
          const gap = parseFloat(cs.columnGap) || 0;
          const scale = Math.max(box.width / VB_W, box.height / VB_H);
          if (!scale || !Number.isFinite(col)) return;
          const gutter = items[0].getBoundingClientRect().left + col + gap / 2;
          focusX = (gutter - (box.left + box.width / 2)) / scale;
        };

        // The camera, the bead and the progress fill all follow cam.p, which only the timeline moves.
        const cam = { p: 0 };
        const moveCamera = (p: number) => {
          const [x, y] = loopPoint(S_FROM + (S_TO - S_FROM) * p);
          const tx = focusX - x * ZOOM;
          const ty = -y * ZOOM;
          camGroup.setAttribute("transform", `translate(${tx.toFixed(3)} ${ty.toFixed(3)}) scale(${ZOOM})`);
          // The same point through the same camera: it lands on the focus, above the vignette layer.
          bead.setAttribute("transform", `translate(${(tx + x * ZOOM).toFixed(3)} ${(ty + y * ZOOM).toFixed(3)})`);
          const fill = String((1 + p * (n - 1)) / n);
          tracks.forEach((t) => t.style.setProperty("--journey-progress", fill));
        };
        measure();
        moveCamera(0);

        const textLayers = items.flatMap((item) => [
          ...item.querySelectorAll<HTMLElement>(".journey-text, .journey-text > *, .journey-vignette"),
        ]);
        const headerOffset = () => `top ${getComputedStyle(stage).top}`;

        const addDraws = (tl: gsap.core.Timeline, item: HTMLElement, at: number) => {
          if (draw !== "ok") return;
          const paths = item.querySelectorAll<SVGGeometryElement>("[data-v-draw]");
          if (paths.length) tl.fromTo(paths, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.35, ease: "rl.draw" }, at);
        };
        const addLayers = (tl: gsap.core.Timeline, item: HTMLElement, at: number) => {
          tl.fromTo(
            item.querySelectorAll("[data-v-layer]"),
            { opacity: 0, y: 14, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, duration: 0.3, stagger: 0.07, ease: "rl.out" },
            at,
          );
        };
        // One pulse of the bead on each arrival: 1 -> 1.33 -> 1 over .12 units.
        const addPulse = (tl: gsap.core.Timeline, at: number) => {
          tl.to(pulse, { scale: 1.33, transformOrigin: "50% 50%", duration: 0.04, ease: "rl.out" }, at);
          tl.to(pulse, { scale: 1, transformOrigin: "50% 50%", duration: 0.08, ease: "rl.out" }, at + 0.04);
        };

        // Arrival: chapter 1's art builds while the stage scrolls in, so it is complete at p=0.
        const arrival = gsap.timeline({
          // lazy: false renders every from-state when the tween is created, in the same frame as
          // data-animated is set; GSAP otherwise defers it to its next tick (a one-frame flash).
          defaults: { ease: "none", lazy: false },
          scrollTrigger: { trigger: root, start: "top 75%", end: headerOffset, scrub: 0.8 },
        });
        addLayers(arrival, items[0], 0);
        addDraws(arrival, items[0], 0.2);
        addPulse(arrival, arrival.duration());

        const tl = gsap.timeline({
          // lazy: false renders every from-state when the tween is created, in the same frame as
          // data-animated is set; GSAP otherwise defers it to its next tick (a one-frame flash).
          defaults: { ease: "none", lazy: false },
          scrollTrigger: {
            trigger: root,
            start: headerOffset,
            end: "bottom bottom",
            scrub: 1,
            onRefresh: () => {
              measure();
              moveCamera(cam.p);
            },
            onToggle: (self) => {
              const value = self.isActive ? "transform, opacity" : "";
              textLayers.forEach((el) => (el.style.willChange = value));
            },
          },
        });

        // Chapter i settles at still[i] and holds for STILL.
        const still: number[] = [0];
        items.forEach((item, i) => {
          if (i === 0) return;
          const at = still[i - 1] + STILL + EXIT;
          const prev = items[i - 1];
          const prevText = prev.querySelector(".journey-text");
          const prevVignette = prev.querySelector(".journey-vignette");
          if (prevText) tl.to(prevText, { opacity: 0, y: -14, duration: 0.16, ease: "rl.in" }, at - 0.16);
          if (prevVignette) tl.to(prevVignette, { opacity: 0, scale: 0.985, duration: 0.22, ease: "rl.inOut" }, at - 0.1);
          tl.fromTo(
            item.querySelectorAll(".journey-text > *"),
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.3, ease: "rl.out", stagger: 0.05 },
            at + 0.03,
          );
          addLayers(tl, item, at + 0.08);
          addDraws(tl, item, at + 0.3);
          still.push(at + SETTLE);
          addPulse(tl, at + SETTLE);
        });
        const lastStillEnd = still[n - 1] + STILL;
        // The loop clears out over the last 10% of the scrub, after the last stillness window.
        const tail = lastStillEnd / 9;
        tl.to([loop, beadLayer], { opacity: 0, duration: tail, ease: "rl.inOut" }, lastStillEnd);

        // Camera: one tween across the whole timeline, resting in each stillness window
        // and easing between chapters (rl.inOut). Never driven by ScrollTrigger directly.
        const keyframes: gsap.TweenVars[] = [{ p: 0, duration: still[0] + STILL }];
        for (let i = 1; i < n; i++) {
          keyframes.push({ p: restAt(i), duration: still[i] - (still[i - 1] + STILL), ease: "rl.inOut" });
          keyframes.push({ p: restAt(i), duration: i === n - 1 ? STILL + tail : STILL });
        }
        tl.to(cam, { keyframes, ease: "none", onUpdate: () => moveCamera(cam.p) }, 0);

        root.setAttribute("data-animated", "");
        return () => {
          root.removeAttribute("data-animated");
          textLayers.forEach((el) => (el.style.willChange = ""));
          tracks.forEach((t) => t.style.removeProperty("--journey-progress"));
        };
      });
      return () => mm.revert();
    },
    { enabled: scroll && draw !== "pending", key: draw },
  );

  const total = pad(steps.length);

  return (
    <div ref={ref} data-gsap-scene className="journey relative mt-12">
      <div data-journey-stage className="journey-stage">
        {/* The camera's loop: only shown in the sticky stage. */}
        <svg
          data-journey-loop
          aria-hidden
          focusable="false"
          viewBox={VIEWBOX}
          className="journey-loop"
          preserveAspectRatio="xMidYMid slice"
        >
          <g data-journey-cam transform={CAM_AT_START}>
            <path d={LOOP_PATH} fill="none" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" />
          </g>
        </svg>
        <ol className="journey-steps">
          {steps.map((step, i) => {
            return (
              <li key={step.title} data-step={i} className="journey-step" style={{ "--step": i } as CSSProperties}>
                <div className="journey-vignette">
                  {vignettes[i]}
                </div>
                <div className="journey-text">
                  <div className="journey-head">
                    <div aria-hidden className="journey-progress">
                      <span className="journey-progress-label">
                        {pad(i + 1)} / {total}
                      </span>
                      <span data-journey-track className="journey-track" />
                    </div>
                    <span aria-hidden className="journey-numeral font-serif font-normal text-brass">
                      {pad(i + 1)}
                    </span>
                  </div>
                  <h3 className="journey-title font-serif font-medium">
                    <span className="sr-only">Step {i + 1}: </span>
                    {step.title}
                  </h3>
                  <p className="journey-body text-slate">{step.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
        {/* The bead rides above the vignettes, at the camera's focus. */}
        <svg
          data-journey-bead-layer
          aria-hidden
          focusable="false"
          viewBox={VIEWBOX}
          className="journey-bead-layer"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="journey-bead-glow">
              <stop offset="0" stopColor="#C49A5A" stopOpacity="0.45" />
              <stop offset="0.45" stopColor="#C49A5A" stopOpacity="0.16" />
              <stop offset="1" stopColor="#C49A5A" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g data-journey-bead transform={`translate(${FOCUS_X} 0)`}>
            <circle r={5} fill="url(#journey-bead-glow)" />
            <g data-journey-pulse>
              <circle
                r={2.6}
                className="journey-bead"
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
