import { getServicePage } from "@/content/servicePages";
import { ogContentType, ogSize, renderServiceOg } from "@/lib/og";

const page = getServicePage("social-content")!;

// Marks this route as generated at build time, which the static export
// (npm run build:static) requires. Cache Components rejects `dynamic =
// "force-static"`, but accepts this. The route has no params, so one empty set.
export function generateStaticParams() {
  return [{}];
}

export const alt = page.h1;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderServiceOg(page);
}
