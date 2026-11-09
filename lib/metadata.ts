import type { Metadata } from "next"

export const SITE_NAME = "bobine"
export const SITE_TITLE = "bobine - drop-in media players for React"
export const SITE_DESCRIPTION =
  "Swap <video> and <audio> for minimal, accessible players you own. Distributed as a shadcn registry."

/**
 * The social card, `public/og.jpg`, 1200 by 630. Set on every page through
 * `pageMetadata` rather than the `opengraph-image` file convention, because a
 * page that sets its own `openGraph` drops an image inherited from a parent
 * segment, so docs links shared on X showed no picture.
 */
const image = {
  url: "/og.jpg",
  width: 1200,
  height: 630,
  alt: "A bobine video player with the bobine wordmark and the line drop-in media players for react centred in its frame.",
}

/**
 * A page's title, description, canonical URL and social tags in one place.
 *
 * Next merges metadata shallowly, so a page that sets `openGraph` replaces the
 * layout's whole object. Every page goes through this helper so none of them
 * drops `siteName` or the card type. Paths are relative and resolve against
 * `metadataBase` (SITE_URL) in the root layout, which is what makes the
 * canonical, og:url and image URLs absolute.
 */
export function pageMetadata({
  title,
  description,
  path,
  markdown,
}: {
  /** omitted on the landing page, which uses the layout's default title */
  title?: string
  description: string
  path: string
  /** this page's markdown copy, such as "/docs.md" */
  markdown?: string
}): Metadata {
  const socialTitle = title ? `${SITE_NAME} - ${title}` : SITE_TITLE

  return {
    ...(title ? { title } : {}),
    description,
    alternates: {
      canonical: path,
      ...(markdown ? { types: { "text/markdown": markdown } } : {}),
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      url: path,
      title: socialTitle,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      creator: "@sanyampunia",
      images: [image],
    },
  }
}
