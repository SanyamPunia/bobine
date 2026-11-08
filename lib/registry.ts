import { headers } from "next/headers"

/**
 * The origin serving this request, so absolute URLs (install commands, the
 * agent prompt, llms.txt links) work on localhost, preview deploys and
 * production without configuration.
 */
export async function getOrigin(): Promise<string> {
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000"
  const protocol = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https")
  return `${protocol}://${host}`
}

export async function getRegistryUrl(): Promise<string> {
  return `${await getOrigin()}/r`
}
