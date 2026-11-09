"use client"

import {
  MediaControls,
  MediaFullscreenButton,
  MediaPictureInPictureButton,
  MediaPlaybackRateButton,
  MediaPlayButton,
  MediaRoot,
  MediaSeek,
  MediaSurface,
  MediaTime,
  MediaVideo,
  MediaVolume,
  MediaMuteButton,
} from "@/components/ui/media"

export function ComposedPlayer() {
  return (
    <MediaRoot className="@container aspect-video w-full overflow-hidden rounded-xl bg-media-scrim text-media-foreground">
      <MediaVideo src="/media/flower.mp4" className="size-full object-cover" loop />
      <MediaSurface />
      <MediaControls className="absolute inset-x-3 bottom-3 flex-col items-stretch gap-1 rounded-lg bg-media-scrim/50 p-2 backdrop-blur-md group-not-data-started/media:pointer-events-auto group-not-data-started/media:translate-y-0 group-not-data-started/media:opacity-100">
        <MediaSeek className="mx-1" previewClassName="bg-media-foreground text-media-scrim" />
        <div className="flex items-center gap-1">
          <MediaPlayButton />
          <MediaMuteButton />
          {/* phones use hardware buttons, and iOS ignores volume set by a page */}
          <MediaVolume className="mr-1 hidden pointer-fine:flex" />
          <MediaTime className="text-media-foreground/80" />
          {/* below 384px the row overflows, so the duration goes first */}
          <span className="hidden font-mono text-xs text-media-foreground/50 @sm:inline">/</span>
          <MediaTime type="duration" className="hidden text-media-foreground/50 @sm:inline" />
          <span className="grow" />
          <MediaPlaybackRateButton />
          <MediaPictureInPictureButton />
          <MediaFullscreenButton />
        </div>
      </MediaControls>
    </MediaRoot>
  )
}
