import { docsMarkdown } from "@/lib/markdown"
import { SITE_URL } from "@/lib/site"
import { textResponse } from "@/lib/text-response"

/** The full docs in one file, for loading straight into an agent's context. */
// built once: the content only changes on deploy
export const dynamic = "force-static"

export function GET() {
  return textResponse(docsMarkdown(SITE_URL), "plain")
}
