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
  /**
   * Vertical rhythm (§6.3), mobile / sm / lg:
   * - loose: primary home bands, 96 / 128 / 160
   * - default: 80 / 96 / 128
   * - tight: reading and list bands (FAQ, blog, contact), 64 / 80 / 96
   */
  rhythm?: "loose" | "default" | "tight";
  reveal?: boolean;
};

const RHYTHM = {
  loose: "py-24 sm:py-32 lg:py-40",
  default: "py-20 sm:py-24 lg:py-32",
  tight: "py-16 sm:py-20 lg:py-24",
} as const;

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
  rhythm = "default",
  reveal = true,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "scroll-mt-[calc(var(--header-h)+1.5rem)]",
        RHYTHM[rhythm],
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
