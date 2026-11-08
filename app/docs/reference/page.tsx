import type { Metadata } from "next"

import { DocsMain } from "@/components/site/docs-main"
import { DocsPageHeader } from "@/components/site/docs-page-header"
import { Kbd } from "@/components/site/kbd"
import { PropsTable } from "@/components/site/props-table"
import { Section } from "@/components/site/section"
import { audioProps, docPage, MEDIA_FILE, parts, sections, shortcuts, videoProps } from "@/lib/docs"

const page = docPage("/docs/reference")

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { types: { "text/markdown": page.md } },
}

const code = "rounded-md bg-fill px-1 py-0.5 font-mono text-code text-text-primary"

export default function Page() {
  const s = sections

  return (
    <DocsMain current={page.href}>
      <DocsPageHeader page={page} />

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
    </DocsMain>
  )
}
