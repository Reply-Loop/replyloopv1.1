import Link from "next/link";
import { cn } from "@/lib/cn";
import { Card } from "./Card";
import { Icon, type IconName } from "./Icon";

export type Pillar = {
  icon: IconName;
  title: string;
  need: string;
  what: string;
  href?: string;
  linkLabel?: string;
};

/**
 * One service pillar: the owner's need, then what ReplyLoop does. No prices.
 * Brief §6.8. The card follows its band: `light` on ivory bands, `dark` on charcoal
 * (never an ivory slab on charcoal). A decorative 2px top accent, inset by the card
 * radius, is brass on light and brass-line on dark. The icon sits in a 12px-radius
 * chip: a rule ring with a brass icon on light, a brass-line ring with an ivory icon
 * on dark. The card itself is not a link; only its bottom link is.
 */
export function PillarCard({
  pillar,
  headingLevel = "h3",
  tone = "light",
  reveal,
}: {
  pillar: Pillar;
  headingLevel?: "h3" | "h2";
  tone?: "light" | "dark";
  /** Position in its grid, for the staggered scroll reveal. */
  reveal?: number;
}) {
  const H = headingLevel;
  const dark = tone === "dark";
  return (
    <Card as="li" tone={tone} reveal={reveal} className="relative flex h-full flex-col">
      <span
        aria-hidden
        className={cn("pointer-events-none absolute inset-x-5 -top-px h-0.5", dark ? "bg-brass-line" : "bg-brass")}
      />
      <span
        className={cn(
          "mb-6 inline-flex size-11 items-center justify-center rounded-md border",
          dark ? "border-brass-line text-ivory" : "border-rule text-brass",
        )}
      >
        <Icon name={pillar.icon} className="size-5" />
      </span>
      <H className={cn("font-serif text-h3-lg font-medium", dark ? "text-ivory" : "text-charcoal")}>{pillar.title}</H>
      <p className={cn("mt-3", dark ? "text-mist" : "text-slate")}>{pillar.need}</p>
      <p className={cn("mt-3", dark ? "text-ivory" : "text-charcoal")}>{pillar.what}</p>
      {pillar.href ? (
        <Link
          href={pillar.href}
          className={cn(
            "mt-auto inline-flex items-center gap-2 pt-6 font-semibold underline underline-offset-[6px] hover:decoration-2",
            dark ? "text-ivory decoration-brass-line" : "text-charcoal decoration-brass",
          )}
        >
          {pillar.linkLabel ?? `More on ${pillar.title.toLowerCase()}`}
          <Icon name="arrow" className="size-4" />
        </Link>
      ) : null}
    </Card>
  );
}
