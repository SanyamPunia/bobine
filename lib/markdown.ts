import {
  agentPrompt,
  type DocPage,
  docPages,
  type SectionId,
  audioProps,
  installCommands,
  intro,
  keyLabels,
  parts,
  type Prop,
  sections,
  shortcuts,
  SKILL_INSTALL,
  usage,
  videoProps,
} from "@/lib/docs"
import { audioRecipes, examplesIntro, examplesSections, videoRecipes, type Recipe } from "@/lib/examples"
import { landing } from "@/lib/landing"

/**
 * Markdown versions of the two pages, plus the llms.txt index. Built from the
 * same data the pages render, so an agent reads what a person sees.
 */

const fence = (code: string, lang = "tsx") => `\`\`\`${lang}\n${code}\n\`\`\``

const propsTable = (component: string, props: readonly Prop[]) =>
  [
    `### ${component}`,
    [
      "| Prop | Type | Description |",
      "| --- | --- | --- |",
      ...props.map((p) => `| \`${p.name}\` | \`${p.type}\` | ${p.description} |`),
    ].join("\n"),
  ].join("\n\n")

export const WHEN_TO_USE = `Use reel when a React app needs a video or audio player that keeps the native element's props, matches the app's shadcn theme, and lives in the repo as editable source. It covers MP4, WebM, MP3, captions (WebVTT), picture-in-picture, fullscreen, keyboard shortcuts and HLS streams through hls.js.

Do not use reel for a non-React app, for DRM-protected streams (reel sets up no DRM), or for a video editor or timeline. Use the framework-agnostic core in reel-media/core when you need the player state without React.`

/** One block per docs section, keyed like `sections` in lib/docs.ts. */
function sectionMarkdown(origin: string): Record<SectionId, string[]> {
  const cmd = installCommands(`${origin}/r`)
  const s = sections
  return {
    video: [`## ${s.video.title}`, s.video.description, fence(usage.video)],
    audio: [`## ${s.audio.title}`, s.audio.description, fence(cmd.audio, "bash"), fence(usage.audio)],
    package: [`## ${s.package.title}`, s.package.description, fence(cmd.package, "bash"), fence(usage.package)],
    agents: [
      `## ${s.agents.title}`,
      s.agents.description,
      fence(SKILL_INSTALL, "bash"),
      "Or paste this prompt into an agent to install reel in a project.",
      fence(agentPrompt(origin), "text"),
    ],
    compose: [`## ${s.compose.title}`, s.compose.description, fence(cmd.media, "bash"), fence(usage.composed)],
    streaming: [`## ${s.streaming.title}`, s.streaming.description, fence(cmd.hls, "bash"), fence(usage.hls)],
    loader: [`## ${s.loader.title}`, s.loader.description, fence(usage.loader, "ts")],
    theming: [`## ${s.theming.title}`, s.theming.description, fence(usage.theming, "css")],
    api: [`## ${s.api.title}`, s.api.description, propsTable("VideoPlayer", videoProps), propsTable("AudioPlayer", audioProps)],
    parts: [
      `## ${s.parts.title}`,
      s.parts.description.replace(/(components\/\S+\.tsx)/, "`$1`"),
      parts.map(([name, description]) => `- \`${name}\`: ${description}`).join("\n"),
    ],
    keyboard: [
      `## ${s.keyboard.title}`,
      s.keyboard.description,
      [
        "| Keys | Action |",
        "| --- | --- |",
        ...shortcuts.map(({ keys, action }) => `| ${keys.map((k) => keyLabels[k] ?? k).join(", ")} | ${action} |`),
      ].join("\n"),
    ],
  }
}

/** One docs page as markdown: its title, description, sections, and links to the other pages. */
export function docPageMarkdown(page: DocPage, origin: string): string {
  const blocks = sectionMarkdown(origin)
  const lead =
    page.href === "/docs"
      ? [`> ${intro.title} Swap \`<video>\` for \`<VideoPlayer>\`. ${intro.lede}`, `## Install`, fence(installCommands(`${origin}/r`).video, "bash")]
      : [`> ${page.description}`]
  const others = docPages
    .filter((p) => p.href !== page.href)
    .map((p) => `- [${p.title}](${origin}${p.md}): ${p.description}`)
    .join("\n")
  return (
    [`# ${page.title}`, ...lead, ...page.sections.flatMap((id) => blocks[id]), `## More docs`, others].join("\n\n") + "\n"
  )
}

/** Every docs page in reading order, for llms-full.txt. */
export function docsMarkdown(origin: string): string {
  const blocks = sectionMarkdown(origin)
  return (
    [
      `# reel docs`,
      `> ${intro.title} Swap \`<video>\` for \`<VideoPlayer>\`. ${intro.lede}`,
      `## Install`,
      fence(installCommands(`${origin}/r`).video, "bash"),
      ...docPages.flatMap((page) => [`# ${page.title}`, ...page.sections.flatMap((id) => blocks[id])]),
    ].join("\n\n") + "\n"
  )
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

const recipeMarkdown = (recipe: Recipe) => [`### ${recipe.title}`, recipe.description, fence(recipe.code)]

/** The examples page. The playground is interactive, so only its purpose is described. */
export function examplesMarkdown(origin: string): string {
  const s = examplesSections
  return (
    [
      `# ${examplesIntro.title}`,
      `> ${examplesIntro.description} ${examplesIntro.lede}`,
      `## ${s.playground.title}`,
      `${s.playground.description} Open [the examples page](${origin}/examples) to use it.`,
      `## ${s.video.title}`,
      s.video.description,
      ...Object.values(videoRecipes).flatMap(recipeMarkdown),
      `## ${s.audio.title}`,
      s.audio.description,
      ...Object.values(audioRecipes).flatMap(recipeMarkdown),
    ].join("\n\n") + "\n"
  )
}

export function llmsIndex(origin: string): string {
  return [
    `# reel`,
    `> Drop-in video and audio players for React, distributed as a shadcn registry and as the reel-media npm package.`,
    WHEN_TO_USE,
    `## Docs`,
    [
      ...docPages.map((page) => `- [${page.title}](${origin}${page.md}): ${page.description}`),
      `- [Full docs in one file](${origin}/llms-full.txt): every page above, for loading into context`,
      `- [Overview](${origin}/index.md): what reel is and what it does`,
      `- [Examples](${origin}/examples.md): recipes for common jobs, each with its code`,
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
      `- [Agent skill](https://github.com/SanyamPunia/reel/tree/main/skills/reel): install with \`${SKILL_INSTALL}\``,
      `- [npm package](https://www.npmjs.com/package/reel-media): reel-media, the same components as a dependency`,
      `- [Sitemap](${origin}/sitemap.xml)`,
    ].join("\n"),
  ].join("\n\n") + "\n"
}
