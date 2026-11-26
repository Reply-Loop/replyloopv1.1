# Asset brief: photoreal stills the site cannot make in code

Each prompt uses the same structure and exclusions as the social kit's own prompts (`assets/templates/07-trust-loop-neutral.prompt.txt`, `assets/backgrounds/06-og-link-preview.prompt.txt`). Generated imagery shows only objects, light, textures and environments: **never people, faces, hands, clients, patients, care scenes, devices, screens, reviews, stars or ratings.**

Until an asset exists, the site uses the code-built stand-in listed with it (also tracked in `PLACEHOLDERS.md`). To install an asset: export at the exact size, save the original under `assets/brief/`, run `npm run brand:derive` (writes AVIF/WebP to the target path), then remove the stand-in note.

Palette for every prompt: charcoal `#1B1F23`, warm ivory `#F8F5EF`, deep brass `#8A5F1C`. Brass is warm, deep and brushed, never shiny yellow gold.

---

## 1. Ivory paper texture (seamless)

- **File:** `assets/brief/ivory-paper-2048.png` → `public/brand/textures/ivory-paper.avif` / `.webp`
- **Size:** 2048 × 2048 px, seamlessly tileable on all four edges
- **Use:** fine paper grain under ivory sections, the problem-card scene and the how-it-works vignettes (`mix-blend-mode: multiply`, about 6% opacity)
- **Stand-in:** SVG `feTurbulence` grain (`src/components/scenes/PaperGrain.tsx`)

```
Use case: texture-material
Asset type: seamless tileable texture, 2048 by 2048 pixels, edges must tile without seams in both directions
Primary request: A warm ivory cotton paper surface, photographed flat and evenly, for use as a subtle background texture.
Scene/backdrop: macro, front-facing, the paper fills the entire frame edge to edge.
Subject: fine natural cotton rag paper fibres and very gentle tooth; no folds, no stains, no deckled edges, no watermark marks in the paper.
Style/medium: photoreal macro texture photography, neutral and even.
Composition/framing: completely uniform across the frame; no focal point, no vignette, no gradient across the image.
Lighting/mood: soft, even, low-angle daylight that reveals fibre detail without directional shadows.
Color palette: warm ivory #F8F5EF as the average tone; tiny variation only.
Constraints: No text, no letters, no numbers, no logos, no watermark, no objects, no people, no hands, no stains, no frames.
Avoid: visible tiling seams, strong grain, yellowing, blue or grey cast, vignetting, lens blur, colour noise, any symbol or pattern.
```

## 2. Golden-hour window light on ivory paper

- **File:** `assets/brief/window-light-2400x1350.png` → `public/brand/plates/window-light.avif` / `.webp`
- **Size:** 2400 × 1350 px (16:9)
- **Use:** backdrop for chapter 04 "Go live, in the open" in the how-it-works sequence, and the warm light pass in the hero
- **Stand-in:** layered CSS gradients with soft mullion bars (`src/components/scenes/WindowLight.tsx`)

```
Use case: background-plate
Asset type: landscape background plate, exactly 16:9, 2400 by 1350 pixels
Primary request: Warm late-afternoon window light falling across a plain ivory paper surface, as a calm atmospheric backdrop with generous empty space.
Scene/backdrop: a flat ivory paper surface seen straight on; the only content is light and soft shadow.
Subject: two or three soft-edged window-mullion shadows and a warm sunlit patch crossing the right half of the frame on a gentle diagonal; nothing else.
Style/medium: photoreal, quiet editorial still-life photography, shallow depth of field so the shadow edges are soft.
Composition/framing: the left 55 percent stays a smooth, open ivory field for text overlays; light and shadow concentrate on the right half and fade out before the left edge.
Lighting/mood: golden hour, warm, calm, hopeful; low contrast, soft falloff.
Color palette: warm ivory #F8F5EF field, warm amber light, shadows tending toward charcoal #1B1F23 at low opacity; a faint deep brass #8A5F1C warmth in the highlights.
Constraints: No text, no letters, no numbers, no logos, no watermark, no objects, no furniture, no plants, no window frame visible, no people, no hands, no faces, no screens.
Avoid: harsh hard-edged shadows, blown highlights, lens flare, blue light, dust motes, bokeh balls, busy patterns, any recognizable room.
```

## 3. Charcoal felt texture (seamless)

- **File:** `assets/brief/charcoal-felt-1024.png` → `public/brand/textures/charcoal-felt.avif` / `.webp`
- **Size:** 1024 × 1024 px, seamlessly tileable
- **Use:** a barely visible surface under charcoal bands (health section, film frame, CTA band) at about 5% opacity
- **Stand-in:** SVG noise at low opacity (`src/components/scenes/PaperGrain.tsx`, dark variant)

```
Use case: texture-material
Asset type: seamless tileable texture, 1024 by 1024 pixels, tiles without seams in both directions
Primary request: A deep charcoal wool felt surface, photographed flat and evenly, for a subtle dark background texture.
Scene/backdrop: macro, front-facing, the felt fills the frame edge to edge.
Subject: dense, fine felt fibres with a soft matte surface; no pilling, no lint, no stitching.
Style/medium: photoreal macro texture photography.
Composition/framing: completely uniform; no focal point, no vignette, no gradient.
Lighting/mood: soft, even, very low-angle light that barely reveals the fibres.
Color palette: charcoal #1B1F23 average tone; no colour cast.
Constraints: No text, no letters, no numbers, no logos, no watermark, no objects, no people, no hands, no seams.
Avoid: visible tiling seams, blue or brown cast, sheen, specular highlights, noise, vignetting.
```

## 4. Brushed brass material swatch

- **File:** `assets/brief/brushed-brass-1024.png` → `public/brand/textures/brushed-brass.webp`
- **Size:** 1024 × 1024 px, seamlessly tileable along the brushing direction (horizontal)
- **Use:** colour and roughness reference map for the hero's 3D loop material
- **Stand-in:** procedural anisotropic brass in the 3D material (`src/components/hero/LoopScene.tsx`)

```
Use case: texture-material
Asset type: seamless tileable material swatch, 1024 by 1024 pixels, brushing runs horizontally and tiles left to right
Primary request: A flat sheet of finely brushed deep brass, photographed straight on, as a physically based material reference.
Scene/backdrop: macro, front-facing, the metal fills the frame edge to edge.
Subject: fine, even, parallel horizontal brushing marks on warm deep brass; satin finish with soft anisotropic sheen.
Style/medium: photoreal macro material photography, calibrated, neutral.
Composition/framing: uniform across the frame; no edges, no holes, no engraving, no reflections of a room or camera.
Lighting/mood: soft, broad, even studio light; satin sheen only, no hot spots.
Color palette: deep brass family around #8A5F1C, warm and slightly brown; never yellow gold, never copper-pink.
Constraints: No text, no letters, no numbers, no logos, no stamp marks, no watermark, no objects, no people, no hands, no scratches or dents, no fingerprints.
Avoid: mirror polish, chrome, shiny yellow gold, rainbow sheen, visible reflections, lens flare, vignetting, tiling seams.
```

---

## Open items

| # | Asset | Status |
|---|---|---|
| 1 | Ivory paper texture | Not generated. Stand-in live. |
| 2 | Golden-hour window light | Not generated. Stand-in live. |
| 3 | Charcoal felt texture | Not generated. Stand-in live. |
| 4 | Brushed brass swatch | Not generated. Procedural material live. |
