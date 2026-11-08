import * as React from "react"

/**
 * Copies text and reports `copied` for a moment afterwards, for the "Copied"
 * state every copy control shows. `copied` only turns on once the write has
 * succeeded, so a blocked clipboard never claims a copy that did not happen.
 * Copying again restarts the timer.
 */
export function useCopy(duration = 1500) {
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  const copy = React.useCallback(
    async (value: string) => {
      try {
        await navigator.clipboard.writeText(value)
      } catch {
        /* blocked by permissions or an insecure context, nothing to recover */
        return false
      }
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), duration)
      return true
    },
    [duration]
  )

  return { copied, copy }
}
