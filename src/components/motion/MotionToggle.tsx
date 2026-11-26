"use client";

import { setMotionPaused } from "@/lib/motion/state";
import { useMotion } from "./useMotion";
import { cn } from "@/lib/cn";

/**
 * Global "Pause motion" control (WCAG 2.2.2). Stops ambient and autoplay
 * motion everywhere and remembers the choice. Toggle-button pattern: the
 * name stays "Pause motion" and aria-pressed carries the state. Hidden when the OS already asks
 * for reduced motion, since nothing moves then.
 */
export function MotionToggle({ className }: { className?: string }) {
  const { mode, paused } = useMotion();
  if (mode === "reduce") return null;
  return (
    <button
      type="button"
      aria-pressed={paused}
      onClick={() => setMotionPaused(!paused)}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full border border-rule text-charcoal transition-colors hover:border-brass",
        className,
      )}
      title="Pause motion"
    >
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden focusable="false" fill="currentColor">
        {paused ? <path d="M8 5.5v13l10.5-6.5z" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}
      </svg>
      {/* Fixed name with aria-pressed (WAI-ARIA toggle pattern); only the icon changes. */}
      <span className="sr-only">Pause motion</span>
    </button>
  );
}
