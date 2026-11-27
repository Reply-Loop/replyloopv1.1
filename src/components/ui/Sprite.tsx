import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/**
 * Decorative art from the shared sprite (public/brand/sprite.svg, built by
 * scripts/brand/build-sprite.py). The drawing ships once and is cached, instead
 * of inline in every page's HTML and RSC payloads. The element is an inline
 * <svg>, never an <img>, so it is not an LCP candidate; size it with CSS
 * (its aspect ratio is fixed here, so it reserves its box and causes no shift).
 * Colour comes from `color` (currentColor). Always aria-hidden.
 */
const SYMBOLS = {
  /** LOOP_PATH as a stroke drawing; stroke width via --loop-stroke (default 1.5px). */
  loop: { aspect: "221.61 / 103.14" },
  /** "ReplyLoop" outlined in Fraunces 500 at display optical size. */
  wordmark: { aspect: "8504 / 1968" },
} as const;

export type SpriteId = keyof typeof SYMBOLS;

export const SPRITE_URL = "/brand/sprite.svg";

export function Sprite({
  id,
  className,
  strokeWidth,
}: {
  id: SpriteId;
  className?: string;
  /** Loop only: stroke width in screen px (non-scaling). */
  strokeWidth?: number;
}) {
  const style = {
    aspectRatio: SYMBOLS[id].aspect,
    ...(strokeWidth ? { "--loop-stroke": `${strokeWidth}px` } : {}),
  } as CSSProperties;
  return (
    <svg aria-hidden focusable="false" className={cn("block h-auto overflow-visible", className)} style={style}>
      <use href={`${SPRITE_URL}#${id}`} width="100%" height="100%" />
    </svg>
  );
}
