import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { BookButton, TextLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FAQ } from "@/components/ui/FAQ";
import { HealthHandling } from "@/components/ui/HealthHandling";
import { Icon } from "@/components/ui/Icon";
import { InsetRule } from "@/components/ui/InsetRule";
import { LoopDivider } from "@/components/ui/LoopDivider";
import { PillarCard } from "@/components/ui/PillarCard";
import { PromiseList } from "@/components/ui/PromiseList";
import { ProofSlot } from "@/components/ui/ProofSlot";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { homeSteps as steps } from "@/content/steps";
import { faqs } from "@/content/faq";
import { trustCue } from "@/content/promises";
import { bundlePillars, oneTimeProjects } from "@/content/services";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import Link from "next/link";
import { HeroVisual } from "@/components/hero/HeroVisual";
import { HowItWorksJourney } from "@/components/scenes/HowItWorksJourney";
import { ProblemScene } from "@/components/scenes/ProblemScene";
import { FilmFeature } from "@/components/film/FilmFeature";
import { ProofPanel } from "@/components/home/ProofPanel";
import { PageBody } from "@/components/motion/PageBody";

// Primary keyword: Google review replies for local health businesses.
export const metadata: Metadata = pageMetadata({
  title: "Google Review Replies for Local Health Businesses | ReplyLoop",
  absoluteTitle: true,
  description:
    "We answer every Google review in your voice and keep your profile active, for home care agencies and local health businesses in Salt Lake County, Utah.",
  path: "/",
});

const problems = [
  {
    title: "Kind reviews with no reply",
    body: "A customer took the time to say thank you on Google. The thank you is still sitting there, unanswered.",
  },
  {
    title: "A quiet Google profile",
    body: "Your profile has not changed in months, so it says little about the work you do every day.",
  },
  {
    title: "A website with no clear next step",
    body: "A family ready to call has to hunt for how. The next step should be plain.",
  },
];

const fit = [
  "You run a home care agency or a local health practice in Utah.",
  "Customers leave kind reviews that go unanswered.",
  "You want every customer asked for a review the same way.",
  "You want to see the work and check the results yourself.",
];

const notFit = [
  "You want only happy customers asked for reviews.",
  "You want reviews rewarded in any way.",
  "You want public replies that confirm who is a patient.",
  "You want a service you do not need.",
];

/** "You keep the keys." and "We ask every customer the same way.", from the one trustCue string. */
const trustFacts = trustCue.split(/(?<=\.)\s+/);

