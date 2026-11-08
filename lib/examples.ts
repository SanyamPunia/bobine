/**
 * Every word and snippet on /examples. The page renders it and
 * lib/markdown.ts turns the same data into /docs/examples.md, so the two never
 * drift. The live players exist in the page alone.
 */

export const examplesIntro = {
  title: "Examples",
  description: "Players built with reel, from a single prop to fully composed controls.",
  lede: "Try prop combinations in the playground, or copy a recipe that already fits.",
}

export const examplesSections = {
  playground: {
    id: "playground",
    title: "Playground",
    description: "Turn props on and off. The player and its code update together.",
  },
  video: {
    id: "video-recipes",
    title: "Video recipes",
    description: "Common jobs for VideoPlayer, each one a few props on the native element.",
  },
  audio: {
    id: "audio-recipes",
    title: "Audio recipes",
    description: "AudioPlayer adapts to its container, from a full card to a small pill.",
  },
} as const

export type Recipe = { id: string; title: string; description: string; code: string }

export const videoRecipes = {
  lesson: {
    id: "course-lesson",
    title: "Course lesson",
    description:
      "Captions on from the start, and a persistKey shared by every lesson, so a viewer's speed and volume carry over to the next one.",
    code: `<VideoPlayer
  src="/lessons/01.mp4"
  tracks={[
    {
      src: "/lessons/01.en.vtt",
      srcLang: "en",
      label: "English",
      default: true,
    },
  ]}
  persistKey="course"
/>`,
  },
  ambient: {
    id: "ambient-loop",
    title: "Ambient loop",
    description:
      "A quiet clip for a hero or a product shot. Browsers only autoplay muted video, and playsInline keeps iOS from opening it fullscreen.",
    code: `<VideoPlayer
  src="/hero.mp4"
  autoPlay
  muted
  loop
  playsInline
  tooltips={false}
/>`,
  },
  square: {
    id: "square-crop",
    title: "Square crop",
    description: "frameClassName sizes the frame and className styles the video, so object-cover fills a square for a feed.",
    code: `<VideoPlayer
  src="/clip.mp4"
  frameClassName="aspect-square max-w-sm"
  className="object-cover"
/>`,
  },
  minimal: {
    id: "minimal-controls",
    title: "Minimal controls",
    description:
      "Compose the parts yourself when a preset shows too much. This one keeps a play button while paused and a seek bar, nothing else.",
    code: `<MediaRoot className="aspect-video overflow-hidden rounded-xl bg-media-scrim text-media-foreground">
  <MediaVideo src="/clip.mp4" className="size-full object-cover" />
  <MediaSurface />
  <MediaPlayButton className="absolute inset-0 m-auto size-12 rounded-full bg-media-scrim/50 backdrop-blur-md group-data-playing/media:pointer-events-none group-data-playing/media:opacity-0" />
  <MediaSeek className="absolute inset-x-4 bottom-4" />
</MediaRoot>`,
  },
} satisfies Record<string, Recipe>

export const audioRecipes = {
  podcast: {
    id: "podcast-episode",
    title: "Podcast episode",
    description: "A title, the show's name and a speed toggle. persistKey keeps the chosen speed for the next episode.",
    code: `<AudioPlayer
  src="/episodes/12.mp3"
  title="Episode 12"
  description="Field notes"
  showSpeed
  persistKey="podcast"
/>`,
  },
  voice: {
    id: "voice-note",
    title: "Voice note",
    description: "No title and a rounded frame turn the card into a pill, the shape chat apps use for voice messages.",
    code: `<AudioPlayer
  src="/notes/voice.m4a"
  frameClassName="max-w-xs rounded-full"
/>`,
  },
  tracks: {
    id: "track-list",
    title: "Track list",
    description:
      "Native events pass straight through. onPlay pauses the other tracks, so only one plays at a time.",
    code: `type AudioEvent = React.SyntheticEvent<HTMLAudioElement>

function pauseOthers(event: AudioEvent) {
  for (const audio of document.querySelectorAll("audio")) {
    if (audio !== event.currentTarget) audio.pause()
  }
}

{tracks.map((track) => (
  <AudioPlayer
    key={track.src}
    src={track.src}
    title={track.title}
    description={track.artist}
    onPlay={pauseOthers}
    frameClassName="rounded-none border-0 border-b last:border-b-0"
  />
))}`,
  },
} satisfies Record<string, Recipe>

