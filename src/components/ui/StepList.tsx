import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

export type Step = { title: string; body: string };

/**
 * Ordered process steps, ruled 4-up at lg (brief §8.6): each step hangs from a
 * 1px rule (rule on ivory, the dark hairline on charcoal) with its number in the
 * numeral token, brass on ivory and mist on charcoal (brass is never text on
 * charcoal). Numerals are aria-hidden: the <ol> and the sr-only "Step n" give
 * the order. Each step rises with the scroll reveal (text: transform only),
 * staggered and capped at the 4th step (§7.4).
 */
export function StepList({ steps, className }: { steps: Step[]; className?: string }) {
  return (
    <ol className={cn("grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {steps.map((step, i) => (
        <li
          key={step.title}
          style={{ "--i": Math.min(i, 4) } as CSSProperties}
          className="reveal border-t border-rule pt-6 on-dark:border-hairline-dark"
        >
          <span aria-hidden className="block font-serif text-numeral font-normal text-brass [font-variation-settings:'opsz'_144] on-dark:text-mist">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-6 font-serif text-h3 font-medium text-charcoal on-dark:text-ivory">
            <span className="sr-only">Step {i + 1}: </span>
            {step.title}
          </h3>
          <p className="mt-3 max-w-measure text-slate on-dark:text-mist">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
