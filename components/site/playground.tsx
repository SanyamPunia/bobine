"use client"

import * as React from "react"
import { CheckIcon, PlusIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import {
  audioPlaygroundCode,
  audioToggles,
  videoPlaygroundCode,
  videoToggles,
  type AudioToggleKey,
  type PlaygroundToggle,
  type VideoToggleKey,
} from "@/lib/examples"
import { AudioPlayer } from "@/components/ui/audio-player"
import { VideoPlayer } from "@/components/ui/video-player"
import { CodeBlock } from "@/components/site/code-block"
import { swapIcon } from "@/components/site/copy-swap-icon"
import { Demo } from "@/components/site/demo"

type Kind = "video" | "audio"

function initial<K extends string>(toggles: readonly { key: K; on: boolean }[]) {
  return Object.fromEntries(toggles.map((t) => [t.key, t.on])) as Record<K, boolean>
}

const focus = "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"

/** One prop as a pressable chip. The icon swap is the cue besides colour. */
function PropChip({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onToggle}
      className={cn(
        "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full pr-3 pl-2.5 font-mono text-meta ring-1 transition-[color,background-color,box-shadow,scale] duration-150 motion-safe:active:scale-[0.96]",
        focus,
        on
          ? "bg-fill text-text-primary ring-stroke"
          : "text-text-secondary ring-stroke-soft hover:bg-fill-hover hover:text-text-primary"
      )}
    >
      <span aria-hidden="true" className="grid *:col-start-1 *:row-start-1">
        <CheckIcon weight="bold" className={cn("size-3", swapIcon(on))} />
        <PlusIcon weight="bold" className={cn("size-3", swapIcon(!on))} />
      </span>
      {label}
    </button>
  )
}

function Chips<K extends string>({
  toggles,
  state,
  onToggle,
}: {
  toggles: readonly (PlaygroundToggle & { key: K })[]
  state: Record<K, boolean>
  onToggle: (key: K) => void
}) {
  return (
    <div role="group" aria-label="Props" className="flex flex-wrap gap-2">
      {toggles.map((t) => (
        <PropChip key={t.key} label={t.label} on={state[t.key]} onToggle={() => onToggle(t.key)} />
      ))}
    </div>
  )
}

const tracks = [{ src: "/media/flower.en.vtt", label: "English", srcLang: "en", default: true }]

export function Playground() {
  const [kind, setKind] = React.useState<Kind>("video")
  const [video, setVideo] = React.useState(() => initial<VideoToggleKey>(videoToggles))
  const [audio, setAudio] = React.useState(() => initial<AudioToggleKey>(audioToggles))

  const toggleVideo = (key: VideoToggleKey) =>
    setVideo((prev) => {
      const next = { ...prev, [key]: !prev[key] }

      /* autoplay with sound is blocked, so autoPlay brings muted along */
      if (key === "autoPlay" && next.autoPlay) next.muted = true
      if (key === "muted" && !next.muted) next.autoPlay = false
      return next
    })
  const toggleAudio = (key: AudioToggleKey) => setAudio((prev) => ({ ...prev, [key]: !prev[key] }))

  const toggles: readonly PlaygroundToggle[] = kind === "video" ? videoToggles : audioToggles
  const state: Record<string, boolean> = kind === "video" ? video : audio
  const hints = toggles.filter((t) => t.hint && state[t.key]).map((t) => t.hint)

  return (
    <div className="flex flex-col gap-4">
      <div role="group" aria-label="Player" className="inline-flex self-start rounded-full bg-fill p-0.5">
        {(["video", "audio"] as const).map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={kind === k}
            onClick={() => setKind(k)}
            className={cn(
              "h-7 cursor-pointer rounded-full px-3 text-action transition-[color,background-color,box-shadow] duration-150",
              focus,
              kind === k
                ? "bg-bg text-text-primary shadow-sm ring-1 ring-stroke-soft"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            {k === "video" ? "VideoPlayer" : "AudioPlayer"}
          </button>
        ))}
      </div>

      {kind === "video" ? (
        <Demo bleed={!video.square}>
          {/* native attributes like autoPlay and muted apply on mount, so a
              change to them mounts a fresh player */}
          <VideoPlayer
            key={`${video.autoPlay}-${video.muted}-${video.tracks}`}
            src="/media/flower.mp4"
            aria-label="Demo video of a blooming flower"
            tracks={video.tracks ? tracks : undefined}
            autoPlay={video.autoPlay}
            muted={video.muted}
            loop={video.loop}
            playsInline={video.autoPlay}
            tooltips={video.tooltips}
            persistKey={video.persistKey ? "reel-playground" : undefined}
            frameClassName={video.square ? "aspect-square max-w-sm" : undefined}
            className={video.square ? "object-cover" : undefined}
          />
        </Demo>
      ) : (
        <Demo>
          <AudioPlayer
            src="/media/track.mp3"
            title={audio.title ? "Morning Drift" : undefined}
            description={audio.description ? "Demo track" : undefined}
            showSpeed={audio.showSpeed}
            loop={audio.loop}
            tooltips={audio.tooltips}
            persistKey={audio.persistKey ? "reel-playground" : undefined}
            frameClassName={cn("max-w-md bg-bg", audio.compact && "max-w-xs")}
          />
        </Demo>
      )}

      <div className="flex flex-col gap-2.5">
        {kind === "video" ? (
          <Chips toggles={videoToggles} state={video} onToggle={toggleVideo} />
        ) : (
          <Chips toggles={audioToggles} state={audio} onToggle={toggleAudio} />
        )}

        {/* mounted empty, so a hint that appears is announced */}
        <p role="status" className="text-meta text-pretty text-text-secondary empty:-mt-2.5">
          {hints.join(" ")}
        </p>
      </div>

      <CodeBlock code={kind === "video" ? videoPlaygroundCode(video) : audioPlaygroundCode(audio)} />
    </div>
  )
}
