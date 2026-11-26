# ReplyLoop marketing site

Main marketing site for ReplyLoop. *Keep the thank you alive.*

Stack: Next.js 16 (App Router, Cache Components), TypeScript, Tailwind CSS 4. Deploy target: Vercel.

> Build status: **all six phases complete.** See QA results below and `PLACEHOLDERS.md` for what still needs real content.

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
npm start &               # serve the production build on :3000
npm run qa                # axe, H1/title/canonical, schema, conversion paths, links
npm run lighthouse        # Lighthouse mobile on QA_BASE (default http://localhost:3000)
npm run perf              # Lighthouse mobile, median of RUNS (default 5) per page: npm run perf -- / /services
```

Asset pipelines (outputs are committed; re-run only after a source changes):

```bash
npm run loop:fit          # kit loop mark -> src/lib/loop/geometry.generated.ts and src/app/icon.svg
npm run brand:derive      # kit backgrounds -> AVIF/WebP in public/brand
cd video && npm install && npm run render   # brand film -> public/media (MP4, WebM, AVIF/WebP poster)
```

`npm run qa` uses the machine's Playwright (it sets `NODE_PATH` to the global modules). On a machine without a global Playwright, install `playwright` first.

`npm run check:compliance` fails on prices, dead offers (free, trial), legal terms (HIPAA, BAA, PHI, compliant), scripture or verse references, plan names, AI mentions, invented percentages or counts, client names, street addresses, speed claims, and exclamation points. Rules and their sources are in `scripts/compliance.mjs`.

In development, `/styleguide` shows every component on ivory and charcoal. It returns 404 in production.

## Environment variables

| Name | Purpose | Default |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, sitemap, OG | `https://reply-loop.com` (confirmed 2026-11-23) |
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

## Deploy to Vercel

1. Import the GitHub repo in Vercel. The framework preset is Next.js; no build settings need to change.
2. In Project Settings, Environment Variables, set `NEXT_PUBLIC_SITE_URL=https://reply-loop.com`, plus `NEXT_PUBLIC_GA_ID` and `NEXT_PUBLIC_GSC_VERIFICATION` when you have them. Leave `NEXT_PUBLIC_SHOW_PROOF_PLACEHOLDERS` unset in Production.
3. In Domains, add `reply-loop.com` and `www.reply-loop.com`, and set www to redirect to the apex. The app also redirects www itself, as a backstop.
4. After the first deploy:
   - verify the site in Google Search Console with the meta tag or a DNS TXT record;
   - submit `https://reply-loop.com/sitemap.xml`;
   - run Google's Rich Results Test on `/`, `/faq`, a service page, and a blog post;
   - run Lighthouse on the live `/` and `/home-care-agencies`.

No secrets live in this repo. `.env*` files are git-ignored except `.env.example`.

## Pages

