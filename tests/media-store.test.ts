import { beforeEach, describe, expect, it, vi } from "vitest"
import { createMediaStore, describeMediaError, formatTime } from "@/lib/media-store"

/** jsdom has no media pipeline, so emulate the parts the store reads. */
function fakeMedia(duration = 120) {
  const el = document.createElement("video")
  let paused = true
  let currentTime = 0
  Object.defineProperties(el, {
    duration: { get: () => duration },
    paused: { get: () => paused },
    currentTime: {
      get: () => currentTime,
      set: (t: number) => {
        currentTime = t
        el.dispatchEvent(new Event("timeupdate"))
      },
    },
  })
  el.play = vi.fn(async () => {
    paused = false
    el.dispatchEvent(new Event("play"))
  })
  el.pause = vi.fn(() => {
    paused = true
    el.dispatchEvent(new Event("pause"))
  })
  el.load = vi.fn()
  return el
}

describe("formatTime", () => {
  it.each([
    [0, "0:00"],
    [9.9, "0:09"],
    [65, "1:05"],
    [3600, "1:00:00"],
    [3725, "1:02:05"],
    [Number.NaN, "0:00"],
    [-5, "0:00"],
    [Infinity, "0:00"],
  ])("formats %s as %s", (input, expected) => {
    expect(formatTime(input)).toBe(expected)
  })
})

describe("describeMediaError", () => {
  it("maps known codes and falls back for unknown ones", () => {
    expect(describeMediaError({ code: 2 } as MediaError)).toMatch(/network/i)
    expect(describeMediaError({ code: 4 } as MediaError)).toMatch(/supported/i)
    expect(describeMediaError(null)).toMatch(/went wrong/i)
  })
})

describe("createMediaStore", () => {
  beforeEach(() => localStorage.clear())

  it("starts from the server snapshot before a media element attaches", () => {
    const store = createMediaStore()
    expect(store.getState()).toBe(store.getServerState())
    expect(store.getState().paused).toBe(true)
  })

  it("reads duration on attach and tracks play / pause", async () => {
    const store = createMediaStore()
    const media = fakeMedia(90)
    store.attach(media)
    expect(store.getState().duration).toBe(90)

    await store.toggle()
    expect(store.getState()).toMatchObject({ paused: false, started: true })

    await store.toggle()
    expect(store.getState().paused).toBe(true)
  })

  it("clamps seeks to the media bounds", () => {
    const store = createMediaStore()
    store.attach(fakeMedia(100))

    store.seek(250)
    expect(store.getState().currentTime).toBe(100)
    store.seek(-10)
    expect(store.getState().currentTime).toBe(0)
    store.seekToRatio(0.25)
    expect(store.getState().currentTime).toBe(25)
    store.seekBy(10)
    expect(store.getState().currentTime).toBe(35)
  })

  it("notifies subscribers only when state actually changes", () => {
    const store = createMediaStore()
    const media = fakeMedia()
    store.attach(media)
    const listener = vi.fn()
    store.subscribe(listener)

    media.dispatchEvent(new Event("timeupdate"))
    expect(listener).not.toHaveBeenCalled()

    store.seek(10)
    expect(listener).toHaveBeenCalled()
  })

  it("mutes when volume reaches zero and restores on unmute", () => {
    const store = createMediaStore()
    const media = fakeMedia()
    store.attach(media)

    store.setVolume(0)
    expect(media.muted).toBe(true)
    store.toggleMute()
    expect(media.muted).toBe(false)
    expect(media.volume).toBe(1)
  })

  it("persists and restores preferences when persistKey is set", () => {
    const first = createMediaStore({ persistKey: "bobine-test" })
    const a = fakeMedia()
    first.attach(a)
    first.setVolume(0.4)
    first.setPlaybackRate(1.5)
    a.dispatchEvent(new Event("volumechange"))
    a.dispatchEvent(new Event("ratechange"))

    const second = createMediaStore({ persistKey: "bobine-test" })
    const b = fakeMedia()
    second.attach(b)
    expect(b.volume).toBeCloseTo(0.4)
    expect(b.playbackRate).toBe(1.5)
  })

  it("ignores corrupted persisted preferences", () => {
    localStorage.setItem("bobine-bad", "{not json")
    const store = createMediaStore({ persistKey: "bobine-bad" })
    expect(() => store.attach(fakeMedia())).not.toThrow()
  })

  it("resets to the initial state on detach", async () => {
    const store = createMediaStore()
    store.attach(fakeMedia())
    await store.play()
    store.attach(null)
    expect(store.getState()).toBe(store.getServerState())
  })

  it("swallows autoplay rejections", async () => {
    const store = createMediaStore()
    const media = fakeMedia()
    media.play = vi.fn(() => Promise.reject(new DOMException("blocked", "NotAllowedError")))
    store.attach(media)
    await expect(store.play()).resolves.toBeUndefined()
    expect(store.getState().paused).toBe(true)
  })

  it("retries by reloading the source", () => {
    const store = createMediaStore()
    const media = fakeMedia()
    store.attach(media)
    store.retry()
    expect(media.load).toHaveBeenCalled()
    expect(media.play).toHaveBeenCalled()
  })

  it("does not throw when actions run without media", () => {
    const store = createMediaStore()
    expect(() => {
      store.seek(10)
      store.setVolume(0.5)
      store.toggleMute()
      store.setPlaybackRate(2)
      store.toggleCaptions()
      store.retry()
    }).not.toThrow()
  })
})
