import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import { Icon } from "./Icon";

/**
 * The one button style on this site: deeper brass background, ivory text,
 * small arrow. Ivory on #8A5F1C measures 5.17:1 (WCAG AA for normal text).
 */
export const buttonClass =
  "group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brass px-6 py-3 font-sans text-[0.975rem] font-semibold tracking-[0.005em] text-ivory shadow-[inset_0_0_0_1px_rgb(248_245_239/0.14)] on-dark:ring-1 on-dark:ring-brass-line transition-colors duration-200 hover:bg-brass-press active:bg-brass-press";

type ButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
  track?: string;
};

export function Button({ href, children, className, external, track }: ButtonProps) {
  const inner = (
    <>
      <span>{children}</span>
      <Icon
        name="arrow"
        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
      />
      {external ? <span className="sr-only">(opens in a new tab)</span> : null}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonClass, className)}
        data-track={track}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={cn(buttonClass, className)} data-track={track}>
      {inner}
    </Link>
  );
}

/**
 * The single conversion action. Label and destination are locked by the brief:
 * "Book an intro call", cal.com, new tab. Do not change the label.
 */
export function BookButton({ className }: { className?: string }) {
  return (
    <Button
      href={site.booking.href}
      external
      track="cta_click_book_call"
      className={className}
    >
      {site.booking.label}
    </Button>
  );
}

const textLinkClass =
  "inline-flex items-center gap-2 font-medium underline decoration-1 underline-offset-4 transition-colors hover:decoration-2";

export function PhoneLink({ className, withIcon = true }: { className?: string; withIcon?: boolean }) {
  return (
    <a href={site.phone.href} className={cn(textLinkClass, className)} data-track="phone_click">
      {withIcon ? <Icon name="phone" className="size-4 shrink-0" /> : null}
      <span>
        <span className="sr-only">Call </span>
        {site.phone.display}
      </span>
    </a>
  );
}

export function EmailLink({ className, withIcon = true }: { className?: string; withIcon?: boolean }) {
  return (
    <a href={site.email.href} className={cn(textLinkClass, className)} data-track="email_click">
      {withIcon ? <Icon name="mail" className="size-4 shrink-0" /> : null}
      <span>
        <span className="sr-only">Email </span>
        {site.email.display}
      </span>
    </a>
  );
}

/** Quiet text link with an arrow, for secondary actions like "See how it works". */
export function TextLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-1.5 font-medium text-charcoal underline decoration-brass decoration-1 underline-offset-[6px] hover:decoration-2 on-dark:text-ivory on-dark:decoration-brass-line",
        className,
      )}
    >
      {children}
      <Icon name="arrow" className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
    </Link>
  );
}
