"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { BookButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/**
 * Only elements that are actually rendered. With Cache Components, routes kept
 * alive by React <Activity> stay in the DOM under display:none.
 */
function isRendered(el: Element): boolean {
  return typeof el.checkVisibility === "function" ? el.checkVisibility() : el.getClientRects().length > 0;
}

/** True while the small-screen menu is open (MobileNav sets html[data-menu-open]). */
function subscribeMenu(callback: () => void) {
  const mo = new MutationObserver(callback);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-menu-open"] });
  return () => mo.disconnect();
}
const menuOpenNow = () => document.documentElement.hasAttribute("data-menu-open");

/** --header-h in px: the sticky header covers the top of the viewport. */
function headerHeight(): number {
  const root = document.documentElement;
  const raw = getComputedStyle(root).getPropertyValue("--header-h").trim();
  const value = parseFloat(raw);
  if (!Number.isFinite(value)) return 0;
  return raw.endsWith("rem") ? value * parseFloat(getComputedStyle(root).fontSize) : value;
}

/**
 * Small-screen bar: Call and Book (§8.1). It slides in once the hero CTA
 * ([data-hero-cta]) has scrolled out above the viewport, and slides out while
 * the CTA band ([data-cta-band]) or the footer is on screen. IntersectionObserver
 * only, no scroll listener. Never shown on /contact.
 *
 * The server (and no-JS) render has no data-visible: the bar sits off-screen,
 * inert and aria-hidden. Visitors without JavaScript never see it; the hero
 * CTA and the CTA band remain.
 */
export function MobileBar() {
  const pathname = usePathname();
  const hidden = pathname === "/contact" || pathname.startsWith("/contact/");
  const [inView, setVisible] = useState(false);
  // Leaving the bar's state behind on /contact: start hidden on the next page
  // rather than flashing in at translate 0 (state adjusted during render).
  if (hidden && inView) setVisible(false);
  // The bar steps aside while the small-screen menu is open.
  const menuOpen = useSyncExternalStore(subscribeMenu, menuOpenNow, () => false);
  const visible = inView && !menuOpen;

  useEffect(() => {
    if (hidden || typeof IntersectionObserver === "undefined") return;

    const observers: IntersectionObserver[] = [];
    // One frame after commit, so the new route's DOM (and <Activity> hiding the old one) has settled.
    const frame = requestAnimationFrame(() => {
      const heroes = Array.from(document.querySelectorAll("[data-hero-cta]")).filter(isRendered);
      const blockers = Array.from(document.querySelectorAll("[data-cta-band], footer")).filter(isRendered);

      // No rendered hero CTA counts as already passed (heroNotPassed stays empty).
      // With nothing to observe at all, no callback would ever run: settle here.
      if (heroes.length === 0 && blockers.length === 0) {
        setVisible(true);
        return;
      }

      const heroPending = new Set<Element>(heroes);
      const blockerPending = new Set<Element>(blockers);
      const heroNotPassed = new Set<Element>();
      const onScreen = new Set<Element>();
      // Decide only once every observed element has reported, so the bar never
      // flashes in before the band or footer state is known.
      const update = () => {
        if (heroPending.size > 0 || blockerPending.size > 0) return;
        setVisible(heroNotPassed.size === 0 && onScreen.size === 0);
      };

      if (heroes.length > 0) {
        const top = headerHeight();
        // The root runs from under the sticky header to far below the viewport,
        // so "not intersecting" means "scrolled out above". This stays right
        // even when a jump (End key, anchor) skips the CTA past the viewport
        // without it ever intersecting the viewport itself.
        const heroObserver = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              heroPending.delete(entry.target);
              if (entry.isIntersecting) heroNotPassed.add(entry.target);
              else heroNotPassed.delete(entry.target);
            }
            update();
          },
          { rootMargin: `${-top}px 0px 100000px 0px` },
        );
        for (const el of heroes) heroObserver.observe(el);
        observers.push(heroObserver);
      }

      if (blockers.length > 0) {
        const blockerObserver = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            blockerPending.delete(entry.target);
            if (entry.isIntersecting) onScreen.add(entry.target);
            else onScreen.delete(entry.target);
          }
          update();
        });
        for (const el of blockers) blockerObserver.observe(el);
        observers.push(blockerObserver);
      }
    });

    return () => {
      cancelAnimationFrame(frame);
      for (const observer of observers) observer.disconnect();
    };
  }, [pathname, hidden]);

  if (hidden) return null;

  return (
    <div
      data-visible={visible ? "" : undefined}
      style={{ viewTransitionName: "mobile-bar" }}
      inert={!visible}
      aria-hidden={visible ? undefined : true}
      className="tone-dark fixed inset-x-0 bottom-0 z-40 translate-y-full border-t border-brass-line/30 bg-charcoal h-[calc(4rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] transition-transform duration-180 ease-in data-visible:translate-y-0 data-visible:duration-280 data-visible:ease-soft motion-reduce:transition-none md:hidden [:root[data-motion=reduce]_&]:transition-none"
    >
      <div className="mx-auto flex h-full max-w-md items-center gap-3 px-4">
        <a
          href={site.phone.href}
          data-track="phone_click"
          aria-label="Call ReplyLoop"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-mist/50 text-ivory hover:border-ivory"
        >
          <Icon name="phone" className="size-5" />
          <span className="sr-only"> {site.phone.display}</span>
        </a>
        <BookButton className="flex-1 px-4" />
      </div>
    </div>
  );
}
