"use client"

import { TextMorph } from "torph/react"

/**
 * A button label that morphs between states with torph ("Copy page" to
 * "Copied").
 *
 * The longest label sits invisible in the same grid cell, so the button keeps
 * one width and nothing beside it re-wraps. torph would otherwise animate the
 * width on every change. torph writes its own screen-reader text and hides the
 * animated letters, and the live region around it announces the new label.
 */
export function MorphLabel({ text, labels }: { text: string; labels: readonly string[] }) {
  const longest = labels.reduce((a, b) => (b.length > a.length ? b : a), text)

  return (
    <span className="grid justify-items-start *:col-start-1 *:row-start-1">
      <span aria-hidden="true" className="invisible">
        {longest}
      </span>
      <span aria-live="polite">
        <TextMorph duration={300}>{text}</TextMorph>
      </span>
    </span>
  )
}
