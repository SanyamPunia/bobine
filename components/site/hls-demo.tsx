"use client"

import { VideoPlayer } from "@/components/ui/video-player"
import { hlsLoader } from "@/lib/media-hls"

export function HlsDemo() {
  return (
    <VideoPlayer
      src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
      loader={hlsLoader}
      preload="none"
      aria-label="Adaptive HLS stream of Big Buck Bunny"
      metadata={{ title: "Big Buck Bunny", artist: "HLS test stream" }}
    />
  )
}
