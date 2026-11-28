import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { LoopSymbol } from "@/components/blog/LoopStrip";
import { PostCard } from "@/components/blog/PostCard";
import { PageHero } from "@/components/ui/PageHero";
import { HeroPlate } from "@/components/scenes/HeroPlate";
import { ServiceEmblem } from "@/components/scenes/ServiceEmblem";
import { Section } from "@/components/ui/Section";
import { allPostMeta } from "@/content/posts";
import { breadcrumbSchema, graph, type Crumb } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { PageBody } from "@/components/motion/PageBody";

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

/**
 * /blog (brief §8.10). Hero: the quiet loop emblem on desktop (as /faq and /contact), the blog
 * HeroPlate on phones. Below it, one reading band of guide cards: each card is a whole-card link
 * with its own loop crop in a 120px header strip (one shared <symbol> per page). The first
 * guide leads as a full-width feature card, two columns at lg; the rest sit two-up from md.
 */
export default function BlogIndex() {
  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow="Blog"
        title="Guides for home care owners"
        intro="Plain answers about Google reviews, your Google Business Profile, and local search."
        showButton={false}
        backdrop={<ServiceEmblem variant="loop" />}
        plate={<HeroPlate variant="blog" />}
      />
      <PageBody>
        <Section rhythm="tight">
          <LoopSymbol />
          <ul className="grid gap-6 md:grid-cols-2 lg:gap-8">
            {allPostMeta.map((p, i) => (
              <PostCard key={p.slug} post={p} index={i} strip feature={i === 0} className={i === 0 ? "md:col-span-2" : undefined} />
            ))}
          </ul>
        </Section>
      </PageBody>
      <JsonLd data={graph(breadcrumbSchema(crumbs))} />
    </>
  );
}
