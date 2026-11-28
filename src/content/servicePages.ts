import type { FaqItem } from "@/components/ui/FAQ";
import type { IconName } from "@/components/ui/Icon";
import { faqs } from "./faq";
import { postIndex, type PostMeta } from "./posts";

/**
 * Service pages. One primary keyword each (see README keyword map).
 * Facts come only from the brief and "ReplyLoop Pricing and Service Rules" (2026-11-23).
 * No prices, no plan names, no ranking or result claims.
 */
export type ServiceSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  /** Bullets are things we refuse to do: render with an ✕, not a check. */
  negative?: boolean;
};

export type ServicePage = {
  slug: string;
  name: string;
  icon: IconName;
  keyword: string;
  serviceType: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  intro: string;
  /** "monthly" work is in the bundle; "one-time" is a separate project priced one time. */
  kind: "monthly" | "one-time";
  sections: ServiceSection[];
  faqs: FaqItem[];
  relatedPost: PostMeta;
  /** Optional proof slot for this page. */
  proof?: { kind: "owner-qa-video" | "profile-before-after"; label: string; path: string };
};

const q = (question: string) => {
  const item = faqs.find((f) => f.question === question);
  if (!item) throw new Error(`FAQ not found: ${question}`);
  return item;
};

export const servicePages: ServicePage[] = [
  {
    slug: "review-replies",
    name: "Review replies",
    icon: "reply",
    keyword: "Google review management for home care",
    serviceType: "Google review management",
    metaTitle: "Google Review Management for Home Care | ReplyLoop",
    metaDescription:
      "We reply to every new Google review in your voice and answer the ones already waiting. Built for Utah home care agencies and local health practices.",
    eyebrow: "Review replies",
    h1: "Google review management for home care agencies",
    intro:
      "We reply to every new Google review in your voice, and during setup we answer the reviews already waiting. A reply to a review of 3 stars or lower stays unpublished until you have seen it.",
    kind: "monthly",
    sections: [
      {
        heading: "What does review management include?",
        bullets: [
          "A reply to every new Google review, in your voice.",
          "Replies to the Google reviews already waiting, done during setup.",
          "One review link and one ask, the same for every customer.",
          "A reply to a review of 3 stars or lower waits until you have seen it.",
        ],
      },
      {
        heading: "How do the replies sound like you?",
        paragraphs: [
          "We start with a voice interview. We learn how you talk about your work and how you say thank you.",
          "Then we do a dry run, a practice round you read first. Nothing goes out in your name before both are done.",
        ],
      },
      {
        heading: "What happens with a hard review?",
        paragraphs: [
          "We do not hide unhappy reviews, and we do not ask only happy customers. A hard review gets a calm, short reply that moves the real conversation off the public page: please call the office.",
          "For a home care agency or clinic, a public reply never confirms the reviewer was a patient or client and never mentions care.",
        ],
      },
      {
        heading: "What we will not do",
        negative: true,
        bullets: [
          "Reward a review in any way. No gift, discount, or favor for a star rating.",
          "Ask some customers and skip others.",
          "Post anything in your name before the voice interview and dry run.",
        ],
      },
    ],
    faqs: [
      q("Will the replies sound like me?"),
      q("What happens with a review of 3 stars or lower?"),
      q("Do you ask only happy customers for reviews?"),
    ],
    relatedPost: postIndex.replies,
  },
  {
    slug: "social-content",
    name: "Social content",
    icon: "social",
    keyword: "social content from Google reviews",
    serviceType: "Social media content",
    metaTitle: "Social Content From Your Google Reviews | ReplyLoop",
    metaDescription:
      "16 new pieces a month for your Google Business Profile, Facebook, and Instagram, in your voice. You approve each batch before anything goes out.",
    eyebrow: "Social content",
    h1: "Social content that starts from your Google reviews and profile",
    intro:
      "Each month we create 16 new pieces, adapted for your Google Business Profile, Facebook, and Instagram. They start from what your profile and your reviews already say about your work, in your voice.",
    kind: "monthly",
    sections: [
      {
        heading: "What do you get each month?",
        bullets: [
          "16 new pieces, adapted for your Google Business Profile, Facebook, and Instagram.",
          "Up to two rounds of changes on each month's batch.",
          "Your choice: we schedule and publish, or we hand you finished files.",
        ],
      },
      {
        heading: "Who approves the posts?",
        paragraphs: [
          "You do. You approve each month's posts before they go out. If you need more time, publishing waits for your approval, and the posts stay ready for later.",
        ],
      },
      {
        heading: "Why start from your reviews?",
        paragraphs: [
          "Your reviews already hold the thank you your customers gave. Your posts can carry the same spirit: the work you do, said plainly, in your own voice. Nothing goes out in your name before the voice interview and dry run.",
        ],
      },
    ],
    faqs: [q("Can I see what you post?"), q("What is in the monthly work?"), q("Will the replies sound like me?")],
    relatedPost: postIndex.profile,
  },
  {
    slug: "local-seo",
    name: "Google Business Profile and local SEO",
    icon: "pin",
    keyword: "Google Business Profile for home care agencies",
    serviceType: "Local SEO and Google Business Profile management",
    metaTitle: "Google Business Profile for Home Care Agencies | ReplyLoop",
    metaDescription:
      "A one-time audit of your online presence, then fresh posts on your Google Business Profile every month. For home care agencies in Salt Lake County.",
    eyebrow: "Google Business Profile",
    h1: "Google Business Profile care for home care agencies",
    intro:
      "Your Google Business Profile is your listing on Google Search and Maps. We start with a one-time audit of your online presence, then keep your profile active with new posts every month.",
    kind: "monthly",
    sections: [
      {
        heading: "What is local SEO for a home care agency?",
        paragraphs: [
          "Local SEO is the plain work of helping nearby people find you on Google Search and Maps. For a home care agency, most of it happens on your Google profile: accurate details, steady activity, and reviews that get an answer.",
        ],
      },
      {
        heading: "What we do",
        bullets: [
          "A one-time audit of your online presence during setup.",
          "New Google Business Profile posts every month, part of your 16 monthly pieces.",
          "A reply to every new Google review, so your profile shows an owner who answers.",
          "A monthly growth workbook with plain next steps you can take yourself.",
        ],
      },
      {
        heading: "Who owns the profile?",
        paragraphs: [
          "You do. Your Google profile stays yours, and you keep the keys. You can see the work and check the results.",
          "Google decides when it approves the connection to your profile. We do not control that timing.",
        ],
      },
    ],
    faqs: [
      q("Who owns my Google profile and accounts?"),
      q("What do you need from me to start?"),
      q("Where do you work?"),
    ],
    relatedPost: postIndex.checklist,
    proof: { kind: "profile-before-after", label: "Before and after profile screenshots", path: "public/proof/" },
  },
  {
    slug: "websites",
    name: "Websites",
    icon: "browser",
    keyword: "website for a home care agency",
    serviceType: "Website design",
    metaTitle: "Website for a Home Care Agency | ReplyLoop",
    metaDescription:
      "A website for a home care agency that tells a family who you are, where you serve, and how to reach you. A one-time project, priced one time.",
    eyebrow: "Websites",
    h1: "A website for a home care agency, with a plain next step",
    intro:
      "After Google, a family may visit your website next. We build a site that tells them who you are, where you serve, and how to reach you, without making them hunt.",
    kind: "one-time",
    sections: [
      {
        heading: "What should a home care agency's website do?",
        bullets: [
          "Say who you serve and where, in plain words.",
          "Make calling you easy on a phone.",
          "Show the same name, phone number, and service area as your Google profile.",
          "Give every page one clear next step.",
        ],
      },
      {
        heading: "How is a website priced?",
        paragraphs: [
          "A website is a one-time project, separate from the monthly work. One-time work is priced one time. We talk about it on the intro call if you need it, and we will not add it if you do not.",
        ],
      },
    ],
    faqs: [q("Do you build websites or videos?"), q("What happens on the intro call?")],
    relatedPost: postIndex.checklist,
  },
  {
    slug: "owner-qa-videos",
    name: "Owner Q&A videos",
    icon: "video",
    keyword: "owner Q&A videos for local health practices",
    serviceType: "Video scripting and filming",
    metaTitle: "Owner Q&A Videos for Local Health Practices | ReplyLoop",
    metaDescription:
      "Short videos of you answering the questions your customers already ask. We script them with you and film them. A one-time project, priced one time.",
    eyebrow: "Owner Q&A videos",
    h1: "Owner Q&A videos for local health practices",
    intro:
      "Short videos of you, the owner, answering the questions your customers already ask. We write the script with you and film it, so the answers sound like you.",
    kind: "one-time",
    sections: [
      {
        heading: "Why owner Q&A videos?",
        paragraphs: [
          "A family choosing a home care agency or a clinic wants to know who they will be trusting. A plain answer from the owner helps them see the person behind the business.",
        ],
      },
      {
        heading: "What we do",
        bullets: [
          "Help you choose the questions your customers ask most.",
          "Write the scripts with you, in your words.",
          "Film the videos.",
        ],
      },
      {
        heading: "What the videos never include",
        paragraphs: [
          "The answers stay general. A video never describes a real person's care or confirms who is a patient or client.",
        ],
      },
      {
        heading: "How are videos priced?",
        paragraphs: [
          "Videos are a one-time project, separate from the monthly work. One-time work is priced one time. We talk about them on the intro call if you want them.",
        ],
      },
    ],
    faqs: [q("Do you build websites or videos?"), q("Do you work with businesses other than home care?")],
    relatedPost: postIndex.profile,
    proof: { kind: "owner-qa-video", label: "Owner Q&A video sample (with written permission)", path: "public/proof/owner-qa/" },
  },
];

export function getServicePage(slug: string) {
  return servicePages.find((p) => p.slug === slug);
}
