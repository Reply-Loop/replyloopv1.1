import { cn } from "@/lib/cn";
import { Container } from "./Container";

/**
 * A quiet separator between two bands of the same surface (brief §8.1): a 1px
 * rule across the content width with a centred 6px dot. Brass on light,
 * brass-line on dark. Decorative only.
 */
export function InsetRule({ tone = "ivory", className }: { tone?: "ivory" | "ivory-2" | "charcoal"; className?: string }) {
  const dark = tone === "charcoal";
  return (
    <div
      aria-hidden
      className={cn(dark ? "tone-dark felt" : tone === "ivory-2" ? "bg-ivory-2" : "paper", className)}
    >
      <Container>
        <div className="relative flex h-px items-center justify-center">
          <span className={cn("absolute inset-x-0 h-px", dark ? "bg-hairline-dark" : "bg-rule")} />
          <span className={cn("relative size-1.5 rounded-pill", dark ? "bg-brass-line" : "bg-brass")} />
        </div>
      </Container>
    </div>
  );
}
