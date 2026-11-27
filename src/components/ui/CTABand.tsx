import { site } from "@/lib/site";
import { BookButton, EmailLink, PhoneLink } from "./Button";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";

/**
 * The same closing band on every page. Rendered once in the root layout.
 * No scripture on any page that asks for a call (D-024).
 */
export function CTABand() {
  return (
    <section aria-labelledby="cta-band-title" className="tone-dark bg-charcoal py-20 text-ivory sm:py-24">
      <Container size="narrow" className="text-center">
        <Eyebrow centered>{site.tagline}</Eyebrow>
        <h2
          id="cta-band-title"
          className="mx-auto mt-6 max-w-[26ch] font-serif text-display"
        >
          Bring the <span className="whitespace-nowrap">thank you</span> where the next customer can see it.
        </h2>
        <p className="mx-auto mt-5 max-w-lede text-lede text-mist">
          A short call to see what is actually missing.
        </p>
        <div className="mt-8 flex flex-col items-center gap-6">
          <BookButton />
          <div className="flex flex-col items-center gap-3 text-mist sm:flex-row sm:gap-8">
            <PhoneLink className="text-ivory" />
            <EmailLink className="text-ivory" />
          </div>
        </div>
      </Container>
    </section>
  );
}
