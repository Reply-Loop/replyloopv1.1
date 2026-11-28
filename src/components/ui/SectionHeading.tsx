import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow, Rule } from "./Eyebrow";

type SectionHeadingProps = {
  id?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  as: Tag = "h2",
  align = "left",
  className,
}: SectionHeadingProps) {
  const size =
    Tag === "h1"
      ? "text-[2.5rem] sm:text-5xl lg:text-[3.75rem]"
      : Tag === "h2"
        ? "text-[2rem] sm:text-[2.5rem] lg:text-[2.875rem]"
        : "text-2xl sm:text-[1.75rem]";
  return (
    <header
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center [&_p]:justify-center [&>span]:mx-auto",
        className,
      )}
    >
      {eyebrow ? <Eyebrow className="mb-5">{eyebrow}</Eyebrow> : <Rule className="mb-6" />}
      <Tag id={id} className={cn("font-serif font-medium text-charcoal on-dark:text-ivory", size)}>
        {title}
      </Tag>
      {intro ? (
        <div className="mt-5 max-w-2xl text-lg leading-relaxed text-slate on-dark:text-mist [&>p+p]:mt-4">
          {typeof intro === "string" ? <p>{intro}</p> : intro}
        </div>
      ) : null}
    </header>
  );
}
