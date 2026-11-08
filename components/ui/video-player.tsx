"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import type { MediaInfo } from "@/lib/media-store"
import { PlayIcon } from "@/components/ui/media-icons"
import {
  MediaCaptions,
  MediaCaptionsButton,
  MediaControls,
  MediaErrorMessage,
  MediaFullscreenButton,
  MediaLoading,
  MediaMuteButton,
  MediaPlayButton,
  MediaRoot,
  MediaSeek,
  MediaSettings,
  MediaSurface,
  MediaTime,
  MediaVideo,
  type MediaSourceLoader,
} from "@/components/ui/media"

type VideoTrack = {
  src: string
  label: string
  srcLang: string
  kind?: "captions" | "subtitles"
  default?: boolean
}

type VideoPlayerProps = Omit<React.ComponentProps<"video">, "controls"> & {
  /** Classes for the outer frame. `className` targets the <video> element. */
  frameClassName?: string
  /** WebVTT caption or subtitle files. */
  tracks?: VideoTrack[]
  /** Adapter for sources the browser can't play natively, e.g. HLS. */
  loader?: MediaSourceLoader
  /** Shown in OS media controls and lock screens. */
  metadata?: MediaInfo
  /** Remember volume, mute and speed under this localStorage key. */
  persistKey?: string
}

const reveal = "transition-[opacity,transform] duration-200 ease-media motion-reduce:transition-none"
const visibleWithControls =
  "group-data-active/media:opacity-100 group-has-focus-visible/media:opacity-100 group-data-paused/media:group-data-started/media:opacity-100"
const glass = "bg-media-scrim/70 text-media-foreground ring-1 ring-media-foreground/10 backdrop-blur-xl"

function VideoPlayer({
  className,
  frameClassName,
  tracks,
  loader,
  metadata,
  persistKey,
  children,
  crossOrigin,
  ...props
}: VideoPlayerProps) {
  return (
    <MediaRoot
      persistKey={persistKey}
      metadata={metadata}
      className={cn(
        "aspect-video w-full overflow-hidden rounded-xl bg-media-scrim text-media-foreground data-fullscreen:rounded-none",
        frameClassName
      )}
    >
      <MediaVideo
        className={cn("size-full object-contain", className)}
        loader={loader}
        crossOrigin={crossOrigin ?? (tracks?.length ? "anonymous" : undefined)}
        {...props}
      >
        {tracks?.map((track) => (
          <track
            key={track.src}
            src={track.src}
            label={track.label}
            srcLang={track.srcLang}
            kind={track.kind ?? "subtitles"}
            default={track.default}
          />
        ))}
        {children}
      </MediaVideo>

      <MediaSurface indicatorClassName={glass} />

      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-1/2 left-1/2 grid size-12 -translate-1/2 place-items-center rounded-full bg-media-scrim/40 backdrop-blur-md",
          reveal,
          "group-data-started/media:scale-75 group-data-started/media:opacity-0"
        )}
      >
        <PlayIcon className="size-5" />
      </span>

      <span className="pointer-events-none absolute inset-0 grid place-items-center">
        <MediaLoading />
      </span>

      <MediaCaptions
        className={cn(
          "absolute inset-x-4 bottom-4 text-sm leading-snug transition-transform duration-200 ease-media motion-reduce:transition-none sm:text-base",
          "group-data-active/media:-translate-y-10 group-has-focus-visible/media:-translate-y-10 group-data-paused/media:group-data-started/media:-translate-y-10",
          "[&>span]:bg-media-scrim/75 [&>span]:text-media-foreground"
        )}
      />

      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-media-scrim/60 to-transparent opacity-0",
          reveal,
          visibleWithControls
        )}
      />

      <MediaControls className="absolute inset-x-2 bottom-2 h-9 gap-1 px-1">
        <MediaPlayButton />
        <MediaSeek className="mx-2" previewClassName="bg-media-foreground text-media-scrim" />
        <MediaTime type="remaining" className="min-w-10 text-right text-media-foreground/80" />
        <MediaMuteButton />
        <MediaCaptionsButton />
        <MediaSettings panelClassName={glass} />
        <MediaFullscreenButton />
      </MediaControls>

      <MediaErrorMessage className="absolute inset-0 bg-media-scrim/85 px-6 text-media-foreground backdrop-blur-sm" />
    </MediaRoot>
  )
}

export { VideoPlayer, type VideoPlayerProps, type VideoTrack }
