import type { CSSProperties } from "react";
import { Card } from "@/components/ui/Card";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/*
 * Home proof panel (brief §8.3.8): an honest "what you can check" card, set below the
 * Proof heading. No numbers, logos, quotes or CTA: only sentences already in
 * src/content, verbatim.
 * - "You can see the work and check the results." (promises.ts, faq.ts)
 * - "You approve each month's posts before they go out." (steps.ts, faq.ts).
 *   Provisional: the owner may decline this row (§13); then delete it and ship two rows.
 * - "You keep the keys." (promises.ts)
 * The card title "What you can check" is new copy, approved for Phase 4.
 */
const ROWS: { icon: IconName; text: string }[] = [
  { icon: "book", text: "You can see the work and check the results." },
  { icon: "check", text: "You approve each month's posts before they go out." },
  { icon: "key", text: "You keep the keys." },
];

/**
 * A light raised card: Fraunces h3 title, then one row per sentence with a 20px brass
 * line icon and a 1px rule between rows. Text rises with the scroll reveal (transform
 * only, 50ms steps); the icons are decoration and unveil with .reveal-art (§7.5).
 */
export function ProofPanel({ className }: { className?: string }) {
  return (
    <Card className={cn("mx-auto max-w-3xl", className)}>
      <h3 className="reveal font-serif text-h3 font-medium" style={{ "--i": 0 } as CSSProperties}>
        What you can check
      </h3>
      <ul className="mt-6 divide-y divide-rule">
        {ROWS.map((row, i) => (
          <li
            key={row.text}
            className="reveal flex items-start gap-4 py-6 first:pt-0 last:pb-0"
            style={{ "--i": Math.min(i + 1, 4) } as CSSProperties}
          >
            <span aria-hidden className="reveal-art mt-1 flex shrink-0">
              <Icon name={row.icon} className="size-5 text-brass" />
            </span>
            <span>{row.text}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
