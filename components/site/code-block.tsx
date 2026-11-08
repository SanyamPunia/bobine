import { highlight } from "sugar-high"

import { cn } from "@/lib/utils"
import { CopyButton } from "@/components/site/copy-button"

/**
 * A code sample with its language or shell as a label and a copy button.
 *
 * `sugar-high` runs here on the server and returns `sh__*` spans, which the
 * `--sh-*` tokens in `globals.css` colour per theme. Shell commands skip the
 * highlighter, because it reads them as identifiers and paints them one flat
 * colour that is harder to scan than plain text.
 */
export function CodeBlock({
  code,
  label,
  prompt,
  className,
}: {
  code: string
  label?: string
  prompt?: boolean
  className?: string
}) {
  return (
    <figure className={cn("overflow-hidden rounded-xl bg-surface shadow-frame", className)}>
      <div className="flex items-center justify-between gap-2 border-b border-stroke-soft py-1 pr-1 pl-4">
        <figcaption className="font-mono text-meta text-text-muted">{label ?? (prompt ? "terminal" : "tsx")}</figcaption>
        <CopyButton value={code} />
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-code">
        {prompt ? (
          <code>
            <span className="text-text-muted select-none">{"$ "}</span>
            {code}
          </code>
        ) : (
          <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
        )}
      </pre>
    </figure>
  )
}
