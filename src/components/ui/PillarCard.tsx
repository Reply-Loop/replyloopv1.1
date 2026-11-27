import Link from "next/link";
import { Card } from "./Card";
import { Icon, type IconName } from "./Icon";

export type Pillar = {
  icon: IconName;
  title: string;
  need: string;
  what: string;
  href?: string;
  linkLabel?: string;
};

/** One service pillar: the owner's need, then what ReplyLoop does. No prices. */
export function PillarCard({ pillar, headingLevel = "h3" }: { pillar: Pillar; headingLevel?: "h3" | "h2" }) {
  const H = headingLevel;
  return (
    <Card as="li" className="flex h-full flex-col transition-shadow duration-300 hover:shadow-[0_1px_0_0_var(--color-brass)]">
      <span className="mb-6 inline-flex size-11 items-center justify-center rounded-full border border-rule text-brass">
        <Icon name={pillar.icon} className="size-5" />
      </span>
      <H className="font-serif text-h3-lg font-medium">{pillar.title}</H>
      <p className="mt-3 text-slate">{pillar.need}</p>
      <p className="mt-3">{pillar.what}</p>
      {pillar.href ? (
        <Link
          href={pillar.href}
          className="mt-auto inline-flex items-center gap-2 pt-6 font-semibold underline decoration-brass underline-offset-[6px] hover:decoration-2"
        >
          {pillar.linkLabel ?? `More on ${pillar.title.toLowerCase()}`}
          <Icon name="arrow" className="size-4" />
        </Link>
      ) : null}
    </Card>
  );
}
