/**
 * Lazy GSAP + ScrollTrigger + CustomEase. Loaded only by components that animate,
 * after hydration, so it never sits on the critical path. One shared instance.
 * License: Webflow "Standard No Charge" GSAP license (marketing sites permitted);
 * it covers every plugin loaded here (CustomEase, DrawSVG, MotionPath, SplitText).
 *
 * Brand easing (brief §7.2): the same curves as the brand film (video/src/theme.ts)
 * and the --ease-* CSS tokens. Scrubbed master timelines use ease "none"; tweens
 * inside them use these names.
 */
type GsapModules = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
};

declare global {
  interface Window {
    /** Set by the inline head script (MOTION_HEAD_SCRIPT): arms the GSAP failure timer. */
    __rlWatchGsap?: () => void;
  }
}

export const EASES = {
  "rl.out": "0.16,1,0.3,1",
  "rl.soft": "0.22,1,0.36,1",
  "rl.in": "0.7,0,0.84,0",
  "rl.inOut": "0.83,0,0.17,1",
  "rl.draw": "0.45,0,0.2,1",
} as const;

let loading: Promise<GsapModules> | null = null;

export function loadGsap(): Promise<GsapModules> {
  if (!loading) {
    // The head script's timer marks html.rl-gsap-failed if this never resolves.
    window.__rlWatchGsap?.();
    loading = Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("gsap/CustomEase")]).then(
      ([g, st, ce]) => {
        const gsap = g.gsap;
        const ScrollTrigger = st.ScrollTrigger;
        const CustomEase = ce.CustomEase;
        gsap.registerPlugin(ScrollTrigger, CustomEase);
        ScrollTrigger.config({ ignoreMobileResize: true });
        for (const [name, curve] of Object.entries(EASES)) CustomEase.create(name, curve);
        gsap.defaults({ ease: "rl.out" });
        document.documentElement.classList.add("rl-gsap-ready");
        return { gsap, ScrollTrigger };
      },
    );
  }
  return loading;
}

/** DrawSVGPlugin (2.2 KB gz), loaded only by scenes that draw strokes. */
let drawSvg: Promise<void> | null = null;
export function loadDrawSVG(): Promise<void> {
  if (!drawSvg) {
    drawSvg = Promise.all([loadGsap(), import("gsap/DrawSVGPlugin")]).then(([{ gsap }, m]) => {
      gsap.registerPlugin(m.DrawSVGPlugin);
    });
  }
  return drawSvg;
}

/** MotionPathPlugin (9.7 KB gz): /services/review-replies (TrustLoop) only, never on /. */
let motionPath: Promise<void> | null = null;
export function loadMotionPath(): Promise<void> {
  if (!motionPath) {
    motionPath = Promise.all([loadGsap(), import("gsap/MotionPathPlugin")]).then(([{ gsap }, m]) => {
      gsap.registerPlugin(m.MotionPathPlugin);
    });
  }
  return motionPath;
}
