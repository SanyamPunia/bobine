"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import type { MediaInfo } from "@/lib/media-store"
import {
  MediaAudio,
  MediaErrorMessage,
  MediaLoading,
  MediaMuteButton,
  MediaPlayButton,
  MediaPlaybackRateButton,
  MediaRoot,
  MediaSeek,
  MediaTime,
  MediaVolume,
  type MediaSourceLoader,
} from "@/components/ui/media"

type AudioPlayerProps = Omit<React.ComponentProps<"audio">, "controls" | "title"> & {
  title?: React.ReactNode
  description?: React.ReactNode
  /** Cover image shown beside the controls and in OS media controls. */
  artwork?: string
  /** Show a playback speed toggle. Useful for podcasts and voice notes. */
  showSpeed?: boolean
  /** Small labels with shortcuts over the controls on hover and focus. On by default. */
  tooltips?: boolean
  /** Classes for the outer frame. `className` targets the <audio> element. */
  frameClassName?: string
  /** Adapter for sources the browser can't play natively, e.g. HLS. */
  loader?: MediaSourceLoader
  /** Overrides metadata derived from `title`, `description` and `artwork`. */
  metadata?: MediaInfo
  /** Remember volume, mute and speed under this localStorage key. */
  persistKey?: string
}

const muted = "text-muted-foreground hover:text-foreground"

/**
 * The volume popover opens on hover or keyboard focus, never on a click, so the
 * mute button keeps its one job. `has-focus-visible` rather than focus-within,
 * so a mouse click on mute does not pin it open.
 */
const volumeOpen =
  "group-hover/volume-menu:pointer-events-auto group-hover/volume-menu:translate-y-0 group-hover/volume-menu:opacity-100 group-has-focus-visible/volume-menu:pointer-events-auto group-has-focus-visible/volume-menu:translate-y-0 group-has-focus-visible/volume-menu:opacity-100"

function AudioPlayer({
  title,
  description,
  artwork,
  showSpeed,
  tooltips = true,
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

  const hasInfo = Boolean(title || description)

  return (
    <MediaRoot
      persistKey={persistKey}
      metadata={sessionInfo}
      tooltips={tooltips}
      className={cn(
        "@container/audio grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 rounded-xl border bg-card p-2.5 pr-3 text-card-foreground",
        frameClassName
      )}
    >
      <MediaAudio className={className} loader={loader} {...props} />

      {/* with a title, the info stacks over the seek row and the controls
          span both. Below 24rem the controls take the first row, then the
          title and the seek row each get the full width */}
      <div className={cn("flex items-center", hasInfo && "row-span-2 @max-sm/audio:row-span-1")}>
        <span className="relative shrink-0">
          {artwork ? (
            /**
             * The tile presses as one piece. Scaling the button alone pulled
             * its scrim in from the edges and bared a band of the image. No
             * overflow-hidden, so the play tooltip is not clipped.
             */
            <span className="relative block size-11 rounded-lg bg-muted transition-[scale] duration-150 ease-media motion-safe:has-[button:enabled:active]:scale-[0.96] motion-reduce:transition-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={artwork}
                alt=""
                className="size-full rounded-lg object-cover outline outline-black/10 -outline-offset-1 dark:outline-white/10"
              />
              <MediaPlayButton
                tooltipAlign="start"
                className="absolute inset-0 size-full rounded-lg motion-safe:enabled:active:scale-100 bg-media-scrim/15 text-media-foreground hover:bg-media-scrim/35 focus-visible:bg-media-scrim/35 group-data-playing/media:bg-media-scrim/35 [&_svg]:size-4 [&_svg]:drop-shadow-sm"
              />
            </span>
          ) : (
            <MediaPlayButton
              tooltipAlign="start"
              className="size-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 [&_svg]:size-4"
            />
          )}
          {/* while the stream buffers: a ring around the round button, or a
              spinner on the cover, since a spinning square would look broken */}
          <MediaLoading
            className={
              artwork
                ? "absolute inset-0 m-auto size-5 text-background"
                : "absolute -inset-1 size-auto border-current/15 border-t-current text-foreground"
            }
          />
        </span>
      </div>

      {hasInfo && (
        <div className="col-start-2 flex min-w-0 items-baseline gap-2 self-end text-sm leading-5 @max-sm/audio:col-span-3 @max-sm/audio:col-start-1 @max-sm/audio:row-start-2 @max-sm/audio:pt-1">
          {/* the description gives way first, and the full text sits in a
              title for when either one truncates */}
          {title && (
            <span dir="auto" title={typeof title === "string" ? title : undefined} className="truncate font-medium">
              {title}
            </span>
          )}
          {description && (
            <span
              dir="auto"
              title={typeof description === "string" ? description : undefined}
              className="min-w-12 shrink-[4] truncate text-muted-foreground"
            >
              {description}
            </span>
          )}
        </div>
      )}

      <div
        dir="ltr"
        className={cn(
          "col-start-2 flex items-center gap-2.5 text-muted-foreground",
          hasInfo && "row-start-2 self-start @max-sm/audio:col-span-3 @max-sm/audio:col-start-1 @max-sm/audio:row-start-3"
        )}
      >
        <MediaTime className="min-w-9" />
        <MediaSeek className="text-foreground" />
        <MediaTime type="duration" toggle className="min-w-9 text-right" />
      </div>

      <div className={cn("col-start-3 flex items-center gap-0.5", hasInfo && "row-span-2 row-start-1 @max-sm/audio:row-span-1")}>
        {showSpeed && <MediaPlaybackRateButton rates={[1, 1.5, 2, 0.75]} className={muted} />}

        {/* a vertical slider above mute. Fine pointers only: phones set
            volume with their own buttons, and iOS ignores it from the page */}
        <div className="group/volume-menu relative">
          {/* no tooltip: the volume popover opens in the same spot */}
          <MediaMuteButton tooltip={false} className={muted} />
          <div
            className={cn(
              "pointer-events-none absolute bottom-full left-1/2 z-10 hidden -translate-x-1/2 translate-y-1 pb-2 opacity-0 pointer-fine:block",
              "transition-[opacity,translate] duration-150 ease-media motion-reduce:transition-none",
              volumeOpen
            )}
          >
            <div className="flex h-24 w-7 justify-center rounded-full bg-popover py-3 text-popover-foreground shadow-md ring-1 ring-foreground/10">
              <MediaVolume orientation="vertical" className="h-full" />
            </div>
          </div>
        </div>
      </div>

      <MediaErrorMessage className="absolute inset-0 flex-row gap-4 rounded-[inherit] bg-card/95 px-4 text-card-foreground" />
    </MediaRoot>
  )
}

export { AudioPlayer, type AudioPlayerProps }
