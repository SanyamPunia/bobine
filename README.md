# reel

Drop-in video and audio players for React. Swap `<video>` for `<VideoPlayer>` and keep every native prop.

## Install

Copy the source into your project with the shadcn CLI:

```bash
npx shadcn@latest add <docs-host>/r/video-player.json
```

Other items: `audio-player`, `media` (unstyled primitives), `media-hls` (HLS loader).

Or install the package:

```bash
pnpm add reel-media
```

## Use

```tsx
import { VideoPlayer } from "@/components/ui/video-player"

<VideoPlayer src="/clip.mp4" poster="/clip.jpg" />
```

Full docs, live demos, parts and keyboard shortcuts are at `/docs`. Package details are in [packages/reel](packages/reel/README.md).

## For agents

Install the skill so your coding agent knows the components, props and common mistakes:

```bash
npx skills add SanyamPunia/reel
```

The skill lives in [skills/reel](skills/reel/SKILL.md). The site also serves:

- `/llms.txt`: index of the docs and registry
- `/llms-full.txt`: the full docs in one file
- `/docs.md`: the docs page as Markdown

## Develop

```bash
pnpm install
pnpm dev     # site on localhost:3000
pnpm test    # vitest
pnpm build   # registry JSON, then the Next.js build
```

## License

MIT
