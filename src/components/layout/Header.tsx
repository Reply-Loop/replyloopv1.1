import Link from "next/link";
import { primaryNav } from "@/lib/site";
import { BookButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { MotionToggle } from "@/components/motion/MotionToggle";
import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-ivory/95 backdrop-blur supports-[backdrop-filter]:bg-ivory/85">
      <Container className="flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
        <Logo />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[0.95rem]">
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
        <div className="flex items-center gap-3">
          <MotionToggle />
          <div className="hidden md:block">
            <BookButton className="min-h-11 px-5 text-[0.9rem]" />
          </div>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
