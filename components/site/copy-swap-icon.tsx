import { CheckIcon, type Icon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

/**
 * One of two icons stacked in a grid cell that cross-fade on a state change,
 * such as copy to copied. The leaving icon shrinks and blurs out as the other
 * sharpens in, so the swap reads as one motion. Reduced motion keeps the fade
 * and drops the scale and blur. Every copy control on the site uses this, so
 * they all swap the same way.
 */
export function swapIcon(shown: boolean) {
  return cn(
    "transition-[opacity,scale,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
    shown ? "scale-100 opacity-100 blur-none" : "opacity-0 motion-safe:scale-25 motion-safe:blur-[4px]"
  )
}

/**
 * The leading icon of a labelled copy button. The idle icon and the check
 * cross-fade in one grid cell, alongside the label morph beside them.
 */
export function CopySwapIcon({ icon: Idle, copied }: { icon: Icon; copied: boolean }) {
  return (
    <span data-icon="inline-start" aria-hidden="true" className="grid *:col-start-1 *:row-start-1">
      <CheckIcon className={cn("size-4", swapIcon(copied))} />
      <Idle className={cn("size-4", swapIcon(!copied))} />
    </span>
  )
}
