import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Readable long-form text with styled headings, lists, and links. */
export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "max-w-reading text-prose",
        "[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-serif [&_h2]:text-h2-compact [&_h2]:font-medium",
        "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-serif [&_h3]:text-h3 [&_h3]:font-medium",
        "[&_p]:mt-5 [&_ul]:mt-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6",
        "[&_li]:marker:text-brass [&_a]:underline [&_a]:decoration-brass [&_a]:underline-offset-4 hover:[&_a]:decoration-2",
        "[&_strong]:font-semibold [&>*:first-child]:mt-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
