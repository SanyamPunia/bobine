import { agentPrompt, installCommands, intro, keyLabels, parts, sections, shortcuts, usage } from "@/lib/docs"
import { landing } from "@/lib/landing"

/**
 * Markdown versions of the two pages, plus the llms.txt index. Built from the
 * same data the pages render, so an agent reads what a person sees.
 */

const fence = (code: string, lang = "tsx") => `\`\`\`${lang}\n${code}\n\`\`\``

export const WHEN_TO_USE = `Use reel when a React app needs a video or audio player that keeps the native element's props, matches the app's shadcn theme, and lives in the repo as editable source. It covers MP4, WebM, MP3, captions (WebVTT), picture-in-picture, fullscreen, keyboard shortcuts and HLS streams through hls.js.

Do not use reel for a non-React app, for DRM-protected streams (reel sets up no DRM), or for a video editor or timeline. Use the framework-agnostic core in reel-media/core when you need the player state without React.`

export function docsMarkdown(origin: string): string {
  const cmd = installCommands(`${origin}/r`)
  const s = sections
  return [
    `# reel docs`,
    `> ${intro.title} Swap \`<video>\` for \`<VideoPlayer>\`. ${intro.lede}`,
    `## Install`,
    fence(cmd.video, "bash"),
    `## ${s.video.title}`,
    s.video.description,
    fence(usage.video),
    `## ${s.audio.title}`,
    s.audio.description,
    fence(cmd.audio, "bash"),
    fence(usage.audio),
    `## ${s.compose.title}`,
    s.compose.description,
    fence(cmd.media, "bash"),
    fence(usage.composed),
    `## ${s.streaming.title}`,
    s.streaming.description,
    fence(cmd.hls, "bash"),
    fence(usage.hls),
    `## ${s.package.title}`,
    s.package.description,
    fence(cmd.package, "bash"),
    fence(usage.package),
    `## ${s.parts.title}`,
    s.parts.description.replace(/(components\/\S+\.tsx)/, "`$1`"),
    parts.map(([name, description]) => `- \`${name}\`: ${description}`).join("\n"),
    `## ${s.keyboard.title}`,
    s.keyboard.description,
    [
      "| Keys | Action |",
      "| --- | --- |",
      ...shortcuts.map(({ keys, action }) => `| ${keys.map((k) => keyLabels[k] ?? k).join(", ")} | ${action} |`),
    ].join("\n"),
    `## Prompt for coding agents`,
    "Paste this into an agent to install reel in a project.",
    fence(agentPrompt(origin), "text"),
  ].join("\n\n") + "\n"
}

export function landingMarkdown(origin: string): string {
  const cmd = installCommands(`${origin}/r`)
  return [
    `# reel`,
    `> ${landing.title} ${landing.lede}`,
    fence(cmd.video, "bash"),
    `## ${landing.swap.title}`,
    landing.swap.description,
    fence(landing.swap.before),
    fence(landing.swap.after),
    `## ${landing.features.title}`,
    landing.features.items.map((f) => `- **${f.title}**: ${f.description}`).join("\n"),
    `## ${landing.audio.title}`,
    landing.audio.description,
    fence(cmd.audio, "bash"),
    `## ${landing.start.title}`,
    `${landing.start.description} Read [the docs](${origin}/docs.md).`,
  ].join("\n\n") + "\n"
}

export function llmsIndex(origin: string): string {
  return [
    `# reel`,
    `> Drop-in video and audio players for React, distributed as a shadcn registry and as the reel-media npm package.`,
    WHEN_TO_USE,
    `## Docs`,
    [
      `- [Docs](${origin}/docs.md): install, usage, composition, streaming, parts and keyboard shortcuts`,
      `- [Full docs in one file](${origin}/llms-full.txt): the docs above, for loading into context`,
      `- [Overview](${origin}/index.md): what reel is and what it does`,
    ].join("\n"),
    `## Registry`,
    [
      `- [registry.json](${origin}/r/registry.json): every installable item`,
      `- [video-player](${origin}/r/video-player.json): the drop-in video player`,
      `- [audio-player](${origin}/r/audio-player.json): the audio player`,
      `- [media](${origin}/r/media.json): unstyled primitives to compose your own`,
      `- [media-hls](${origin}/r/media-hls.json): the HLS loader`,
    ].join("\n"),
    `## Optional`,
    [
      `- [npm package](https://www.npmjs.com/package/reel-media): reel-media, the same components as a dependency`,
      `- [Sitemap](${origin}/sitemap.xml)`,
    ].join("\n"),
  ].join("\n\n") + "\n"
}
