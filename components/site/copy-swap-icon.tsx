import { CheckIcon, type Icon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

const swap = "size-4 transition-[opacity,transform] duration-200 ease-media motion-reduce:transition-none"

/**
 * The leading icon of a labelled copy button. The idle icon and the check sit
 * in one grid cell and cross-fade with a slight scale, so the change reads as
 * one motion with the label morph beside it.
 */
export function CopySwapIcon({ icon: Idle, copied }: { icon: Icon; copied: boolean }) {
  return (
    <span data-icon="inline-start" aria-hidden="true" className="grid *:col-start-1 *:row-start-1">
      <CheckIcon className={cn(swap, copied ? "scale-100 opacity-100" : "scale-75 opacity-0")} />
      <Idle className={cn(swap, copied ? "scale-75 opacity-0" : "scale-100 opacity-100")} />
    </span>
  )
}
