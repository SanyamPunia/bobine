"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { CONTENT_HALF_REM, CONTENT_WIDTH } from "@/lib/constants"
import { docPages } from "@/lib/docs"

const focus = "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"

/**
 * Pages listed after the docs, below a divider. They are not docs pages: no
 * sections, markdown copy or pager position, so they stay out of `docPages`.
 */
const extras = [{ href: "/examples", title: "Examples" }]

/**
 * The docs pages, then `extras`. From the `rail` breakpoint it is a fixed list
 * in the left margin, mirroring "On this page" in the right one. Below it, the
 * margins are gone, so it becomes a row of pills above the content.
 */
export function DocsNav() {
  const pathname = usePathname()

  return (
    <>
      <nav
        aria-label="Docs"
        className="fixed top-24 hidden w-48 flex-col gap-1 rail:flex"
        style={{ left: `calc(50% - ${CONTENT_HALF_REM}rem - 16rem)` }}
      >
        <span className="mb-1 text-meta text-text-muted">Docs</span>
        {docPages.map((page) => {
          const active = pathname === page.href
          return (
            <Link
              key={page.href}
              href={page.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "-ml-2 cursor-pointer rounded-md px-2 py-1 text-action transition-all duration-150 hover:bg-fill hover:text-text-primary active:scale-[0.98]",
                focus,
                active ? "bg-fill text-text-primary" : "text-text-secondary"
              )}
            >
              {page.title}
            </Link>
          )
        })}
        <span aria-hidden="true" className="my-2 h-px w-full bg-stroke-soft" />
        {extras.map((page) => {
          const active = pathname === page.href
          return (
            <Link
              key={page.href}
              href={page.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "-ml-2 cursor-pointer rounded-md px-2 py-1 text-action transition-all duration-150 hover:bg-fill hover:text-text-primary active:scale-[0.98]",
                focus,
                active ? "bg-fill text-text-primary" : "text-text-secondary"
              )}
            >
              {page.title}
            </Link>
          )
        })}
      </nav>

      <nav aria-label="Docs" className={cn("mx-auto w-full px-5 pt-8 rail:hidden", CONTENT_WIDTH)}>
        <ul className="flex flex-wrap gap-1.5">
          {[...docPages, ...extras].map((page) => {
            const active = pathname === page.href
            return (
              <li key={page.href}>
                <Link
                  href={page.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex cursor-pointer rounded-full px-3 py-1 text-action transition-all duration-150 hover:bg-fill-hover hover:text-text-primary active:scale-[0.98]",
                    focus,
                    active ? "bg-fill text-text-primary" : "text-text-secondary"
                  )}
                >
                  {page.title}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}
