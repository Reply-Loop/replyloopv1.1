# ReplyLoop master ad (Remotion)

A 58-second 9:16 (1080×1920, 30fps) ad for Facebook/Instagram Feed and Reels. It explains what ReplyLoop does, shows the $499 setup and $350/month offer line by line, and justifies the price.

## Structure

| # | Section | Frames | Music file |
|---|---------|--------|------------|
| 1 | Hook: unanswered review → reply | 0–160 | `section-01-hook.wav` |
| 2 | Stat: 89% expect a reply (BrightLocal 2026) | 160–280 | `section-02-stat.wav` |
| 3 | What we do + price teaser | 280–440 | `section-03-what-we-do.wav` |
| 4 | $499 one-time setup, itemised | 440–760 | `section-04-setup-499.wav` |
| 5 | $350/month per location, itemised (16-clip content wall) | 760–1160 | `section-05-monthly-350.wav` |
| 6 | Price math ($11.51/day · $21.88/concept · <10 h of median marketing pay, BLS) | 1160–1360 | `section-06-price-math.wav` |
| 7 | Owner control + month-to-month terms | 1360–1560 | `section-07-owner-control.wav` |
| 8 | CTA end card | 1560–1765 | `section-08-cta.wav` |

## Music

`scripts/make-lofi.mjs` synthesises one lo-fi jazz track per section. It uses Rhodes-style FM chords, upright-style bass, swung hats, boom-bap drums, vinyl crackle, tape wobble and a moving lowpass. Every track is at 90 BPM, which is exactly 20 frames per beat, so the tracks chain sample-accurately. Each section has heavy "thump" accents on the beats where its main point lands. The script also writes `src/audio/cues.json`, and every visual hit is timed from that file, so the animation lands on the thump. To move a beat or add one, edit `SECTIONS` in the script, re-run it, and the visuals follow.

## Rebuild

1. Download the source clips from the Drive folder into `public/src/`. The names are listed in `src/scenes/*`.
2. Make the tile proxies:

```bash
for f in public/src/*.mp4; do ffmpeg -y -i $f -an -vf scale=360:-2 -crf 22 public/tiles/$(basename $f); done
```

3. Generate the music and check it:

```bash
npm run music && npm run check-audio
```

4. Render:

```bash
npm run render
```

## Claims policy

The only prices shown are from the owner's "ReplyLoop Pricing and Service Rules" doc. The two outside figures were checked against their primary sources:

- BrightLocal Local Consumer Review Survey 2026 (Feb 11, 2026; 1,002 U.S. adults): "89% of consumers expect business owners to respond to reviews."
- BLS OEWS, May 2025, Table 1: the median hourly wage for market research analysts and marketing specialists is $37.87.

Review cards in the ad are generic and labelled SAMPLE. There are no client names, testimonials, rankings or ROI claims.
