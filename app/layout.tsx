import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Instrument_Serif, Inter } from 'next/font/google'
import { ColumnGuides } from '@/components/site/column-guides'
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from '@/lib/metadata'
import { SITE_URL } from '@/lib/site'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
// one italic word in the hero, so only the italic face loads
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  variable: '--font-instrument-serif',
})

export const metadata: Metadata = {
  /* resolves every relative metadata URL (canonical, og:url, og:image) to the real domain */
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#111111' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} ${instrumentSerif.variable} bg-bg`}>
      <body className="font-sans antialiased">
        {/* first stop for keyboard users, past the header and the docs sidebar */}
        <a
          href="#content"
          className="fixed top-3 left-3 z-50 -translate-y-16 rounded-lg bg-bg px-3 py-2 text-action font-medium text-text-primary shadow-frame focus-visible:translate-y-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-safe:transition-[translate]"
        >
          Skip to content
        </a>
        <ColumnGuides />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
