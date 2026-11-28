import type { ReactNode } from "react";
import type { Crumb } from "@/lib/schema";
import { Breadcrumbs } from "./Breadcrumbs";
import { BookButton } from "./Button";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";

/** Inner-page hero: breadcrumbs, eyebrow, the page's one H1, intro, and the booking button. */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  intro,
  showButton = true,
  backdrop,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  showButton?: boolean;
  /** Decorative art behind the hero (aria-hidden). Text stays on plain ivory. */
  backdrop?: ReactNode;
}) {
  return (
    <section
      aria-labelledby="page-title"
      className="relative overflow-hidden border-b border-rule pt-10 pb-16 sm:pt-12 sm:pb-20"
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
          <Eyebrow className="mt-12">{eyebrow}</Eyebrow>
          <h1
            id="page-title"
            className="mt-5 max-w-4xl font-serif text-[2.4rem] font-medium sm:text-5xl lg:text-[3.6rem]"
          >
            {title}
          </h1>
          <div className="mt-6 max-w-2xl text-lg leading-relaxed text-slate sm:text-xl [&>p+p]:mt-4">
            {typeof intro === "string" ? <p>{intro}</p> : intro}
          </div>
          {showButton ? (
            <div className="mt-9">
              <BookButton />
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
