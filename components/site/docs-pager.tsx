import Link from "next/link"
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react/dist/ssr"

import { cn } from "@/lib/utils"
import { docPages, type DocPage } from "@/lib/docs"

const pill =
  "group inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-fill py-1.5 text-action text-text-secondary transition-[color,background-color,scale] duration-150 hover:bg-fill-hover hover:text-text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-safe:active:scale-[0.98]"

const arrow = "size-3.5 shrink-0 transition-[translate] duration-150"

/**
 * Previous and next docs page, in the order of `docPages`: two small pills on
 * one row under a hairline. The direction is in each link's accessible name,
 * so the pills only need to show the arrow and the title.
 */
export function DocsPager({ current }: { current: DocPage["href"] }) {
  const i = docPages.findIndex((page) => page.href === current)
  const prev = docPages[i - 1]
  const next = docPages[i + 1]

  return (
    <nav aria-label="Docs pages" className="flex items-center justify-between gap-3 border-t border-stroke-soft pt-6">
      {prev ? (
        <Link href={prev.href} aria-label={`Previous: ${prev.title}`} className={cn(pill, "pr-3 pl-2.5")}>
          <ArrowLeftIcon aria-hidden="true" className={cn(arrow, "motion-safe:group-hover:-translate-x-0.5")} />
          {prev.title}
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
      {next && (
        <Link href={next.href} aria-label={`Next: ${next.title}`} className={cn(pill, "pr-2.5 pl-3")}>
          {next.title}
          <ArrowRightIcon aria-hidden="true" className={cn(arrow, "motion-safe:group-hover:translate-x-0.5")} />
        </Link>
      )}
    </nav>
  )
}
