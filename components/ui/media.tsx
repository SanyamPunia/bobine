"use client"

import * as React from "react"

import {
  createMediaStore,
  describeMediaError,
  formatTime,
  type MediaInfo,
  type MediaState,
  type MediaStore,
} from "@/lib/media-store"
import { cn } from "@/lib/utils"
import {
  CaptionsIcon,
  CheckIcon,
  EnterFullscreenIcon,
  ExitFullscreenIcon,
  PauseIcon,
  PictureInPictureIcon,
  PlayIcon,
  RetryIcon,
  SeekIcon,
  SettingsIcon,
  VolumeIcon,
} from "@/components/ui/media-icons"

const MediaContext = React.createContext<MediaStore | null>(null)

/** Root options the parts read: whether to show tooltips and shortcut hints. */
const MediaOptionsContext = React.createContext({ tooltips: false, hotkeys: false })

function useMediaStore() {
  const store = React.useContext(MediaContext)
  if (!store) throw new Error("Media components must be rendered inside <MediaRoot>.")
  return store
}

function useMedia<T>(selector: (state: MediaState) => T): T {
  const store = useMediaStore()
  return React.useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getServerState())
  )
}

function useComposedRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(composeRefs(...refs), refs)
}

function composeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    const cleanups = refs.map((ref) => {
      if (typeof ref === "function") return ref(node)
      if (ref) (ref as React.RefObject<T | null>).current = node
    })
    return () => {
      cleanups.forEach((cleanup, i) => {
        const ref = refs[i]
        if (typeof cleanup === "function") cleanup()
        else if (typeof ref === "function") ref(null)
        else if (ref) (ref as React.RefObject<T | null>).current = null
      })
    }
  }
}

const clamp = (value: number) => Math.min(Math.max(value, 0), 1)

/* ---------------------------------- Root ---------------------------------- */

type MediaRootProps = React.ComponentProps<"div"> & {
  /** Milliseconds of pointer inactivity before controls hide during playback. */
  idleTimeout?: number
  /** Remember volume, mute and speed in localStorage under this key. */
  persistKey?: string
  /** Title, artist and artwork for OS media controls (Media Session API). */
  metadata?: MediaInfo
  /** Enable keyboard shortcuts while focus is inside the player. */
  hotkeys?: boolean
  /** Small labels over the buttons on hover and keyboard focus, with their shortcut. */
  tooltips?: boolean
}

// Keep the controls awake while the pointer rests on them or a menu is open.
const SETTINGS_OPEN = "[data-slot='media-settings'][data-open]"

/**
 * Hovering the control bar keeps it awake, but only on a device that can
 * hover. On touch, `:hover` sticks to the last tapped control, so the bar would
 * never sleep after a tap.
 */
const holdAwakeSelector = () =>
  window.matchMedia("(hover: hover)").matches ? `[data-slot='media-controls']:hover, ${SETTINGS_OPEN}` : SETTINGS_OPEN

