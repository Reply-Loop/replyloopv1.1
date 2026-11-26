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

## 15-second Reels cutdown (`Reels15`)

| # | Beat | Frames | Music file |
|---|------|--------|------------|
| 1 | Hook: unanswered review → reply | 0–80 | `section-c15-01-hook.wav` |
| 2 | What we do (3 chips on 3 beats) | 80–160 | `section-c15-02-what.wav` |
| 3 | $499 setup → $350/mo per location + terms | 160–320 | `section-c15-03-price.wav` |
| 4 | CTA end card | 320–450 | `section-c15-04-cta.wav` |

Render: `npx remotion render src/index.ts Reels15 out/replyloop-reels-15s-9x16.mp4 --codec h264 --crf 16`

## Music

`scripts/make-lofi.mjs` synthesizes one lo-fi jazz track per section. Every track is at 90 BPM, which is exactly 20 frames per beat, so the tracks chain sample-accurately. Each section puts a "thump" accent on the beat where its main point lands. The script writes `src/audio/cues.json` and `src/audio/cues-15.json`, and every visual hit is timed from those files.

### Versions (`public/music/<version>/`)

All versions share the same beat grid and accent cues, so any of them drops into either edit, or a future one.

| Version | What it is |
|---------|------------|
| `v2-clean` | **Default.** About half the notes of v1: 3-note chords, no extra chord re-hits, no melody, one held bass note per chord, no ghost hats. Sub-bass is cut (48 Hz 24 dB/oct high-pass, kick fundamental above 50 Hz, shorter thumps). Mastered to about -16 LUFS with true peak ≤ -1.5 dBTP through a look-ahead limiter. |
| `alt-a-warm` | v2 down 2 semitones, darker and softer keys, more vinyl, a touch more swing. |
| `alt-b-bright` | v2 up 2 semitones, voicings inverted upward, brighter tine. |
| `alt-c-dusty` | v2 with the upper 3 chord voices, rimshot backbeat, heavier swing, and a 3-note melody in the monthly section. |
| `v1-original` | The first delivery, kept for reference. It regenerates bit-for-bit. It is the bass-heavy mix at about -12 LUFS that peaks near 0 dBTP, so don't use it as is. |

To pick a version in a render, pass it as a prop, for example:

```bash
npx remotion render src/index.ts MasterAd out.mp4 --props '{"musicVersion":"alt-a-warm"}'
```

To make a new variant, add a profile to `PROFILES` in the script (key, voicings, tone, swing, drums), then run:

```bash
VERSIONS=<name> npm run music
```

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
