<div align="center">

<img src="app/icon.svg" width="56" height="56" alt="">

<h1>bobine</h1>

<p>Drop-in video and audio players for React.<br>Swap <code>&lt;video&gt;</code> for <code>&lt;VideoPlayer&gt;</code> and keep every native prop.</p>

<p>
  <a href="https://www.npmjs.com/package/bobinejs"><img src="https://img.shields.io/npm/v/bobinejs?style=flat&labelColor=27272a&color=9fb3ea" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/bobinejs"><img src="https://img.shields.io/npm/dm/bobinejs?style=flat&labelColor=27272a&color=9fb3ea" alt="npm downloads"></a>
  <a href="LICENSE"><img src="https://img.shields.io/npm/l/bobinejs?style=flat&labelColor=27272a&color=9fb3ea" alt="MIT license"></a>
  <a href="https://bobine.fyi/r/registry.json"><img src="https://img.shields.io/badge/shadcn-registry-9fb3ea?style=flat&labelColor=27272a&logo=shadcnui&logoColor=white" alt="shadcn registry"></a>
  <a href="https://bobine.fyi/docs"><img src="https://img.shields.io/badge/docs-bobine.fyi-9fb3ea?style=flat&labelColor=27272a" alt="Documentation"></a>
</p>

<p>
  <a href="https://bobine.fyi/docs"><strong>Docs</strong></a> |
  <a href="https://bobine.fyi/docs/examples"><strong>Examples</strong></a> |
  <a href="https://bobine.fyi/docs/reference"><strong>Reference</strong></a> |
  <a href="https://www.npmjs.com/package/bobinejs"><strong>npm</strong></a>
</p>

<br>

<img src=".github/assets/video.webp" alt="VideoPlayer paused on a flower, with an English caption above the control bar" width="592">

</div>

## Features

- **Native props.** Every attribute you put on a video or audio element works unchanged.
- **Source you own.** The shadcn CLI copies the components into your repo. Edit any line.
- **Keyboard first.** Space, J, K, L, arrows and more, scoped to the focused player.
- **Adaptive streams.** Add the HLS loader. hls.js loads only when an `.m3u8` source appears.
- **Your theme.** Styled with your tokens, so it matches your app in light and dark.
- **Composable.** Unstyled parts and a selector hook for when the defaults do not fit.

## Install

Copy the source into your project with the shadcn CLI:

```bash
npx shadcn@latest add https://bobine.fyi/r/video-player.json
```

| Item | What you get |
| --- | --- |
| `video-player` | `<VideoPlayer>` with auto-hiding controls, captions and a settings menu |
| `audio-player` | `<AudioPlayer>` that follows your theme tokens |
| `media` | The store and unstyled parts, to compose your own player |
| `media-hls` | The HLS loader. hls.js loads on demand, and Safari plays natively |

Or install the package. It needs React 19 and Tailwind CSS v4.

```bash
pnpm add bobinejs
```

Setup for the package is in [packages/bobine](packages/bobine/README.md).

## Use

Change the element name and drop `controls`. Sources, posters and caption tracks stay as they are.

```tsx
import { VideoPlayer } from "@/components/ui/video-player"

<VideoPlayer
  src="/clip.mp4"
  poster="/clip.jpg"
  tracks={[{ src: "/clip.en.vtt", label: "English", srcLang: "en", default: true }]}
/>
```

Captions and playback speed share one settings menu:

<img src=".github/assets/video-settings.webp" alt="VideoPlayer with the settings menu open, showing speed options and caption tracks" width="592">

The audio player uses the same parts:

```tsx
import { AudioPlayer } from "@/components/ui/audio-player"

<AudioPlayer src="/episode.mp3" title="Morning Drift" description="Demo track" showSpeed />
```

<p>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset=".github/assets/audio-dark.webp">
    <img src=".github/assets/audio-light.webp" alt="AudioPlayer with a title, a seek bar, a speed toggle and a mute button" width="448">
  </picture>
</p>

Composition, streaming, every part and every keyboard shortcut are in the [docs](https://bobine.fyi/docs).

## For agents

Install the skill so your coding agent knows the components, props and common mistakes:

```bash
npx skills add SanyamPunia/bobine
```

The skill lives in [skills/bobine](skills/bobine/SKILL.md). The site also serves:

- [`/llms.txt`](https://bobine.fyi/llms.txt): index of the docs and registry
- [`/llms-full.txt`](https://bobine.fyi/llms-full.txt): the full docs in one file
- [`/docs.md`](https://bobine.fyi/docs.md): the docs page as Markdown

## Develop

```bash
pnpm install
pnpm dev     # site on localhost:3000
pnpm test    # vitest
pnpm build   # registry JSON, then the Next.js build
```

## License

[MIT](LICENSE)
