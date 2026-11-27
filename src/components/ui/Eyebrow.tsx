import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Thin brass rule beside a small label. Brass text on ivory; ivory text on charcoal.
 * 14px (the site's floor), uppercase, wider tracking from sm up. The rule sits on the
 * first line, so a two-line label stays tidy. `short` replaces the label below 640px;
 * the hidden variant is display:none, so assistive tech reads only one of them.
 */
export function Eyebrow({
  children,
  short,
  centered = false,
  className,
}: {
  children: ReactNode;
  short?: ReactNode;
  /** Centred over a centred heading: a matching rule on the right keeps the label on the axis. */
  centered?: boolean;
  className?: string;
}) {
  const rule = <span aria-hidden className="mt-[0.62em] h-px w-10 shrink-0 bg-brass on-dark:bg-brass-line" />;
  return (
    <p
      className={cn(
        "flex items-start gap-3 font-sans text-eyebrow font-semibold uppercase tracking-[0.08em] text-brass on-dark:text-ivory sm:tracking-[0.14em]",
        centered && "justify-center text-center",
        className,
      )}
    >
      {rule}
      {short ? (
        <>
          <span className="sm:hidden">{short}</span>
          <span className="hidden sm:inline">{children}</span>
        </>
      ) : (
        <span>{children}</span>
      )}
      {centered ? rule : null}
    </p>
  );
}

/** Thin brass hairline, used above headlines that have no eyebrow. */
export function Rule({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("block h-px w-12 bg-brass on-dark:bg-brass-line", className)}
    />
  );
}
