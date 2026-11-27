import { ProblemArt } from "./ProblemArt";
import { ProblemArtPortrait } from "./ProblemArtPortrait";
import { ProblemSceneMotion } from "./ProblemSceneMotion";

/**
 * Brief §8.3.2. Server component: both drawings are rendered here, on the server, and
 * handed to the client scene as children, so their SVG is in the HTML once and never
 * in the JS bundle. Phones get the portrait drawing, wider screens the landscape one.
 */
export function ProblemScene({ className }: { className?: string }) {
  return (
    <ProblemSceneMotion className={className}>
      {/* Bleeds through the 20px phone gutter (Container px-5) so the drawing is at least 0.55 of a 390×844 viewport's height. */}
      <ProblemArtPortrait idPrefix="pp" className="-mx-5 block h-auto w-[calc(100%+2.5rem)] max-w-none sm:hidden" />
      <ProblemArt idPrefix="pa" className="hidden h-auto w-full sm:block" />
    </ProblemSceneMotion>
  );
}
