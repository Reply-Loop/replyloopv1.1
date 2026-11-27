import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookButton, EmailLink, PhoneLink, TextLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FAQ } from "@/components/ui/FAQ";
import { HealthHandling } from "@/components/ui/HealthHandling";
import { InsetRule } from "@/components/ui/InsetRule";
import { LoopDivider } from "@/components/ui/LoopDivider";
import { PillarCard } from "@/components/ui/PillarCard";
import { PromiseList } from "@/components/ui/PromiseList";
import { ProofSlot } from "@/components/ui/ProofSlot";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Sprite } from "@/components/ui/Sprite";
import { StepList } from "@/components/ui/StepList";
import { homeSteps } from "@/content/steps";
import { cn } from "@/lib/cn";
import { PauseDemo } from "./PauseDemo";

/**
 * Development-only component gallery. Returns 404 in production builds
 * and is excluded from the sitemap. Sample text here is structural only.
 */
export const metadata: Metadata = {
  title: "Component gallery",
  robots: { index: false, follow: false },
};

/**
 * Colour tokens from globals.css @theme, labelled by token name and hex only.
 * Class names are literal so Tailwind generates them. hairline-dark is
 * rgb(201 196 186 / 0.12), shown as 8-digit hex on a charcoal backing.
 */
const SWATCHES = [
  { name: "charcoal", hex: "#1B1F23", bg: "bg-charcoal" },
  { name: "ivory", hex: "#F8F5EF", bg: "bg-ivory" },
  { name: "brass", hex: "#8A5F1C", bg: "bg-brass" },
  { name: "brass-press", hex: "#74501A", bg: "bg-brass-press" },
  { name: "brass-line", hex: "#B8894A", bg: "bg-brass-line" },
  { name: "slate", hex: "#4A4F55", bg: "bg-slate" },
  { name: "mist", hex: "#C9C4BA", bg: "bg-mist" },
  { name: "rule", hex: "#E2DBCF", bg: "bg-rule" },
  { name: "ink-2", hex: "#262B30", bg: "bg-ink-2" },
  { name: "ivory-2", hex: "#F2EDE4", bg: "bg-ivory-2" },
  { name: "paper", hex: "#FBFAF6", bg: "bg-paper" },
  { name: "paper-shade", hex: "#EFE6D6", bg: "bg-paper-shade" },
  { name: "ink-3", hex: "#2F353B", bg: "bg-ink-3" },
  { name: "brass-shadow", hex: "#5C3E12", bg: "bg-brass-shadow" },
  { name: "brass-light", hex: "#C49A5A", bg: "bg-brass-light" },
  { name: "hairline-dark", hex: "#C9C4BA1F", bg: "bg-hairline-dark", backing: "bg-charcoal" },
] as const;

/** One line per text-* token, set in that token and labelled by its name. */
const TYPE_SCALE = [
  { name: "text-display", cls: "font-serif text-display" },
  { name: "text-h1", cls: "font-serif text-h1 font-medium" },
  { name: "text-h2", cls: "font-serif text-h2 font-medium" },
  { name: "text-h2-compact", cls: "font-serif text-h2-compact font-medium" },
  { name: "text-h3-lg", cls: "font-serif text-h3-lg font-medium" },
  { name: "text-h3", cls: "font-serif text-h3 font-medium" },
  { name: "text-numeral", cls: "font-serif text-numeral font-medium" },
  { name: "text-lede", cls: "text-lede" },
  { name: "text-body", cls: "text-body" },
  { name: "text-prose", cls: "text-prose" },
  { name: "text-small", cls: "text-small" },
  { name: "text-eyebrow", cls: "text-eyebrow font-semibold" },
] as const;

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
      <Section tone="ivory-2" rhythm="tight">
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 xl:grid-cols-8">
          {SWATCHES.map((swatch) => (
            <li key={swatch.name}>
              <div
                aria-hidden
                className={cn(
                  "h-20 overflow-hidden rounded-sm border border-rule",
                  "backing" in swatch ? swatch.backing : undefined,
                )}
              >
                <div className={cn("size-full", swatch.bg)} />
              </div>
              <p className="mt-3 wrap-break-word text-small font-semibold text-charcoal">{swatch.name}</p>
              <p className="wrap-break-word font-mono text-small text-slate">{swatch.hex}</p>
            </li>
          ))}
        </ul>
      </Section>
      <Section rhythm="tight">
        <ul>
          {TYPE_SCALE.map((token) => (
            <li key={token.name} className="border-t border-rule py-4 first:border-t-0 first:pt-0">
              <p className={cn("wrap-break-word text-charcoal", token.cls)}>{token.name}</p>
            </li>
          ))}
        </ul>
      </Section>
      <InsetRule tone="ivory" />
      <Section labelledBy="sg-heading-statement">
        <div className="flex flex-col gap-24">
          <SectionHeading
            id="sg-heading-statement"
            variant="statement"
            title={homeSteps[0].title}
            intro={homeSteps[0].body}
          />
          <SectionHeading
            id="sg-heading-split"
            variant="split"
            eyebrow="Development only"
            title={homeSteps[1].title}
            intro={homeSteps[1].body}
          />
          <SectionHeading
            id="sg-heading-default"
            variant="default"
            eyebrow="Development only"
            title={homeSteps[2].title}
            intro={homeSteps[2].body}
          />
          <SectionHeading
            id="sg-heading-compact"
            variant="compact"
            title={homeSteps[3].title}
            intro={homeSteps[3].body}
          />
        </div>
      </Section>
      <LoopDivider />
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
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Card>
            <h3 className="font-serif text-h3-lg font-medium text-charcoal">Sample pillar</h3>
            <p className="mt-3 text-slate">One sentence on the owner&apos;s need.</p>
          </Card>
          <Card interactive className="relative">
            <h3 className="font-serif text-h3-lg font-medium text-charcoal">Second pillar</h3>
            <p className="mt-3 text-slate">One sentence on what ReplyLoop does.</p>
            <div className="mt-6">
              <TextLink href="#steps" className="after:absolute after:inset-0 after:rounded-card">
                Link inside a card
              </TextLink>
            </div>
          </Card>
        </div>
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
        <Card tone="dark" className="mt-6">
          <h3 className="font-serif text-h3-lg font-medium text-ivory">Sample pillar</h3>
          <p className="mt-3 text-mist">Short body text.</p>
          <div className="mt-4">
            <TextLink href="#steps">Link inside a card</TextLink>
          </div>
        </Card>
      </Section>
      <InsetRule tone="charcoal" />
      <Section tone="charcoal" rhythm="tight">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <PauseDemo tone="dark" />
          <div className="flex flex-col gap-8">
            <Sprite id="loop" className="w-48 text-brass-line" />
            <Sprite id="wordmark" className="w-full max-w-md text-ink-2" />
          </div>
        </div>
      </Section>
      <Section tone="ivory-2" rhythm="tight">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <PauseDemo tone="light" />
          <div className="flex flex-col gap-8">
            <Sprite id="loop" className="w-48 text-brass" />
            <Sprite id="wordmark" className="w-full max-w-md text-charcoal" />
          </div>
        </div>
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
