import * as React from "react"

type IconProps = React.ComponentProps<"svg">

const base = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
} as const

/**
 * Optically centred: the filled area's centroid, not the bounding box, sits
 * on the viewBox centre (x = 12), measured from the rendered shape. A
 * box-centred triangle looks shifted right, because its weight is in the flat
 * left side.
 */
export function PlayIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <path d="M6.87 4.9v14.2a1.5 1.5 0 0 0 2.31 1.26l11.07-7.1a1.5 1.5 0 0 0 0-2.52L9.18 3.64A1.5 1.5 0 0 0 6.87 4.9Z" />
    </svg>
  )
}

export function PauseIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <rect x="5" y="3.5" width="5" height="17" rx="1.6" />
      <rect x="14" y="3.5" width="5" height="17" rx="1.6" />
    </svg>
  )
}

export function VolumeIcon({ muted, ...props }: IconProps & { muted?: boolean }) {
  const fade = "origin-[11px_12px] transition-[opacity,transform] duration-200 ease-media motion-reduce:transition-none"
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path
        d="M11 5.1v13.8a1 1 0 0 1-1.63.77L5.5 16.5h-2A1.5 1.5 0 0 1 2 15V9a1.5 1.5 0 0 1 1.5-1.5h2l3.87-3.17A1 1 0 0 1 11 5.1Z"
        fill="currentColor"
        stroke="none"
      />
      <g className={fade} style={{ opacity: muted ? 0 : 1, transform: muted ? "scale(0.6)" : "none" }}>
        <path d="M15 9.5a3.5 3.5 0 0 1 0 5" />
        <path d="M17.8 6.7a7.5 7.5 0 0 1 0 10.6" />
      </g>
      <g className={fade} style={{ opacity: muted ? 1 : 0, transform: muted ? "none" : "scale(0.6)" }}>
        <path d="m16 9.5 5 5" />
        <path d="m21 9.5-5 5" />
      </g>
    </svg>
  )
}

export function EnterFullscreenIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 9V6a2 2 0 0 1 2-2h3M15 4h3a2 2 0 0 1 2 2v3M20 15v3a2 2 0 0 1-2 2h-3M9 20H6a2 2 0 0 1-2-2v-3" />
    </svg>
  )
}

export function ExitFullscreenIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 4v3a2 2 0 0 1-2 2H4M20 9h-3a2 2 0 0 1-2-2V4M15 20v-3a2 2 0 0 1 2-2h3M4 15h3a2 2 0 0 1 2 2v3" />
    </svg>
  )
}

export function PictureInPictureIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <rect x="12" y="11.5" width="6.5" height="5" rx="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

const captionLetters = "M10.5 10.2a2.2 2.2 0 1 0 0 3.6M17 10.2a2.2 2.2 0 1 0 0 3.6"

/** Outlined when off; filled with knocked-out letters when on. */
export function CaptionsIcon({ active, ...props }: IconProps & { active?: boolean }) {
  const maskId = `cc${React.useId().replace(/[^\w-]/g, "")}`
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <mask id={maskId}>
        <rect width="24" height="24" fill="white" />
        <path d={captionLetters} stroke="black" />
      </mask>
      <rect
        x="2.5"
        y="4.5"
        width="19"
        height="15"
        rx="3"
        fill="currentColor"
        mask={`url(#${maskId})`}
        className="transition-opacity duration-200 ease-media motion-reduce:transition-none"
        style={{ opacity: active ? 1 : 0 }}
      />
      <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
      <path
        d={captionLetters}
        className="transition-opacity duration-200 ease-media motion-reduce:transition-none"
        style={{ opacity: active ? 0 : 1 }}
      />
    </svg>
  )
}

export function SettingsIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="9" cy="17" r="2" />
    </svg>
  )
}

export function RetryIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" />
      <path d="M3.5 4v4.5H8" />
    </svg>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  )
}

export function SeekIcon({ direction, ...props }: IconProps & { direction: "back" | "forward" }) {
  return (
    <svg {...base} fill="currentColor" {...props} style={{ transform: direction === "back" ? "scaleX(-1)" : undefined, ...props.style }}>
      <path d="M3 6.7v10.6a1 1 0 0 0 1.55.83L12 13.2v4.1a1 1 0 0 0 1.55.83l7.9-5.3a1 1 0 0 0 0-1.66l-7.9-5.3A1 1 0 0 0 12 6.7v4.1L4.55 5.87A1 1 0 0 0 3 6.7Z" />
    </svg>
  )
}
