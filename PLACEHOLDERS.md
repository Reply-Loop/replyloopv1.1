# Placeholders

Every spot where real proof, people, or assets belong. Nothing here may be filled with invented content: no fake quotes, no estimated ratings, no generated headshots, no stock photos.

## How proof slots behave

`ProofSlot` (`src/components/ui/ProofSlot.tsx`) renders:

- **In development:** a dashed box that reads "Placeholder: add a real testimonial, result, or photo here."
- **In production:** nothing, unless `NEXT_PUBLIC_SHOW_PROOF_PLACEHOLDERS=true` (use that only on a preview deploy).
- **With real content:** whatever you pass as children, for example `<ProofSlot ...><Testimonial ... /></ProofSlot>`.

Before anything goes in a slot, confirm written permission from the client, and follow the red lines: no client named without consent, and nothing that confirms someone is a patient or mentions care.

## Slots

| Slot | Kind | Page and file | Where the real asset goes |
|---|---|---|---|
| Client testimonial | `testimonial` | Home, proof section, `src/app/page.tsx` | `src/content/proof.ts` (new file) |
| Client logos | `client-logos` | Home, proof section, `src/app/page.tsx` | `public/proof/logos/` |
| Before and after profile screenshots | `profile-before-after` | Home proof section; `/services/local-seo` (`src/content/servicePages.ts`) | `public/proof/` |
| Owner Q&A video sample | `owner-qa-video` | `/services/owner-qa-videos` (`src/content/servicePages.ts`) | `public/proof/owner-qa/` |
| Hunter K. Newbold bio | `hunter-bio` | `/about`, `src/app/about/page.tsx` | `src/content/founders.ts` (new file) |
| Brigham Tiffany bio | `brigham-bio` | `/about`, `src/app/about/page.tsx` | `src/content/founders.ts` (new file) |
| Founder photos | in the bio slots above | `/about` | `public/people/` (use `next/image`, AVIF or WebP) |

## Other placeholders

| Item | Where | Notes |
|---|---|---|
| Logo | `src/components/ui/Logo.tsx`, `src/app/icon.svg`, `src/lib/og.tsx` | Option B chosen 2026-11-26: the flat brass double loop traced from the kit mark (`npm run loop:fit`), ivory crossing on dark and charcoal crossing on light, with a Fraunces wordmark. Swap in a supplied vector logo if one is made; the kit PNGs stay reference only. |
| Founder titles | `src/app/about/page.tsx` | "Cofounder" and "Cofounder, operations", approved 2026-11-23. |
| Legal entity, hosting provider, liability, governing law | `src/app/privacy/page.tsx`, `src/app/terms/page.tsx` | Bracketed `[...]` placeholders. Both pages are drafts, `noindex`, and need attorney review. |
| GA4 measurement ID | `NEXT_PUBLIC_GA_ID` | Empty means no analytics and no banner. |
| Search Console token | `NEXT_PUBLIC_GSC_VERIFICATION` | Or verify by DNS TXT record instead. |

## Motion stand-ins (photoreal assets not yet made)

The cinematic scenes use code-built stand-ins until the stills in `ASSET_BRIEF.md` exist. None of them use people, devices, reviews, stars or ratings.

| Stand-in | Where | Replaced by (`ASSET_BRIEF.md`) |
|---|---|---|
| Seeded noise tile `public/brand/textures/paper-128.png` (lossless palette PNG, 128 px; `.paper`, from `scripts/brand/textures.mjs`); static SVG-noise grain (`.film-grain`) on the hero visual | Ivory bands, `src/app/globals.css`; hero visual, `src/components/hero/HeroVisual.tsx` | 1. Ivory paper texture |
| Flat SVG window-light plate (paper-shade pool, paper-light panes) | The four journey vignettes, `src/components/scenes/vignettes/*.tsx`; the brand film's opening plate, `video/src/Film.tsx` | 2. Golden-hour window light |
| Seeded noise tile `public/brand/textures/felt-128.png` (lossless palette PNG, 128 px; `.felt`, from `scripts/brand/textures.mjs`) | Charcoal bands and the CTA band | 3. Charcoal felt texture |
| Procedural brushed brass (anisotropic `MeshPhysicalMaterial`), lit by a light map built at runtime from emissive cards (PMREM; no EXR file) | `src/components/hero/LoopScene.tsx` | 4. Brushed brass swatch |
| Code-drawn notecards (`Notecard`, `src/components/scenes/illustration/parts.tsx`) in the problem scene; `ServiceEmblem` `loop` variant on the `/contact` hero | `src/components/scenes/ProblemArt*.tsx`, `src/app/contact/page.tsx` | 6. Letterpress notecard |
| `ServiceEmblem` `about` variant (two notecards joined by a `LoopThread`) | `/about` hero, `src/app/about/page.tsx` | 7. Brushed-brass loop object |

The brand film (Phase 8 re-cut) is drawn in vector inside `video/src`: the window-light plate is a code stand-in for ASSET_BRIEF #2 (golden-hour window light). Re-render with `cd video && npm run render` after any change to `video/src`.
