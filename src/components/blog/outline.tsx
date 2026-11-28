import { isValidElement, type ComponentProps, type ReactNode } from "react";
import { mdxTree, nodeText, type MdxContent } from "@/lib/readingTime";

/**
 * A post's outline for the "On this page" list (brief §8.11): its H2s, each with
 * a stable id derived from the heading's own words. <PostHeading> gives the
 * rendered H2 the same id, so the list and the anchors always agree. Runs at
 * build time (posts are prerendered); nothing here ships to the browser.
 */

export type OutlineItem = { id: string; text: string };

/** "Part 1: Your Google Business Profile" -> "part-1-your-google-business-profile". */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** The H2s of a compiled MDX post, in order. Two H2s with the same words would share an id: fail the build. */
export function postOutline(Content: MdxContent): OutlineItem[] {
  const items: OutlineItem[] = [];
  const visit = (node: ReactNode) => {
    if (Array.isArray(node)) return node.forEach(visit);
    if (!isValidElement<{ children?: ReactNode }>(node)) return;
    if (node.type === "h2") {
      const text = nodeText(node.props.children).trim();
      items.push({ id: headingId(text), text });
      return;
    }
    visit(node.props.children);
  };
  visit(mdxTree(Content));
  const ids = new Set<string>();
  for (const { id, text } of items) {
    if (!id || ids.has(id)) throw new Error(`Post outline: H2 "${text}" has an empty or repeated id "${id}".`);
    ids.add(id);
  }
  return items;
}

/** The MDX h2: the same element, with the id postOutline() gave it (the TOC's anchor target). */
export function PostHeading({ children, ...rest }: ComponentProps<"h2">) {
  return (
    <h2 id={headingId(nodeText(children).trim())} {...rest}>
      {children}
    </h2>
  );
}
