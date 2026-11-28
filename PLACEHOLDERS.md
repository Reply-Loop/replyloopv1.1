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
| Static SVG-noise grain (`.film-grain`) | Hero visual, `src/app/globals.css` | 1. Ivory paper texture |
| Window pane and warm glow gradients | `src/components/scenes/vignettes/VignetteGoLive.tsx` | 2. Golden-hour window light |
| Flat charcoal (no texture) | Charcoal sections | 3. Charcoal felt texture |
| Procedural brushed brass (anisotropic `MeshPhysicalMaterial`) | `src/components/hero/LoopScene.tsx` | 4. Brushed brass swatch |

Brand film plates come from the kit (`07-video-thumbnail`), not from stand-ins. Re-render with `cd video && npm run render` after any change to `video/src`.
