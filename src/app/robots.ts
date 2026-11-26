import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

// Marks this route as generated at build time, which the static export
// (npm run build:static) requires. Cache Components rejects `dynamic =
// "force-static"`, but accepts this. The route has no params, so one empty set.
export function generateStaticParams() {
  return [{}];
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/styleguide"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: site.url,
  };
}
