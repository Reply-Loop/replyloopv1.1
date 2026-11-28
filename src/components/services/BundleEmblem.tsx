import { Icon } from "@/components/ui/Icon";
import { bundlePillars } from "@/content/services";
import { INK, STROKE } from "@/lib/illustration/tokens";
import { LOOP_PATH_COMPACT } from "@/lib/loop/compact";
import { LOOP_VIEWBOX } from "@/lib/loop/geometry.generated";

/**
 * /services hero art (desktop), brief §8.4: the double loop drawn once as a 2px brass thread,
 * with one small icon chip per bundle pillar set on it. Static: no orbit, no comet, no ambient
 * motion (an animated version would need the full §7.10 gating). Decorative and aria-hidden;
 * the pillars are named in the HTML below. Server-rendered, no client JS.
 *
 * Placement matches the service emblems (ServiceEmblem's BOX): the hero's right columns at lg,
 * vertically centred, 24rem wide (28rem at xl). Phones and tablets get the HeroPlate instead.
 */

const BOX =
  "reveal-art pointer-events-none absolute top-1/2 right-[max(2rem,calc((100%-72rem)/2+2rem))] hidden w-[24rem] -translate-y-1/2 py-12 lg:block xl:w-[28rem]";

const [VX, VY, VW, VH] = LOOP_VIEWBOX.split(" ").map(Number);

/**
 * Chip centres, on the loop itself (LOOP_PATH_COMPACT knots at the top and bottom of each lobe),
 * read clockwise from the upper left: review replies, social content, Google Business Profile,
 * growth workbook.
 */
const STATIONS: readonly (readonly [number, number])[] = [
  [-52.2, -40.7],
  [52.2, -40.7],
  [52.2, 40.7],
  [-52.2, 40.7],
];

const pct = (v: number, origin: number, size: number) => `${(((v - origin) / size) * 100).toFixed(2)}%`;

export function BundleEmblem() {
  return (
    <div aria-hidden className={BOX}>
      {/*
        The chips on the lobe tops and bottoms reach about 6px past the loop's viewBox, and their
        shadow-object about 40px below. .reveal-art ends on clip-path: inset(0 round 20px), which
        clips to this box, so the 48px vertical padding keeps chips and shadows inside it.
        Stations are placed against the inner box, which is exactly the SVG.
      */}
      <div className="relative">
        <svg viewBox={LOOP_VIEWBOX} className="block h-auto w-full overflow-visible" focusable="false">
          <path
            d={LOOP_PATH_COMPACT}
            fill="none"
            stroke={INK.brass}
            strokeWidth={STROKE.thread}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {bundlePillars.slice(0, STATIONS.length).map((pillar, i) => {
          const [x, y] = STATIONS[i];
          return (
            <span
              key={pillar.title}
              className="absolute flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md border border-rule bg-paper text-brass shadow-object xl:size-14"
              style={{ left: pct(x, VX, VW), top: pct(y, VY, VH) }}
            >
              <Icon name={pillar.icon} className="size-6" />
            </span>
          );
        })}
      </div>
    </div>
  );
}
