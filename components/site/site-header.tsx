import Link from "next/link"

import { cn } from "@/lib/utils"
import { CONTENT_WIDTH } from "@/lib/constants"
// the published package's version, so the header always shows what ships
import reelPackage from "@/packages/reel/package.json"

const links = [
  { href: "/docs", label: "Docs", route: true },
  { href: "/r/registry.json", label: "Registry" },
  { href: "https://www.npmjs.com/package/reel-media", label: "npm" },
]

const link =
  "cursor-pointer rounded-xs text-action text-text-secondary transition-colors duration-150 hover:text-text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none aria-[current=page]:text-text-primary"

/**
 * `current` is the href of the page rendering the header, marked for screen
 * readers and by tone. It stays pinned to the top while the page scrolls.
 * Behind it sits a page-coloured, blurred layer that runs 24px past the header.
 * The fade starts at the header's bottom edge (70% of the layer), so the logo
 * row stays fully backed and content dissolves over a short 24px below it
 * instead of meeting a hard edge.
 */
export function SiteHeader({ current }: { current?: string }) {
  return (
    <div className="sticky top-0 z-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -bottom-6 -z-10 bg-bg/85 mask-b-from-70% backdrop-blur-md"
      />
      <header className={cn("mx-auto flex w-full items-center justify-between px-5 py-5", CONTENT_WIDTH)}>
        <div className="flex items-center gap-2">
          <Link href="/" className={cn(link, "flex items-center gap-2 font-mono font-medium text-text-primary")}>
            {/* app/icon.svg, the favicon, served at /icon.svg. Decorative: the wordmark names the link. */}
            <img src="/icon.svg" alt="" draggable={false} className="size-5 select-none" />
            reel
          </Link>
          <span className="rounded-full bg-fill px-1.5 py-px font-mono text-meta text-text-muted">
            v{reelPackage.version}
          </span>
        </div>
        <nav aria-label="Main">
          <ul className="flex items-center gap-5">
            {links.map((item) => (
              <li key={item.href}>
                {item.route ? (
                  <Link href={item.href} aria-current={current === item.href ? "page" : undefined} className={link}>
                    {item.label}
                  </Link>
                ) : (
                  <a href={item.href} className={link}>
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </div>
  )
}
