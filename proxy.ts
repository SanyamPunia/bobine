import { NextResponse, type NextRequest } from "next/server"

import { docPages } from "@/lib/docs"

/**
 * Content negotiation for agents. A client that asks for `text/markdown` at a
 * page URL gets that page's markdown copy, so it does not need to know the
 * `.md` paths. Browsers never send that header, so they get HTML as before.
 */
const markdown: Record<string, string> = {
  "/": "/index.md",
  "/examples": "/examples.md",
  ...Object.fromEntries(docPages.map((page) => [page.href, page.md])),
}

export function proxy(request: NextRequest) {
  const target = markdown[request.nextUrl.pathname]
  if (target && request.headers.get("accept")?.includes("text/markdown")) {
    return NextResponse.rewrite(new URL(target, request.url))
  }
  // The markdown responses send `Vary: Accept`. The HTML ones cannot: Next
  // replaces any Vary header on App Router pages, from here or next.config.
  // This proxy runs before the page cache, so a browser still never gets markdown.
  return NextResponse.next()
}

// a static list, because Next reads the matcher at build time
export const config = { matcher: ["/", "/docs", "/docs/guides", "/docs/reference", "/examples"] }
