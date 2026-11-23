import type { Metadata } from "next";
import { BookButton, TextLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FAQ } from "@/components/ui/FAQ";
import { HealthHandling } from "@/components/ui/HealthHandling";
import { Icon } from "@/components/ui/Icon";
import { LoopDivider } from "@/components/ui/LoopDivider";
import { PillarCard } from "@/components/ui/PillarCard";
import { PromiseList } from "@/components/ui/PromiseList";
import { ProofSlot } from "@/components/ui/ProofSlot";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StepList, type Step } from "@/components/ui/StepList";
import { faqs } from "@/content/faq";
import { trustCue } from "@/content/promises";
import { bundlePillars, oneTimeProjects } from "@/content/services";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import Link from "next/link";

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

const steps: Step[] = [
  {
    title: "Intro call",
    body: "A short call to see what is actually missing. If you do not need something, we will not add it.",
  },
  {
    title: "Voice interview",
    body: "We learn how you talk about your work and how you say thank you. We also audit your online presence once.",
  },
  {
    title: "Dry run",
    body: "A practice round. We draft replies and posts, and you read them first. Nothing goes out in your name before this.",
  },
  {
    title: "Go live, in the open",
    body: "Replies and monthly posts begin, and you can see all of it. You approve each month's posts before they go out.",
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

export default function HomePage() {
  return (
    <>
      {/* 1. Hero. The H1 is locked (D-027, 2026-11-20). Do not A/B, soften, or replace it. */}
      <section aria-labelledby="hero-title" className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
        <Container>
          <Eyebrow>{site.tagline}</Eyebrow>
          <h1
            id="hero-title"
            className="mt-6 max-w-4xl font-serif text-[2.6rem] font-medium sm:text-6xl lg:text-[4.5rem]"
          >
            Your next customer is reading your unanswered Google reviews.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate sm:text-xl">
            Built for home care agencies and local health practices in Salt Lake County and across Utah.
            We answer every Google review in your voice and keep your Google profile, Facebook, and
            Instagram active.
          </p>
          <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
            <BookButton />
            <TextLink href="#how-it-works">See how it works</TextLink>
          </div>
          <p className="mt-8 flex items-center gap-2.5 text-[0.95rem] text-slate">
            <Icon name="key" className="size-4 shrink-0 text-brass" />
            {trustCue}
          </p>
        </Container>
        <HeroLoop />
      </section>

      <LoopDivider />

      {/* 2. Problem */}
      <Section labelledBy="problem-title">
        <SectionHeading
          id="problem-title"
          eyebrow="What we see"
          title="The thank you is already there. It just has no answer."
          intro="None of this means the service is poor. It means nobody has had the time to answer it."
        />
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {problems.map((p) => (
            <Card as="li" key={p.title}>
              <h3 className="font-serif text-xl font-medium">{p.title}</h3>
              <p className="mt-3 text-slate">{p.body}</p>
            </Card>
          ))}
        </ul>
        <p className="mt-10 max-w-2xl text-lg">That is the part we take on.</p>
      </Section>

      {/* 3. The bundle */}
      <Section tone="charcoal" labelledBy="bundle-title" id="bundle">
        <SectionHeading
          id="bundle-title"
          eyebrow="The monthly work"
          title="One bundle, built around your reviews"
          intro="Answered well, every honest review becomes part of the foundation the next customer stands on."
        />
        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {bundlePillars.map((pillar) => (
            <PillarCard key={pillar.title} pillar={pillar} />
          ))}
        </ul>
        <p className="mt-10 max-w-3xl text-mist">
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
      <Section labelledBy="how-title" id="how-it-works">
        <SectionHeading
          id="how-title"
          eyebrow="How it works"
          title="Four steps, and nothing goes out early"
          intro="Setup includes your voice interview, a one-time audit of your online presence, and replies to the Google reviews already waiting."
        />
        <StepList steps={steps} className="mt-14" />
      </Section>

      <LoopDivider />

      {/* 5. Promises */}
      <Section labelledBy="promises-title" id="promises">
        <SectionHeading
          id="promises-title"
          eyebrow="What we will not bend"
          title="Seven promises we keep"
          intro="These hold even when bending them would win a sale."
        />
        <PromiseList className="mt-12" />
      </Section>

      {/* 6. Health handling */}
      <Section tone="charcoal" labelledBy="health-handling">
        <HealthHandling />
      </Section>

      {/* 7. Proof. Placeholder only: no invented numbers, quotes, or logos. */}
      <Section labelledBy="proof-title">
        <SectionHeading
          id="proof-title"
          eyebrow="Proof"
          title="We would rather show you a real profile than invent a number."
          intro="On the intro call, we can look at your Google profile as it is today and agree on how you will check the work."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <ProofSlot kind="testimonial" label="Client testimonial (written permission first)" path="src/content/proof.ts" />
          <ProofSlot kind="profile-before-after" label="Before and after profile screenshots" path="public/proof/" />
        </div>
      </Section>

      <LoopDivider />

      {/* 8. Fit */}
      <Section labelledBy="fit-title">
        <SectionHeading id="fit-title" eyebrow="Fit" title="Is this a fit?" />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Card>
            <h3 className="font-serif text-2xl font-medium">This is a fit if…</h3>
            <ul className="mt-6 space-y-4">
              {fit.map((line) => (
                <li key={line} className="flex gap-3">
                  <Icon name="check" className="mt-1 size-5 shrink-0 text-brass" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3 className="font-serif text-2xl font-medium">This is not a fit if…</h3>
            <ul className="mt-6 space-y-4">
              {notFit.map((line) => (
                <li key={line} className="flex gap-3">
                  <Icon name="close" className="mt-1 size-5 shrink-0 text-slate" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      {/* 9. FAQ teasers */}
      <Section labelledBy="faq-title" className="pt-0 sm:pt-0 lg:pt-0">
        <SectionHeading id="faq-title" eyebrow="Questions" title="Common questions" />
        <FAQ items={faqs.slice(0, 4)} className="mt-10" />
        <div className="mt-8">
          <TextLink href="/faq">Read every question</TextLink>
        </div>
      </Section>
      {/* 10. The closing CTA band is rendered by the root layout on every page. */}
    </>
  );
}

/** A quiet, decorative loop behind the hero on large screens. */
function HeroLoop() {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 40 24"
      fill="none"
      className="pointer-events-none absolute top-1/2 -right-40 hidden h-[26rem] w-auto -translate-y-1/2 text-brass/15 lg:block"
    >
      <path
        d="M20 12C16.5 5.5 6 5.5 6 12s10.5 6.5 14 0 14-6.5 14 0-10.5 6.5-14 0Z"
        stroke="currentColor"
        strokeWidth={0.35}
        className="loop-trace"
      />
    </svg>
  );
}
