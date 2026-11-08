import { landingMarkdown } from "@/lib/markdown"
import { getOrigin } from "@/lib/registry"
import { textResponse } from "@/lib/text-response"

export async function GET() {
  return textResponse(landingMarkdown(await getOrigin()), "markdown")
}
