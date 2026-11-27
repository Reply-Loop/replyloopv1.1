import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Card (brief §6.8).
 * - light: raised paper on ivory. Paper surface, a hairline rule border, the
 *   resting shadow, 20px radius. Resets text and focus rings to the light pairing.
 * - dark: on charcoal, depth comes from surface, not shadow: ink-2 with a
 *   decorative brass-line border. Ivory headings, mist body, never brass text.
 *   Used on its own on a light band too (it then sets its own dark pairing).
 * - interactive: the whole card is a link. Lifts 2px with a fading shadow layer
 *   on hover or keyboard focus (compositor only, see .card-lift in globals.css).
 * - size: padding. Mobile is always 24px; "lg" is 32px for 2- and 3-up grids,
 *   "md" is 28px for 4-up grids.
 */
/**
 * For an interactive card: put this on the card's one link. Its ::after covers
 * the whole card (the card is position: relative through .card-lift), so the
 * whole card is the click target, and the focus ring draws around the card.
 */
export const cardLinkOverlay =
  "after:absolute after:inset-0 after:rounded-card focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-3 focus-visible:after:outline-(--focus-ring)";

export function Card({
  children,
  className,
  as: Tag = "div",
  tone = "light",
  interactive = false,
  size = "lg",
  reveal,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
  tone?: "light" | "dark";
  interactive?: boolean;
  size?: "md" | "lg";
  /** Position in its grid: the card rises with the scroll reveal, staggered (capped at 4). */
  reveal?: number;
}) {
  return (
    <Tag
      className={cn(
        "rounded-card p-6",
        size === "lg" ? "sm:p-8" : "sm:p-7",
        tone === "light"
          ? "tone-light border border-[color-mix(in_srgb,var(--color-rule)_80%,transparent)] bg-paper text-charcoal shadow-2"
          : "tone-dark border border-[rgb(184_137_74/0.22)] bg-ink-2 text-ivory",
        interactive && "card-lift",
        reveal !== undefined && "reveal",
        className,
      )}
      style={reveal !== undefined ? ({ "--i": Math.min(reveal, 4) } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
