import Link from "next/link"

import { cn } from "@/lib/utils"
import { CONTENT_WIDTH } from "@/lib/constants"
import { searchItems } from "@/lib/search"
import { CommandMenu } from "@/components/site/command-menu"
import { LogoLink } from "@/components/site/logo-link"
import { Tooltip } from "@/components/site/tooltip"

/* the published package's version, so the header always shows what ships */
import bobinePackage from "@/packages/bobine/package.json"

/**
 * The site's sections only. Registry and npm live in the command menu and the
 * footer, so the header stays at two links, search and the repo.
 */
const links = [
  { href: "/docs", label: "Docs" },
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
          <LogoLink className={cn(link, "flex items-center gap-2 font-mono font-medium text-text-primary")} />
          <span className="hidden rounded-full bg-fill px-1.5 py-px font-mono text-meta text-text-muted sm:inline">
            v{bobinePackage.version}
          </span>
        </div>
        <div className="flex items-center gap-4 sm:gap-5">
          <nav aria-label="Main">
            <ul className="flex items-center gap-4 sm:gap-5">
              {links.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current?.startsWith(item.href) ? "page" : undefined}
                    className={link}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <span aria-hidden="true" className="hidden h-4 w-px bg-stroke sm:block" />
          <div className="flex items-center gap-1.5">
            <CommandMenu items={searchItems()} />
            {/* hidden on phones, where it does not fit; GitHub is in search */}
            <Tooltip label="GitHub repository">
              <a
                href="https://github.com/SanyamPunia/bobine"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub repository"
                className="hidden size-8 cursor-pointer place-items-center rounded-full text-text-secondary transition-[color,background-color,scale] duration-150 hover:bg-fill hover:text-text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-safe:active:scale-[0.98] sm:grid"
              >
                {/* svgl's GitHub mark as a mask, so it takes the text colour */}
                <span
                  aria-hidden="true"
                  className="size-4 bg-current"
                  style={{ mask: "url(/brands/github.svg) center / contain no-repeat" }}
                />
              </a>
            </Tooltip>
          </div>
        </div>
      </header>
    </div>
  )
}
