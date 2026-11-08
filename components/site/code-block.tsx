import { highlight } from "sugar-high"
// server component, so the SSR entry: the main one pulls in createContext
import { RobotIcon } from "@phosphor-icons/react/dist/ssr"

import { cn } from "@/lib/utils"
import { CopyButton } from "@/components/site/copy-button"

/**
 * A code sample as a double bezel: a tray carrying the label and copy button,
 * with the code in an inner panel inset 4px. The tray's `rounded-2xl` is the
 * panel's `rounded-xl` plus that gap, so the corners stay concentric. The
 * panel is the page colour inside a `fill` tray, which reads as a raised card
 * in light and a recessed well in dark.
 *
 * `sugar-high` runs on the server and returns `sh__*` spans, coloured by the
 * `--sh-*` tokens. Shell commands (`prompt`) and prose (`plain`) skip it: the
 * highlighter reads them as identifiers and paints one flat colour.
 */
const mark = "size-3.5 shrink-0 select-none"

/**
 * The language mark beside the label, from svgl.app (public/brands). TypeScript
 * and CSS keep their brand colours. The Bash mark is a single dark fill, so it
 * is a mask in the text colour and stays visible in dark mode.
 */
function LanguageMark({ label, prompt, plain }: { label: string; prompt?: boolean; plain?: boolean }) {
  if (plain) return <RobotIcon aria-hidden="true" className="size-3.5 shrink-0 text-text-muted" />
  if (prompt)
    return (
      <span
        aria-hidden="true"
        className={`${mark} bg-text-muted`}
        style={{ mask: "url(/brands/bash.svg) center / contain no-repeat" }}
      />
    )
  const src = /\.?css$/.test(label) ? "/brands/css.svg" : /\.?tsx?$/.test(label) ? "/brands/typescript.svg" : null
  return src ? <img src={src} alt="" width={14} height={14} draggable={false} className={mark} /> : null
}

export function CodeBlock({
  code,
  label,
  prompt,
  plain,
  className,
}: {
  code: string
  label?: string
  prompt?: boolean
  /** plain text that wraps, such as an agent prompt */
  plain?: boolean
  className?: string
}) {
  return (
    <figure className={cn("rounded-2xl bg-fill p-1 shadow-frame", className)}>
      <div className="flex items-center justify-between gap-2 py-0.5 pr-0.5 pl-3">
        <figcaption className="flex items-center gap-1.5 font-mono text-meta text-text-muted">
          <LanguageMark label={label ?? "tsx"} prompt={prompt} plain={plain} />
          {label ?? (prompt ? "terminal" : "tsx")}
        </figcaption>
        <CopyButton value={code} />
      </div>
      <pre
        className={cn(
          "overflow-x-auto rounded-xl bg-bg p-4 font-mono text-code shadow-well",
          plain && "whitespace-pre-wrap text-text-secondary"
        )}
      >
        {prompt ? (
          <code>
            <span className="text-text-muted select-none">{"$ "}</span>
            {code}
          </code>
        ) : plain ? (
          <code>{code}</code>
        ) : (
          <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
        )}
      </pre>
    </figure>
  )
}
