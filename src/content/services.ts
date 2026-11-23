import type { Pillar } from "@/components/ui/PillarCard";

/**
 * The bundle, as decided 2026-11-23: present it the way
 * "ReplyLoop Pricing and Service Rules" (2026-11-23) does.
 * Monthly: review replies, 16 new creative pieces for Google Business Profile,
 * Facebook, and Instagram, and a monthly growth workbook.
 * Setup: owner interview, a one-time online presence audit, and replies to the
 * Google reviews already waiting.
 * Also available as one-time projects: websites, owner Q&A videos.
 * No prices, no plan names, no internal mechanics.
 */
export const bundlePillars: Pillar[] = [
  {
    icon: "reply",
    title: "Review replies",
    need: "Every new Google review deserves an answer, and the week rarely leaves time to write one.",
    what: "We reply to every new Google review in your voice. During setup, we also answer the reviews already waiting.",
    href: "/services/review-replies",
    linkLabel: "How review replies work",
  },
  {
    icon: "social",
    title: "Social content",
    need: "Facebook and Instagram go quiet when the work gets busy.",
    what: "Each month we create 16 new pieces, adapted for your Google Business Profile, Facebook, and Instagram. You approve them before they go out.",
    href: "/services/social-content",
    linkLabel: "How social content works",
  },
  {
    icon: "pin",
    title: "Google Business Profile",
    need: "Your Google profile is the page a nearby customer sees when they search for you.",
    what: "We start with a one-time audit of your online presence, then keep your profile active with new posts every month.",
    href: "/services/local-seo",
    linkLabel: "How we care for your profile",
  },
  {
    icon: "book",
    title: "Monthly growth workbook",
    need: "You want to grow your own reach, and you are not sure where your time is best spent.",
    what: "Each month you get a workbook with plain next steps for growing your presence yourself.",
  },
];

export const oneTimeProjects = [
  { href: "/services/websites", label: "Websites" },
  { href: "/services/owner-qa-videos", label: "Owner Q&A videos (scripting and filming)" },
];
