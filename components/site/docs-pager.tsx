import Link from "next/link"
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react/dist/ssr"

import { cn } from "@/lib/utils"
import { docPages, type DocPage } from "@/lib/docs"

const card =
  "group flex cursor-pointer flex-col gap-1 rounded-xl bg-surface p-4 shadow-frame transition-all duration-150 hover:bg-fill focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.98]"

/** Previous and next docs page, in the order of `docPages`. */
export function DocsPager({ current }: { current: DocPage["href"] }) {
  const i = docPages.findIndex((page) => page.href === current)
  const prev = docPages[i - 1]
  const next = docPages[i + 1]

  return (
    <nav aria-label="Docs pages" className="grid gap-3 sm:grid-cols-2">
      {prev ? (
        <Link href={prev.href} className={card}>
          <span className="flex items-center gap-1 text-meta text-text-muted">
            <ArrowLeftIcon aria-hidden="true" className="size-3.5 transition-transform duration-150 group-hover:-translate-x-0.5" />
            Previous
          </span>
          <span className="text-action font-medium text-text-primary">{prev.title}</span>
        </Link>
      ) : (
        <span aria-hidden="true" className="hidden sm:block" />
      )}
      {next && (
        <Link href={next.href} className={cn(card, "sm:items-end sm:text-right")}>
          <span className="flex items-center gap-1 text-meta text-text-muted">
            Next
            <ArrowRightIcon aria-hidden="true" className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
          </span>
          <span className="text-action font-medium text-text-primary">{next.title}</span>
        </Link>
      )}
    </nav>
  )
}
