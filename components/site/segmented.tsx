"use client"

import { cn } from "@/lib/utils"

/**
 * A row of mutually exclusive options, one pressed at a time. Shared by the
 * playground's player switch and the theme recipe, so both look alike.
 */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: {
  /* names the group for screen readers */
  label: string
  options: readonly { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  className?: string
}) {
  return (
    <div role="group" aria-label={label} className={cn("inline-flex rounded-full bg-fill p-0.5", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "h-7 cursor-pointer rounded-full px-3 text-action transition-[color,background-color,box-shadow] duration-150",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            value === option.value
              ? "bg-bg text-text-primary shadow-sm ring-1 ring-stroke-soft"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
