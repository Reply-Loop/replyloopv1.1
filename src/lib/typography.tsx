import { Fragment, type ReactNode } from "react";

/**
 * Phrases that must not break across a line in display type (brief §6.2:
 * heading phrases stay together). The words are unchanged: only the line
 * break moves. "thank you" is the brand phrase; "home care" is the audience.
 */
const PHRASES = ["thank you", "home care"];
const PATTERN = new RegExp(`(${PHRASES.join("|")})`, "gi");

/** Wraps known phrases in a heading string in no-wrap spans. Non-strings pass through. */
export function keepPhrases(node: ReactNode): ReactNode {
  if (typeof node !== "string") return node;
  const parts = node.split(PATTERN);
  if (parts.length === 1) return node;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
