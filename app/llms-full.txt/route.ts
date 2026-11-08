import { docsMarkdown } from "@/lib/markdown"
import { getOrigin } from "@/lib/registry"
import { textResponse } from "@/lib/text-response"

/** The full docs in one file, for loading straight into an agent's context. */
export async function GET() {
  return textResponse(docsMarkdown(await getOrigin()), "plain")
}
