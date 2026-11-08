"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import type { MediaInfo } from "@/lib/media-store"
import {
  MediaAudio,
  MediaErrorMessage,
  MediaMuteButton,
  MediaPlayButton,
  MediaPlaybackRateButton,
  MediaRoot,
  MediaSeek,
  MediaTime,
  type MediaSourceLoader,
} from "@/components/ui/media"

type AudioPlayerProps = Omit<React.ComponentProps<"audio">, "controls" | "title"> & {
  title?: React.ReactNode
  description?: React.ReactNode
  /** Cover image shown beside the controls and in OS media controls. */
  artwork?: string
  /** Show a playback speed toggle. Useful for podcasts and voice notes. */
  showSpeed?: boolean
  /** Classes for the outer frame. `className` targets the <audio> element. */
  frameClassName?: string
  /** Adapter for sources the browser can't play natively, e.g. HLS. */
  loader?: MediaSourceLoader
  /** Overrides metadata derived from `title`, `description` and `artwork`. */
  metadata?: MediaInfo
  /** Remember volume, mute and speed under this localStorage key. */
  persistKey?: string
}

function AudioPlayer({
  title,
  description,
  artwork,
  showSpeed,
  className,
  frameClassName,
  loader,
  metadata,
  persistKey,
  ...props
}: AudioPlayerProps) {
  const sessionInfo =
    metadata ??
    (typeof title === "string"
      ? {
          title,
          artist: typeof description === "string" ? description : undefined,
          artwork: artwork ? [{ src: artwork }] : undefined,
        }
      : undefined)

  return (
    <MediaRoot
      persistKey={persistKey}
      metadata={sessionInfo}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border bg-card p-2.5 pr-3 text-card-foreground",
        frameClassName
      )}
    >
      <MediaAudio className={className} loader={loader} {...props} />

      {artwork ? (
        <span className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={artwork} alt="" className="size-full object-cover" />
          <MediaPlayButton className="absolute inset-0 size-full rounded-none bg-foreground/0 text-background opacity-0 hover:bg-foreground/40 hover:opacity-100 focus-visible:bg-foreground/40 focus-visible:opacity-100 group-data-playing/media:bg-foreground/40 group-data-playing/media:opacity-100 [&_svg]:size-4" />
        </span>
      ) : (
        <MediaPlayButton className="size-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 [&_svg]:size-4" />
      )}

      <div className="flex min-w-0 grow flex-col gap-0.5">
        {(title || description) && (
          <div className="flex min-w-0 items-baseline gap-2 text-sm leading-5">
            {title && <span className="truncate font-medium">{title}</span>}
            {description && <span className="truncate text-muted-foreground">{description}</span>}
          </div>
        )}
        <div className="flex items-center gap-2.5 text-muted-foreground">
          <MediaTime className="min-w-9" />
          <MediaSeek className="text-foreground" />
          <MediaTime type="duration" className="min-w-9 text-right" />
        </div>
      </div>

      {showSpeed && (
        <MediaPlaybackRateButton
          rates={[1, 1.5, 2, 0.75]}
          className="text-muted-foreground hover:text-foreground"
        />
      )}
      <MediaMuteButton className="text-muted-foreground hover:text-foreground" />

      <MediaErrorMessage className="absolute inset-0 flex-row gap-4 rounded-[inherit] bg-card/95 px-4 text-card-foreground" />
    </MediaRoot>
  )
}

export { AudioPlayer, type AudioPlayerProps }
