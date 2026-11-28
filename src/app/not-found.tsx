import { TextLink } from "@/components/ui/Button";
import { Rule } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";

/**
 * 404 (brief §8.14): text-led, no art. One ivory paper band in the default rhythm; the
 * root layout's CTA band (the invitation card) and footer close the page. The H1 never
 * carries a reveal. The link gets a 44px-tall tap target.
 */
export default function NotFound() {
  return (
    <Section labelledBy="not-found-title" containerSize="narrow">
      <Rule className="mb-6" />
      <h1 id="not-found-title" className="max-w-[18ch] font-serif text-h1 font-medium">
        This page is not here.
      </h1>
      <p className="mt-5 max-w-lede text-lede text-slate">
        The link may be old, or the page may have moved.
      </p>
      <div className="mt-8">
        <TextLink href="/" className="min-h-11">
          Go to the home page
        </TextLink>
      </div>
    </Section>
  );
}
