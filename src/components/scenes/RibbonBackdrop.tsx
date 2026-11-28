import { INK } from "@/lib/illustration/tokens";
import { LOOP_PATH_COMPACT } from "@/lib/loop/compact";

/**
 * Hero art for /home-care-agencies on desktop (brief §8.6): the brand ribbon, drawn.
 * Owner decision 2026-11-28: the kit's raster ribbon (06-og-link-preview) crops the band
 * at its right edge, so the whole loop could never read; the hero uses the same drawn
 * ribbon language as the phone HeroPlate instead, with the whole loop in view.
 *
 * One undistorted LOOP_PATH_COMPACT (rule 1), turned 8 degrees, as a broad charcoal band
 * with a brass underside: a brass stroke offset down/right under a wider charcoal stroke,
 * both non-scaling, flat colours, no filter, no raster. The viewBox leaves about 10% clear
 * paper around the band (the brief's 8% margin). Static: no motion and no before-state.
 *
 * Inline <svg>, so it is never a Largest Contentful Paint candidate: the H1 stays LCP at
 * every width. Desktop only (lg and up), in the same art column as the service emblems;
 * phones and tablets get the HeroPlate through PageHero's plate slot. aria-hidden.
 */
const BOX =
  "reveal-art pointer-events-none absolute top-1/2 right-[max(2rem,calc((100%-72rem)/2+2rem))] hidden w-[23rem] -translate-y-1/2 lg:block xl:w-[27rem]";

/** Band strokes in screen px (non-scaling) and the brass offset in viewBox units. */
const BAND = 20;
const UNDER = 16;
const LOOP = "rotate(-8)";
const UNDER_LOOP = "translate(3.5 2.5) rotate(-8)";

export function RibbonBackdrop() {
  return (
    <div aria-hidden="true" className={BOX}>
      <svg viewBox="-125 -75 250 150" className="block h-auto w-full" focusable="false" fill="none" strokeLinejoin="round">
        <path
          d={LOOP_PATH_COMPACT}
          transform={UNDER_LOOP}
          stroke={INK.brass}
          strokeWidth={UNDER}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={LOOP_PATH_COMPACT}
          transform={LOOP}
          stroke={INK.charcoal}
          strokeWidth={BAND}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
