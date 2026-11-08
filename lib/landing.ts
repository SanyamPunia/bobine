/**
 * The landing page copy, read by `app/page.tsx` and by `lib/markdown.ts` for
 * `/index.md`. Icons stay in the page and map onto `key`.
 */

export const landing = {
  title: "The media player your browser should have shipped.",
  lede: "Drop-in video and audio players for React. Same props as the native elements, calmer controls, and source code that lives in your repo.",
  swap: {
    id: "swap",
    title: "Swap one tag",
    description:
      "Keep your sources, posters and caption tracks. Drop the controls attribute and change the element name.",
    before: `<video src="/clip.mp4" poster="/clip.jpg" controls />`,
    after: `import { VideoPlayer } from "@/components/ui/video-player"

<VideoPlayer src="/clip.mp4" poster="/clip.jpg" />`,
  },
  features: {
    id: "features",
    title: "What you get",
    description: "What the players do without extra setup.",
    items: [
      { key: "props", title: "Native props", description: "Every attribute you put on a video or audio element works unchanged." },
      { key: "source", title: "Source you own", description: "The shadcn CLI copies the components into your repo. Edit any line." },
      { key: "keyboard", title: "Keyboard first", description: "Space, J, K, L, arrows and more, scoped to the focused player." },
      { key: "streams", title: "Adaptive streams", description: "Add the HLS loader. hls.js loads only when an .m3u8 source appears." },
      { key: "theme", title: "Your theme", description: "Styled with your tokens, so it matches your app in light and dark." },
      { key: "compose", title: "Composable", description: "Unstyled parts and a selector hook for when the defaults do not fit." },
    ],
  },
  audio: {
    id: "audio",
    title: "Audio too",
    description: "The audio player is built from the same parts, so both feel like one set.",
  },
  start: {
    title: "Start in the docs",
    description: "Install commands, composition, streaming, every part and every shortcut.",
  },
} as const

export type FeatureKey = (typeof landing.features.items)[number]["key"]
