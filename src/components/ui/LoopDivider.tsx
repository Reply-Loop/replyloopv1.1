import { cn } from "@/lib/cn";
import { Thread } from "@/components/scenes/Thread";

/**
 * Connector between sections: the brass thread from the kit's open-loop line.
 * It draws with scroll; with reduced motion it is simply drawn. Decorative only.
 * (`animate` is kept for older call sites; the thread always follows scroll.)
 */
export function LoopDivider({
  tone = "ivory",
  className,
}: {
  tone?: "ivory" | "charcoal";
  animate?: boolean;
  className?: string;
}) {
  const dark = tone === "charcoal";
  return (
    <div aria-hidden className={cn("overflow-hidden", dark ? "bg-charcoal" : "bg-ivory", className)}>
      <Thread dark={dark} />
    </div>
  );
}
