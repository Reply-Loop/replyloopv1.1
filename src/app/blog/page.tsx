import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card, cardLinkOverlay } from "@/components/ui/Card";
import { PageHero } from "@/components/ui/PageHero";
import { HeroPlate } from "@/components/scenes/HeroPlate";
import { Section } from "@/components/ui/Section";
import { allPostMeta } from "@/content/posts";
import { breadcrumbSchema, graph, type Crumb } from "@/lib/schema";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/date";
import { pageMetadata } from "@/lib/seo";
import { PageBody } from "@/components/motion/PageBody";

export const metadata: Metadata = pageMetadata({
  title: "Guides for Home Care Owners | ReplyLoop Blog",
  absoluteTitle: true,
  description:
    "Plain guides for home care owners in Utah on Google reviews, Google Business Profile, and local SEO. General information, written without hype.",
  path: "/blog",
});

/**
 * Whole-card link (Card interactive): the link's ::after covers the card, and
 * the focus ring moves from the link text to that overlay so it rings the card.
 */

const crumbs: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog" },
];

export default function BlogIndex() {
  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow="Blog"
        title="Guides for home care owners"
        intro="Plain answers about Google reviews, your Google Business Profile, and local search."
        showButton={false}
        plate={<HeroPlate variant="blog" />}
      />
      <PageBody>
        <Section rhythm="tight">
          <ul className="grid gap-6 md:grid-cols-3">
            {allPostMeta.map((p, i) => (
              <Card as="li" key={p.slug} interactive reveal={i} className="flex flex-col">
                <p className="text-small text-slate">
                  <time dateTime={p.date}>{formatDate(p.date)}</time>
                </p>
                <h2 className="mt-3 font-serif text-h3-lg font-medium">
                  <Link
                    href={`/blog/${p.slug}`}
                    className={cn(cardLinkOverlay, "underline decoration-brass decoration-1 underline-offset-4 hover:decoration-2")}
                  >
                    {p.title}
                  </Link>
                </h2>
                <p className="mt-3 text-slate">{p.description}</p>
              </Card>
            ))}
          </ul>
        </Section>
      </PageBody>
      <JsonLd data={graph(breadcrumbSchema(crumbs))} />
    </>
  );
}
