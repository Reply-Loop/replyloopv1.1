import { ogContentType, ogSize, renderOg } from "@/lib/og";

// Marks this route as generated at build time, which the static export
// (npm run build:static) requires. Cache Components rejects `dynamic =
// "force-static"`, but accepts this. The route has no params, so one empty set.
export function generateStaticParams() {
  return [{}];
}

export const alt = "Home care agency SEO and review replies in Utah";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "For home care agencies", title: "Home care agency SEO and review replies in Utah" });
}
