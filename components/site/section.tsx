import { HeadingAnchor } from "@/components/site/heading-anchor"

/**
 * One documentation section. The heading separates itself from prose by space
 * and a leader rule, not by size, so the page keeps one quiet type scale.
 * `PageRail` reads `section[id] h2` to build its list, so every section must
 * render through this component.
 */
export function Section({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="flex scroll-mt-24 flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2 id={`${id}-title`} className="group/heading flex items-center gap-2 text-body font-medium text-text-primary">
          <span className="min-w-0 text-balance">{title}</span>
          <HeadingAnchor id={id} />
          <span aria-hidden="true" className="h-px min-w-4 flex-1 bg-stroke" />
        </h2>
        <p className="text-body text-pretty text-text-secondary">{description}</p>
      </div>
      {children}
    </section>
  )
}
