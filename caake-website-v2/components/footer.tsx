import Link from 'next/link'
import { Linkedin, Twitter, Github, Mail, Phone } from 'lucide-react'

const footerLinks = {
  solutions: [
    { name: 'Operations', href: '/solutions#operations' },
    { name: 'Sales', href: '/solutions#sales' },
    { name: 'Support', href: '/solutions#support' },
    { name: 'Internal Tools', href: '/solutions#internal' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Case Studies', href: '/case-studies' },
    { name: 'Resources', href: '/resources' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-cosmic border-t border-white/10">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center transform rotate-45">
                <span className="text-gold font-display font-bold text-xl -rotate-45">C</span>
              </div>
              <span className="font-display font-bold text-xl text-white">C.A.A.K.E.</span>
            </Link>
            <p className="text-white/60 text-sm mb-2">
              <span className="text-gold">C</span>ost{' '}
              <span className="text-gold">A</span>voidance{' '}
              <span className="text-gold">A</span>utomation{' '}
              <span className="text-gold">K</span>ingz{' '}
              <span className="text-gold">E</span>nterprise
            </p>
            <p className="text-white/40 text-sm mb-6">
              The royal recipe for enterprise automation.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://linkedin.com/company/caake"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-gold transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://twitter.com/caake_ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-gold transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="mailto:mastrianni@caake.org"
                className="text-white/60 hover:text-gold transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Solutions</h3>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-gold text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-gold text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-gold text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} C.A.A.K.E. Corporation. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="tel:+14803641164" className="text-white/40 hover:text-gold text-sm flex items-center">
              <Phone size={14} className="mr-2" />
              480-364-1164
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
