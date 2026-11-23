/**
 * Blog post registry. Each entry has a matching MDX file in content/blog/<slug>.mdx
 * (added in Phase 4). Service pages link to a related post from here.
 */
export type PostMeta = { slug: string; title: string; description: string };

export const postIndex = {
  replies: {
    slug: "respond-to-google-reviews-without-sharing-private-details",
    title: "How home care agencies can respond to Google reviews without sharing private details",
    description:
      "A plain guide for home care owners: what a public reply can say, what it should never say, and how to move a hard conversation off the page.",
  },
  checklist: {
    slug: "utah-home-care-local-seo-checklist",
    title: "A simple local SEO checklist for Utah home care agencies",
    description:
      "A short, honest checklist for Utah home care owners: your Google Business Profile, your reviews, your website, and what to check each month.",
  },
  profile: {
    slug: "what-families-look-for-on-a-home-care-google-business-profile",
    title: "What families look for on a home care agency's Google Business Profile",
    description:
      "What a family choosing home care can see on your Google Business Profile, and the plain steps that help it answer their first questions.",
  },
} satisfies Record<string, PostMeta>;

export const allPostMeta: PostMeta[] = Object.values(postIndex);
