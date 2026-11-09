import type { Metadata } from "next"

import { AudioPlayer } from "@/components/ui/audio-player"
import { MediaPlayButton, MediaRoot, MediaSeek, MediaSurface, MediaVideo } from "@/components/ui/media"
import { VideoPlayer } from "@/components/ui/video-player"
import { CodeBlock } from "@/components/site/code-block"
import { Demo } from "@/components/site/demo"
import { DocsPager } from "@/components/site/docs-pager"
import { PageRail } from "@/components/site/page-rail"
import { Playground } from "@/components/site/playground"
import { Section } from "@/components/site/section"
import { TrackList } from "@/components/site/track-list"
import { pageMetadata } from "@/lib/metadata"
import { CONTENT_WIDTH } from "@/lib/constants"
import { audioRecipes, examplesIntro, examplesSections as s, videoRecipes, type Recipe } from "@/lib/examples"
import { cn } from "@/lib/utils"

export const metadata: Metadata = pageMetadata({
  title: examplesIntro.title,
  description: examplesIntro.description,
  path: "/docs/examples",
  markdown: "/docs/examples.md",
})

const tracks = [{ src: "/media/flower.en.vtt", label: "English", srcLang: "en", default: true }]
const flower = "Demo video of a blooming flower"

/** One recipe: a named use, the live player, then the code that makes it. */
function RecipeBlock({ recipe, bleed, children }: { recipe: Recipe; bleed?: boolean; children: React.ReactNode }) {
  return (
    <article id={recipe.id} aria-labelledby={`${recipe.id}-title`} className="flex scroll-mt-24 flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h3 id={`${recipe.id}-title`} className="text-body font-medium text-text-primary">
          {recipe.title}
        </h3>
        <p className="text-action text-pretty text-text-secondary">{recipe.description}</p>
      </div>

      {/**
       * One card per example: the live player on top, its code below, split by
       * a single border and the change of tone. The card clips both, so the
       * stage and the code tray drop their own radius and shadow.
       */}
      <div className="overflow-hidden rounded-2xl shadow-frame">
        <Demo bleed={bleed} className="rounded-none shadow-none">
          {children}
        </Demo>
        <CodeBlock code={recipe.code} className="rounded-none border-t border-stroke shadow-none" />
      </div>
    </article>
  )
}

export default function Page() {
  const v = videoRecipes
  const a = audioRecipes

  return (
    <>
      {/* the docs layout supplies the header, sidebar and footer */}
      <PageRail />

      <main id="content" className={cn("mx-auto flex w-full flex-col gap-20 px-5 pt-10 pb-24 md:pt-16", CONTENT_WIDTH)}>
        <header className="flex flex-col gap-3">
          <h1 className="text-title font-medium tracking-tight text-text-primary">{examplesIntro.title}</h1>
          <p className="text-body text-pretty text-text-secondary">{examplesIntro.lede}</p>
        </header>

        <Section id={s.playground.id} title={s.playground.title} description={s.playground.description}>
          <Playground />
        </Section>

        <Section id={s.video.id} title={s.video.title} description={s.video.description}>
          <div className="flex flex-col gap-14">
            <RecipeBlock recipe={v.lesson} bleed>
              <VideoPlayer src="/media/flower.mp4" aria-label={flower} tracks={tracks} persistKey="bobine-examples-course" />
            </RecipeBlock>

            <RecipeBlock recipe={v.ambient} bleed>
              <VideoPlayer src="/media/flower.mp4" aria-label={flower} autoPlay muted loop playsInline tooltips={false} />
            </RecipeBlock>

            <RecipeBlock recipe={v.square}>
              <VideoPlayer
                src="/media/flower.mp4"
                aria-label={flower}
                frameClassName="aspect-square max-w-sm"
                className="object-cover"
              />
            </RecipeBlock>

            <RecipeBlock recipe={v.minimal} bleed>
              <MediaRoot className="aspect-video overflow-hidden rounded-xl bg-media-scrim text-media-foreground">
                <MediaVideo src="/media/flower.mp4" aria-label={flower} className="size-full object-cover" />
                <MediaSurface />
                <MediaPlayButton className="absolute inset-0 m-auto size-12 rounded-full bg-media-scrim/50 backdrop-blur-md group-data-playing/media:pointer-events-none group-data-playing/media:opacity-0" />
                <MediaSeek className="absolute inset-x-4 bottom-4" />
              </MediaRoot>
            </RecipeBlock>
          </div>
        </Section>

        <Section id={s.audio.id} title={s.audio.title} description={s.audio.description}>
          <div className="flex flex-col gap-14">
            <RecipeBlock recipe={a.podcast}>
              <AudioPlayer
                src="/media/track.mp3"
                title="Episode 12"
                description="Field notes"
                showSpeed
                persistKey="bobine-examples-podcast"
                frameClassName="max-w-md bg-bg"
              />
            </RecipeBlock>

            <RecipeBlock recipe={a.voice}>
              <AudioPlayer src="/media/track.mp3" frameClassName="max-w-xs rounded-full bg-bg" />
            </RecipeBlock>

            <RecipeBlock recipe={a.tracks}>
              <TrackList />
            </RecipeBlock>
          </div>
        </Section>
        <DocsPager current="/docs/examples" />
      </main>
    </>
  )
}
