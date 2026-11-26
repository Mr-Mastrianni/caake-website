import type { MetadataRoute } from 'next'
import { CASE_STUDIES, SITE } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    '',
    '/services',
    '/work',
    '/pricing',
    '/about',
    '/book-call',
    '/contact',
    '/resources',
    '/security-governance',
    '/ai-use-policy',
    '/privacy',
    '/terms',
  ]
  const now = new Date()
  return [
    ...pages.map((p) => ({ url: `${SITE.url}${p}`, lastModified: now })),
    ...CASE_STUDIES.map((c) => ({ url: `${SITE.url}/work/${c.slug}`, lastModified: now })),
  ]
}
