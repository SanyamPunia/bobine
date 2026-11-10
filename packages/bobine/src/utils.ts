import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * The package's `cn`. The site's `lib/utils.ts` registers the site's type
 * scale with tailwind-merge, which a consumer's app does not have.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
