import type { CSSProperties } from "react";
import { healthHandling } from "@/content/health";
import { Card } from "./Card";
import { Icon } from "./Icon";
import { SectionHeading } from "./SectionHeading";

/**
 * Required on `/` and `/home-care-agencies`. Plain words, no legal claims.
 * Content lives in src/content/health.ts.
 *
 * Brief §8.3.7. The page sets the ivory-2 band; the example card is the band's
 * one dark object. At lg the block is a 12-column split: heading and list in
 * cols 1–6, the example card in cols 7–12. The card is sticky below the header
 * and centred against the list, so it travels with the list as it scrolls and
 * no corner of the band is left empty. Sticky only moves the card inside its own
 * grid area (self-center keeps it from stretching to the row), so nothing else
 * moves and there is no layout shift. Neither
 * the card nor any ancestor carries a reveal class (a transform would break the
 * sticky); only the list rows and the heading rise.
 */
export function HealthHandling({
  headingId = "health-handling",
  eyebrow = "Health businesses",
}: {
  headingId?: string;
  eyebrow?: string;
}) {
  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0">
      <div className="lg:col-span-6">
        <SectionHeading
          id={headingId}
          eyebrow={eyebrow}
          title={healthHandling.title}
          intro={healthHandling.intro}
        />
        <ul className="mt-12 space-y-4">
          {healthHandling.points.map((point, i) => (
            <li
              key={point}
              className="reveal flex max-w-measure gap-4"
              style={{ "--i": Math.min(i, 4) } as CSSProperties}
            >
              <Icon name="check" className="mt-1 size-5 shrink-0 text-brass on-dark:text-ivory" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* The one dark object in the (ivory-2) band: ivory and mist text, brass-line bar, never brass text. */}
      <Card
        as="article"
        tone="dark"
        className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:col-span-6 lg:col-start-7 lg:self-center lg:p-12"
      >
        <p className="text-eyebrow font-semibold uppercase tracking-[0.08em] text-ivory sm:tracking-[0.14em]">
          {healthHandling.example.label}
        </p>
        <p className="mt-2 text-small text-mist">A public reply to a kind review.</p>
        <blockquote className="mt-6 border-l-2 border-brass-line pl-5 font-serif text-h3-lg font-normal leading-[1.4] text-ivory">
          <p>{healthHandling.example.text}</p>
        </blockquote>
      </Card>
    </div>
  );
}
