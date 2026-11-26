"use client";

import { useRef, type ComponentType } from "react";
import type { Step } from "@/components/ui/StepList";
import { useGsapScene } from "@/components/motion/useGsapScene";
import { useMotion } from "@/components/motion/useMotion";
import { LOOP_PATH } from "@/lib/loop/geometry.generated";
import { VignetteDryRun } from "./vignettes/VignetteDryRun";
import { VignetteGoLive } from "./vignettes/VignetteGoLive";
import { VignetteIntroCall } from "./vignettes/VignetteIntroCall";
import { VignetteVoiceInterview } from "./vignettes/VignetteVoiceInterview";

const VIGNETTES: ComponentType<{ idPrefix?: string; className?: string }>[] = [
  VignetteIntroCall,
  VignetteVoiceInterview,
  VignetteDryRun,
  VignetteGoLive,
];

/** Camera zoom on the journey loop, and where along the loop (0..1) the trip starts and ends. */
const ZOOM = 2.6;
const S_FROM = 0.03;
const S_TO = 0.97;
/** Where the camera holds the bead: centred behind the illustration column (viewBox units). */
const FOCUS_X = -62;

/**
 * "How it works" as a journey along the loop.
 * - Desktop with motion: the stage pins and the scroll drives a camera along
 *   the brass loop; each step is a chapter with its own vignette.
 * - Phones, reduced motion, or no JavaScript: the same markup, stacked, with
 *   every vignette shown. The step text is always real HTML.
 */
export function HowItWorksJourney({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scroll } = useMotion();

  useGsapScene(
    ref,
    ({ gsap }) => {
      const root = ref.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-step]", root);
        const path = root.querySelector<SVGPathElement>("[data-journey-path]");
        const cam = root.querySelector<SVGGElement>("[data-journey-cam]");
        const bead = root.querySelector<SVGCircleElement>("[data-journey-bead]");
        const dots = gsap.utils.toArray<HTMLElement>("[data-journey-dot]", root);
        if (!path || !cam || !bead || !items.length) return;
        root.dataset.pinned = "true";
        const length = path.getTotalLength();

        const moveCamera = (p: number) => {
          const pt = path.getPointAtLength(length * (S_FROM + (S_TO - S_FROM) * p));
          cam.setAttribute("transform", `translate(${FOCUS_X - pt.x * ZOOM} ${-pt.y * ZOOM}) scale(${ZOOM})`);
          bead.setAttribute("cx", String(pt.x));
          bead.setAttribute("cy", String(pt.y));
          const active = Math.min(items.length - 1, Math.floor(p * items.length * 0.999));
          dots.forEach((d, i) => d.toggleAttribute("data-active", i === active));
        };
        moveCamera(0);

        gsap.set(items, { autoAlpha: 0 });
        gsap.set(items[0], { autoAlpha: 1 });
        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: `+=${items.length * 95}%`,
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            onUpdate: (self) => moveCamera(self.progress),
          },
        });
        items.forEach((item, i) => {
          const at = i;
          if (i > 0) {
            tl.to(items[i - 1], { autoAlpha: 0, y: -24, duration: 0.25 }, at);
            tl.fromTo(item, { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: 0.3 }, at + 0.05);
          }
          const layers = item.querySelectorAll("[data-v-layer]");
          tl.fromTo(layers, { opacity: 0, y: 14, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, stagger: 0.07 }, at + 0.08);
          item.querySelectorAll<SVGPathElement>("[data-v-draw]").forEach((d) => {
            gsap.set(d, { attr: { pathLength: 1 }, strokeDasharray: 1 });
            tl.fromTo(d, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.35, ease: "none" }, at + 0.3);
          });
          tl.to({}, { duration: 0.35 }, at + 0.65); // hold: a moment of stillness on each chapter
        });

        return () => {
          delete root.dataset.pinned;
          dots.forEach((d) => d.removeAttribute("data-active"));
        };
      });
      return () => mm.revert();
    },
    { enabled: scroll },
  );

  return (
    <div ref={ref} className="journey relative mt-14">
      {/* The camera's loop: only visible while pinned. */}
      <svg aria-hidden focusable="false" viewBox="-160 -100 320 200" className="journey-loop" preserveAspectRatio="xMidYMid slice">
        <g data-journey-cam>
          <path data-journey-path d={LOOP_PATH} fill="none" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" />
          <circle data-journey-bead r={2.4} cx={0} cy={0} className="journey-bead" />
        </g>
      </svg>
      <ol className="journey-steps">
        {steps.map((step, i) => {
          const Vignette = VIGNETTES[i % VIGNETTES.length];
          return (
            <li key={step.title} data-step={i} className="journey-step">
              <div className="journey-vignette">
                <Vignette idPrefix={`j${i}`} className="block h-auto w-full" />
              </div>
              <div className="journey-text">
                <span aria-hidden className="font-serif text-4xl font-medium leading-none text-brass">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-serif text-xl font-medium lg:text-[1.75rem]">
                  <span className="sr-only">Step {i + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-3 text-slate lg:text-lg">{step.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <ol aria-hidden className="journey-dots">
        {steps.map((s) => (
          <li key={s.title} data-journey-dot />
        ))}
      </ol>
    </div>
  );
}
