import type { MetadataRoute } from "next"

import { getOrigin } from "@/lib/registry"

// no lastModified: nothing records when the copy last changed, and an invented
// timestamp tells crawlers a page changed when it did not
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await getOrigin()
  return [
    { url: origin, priority: 1 },
    { url: `${origin}/docs`, priority: 0.8 },
  ]
}
