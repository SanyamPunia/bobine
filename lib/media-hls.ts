import type { MediaSourceLoader } from "@/components/ui/media"

/**
 * Media Source Extensions, which hls.js needs. iPhones before iOS 17.1 have
 * neither API, and they are the browsers that must play HLS natively.
 */
const hasMediaSource = () =>
  typeof window !== "undefined" && ("MediaSource" in window || "ManagedMediaSource" in window)

/**
 * Plays `.m3u8` streams with hls.js, loaded on demand so it never lands in
 * the main bundle. Native playback is only the fallback for browsers without
 * Media Source Extensions: Chrome 142 and later report native HLS support,
 * but cannot parse common MPEG-TS streams, so `canPlayType` is not a safe
 * test.
 */
export const hlsLoader: MediaSourceLoader = (media, src) => {
  const playNatively = () => {
    media.src = src
    return () => {
      media.removeAttribute("src")
      media.load()
    }
  }

  if (!/\.m3u8($|\?)/i.test(src) || !hasMediaSource()) return playNatively()

  let disposed = false
  let destroy: (() => void) | undefined

  import("hls.js").then(({ default: Hls }) => {
    if (disposed) return
    if (!Hls.isSupported()) {
      destroy = playNatively()
      return
    }
    const hls = new Hls({ enableWorker: true })
    hls.on(Hls.Events.ERROR, (_, data) => {
      if (!data.fatal) return
      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad()
      else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError()
      else hls.destroy()
    })
    hls.loadSource(src)
    hls.attachMedia(media)
    destroy = () => hls.destroy()
  })

  return () => {
    disposed = true
    destroy?.()
  }
}
