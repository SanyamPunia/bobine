import type { Metadata } from "next"
import Link from "next/link"
// server component, so the SSR entry: the main one pulls in createContext
import {
  ArrowRightIcon,
  BroadcastIcon,
  CircleHalfIcon,
  CodeIcon,
  FileCodeIcon,
  KeyboardIcon,
  SquaresFourIcon,
} from "@phosphor-icons/react/dist/ssr"
// type-only, erased at build, so it pulls no client code into this server file
import type { Icon } from "@phosphor-icons/react"

import { buttonVariants } from "@/components/ui/button"
import { AudioPlayer } from "@/components/ui/audio-player"
import { VideoPlayer } from "@/components/ui/video-player"
import { CodeBlock } from "@/components/site/code-block"
import { InstallNote } from "@/components/site/install-note"
import { CopyAction } from "@/components/site/copy-action"
import { Demo } from "@/components/site/demo"
import { Section } from "@/components/site/section"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { SketchUnderline } from "@/components/site/sketch-underline"
import { TooltipProvider } from "@/components/site/tooltip"
import { pageMetadata, SITE_DESCRIPTION } from "@/lib/metadata"
import { CONTENT_WIDTH } from "@/lib/constants"
import { agentPrompt, installCommands, intro } from "@/lib/docs"
import { landing, type FeatureKey } from "@/lib/landing"
import { SITE_URL } from "@/lib/site"
import { cn } from "@/lib/utils"

export const metadata: Metadata = pageMetadata({ description: SITE_DESCRIPTION, path: "/", markdown: "/index.md" })

const featureIcons: Record<FeatureKey, Icon> = {
  props: CodeIcon,
  source: FileCodeIcon,
  keyboard: KeyboardIcon,
  streams: BroadcastIcon,
  theme: CircleHalfIcon,
  compose: SquaresFourIcon,
}

const heroTracks = [{ src: "/media/flower.en.vtt", label: "English", srcLang: "en" }]

const action = "cursor-pointer motion-safe:active:scale-[0.98]"

export default function Page() {
  const origin = SITE_URL
  const cmd = installCommands(`${origin}/r`)
  const { swap, features, audio, start } = landing

  return (
    <TooltipProvider delay={300}>
      <SiteHeader current="/" />

      <main id="content" className={cn("mx-auto flex w-full flex-col gap-20 px-5 pt-12 pb-24 md:pt-20", CONTENT_WIDTH)}>
        <header className="flex flex-col gap-10">
          {/* title and lede are one group, the actions sit apart */}
          <div className="flex flex-col gap-4">
            {/* the serif has a smaller x-height than Inter, so 1.15em matches it optically */}
            <h1 className="relative isolate text-display font-medium tracking-tight text-balance text-text-primary">
              {/* blueprint rules on each line box, wider than the viewport and
                  faded at both ends. 1lh ties the pitch to the title's own line
                  height. Arbitrary values: no utility draws repeating rules. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 hidden w-screen -translate-x-1/2 border-b border-stroke sm:block bg-[linear-gradient(to_bottom,var(--stroke)_1px,transparent_1px)] bg-size-[100%_1lh] [mask-image:linear-gradient(to_right,transparent,black_30%,black_70%,transparent)]"
              />
              The media player your browser should have{" "}
              <em className="font-serif text-[1.15em] font-normal">
                <SketchUnderline>shipped</SketchUnderline>
              </em>
              .
            </h1>
            <p className="max-w-lg text-body text-pretty text-text-secondary">{landing.lede}</p>
            <div className="flex flex-wrap items-center gap-2 pt-3">
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
                metadata={{ title: "Bloom", artist: "bobine" }}
              />
            </Demo>
            <CodeBlock prompt code={cmd.video} />
            <InstallNote text={intro.requires} />
          </div>
        </header>

        <Section id={swap.id} title={swap.title} description={swap.description}>
          <CodeBlock label="before.tsx" code={swap.before} />
          <CodeBlock label="after.tsx" code={swap.after} />
        </Section>

        <Section id={features.id} title={features.title} description={features.description}>
          <ul className="grid gap-px overflow-hidden rounded-2xl bg-stroke shadow-frame sm:grid-cols-2">
            {features.items.map(({ key, title, description }) => {
              const FeatureIcon = featureIcons[key]
              return (
                <li key={key} className="flex flex-col gap-1 bg-surface p-5">
                  <FeatureIcon aria-hidden="true" className="mb-2 size-4 text-text-muted" />
                  <span className="text-action font-medium text-text-primary">{title}</span>
                  <span className="text-action text-pretty text-text-secondary">{description}</span>
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
          className="relative isolate flex flex-col items-center gap-6 overflow-hidden rounded-2xl bg-surface px-6 py-16 text-center shadow-frame sm:py-20"
        >
          {/* a faint dot grid that fades out from the centre, so the closing
              card reads as the page's ending and not as another demo stage.
              The 16px pitch has no spacing token at this size. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--stroke-strong)_1px,transparent_1px)] bg-size-[16px_16px] mask-radial-from-0% mask-radial-to-70%"
          />
          <div className="flex max-w-md flex-col gap-2">
            <h2 id="start-title" className="text-title font-medium tracking-tight text-balance text-text-primary">
              {start.title}
            </h2>
            <p className="text-body text-pretty text-text-secondary">{start.description}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link href="/docs" className={cn(buttonVariants({ size: "lg" }), action)}>
              Read the docs
              <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
            </Link>
            <CopyAction value={agentPrompt(origin)} label="Copy agent prompt" icon="prompt" size="lg" />
          </div>
        </section>
      </main>

      <SiteFooter />
    </TooltipProvider>
  )
}
