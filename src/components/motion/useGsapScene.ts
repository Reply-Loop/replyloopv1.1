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
 * One motion gate for every scene (brief §7.6, §7.9):
 * - scenes build inside gsap.matchMedia() with the conditions { desktop, reduce, motion };
 *   under reduce nothing is built and the CSS finished state stays;
 * - html[data-motion] is watched, so a switch (Pause motion, the OS setting) rebuilds
 *   every scene at once;
 * - once html.rl-gsap-failed is set (the head script's 3 s timer), nothing is built
 *   for the rest of the page view, so a late GSAP never re-hides or jumps anything;
 * - `tier: "full"` builds only on the full device tier (html[data-tier]), matching
 *   the scene's CSS before-state, which is scoped to the same condition.
 *
 * `build` may return a cleanup for anything GSAP does not own.
 * `key` re-runs the scene when its inputs change.
 */
export type SceneConditions = { desktop: boolean; reduce: boolean; motion: boolean };

/**
 * gsap.matchMedia only runs a callback while at least one condition matches, so
 * `motion` and `reduce` together always cover the visitor; `desktop` only informs.
 */
export const SCENE_QUERIES = {
  desktop: "(min-width: 1024px)",
  reduce: "(prefers-reduced-motion: reduce)",
  motion: "(prefers-reduced-motion: no-preference)",
} as const;

function motionAllowsScenes(): boolean {
  const root = document.documentElement;
  const mode = root.getAttribute("data-motion");
  return (mode === "full" || mode === "paused") && !root.classList.contains("rl-gsap-failed");
}

export function useGsapScene(
  scope: RefObject<HTMLElement | null>,
  build: (g: Gsap, conditions: SceneConditions) => void | (() => void),
  { enabled = true, key = "", tier }: { enabled?: boolean; key?: string; tier?: "full" } = {},
) {
  const buildRef = useRef(build);
  useEffect(() => {
    buildRef.current = build;
  });

  useEffect(() => {
    if (!enabled) return;
    const el = scope.current;
    if (!el) return;
    if (tier && document.documentElement.getAttribute("data-tier") !== tier) return;
    let cancelled = false;
    let extra: void | (() => void);
    let mm: { revert(): void } | undefined;
    let g: Gsap | undefined;

    const teardown = () => {
      if (typeof extra === "function") extra();
      extra = undefined;
      mm?.revert();
      mm = undefined;
    };
    const setup = () => {
      teardown();
      if (!g || cancelled || !motionAllowsScenes()) return;
      const matchMedia = g.gsap.matchMedia(el);
      mm = matchMedia;
      matchMedia.add(SCENE_QUERIES, (context) => {
        const conditions = context.conditions as SceneConditions;
        if (conditions.reduce) return;
        extra = buildRef.current(g!, conditions);
      });
      scheduleRefresh(g);
    };

    loadGsap().then((loaded) => {
      if (cancelled) return;
      g = loaded;
      setup();
    });

    // Rebuild (or tear down) every scene the moment the motion mode changes.
    const observer = new MutationObserver(() => {
      const allowed = motionAllowsScenes();
      if (allowed !== Boolean(mm)) setup();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion", "class"] });

    return () => {
      cancelled = true;
      observer.disconnect();
      teardown();
    };
  }, [scope, enabled, key, tier]);
}
