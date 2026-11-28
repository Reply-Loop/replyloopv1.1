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

Tints of the locked palette (no new hues), added in the premium redesign:

| Token | Hex | Use |
|---|---|---|
| `ivory-2` | `#F2EDE4` | Alternate light band, blockquote and inset surfaces |
| `paper` | `#FBFAF6` | Raised card surface on ivory |
| `paper-shade` | `#EFE6D6` | Illustration paper shade, tone-on-tone deboss (brass on it: large text and UI only) |
| `ink-3` | `#2F353B` | Hover surface on charcoal (rare) |
| `brass-shadow` | `#5C3E12` | Illustration only: shaded side of brass objects |
| `brass-light` | `#C49A5A` | Illustration only: one highlight on brass objects, never text |
| `hairline-dark` | `rgb(201 196 186 / .12)` | Full-bleed rules on charcoal |

The same `@theme` block holds the rest of the design system (source of truth: `docs/REDESIGN_PROMPT.md` §6–7):

- **Type scale** (fluid, rem intercepts): `text-display`, `text-h1`, `text-h2`, `text-h2-compact`, `text-h3-lg`, `text-h3`, `text-numeral`, `text-lede`, `text-body`, `text-prose`, `text-small`, `text-eyebrow`. No token renders larger than `text-h1` at any width. Fraunces 500 for headings, 400 for statement display from 3.5rem; Inter 400 and 600 only. Nothing visible under 14px.
- **Measures:** `max-w-measure` (65ch), `max-w-lede` (34rem), `max-w-reading` (66ch).
- **Spacing scale** (px): 4, 8, 12, 16, 20, 24, 28, 32, 48, 64, 72, 80, 96, 128, 160 for gaps, margins and padding. `npm run check:tokens` (part of `npm run check`) fails on off-scale spacing and on text under 14px.
- **Section rhythm:** `<Section rhythm="loose | default | tight">`, 96/128/160, 80/96/128 and 64/80/96 px (mobile/sm/lg).
- **Heading variants:** `<SectionHeading variant="statement | split | default | compact">`.
- **Radii:** `rounded-xs` 2, `rounded-sm` 8, `rounded-md` 12, `rounded-card` 20, `rounded-xl` 28, `rounded-pill`.
- **Shadows** (one light at 315°, warm): `shadow-1`, `shadow-2` (resting card), `shadow-3` (hover, film frame), `shadow-object`, `shadow-header`.
- **Easing** (matches the brand film, `video/src/theme.ts`): `ease-out`, `ease-in`, `ease-inout`, `ease-draw`, plus the site-only `ease-soft` (the default transition curve, 240ms) and `ease-standard`. Durations are CSS variables `--dur-*`.
- **Header height:** `--header-h` (4rem, 4.5rem from lg), reused by scroll margins and the journey stage.

Fonts: Fraunces (headlines, `opsz` and `wght` axes) and Inter (body and UI, `wght`), self-hosted with `next/font/local` from `src/app/fonts/`. Only the Latin subsets ship; the site renders no other script, and the other subsets were 249,744 B of files no page requested. The files are the ones `next/font/google` produced before the switch. Licences: `assets/fonts/*-OFL.txt`. Fraunces' `SOFT` axis was measured and not shipped: the Latin file grows from 67,304 B to 120,788 B, against a 20 KB budget.

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

## Deploy to Cloudflare

The site is fully static, so it also ships as plain files (`npm run build:static` writes `out/`). Next 16 cannot export with Cache Components on, so that build turns it off and swaps the one `"use cache"` helper (`src/lib/og-fonts.ts`) for an uncached twin. The normal build is unchanged.

