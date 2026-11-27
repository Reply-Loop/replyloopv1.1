import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

type SectionProps = {
  children: ReactNode;
  /**
   * Surface (brief §6.1). Ivory bands carry the .paper grain and charcoal bands
   * the .felt grain; ivory-2 is the flat alternate light band. Charcoal is
   * punctuation: at most two dark bands per page, plus the footer.
   */
  tone?: "ivory" | "ivory-2" | "charcoal";
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
  /** Paper/felt grain on ivory and charcoal bands (default on). */
  grain?: boolean;
};

const RHYTHM = {
  loose: "py-24 sm:py-32 lg:py-40",
  default: "py-20 sm:py-24 lg:py-32",
  tight: "py-16 sm:py-20 lg:py-24",
} as const;

const TONE = {
  ivory: { grain: "paper text-charcoal", flat: "bg-ivory text-charcoal" },
  "ivory-2": { grain: "bg-ivory-2 text-charcoal", flat: "bg-ivory-2 text-charcoal" },
  charcoal: { grain: "tone-dark felt text-ivory", flat: "tone-dark bg-charcoal text-ivory" },
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
  grain = true,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("scroll-mt-[calc(var(--header-h)+1.5rem)]", RHYTHM[rhythm], TONE[tone][grain ? "grain" : "flat"], className)}
    >
      <Container size={containerSize}>
        {children}
      </Container>
    </section>
  );
}
