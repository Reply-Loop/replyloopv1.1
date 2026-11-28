import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Container({
  children,
  className,
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  size?: "default" | "narrow" | "prose";
}) {
  const width =
    size === "prose" ? "max-w-[44rem]" : size === "narrow" ? "max-w-4xl" : "max-w-6xl";
  return <div className={cn("mx-auto w-full px-5 sm:px-8", width, className)}>{children}</div>;
}
