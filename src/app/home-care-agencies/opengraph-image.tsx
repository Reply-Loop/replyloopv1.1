import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Home care agency SEO and review replies in Utah";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "For home care agencies", title: "Home care agency SEO and review replies in Utah" });
}