function MediaRoot({
  className,
  idleTimeout = 2000,
  persistKey,
  metadata,
  hotkeys = true,
  tooltips = false,
  onPointerMove,
  onPointerDown,
  onPointerLeave,
  onKeyDown,
  ref,
  ...props
}: MediaRootProps) {
  const [store] = React.useState(() => createMediaStore({ persistKey }))
  const [active, setActive] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const rootEl = React.useRef<HTMLDivElement>(null)

  const state = React.useSyncExternalStore(store.subscribe, store.getState, store.getServerState)
  const rootRef = useComposedRefs(ref, rootEl, store.setContainer)
  const options = React.useMemo(() => ({ tooltips, hotkeys }), [tooltips, hotkeys])

  React.useEffect(() => () => clearTimeout(timer.current), [])

  const { title, artist, album, artwork } = metadata ?? {}
  const artworkKey = JSON.stringify(artwork ?? null)
  React.useEffect(() => {
    store.setMetadata(title || artist || album ? { title, artist, album, artwork: JSON.parse(artworkKey) ?? undefined } : null)
  }, [store, title, artist, album, artworkKey])

  const wake = () => {
    setActive(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(function sleep() {
      if (rootEl.current?.querySelector(holdAwakeSelector())) {
        timer.current = setTimeout(sleep, idleTimeout)
        return
      }
      setActive(false)
    }, idleTimeout)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (!hotkeys || event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return
    const target = event.target as HTMLElement
    if (target.closest("input, textarea, select, [contenteditable='true'], [data-slot='media-settings']")) return
    const onButton = target.tagName === "BUTTON"

    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
    const keymap: Record<string, () => void> = {
      " ": () => store.toggle(),
      k: () => store.toggle(),
      j: () => store.seekBy(-10),
      l: () => store.seekBy(10),
      ArrowLeft: () => store.seekBy(-5),
      ArrowRight: () => store.seekBy(5),
      ArrowUp: () => store.setVolume(store.getState().volume + 0.1),
      ArrowDown: () => store.setVolume(store.getState().volume - 0.1),
      m: () => store.toggleMute(),
      f: () => store.toggleFullscreen(),
      c: () => store.toggleCaptions(),
      i: () => store.togglePictureInPicture(),
      Home: () => store.seek(0),
      End: () => store.seekToRatio(1),
    }
    for (let digit = 0; digit <= 9; digit++) {
      keymap[String(digit)] = () => store.seekToRatio(digit / 10)
    }
    const action = keymap[key]
    if (!action || (key === " " && onButton)) return
    event.preventDefault()
    action()
    wake()
  }

  const idle = !active && !state.paused

  return (
    <MediaContext.Provider value={store}>
      <MediaOptionsContext.Provider value={options}>
        <div
          ref={rootRef}
          data-slot="media-root"
          data-paused={state.paused || undefined}
          data-playing={!state.paused || undefined}
          data-started={state.started || undefined}
          data-waiting={state.waiting || undefined}
          data-fullscreen={state.fullscreen || undefined}
          data-error={state.error ? "" : undefined}
          data-captions={state.textTrack !== -1 && state.cues.length > 0 ? "" : undefined}
          data-idle={idle || undefined}
          data-active={active || undefined}
          className={cn(
            /* no gray tap flash, no long-press callout over the video, and no
               double-tap-zoom wait before a tap registers */
            "group/media relative isolate touch-manipulation [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none]",
            idle && "cursor-none",
            className
          )}
          onPointerMove={(event) => {
            onPointerMove?.(event)
            if (event.pointerType === "mouse") wake()
          }}
          onPointerDown={(event) => {
            onPointerDown?.(event)
            wake()
          }}
          onPointerLeave={(event) => {
            onPointerLeave?.(event)

            /**
             * A finger lifting fires pointerleave too, so hiding here on touch
             * flashed the controls off after every tap and made the next tap
             * only reveal them. On touch the idle timer hides them instead.
             */
            if (event.pointerType !== "mouse") return
            clearTimeout(timer.current)
            setActive(false)
          }}
          onKeyDown={handleKeyDown}
          {...props}
        />
      </MediaOptionsContext.Provider>
    </MediaContext.Provider>
  )
}

/* --------------------------------- Media ---------------------------------- */

/**
 * Attaches a source the element can't play natively (HLS, DASH, MSE).
 * Return a cleanup function to tear the adapter down when `src` changes.
 */
type MediaSourceLoader = (media: HTMLMediaElement, src: string) => void | (() => void)

type MediaElementProps<T> = T & {
  /** Custom source adapter, e.g. `hlsLoader` from `@/lib/media-hls`. */
  loader?: MediaSourceLoader
}

function useMediaElement<E extends HTMLMediaElement>(
  ref: React.Ref<E> | undefined,
  src: string | undefined,
  loader: MediaSourceLoader | undefined
) {
  const store = useMediaStore()
  const mediaRef = useComposedRefs(ref, store.attach)

  React.useEffect(() => {
    const media = store.getMedia()
    if (!loader || !src || !media) return
    return loader(media, src) ?? undefined
  }, [store, loader, src])

  return { mediaRef }
}

type MediaVideoProps = MediaElementProps<React.ComponentProps<"video">>

function MediaVideo({ className, ref, src, loader, ...props }: MediaVideoProps) {
  const media = useMediaElement(ref, typeof src === "string" ? src : undefined, loader)
  return (
    <video
      ref={media.mediaRef}
      data-slot="media-video"
      playsInline
      preload="metadata"
      {...props}
      src={loader ? undefined : src}
      controls={false}
      className={cn("block", className)}
    />
  )
}

type MediaAudioProps = MediaElementProps<React.ComponentProps<"audio">>

function MediaAudio({ ref, src, loader, ...props }: MediaAudioProps) {
  const media = useMediaElement(ref, typeof src === "string" ? src : undefined, loader)
  return (
    <audio
      ref={media.mediaRef}
      data-slot="media-audio"
      preload="metadata"
      {...props}
      src={loader ? undefined : src}
      controls={false}
    />
  )
}

/* -------------------------------- Controls -------------------------------- */

/* on touch, an invisible 36px hit area around the 28px button; looks the same */
const buttonClass =
  "pointer-coarse:after:absolute pointer-coarse:after:-inset-1 pointer-coarse:after:content-[''] group/media-button relative inline-grid size-7 shrink-0 cursor-pointer place-items-center rounded-md outline-none transition-[background-color,scale,opacity] duration-150 ease-media hover:bg-current/15 focus-visible:ring-2 focus-visible:ring-current/60 motion-safe:enabled:active:scale-[0.96] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:shrink-0"

type MediaTooltipAlign = "start" | "center" | "end"

/**
 * The label over a control. Decorative: the control already carries the same
 * text as its accessible name. Hover shows it after a short delay and hides it
 * at once; keyboard focus shows it straight away. Touch never shows it, since
 * the hover variants only apply to pointers that can hover.
 */
function MediaTooltip({ label, shortcut, align = "center" }: { label: React.ReactNode; shortcut?: string; align?: MediaTooltipAlign }) {
  const { tooltips, hotkeys } = React.useContext(MediaOptionsContext)
  if (!tooltips || !label) return null
  return (
    <span
      aria-hidden="true"
      data-slot="media-tooltip"
      className={cn(
        "pointer-events-none absolute bottom-full mb-2 flex items-center gap-1.5 rounded-md bg-foreground px-1.5 py-0.5 text-[11px] leading-4 font-medium whitespace-nowrap text-background opacity-0",
        "transition-[opacity,translate] duration-150 ease-media motion-safe:translate-y-0.5 motion-reduce:transition-none",
        "group-hover/media-button:translate-y-0 group-hover/media-button:opacity-100 group-hover/media-button:delay-300",
        "group-focus-visible/media-button:translate-y-0 group-focus-visible/media-button:opacity-100",
        "group-aria-expanded/media-button:hidden",
        align === "start" && "left-0",
        align === "center" && "left-1/2 -translate-x-1/2",
        align === "end" && "right-0"
      )}
    >
      {label}
      {hotkeys && shortcut && <kbd className="font-mono opacity-60">{shortcut}</kbd>}
    </span>
  )
}

type MediaButtonProps = React.ComponentProps<"button"> & {
  /** Tooltip text, shown when the root has `tooltips`. `false` hides it. */
  tooltip?: React.ReactNode
  /** Shortcut shown beside the tooltip when the root has `hotkeys`. */
  shortcut?: string
  /** Pin the tooltip to an edge for buttons at either end of a bar. */
  tooltipAlign?: MediaTooltipAlign
}

function MediaButton({ className, type = "button", tooltip, shortcut, tooltipAlign, children, ...props }: MediaButtonProps) {
  return (
    <button type={type} data-slot="media-button" className={cn(buttonClass, className)} {...props}>
      {children}
      <MediaTooltip label={tooltip} shortcut={shortcut} align={tooltipAlign} />
    </button>
  )
}

function IconSwap({ show, a, b }: { show: "a" | "b"; a: React.ReactNode; b: React.ReactNode }) {
  const layer =
    "col-start-1 row-start-1 grid place-items-center transition-[opacity,scale,filter] duration-200 ease-media motion-reduce:transition-none"
  return (
    <span className="grid">
      <span className={cn(layer, show === "a" ? "opacity-100" : "scale-50 opacity-0 blur-[2px]")}>{a}</span>
      <span className={cn(layer, show === "b" ? "opacity-100" : "scale-50 opacity-0 blur-[2px]")}>{b}</span>
    </span>
  )
}

function MediaPlayButton({ onClick, ...props }: MediaButtonProps) {
  const store = useMediaStore()
  const paused = useMedia((s) => s.paused)
  return (
    <MediaButton
      aria-label={paused ? "Play" : "Pause"}
      tooltip={paused ? "Play" : "Pause"}
      shortcut="K"
      onClick={(event) => {
        onClick?.(event)
        store.toggle()
      }}
      {...props}
    >
      <IconSwap show={paused ? "a" : "b"} a={<PlayIcon />} b={<PauseIcon />} />
    </MediaButton>
  )
}

function MediaMuteButton({ onClick, ...props }: MediaButtonProps) {
  const store = useMediaStore()
  const muted = useMedia((s) => s.muted || s.volume === 0)
  return (
    <MediaButton
      aria-label={muted ? "Unmute" : "Mute"}
      tooltip={muted ? "Unmute" : "Mute"}
      shortcut="M"
      onClick={(event) => {
        onClick?.(event)
        store.toggleMute()
      }}
      {...props}
    >
      <VolumeIcon muted={muted} />
    </MediaButton>
  )
}

function MediaFullscreenButton({ onClick, ...props }: MediaButtonProps) {
  const store = useMediaStore()
  const fullscreen = useMedia((s) => s.fullscreen)
  return (
    <MediaButton
      aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      tooltip={fullscreen ? "Exit fullscreen" : "Fullscreen"}
      shortcut="F"
      onClick={(event) => {
        onClick?.(event)
        store.toggleFullscreen()
      }}
      {...props}
    >
      <IconSwap show={fullscreen ? "b" : "a"} a={<EnterFullscreenIcon />} b={<ExitFullscreenIcon />} />
    </MediaButton>
  )
}

const subscribeNoop = () => () => {}

function MediaPictureInPictureButton({ onClick, ...props }: MediaButtonProps) {
  const store = useMediaStore()
  const active = useMedia((s) => s.pictureInPicture)
  const supported = React.useSyncExternalStore(
    subscribeNoop,
    () => "pictureInPictureEnabled" in document && document.pictureInPictureEnabled,
    () => false
  )
  if (!supported) return null
  return (
    <MediaButton
      aria-label={active ? "Exit picture in picture" : "Enter picture in picture"}
      aria-pressed={active}
      tooltip={active ? "Exit picture in picture" : "Picture in picture"}
      shortcut="I"
      onClick={(event) => {
        onClick?.(event)
        store.togglePictureInPicture()
      }}
      {...props}
    >
      <PictureInPictureIcon />
    </MediaButton>
  )
}

type MediaPlaybackRateButtonProps = MediaButtonProps & {
  /** Speeds a click cycles through, in order. */
  rates?: number[]
}

function MediaPlaybackRateButton({
  rates = [1, 1.25, 1.5, 2, 0.75],
  className,
  style,
  onClick,
  ...props
}: MediaPlaybackRateButtonProps) {
  const store = useMediaStore()
  const rate = useMedia((s) => s.playbackRate)

  /**
   * Sized for the longest label, so cycling 1x to 0.75x never moves the
   * controls beside it. The font is mono, so characters measure exactly. A
   * variable rather than an inline width, so a w-* class still overrides it.
   */
  const chars = Math.max(...[...rates, rate].map((r) => `${r}×`.length))
  return (
    <MediaButton
      aria-label={`Playback speed ${rate}x`}
      tooltip="Playback speed"
      dir="ltr"
      className={cn("w-(--media-rate-width) min-w-7 px-1.5 font-mono text-xs tabular-nums", className)}
      style={{ "--media-rate-width": `calc(${chars}ch + 0.75rem)`, ...style } as React.CSSProperties}
      onClick={(event) => {
        onClick?.(event)
        const index = rates.indexOf(rate)
        store.setPlaybackRate(rates[(index + 1) % rates.length])
      }}
      {...props}
    >
      {`${rate}×`}
    </MediaButton>
  )
}

/* -------------------------------- Controls -------------------------------- */

/**
 * Bar that reveals while the pointer is active, playback is paused,
 * or keyboard focus is inside the player.
 */
type MediaControlsProps = React.ComponentProps<"div">

function MediaControls({ className, ...props }: MediaControlsProps) {
  return (
    <div
      data-slot="media-controls"
      className={cn(
        "flex items-center transition-[opacity,translate] duration-200 ease-media motion-reduce:transition-none",
        "pointer-events-none translate-y-2 opacity-0",
        "group-data-active/media:pointer-events-auto group-data-active/media:translate-y-0 group-data-active/media:opacity-100",
        "group-has-focus-visible/media:pointer-events-auto group-has-focus-visible/media:translate-y-0 group-has-focus-visible/media:opacity-100",
        "group-data-paused/media:group-data-started/media:pointer-events-auto group-data-paused/media:group-data-started/media:translate-y-0 group-data-paused/media:group-data-started/media:opacity-100",
        className
      )}
      {...props}
    />
  )
}

/* --------------------------------- Surface -------------------------------- */

type MediaSurfaceProps = React.ComponentProps<"button"> & {
  /** Seconds a double-tap on either half seeks by. 0 disables it. */
  doubleTapSeek?: number
  /** Double-click with a mouse toggles fullscreen. */
  doubleClickFullscreen?: boolean
  /** Classes for the "±10s" bubble shown after a double-tap seek. */
  indicatorClassName?: string
}

const DOUBLE_TAP_MS = 280

/**
 * Full-bleed click target under the controls. Click toggles playback; on touch,
 * the first tap reveals controls and a double-tap on either half seeks.
 */
function MediaSurface({
  className,
  doubleTapSeek = 10,
  doubleClickFullscreen = true,
  indicatorClassName,
  onClick,
  onDoubleClick,
  onPointerDown,
  children,
  ...props
}: MediaSurfaceProps) {
  const store = useMediaStore()
  const paused = useMedia((s) => s.paused)
  const pointer = React.useRef({ type: "mouse", revealOnly: false, lastTap: 0 })
  const tapTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const flashTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const [flash, setFlash] = React.useState<{ side: "back" | "forward"; count: number } | null>(null)

  React.useEffect(
    () => () => {
      clearTimeout(tapTimer.current)
      clearTimeout(flashTimer.current)
    },
    []
  )

  const showFlash = (side: "back" | "forward") => {
    setFlash((prev) => ({ side, count: prev?.side === side ? prev.count + 1 : 1 }))
    clearTimeout(flashTimer.current)
    flashTimer.current = setTimeout(() => setFlash(null), 650)
  }

  const handleTouchTap = (event: React.MouseEvent<HTMLButtonElement>) => {
    const now = performance.now()
    const { revealOnly, lastTap } = pointer.current
    if (doubleTapSeek > 0 && now - lastTap < DOUBLE_TAP_MS) {
      clearTimeout(tapTimer.current)
      pointer.current.lastTap = now
      const rect = event.currentTarget.getBoundingClientRect()
      const side = event.clientX - rect.left < rect.width / 2 ? "back" : "forward"
      store.seekBy(side === "back" ? -doubleTapSeek : doubleTapSeek)
      showFlash(side)
      return
    }
    pointer.current.lastTap = now
    if (revealOnly) return
    // Wait to see whether this tap becomes a double-tap before toggling.
    clearTimeout(tapTimer.current)
    tapTimer.current = setTimeout(() => store.toggle(), doubleTapSeek > 0 ? DOUBLE_TAP_MS : 0)
  }

  return (
    <button
      type="button"
      data-slot="media-surface"
      aria-label={paused ? "Play" : "Pause"}
      className={cn("absolute inset-0 cursor-[inherit] outline-none", className)}
      onPointerDown={(event) => {
        onPointerDown?.(event)
        const root = event.currentTarget.closest("[data-slot='media-root']")
        pointer.current.type = event.pointerType
        // On touch, the first tap while playing reveals controls instead of pausing.
        pointer.current.revealOnly =
          event.pointerType !== "mouse" && !store.getState().paused && !root?.hasAttribute("data-active")
      }}
      onClick={(event) => {
        onClick?.(event)
        // Keyboard activation reports detail 0 and always toggles.
        if (event.detail !== 0 && pointer.current.type !== "mouse") {
          handleTouchTap(event)
          return
        }
        store.toggle()
      }}
      onDoubleClick={(event) => {
        onDoubleClick?.(event)
        if (doubleClickFullscreen && pointer.current.type === "mouse") store.toggleFullscreen()
      }}
      {...props}
    >
      {doubleTapSeek > 0 && (
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-between px-[8%]">
          {(["back", "forward"] as const).map((side) => (
            <span
              key={side}
              data-show={flash?.side === side || undefined}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-xs tabular-nums opacity-0 scale-90 transition-[opacity,scale] duration-200 ease-media data-show:scale-100 data-show:opacity-100 motion-reduce:transition-none",
                side === "forward" && "flex-row-reverse",
                indicatorClassName
              )}
            >
              <SeekIcon direction={side} className="size-3.5" />
              {`${(flash?.side === side ? flash.count : 1) * doubleTapSeek}s`}
            </span>
          ))}
        </span>
      )}
      {children}
    </button>
  )
}

