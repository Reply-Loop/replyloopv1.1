import type { Metadata } from "next";
import { site } from "./site";

type PageMetaInput = {
  /** Unique, under about 60 characters including the " | ReplyLoop" suffix. */
  title: string;
  /** Unique, under about 155 characters. */
  description: string;
  /** Path beginning with "/". Used for the canonical URL. */
  path: string;
  /** Set true when the title already carries the brand and should skip the template. */
  absoluteTitle?: boolean;
  type?: "website" | "article";
  noindex?: boolean;
};

export function absoluteUrl(path = "/"): string {
  return path === "/" ? site.url : `${site.url}${path}`;
}

/** Page metadata with canonical, Open Graph, and Twitter card. */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle,
  type = "website",
  noindex,
}: PageMetaInput): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName: site.name,
      title: fullTitle,
      description,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}
