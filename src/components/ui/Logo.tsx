import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Placeholder mark until a vector logo is supplied in /public/brand:
 * an abstract infinity loop whose lower-left lobe carries a small speech tail.
 */
export function LoopMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 24"
      fill="none"
      className={cn("h-6 w-10", className)}
      aria-hidden
      focusable="false"
    >
      <path
        d="M20 11C16.5 4.5 6 4.5 6 11s10.5 6.5 14 0 14-6.5 14 0-10.5 6.5-14 0Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path
        d="M9.2 15.9 6.6 21l5.7-3.3"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2.5 rounded-md", className)}
      aria-label="ReplyLoop, home"
    >
      <LoopMark className="text-brass on-dark:text-brass-line" />
      <span className="font-serif text-[1.35rem] font-medium leading-none tracking-[-0.01em] text-charcoal on-dark:text-ivory">
        ReplyLoop
      </span>
    </Link>
  );
}
