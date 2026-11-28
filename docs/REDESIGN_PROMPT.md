# ReplyLoop premium pass: implementation prompt

> **For the owner.** Paste everything below the line into Claude Code, opened in `/home/user/replyloopv1.1` (or your clone of it). It tells the agent to send you a plan first and wait for your OK, then to build in phases with one commit per phase, and never to deploy without your approval. Section 13 lists the decisions only you can make. Answer them when you approve the plan.

---

## 0. Role, goal, north star

**Role.** You are a senior design engineer. You work at the level of a studio that builds editorial brand sites, comparable to Stripe, Linear and Aesop. You are working in the ReplyLoop marketing site repo. You care as much about type, spacing and easing curves as about correctness. You do not add anything you cannot justify.

**Goal.** The site should look and feel like a million-dollar business: calm, warm, editorial and high-craft. The biggest upgrades are in motion and illustration. Keep the positioning, the copy, the palette, the logo and the performance record. Three audits of the production build and a research pass produced this plan. Execute it, and verify every phase.

**Creative north star.** *Paper and brass, set like letterpress.*
- Every page should feel like a well-made printed piece that has started to move: ivory paper, charcoal depth, one warm brushed-brass loop, and golden-hour light.
- Motion is a premium brand film you scroll through, not a template with fade-ins. It is slow, deliberate, choreographed per scene, and always secondary to the words.
- Each composition carries one idea with generous space.
- Nothing shouts, sparkles, bounces or pretends. Nothing should look automated, technical or like a SaaS dashboard. This is a human service for home care agency owners and local health practices in Utah.
- The emotional register is attentive and reassuring. The readers are an owner who is short on time and a worried son or daughter reading replies "to see who is paying attention".

---

## 1. Non-negotiable rules

Any change that breaks one of these rules is invalid. When a recommendation below conflicts with a rule, the rule wins. Flag the conflict to the owner.

### 1.1 Brand and copy

1. **Home H1 is locked word for word:** `Your next customer is reading your unanswered Google reviews.` It stays real server-rendered text and remains the LCP element.
   - No entrance animation, split, clip, blur or opacity on the H1 or any ancestor at load.
   - The H1 is never wrapped in `.reveal`, SplitText or a `<ViewTransition>` that animates it.
   - Only its size utility may change, never its words.
2. **Banned content:**
   - Prices, and free or trial offers.
   - The terms HIPAA, BAA, PHI and "compliant".
   - Scripture, verses, or religious symbols.
   - Invented numbers, ratings, testimonials, client names or logos.
   - The word "AI", and AI-adjacent words such as chatbot, GPT and "artificial intelligence".
   - Exclamation points.
   - Five-star or rating imagery anywhere: SVG, raster, film, OG or icon.
3. **Never use these kit assets:** `06-trust-loop-infographic` (and its 4x5 duplicate), `01-blank-education` (and its 4x5), `05-human-line`, the "Reviews" sparkle icon, or the "Analytics" growth icon. Do not use their copy either.
4. **Palette (exact):**

   | Token | Hex | Use |
   |---|---|---|
   | charcoal | `#1B1F23` | Dark bands; primary text on ivory |
   | ivory | `#F8F5EF` | Light bands, surfaces |
   | brass | `#8A5F1C` | Text, buttons and focus on **ivory only** |
   | brass-press | `#74501A` | Button hover |
   | brass-line | `#B8894A` | Decorative hairlines and loop strokes **on charcoal only**, never text |
   | slate | `#4A4F55` | Secondary text on ivory |
   | mist | `#C9C4BA` | Secondary text on charcoal |
   | rule | `#E2DBCF` | Decorative borders on ivory |
   | ink-2 | `#262B30` | Raised surface on charcoal |

   **Brass is never text on charcoal** (2.95:1, fails). It is also never text on ink-2 (2.54:1).
5. **Fonts:** Fraunces (serif display) and Inter (body and UI) only, self-hosted through `next/font`. No third typeface.
6. **The only conversions:**
   - The button label "Book an intro call" (cal.com, new tab).
   - `tel:+18018897181`.
   - `mailto:hb@reply-loop.com`.

   No forms, modals, pop-ups or secondary CTA buttons, and no street address. "Book an intro call" is the only solid button on any screen. Phone and email are quiet text links.
7. **Copy:**
   - The tagline is `Keep the thank you alive.` with no hyphen.
   - Do not change positioning.
   - Do not paraphrase locked lines. These include the H1; the repo's low-star sentences exactly as written, "A reply to a review of 3 stars or lower stays unpublished until you have seen it." (`health.ts`, `faq.ts`) and "A reply to a review of 3 stars or lower waits until you have seen it." (`servicePages.ts`); "You keep the keys."; the health protocol sentence; and the not-affiliated line.
   - Do not import the Drive brain's variants ("…a review rated 3 stars or lower…", "You hold the keys."). They are not in the repo, and "rated 3" matches the `star rating claim` pattern in `scripts/compliance.mjs` l.71. Changing any of them needs the owner, plus an allowlist entry the owner approves.
   - Reuse existing sentences from `src/content/*` verbatim where this plan needs words.
   - Every new string (including aria-labels, captions, alt text and UI labels) must pass `npm run check:compliance` and the ban list in §1.4. Each new string must also be listed for the owner in the phase report.
8. **Logo** is option B, the flat brass double loop. Do not change its geometry or replace it without the owner. The tone change in §9.6 also needs the owner's OK.
9. **Real text in HTML**, never only in rasters or canvas. Every scene is `aria-hidden` and carries its meaning in nearby HTML. No text is baked into generated images or OG rasters. OG text stays live text in `ImageResponse`.
10. **Health privacy in visuals:**
    - No imagery may imply that a reviewer is a patient.
    - Do not show care, clinics, visits, billing, medical props, people, faces, hands, devices, screens or dashboards.
    - Do not show robots, chips, circuit lines or glowing orbs.

### 1.2 Motion and performance budgets (gates, not goals)

| Budget | Gate | Current (README, or measured in `out/` and `public/`, 2026-11-26) |
|---|---|---|
| Lighthouse mobile Performance | ≥ 90 on every page tested; target ≥ 95 on `/` and `/home-care-agencies` | 95–100 |
| Lighthouse mobile Accessibility | 100 on every page tested | 96 on `/services` and `/services/review-replies` (the audit attributes this to `.reveal`; not verifiable from repo files, so reproduce the cause before fixing) |
| LCP (mobile, lab) | < 2.5 s; aim ≤ 1.2 s | 0.91 s |
| CLS | < 0.1; target 0 | 0 |
| TBT (mobile, lab) | ≤ 150 ms | — |
| Long tasks during hero 3D init | none > 50 ms on a real GPU | The audit observed one 1.5–1.6 s task on SwiftShader. Not verifiable from repo files; measure it |
| New first-party JS on `/` (gzip) | ≤ +15 KB over today, measured. This counts every JS byte fetched on `/` during load plus a full scroll to the footer, lazy post-hydration chunks included | — |
| Desktop Lighthouse Performance | 100 on `/`, `/services/review-replies`, `/home-care-agencies` | 100 |
| Worker bundle: `tar czf - -C out . \| wc -c` after `npm run build:static` | ≤ 2,900,000 B. Cloudflare's Worker limit is about 3 MB gzip, and `scripts/build-worker.mjs` bundles every file in `out/` | 2,830,193 B |
| OG images in `out/` | each PNG ≤ 70 KB; all OG images ≤ 450 KB in total | 7 files, 418,698 B |
| Film and posters (`public/media/brand-film*`) | each video file ≤ 450,000 B; film plus posters ≤ 859,457 B in total (no growth) | MP4 444,502 B, WebM 395,931 B, posters 8,366 B (AVIF) + 10,658 B (WebP) |
| LCP element (Lighthouse `largest-contentful-paint-element`) | `h1#hero-title` on `/`. The page H1 on `/home-care-agencies` and on every page that gains a raster. Checked at mobile 390×844 and desktop 1440×900 | — |

Motion rules:
- Decorative motion layers are `aria-hidden`.
- Motion honours `prefers-reduced-motion` **and** the site's "Pause motion" toggle (`html[data-motion]` = `static` | `full` | `paused` | `reduce`).
- Any ambient motion longer than 5 s has a pause control and stops when paused.
- Everything pauses off screen and on hidden `<Activity>` routes.
- Low-power devices fall back to stills: phones, Save-Data, low memory, few cores, no WebGL, and (new in this plan) software WebGL.
- Scroll-linked scenes may keep following the visitor's scroll while paused, as today.
- Reduced motion means a still, finished state, not a shorter animation.

**Worker byte budget (hard gate).** The static export is already 2,830,193 B gzip against a limit of about 3 MB, so the 2.9 MB gate leaves about 70 KB. Every byte this plan adds must be offset, or approved by the owner.
- After every phase, run `npm run build:static`, then `tar czf - -C out . | wc -c`. Require ≤ 2,900,000 B. Report the number before and after each phase.
- Report the per-phase byte delta for HTML (`out/**/*.html`) and for RSC flight payloads (`out/**/*.txt`) separately. Inline SVG ships once in each page's HTML and again in its `.txt` files (today the 93 `.txt` files are 2.77 MB raw and repeat each inline SVG 3 to 5 times per page). The portrait problem SVG, HeroPlates, blog header strips, emblem objects and shadow sprites all land there.
- Per-asset caps (gzip, measured in `out/`): decorative still ≤ 40 KB; texture tile ≤ 6 KB; each new inline SVG ≤ 6 KB raw per instance (reuse one `<symbol>` per page where the same art repeats); each OG PNG ≤ 70 KB; each film file ≤ 450,000 B.
- Ship decorative stills as **AVIF only**, with no WebP twin. A browser without AVIF shows the flat surface colour, which is acceptable for decoration.
- Bank offsets first: drop `/hdri/studio-512.exr` (110,735 B raw) when the light map lands (§8.2), and remove the ProblemArt `feTurbulence` markup (§6.7).
- If a phase cannot fit, stop and ask. Moving large media (film, stills) off the Worker to R2 or Pages is an **owner decision** (§13). Do not do it on your own.
- Phase 0 includes a byte budget table: each planned asset or inline SVG, its estimated gzip bytes, the offset that pays for it, and the running total against 2,900,000 B.

### 1.3 Process rules

- Read `AGENTS.md` first. This is Next.js 16.4.6 with breaking changes, so read the relevant guide in `node_modules/next/dist/docs/` before writing code. That includes `01-app/02-guides/view-transitions.md` before §7.8. Heed deprecation notices.
- **Phase 0 is a plan, not code.** Send the owner a short plan:
  - the scene list with ASCII storyboards
  - which kit files are embedded and which are reference only
  - the libraries used and a per-page bundle estimate
  - the Worker byte budget table (§1.2)
  - every new `dependency` or `devDependency` and its purpose. This plan expects none (drei is not needed, §7.11). Confirm that nothing new lands in `dependencies`
  - your answers or questions on §13

  Then **wait for an explicit OK.** Ask rather than assume. Flag conflicts plainly.
- Work on a branch, `redesign/premium`. Make **one commit per phase.** After each phase, report the gate results, screenshots and any new strings.
- Do not run `npm run deploy:worker` (or `deploy:pages`) until the owner has approved the final screenshots and numbers.
- Do not commit secrets or `.env*` files. Do not remove the `AGENTS.md` block written by `next dev`.

### 1.4 Ban list for every new string

The list below covers copy, captions, alt text, aria-labels and video text. **Never write:**
- Money and plans: any dollar amount, "setup fee", "per month", "free", "trial", "Essential", "Pro".
- AI terms: "AI", "chatbot", "GPT", "ChatGPT", "Gemini", "artificial intelligence".
- Health and legal terms: "HIPAA", "BAA", "PHI", "compliant", "patients".
- Claims and hype: "guarantee", "hack", "crush", "dominate", "rank number one", "same-day", "24/7", "within minutes".
- Faith terms: "scripture", "verse".
- Call names: "discovery call", "consultation", "demo", "setup call".
- Approval wording: "approve(s) every reply", "you approve what we write", "with you in control", "check with you before".
- Other: "our first client", "tracking cookies", "10 reviews".

Also: name no competitors, use no exclamation points, and put no hyphen in "thank you". Write in sentence case, and end H1s with a period. Use the plain, earnest, calm voice, with no urgency or fear framing.

---

## 2. Read first

1. `AGENTS.md`, `README.md` (sections "Cinematic layer", "Brand tokens", "Contrast decision", "QA results"), `ASSET_BRIEF.md`, `PLACEHOLDERS.md`, `assets/social-kit/SOURCES.md`.
2. `src/app/globals.css` (tokens, motion gates, `.reveal`, journey CSS), `src/app/layout.tsx` (fonts, head motion script), `src/app/page.tsx`.
3. `src/lib/motion/gsap.ts`, `src/lib/motion/state.ts`, `src/components/motion/*`.
4. `node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`.
5. The audit evidence, if it is still on disk: `/tmp/claude-0/-home-user-replyloopv1-1/fa33f18b-a86b-5484-86de-1a90569414a8/scratchpad/premium/` (`visual-audit/sheets`, `anim/`, `illustration/`). If it is gone, reproduce each issue yourself before you fix it.

---

## 3. What exists today

Do not rebuild what works. Upgrade it in place.

| Area | Files | Status |
|---|---|---|
| Tokens | `src/app/globals.css` `@theme` | Palette correct. No type, spacing, shadow, radius or easing tokens. **Extend.** |
| Fonts | `src/app/layout.tsx` (`Fraunces` axes `['opsz']`, `Inter`) | Good. Add the `SOFT` axis only if it measures OK (§6.2). |
| Motion state | `src/lib/motion/state.ts` (head script, `hasWebGL()`, tiers), `MotionToggle.tsx`, `useMotion.ts`, `useInViewport.ts`, `InView.tsx` | Careful and correct gating. **Keep.** Tighten `hasWebGL()` (§8.2). |
| GSAP loader | `src/lib/motion/gsap.ts` (core + ScrollTrigger, `power2.out`), `useGsapScene.ts` (context per scene, batched refresh, `<Activity>`-safe) | **Keep the structure.** Add CustomEase tokens and lazy plugins (§7.6). |
| Layout chrome | `Header.tsx` (sticky, `bg-ivory/85` + blur, `justify-between`), `MobileNav.tsx` (instant `hidden`), `MobileBar.tsx` (fixed from first paint), `Footer.tsx` | **Rework** (§8.1). |
| UI kit | `Section.tsx` (`.reveal` on the Container), `SectionHeading.tsx` (already switches size by `as`: h1 2.5→3.75rem, h2 2→2.875rem, h3; it also renders subpage H1s), `Card.tsx` (ivory/1px rule/no shadow), `PillarCard.tsx`, `PromiseList.tsx`, `StepList.tsx`, `FAQ.tsx` (native `<details>`), `CTABand.tsx`, `LoopDivider.tsx`, `Eyebrow.tsx` (0.8rem), `Button.tsx`, `PageHero.tsx`, `Prose.tsx`, `Breadcrumbs.tsx`, `ProofSlot.tsx`, `HealthHandling.tsx`, `Icon.tsx` | Solid base. **Add variants** rather than forking. |
| Hero | `src/components/hero/HeroVisual.tsx`, `LoopStill.tsx`, `LoopCanvas.tsx`, `LoopScene.tsx` (TubeGeometry 480×28, EXR + PMREM, MeshPhysicalMaterial), `loopCurve.ts` | The still paints first, 3D comes after interaction or 7 s, and the H1 is LCP (README: mobile lab LCP 0.91 s). **Fix the swap, cost and material** (§8.2). |
| Scenes | `ProblemScene.tsx` + `ProblemArt.tsx` (960×420), `HowItWorksJourney.tsx` (CSS sticky stage, GSAP scrub), `vignettes/*` (4), `Thread.tsx`, `TrustLoop.tsx`, `ServiceEmblem.tsx`, `RibbonBackdrop.tsx` | Best moments on the site (journey, 3D loop). **Retime and redraw**, do not replace the architecture. |
| Loop geometry | `src/lib/loop/geometry.generated.ts` (`LOOP_PATH`, `LOOP_STROKE`), `assets/loop/loop-fit.json`, `npm run loop:fit` | Canonical mark geometry. **Every loop must use it.** |
| Film | `video/src/Film.tsx`, `theme.ts` (better easing than the site), `public/media/brand-film.*`, `BrandFilm.tsx` | Pre-rendered, 16 s loop, has a pause control, poster for reduced motion. **Re-cut** (§8.3, Phase 8). |
| Brand pipeline | `scripts/brand/derive.mjs` (crop, colour-match, AVIF/WebP) | **Use it** for every new still, shipping AVIF only (§1.2). |
| QA | `npm run check`, `check:compliance`, `build:verify`, `qa`, `perf`, `lighthouse`, `build:static`, `build:worker` | **Use all of them** at every gate. |
| OG | `src/lib/og.tsx`, `src/lib/og-fonts*.ts`, route `opengraph-image.tsx` files | Text-only on flat charcoal. **Add art** (§8.12). |

