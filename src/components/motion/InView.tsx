"use client";

import { useRef, type ReactNode } from "react";
import { useInViewport } from "./useInViewport";

/**
 * A plain <div> that carries `data-inview` while it is on screen, so CSS-only
 * ambient loops inside it can run only then:
 *   :root[data-motion="full"] [data-inview] .thing { animation-play-state: running }
 */
export function InView({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref, "0px");
  return (
    <div ref={ref} aria-hidden className={className} data-inview={inView || undefined}>
      {children}
    </div>
  );
}
