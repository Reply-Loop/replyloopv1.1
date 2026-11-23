/**
 * Single source of truth for business facts on this site.
 * Every value here comes from the 2026-11-23 operator brief.
 * Do not add a street address, price, plan name, or statistic.
 */
export const site = {
  name: "ReplyLoop",
  tagline: "Keep the thank you alive.",
  /** Production origin. Set NEXT_PUBLIC_SITE_URL in Vercel. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://reply-loop.com").replace(/\/$/, ""),
  description:
    "ReplyLoop helps home care agencies and local health practices in Salt Lake County and across Utah capture and answer every Google review, so honest service becomes the foundation the next customer can see.",
  phone: {
    display: "(801) 889-7181",
    href: "tel:+18018897181",
    e164: "+18018897181",
  },
  email: {
    display: "hb@reply-loop.com",
    href: "mailto:hb@reply-loop.com",
  },
  booking: {
    label: "Book an intro call",
    href: "https://cal.com/hunter-newbold-klaopa/intro-call",
  },
  /** Area-served language only. No street address, no geo coordinates. */
  areaServed: ["Murray", "Salt Lake City", "Salt Lake County", "Utah"] as const,
  areaServedSentence: "Serving Murray, Salt Lake City, Salt Lake County, and Utah.",
  /** Approved 2026-11-23. Never name the other products. */
  notAffiliated:
    "ReplyLoop at reply-loop.com is a Salt Lake County service and is not affiliated with any other product or company with a similar name.",
  copyrightYear: 2026,
} as const;

export type NavItem = { href: string; label: string };

export const primaryNav: NavItem[] = [
  { href: "/services", label: "Services" },
  { href: "/home-care-agencies", label: "Home care" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export const serviceNav: NavItem[] = [
  { href: "/services/review-replies", label: "Review replies" },
  { href: "/services/social-content", label: "Social content" },
  { href: "/services/local-seo", label: "Local SEO and Google Business Profile" },
  { href: "/services/websites", label: "Websites" },
  { href: "/services/owner-qa-videos", label: "Owner Q&A videos" },
];

export const legalNav: NavItem[] = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];
