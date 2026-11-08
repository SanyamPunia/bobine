"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { swapIcon } from "@/components/site/copy-swap-icon"
import { Tooltip } from "@/components/site/tooltip"

export function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <Tooltip label={copied ? "Copied" : "Copy to clipboard"}>
      <button
        type="button"
        aria-label={copied ? "Copied" : "Copy to clipboard"}
        onClick={async () => {
          await navigator.clipboard.writeText(value).catch(() => {})
          setCopied(true)
          clearTimeout(timer.current)
          timer.current = setTimeout(() => setCopied(false), 1500)
        }}
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
