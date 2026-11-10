---
name: bobine
description: Add or change bobine video and audio players in a React project. Use when replacing <video> or <audio> elements, installing bobine with the shadcn CLI, composing a custom player from bobine's Media* parts, playing HLS or other adaptive streams, or debugging a bobine player.
---

# bobine

bobine is a set of drop-in video and audio players for React. The shadcn CLI copies the source into the project, so the user owns and can edit every file. The players keep every native prop of `<video>` and `<audio>`.

The full docs are plain text at `https://bobine.fyi/llms-full.txt`. Read that file before a large change.

## When to use it

- The project uses React 19 and Tailwind CSS 4 with shadcn theme tokens.
- The user wants a styled player that matches their theme in light and dark.

Do not use bobine for a non-React app, for DRM-protected streams, or for a video editor or timeline.

## Install

If the project has no `components.json`, run `npx shadcn@latest init` first. The add command stops on a prompt without it.

```bash
npx shadcn@latest add https://bobine.fyi/r/video-player.json   # VideoPlayer
npx shadcn@latest add https://bobine.fyi/r/audio-player.json   # AudioPlayer
npx shadcn@latest add https://bobine.fyi/r/media.json          # unstyled Media* parts
npx shadcn@latest add https://bobine.fyi/r/media-hls.json      # hlsLoader for .m3u8
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
- `tooltips={false}` turns off the small labels with shortcuts over the controls. They are on by default.
- `AudioPlayer` also takes `title`, `description`, `artwork` and `showSpeed`.
- `AudioPlayer` follows the app's shadcn theme. `theme="light"` or `theme="dark"` pins it to a neutral palette, for a light player on a dark page or the reverse. Do not wrap it in a `.dark` or `.light` element for this.

## Streams and loaders

- For `.m3u8`, pass `loader={hlsLoader}` from `@/lib/media-hls`. Use it in a client component (`"use client"`). hls.js loads only when an HLS source appears. Browsers without Media Source Extensions, such as older iPhones, play HLS natively.
- A custom loader has the type `MediaSourceLoader`: `(media, src) => cleanup | void`. When a loader is set, bobine does not put `src` on the element. The loader must set `media.src` for any source it does not handle. Return a cleanup function.

## Compose a custom player

Use the parts from `@/components/ui/media` inside `<MediaRoot>`: `MediaVideo` or `MediaAudio`, `MediaSurface`, `MediaControls`, `MediaSeek`, `MediaVolume`, `MediaTime`, the `Media*Button` family, `MediaSettings`, `MediaCaptions`, `MediaLoading` and `MediaErrorMessage`. Read state with `useMedia(selector)` and act with `useMediaStore()`. Each part exports its props type as its name plus `Props` (`MediaSeekProps`, `AudioPlayerProps`), for wrappers that extend one.

`MediaRoot` exposes `data-paused`, `data-started`, `data-waiting`, `data-idle` and `data-fullscreen`. Style against them with the `group/media` variants instead of copying state into React.

## Common mistakes

- Size classes on `className` instead of `frameClassName`. The frame then does not resize.
- `hlsLoader` imported into a server component. Move the player into a client component.
- A custom loader that returns early for non-matching sources without setting `media.src`. Those sources then never play.
- Restyling the installed components without being asked. They already use the project's theme tokens.
- Keyboard shortcuts apply only to the focused player. This is by design, so several players can share a page.
