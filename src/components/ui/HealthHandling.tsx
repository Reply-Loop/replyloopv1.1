import { healthHandling } from "@/content/health";
import { Card } from "./Card";
import { Icon } from "./Icon";
import { SectionHeading } from "./SectionHeading";

/**
 * Required on `/` and `/home-care-agencies`. Plain words, no legal claims.
 * Content lives in src/content/health.ts.
 * Sits on an ivory-2 band (brief §8.3.7); the example card is the band's one dark object.
 */
export function HealthHandling({
  headingId = "health-handling",
  eyebrow = "Health businesses",
}: {
  headingId?: string;
  eyebrow?: string;
}) {
  return (
    <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <div>
        <SectionHeading
          id={headingId}
          eyebrow={eyebrow}
          title={healthHandling.title}
          intro={healthHandling.intro}
        />
        <ul className="mt-12 space-y-4">
          {healthHandling.points.map((point) => (
            <li key={point} className="flex gap-4">
              <Icon name="check" className="mt-1 size-5 shrink-0 text-brass on-dark:text-ivory" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* The one dark object in the (ivory-2) band: ivory and mist text, brass-line bar, never brass text. */}
      <Card as="article" tone="dark" className="lg:mt-24">
        <p className="text-eyebrow font-semibold uppercase tracking-[0.08em] text-ivory sm:tracking-[0.14em]">
          {healthHandling.example.label}
        </p>
        <p className="mt-2 text-small text-mist">A public reply to a kind review.</p>
        <blockquote className="mt-6 border-l-2 border-brass-line pl-5 font-serif text-xl leading-relaxed text-ivory">
          <p>{healthHandling.example.text}</p>
        </blockquote>
      </Card>
    </div>
  );
}
