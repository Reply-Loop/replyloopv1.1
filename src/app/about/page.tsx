import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceEmblem } from "@/components/scenes/ServiceEmblem";
import { HeroPlate } from "@/components/scenes/HeroPlate";
import { ProofSlot } from "@/components/ui/ProofSlot";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { breadcrumbSchema, graph, personSchema, type Crumb } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { keepPhrases } from "@/lib/typography";
import { PageBody } from "@/components/motion/PageBody";

export const metadata: Metadata = pageMetadata({
  title: "About ReplyLoop | Salt Lake County, Utah",
  absoluteTitle: true,
  description:
    "ReplyLoop helps local service businesses keep the thank you alive. Run by Hunter K. Newbold and Brigham Tiffany in Salt Lake County, Utah.",
  path: "/about",
});

const crumbs: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];

/** Names and titles approved 2026-11-23. Bios and photos are placeholders until supplied. */
const founders = [
  { name: "Hunter K. Newbold", title: "Cofounder", initials: "HN", bioSlot: "hunter-bio" as const },
  { name: "Brigham Tiffany", title: "Cofounder, operations", initials: "BT", bioSlot: "brigham-bio" as const },
];

/** A sentence of the "Why we do this" body, verbatim; also its pull-quote. */
const WHY_ECHO = "When a customer writes that thank you on Google, it deserves an answer.";

const values = [
  { title: "Plain", body: "Short words and real numbers. If we do not have a number, we do not print one." },
  { title: "Earnest", body: "We say what we believe. No urgency tricks and no pressure." },
  { title: "Servant-hearted", body: "We start from what the owner needs, not from what we can sell." },
  { title: "Open books", body: "You can see the work and check the results." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow="About"
        title="About ReplyLoop"
        backdrop={<ServiceEmblem variant="about" />}
        plate={<HeroPlate variant="about" />}
        intro="ReplyLoop helps local service businesses keep the “thank you” alive, by capturing and answering every review so honest service becomes the rock their growth is built on."
      />
      <PageBody>

        {/*
          "Why we do this" as a body split (brief §6.4, §8.7): eyebrow, H2 and the two paragraphs in
          cols 1-5; at lg one sentence from that body echoed in cols 7-12 as a pull-quote, roman
          Fraunces 400 at display optical size, 2rem (no italic, §6.2). The echo is aria-hidden:
          the sentence is already read once in the paragraph beside it.
        */}
        <Section labelledBy="why-title">
          <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-8">
            <SectionHeading
              id="why-title"
              eyebrow="Why we do this"
              title="The thank you is worth protecting"
              className="lg:col-span-5"
              intro={
                <>
                  <p>
                    At the end of good service, two people say thank you. The customer says it, and so does the business.{" "}
                    {WHY_ECHO}
                  </p>
                  <p>
                    We believe honest reviews, answered well, are a foundation a local business can build on. So we ask every
                    customer the same way, we never reward a review, and you keep the keys.
                  </p>
                </>
              }
            />
            <div
              aria-hidden
              className="reveal hidden lg:col-span-6 lg:col-start-7 lg:block"
              style={{ "--i": 3 } as CSSProperties}
            >
              <span className="block h-px w-10 bg-brass" />
              <p className="mt-6 font-serif text-[2rem] leading-[1.25] font-normal tracking-[-0.01em] text-balance text-charcoal [font-variation-settings:'opsz'_144]">
                {keepPhrases(WHY_ECHO)}
              </p>
            </div>
          </div>
        </Section>

        <Section tone="charcoal" labelledBy="founders-title">
          <SectionHeading
            id="founders-title"
            eyebrow="The people"
            title="Run by Hunter Newbold and Brigham Tiffany"
            intro="Based in Salt Lake County, Utah."
          />
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {founders.map((f, i) => (
              <Card as="li" key={f.name} tone="dark" reveal={i}>
                <div className="flex items-center gap-5">
                  {/* Initials avatar: charcoal circle, ivory serif initials, decorative 1px brass-line ring. */}
                  <span
                    aria-hidden
                    className="inline-flex size-16 shrink-0 items-center justify-center rounded-full border border-brass-line bg-charcoal font-serif text-xl text-ivory"
                  >
                    {f.initials}
                  </span>
                  <div>
                    <h3 className="font-serif text-h3-lg font-medium text-ivory">{f.name}</h3>
                    <p className="text-mist">{f.title}</p>
                  </div>
                </div>
                <ProofSlot
                  kind={f.bioSlot}
                  label={`${f.name} bio and photo`}
                  path="src/content/founders.ts, public/people/"
                  className="mt-6"
                />
              </Card>
            ))}
          </ul>
        </Section>

        <Section labelledBy="values-title">
          <SectionHeading id="values-title" eyebrow="How we work" title="What you can expect from us" />
          {/*
            A ruled 4-column list (brief §8.7), not four cramped cards: each value under a 1px rule
            with a short brass lead. Two columns from sm, four at xl.
          */}
          <ul className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-4">
            {values.map((v, i) => (
              <li
                key={v.title}
                className="reveal relative border-t border-rule pt-6 before:absolute before:-top-px before:left-0 before:h-px before:w-10 before:bg-brass"
                style={{ "--i": Math.min(i, 4) } as CSSProperties}
              >
                {/* A hyphenated heading phrase stays on one line (§6.2): "Servant-hearted". */}
                <h3 className="font-serif text-h3 font-medium">
                  {v.title.includes("-") ? <span className="whitespace-nowrap">{v.title}</span> : v.title}
                </h3>
                <p className="mt-3 max-w-measure text-slate">{v.body}</p>
              </li>
            ))}
          </ul>
        </Section>
      </PageBody>
      <JsonLd
        data={graph(
          breadcrumbSchema(crumbs),
          ...founders.map((f) => personSchema({ name: f.name, jobTitle: f.title })),
        )}
      />
    </>
  );
}
