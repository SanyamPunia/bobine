import { cn } from "@/lib/utils"
import { CONTENT_WIDTH } from "@/lib/constants"

const authors = [
  { name: "Sanyam", href: "https://x.com/sanyampunia", avatar: "/team/sanyam.jpg" },
  { name: "Aviral", href: "https://x.com/aviralj02", avatar: "/team/aviral.jpg" },
]

const link =
  "cursor-pointer rounded-xs transition-colors duration-150 hover:text-text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"

const dot = <span aria-hidden="true" className="inline-block size-1 shrink-0 rounded-full bg-stroke-strong" />

export function SiteFooter() {
  return (
    <footer className={cn("mx-auto w-full px-5 pb-12", CONTENT_WIDTH)}>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-stroke pt-6 text-meta text-text-muted">
        <p className="flex items-center gap-1.5">
          Built by
          {authors.map((author, i) => (
            <span key={author.name} className="flex items-center gap-1.5">
              {i > 0 && <span>and</span>}
              <a
                href={author.href}
                target="_blank"
                rel="noreferrer"
                className="group flex cursor-pointer items-center gap-1 rounded-full bg-fill py-0.5 pr-2 pl-0.5 transition-[background-color,scale] duration-150 hover:bg-fill-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-safe:active:scale-[0.98]"
              >
                {/* decorative: the name beside it labels the link */}
                <img
                  src={author.avatar}
                  alt=""
                  width={16}
                  height={16}
                  draggable={false}
                  className="size-4 shrink-0 rounded-full object-cover outline outline-black/10 -outline-offset-1 select-none dark:outline-white/10"
                />
                <span className="text-text-secondary transition-colors duration-150 group-hover:text-text-primary">
                  {author.name}
                </span>
              </a>
            </span>
          ))}
        </p>
        <nav aria-label="Project" className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <span>MIT licensed</span>
          {dot}
          <a href="/r/registry.json" className={cn(link, "font-mono")}>
            registry.json
          </a>
          {dot}
          <a href="/llms.txt" className={cn(link, "font-mono")}>
            llms.txt
          </a>
          {dot}
          <a href="/llms-full.txt" className={cn(link, "font-mono")}>
            llms-full.txt
          </a>
        </nav>
      </div>
    </footer>
  )
}
