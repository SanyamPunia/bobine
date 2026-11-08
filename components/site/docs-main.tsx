import { cn } from "@/lib/utils"
import { CONTENT_WIDTH } from "@/lib/constants"
import type { DocPage } from "@/lib/docs"
import { DocsPager } from "@/components/site/docs-pager"
import { PageRail } from "@/components/site/page-rail"

/** One docs page's column: "On this page", the content, then the pager. */
export function DocsMain({ current, children }: { current: DocPage["href"]; children: React.ReactNode }) {
  return (
    <>
      <PageRail />
      <main className={cn("mx-auto flex w-full flex-col gap-20 px-5 pt-10 pb-24 md:pt-16", CONTENT_WIDTH)}>
        {children}
        <DocsPager current={current} />
      </main>
    </>
  )
}
