import Link from "next/link";
import type { Crumb } from "@/lib/schema";
import { Icon } from "./Icon";

/*
 * Each link gets a 44px-tall hit area from an invisible ::after (12px above and below the
 * 22.5px line, 8px either side), so the trail keeps its one-line height in the hero.
 */
const HIT = "relative after:absolute after:-inset-x-2 after:-inset-y-3";

/**
 * Visible breadcrumb trail (brief §8.11, §8.13). Pair with breadcrumbSchema() for JSON-LD.
 * - Phones (< 640px): only the parent, as one link with a drawn arrow before its name
 *   (a post shows "Blog"; a top-level page shows "Home").
 * - From 640px: the full trail. The current page is the last crumb, with aria-current; a long
 *   title is cut with an ellipsis at 40ch, and the full title stays in the DOM text (read by
 *   assistive tech) and in a title attribute (a tooltip for sighted visitors).
 * The phone link and the full list are display-toggled, so assistive tech reads only one.
 */
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const parent = crumbs.length > 1 ? crumbs[crumbs.length - 2] : undefined;
  return (
    <nav aria-label="Breadcrumb" className="text-small text-slate">
      {parent ? (
        <Link
          href={parent.path}
          className={`${HIT} inline-flex items-center gap-2 underline-offset-4 hover:underline sm:hidden`}
        >
          <Icon name="arrow" className="size-4 shrink-0 rotate-180 text-brass" />
          {parent.name}
        </Link>
      ) : null}
      <ol className="hidden flex-wrap items-center gap-x-2 gap-y-1 sm:flex">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.path} className="flex min-w-0 items-center gap-2">
              {last ? (
                <span aria-current="page" title={c.name} className="block max-w-[40ch] truncate text-charcoal">
                  {c.name}
                </span>
              ) : (
                <>
                  <Link href={c.path} className={`${HIT} underline-offset-4 hover:underline`}>
                    {c.name}
                  </Link>
                  <span aria-hidden className="text-brass">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