export default function HomePage() {
  return (
    <>
      {/* 1. Hero. The H1 is locked (D-027, 2026-11-20). Do not A/B, soften, or replace it. */}
      <section aria-labelledby="hero-title" className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24">
        {/* 7/5 grid (brief §8.2): text in 7 columns, the loop in 5, centred on each other. */}
        <Container className="grid items-center gap-y-12 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-7">
            <Eyebrow>{site.tagline}</Eyebrow>
            <h1
              id="hero-title"
              className="mt-6 max-w-4xl font-serif text-h1 font-medium"
            >
              Your next customer is reading your unanswered Google reviews.
            </h1>
            <p className="mt-7 max-w-[34rem] text-lede text-slate">
              Built for home care agencies and local health practices in Salt Lake County and across Utah.
              We answer every Google review in your voice and keep your Google profile, Facebook, and
              Instagram active.
            </p>
            {/* data-hero-cta: the MobileBar appears only once this has scrolled out of view. */}
            <div data-hero-cta className="mt-12 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
              <BookButton />
              <TextLink href="#how-it-works">See how it works</TextLink>
            </div>
            {/* The trust cue as two facts, split at its first period (verbatim), stacked on phones. */}
            <ul className="mt-8 flex flex-col gap-3 text-small text-charcoal sm:flex-row sm:items-center sm:gap-0">
              {trustFacts.map((fact, i) => (
                <li
                  key={fact}
                  className={i > 0 ? "flex items-center gap-2 sm:ml-5 sm:border-l sm:border-rule sm:pl-5" : "flex items-center gap-2"}
                >
                  <Icon name={i === 0 ? "key" : "loop"} className="size-4 shrink-0 text-brass" />
                  {fact}
                </li>
              ))}
            </ul>
          </div>
          <HeroVisual className="w-full lg:col-span-5" />
        </Container>
      </section>

      {/* Everything below the hero is one route-transition group; the hero (and its LCP H1) never animates. */}
      <PageBody>
        {/*
          Surfaces (brief §6.1, §8.3): ivory hero | inset rule | ivory problem | charcoal bundle |
          ivory journey | ivory-2 film | ivory promises | ivory-2 health | ivory proof |
          ivory-2 fit + FAQ (one band, FAQ tucked under) | the one loop divider | charcoal CTA band | footer.
          Two dark bands plus the footer. Same surfaces touch only across the inset rule, and in the
          fit + FAQ + divider run, which is one ivory-2 band by design.
          Heading variants (§6.8): statement, split, default, (film: none), statement, health
          (a split body; HealthHandling sets the heading's variant), default, split, compact, then
          the CTA band's statement. Never three identical in a row.
        */}

        {/* The hero and the problem band are both ivory: a quiet inset rule between them (§8.3.1). */}
        <InsetRule />

        {/* 2. Problem. The film no longer sits here: it has its own band after How it works (§8.3.3). */}
        <Section labelledBy="problem-title" rhythm="loose">
          <SectionHeading
            id="problem-title"
            variant="statement"
            eyebrow="What we see"
            title="The thank you is already there. It just has no answer."
            intro="None of this means the service is poor. It means nobody has had the time to answer it."
          />
          <ProblemScene className="mt-12" />
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {problems.map((p, i) => (
              <Card as="li" key={p.title} reveal={i}>
                <h3 className="font-serif text-h3 font-medium">{p.title}</h3>
                <p className="mt-3 text-slate">{p.body}</p>
              </Card>
            ))}
          </ul>
          <p className="mt-8 max-w-lede text-lede">That is the part we take on.</p>
        </Section>

        {/* 3. The bundle. Charcoal, with dark pillar cards: no ivory slab on charcoal (brief §8.3.4). */}
        <Section tone="charcoal" labelledBy="bundle-title" id="bundle" rhythm="loose">
          <SectionHeading
            id="bundle-title"
            variant="split"
            eyebrow="The monthly work"
            title="One bundle, built around your reviews"
            intro="Answered well, every honest review becomes part of the foundation the next customer stands on."
          />
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {bundlePillars.map((pillar, i) => (
              <PillarCard key={pillar.title} pillar={pillar} tone="dark" reveal={i} />
            ))}
          </ul>
          <p className="mt-8 max-w-3xl text-mist">
            Also available as one-time projects:{" "}
            {oneTimeProjects.map((p, i) => (
              <span key={p.href}>
                <Link href={p.href} className="text-ivory underline decoration-brass-line underline-offset-4 hover:decoration-2">
                  {p.label}
                </Link>
                {i < oneTimeProjects.length - 1 ? " and " : "."}
              </span>
            ))}
          </p>
          <p className="mt-4 max-w-3xl text-mist">
            <Link href="/services" className="text-ivory underline decoration-brass-line underline-offset-4 hover:decoration-2">
              See every service
            </Link>
          </p>
        </Section>

        {/* 4. How it works */}
        {/* Reveals are per block; never on the journey stage or its ancestors (a transform would break the sticky stage). */}
        <Section labelledBy="how-title" id="how-it-works" rhythm="loose">
          <SectionHeading
            id="how-title"
            variant="default"
            eyebrow="How it works"
            title="Four steps, and nothing goes out early"
            intro="Setup includes your voice interview, a one-time audit of your online presence, and replies to the Google reviews already waiting."
          />
          <HowItWorksJourney steps={steps} />
        </Section>

        {/* 5. The brand film: its own ivory-2 band, a split of film frame and HTML caption, no section heading (§8.3.3). */}
        <Section tone="ivory-2" id="film">
          <FilmFeature />
        </Section>

        {/* 6. Promises: the editorial list (Option B, §8.3.6). */}
        <Section labelledBy="promises-title" id="promises" rhythm="loose">
          <SectionHeading
            id="promises-title"
            variant="statement"
            eyebrow="What we will not bend"
            title="Seven promises we keep"
            intro="These hold even when bending them would win a sale."
          />
          <PromiseList variant="list" className="mt-12" />
        </Section>

        {/* 7. Health handling. ivory-2 band with one dark example card, so the page keeps two dark bands plus the footer (brief §6.1, §8.3.7). */}
        <Section tone="ivory-2" labelledBy="health-handling" rhythm="loose">
          <HealthHandling />
        </Section>

        {/* 8. Proof. An honest "what you can check" panel (§8.3.8): no invented numbers, quotes, or logos. */}
        <Section labelledBy="proof-title" rhythm="loose">
          <SectionHeading
            id="proof-title"
            variant="default"
            eyebrow="Proof"
            title="We would rather show you a real profile than invent a number."
            intro="On the intro call, we can look at your Google profile as it is today and agree on how you will check the work."
          />
          <ProofPanel className="mt-12" />
          {/* Slots for real proof later. In production they render nothing, and empty:hidden drops the gap with them. */}
          <div className="mt-12 grid gap-6 empty:hidden md:grid-cols-2">
            <ProofSlot kind="testimonial" label="Client testimonial (written permission first)" path="src/content/proof.ts" />
            <ProofSlot kind="profile-before-after" label="Before and after profile screenshots" path="public/proof/" />
            <ProofSlot kind="client-logos" label="Client logos (written permission first)" path="public/proof/logos/" />
          </div>
        </Section>

        {/*
          9. Fit, with the FAQ tucked under it: one continuous ivory-2 band. Fit's bottom padding
          drops to the tight rhythm so the seam reads as a gap inside the band, not a new band.
        */}
        <Section tone="ivory-2" labelledBy="fit-title" rhythm="loose" className="pb-16 sm:pb-20 lg:pb-24">
          <SectionHeading id="fit-title" variant="split" eyebrow="Fit" title="Is this a fit?" />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* A fit: the raised paper card. */}
            <Card>
              <h3 className="reveal font-serif text-h3-lg font-medium" style={{ "--i": 0 } as CSSProperties}>
                This is a fit if…
              </h3>
              <ul className="mt-6 space-y-4">
                {fit.map((line, i) => (
                  <li key={line} className="reveal flex gap-3" style={{ "--i": Math.min(i + 1, 4) } as CSSProperties}>
                    <Icon name="check" className="mt-1 size-5 shrink-0 text-brass" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </Card>
            {/* Not a fit: a quieter surface (the band's own ivory-2, a rule border, no shadow), never alarm colours. */}
            <div className="rounded-card border border-rule bg-ivory-2 p-6 text-charcoal sm:p-8">
              <h3 className="reveal font-serif text-h3-lg font-medium" style={{ "--i": 0 } as CSSProperties}>
                This is not a fit if…
              </h3>
              <ul className="mt-6 space-y-4">
                {notFit.map((line, i) => (
                  <li key={line} className="reveal flex gap-3" style={{ "--i": Math.min(i + 1, 4) } as CSSProperties}>
                    <Icon name="close" className="mt-1 size-5 shrink-0 text-slate" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* 10. FAQ teasers, tucked under Fit on the same surface. Answers kept to the 65ch measure. */}
        <Section tone="ivory-2" labelledBy="faq-title" rhythm="tight" className="pt-0 sm:pt-0 lg:pt-0">
          <SectionHeading id="faq-title" variant="compact" eyebrow="Questions" title="Common questions" />
          <FAQ items={faqs.slice(0, 4)} className="mt-12 [&_.faq-answer]:max-w-measure" />
          <div className="mt-8">
            <TextLink href="/faq">Read every question</TextLink>
          </div>
        </Section>

        {/* 11. The page's one loop divider, before the closing sequence (§8.1, §8.3.11). The CTA band follows from the root layout. */}
        <LoopDivider tone="ivory-2" />
      </PageBody>
    </>
  );
}
