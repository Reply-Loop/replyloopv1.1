"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * True while the element is on screen (with a margin). Used to pause video,
 * WebGL, and ambient loops off screen. Effects clean up on unmount and when a
 * route is hidden by <Activity>, so observers never outlive their page.
 */
export function useInViewport(ref: RefObject<Element | null>, rootMargin = "200px 0px"): boolean {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin });
    io.observe(el);
    return () => {
      io.disconnect();
      setVisible(false);
    };
  }, [ref, rootMargin]);
  return visible;
}
