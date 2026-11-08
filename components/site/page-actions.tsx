"use client"

import * as React from "react"
import { Menu } from "@base-ui/react/menu"
import { ArrowSquareOutIcon, CaretDownIcon, CopyIcon, FileTextIcon, RobotIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CopySwapIcon } from "@/components/site/copy-swap-icon"
import { MorphLabel } from "@/components/site/morph-label"
import { Tooltip } from "@/components/site/tooltip"

const item =
  "flex cursor-pointer items-start gap-2.5 rounded-lg px-2 py-1.5 outline-none select-none data-highlighted:bg-fill-hover"

const glyph = "mt-0.5 size-4 shrink-0 text-text-muted"

/**
 * Brand marks from svgl.app, in `public/brands/`. OpenAI's mark is monochrome,
 * so it is a mask filled with `text-primary` and follows the theme. Claude's
 * mark is its brand orange, which reads on both grounds.
 */
const openAiMark = (
  <span
    aria-hidden="true"
    className="mt-0.5 size-4 shrink-0 bg-text-primary"
    style={{ mask: "url(/brands/openai.svg) center / contain no-repeat" }}
  />
)
const claudeMark = (
  <img src="/brands/claude.svg" alt="" draggable={false} className="mt-0.5 size-4 shrink-0 select-none" />
)

function ItemBody({ icon, title, hint, external }: { icon: React.ReactNode; title: string; hint: string; external?: boolean }) {
  return (
    <>
      {icon}
      <span className="flex min-w-0 grow flex-col">
        <span className="flex items-center gap-1 text-action text-text-primary">
          {title}
          {external && <ArrowSquareOutIcon aria-hidden="true" className="size-3 text-text-muted" />}
        </span>
        <span className="text-meta text-text-muted">{hint}</span>
      </span>
    </>
  )
}

/**
 * The docs page's agent actions, as one small split button beside the title:
 * "Copy page" on the left, the rest in a menu. It matches the pattern most
 * docs sites use, and it keeps the actions from competing with the page title.
 */
/** `mdPath` is this page's markdown copy, such as "/docs/guides.md". */
export function PageActions({
  markdown,
  prompt,
  origin,
  mdPath,
}: {
  markdown: string
  prompt: string
  origin: string
  mdPath: string
}) {
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // clipboard blocked by permissions or an insecure context, nothing to recover
      return
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1500)
  }

  const ask = encodeURIComponent(`Read ${origin}${mdPath} so I can ask questions about reel, the React media player.`)

  return (
    <div className="flex shrink-0 items-center">
      <Button
        variant="outline"
        size="sm"
        onClick={() => copy(markdown)}
        className="cursor-pointer rounded-r-none motion-safe:active:scale-[0.98]"
      >
        <CopySwapIcon icon={CopyIcon} copied={copied} />
        <MorphLabel text={copied ? "Copied" : "Copy page"} />
      </Button>

      <Menu.Root>
        <Tooltip label="More page actions">
          <Menu.Trigger
            render={
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="More page actions"
                className="-ml-px cursor-pointer rounded-l-none motion-safe:active:scale-[0.98] data-popup-open:bg-muted data-popup-open:text-foreground dark:data-popup-open:bg-input/50"
              />
            }
          >
            <CaretDownIcon aria-hidden="true" />
          </Menu.Trigger>
        </Tooltip>
        <Menu.Portal>
          <Menu.Positioner align="end" sideOffset={6} collisionPadding={12} className="z-50">
            <Menu.Popup className="flex w-64 origin-(--transform-origin) flex-col rounded-xl bg-popover p-1 shadow-frame transition-[opacity,transform] duration-150 ease-media data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
              <Menu.Item className={item} onClick={() => copy(markdown)}>
                <ItemBody icon={<CopyIcon aria-hidden="true" className={glyph} />} title="Copy page" hint="This page as Markdown for LLMs" />
              </Menu.Item>
              <Menu.Item className={item} onClick={() => copy(prompt)}>
                <ItemBody icon={<RobotIcon aria-hidden="true" className={glyph} />} title="Copy prompt" hint="Install reel with a coding agent" />
              </Menu.Item>
              <Menu.LinkItem className={item} href={mdPath} target="_blank" rel="noreferrer">
                <ItemBody icon={<FileTextIcon aria-hidden="true" className={glyph} />} title="View as Markdown" hint="Open this page as plain text" external />
              </Menu.LinkItem>
              <div aria-hidden="true" className="mx-2 my-1 h-px bg-stroke-soft" />
              <Menu.LinkItem className={item} href={`https://chatgpt.com/?q=${ask}`} target="_blank" rel="noreferrer">
                <ItemBody icon={openAiMark} title="Open in ChatGPT" hint="Ask questions about this page" external />
              </Menu.LinkItem>
              <Menu.LinkItem className={item} href={`https://claude.ai/new?q=${ask}`} target="_blank" rel="noreferrer">
                <ItemBody icon={claudeMark} title="Open in Claude" hint="Ask questions about this page" external />
              </Menu.LinkItem>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </div>
  )
}
