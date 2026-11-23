import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Your next customer is reading your unanswered Google reviews.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Salt Lake County, Utah", title: "Your next customer is reading your unanswered Google reviews." });
}
