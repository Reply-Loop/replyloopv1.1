import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Prose } from "@/components/ui/Prose";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { allPostMeta, getPost, relatedPosts } from "@/content/posts";
import { blogPostingSchema, breadcrumbSchema, graph, type Crumb } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/date";

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

  return (
    <>
      <article aria-labelledby="page-title">
        <header className="border-b border-rule pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Container size="prose">
            <Breadcrumbs crumbs={crumbs} />
            <Eyebrow className="mt-12">Guide</Eyebrow>
            <h1 id="page-title" className="mt-6 font-serif text-h2 font-medium lg:mt-5">
              {post.title}
            </h1>
            <p className="mt-5 text-lede text-slate">{post.description}</p>
            <p className="mt-6 text-small text-slate">
              ReplyLoop · <time dateTime={post.date}>{formatDate(post.date)}</time>
            </p>
          </Container>
        </header>
        <Container size="prose" className="py-12 sm:py-16">
          <Prose className="[&_blockquote]:mt-4 [&_blockquote]:rounded-md [&_blockquote]:border-l-2 [&_blockquote]:border-brass [&_blockquote]:bg-[#F1ECE3] [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:font-serif [&_blockquote]:text-lg [&_em]:text-slate">
            <Content />
          </Prose>
        </Container>
      </article>

      <Section labelledBy="related-title" rhythm="tight" className="border-t border-rule">
        <SectionHeading id="related-title" variant="compact" eyebrow="Keep reading" title="Related guides" />
        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {relatedPosts(post.slug).map((p) => (
            <Card as="li" key={p.slug}>
              <h3 className="font-serif text-h3 font-medium">
                <Link
                  href={`/blog/${p.slug}`}
                  className="underline decoration-brass decoration-1 underline-offset-4 hover:decoration-2"
                >
                  {p.title}
                </Link>
              </h3>
              <p className="mt-3 text-slate">{p.description}</p>
            </Card>
          ))}
        </ul>
      </Section>

      <JsonLd
        data={graph(
          blogPostingSchema({ title: post.title, description: post.description, path, datePublished: post.date }),
          breadcrumbSchema(crumbs),
        )}
      />
    </>
  );
}
