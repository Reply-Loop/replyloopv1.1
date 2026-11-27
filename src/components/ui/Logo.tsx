import Link from "next/link";
import { cn } from "@/lib/cn";
import {
  LOOP_CROSSING_PATH,
  LOOP_PATH,
  LOOP_STROKE,
  LOOP_VIEWBOX,
} from "@/lib/loop/geometry.generated";

/**
 * Logo option B (chosen 2026-11-26): the kit's flat double loop, redrawn as a
 * true vector from the kit mark's own geometry (scripts/loop). Flat on purpose:
 * the hyper-real treatment is for scene elements, never the mark.
 *
 * The crossing detail is ivory on dark grounds, as in the kit avatar. On light
 * grounds an ivory crossing would disappear, so it turns charcoal there.
 * On charcoal the loop is brass-line #B8894A (owner-approved 2026-11-27, tone
 * only, geometry unchanged): brass #8A5F1C reads dull there (2.95:1).
 */
export function LoopMark({ className, tone = "auto" }: { className?: string; tone?: "auto" | "light" | "dark" }) {
  const crossing =
    tone === "dark"
      ? "text-ivory"
      : tone === "light"
        ? "text-charcoal"
        : "text-charcoal on-dark:text-ivory";
  return (
    <svg viewBox={LOOP_VIEWBOX} fill="none" className={cn("h-[22px] w-auto", className)} aria-hidden focusable="false">
      <path d={LOOP_PATH} className="text-brass on-dark:text-brass-line" stroke="currentColor" strokeWidth={LOOP_STROKE} strokeLinejoin="round" />
      <path d={LOOP_CROSSING_PATH} className={crossing} stroke="currentColor" strokeWidth={LOOP_STROKE + 0.4} />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2 rounded-sm", className)} aria-label="ReplyLoop, home">
      <LoopMark />
      <span className="font-serif text-[1.35rem] font-medium leading-none tracking-[-0.01em] text-charcoal on-dark:text-ivory">
        ReplyLoop
      </span>
    </Link>
  );
}
