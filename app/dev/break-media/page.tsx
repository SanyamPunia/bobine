import Link from "next/link"
import { notFound } from "next/navigation"

import { AudioPlayer } from "@/components/ui/audio-player"
import { VideoPlayer } from "@/components/ui/video-player"
import { cn } from "@/lib/utils"

import { fixtures, states, type State } from "./fixtures"

/* the real widths: the docs column, a phone, and a sidebar */
const widths = ["max-w-3xl", "max-w-90", "max-w-70"] as const

const labels: Record<State, string> = { demo: "Demo data", worst: "Worst case", empty: "Empty", error: "Error" }

/** Dev-only stress page for the players. `?data=` picks the fixture. */
export default async function BreakMediaPage({ searchParams }: PageProps<"/dev/break-media">) {
  if (process.env.NODE_ENV === "production") notFound()
  const { data } = await searchParams
  const state: State = states.includes(data as State) ? (data as State) : "demo"
  const fixture = fixtures[state]

  return (
    <main id="content" className="flex flex-col gap-12 px-4 pt-8 pb-32">
      <section data-test="video" className="flex flex-col gap-6">
        {fixture.video.map((props, i) =>
          widths.map((width) => (
            <div key={`${state}-${i}-${width}`} data-width={width} className={cn("w-full", width)}>
              <VideoPlayer {...props} />
            </div>
          ))
        )}
      </section>

      <section data-test="audio" className="flex flex-col gap-6">
        {fixture.audio.map((props, i) =>
          widths.map((width) => (
            <div key={`${state}-${i}-${width}`} data-width={width} className={cn("w-full", width)}>
              <AudioPlayer {...props} />
            </div>
          ))
        )}
      </section>

      <nav className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-1 rounded-full bg-fill p-1 font-sans text-meta shadow-md">
        {states.map((s) => (
          <Link
            key={s}
            href={`?data=${s}`}
            className={cn(
              "rounded-full px-3 py-1 text-text-secondary",
              s === state && "bg-bg text-text-primary shadow-sm"
            )}
          >
            {labels[s]}
          </Link>
        ))}
      </nav>
    </main>
  )
}
