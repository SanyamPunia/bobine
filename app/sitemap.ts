import type { MetadataRoute } from "next"

import { docPages } from "@/lib/docs"
import { SITE_URL } from "@/lib/site"

// no lastModified: nothing records when the copy last changed, and an invented
// timestamp tells crawlers a page changed when it did not
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, priority: 1 },
    ...docPages.map((page) => ({ url: `${SITE_URL}${page.href}`, priority: 0.8 })),
    { url: `${SITE_URL}/examples`, priority: 0.5 },
  ]
}
