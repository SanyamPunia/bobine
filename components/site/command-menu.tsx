"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import { Dialog } from "@base-ui/react/dialog"
import { ArrowSquareOutIcon, FileTextIcon, HashIcon, MagnifyingGlassIcon } from "@phosphor-icons/react"

import type { SearchItem } from "@/lib/search"
import { Tooltip } from "@/components/site/tooltip"

const groups: SearchItem["group"][] = ["Pages", "Sections", "Links"]
const icons = { Pages: FileTextIcon, Sections: HashIcon, Links: ArrowSquareOutIcon }

/**
 * Word matching instead of cmdk's fuzzy default. Fuzzy matched "load" against
 * scattered letters in long descriptions, so nearly every item stayed in the
 * list. Here every typed word must appear somewhere, and a title match ranks
 * above a match in the hint or keywords.
 */
function filter(value: string, search: string, keywords?: string[]): number {
  const words = search.toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return 1
  const title = value.toLowerCase()
  const all = [title, ...(keywords ?? [])].join(" ").toLowerCase()
  if (!words.every((word) => all.includes(word))) return 0
  return words.every((word) => title.includes(word)) ? 1 : 0.5
}

/**
 * Search across every docs page and section, opened with the header button or
 * Cmd+K / Ctrl+K. cmdk does the filtering and keyboard movement. The dialog is
 * Base UI's, the same system as the site's other popups, rather than cmdk's
 * built-in Radix dialog.
 */
export function CommandMenu({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const go = (item: SearchItem) => {
    setOpen(false)
    if (item.external) window.open(item.href, "_blank", "noreferrer")
    else router.push(item.href)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Tooltip label="Search docs (⌘ K)">
        <Dialog.Trigger
          aria-label="Search docs"
          className="flex cursor-pointer items-center gap-2 rounded-full bg-fill py-1 pr-1.5 pl-2.5 text-action text-text-secondary transition-all duration-150 hover:bg-fill-hover hover:text-text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.98] aria-expanded:bg-fill-hover"
        >
          <MagnifyingGlassIcon aria-hidden="true" className="size-3.5" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden items-center gap-0.5 rounded-full bg-bg px-1.5 font-mono text-meta text-text-muted sm:flex">
            <span>⌘</span>
            <span>K</span>
          </kbd>
        </Dialog.Trigger>
      </Tooltip>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-scrim transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed top-[15vh] left-1/2 z-50 flex max-h-[min(30rem,70svh)] w-[min(36rem,calc(100vw-2rem))] -translate-x-1/2 flex-col overflow-hidden rounded-2xl bg-popover shadow-frame transition-[opacity,transform] duration-150 ease-media data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0">
          <Dialog.Title className="sr-only">Search docs</Dialog.Title>
          <Command loop filter={filter} className="flex min-h-0 flex-col">
            <div className="flex items-center gap-2.5 border-b border-stroke-soft px-4">
              <MagnifyingGlassIcon aria-hidden="true" className="size-4 shrink-0 text-text-muted" />
              {/* no focus ring: the open palette is itself the focused surface,
                  and this is the only control in it */}
              <Command.Input
                autoFocus
                placeholder="Search pages and sections"
                className="h-12 w-full bg-transparent text-body text-text-primary transition-all duration-200 outline-none placeholder:text-body placeholder:text-text-muted"
              />
              <kbd className="shrink-0 rounded-md bg-fill px-1.5 font-mono text-meta text-text-muted">esc</kbd>
            </div>
            <Command.List className="min-h-0 overflow-y-auto overscroll-contain p-1.5 [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pt-2.5 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-meta [&_[cmdk-group-heading]]:text-text-muted">
              <Command.Empty className="px-2.5 py-8 text-center text-action text-text-muted">No results</Command.Empty>
              {groups.map((group) => {
                const Icon = icons[group]
                return (
                  <Command.Group key={group} heading={group}>
                    {items
                      .filter((item) => item.group === group)
                      .map((item) => (
                        <Command.Item
                          key={item.href}
                          // titles are unique, so the title alone is the value
                          value={item.title}
                          keywords={[item.href, ...item.keywords]}
                          onSelect={() => go(item)}
                          className="flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 select-none data-[selected=true]:bg-fill-hover"
                        >
                          <Icon aria-hidden="true" className="size-4 shrink-0 text-text-muted" />
                          <span className="flex min-w-0 flex-col">
                            <span className="truncate text-action text-text-primary">{item.title}</span>
                            <span className="truncate text-meta text-text-muted">{item.hint}</span>
                          </span>
                        </Command.Item>
                      ))}
                  </Command.Group>
                )
              })}
            </Command.List>
          </Command>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
