import type { Metadata } from 'next'

interface PageMetadataProps {
  title: string
  description: string
  path?: string
  ogImage?: string
}

export function generatePageMetadata({
  title,
  description,
  path = '',
  ogImage = '/og/default.jpg'
}: PageMetadataProps): Metadata {
  const url = `https://caake.org${path}`
  
  return {
    title,
    description,
    metadataBase: new URL('https://caake.org'),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'C.A.A.K.E. Corporation',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
        }
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@caake_ai',
    },
  }
}

// JSON-LD Schema Components
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Corporation',
    name: 'C.A.A.K.E. Corporation',
    alternateName: 'Cost Avoidance Automation Kingz Enterprise',
    url: 'https://caake.org',
    logo: 'https://caake.org/logo.png',
    description: 'Premium AI automation solutions for enterprise. The royal recipe for business automation.',
    foundingDate: '2023',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Phoenix',
      addressRegion: 'AZ',
      addressCountry: 'US'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-480-364-1164',
      contactType: 'sales',
      email: 'mastrianni@caake.org',
      availableLanguage: ['English']
    },
    sameAs: [
      'https://www.linkedin.com/company/caake',
      'https://twitter.com/caake_ai'
    ]
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
    name: 'C.A.A.K.E. Corporation',
    url: 'https://caake.org',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://caake.org/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
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
      item: item.url
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
