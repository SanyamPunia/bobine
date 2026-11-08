import { DocsNav } from "@/components/site/docs-nav"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { TooltipProvider } from "@/components/site/tooltip"

/** Shared by every docs page, so the header and sidebar stay mounted between pages. */
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delay={300}>
      <SiteHeader current="/docs" />
      <DocsNav />
      {children}
      <SiteFooter />
    </TooltipProvider>
  )
}
