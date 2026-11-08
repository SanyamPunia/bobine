"use client"

import { FileTextIcon, RobotIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { useCopy } from "@/hooks/use-copy"
import { Button } from "@/components/ui/button"
import { CopySwapIcon } from "@/components/site/copy-swap-icon"
import { MorphLabel } from "@/components/site/morph-label"

/**
 * An icon name, not a component: this renders from server pages, and a
 * component is a function, which cannot cross the server/client boundary.
 */
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
  const { copied, copy } = useCopy()

  return (
    <Button
      variant="outline"
      size={size}
      className={cn("cursor-pointer motion-safe:active:scale-[0.98]", className)}
      onClick={() => copy(value)}
    >
      <CopySwapIcon icon={Icon} copied={copied} />
      <MorphLabel text={copied ? "Copied" : label} />
    </Button>
  )
}