---

## 4. Decisions on conflicting advice (already resolved; follow these)

| Topic | Conflict | Decision |
|---|---|---|
| Text reveal | Motion audit proposes opacity fades per block. The brain design system records that a text fade once dropped contrast below AA ("slide only"), and the audit attributes the current axe 96 to the fade (reproduce it). | **Text slides; it does not fade.** Text blocks get `transform` only (translateY ≤ 10px), with opacity fixed at 1. Opacity reveals are allowed on `aria-hidden` decoration (art, hairlines, emblems). **Named exceptions (the only text-opacity changes on the site):** (1) the FAQ answer fade (§7.7); (2) the sticky journey chapter crossfade (§8.3.5), scroll-driven because the chapters stack in one stage, `opacity` only (never `autoAlpha` or `visibility`), settling at 1 in every stillness window; (3) the route-transition page fade (§7.8); (4) the mobile menu open and close (§7.7). Exceptions 1, 3 and 4 are user-initiated and settle at 1 before reading. |
| Easing family | Material 3 tokens vs the film's curves | **Use the film's curves** (`video/src/theme.ts`: `out`, `in`, `inOut`, `draw`) as the brand set (§7.2), so the site and the film move alike. `--ease-soft` and `--ease-standard` are site-only UI tokens and do not come from the film. Material 3 informs the duration and asymmetry rules. |
| Heading weight | Old Astro system said Fraunces 600. The audit says statement 400. Today it is 500. | **500** for H2/H3. **400** for statement display at ≥ 3.5rem (optical sizing gives the contrast). Never 600+. |
| Eyebrow size | Today 0.8rem (12.8px). The audit suggested 0.75–0.8125rem for meta. The brain floor is no visible text under 14px. | **14px floor wins.** Eyebrows, meta, progress labels, footer headings and the legal row are all ≥ 0.875rem. |
| Journey length | 4.6 vh (today) vs 3.6 vh (audit) | **3.6 viewports.** |
| Scroll word-highlight | Research suggests word opacity 0.25 → 1 | **Rejected as specified** (fades text below AA). Allowed variant: colour scrub from slate `#4A4F55` (7.60:1) to charcoal (15.23:1) on one line only. Both ends pass AA. Optional. |
| SplitText line-rise | Research suggests it on H2s | **Optional, Phase 6, owner opt-in**, on at most 3 statement H2s, with an sr-only real heading plus an `aria-hidden` visual twin. Skip it if Lighthouse a11y drops below 100 or the owner declines. |
| Lenis smooth scroll | Research says optional | **Not in scope.** Native scroll is calmer and safer for the sticky stage. Raise it with the owner only if asked. |
| paper-design shaders, postprocessing, MeshTransmissionMaterial, Rive, Lottie, theatre.js runtime, ScrollSmoother, Flip | Research lists them as options | **Do not add any of these** (§7.11). |
| Proof section | Leave empty vs fill | Make it an honest "what you can check" panel using existing sentences only (§8.3.8). |
| Logo on charcoal | Logo fill is brass `#8A5F1C`, but README says loop on charcoal = brass-line | **Owner decision** (§13). Tone only, geometry unchanged. |

---

## 5. Priorities

Spend effort in this order. Static craft raises perceived quality more than motion does.
1. Type scale and measure.
2. Spacing and section rhythm.
3. Surfaces and depth.
4. Illustration consistency.
5. Motion choreography.
6. Micro-interactions.
7. Route transitions.

Every animation must serve one of three purposes: **feedback**, **orientation**, or **brand atmosphere in a decorative layer**. If it adds nothing, delete it.

---

## 6. Design system upgrade

### 6.1 Colour usage, tints and measured contrast

Add these derived tokens. All are tints of the locked palette, so no new hues.

| New token | Value | Use |
|---|---|---|
| `--color-ivory-2` | `#F2EDE4` | Alternate light band, blockquote and inset surfaces |
| `--color-paper` | `#FBFAF6` (= `color-mix(in srgb, #fff 45%, ivory)`) | Raised card surface on ivory |
| `--color-paper-shade` | `#EFE6D6` | Illustration paper shade, debossed tone-on-tone |
| `--color-ink-3` | `#2F353B` | Hover or raised-raised surface on charcoal (rare) |
| `--color-brass-shadow` | `#5C3E12` | Illustration only: shaded side of brass objects |
| `--color-brass-light` | `#C49A5A` | Illustration only: one highlight on brass objects. Never text or glyphs |
| `--color-hairline-dark` | `rgb(201 196 186 / 0.12)` | Full-bleed rules on charcoal |

Contrast pairs measured with WCAG 2.2 relative luminance. Add any new text pair to `scripts/contrast.mjs` so `npm run check` enforces it.

| Text pair | Ratio | Allowed |
|---|---|---|
| charcoal on ivory / paper / ivory-2 | 15.23 / 15.87 / 14.22 | Yes |
| slate on ivory / paper / ivory-2 / paper-shade | 7.60 / 7.91 / 7.09 / 6.68 | Yes |
| brass on ivory / paper / ivory-2 | 5.17 / 5.38 / 4.82 | Yes |
| brass on paper-shade | 4.54 | Large text and UI only; avoid body text |
| ivory on brass (button) / on brass-press | 5.17 / 6.64 | Yes |
| ivory on charcoal / ink-2 / ink-3 | 15.23 / 13.12 / 11.40 | Yes |
| mist on charcoal / ink-2 / ink-3 | 9.54 / 8.22 / 7.14 | Yes |
| brass-line on charcoal / ink-2 | 5.30 / 4.57 | **Decorative only.** Never text, by rule |
| brass on charcoal / ink-2 | 2.95 / 2.54 | **Never** |
| brass-line on ivory | 2.87 | **Never** (and decorative brass-line is charcoal-only) |

Usage rules:
- Secondary text is slate on light and mist on dark. Never use lowered opacity on text.
- One accent per view: brass carries the single button, the eyebrow, display numerals on ivory, and the loop.
- On charcoal, numerals and accents use mist or brass-line strokes, never brass text.
- **Surface alternation:** two same-surface bands never touch. Charcoal is punctuation: at most two dark bands per page, plus the footer. "Other services", the CTA band and the footer must never form a single dark stack (§8.1). To keep to two, the health handling band moves to ivory-2 with a dark example card (§8.3.7), on home and on `/home-care-agencies`.

### 6.2 Typography

**Fonts.**
- Keep `font-optical-sizing: auto`, so display sizes get Fraunces' tight, high-contrast display forms.
- Test adding `'SOFT'` to `axes` in `layout.tsx` (`axes: ['opsz', 'SOFT']`) and set `font-variation-settings: 'SOFT' 50` on `.text-display, .text-h1, .text-h2` only. Keep `WONK` off.
- **Ship SOFT only if** the font payload grows ≤ 20 KB, the `/` mobile LCP does not regress and the Worker gate (§1.2) still passes. Report all three numbers.
- Inter weights 400 and 600 only. Fraunces 400 (display) and 500 (headings).
- **No italic.** `layout.tsx` loads Fraunces in the normal style only, so `font-style: italic` would give a synthesised faux italic. Pull-quotes use roman Fraunces 400 at display optical size. If the owner truly wants italic, load it with `preload: false` and gate it the way SOFT is gated (≤ 20 KB, no LCP regression on `/`), and report the numbers.

**Fluid scale.** The table below is the source of truth; it is not a strict modular ratio. Use rem intercepts so zoom works. **Hierarchy rule:** no token renders larger than `h1` at any viewport width, so the statement H2 just below the hero never outranks the locked H1. Add these to `@theme` as `--text-*` with paired `--text-*--line-height` and `--text-*--letter-spacing`, so Tailwind 4 generates `text-display`, `text-h1` and so on.

| Token | Size | Line height | Tracking | Fraunces | Use |
|---|---|---|---|---|---|
| `display` | `clamp(2.4rem, 1.95rem + 1.9vw, 3.75rem)` (38.4→60px, below `h1` at every width) | 1.04 | -0.025em | 400, opsz auto (≈144) | Statement headings, CTA band H2 |
| `h1` | `clamp(2.6rem, 2.193rem + 2.034vw, 4.1rem)` | 1.0 | -0.02em | 500 | The locked home H1, page hero H1s. Same 41.6→65.6px endpoints as today, but continuous: today's classes jump to `text-6xl` (60px) at 640px, where the clamp gives about 48px, so the tablet H1 shrinks by about 20%. That is allowed (size only); show 640–1023px screenshots in the Phase 1 report |
| `h2` | `clamp(2rem, 1.62rem + 1.2vw, 2.875rem)` | 1.12 (token); 1.08 at ≥ lg via the override below | -0.015em | 500 | Section H2 (split and default variants) |
| `h2-compact` | `clamp(1.75rem, 1.55rem + 0.6vw, 2.25rem)` | 1.12 | -0.012em | 500 | FAQ, blog, reading sections |
| `h3-lg` | `clamp(1.5rem, 1.36rem + 0.45vw, 1.75rem)` | 1.15 | -0.01em | 500 | **New mid level**: sub-heads in sections, spec-sheet rows, chapter H3 on mobile |
| `h3` | `1.25rem` (20px) | 1.25 | -0.005em | 500 | Card titles |
| `numeral` | `clamp(3rem, 2.4rem + 2vw, 4.5rem)` | 1 | -0.02em, `tabular-nums` | 400, opsz 144 | Step and promise numerals: brass on ivory, mist on charcoal |
| `lede` | `clamp(1.125rem, 1.08rem + 0.25vw, 1.25rem)` | 1.55 | 0 | Inter 400 | Hero lede, section intros |
| `body` | `clamp(1rem, 0.966rem + 0.169vw, 1.0625rem)` | 1.6 | 0 | Inter 400 | Default body |
| `prose` | `1.125rem` | 1.75 | 0 | Inter 400 | Blog post body |
| `small` | `0.9375rem` | 1.5 | 0 | Inter 400/600 | Meta, trust facts, card links |
| `eyebrow` | `0.875rem` (14px floor) | 1.3 | 0.14em (0.08em < 640px), uppercase via CSS | Inter 600 | Eyebrows, column headings, progress label |

Rules:
- `body { line-height: 1.6 }` (from 1.7).
- A Tailwind 4 `--text-h2--line-height` token holds one value. Set it to 1.12, then add `@media (width >= 64rem) { .text-h2 { line-height: 1.08; } }` in `globals.css` after `@theme` (or put `lg:leading-[1.08]` in `SectionHeading`).
- Measure: body copy `max-width: 65ch`, ledes `34rem`, prose `66ch`.
- Headings keep `text-wrap: balance`; paragraphs keep `pretty`.
- Hyphenated heading phrases get a `white-space: nowrap` span.
- Exactly one H1 per page, and no skipped levels.
- Nothing visible under 14px.

**Eyebrow fix.**
- Use `flex items-start` and align the rule to the first line (`mt-[0.62em]`), so 2-line eyebrows stay tidy. The audit found the 40px rule sitting only on line 1 of "FOR HOME CARE OWNERS AND ADMINISTRATORS" at 390px.
- Add an optional `short` prop rendered under 640px (owner approves any new short string, §13).
- Eyebrow to H2 gap 20px on desktop and 24px on mobile. H2 to intro 20px. Intro to the next block ≥ 48px.

### 6.3 Spacing scale and section rhythm

- **Spacing scale (px), for gaps, margins and padding:** 4, 8, 12, 16, 24, 28, 32, 48, 64, 72, 80, 96, 128, 160. Do not use off-scale spacing values.
- **Component dimensions are exempt** from the spacing scale, but only these: 36px pause-control chip (44px hit area), 44px tap targets and call button, 56px divider knot, 64px MobileBar, 120px progress track, blog header strip and hero plate, `--header-h` 64/72px, the 80px (5rem) numeral gutter, and percentage padding inside the hero loop box (`py-[8%]`).
- **Section padding:**

  | Band type | Mobile | sm | lg |
  |---|---|---|---|
  | Primary home bands (`rhythm="loose"`) | 96 | 128 | 160 |
  | Default bands | 80 | 96 | 128 |
  | Reading and list bands: FAQ, blog, contact (`rhythm="tight"`) | 64 | 80 | 96 |

- Add a `rhythm` prop to `Section.tsx` and remove ad hoc `pt-0` overrides where possible.
- Card padding: `p-6` (24) on mobile, `p-8` (32) for 2- and 3-up cards, `p-7` (28) for 4-up cards. Title to body gap 12px. Body to action gap 24px.
- `--header-h: 4.5rem` (lg) / `4rem` (mobile) as a token. Reuse it in `.journey` (`--journey-header`), `scroll-margin-top` and sticky offsets.
- Under 760px, add `html { scroll-padding-bottom: 96px }` so focus never hides behind the mobile bar.

### 6.4 Grid and composition

- 12-column grid inside `Container` at lg and up, `gap-x-8` (32px).
- **Page heroes:** 7/5 split (`lg:grid-cols-12`, text `col-span-7`, art `col-span-5`) with `items-center`, on every marketing page. No marketing hero is text-only on desktop. `/privacy`, `/terms`, the 404 page and `/styleguide` are exempt (§8.14).
- **Split section heading:** eyebrow and H2 in `col-span-5`, intro in `col-start-7 col-span-6`, with the intro aligned to the H2's first baseline (`lg:pt-[calc(eyebrow height + 20px)]`).
- **Body splits:** heading and intro in cols 1–5, content in cols 7–12.
- Copy columns never stretch beyond 65ch even at 1440. Art takes the remaining columns.

### 6.5 Radii

| Token | Value | Use |
|---|---|---|
| `--radius-xs` | 2px | Proof sheets in illustrations, progress bar |
| `--radius-sm` | 8px | Notecards and paper objects, chips, inputs |
| `--radius-md` | 12px | Icon chips, small buttons |
| `--radius-card` | 20px | Cards, film frame, blockquote card |
| `--radius-xl` | 28px | CTA invitation card |
| `--radius-pill` | 9999px | Buttons, pause controls |

### 6.6 Elevation and shadow set

There is one light source at 315° (upper left). It matches the 3D key light and every illustration. The shadows are warm, never pure black.

