# ReplyLoop marketing site

Main marketing site for ReplyLoop. *Keep the thank you alive.*

Stack: Next.js 16 (App Router, Cache Components), TypeScript, Tailwind CSS 4. Deploy target: Vercel.

> Build status: **Phase 2 of 6 complete** (home page, global SEO). Inner pages arrive in Phase 3; header links to them 404 until then.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in values as needed
npm run dev                  # http://localhost:3000
```

Checks:

```bash
npm run check             # typecheck + lint + contrast
npm run build:verify      # build, then the compliance scan on every rendered page
```

`npm run check:compliance` fails on prices, dead offers (free, trial), legal terms (HIPAA, BAA, PHI, compliant), scripture or verse references, plan names, AI mentions, invented percentages or counts, client names, street addresses, speed claims, and exclamation points. Rules and their sources are in `scripts/compliance.mjs`.

In development, `/styleguide` shows every component on ivory and charcoal. It returns 404 in production.

## Environment variables

| Name | Purpose | Default |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, sitemap, OG | `https://reply-loop.com` (inferred from the email domain; confirm) |
| `NEXT_PUBLIC_GA_ID` | GA4 measurement ID, loaded only after consent | empty |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Search Console verification meta | empty |
| `NEXT_PUBLIC_SHOW_PROOF_PLACEHOLDERS` | Show dashed proof placeholders in production | `false` (hidden) |

## Brand tokens

Locked values live in `src/app/globals.css` under `@theme`:

| Token | Hex | Use |
|---|---|---|
| `charcoal` | `#1B1F23` | Dark sections, primary text on ivory (locked) |
| `ivory` | `#F8F5EF` | Light sections and cards (locked) |
| `brass` | `#8A5F1C` | Text and buttons on ivory (locked) |
| `brass-press` | `#74501A` | Button hover only (derived, darker) |
| `brass-line` | `#B8894A` | Decorative hairlines and loop on charcoal only, never text (derived) |
| `slate` | `#4A4F55` | Secondary text on ivory (derived) |
| `mist` | `#C9C4BA` | Secondary text on charcoal (derived) |
| `rule` | `#E2DBCF` | Decorative borders on ivory (derived) |

Fonts: Fraunces (headlines, `opsz` axis) and Inter (body/UI), both via `next/font/google`, self-hosted at build time.

## Contrast decision

Measured with `npm run check:contrast` (WCAG 2.2):

| Pairing | Ratio | Result |
|---|---|---|
| Brass `#8A5F1C` on ivory | 5.17:1 | Pass AA. No darkening needed. |
| Ivory on brass (button label) | 5.17:1 | Pass AA. Button kept at locked brass. |
| Ivory on charcoal | 15.23:1 | Pass |
| Charcoal on ivory | 15.23:1 | Pass |
| Brass `#8A5F1C` on charcoal | 2.95:1 | **Fails for text.** |

Brass on charcoal fails as text, and darkening brass would only lower that ratio. Lightening text is not allowed. So the rule is: **brass is never used as text on charcoal.** On charcoal, text is ivory or mist, and brass shows up only as the button surface (its label is ivory on brass, 5.17:1) and as decorative hairlines in `brass-line` (5.30:1 against charcoal). The `on-dark:` variant in components applies this automatically. On charcoal the button also gets a 1px `brass-line` ring, so its edge clears 3:1 against the background.

## What is built so far

- Root layout: skip link, sticky header with the booking button (md and up), small-screen menu, sticky bottom bar with Call and Book on small screens, the CTA band on every page, footer with phone, email, and service area. No street address.
- Components (`src/components/ui`): Button, BookButton, PhoneLink, EmailLink, TextLink, Card, Section, Container, Eyebrow, Rule, SectionHeading, LoopDivider, FAQ (native `<details>`), PillarCard, StepList, PromiseList, ProofSlot, CTABand, HealthHandling, Logo, Icon.
- Content sources: `src/lib/site.ts` (business facts), `src/content/promises.ts` (seven red lines, customer-facing), `src/content/health.ts` (health review handling).
- Motion: scroll-driven fade via CSS only (`.reveal`), and an optional slow trace on the loop divider. Both are off under `prefers-reduced-motion`.
- Logo: no files were supplied in `/public/brand`, so the header uses an inline SVG loop mark with a speech tail, plus the wordmark set in Fraunces. Replace it when a vector logo arrives.
- SEO: per-page metadata helper (`src/lib/seo.ts`), JSON-LD graph of Organization, WebSite, and ProfessionalService on every page (no street address, no geo, no rating), `sitemap.xml` from `src/lib/routes.ts`, `robots.txt`, `llms.txt`, www-to-apex redirect, trailing-slash redirect, Search Console meta from `NEXT_PUBLIC_GSC_VERIFICATION`.
- Tracking hooks: conversion links carry `data-track` (`cta_click_book_call`, `phone_click`, `email_click`). Phase 5 wires them to GA4 after consent.

## Decisions applied from the brain (2026-11-23)

Read from the ReplyLoop Brain in Drive on 2026-11-23 and confirmed by Hunter the same day.

- **Bundle** follows "ReplyLoop Pricing and Service Rules" (2026-11-23): review replies, 16 new pieces a month for Google Business Profile, Facebook, and Instagram, and a monthly growth workbook. Setup: voice interview, a one-time online presence audit, replies to the reviews already waiting. Websites and owner Q&A videos are "also available as one-time projects". No prices anywhere.
- **Area served** adds Salt Lake County (text and `areaServed` schema).
- **Approved extra lines:** "You approve each month's posts before they go out." and the not-affiliated line in the footer.
- **About:** names and "Cofounder" titles for Hunter K. Newbold and Brigham Tiffany; bios and photos stay placeholders.
- **No AI mention** on public pages (D-031). Enforced by the compliance scan.
- **Approval wording:** never "the owner approves every reply". Only: a reply to a review of 3 stars or lower stays unpublished until the owner has seen it.
- **Where the brief overrides older brain docs:** no $499 setup price (D-028 allowed it); no client name (D-030 allowed one pending written consent); Vercel, GA4 with consent, and a cookie banner (D-032 said Cloudflare Pages and Search Console only); FAQPage schema kept although design system v1 says not to use it; Next.js replaces the Astro staging site.

## Roadmap

1. ~~Scaffold, tokens, fonts, layout, components~~
2. ~~Home page, global SEO (metadata, schema, sitemap, robots, llms.txt), redirects~~
3. Service pages, home care page, about, FAQ, contact
4. MDX blog, three posts, OG images, breadcrumbs
5. Analytics with Consent Mode v2, cookie banner, booking events, legal drafts
6. QA: Lighthouse mobile, axe, link check, schema validation, compliance scan, `PLACEHOLDERS.md`
