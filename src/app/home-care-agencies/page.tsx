import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card, cardLinkOverlay } from "@/components/ui/Card";
import { TextLink } from "@/components/ui/Button";
import { FAQ } from "@/components/ui/FAQ";
import { HealthHandling } from "@/components/ui/HealthHandling";
import { Icon } from "@/components/ui/Icon";
import { LoopDivider } from "@/components/ui/LoopDivider";
import { PageHero } from "@/components/ui/PageHero";
import { RibbonBackdrop } from "@/components/scenes/RibbonBackdrop";
import { HeroPlate } from "@/components/scenes/HeroPlate";
import { PromiseList } from "@/components/ui/PromiseList";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StepList } from "@/components/ui/StepList";
import { faqs } from "@/content/faq";
import { allPostMeta } from "@/content/posts";
import { bundlePillars } from "@/content/services";
import { breadcrumbSchema, graph, serviceSchema, type Crumb } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/cn";
import { PageBody } from "@/components/motion/PageBody";

// Primary keyword: home care agency SEO Utah. Audience: owners and administrators.
const path = "/home-care-agencies";

export const metadata: Metadata = pageMetadata({
  title: "Home Care Agency SEO in Utah | Review Replies | ReplyLoop",
  absoluteTitle: true,
  description:
    "Home care agency SEO in Utah, built on your Google reviews: replies in your voice, an active Google profile, and nothing private in public.",
  path,
});

const crumbs: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Home care agencies", path },
];

const cities = [
  "Salt Lake City",
  "Murray",
  "South Salt Lake",
  "Millcreek",
  "Holladay",
  "Cottonwood Heights",
  "Midvale",
  "Sandy",
  "Draper",
  "West Valley City",
  "South Jordan",
];

const steps = [
  { title: "Intro call", body: "A short call with the owner or administrator to see what is actually missing." },
  { title: "Voice interview", body: "We learn how your agency talks about its work, and we audit your online presence once." },
  { title: "Dry run", body: "A practice round you read first. Nothing goes out in your agency's name before this." },
  { title: "Go live, in the open", body: "Replies and monthly posts begin. You can see the work, and you approve each month's posts." },
];

const homeCareFaqs = faqs.filter((f) =>
  [
    "How do you handle reviews for a home care agency or clinic?",
    "What happens with a review of 3 stars or lower?",
    "Do you ask only happy customers for reviews?",
    "What do you need from me to start?",
    "Where do you work?",
  ].includes(f.question),
);

/** The trust section's key sentence, verbatim from its intro, echoed as an aria-hidden pull-quote. */
const PULL_QUOTE = "When every review gets a reply, the family sees an owner who pays attention.";

/** A pillar's first sentence, verbatim (the bundle strip shows one line per pillar). */
const firstSentence = (text: string) => text.slice(0, text.indexOf(". ") + 1 || text.length);

