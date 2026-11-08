"use client"

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

export const TooltipProvider = TooltipPrimitive.Provider

/**
 * A short label for an icon-only control. `children` must be a single element
 * that accepts a ref, because the trigger renders as that element.
 */
export function Tooltip({ label, children }: { label: string; children: React.ReactElement }) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger render={children} />
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner sideOffset={6} collisionPadding={12} className="z-50">
          <TooltipPrimitive.Popup className="rounded-md bg-text-primary px-2 py-1 text-meta text-bg transition-[opacity,transform] duration-150 ease-media data-ending-style:scale-95 data-ending-style:opacity-0 data-instant:transition-none data-starting-style:scale-95 data-starting-style:opacity-0">
            {label}
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}
