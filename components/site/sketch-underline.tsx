import { useId } from "react"

/**
 * Two pencil strokes drawn under a word when the page renders.
 *
 * Each stroke uses `pathLength="1"`, so the draw-in animates the dash offset
 * from 1 to 0 whatever the real length is. The filter displaces the strokes
 * with fractal noise, so the edge breaks up like graphite on paper instead of
 * reading as a clean vector line. Reduced motion shows the strokes already
 * drawn. The colour is `currentColor` from `text-primary`, so the strokes are white in dark mode and near-black in light.
 */
export function SketchUnderline({ children }: { children: React.ReactNode }) {
  const filter = `pencil-${useId().replace(/:/g, "")}`

  return (
    <span className="relative inline-block">
      {children}
      {/* sized in em so the strokes scale with the word they sit under */}
      <svg
        aria-hidden="true"
        viewBox="0 0 120 14"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -bottom-[0.2em] -left-[4%] h-[0.4em] w-[108%] overflow-visible text-text-primary"
      >
        <defs>
          <filter id={filter} x="-5%" y="-50%" width="110%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="grain" />
            <feDisplacementMap in="SourceGraphic" in2="grain" scale="1.6" />
          </filter>
        </defs>
        <g filter={`url(#${filter})`} fill="none" stroke="currentColor" strokeLinecap="round">
          <path
            pathLength={1}
            strokeWidth={1.8}
            className="sketch-stroke [animation-delay:350ms]"
            d="M3 8.2C22 6.1 47 5.2 66 6c17 .7 33 2.4 51-.6"
          />
          <path
            pathLength={1}
            strokeWidth={1.2}
            strokeOpacity={0.6}
            className="sketch-stroke [animation-delay:650ms]"
            d="M10 11.4c20-1.8 46-2.3 68-1.6 13 .4 24 .9 34-.5"
          />
        </g>
      </svg>
    </span>
  )
}
