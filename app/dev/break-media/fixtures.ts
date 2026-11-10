import type { AudioPlayerProps } from "@/components/ui/audio-player"
import type { VideoPlayerProps } from "@/components/ui/video-player"

/**
 * Props for the break-ui stress page. Each state feeds the players through
 * their public props, the same boundary a consumer app uses.
 */
export type Fixture = {
  video: VideoPlayerProps[]
  audio: AudioPlayerProps[]
}

const w = "/media/worst"

export const states = ["demo", "worst", "empty", "error"] as const
export type State = (typeof states)[number]

export const fixtures: Record<State, Fixture> = {
  demo: {
    video: [
      {
        src: "/media/flower.mp4",
        tracks: [{ src: "/media/flower.en.vtt", label: "English", srcLang: "en", default: true }],
        metadata: { title: "Bloom", artist: "bobine" },
      },
    ],
    audio: [{ src: "/media/track.mp3", title: "Bloom", description: "bobine" }],
  },
  worst: {
    video: [
      {
        /* 10 hours, the length of a livestream VOD */
        src: `${w}/long.mp4`,
        tracks: [
          { src: `${w}/long-cues.vtt`, label: "English (United States) - SDH, with speaker names", srcLang: "en", default: true },
          { src: `${w}/rtl.vtt`, label: "العربية (المملكة العربية السعودية)", srcLang: "ar" },
          { src: `${w}/t-entities.vtt`, label: "English (entities)", srcLang: "en-x-ent" },
          { src: `${w}/t-de.vtt`, label: "Deutsch (Untertitel für Hörgeschädigte)", srcLang: "de" },
          { src: `${w}/t-fr.vtt`, label: "Français (Canada) - Sous-titres codés", srcLang: "fr" },
          { src: `${w}/t-pt.vtt`, label: "Português (Brasil) - Legendas para surdos e ensurdecidos", srcLang: "pt" },
          { src: `${w}/t-ja.vtt`, label: "日本語", srcLang: "ja" },
          { src: `${w}/t-vi.vtt`, label: "Tiếng Việt", srcLang: "vi" },
          { src: `${w}/t-th.vtt`, label: "ภาษาไทย", srcLang: "th" },
        ],
        metadata: { title: "Q3 Board Review, full recording (revised) v12", artist: "Aleksandra Wiśniewska-Kowalczyk" },
      },
      /* 0.4 seconds, a clip shorter than the first frame of the seek bar */
      { src: `${w}/short.mp4` },
    ],
    audio: [
      {
        src: `${w}/long.mp4`,
        title: "Aleksandra Wiśniewska-Kowalczyk and Christopher Alexander Montgomery III on platform infrastructure",
        description: "Senior Product Design Engineer, Platform Infrastructure",
        artwork: `${w}/wide.png`,
        showSpeed: true,
      },
      {
        src: "/media/track.mp3",
        title: "IMG_20250914_183022_HDR_portrait_edited_edited_voice_memo_final.m4a",
        artwork: `${w}/missing-cover.jpg`,
      },
      { src: "/media/track.mp3", description: "Episode 1284 - no title set", artwork: `${w}/tall.png` },
      { src: "/media/track.mp3", title: "نور الهدى عبد الرحمن - الحلقة ١٢", description: "بودكاست" },
      { src: `${w}/short.mp4`, title: "Jo", showSpeed: true },
      { src: "/media/track.mp3", title: "Đặng Thị Ngọc Hân", description: "Ẩẫỡ ข้อความทดสอบ" },
    ],
  },
  empty: {
    video: [{}],
    audio: [{}, { title: "Untitled" }],
  },
  error: {
    video: [{ src: `${w}/does-not-exist.mp4` }],
    audio: [
      { src: `${w}/does-not-exist.mp3`, title: "Bloom", description: "bobine", artwork: `${w}/wide.png` },
      { src: `${w}/does-not-exist.mp3` },
    ],
  },
}
