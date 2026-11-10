import { renderToString } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { AudioPlayer } from "@/components/ui/audio-player"
import { VideoPlayer } from "@/components/ui/video-player"

describe("server rendering", () => {
  it("renders VideoPlayer with an accessible play control", () => {
    const html = renderToString(<VideoPlayer src="/clip.mp4" title="Clip" />)
    expect(html).toContain("<video")
    expect(html).toContain('src="/clip.mp4"')
    expect(html).toMatch(/aria-label="Play"/)
    expect(html).toMatch(/role="slider"/)
  })

  it("renders VideoPlayer with a volume slider and a time toggle", () => {
    const html = renderToString(<VideoPlayer src="/clip.mp4" />)
    expect(html).toMatch(/aria-label="Volume"/)
    expect(html).toMatch(/aria-orientation="vertical"/)
    expect(html).toMatch(/aria-label="Time remaining 0:00"/)
  })

  it("renders VideoPlayer tooltips by default, and none with tooltips off", () => {
    expect(renderToString(<VideoPlayer src="/clip.mp4" />)).toContain('data-slot="media-tooltip"')
    expect(renderToString(<VideoPlayer src="/clip.mp4" tooltips={false} />)).not.toContain('data-slot="media-tooltip"')
  })

  it("pins AudioPlayer to a palette only when theme is set", () => {
    expect(renderToString(<AudioPlayer src="/song.mp3" />)).not.toContain("--card:")
    const html = renderToString(<AudioPlayer src="/song.mp3" theme="dark" />)
    expect(html).toContain('data-player-theme="dark"')
    expect(html).toContain("--card:oklch(0.205 0 0)")
    expect(html).toContain("--color-card:oklch(0.205 0 0)")
  })

  it("renders AudioPlayer with title and description", () => {
    const html = renderToString(<AudioPlayer src="/song.mp3" title="Song" description="Artist" />)
    expect(html).toContain("<audio")
    expect(html).toContain("Song")
    expect(html).toContain("Artist")
  })
})
