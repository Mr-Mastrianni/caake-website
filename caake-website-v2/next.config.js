/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use export output and distDir for production builds
  ...(process.env.NODE_ENV === 'production' ? {
    output: 'export',
    distDir: 'dist',
  } : {}),
  
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'geolocation=(), microphone=(), camera=()',
        },
      ],
    },
  ],
  redirects: async () => [
    {
      source: '/pages/services.html',
      destination: '/solutions',
      permanent: true,
    },
    {
      source: '/pages/about.html',
      destination: '/about',
      permanent: true,
    },
    {
      source: '/pages/contact.html',
      destination: '/contact',
      permanent: true,
    },
    {
      source: '/pages/pricing.html',
      destination: '/book-call',
      permanent: true,
    },
  ],
}

module.exports = nextConfig
