import type { MetadataRoute } from "next";
import { postRoutes, publicRoutes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [...publicRoutes, ...postRoutes].map((r) => ({
    url: absoluteUrl(r.path),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
