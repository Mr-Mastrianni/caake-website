import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
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

export const metadata: Metadata = {
  title: 'C.A.A.K.E. Corporation | AI That\'s Easy as C.A.A.K.E.',
  description: 'Cost Avoidance Automation Kingz Enterprise delivers premium AI automation solutions. The royal recipe for enterprise automation—move fast with AI, safely.',
  metadataBase: new URL('https://caake.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AI That\'s Easy as C.A.A.K.E.',
    description: 'The royal recipe for enterprise automation. Premium AI solutions from Cost Avoidance Automation Kingz Enterprise.',
    url: 'https://caake.org',
    siteName: 'C.A.A.K.E. Corporation',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI That\'s Easy as C.A.A.K.E.',
    description: 'The royal recipe for enterprise automation.',
    creator: '@caake_ai',
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
        <Navigation />
        <main className="pt-16 md:pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