/** The demo tracks in the track list. They share one file. */
export const demoTracks = [
  { title: "Morning Drift", artist: "Demo track" },
  { title: "Low Tide", artist: "Demo track" },
  { title: "Paper Lanterns", artist: "Demo track" },
]

/**
 * The playground's toggles. `on` is the starting state. `hint` explains a
 * side effect the toggle has on another prop.
 */
export type PlaygroundToggle = { key: string; label: string; on: boolean; hint?: string }

export const videoToggles = [
  { key: "tracks", label: "tracks", on: true },
  { key: "autoPlay", label: "autoPlay", on: false, hint: "Browsers block autoplay with sound, so autoPlay turns on muted too." },
  { key: "muted", label: "muted", on: false },
  { key: "loop", label: "loop", on: true },
  { key: "tooltips", label: "tooltips", on: true },
  { key: "persistKey", label: "persistKey", on: false },
  { key: "square", label: "square crop", on: false },
] as const satisfies readonly PlaygroundToggle[]

export const audioToggles = [
  { key: "title", label: "title", on: true },
  { key: "description", label: "description", on: true },
  { key: "showSpeed", label: "showSpeed", on: true },
  { key: "loop", label: "loop", on: false },
  { key: "tooltips", label: "tooltips", on: true },
  { key: "persistKey", label: "persistKey", on: false },
  { key: "compact", label: "compact width", on: false, hint: "Below 24rem the title and the seek bar each take a full row." },
] as const satisfies readonly PlaygroundToggle[]

export type VideoToggleKey = (typeof videoToggles)[number]["key"]
export type AudioToggleKey = (typeof audioToggles)[number]["key"]

/** The code the playground shows for a set of video toggles. */
export function videoPlaygroundCode(on: Record<VideoToggleKey, boolean>): string {
  const lines = [`  src="/clip.mp4"`]
  if (on.tracks) {
    lines.push(`  tracks={[`, `    {`, `      src: "/clip.en.vtt",`, `      srcLang: "en",`, `      label: "English",`)
    lines.push(`      default: true,`, `    },`, `  ]}`)
  }
  const flags = [on.autoPlay && "autoPlay", (on.muted || on.autoPlay) && "muted", on.loop && "loop", on.autoPlay && "playsInline"]
  const native = flags.filter(Boolean).join(" ")
  if (native) lines.push(`  ${native}`)
  if (!on.tooltips) lines.push(`  tooltips={false}`)
  if (on.persistKey) lines.push(`  persistKey="reel"`)
  if (on.square) lines.push(`  frameClassName="aspect-square max-w-sm"`, `  className="object-cover"`)
  return `<VideoPlayer\n${lines.join("\n")}\n/>`
}

/** The code the playground shows for a set of audio toggles. */
export function audioPlaygroundCode(on: Record<AudioToggleKey, boolean>): string {
  const lines = [`  src="/track.mp3"`]
  if (on.title) lines.push(`  title="Morning Drift"`)
  if (on.description) lines.push(`  description="Demo track"`)
  if (on.showSpeed) lines.push(`  showSpeed`)
  if (on.loop) lines.push(`  loop`)
  if (!on.tooltips) lines.push(`  tooltips={false}`)
  if (on.persistKey) lines.push(`  persistKey="reel"`)
  if (on.compact) lines.push(`  frameClassName="max-w-xs"`)
  return `<AudioPlayer\n${lines.join("\n")}\n/>`
}
