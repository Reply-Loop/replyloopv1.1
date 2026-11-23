import { allPostMeta, getPost } from "@/content/posts";
import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "ReplyLoop guide";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return allPostMeta.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  return renderOg({ eyebrow: "Guide", title: post?.title ?? "ReplyLoop guide" });
}
