import { cn } from "@/lib/cn";

/**
 * Thin looping connector between sections. Decorative only.
 * `animate` traces the loop slowly; reduced motion turns it off.
 */
export function LoopDivider({
  tone = "ivory",
  animate = false,
  className,
}: {
  tone?: "ivory" | "charcoal";
  animate?: boolean;
  className?: string;
}) {
  const dark = tone === "charcoal";
  return (
    <div
      aria-hidden
      className={cn(dark ? "bg-charcoal text-brass-line" : "bg-ivory text-brass", className)}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 sm:px-8">
        <span className="h-px flex-1 bg-current opacity-50" />
        <svg viewBox="0 0 40 24" fill="none" className="h-6 w-10 shrink-0" focusable="false">
          <path
            d="M20 12C16.5 5.5 6 5.5 6 12s10.5 6.5 14 0 14-6.5 14 0-10.5 6.5-14 0Z"
            stroke="currentColor"
            strokeWidth={1.25}
            className={animate ? "loop-trace" : undefined}
          />
        </svg>
        <span className="h-px flex-1 bg-current opacity-50" />
      </div>
    </div>
  );
}
