/**
 * Whether a click belongs to the browser. A modified or non-primary click asks
 * for a new tab or a context menu, so it must reach the real `href`.
 */
export function isPlainClick(event: {
  metaKey: boolean
  ctrlKey: boolean
  shiftKey: boolean
  altKey: boolean
  button: number
}): boolean {
  return !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button === 0
}

/**
 * Scroll a section to its `scroll-margin-top` and write the hash.
 *
 * `scrollTo` on the window, not `scrollIntoView`, because the element method
 * also scrolls every scrollable ancestor. Returns false when the target is
 * missing, so the caller can let the browser navigate normally.
 */
export function scrollToSection(id: string): boolean {
  const target = document.getElementById(id)
  if (!target) return false

  const inset = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0
  const top = target.getBoundingClientRect().top + window.scrollY - inset
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" })
  // pushState, not `location.hash`, which would trigger a second native jump
  history.pushState(null, "", `#${id}`)
  return true
}
