"use client"

import * as React from "react"
import Link from "next/link"
import { play } from "cuelume"

import { cn } from "@/lib/utils"

/* clicks closer together than this count as one streak */
const STREAK_GAP = 600
const STREAK_LENGTH = 6

/**
 * Module scope, not a ref: a click on the docs navigates to the landing page,
 * which mounts a new header, and the streak has to survive that.
 */
const streak = { count: 0, last: 0 }

/**
 * The header logo. A click plays cuelume's glassy tap and the orb presses in.
 * A 20px icon needs a deeper scale than a button to read, so it goes to 90%.
 * cuelume synthesizes the sound with Web Audio, so there is no file to load,
 * and it creates the AudioContext on the first click.
 *
 * Six quick clicks play a soft chord and send two rings out of the orb. The
 * rings are blurred copies of the orb, so they carry its colours in both
 * themes.
 */
export function LogoLink({ className }: { className?: string }) {
  const rings = React.useRef<(HTMLImageElement | null)[]>([])

  const ripple = () => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches
    rings.current.forEach((ring, i) => {

      /* Web Animations restart cleanly when a new streak lands mid-ripple */
      ring?.animate(
        reduce
          ? [{ opacity: 0.5 }, { opacity: 0 }]
          : [
              { opacity: 0.6, scale: 1, filter: "blur(1px)" },
              { opacity: 0, scale: 2.6, filter: "blur(4px)" },
            ],
        { duration: 800, delay: i * 140, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
      )
    })
  }

  const onClick = () => {
    const now = performance.now()
    streak.count = now - streak.last < STREAK_GAP ? streak.count + 1 : 1
    streak.last = now
    if (streak.count < STREAK_LENGTH) {
      play("tap", { volume: 0.6 })
      return
    }
    streak.count = 0
    play("success", { volume: 0.5 })
    ripple()
  }

  return (
    <Link href="/" onClick={onClick} className={cn(className, "group/logo")}>
      <span className="relative grid size-5 shrink-0 place-items-center">
        {[0, 1].map((i) => (
          <img
            key={i}
            ref={(el) => {
              rings.current[i] = el
            }}
            src="/icon.svg"
            alt=""
            aria-hidden="true"
            draggable={false}
            className="pointer-events-none absolute inset-0 size-full opacity-0 select-none"
          />
        ))}

        {/* app/icon.svg, the favicon, served at /icon.svg. Decorative: the
            wordmark names the link. */}
        <img
          src="/icon.svg"
          alt=""
          draggable={false}
          className="relative size-5 select-none transition-[scale] duration-150 motion-safe:group-active/logo:scale-90"
        />
      </span>
      bobine
    </Link>
  )
}
