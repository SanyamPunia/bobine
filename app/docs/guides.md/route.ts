import { docPage } from "@/lib/docs"
import { docPageMarkdown } from "@/lib/markdown"
import { SITE_URL } from "@/lib/site"
import { textResponse } from "@/lib/text-response"

// built once: the content only changes on deploy
export const dynamic = "force-static"

export function GET() {
  return textResponse(docPageMarkdown(docPage("/docs/guides"), SITE_URL), "markdown")
}
