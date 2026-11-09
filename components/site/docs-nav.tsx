"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dialog } from "@base-ui/react/dialog"
import { CaretRightIcon, ListIcon, XIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { CONTENT_HALF_REM, CONTENT_WIDTH } from "@/lib/constants"
import { docExtras, docPages, docsReadingOrder } from "@/lib/docs"
import { Tooltip } from "@/components/site/tooltip"

const focus = "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"

/**
 * One drawer, two triggers: the bar under the header and, once that bar has
 * scrolled away, a button beside the logo. The handle lets the header's
 * trigger open a dialog rendered here.
 */
const docsMenu = Dialog.createHandle()

/* the header button watches this bar to know when it has scrolled away */
const BAR_ID = "docs-menu-bar"

/**
 * Raw files for tools and agents, last in the sidebar. They open in a new tab
 * because they are plain text and JSON, not pages.
 */
const resources = [
  { href: "/r/registry.json", title: "registry.json" },
  { href: "/llms.txt", title: "llms.txt" },
  { href: "/llms-full.txt", title: "llms-full.txt" },
]

/** The sidebar's list, shared by the fixed desktop rail and the mobile drawer. */
function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const item = (page: { href: string; title: string }) => {
    const active = pathname === page.href
    return (
      <Link
        key={page.href}
        href={page.href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          "-ml-2 cursor-pointer rounded-md px-2 py-1 text-action transition-[color,background-color,scale] duration-150 hover:bg-fill hover:text-text-primary motion-safe:active:scale-[0.98]",
          focus,
          active ? "bg-fill text-text-primary" : "text-text-secondary"
        )}
      >
        {page.title}
      </Link>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="mb-1 text-meta text-text-muted">Docs</span>
      {docPages.map(item)}
      {docExtras.map(item)}
      <span aria-hidden="true" className="my-2 h-px w-full bg-stroke-soft" />
      <span className="mb-1 text-meta text-text-muted">Resources</span>
      {resources.map((file) => (
        <a
          key={file.href}
          href={file.href}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "-ml-2 cursor-pointer rounded-md px-2 py-1 font-mono text-meta text-text-secondary transition-[color,background-color,scale] duration-150 hover:bg-fill hover:text-text-primary motion-safe:active:scale-[0.98]",
            focus
          )}
        >
          {file.title}
        </a>
      ))}
    </div>
  )
}

/**
 * The docs sidebar. From the `rail` breakpoint it is a fixed list in the left
 * margin, mirroring "On this page" in the right one. Below it the margins are
 * gone, so a bar naming the current page opens the same list as a drawer.
 */
export function DocsNav() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  /* the drawer opens on the current page, not on the close button's tooltip */
  const popup = React.useRef<HTMLDivElement>(null)
  const current = docsReadingOrder.find((page) => page.href === pathname)

  return (
    <>
      <nav
        aria-label="Docs"
        className="fixed top-24 hidden w-48 rail:block"
        style={{ left: `calc(50% - ${CONTENT_HALF_REM}rem - 16rem)` }}
      >
        <NavLinks pathname={pathname} />
      </nav>

      <div className={cn("mx-auto w-full px-5 pt-6 rail:hidden", CONTENT_WIDTH)}>
        <Dialog.Root open={open} onOpenChange={setOpen} handle={docsMenu}>
          <Dialog.Trigger
            id={BAR_ID}
            className={cn(
              "flex w-full cursor-pointer items-center gap-2 rounded-xl bg-surface px-3 py-2 text-left shadow-frame transition-[background-color,scale] duration-150 hover:bg-fill motion-safe:active:scale-[0.98] aria-expanded:bg-fill",
              focus
            )}
          >
            <ListIcon aria-hidden="true" className="size-4 shrink-0 text-text-muted" />
            <span className="text-action text-text-muted">Docs</span>
            <CaretRightIcon aria-hidden="true" className="size-3 shrink-0 text-text-muted" />
            <span className="truncate text-action text-text-primary">{current?.title ?? "Menu"}</span>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop className="fixed inset-0 z-50 bg-scrim transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
            <Dialog.Popup
              ref={popup}
              initialFocus={() => popup.current?.querySelector<HTMLElement>("[aria-current=page]") ?? true}
              className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col gap-6 overflow-y-auto bg-bg px-5 pt-5 pb-8 shadow-frame transition-[translate,opacity] duration-200 ease-media motion-safe:data-ending-style:-translate-x-full motion-safe:data-starting-style:-translate-x-full motion-reduce:data-ending-style:opacity-0 motion-reduce:data-starting-style:opacity-0"
            >
              <div className="flex items-center justify-between">
                {/* the wordmark is decorative here; the dialog is named for its content */}
                <span aria-hidden="true" className="font-mono text-action font-medium text-text-primary">
                  bobine
                </span>
                <Dialog.Title className="sr-only">Docs menu</Dialog.Title>
                <Tooltip label="Close menu">
                  <Dialog.Close
                    aria-label="Close menu"
                    className={cn(
                      "grid size-8 cursor-pointer place-items-center rounded-full text-text-secondary transition-[color,background-color,scale] duration-150 hover:bg-fill hover:text-text-primary motion-safe:active:scale-[0.98]",
                      focus
                    )}
                  >
                    <XIcon aria-hidden="true" className="size-4" />
                  </Dialog.Close>
                </Tooltip>
              </div>
              <nav aria-label="Docs" className="pl-2">
                <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
              </nav>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </>
  )
}

/**
 * The drawer trigger beside the logo, below the `rail` breakpoint. It slides
 * in once the page's menu bar has passed under the sticky header, so a reader
 * deep in a page can still reach the other pages. Hidden, it takes no width
 * and is inert.
 */
export function DocsMenuButton() {
  const [shown, setShown] = React.useState(false)
  const self = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const bar = document.getElementById(BAR_ID)
    const header = self.current?.closest("header")
    if (!bar || !header) return

    /**
     * The bar counts as gone once it is fully behind the header. The observer
     * fires once, at the crossing, so the test is against the header's edge:
     * a test against the viewport top missed a slow scroll, where the bar is
     * still partly on screen when it crosses.
     */
    const edge = header.offsetHeight
    const observer = new IntersectionObserver(
      ([entry]) => setShown(!entry.isIntersecting && entry.boundingClientRect.bottom <= (entry.rootBounds?.top ?? edge) + 1),
      { rootMargin: `-${edge}px 0px 0px 0px` }
    )
    observer.observe(bar)
    return () => observer.disconnect()
  }, [])

  return (
    <span
      ref={self}
      inert={!shown}
      data-shown={shown || undefined}
      className="-mr-2 flex w-0 scale-90 opacity-0 transition-[width,margin,opacity,scale] duration-150 ease-media data-shown:mr-0 data-shown:w-8 data-shown:scale-100 data-shown:opacity-100 motion-reduce:transition-none rail:hidden"
    >
      <Tooltip label="Docs menu">
        <Dialog.Trigger
          handle={docsMenu}
          aria-label="Docs menu"
          className={cn(
            "grid size-8 shrink-0 cursor-pointer place-items-center rounded-full text-text-secondary transition-[color,background-color,scale] duration-150 hover:bg-fill hover:text-text-primary motion-safe:active:scale-[0.98] aria-expanded:bg-fill",
            focus
          )}
        >
          <ListIcon aria-hidden="true" className="size-4" />
        </Dialog.Trigger>
      </Tooltip>
    </span>
  )
}
