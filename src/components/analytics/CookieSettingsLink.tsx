"use client";

import { openConsentSettings } from "@/lib/consent";

/** Footer list item that reopens the cookie choice. Hidden when analytics is not configured. */
export function CookieSettingsLink({ className }: { className?: string }) {
  if (!process.env.NEXT_PUBLIC_GA_ID) return null;
  return (
    <li>
      <button type="button" onClick={openConsentSettings} className={className}>
        Cookie settings
      </button>
    </li>
  );
}
