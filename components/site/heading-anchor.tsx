"use client"

import { CheckIcon, HashIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { isPlainClick, scrollToSection } from "@/lib/scroll"
import { useCopy } from "@/hooks/use-copy"
import { swapIcon } from "@/components/site/copy-swap-icon"
import { Tooltip } from "@/components/site/tooltip"

/**
 * A link to one section. A real anchor, so a modified click opens a new tab
 * and the browser's own menu can copy it. A plain click scrolls smoothly and
 * also copies the URL.
 *
 * Hidden until the heading is hovered. The box is reserved either way, so the
 * leader rule beside it never shifts. It stays visible while "copied" shows,
 * because the scroll moves the heading out from under the pointer.
 */
export function HeadingAnchor({ id }: { id: string }) {
  const { copied, copy } = useCopy()

  return (
    <Tooltip label={copied ? "Link copied" : "Copy link to section"}>
      <a
        href={`#${id}`}
        aria-label={copied ? "Link copied" : "Copy link to this section"}
        onClick={(event) => {
          const url = `${window.location.origin}${window.location.pathname}#${id}`
          copy(url)
          if (isPlainClick(event) && scrollToSection(id)) event.preventDefault()
        }}
        className={cn(
          "inline-grid size-6 shrink-0 cursor-pointer place-items-center rounded-md text-text-muted transition-[color,background-color,opacity,scale] duration-150 select-none hover:bg-fill-hover hover:text-text-primary focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-safe:active:scale-[0.98] group-hover/heading:opacity-100",
          copied ? "text-text-primary opacity-100" : "opacity-0"
        )}
      >
        <span aria-hidden="true" className="grid *:col-start-1 *:row-start-1">
          <CheckIcon className={cn("size-3.5", swapIcon(copied))} />
          <HashIcon className={cn("size-3.5", swapIcon(!copied))} />
        </span>
      </a>
    </Tooltip>
  )
}
