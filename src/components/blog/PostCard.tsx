import Link from "next/link";
import { Card, cardLinkOverlay } from "@/components/ui/Card";
import type { PostMeta } from "@/content/posts";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/date";
import { readingLabel } from "@/lib/readingTime";
import { LoopStrip } from "./LoopStrip";

/**
 * A guide as an interactive light card (brief §8.10, §8.11): the whole card is the link (the
 * title link's ::after covers the card, and its focus ring rings the card). The title carries
 * no underline at rest; on hover or keyboard focus it gets a brass underline, the title only.
 * Meta row in slate at 0.9375rem: date · reading time (computed, src/lib/readingTime.ts).
 *
 * - strip: the 120px ivory-2 header strip with the post's loop crop (/blog index; the page
 *   renders <LoopSymbol> once).
 * - feature: at lg the card becomes two columns, the strip as a full-height panel on the left
 *   and the text on the right (the first post on /blog). Give the <li> a 2-column span.
 */
export function PostCard({
  post,
  index,
  heading = "h2",
  strip = false,
  feature = false,
  className,
}: {
  post: PostMeta;
  /** Position in its grid: reveal stagger and the strip's crop. */
  index: number;
  heading?: "h2" | "h3";
  strip?: boolean;
  feature?: boolean;
  className?: string;
}) {
  const Heading = heading;
  return (
    <Card
      as="li"
      interactive
      reveal={index}
      className={cn("flex flex-col", feature && "lg:grid lg:grid-cols-2 lg:gap-x-8", className)}
    >
      {strip ? (
        <LoopStrip
          index={index}
          className={cn(
            // Bleeds to the card's edges inside its 1px border; the inner radius is the card's minus 1px.
            "-mx-6 -mt-6 mb-6 h-[120px] shrink-0 rounded-t-[calc(var(--radius-card)-1px)] sm:-mx-8 sm:-mt-8 sm:mb-8",
            feature &&
              "lg:mr-0 lg:-mb-8 lg:h-auto lg:min-h-[240px] lg:rounded-tr-none lg:rounded-l-[calc(var(--radius-card)-1px)]",
          )}
        />
      ) : null}
      <div className={cn("flex flex-1 flex-col", feature && "lg:justify-center lg:py-4")}>
        <Heading className={cn("font-serif font-medium", heading === "h2" ? "text-h3-lg" : "text-h3", feature && "lg:text-h2-compact")}>
          <Link
            href={`/blog/${post.slug}`}
            className={cn(cardLinkOverlay, "decoration-brass underline-offset-4 hover:underline focus-visible:underline")}
          >
            {post.title}
          </Link>
        </Heading>
        <p className="mt-3 text-slate">{post.description}</p>
        <p className={cn("mt-auto pt-6 text-small text-slate", feature && "lg:mt-0")}>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden className="mx-2">
            ·
          </span>
          {readingLabel(post.readingMinutes)}
        </p>
      </div>
    </Card>
  );
}
