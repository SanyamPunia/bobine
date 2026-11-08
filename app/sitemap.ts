import type { MetadataRoute } from "next"

import { SITE_URL } from "@/lib/site"

// no lastModified: nothing records when the copy last changed, and an invented
// timestamp tells crawlers a page changed when it did not
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = SITE_URL
  return [
    { url: origin, priority: 1 },
    { url: `${origin}/docs`, priority: 0.8 },
  ]
}
