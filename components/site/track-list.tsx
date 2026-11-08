"use client"

import { demoTracks } from "@/lib/examples"
import { AudioPlayer } from "@/components/ui/audio-player"

/* scoped to this list, so the page's other players keep playing */
function pauseOthers(event: React.SyntheticEvent<HTMLAudioElement>) {
  const list = event.currentTarget.closest("[data-track-list]")
  for (const audio of list?.querySelectorAll("audio") ?? []) {
    if (audio !== event.currentTarget) audio.pause()
  }
}

/** The track list recipe: one player per row, one playing at a time. */
export function TrackList() {
  return (
    /* no overflow-hidden: the rows are transparent, and it would clip the
       first row's tooltips at the card's top edge */
    <div data-track-list className="w-full max-w-md rounded-xl border bg-bg">
      {demoTracks.map((track) => (
        <AudioPlayer
          key={track.title}
          src="/media/track.mp3"
          title={track.title}
          description={track.artist}
          onPlay={pauseOthers}
          frameClassName="rounded-none border-0 border-b bg-transparent last:border-b-0"
        />
      ))}
    </div>
  )
}
