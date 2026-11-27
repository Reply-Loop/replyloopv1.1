import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow, Rule } from "./Eyebrow";
import { keepPhrases } from "@/lib/typography";

/**
 * - statement: centred, display-size H2 (max 18ch), intro max 38rem. One idea, lots of air.
 * - split: 12 columns at lg. Eyebrow and H2 in cols 1–5, intro in cols 7–12, its first
 *   baseline aligned with the H2's first baseline.
 * - default: left aligned, max-w-3xl.
 * - compact: left aligned, smaller H2. FAQ, blog lists, reading sections.
 * `as="h1"` always uses the h1 token (subpage H1s); `as="h3"` uses h3-lg.
 */
export type HeadingVariant = "statement" | "split" | "default" | "compact";

type SectionHeadingProps = {
  id?: string;
  eyebrow?: ReactNode;
  /** Shorter eyebrow shown below 640px. */
  eyebrowShort?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  as?: "h1" | "h2" | "h3";
  variant?: HeadingVariant;
  /** @deprecated use variant="statement". Kept so older call sites still centre. */
  align?: "left" | "center";
  className?: string;
};

const H2_TOKEN: Record<HeadingVariant, string> = {
  statement: "text-display",
  split: "text-h2",
  default: "text-h2",
  compact: "text-h2-compact",
};

/*
 * Split intro alignment at lg: the eyebrow line (0.875rem × 1.3) plus its 20px gap
 * (or the 1px rule plus 24px), then the H2's first baseline (Fraunces: 0.9015em into
 * a 1.08 line) minus the lede's first baseline (Inter: 1.139em into a 1.55 line).
 */
const SPLIT_LEAD_EYEBROW = "2.3875rem";
const SPLIT_LEAD_RULE = "1.5625rem";

export function SectionHeading({
  id,
  eyebrow,
  eyebrowShort,
  title,
  intro,
  as: Tag = "h2",
  variant: variantProp,
  align = "left",
  className,
}: SectionHeadingProps) {
  const variant: HeadingVariant = variantProp ?? (align === "center" ? "statement" : "default");
  const size = Tag === "h1" ? "text-h1" : Tag === "h3" ? "text-h3-lg" : H2_TOKEN[variant];
  // Statement display carries its own weight (500, then 400 at >= 3.5rem): no font-medium.
  const weight = size === "text-display" ? undefined : "font-medium";
  const centred = variant === "statement";

  const lead = (
    <>
      {eyebrow ? (
        <Eyebrow short={eyebrowShort} centered={centred} className="mb-6 lg:mb-5">
          {eyebrow}
        </Eyebrow>
      ) : (
        <Rule className={cn("mb-6", centred && "mx-auto")} />
      )}
      <Tag
        id={id}
        className={cn(
          "font-serif text-charcoal on-dark:text-ivory",
          size,
          weight,
          centred && "mx-auto max-w-[18ch]",
        )}
      >
        {keepPhrases(title)}
      </Tag>
    </>
  );

  const introBody = intro ? (typeof intro === "string" ? <p>{intro}</p> : intro) : null;
  const introClass = "text-lede text-slate on-dark:text-mist [&>p+p]:mt-4";

  if (variant === "split") {
    const style = {
      "--split-lead": eyebrow ? SPLIT_LEAD_EYEBROW : SPLIT_LEAD_RULE,
    } as CSSProperties;
    return (
      <header className={cn("lg:grid lg:grid-cols-12 lg:gap-x-8", className)} style={style}>
        <div className="lg:col-span-5">{lead}</div>
        {introBody ? (
          <div
            className={cn(
              introClass,
              "mt-5 max-w-lede lg:col-span-6 lg:col-start-7 lg:mt-0 lg:pt-[calc(var(--split-lead)+0.9015*var(--text-h2)-1.139*var(--text-lede))]",
            )}
          >
            {introBody}
          </div>
        ) : null}
      </header>
    );
  }

  return (
    <header className={cn(centred ? "mx-auto text-center" : "max-w-3xl", className)}>
      {lead}
      {introBody ? (
        <div className={cn(introClass, "mt-5", centred ? "mx-auto max-w-[38rem]" : "max-w-lede")}>
          {introBody}
        </div>
      ) : null}
    </header>
  );
}
