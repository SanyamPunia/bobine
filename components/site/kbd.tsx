// server component, so the SSR entry: the main one pulls in createContext
import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon } from "@phosphor-icons/react/dist/ssr"
import type { Icon } from "@phosphor-icons/react"

import { keyLabels } from "@/lib/docs"

const icons: Record<string, Icon> = {
  ArrowLeft: ArrowLeftIcon,
  ArrowRight: ArrowRightIcon,
  ArrowUp: ArrowUpIcon,
  ArrowDown: ArrowDownIcon,
}

/** A key from `lib/docs.ts`. Arrow keys draw as icons with a readable name. */
export function Kbd({ value }: { value: string }) {
  const Icon = icons[value]
  return (
    <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-surface px-1.5 font-mono text-meta text-text-secondary shadow-frame">
      {Icon ? <Icon role="img" aria-label={keyLabels[value]} className="size-3" /> : value}
    </kbd>
  )
}
