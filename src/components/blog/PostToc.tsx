"use client";

import { useEffect, useState } from "react";
import type { OutlineItem } from "./outline";

/**
 * "On this page" (brief §8.11): the post's H2s as in-page links, sticky in the left gutter
 * at lg and up (the aside around it is hidden below lg). Server-rendered in full, so the list
 * is there without JavaScript and nothing shifts when it hydrates (CLS 0): the observer only
 * changes which link is brass, never sizes or weights.
 *
 * Active item: the last H2 whose top has passed 40% of the viewport. One IntersectionObserver
 * watches the H2s against the area above that line (no scroll listener); each crossing recomputes.
 * The active link is brass (5.17:1 on ivory) with aria-current="true"; the rest are slate.
 * The colour change is instant (no transition).
 */
export function PostToc({ items }: { items: OutlineItem[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const headings = items
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!headings.length || !("IntersectionObserver" in window)) return;

    const update = () => {
      const line = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= line) current = h.id;
        else break;
      }
      setActive(current);
    };
    // The observed band is everything above the 40% line (the top margin reaches far above the
    // viewport), so a heading fires whenever it crosses that line, even on a long jump (End key,
    // a far link) that carries it from below the viewport to above it in one frame.
    const io = new IntersectionObserver(update, { rootMargin: "100000px 0px -60% 0px" });
    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-labelledby="post-toc-label" className="sticky top-[calc(var(--header-h)+2.5rem)]">
      <p id="post-toc-label" className="text-eyebrow font-semibold uppercase tracking-[0.14em] text-charcoal">
        On this page
      </p>
      <ol className="mt-4 border-l border-rule">
        {items.map(({ id, text }) => {
          const on = id === active;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={on ? "true" : undefined}
                className={
                  "-ml-px block border-l py-2 pl-4 text-[0.875rem] leading-[1.45] underline-offset-4 hover:underline " +
                  (on ? "border-brass text-brass" : "border-transparent text-slate")
                }
              >
                {text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
