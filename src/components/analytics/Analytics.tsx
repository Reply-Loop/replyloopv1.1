"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  getConsentSnapshot,
  subscribeConsent,
  subscribeOpenSettings,
  writeConsent,
  type Consent,
} from "@/lib/consent";

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/** Events the brief asks for. Elements carry them as data-track attributes. */
const TRACKED = new Set(["cta_click_book_call", "phone_click", "email_click"]);

/**
 * GA4 with Consent Mode v2.
 * - Nothing loads, and no cookie is set, until the visitor accepts.
 * - On accept: consent defaults are set to denied, analytics_storage is then
 *   granted, and ad storage, ad user data, and ad personalization stay denied.
 * - With no NEXT_PUBLIC_GA_ID, this renders nothing at all (no banner either).
 */
export function Analytics() {
  // On the server and during hydration the choice is unknown ("pending"):
  // no banner is rendered and nothing loads until the real choice is read.
  const consent = useSyncExternalStore<Consent | "pending">(subscribeConsent, getConsentSnapshot, () => "pending");
  const [reopened, setReopened] = useState(false);

  useEffect(() => subscribeOpenSettings(() => setReopened(true)), []);

  useEffect(() => {
    if (!GA_ID || consent !== "granted") return;
    loadGa(GA_ID);
  }, [consent]);

  useEffect(() => {
    if (!GA_ID) return;
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.("[data-track]");
      const name = el?.getAttribute("data-track");
      if (!name || !TRACKED.has(name) || getConsentSnapshot() !== "granted" || !window.gtag) return;
      window.gtag("event", name, {
        link_url: (el as HTMLAnchorElement).href,
        page_path: window.location.pathname,
      });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!GA_ID || consent === "pending") return null;
  if (consent !== "unset" && !reopened) return null;

  const choose = (value: "granted" | "denied") => {
    writeConsent(value);
    setReopened(false);
    if (value === "denied" && window.gtag) {
      window.gtag("consent", "update", { analytics_storage: "denied" });
    }
  };

  return (
    <div
      role="region"
      aria-label="Cookie choice"
      className="tone-dark fixed inset-x-3 bottom-24 z-50 mx-auto max-w-xl rounded-2xl border border-brass-line/40 bg-charcoal p-5 text-ivory shadow-[0_16px_40px_-16px_rgb(0_0_0/0.5)] md:bottom-5"
    >
      <p className="text-[0.95rem] leading-relaxed text-mist">
        With your yes, we use Google Analytics cookies to see which pages help owners. No ads, and nothing sold.{" "}
        <Link href="/privacy" className="text-ivory underline decoration-brass-line underline-offset-4">
          Privacy
        </Link>
      </p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => choose("granted")}
          className="min-h-11 flex-1 rounded-full border border-ivory/70 px-5 font-semibold text-ivory hover:bg-ivory hover:text-charcoal"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => choose("denied")}
          className="min-h-11 flex-1 rounded-full border border-ivory/70 px-5 font-semibold text-ivory hover:bg-ivory hover:text-charcoal"
        >
          Decline
        </button>
      </div>
    </div>
  );
}

let loaded = false;

function loadGa(id: string) {
  if (loaded) return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js expects the arguments object itself.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
  window.gtag("consent", "update", { analytics_storage: "granted" });
  window.gtag("js", new Date());
  window.gtag("config", id);
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}
