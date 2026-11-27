import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import { Rule } from "@/components/ui/Eyebrow";
import { BrandFilm } from "./BrandFilm";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * The brand film as its own block after How it works (brief §8.3.3, step 1).
 * The page places it in an ivory-2 band. At lg: the frame in cols 1–8 (BrandFilm
 * carries the frame itself: 20px radius, 1px rule border, --shadow-3,
 * .reveal-art), the caption in cols 9–12, centred on the frame.
 *
 * The caption is the film's on-screen words as real text, verbatim and in the
 * film's order (video/src/Film.tsx: the "ReplyLoop" wordmark, then the
 * tagline), and nothing else. If the film's words change in the re-cut, this
 * caption changes with it.
 */
export function FilmFeature({ className }: { className?: string }) {
  return (
    <figure className={cn("lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-8", className)}>
      <BrandFilm className="lg:col-span-8" />
      <figcaption className="mt-8 lg:col-span-4 lg:mt-0">
        <Rule className="reveal-rule mb-6" />
        <p className="reveal font-serif text-h2 font-medium text-charcoal" style={step(0)}>
          {site.name}
        </p>
        <p className="reveal mt-3 text-lede text-slate" style={step(1)}>
          {site.tagline}
        </p>
      </figcaption>
    </figure>
  );
}
