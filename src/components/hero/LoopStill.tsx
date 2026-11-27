import { useId } from "react";
import { cn } from "@/lib/cn";
import { LOOP_CROSSING_PATH, LOOP_PATH, LOOP_STROKE, LOOP_VIEWBOX } from "@/lib/loop/geometry.generated";

/**
 * Sculpted still of the hero loop in SVG: brushed-brass gradient, a soft top
 * highlight and the ivory enamel crossing. Its contact shadow is a CSS gradient in
 * HeroVisual's box, shared with the 3D canvas, so it stays put through the swap. It is the first paint
 * on every device, and the final image on phones, Save-Data, and reduced motion.
 * Vector shapes are not LCP candidates, so the H1 stays the LCP element.
 */
export function LoopStill({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox={LOOP_VIEWBOX} className={cn("h-auto w-full overflow-visible", className)} aria-hidden focusable="false">
      <defs>
        <linearGradient id={`${id}-brass`} x1="-110" y1="-50" x2="110" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#5C3E12" />
          <stop offset="0.28" stopColor="#8A5F1C" />
          <stop offset="0.46" stopColor="#C49A5A" />
          <stop offset="0.58" stopColor="#8A5F1C" />
          <stop offset="0.8" stopColor="#6E4B16" />
          <stop offset="1" stopColor="#4E3410" />
        </linearGradient>
        <linearGradient id={`${id}-sheen`} x1="0" y1="-50" x2="0" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFE9C4" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#FFE9C4" stopOpacity="0.08" />
          <stop offset="1" stopColor="#FFE9C4" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-enamel`} x1="-20" y1="-30" x2="20" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFDF8" />
          <stop offset="1" stopColor="#E6DCCB" />
        </linearGradient>
      </defs>
      <path d={LOOP_PATH} fill="none" stroke={`url(#${id}-brass)`} strokeWidth={LOOP_STROKE} strokeLinejoin="round" />
      <path
        d={LOOP_PATH}
        fill="none"
        stroke={`url(#${id}-sheen)`}
        strokeWidth={LOOP_STROKE * 0.32}
        transform="translate(0 -3.2)"
      />
      <path d={LOOP_CROSSING_PATH} fill="none" stroke="#1B1F23" strokeOpacity="0.18" strokeWidth={LOOP_STROKE + 3} />
      <path d={LOOP_CROSSING_PATH} fill="none" stroke={`url(#${id}-enamel)`} strokeWidth={LOOP_STROKE + 0.4} />
    </svg>
  );
}
