import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { FilmFeature } from "@/components/film/FilmFeature";
import { JsonLd } from "@/components/seo/JsonLd";
import { TextLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { HeroPlate } from "@/components/scenes/HeroPlate";
import { BundleEmblem } from "@/components/services/BundleEmblem";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { bundlePillars } from "@/content/services";
import { servicePages } from "@/content/servicePages";
import { breadcrumbSchema, graph, type Crumb } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { PageBody } from "@/components/motion/PageBody";

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
        backdrop={<BundleEmblem />}
        plate={<HeroPlate variant="services" />}
      />
      <PageBody>

        {/*
          The bundle as a spec sheet (brief §8.4), not home's card grid: full-width ruled rows on
          ivory. At lg: pillar name in cols 1-4, what we do in cols 5-9, the owner's need and the
          link in cols 10-12. Each row rises on its own (.reveal, stagger capped at 4).
        */}
        <Section labelledBy="bundle-title">
          <SectionHeading
            variant="split"
            id="bundle-title"
            eyebrow="The monthly work"
            title="What the bundle includes"
            intro="Setup includes your voice interview, a one-time audit of your online presence, and replies to the Google reviews already waiting."
          />
          <ul className="mt-12 border-b border-rule lg:mt-16">
            {bundlePillars.map((pillar, i) => (
              <li
                key={pillar.title}
                className="reveal grid gap-y-4 border-t border-rule py-8 lg:grid-cols-12 lg:gap-x-8 lg:py-12"
                style={{ "--i": Math.min(i, 4) } as CSSProperties}
              >
                <div className="flex items-center gap-4 lg:col-span-4 lg:items-start">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-rule text-brass">
                    <Icon name={pillar.icon} className="size-5" />
                  </span>
                  <h3 className="font-serif text-h3-lg font-medium lg:pt-[0.2em]">{pillar.title}</h3>
                </div>
                <p className="max-w-measure text-charcoal lg:col-span-5 lg:pt-3">{pillar.what}</p>
                <div className="lg:col-span-3 lg:pt-4">
                  <p className="text-small text-slate">{pillar.need}</p>
                  {pillar.href ? (
                    <div className="mt-1">
                      {/* 44px tap target (min-h-11); the 4px margin plus the centred line reads as the 16px gap. */}
                      <TextLink href={pillar.href} className="min-h-11 text-small">
                        {pillar.linkLabel ?? `More on ${pillar.title.toLowerCase()}`}
                      </TextLink>
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </Section>

        {/* The brand film in its own ivory-2 band: film frame and HTML caption split (§8.3.3, §8.4). */}
        <Section tone="ivory-2" id="film">
          <FilmFeature />
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
            {oneTime.map((p, i) => (
              <Card as="li" key={p.slug} tone="dark" reveal={i} className="flex flex-col">
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
                  More on {/[A-Z]{2}|&/.test(p.name) ? p.name : p.name.toLowerCase()}
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
          {/*
            A borderless ruled list (brief §8.4), not cards: four columns at xl, each under a 1px
            rule, so the one link stays on a single line at 1440.
          */}
          <ul className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-4">
            {audiences.map((a, i) => (
              <li
                key={a.title}
                className="reveal flex flex-col border-t border-rule pt-6"
                style={{ "--i": Math.min(i, 4) } as CSSProperties}
              >
                <h3 className="font-serif text-h3 font-medium">{a.title}</h3>
                <p className="mt-3 text-slate">{a.body}</p>
                {a.href ? (
                  <div className="mt-4">
                    {/* 44px tap target (min-h-11); 16px plus the centred line reads as the 24px body-to-action gap. */}
                    <TextLink href={a.href} className="min-h-11">
                      See the home care page
                    </TextLink>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </Section>
      </PageBody>
      <JsonLd data={graph(breadcrumbSchema(crumbs))} />
    </>
  );
}
