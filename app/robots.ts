import type { MetadataRoute } from "next"

import { getOrigin } from "@/lib/registry"

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await getOrigin()
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${origin}/sitemap.xml`,
  }
}
