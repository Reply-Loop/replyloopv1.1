import type { ReactNode } from "react";
import type { Crumb } from "@/lib/schema";
import { Breadcrumbs } from "./Breadcrumbs";
import { BookButton } from "./Button";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";
import { keepPhrases } from "@/lib/typography";

/** Inner-page hero: breadcrumbs, eyebrow, the page's one H1, intro, and the booking button. */
export function PageHero({
  crumbs,
  eyebrow,
  eyebrowShort,
  title,
  intro,
  showButton = true,
  backdrop,
  plate,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  /** Shorter eyebrow shown below 640px. */
  eyebrowShort?: string;
  title: ReactNode;
  intro: ReactNode;
  showButton?: boolean;
  /** Decorative art behind the hero (aria-hidden). Text stays on plain ivory. */
  backdrop?: ReactNode;
  /**
   * Phone and tablet hero art (a <HeroPlate>, aria-hidden), shown below lg only: under the
   * booking button, or under the intro when the hero has no button. Desktop keeps `backdrop`.
   */
  plate?: ReactNode;
}) {
  return (
    <section
      aria-labelledby="page-title"
      className="relative overflow-hidden border-b border-rule pt-8 pb-16 sm:pt-12 sm:pb-20"
    >
      {backdrop}
      <Container className="relative">
        <Breadcrumbs crumbs={crumbs} />
        <div
          className={
            backdrop
              ? "lg:max-w-[calc(100%-25rem)] xl:max-w-[calc(100%-29rem)]"
              : undefined
          }
        >
          <Eyebrow short={eyebrowShort} className="mt-12">
            {eyebrow}
          </Eyebrow>
          <h1
            id="page-title"
            className="mt-5 max-w-4xl font-serif text-h1 font-medium"
          >
            {keepPhrases(title)}
          </h1>
          <div className="mt-6 max-w-lede text-lede text-slate [&>p+p]:mt-4">
            {typeof intro === "string" ? <p>{intro}</p> : intro}
          </div>
          {showButton ? (
            <div data-hero-cta className="mt-8">
              <BookButton />
            </div>
          ) : null}
          {plate ? <div className="mt-8 lg:hidden">{plate}</div> : null}
        </div>
      </Container>
    </section>
  );
}
