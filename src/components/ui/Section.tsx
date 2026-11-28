import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

type SectionProps = {
  children: ReactNode;
  tone?: "ivory" | "charcoal";
  id?: string;
  labelledBy?: string;
  className?: string;
  containerSize?: "default" | "narrow" | "prose";
  reveal?: boolean;
};

/**
 * A page band. Charcoal bands set `.tone-dark`, which flips focus rings and
 * enables `on-dark:` styles for their children.
 */
export function Section({
  children,
  tone = "ivory",
  id,
  labelledBy,
  className,
  containerSize,
  reveal = true,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "scroll-mt-24 py-20 sm:py-24 lg:py-28",
        tone === "charcoal" ? "tone-dark bg-charcoal text-ivory" : "bg-ivory text-charcoal",
        className,
      )}
    >
      <Container size={containerSize} className={reveal ? "reveal" : undefined}>
        {children}
      </Container>
    </section>
  );
}
