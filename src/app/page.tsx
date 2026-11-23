import { BookButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { trustCue } from "@/content/promises";
import { site } from "@/lib/site";

/**
 * Phase 1 shell. The full home page arrives in Phase 2.
 * The H1 is locked (D-027, 2026-11-20). Do not A/B, soften, or replace it.
 */
export default function HomePage() {
  return (
    <section aria-labelledby="hero-title" className="py-20 sm:py-28">
      <Container>
        <Eyebrow>{site.tagline}</Eyebrow>
        <h1
          id="hero-title"
          className="mt-6 max-w-4xl font-serif text-[2.6rem] font-medium sm:text-6xl lg:text-[4.5rem]"
        >
          Your next customer is reading your unanswered Google reviews.
        </h1>
        <div className="mt-10">
          <BookButton />
        </div>
        <p className="mt-6 text-slate">{trustCue}</p>
      </Container>
    </section>
  );
}
