/**
 * Every public, indexable route. The sitemap is built from this list.
 * Add a route here when its page ships.
 */
export type RouteEntry = {
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
};

export const publicRoutes: RouteEntry[] = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
];
