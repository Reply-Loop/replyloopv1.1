import { INK } from "@/lib/illustration/tokens";
import { LOOP_PATH_COMPACT } from "@/lib/loop/compact";
import { cn } from "@/lib/cn";

/**
 * <HeroPlate> (brief §9.3 "Hero plates", §8.13): the phone hero art for inner pages. An inline
 * SVG redraw of the ribbon language in assets/social-kit/backgrounds/06-og-link-preview.png
 * (NOT the 06-trust-loop-infographic template): the mark's loop as a broad charcoal band with
 * a brass underside, cropped off the right edge of a plain ivory plate with the shared paper
 * grain (.paper on the wrapper; no SVG filter).
 *
 * - Rule 1: one undistorted LOOP_PATH_COMPACT, uniform scale; each route picks its own crop
 *   (crossing position, scale) and rotation in PLATES.
 * - Cropped off the RIGHT edge only, as in the reference: every crop keeps the band (brass
 *   underside included) at least ~4 viewBox units clear of the top and bottom edges for
 *   container widths 280-350px and the 140px-tall tablet box, and runs off the right edge.
 *   Re-check the extents if you change a crop, the band widths or the box.
 * - Two strokes, both non-scaling so the band keeps its weight at every phone width: a brass
 *   stroke first, offset down/right, then a wider charcoal stroke on top. Where the offset
 *   outruns the half-width difference, a brass sliver shows on the down/right-facing edges,
 *   read as the ribbon's underside. Flat colours, no gradient, no filter, no raster. The band
 *   widths (16 and 13px, about the reference's band-to-lobe ratio) are the ribbon's own
 *   weights (rule 12), a deliberate exception to the hair/thread/rule set, which governs line
 *   art.
 * - Static and server-rendered: no motion, no before-state. aria-hidden; no text.
 * - Inline <svg> in a fixed aspect-ratio box (5:2, capped at 140px tall), so it is never an
 *   LCP candidate and causes no layout shift. preserveAspectRatio xMaxYMid keeps the crop
 *   pinned to the right edge when a wider (tablet) box leaves room on the left.
 *
 * Placement (PageHero): phones and tablets only (lg:hidden), below the primary CTA, or below
 * the intro where the hero has no button. Never on "/".
 */

type Crop = {
  /** Crossing of the loop, viewBox units (viewBox is 400 x 160). */
  at: readonly [number, number];
  /** Uniform scale; 1 = loop half-width of 100 units. */
  s: number;
  /** Degrees, clockwise, about the crossing. */
  r: number;
};

const PLATES = {
  about: { at: [338, 79], s: 1.38, r: -5 },
  blog: { at: [428, 86], s: 1.56, r: 5 },
  contact: { at: [440, 73], s: 1.54, r: -4 },
  faq: { at: [352, 80], s: 1.36, r: 6 },
  hca: { at: [446, 76], s: 1.56, r: -2 },
  services: { at: [326, 79], s: 1.42, r: -3 },
  "service-review-replies": { at: [420, 70], s: 1.54, r: -6 },
  "service-social-content": { at: [362, 82], s: 1.38, r: 7 },
  "service-local-seo": { at: [450, 88], s: 1.56, r: 6 },
  "service-websites": { at: [392, 82], s: 1.52, r: 2 },
  "service-owner-qa-videos": { at: [344, 78], s: 1.48, r: -1 },
} as const satisfies Record<string, Crop>;

export type HeroPlateVariant = keyof typeof PLATES;

/** Band strokes in screen px (non-scaling), and the brass offset in viewBox units. */
const BAND = 16;
const UNDER = 13;
const OFFSET = [5.5, 4] as const;

const r2 = (v: number) => Math.round(v * 100) / 100;
const place = ({ at, s, r }: Crop, dx = 0, dy = 0) =>
  `translate(${r2(at[0] + dx)} ${r2(at[1] + dy)}) rotate(${r}) scale(${s})`;

/** A service page's plate variant from its slug; unknown slugs fall back to the /services crop. */
export function servicePlateVariant(slug: string): HeroPlateVariant {
  const key = `service-${slug}`;
  return key in PLATES ? (key as HeroPlateVariant) : "services";
}

export function HeroPlate({ variant, className }: { variant: HeroPlateVariant; className?: string }) {
  const crop: Crop = PLATES[variant];
  return (
    <div
      aria-hidden="true"
      data-hero-plate={variant}
      className={cn(
        "paper pointer-events-none relative aspect-[5/2] max-h-[140px] w-full overflow-hidden rounded-card border border-rule",
        className,
      )}
    >
      <svg
        viewBox="0 0 400 160"
        preserveAspectRatio="xMaxYMid meet"
        className="absolute inset-0 block size-full"
        focusable="false"
        fill="none"
        strokeLinejoin="round"
      >
        <path
          d={LOOP_PATH_COMPACT}
          transform={place(crop, OFFSET[0], OFFSET[1])}
          stroke={INK.brass}
          strokeWidth={UNDER}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={LOOP_PATH_COMPACT}
          transform={place(crop)}
          stroke={INK.charcoal}
          strokeWidth={BAND}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