export default function HomeCarePage() {
  return (
    <>
      <PageHero
        backdrop={<RibbonBackdrop />}
        plate={<HeroPlate variant="hca" />}
        crumbs={crumbs}
        eyebrow="For home care owners and administrators"
        eyebrowShort="For home care owners"
        title="Home care agency SEO and review replies in Utah"
        intro={
          <>
            <p>
              Many families choosing home care look you up on Google before they call. We help your agency answer every review
              in your voice, keep your Google profile active, and make the next step plain.
            </p>
            <p>And we never put anything private in public.</p>
          </>
        }
      />
      <PageBody>
        {/*
          Surfaces (brief §6.1, §8.6): ivory hero | ivory trust | ivory-2 health (its dark example
          card) | ivory bundle | ivory-2 area | charcoal steps | ivory promises | ivory-2 questions
          and reading | the one loop divider (ivory-2) | charcoal CTA band | footer. One dark band
          here plus the CTA band and the footer; no two neighbouring bands share a surface (the hero
          closes on its own bottom rule, as on every inner page).
          Heading variants: default (trust, beside the pull-quote), the health split, split, default
          (area, beside the chips), default, default, compact, compact.
        */}

        {/* Trust: a split, with the section's key sentence echoed as a pull-quote in cols 7-12. */}
        <Section labelledBy="trust-title">
          <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-8">
            <div className="lg:col-span-5">
              <SectionHeading
                id="trust-title"
                eyebrow="Trust"
                title="In home care, reviews carry more weight"
                intro={
                  <>
                    <p>
                      A family is choosing who comes into a parent&apos;s home. Honest reviews, answered with care, are some of
                      the few things they can check before they pick up the phone.
                    </p>
                    <p>
                      When a kind review sits unanswered, the thank you is left hanging. When every review gets a reply, the
                      family sees an owner who pays attention. Faithful in small things, every time.
                    </p>
                  </>
                }
              />
            </div>
            {/* aria-hidden: a visual echo of a sentence already read in the intro. Desktop only. */}
            <div
              aria-hidden
              className="reveal hidden lg:col-span-6 lg:col-start-7 lg:block"
              style={{ "--i": 3 } as CSSProperties}
            >
              <span className="block h-px w-12 bg-brass" />
              <p className="hca-pullquote mt-6 text-charcoal">{PULL_QUOTE}</p>
            </div>
          </div>
        </Section>

        {/* ivory-2 band with the sticky dark example card (brief §8.6, §8.3.7). */}
        <Section tone="ivory-2" labelledBy="health-handling">
          <HealthHandling eyebrow="Review sensitivity" />
        </Section>

        {/* The bundle as one compact 4-up strip (not home's 2x2 cards or the /services spec sheet). */}
        <Section labelledBy="visibility-title">
          <SectionHeading
            id="visibility-title"
            variant="split"
            eyebrow="Local visibility"
            title="What we do for your agency each month"
            intro="Local SEO for home care agencies starts with your Google Business Profile, your listing on Google Search and Maps."
          />
          <Card size="md" className="mt-12">
            <ul className="grid lg:grid-cols-4">
              {bundlePillars.map((pillar, i) => (
                <li
                  key={pillar.title}
                  style={{ "--i": Math.min(i, 4) } as CSSProperties}
                  className="reveal border-t border-rule py-6 first:border-t-0 first:pt-0 last:pb-0 lg:border-t-0 lg:border-l lg:px-7 lg:py-0 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0"
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-md border border-rule text-brass">
                    <Icon name={pillar.icon} className="size-5" />
                  </span>
                  <h3 className="mt-4 font-serif text-h3 font-medium text-charcoal">{pillar.title}</h3>
                  <p className="mt-2 text-small text-slate">{firstSentence(pillar.what)}</p>
                </li>
              ))}
            </ul>
          </Card>
          <div className="mt-8 flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <p className="max-w-3xl text-slate">
              Also available as one-time projects:{" "}
              <Link href="/services/websites" className="text-charcoal underline decoration-brass underline-offset-4">
                a website for your agency
              </Link>{" "}
              and{" "}
              <Link href="/services/owner-qa-videos" className="text-charcoal underline decoration-brass underline-offset-4">
                owner Q&amp;A videos
              </Link>
              .
            </p>
            <TextLink href="/services" className="min-h-11 shrink-0">
              See every service
            </TextLink>
          </div>
        </Section>

        {/* Where we work: heading in cols 1-5, the named cities as chips in cols 7-12. No map. */}
        <Section tone="ivory-2" labelledBy="area-title">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-x-8">
            <div className="lg:col-span-5">
              <SectionHeading
                id="area-title"
                eyebrow="Where we work"
                title="Home care agencies across Salt Lake County and Utah"
                intro="We are based in Salt Lake County. We work with home care agencies in these cities and across Utah:"
              />
            </div>
            <ul
              className="reveal flex flex-wrap gap-3 lg:col-span-6 lg:col-start-7"
              style={{ "--i": 3 } as CSSProperties}
            >
              {cities.map((c) => (
                <li
                  key={c}
                  className="flex items-center gap-2 rounded-pill border border-rule bg-paper px-4 py-2 text-charcoal shadow-1"
                >
                  <Icon name="pin" className="size-4 shrink-0 text-brass" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section tone="charcoal" labelledBy="steps-title">
          <SectionHeading id="steps-title" eyebrow="How it works" title="Four steps, and nothing goes out early" />
          <StepList steps={steps} className="mt-12" />
        </Section>

        {/* Promises, Option A (brief §8.3.6): six in a ruled 3-column grid, #7 as the closing ink-2 row. */}
        <Section labelledBy="promises-title">
          <SectionHeading id="promises-title" eyebrow="What we will not bend" title="Seven promises we keep" />
          <PromiseList variant="grid" className="mt-12" />
        </Section>

        <Section tone="ivory-2" labelledBy="hc-faq-title" rhythm="tight">
          <SectionHeading id="hc-faq-title" variant="compact" eyebrow="Questions" title="Questions home care owners ask" />
          <FAQ items={homeCareFaqs} className="mt-12" />
        </Section>

        {/* Same ivory-2 band as the questions, continued (no top padding). */}
        <Section tone="ivory-2" labelledBy="reading-title" rhythm="tight" className="pt-0 sm:pt-0 lg:pt-0">
          <SectionHeading id="reading-title" variant="compact" eyebrow="Reading" title="Guides for home care owners" />
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {/* The reveal sits on the <li>, so the card's hover lift is never held by the animation. */}
            {allPostMeta.map((p, i) => (
              <li key={p.slug} className="reveal" style={{ "--i": Math.min(i, 4) } as CSSProperties}>
                <Card interactive className="flex h-full flex-col">
                  <h3 className="font-serif text-h3 font-medium">
                    <Link
                      href={`/blog/${p.slug}`}
                      className={cn(
                        cardLinkOverlay,
                        "underline decoration-transparent decoration-1 underline-offset-4 hover:decoration-brass focus-visible:decoration-brass",
                      )}
                    >
                      {p.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-slate">{p.description}</p>
                </Card>
              </li>
            ))}
          </ul>
        </Section>

        {/* The page's one loop divider, before the closing CTA band (brief §8.1). */}
        <LoopDivider tone="ivory-2" />
      </PageBody>
      <JsonLd
        data={graph(
          serviceSchema({
            name: "Home care agency SEO and review replies",
            description:
              "Google review replies, Google Business Profile care, and monthly social content for home care agencies in Utah.",
            path,
            serviceType: "Local SEO and review management for home care agencies",
          }),
          breadcrumbSchema(crumbs),
        )}
      />
    </>
  );
}
