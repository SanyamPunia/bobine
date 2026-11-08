import { ViewTransition } from "react"

/**
 * The page body fades out and the next one fades in on a route change. The
 * header sits outside it, so it stays still while the content changes under
 * it. The animation lives in `globals.css` under `.page-fade`. The browser's
 * back button runs no transition, because Next does not wrap popstate in one.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-fade" exit="page-fade" default="none">
      <div>{children}</div>
    </ViewTransition>
  )
}
