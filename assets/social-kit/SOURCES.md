# ReplyLoop social kit: originals used by the site

Originals copied byte-for-byte from Google Drive, `My Drive / REPLYLOOP / Creative Assets / replyloop-social-kit` (folder `1Ci2U71ncow0MWTzL9rdUN-zAgtDzxu7O`), on 2026-11-26. They live outside `public/` and are never served directly. The site ships only optimized derivatives (AVIF/WebP under `public/brand/`, or frames inside the brand film).

The kit manifests still carry old Windows paths (`G:\My Drive\REPLYLOOP\ReplyLoop Brain\replyloop-social-kit\...`). Files are matched by their path inside the kit folder.

| File (path inside the kit) | Drive file ID | Pixels | SHA-256 | Verified against | Use on the site |
|---|---|---|---|---|---|
| `assets/backgrounds/07-video-thumbnail.png` | `11UV_sV8wTIy0yIf7TlnEey21uqMolbRM` | 1672 × 941 | `d17a5f61b09d4d94b75d18e4098d19171e2a96810a9699cfacda60ed7b66a0a1` | `06-07-backgrounds-manifest.json` (match) | Former opening plate of the brand film (not used since the Phase 8 re-cut) |
| `assets/backgrounds/06-og-link-preview.png` | `1dBYQLFa91YqEYW-tb2Ph2vMTg-U8wXMH` | 1734 × 907 | `8f5dcab9d16b2ada1a60cb6492af0574597afa5ba2bb2b12446265523acbb02f` | `06-07-backgrounds-manifest.json` (match) | Decorative hero backdrop on `/home-care-agencies` (`alt=""`) |
| `assets/identity/replyloop-loop-mark-transparent.png` | `13ebh9c19O4DmfCTlPr-T1KxztE0HQpwr` | 1254 × 1254, RGBA | `de1cfdf97be365c99f4fd3620fca5751d054f36fef2cd51a1413141b35fa0711` | No hash in any manifest; dimensions match `assets/identity/README.md`, alpha 0 at all four corners | Reference geometry only: `scripts/loop/fit-loop.py` derives the loop curve in `assets/loop/loop-fit.json` |
| `assets/identity/replyloop-profile-avatar.png` | `15unvXLc9lQrXTiZoo1Wc-UOnWJB2YrZL` | 1254 × 1254 | `0dd95bd181c357f47fef1926c8ea042ec7c4106ab1374069c70db7541fa0b0a3` | `exports/export-manifest.json` source hash (match) | Reference only, for logo option B (flat brass double loop, ivory crossing) |

Run `sha256sum assets/social-kit/*/*.png` to print the current hashes.

## Kit files deliberately not used

- `assets/templates/06-trust-loop-infographic.png` and `templates/replyloop-trust-loop-infographic-4x5.png`: on HOLD (five-star and "COMPOUND" imagery).
- `assets/backgrounds/01-blank-education-template.png` and `backgrounds/replyloop-blank-education-template-4x5.png`: contain a five-star bubble.
- `assets/templates/05-human-line.png` and its export: show three star icons.
- Highlight icons "Reviews" (sparkle) and "Analytics" (growth chart): break the kit's own exclusions; the site's SVG icons are redrawn without them.
- Every raster with baked-in text: real text stays in HTML.
