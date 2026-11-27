import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

export type FaqItem = { question: string; answer: string };

/**
 * Accessible accordion on native <details>. Works without JavaScript,
 * keyboard operable, and the answers stay in the HTML for search engines.
 */
export function FAQ({
  items,
  className,
  headingLevel = "h3",
}: {
  items: FaqItem[];
  className?: string;
  headingLevel?: "h2" | "h3";
}) {
  const H = headingLevel;
  return (
    <div className={cn("divide-y divide-rule border-y border-rule on-dark:divide-mist/30 on-dark:border-mist/30", className)}>
      {items.map((item) => (
        <details key={item.question} className="group py-1">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 rounded-sm py-5 [&::-webkit-details-marker]:hidden">
            <H className="font-serif text-h3 font-medium">{item.question}</H>
            <span className="mt-1 inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-rule text-brass on-dark:border-mist/40 on-dark:text-ivory">
              <Icon name="plus" className="size-4 group-open:hidden" />
              <Icon name="minus" className="hidden size-4 group-open:block" />
            </span>
          </summary>
          <div className="max-w-3xl pb-6 pr-12 text-slate on-dark:text-mist">
            <Answer text={item.answer} />
          </div>
        </details>
      ))}
    </div>
  );
}

function Answer({ text }: { text: string }): ReactNode {
  return text.split(/\n{2,}/).map((para, i) => (
    <p key={i} className={i > 0 ? "mt-3" : undefined}>
      {para}
    </p>
  ));
}
