import type { ComponentType } from "react";
import type { Step } from "@/components/ui/StepList";
import { HowItWorksJourneyScene } from "./HowItWorksJourneyScene";
import { VignetteDryRun } from "./vignettes/VignetteDryRun";
import { VignetteGoLive } from "./vignettes/VignetteGoLive";
import { VignetteIntroCall } from "./vignettes/VignetteIntroCall";
import { VignetteVoiceInterview } from "./vignettes/VignetteVoiceInterview";

const VIGNETTES: ComponentType<{ idPrefix?: string; className?: string }>[] = [
  VignetteIntroCall,
  VignetteVoiceInterview,
  VignetteDryRun,
  VignetteGoLive,
];

/**
 * Brief §8.3.5. Server component: the vignettes are rendered here and passed to the
 * client scene, so their SVG is in the HTML once and never in the JS bundle.
 */
export function HowItWorksJourney({ steps }: { steps: Step[] }) {
  const vignettes = steps.map((step, i) => {
    const Vignette = VIGNETTES[i % VIGNETTES.length];
    return <Vignette key={step.title} idPrefix={`j${i}`} className="block h-auto w-full" />;
  });
  return <HowItWorksJourneyScene steps={steps} vignettes={vignettes} />;
}
