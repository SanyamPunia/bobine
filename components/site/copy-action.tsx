"use client"

import * as React from "react"
import { BotIcon, CheckIcon, FileTextIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// an icon name, not a component: this renders from server pages, and a
// component is a function, which cannot cross the server/client boundary
const icons = { page: FileTextIcon, prompt: BotIcon }

/** A labelled copy button: "Copy page", "Copy prompt". The icon and label swap to "Copied". */
export function CopyAction({
  value,
  label,
  icon,
  size,
  className,
}: {
  value: string
  label: string
  icon: keyof typeof icons
  /** "lg" beside a hero's primary action, so the pair shares one height */
  size?: "default" | "lg"
  className?: string
}) {
  const Icon = icons[icon]
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <Button
      variant="outline"
      size={size}
      className={cn("cursor-pointer active:scale-[0.98]", className)}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value)
        } catch {
          // clipboard blocked by permissions or an insecure context, nothing to recover
          return
        }
        setCopied(true)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => setCopied(false), 1500)
      }}
    >
      {copied ? <CheckIcon data-icon="inline-start" aria-hidden="true" /> : <Icon data-icon="inline-start" aria-hidden="true" />}
      {/* both labels share one grid cell, so the width never changes on copy */}
      <span className="grid *:col-start-1 *:row-start-1">
        <span aria-hidden="true" className={cn(!copied && "invisible")}>Copied</span>
        <span aria-hidden="true" className={cn(copied && "invisible")}>{label}</span>
      </span>
      <span aria-live="polite" className="sr-only">{copied ? "Copied" : label}</span>
    </Button>
  )
}
