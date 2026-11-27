import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { allPostMeta } from "@/content/posts";
import { breadcrumbSchema, graph, type Crumb } from "@/lib/schema";
import { formatDate } from "@/lib/date";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Guides for Home Care Owners | ReplyLoop Blog",
  absoluteTitle: true,
  description:
    "Plain guides for home care owners in Utah on Google reviews, Google Business Profile, and local SEO. General information, written without hype.",
  path: "/blog",
});

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
      />
      <Section rhythm="tight" reveal={false}>
        <ul className="grid gap-6 md:grid-cols-3">
          {allPostMeta.map((p) => (
            <Card as="li" key={p.slug} className="flex flex-col">
              <p className="text-small text-slate">
                <time dateTime={p.date}>{formatDate(p.date)}</time>
              </p>
              <h2 className="mt-3 font-serif text-h3-lg font-medium">
                <Link
                  href={`/blog/${p.slug}`}
                  className="underline decoration-brass decoration-1 underline-offset-4 hover:decoration-2"
                >
                  {p.title}
                </Link>
              </h2>
              <p className="mt-3 text-slate">{p.description}</p>
            </Card>
          ))}
        </ul>
      </Section>
      <JsonLd data={graph(breadcrumbSchema(crumbs))} />
    </>
  );
}