```css
--shadow-color: 36deg 22% 32%;            /* warm brown in the brass/ivory family */
--shadow-hair:  0 1px 0 rgb(255 255 255 / .6) inset;                    /* paper top edge */
--shadow-1: 0 1px 1px hsl(var(--shadow-color) / .10), 0 1px 2px hsl(var(--shadow-color) / .06);
--shadow-2: var(--shadow-hair), 0 1px 2px rgb(27 31 35 / .04), 0 12px 32px -12px rgb(27 31 35 / .10);  /* resting card */
--shadow-3: var(--shadow-hair), 0 2px 4px rgb(27 31 35 / .05), 0 22px 44px -18px rgb(27 31 35 / .16); /* hover card, film frame */
--shadow-object: 0 1px 1px rgb(27 31 35 / .06), 0 18px 40px -18px rgb(27 31 35 / .18); /* illustration plates, medallions */
--shadow-header: 0 1px 0 rgb(27 31 35 / .04), 0 8px 24px -16px rgb(27 31 35 / .12);
```

- **On charcoal, depth comes from surface, not shadow.** ink-2 means closer, and a 1px `rgb(184 137 74 / .22)` brass-line border is decorative.
- Hover lift must be compositor-only. Put `--shadow-3` on a `::after` at `opacity: 0`, fade it to 1, and `translateY(-2px)`. Never transition `box-shadow` directly.

### 6.7 Grain and texture

- **`.paper`** goes on ivory bands, the problem scene and vignette plates. It sits **beneath content**: either as the band's own `background-image` (surface colour plus tile), or as a `::before` at `z-index: -1` inside a parent with `isolation: isolate`. Use no `mix-blend-mode`; bake the texture's strength (about 6%) into the 256px repeating tile. It must never sit over text or the button.
  - Until ASSET_BRIEF #1 exists, use a baked noise PNG/AVIF tile of about 6 KB. Do not use a live SVG filter on large areas.
  - Optionally use the research's `feTurbulence` + `feDiffuseLighting` recipe, rasterised once, as the stand-in tile.
- **`.felt`** goes on `.tone-dark` bands, the film frame and the CTA card, at about 5% strength, built the same way as `.paper` (beneath content, no blend mode). **Not on OG cards** (§8.12). Use ASSET_BRIEF #3 when it exists. Until then, use a baked charcoal noise tile.
- **Contrast with texture on.** The §6.1 ratios were computed on flat colours, and brass on ivory-2 (4.82) and on paper-shade (4.54) sit close to 4.5. With the tile composited, sample the darkest 1% of background pixels behind each text pair and recompute. If any pair drops below its threshold, remove the texture from that text-bearing surface.
- Remove the per-SVG `feTurbulence` grain filter from `ProblemArt.tsx`. It is a paint cost during scrub.
- Keep `.film-grain` for the hero visual, or fold it into `.paper`.
- All texture is static: no motion, no CLS. Update `PLACEHOLDERS.md` to say which stand-in is live.

### 6.8 Component specs

**SectionHeading.** Add `variant: "statement" | "split" | "default" | "compact"`.

| Variant | Layout | H2 token | Use |
|---|---|---|---|
| statement | Centred, `max-w-[18ch]` H2, intro `max-w-[38rem]` centred | `display` | Home "The thank you is already there…", CTA band, Seven promises |
| split | 12-col, H2 cols 1–5, intro cols 7–12 | `h2` | Bundle, health, fit, HCA "What we do", services sections |
| default | Left, `max-w-3xl` | `h2` | Everything else |
| compact | Left | `h2-compact` | FAQ, blog lists, related guides |

The home page must not use the same variant three times in a row. Home order: Problem `statement` → Bundle `split` → How it works `default` → film (caption column, no SectionHeading) → Seven promises `statement` → Health `split` → Proof `default` (heading left at `max-w-3xl`, panel centred below it at `max-w-3xl`) → Fit `split` → FAQ `compact` → CTA band `statement`.

`SectionHeading` already renders subpage H1s through `as="h1"`. Map `as="h1"` to the `h1` token and `as="h2"` to the variant's H2 token, and show the resulting subpage H1 size change in the Phase 1 screenshots.

**Card.** Add `tone: "light" | "dark"` and `interactive?: boolean`.
- Light: `bg-paper`, border `1px solid color-mix(in srgb, var(--color-rule) 80%, transparent)`, `--shadow-2`, radius 20px.
- Dark (on charcoal): `bg-ink-2`, border `1px solid rgb(184 137 74 / .22)`, radius 20px, ivory headings, mist body. The icon chip has a brass-line 1px ring. No brass text.
- Interactive (whole card is a link): hover/focus-visible lift as in §6.6 over 280ms `--ease-soft`, only under `(hover: hover)`. Focus ring stays instant.
- Delete the "ivory slab on charcoal" pattern everywhere (bundle, one-time projects, about people, other services).

**PillarCard.** Add a decorative 2px top accent: brass on light, brass-line on dark. Use the icon chip style above.

**Button.**
- Background-colour transition 150ms `--ease-standard`. `:active` has no transition and uses `brass-press`.
- Arrow nudge `translateX(3px)` 150ms `--ease-soft`.
- No scale, no bounce. Focus ring instant.

**Pause controls (all scenes).**
- One style: 36px circle with a 44px hit area, inset 16px bottom-right of its scene.
  - On light: an opaque `bg-ivory` chip (at least `bg-ivory/95`) with a charcoal icon. The icon must be ≥ 3:1 against the chip (charcoal on ivory is 15.23:1).
  - On dark: an opaque `bg-ink-2` chip with an ivory icon (13.12:1).
  - The 1px ring (rule on light, brass-line on dark) is decorative only and does not count toward contrast.
- Visible whenever the scene has motion, **playing or paused**, so touch users can always find resume. No hover-only state, no entrance delay and no fade-in: it is present whenever the scene is (and simply present under reduce). Always keyboard-reachable.
- The header "Pause motion" toggle stays on every page, including in MobileNav.

---

## 7. Motion system

### 7.1 Principles

- Motion runs on the compositor: `transform` and `opacity` only. Small SVG stroke-dashoffset or DrawSVG scrubs are acceptable on fixed-size art, **phones included**. Decision: the thread divider and the portrait problem thread scrub on phones too, as `Thread.tsx` already does today. Every CSS before-state is scoped to exactly the conditions under which its timeline is built (§7.9).
- Do not animate `r`, `fill`, `background-color`, `box-shadow`, `filter`, `top`, `left`, `height` or `margin` per frame. Crossfade a second layer instead.
- `will-change: transform` is set only inside ScrollTrigger `onToggle` while active, then removed.
- Scrubbed master timelines use `ease: "none"`. Individual tweens inside them use the tokens below.
- Exits are faster than entrances.

### 7.2 Easing tokens

`--ease-out`, `--ease-in`, `--ease-inout` and `--ease-draw` match `video/src/theme.ts` (the brand film) exactly. `--ease-soft` and `--ease-standard` are site-only UI tokens. Use them everywhere.

