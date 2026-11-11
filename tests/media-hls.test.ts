import { afterEach, describe, expect, it, vi } from "vitest"

import { hlsLoader } from "@/lib/media-hls"

const loadSource = vi.fn()

vi.mock("hls.js", () => ({
  default: class {
    static isSupported = () => true
    static Events = { ERROR: "error" }
    static ErrorTypes = {}
    on() {}
    loadSource = loadSource
    attachMedia() {}
    destroy() {}
  },
}))

const stream = "https://example.com/live.m3u8"

/* a browser by its vendor, its answer for HLS and whether it has MSE */
function browser(vendor: string, hls: CanPlayTypeResult, mse: boolean) {
  vi.spyOn(navigator, "vendor", "get").mockReturnValue(vendor)
  vi.spyOn(HTMLMediaElement.prototype, "canPlayType").mockReturnValue(hls)
  if (mse) vi.stubGlobal("MediaSource", class {})
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  loadSource.mockClear()
})

describe("hlsLoader", () => {
  it("plays HLS natively on Safari, without loading hls.js", async () => {
    browser("Apple Computer, Inc.", "maybe", true)
    const media = document.createElement("video")
    hlsLoader(media, stream)
    await new Promise((r) => setTimeout(r, 0))
    expect(media.getAttribute("src")).toBe(stream)
    expect(loadSource).not.toHaveBeenCalled()
  })

  it("uses hls.js on Chrome, even when it claims native HLS", async () => {
    browser("Google Inc.", "maybe", true)
    const media = document.createElement("video")
    hlsLoader(media, stream)
    await vi.waitFor(() => expect(loadSource).toHaveBeenCalledWith(stream))
    expect(media.getAttribute("src")).toBeNull()
  })

  it("leaves a source that is not HLS to the browser", () => {
    browser("Google Inc.", "", true)
    const media = document.createElement("video")
    hlsLoader(media, "/clip.mp4")
    expect(media.getAttribute("src")).toBe("/clip.mp4")
  })
})
