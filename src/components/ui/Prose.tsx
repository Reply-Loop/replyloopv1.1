import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Readable long-form text with styled headings, lists, and links. */
export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "max-w-[44rem] text-[1.075rem] leading-[1.8]",
        "[&_h2]:mt-14 [&_h2]:mb-4 [&_h2]:font-serif [&_h2]:text-[1.85rem] [&_h2]:font-medium [&_h2]:leading-tight",
        "[&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-medium",
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