| Token | cubic-bezier | GSAP name | Use |
|---|---|---|---|
| `--ease-out` | `0.16, 1, 0.3, 1` | `rl.out` | Entrances, arrivals, reveals |
| `--ease-soft` | `0.22, 1, 0.36, 1` | `rl.soft` | UI state changes, hovers, menus |
| `--ease-in` | `0.7, 0, 0.84, 0` | `rl.in` | Exits |
| `--ease-inout` | `0.83, 0, 0.17, 1` (the film's `inOut`) | `rl.inOut` | Crossfades, camera moves between chapters, ambient drift |
| `--ease-draw` | `0.45, 0, 0.2, 1` | `rl.draw` | Stroke draws |
| `--ease-standard` | `0.2, 0, 0, 1` | — | Button colour, tiny feedback |

Add to `@theme`: the `--ease-*` variables, plus `--default-transition-timing-function: var(--ease-soft)` and `--default-transition-duration: 240ms`. This replaces Tailwind's default `cubic-bezier(0.4,0,0.2,1)` site-wide.

Optional overdamped spring: generate `--ease-settle` with `linear()` (jakearchibald/linear-easing-generator, bounce ≈ -0.2, visualDuration 0.45 s) for the arrow nudge and FAQ icon. Use a `@supports not (transition-timing-function: linear(0, 1))` fallback to `--ease-soft`. Never use positive bounce.

### 7.3 Duration tokens

| Token | Value | Use |
|---|---|---|
| `--dur-instant` | 0ms | Focus rings, `:active` |
| `--dur-feedback` | 150ms | Button colour, arrow nudge, underline thickness |
| `--dur-hover` | 240ms | Nav underline, card lift (240–280), icon rotate |
| `--dur-ui` | 320ms | Menu open (280), FAQ open (320), mobile bar slide (280) |
| `--dur-exit` | 180ms | Menu close, page exit (160) |
| `--dur-enter` | 700ms | Time-based block entrances (600–900) |
| `--dur-hero` | 900ms | 3D canvas fade-in |
| Ambient | 16–28 s | Comet, ribbon drift, film. Must be pausable |

**Asymmetry rule:** an exit uses `rl.in` at about 60% of the matching entrance duration.

### 7.4 Stagger rules

- Grid children: 60ms on ivory, 70ms on charcoal. Cap at 4 steps. The 5th child and later share the 4th delay.
- Text inside a chapter: 50ms steps, in the order number → H3 → body.
- List rows (promises, spec sheet): 50ms, capped at 4.
- Never stagger words in body copy. Never stagger more than one group in the same viewport at once.

### 7.5 Reveal system

Replace today's whole-section `.reveal` (one linear fade of up to 1,900px; the audit linked it to washed-out H2s, the axe 96 score and blank full-page captures, so reproduce those before fixing) with two classes.

```css
/* Feature check: partial implementations pass view() alone. */
@supports ((animation-timeline: view()) and (animation-range: 0% 100%)) {
  @media (prefers-reduced-motion: no-preference) {
    /* TEXT: transform only, never opacity. */
    :root:is([data-motion="full"],[data-motion="paused"]) .reveal {
      animation-name: rl-rise;
      animation-fill-mode: both;
      animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    }
    :root:is([data-motion="full"],[data-motion="paused"]) .reveal {
      animation-timeline: view();
      animation-range: entry calc(0% + var(--i, 0) * 4%) entry calc(45% + var(--i, 0) * 4%);
    }
    /* DECORATION ONLY (aria-hidden): may fade and unclip. */
    :root:is([data-motion="full"],[data-motion="paused"]) .reveal-art {
      animation-name: rl-unveil;
      animation-fill-mode: both;
      animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    }
    :root:is([data-motion="full"],[data-motion="paused"]) .reveal-art {
      animation-timeline: view();
      animation-range: entry 15% cover 40%;
    }
  }
}
@keyframes rl-rise   { from { transform: translateY(10px); } to { transform: none; } }
@keyframes rl-unveil { from { opacity: 0; clip-path: inset(0 12% 0 12% round 20px); }
                       to   { opacity: 1; clip-path: inset(0 0 0 0 round 20px); } }
@keyframes rl-rule   { from { transform: scaleX(0); } to { transform: scaleX(1); } }
```

- **Minifier-safe:** keep `animation-timeline` and `animation-range` in a separate rule from `animation-name`. The build minifier once folded them into an `animation` shorthand that browsers ignored. After the build, verify in the served CSS (`.next/static/css/*.css` and `out/`) that the longhands survive.
- `Section.tsx`: `reveal` defaults to **false**. Remove the class from Containers.
- `SectionHeading` puts `.reveal` on the eyebrow, H2 and intro (`--i` 0, 1, 2). Grids put it on each item (`style={{ "--i": Math.min(index, 4) } as React.CSSProperties}`; the cast is needed for `npm run check`).
- The eyebrow hairline gets `rl-rule` (`transform-origin: left`) on the same timeline.
- `.reveal-art` goes on vignettes, emblems, the film frame, the proof panel icon column and illustration plates. It never goes on text.
- **Never** put either class on a sticky element or an ancestor of one (the journey).
- No-JS (`static`) and `reduce` visitors get no animation, with the finished state visible.
- **Double-failure guarantee:** content stays visible when the `@supports` check fails **and** GSAP also fails. `.reveal` and `.reveal-art` set no hidden base state outside the `@supports` block, and GSAP before-states follow §7.9 (scoped, and void under `rl-gsap-failed`). Test it: block the GSAP chunks with Playwright `page.route`, inject a test-only `addStyleTag` that sets `animation: none !important` on `.reveal, .reveal-art`, and take a full-page no-scroll screenshot. Every heading, paragraph and illustration end state must be visible.
- **Acceptance:** a Playwright full-page screenshot with no scrolling shows every heading and paragraph at full contrast, with no blank regions. Lighthouse a11y is 100 on `/services` and `/services/review-replies`.

### 7.6 GSAP setup

`src/lib/motion/gsap.ts`: extend the existing memoised `loadGsap()`. Keep its `loading` promise, its return shape and `ScrollTrigger.config({ ignoreMobileResize: true })`.

```ts
let loading: Promise<GsapModules> | null = null;

export function loadGsap(): Promise<GsapModules> {
  if (!loading) {
    loading = Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("gsap/CustomEase"),
    ]).then(([g, st, ce]) => {
      const gsap = g.gsap;
      const ScrollTrigger = st.ScrollTrigger;
      const CustomEase = ce.CustomEase;
      gsap.registerPlugin(ScrollTrigger, CustomEase);
      ScrollTrigger.config({ ignoreMobileResize: true });
      CustomEase.create("rl.out",   "0.16,1,0.3,1");
      CustomEase.create("rl.soft",  "0.22,1,0.36,1");
      CustomEase.create("rl.in",    "0.7,0,0.84,0");
      CustomEase.create("rl.inOut", "0.83,0,0.17,1");
      CustomEase.create("rl.draw",  "0.45,0,0.2,1");
      gsap.defaults({ ease: "rl.out" });
      document.documentElement.classList.add("rl-gsap-ready"); // read by the head-script timer, §7.9
      return { gsap, ScrollTrigger };
    });
  }
  return loading;
}
```

- Add lazy plugin helpers that run `await import()` and register only in the scenes that need them: `loadDrawSVG()` (2.2 KB gz), `loadMotionPath()` (9.7 KB gz, **`/services/review-replies` TrustLoop only; never loaded on `/`**), and `loadSplitText()` (3.7 KB gz, optional, §4). CustomEase is 3.7 KB gz. All ship with the installed gsap 3.15.1, and the GSAP licence note in `gsap.ts` already covers them.
- **JS budget on `/`:** CustomEase 3.7 + DrawSVG 2.2 = 5.9 KB of the 15 KB allowance (§1.2), which leaves about 9 KB for all new app code on `/` (header and MobileBar observers, `<ViewTransition>` wrappers, journey changes). SplitText (3.7 KB) counts against the same allowance if the owner opts in. Lazy post-hydration chunks count. Measure; do not estimate.
- **Never register ScrollSmoother, and do not load Flip.**
- **One motion gate:** in `useGsapScene.ts`, build scenes inside `gsap.matchMedia()` with conditions `{ desktop: '(min-width: 1024px)', reduce: '(prefers-reduced-motion: reduce)' }`, and read `html[data-motion]` inside. Watch `data-motion` with a `MutationObserver` and call `gsap.matchMediaRefresh()` (or revert and rebuild the context) so every scene switches at once. On `reduce`, skip timelines and leave the CSS final state. Before building any timeline, check `document.documentElement.classList.contains("rl-gsap-failed")`; if it is set, build nothing for the rest of this page view (§7.9). Keep the existing batched refresh and `<Activity>` revert behaviour.
- **Scrub:** `scrub: 1` on scenes, `0.8` on small art. Do not use `scrub: true`.

### 7.7 Micro-interactions

All of these are disabled or instant under `data-motion=reduce` and reduced motion.

| Element | Spec |
|---|---|
| Nav links (`Header.tsx`) | Replace `hover:underline` with a 1px brass underline drawn by `background-size: 0% 1px → 100% 1px`, 260ms `--ease-soft`. It enters from the left and leaves to the right (`background-position` switch). `aria-current` page link shows the full underline. |
| Mobile menu (`MobileNav.tsx`) | Keep the panel in the DOM with `inert` + `data-open`. Open: `opacity`, `translateY(-8px)→0`, `clip-path: inset(0 0 100% 0)→inset(0)` over 280ms `--ease-soft`. Close over 180ms `--ease-in`. Stagger links 30ms. Add a `charcoal/20` scrim fading over 200ms. Focus moves to the first link on open and returns to the toggle on close. Esc closes. Body scroll locks while open. The link fade is named exception 4 in §4. No-JS: a server-rendered `inert` panel cannot open, so either make the menu usable without JS (for example a `<details>` disclosure that the script enhances) or record in the phase report that no-JS visitors use the footer links. |
| FAQ (`FAQ.tsx`) | Keep native `<details>`. Add `:root { interpolate-size: allow-keywords }`, `details::details-content { height: 0; overflow: clip; transition: height 320ms var(--ease-soft), content-visibility 320ms allow-discrete }`, `details[open]::details-content { height: auto }`. The answer text fades `opacity` over 250ms. This is named exception 1 in §4: it is user-initiated and settles at 1 before reading. The plus icon rotates to minus (90°, 240ms). Firefox and Safari open instantly, which is acceptable. |
| Cards (interactive) | §6.6 lift, 280ms `--ease-soft`, `(hover: hover)` only. |
| Mobile bar | §8.1. |

### 7.8 Route transitions

React 19.3 `<ViewTransition>` works in the Next 16.4 App Router with no config. Read the local guide first.

- Wrap each `page.tsx` body **below the hero H1 level**, not `layout.tsx`, in `<ViewTransition enter="rl-page" exit="rl-page" default="none">`.
  - **On `/`, do not wrap the hero section.** The H1 must paint as LCP untouched.
- Header: `style={{ viewTransitionName: 'site-header' }}`. MobileBar: `'mobile-bar'`. Then add:

  ```css
  ::view-transition-group(site-header), ::view-transition-group(mobile-bar) { animation: none; z-index: 100; }
  ::view-transition-old(site-header), ::view-transition-old(mobile-bar) { display: none; }
  ::view-transition { pointer-events: none; }
  ::view-transition-old(root), ::view-transition-new(root) { animation: none; }
  ::view-transition-old(.rl-page) { animation: 160ms var(--ease-in) both rl-fade-out; }
  ::view-transition-new(.rl-page) { animation: 280ms var(--ease-out) 60ms both rl-fade-in-up; } /* translateY(6px)→0, no blur */
  ```

  The browser's default `root` group cross-fades the whole page, H1 included, on every navigation. React client navigations snapshot `root` the same way, so leaving the hero unwrapped is not enough on its own. Turning off the `root` animation means only the named `.rl-page` groups animate. The `.rl-page` fade is named exception 3 in §4.

- Optional shared element: `<ViewTransition name={`emblem-${slug}`} share="morph" default="none">` on the emblem on `/services` cards and on the `/services/*` hero emblem. Keep `share` with `default="none"`, or the pair silently stops morphing.
- Under `prefers-reduced-motion` and `:root:is([data-motion=reduce],[data-motion=paused])`, set `::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important; }`.
- Do **not** add `@view-transition { navigation: auto; }`. Cross-document transitions cross-fade `root` (the H1 with it) and hold the new page's first render until the transition starts, which hurts field LCP. Do not use `blocking=render`.
- Do not assume the static Worker build does full page loads. Next static export keeps client-side `<Link>` navigation through the exported RSC `.txt` payloads (`static-finish.mjs` removes `styleguide.txt`, which shows they are emitted), so view transitions will likely run on the live Worker too. Test it in §11.8.
- **Acceptance:** a Playwright client navigation from `/services` to `/` that records `getComputedStyle(h1).opacity` every frame shows the H1 at opacity 1 throughout, with no `root` animation. The Lighthouse LCP element on `/` is still `h1#hero-title`.

### 7.9 Reduced motion and pause behaviour

- Complete the global reduce block (web.dev recipe): `animation-delay: -1ms; transition-delay: -1ms; background-attachment: initial; scroll-behavior: auto`. Apply it under `@media (prefers-reduced-motion: reduce)` **and** `:root[data-motion="reduce"]`.
- `paused`: ambient loops (comet, ribbon drift, TrustLoop lap, film, 3D idle) stop and resume from where they stopped (negative-delay parking as `.loop-comet` does today). Scroll-linked scenes still follow scroll. View transitions are off.
- `reduce` and `static`: no timelines. Every scene shows its finished state:
  - Problem: reply arrived, thread drawn, no dust.
  - Journey: stacked steps with vignettes.
  - TrustLoop: all stations lit.
  - Hero: the SVG still.
  - Film: the poster.
- Set "before" states in CSS gated by the head-script attribute, so they are correct before first paint and nothing draws and then erases. Today the divider thread shows drawn and then erases about 120ms later.

- **Scope every before-state to exactly the conditions under which its timeline is built**, and show the finished state everywhere else. The head script (`MOTION_HEAD_SCRIPT` in `state.ts`) also sets `html[data-tier]` (`full` | `lite`) from the pre-paint tests that `getMotionTier()` uses (Save-Data, `deviceMemory`, `hardwareConcurrency`). Each scene's breakpoint is written as the same media query string as its `gsap.matchMedia()` condition.

  ```css
  /* Thread divider and portrait problem thread: built at every width on the full tier (§7.1). */
  :root:is([data-motion=full],[data-motion=paused])[data-tier=full]:not(.rl-gsap-failed) path[data-thread] { stroke-dashoffset: 1; }
  :root:is([data-motion=full],[data-motion=paused])[data-tier=full]:not(.rl-gsap-failed) .problem-scene:not([data-animated]) [data-p=reply] { opacity: 0; }
  /* A desktop-only scene wraps the same prefix in its matchMedia query, e.g. @media (min-width: 1024px) { … }. */
  ```

  If a scene skips its timeline for any other reason (short screen, large text, low-power probe), it sets `data-animated` (or a `data-static` attribute) so its before-state clears and the finished state shows. **Acceptance:** at 390×844 and 1440×900, on both tiers, the divider and portrait thread end fully drawn after a scroll-through, and are fully drawn wherever their timeline is not built.
- **GSAP failure fallback.** The inline head script owns the timer, not a bundle (a bundle that fails cannot set it). On `window` `load`, it starts a 3 s timeout. If `html.rl-gsap-ready` (set by `loadGsap()`, §7.6) is still absent when it fires, it adds `html.rl-gsap-failed`, which voids every before-state. Once `rl-gsap-failed` is set, `useGsapScene` builds no timelines for the rest of that page view, even if GSAP arrives later, so the finished state never re-hides or jumps. Test with Lighthouse-style throttling (4× CPU, slow 4G) and with the GSAP chunks blocked through Playwright `page.route`.

### 7.10 Perf budget per scene

| Scene | Runs when | Budget |
|---|---|---|
| Hero 3D | Capable desktop, hardware WebGL, after pointer or key intent or 7 s idle | No main-thread task > 50 ms in init; idle loop ≤ 4 ms/frame; stops off screen and when paused; falls back after 45 frames < 50 fps |
| Problem scene | All tiers (portrait SVG on phones) | Scrub ≤ 2 ms script/frame; no filters animating; DOM nodes ≤ 120 |
| Journey | lg+ and height ≥ 40em, motion on | One timeline; camera driven by the timeline; bead positioned from the existing `loopCurve` sampler (no MotionPathPlugin on `/`); ≤ 3 ms script/frame; no `filter` on moving bead |
| Thread divider | Visible | DrawSVG or dash; one path per divider |
| TrustLoop | On screen, motion full | One repeating timeline; no `r`, `fill` or `stroke` tweens (layer crossfades) |
| Emblem comet | On screen, motion full | CSS only |
| Film | On screen, motion full | `preload="none"`, AVIF poster. Today MP4 444,502 B and WebM 395,931 B; hard cap 450,000 B per file and no growth in the film-plus-posters total (§1.2) |
| Route transition | Client nav | ≤ 440 ms total; compositor only |

### 7.11 Libraries

| Library | Decision | Cost | Why |
|---|---|---|---|
| gsap CustomEase | **Add (already installed)** | 3.7 KB gz | Brand easing tokens |
| gsap DrawSVGPlugin | **Add, lazy** | 2.2 KB gz | Centre-out draws, no round-cap dot artefacts |
| gsap MotionPathPlugin | **Add, lazy, `/services/review-replies` only** | 9.7 KB gz | TrustLoop travel-and-dwell. Never on `/`: the journey bead uses the `loopCurve` sampler |
| gsap SplitText | Optional (owner opt-in) | 3.7 KB gz | Statement H2 line-rise only |
| React `<ViewTransition>` | **Use** | 0 KB | Route continuity |
| CSS scroll-driven animations, `linear()`, `::details-content`, `interpolate-size` | **Use** | 0 KB | Reveals, springs, FAQ |
| drei (AccumulativeShadows, Lightformer) | **Do not add** | — | Not needed. The contact shadow is CSS (§8.2), and the light map uses three's own `PMREMGenerator.fromScene`. drei is not installed, and its components need a live WebGL canvas, so a plain Node bake script could not run them |
| Lenis, ScrollSmoother, Flip, Rive, Lottie, theatre.js runtime, @react-three/postprocessing, MeshTransmissionMaterial, shadergradient, paper-design shaders | **Do not add** | 10–100 KB each or per-frame passes | Flashy, heavy, opaque to accessibility, or they break the CLS-0 sticky stage |

---

## 8. Section-by-section plan

Each item lists the problem, the change, implementation notes and acceptance criteria. "Evidence" refers to files under the audit scratchpad (§2.5).

### 8.1 Global chrome (all pages)

**Header** (`src/components/layout/Header.tsx`)
- **Problem.**
  - The audit sampled `bg-ivory/85` + `backdrop-blur(8px)` as a muddy grey (rgb(215,212,208)) over charcoal bands.
  - The audit measured the nav centre at 673.7px against a viewport centre of 720px, 46px off. Evidence: `visual-audit/frames/home-d-04.png`, `nav.js`.
  - Neither measurement is verifiable from repo files. Reproduce both before fixing.
- **Change.** Solid ivory header, centred nav, scrolled state.
- **Implementation.**
  - `bg-ivory` (no alpha, no blur).
  - `grid grid-cols-[1fr_auto_1fr] items-center`: logo `justify-self-start`, nav centred, actions `justify-self-end`.
  - Height `var(--header-h)`.
  - Add a 1px sentinel `<div>` at the top of `<body>` and an IntersectionObserver that sets `data-scrolled` on the header when the sentinel leaves the viewport (no scroll listener). In the scrolled state, add `border-b border-rule` and `--shadow-header`, with a 240ms `--ease-soft` opacity transition on a `::after` layer.
  - Nav underline per §7.7. `viewTransitionName: site-header`.
- **Acceptance.** Header pixel over charcoal = `#F8F5EF` ±1. Nav centre within ±2px of the viewport centre at 1280, 1440 and 1920. No CLS.

**MobileBar** (`src/components/layout/MobileBar.tsx`)
- **Problem.**
  - It shows from first paint, so the hero CTA (y≈660) sits directly above an identical bar CTA (y≈806).
  - It duplicates the CTA band and the /contact booking card.
  - Header plus bar take about 17% of an 844px screen. Evidence: `home-m-00.png`, `contact-m-00.png`.
- **Change.** The bar appears only after the hero CTA leaves, hides over the CTA band and footer, and never shows on /contact.
- **Implementation.**
  - An IntersectionObserver on `[data-hero-cta]` (the hero's BookButton or each page hero's primary CTA) and on `[data-cta-band], footer`. The bar is visible when the hero CTA is above the viewport and neither the band nor the footer intersects.
  - `data-visible` drives `translateY(100%) → 0` over 280ms `--ease-soft` (exit 180ms `--ease-in`). Instant under reduce.
  - **Server default:** the bar renders without `data-visible`, so it is off-screen, `inert` and `aria-hidden` until the observer runs. No-JS visitors (and `data-motion=static`) get no bar. That is intentional, because the hero CTA and the CTA band remain. Record this in the README.
  - Hide it on `/contact` via `usePathname`.
  - Height 64px. Call becomes a 44px square icon button (`aria-label="Call ReplyLoop"`, keep the sr-only number). The booking button fills the rest. `bg-charcoal/95`, top hairline `brass-line/30`.
  - Keep `scroll-padding-bottom` (§6.3).
- **Acceptance.** At 390×844 on `/`, the first viewport shows one booking button. The bar appears after the hero CTA scrolls out and is absent while the CTA band is on screen. Tap targets ≥ 44px. No CLS (fixed position).

**MobileNav**: §7.7.

**CTABand** (`src/components/ui/CTABand.tsx`)
- **Problem.** The same centred stack flows into the footer on the same charcoal. With "Other services" above it, that makes about 1,600px of undifferentiated charcoal. Evidence: `review-replies-d-02.png`.
- **Change.** A contained "invitation card".
- **Implementation.**
  - The band stays charcoal with `.felt`. Inside it, a `max-w-5xl` card: `bg-ink-2`, radius 28px, 1px `rgb(184 137 74 / .25)` border, padding 64px desktop and 32px mobile.
  - Left column: statement H2 (`display` token, capped at 3.5rem here), support line, BookButton, and phone and email as quiet text links.
  - Right column: a 160px decorative drawing of `LOOP_PATH` as a 1.25–2px brass-line **stroke** (already allowed on charcoal), `aria-hidden`. It is not the filled logo mark: the logo's tone on dark is an owner decision (§13.1). Until the owner decides, the stroke drawing is the default; the only alternative is the filled mark in today's brass fill.
  - Below the card: 96px of charcoal and a full-bleed `--color-hairline-dark` rule before the footer.
  - Add `data-cta-band`. Copy unchanged.
- **Acceptance.** No brass text. Contrast checks pass. Band and footer read as two distinct pieces in a 1440 screenshot.

**Footer** (`src/components/layout/Footer.tsx`)
- **Problem.** The brand column holds only the logo and tagline, leaving a tall empty column. The bottom bar is thin. On mobile the footer is a single 1,100px column of links.
- **Change and implementation.**
  - Under the tagline, add the existing sentence `Based in Salt Lake County, Utah.` (verbatim from `/about`) and a "Book an intro call" text link.
  - Column headings use the `eyebrow` token in mist (14px).
  - Mobile: Services and Company in a 2-column grid, contact block full width, legal row at 0.875rem.
  - Sign-off: an oversized "ReplyLoop" wordmark, about 12vw, tone-on-tone in ink-2 on charcoal, rendered as an **inline SVG with `aria-hidden` and no text node**. The brand name is already real text in the footer, and an SVG avoids contrast-checker false failures.
- **Acceptance.** Footer ≤ 700px tall at 390. No visible text < 14px.

**LoopDivider / Thread** (`LoopDivider.tsx`, `scenes/Thread.tsx`)
- **Problem.**
  - `preserveAspectRatio="none"` distorts the loop into a 94×44px oval "doodle" at 1440 and squeezes it at 390.
  - It runs edge to edge, repeats 3 times on home and HCA, and leaves about 300px of dead air each time.
  - It draws at first paint and then erases. Evidence: `home-d-00.png` y≈985, `anim/s8.js`.
- **Change.** A real mark-geometry knot, container-width, used at most once per page. Elsewhere use an inset rule.
- **Implementation.**
  - Split the drawing into two stretchable line segments (`preserveAspectRatio="none"`, `vector-effect: non-scaling-stroke`, 1px) and an absolutely positioned 56px `<svg>` using `LOOP_PATH` with the default `xMidYMid meet`, centred on the grid.
  - Span the container, not the viewport. Mask both ends: `mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)`.
  - Draw with DrawSVG from the loop outward (`drawSVG: '50% 50%' → '0% 100%'`, `rl.draw`, `scrub: 0.8`). It scrubs at every width, phones included (§7.1). The scoped CSS before-state from §7.9 prevents draw-then-erase.
  - Band height 48px.
  - Keep one divider per page, before the closing sequence. Replace the others with `<InsetRule />` (new): a 1px rule with a centred 6px brass-line dot on dark, or a brass dot on light. The dot is decorative.
- **Acceptance.** The knot is an undistorted double loop at 390, 768, 1440 and 1920. No first-paint flash in an `s8.js`-style dashoffset log. At most one LoopDivider per page.

### 8.2 Home: hero (`src/app/page.tsx` ~l.72–96, `src/components/hero/*`)

- **Problem.**
  - The 3D loop is small (about 370px still, but 272px 3D, 73%) and floats high. Its centre is off by about 10px and it is more saturated (HSL 0.60 vs 0.51). Both layers fade at once, which shows a ghost.
  - The audit observed 3D init as a single 1.5–1.6 s main-thread task triggered by the first wheel scroll (SwiftShader; not verifiable from repo files, so measure it). `hasWebGL()` accepts software renderers. The low-power probe needs 90 frames.
  - The audit sampled brass highlights at rgb(226,173,77), "shiny yellow gold", which ASSET_BRIEF forbids (reproduce the sample).
  - There are 3–4 identical round pause controls on one page. The trust cue is 15px and easy to miss.
  - Evidence: `anim/hero/strip.png`, `anim/s1.js`, `s4.js`, `illustration/hero3d-1440-b.png`.
- **Change.** Bigger, grounded loop; invisible still-to-3D swap; cheap, idle-split init; deep brushed brass; quieter supporting elements.
- **Implementation.**
  - **H1 untouched** (words, server render, no animation). Its size may move to the `h1` token (same endpoints; smaller at 640–1023px, §6.2).
  - Grid: 12-col, text `col-span-7`, art `col-span-5`, `items-center`. Lede `max-w-[34rem]` in the `lede` token.
  - Trust cue: split the existing `trustCue` string at its period into two "facts", `You keep the keys.` and `We ask every customer the same way.` (verbatim). Each gets a 16px brass line icon (key, loop) at 0.9375rem in charcoal, separated by a 1px vertical rule. Stack on mobile.
  - Loop size: LoopStill and the canvas share **one** aspect-ratio box filling the column (max 520px, about 88% of column width). Reduce vertical padding from `py-[14%]` to `py-[8%]`.
  - Contact shadow: **CSS only**. A radial-gradient ellipse `rgb(27 31 35 / .10)` with a 24px blur, in the same box (the hero already uses a blurred div for this; reuse it). **No raster in the home hero**: no shadow `<img>`, AVIF or paper plate. At 390px the loop box is about 358×358px, larger than the H1 text block, so any raster there becomes an LCP candidate, while CSS gradients never are. CLS 0.
  - **Framing match:** camera z 4.3 → about 3.15 at fov 30, or group scale about 1.36. Tune until the t=0 frontal silhouette lies within ±4px of the still at 1440×900, and verify with a pixel diff script.
  - **Material:** colour `#7E561A`, roughness 0.58, anisotropy 0.5, envMapIntensity 0.6, ACESFilmic tone mapping at exposure 0.9 (or keep NeutralToneMapping if it matches better; measure), key light `#FFE1B8` at intensity 1.5. Mean brass saturation must be within 0.03 of the still. TubeGeometry has no bevel. Keep the ivory crossing as its own band tube with radius `LOOP_TUBE_RADIUS * 1.045` (today's value in `LoopScene.tsx`), and tune the multiplier between 1.03 and 1.06, with matching radial segments, until it reads as an inlay, not tape. Report the value chosen.
  - **Swap:** the canvas sits above the still and fades `0 → 1` over 900ms `--ease-soft`. Only on `transitionend` does the still fade out (300ms linear). Then the existing one-time light sweep (2.4 s) is the "comes alive" moment.
  - **Cost:**
    - Arm only on `pointermove`, `pointerdown`, `keydown` or 7 s idle. Not on `wheel` or `touchstart`. Skip if `scrollY > 0.5 × hero height` at decision time.
    - Request the context with `{ failIfMajorPerformanceCaveat: true }` in `hasWebGL()` and the R3F `gl` config, so software renderers get the still.
    - Extend the `?hero=webgl` QA override (`HeroVisual.tsx` l.118) so it bypasses all three gates: `getMotionTier()` lite gating, the caveat check in `hasWebGL()` and in the R3F `gl` config, and the low-power probe. Today it skips only the probe, so SwiftShader (this sandbox and CI) would always get the lite tier and the swap, pixel-diff and saturation checks could not run. The override stays QA-only and is never linked.
    - Split init across idle callbacks: geometry (tube 480×28 → **320×20**), then environment, then `compileAsync`.
    - Replace EXR + runtime PMREM with a light map built once from emissive planes via `PMREMGenerator.fromScene` (warm 6×2 key strip about `#FFE7C2`, thin ivory rim, dark floor card). This drops `/hdri/studio-512.exr` (110,735 B raw; bank it as a Worker offset, §1.2) and `EXRLoader`.
    - Shorten the low-power probe to 45 frames and fade back to the still over 600ms `rl.inOut`.
  - The pause control uses the unified style (§6.8).
- **Acceptance.**
  - Lighthouse `largest-contentful-paint-element` is `h1#hero-title` at 390×844 and at 1440×900, and LCP ≤ 1.2 s mobile lab.
  - No long task > 50 ms during 3D init on a hardware GPU, measured with a PerformanceObserver script. This sandbox has no hardware GPU: run the functional checks here with `?hero=webgl` on SwiftShader, and give the owner the PerformanceObserver snippet to run in desktop Chrome on a real GPU. Report the hardware number as "not measured" until the owner runs it; never report it as passed. Software WebGL (without the override) gets the still.
  - A frame strip of the swap shows no ghost (two silhouettes coincide). Brass top-decile pixels are not yellow (saturation ≤ 0.6).
  - CLS 0.

### 8.3 Home: sections in order

#### 8.3.1 Divider after hero
Replace it with `InsetRule` or remove it (the one LoopDivider moves before the closing sequence, §8.1).

#### 8.3.2 Problem: "The thank you is already there. It just has no answer." (`ProblemScene.tsx`, `ProblemArt.tsx`)
- **Problem.**
  - The reply pops in over about 126px of scroll, *before* its thread draws (reply at 0.55, thread at 0.62).
  - Dust stays on the card at the end.
  - A round-cap dot sits at the thread's end for the whole waiting phase.
  - The cool-light layer is a flat grey stadium pill.
  - Bubbles use grey skeleton bars.
  - At 390 the scene is 350×153px, with a 0.9px thread and sub-pixel dust.
  - Evidence: `anim/s2.js`, `problem/p06crop.png`, `p12crop.png`, `illustration/el390-sheet.png`.
- **Change.** Retimed story whose end state is "kept alive"; letterpress notecards; portrait mobile composition.
- **Implementation.**
  - Heading: `statement` variant.
  - ScrollTrigger `{ start: 'top 80%', end: 'bottom 45%', scrub: 1 }` (about 780px). Phases on normalised time:
    - 0–0.38: dust drift (`none`), warm→cool light (`sine.inOut`).
    - 0.25–0.40: dust-settled fades in.
    - 0.40–0.70: thread draws from the card's tail (DrawSVG `'0%'→'100%'`, `rl.draw`). `tl.set(path,{opacity:0},0).set(path,{opacity:1},0.40)` removes the dot.
    - 0.62–0.86: reply lands at the thread's end (`opacity 0, y 18, scale .97 → 1, 0, 1`, `rl.out`).
    - 0.74–0.96: dust lifts (`y -18, opacity 0, stagger {each: .004, from: 'end'}`), dust-settled → 0, warm light → 0.95 (`power1.out`), cool light → **0**.
    - 0.96–1: hold.
  - Cool light: replace the rect with a radial gradient centred on the card (cx 230, cy 210, r 260, `#3A4048` at .10 → 0), animated by `opacity` only. No filter.
  - Redraw the cards per §9 (notecard, deboss, hairline "writing" with one brass initial stroke). Remove the grain filter (use `.paper`). Strokes are non-scaling (§9.2).
  - **Portrait mobile art** under 640px: second inline SVG, `viewBox 0 0 360 440`. Unanswered card top-left, `LoopThread` descending in an S-curve, reply bottom-right. Dust becomes a single soft haze band (opacity .25), or particles ≥ 1.5 screen px. Switch with `sm:hidden` / `hidden sm:block` (both server-rendered, a few KB; count both in the §1.2 HTML and RSC deltas). Scrub with the same `data-p` hooks inside the same `gsap.matchMedia()`: `start 'top 85%'`, `end 'bottom 40%'`. The portrait thread draws with DrawSVG on phones (§7.1), with its before-state scoped per §7.9. SVG only, no WebGL.
  - The three problem cards below use light `Card` + `.reveal` stagger. The closing line "That is the part we take on." stays. The optional slate→charcoal colour scrub (§4) may go here; it is the only use on the site.
- **Acceptance.**
  - A frame strip shows the thread arriving before or with the reply, never after.
  - No stray dot. End state has no dust and no grey wash.
  - At 390 the art is ≥ 0.55 × viewport height and strokes ≥ 1.25px.
  - Reduced motion shows the finished state.

#### 8.3.3 Brand film (`BrandFilm.tsx`, `video/src/Film.tsx`)
- **Problem.**
  - It sits about 450px below the problem scene and retells the same card → thread → reply story.
  - Its left 60% is an empty, grey-vignetted plate (top-left rgb(203,199,191) against page ivory).
  - The cut to the title card is a 0.9 s muddy crossfade.
  - The closing ring and equaliser plate is not the double loop.
  - Evidence: `anim/misc/film-sheet.png`.
- **Change (two steps).**
  1. Now: move the film out of the Problem section to directly after How it works. Present it in a split layout: frame `col-span-8` with radius 20px, 1px rule border and `--shadow-3`; caption column `col-span-4`. The frame gets `.reveal-art`.
     - **The HTML caption is mandatory** and ships in this step, because the film already bakes "ReplyLoop" and the tagline (`video/src/Film.tsx`) while `BrandFilm.tsx` has only the sr-only "Pause film". The caption carries, verbatim, every word that appears on screen. The film may show only these words: `Keep the thank you alive.`, `ReplyLoop`, `Based in Salt Lake County, Utah.`, and, only if the re-cut shows them, the `steps.ts` titles `Voice interview`, `Dry run` and `Go live, in the open`.
  2. Phase 8 re-cut, in `video/src`:
     - 0–4 s: window-light plate (ASSET_BRIEF #2) with a notecard, right-weighted, open space ≤ 35%, left half fading into exact `#F8F5EF` (no vignette).
     - 4–10 s: a brass `LoopThread` draws and closes into `LOOP_PATH`, carrying three chapters shown as objects (voice interview, dry run, go live, as in `steps.ts`). Chapter names appear on screen only as the `steps.ts` titles verbatim (`Voice interview`, `Dry run`, `Go live, in the open`), and only if the HTML caption mirrors them. Never add approval wording such as "review before posting".
     - 10–16 s: lockup on felt: the brass-line loop as a stroke drawing of `LOOP_PATH` (the filled mark's tone on dark is an owner decision, §13.1), the "ReplyLoop" wordmark and the existing sentence `Based in Salt Lake County, Utah.` (name-collision defence), all mirrored in the HTML caption.
     - Replace the title-card crossfade with a lift (`translateY(100%) → 0`, 0.7 s, ease (0.16,1,0.3,1)); cards dim to 0.6, never below.
     - No ring and bars plate. Keep the 16 s seamless loop, pause control, poster-only reduced motion and Save-Data paused start. Re-render with `cd video && npm run render`. Only pre-rendered video ships.
- **Acceptance.** The film never sits in the same section as ProblemScene. The poster's top-left pixel is `#F8F5EF` ±2. Each video file ≤ 450,000 B, and film plus posters ≤ 859,457 B in total (§1.2). The MP4 alone is already 444,502 B, so a photoreal window-light plate needs a higher compression setting, a shorter plate hold or a smaller frame to fit. The HTML caption matches every on-screen word, and no other words appear in the film.

#### 8.3.4 Bundle: "One bundle, built around your reviews" (charcoal)
- **Problem.** Ivory cards on charcoal look pasted in (`home-d-02.png`). The same 2×2 block repeats on `/services` and `/home-care-agencies`.
- **Change.** `split` heading; dark cards (`Card tone="dark"`, ink-2, brass-line border and top accent); `.felt`; `.reveal` stagger at 70ms. Home keeps the 2×2 grid. Other pages get their own forms (§8.4, §8.6).
- **Acceptance.** No ivory slab on charcoal anywhere on the site. No brass text on dark.

#### 8.3.5 How it works: sticky journey (`HowItWorksJourney.tsx`, `.journey-*` CSS)
- **Problem.**
  - Chapter texts overlap mid-crossfade (exit [i, i+0.25] vs enter [i+0.05, i+0.35], about 145px of overlap).
  - The camera and bead follow raw `self.progress` while the chapters follow scrub 0.7, so they drift apart (jitter on notched wheels).
  - The feathered ivory text backing shows as a rectangle.
  - Chapter type is small (30px H3, 17px body). Progress dashes are tiny and far away.
  - The 8px loop stroke crowds the next section. The stage is 4.6 vh.
  - The bead hides under the vignette backing in every settled chapter. Chapter 1 arrives empty.
  - `VignetteDryRun.tsx` l.84 shadow path is not in the draw set (grey ghost).
  - The bead uses a moving `filter: drop-shadow`, and dots animate `background-color`.
  - Evidence: `anim/journey/j12crop.png`, `j17.png`, `settled.png`, `j14crop.png`, `s3.js`.
- **Change.** Sequenced text, timeline-driven camera, readable stage, visible bead, composed arrival.
- **Implementation.**
  - **Text sequence** (i > 0). Keep each `li` at opacity 1 (accessibility tree) and animate children with `opacity` only, never `autoAlpha` or `visibility`. `autoAlpha` sets `visibility: hidden`, which removes inactive chapters from the accessibility tree and from find-in-page. This crossfade is named exception 2 in §4, and each chapter's text settles at opacity 1 in its stillness window.
    - `tl.to(prev.querySelector('.journey-text'), {opacity: 0, y: -14, duration: .16, ease: 'rl.in'}, i - .16)`
    - `tl.fromTo(item.querySelectorAll('.journey-text > *'), {opacity: 0, y: 18}, {opacity: 1, y: 0, duration: .3, ease: 'rl.out', stagger: .05}, i + .03)`
    - Vignettes may overlap: `tl.to(prevVignette, {opacity: 0, scale: .985, duration: .22, ease: 'rl.inOut'}, i - .1)`.
  - **Camera:** `const cam = {p: 0}; tl.to(cam, {p: 1, ease: 'none', duration: tl.duration(), onUpdate: () => moveCamera(cam.p)}, 0)`. Remove `onUpdate` from the ScrollTrigger. `scrub: 1`. Ease the camera between chapters with per-chapter keyframes (`rl.inOut`) so it rests during each 0.35 stillness window. Position the bead from the same `loopCurve` sampler that already positions the camera. Do not load MotionPathPlugin on `/` (§7.6).
  - **Stage:** height `calc((100vh - var(--header-h)) * 3.6)`. Fade the loop stroke to 0 over the last 10% of the scrub.
  - **Contrast without the halo:** delete the `.journey-text` box-shadow and background. Mask the loop SVG with `mask-image: radial-gradient(closest-side at 72% 50%, transparent 0 60%, #000 75%)`. Verify slate body text stays ≥ 7:1 against what is behind it at every chapter.
  - **Type:** numeral token in brass (5rem); H3 2.5rem/1.1; body `lede` 1.25rem/1.6 slate; `max-w-[30rem]`.
  - **Progress:** beside the text, `01 / 04` in 0.875rem tabular Inter, plus a 120px track (rule colour) with a brass `::after` scaled `scaleX(0 → 1)` by the timeline. Replace the `background-color` dots.
  - **Bead:** `FOCUS_X ≈ +20`, so it rests in the gutter right of the vignette. z-order above the vignette. 2px ivory ring. Pulse once on arrival (`r` via `scale` on a wrapper, 1 → 1.33 → 1 over .12 units, `rl.out`). Glow is a pre-baked radial-gradient circle moved with transform, with no `filter`.
  - **Arrival:** a separate trigger `{trigger: root, start: 'top 75%', end: 'top top', scrub: .8}` builds chapter 1's vignette layers (stagger .07, `rl.out`) before the pin.
  - Add `data-v-draw="true"` to `VignetteDryRun.tsx` l.84, and audit every vignette for shadows outside the draw set.
  - The stacked fallback (phones, short screens, large text, reduced motion) gets the numeral token and `h3-lg` titles.
- **Acceptance.**
  - At no scroll position are two chapters' texts both above opacity 0.1 (scripted opacity table).
  - Each chapter's text is at opacity 1 in its stillness window, and axe reports 0 violations at each of the four settled chapters.
  - Camera and bead settle in the same rAF window as the text after a 600px jump (desync test like `s3.js`).
  - No visible text backing rectangle. The bead is visible in all four settled chapters. Chapter 1 art is present at p=0.
  - CLS 0.

#### 8.3.6 Seven promises: "Seven promises we keep" (`PromiseList.tsx`)
- **Problem.** The 2-column grid of 7 orphans #7. Numerals are body-size. Row dividers do not line up (`home-d-05.png`).
- **Change.** Option B (editorial list) on home: `statement` heading, single column `max-w-4xl`, numerals in the numeral token (3rem, brass, tabular) in a 5rem gutter, title `h3-lg` (1.5rem), body 1.0625rem, 1px rule between rows, `py-8`, `.reveal` per row (50ms, cap 4).
  - Give #7 "Private stays private" emphasis without moving it off the list: a 2px brass left bar and a slightly larger title.
  - On `/home-care-agencies`, use Option A: a 3-column grid of 6, with #7 as a full-width closing row on an ink-2 strip (mist body, ivory title).
  - Copy unchanged.
- **Acceptance.** No orphan cell. Rules align. Copy diff is empty.

#### 8.3.7 Health handling (ivory-2, `HealthHandling.tsx`)
- **Problem.** The example card sits at the top of the right column with about 350px of empty dark space beneath it (`home-d-06.png`).
- **Change.** The band moves from charcoal to **ivory-2**, so each page keeps at most two dark bands plus the footer (§6.1). `split` layout, list in cols 1–6, example card in cols 7–12, `lg:sticky lg:top-[calc(var(--header-h)+2rem)]` so it travels with the list. The example card is `tone="dark"`, the one dark object in the band (no `.felt` on the band). Copy unchanged; the locked sentence `A reply to a review of 3 stars or lower stays unpublished until you have seen it.` stays verbatim.
- **Acceptance.** No empty quarter in a 1440 screenshot. Sticky works without layout shift.

#### 8.3.8 Proof: "We would rather show you a real profile than invent a number."
- **Problem.** In production the ProofSlots render nothing, leaving about 200px of empty ivory that reads as unfinished (`home-d-06/07.png`).
- **Change.** An honest "what you can check" panel in the `default` variant, so home does not run three `split` headings in a row (§6.8). The existing eyebrow, H2 and intro sit left at `max-w-3xl`; below them, centred at `max-w-3xl`, a light raised card holds the rows, each with a 20px brass line icon and 1px rules between. Use **existing standalone sentences verbatim**:
  1. `You can see the work and check the results.` (from `promises.ts` / `faq.ts`)
  2. `You approve each month's posts before they go out.` (from `steps.ts` / `faq.ts`). **Provisional:** the Drive brain says the only approval wording is the low-star sentence, so this row goes to the owner (§13). If the owner declines it, ship two rows.
  3. `You keep the keys.` (from `promises.ts`)

  An optional card title, for example "What you can check", is **new copy: get owner approval**. Keep the ProofSlots in the tree for later real proof. No numbers, logos or quotes. No extra CTA (the CTA band follows).
- **Acceptance.** No empty region. `check:compliance` passes. No string that is not already in `src/content` unless the owner approved it.

#### 8.3.9 Fit: "Is this a fit?"
`split` heading. Two light cards side by side: "is a fit" and "not a fit" (existing `notFit` list). The not-fit card uses the `ivory-2` surface rather than red or alarm colours. Items use `.reveal` stagger.

#### 8.3.10 FAQ teasers: "Common questions"
`compact` heading, `rhythm="tight"`, FAQ micro-interactions (§7.7), max 65ch answers.

#### 8.3.11 Closing
The one LoopDivider, then the CTABand invitation card (§8.1), then the footer.

**Home acceptance overall:**
- Surface sequence: ivory hero → ivory problem (with `.paper`) → charcoal bundle → ivory journey → ivory-2 film → ivory promises → ivory-2 health (dark example card) → ivory proof → ivory-2 fit/FAQ → charcoal CTA → footer. That is two dark bands (bundle, CTA) plus the footer.
- Two same surfaces may touch only where an InsetRule separates them. Adjust if needed and document the final sequence.
- Heading variants follow the §6.8 home order, with no three identical in a row.

### 8.4 `/services` (`src/app/services/page.tsx`)
- **Problem.** The hero has no visual while sibling pages have emblems. The bundle block repeats home verbatim. "One-time projects" uses ivory slabs on charcoal. The 4-up "Who we serve" cards are cramped at 254px, with links wrapping to 2 lines. Evidence: `services-d-00..02.png`.
- **Change.**
  - Hero 7/5 with a double-loop emblem and four small icon chips set around it in a **static** arrangement, one per pillar (decorative, `aria-hidden`). No orbit or ambient motion. If the owner later wants it animated, add it to the §7.10 table with full gating (pause control, reduced motion, Pause toggle, off-screen pause, budget).
  - Bundle as a **spec sheet**: full-width rows on ivory, with the pillar name (`h3-lg`) in cols 1–4, description in cols 5–9, and the detail plus link in cols 10–12. Rows are separated by rules with `.reveal` per row.
  - Move the film into a split block (§8.3.3).
  - One-time projects: `Card tone="dark"` on charcoal.
  - Who we serve: `lg:grid-cols-2 xl:grid-cols-4`, `p-7`, interactive cards, links single-line, or a borderless 4-column ruled list.
- **Acceptance.** No module looks identical to home. No link wraps at 1440. Hero has art at every width (mobile: HeroPlate crop placed per §9.3, primary CTA above the fold).

### 8.5 `/services/*` template (`ServicePageView.tsx`) and `/services/review-replies` TrustLoop
- **Hero.** The 7/5 split stays, and the emblem becomes the bespoke service object (§9.4). Mobile shows the HeroPlate crop, placed per §9.3 so the primary CTA stays above the fold.
- **TrustLoop problem.**
  - Step cards lay out column-first, reading 1, 3, 2, 4.
  - Node 1 is filled while 2–4 are outlined, with a stray charcoal bead next to it.
  - Lines run 5.7–7.8px, the heaviest on the site. The bead moves at linear constant speed.
  - It sits in the left 2/3 of the grid with the right third empty.
  - It animates `r`, `fill` and `stroke`.
  - Evidence: `review-replies-d-01/02.png`, `illustration/sweep_services_review-replies-1440-2-1600.png`, `anim/s6.js`.
- **Change.**
  - Full-width section. Diagram in cols 1–6, and on the right (cols 7–12) a single ordered list 01–04 separated by 1px rules. The active row gets a 2px brass left bar, not a filled card.
  - Strokes: base 1px rule colour, trail 2px brass, rings 1.25px, all `non-scaling-stroke`. All nodes are identical (40px, 1.5px brass ring, ivory fill). The lit state is a second filled layer (brass fill, ivory numeral) crossfaded by opacity.
  - Add small 1.25px direction chevrons at the crossing so 1→4 reads as a loop.
  - Bead: brass 6px with a 1.5px ivory ring and a contact shadow. Remove the charcoal dot. Taper the trail with a second, wider stroke at 30% opacity, 4% shorter.
  - Motion: `gsap.timeline({repeat: -1})` of MotionPathPlugin tweens, travel 2.6 s `rl.inOut` then dwell 1.4 s per station. The station lights on arrival (360ms `rl.soft`) and the list row 400ms. It pauses with the existing run flag and is off screen when paused.
  - Reduce: all stations lit, bead parked at 04.
  - Copy unchanged.
- **Other services** block: render on **ivory**, not charcoal, with interactive light cards, so dark bands never stack.
- **ServiceEmblem comet** (`.loop-comet`): fake a taper with three stacked dashes on the same path (`9 91` at 100%, `14 86` at 35% offset +3, `20 80` at 12% offset +6). Keep it linear and keep the gating. No `filter` on any dash. If a glow is wanted, fake it with a wider (about 3×), low-opacity (about .2) dash on the same path, moving with the lead dash.
- **Acceptance.** Steps read 1–4 left-to-right or top-to-bottom in DOM and visually. No `r`, `fill` or `stroke` tweens in a performance trace. Lighthouse a11y 100.

### 8.6 `/home-care-agencies`
- **Problem.**
  - The photoreal ribbon is the only raster hero language. It is cropped so only an arc shows, has a faint seam at x≈820–830, and is soft on 2x screens.
  - The "Trust" and "Where we work" sections leave the right half empty.
  - The bundle and health blocks repeat home.
  - Evidence: `hca-d-00..03.png`, `zoom-hca-seam.png`.
- **Change.**
  - Hero: feather the ribbon (`mask-image: linear-gradient(90deg, transparent 0, #000 18%), linear-gradient(180deg, transparent 0, #000 10%); mask-composite: intersect`), pull it in so the full loop reads with 8% margin at `object-position: 60% 50%`, Prefer no fade. If one is wanted, make it CSS-only (`@starting-style` or a load-time keyframe), never JS-triggered. The server-rendered, no-JS state shows the ribbon at full opacity.
    - Switch `rl-drift` to `--ease-inout`.
    - Phones get the SVG HeroPlate crop (§9.3, primary CTA above the fold) instead of nothing.
    - When ASSET_BRIEF #5 (2x plate) exists, add the 1472w source (AVIF only, ≤ 40 KB, inside the §1.2 budget).
  - Trust: split layout. Pull the key existing sentence into cols 7–12 as a pull-quote in roman Fraunces 400 at display optical size, 2rem (no italic, §6.2). Use verbatim text from that section only.
  - Bundle: a compact horizontal 4-up icon list (icon + pillar name + one line), linking to `/services`.
  - Health block: sticky-card split (§8.3.7).
  - Where we work: city chips in cols 7–12, or a minimal 1px Salt Lake Valley outline in brass on ivory with no pins and no ratings. Prefer the chips; the outline needs owner OK.
  - How it works (`StepList`): numeral token, ruled 4-up.
  - Promises: Option A (§8.3.6). FAQ: `compact`.
  - Eyebrow: `short` prop on mobile (owner approves the short string).
- **Acceptance.** No seam (pixel samples across x=700–880 within ±1 of ivory). Hero art at every width. No module identical to home. The Lighthouse LCP element is the H1 at 390×844 and at 1440×900, not the ribbon.

### 8.7 `/about`
- **Problem.** The emblem shows two identical mirrored chat icons with no clear meaning. "Why we do this" leaves the right side blank. People cards are ivory slabs on charcoal. Four value cards are cramped. Evidence: `about-d-00/01.png`, `illustration/sub-sheet.png`.
- **Change.**
  - Hero emblem: one object, two notecards joined by a `LoopThread` (§9.4), with a mobile crop.
  - "Why we do this": split, with `The thank you is worth protecting` (its own H2) echoed in cols 7–12 as an `aria-hidden` pull-quote in roman Fraunces 400 at display optical size, 2rem (no italic, §6.2). Or use a sentence from that section's body.
  - People: `Card tone="dark"` with the initials avatars "HN" and "BT" (charcoal circle with ivory serif initials, as `/about` does today, plus a decorative 1px brass-line ring; `aria-hidden`, names in text). **No generated faces.** Bios stay ProofSlots.
  - Values: `lg:grid-cols-2 xl:grid-cols-4 p-7`, or a ruled 4-column list.
- **Acceptance.** No empty right halves at 1440. No people imagery.

### 8.8 `/faq`
Hero 7/5 with a quiet 240px brass loop emblem (ServiceEmblem without the icon, comet gated). `compact` headings, `rhythm="tight"`, FAQ micro-interactions, answers 65ch. Optionally add a sticky left list of question groups at lg if the FAQ has groups; skip it if not.

### 8.9 `/contact`
- Hero 7/5 with the same quiet emblem (or the ASSET_BRIEF #6 notecard still when it exists).
- Booking card: light raised card containing BookButton plus phone and email as text links.
- The mobile bar is hidden on this route.
- No form and no address.

### 8.10 `/blog`
- **Problem.** All 3 cards show the same date prominently. Titles are fully underlined in 26px Fraunces across 3–4 lines. There is no visual anchor (`blog-d-00.png`).
- **Change.**
  - Whole card is the link (interactive light card). No underline on the title at rest. On hover/focus, `underline decoration-brass underline-offset-4` on the title only.
  - A slate meta row at 0.9375rem: date · reading time. Reading time is computed from the MDX word count at 230 wpm, rounded up, as "6 min read". It is computed, never typed.
  - A 120px ivory-2 header strip per card with the loop emblem at a different rotation or crop per post (decorative). Define the emblem once per page as a `<symbol>` and `<use>` it; its bytes count in the §1.2 HTML and RSC deltas.
  - The first post is a 2-column feature card at lg.
- **Acceptance.** No hard-coded reading time. No full-title underline at rest.

### 8.11 `/blog/[slug]` (`Prose.tsx`, `Breadcrumbs.tsx`)
- **Problem.** Blockquote `border-left` bends around a 12px radius. The breadcrumb repeats the 95-character title. The 224px left gutter is unused. There is no outline. Evidence: `post-d-00/01.png`.
- **Change.**
  - Blockquote: no border. `position: relative` card, ivory-2, radius 16px, padding 24px 28px. A `::before` brass bar (absolute, left 0, top 16px, bottom 16px, width 2px, radius 2px). Text in Fraunces 1.25rem/1.5.
  - Breadcrumb: on phones show only `← Blog`. On desktop, ellipsize the last crumb at 40ch (`aria-current` keeps the full title via a `title` attribute or sr-only text).
  - At lg and up, a sticky "On this page" list of H2s in the left gutter (`top: calc(var(--header-h) + 2.5rem)`, 0.875rem slate, active item brass via IntersectionObserver, `aria-current="true"`).
  - Body uses the `prose` token (1.125rem/1.75), max 66ch.
  - "Related guides": `compact` heading plus interactive cards.
- **Acceptance.** The brass bar is straight. The TOC follows scroll with no CLS. `check:compliance` passes on the label "On this page".

### 8.12 OG images (`src/lib/og.tsx`, route `opengraph-image.tsx`)
- **Problem.** All OG cards are text-only on flat charcoal with the right 45% empty (`illustration/og-sheet.png`).
- **Change.** Add a brass-line `#B8894A` stroke drawing of `LOOP_PATH` (decorative) cropped off the right edge, as on the film end card. Each `/services/*` route renders its emblem object as flat vector. Keep the "ReplyLoop" wordmark as live text. Until the owner decides the logo's tone on dark (§13.1), use the stroke drawing, not the filled mark recoloured (or keep the mark in today's brass fill). Optionally add the existing sentence `Based in Salt Lake County, Utah.` as live text. Cards stay **flat vector with no texture**: no felt and no noise, because texture defeats PNG compression. Text stays live in `ImageResponse`. Load Fraunces from a local file, never fetched at build (satori fails on HTML error pages). Keep `generateStaticParams` for the static export.
- **Acceptance.** No stars, numbers or baked text. Images render in `npm run build:static`. Each OG PNG ≤ 70 KB and all OG images ≤ 450 KB in total, measured in `out/` after `build:static`.

### 8.13 Mobile details (390px)
- Mobile H2 at 2rem / 1.12 (token).
- Every hero except `/` has art (HeroPlate crop, §9.3). `/` already has HeroVisual below the text. No plate may push the primary CTA below the 844px fold.
- Problem scene uses the portrait composition.
- Footer is 2 columns.
- Breadcrumb shows only the parent.
- Eyebrow wrap is fixed.
- No text < 14px.
- Tap targets ≥ 44px.

### 8.14 Other routes: `/privacy`, `/terms`, 404 (`not-found.tsx`), `/styleguide`
- They inherit the token, type and rhythm changes and the `Section` `reveal=false` default. They are exempt from the 7/5 hero-art rule (§6.4) and get no new art, scenes or HeroPlate.
- `/privacy` and `/terms` stay drafts with `noindex`. Use the `compact` heading and the `prose` token. Copy unchanged.
- 404: stays text-led. The CTA band invitation card (§8.1) may close it. No new strings.
- `/styleguide`: update its `<LoopDivider animate />` usage to the rebuilt API (§8.1) and add swatches for the new tokens and heading variants, so it stays a working reference. Keep whatever `scripts/static-finish.mjs` does with it today.
- **Acceptance.** Each renders without errors at 390 and 1440, axe reports 0 violations, and no text is under 14px.

---

## 9. Illustration system: "Paper and Brass, set like letterpress"

Three languages coexist today:
- Flat, grained kit rasters (the best look).
- Skeuomorphic code SVGs with 3–4 stop gradients, sheens and 3-layer shadows.
- Hairline UI diagrams.

Line weights run 0.9–7.8px. The loop is redrawn freehand about 8 ways. Grey skeleton bars appear about 8 times on home. Unify everything under one system.

### 9.1 Rules

Codify these in `src/lib/illustration/tokens.ts` and a README section.

| # | Rule |
|---|---|
| 1 | **Every loop is `LOOP_PATH`.** Threads are lead-in curves that pass through one undistorted instance of it. No freehand curls, ovals, rings or waves. |
| 2 | **Flat fills only:** ivory, paper-shade, rule, slate, charcoal and brass, plus brass-shadow and brass-light **on brass objects only**. No gradient fills inside paper shapes. |
| 3 | **Three stroke sizes in screen px** with `vector-effect="non-scaling-stroke"`: `--stroke-hair 1.25px` (paper edges, writing lines, rings), `--stroke-thread 2px` (every brass thread and trail), `--stroke-rule 1px` (backdrop loops, base loops in rule colour). Exceptions: the filled mark in LoopStill and Logo keep `LOOP_STROKE`. The same px values apply on mobile. |
| 4 | **Two shadows**, light at 315°. Contact: dx .5, dy 1, blur 1.5, `#1B1F23` at .12. Ambient: dx 6, dy 12, blur 18, `#1B1F23` at .12. Use one shared `<defs>` sprite, or pre-baked blurred-ellipse paths. No filter per object. |
| 5 | **Radii in screen px:** cards 16px, notecards and paper 8px, proof sheets 2px. Express them via the per-breakpoint SVGs. |
| 6 | **Three depth layers per scene:** plate (texture or light) → object (one hero object) → brass thread. |
| 7 | **Detail budget:** ≤ 12 shapes per object, ≤ 1 highlight. No dark outlines (no `#2A2F34` contours). |
| 8 | **No chat-bubble wireframes and no grey bars.** "Writing" is 3 slate hairlines at 1.25px, opacity .28 charcoal-equivalent, lengths 92/78/54%, plus one short brass first stroke as the "initial". No glyphs, no stars, no review text. |
| 9 | **Every template gets a portrait mobile composition**, or a deliberate crop for heroes. |
| 10 | **Reveal order** is plate → object → thread, so no frame shows an incomplete idea. |
| 11 | All art is `aria-hidden`. Meaning lives in HTML. Any on-art words are repeated in real text. A scene that shows sample reply content carries a visible note such as "Illustration. Sample text only." (owner confirms wording). |
| 12 | Reference style: the ribbon in `assets/social-kit/backgrounds/06-og-link-preview.png` (charcoal band with brass underside, paper grain, bold off-canvas crop). This is **not** the banned `06-trust-loop-infographic` template or its 4x5 (§1.1.3). |

### 9.2 `<LoopThread>` helper

Create `src/components/scenes/LoopThread.tsx`.

- Props: `from`, `to`, `loopAt`, `loopScale`, `rotation?`, `drawFrom?: 'crossing' | 'start'`.
- It emits a lead-in cubic, then `LOOP_PATH` via `<use href>` with a **uniform** scale, then a lead-out cubic. All three use `--stroke-thread` and `non-scaling-stroke`.
- Scroll draws start from the loop's crossing outward, so a half-drawn state reads as a forming loop, not a smile or an arc.
- Use it in ProblemArt, every vignette, the film, OG and the about emblem.

### 9.3 Per-illustration redraw list

| Illustration | File | Today | Redraw / upgrade |
|---|---|---|---|
| Hero loop still | `LoopStill.tsx` | Good geometry; sits small | Same box as 3D (§8.2); CSS radial-gradient contact shadow; no raster plate behind it (LCP, §8.2) |
| Hero 3D | `LoopScene.tsx` | Too yellow; tape-like crossing | Material and crossing per §8.2; ASSET_BRIEF #4 map when it exists |
| Problem cards | `ProblemArt.tsx` | 6-layer skeuo stack, grey bars, feTurbulence | Letterpress notecards: 8px radius, 1.25px rule edge, blind-debossed `LOOP_PATH` in the corner (paper-shade offset 0.5px), hairline writing with brass initial; flat; shared shadows; `.paper`; portrait mobile SVG |
| Vignette 01 Intro call | `VignetteIntroCall.tsx` | Bubbles + bars; half-drawn loop reads as a smile | Two notecards joined by one `LoopThread` drawn from the crossing |
| Vignette 02 Voice interview | `VignetteVoiceInterview.tsx` | About 20-shape pen; dark notebook cover contour | Notebook with rule hairline and shared shadows, no dark edge; pen reduced to 6 shapes (charcoal barrel, one brass band, brass nib, one highlight) |
| Vignette 03 Dry run | `VignetteDryRun.tsx` | 11 bars; snail curl; shadow ghost | Fanned proof sheets (2px radius) held by a flat brass clip, hairline writing; `LoopThread` replaces the curl; shadow in draw set |
| Vignette 04 Go live | `VignetteGoLive.tsx` | Window panes nearly invisible (.05–.34) | ASSET_BRIEF #2 window-light plate as the plate layer (AVIF only, ≤ 40 KB at 960w, lazy); SVG notecard, flat brass key (same brass as the pen band) and `LoopThread` on top |
| Thread divider | `Thread.tsx` | Distorted oval knot | §8.1 split construction |
| TrustLoop | `TrustLoop.tsx` | 5.7–7.8px lines; zigzag order | §8.5 |
| Service emblems | `ServiceEmblem.tsx` | Generic "UI icon in a circle" | Bespoke 64px object on the loop's right lobe: **Review replies** notecard with debossed loop; **Social content** three fanned proof cards; **Local SEO** folded paper map with a brass pin; **Websites** open ivory door with a brass threshold; **Owner Q&A videos** brass-trimmed notecard on a small easel (no devices, no people); **About** two notecards joined by a `LoopThread`; FAQ and contact use the loop only. Medallion shadow = `--shadow-object` |
| Icons | `Icon.tsx` | "social" is effectively a third-party glyph; stroke drifts with size | Redraw "social" as stacked cards; `strokeWidth 1.5` + `non-scaling-stroke` so all icons are 1.5px at every size; no star glyphs |
| Ribbon backdrop | `RibbonBackdrop.tsx` | Best raster; seam; desktop only | §8.6; phones get the SVG hero-plate crop |
| Hero plates (new) | `src/components/scenes/HeroPlate.tsx` | — | SVG redraw of the ribbon language in `assets/social-kit/backgrounds/06-og-link-preview.png` (not the `06-trust-loop-infographic` template): `LOOP_PATH` as a charcoal band with brass underside, cropped off the right edge, shared grain; per-route crop and rotation; 3–6 KB each; static; `aria-hidden`. **Not on `/`.** On phones, place it below the primary CTA, or at most 120px tall above the eyebrow only where Playwright confirms the primary CTA's bottom edge stays ≤ 780px at 390×844. Keep it inline (an inline `<svg>` is not an LCP candidate; an `<img>` would be). Its bytes ship in each page's HTML and RSC `.txt` files and count in the §1.2 budget |
| Film plates | `video/src` | 07 ring and bars plate; grey wash | §8.3.3 re-cut |
| Logo on dark | `Logo.tsx`, `og.tsx`, `icon.svg` | Brass fill on charcoal (dull, 2.95:1) | **Owner decision:** `on-dark:text-brass-line` on the loop path; `#B8894A` in og and icon on dark. Geometry unchanged |

### 9.4 ASSET_BRIEF integration

Generate stills in this priority order. Derive each through `scripts/brand/derive.mjs` (crop, colour-match to ivory or charcoal, phone crops, `sizes`). Ship decorative stills as **AVIF only**, with no WebP twin, within the §1.2 caps (still ≤ 40 KB, tile ≤ 6 KB gzip), and add each to the Phase 0 byte budget table with the offset that pays for it. Moving large media off the Worker (R2 or Pages) is an owner decision (§13). Lazy-load anything below the fold. Never put text in rasters. Update `ASSET_BRIEF.md` open items and `PLACEHOLDERS.md` as each one lands.

| # | Still | Placement |
|---|---|---|
| 1 | Ivory paper (2048, seamless) | Global `.paper` tile (256px derivative, about 6 KB) |
| 2 | Golden-hour window light (2400×1350) | Vignette 04 plate; film opening |
| 3 | Charcoal felt (1024, seamless) | `.felt` on charcoal bands, film frame, CTA card (not OG: OG cards stay flat vector, §8.12) |
| 4 | Brushed brass swatch | 3D loop material map |
| 5 | The `assets/social-kit/backgrounds/06-og-link-preview.png` ribbon at 2x (3468×1814); not the `06-trust-loop-infographic` template | `/home-care-agencies` hero 1472w source |
| 6 (new) | **Letterpress notecard**: "an ivory cotton letterpress notecard with a blind-debossed double loop, on ivory paper in soft upper-left window light" | Mobile problem scene option, `/contact` hero (not OG, §8.12) |
| 7 (new) | **Brushed-brass loop object**: "a brushed deep-brass double-loop object resting on ivory paper, soft upper-left light" | `/about` hero. Not the home hero: no raster goes in the home hero (§8.2) |

Write prompts 6 and 7 in the exact brief format used by items 1–4: use case, asset type, primary request, scene, subject, style, composition, lighting, palette, constraints, avoid. Include the standard exclusions: no text, letters, numbers, logos, watermark, people, faces, hands, devices, screens, reviews, stars or ratings; never shiny yellow gold. The double loop must match the option-B geometry. Note that a generated loop is reference only and the code `LOOP_PATH` stays canonical. **Do not generate images yourself unless the owner provides a generation path. Add the prompts and leave the stand-ins in place.**

---

## 10. Phased execution plan (one commit each)

| Phase | Scope | Commit message (suggested) |
|---|---|---|
| 0 | Plan to owner: scene list with ASCII storyboards (hero swap, problem retime, journey, TrustLoop, film re-cut), kit files embedded vs reference, library list with per-page KB estimate, Worker byte budget table (§1.2), new dependency list (expected: none), §13 questions. **Wait for OK.** | — (no code) |
| 1 | **Tokens and type:** `@theme` colours (§6.1), type scale (§6.2), spacing, radii, shadows, easing and duration tokens; `body` line height; Eyebrow fix; `SectionHeading` variants; `Section` `rhythm`; contrast pairs added to `scripts/contrast.mjs`; SOFT axis measured (ship or drop). | `design: token system, fluid type scale, heading variants` |
| 2 | **Surfaces and chrome:** Card tones and interactive lift, PillarCard accent, Header (solid, centred, scrolled), MobileBar (IO-driven, hidden on /contact), MobileNav motion, CTABand invitation card, Footer, InsetRule, `.paper` and `.felt` stand-in tiles, pause-control unification, surface alternation fixes. | `design: raised surfaces, header, mobile bar, CTA card, footer` |
| 3 | **Motion foundation:** CustomEase tokens and defaults, lazy plugin loaders, `gsap.matchMedia` gate + `data-motion` refresh, `.reveal` / `.reveal-art` rewrite with the fixed `@supports`, CSS before-states, `rl-gsap-failed` fallback, reduced-motion block, micro-interactions (nav, FAQ, buttons), `<ViewTransition>` route transitions. | `motion: easing tokens, per-block reveals, micro-interactions, route transitions` |
| 4 | **Home scenes:** journey (sequence, camera, stage, bead, arrival, progress), problem retime + portrait mobile, divider rebuild, proof panel, promises list, health sticky split, film relocation, fit and FAQ layouts. | `home: journey and problem choreography, proof panel, promises, layout` |
| 5 | **Hero 3D:** framing and colour match, ordered swap, intent arming, `failIfMajorPerformanceCaveat`, idle-split init, tube 320×20, runtime light map from emissive planes (drops the EXR), CSS contact shadow, extended `?hero=webgl` override, probe 45 frames, unified pause control, 7/5 grid, trust facts. | `hero: invisible still-to-3D swap, cheaper init, brushed brass` |
| 6 | **Illustration system:** tokens file, `LoopThread`, non-scaling strokes, shared shadow sprite, ProblemArt and four vignettes redrawn, emblem objects, Icon fixes, HeroPlate + mobile crops, TrustLoop redraw + travel-and-dwell, comet taper. Optional SplitText statement H2s **only if the owner opted in**. | `illustration: paper-and-brass system, redrawn scenes and emblems` |
| 7 | **Subpages:** `/services` (spec sheet, hero emblem, 4-up fix), service template, `/home-care-agencies` (ribbon feather, splits, Option A promises, compact bundle), `/about`, `/faq`, `/contact`, `/blog` index, post template (blockquote, breadcrumb, TOC, reading time), OG art. | `pages: composed layouts for services, HCA, about, FAQ, contact, blog, OG` |
| 8 | **Film re-cut** (`video/src`) and re-render, poster regenerated, `BrandFilm` split presentation. Logo-on-dark tone **only if approved**. | `film: re-cut opening and close in the new language` |
| 9 | **Assets** (whenever stills exist): derive, wire, remove stand-ins, update `ASSET_BRIEF.md` / `PLACEHOLDERS.md`, add prompts 6–7. README "Cinematic layer", tokens and QA tables updated with new numbers. | `assets: install brief stills, docs and QA tables` |

**Deploy** is separate: only after the owner approves the final report, run `npm run deploy:worker`, then smoke-test the live URL.

---

## 11. Verification gates (after every phase)

Run all of these, fix failures before committing, and paste the results into the phase report.

1. `npm run check`: typecheck, lint, contrast (including the new pairs).
2. `npm run build:verify`: production build plus compliance scan. **Must pass with 0 findings.**
3. A production server may already hold port 3000. Check first (for example `ss -ltnp | grep :3000`) and never stop it. Run `PORT=<free port> npm start`, then `QA_BASE=http://localhost:<port> npm run qa` in a second shell: 17 pages, axe. Pass the same `QA_BASE` to `npm run perf` and `npm run lighthouse`.
4. `npm run perf` and `npm run lighthouse` (mobile) on `/`, `/services`, `/services/review-replies`, `/home-care-agencies`, `/about`, `/blog/respond-to-google-reviews-without-sharing-private-details`. Report the median of 3 warm runs. Also run desktop Lighthouse on `/`, `/services/review-replies` and `/home-care-agencies`. `npm run lighthouse` hardcodes `--form-factor=mobile`, and Lighthouse rejects `--preset=desktop` alongside it, so call it directly: `CHROME_PATH=/opt/pw-browsers/chromium npx lighthouse <url> --preset=desktop --chrome-flags="--headless=new --no-sandbox" --view=false` (use the same `CHROME_PATH` as the npm script). Compare against §1.2 and report before/after.
   - **LCP element check:** from each Lighthouse JSON, read `audits['largest-contentful-paint-element']`. On `/` it must be `h1#hero-title`. On `/home-care-agencies` and every page that gained a raster, it must be the page H1. Check mobile 390×844 and desktop 1440×900. Also run the client-navigation check into `/` (§7.8).
5. **Screenshots**, desktop 1440×900 at DPR 1 and mobile 390×844 at DPR 2 (`isMobile`), for every page touched.
   - Full-page captures are not enough: scroll-linked scenes need scrolling. Step through each page at 0.9 viewport and capture each stop, as the audit did.
   - Also capture frame strips for the hero swap, problem scene (every 75px), journey (every 0.05 progress) and TrustLoop (every 0.5 s).
   - Save them under a scratch folder, not the repo.
6. **Reduced-motion pass:** Playwright `reducedMotion: 'reduce'` plus a run with the header "Pause motion" pressed. Every scene shows its finished state. No ambient motion runs after pause. Pause controls stay visible while paused. View transitions are off. Nothing is blank.
   - **No-JS pass:** a Playwright context with `javaScriptEnabled: false`, at 390×844 and 1440×900, on every page. Every heading and paragraph is visible at full contrast. Every scene shows its finished state. The HCA ribbon is at full opacity. The MobileBar is absent (§8.1). The mobile menu is usable, or its no-JS behaviour is documented in the report (§7.7).
7. **Scripted checks:**
   - Journey chapter opacity table (no overlap).
   - Camera/text desync test.
   - Long-task observer during hero init.
   - Header pixel over charcoal.
   - Nav centre offset.
   - First-paint dashoffset log.
   - Full-page no-scroll screenshot shows all text (§7.5), including the double-failure run (GSAP blocked, scroll timelines off).
   - GSAP fallback under throttling and with GSAP blocked: no re-hide or jump after `rl-gsap-failed` (§7.9).
   - Client navigation into `/`: H1 opacity stays 1 (§7.8).
8. `npm run build:static`, then the **Worker size gate**: `tar czf - -C out . | wc -c` must be ≤ 2,900,000 B. Report it before and after the phase, with the HTML and RSC `.txt` deltas, the OG total and per-file sizes, and the film files (§1.2). Then serve `out/` locally with `npx wrangler dev` using `worker/wrangler.toml` after `node scripts/build-worker.mjs` (or `npm run build:worker` without deploying). Check `/`, a service page, `/home-care-agencies` and a blog post: clean URLs, 404, video byte ranges, OG images, and whether `<Link>` navigations are client-side (RSC `.txt` fetches in the network log) or full loads. Route transitions must behave per §7.8 either way.
9. In the served CSS, verify the scroll-timeline longhands survived minification.
10. Commit. Then report: changed files, new strings (for compliance and owner review), numbers table, screenshot paths, open questions.
11. **Redeploy** with `npm run deploy:worker` **only after the owner approves.**

Phase-specific must-pass items are the acceptance criteria in §8.

---

## 12. Do not

These patterns read as cheap, templated or untrustworthy.

- Generic fade-up on every block, whole-section fades, or fading text, except the four named exceptions in §4 (FAQ answer, sticky journey crossfade, route transition, mobile menu).
- Parallax overload: layers drifting at different speeds, scroll-jacking, smooth-scroll libraries, pinned sections longer than 3.6 viewports.
- Autoplaying loud motion, motion that loops > 5 s without a pause, or motion that runs off screen or while paused.
- Bounce, elastic, overshoot springs, wobble, confetti, particle fields, cursor followers, magnetic buttons, tilt-on-hover cards.
- Glassmorphism, translucent headers over dark bands, heavy backdrop blurs.
- Gradients for their own sake: mesh gradients, neon, colour washes, gradient text, animated shader backdrops.
- New accent colours, or brass text on charcoal or ink-2, or brass-line used as text anywhere.
- Stock photography, generated people, faces, hands, founders, caregivers, clinics, devices, screens, dashboards, chat UI or app mockups.
- Fake social proof: counters, percentages, "trusted by" rows, logo walls, quotes, ratings, stars, badges, review widgets, invented results.
- Grey skeleton bars, chat-bubble wireframes, robots, chips, sparkles, glowing orbs, circuit lines.
- Freehand loop variants, distorted loops (`preserveAspectRatio="none"` on the mark), or mixed loop concepts (linked rings, speech loops).
- Line weights that scale with the viewBox. Dark contour outlines. Multiple shadow recipes.
- Text baked into images, canvas or video without the same words in HTML.
- Animating the H1 or anything that delays LCP. Raster images in the home hero. `@view-transition { navigation: auto; }`. Hiding content until JS runs.
- Animating `box-shadow`, `filter`, `background-color`, SVG `r` or `fill`, or layout properties per frame. Filters on animating strokes. Blend-mode texture overlays above content. Static `will-change`.
- Secondary CTA buttons, pop-ups, modals, forms, sticky banners, exit intent, urgency copy.
- Repeating the same module verbatim across pages. Repeating the same heading layout three times in a row.
- Loading heavy libraries "just in case" (Rive, Lottie, Lenis, postprocessing, Flip, ScrollSmoother).
- Deploying, or changing logo geometry, locked copy or positioning, without the owner.

---

## 13. Decisions for the owner (raise in Phase 0)

1. **Logo on dark:** change the loop fill on charcoal (footer, OG, favicon on dark) from brass `#8A5F1C` to brass-line `#B8894A`? Tone only, geometry unchanged. Until you decide, charcoal surfaces (CTA card, OG, film lockup) use a decorative brass-line stroke drawing of `LOOP_PATH`, never the filled mark recoloured. Separate note: at 22px the charcoal crossing on ivory reads as a black slash, and a knockout gap would help. That is a logo change and only happens if the owner asks.
2. **Film re-cut** (Phase 8): approve the new storyboard, and the move of the film to after How it works.
3. **New strings** (all must pass compliance, and each is listed in the phase report that adds it):
   - the proof card title;
   - the film caption and all on-screen film text (only existing strings: the tagline, "ReplyLoop", "Based in Salt Lake County, Utah.", and the `steps.ts` titles if the film shows them);
   - the mobile short eyebrow for `/home-care-agencies`;
   - the illustration note "Illustration. Sample text only.";
   - "On this page";
   - the MobileBar aria-label "Call ReplyLoop";
   - the journey progress label pattern "01 / 04";
   - the computed "N min read" pattern;
   - the mobile breadcrumb "← Blog";
   - the placement of the extra "Book an intro call" text link in the footer.
4. **SplitText line-rise** on up to 3 statement H2s: yes or no.
5. **Slate→charcoal colour scrub** on "That is the part we take on.": yes or no.
6. **Salt Lake Valley outline** on `/home-care-agencies`, or city chips only.
7. **Footer oversized wordmark** sign-off: yes or no.
8. **ASSET_BRIEF stills 1–7:** who generates them, and when. Stand-ins stay until then.
9. **Proof panel row 2**, `You approve each month's posts before they go out.`: it exists in repo content, but the Drive brain says the only approval wording is the low-star sentence. Keep the row, or ship two rows?
10. **Worker size:** if the plan cannot fit under 2.9 MB gzip even with offsets, may large media (film, stills) move off the Worker to R2 or Pages?
11. Open records the owner may want to settle, which this pass does not decide: which build is canonical (Astro vs this Next.js repo), and the "thank you" hyphen in Drive. The site uses no hyphen.

---

## 14. Sources appendix

**Audit evidence (this repo, production build at localhost:3000, 2026-11-26).** Visual: `…/scratchpad/premium/visual-audit/` (sheets, frames, `measure.js`, `m2.js`, `nav.js`). Motion: `…/premium/anim/` (`s1.js`–`s8.js`, hero, problem, journey, misc, mobile). Illustration: `…/premium/illustration/`. GitHub research scratch: `…/premium/github-motion/`.

**Owner's Drive brain** (read-only; clean copies in `…/premium/drive-brain/`):
- Agent Inbox DECISION 2026-11-13 (brand lock)
- Faith Compass and Brand Voice.md
- Red Lines.md
- Mission.md
- claim-register.md
- Decision Log D-024, D-027, D-028, D-030–D-034
- replyloop-homepage-seo-conversion-spec-v2.md
- ReplyLoop Grok instructions (2026-11-23 public bans)
- replyloop-site-motion-graphics-prompt-v1-2026-11-26.md
- replyloop-design-system-v1-2026-11-20.md
- replyloop-site-rebuild-prompt-v1-2026-11-21.md
- replyloop-website-plan-v1.md
- replyloop-seo-competitor-ranking-and-strategy-2026-11-20.md
- social kit README, identity-prompts.json, release-map.md, qa-report.md
- replyloop-chatgpt-branded-image-prompt-v1.md
- hunter.md
- ReplyLoop Master Ad notes (content explicitly *not* to carry over)

**Repo docs:** `README.md`, `ASSET_BRIEF.md`, `PLACEHOLDERS.md`, `assets/social-kit/SOURCES.md`, `AGENTS.md`, `node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`, `node_modules/next/dist/docs/01-app/03-api-reference/02-components/link.md` (`transitionTypes`), `video/src/theme.ts`.

**Design principles and platform docs:**
- Material 3 easing and duration tokens: https://m3.material.io/styles/motion/easing-and-duration/tokens-specs
- Material 3 applying easing and duration: https://m3.material.io/styles/motion/easing-and-duration/applying-easing-and-duration
- material-web motion tokens: github.com/material-components/material-web `tokens/versions/v0_192/_md-sys-motion.scss`
- web.dev high-performance animations: https://web.dev/articles/animations-guide
- web.dev prefers-reduced-motion: https://web.dev/articles/prefers-reduced-motion
- web.dev optimize CLS: https://web.dev/articles/optimize-cls
- web.dev optimize LCP: https://web.dev/articles/optimize-lcp
- Chrome scroll-driven animations: https://developer.chrome.com/docs/css-ui/scroll-driven-animations
- Bramus, feature-detecting scroll-driven animations: https://www.bram.us/2024/09/24/feature-detecting-scroll-driven-animations-you-want-to-check-for-animation-range-too/
- https://scroll-driven-animations.style/
- Chrome cross-document view transitions: https://developer.chrome.com/docs/web-platform/view-transitions/cross-document
- Chrome animate to height auto: https://developer.chrome.com/docs/css-ui/animate-to-height-auto
- MDN interpolate-size: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/interpolate-size
- NN/g animation duration: https://www.nngroup.com/articles/animation-duration/
- NN/g scroll-triggered animations: https://www.nngroup.com/articles/scroll-animations/
- Apple HIG Motion: https://developer.apple.com/design/human-interface-guidelines/motion
- WCAG 2.2 Understanding 2.2.2 Pause, Stop, Hide: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
- Laws of UX, Aesthetic-Usability Effect: https://lawsofux.com/aesthetic-usability-effect/
- Laws of UX, Doherty Threshold: https://lawsofux.com/doherty-threshold/

**Typography and depth:**
- Google Fonts optical size axis: https://fonts.google.com/knowledge/glossary/optical_size_axis
- Fraunces README (opsz 9–144, SOFT 0–100, WONK): https://github.com/undercasetype/Fraunces
- Butterick, line length: https://practicaltypography.com/line-length.html
- Utopia fluid type scales: https://utopia.fyi/blog/designing-with-fluid-type-scales/
- Josh Comeau, Designing Beautiful Shadows: https://www.joshwcomeau.com/css/designing-shadows/
- Refactoring UI, Wathan and Schoger, via the summary at https://saglitz.com/design/refactoring-ui (the original Medium article failed to load)

**GSAP, R3F and GitHub:**
- gsap.matchMedia: https://gsap.com/docs/v3/GSAP/gsap.matchMedia()
- SplitText and masks: https://gsap.com/docs/v3/Plugins/SplitText/ , https://gsap.com/docs/v3/Plugins/SplitText/masks
- GSAP accessibility: https://gsap.com/resources/a11y ; greensock/gsap#642 (SplitText aria-label screen-reader failures)
- DrawSVGPlugin: https://gsap.com/docs/v3/Plugins/DrawSVGPlugin
- MotionPathPlugin: https://gsap.com/docs/v3/Plugins/MotionPathPlugin
- Flip (not used): https://gsap.com/docs/v3/Plugins/Flip/
- Local `node_modules/gsap/dist` gzip sizes: SplitText 3.7 KB, DrawSVG 2.2 KB, CustomEase 3.7 KB, MotionPath 9.7 KB, Flip 9.7 KB, core 28.4 KB, ScrollTrigger 18.0 KB
- vercel/next.js#96098 (view-transition flag removed); vercel/next-view-transition-example
- Researched, not used (§7.11): drei AccumulativeShadows: https://drei.docs.pmnd.rs/staging/accumulative-shadows
- drei RandomizedLight: https://drei.docs.pmnd.rs/staging/randomized-light
- drei Environment: https://drei.docs.pmnd.rs/staging/environment
- drei Lightformer: http://drei.docs.pmnd.rs/staging/lightformer
- pmndrs/drei `src/core/AccumulativeShadows.tsx`
- Rejected: MeshTransmissionMaterial (https://drei.docs.pmnd.rs/shaders/mesh-transmission-material), pmndrs/react-postprocessing (N8AO and passes docs), ruucm/shadergradient, paper-design/shaders (and #99), darkroomengineering/lenis (and #534)
- jakearchibald/linear-easing-generator; https://motion.dev/docs/spring
- Codrops feTurbulence texture: https://tympanus.net/codrops/2019/02/19/svg-filter-effects-creating-texture-with-feturbulence/
- Rive vs Lottie cost references (not used): https://rive.app/blog/rive-as-a-lottie-alternative , lottiefiles/dotlottie-web README
- theatre.js (dev-only at most): https://www.theatrejs.com/docs/latest/getting-started/with-html-svg
- Satori OG fonts: vercel/satori#511; vercel/next.js `test/e2e/app-dir/metadata-font/app/font/opengraph-image.tsx`
- Rejected scroll-typography references: AntoineW/Codrops-GSAP-Scroll, mrenglerdavid/codropsScrollBlurTypography
- https://modern-css.com/animating-details-without-javascript-height/

*Contrast ratios in §6.1 were computed with the WCAG 2.2 relative-luminance formula for this prompt. Add them to `scripts/contrast.mjs` so the build enforces them.*
