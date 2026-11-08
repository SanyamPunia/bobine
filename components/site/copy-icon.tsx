/**
 * Phosphor's regular Copy with soft corners. Same 256 grid, squares and
 * 16-unit stroke as the original, so it sits beside the other icons at the
 * same size and weight. Only the corners change: Phosphor's are square.
 */
export function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth={16}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x={40} y={88} width={128} height={128} rx={16} />
      <path d="M88 80V56a16 16 0 0 1 16-16h96a16 16 0 0 1 16 16v96a16 16 0 0 1-16 16h-24" />
    </svg>
  )
}
