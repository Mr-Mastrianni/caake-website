'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import anime from 'animejs'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Solutions', href: '/solutions' },
  { name: 'Case Studies', href: '/case-studies' },
  { name: 'About', href: '/about' },
  { name: 'Resources', href: '/resources' },
  { name: 'Contact', href: '/contact' },
]

const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Mobile menu animation
  useEffect(() => {
    if (prefersReducedMotion()) return

    if (isOpen && mobileMenuRef.current) {
      anime({
        targets: mobileMenuRef.current,
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: 300,
        easing: 'easeOutQuad'
      })

      anime({
        targets: mobileMenuRef.current.querySelectorAll('a, button'),
        opacity: [0, 1],
        translateX: [-20, 0],
        delay: anime.stagger(50),
        duration: 300,
        easing: 'easeOutQuad'
      })
    }
  }, [isOpen])

  // Nav link hover animations
  useEffect(() => {
    if (prefersReducedMotion()) return

    // Desktop nav links
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('mouseenter', () => {
        anime({
          targets: link,
          y: -2,
          duration: 200,
          easing: 'easeOutQuad'
        })

        const underline = link.querySelector('.nav-underline')
        if (underline) {
          anime({
            targets: underline,
            scaleX: [0, 1],
            duration: 200,
            easing: 'easeOutQuad'
          })
        }
      })

      link.addEventListener('mouseleave', () => {
        anime({
          targets: link,
          y: 0,
          duration: 200,
          easing: 'easeOutQuad'
        })

        const underline = link.querySelector('.nav-underline')
        if (underline) {
          anime({
            targets: underline,
            scaleX: pathname === link.getAttribute('href') ? 1 : 0,
            duration: 200,
            easing: 'easeOutQuad'
          })
        }
      })
    })

    // Logo hover
    const logo = document.querySelector('.nav-logo')
    if (logo) {
      logo.addEventListener('mouseenter', () => {
        anime({
          targets: logo.querySelector('.logo-icon'),
          rotate: [0, 15, -15, 0],
          scale: 1.1,
          duration: 500,
          easing: 'easeOutElastic(1, .5)'
        })
      })

      logo.addEventListener('mouseleave', () => {
        anime({
          targets: logo.querySelector('.logo-icon'),
          rotate: 0,
          scale: 1,
          duration: 300,
          easing: 'easeOutQuad'
        })
      })
    }

    // CTA button pulse
    const ctaBtn = document.querySelector('.nav-cta')
    if (ctaBtn) {
      anime({
        targets: ctaBtn,
        boxShadow: [
          '0 0 0 rgba(212, 175, 55, 0)',
          '0 0 20px rgba(212, 175, 55, 0.3)',
          '0 0 0 rgba(212, 175, 55, 0)'
        ],
        duration: 2000,
        loop: true,
        easing: 'easeInOutSine',
        delay: 2000
      })

      ctaBtn.addEventListener('mouseenter', () => {
        anime({
          targets: ctaBtn,
          scale: 1.05,
          duration: 200,
          easing: 'easeOutQuad'
        })
      })

      ctaBtn.addEventListener('mouseleave', () => {
        anime({
          targets: ctaBtn,
          scale: 1,
          duration: 200,
          easing: 'easeOutQuad'
        })
      })
    }

    // Hamburger animation
    const hamburger = document.querySelector('.hamburger-btn')
    if (hamburger) {
      hamburger.addEventListener('mouseenter', () => {
        anime({
          targets: hamburger,
          scale: 1.1,
          duration: 200,
          easing: 'easeOutQuad'
        })
      })

      hamburger.addEventListener('mouseleave', () => {
        anime({
          targets: hamburger,
          scale: 1,
          duration: 200,
          easing: 'easeOutQuad'
        })
      })
    }
  }, [pathname])

  return (
    <header
      ref={navRef}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-midnight/90 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent'
      )}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="nav-logo flex items-center space-x-3 group">
            <div className="logo-icon relative w-12 h-12 flex items-center justify-center">
              <img
                src="/logocaake.png"
                alt="CAAKE Logo"
                className="w-full h-full object-contain transition-transform group-hover:scale-110"
              />
            </div>
            <span className="font-display font-bold text-xl text-white tracking-wide">
              CAAKE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'nav-link relative text-sm font-medium transition-colors py-1',
                  pathname === item.href
                    ? 'text-gold'
                    : 'text-white/80 hover:text-white'
                )}
              >
                {item.name}
                <span
                  className={cn(
                    'nav-underline absolute -bottom-1 left-0 right-0 h-0.5 bg-gold transform origin-left',
                    pathname === item.href ? 'scale-x-100' : 'scale-x-0'
                  )}
                />
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="mailto:mastrianni@caake.org"
              className="nav-cta btn btn-primary text-sm"
            >
              Work With Us
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="hamburger-btn md:hidden p-2 text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden py-4 border-t border-white/10"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-lg font-medium py-2',
                    pathname === item.href
                      ? 'text-gold'
                      : 'text-white/80 hover:text-white'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <a
                href="mailto:mastrianni@caake.org"
                className="btn btn-primary text-center mt-4"
                onClick={() => setIsOpen(false)}
              >
                Work With Us
              </a>
              <div className="pt-4 border-t border-white/10">
                <Link
                  href="/security-governance"
                  className="text-sm text-white/60 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Security & Governance
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
