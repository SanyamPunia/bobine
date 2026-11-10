import type { Metadata } from "next"

import { AudioPlayer } from "@/components/ui/audio-player"
import { VideoPlayer } from "@/components/ui/video-player"
import { CodeBlock } from "@/components/site/code-block"
import { Demo } from "@/components/site/demo"
import { DocsMain } from "@/components/site/docs-main"
import { InstallNote } from "@/components/site/install-note"
import { PageActions } from "@/components/site/page-actions"
import { Section } from "@/components/site/section"
import { pageMetadata } from "@/lib/metadata"
import { agentPrompt, docPage, installCommands, intro, sections, SKILL_INSTALL, usage } from "@/lib/docs"
import { docPageMarkdown } from "@/lib/markdown"
import { SITE_URL } from "@/lib/site"

const page = docPage("/docs")

export const metadata: Metadata = pageMetadata({
  title: page.title,
  description: page.description,
  path: page.href,
  markdown: page.md,
})

const heroTracks = [{ src: "/media/flower.en.vtt", label: "English", srcLang: "en" }]

const code = "rounded-md bg-fill px-1 py-0.5 font-mono text-code text-text-primary"

export default function Page() {
  const cmd = installCommands(`${SITE_URL}/r`)
  const s = sections

  return (
    <DocsMain current={page.href}>
      <header className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
            {/* max-w-sm, not flex-1: the title must not grow into the space the Copy
                page button gives up when its label shortens */}
            <h1 className="max-w-sm min-w-0 text-title font-medium tracking-tight text-balance text-text-primary">
              {page.title}
            </h1>
            <PageActions
              markdown={docPageMarkdown(page, SITE_URL)}
              prompt={agentPrompt(SITE_URL)}
              origin={SITE_URL}
              mdPath={page.md}
            />
          </div>
          <p className="text-body text-pretty text-text-secondary">
            {"Swap "}
            <code className={code}>{"<video>"}</code>
            {" for "}
            <code className={code}>{"<VideoPlayer>"}</code>
            {`. ${intro.lede}`}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Demo bleed>
            <VideoPlayer
              src="/media/flower.mp4"
              loop
              tracks={heroTracks}
              aria-label="Demo video of a blooming flower"
              metadata={{ title: "Bloom", artist: "bobine" }}
            />
          </Demo>
          <CodeBlock prompt code={cmd.video} />
          <InstallNote text={intro.requires} />
        </div>
      </header>

      <Section id={s.video.id} title={s.video.title} description={s.video.description}>
        <CodeBlock code={usage.video} />
      </Section>

      <Section id={s.audio.id} title={s.audio.title} description={s.audio.description}>
        <Demo>
          <AudioPlayer
            src="/media/track.mp3"
            title="Morning Drift"
            description="Demo track"
            showSpeed
            frameClassName="max-w-md bg-bg"
          />
        </Demo>
        <CodeBlock prompt code={cmd.audio} />
        <CodeBlock code={usage.audio} />
      </Section>

      <Section id={s.package.id} title={s.package.title} description={s.package.description}>
        <CodeBlock prompt code={cmd.package} />
        <CodeBlock code={usage.package} />
      </Section>

      <Section id={s.agents.id} title={s.agents.title} description={s.agents.description}>
        <CodeBlock prompt code={SKILL_INSTALL} />
        <CodeBlock label="prompt" code={agentPrompt(SITE_URL)} plain />
      </Section>
    </DocsMain>
  )
}
