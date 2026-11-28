import Link from "next/link";
import { legalNav, primaryNav, serviceNav, site } from "@/lib/site";
import { CookieSettingsLink } from "@/components/analytics/CookieSettingsLink";
import { EmailLink, PhoneLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const linkClass = "text-mist underline-offset-4 hover:text-ivory hover:underline";
  return (
    <footer className="tone-dark border-t border-brass-line/30 bg-charcoal pt-16 pb-28 text-ivory md:pb-12">
      <Container>
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-mist">{site.tagline}</p>
          </div>
          <nav aria-label="Services">
            <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.16em] text-ivory">
              Services
            </h2>
            <ul className="mt-4 space-y-3 text-[0.95rem]">
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
            <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.16em] text-ivory">
              Company
            </h2>
            <ul className="mt-4 space-y-3 text-[0.95rem]">
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
          <div>
            <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.16em] text-ivory">
              Talk with us
            </h2>
            <ul className="mt-4 space-y-3 text-[0.95rem]">
              <li>
                <PhoneLink className="text-ivory" />
              </li>
              <li>
                <EmailLink className="text-ivory" />
              </li>
              <li className="text-mist">{site.areaServedSentence}</li>
            </ul>
          </div>
        </div>
        <p className="mt-14 max-w-3xl text-sm text-mist">{site.notAffiliated}</p>
        <div className="mt-6 flex flex-col gap-4 border-t border-mist/20 pt-6 text-sm text-mist sm:flex-row sm:items-center sm:justify-between">
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
      </Container>
    </footer>
  );
}
