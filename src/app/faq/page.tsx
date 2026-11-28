import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQ } from "@/components/ui/FAQ";
import { PageHero } from "@/components/ui/PageHero";
import { HeroPlate } from "@/components/scenes/HeroPlate";
import { ServiceEmblem } from "@/components/scenes/ServiceEmblem";
import { Section } from "@/components/ui/Section";
import { faqs } from "@/content/faq";
import { breadcrumbSchema, faqPageSchema, graph, type Crumb } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { PageBody } from "@/components/motion/PageBody";

export const metadata: Metadata = pageMetadata({
  title: "Questions About Review Replies and Local SEO | ReplyLoop",
  absoluteTitle: true,
  description:
    "Plain answers about how ReplyLoop replies to Google reviews, handles reviews for health businesses, and cares for your Google Business Profile.",
  path: "/faq",
});

const crumbs: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "FAQ", path: "/faq" },
];

export default function FaqPage() {
  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow="FAQ"
        title="Questions owners ask us"
        intro="Plain answers. If yours is not here, ask it on the intro call."
        showButton={false}
        backdrop={<ServiceEmblem variant="loop" />}
        plate={<HeroPlate variant="faq" />}
      />
      <PageBody>
        {/*
          One reading band (brief §8.8): the questions are the H2s, set at the compact card-title
          size; answers hold the 65ch measure. src/content/faq.ts has no groups, so no sticky
          group list.
        */}
        <Section rhythm="tight">
          <FAQ items={faqs} headingLevel="h2" />
        </Section>
      </PageBody>
      <JsonLd data={graph(breadcrumbSchema(crumbs), faqPageSchema(faqs, "/faq"))} />
    </>
  );
}
