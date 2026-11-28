import type { ReactNode, SVGProps } from "react";
import { LOOP_PATH_COMPACT } from "@/lib/loop/compact";

export type IconName =
  | "reply"
  | "social"
  | "pin"
  | "browser"
  | "video"
  | "arrow"
  | "external"
  | "phone"
  | "mail"
  | "menu"
  | "close"
  | "check"
  | "minus"
  | "key"
  | "loop"
  | "book"
  | "plus";

/** vector-effect does not inherit, so it sits on every shape: 1.5px strokes at every icon size. */
const v = { vectorEffect: "non-scaling-stroke" } as const;

const paths: Record<IconName, ReactNode> = {
  reply: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5z" {...v} />
      <path d="M8.5 8.5h7M8.5 11.5h4.5" {...v} />
    </>
  ),
  // Stacked cards (three proof cards, the front one with two writing lines). Not a platform glyph.
  social: (
    <>
      <path d="M5.5 8.5h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z" {...v} />
      <path d="M6 8.5v-1a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-.5M8.5 5.5V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H19" {...v} />
      <path d="M6.5 12.5h7M6.5 15.5h4.5" {...v} />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" {...v} />
      <circle cx="12" cy="10" r="2.25" {...v} />
    </>
  ),
  browser: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" {...v} />
      <path d="M3 9h18M6.5 6.75h.01M9 6.75h.01" {...v} />
    </>
  ),
  video: (
    <>
      <rect x="3" y="6" width="12.5" height="12" rx="2.5" {...v} />
      <path d="m15.5 10.5 5.5-3v9l-5.5-3" {...v} />
    </>
  ),
  arrow: <path d="M5 12h13M13 6.5 18.5 12 13 17.5" {...v} />,
  external: (
    <>
      <path d="M14 4h6v6M20 4l-8.5 8.5" {...v} />
      <path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" {...v} />
    </>
  ),
  phone: (
    <path d="M6.6 3.5h2.6l1.4 4.2-2 1.5a12 12 0 0 0 6.2 6.2l1.5-2 4.2 1.4v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z" {...v} />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" {...v} />
      <path d="m4 7 8 6 8-6" {...v} />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" {...v} />,
  close: <path d="M6 6l12 12M18 6 6 18" {...v} />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" {...v} />,
  minus: <path d="M6 12h12" {...v} />,
  plus: <path d="M12 5v14M5 12h14" {...v} />,
  book: (
    <>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 1 4 17.5z" {...v} />
      <path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v15h5.5a1.5 1.5 0 0 0 1.5-1.5z" {...v} />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="4" {...v} />
      <path d="m10.8 12.2 8.7-8.7M16.5 6.5l2.5 2.5M14 9l2 2" {...v} />
    </>
  ),
  // The double loop: the mark's own curve (LOOP_PATH_COMPACT, 200 units wide) at 20/24 of the box.
  loop: <path d={LOOP_PATH_COMPACT} transform="matrix(.1 0 0 .1 12 12)" {...v} />,
};

type IconProps = SVGProps<SVGSVGElement> & { name: IconName; title?: string };

/**
 * Line icon. Decorative by default; pass `title` to make it meaningful. Strokes are 1.5 screen px
 * at every size (non-scaling-stroke on every shape, brief §9.3). No star or rating glyphs.
 */
export function Icon({ name, title, className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? "size-5"}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {paths[name]}
    </svg>
  );
}