/* ---------------------------------- Seek ---------------------------------- */

type MediaSeekProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Seconds moved per arrow key press. */
  step?: number
  /** Show a time tooltip while hovering. */
  preview?: boolean
  previewClassName?: string
}

function MediaSeek({
  className,
  step = 5,
  preview = true,
  previewClassName,
  ...props
}: MediaSeekProps) {
  const store = useMediaStore()
  const duration = useMedia((s) => s.duration)
  const bufferedEnd = useMedia((s) => s.bufferedEnd)
  const currentTime = useMedia((s) => Math.floor(s.currentTime))
  const fillRef = React.useRef<HTMLDivElement>(null)
  const scrub = React.useRef<{ resume: boolean } | null>(null)
  const [hover, setHover] = React.useState<number | null>(null)

  React.useEffect(() => {
    let frame = 0
    const draw = () => {
      cancelAnimationFrame(frame)
      const media = store.getMedia()
      const { duration, paused } = store.getState()
      if (!scrub.current && fillRef.current) {
        const progress = duration ? clamp((media?.currentTime ?? 0) / duration) : 0
        fillRef.current.style.transform = `scaleX(${progress})`
      }
      if (!paused) frame = requestAnimationFrame(draw)
    }
    draw()
    const unsubscribe = store.subscribe(draw)
    return () => {
      unsubscribe()
      cancelAnimationFrame(frame)
    }
  }, [store])

  const ratioFromEvent = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    return clamp((event.clientX - rect.left) / rect.width)
  }

  const seekToRatio = (ratio: number) => {
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${ratio})`
    store.seek(ratio * store.getState().duration)
  }

  const endScrub = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!scrub.current) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    const { resume } = scrub.current
    scrub.current = null
    if (resume) store.play()
  }

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label="Seek"
      aria-valuemin={0}
      aria-valuemax={Math.floor(duration)}
      aria-valuenow={currentTime}
      aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
      data-slot="media-seek"
      className={cn(
        /* on touch, an invisible 44px-tall hit area around the 20px bar */
        "group/seek relative flex h-5 min-w-0 grow cursor-pointer touch-none items-center rounded-full outline-none select-none pointer-coarse:before:absolute pointer-coarse:before:inset-x-0 pointer-coarse:before:-inset-y-3 pointer-coarse:before:content-['']",
        className
      )}
      onPointerDown={(event) => {
        if (event.button !== 0) return
        event.currentTarget.setPointerCapture(event.pointerId)
        scrub.current = { resume: !store.getState().paused }
        store.pause()
        seekToRatio(ratioFromEvent(event))
      }}
      onPointerMove={(event) => {
        const ratio = ratioFromEvent(event)
        if (event.pointerType === "mouse") setHover(ratio)
        if (scrub.current) seekToRatio(ratio)
      }}
      onPointerUp={endScrub}

      /**
       * The system can take a touch away mid-drag (an edge swipe, an incoming
       * call). Without this the bar stayed in scrub mode: paused, with the
       * fill frozen, because the draw loop skips while scrubbing.
       */
      onPointerCancel={endScrub}
      onPointerLeave={() => setHover(null)}
      onKeyDown={(event) => {
        const { currentTime, duration } = store.getState()
        const moves: Record<string, number> = {
          ArrowLeft: currentTime - step,
          ArrowDown: currentTime - step,
          ArrowRight: currentTime + step,
          ArrowUp: currentTime + step,
          PageDown: currentTime - duration / 10,
          PageUp: currentTime + duration / 10,
          Home: 0,
          End: duration,
        }
        if (!(event.key in moves)) return
        event.preventDefault()
        event.stopPropagation()
        store.seek(moves[event.key])
      }}
      {...props}
    >
      <div className="relative h-1 w-full overflow-hidden rounded-full bg-current/25 transition-[height] duration-150 ease-media group-hover/seek:h-1.5 group-focus-visible/seek:h-1.5 group-active/seek:h-1.5 motion-reduce:transition-none">
        <div
          className="absolute inset-0 origin-left bg-current/25 transition-transform duration-300 ease-media"
          style={{ transform: `scaleX(${duration ? clamp(bufferedEnd / duration) : 0})` }}
        />
        <div ref={fillRef} className="absolute inset-0 origin-left bg-current" style={{ transform: "scaleX(0)" }} />
      </div>
      <span className="pointer-events-none absolute inset-0 rounded-full ring-current/60 group-focus-visible/seek:ring-2" />
      {preview && hover !== null && duration > 0 && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute bottom-full mb-1.5 -translate-x-1/2 rounded-md bg-foreground px-1.5 py-0.5 font-mono text-[11px] leading-4 text-background tabular-nums",
            previewClassName
          )}
          style={{ left: `${hover * 100}%` }}
        >
          {formatTime(hover * duration, duration)}
        </span>
      )}
    </div>
  )
}

/* --------------------------------- Volume --------------------------------- */

type MediaVolumeProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** "vertical" fills from the bottom, for a slider in a popover. */
  orientation?: "horizontal" | "vertical"
}

function MediaVolume({ orientation = "horizontal", className, ...props }: MediaVolumeProps) {
  const store = useMediaStore()
  const volume = useMedia((s) => (s.muted ? 0 : s.volume))
  const dragging = React.useRef(false)
  const vertical = orientation === "vertical"

  const setFromEvent = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    store.setVolume(
      clamp(vertical ? (rect.bottom - event.clientY) / rect.height : (event.clientX - rect.left) / rect.width)
    )
  }

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label="Volume"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(volume * 100)}
      aria-valuetext={`${Math.round(volume * 100)}%`}
      aria-orientation={orientation}
      data-slot="media-volume"
      className={cn(
        "group/volume relative flex shrink-0 cursor-pointer touch-none outline-none select-none",
        vertical ? "h-16 w-5 justify-center" : "h-5 w-16 items-center",
        className
      )}
      onPointerDown={(event) => {
        if (event.button !== 0) return
        event.currentTarget.setPointerCapture(event.pointerId)
        dragging.current = true
        setFromEvent(event)
      }}
      onPointerMove={(event) => dragging.current && setFromEvent(event)}
      onPointerUp={(event) => {
        dragging.current = false
        event.currentTarget.releasePointerCapture(event.pointerId)
      }}

      /* a drag the system takes away must end here too, or it stays live */
      onPointerCancel={() => {
        dragging.current = false
      }}
      onKeyDown={(event) => {
        const moves: Record<string, number> = {
          ArrowLeft: volume - 0.1,
          ArrowDown: volume - 0.1,
          ArrowRight: volume + 0.1,
          ArrowUp: volume + 0.1,
          PageDown: volume - 0.25,
          PageUp: volume + 0.25,
          Home: 0,
          End: 1,
        }
        if (!(event.key in moves)) return
        event.preventDefault()
        event.stopPropagation()
        store.setVolume(moves[event.key])
      }}
      {...props}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-full bg-current/25 duration-150 ease-media motion-reduce:transition-none",
          vertical
            ? "h-full w-1 transition-[width] group-hover/volume:w-1.5 group-focus-visible/volume:w-1.5"
            : "h-1 w-full transition-[height] group-hover/volume:h-1.5 group-focus-visible/volume:h-1.5"
        )}
      >
        <div
          className={cn("absolute inset-0 bg-current", vertical ? "origin-bottom" : "origin-left")}
          style={{ transform: vertical ? `scaleY(${volume})` : `scaleX(${volume})` }}
        />
      </div>
      <span className="pointer-events-none absolute inset-0 rounded-full ring-current/60 group-focus-visible/volume:ring-2" />
    </div>
  )
}

/* ---------------------------------- Time ---------------------------------- */

type MediaTimeProps = React.ComponentProps<"span"> & {
  type?: "current" | "duration" | "remaining"
  /** Click to show remaining time and back. "remaining" swaps with elapsed. */
  toggle?: boolean
}

const timeNames = { current: "elapsed", duration: "duration", remaining: "remaining" } as const

function MediaTime({ type = "current", toggle = false, className, ...props }: MediaTimeProps) {
  const [picked, setPicked] = React.useState(type)
  const shown = toggle ? picked : type
  const duration = useMedia((s) => s.duration)

  /**
   * Elapsed rounds down and remaining rounds up, so the two add up to the
   * duration. A clip under a second shows 0:01, not 0:00.
   */
  const value = useMedia((s) => {
    if (shown === "duration") return Math.floor(s.duration) || Math.ceil(s.duration)
    if (shown === "remaining") return Math.ceil(Math.max(s.duration - s.currentTime, 0))
    return Math.floor(s.currentTime)
  })
  const time = formatTime(value, duration)
  const text = shown === "remaining" ? `-${time}` : time
  const other = type === "remaining" ? "current" : "remaining"
  const next = shown === type ? other : type

  return (
    <span data-slot="media-time" dir="ltr" className={cn("font-mono text-xs tabular-nums", className)} {...props}>
      {toggle ? (
        <button
          type="button"
          aria-label={`${shown === "remaining" ? "Time remaining" : shown === "duration" ? "Duration" : "Time elapsed"} ${time}`}
          onClick={() => setPicked(next)}
          className="group/media-button relative cursor-pointer rounded-sm outline-none transition-colors duration-150 ease-media hover:text-current focus-visible:ring-2 focus-visible:ring-current/60"
        >
          {text}
          <MediaTooltip label={`Show ${timeNames[next]}`} />
        </button>
      ) : (
        text
      )}
    </span>
  )
}

/* --------------------------------- Loading -------------------------------- */

type MediaLoadingProps = React.ComponentProps<"span">

function MediaLoading({ className, ...props }: MediaLoadingProps) {
  const waiting = useMedia((s) => s.waiting && !s.paused)
  return (
    <span
      role="status"
      aria-label={waiting ? "Loading" : undefined}
      data-slot="media-loading"
      className={cn(
        "pointer-events-none size-6 rounded-full border-2 border-current/25 border-t-current transition-opacity duration-200 ease-media",
        waiting ? "animate-spin opacity-100 delay-300" : "opacity-0",
        className
      )}
      {...props}
    />
  )
}

/* -------------------------------- Captions -------------------------------- */

/**
 * Renders active caption cues. Native rendering is disabled so cues can be
 * styled and can slide above the controls when they appear.
 */
type MediaCaptionsProps = React.ComponentProps<"div">

function MediaCaptions({ className, ...props }: MediaCaptionsProps) {
  const cues = useMedia((s) => (s.textTrack === -1 ? emptyCues : s.cues))
  if (!cues.length) return null
  return (
    <div
      data-slot="media-captions"
      className={cn("pointer-events-none flex flex-col items-center gap-1 text-center", className)}
      {...props}
    >
      {cues.map((cue, i) => (
        <span key={`${i}-${cue}`} dir="auto" className="whitespace-pre-line text-balance rounded-md px-2 py-0.5 box-decoration-clone">
          {cue}
        </span>
      ))}
    </div>
  )
}

const emptyCues: string[] = []

function MediaCaptionsButton({ onClick, ...props }: MediaButtonProps) {
  const store = useMediaStore()
  const available = useMedia((s) => s.textTracks.length > 0)
  const on = useMedia((s) => s.textTrack !== -1)
  if (!available) return null
  return (
    <MediaButton
      aria-label="Captions"
      aria-pressed={on}
      tooltip={on ? "Captions off" : "Captions"}
      shortcut="C"
      onClick={(event) => {
        onClick?.(event)
        store.toggleCaptions()
      }}
      {...props}
    >
      <CaptionsIcon active={on} />
    </MediaButton>
  )
}

/* -------------------------------- Settings -------------------------------- */

type MediaSettingsProps = Omit<React.ComponentProps<"div">, "children"> & {
  rates?: number[]
  /** Classes for the floating panel. */
  panelClassName?: string
}

/**
 * Popover with playback speed and caption track choices. Arrow keys move
 * between options; Escape or a click outside closes it.
 */
function MediaSettings({ rates = [0.5, 0.75, 1, 1.25, 1.5, 2], className, panelClassName, ...props }: MediaSettingsProps) {
  const store = useMediaStore()
  const rate = useMedia((s) => s.playbackRate)
  const tracks = useMedia((s) => s.textTracks)
  const textTrack = useMedia((s) => s.textTrack)
  const [open, setOpen] = React.useState(false)
  const rootEl = React.useRef<HTMLDivElement>(null)
  const triggerEl = React.useRef<HTMLButtonElement>(null)
  const panelEl = React.useRef<HTMLDivElement>(null)
  const listEl = React.useRef<HTMLDivElement>(null)
  const panelId = React.useId()

  /**
   * The player clips its children, so on a short player (a phone in portrait)
   * a full-height panel lost its top rows. Cap the panel to the space above
   * the trigger and let it scroll, and re-measure when the player resizes.
   */
  React.useLayoutEffect(() => {
    const panel = panelEl.current
    const list = listEl.current
    const trigger = triggerEl.current
    const player = rootEl.current?.closest<HTMLElement>("[data-slot='media-root']")
    if (!open || !panel || !list || !trigger || !player) return

    /**
     * A hidden scrollbar gives no sign of more options, so the list's bottom
     * edge fades. The fade is the distance left to scroll, capped at 24px, so
     * it eases out with the scroll instead of snapping off at the end. It sits
     * on the inner list, so the panel's edge and background stay whole.
     */
    const edge = () => {
      const left = Math.min(24, list.scrollHeight - list.clientHeight - list.scrollTop)
      list.style.maskImage = left > 1 ? `linear-gradient(to bottom, black calc(100% - ${left}px), rgb(0 0 0 / 0.3))` : ""
    }
    const fit = () => {
      const space = trigger.getBoundingClientRect().top - player.getBoundingClientRect().top - 16
      panel.style.maxHeight = `${Math.max(96, Math.min(288, space))}px`
      edge()
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(player)
    list.addEventListener("scroll", edge, { passive: true })
    return () => {
      observer.disconnect()
      list.removeEventListener("scroll", edge)
    }
  }, [open])

  React.useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootEl.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    rootEl.current?.querySelector<HTMLElement>("[aria-checked='true']")?.focus()
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [open])

  const close = () => {
    setOpen(false)
    triggerEl.current?.focus()
  }

  const onPanelKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.stopPropagation()
      close()
      return
    }
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key]
    if (!step) return
    event.preventDefault()
    event.stopPropagation()
    const items = Array.from(rootEl.current?.querySelectorAll<HTMLElement>("[role='menuitemradio']") ?? [])
    const index = items.indexOf(document.activeElement as HTMLElement)
    const next = items[(index + step + items.length) % items.length]
    next?.focus()
  }

  const option = (label: string, checked: boolean, select: () => void) => (
    <button
      key={label}
      type="button"
      role="menuitemradio"
      aria-checked={checked}
      tabIndex={checked ? 0 : -1}
      onClick={() => {
        select()
        close()
      }}
      className="flex min-h-8 w-full shrink-0 cursor-pointer items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left text-sm leading-5 outline-none transition-colors duration-150 ease-media hover:bg-current/10 focus-visible:bg-current/15"
    >
      <span dir="auto" className="min-w-0">
        {label}
      </span>
      <CheckIcon className={cn("size-3.5 shrink-0 transition-opacity duration-150", checked ? "opacity-100" : "opacity-0")} />
    </button>
  )

  return (
    <div
      ref={rootEl}
      data-slot="media-settings"
      data-open={open || undefined}
      className={cn("relative", className)}
      {...props}
    >
      <MediaButton
        ref={triggerEl}
        aria-label="Settings"
        tooltip="Settings"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        <SettingsIcon className={cn("transition-transform duration-300 ease-media motion-reduce:transition-none", open && "rotate-90")} />
      </MediaButton>
      {open && (
      <div
        ref={panelEl}
        id={panelId}
        role="menu"
        aria-label="Playback settings"
        onKeyDown={onPanelKeyDown}
        className={cn(
          "absolute right-0 bottom-full z-10 mb-2 flex max-h-72 w-48 origin-bottom-right flex-col overflow-hidden rounded-xl",
          "transition-[opacity,translate,scale] duration-150 ease-media starting:translate-y-1 starting:scale-95 starting:opacity-0 motion-reduce:transition-none",
          panelClassName
        )}
      >
        <div
          ref={listEl}
          className="flex min-h-0 flex-col gap-2 overflow-y-auto overscroll-contain p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div role="group" aria-label="Speed" className="flex flex-col">
            <span className="px-2 pt-1 pb-1.5 text-xs opacity-60">Speed</span>
            <div className="grid grid-cols-3 gap-1">
              {rates.map((r) => (
                <button
                  key={r}
                  type="button"
                  role="menuitemradio"
                  aria-checked={rate === r}
                  aria-label={r === 1 ? "Normal speed" : `${r}× speed`}
                  tabIndex={rate === r ? 0 : -1}
                  onClick={() => {
                    store.setPlaybackRate(r)
                    close()
                  }}
                  className={cn(
                    "h-8 cursor-pointer rounded-md text-sm tabular-nums outline-none transition-colors duration-150 ease-media hover:bg-current/10 focus-visible:ring-1 focus-visible:ring-current/40",
                    rate === r && "bg-current/15"
                  )}
                >
                  {`${r}×`}
                </button>
              ))}
            </div>
          </div>
          {tracks.length > 0 && (
            <div role="group" aria-label="Captions" className="flex flex-col">
              <span className="px-2 pt-1 pb-1.5 text-xs opacity-60">Captions</span>
              {option("Off", textTrack === -1, () => store.setTextTrack(-1))}
              {tracks.map((track, i) => option(track.label, textTrack === i, () => store.setTextTrack(i)))}
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  )
}

/* ---------------------------------- Error --------------------------------- */

type MediaErrorMessageProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Override the default message for a given MediaError. */
  message?: (error: MediaError) => React.ReactNode
}

function MediaErrorMessage({ className, message, ...props }: MediaErrorMessageProps) {
  const store = useMediaStore()
  const error = useMedia((s) => s.error)
  if (!error) return null
  return (
    <div
      role="alert"
      data-slot="media-error"
      className={cn("flex flex-col items-center justify-center gap-3 text-center", className)}
      {...props}
    >
      <p className="text-pretty text-sm">{message ? message(error) : describeMediaError(error)}</p>
      <button
        type="button"
        onClick={() => store.retry()}
        className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm outline-none ring-1 ring-current/25 transition-[background-color,scale] duration-150 ease-media hover:bg-current/10 focus-visible:ring-2 focus-visible:ring-current/60 motion-safe:active:scale-[0.96]"
      >
        <RetryIcon className="size-3.5" />
        Try again
      </button>
    </div>
  )
}

export {
  MediaRoot,
  MediaVideo,
  MediaAudio,
  MediaSurface,
  MediaCaptions,
  MediaCaptionsButton,
  MediaSettings,
  MediaErrorMessage,
  MediaControls,
  MediaButton,
  MediaPlayButton,
  MediaMuteButton,
  MediaFullscreenButton,
  MediaPictureInPictureButton,
  MediaPlaybackRateButton,
  MediaSeek,
  MediaVolume,
  MediaTime,
  MediaLoading,
  useMedia,
  useMediaStore,
}
export type {
  MediaSourceLoader,
  MediaRootProps,
  MediaVideoProps,
  MediaAudioProps,
  MediaSurfaceProps,
  MediaControlsProps,
  MediaButtonProps,
  MediaTooltipAlign,
  MediaPlaybackRateButtonProps,
  MediaSeekProps,
  MediaVolumeProps,
  MediaTimeProps,
  MediaLoadingProps,
  MediaCaptionsProps,
  MediaSettingsProps,
  MediaErrorMessageProps,
}
