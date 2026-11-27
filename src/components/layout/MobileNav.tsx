"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { primaryNav } from "@/lib/site";
import { Icon } from "@/components/ui/Icon";

/** Same breakpoint as the wrapper's lg:hidden: at this width the menu is gone. */
const DESKTOP_QUERY = "(min-width: 64rem)";

/**
 * Small-screen menu (brief §7.7). The panel stays in the DOM: closed, it is
 * inert (not focusable, not in the accessibility tree), transparent and
 * clipped to nothing; open, it fades in, drops 8px into place and unclips
 * top to bottom over 280ms --ease-soft, and closes over 180ms --ease-in.
 * Links stagger 30ms on open (the link fade is named exception 4, §4).
 * A charcoal/20 scrim below the header closes it on click. Focus moves to the
 * first link on open and back to the toggle on close; Escape closes; page
 * scroll is locked while open; a route change closes it. Everything is
 * instant under reduced motion. Without JavaScript the panel stays inert and
 * cannot open: those visitors use the footer links.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const wasOpen = useRef(false);
  const [lastPath, setLastPath] = useState(pathname);

  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Focus: first link on open; back to the toggle on close, unless focus has
  // already moved somewhere real (Tab out of the menu, or the new page took it).
  useEffect(() => {
    const panel = panelRef.current;
    if (open) {
      panel?.querySelector<HTMLElement>("a[href]")?.focus({ preventScroll: true });
    } else if (wasOpen.current) {
      const active = document.activeElement;
      if (!active || active === document.body || panel?.contains(active)) {
        buttonRef.current?.focus();
      }
    }
    wasOpen.current = open;
  }, [open]);

  // Announce the open menu on <html> so the fixed mobile bar can step aside
  // (it would otherwise paint above the scrim and stay clickable).
  useEffect(() => {
    const root = document.documentElement;
    root.toggleAttribute("data-menu-open", open);
    return () => root.removeAttribute("data-menu-open");
  }, [open]);

  // While open: Escape closes, the page behind cannot scroll, and widening
  // to the desktop nav closes the menu (its wrapper is display:none there).
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    const prevPadding = root.style.paddingRight;
    // Keep the layout still where a classic scrollbar disappears.
    const gutter = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (gutter > 0) root.style.paddingRight = `${gutter}px`;
    // Hook for other chrome (e.g. the mobile bar) to step aside while the menu is open.
    root.setAttribute("data-menu-open", "");

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const onDesktop = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
      root.style.overflow = prevOverflow;
      root.style.paddingRight = prevPadding;
      root.removeAttribute("data-menu-open");
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-11 items-center justify-center rounded-full border border-rule text-charcoal"
      >
        <Icon name={open ? "close" : "menu"} className="size-5" />
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      </button>

      {/* Scrim: decorative, pointer only (Escape is the keyboard equivalent). */}
      <div
        aria-hidden
        data-open={open ? "" : undefined}
        onClick={() => setOpen(false)}
        className="pointer-events-none fixed inset-x-0 top-[var(--header-h)] bottom-0 bg-charcoal/20 opacity-0 transition-opacity duration-200 ease-in data-open:pointer-events-auto data-open:opacity-100 data-open:ease-soft motion-reduce:transition-none [:root[data-motion=reduce]_&]:transition-none"
      />

      <nav
        ref={panelRef}
        id={panelId}
        aria-label="Main"
        inert={!open}
        data-open={open ? "" : undefined}
        className="group absolute inset-x-0 top-full max-h-[calc(100dvh-var(--header-h))] -translate-y-2 overflow-y-auto overscroll-contain border-b border-rule bg-ivory opacity-0 shadow-[0_12px_24px_-16px_rgb(27_31_35/0.35)] transition-[opacity,translate,clip-path] duration-(--dur-exit) ease-in [clip-path:inset(0_0_100%_0)] data-open:translate-y-0 data-open:opacity-100 data-open:duration-280 data-open:ease-soft data-open:[clip-path:inset(0_0_-24px_0)] motion-reduce:transition-none [:root[data-motion=reduce]_&]:transition-none"
      >
        <ul className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
          {primaryNav.map((item, i) => (
            <li
              key={item.href}
              style={{ "--i": i } as CSSProperties}
              className="-translate-y-1 border-b border-rule opacity-0 transition-[opacity,translate] duration-(--dur-exit) ease-in group-data-open:translate-y-0 group-data-open:opacity-100 group-data-open:delay-[calc(var(--i)*30ms)] group-data-open:duration-280 group-data-open:ease-soft motion-reduce:transition-none [:root[data-motion=reduce]_&]:transition-none last:border-0"
            >
              <Link
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                // A link to the current page is no route change: close here too,
                // or the menu (and the scroll lock) would stay up.
                onClick={() => {
                  if (item.href === pathname) setOpen(false);
                }}
                className="block py-4 font-serif text-xl"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
