import { cn } from "@/lib/utils";
import React from "react";

/**
 * CSS-only tooltip.
 *
 * The landing page shows ~40 of these (social links, skill icons, project
 * links, technology icons). Each Radix tooltip instance brought its own
 * provider, context and timers, which was one of the largest remaining chunks
 * of hydration work. This renders no JavaScript at all: it appears on hover and
 * on keyboard focus of the wrapped control.
 *
 * The visible bubble is `aria-hidden`; assistive technology gets the name from
 * the control's own `aria-label`, or from `srOnlyLabel` when the content is not
 * interactive.
 */
export function Hint({
  label,
  srOnlyLabel = false,
  side = "top",
  className,
  children,
}: {
  label: string;
  /** Also expose the label as screen-reader-only text (for non-interactive content). */
  srOnlyLabel?: boolean;
  side?: "top" | "bottom";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={cn("group/hint relative inline-flex", className)}>
      {children}
      {srOnlyLabel && <span className="sr-only">{label}</span>}
      <span
        aria-hidden="true"
        className={cn(
          "bg-primary text-primary-foreground pointer-events-none absolute left-1/2 z-50 w-max -translate-x-1/2 rounded-md px-2 py-1 text-xs opacity-0 transition-opacity duration-150 group-focus-within/hint:opacity-100 group-hover/hint:opacity-100",
          side === "top" ? "bottom-full mb-1" : "top-full mt-1",
        )}
      >
        {label}
      </span>
    </span>
  );
}

export default Hint;
