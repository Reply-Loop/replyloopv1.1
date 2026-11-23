import { cn } from "@/lib/cn";

export type Step = { title: string; body: string };

/** Ordered process steps with brass numerals. */
export function StepList({ steps, className }: { steps: Step[]; className?: string }) {
  return (
    <ol className={cn("grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {steps.map((step, i) => (
        <li key={step.title} className="relative border-t border-rule pt-6 on-dark:border-mist/30">
          <span
            aria-hidden
            className="font-serif text-4xl font-medium leading-none text-brass on-dark:text-ivory"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-4 font-serif text-xl font-medium">
            <span className="sr-only">Step {i + 1}: </span>
            {step.title}
          </h3>
          <p className="mt-3 text-slate on-dark:text-mist">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
