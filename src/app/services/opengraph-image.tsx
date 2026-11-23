import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Local SEO and review replies for health practices";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Services", title: "Local SEO and review replies for health practices" });
}
