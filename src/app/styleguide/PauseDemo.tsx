"use client";

import { PauseControl } from "@/components/motion/PauseControl";
import { cn } from "@/lib/cn";

const noop = () => {};

/**
 * Styleguide-only: the one pause control on a stand-in scene surface. A client
 * wrapper because a server page cannot pass the onToggle function down.
 */
export function PauseDemo({ tone }: { tone: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <div
      className={cn(
        "relative h-32 rounded-card border",
        dark ? "tone-dark border-[rgb(184_137_74/0.22)] bg-charcoal" : "tone-light border-rule bg-paper",
      )}
    >
      <PauseControl pressed={false} onToggle={noop} label="Pause motion" tone={tone} />
    </div>
  );
}
