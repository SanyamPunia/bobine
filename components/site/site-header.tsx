import Link from "next/link"

import { cn } from "@/lib/utils"
import { CONTENT_WIDTH } from "@/lib/constants"

const links = [
  { href: "/docs", label: "Docs", route: true },
  { href: "/r/registry.json", label: "Registry" },
  { href: "https://www.npmjs.com/package/reel-media", label: "npm" },
]

const link =
  "cursor-pointer rounded-xs text-action text-text-secondary transition-colors duration-150 hover:text-text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none aria-[current=page]:text-text-primary"

/** `current` is the href of the page rendering the header, marked for screen readers and by tone. */
export function SiteHeader({ current }: { current?: string }) {
  return (
    <header className={cn("mx-auto flex w-full items-center justify-between px-5 py-5", CONTENT_WIDTH)}>
      <Link href="/" className={cn(link, "flex items-center gap-2 font-mono font-medium text-text-primary")}>
        {/* app/icon.svg, the favicon, served at /icon.svg. Decorative: the wordmark names the link. */}
        <img src="/icon.svg" alt="" draggable={false} className="size-5 select-none" />
        reel
      </Link>
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
  )
}
