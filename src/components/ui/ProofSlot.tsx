import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ProofKind =
  | "testimonial"
  | "client-logos"
  | "founder-photo"
  | "hunter-bio"
  | "brigham-bio"
  | "owner-qa-video"
  | "profile-before-after";

/**
 * Proof is never invented. With no real content passed as children:
 * - in development, a dashed placeholder shows where real proof belongs;
 * - in production, the slot renders nothing unless
 *   NEXT_PUBLIC_SHOW_PROOF_PLACEHOLDERS is "true". Default: hidden.
 * Every slot is listed in PLACEHOLDERS.md.
 */
export function ProofSlot({
  kind,
  label,
  path,
  children,
  className,
}: {
  kind: ProofKind;
  label: string;
  /** Where the real asset or content should be added. */
  path: string;
  children?: ReactNode;
  className?: string;
}) {
  if (children) return <div className={className}>{children}</div>;

  const show =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_SHOW_PROOF_PLACEHOLDERS === "true";
  if (!show) return null;

  return (
    <div
      data-proof-slot={kind}
      className={cn(
        "tone-light rounded-2xl border-2 border-dashed border-brass/60 bg-ivory p-6 text-sm text-charcoal",
        className,
      )}
    >
      <p className="font-semibold">Placeholder: add a real testimonial, result, or photo here.</p>
      <p className="mt-2 text-slate">
        Slot: {label}. File: <code className="font-mono text-[0.85em]">{path}</code>
      </p>
    </div>
  );
}
