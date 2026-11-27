import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookButton, EmailLink, PhoneLink, TextLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FAQ } from "@/components/ui/FAQ";
import { HealthHandling } from "@/components/ui/HealthHandling";
import { LoopDivider } from "@/components/ui/LoopDivider";
import { PillarCard } from "@/components/ui/PillarCard";
import { PromiseList } from "@/components/ui/PromiseList";
import { ProofSlot } from "@/components/ui/ProofSlot";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StepList } from "@/components/ui/StepList";

/**
 * Development-only component gallery. Returns 404 in production builds
 * and is excluded from the sitemap. Sample text here is structural only.
 */
export const metadata: Metadata = {
  title: "Component gallery",
  robots: { index: false, follow: false },
};

export default function StyleguidePage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <>
      <Section labelledBy="sg-title">
        <SectionHeading
          as="h1"
          id="sg-title"
          eyebrow="Development only"
          title="Component gallery"
          intro="Every reusable piece, on ivory and on charcoal."
        />
        <div className="mt-12 flex flex-wrap items-center gap-6">
          <BookButton />
          <TextLink href="#steps">Text link</TextLink>
          <PhoneLink />
          <EmailLink />
        </div>
      </Section>
      <LoopDivider animate />
      <Section labelledBy="sg-cards">
        <SectionHeading id="sg-cards" variant="split" eyebrow="PillarCard" title="Cards" />
        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          <PillarCard
            pillar={{
              icon: "reply",
              title: "Sample pillar",
              need: "One sentence on the owner's need.",
              what: "One sentence on what ReplyLoop does.",
              href: "/services",
            }}
          />
          <PillarCard
            pillar={{
              icon: "pin",
              title: "Second pillar",
              need: "One sentence on the owner's need.",
              what: "One sentence on what ReplyLoop does.",
            }}
          />
        </ul>
      </Section>
      <Section tone="charcoal" labelledBy="sg-steps" id="steps">
        <SectionHeading id="sg-steps" variant="default" eyebrow="StepList on charcoal" title="Steps" />
        <StepList
          className="mt-12"
          steps={[
            { title: "First", body: "Short body text." },
            { title: "Second", body: "Short body text." },
            { title: "Third", body: "Short body text." },
            { title: "Fourth", body: "Short body text." },
          ]}
        />
        <Card className="mt-12">
          <p>An ivory card on charcoal keeps charcoal text.</p>
          <div className="mt-4">
            <TextLink href="#steps">Link inside a card</TextLink>
          </div>
        </Card>
      </Section>
      <Section rhythm="loose" labelledBy="sg-promises">
        <SectionHeading id="sg-promises" variant="statement" eyebrow="PromiseList" title="Promises" />
        <PromiseList className="mt-12" />
      </Section>
      <Section tone="charcoal" labelledBy="sg-promises-dark">
        <SectionHeading id="sg-promises-dark" variant="default" eyebrow="PromiseList on charcoal" title="Promises" />
        <PromiseList className="mt-12" />
      </Section>
      <Section labelledBy="health-handling">
        <HealthHandling />
      </Section>
      <Section labelledBy="sg-proof">
        <SectionHeading id="sg-proof" eyebrow="ProofSlot" title="Proof slots" />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <ProofSlot kind="testimonial" label="Testimonial" path="src/content/proof/testimonials.ts" />
          <ProofSlot kind="founder-photo" label="Founder photo" path="public/people/founders.jpg" />
        </div>
      </Section>
      <Section rhythm="tight" labelledBy="sg-faq">
        <SectionHeading id="sg-faq" variant="compact" eyebrow="FAQ" title="Accordion" />
        <FAQ
          className="mt-12"
          items={[
            { question: "Sample question one?", answer: "Sample answer.\n\nSecond paragraph." },
            { question: "Sample question two?", answer: "Sample answer." },
          ]}
        />
      </Section>
    </>
  );
}
