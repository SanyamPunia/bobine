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

  it("renders AudioPlayer with title and description", () => {
    const html = renderToString(<AudioPlayer src="/song.mp3" title="Song" description="Artist" />)
    expect(html).toContain("<audio")
    expect(html).toContain("Song")
    expect(html).toContain("Artist")
  })
})
