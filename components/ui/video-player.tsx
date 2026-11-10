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
  MediaPictureInPictureButton,
  MediaPlayButton,
  MediaRoot,
  MediaSeek,
  MediaSettings,
  MediaSurface,
  MediaTime,
  MediaVideo,
  MediaVolume,
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
  /** Small labels with shortcuts over the controls on hover and focus. On by default. */
  tooltips?: boolean
}

const reveal = "transition-[opacity,scale] duration-200 ease-media motion-reduce:transition-none"
const visibleWithControls =
  "group-data-active/media:opacity-100 group-has-focus-visible/media:opacity-100 group-data-paused/media:group-data-started/media:opacity-100"
const glass = "bg-media-scrim/70 text-media-foreground ring-1 ring-media-foreground/10 backdrop-blur-xl"

/**
 * The volume popover opens on hover or keyboard focus, never on a click, so the
 * mute button keeps its one job. `has-focus-visible` rather than focus-within,
 * so a mouse click on mute does not pin it open.
 */
const volumeOpen =
  "group-hover/volume-menu:pointer-events-auto group-hover/volume-menu:translate-y-0 group-hover/volume-menu:opacity-100 group-has-focus-visible/volume-menu:pointer-events-auto group-has-focus-visible/volume-menu:translate-y-0 group-has-focus-visible/volume-menu:opacity-100"

function VideoPlayer({
  className,
  frameClassName,
  tracks,
  loader,
  metadata,
  persistKey,
  tooltips = true,
  children,
  crossOrigin,
  ...props
}: VideoPlayerProps) {
  return (
    <MediaRoot
      persistKey={persistKey}
      metadata={metadata}
      tooltips={tooltips}
      className={cn(
        "@container/player aspect-video w-full overflow-hidden rounded-xl bg-media-scrim text-media-foreground data-fullscreen:rounded-none",
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
          /* sized by the player, not the viewport, so a small player keeps its cues */
          "absolute inset-x-4 bottom-4 text-xs leading-snug transition-transform duration-200 ease-media motion-reduce:transition-none @xs/player:text-sm @2xl/player:text-base",
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

      {/* tooltips match the seek preview: light on the dark bar. The bar stays
          left to right in RTL pages, like the seek math */}
      <MediaControls
        dir="ltr"
        className="absolute inset-x-2 bottom-2 h-9 gap-1 px-1 **:data-[slot=media-tooltip]:bg-media-foreground **:data-[slot=media-tooltip]:text-media-scrim">
        <MediaPlayButton tooltipAlign="start" />
        <MediaSeek className="mx-2" previewClassName="bg-media-foreground text-media-scrim" />
        {/* below 20rem the seek bar needs the room more than the label */}
        <MediaTime type="remaining" toggle className="hidden min-w-10 text-right text-media-foreground/80 @xs/player:inline" />

        {/* a vertical slider above mute, so opening it never squeezes the seek
            bar. Fine pointers only: phones set volume with their own buttons,
            and iOS ignores volume changes from the page */}
        <div className="group/volume-menu relative">
          {/* no tooltip: the volume popover opens in the same spot */}
          <MediaMuteButton tooltip={false} />
          <div
            className={cn(
              "pointer-events-none absolute bottom-full left-1/2 hidden -translate-x-1/2 translate-y-1 pb-2 opacity-0 pointer-fine:block",
              "transition-[opacity,translate] duration-150 ease-media motion-reduce:transition-none",
              volumeOpen
            )}
          >
            <div className={cn("flex h-24 w-7 justify-center rounded-full py-3", glass)}>
              <MediaVolume orientation="vertical" className="h-full" />
            </div>
          </div>
        </div>

        <MediaCaptionsButton />
        <MediaSettings panelClassName={glass} />
        {/* only where the bar has room for it; the I key works at any size */}
        <MediaPictureInPictureButton tooltipAlign="end" className="hidden @sm/player:inline-grid" />
        <MediaFullscreenButton tooltipAlign="end" />
      </MediaControls>

      <MediaErrorMessage className="absolute inset-0 bg-media-scrim/85 px-6 text-media-foreground backdrop-blur-sm" />
    </MediaRoot>
  )
}

export { VideoPlayer, type VideoPlayerProps, type VideoTrack }
