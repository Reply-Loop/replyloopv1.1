import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Guides for home care owners";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Blog", title: "Guides for home care owners" });
}
