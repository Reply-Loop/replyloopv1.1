import type { MetadataRoute } from "next";
import { postRoutes, publicRoutes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";

// Marks this route as generated at build time, which the static export
// (npm run build:static) requires. Cache Components rejects `dynamic =
// "force-static"`, but accepts this. The route has no params, so one empty set.
export function generateStaticParams() {
  return [{}];
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [...publicRoutes, ...postRoutes].map((r) => ({
    url: absoluteUrl(r.path),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
