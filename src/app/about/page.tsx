import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceEmblem } from "@/components/scenes/ServiceEmblem";
import { ProofSlot } from "@/components/ui/ProofSlot";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { breadcrumbSchema, graph, personSchema, type Crumb } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

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
        backdrop={<ServiceEmblem icon="reply" pair />}
        intro="ReplyLoop helps local service businesses keep the “thank you” alive, by capturing and answering every review so honest service becomes the rock their growth is built on."
      />

      <Section labelledBy="why-title">
        <SectionHeading
          id="why-title"
          eyebrow="Why we do this"
          title="The thank you is worth protecting"
          intro={
            <>
              <p>
                At the end of good service, two people say thank you. The customer says it, and so does the business. When
                a customer writes that thank you on Google, it deserves an answer.
              </p>
              <p>
                We believe honest reviews, answered well, are a foundation a local business can build on. So we ask every
                customer the same way, we never reward a review, and you keep the keys.
              </p>
            </>
          }
        />
      </Section>

      <Section tone="charcoal" labelledBy="founders-title">
        <SectionHeading
          id="founders-title"
          eyebrow="The people"
          title="Run by Hunter Newbold and Brigham Tiffany"
          intro="Based in Salt Lake County, Utah."
        />
        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {founders.map((f) => (
            <Card as="li" key={f.name}>
              <div className="flex items-center gap-5">
                <span
                  aria-hidden
                  className="tone-dark inline-flex size-16 shrink-0 items-center justify-center rounded-full bg-charcoal font-serif text-xl text-ivory"
                >
                  {f.initials}
                </span>
                <div>
                  <h3 className="font-serif text-2xl font-medium">{f.name}</h3>
                  <p className="text-slate">{f.title}</p>
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
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <Card as="li" key={v.title}>
              <h3 className="font-serif text-xl font-medium">{v.title}</h3>
              <p className="mt-3 text-slate">{v.body}</p>
            </Card>
          ))}
        </ul>
      </Section>

      <JsonLd
        data={graph(
          breadcrumbSchema(crumbs),
          ...founders.map((f) => personSchema({ name: f.name, jobTitle: f.title })),
        )}
      />
    </>
  );
}
