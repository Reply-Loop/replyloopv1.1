/**
 * Every public, indexable route. The sitemap is built from this list.
 * Add a route here when its page ships.
 */
export type RouteEntry = {
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
};

import { allPostMeta } from "@/content/posts";

export const publicRoutes: RouteEntry[] = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
  { path: "/home-care-agencies", priority: 0.9, changeFrequency: "monthly" },
  { path: "/services", priority: 0.8, changeFrequency: "monthly" },
  { path: "/services/review-replies", priority: 0.8, changeFrequency: "monthly" },
  { path: "/services/social-content", priority: 0.7, changeFrequency: "monthly" },
  { path: "/services/local-seo", priority: 0.8, changeFrequency: "monthly" },
  { path: "/services/websites", priority: 0.6, changeFrequency: "monthly" },
  { path: "/services/owner-qa-videos", priority: 0.6, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
  { path: "/about", priority: 0.5, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
];

export const postRoutes: RouteEntry[] = allPostMeta.map((p) => ({
  path: `/blog/${p.slug}`,
  priority: 0.6,
  changeFrequency: "yearly",
}));
