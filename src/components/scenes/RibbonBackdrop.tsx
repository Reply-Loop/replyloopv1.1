/**
 * Hero backdrop for /home-care-agencies (brief §8.6): the ribbon loop from the
 * brand kit (06-og-link-preview, cropped and colour-matched by `npm run
 * brand:derive`). Decorative and aria-hidden (InView sets it); the meaning is
 * in the hero's text.
 *
 * Desktop only (lg and up): phones and tablets get the inline-SVG HeroPlate
 * through PageHero's `plate` slot, and never download the still (its CSS source
 * sits inside a min-width: 64rem query, and the box is display: none below it).
 *
 * The still is painted by .hca-ribbon in src/styles/hca.css as a border-image
 * `fill`, so Chrome never treats it as the Largest Contentful Paint candidate
 * (an <img> or a url() background would be; at 1440 its painted area is about
 * three times the H1's). The H1 stays the LCP element at every width. It renders
 * on the server at full opacity, with no fade and no JavaScript involved; the
 * feathered left and top edges blend it into the page ivory. A slow drift runs
 * only with motion fully on and while the hero is on screen (InView), stops in
 * place when paused, and is off for reduced motion.
 */
import { InView } from "@/components/motion/InView";

export function RibbonBackdrop() {
  return (
    <InView className="pointer-events-none absolute inset-0 hidden lg:block">
      <span className="hca-ribbon" />
    </InView>
  );
}
