import { InView } from "@/components/motion/InView";
import { Icon, type IconName } from "@/components/ui/Icon";
import { LOOP_PATH, LOOP_VIEWBOX } from "@/lib/loop/geometry.generated";

/**
 * Service-page hero art (desktop): the loop as a hairline with a short brass
 * stroke that travels it when motion is fully on (CSS only; parked otherwise), with the service's icon in an
 * ivory medallion on the right-hand lobe. Decorative; server-rendered.
 */
export function ServiceEmblem({ icon, pair = false }: { icon: IconName; pair?: boolean }) {
  return (
    <InView className="reveal-art pointer-events-none absolute top-1/2 right-[max(2rem,calc((100%-72rem)/2+2rem))] hidden w-[24rem] -translate-y-1/2 lg:block xl:w-[28rem]">
      <svg viewBox={LOOP_VIEWBOX} className="block h-auto w-full overflow-visible" focusable="false">
        <path d={LOOP_PATH} fill="none" className="stroke-rule" strokeWidth={1.2} />
        <path d={LOOP_PATH} fill="none" pathLength={100} className="loop-comet stroke-brass" strokeWidth={1.6} strokeLinecap="round" />
      </svg>
      {(pair ? ["left-[27.5%] -scale-x-100", "left-[72.5%]"] : ["left-[72.5%]"]).map((pos) => (
        <span
          key={pos}
          className={`absolute top-1/2 ${pos} flex size-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-rule bg-ivory text-brass shadow-[0_18px_40px_-22px_rgb(32_33_36/0.45)] xl:size-28`}
        >
          <Icon name={icon} className="size-9 xl:size-10" />
        </span>
      ))}
    </InView>
  );
}
