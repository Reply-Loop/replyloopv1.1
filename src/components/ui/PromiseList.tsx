import { cn } from "@/lib/cn";
import { promises as defaultPromises, type PromiseItem } from "@/content/promises";

/** The seven red lines, in customer-facing words. A simple numbered list. */
export function PromiseList({
  items = defaultPromises,
  className,
}: {
  items?: PromiseItem[];
  className?: string;
}) {
  return (
    <ol className={cn("grid gap-x-12 sm:grid-cols-2", className)}>
      {items.map((p, i) => (
        <li
          key={p.title}
          className="flex gap-5 border-t border-rule py-6 on-dark:border-mist/30"
        >
          <span
            aria-hidden
            className="w-8 shrink-0 font-serif text-2xl font-medium leading-tight text-brass on-dark:text-ivory"
          >
            {i + 1}
          </span>
          <div>
            <h3 className="font-serif text-h3 font-medium">{p.title}</h3>
            <p className="mt-2 text-slate on-dark:text-mist">{p.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
