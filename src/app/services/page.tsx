import type { Metadata } from "next";
import Link from "next/link";
import { BrandFilm } from "@/components/film/BrandFilm";
import { JsonLd } from "@/components/seo/JsonLd";
import { TextLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { PillarCard } from "@/components/ui/PillarCard";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { bundlePillars } from "@/content/services";
import { servicePages } from "@/content/servicePages";
import { breadcrumbSchema, graph, type Crumb } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

// Primary keyword: local SEO and review replies for health practices.
export const metadata: Metadata = pageMetadata({
  title: "Local SEO and Review Replies for Health Practices | ReplyLoop",
  absoluteTitle: true,
  description:
    "Review replies, monthly social content, Google Business Profile care, and a growth workbook for home care agencies and health practices in Utah.",
  path: "/services",
});

const crumbs: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
];

const audiences = [
  { title: "Home care agencies", body: "Our first focus. Owners and administrators across Salt Lake County and Utah.", href: "/home-care-agencies" },
  { title: "Dental offices", body: "The same promises, including the privacy rule for every public reply." },
  { title: "Therapy practices", body: "Therapy practices with a Google profile and reviews to care for." },
  { title: "Clinics", body: "Local clinics where the person leaving a review may be a patient or family member." },
];

export default function ServicesPage() {
  const oneTime = servicePages.filter((p) => p.kind === "one-time");
  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow="Services"
        title="Local SEO and review replies for health practices"
        intro="One monthly bundle, built around your Google reviews: replies in your voice, 16 new pieces of content a month, care for your Google Business Profile, and a growth workbook."
      />

      <Section labelledBy="bundle-title">
        <SectionHeading
          variant="split"
          id="bundle-title"
          eyebrow="The monthly work"
          title="What the bundle includes"
          intro="Setup includes your voice interview, a one-time audit of your online presence, and replies to the Google reviews already waiting."
        />
        <BrandFilm className="mt-12" />
        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {bundlePillars.map((pillar) => (
            <PillarCard key={pillar.title} pillar={pillar} />
          ))}
        </ul>
      </Section>

      <Section tone="charcoal" labelledBy="one-time-title">
        <SectionHeading
          variant="split"
          id="one-time-title"
          eyebrow="One-time projects"
          title="Also available, priced one time"
          intro="One-time work is priced one time. We only bring these up if you need them."
        />
        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {oneTime.map((p) => (
            <Card as="li" key={p.slug} tone="dark" className="flex flex-col">
              {/* Icon chip on dark: decorative brass-line ring, ivory icon, never brass. */}
              <span className="mb-5 inline-flex size-11 items-center justify-center rounded-md border border-brass-line text-ivory">
                <Icon name={p.icon} className="size-5" />
              </span>
              <h3 className="font-serif text-h3-lg font-medium text-ivory">{p.name}</h3>
              <p className="mt-3 text-mist">{p.intro}</p>
              <Link
                href={`/services/${p.slug}`}
                className="mt-auto inline-flex items-center gap-2 pt-6 font-semibold text-ivory underline decoration-brass-line underline-offset-[6px] hover:decoration-2"
              >
                More on {p.name.toLowerCase()}
                <Icon name="arrow" className="size-4" />
              </Link>
            </Card>
          ))}
        </ul>
      </Section>

      <Section labelledBy="who-title">
        <SectionHeading
          variant="split"
          id="who-title"
          eyebrow="Who we serve"
          title="Home care first, and local health practices"
          intro="Every health business gets the same rule: a public reply never confirms someone is a patient, and never mentions care."
        />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {audiences.map((a) => (
            <Card as="li" key={a.title} size="md">
              <h3 className="font-serif text-h3 font-medium">{a.title}</h3>
              <p className="mt-3 text-slate">{a.body}</p>
              {a.href ? (
                <div className="mt-4">
                  <TextLink href={a.href}>See the home care page</TextLink>
                </div>
              ) : null}
            </Card>
          ))}
        </ul>
      </Section>

      <JsonLd data={graph(breadcrumbSchema(crumbs))} />
    </>
  );
}
