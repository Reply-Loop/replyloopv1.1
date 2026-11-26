import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://reply-loop.com").replace(/\/$/, "");
const apexHost = new URL(siteUrl).host.replace(/^www\./, "");
// STATIC_EXPORT=1 (npm run build:static) writes plain files to out/ for static
// hosts such as Cloudflare Pages. Redirects then live in the host's settings
// (see public/_redirects and the README), not here.
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(staticExport ? { output: "export" as const } : {}),
  pageExtensions: ["ts", "tsx", "mdx"],
  // Next refuses `output: "export"` with Cache Components on, so the static
  // build turns it off (and Partial Prefetching, which needs it). The only
  // Cache Components API in use is "use cache" in src/lib/og-fonts.ts, which
  // is aliased to an uncached twin below. Every route is static either way.
  cacheComponents: !staticExport,
  partialPrefetching: !staticExport,
  // Clean URLs: "/about/" redirects to "/about" (Next default, stated here on purpose).
  trailingSlash: false,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  ...(staticExport
    ? {}
    : {
      async redirects() {
        return [
          // www to apex. Also set the same redirect in Vercel's domain settings.
          {
            source: "/:path*",
            has: [{ type: "host", value: `www.${apexHost}` }],
            destination: `https://${apexHost}/:path*`,
            permanent: true,
          },
        ];
      },
      }),
  turbopack: {
    ...(staticExport ? { resolveAlias: { "@/lib/og-fonts": "./src/lib/og-fonts.static.ts" } } : {}),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// MDX blog posts with YAML frontmatter (exported as `frontmatter`).
// Plugins are named as strings so Turbopack can load them.
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm", "remark-frontmatter", ["remark-mdx-frontmatter", { name: "frontmatter" }]],
  },
});

export default withMDX(nextConfig);
