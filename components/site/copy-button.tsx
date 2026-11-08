"use client"

import { CheckIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { useCopy } from "@/hooks/use-copy"
import { CopyIcon } from "@/components/site/copy-icon"
import { swapIcon } from "@/components/site/copy-swap-icon"
import { Tooltip } from "@/components/site/tooltip"

export function CopyButton({ value, className }: { value: string; className?: string }) {
  const { copied, copy } = useCopy()

  return (
    <Tooltip label={copied ? "Copied" : "Copy to clipboard"}>
      <button
        type="button"
        aria-label={copied ? "Copied" : "Copy to clipboard"}
        onClick={() => copy(value)}
        className={cn(
          "inline-grid size-7 shrink-0 cursor-pointer place-items-center rounded-md text-text-muted transition-[color,background-color,scale] duration-150 hover:bg-fill-hover hover:text-text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-safe:active:scale-[0.98]",
          className
        )}
      >
        <span aria-hidden="true" className="grid *:col-start-1 *:row-start-1">
          <CheckIcon className={cn("size-3.5", swapIcon(copied))} />
          <CopyIcon className={cn("size-3.5", swapIcon(!copied))} />
        </span>
      </button>
    </Tooltip>
  )
}
