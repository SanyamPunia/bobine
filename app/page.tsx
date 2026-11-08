import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRightIcon,
  BlocksIcon,
  CodeXmlIcon,
  FileCodeIcon,
  KeyboardIcon,
  RadioTowerIcon,
  SunMoonIcon,
  type LucideIcon,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { AudioPlayer } from "@/components/ui/audio-player"
import { VideoPlayer } from "@/components/ui/video-player"
import { CodeBlock } from "@/components/site/code-block"
import { CopyAction } from "@/components/site/copy-action"
import { Demo } from "@/components/site/demo"
import { PageTransition } from "@/components/site/page-transition"
import { Section } from "@/components/site/section"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { SketchUnderline } from "@/components/site/sketch-underline"
import { TooltipProvider } from "@/components/site/tooltip"
import { CONTENT_WIDTH } from "@/lib/constants"
import { agentPrompt, installCommands } from "@/lib/docs"
import { landing, type FeatureKey } from "@/lib/landing"
import { getOrigin } from "@/lib/registry"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  alternates: { types: { "text/markdown": "/index.md" } },
}

const featureIcons: Record<FeatureKey, LucideIcon> = {
  props: CodeXmlIcon,
  source: FileCodeIcon,
  keyboard: KeyboardIcon,
  streams: RadioTowerIcon,
  theme: SunMoonIcon,
  compose: BlocksIcon,
}

const heroTracks = [{ src: "/media/flower.en.vtt", label: "English", srcLang: "en" }]

const action = "cursor-pointer active:scale-[0.98]"

export default async function Page() {
  const origin = await getOrigin()
  const cmd = installCommands(`${origin}/r`)
  const { swap, features, audio, start } = landing

  return (
    <TooltipProvider delay={300}>
      <SiteHeader current="/" />

      <PageTransition>
        <main className={cn("mx-auto flex w-full flex-col gap-20 px-5 pt-12 pb-24 md:pt-20", CONTENT_WIDTH)}>
          <header className="flex flex-col gap-10">
            <div className="flex flex-col gap-5">
              {/* the serif has a smaller x-height than Inter, so 1.15em matches it optically */}
              <h1 className="text-display font-medium tracking-tight text-balance text-text-primary">
                The media player your browser should have{" "}
                <em className="font-serif text-[1.15em] font-normal">
                  <SketchUnderline>shipped</SketchUnderline>
                </em>
                .
              </h1>
              <p className="max-w-lg text-body text-pretty text-text-secondary">{landing.lede}</p>
              <div className="flex flex-wrap items-center gap-2">
                <Link href="/docs" className={cn(buttonVariants({ size: "lg" }), action)}>
                  Read the docs
                  <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
                </Link>
                <CopyAction value={agentPrompt(origin)} label="Copy agent prompt" icon="prompt" size="lg" />
              </div>
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

          <Section id={swap.id} title={swap.title} description={swap.description}>
            <CodeBlock label="before.tsx" code={swap.before} />
            <CodeBlock label="after.tsx" code={swap.after} />
          </Section>

          <Section id={features.id} title={features.title} description={features.description}>
            <ul className="grid gap-px overflow-hidden rounded-2xl bg-stroke shadow-frame sm:grid-cols-2">
              {features.items.map(({ key, title, description }) => {
                const Icon = featureIcons[key]
                return (
                  <li key={key} className="flex flex-col gap-2 bg-surface p-5">
                    <Icon aria-hidden="true" className="size-4 text-text-muted" />
                    <span className="text-action font-medium text-text-primary">{title}</span>
                    <span className="text-action text-text-secondary">{description}</span>
                  </li>
                )
              })}
            </ul>
          </Section>

          <Section id={audio.id} title={audio.title} description={audio.description}>
            <Demo>
              <AudioPlayer
                src="/media/track.mp3"
                title="Morning Drift"
                description="Demo track"
                showSpeed
                frameClassName="max-w-md bg-bg"
              />
            </Demo>
          </Section>

          <section
            aria-labelledby="start-title"
            className="flex flex-col items-start gap-4 rounded-2xl bg-surface p-6 shadow-frame sm:p-8"
          >
            <div className="flex flex-col gap-1.5">
              <h2 id="start-title" className="text-body font-medium text-text-primary">
                {start.title}
              </h2>
              <p className="text-body text-pretty text-text-secondary">{start.description}</p>
            </div>
            <Link href="/docs" className={cn(buttonVariants({ size: "lg" }), action)}>
              Read the docs
              <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
            </Link>
          </section>
        </main>

        <SiteFooter />
      </PageTransition>
    </TooltipProvider>
  )
}
