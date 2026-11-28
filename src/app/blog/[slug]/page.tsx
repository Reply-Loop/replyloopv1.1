import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { PostCard } from "@/components/blog/PostCard";
import { PostToc } from "@/components/blog/PostToc";
import { PostHeading, postOutline } from "@/components/blog/outline";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Prose } from "@/components/ui/Prose";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { allPostMeta, getPost, relatedPosts } from "@/content/posts";
import { blogPostingSchema, breadcrumbSchema, graph, type Crumb } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/date";
import { readingLabel } from "@/lib/readingTime";
import { PageBody } from "@/components/motion/PageBody";

export function generateStaticParams() {
  return allPostMeta.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.seoTitle,
    absoluteTitle: true,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: "article",
  });
}

/*
 * Post layout (brief §8.11). Below lg: one centred reading column. At lg and up: a 12-column
 * grid with the "On this page" outline sticky in cols 1-3 (the left gutter) and the header and
 * body in cols 4-12, both left-aligned on the same edge. The reading column is set in the prose
 * size so its 66ch measure matches the body's (children set their own sizes).
 */
const GRID = "lg:grid lg:grid-cols-12 lg:gap-x-8";
const COLUMN = "mx-auto max-w-reading text-prose lg:col-span-9 lg:col-start-4 lg:mx-0";

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const path = `/blog/${post.slug}`;
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path },
  ];
  const { Content } = post;
  const outline = postOutline(Content);

  return (
    <>
      <article aria-labelledby="page-title">
        {/* The post's hero: never inside the route-transition wrapper (the H1 does not animate). */}
        <header className="border-b border-rule pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Container className={GRID}>
            <div className={COLUMN}>
              <Breadcrumbs crumbs={crumbs} />
              <Eyebrow className="mt-12">Guide</Eyebrow>
              <h1 id="page-title" className="mt-6 font-serif text-h2 font-medium lg:mt-5">
                {post.title}
              </h1>
              <p className="mt-5 max-w-lede text-lede text-slate">{post.description}</p>
              <p className="mt-6 text-small text-slate">
                ReplyLoop<span aria-hidden className="mx-2">·</span>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden className="mx-2">·</span>
                {readingLabel(post.readingMinutes)}
              </p>
            </div>
          </Container>
        </header>
        <PageBody>
          <Container className={`py-12 sm:py-16 ${GRID}`}>
            {outline.length ? (
              <aside className="hidden lg:col-span-3 lg:row-start-1 lg:block">
                <PostToc items={outline} />
              </aside>
            ) : null}
            <Prose className={`${COLUMN} lg:row-start-1 [&_em]:text-slate`}>
              <Content components={{ h2: PostHeading }} />
            </Prose>
          </Container>
        </PageBody>
      </article>

      <PageBody>
        <Section tone="ivory-2" labelledBy="related-title" rhythm="tight">
          <SectionHeading id="related-title" variant="compact" eyebrow="Keep reading" title="Related guides" />
          <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:gap-8">
            {relatedPosts(post.slug).map((p, i) => (
              <PostCard key={p.slug} post={p} index={i} heading="h3" />
            ))}
          </ul>
        </Section>
      </PageBody>

      <JsonLd
        data={graph(
          blogPostingSchema({ title: post.title, description: post.description, path, datePublished: post.date }),
          breadcrumbSchema(crumbs),
        )}
      />
    </>
  );
}
