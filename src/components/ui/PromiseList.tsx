import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { promises as defaultPromises, type PromiseItem } from "@/content/promises";

/** #7, "Private stays private": the closing promise, given emphasis in place. */
const CLOSING = 6;

/** Rows rise with the scroll reveal, 50ms apart in effect, capped at the 4th step (§7.4). */
const step = (i: number) => ({ "--i": Math.min(i, 4) }) as CSSProperties;

/**
 * The seven red lines, in customer-facing words (brief §8.3.6). Copy lives in
 * src/content/promises.ts and is never edited here.
 *
 * - list (Option B, home): one editorial column, max-w-4xl. Display numerals
 *   (brass on ivory, mist on charcoal, tabular) in a 5rem gutter, h3-lg titles,
 *   body-size text, a 1px rule between rows. #7 keeps its place and gets a 2px
 *   brass bar hung in the margin (so every numeral stays on one axis) and a
 *   slightly larger title.
 * - grid (Option A, /home-care-agencies): three columns of the first six, so no
 *   cell is orphaned, and #7 as a full-width closing row on an ink-2 strip:
 *   ivory title, mist body and numeral (brass is never text on ink-2).
 *
 * Numerals are aria-hidden: the <ol> already gives the order.
 */
export function PromiseList({
  items = defaultPromises,
  className,
  variant = "list",
}: {
  items?: PromiseItem[];
  className?: string;
  variant?: "list" | "grid";
}) {
  return variant === "grid" ? (
    <PromiseGrid items={items} className={className} />
  ) : (
    <ol className={cn("mx-auto max-w-4xl", className)}>
      {items.map((p, i) => {
        const closing = i === CLOSING;
        return (
          <li
            key={p.title}
            style={step(i)}
            className={cn(
              "reveal relative grid grid-cols-[5rem_minmax(0,1fr)] items-baseline py-8",
              "border-t border-rule first:border-t-0 on-dark:border-hairline-dark",
              closing &&
                "before:absolute before:inset-y-8 before:-left-3 before:w-0.5 before:bg-brass before:content-[''] sm:before:-left-5 on-dark:before:bg-brass-line",
            )}
          >
            <span
              aria-hidden
              className="font-serif text-numeral font-normal text-brass on-dark:text-mist"
            >
              {i + 1}
            </span>
            <div>
              <h3
                className={cn(
                  "font-serif font-medium text-charcoal on-dark:text-ivory",
                  closing ? "text-h2-compact" : "text-h3-lg",
                )}
              >
                {p.title}
              </h3>
              <p className="mt-3 max-w-measure text-body text-slate on-dark:text-mist">{p.body}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Option A. Rules sit on each cell's top edge, so every row's rules share one line. */
function PromiseGrid({ items, className }: { items: PromiseItem[]; className?: string }) {
  return (
    <ol className={cn("grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((p, i) =>
        i === CLOSING ? (
          <li
            key={p.title}
            style={step(i)}
            className="reveal tone-dark col-span-full mt-4 rounded-card bg-ink-2 p-6 text-ivory sm:p-8 lg:grid lg:grid-cols-[5rem_minmax(0,5fr)_minmax(0,7fr)] lg:items-baseline lg:gap-x-8"
          >
            <span aria-hidden className="block font-serif text-numeral font-normal text-mist">
              {i + 1}
            </span>
            <h3 className="mt-4 font-serif text-h2-compact font-medium text-ivory lg:mt-0">{p.title}</h3>
            <p className="mt-3 max-w-measure text-body text-mist lg:mt-0">{p.body}</p>
          </li>
        ) : (
          <li
            key={p.title}
            style={step(i)}
            className="reveal border-t border-rule py-8 on-dark:border-hairline-dark"
          >
            <span aria-hidden className="block font-serif text-numeral font-normal text-brass on-dark:text-mist">
              {i + 1}
            </span>
            <h3 className="mt-4 font-serif text-h3-lg font-medium text-charcoal on-dark:text-ivory">{p.title}</h3>
            <p className="mt-3 max-w-measure text-body text-slate on-dark:text-mist">{p.body}</p>
          </li>
        ),
      )}
    </ol>
  );
}
