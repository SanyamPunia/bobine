import { llmsIndex } from "@/lib/markdown"
import { getOrigin } from "@/lib/registry"
import { textResponse } from "@/lib/text-response"

/** The index an agent looks for first, per llmstxt.org. */
export async function GET() {
  return textResponse(llmsIndex(await getOrigin()), "plain", true)
}
