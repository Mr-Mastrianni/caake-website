import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'
import { CTA, SITE } from '@/lib/site'

const footerLinks = {
  services: [
    { name: 'Websites', href: '/services#websites' },
    { name: 'Booking & follow-up', href: '/services#follow-up' },
    { name: 'Custom apps', href: '/services#apps' },
    { name: 'AI assistants', href: '/services#ai' },
    { name: 'AI training', href: '/services#training' },
  ],
  company: [
    { name: 'Our work', href: '/work' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
    { name: 'Resources', href: '/resources' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'How we handle data', href: '/security-governance' },
    { name: 'AI Use Policy', href: '/ai-use-policy' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-cosmic border-t border-white/10">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <img src="/logocaake.png" alt="" className="w-10 h-10 object-contain" />
              <span className="font-display font-bold text-xl text-white">C.A.A.K.E.</span>
            </Link>
            <p className="text-white/60 text-sm mb-6 max-w-sm">
              Websites, apps and AI that bring in customers and keep up with them. A small team in{' '}
              {SITE.city}, {SITE.regionName}, working with businesses anywhere in the U.S.
            </p>
            <Link href={CTA.href} className="btn btn-primary text-sm mb-6">
              {CTA.label}
            </Link>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <a href={`mailto:${SITE.email}`} className="hover:text-gold inline-flex items-center gap-2">
                  <Mail size={14} aria-hidden="true" /> {SITE.email}
                </a>
              </li>
              <li>
                <a href={SITE.phoneHref} className="hover:text-gold inline-flex items-center gap-2">
                  <Phone size={14} aria-hidden="true" /> {SITE.phone}
                </a>
              </li>
              <li className="inline-flex items-center gap-2">
                <MapPin size={14} aria-hidden="true" /> {SITE.city}, {SITE.regionName}
              </li>
            </ul>
          </div>

          {(
            [
              ['Services', footerLinks.services],
              ['Company', footerLinks.company],
              ['Legal', footerLinks.legal],
            ] as const
          ).map(([heading, links]) => (
            <div key={heading}>
              <h2 className="font-display font-semibold text-white mb-4">{heading}</h2>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-white/60 hover:text-gold text-sm transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
          </p>
          <a
            href={SITE.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-gold text-sm"
          >
            Founder’s engineering portfolio ↗
          </a>
        </div>
      </div>
    </footer>
  )
}
