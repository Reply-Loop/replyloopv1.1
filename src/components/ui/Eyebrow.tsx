import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Thin brass rule above a small label. Brass text on ivory; ivory text on charcoal. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-brass on-dark:text-ivory",
        className,
      )}
    >
      <span aria-hidden className="h-px w-10 bg-brass on-dark:bg-brass-line" />
      <span>{children}</span>
    </p>
  );
}

/** Thin brass hairline, used above headlines that have no eyebrow. */
export function Rule({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("block h-px w-12 bg-brass on-dark:bg-brass-line", className)}
    />
  );
}
