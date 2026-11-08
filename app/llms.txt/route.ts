import { llmsIndex } from "@/lib/markdown"
import { SITE_URL } from "@/lib/site"
import { textResponse } from "@/lib/text-response"

/** The index an agent looks for first, per llmstxt.org. */
// built once: the content only changes on deploy
export const dynamic = "force-static"

export function GET() {
  return textResponse(llmsIndex(SITE_URL), "plain", true)
}
