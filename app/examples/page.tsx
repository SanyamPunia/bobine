import type { Metadata } from "next"
import Link from "next/link"
// server component, so the SSR entry: the main one pulls in createContext
import { ArrowRightIcon, SquaresFourIcon } from "@phosphor-icons/react/dist/ssr"

import { buttonVariants } from "@/components/ui/button"
import { DocsNav } from "@/components/site/docs-nav"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { TooltipProvider } from "@/components/site/tooltip"
import { CONTENT_WIDTH } from "@/lib/constants"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Examples",
  description: "Players built with reel.",
}

/** A placeholder until the first examples land. */
export default function Page() {
  return (
    <TooltipProvider delay={300}>
      <SiteHeader current="/examples" />
      {/* the docs sidebar lists this page, so it stays on screen here too */}
      <DocsNav />

      <main id="content" className={cn("mx-auto flex w-full flex-col gap-10 px-5 pt-10 pb-24 md:pt-16", CONTENT_WIDTH)}>
        <header className="flex flex-col gap-3">
          <h1 className="text-title font-medium tracking-tight text-text-primary">Examples</h1>
          <p className="text-body text-pretty text-text-secondary">
            Players built with reel, from a single swapped tag to fully composed controls.
          </p>
        </header>

        <section
          aria-labelledby="empty-title"
          className="flex flex-col items-center gap-4 rounded-2xl bg-surface px-6 py-16 text-center shadow-frame"
        >
          <span className="grid size-10 place-items-center rounded-full bg-fill text-text-muted">
            <SquaresFourIcon aria-hidden="true" className="size-5" />
          </span>
          <div className="flex flex-col gap-1">
            <h2 id="empty-title" className="text-body font-medium text-text-primary">
              No examples yet
            </h2>
            <p className="text-action text-text-secondary">The first ones are on the way. The docs cover every part until then.</p>
          </div>
          <Link href="/docs" className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer motion-safe:active:scale-[0.98]")}>
            Read the docs
            <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
          </Link>
        </section>
      </main>

      <SiteFooter />
    </TooltipProvider>
  )
}
