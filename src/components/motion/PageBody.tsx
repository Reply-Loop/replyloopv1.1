import { ViewTransition, type ReactNode } from "react";

/**
 * A page's content below its hero, as one route-transition group (brief §7.8):
 * on a client navigation the old content fades out (160ms, ease-in) and the new
 * content rises 6px and fades in (280ms, ease-out, 60ms later). See .rl-page in
 * globals.css. default="none" keeps it still during unrelated transitions.
 * Never wraps the home hero: the H1 paints as LCP, untouched.
 * The page fade is named exception 3: user-initiated, settles at opacity 1.
 */
export function PageBody({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="rl-page" exit="rl-page" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
