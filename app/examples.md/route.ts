import { examplesMarkdown } from "@/lib/markdown"
import { SITE_URL } from "@/lib/site"
import { textResponse } from "@/lib/text-response"

/* built once: the content only changes on deploy */
export const dynamic = "force-static"

export function GET() {
  return textResponse(examplesMarkdown(SITE_URL), "markdown")
}
