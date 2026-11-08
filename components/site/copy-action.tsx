"use client"

import * as React from "react"
import { FileTextIcon, RobotIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CopySwapIcon } from "@/components/site/copy-swap-icon"
import { MorphLabel } from "@/components/site/morph-label"

// an icon name, not a component: this renders from server pages, and a
// component is a function, which cannot cross the server/client boundary
const icons = { page: FileTextIcon, prompt: RobotIcon }

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
      className={cn("cursor-pointer motion-safe:active:scale-[0.98]", className)}
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
      <CopySwapIcon icon={Icon} copied={copied} />
      <MorphLabel text={copied ? "Copied" : label} />
    </Button>
  )
}
