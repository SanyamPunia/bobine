import { cn } from "@/lib/utils"

const code = "rounded-md bg-fill px-1 py-0.5 font-mono text-code whitespace-nowrap text-text-primary"

/**
 * A line of copy from `lib/docs.ts` where backticks mark inline code, so the
 * same string reads correctly as markdown and renders as code here.
 */
export function InstallNote({ text, className }: { text: string; className?: string }) {
  return (
    <p className={cn("text-meta text-pretty text-text-secondary", className)}>
      {text.split("`").map((part, i) =>
        i % 2 ? (
          <code key={i} className={code}>
            {part}
          </code>
        ) : (
          part
        )
      )}
    </p>
  )
}
