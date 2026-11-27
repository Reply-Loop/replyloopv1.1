import { cn } from "@/lib/cn";
import { Thread } from "@/components/scenes/Thread";
import { Container } from "./Container";

const TONE = {
  ivory: "paper",
  "ivory-2": "bg-ivory-2",
  charcoal: "tone-dark felt",
} as const;

/**
 * The page's one loop divider (brief §8.1), placed before the closing sequence: a 48px
 * band on the surface of the bands around it (ivory with paper grain, flat ivory-2, or
 * charcoal with felt) holding the thread across the content width. Brass on light,
 * brass-line on charcoal. Between other bands use <InsetRule />. Decorative only.
 */
export function LoopDivider({
  tone = "ivory",
  className,
}: {
  tone?: "ivory" | "ivory-2" | "charcoal";
  className?: string;
}) {
  return (
    <div aria-hidden className={cn(TONE[tone], className)}>
      <Container>
        <Thread dark={tone === "charcoal"} />
      </Container>
    </div>
  );
}
