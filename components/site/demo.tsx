import { cn } from "@/lib/utils"

/**
 * The stage a live example sits on.
 *
 * `bleed` is for a player that fills the stage. It becomes a bezel: the radius
 * is the player's `rounded-xl` plus the `p-1` gap, so the two curves stay
 * concentric. Without it the example floats centred on a padded stage.
 */
export function Demo({
  bleed,
  className,
  children,
}: {
  bleed?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "bg-surface shadow-frame",
        bleed ? "rounded-2xl p-1" : "flex items-center justify-center rounded-2xl px-4 py-10 sm:px-10 sm:py-14",
        className
      )}
    >
      {children}
    </div>
  )
}
