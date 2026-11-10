# bobine

Drop-in video and audio players for React. Swap `<video>` for `<VideoPlayer>` and keep every native prop.

<img src="https://raw.githubusercontent.com/SanyamPunia/bobine/main/.github/assets/video.webp" alt="VideoPlayer paused on a flower, with an English caption above the control bar" width="592">

Two ways to use it:

- **Own the source** (recommended): `npx shadcn@latest add https://bobine.fyi/r/video-player.json`
- **Install the package**: `pnpm add bobinejs`

Captions and playback speed share one settings menu:

<img src="https://raw.githubusercontent.com/SanyamPunia/bobine/main/.github/assets/video-settings.webp" alt="VideoPlayer with the settings menu open, showing speed options and caption tracks" width="592">

`AudioPlayer` takes your theme tokens, so it matches your app in light and dark:

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/SanyamPunia/bobine/main/.github/assets/audio-dark.webp">
  <img src="https://raw.githubusercontent.com/SanyamPunia/bobine/main/.github/assets/audio-light.webp" alt="AudioPlayer with a title, a seek bar, a speed toggle and a mute button" width="448">
</picture>

## Package setup

Requires React 19 and Tailwind CSS v4 with shadcn-style theme tokens (`--background`, `--foreground`, `--muted`, `--primary`, `--border`, …).

```css
@import "tailwindcss";
@import "bobinejs/styles.css";
```

## Usage

```tsx
import { VideoPlayer, AudioPlayer } from "bobinejs"

<VideoPlayer
  src="/clip.mp4"
  poster="/clip.jpg"
  tracks={[{ src: "/clip.en.vtt", label: "English", srcLang: "en", default: true }]}
  persistKey="bobine"
/>

<AudioPlayer src="/episode.mp3" title="Episode 12" description="Field notes" artwork="/cover.jpg" showSpeed />
```

### HLS

```tsx
"use client"
import { VideoPlayer } from "bobinejs"
import { hlsLoader } from "bobinejs/hls" // requires `hls.js`, loaded on demand

<VideoPlayer src="https://example.com/stream.m3u8" loader={hlsLoader} />
```

### Compose your own

```tsx
import { MediaRoot, MediaVideo, MediaSurface, MediaControls, MediaSeek, MediaPlayButton, MediaTime } from "bobinejs"

<MediaRoot className="aspect-video bg-media-scrim text-media-foreground">
  <MediaVideo src="/clip.mp4" className="size-full" />
  <MediaSurface />
  <MediaControls className="absolute inset-x-3 bottom-3 flex-col">
    <MediaSeek />
    <div className="flex items-center gap-1">
      <MediaPlayButton />
      <MediaTime /> / <MediaTime type="duration" />
    </div>
  </MediaControls>
</MediaRoot>
```

### Types

Every component exports its props type under its own name plus `Props`, so a
wrapper can extend it.

```tsx
import { AudioPlayer, type AudioPlayerProps } from "bobinejs"

function EpisodePlayer(props: AudioPlayerProps) {
  return <AudioPlayer showSpeed persistKey="episodes" {...props} />
}
```

`MediaState`, `MediaStore` and `MediaInfo` type the store and its metadata.

### Framework-agnostic core

`bobinejs/core` exports `createMediaStore()`, a dependency-free store you can `attach` to any `HTMLMediaElement`.

```ts
import { createMediaStore } from "bobinejs/core"

const store = createMediaStore()
store.attach(document.querySelector("video")!)
store.subscribe(() => console.log(store.getState().currentTime))
```

## Keyboard

| Key | Action |
| --- | --- |
| Space / K | Play or pause |
| J / L | Seek 10s |
| ← / → | Seek 5s |
| ↑ / ↓ | Volume |
| 0–9 | Jump to 0–90% |
| Home / End | Start / end |
| M | Mute |
| C | Captions |
| I | Picture-in-picture |
| F | Fullscreen |

Shortcuts only apply to the focused player.

## License

MIT
