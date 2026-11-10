import type { Metadata } from "next"

import { CodeBlock } from "@/components/site/code-block"
import { ComposedPlayer } from "@/components/site/composed-player"
import { Demo } from "@/components/site/demo"
import { DocsMain } from "@/components/site/docs-main"
import { DocsPageHeader } from "@/components/site/docs-page-header"
import { HlsDemo } from "@/components/site/hls-demo"
import { Section } from "@/components/site/section"
import { pageMetadata } from "@/lib/metadata"
import { docPage, installCommands, sections, usage } from "@/lib/docs"
import { SITE_URL } from "@/lib/site"

const page = docPage("/docs/guides")

export const metadata: Metadata = pageMetadata({
  title: page.title,
  description: page.description,
  path: page.href,
  markdown: page.md,
})

export default function Page() {
  const cmd = installCommands(`${SITE_URL}/r`)
  const s = sections

  return (
    <DocsMain current={page.href}>
      <DocsPageHeader page={page} />

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

      <Section id={s.theming.id} title={s.theming.title} description={s.theming.description}>
        <CodeBlock label="globals.css" code={usage.theming} />
        <CodeBlock code={usage.themeScope} />
        <CodeBlock label="globals.css" code={usage.themeLight} />
      </Section>
    </DocsMain>
  )
}
