import { isValidElement, type ComponentType, type ReactNode } from "react";
import type { MDXProps } from "mdx/types";

/**
 * Reading time for MDX posts (brief §8.10): computed from the post's own words at
 * 230 words a minute, rounded up, never typed by hand.
 *
 * The words come from the compiled MDX itself, so no file is read at runtime and
 * the static export and the Worker see the same number. Calling an MDX module's
 * default export returns its element tree (headings, paragraphs, list items and
 * inline marks with their text as children); `nodeText` walks that tree and joins
 * the text. Frontmatter is not part of the tree, and markdown syntax (`**`, `>`,
 * `-`, link targets) is gone, so only the words a reader sees are counted.
 * Posts are prerendered, so this runs at build time.
 */

export const WORDS_PER_MINUTE = 230;

export type MdxContent = ComponentType<MDXProps>;

/** Plain text of a React node tree (strings and numbers, in document order). */
export function nodeText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return nodeText(node.props.children);
  return "";
}

/**
 * The element tree of an MDX post. Every markdown element is forced back to its
 * plain tag, so custom components from mdx-components.tsx (for example the link
 * wrapper) cannot hide text from the walk.
 */
export function mdxTree(Content: MdxContent): ReactNode {
  const render = Content as unknown as (props: MDXProps) => ReactNode;
  return render({
    components: { a: "a", blockquote: "blockquote", em: "em", h2: "h2", h3: "h3", li: "li", ol: "ol", p: "p", strong: "strong", ul: "ul" },
  });
}

/** Words in a text: runs of non-space characters that hold a letter or a digit. */
export function wordCount(text: string): number {
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

/** Whole minutes at WORDS_PER_MINUTE, rounded up, at least 1. */
export function readingMinutes(words: number): number {
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/** Reading minutes for a compiled MDX post. */
export function mdxReadingMinutes(Content: MdxContent): number {
  const words = wordCount(nodeText(mdxTree(Content)));
  // No words means the walk found no text: fail the build rather than ship a made-up "1 min read".
  if (words === 0) throw new Error("Reading time: no words found in an MDX post.");
  return readingMinutes(words);
}

/** The visible label, e.g. "6 min read" (owner-approved pattern, Phase 0). */
export function readingLabel(minutes: number): string {
  return `${minutes} min read`;
}
