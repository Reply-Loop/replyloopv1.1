/**
 * Lazy GSAP + ScrollTrigger. Loaded only by components that animate, after
 * hydration, so it never sits on the critical path. One shared instance.
 * License: Webflow "Standard No Charge" GSAP license (marketing sites permitted).
 */
type GsapModules = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
};

let loading: Promise<GsapModules> | null = null;

export function loadGsap(): Promise<GsapModules> {
  if (!loading) {
    loading = Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, st]) => {
      const gsap = g.gsap;
      const ScrollTrigger = st.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });
      gsap.defaults({ ease: "power2.out" });
      return { gsap, ScrollTrigger };
    });
  }
  return loading;
}
