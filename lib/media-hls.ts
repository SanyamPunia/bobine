import type { MediaSourceLoader } from "@/components/ui/media"

const canPlayNatively = (media: HTMLMediaElement) =>
  media.canPlayType("application/vnd.apple.mpegurl") !== ""

/**
 * Plays `.m3u8` streams. Safari plays HLS natively; everywhere else hls.js
 * is loaded on demand so it never lands in the main bundle.
 */
export const hlsLoader: MediaSourceLoader = (media, src) => {
  if (!/\.m3u8($|\?)/i.test(src) || canPlayNatively(media)) {
    media.src = src
    return () => {
      media.removeAttribute("src")
      media.load()
    }
  }

  let disposed = false
  let destroy: (() => void) | undefined

  import("hls.js").then(({ default: Hls }) => {
    if (disposed) return
    if (!Hls.isSupported()) {
      media.src = src
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
