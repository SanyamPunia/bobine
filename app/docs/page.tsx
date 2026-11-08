import type { Metadata } from "next"

import { AudioPlayer } from "@/components/ui/audio-player"
import { VideoPlayer } from "@/components/ui/video-player"
import { CodeBlock } from "@/components/site/code-block"
import { ComposedPlayer } from "@/components/site/composed-player"
import { Demo } from "@/components/site/demo"
import { HlsDemo } from "@/components/site/hls-demo"
import { Kbd } from "@/components/site/kbd"
import { PageActions } from "@/components/site/page-actions"
import { PageRail } from "@/components/site/page-rail"
import { PropsTable } from "@/components/site/props-table"
import { Section } from "@/components/site/section"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { SketchUnderline } from "@/components/site/sketch-underline"
import { TooltipProvider } from "@/components/site/tooltip"
import { CONTENT_WIDTH } from "@/lib/constants"
import {
  agentPrompt,
  audioProps,
  installCommands,
  intro,
  MEDIA_FILE,
  parts,
  sections,
  shortcuts,
  SKILL_INSTALL,
  usage,
  videoProps,
} from "@/lib/docs"
import { docsMarkdown } from "@/lib/markdown"
import { SITE_URL } from "@/lib/site"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Docs",
  description: "Install, use and compose the reel video and audio players.",
  alternates: { types: { "text/markdown": "/docs.md" } },
}

const heroTracks = [{ src: "/media/flower.en.vtt", label: "English", srcLang: "en" }]

const code = "rounded-md bg-fill px-1 py-0.5 font-mono text-code text-text-primary"

export default function Page() {
  const origin = SITE_URL
  const cmd = installCommands(`${origin}/r`)
  const s = sections

  return (
    <TooltipProvider delay={300}>
      <SiteHeader current="/docs" />
      <PageRail />

      <main className={cn("mx-auto flex w-full flex-col gap-20 px-5 pt-12 pb-24 md:pt-20", CONTENT_WIDTH)}>
        <header className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
              {/* max-w-sm, not flex-1: the title must not grow into the space the Copy
                  page button gives up when its label shortens. The serif has a
                  smaller x-height than Inter, so 1.15em matches it optically. */}
              <h1 className="max-w-sm min-w-0 text-title font-medium tracking-tight text-balance text-text-primary">
                The media player your browser should have{" "}
                <em className="font-serif text-[1.15em] font-normal">
                  <SketchUnderline>shipped</SketchUnderline>
                </em>
                .
              </h1>
              <PageActions markdown={docsMarkdown(origin)} prompt={agentPrompt(origin)} origin={origin} />
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
                metadata={{ title: "Bloom", artist: "reel" }}
              />
            </Demo>
            <CodeBlock prompt code={cmd.video} />
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

        <Section id={s.compose.id} title={s.compose.title} description={s.compose.description}>
          <Demo bleed>
            <ComposedPlayer />
          </Demo>
          <CodeBlock prompt code={cmd.media} />
          <CodeBlock code={usage.composed} />
        </Section>

        <Section id={s.streaming.id} title={s.streaming.title} description={s.streaming.description}>
          <Demo bleed>
            <HlsDemo />
          </Demo>
          <CodeBlock prompt code={cmd.hls} />
          <CodeBlock code={usage.hls} />
        </Section>

        <Section id={s.loader.id} title={s.loader.title} description={s.loader.description}>
          <CodeBlock label="dash-loader.ts" code={usage.loader} />
        </Section>

        <Section id={s.package.id} title={s.package.title} description={s.package.description}>
          <CodeBlock prompt code={cmd.package} />
          <CodeBlock code={usage.package} />
        </Section>

        <Section id={s.api.id} title={s.api.title} description={s.api.description}>
          <PropsTable component="VideoPlayer" props={videoProps} />
          <PropsTable component="AudioPlayer" props={audioProps} />
        </Section>

        <Section
          id={s.parts.id}
          title={s.parts.title}
          description={
            <>
              {"Everything is exported from "}
              <code className={code}>{MEDIA_FILE}</code>
              {"."}
            </>
          }
        >
          <dl className="flex flex-col divide-y divide-stroke-soft border-y border-stroke">
            {parts.map(([name, description]) => (
              <div key={name} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
                <dt className="shrink-0 font-mono text-code text-text-primary sm:w-56">{name}</dt>
                <dd className="text-action text-text-secondary">{description}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id={s.theming.id} title={s.theming.title} description={s.theming.description}>
          <CodeBlock label="globals.css" code={usage.theming} />
        </Section>

        <Section id={s.keyboard.id} title={s.keyboard.title} description={s.keyboard.description}>
          <dl className="grid border-t border-stroke sm:grid-cols-2 sm:gap-x-8">
            {shortcuts.map(({ keys, action }) => (
              <div key={action} className="flex items-center justify-between gap-4 border-b border-stroke-soft py-2.5">
                <dt className="text-action text-text-secondary">{action}</dt>
                <dd className="flex items-center gap-1">
                  {keys.map((key) => (
                    <Kbd key={key} value={key} />
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id={s.agents.id} title={s.agents.title} description={s.agents.description}>
          <CodeBlock prompt code={SKILL_INSTALL} />
        </Section>
      </main>

      <SiteFooter />
    </TooltipProvider>
  )
}
