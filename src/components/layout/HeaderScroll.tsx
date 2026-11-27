"use client";

import { useEffect } from "react";

/**
 * Sets data-scrolled on the site header once the page has scrolled, by
 * watching the top-of-body sentinel leave the viewport. No scroll listener.
 * The header's ::after layer (border + shadow) fades in on that attribute.
 * Renders nothing; without JS the header simply stays in its resting state.
 * The ids come from Header.tsx as props (a "use client" module's non-component
 * exports are client references on the server, so the constants live there).
 */
export function HeaderScroll({ headerId, sentinelId }: { headerId: string; sentinelId: string }) {
  useEffect(() => {
    const sentinel = document.getElementById(sentinelId);
    const header = document.getElementById(headerId);
    if (!sentinel || !header || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(([entry]) => {
      header.toggleAttribute("data-scrolled", !entry.isIntersecting);
    });
    observer.observe(sentinel);
    return () => {
      observer.disconnect();
      header.removeAttribute("data-scrolled");
    };
  }, [headerId, sentinelId]);

  return null;
}
