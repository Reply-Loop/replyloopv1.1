import { INK, STROKE } from "@/lib/illustration/tokens";
import { LOOP_PATH_COMPACT } from "@/lib/loop/compact";
import { LOOP_VIEWBOX } from "@/lib/loop/geometry.generated";
import { cn } from "@/lib/cn";

/**
 * Blog card header strips (brief §8.10): a 120px ivory-2 strip at the top of each card with
 * the mark's loop at its own crop and rotation per post. Decorative and aria-hidden; the card's
 * meaning is its title, description and meta row.
 *
 * The loop is drawn once per page as a <symbol> (<LoopSymbol>, rendered once by the page) and
 * each strip <use>s it, so a strip costs a few attributes, not another copy of the path
 * (§1.2: one <symbol> per page where art repeats). Rules (src/lib/illustration/tokens.ts):
 * LOOP_PATH_COMPACT at a uniform scale, the 2px brass thread stroke (non-scaling), flat colour,
 * no filter, no raster, static (no motion and no before-state).
 *
 * Placement: the loop's crossing sits at a percentage point of the strip and the loop keeps a
 * fixed pixel width, so the crop holds whatever the card's width (and in the taller feature
 * panel at lg).
 */

const SYMBOL_ID = "blog-loop";
/** LOOP_VIEWBOX height / width: the symbol's aspect, so a <use> scales uniformly. */
const [, , VB_W, VB_H] = LOOP_VIEWBOX.split(" ").map(Number);

type Crop = {
  /** The crossing, as a point of the strip. */
  x: `${number}%`;
  y: `${number}%`;
  /** Rendered width of the loop's viewBox, px. */
  w: number;
  /** Degrees, clockwise, about the crossing. */
  r: number;
};

/** One crop per post position; cycles if there are more posts than crops. */
const CROPS: readonly Crop[] = [
  { x: "60%", y: "58%", w: 380, r: -8 },
  { x: "26%", y: "64%", w: 460, r: 10 },
  { x: "86%", y: "36%", w: 400, r: -16 },
  { x: "50%", y: "70%", w: 440, r: 4 },
];

/** The shared loop. Render once per page, before or after the strips. */
export function LoopSymbol() {
  return (
    <svg aria-hidden focusable="false" className="absolute size-0 overflow-hidden">
      <symbol id={SYMBOL_ID} viewBox={LOOP_VIEWBOX} overflow="visible">
        <path
          d={LOOP_PATH_COMPACT}
          fill="none"
          stroke={INK.brass}
          strokeWidth={STROKE.thread}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </symbol>
    </svg>
  );
}

export function LoopStrip({ index, className }: { index: number; className?: string }) {
  const c = CROPS[index % CROPS.length];
  const h = Math.round(((c.w * VB_H) / VB_W) * 10) / 10;
  return (
    <div aria-hidden className={cn("relative overflow-hidden bg-ivory-2", className)}>
      <svg focusable="false" className="absolute inset-0 size-full">
        <svg x={c.x} y={c.y} overflow="visible">
          <use href={`#${SYMBOL_ID}`} x={-c.w / 2} y={-h / 2} width={c.w} height={h} transform={`rotate(${c.r})`} />
        </svg>
      </svg>
    </div>
  );
}
