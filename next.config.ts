import type { NextConfig } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://reply-loop.com").replace(/\/$/, "");
const apexHost = new URL(siteUrl).host.replace(/^www\./, "");

const nextConfig: NextConfig = {
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

export default nextConfig;
