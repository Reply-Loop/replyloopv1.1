"use client";

import { useEffect, useRef, useState } from "react";
import { useGsapScene } from "@/components/motion/useGsapScene";
import { useMotion } from "@/components/motion/useMotion";
import { loadDrawSVG } from "@/lib/motion/gsap";
import { LOOP_PATH } from "@/lib/loop/geometry.generated";

/**
 * Knot geometry (brief §8.1). LOOP_PATH is centred on its crossing with a half-width
 * of 100 units (the lobes' outer tips sit on y = 0). The knot is a 56 × 25 px <svg>
 * whose viewBox has the same aspect ratio, so the default xMidYMid meet fits it exactly
 * and the double loop is never distorted, at any width. The viewBox leaves room for the
 * 1.5px stroke, so nothing clips.
 */
const KNOT_W = 56;
const KNOT_H = 25;
const VIEW_HALF_W = 104;
const VIEW_HALF_H = (VIEW_HALF_W * KNOT_H) / KNOT_W;
const KNOT_VIEWBOX = `${-VIEW_HALF_W} ${-VIEW_HALF_H} ${VIEW_HALF_W * 2} ${VIEW_HALF_H * 2}`;
/** Distance in px from the knot's centre to a lobe's outer tip, where a segment meets it. */
const LOBE_TIP = (KNOT_W / 2) * (100 / VIEW_HALF_W);
/** Each segment runs from the band's edge to just inside a lobe tip (half a pixel of overlap, so no seam). */
const SEGMENT_WIDTH = `calc(50% - ${LOBE_TIP - 0.5}px)`;

/**
 * The loop divider's thread (brief §8.1): one undistorted instance of the mark's loop
 * (LOOP_PATH), centred on the grid, with a 1px line running out of each lobe to the
 * container's edges (the ends are masked in divider.css). It draws from the loop
 * outward as the visitor scrolls past, at every width on the full tier: the knot grows
 * both ways from its crossing, then each line runs outward from the knot. The visitor
 * drives it, so there is nothing to pause.
 *
 * The markup is the finished, fully drawn state. The CSS before-state (divider.css)
 * hides the strokes from first paint only where this timeline is built; everywhere
 * else (no JS, reduced motion, static, lite tier, GSAP failure) the thread is drawn.
 * data-animated: "true" while the timeline owns the strokes, "static" when it could
 * not be built (finished state), absent before it builds.
 */
export function Thread({ dark = false }: { dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scroll } = useMotion();
  const [drawReady, setDrawReady] = useState(false);

  // DrawSVG must be registered before the timeline is built.
  useEffect(() => {
    if (!scroll || drawReady) return;
    if (document.documentElement.getAttribute("data-tier") !== "full") return;
    let live = true;
    loadDrawSVG().then(
      () => {
        if (live) setDrawReady(true);
      },
      () => {
        // No plugin, no timeline: clear the before-state so the finished thread shows.
        if (live) ref.current?.setAttribute("data-animated", "static");
      },
    );
    return () => {
      live = false;
    };
  }, [scroll, drawReady]);

  useGsapScene(
    ref,
    ({ gsap }) => {
      const root = ref.current;
      const knot = root?.querySelector('[data-thread="knot"]');
      const segments = root?.querySelectorAll('[data-thread="segment"]');
      if (!root || !knot || !segments?.length) {
        root?.setAttribute("data-animated", "static");
        return;
      }

      let tl: ReturnType<typeof gsap.timeline> | undefined;
      tl = gsap.timeline({
        // lazy: false renders every from-state when the tween is created, in the same frame as
        // data-animated is set; GSAP otherwise defers it to its next tick (a one-frame flash).
        defaults: { ease: "none", lazy: false },
        scrollTrigger: {
          trigger: root,
          start: "top 92%",
          // The divider sits before the closing sequence, near the foot of the page. Clamp the
          // end to the page's maximum scroll so a tall viewport can always finish the draw.
          end: "clamp(top 40%)",
          scrub: 0.8,
          // The segments stretch with the container, and DrawSVG measures their on-screen
          // length when it renders. A resize can change that length while the scrub is
          // idle (for example fully drawn), so re-render in place after every refresh.
          onRefresh: () => {
            tl?.render(tl.totalTime(), true, true);
          },
        },
      });
      // Normalised time, master ease "none", scrub .8 (small art, §7.6). The knot grows
      // both ways from its crossing (50% of LOOP_PATH) and closes there; its lobe tips are
      // reached about halfway, and from there the two lines run outward to the edges.
      tl.fromTo(knot, { drawSVG: "50% 50%" }, { drawSVG: "0% 100%", duration: 0.5, ease: "rl.draw" }, 0).fromTo(
        segments,
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 0.75, ease: "rl.draw" },
        0.25,
      );

      // From here GSAP owns the strokes. A ScrollTrigger refresh reverts the timeline and
      // renders it at progress 0, before the segments' tween starts, so they carry no inline
      // dash then: the CSS before-state stays on while data-animated is "true" and hides any
      // stroke DrawSVG has not written yet (src/styles/divider.css).
      root.dataset.animated = "true";
      return () => {
        tl = undefined;
        delete root.dataset.animated;
      };
    },
    { enabled: scroll && drawReady, tier: "full" },
  );

  // Butt caps everywhere: a zero-length dash (the drawn-from state) then paints nothing,
  // where a round cap would leave a dot.
  return (
    <div
      ref={ref}
      aria-hidden
      data-gsap-scene
      data-thread-scene
      className={`loop-divider-band relative h-12 ${dark ? "text-brass-line" : "text-brass"}`}
    >
      {/* Left segment: starts at the knot, so it draws outward. */}
      <svg
        viewBox="0 0 100 1"
        preserveAspectRatio="none"
        height={1}
        className="absolute top-6 left-0 h-px"
        style={{ width: SEGMENT_WIDTH }}
        focusable="false"
      >
        <line
          data-thread="segment"
          x1={100}
          y1={0.5}
          x2={0}
          y2={0.5}
          stroke="currentColor"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <svg
        viewBox="0 0 100 1"
        preserveAspectRatio="none"
        height={1}
        className="absolute top-6 right-0 h-px"
        style={{ width: SEGMENT_WIDTH }}
        focusable="false"
      >
        <line
          data-thread="segment"
          x1={0}
          y1={0.5}
          x2={100}
          y2={0.5}
          stroke="currentColor"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* The knot: 56 × 25, centred on the grid; its crossing sits on the lines' axis (24.5px). */}
      <svg
        viewBox={KNOT_VIEWBOX}
        width={KNOT_W}
        height={KNOT_H}
        className="absolute top-3 left-1/2 -ml-7 overflow-visible"
        focusable="false"
      >
        <path
          data-thread="knot"
          d={LOOP_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
