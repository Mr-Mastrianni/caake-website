'use client'

import { usePathname } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

// Public marketing chrome (nav + footer). Hidden on admin and sign-in routes,
// which have their own layout.
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || ''
  const bare = pathname.startsWith('/admin') || pathname.startsWith('/sign-in')

  if (bare) return <>{children}</>

  return (
    <>
      <Navigation />
      <main className="pt-16 md:pt-20">{children}</main>
      <Footer />
    </>
  )
}
