import { cn } from "@/lib/utils"
import { CONTENT_WIDTH } from "@/lib/constants"

const link =
  "cursor-pointer rounded-xs font-mono transition-colors duration-150 hover:text-text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"

export function SiteFooter() {
  return (
    <footer className={cn("mx-auto w-full px-5 pb-12", CONTENT_WIDTH)}>
      <div className="flex items-center justify-between gap-4 border-t border-stroke pt-6 text-meta text-text-muted">
        <div className="flex items-center gap-1.5">
          <span className="font-mono">reel</span>
          <span aria-hidden="true" className="inline-block size-1 shrink-0 rounded-full bg-stroke-strong" />
          <span>MIT licensed</span>
        </div>
        <nav aria-label="For agents" className="flex items-center gap-4">
          <a href="/llms.txt" className={link}>
            llms.txt
          </a>
          <a href="/llms-full.txt" className={link}>
            llms-full.txt
          </a>
        </nav>
      </div>
    </footer>
  )
}
