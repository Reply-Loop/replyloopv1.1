"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useGsapScene } from "@/components/motion/useGsapScene";
import { useMotion } from "@/components/motion/useMotion";
import { loadDrawSVG, loadGsap } from "@/lib/motion/gsap";

type Gsap = Awaited<ReturnType<typeof loadGsap>>["gsap"];

/**
 * The art swaps at Tailwind's `sm` (40rem, 640px at the default font size): the CSS
 * swap (sm:hidden / hidden sm:block) and these queries are the same breakpoint, so
 * the timeline is always built for the drawing that is shown. Classic syntax, so the
 * two are exact complements in every browser.
 */
const ART_QUERIES = {
  landscape: "(min-width: 40rem)",
  portrait: "not all and (min-width: 40rem)",
} as const;

/**
 * Brief §8.3.2, on normalised time (the master is ease "none", scrub 1):
 * 0–0.38 dust drifts down and the light cools; 0.25–0.40 the dust settles on the card;
 * 0.40–0.70 the thread draws from the card's tail; 0.62–0.86 the reply lands at the
 * thread's end; 0.74–0.96 the dust lifts, the warm light returns and the grey wash
 * clears; 0.96–1 hold. End state: no dust, no wash, thread drawn, reply arrived.
 */
function buildTimeline(gsap: Gsap, art: SVGSVGElement, landscape: boolean) {
  const q = (p: string) => art.querySelector(`[data-p="${p}"]`);
  const dust = art.querySelectorAll('[data-p="dust"] [data-d]');
  const thread = q("thread");
  const warm = q("warm-light");
  const cool = q("cool-light");
  const settled = q("dust-settled");
  const [fall, spread] = landscape ? [34, 52] : [22, 30];
  // The lift spans 0.74–0.96 including its stagger.
  const lift = 0.22 - 0.004 * Math.max(dust.length - 1, 0);

  const tl = gsap.timeline({
    // lazy: false renders every from-state when the tween is created, in the same frame as
    // data-animated is set; GSAP otherwise defers it to its next tick (a one-frame flash).
    defaults: { ease: "none", lazy: false },
    scrollTrigger: landscape
      ? { trigger: art, start: "top 80%", end: "bottom 45%", scrub: 1 }
      : // Phones end at "bottom 62%" (the brief's 40% let the clean-up run while the card was
        // already under the header): the card is fully on screen when the dust lifts.
        { trigger: art, start: "top 85%", end: "bottom 62%", scrub: 1 },
  });

  tl.fromTo(dust, { y: 0 }, { y: (i: number) => fall + ((i * 37) % spread), duration: 0.38 }, 0)
    .fromTo(warm, { opacity: 1 }, { opacity: 0.35, duration: 0.38, ease: "sine.inOut" }, 0)
    .fromTo(cool, { opacity: 0 }, { opacity: 1, duration: 0.38, ease: "sine.inOut" }, 0)
    .fromTo(settled, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: "rl.inOut" }, 0.25)
    // Hidden until it starts drawing: a zero-length round-capped dash would show as a dot.
    .set(thread, { opacity: 0, immediateRender: true }, 0)
    .fromTo(thread, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.3, ease: "rl.draw" }, 0.4)
    .set(thread, { opacity: 1 }, 0.4)
    .fromTo(
      q("reply"),
      // Pivots on its tail, where the thread arrives.
      { opacity: 0, y: 18, scale: 0.97, transformOrigin: landscape ? "18% 100%" : "14% 0%" },
      { opacity: 1, y: 0, scale: 1, duration: 0.24, ease: "rl.out" },
      0.62,
    )
    .to(dust, { y: "-=18", opacity: 0, duration: lift, ease: "rl.in", stagger: { each: 0.004, from: "end" } }, 0.74)
    .to(settled, { opacity: 0, duration: 0.22, ease: "rl.inOut" }, 0.74)
    .to(warm, { opacity: 0.95, duration: 0.22, ease: "power1.out" }, 0.74)
    .to(cool, { opacity: 0, duration: 0.22, ease: "rl.inOut" }, 0.74)
    // Hold the finished frame for the last 4% of the scroll.
    .to({}, { duration: 0.04 }, 0.96);
}

/**
 * The unanswered card, scrubbed by scroll (the visitor drives it, so there is nothing
 * to pause). Phones get the portrait drawing, wider screens the landscape one; both
 * are server-rendered and CSS shows one. The thread draws with DrawSVG at every width
 * on the full tier. Without a timeline (reduced motion, static, lite tier, GSAP
 * failure) the finished state shows.
 */
export function ProblemSceneMotion({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scroll } = useMotion();
  const [drawReady, setDrawReady] = useState(false);
  // Set once the plugin failed or stalled: the finished frame stays for this page view.
  const gaveUp = useRef(false);

  // DrawSVG must be registered before the timeline is built.
  useEffect(() => {
    if (!scroll || drawReady || gaveUp.current) return;
    if (document.documentElement.getAttribute("data-tier") !== "full") return;
    let live = true;
    let timer = 0;
    // No plugin, no timeline: clear the before-state so the finished frame shows. The head
    // script's timer only watches GSAP core, so a DrawSVG chunk that rejects, or is still
    // pending 3 s after GSAP is ready, gives up here; a late plugin never re-hides the art.
    const giveUp = () => {
      if (!live) return;
      gaveUp.current = true;
      ref.current?.setAttribute("data-animated", "static");
    };
    loadGsap().then(
      () => {
        if (live && !timer) timer = window.setTimeout(giveUp, 3000);
      },
      () => {},
    );
    loadDrawSVG().then(() => {
      window.clearTimeout(timer);
      if (live && !gaveUp.current) setDrawReady(true);
    }, giveUp);
    return () => {
      live = false;
      window.clearTimeout(timer);
    };
  }, [scroll, drawReady]);

  useGsapScene(
    ref,
    ({ gsap }) => {
      const root = ref.current;
      if (!root) return;
      let built = false;
      // Rebuilt for the other drawing when the viewport crosses 640px. Created inside the
      // scene's context, so the scene's revert also reverts it.
      const mm = gsap.matchMedia(root);
      mm.add(ART_QUERIES, (context) => {
        const landscape = Boolean(context.conditions?.landscape);
        const art = root.querySelector<SVGSVGElement>(`[data-art="${landscape ? "landscape" : "portrait"}"]`);
        if (!art) return;
        buildTimeline(gsap, art, landscape);
        built = true;
      });
      // "static" (nothing could be built) also clears the before-state.
      root.dataset.animated = built ? "true" : "static";

      return () => {
        mm.revert();
        delete root.dataset.animated;
      };
    },
    { enabled: scroll && drawReady, tier: "full" },
  );

  return (
    <div ref={ref} aria-hidden data-gsap-scene className={`problem-scene ${className ?? ""}`}>
      {children}
    </div>
  );
}
