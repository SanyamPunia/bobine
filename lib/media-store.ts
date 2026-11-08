export type MediaTextTrack = {
  label: string
  language: string
  kind: "captions" | "subtitles"
}

export type MediaInfo = {
  title?: string
  artist?: string
  album?: string
  artwork?: { src: string; sizes?: string; type?: string }[]
}

export type MediaState = {
  paused: boolean
  ended: boolean
  started: boolean
  waiting: boolean
  currentTime: number
  duration: number
  bufferedEnd: number
  volume: number
  muted: boolean
  playbackRate: number
  fullscreen: boolean
  pictureInPicture: boolean
  error: MediaError | null
  /** Caption and subtitle tracks, in document order. */
  textTracks: MediaTextTrack[]
  /** Index into `textTracks`, or -1 when captions are off. */
  textTrack: number
  /** Text of the cues active right now, one entry per cue. */
  cues: string[]
}

export type MediaStoreOptions = {
  /** localStorage key used to remember volume, mute and speed. Off by default. */
  persistKey?: string
}

type Listener = () => void

const MEDIA_EVENTS = [
  "play",
  "pause",
  "playing",
  "ended",
  "waiting",
  "canplay",
  "seeking",
  "seeked",
  "timeupdate",
  "durationchange",
  "loadedmetadata",
  "progress",
  "volumechange",
  "ratechange",
  "emptied",
  "error",
  "enterpictureinpicture",
  "leavepictureinpicture",
] as const

const TRACK_EVENTS = ["addtrack", "removetrack", "change"] as const

const initialState: MediaState = {
  paused: true,
  ended: false,
  started: false,
  waiting: false,
  currentTime: 0,
  duration: 0,
  bufferedEnd: 0,
  volume: 1,
  muted: false,
  playbackRate: 1,
  fullscreen: false,
  pictureInPicture: false,
  error: null,
  textTracks: [],
  textTrack: -1,
  cues: [],
}

type WebkitVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void
  webkitDisplayingFullscreen?: boolean
}

function readBufferedEnd(media: HTMLMediaElement) {
  const { buffered, currentTime } = media
  for (let i = 0; i < buffered.length; i++) {
    if (buffered.start(i) <= currentTime && buffered.end(i) >= currentTime) {
      return buffered.end(i)
    }
  }
  return buffered.length ? buffered.end(buffered.length - 1) : 0
}

function captionTracks(media: HTMLMediaElement | null) {
  if (!media?.textTracks) return []
  return Array.from(media.textTracks).filter(
    (track) => track.kind === "captions" || track.kind === "subtitles"
  )
}

function cueText(cue: TextTrackCue) {
  return ((cue as VTTCue).text ?? "").replace(/<[^>]+>/g, "").trim()
}

const sameList = (a: readonly unknown[], b: readonly unknown[]) =>
  a.length === b.length && a.every((value, i) => Object.is(value, b[i]))

const sameTracks = (a: MediaTextTrack[], b: MediaTextTrack[]) =>
  a.length === b.length &&
  a.every((t, i) => t.label === b[i].label && t.language === b[i].language && t.kind === b[i].kind)

type Preferences = Pick<MediaState, "volume" | "muted" | "playbackRate">

function readPreferences(key: string): Partial<Preferences> {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "{}")
  } catch {
    return {}
  }
}

/**
 * Framework-agnostic store over any HTMLMediaElement. React bindings,
 * web components, or anything else can subscribe to it.
 */
