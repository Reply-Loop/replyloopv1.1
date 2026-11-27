import { site } from "@/lib/site";
import { BookButton, EmailLink, PhoneLink } from "./Button";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";
import { Sprite } from "./Sprite";

/**
 * The same closing band on every page. Rendered once in the root layout.
 * No scripture on any page that asks for a call (D-024).
 *
 * An "invitation card" (brief §8.1): the band stays charcoal with the felt
 * grain; inside it, a contained ink-2 card with a decorative brass-line
 * border. Left: the statement, the one button, and phone and email as quiet
 * text links. Right (md and up): the loop as a brass-line stroke drawing,
 * decorative only (not the filled logo mark). Below the card, 96px of charcoal
 * and a full-bleed hairline (the section's bottom border) set the footer apart,
 * so band and footer read as two pieces. No brass text anywhere on this band.
 *
 * `data-cta-band` hides the mobile bar while the band is on screen.
 */
export function CTABand() {
  return (
    <section
      data-cta-band
      aria-labelledby="cta-band-title"
      className="tone-dark felt border-b border-hairline-dark pt-24 pb-24 text-ivory sm:pt-32"
    >
      <Container>
        <div className="mx-auto max-w-5xl rounded-xl border border-[rgb(184_137_74/0.25)] bg-ink-2 p-6 sm:p-8 md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-12 lg:gap-16 lg:p-16">
          <div>
            <Eyebrow>{site.tagline}</Eyebrow>
            <h2
              id="cta-band-title"
              className="mt-5 max-w-[22ch] font-serif text-h2 max-sm:font-medium sm:text-display sm:[font-size:min(var(--text-display),3.5rem)]"
            >
              Bring the <span className="whitespace-nowrap">thank you</span> where the next customer can see it.
            </h2>
            <p className="mt-5 max-w-lede text-lede text-mist">
              A short call to see what is actually missing.
            </p>
            <div className="mt-8 flex flex-col items-start gap-6">
              <BookButton />
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8">
                <PhoneLink className="text-ivory" />
                <EmailLink className="text-ivory" />
              </div>
            </div>
          </div>
          <div aria-hidden className="hidden md:block">
            <Sprite id="loop" className="w-40 text-brass-line" strokeWidth={1.5} />
          </div>
        </div>
      </Container>
    </section>
  );
}
