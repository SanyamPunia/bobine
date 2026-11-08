import * as React from "react"

const subscribe = () => () => {}

/**
 * Whether the visitor is on an Apple platform, for shortcut labels: ⌘ there,
 * Ctrl everywhere else. Null on the server and during hydration, since the
 * server cannot know the platform, so callers can hide the label until then.
 */
export function useIsApple(): boolean | null {
  return React.useSyncExternalStore(
    subscribe,
    () => {
      const nav = navigator as Navigator & { userAgentData?: { platform: string } }
      return /mac|iphone|ipad|ipod/i.test(nav.userAgentData?.platform || nav.platform || nav.userAgent)
    },
    () => null
  )
}
