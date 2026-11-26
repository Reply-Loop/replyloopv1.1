"use client";

import { useEffect, useRef, type RefObject } from "react";
import { loadGsap } from "@/lib/motion/gsap";

type Gsap = Awaited<ReturnType<typeof loadGsap>>;

/**
 * Builds a GSAP scene scoped to `scope` and reverts it on cleanup.
 *
 * With Cache Components, a route that is navigated away from is hidden by
 * React <Activity>, not unmounted: its effects clean up and re-run when it is
 * shown again. Reverting the gsap.context here kills every tween and
 * ScrollTrigger the scene made, so nothing keeps running on a hidden page, and
 * the scene is rebuilt (and measured fresh) when the page comes back.
 *
 * `build` may return a cleanup for anything GSAP does not own (listeners, rAF).
 * `key` re-runs the scene when its inputs change.
 */
export function useGsapScene(
  scope: RefObject<HTMLElement | null>,
  build: (g: Gsap) => void | (() => void),
  { enabled = true, key = "" }: { enabled?: boolean; key?: string } = {},
) {
  const buildRef = useRef(build);
  useEffect(() => {
    buildRef.current = build;
  });

  useEffect(() => {
    if (!enabled) return;
    const el = scope.current;
    if (!el) return;
    let cancelled = false;
    let extra: void | (() => void);
    let ctx: { revert(): void } | undefined;
    loadGsap().then((g) => {
      if (cancelled) return;
      ctx = g.gsap.context(() => {
        extra = buildRef.current(g);
      }, el);
      g.ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
      if (typeof extra === "function") extra();
      ctx?.revert();
    };
  }, [scope, enabled, key]);
}
