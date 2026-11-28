import { ogContentType, ogSize, renderOg } from "@/lib/og";

// Marks this route as generated at build time, which the static export
// (npm run build:static) requires. Cache Components rejects `dynamic =
// "force-static"`, but accepts this. The route has no params, so one empty set.
export function generateStaticParams() {
  return [{}];
}

export const alt = "Guides for home care owners";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Blog", title: "Guides for home care owners" });
}
