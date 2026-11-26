import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { SiteChrome } from '@/components/site-chrome'
import { OrganizationSchema, WebsiteSchema } from '@/components/metadata'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const siteDescription =
  'C.A.A.K.E. builds websites, booking and lead follow-up systems, custom apps and AI tools for small businesses and healthcare teams. Based in Fishers, Indiana. Start with a free Lead Leak Audit.'

export const metadata: Metadata = {
  title: {
    default: 'C.A.A.K.E. | Websites, Apps & AI That Bring In Customers',
    template: '%s | C.A.A.K.E.',
  },
  description: siteDescription,
  metadataBase: new URL('https://www.caake.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'C.A.A.K.E. | Websites, Apps & AI That Bring In Customers',
    description: siteDescription,
    url: 'https://www.caake.org',
    siteName: 'C.A.A.K.E. Corporation',
    images: [{ url: '/logocaake.png' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'C.A.A.K.E. | Websites, Apps & AI That Bring In Customers',
    description: siteDescription,
    images: ['/logocaake.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} dark`}>
      <head>
        <OrganizationSchema />
        <WebsiteSchema />
      </head>
      <body className="antialiased bg-midnight text-white min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-gold focus:text-midnight focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to content
        </a>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  )
}
