import type { Metadata } from 'next'
import { SITE } from '@/lib/site'

interface PageMetadataProps {
  title: string
  description: string
  path?: string
}

// Per-page metadata. The root layout adds the "| C.A.A.K.E." suffix via its title template.
export function pageMetadata({ title, description, path = '' }: PageMetadataProps): Metadata {
  const url = `${SITE.url}${path}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | C.A.A.K.E.`,
      description,
      url,
      siteName: SITE.legalName,
      images: [{ url: '/logocaake.png' }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${title} | C.A.A.K.E.`,
      description,
      images: ['/logocaake.png'],
    },
  }
}

// Kept for any older imports.
export const generatePageMetadata = pageMetadata

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE.legalName,
    alternateName: 'Cost Avoidance Automation Kingz Enterprise',
    url: SITE.url,
    logo: `${SITE.url}/logocaake.png`,
    image: `${SITE.url}/logocaake.png`,
    description:
      'Websites, booking and lead follow-up systems, custom apps, AI assistants and AI training for small businesses and healthcare organizations.',
    foundingDate: SITE.founded,
    telephone: '+1-480-364-1164',
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.city,
      addressRegion: SITE.region,
      addressCountry: 'US',
    },
    areaServed: 'US',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-480-364-1164',
      contactType: 'sales',
      email: SITE.email,
      availableLanguage: ['English'],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.legalName,
    url: SITE.url,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function BreadcrumbSchema(items: { name: string; url: string }[]) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
