---
name: reel
description: Add or change reel video and audio players in a React project. Use when replacing <video> or <audio> elements, installing reel with the shadcn CLI, composing a custom player from reel's Media* parts, playing HLS or other adaptive streams, or debugging a reel player.
---

# reel

reel is a set of drop-in video and audio players for React. The shadcn CLI copies the source into the project, so the user owns and can edit every file. The players keep every native prop of `<video>` and `<audio>`.

The full docs are plain text at `<docs-host>/llms-full.txt`. Read that file before a large change. If you do not know the docs host, ask the user.

## When to use it

- The project uses React 19 and Tailwind CSS 4 with shadcn theme tokens.
- The user wants a styled player that matches their theme in light and dark.

Do not use reel for a non-React app, for DRM-protected streams, or for a video editor or timeline.

## Install

```bash
npx shadcn@latest add <docs-host>/r/video-player.json   # VideoPlayer
npx shadcn@latest add <docs-host>/r/audio-player.json   # AudioPlayer
npx shadcn@latest add <docs-host>/r/media.json          # unstyled Media* parts
npx shadcn@latest add <docs-host>/r/media-hls.json      # hlsLoader for .m3u8
```

## Replace a native element

1. Import `VideoPlayer` from `@/components/ui/video-player`, or `AudioPlayer` from `@/components/ui/audio-player`.
2. Change the element name. Keep `src`, `poster`, `loop`, `muted`, `preload` and the other native props.
3. Remove the `controls` attribute. The player draws its own controls.
4. Move `<track>` children into the `tracks` prop: `[{ src, label, srcLang, kind?, default? }]`.

```tsx
<VideoPlayer src="/clip.mp4" poster="/clip.jpg" tracks={[{ src: "/clip.en.vtt", label: "English", srcLang: "en" }]} />
```

## Props to know

- `className` styles the media element. `frameClassName` styles the outer frame. Put size, radius and layout classes on `frameClassName`.
- `metadata` sets the title, artist, album and artwork in OS media controls and lock screens.
- `persistKey` remembers volume, mute and speed in localStorage.
- `AudioPlayer` also takes `title`, `description`, `artwork` and `showSpeed`.

## Streams and loaders

- For `.m3u8`, pass `loader={hlsLoader}` from `@/lib/media-hls`. Use it in a client component (`"use client"`). hls.js loads only when an HLS source appears, and Safari plays HLS natively.
- A custom loader has the type `MediaSourceLoader`: `(media, src) => cleanup | void`. When a loader is set, reel does not put `src` on the element. The loader must set `media.src` for any source it does not handle. Return a cleanup function.

## Compose a custom player

Use the parts from `@/components/ui/media` inside `<MediaRoot>`: `MediaVideo` or `MediaAudio`, `MediaSurface`, `MediaControls`, `MediaSeek`, `MediaVolume`, `MediaTime`, the `Media*Button` family, `MediaSettings`, `MediaCaptions`, `MediaLoading` and `MediaErrorMessage`. Read state with `useMedia(selector)` and act with `useMediaStore()`.

`MediaRoot` exposes `data-paused`, `data-started`, `data-waiting`, `data-idle` and `data-fullscreen`. Style against them with the `group/media` variants instead of copying state into React.

## Common mistakes

- Size classes on `className` instead of `frameClassName`. The frame then does not resize.
- `hlsLoader` imported into a server component. Move the player into a client component.
- A custom loader that returns early for non-matching sources without setting `media.src`. Those sources then never play.
- Restyling the installed components without being asked. They already use the project's theme tokens.
- Keyboard shortcuts apply only to the focused player. This is by design, so several players can share a page.
