/**
 * The site's public origin, for absolute URLs in install commands, the agent
 * prompt, llms.txt, the sitemap and robots.txt.
 *
 * Fixed at build time on purpose. Reading the request host instead made every
 * page dynamic, so Next could not prefetch them and each click waited on a
 * server render. Precedence: `NEXT_PUBLIC_SITE_URL`, then Vercel's production
 * domain, then localhost for development.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
