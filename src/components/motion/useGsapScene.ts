"use client";

import { useEffect, useRef, type RefObject } from "react";
import { loadGsap } from "@/lib/motion/gsap";

type Gsap = Awaited<ReturnType<typeof loadGsap>>;

/**
 * One batched ScrollTrigger refresh per frame, however many scenes mount.
 * Each refresh scrolls to the top to measure and back, which cancels the
 * browser's smooth scroll to a #fragment; so after the first refresh of a
 * page load, re-apply the fragment once.
 */
let pending = 0;
let hashHandled = false;
function scheduleRefresh(g: Gsap) {
  if (pending) return;
  pending = requestAnimationFrame(() => {
    pending = 0;
    g.ScrollTrigger.sort();
    g.ScrollTrigger.refresh();
    if (!hashHandled) {
      hashHandled = true;
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (id && nav?.type !== "back_forward") {
        document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
      }
    }
  });
}

/**
 * Builds a GSAP scene scoped to `scope` and reverts it on cleanup.
 *
 * With Cache Components, a route that is navigated away from is hidden by
 * React <Activity>, not unmounted: its effects clean up and re-run when it is
 * shown again. Reverting the gsap.context kills every tween and ScrollTrigger
 * the scene made, so nothing runs on a hidden page, and the scene is rebuilt
 * and measured fresh when the page comes back.
 *
 * `build` may return a cleanup for anything GSAP does not own.
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
      scheduleRefresh(g);
    });
    return () => {
      cancelled = true;
      if (typeof extra === "function") extra();
      ctx?.revert();
    };
  }, [scope, enabled, key]);
}
