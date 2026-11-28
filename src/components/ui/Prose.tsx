import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Readable long-form text with styled headings, lists, quotes and links (brief §8.11).
 * - Body in the prose token (1.125rem / 1.75), at most 66ch.
 * - H2s keep clear of the sticky header when reached by an in-page link (the post outline).
 * - Blockquote: no border. A raised ivory-2 card (16px radius, 24px 28px padding) with a
 *   straight 2px brass bar on its left edge, drawn by ::before from 16px below the top to
 *   16px above the bottom, so it never bends around the corner radius. Quote text in roman
 *   Fraunces 400 at 1.25rem / 1.5 (no italic: Fraunces is loaded in the normal style only).
 *   Charcoal on ivory-2 is 14.22:1.
 */
export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "max-w-reading text-prose",
        "[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:scroll-mt-[calc(var(--header-h)+1.5rem)] [&_h2]:font-serif [&_h2]:text-h2-compact [&_h2]:font-medium",
        "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-serif [&_h3]:text-h3 [&_h3]:font-medium",
        "[&_p]:mt-5 [&_ul]:mt-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6",
        "[&_li]:marker:text-brass [&_a]:underline [&_a]:decoration-brass [&_a]:underline-offset-4 hover:[&_a]:decoration-2",
        // No italic (§6.2): both fonts load the normal style only, so <em> would be a faux slant.
        "[&_strong]:font-semibold [&_em]:not-italic [&>*:first-child]:mt-0",
        "[&_blockquote]:relative [&_blockquote]:mt-5 [&_blockquote]:rounded-[16px] [&_blockquote]:bg-ivory-2 [&_blockquote]:px-7 [&_blockquote]:py-6",
        "[&_blockquote]:font-serif [&_blockquote]:text-[1.25rem] [&_blockquote]:leading-[1.5] [&_blockquote]:font-normal [&_blockquote]:text-charcoal",
        "[&_blockquote]:before:absolute [&_blockquote]:before:top-4 [&_blockquote]:before:bottom-4 [&_blockquote]:before:left-0 [&_blockquote]:before:w-0.5 [&_blockquote]:before:rounded-[2px] [&_blockquote]:before:bg-brass",
        "[&_blockquote>*:first-child]:mt-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
