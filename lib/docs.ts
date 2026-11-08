/**
 * The docs content, read by both `app/docs/page.tsx` and `lib/markdown.ts`.
 * The HTML page and the markdown agents read cannot drift, because there is
 * one copy. Only the live demos exist in the page alone.
 */

export const MEDIA_FILE = "components/ui/media.tsx"

export const intro = {
  title: "The media player your browser should have shipped.",
  /** after "Swap <video> for <VideoPlayer>." */
  lede: "Same props and calmer controls. The shadcn CLI puts the source in your repo, so you own every line.",
}

export const usage = {
  video: `import { VideoPlayer } from "@/components/ui/video-player"

<VideoPlayer
  src="/clip.mp4"
  poster="/clip.jpg"
  tracks={[{ src: "/clip.en.vtt", label: "English", srcLang: "en" }]}
  persistKey="reel"
/>`,
  audio: `import { AudioPlayer } from "@/components/ui/audio-player"

<AudioPlayer src="/episode.mp3" title="Episode 12" description="Field notes" />`,
  composed: `<MediaRoot className="aspect-video bg-media-scrim text-media-foreground">
  <MediaVideo src="/clip.mp4" className="size-full object-cover" />
  <MediaSurface />
  <MediaControls className="absolute inset-x-3 bottom-3 flex-col gap-1">
    <MediaSeek />
    <div className="flex items-center gap-1">
      <MediaPlayButton />
      <MediaMuteButton />
      <MediaVolume />
      <MediaTime /> / <MediaTime type="duration" />
      <span className="grow" />
      <MediaPlaybackRateButton />
      <MediaPictureInPictureButton />
      <MediaFullscreenButton />
    </div>
  </MediaControls>
</MediaRoot>`,
  hls: `"use client"
import { VideoPlayer } from "@/components/ui/video-player"
import { hlsLoader } from "@/lib/media-hls"

<VideoPlayer src="https://example.com/stream.m3u8" loader={hlsLoader} />`,
  package: `/* globals.css */
@import "tailwindcss";
@import "reel-media/styles.css";

import { VideoPlayer, AudioPlayer } from "reel-media"
import { hlsLoader } from "reel-media/hls"
import { createMediaStore } from "reel-media/core"`,
}

/** One shadcn command per registry item. */
export function installCommands(registry: string) {
  const add = (item: string) => `npx shadcn@latest add ${registry}/${item}.json`
  return {
    video: add("video-player"),
    audio: add("audio-player"),
    media: add("media"),
    hls: add("media-hls"),
    package: "pnpm add reel-media",
  }
}

export const sections = {
  video: {
    id: "video",
    title: "Video",
    description:
      "Every attribute you would put on a native video element works unchanged. Controls fade away while it plays and return the moment you move.",
  },
  audio: {
    id: "audio",
    title: "Audio",
    description:
      "Built from the same parts and styled with your theme tokens, so it matches your app in light and dark mode.",
  },
  compose: {
    id: "compose",
    title: "Compose your own",
    description:
      "Both players are a few lines on top of unstyled primitives. Rearrange them, restyle them, or add what you need.",
  },
  streaming: {
    id: "streaming",
    title: "Streaming",
    description:
      "Pass a loader for adaptive streams. Safari plays HLS natively. Other browsers fetch hls.js only when an .m3u8 source appears.",
  },
  package: {
    id: "package",
    title: "Or install the package",
    description:
      "Prefer a dependency over owning the source? The same components ship as reel-media, with a framework-agnostic core.",
  },
  parts: {
    id: "parts",
    title: "Parts",
    description: `Everything is exported from ${MEDIA_FILE}.`,
  },
  keyboard: {
    id: "keyboard",
    title: "Keyboard",
    description: "Shortcuts apply to the focused player only, so several can live on one page.",
  },
} as const

export const parts: readonly (readonly [name: string, description: string])[] = [
  ["MediaRoot", "Owns the store. Exposes data-paused, data-started, data-waiting, data-idle, data-fullscreen."],
  ["MediaVideo / MediaAudio", "The native element. Every native prop passes through."],
  ["MediaSurface", "Full-bleed click target. First tap on touch reveals controls."],
  ["MediaControls", "Reveals on pointer activity, pause, or keyboard focus."],
  ["MediaSeek / MediaVolume", "Accessible sliders with scrubbing, buffering and keyboard steps."],
  ["MediaTime", "current, duration or remaining."],
  ["Media*Button", "Play, Mute, Captions, Fullscreen, PictureInPicture, PlaybackRate."],
  ["MediaSettings", "Speed and caption track menu."],
  ["MediaCaptions", "Renders the active cue with your styles instead of the browser's."],
  ["MediaLoading / MediaErrorMessage", "Buffering indicator and a retryable error state."],
  ["useMedia(selector)", "Subscribe to any slice of state. Re-renders only when it changes."],
  ["useMediaStore()", "Imperative access: play, seek, setVolume, setTextTrack and more."],
]

/** Readable names for keys the page draws as icons. */
export const keyLabels: Record<string, string> = {
  ArrowLeft: "Left arrow",
  ArrowRight: "Right arrow",
  ArrowUp: "Up arrow",
  ArrowDown: "Down arrow",
}

export const shortcuts: readonly { keys: readonly string[]; action: string }[] = [
  { keys: ["Space", "K"], action: "Play or pause" },
  { keys: ["J", "L"], action: "Seek 10 seconds" },
  { keys: ["ArrowLeft", "ArrowRight"], action: "Seek 5 seconds" },
  { keys: ["ArrowUp", "ArrowDown"], action: "Volume" },
  { keys: ["0", "9"], action: "Jump to 0–90%" },
  { keys: ["Home", "End"], action: "Start or end" },
  { keys: ["M"], action: "Mute" },
  { keys: ["C"], action: "Captions" },
  { keys: ["I"], action: "Picture-in-picture" },
  { keys: ["F"], action: "Fullscreen" },
]

/**
 * The prompt the "Copy prompt" buttons put on the clipboard. It points the
 * agent at the full docs first, so the steps below are a summary and not the
 * only instructions it has.
 */
export function agentPrompt(origin: string): string {
  const cmd = installCommands(`${origin}/r`)
  return `Add reel media players to this React project.

1. Read ${origin}/llms-full.txt for the full reel docs before you change code.
2. Install the video player with the shadcn CLI:
   ${cmd.video}
   For audio, also run: ${cmd.audio}
   For HLS streams, also run: ${cmd.hls}
3. Replace each <video controls> element with <VideoPlayer> from "@/components/ui/video-player". Keep src, poster, tracks and the other native props. Remove the controls attribute.
4. Replace each <audio controls> element with <AudioPlayer> from "@/components/ui/audio-player" in the same way.
5. For .m3u8 sources, pass loader={hlsLoader} from "@/lib/media-hls" in a client component.
6. Do not restyle the installed components unless I ask. They use the project's shadcn theme tokens.`
}
