import Link from "next/link";
import { primaryNav } from "@/lib/site";
import { BookButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { MotionToggle } from "@/components/motion/MotionToggle";
import { HeaderScroll } from "./HeaderScroll";
import { MobileNav } from "./MobileNav";

/** The sticky header; HeaderScroll sets data-scrolled on it. */
export const SITE_HEADER_ID = "site-header";
/** The 1px element at the very top of <body> (layout.tsx) that HeaderScroll observes. */
export const SCROLL_SENTINEL_ID = "scroll-sentinel";

/**
 * Solid ivory header (no alpha, no blur, so it reads #F8F5EF over any band).
 * Three-column grid with equal outer tracks keeps the nav on the viewport's
 * centre line. The nav gap is 20px from lg to xl so the outer tracks stay
 * wider than the actions (one-line button) down to 1024px and the centre holds.
 * Below lg the middle track is empty, so the grid has no gap there (two gaps
 * around an empty track would push the actions past the edge at 320px).
 * The scrolled state (rule border + --shadow-header) lives on an
 * absolutely positioned ::after that only fades its opacity: no layout shift,
 * no per-frame shadow work. It sits at z -1 inside the header's stacking
 * context, above the ivory fill and below the content and the mobile panel.
 */
export function Header() {
  return (
    <header
      id={SITE_HEADER_ID}
      className="sticky top-0 z-40 bg-ivory after:pointer-events-none after:absolute after:inset-0 after:-z-1 after:border-b after:border-rule after:opacity-0 after:shadow-header after:transition-opacity after:duration-[240ms] after:ease-soft data-scrolled:after:opacity-100 motion-reduce:after:transition-none [:root[data-motion=reduce]_&]:after:transition-none"
    >
      <HeaderScroll headerId={SITE_HEADER_ID} sentinelId={SCROLL_SENTINEL_ID} />
      <Container className="grid h-[var(--header-h)] grid-cols-[1fr_auto_1fr] items-center lg:gap-6">
        <Logo className="col-start-1 justify-self-start" />
        <nav aria-label="Main" className="col-start-2 hidden lg:block">
          <ul className="flex items-center gap-5 text-small xl:gap-7">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-sm py-2 text-charcoal underline-offset-[6px] decoration-brass hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="col-start-3 flex items-center gap-3 justify-self-end">
          <MotionToggle />
          <div className="hidden md:block">
            <BookButton className="min-h-11 px-5 text-[0.9rem] whitespace-nowrap" />
          </div>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