| Route | Notes |
|---|---|
| `/` | Locked H1, problem, bundle, how it works, seven promises, health handling, proof (placeholder), fit, FAQ teasers |
| `/services` | Bundle, one-time projects, who we serve |
| `/services/review-replies`, `/social-content`, `/local-seo`, `/websites`, `/owner-qa-videos` | One template (`src/components/templates/ServicePageView.tsx`); each links to `/home-care-agencies` and a related post; Service plus BreadcrumbList schema |
| `/home-care-agencies` | Primary SEO landing page for owners and administrators; full health section; Salt Lake County city list |
| `/about` | Mission, founder names and titles, bio and photo slots, how we work |
| `/faq` | Every question, FAQPage schema |
| `/blog`, `/blog/[slug]` | Three starter guides, BlogPosting and BreadcrumbList schema, related posts |
| `/contact` | Booking button, phone, email, service area. No address, no form. |
| `/privacy`, `/terms` | Drafts, `noindex` |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt` | Generated |

Every page ends with the same CTA band. The only conversion paths are the cal.com button (new tab), `tel:+18018897181`, and `mailto:hb@reply-loop.com`; `npm run qa` enforces this.

## Foundations

- Root layout: skip link, sticky header with the booking button (md and up), small-screen menu, sticky bottom bar with Call and Book on small screens, the CTA band on every page, footer with phone, email, and service area. No street address.
- Components (`src/components/ui`): Button, BookButton, PhoneLink, EmailLink, TextLink, Card, Section, Container, Eyebrow, Rule, SectionHeading, LoopDivider, FAQ (native `<details>`), PillarCard, StepList, PromiseList, ProofSlot, CTABand, HealthHandling, Logo, Icon.
- Content sources: `src/lib/site.ts` (business facts), `src/content/promises.ts` (seven red lines, customer-facing), `src/content/health.ts` (health review handling).
- Motion: see "Cinematic layer" below. The scroll-driven fade (`.reveal`) is CSS only and off under `prefers-reduced-motion`.
- Logo: option B (chosen 2026-11-26), the flat brass double loop traced from the kit's loop mark, with an ivory crossing on dark and a charcoal crossing on light, plus the Fraunces wordmark.
- SEO: per-page metadata helper (`src/lib/seo.ts`), JSON-LD graph of Organization, WebSite, and ProfessionalService on every page (no street address, no geo, no rating), `sitemap.xml` from `src/lib/routes.ts`, `robots.txt`, `llms.txt`, www-to-apex redirect, trailing-slash redirect, Search Console meta from `NEXT_PUBLIC_GSC_VERIFICATION`.
- Tracking hooks: conversion links carry `data-track` (`cta_click_book_call`, `phone_click`, `email_click`), sent to GA4 only after consent.

## Analytics and consent

`src/components/analytics/Analytics.tsx`, GA4 with Consent Mode v2:

- With no `NEXT_PUBLIC_GA_ID`, nothing loads and no banner shows.
- With an ID, a small banner asks first. Accept and Decline have equal weight. **gtag.js does not load and no cookie is set until Accept.**
- On Accept: consent defaults are all denied, then only `analytics_storage` is granted. Ad storage, ad user data, and ad personalization stay denied.
- Events: `cta_click_book_call`, `phone_click`, `email_click`, read from `data-track` attributes on the booking button, phone links, and email links. Sent only after consent.
- The choice is stored in `localStorage` (`rl-consent-v1`); the footer's "Cookie settings" reopens the banner.
- Tested with Playwright: Accept loads GA and sends both events; Decline loads nothing; the choice holds across reloads.

## Legal drafts

`/privacy` and `/terms` are labeled "Draft. Needs attorney review." and set to `noindex`, and they are left out of the sitemap until reviewed. Bracketed placeholders mark facts an attorney or Hunter must supply: legal entity, hosting provider, sharing, liability, governing law. Neither makes any health-privacy representation.

## Blog

Posts are MDX files in `src/content/blog/<slug>.mdx` with YAML frontmatter:

```yaml
title: "Full headline (the H1)"
seoTitle: "Under about 60 characters | ReplyLoop"
description: "Under about 155 characters"
date: "YYYY-MM-DD"
keyword: "primary keyword"
```

To add a post: create the file, then add it to the list in `src/content/posts.ts`. Each post must end with the plain line "This is general information, not legal advice." The compliance scan reads every post.

## Open Graph images

Generated at build with `next/og` (`src/lib/og.tsx`): charcoal card, ivory Fraunces headline, brass hairline and loop, no photos. Per-route images for `/`, `/home-care-agencies`, `/services` (inherited by service pages), `/blog`, and each post. Fonts are bundled in `assets/fonts` under the SIL Open Font License (license files alongside).

## Keyword map

| Page | Primary keyword | H1 |
|---|---|---|
| `/` | Google review replies for local health businesses | Your next customer is reading your unanswered Google reviews. (locked) |
| `/home-care-agencies` | home care agency SEO Utah | Home care agency SEO and review replies in Utah |
| `/services` | local SEO and review replies for health practices | Local SEO and review replies for health practices |
| `/services/review-replies` | Google review management for home care | Google review management for home care agencies |
| `/services/local-seo` | Google Business Profile for home care agencies | Google Business Profile care for home care agencies |
| `/services/social-content` | social content from Google reviews | Social content that starts from your Google reviews and profile |
| `/services/websites` | website for a home care agency | A website for a home care agency, with a plain next step |
| `/services/owner-qa-videos` | owner Q&A videos for local health practices | Owner Q&A videos for local health practices |

Service page copy lives in `src/content/servicePages.ts`; FAQ answers in `src/content/faq.ts` (FAQPage schema on `/faq` only).

## Decisions applied from the brain (2026-11-23)

Read from the ReplyLoop Brain in Drive on 2026-11-23 and confirmed by Hunter the same day.

- **Bundle** follows "ReplyLoop Pricing and Service Rules" (2026-11-23): review replies, 16 new pieces a month for Google Business Profile, Facebook, and Instagram, and a monthly growth workbook. Setup: voice interview, a one-time online presence audit, replies to the reviews already waiting. Websites and owner Q&A videos are "also available as one-time projects". No prices anywhere.
- **Area served** adds Salt Lake County (text and `areaServed` schema).
- **Approved extra lines:** "You approve each month's posts before they go out." and the not-affiliated line in the footer.
- **About:** names and "Cofounder" titles for Hunter K. Newbold and Brigham Tiffany; bios and photos stay placeholders.
- **No AI mention** on public pages (D-031). Enforced by the compliance scan.
- **Approval wording:** never "the owner approves every reply". Only: a reply to a review of 3 stars or lower stays unpublished until the owner has seen it.
- **Where the brief overrides older brain docs:** no $499 setup price (D-028 allowed it); no client name (D-030 allowed one pending written consent); Vercel, GA4 with consent, and a cookie banner (D-032 said Cloudflare Pages and Search Console only); FAQPage schema kept although design system v1 says not to use it; Next.js replaces the Astro staging site.

## Cinematic layer

Calm, warm motion built in code from the brand kit (`assets/social-kit`, provenance in `SOURCES.md`). Every scene is decorative and `aria-hidden`; the words are always HTML.

**Motion system** (`src/lib/motion`, `src/components/motion`)

- `html[data-motion]` is `static` (server default and no JS), `full`, `paused` or `reduce`. A head script sets it before first paint from `prefers-reduced-motion` and the visitor's saved choice.
- The header "Pause motion" toggle (`aria-pressed`) stops all ambient motion and is remembered. Scroll-linked scenes still follow the visitor's scroll while paused.
- Device tier: phones, Save-Data, low memory or few cores, and no WebGL get the light version (SVG stills, no 3D).
- Everything pauses off screen and when a route is hidden by `<Activity>`.

**Scenes**

| Scene | Where | Built with |
|---|---|---|
| Brass loop (3D) | `/` hero | three.js + R3F `createRoot` (`src/components/hero`). The SVG still paints first; the 3D loads after the first interaction (or 7 s) on capable desktops and falls back to the still on a low frame rate. The H1 stays the LCP element. |
| Waiting review, arriving reply | `/` problem section | Layered SVG, scrubbed by GSAP ScrollTrigger (`ProblemScene`) |
| Journey along the loop | `/` how it works | CSS sticky stage (no JS pin, CLS 0) with scrubbed chapter fades and a camera along the loop (`HowItWorksJourney`); stacked on phones, short screens, large text and reduced motion |
| Brass thread | Loop dividers | SVG stroke drawn with scroll (`Thread`) |
| Brand film | `/` and `/services` | Remotion (`/video`), 16 s seamless loop, 1280×720. MP4 and WebM about 400 KB each, AVIF/WebP poster. Starts on screen with motion on; "Pause film" control; reduced motion and no JS get the poster only. Save-Data starts paused. |
| Ribbon backdrop | `/home-care-agencies` hero | Kit `06-og-link-preview`, cropped and colour-matched; desktop only, phones never download it |
| Service emblems | `/services/*`, `/about` heroes | SVG loop with a travelling brass stroke (CSS) |
| Trust loop | `/services/review-replies` | SVG loop with a bead that lights each HTML step (Ask, Review, Reply, Learn) |

**Remotion licence.** Remotion is free for individuals and companies of up to 3 people; companies of 4 or more need a Company License (see remotion.dev/license). ReplyLoop has 2 people, so the free licence applies today. Only pre-rendered video ships, so the site carries no Remotion runtime. Re-check when the team grows.

**Photoreal assets.** `ASSET_BRIEF.md` has prompts for four stills the code cannot make (paper, window light, felt, brushed brass). Stand-ins are listed in `PLACEHOLDERS.md`.

## QA results, cinematic overhaul (2026-11-26, local production build)

QA (`npm run qa`, 17 pages) and the compliance scan pass. Lighthouse mobile, median of 3 warm runs:

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| `/` | 95 | 100 | 100 | 100 | 0.91 s | 0 |
| `/services` | 99 | 96 | 100 | 100 | 0.91 s | 0 |
| `/home-care-agencies` | 95 | 100 | 100 | 100 | 0.91 s | 0 |
| `/services/review-replies` | 99 | 96 | 100 | 100 | 0.91 s | 0 |
| `/about` | 100 | 100 | 100 | 100 | 0.75 s | 0 |

Desktop Lighthouse scores 100 for performance on `/`, `/services/review-replies` and `/home-care-agencies`.

The accessibility 96s are the CSS scroll fade (`.reveal`): a section that straddles the fold on load is partly transparent, and axe measures its text mid-fade. Visitors see the text fully opaque once it is in view.

## QA results (2026-11-23, local production build)

| Check | Result |
|---|---|
| Typecheck, lint, build | Pass |
| Compliance scan (30 rendered pages and content files) | 0 problems |
| Contrast check | Pass (see above) |
| axe-core, WCAG 2.2 A/AA, 17 pages at 390px and 1280px | 0 violations |
| One H1, unique title and description, canonical, on every page | Pass |
| Locked homepage H1, word for word | Pass |
| JSON-LD parses; no address, geo, rating, or price | Pass |
| Conversion paths (no forms; new tabs only to cal.com; exact button label) | Pass |
| Internal links | All 200 |
| Keyboard: skip link, menu with Escape, FAQ, visible focus | Pass |
| Redirects: www to apex, trailing slash | 308, both |
| Consent: GA loads only after Accept; events fire; Decline sends nothing | Pass |

Lighthouse mobile (median of 3 runs, localhost):

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| `/` | 97 | 100 | 100 | 100 | 1.0 s | 0 |
| `/home-care-agencies` | 98 | 100 | 100 | 100 | 0.9 s | 0 |

The first cold run of `/` scored 91 (total blocking time 370 ms). The two warm runs scored 97 and 99. Localhost has no network latency, so re-run Lighthouse on the live Vercel URL. INP needs real-user data; the Search Console Core Web Vitals report will show it after launch.

Not checked here: Google's Rich Results Test and the schema.org validator need a public URL. Run them after the first deploy.

## Placeholders

See `PLACEHOLDERS.md` for every proof slot (testimonials, client logos, founder photos and bios, owner Q&A video, before and after screenshots), the placeholder logo, and the bracketed legal-draft fields.

## Build phases

1. Scaffold, tokens, fonts, layout, components
2. Home page and global SEO
3. Service pages, home care page, about, FAQ, contact
4. MDX blog, three posts, OG images, breadcrumbs
5. Analytics with Consent Mode v2, cookie banner, booking events, legal drafts
6. QA: Lighthouse mobile, axe, link check, schema checks, compliance scan, `PLACEHOLDERS.md`

Cinematic overhaul (2026-11-26):

a. Motion foundation: motion modes, pause toggle, GSAP loader, kit loop geometry, logo B
b. Hero 3D brass loop
c. Scroll storytelling: problem scene, how-it-works journey, brass thread dividers
d. Remotion brand film and its embed
e. Inner pages: ribbon backdrop, service emblems, trust loop
f. Polish, docs, final gates
