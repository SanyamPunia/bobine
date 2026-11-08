import type { DocPage } from "@/lib/docs"
import { agentPrompt } from "@/lib/docs"
import { docPageMarkdown } from "@/lib/markdown"
import { SITE_URL } from "@/lib/site"
import { PageActions } from "@/components/site/page-actions"

/** Title, description and page actions for a docs page after Getting started. */
export function DocsPageHeader({ page }: { page: DocPage }) {
  return (
    <header className="flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        {/* max-w-sm, not flex-1: the title must not grow into the space the Copy
            page button gives up when its label shortens */}
        <h1 className="max-w-sm min-w-0 text-title font-medium tracking-tight text-balance text-text-primary">{page.title}</h1>
        <PageActions markdown={docPageMarkdown(page, SITE_URL)} prompt={agentPrompt(SITE_URL)} origin={SITE_URL} mdPath={page.md} />
      </div>
      <p className="text-body text-pretty text-text-secondary">{page.description}</p>
    </header>
  )
}
