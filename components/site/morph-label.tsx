"use client"

import { TextMorph } from "torph/react"

/**
 * A button label that morphs between states with torph ("Copy page" to
 * "Copied"). torph animates the width too, so the button fits each label with
 * no dead space. Anything laid out beside the button must not depend on its
 * width, which is why the docs title carries its own max width.
 *
 * torph writes its own screen-reader text and hides the animated letters. The
 * live region announces the new label.
 */
export function MorphLabel({ text }: { text: string }) {
  return (
    <span aria-live="polite">
      <TextMorph duration={300}>{text}</TextMorph>
    </span>
  )
}
