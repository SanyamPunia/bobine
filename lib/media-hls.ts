import type { MediaSourceLoader } from "@/components/ui/media"

/**
 * Media Source Extensions, which hls.js needs. iPhones before iOS 17.1 have
 * neither API, and they are the browsers that must play HLS natively.
 */
const hasMediaSource = () =>
  typeof window !== "undefined" && ("MediaSource" in window || "ManagedMediaSource" in window)

/**
 * Safari and every iOS browser play HLS themselves, since they all run
 * Apple's WebKit. `canPlayType` alone is not a safe test: Chrome 142 and
 * later report native HLS support but cannot parse common MPEG-TS streams.
 * The vendor tells WebKit from Chrome, which reports "Google Inc.".
 */
const playsHlsNatively = (media: HTMLMediaElement) =>
  typeof navigator !== "undefined" &&
  navigator.vendor.startsWith("Apple") &&
  media.canPlayType("application/vnd.apple.mpegurl") !== ""

/**
 * Plays `.m3u8` streams natively on Safari and iOS, and with hls.js
 * elsewhere, loaded on demand so it never lands in the main bundle. Browsers
 * with neither Media Source Extensions nor native support get the source as
 * it is.
 */
export const hlsLoader: MediaSourceLoader = (media, src) => {
  const playNatively = () => {
    media.src = src
    return () => {
      media.removeAttribute("src")
      media.load()
    }
  }

  if (!/\.m3u8($|\?)/i.test(src) || playsHlsNatively(media) || !hasMediaSource()) return playNatively()

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
