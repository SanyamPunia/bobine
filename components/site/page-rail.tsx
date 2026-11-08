"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { CONTENT_HALF_REM } from "@/lib/constants"
import { isPlainClick, scrollToSection } from "@/lib/scroll"

type Entry = { id: string; title: string }

/**
 * Where the reading line rests: below the sticky header and its 24px fade
 * (about 84px) and below the sections' `scroll-mt-24` (96px), so a section
 * jumped to marks itself.
 */
const THRESHOLD = 112

/**
 * The reading line in viewport coordinates. It rests at `THRESHOLD`, then
 * sweeps to the foot of the viewport over the last screen of scroll. Without
 * the sweep, the last short sections can never climb to the line, so their
 * rows never mark themselves.
 */
function readingLine(scrollable: number): number {
  if (scrollable <= 0) return THRESHOLD
  const remaining = scrollable - window.scrollY
  if (remaining >= window.innerHeight) return THRESHOLD
  return THRESHOLD + window.innerHeight - remaining
}

/**
 * "On this page" in the right margin, with the section being read marked. The
 * docs sidebar (`DocsNav`) takes the left margin at the same distance.
 *
 * It reads the rendered `section[id]` elements rather than a second list of
 * titles, so the rail and the anchors cannot disagree. It is `fixed`, so it
 * takes no width from the column and the column stays centred.
 */
export function PageRail() {
  const [entries, setEntries] = React.useState<Entry[]>([])
  const [active, setActive] = React.useState(0)
  const [bar, setBar] = React.useState<{ top: number; height: number } | null>(null)
  const links = React.useRef<(HTMLAnchorElement | null)[]>([])

  React.useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("main section[id]")
    setEntries(
      Array.from(sections, (el) => ({
        id: el.id,
        title: el.querySelector("h2 > span")?.textContent ?? el.id,
      }))
    )
  }, [])

  React.useEffect(() => {
    if (entries.length === 0) return
    let frame = 0

    const measure = () => {
      const line = readingLine(document.documentElement.scrollHeight - window.innerHeight)
      let next = 0
      entries.forEach((entry, i) => {
        const el = document.getElementById(entry.id)
        if (el && el.getBoundingClientRect().top <= line) next = i
      })
      setActive(next)
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        measure()
      })
    }

    measure()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [entries])

  // measured off the real link, because a title that wraps makes a taller row
  React.useEffect(() => {
    const el = links.current[active]
    if (el) setBar({ top: el.offsetTop, height: el.offsetHeight })
  }, [active, entries])

  if (entries.length < 2) return null

  return (
    <aside
      className="fixed top-24 hidden max-h-[calc(100dvh-8rem)] w-48 animate-in overflow-y-auto pb-1 duration-300 fade-in rail:block"
      style={{ left: `calc(50% + ${CONTENT_HALF_REM}rem + 4rem)` }}
    >
      <nav aria-label="On this page" className="flex flex-col gap-1">
        <span className="mb-1 text-meta text-text-muted">On this page</span>
        <div className="relative flex flex-col border-l border-stroke">
          {/* one bar that travels between rows, so the marker moves continuously */}
          {bar && (
            <span
              aria-hidden="true"
              className="absolute -left-px w-px bg-text-primary transition-all duration-150 ease-out motion-reduce:transition-none"
              style={{ top: bar.top, height: bar.height }}
            />
          )}
          {entries.map((entry, i) => (
            <a
              key={entry.id}
              ref={(el) => {
                links.current[i] = el
              }}
              href={`#${entry.id}`}
              onClick={(event) => {
                if (isPlainClick(event) && scrollToSection(entry.id)) event.preventDefault()
              }}
              aria-current={active === i ? "location" : undefined}
              className={cn(
                "cursor-pointer py-1 pl-3 text-meta transition-colors duration-200 hover:text-text-primary focus-visible:rounded-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                active === i ? "text-text-primary" : "text-text-muted"
              )}
            >
              {entry.title}
            </a>
          ))}
        </div>
      </nav>
    </aside>
  )
}
