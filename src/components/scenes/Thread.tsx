"use client";

import { useRef } from "react";
import { useGsapScene } from "@/components/motion/useGsapScene";
import { useMotion } from "@/components/motion/useMotion";

/**
 * The kit's open-loop line: one thin, continuous brass thread that sweeps in,
 * turns one loop, and leaves cropped at the right edge. It draws itself as the
 * visitor scrolls past (scroll-linked, so it follows the visitor, not a clock).
 * Without motion it is simply drawn.
 */
export const THREAD_PATH =
  "M-40 58C120 58 260 46 420 44C560 42 640 50 716 58C792 66 850 74 872 58C894 42 868 18 838 20C808 22 792 46 812 62C840 84 930 68 1010 50C1090 32 1160 28 1260 30";

export function Thread({ dark = false }: { dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scroll } = useMotion();

  useGsapScene(
    ref,
    ({ gsap }) => {
      const root = ref.current;
      const path = root?.querySelector("path[data-thread]");
      if (!root || !path) return;
      // From here GSAP owns the stroke; the CSS before-state (globals.css) steps aside.
      root.dataset.animated = "true";
      // Tween the attribute: CSS stroke-dashoffset is rounded to whole px by GSAP,
      // which on a pathLength of 1 would pop instead of draw.
      gsap.fromTo(
        path,
        { attr: { "stroke-dashoffset": 1 } },
        {
          attr: { "stroke-dashoffset": 0 },
          ease: "none",
          scrollTrigger: { trigger: root, start: "top 92%", end: "top 38%", scrub: 0.8 },
        },
      );
      return () => {
        delete root.dataset.animated;
      };
    },
    { enabled: scroll, tier: "full" },
  );

  return (
    <div ref={ref} aria-hidden data-gsap-scene data-thread-scene className={dark ? "text-brass-line" : "text-brass"}>
      <svg viewBox="0 0 1200 96" preserveAspectRatio="none" className="block h-16 w-full sm:h-20" focusable="false">
        <path
          data-thread
          d={THREAD_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={0}
        />
      </svg>
    </div>
  );
}
