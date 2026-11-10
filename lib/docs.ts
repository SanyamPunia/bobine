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
  /** under the first install command. Backticks mark inline code. */
  requires: "Needs React 19, Tailwind CSS 4 and a shadcn project. In a new project, run `npx shadcn@latest init` first.",
}

export const usage = {
  video: `import { VideoPlayer } from "@/components/ui/video-player"

<VideoPlayer
  src="/clip.mp4"
  poster="/clip.jpg"
  tracks={[{ src: "/clip.en.vtt", label: "English", srcLang: "en" }]}
  persistKey="bobine"
/>`,
  audio: `import { AudioPlayer } from "@/components/ui/audio-player"

<AudioPlayer src="/episode.mp3" title="Episode 12" description="Field notes" />`,
  composed: `import {
  MediaControls,
  MediaFullscreenButton,
  MediaMuteButton,
  MediaPictureInPictureButton,
  MediaPlaybackRateButton,
  MediaPlayButton,
  MediaRoot,
  MediaSeek,
  MediaSurface,
  MediaTime,
  MediaVideo,
  MediaVolume,
} from "@/components/ui/media"

<MediaRoot className="aspect-video bg-media-scrim text-media-foreground">
  <MediaVideo src="/clip.mp4" className="size-full object-cover" />
  <MediaSurface />
  <MediaControls className="absolute inset-x-3 bottom-3 flex-col gap-1">
    <MediaSeek />
    <div className="flex items-center gap-1">
      <MediaPlayButton />
      <MediaMuteButton />
      <MediaVolume className="hidden pointer-fine:flex" />
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
  loader: `import type { MediaSourceLoader } from "@/components/ui/media"

export const dashLoader: MediaSourceLoader = (media, src) => {
  if (!src.endsWith(".mpd")) {
    // not a DASH source: hand it to the browser
    media.src = src
    return () => media.removeAttribute("src")
  }
  const player = attachYourDashPlayer(media, src)
  return () => player.destroy()
}`,
  theming: `/* globals.css: constant across light and dark */
:root {
  --media-foreground: oklch(1 0 0); /* icons and text over video */
  --media-scrim: oklch(0 0 0); /* video ground and control glass */
}`,
  themeScope: `{/* a dark player on a light page */}
<div className="dark">
  <AudioPlayer src="/track.mp3" />
</div>

{/* a light player on a dark page, after the CSS change below */}
<div className="light">
  <AudioPlayer src="/track.mp3" />
</div>

{/* one token for one player */}
<AudioPlayer src="/track.mp3" frameClassName="[--primary:oklch(0.55_0.2_260)]" />`,
  themeLight: `/* globals.css: shadcn defines the light tokens on :root only */
:root,
.light {
  --background: oklch(1 0 0);
  /* the rest of your light tokens */
}`,
  package: `/* globals.css */
@import "tailwindcss";
@import "bobinejs/styles.css";

import { VideoPlayer, AudioPlayer } from "bobinejs"
/* bobinejs/hls needs hls.js: pnpm add hls.js */
import { hlsLoader } from "bobinejs/hls"
import { createMediaStore } from "bobinejs/core"`,
}

/** One shadcn command per registry item. */
export function installCommands(registry: string) {
  const add = (item: string) => `npx shadcn@latest add ${registry}/${item}.json`
  return {
    video: add("video-player"),
    audio: add("audio-player"),
    media: add("media"),
    hls: add("media-hls"),
    package: "pnpm add bobinejs",
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
      "Pass a loader for adaptive streams. The loader fetches hls.js only when an .m3u8 source appears. Browsers without Media Source Extensions, such as older iPhones, play HLS natively.",
  },
  package: {
    id: "package",
    title: "Or install the package",
    description:
      "Prefer a dependency over owning the source? The same components ship as bobinejs, with a framework-agnostic core. The players read shadcn theme tokens, so run npx shadcn@latest init first, or define background, foreground, card, muted, popover, primary and border yourself. For HLS, also add hls.js.",
  },
  loader: {
    id: "loader",
    title: "Custom loaders",
    description:
      "A loader attaches a source the browser cannot play natively, such as DASH. When you pass one, bobine leaves src off the element, so the loader must set media.src itself for any source it does not handle. Return a cleanup function. It runs when src changes or the player unmounts.",
  },
  theming: {
    id: "theming",
    title: "Theming",
    description:
      "The players read your shadcn theme tokens (background, foreground, muted, primary, border), so they follow your light and dark mode. Video controls use two more tokens that stay the same in both modes. To theme one player apart from the page, set the tokens on an element around it, such as a .dark or .light wrapper. The player keeps your colours, because it reads the same tokens. Requires React 19 and Tailwind CSS 4.",
  },
  api: {
    id: "api",
    title: "API",
    description: "Each player takes every native prop of the element it wraps, except controls. These are the extra props.",
  },
  agents: {
    id: "agents",
    title: "Use with agents",
    description:
      "Install the bobine skill so your coding agent knows the components, props and pitfalls. The full docs are also plain text at /llms-full.txt.",
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
  ["MediaSeek / MediaVolume", "Accessible sliders with scrubbing, buffering and keyboard steps. MediaVolume takes orientation=\"vertical\" for a popover."],
  ["MediaTime", "current, duration or remaining. toggle lets a click switch to remaining time and back."],
  ["MediaButton", "The base button the others are built from. Use it for your own controls."],
  [
    "Media*Button",
    "MediaPlayButton, MediaMuteButton, MediaCaptionsButton, MediaFullscreenButton, MediaPictureInPictureButton, MediaPlaybackRateButton.",
  ],
  ["MediaSettings", "Speed and caption track menu."],
  ["MediaCaptions", "Renders the active cue with your styles instead of the browser's."],
  ["MediaLoading / MediaErrorMessage", "Buffering indicator and a retryable error state."],
  ["useMedia(selector)", "Subscribe to any slice of state. Re-renders only when it changes."],
  ["useMediaStore()", "Imperative access: play, seek, setVolume, setTextTrack and more."],
]

export type SectionId = keyof typeof sections

/**
 * The docs pages, in reading order. The sidebar, the pager, the markdown
 * routes, the sitemap and llms.txt all read this list, so adding a page here
 * is the whole job outside its page.tsx.
 */
export const docPages = [
  {
    href: "/docs",
    md: "/docs.md",
    title: "Getting started",
    description: "Install bobine and swap your first video or audio element.",
    sections: ["video", "audio", "package", "agents"],
  },
  {
    href: "/docs/guides",
    md: "/docs/guides.md",
    title: "Guides",
    description: "Compose your own player, play adaptive streams, write a loader and theme the controls.",
    sections: ["compose", "streaming", "loader", "theming"],
  },
  {
    href: "/docs/reference",
    md: "/docs/reference.md",
    title: "Reference",
    description: "Every prop, part and keyboard shortcut.",
    sections: ["api", "parts", "keyboard"],
  },
] as const satisfies readonly { href: string; md: string; title: string; description: string; sections: readonly SectionId[] }[]

export type DocPage = (typeof docPages)[number]

/**
 * Pages read after the docs pages. Their content lives outside this file,
 * so they have no `docPages` entry, but the sidebar lists them and the pager
 * walks into them.
 */
export const docExtras = [{ href: "/docs/examples", title: "Examples" }] as const

/* the order the sidebar lists and the pager walks */
export const docsReadingOrder: readonly { href: string; title: string }[] = [...docPages, ...docExtras]

export function docPage(href: DocPage["href"]): DocPage {
  // every href in the union exists in the list, so the find cannot miss
  return docPages.find((page) => page.href === href) as DocPage
}

export type Prop = { name: string; type: string; description: string }

export const videoProps: readonly Prop[] = [
  { name: "className", type: "string", description: "Classes for the <video> element itself." },
  { name: "frameClassName", type: "string", description: "Classes for the outer frame. Use this for size, radius and placement." },
  {
    name: "tracks",
    type: "VideoTrack[]",
    description: "WebVTT caption or subtitle files: { src, label, srcLang, kind?, default? }. A default track is on at load.",
  },
  { name: "loader", type: "MediaSourceLoader", description: "Adapter for sources the browser cannot play natively, such as HLS." },
  {
    name: "metadata",
    type: "MediaInfo",
    description: "Title, artist, album and artwork for lock screens and OS media controls.",
  },
  { name: "persistKey", type: "string", description: "Remember volume, mute and speed in localStorage under this key." },
  { name: "tooltips", type: "boolean", description: "Small labels with their shortcut over the controls on hover and focus. On by default." },
]

export const audioProps: readonly Prop[] = [
  { name: "title", type: "ReactNode", description: "The main line beside the controls." },
  { name: "description", type: "ReactNode", description: "The muted line after the title." },
  { name: "artwork", type: "string", description: "Cover image beside the controls and in OS media controls." },
  { name: "showSpeed", type: "boolean", description: "Show a playback speed toggle, for podcasts and voice notes." },
  { name: "tooltips", type: "boolean", description: "Same as on VideoPlayer. On by default." },
  { name: "frameClassName", type: "string", description: "Classes for the outer frame. className targets the <audio> element." },
  { name: "loader", type: "MediaSourceLoader", description: "Same as on VideoPlayer." },
  { name: "metadata", type: "MediaInfo", description: "Overrides the metadata built from title, description and artwork." },
  { name: "persistKey", type: "string", description: "Same as on VideoPlayer." },
]

export const SKILL_INSTALL = "npx skills add SanyamPunia/bobine"

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
  { keys: ["0–9"], action: "Jump to 0–90%" },
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
  return `Add bobine media players to this React project.

1. Read ${origin}/llms-full.txt for the full bobine docs before you change code.
2. If the project has no components.json, run npx shadcn@latest init first. bobine needs React 19, Tailwind CSS 4 and shadcn theme tokens.
3. Install the video player with the shadcn CLI:
   ${cmd.video}
   For audio, also run: ${cmd.audio}
   For HLS streams, also run: ${cmd.hls}
4. Replace each <video controls> element with <VideoPlayer> from "@/components/ui/video-player". Keep src, poster, tracks and the other native props. Remove the controls attribute.
5. Replace each <audio controls> element with <AudioPlayer> from "@/components/ui/audio-player" in the same way.
6. For .m3u8 sources, pass loader={hlsLoader} from "@/lib/media-hls" in a client component.
7. Do not restyle the installed components unless I ask. They use the project's shadcn theme tokens.`
}
