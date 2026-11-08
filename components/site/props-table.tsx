import type { Prop } from "@/lib/docs"

/** One component's extra props, in the same hairline list the Parts section uses. */
export function PropsTable({ component, props }: { component: string; props: readonly Prop[] }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-mono text-code text-text-primary">{component}</h3>
      <dl className="flex flex-col divide-y divide-stroke-soft border-y border-stroke">
        {props.map((prop) => (
          <div key={prop.name} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
            <dt className="flex shrink-0 flex-col gap-0.5 sm:w-56">
              <span className="font-mono text-code text-text-primary">{prop.name}</span>
              <span className="font-mono text-meta text-text-muted">{prop.type}</span>
            </dt>
            <dd className="text-action text-text-secondary">{prop.description}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
