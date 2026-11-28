/**
 * Blog post registry. Each post is an MDX file in src/content/blog/<slug>.mdx
 * with YAML frontmatter (title, description, date, keyword). Titles and
 * descriptions come from the frontmatter, so there is one source of truth.
 */
import type { ComponentType } from "react";
import Replies, {
  frontmatter as repliesFm,
} from "./blog/respond-to-google-reviews-without-sharing-private-details.mdx";
import Checklist, { frontmatter as checklistFm } from "./blog/utah-home-care-local-seo-checklist.mdx";
import Profile, {
  frontmatter as profileFm,
} from "./blog/what-families-look-for-on-a-home-care-google-business-profile.mdx";

export type PostMeta = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  date: string;
  keyword: string;
};

export type Post = PostMeta & { Content: ComponentType };

const posts: Post[] = [
  { slug: "respond-to-google-reviews-without-sharing-private-details", ...repliesFm, Content: Replies },
  { slug: "utah-home-care-local-seo-checklist", ...checklistFm, Content: Checklist },
  { slug: "what-families-look-for-on-a-home-care-google-business-profile", ...profileFm, Content: Profile },
];

const meta = (p: Post): PostMeta => ({
  slug: p.slug,
  title: p.title,
  seoTitle: p.seoTitle,
  description: p.description,
  date: p.date,
  keyword: p.keyword,
});

export const postIndex = {
  replies: meta(posts[0]),
  checklist: meta(posts[1]),
  profile: meta(posts[2]),
};

export const allPostMeta: PostMeta[] = posts.map(meta);

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function relatedPosts(slug: string, count = 2): PostMeta[] {
  return allPostMeta.filter((p) => p.slug !== slug).slice(0, count);
}