export function createMediaStore({ persistKey }: MediaStoreOptions = {}) {
  let state = initialState
  let media: HTMLMediaElement | null = null
  let container: HTMLElement | null = null
  let cueTrack: TextTrack | null = null
  let metadata: MediaInfo | null = null
  const listeners = new Set<Listener>()

  const set = (patch: Partial<MediaState>) => {
    let changed = false
    for (const key in patch) {
      const k = key as keyof MediaState
      const next = patch[k]
      const prev = state[k]
      if (k === "cues" ? !sameList(prev as string[], next as string[]) : k === "textTracks" ? !sameTracks(prev as MediaTextTrack[], next as MediaTextTrack[]) : !Object.is(prev, next)) {
        changed = true
        break
      }
    }
    if (!changed) return
    state = { ...state, ...patch }
    listeners.forEach((l) => l())
  }

  const sync = () => {
    if (!media) return
    set({
      paused: media.paused,
      ended: media.ended,
      started: state.started || !media.paused || media.currentTime > 0,
      currentTime: media.currentTime,
      duration: Number.isFinite(media.duration) ? media.duration : 0,
      bufferedEnd: readBufferedEnd(media),
      volume: media.volume,
      muted: media.muted,
      playbackRate: media.playbackRate,
      pictureInPicture:
        typeof document !== "undefined" && document.pictureInPictureElement === media,
      error: media.error,
    })
  }

  /* ------------------------------ Captions ------------------------------ */

  const readCues = () => {
    const active = cueTrack?.activeCues
    set({ cues: active ? Array.from(active).map(cueText).filter(Boolean) : [] })
  }

  const bindCueTrack = (track: TextTrack | null) => {
    if (cueTrack === track) return
    cueTrack?.removeEventListener("cuechange", readCues)
    cueTrack = track
    cueTrack?.addEventListener("cuechange", readCues)
  }

  // Native rendering is replaced by our own cue layer: the active track runs
  // in "hidden" mode (cues load, nothing paints) and every other track is off.
  const syncTracks = (requested = state.textTrack) => {
    const tracks = captionTracks(media)
    let active = requested
    tracks.forEach((track, i) => {
      if (track.mode === "showing") active = i
    })
    if (active >= tracks.length) active = -1
    tracks.forEach((track, i) => {
      const mode = i === active ? "hidden" : "disabled"
      if (track.mode !== mode) track.mode = mode
    })
    bindCueTrack(tracks[active] ?? null)
    set({
      textTracks: tracks.map((track, i) => ({
        label: track.label || track.language || `Track ${i + 1}`,
        language: track.language,
        kind: track.kind as MediaTextTrack["kind"],
      })),
      textTrack: active,
    })
    readCues()
  }

  const onTracksChange = () => syncTracks()

  /* ---------------------------- Media Session --------------------------- */

  const applyMediaSession = () => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator) || !metadata) return
    const session = navigator.mediaSession
    session.metadata = new MediaMetadata(metadata)
    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ["play", () => actions.play()],
      ["pause", () => actions.pause()],
      ["seekbackward", (d) => actions.seekBy(-(d.seekOffset ?? 10))],
      ["seekforward", (d) => actions.seekBy(d.seekOffset ?? 10)],
      ["seekto", (d) => d.seekTime !== undefined && actions.seek(d.seekTime)],
    ]
    for (const [action, handler] of handlers) {
      try {
        session.setActionHandler(action, handler)
      } catch {
        // Action not supported by this browser.
      }
    }
  }

  const updatePositionState = () => {
    if (!metadata || !media || typeof navigator === "undefined" || !("mediaSession" in navigator)) return
    if (!Number.isFinite(media.duration) || media.duration <= 0) return
    try {
      navigator.mediaSession.setPositionState({
        duration: media.duration,
        playbackRate: media.playbackRate,
        position: Math.min(media.currentTime, media.duration),
      })
    } catch {
      // Ignore transient invalid states.
    }
  }

  /* ------------------------------- Events ------------------------------- */

  const savePreferences = () => {
    if (!persistKey || !media) return
    try {
      const prefs: Preferences = {
        volume: media.volume,
        muted: media.muted,
        playbackRate: media.playbackRate,
      }
      localStorage.setItem(persistKey, JSON.stringify(prefs))
    } catch {
      // Storage may be full or disabled.
    }
  }

  const onEvent = (event: Event) => {
    switch (event.type) {
      case "emptied":
        set({ started: false, waiting: false })
        break
      case "waiting":
        set({ waiting: true })
        break
      case "playing":
      case "canplay":
      case "pause":
      case "error":
        set({ waiting: false })
        break
      case "play":
        applyMediaSession()
        break
      case "volumechange":
      case "ratechange":
        savePreferences()
        break
      case "loadedmetadata":
        syncTracks()
        break
    }
    if (event.type === "durationchange" || event.type === "ratechange" || event.type === "seeked") {
      updatePositionState()
    }
    sync()
  }

  const onFullscreenChange = () => {
    const el = document.fullscreenElement
    const video = media as WebkitVideo | null
    set({
      fullscreen:
        (!!el && (el === container || el === media)) || !!video?.webkitDisplayingFullscreen,
    })
  }

  const attach = (el: HTMLMediaElement | null) => {
    if (media === el) return
    if (media) {
      MEDIA_EVENTS.forEach((e) => media!.removeEventListener(e, onEvent))
      TRACK_EVENTS.forEach((e) => media!.textTracks?.removeEventListener?.(e, onTracksChange))
      media.removeEventListener("webkitbeginfullscreen", onFullscreenChange)
      media.removeEventListener("webkitendfullscreen", onFullscreenChange)
      bindCueTrack(null)
    }
    media = el
    if (!el) {
      state = initialState
      listeners.forEach((l) => l())
      return
    }
    if (persistKey) {
      const prefs = readPreferences(persistKey)
      if (typeof prefs.volume === "number") el.volume = Math.min(Math.max(prefs.volume, 0), 1)
      if (typeof prefs.muted === "boolean") el.muted = prefs.muted
      if (typeof prefs.playbackRate === "number") el.playbackRate = prefs.playbackRate
    }
    MEDIA_EVENTS.forEach((e) => el.addEventListener(e, onEvent))
    TRACK_EVENTS.forEach((e) => el.textTracks?.addEventListener?.(e, onTracksChange))
    el.addEventListener("webkitbeginfullscreen", onFullscreenChange)
    el.addEventListener("webkitendfullscreen", onFullscreenChange)
    sync()
    syncTracks()
  }

  const setContainer = (el: HTMLElement | null) => {
    if (typeof document === "undefined") return
    document.removeEventListener("fullscreenchange", onFullscreenChange)
    container = el
    if (el) document.addEventListener("fullscreenchange", onFullscreenChange)
  }

  const play = async () => {
    if (!media) return
    try {
      await media.play()
    } catch {
      // Autoplay policies may reject; the paused state stays accurate.
    }
  }

  const pause = () => media?.pause()

  const actions = {
    play,
    pause,
    toggle: () => (media?.paused || media?.ended ? play() : pause()),
    seek: (time: number) => {
      if (!media) return
      const max = Number.isFinite(media.duration) ? media.duration : time
      media.currentTime = Math.min(Math.max(time, 0), max)
      sync()
    },
    seekBy: (delta: number) => actions.seek((media?.currentTime ?? 0) + delta),
    /** Jump to a fraction (0–1) of the duration. */
    seekToRatio: (ratio: number) => actions.seek(ratio * (media?.duration || 0)),
    setVolume: (volume: number) => {
      if (!media) return
      media.volume = Math.min(Math.max(volume, 0), 1)
      media.muted = media.volume === 0
    },
    toggleMute: () => {
      if (!media) return
      if (media.muted && media.volume === 0) media.volume = 1
      media.muted = !media.muted
    },
    setPlaybackRate: (rate: number) => {
      if (media) media.playbackRate = rate
    },
    /** Select a caption track by index, or -1 to turn captions off. */
    setTextTrack: (index: number) => syncTracksExplicit(index),
    toggleCaptions: () => {
      if (!state.textTracks.length) return
      syncTracksExplicit(state.textTrack === -1 ? 0 : -1)
    },
    /** Reload the current source after an error. */
    retry: () => {
      if (!media) return
      media.load()
      void play()
    },
    setMetadata: (next: MediaInfo | null) => {
      metadata = next
      if (media && !media.paused) applyMediaSession()
    },
    toggleFullscreen: async () => {
      if (typeof document === "undefined") return
      if (document.fullscreenElement) {
        await document.exitFullscreen().catch(() => {})
        return
      }
      if (container?.requestFullscreen) {
        await container.requestFullscreen().catch(() => {})
        return
      }
      // iOS Safari only supports fullscreen on the video element itself.
      ;(media as WebkitVideo | null)?.webkitEnterFullscreen?.()
    },
    togglePictureInPicture: async () => {
      if (!(media instanceof HTMLVideoElement)) return
      try {
        if (document.pictureInPictureElement) await document.exitPictureInPicture()
        else await media.requestPictureInPicture()
      } catch {
        // Unsupported or blocked by the browser.
      }
    },
  }

  // An explicit choice must win over a track the browser marked "showing".
  const syncTracksExplicit = (index: number) => {
    captionTracks(media).forEach((track, i) => {
      if (i !== index && track.mode === "showing") track.mode = "disabled"
    })
    syncTracks(index)
  }

  return {
    getState: () => state,
    getServerState: () => initialState,
    getMedia: () => media,
    subscribe: (listener: Listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    attach,
    setContainer,
    ...actions,
  }
}

export type MediaStore = ReturnType<typeof createMediaStore>

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0
  const s = Math.floor(seconds % 60)
  const m = Math.floor((seconds / 60) % 60)
  const h = Math.floor(seconds / 3600)
  const ss = s.toString().padStart(2, "0")
  return h > 0 ? `${h}:${m.toString().padStart(2, "0")}:${ss}` : `${m}:${ss}`
}

/** Human-readable message for a MediaError code. */
export function describeMediaError(error: MediaError | null) {
  switch (error?.code) {
    case 1:
      return "Playback was aborted."
    case 2:
      return "A network error stopped the download."
    case 3:
      return "This media could not be decoded."
    case 4:
      return "This format or source isn't supported."
    default:
      return "Something went wrong during playback."
  }
}
