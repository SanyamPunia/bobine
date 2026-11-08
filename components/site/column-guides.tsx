import { cn } from "@/lib/utils"
import { CONTENT_WIDTH } from "@/lib/constants"

/**
 * Two hairlines at the column's outer edges, the full height of the viewport,
 * after the blueprint guides in drafting tools. They frame the reading column
 * without a card around it. Hidden below `sm`, where the column is the screen.
 */
export function ColumnGuides() {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-y-0 left-1/2 hidden w-full -translate-x-1/2 border-x border-stroke-soft sm:block",
        CONTENT_WIDTH
      )}
    />
  )
}
