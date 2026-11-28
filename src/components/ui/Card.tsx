import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Rounded ivory card. On charcoal it reads as an ivory card on a dark band;
 * `tone-light` resets text and focus rings to the light pairing inside it.
 */
export function Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  return (
    <Tag
      className={cn(
        "tone-light rounded-2xl border border-rule bg-ivory p-6 text-charcoal sm:p-8",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