- **Worker (live):** `npm run deploy:worker` bundles `out/` into the `reply-loop-website` Worker (`worker/index.js` serves it like Pages: clean URLs, 404s, `_headers`, byte ranges) and deploys it to https://reply-loop-website.reply-loop-site.workers.dev. This path works from sandboxes whose proxy injects a Cloudflare credential.
- **Pages, automatic:** `.github/workflows/deploy-pages.yml` runs on every push to GitHub. It builds with `npm run build:static` (compliance scan included; a failure stops the deploy) and deploys `out/` with wrangler. A push to `main` goes to production (https://reply-loop-staging.pages.dev); a push to any other branch gets a preview at `https://<branch>.reply-loop-staging.pages.dev`, with slashes turned into dashes. One-time setup, in GitHub under Settings > Secrets and variables > Actions: a `CLOUDFLARE_API_TOKEN` secret (Cloudflare token with Account > Cloudflare Pages > Edit) and `CLOUDFLARE_ACCOUNT_ID` (secret or variable). Without them the build still runs and the deploy is skipped with a warning.
- **Pages, by hand:** `npm run deploy:pages` deploys `out/` to the `reply-loop-staging` Pages project. Run it from a normal machine after `npx wrangler login`; Pages uploads need their own upload token, which an injecting proxy overwrites.
- **Domain:** when `reply-loop.com` points at either one, add the www-to-apex redirect as a Cloudflare Redirect Rule. Canonical and Open Graph URLs already use `https://reply-loop.com` (`NEXT_PUBLIC_SITE_URL`).

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

- Root layout: skip link, a solid ivory sticky header (centred nav; a hairline and soft shadow fade in once the page scrolls, set by an IntersectionObserver on a 1px sentinel) with the booking button (md and up), the small-screen menu, the small-screen bottom bar, the CTA band on every page, and the footer with phone, email, and service area. No street address.
- Small-screen bar (Call and Book): it slides in only after the hero's booking button has scrolled out of view, steps aside while the CTA band or the footer is on screen and while the menu is open, and never shows on `/contact`. Visitors without JavaScript get no bar, on purpose: the hero button and the CTA band remain.
- Small-screen menu: the panel stays in the page, inert while closed. Without JavaScript it cannot open; those visitors use the footer links, which list every page.
- Surfaces: ivory bands carry a faint paper grain (`.paper`), charcoal bands a felt grain (`.felt`); both are AVIF tiles under 4 KB painted beneath the content (`scripts/brand/textures.mjs`). Cards are raised paper on light bands and ink-2 on charcoal (`<Card tone>`). At most two dark bands per page, plus the footer.
- Repeated decorative art (the CTA card's loop drawing, the footer's wordmark sign-off) comes from one cached sprite, `public/brand/sprite.svg`, built by `scripts/brand/build-sprite.py` (needs `pip install fonttools uharfbuzz brotli`).
- Components (`src/components/ui`): Button, BookButton, PhoneLink, EmailLink, TextLink, Card, Section, Container, Eyebrow, Rule, SectionHeading, LoopDivider, FAQ (native `<details>`), PillarCard, StepList, PromiseList, ProofSlot, CTABand, HealthHandling, Logo, Icon.
- Content sources: `src/lib/site.ts` (business facts), `src/content/promises.ts` (seven red lines, customer-facing), `src/content/health.ts` (health review handling).
- Motion: see "Cinematic layer" below. The scroll-driven rise (`.reveal`) is CSS only, moves text by transform only (text never fades), and runs only with motion on: not without JavaScript, not under `prefers-reduced-motion`.
- Logo: option B (chosen 2026-11-26), the flat brass double loop traced from the kit's loop mark, with an ivory crossing on dark and a charcoal crossing on light, plus the Fraunces wordmark.
- SEO: per-page metadata helper (`src/lib/seo.ts`), JSON-LD graph of Organization, WebSite, and ProfessionalService on every page (no street address, no geo, no rating), `sitemap.xml` from `src/lib/routes.ts`, `robots.txt`, `llms.txt`, www-to-apex redirect, trailing-slash redirect, Search Console meta from `NEXT_PUBLIC_GSC_VERIFICATION`.
- Tracking hooks: conversion links carry `data-track` (`cta_click_book_call`, `phone_click`, `email_click`), sent to GA4 only after consent.

## Illustration system

"Paper and Brass, set like letterpress" (brief §9). Tokens live in `src/lib/illustration/tokens.ts` (`STROKE`, `INK`, `RADIUS`, `SHADOW`, `WRITING`; hex values mirror `@theme`).

1. Every loop is the mark's loop: `LOOP_PATH`, or in inline art `LOOP_PATH_COMPACT` (`src/lib/loop/compact.ts`, 16 cubics, 457 chars, max 0.06 units off; regenerate with `node scripts/loop/compact-loop.mjs`). One undistorted, uniformly scaled instance per thread. No freehand curls, ovals or rings.
2. Flat fills only (ivory, paper, paper-shade, rule, slate, charcoal, brass; brass-shadow and brass-light on brass objects only). No gradients in paper.
3. Three strokes in screen px with `vector-effect="non-scaling-stroke"`: hair 1.25, thread 2, rule 1.
4. Two shadows, light from 315°: contact and ambient, pre-baked shapes. No `<filter>` in illustration SVGs.
5. Radii in screen px: cards 16, notecards 8, proof sheets 2.
6. Layers per scene: plate, then one hero object, then the brass thread; reveal in that order.
7. At most 12 shapes per object and one highlight; no dark outlines.
8. No chat bubbles or grey bars: "writing" is 3 slate hairlines (opacity .28, 92/78/54%) plus a brass initial. No glyphs, stars or review text.
9. Every template has a portrait mobile composition. All art is `aria-hidden`; meaning lives in HTML.

`<LoopThread>` (`src/components/scenes/LoopThread.tsx`, server-safe) returns a `<g>` for an existing `<svg>`: a lead-in, the loop and a lead-out, joined tangentially at the crossing. With `drawFrom="crossing"` (default) every path starts at the crossing, so a draw grows outward and a half-drawn state reads as a forming loop; `drawFrom="start"` emits one merged path. `loopThreadParts()` returns the same geometry as strings.

```tsx
<svg viewBox="0 0 400 220" aria-hidden="true" className="text-brass">
  <LoopThread from={[20, 180]} to={[380, 40]} loopAt={[200, 110]} loopScale={0.3}
    rotation={-12} partProps={{ "data-v-draw": "true", pathLength: "1" }} />
</svg>
```

Parts (`src/components/scenes/illustration/parts.tsx`; geometry in viewBox units, `unit` = viewBox units per screen px):
- `<SoftShadow kind="contact" | "ambient">`: 4-5 stacked charcoal rects approximating the blur.
- `<Writing>`: the three hairlines and the brass initial (4 strokes).
- `<Notecard>`: shadows, an 8px paper card with a 1.25px rule edge, optional blind-debossed loop, writing (7 shapes). With several debossed cards in one SVG, put `<LoopDef id>` in `<defs>` and pass `debossHref`.

Byte caps: each inline SVG instance ≤ 6 KB raw (it ships in the HTML and again in the RSC `.txt` files). Measured: `LoopThread` about 1.0 KB, plain `Notecard` 1.4 KB, debossed 2.7 KB inline or 1.6 KB with `debossHref`. No rasters, no filters, no new dependencies.

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
- The head script also sets `html[data-tier]` (`full` or `lite`: Save-Data, under 4 GB memory or under 4 cores give `lite`) and owns a GSAP failure timer: on a page with a scene (`[data-gsap-scene]`), if GSAP has not loaded 3 s after `load`, it adds `html.rl-gsap-failed` and every scene shows its finished state.
- One motion gate (`useGsapScene`): scenes build inside `gsap.matchMedia()`, rebuild when `data-motion` changes, build nothing after `rl-gsap-failed`, and can be limited to the full tier. Easing is the brand film's (`rl.out`, `rl.soft`, `rl.in`, `rl.inOut`, `rl.draw` in GSAP; `--ease-*` in CSS). DrawSVG and MotionPath load lazily, only where a scene asks for them.
- Scroll reveals are CSS scroll-driven animations, per block, never per section: `.reveal` slides text 10px and never fades it; `.reveal-art` may fade and unclip decoration; `.reveal-rule` draws a hairline. Stagger with `--i`. They run only with motion on and where `animation-timeline` and `animation-range` are both supported; nothing is hidden outside that.
- Scroll-drawn strokes (dividers, the problem thread) and the problem scene's reply start hidden in CSS from first paint, scoped to exactly when their timelines run, so nothing draws and then erases.
- Micro-interactions: drawn nav underline, button colour and arrow feedback, smooth FAQ open (Chromium; others open instantly), card lift. Route transitions: each page's content below the hero is one React `<ViewTransition>` (`PageBody`); the header and the mobile bar hold still, the browser's whole-page cross-fade is off, and the home hero never animates. Off under reduced motion and Pause motion.

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

## QA results, premium redesign Phase 3: motion foundation (2026-11-27)

`npm run check`, `npm run build:verify` (compliance: 0 problems) and `npm run qa` (17 pages, axe at 390 and 1280) pass. Lighthouse, median of 3 warm runs on `npm start`: mobile performance 95 on `/` and 99 or 100 on `/services`, `/services/review-replies`, `/home-care-agencies`, `/about` and the blog post; accessibility 100 on all six; LCP 0.90 to 0.91 s; CLS 0; desktop performance and accessibility 100 on `/`, `/services/review-replies` and `/home-care-agencies`. The LCP element on `/` is `h1#hero-title`.

Scripted checks, at 390 and 1440, on the production server and on the static export: strokes are hidden at first paint and drawn after a scroll-through (no draw-then-erase); with the GSAP chunks blocked and the scroll reveals switched off, the page shows its finished state, every heading and paragraph is visible, and the journey falls back to the stacked layout; a no-scroll full-page capture has no faded text; on a client navigation from `/services` to `/` the H1 stays at opacity 1 on every frame, the page transition runs with motion on and does not run under reduced motion or Pause motion; the lite tier shows the finished art; the FAQ opens smoothly and its answer settles at opacity 1.

Static export: Worker bundle 2,722,650 B (gate 2,900,000 B). JS fetched on `/` is 220,670 B gzip, 11.1 KB over the pre-redesign baseline (budget: 15 KB).

## QA results, premium redesign Phase 2: surfaces and chrome (2026-11-27)

`npm run check`, `npm run build:verify` (compliance: 0 problems) and `npm run qa` (17 pages, axe at 390 and 1280) pass. Lighthouse, median of 3 warm runs on `npm start` (`/` mobile: median of 5):

| Page | Mobile perf | A11y | LCP | CLS | Desktop perf / a11y |
|---|---|---|---|---|---|
| `/` | 95 | 100 | 0.90 s | 0 | 100 / 100 |
| `/services` | 99 | 100 | 0.90 s | 0 | |
| `/services/review-replies` | 99 | 100 | 0.90 s | 0 | 100 / 100 |
| `/home-care-agencies` | 99 | 100 | 0.91 s | 0 | 100 / 100 |
| `/about` | 99 | 100 | 0.91 s | 0 | |
| `/blog/respond-to-google-reviews-without-sharing-private-details` | 99 | 100 | 0.90 s | 0 | |

The LCP element on `/` is still `h1#hero-title` (mobile and desktop). Scripted checks: the header pixel over a charcoal band is `#F8F5EF`; the nav is centred within 0.1px at 1280, 1440 and 1920; at 390×844 the first screen shows one booking button, the bar appears only after the hero button scrolls away, hides over the CTA band, the footer and the open menu, and is absent on `/contact`; the menu is inert while closed, takes focus on open, locks scroll, closes on Escape and returns focus. The grain tiles are seamless (rendered edge step equals the interior step).

Static export: Worker bundle 2,675,580 B (gate 2,900,000 B; +85 KB, mostly the chrome markup that ships in every page's HTML and RSC payload). JS fetched on `/` grew 2.9 KB gzip.

Open item: the footer is 816px tall at 390px wide against a 700px target. Its content is locked (ten links, the area sentence, the not-affiliated line, the legal row), and the rows keep at least 24px targets with spacing (WCAG 2.5.8).

## QA results, premium redesign Phase 1: tokens and type (2026-11-27)

`npm run check` (typecheck, lint, contrast, tokens), `npm run build:verify` (compliance: 0 problems) and `npm run qa` (17 pages, axe at 390 and 1280) pass. Lighthouse, median of 3 warm runs on the production server (`npm start`):

| Page | Mobile perf | A11y | LCP | CLS | LCP element (mobile) | Desktop perf / a11y |
|---|---|---|---|---|---|---|
| `/` | 96 | 100 | 0.91 s | 0 | `h1#hero-title` (also on desktop) | 100 / 100 |
| `/services` | 99 | 100 | 0.90 s | 0 | page H1 | |
| `/services/review-replies` | 99 | 100 | 0.91 s | 0 | page H1 | 100 / 100 |
| `/home-care-agencies` | 99 | 100 | 0.91 s | 0 | page H1 | 100 / 100 |
| `/about` | 99 | 100 | 0.76 s | 0 | intro paragraph (as before) | |
| `/blog/respond-to-google-reviews-without-sharing-private-details` | 99 | 100 | 0.90 s | 0 | page H1 | |

Accessibility is now 100 on every page tested (it was 96 on `/services` and `/services/review-replies`): the scroll reveal no longer fades text. Open item, unchanged from before: on `/home-care-agencies` at desktop the ribbon image, not the H1, is the LCP element; the hero rework in Phase 7 fixes it.

Static export (`npm run build:static`): Worker bundle `tar czf - -C out . | wc -c` went from 2,831,842 B to 2,590,136 B (gate: 2,900,000 B). Fonts went from 10 files (365,564 B) to 2 (115,820 B). HTML and RSC payloads grew by under 4 KB gzip in total. JS is unchanged: no new script in this phase. OG images and the film are unchanged. No visible text is under 14px on any page, with or without JavaScript, or under reduced motion.

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

The accessibility 96s were the CSS scroll fade (`.reveal`): a section that straddled the fold on load was partly transparent, and axe measured its text mid-fade. Fixed in the premium redesign, Phase 1: the reveal now slides text without fading it (see the Phase 1 QA table).

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
