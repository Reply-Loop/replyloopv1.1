"use client";

import { useRef } from "react";
import { useGsapScene } from "@/components/motion/useGsapScene";
import { useMotion } from "@/components/motion/useMotion";
import { ProblemArt } from "./ProblemArt";

/**
 * The unanswered card, scrubbed by scroll (the visitor drives it, so there is
 * nothing to pause): dust drifts down and the light cools; then a reply rises
 * in and a brass thread joins the two. Without motion, the finished state shows.
 */
export function ProblemScene({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scroll } = useMotion();

  useGsapScene(
    ref,
    ({ gsap }) => {
      const root = ref.current;
      if (!root) return;
      const q = (sel: string) => root.querySelector(sel);
      const dust = root.querySelectorAll('[data-p="dust"] [data-d]');
      const thread = q('[data-p="thread"]');
      if (thread) gsap.set(thread, { attr: { pathLength: 1, "stroke-dasharray": 1 } });
      root.dataset.animated = "true";

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root, start: "top 85%", end: "bottom 68%", scrub: 0.9 },
      });
      tl.fromTo(dust, { y: 0 }, { y: (i: number) => 34 + ((i * 37) % 52), duration: 0.45, stagger: 0.004 }, 0)
        .fromTo(q('[data-p="warm-light"]'), { opacity: 1 }, { opacity: 0.32, duration: 0.45 }, 0)
        .fromTo(q('[data-p="cool-light"]'), { opacity: 0 }, { opacity: 0.85, duration: 0.45 }, 0.05)
        .fromTo(q('[data-p="dust-settled"]'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.2)
        .fromTo(
          q('[data-p="reply"]'),
          { opacity: 0, y: 26, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: "power2.out" },
          0.55,
        )
        .fromTo(thread, { attr: { "stroke-dashoffset": 1 } }, { attr: { "stroke-dashoffset": 0 }, duration: 0.28 }, 0.62)
        .to(q('[data-p="cool-light"]'), { opacity: 0.2, duration: 0.2 }, 0.72)
        .to(q('[data-p="warm-light"]'), { opacity: 0.9, duration: 0.25 }, 0.72);

      return () => {
        delete root.dataset.animated;
      };
    },
    { enabled: scroll },
  );

  return (
    <div ref={ref} aria-hidden className={`problem-scene ${className ?? ""}`}>
      <ProblemArt idPrefix="pa" className="block h-auto w-full" />
    </div>
  );
}
