import { cn } from "@/lib/cn";

/**
 * The one pause control for every moving scene (brief §6.8).
 * A 36px opaque chip inside a 44px hit area, inset 16px from the scene's
 * bottom-right corner. Light: ivory chip, charcoal icon (15.23:1). Dark: ink-2
 * chip, ivory icon (13.12:1). The 1px ring is decorative. It is present whenever
 * the scene can move, playing or paused, with no hover-only state, no entrance
 * delay and no fade, so touch and keyboard users can always find it.
 * Toggle-button pattern: a fixed name and aria-pressed; only the icon changes.
 */
export function PauseControl({
  pressed,
  onToggle,
  label,
  tone = "light",
  className,
}: {
  /** True while the scene is paused. */
  pressed: boolean;
  onToggle: () => void;
  /** Fixed accessible name, e.g. "Pause motion" or "Pause film". */
  label: string;
  tone?: "light" | "dark";
  /** Positioning override; defaults to the 16px bottom-right inset. */
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onToggle}
      className={cn("group absolute z-10 inline-flex size-11 items-center justify-center", className ?? "right-3 bottom-3")}
    >
      <span
        aria-hidden
        className={cn(
          "inline-flex size-9 items-center justify-center rounded-pill border",
          tone === "light"
            ? "border-rule bg-ivory text-charcoal group-hover:border-brass"
            : "border-brass-line bg-ink-2 text-ivory",
        )}
      >
        <svg viewBox="0 0 24 24" className="size-4" focusable="false" fill="currentColor">
          {pressed ? <path d="M8 5.5v13l10.5-6.5z" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}
        </svg>
      </span>
      <span className="sr-only">{label}</span>
    </button>
  );
}
