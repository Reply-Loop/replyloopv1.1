"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav } from "@/lib/site";

/**
 * Desktop nav links. The underline is a 1px brass line drawn in from the left
 * and leaving to the right (.nav-link in globals.css); the current page keeps
 * it, with aria-current="page".
 */
export function NavLinks() {
  const pathname = usePathname();
  return (
    <ul className="flex items-center gap-5 text-small xl:gap-7">
      {primaryNav.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
            className="nav-link rounded-sm py-2 text-charcoal"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
