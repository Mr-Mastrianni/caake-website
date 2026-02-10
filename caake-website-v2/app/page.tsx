'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import anime from 'animejs'
import {
  ArrowRight,
  Shield,
  Zap,
  TrendingUp,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// Check for reduced motion
const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const benefits = [
  {
    icon: DollarSign,
    title: 'Save Money',
    description: 'Drastically reduce operational costs with intelligent automation.'
  },
  {
    icon: Clock,
    title: 'Save Time',
    description: 'Reclaim thousands of hours by letting AI handle the repetitive work.'
  },
  {
    icon: TrendingUp,
    title: 'Grow Faster',
    description: 'Scale your operations 10x without adding headcount.'
  }
]

const simpleSteps = [
  {
    number: '01',
    title: 'Audit',
    description: 'We analyze your workflows to find high-impact automation opportunities.'
  },
  {
    number: '02',
    title: 'Build',
    description: 'We deploy custom AI agents tailored to your specific business needs.'
  },
  {
    number: '03',
    title: 'Launch',
    description: 'You start saving time and money immediately with full support.'
  }
]

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const benefitsRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)
  const trustRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      // ===== HERO ANIMATIONS =====
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      heroTl.from('.hero-logo', { scale: 0.8, opacity: 0, duration: 1, ease: 'back.out(1.7)' })
        .from('.hero-title', { y: 50, opacity: 0, duration: 0.8 }, '-=0.5')
        .from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.8 }, '-=0.6')
        .from('.hero-cta', { y: 20, opacity: 0, duration: 0.6 }, '-=0.6')

      // ===== BENEFITS ANIMATION =====
      gsap.from('.benefit-card', {
        scrollTrigger: {
          trigger: benefitsRef.current,
          start: 'top 80%',
        },
        y: 60,
        opacity: 0,
        duration: 0.7,
        stagger: 0.2,
        ease: 'power3.out'
      })

      // ===== STEPS ANIMATION =====
      gsap.from('.step-item', {
        scrollTrigger: {
          trigger: stepsRef.current,
          start: 'top 75%',
        },
        x: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power3.out'
      })

      // ===== CTA ANIMATION =====
      gsap.from('.cta-content', {
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 80%',
        },
        scale: 0.95,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      })
    })

    return () => ctx.revert()
  }, [])

  // Micro-interactions
  useEffect(() => {
    if (prefersReducedMotion()) return

    // Floating animation
    anime({
      targets: '.floating-element',
      translateY: [-10, 10],
      duration: 3000,
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutSine'
    })

    // Logo hover effect
    const logo = document.querySelector('.hero-logo-img')
    if (logo) {
      logo.addEventListener('mouseenter', () => {
        anime({
          targets: logo,
          scale: 1.05,
          rotate: '2deg',
          duration: 400,
          easing: 'easeOutQuad'
        })
      })
      logo.addEventListener('mouseleave', () => {
        anime({
          targets: logo,
          scale: 1,
          rotate: '0deg',
          duration: 400,
          easing: 'easeOutQuad'
        })
      })
    }
  }, [])

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-midnight">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/10 via-midnight to-midnight opacity-60" />
          <div className="floating-element absolute top-1/4 -left-20 w-80 h-80 bg-purple/20 rounded-full blur-[100px]" />
          <div className="floating-element absolute bottom-1/4 -right-20 w-80 h-80 bg-gold/10 rounded-full blur-[100px]" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center">

            {/* Main Logo */}
            <div className="hero-logo mb-10 w-64 md:w-80 lg:w-96 relative">
              <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full opacity-50 animate-pulse"></div>
              <img
                src="/logocaake.png"
                alt="CAAKE Logo"
                className="hero-logo-img relative w-full h-auto object-contain drop-shadow-2xl"
              />
            </div>

            {/* Headline */}
            <h1 className="hero-title font-display text-5xl md:text-7xl font-bold mb-6">
              AI Solutions for <br />
              <span className="text-gold-gradient">Business Growth</span>
            </h1>

            {/* Subheadline */}
            <p className="hero-subtitle text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              We help companies simplify operations, reduce costs, and scale faster with custom AI automation.
            </p>

            {/* CTA */}
            <div className="hero-cta">
              <Link
                href="mailto:mastrianni@caake.org"
                className="btn btn-primary text-lg px-10 py-5 rounded-full shadow-lg shadow-gold/20 hover:shadow-gold/40 transition-all flex items-center gap-2"
              >
                Book Your Strategy Call
                <ArrowRight size={20} />
              </Link>
              <p className="mt-4 text-sm text-white/40">No technical expertise required.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section ref={benefitsRef} className="py-24 bg-midnight relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">Why Choose CAAKE?</h2>
            <p className="text-white/60">Real results for real businesses.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="benefit-card p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/30 transition-colors text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-white/70 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simplified Process */}
      <section ref={stepsRef} className="py-24 bg-cosmic/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-white/60">Simple, transparent, and effective.</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {simpleSteps.map((step, index) => (
              <div
                key={index}
                className="step-item flex flex-col md:flex-row gap-6 items-center md:items-start p-8 rounded-2xl bg-white/5 border border-white/5"
              >
                <div className="text-5xl font-display font-bold text-gold/20">{step.number}</div>
                <div className="text-center md:text-left">
                  <h3 className="font-display text-2xl font-bold mb-2">{step.title}</h3>
                  <p className="text-white/70">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Governance */}
      <section ref={trustRef} className="py-20 border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Enterprise-Grade Security
          </div>
          <h2 className="font-display text-3xl font-bold mb-6">Built on Trust</h2>
          <p className="text-white/60 max-w-2xl mx-auto mb-10">
            We prioritize data security and governance. Our solutions are designed to be safe, compliant, and fully auditable from day one.
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholders for client logos or badges can go here if needed, keeping it clean for now */}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section ref={ctaRef} className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gold/5" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="cta-content max-w-3xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-8">
              Ready to <span className="text-gold">Automate?</span>
            </h2>
            <p className="text-xl text-white/70 mb-10">
              Schedule a free 15-minute discovery call to see how we can help your business.
            </p>
            <Link
              href="mailto:mastrianni@caake.org"
              className="btn btn-primary text-xl px-12 py-6 rounded-full shadow-2xl shadow-gold/20 hover:scale-105 transition-transform inline-flex items-center gap-3"
            >
              Book Strategy Call
              <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

