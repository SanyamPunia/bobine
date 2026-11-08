/**
 * A plain-text or markdown response for the agent routes.
 *
 * The markdown copies of pages carry `x-robots-tag: noindex`, because search
 * engines should index the HTML page and not a second copy of it. llms.txt is
 * the index itself, so it stays indexable. `Vary: Accept` is set because
 * `proxy.ts` also serves the markdown at the HTML URLs.
 */
export function textResponse(body: string, type: "plain" | "markdown", index = false): Response {
  const headers = new Headers({ "content-type": `text/${type}; charset=utf-8`, vary: "Accept" })
  if (!index) headers.set("x-robots-tag", "noindex")
  return new Response(body, { headers })
}
