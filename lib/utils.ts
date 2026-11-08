import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// the named type scale in globals.css. Unregistered, `text-meta` reads as a
// colour and is dropped when a `text-text-*` colour follows it.
const twMerge = extendTailwindMerge({
  extend: { theme: { text: ['display', 'title', 'body', 'action', 'meta', 'code'] } },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
