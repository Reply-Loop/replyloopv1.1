import Link from "next/link";
import { legalNav, primaryNav, serviceNav, site } from "@/lib/site";
import { CookieSettingsLink } from "@/components/analytics/CookieSettingsLink";
import { EmailLink, PhoneLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { Sprite } from "@/components/ui/Sprite";

/**
 * Site footer (brief §8.1). Flat charcoal, no felt grain, so it reads as its own
 * piece below the CTA band (whose bottom hairline separates the two).
 * - Brand column: logo, tagline, where we are, and a quiet booking text link.
 * - Column headings: the eyebrow token in mist (14px).
 * - Mobile: Services and Company side by side, the contact block full width.
 * - Sign-off: the "ReplyLoop" wordmark, tone-on-tone ink-2 on charcoal, from the
 *   shared sprite. Decorative (aria-hidden, no text node): the name is already
 *   real text in the logo and the copyright line.
 * The mobile bar hides while the footer is on screen, so no extra bottom room.
 */
const headingClass =
  "font-sans text-eyebrow font-semibold uppercase tracking-[0.08em] text-mist sm:tracking-[0.14em]";
const listClass = "mt-3 space-y-2 text-small sm:mt-4 sm:space-y-3";

export function Footer() {
  const linkClass = "text-mist underline-offset-4 hover:text-ivory hover:underline";
  return (
    <footer className="tone-dark bg-charcoal pt-12 pb-6 text-ivory sm:pt-16 sm:pb-12">
      <Container>
        <div className="grid grid-cols-2 gap-x-6 gap-y-7 sm:gap-y-12 md:grid-cols-3 md:gap-x-8 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-x-12">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-mist">{site.tagline}</p>
            <p className="mt-1 max-w-xs text-mist">Based in Salt Lake County, Utah.</p>
            <a
              href={site.booking.href}
              target="_blank"
              rel="noopener noreferrer"
              data-track="cta_click_book_call"
              className="group mt-4 inline-flex items-center gap-2 font-semibold text-ivory underline decoration-brass-line decoration-1 underline-offset-[6px] hover:decoration-2"
            >
              <span>{site.booking.label}</span>
              <Icon
                name="arrow"
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none [:root[data-motion=reduce]_&]:transition-none"
              />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
          <nav aria-label="Services">
            <h2 className={headingClass}>Services</h2>
            <ul className={listClass}>
              {serviceNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Company">
            <h2 className={headingClass}>Company</h2>
            <ul className={listClass}>
              {primaryNav
                .filter((item) => item.href !== "/services")
                .map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <h2 className={headingClass}>Talk with us</h2>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-small sm:mt-4 lg:flex-col lg:gap-y-3">
              <li>
                <PhoneLink className="text-ivory" />
              </li>
              <li>
                <EmailLink className="text-ivory" />
              </li>
              <li className="w-full text-mist">{site.areaServedSentence}</li>
            </ul>
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-small text-mist sm:mt-12">{site.notAffiliated}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-hairline-dark pt-6 text-sm text-mist">
          <p>
            © {site.copyrightYear} {site.name}
          </p>
          <ul className="flex gap-6">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
            <CookieSettingsLink className={linkClass} />
          </ul>
        </div>
        <Sprite id="wordmark" className="mt-6 w-2/3 text-ink-2 sm:mt-12 sm:w-[min(100%,52vw)]" />
      </Container>
    </footer>
  );
}
