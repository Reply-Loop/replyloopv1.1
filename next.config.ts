import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://reply-loop.com").replace(/\/$/, "");
const apexHost = new URL(siteUrl).host.replace(/^www\./, "");

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  cacheComponents: true,
  partialPrefetching: true,
  // Clean URLs: "/about/" redirects to "/about" (Next default, stated here on purpose).
  trailingSlash: false,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
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
  turbopack: {
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
