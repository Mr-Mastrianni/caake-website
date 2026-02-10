'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import anime from 'animejs'
import { ArrowRight, Video, Smartphone, GraduationCap, Cpu, Clock } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const deliverables = [
  {
    icon: Video,
    title: 'AI Commercials',
    description: 'Produced AI-generated commercial content for university marketing and communications.',
  },
  {
    icon: Smartphone,
    title: 'Custom Applications',
    description: 'Built tailored software applications to streamline university operations and workflows.',
  },
  {
    icon: GraduationCap,
    title: 'SBAR Training',
    description: 'Comprehensive training sessions teaching personnel how to effectively use SBAR builders for structured communication.',
  },
  {
    icon: Cpu,
    title: 'PCTF Framework',
    description: 'Hands-on instruction in the PCTF prompting framework for better AI interactions and outputs.',
  },
]

export default function CaseStudiesPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const deliverablesRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.from('.case-studies-hero', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      })

      // Content section
      gsap.from('.client-content', {
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      })

      // Deliverables stagger
      gsap.from('.deliverable-card', {
        scrollTrigger: {
          trigger: deliverablesRef.current,
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out'
      })

      // CTA section
      gsap.from('.case-studies-cta', {
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 85%',
        },
        y: 50,
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

    // Card hover effects
    document.querySelectorAll('.deliverable-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        anime({
          targets: card,
          translateY: -5,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          duration: 300,
          easing: 'easeOutQuad'
        })
      })
      
      card.addEventListener('mouseleave', () => {
        anime({
          targets: card,
          translateY: 0,
          boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
          duration: 300,
          easing: 'easeOutQuad'
        })
      })
    })

    // Button hover
    document.querySelectorAll('.btn-animate').forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        anime({
          targets: btn,
          scale: 1.03,
          duration: 300,
          easing: 'easeOutQuad'
        })
      })
      
      btn.addEventListener('mouseleave', () => {
        anime({
          targets: btn,
          scale: 1,
          duration: 300,
          easing: 'easeOutQuad'
        })
      })
    })
  }, [])

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section ref={heroRef} className="section-padding pt-32">
        <div className="container-custom">
          <div className="case-studies-hero max-w-3xl mx-auto text-center">
            <span className="text-gold text-sm font-medium uppercase tracking-wider">Our Work</span>
            <h1 className="font-display text-5xl md:text-7xl font-bold mt-4 mb-6">
              Indiana <span className="text-gold-gradient">University</span>
            </h1>
            <p className="text-xl text-white/60">
              Proud vendors partnering with Indiana University to deliver AI-powered solutions, 
              custom applications, and comprehensive training programs.
            </p>
          </div>
        </div>
      </section>

      {/* Client Overview */}
      <section ref={contentRef} className="section-padding">
        <div className="container-custom">
          <div className="client-content max-w-4xl mx-auto">
            <div className="card p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gold/20 flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-gold" />
                </div>
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold">Trusted University Partner</h2>
                  <p className="text-white/60">Education • Healthcare • Research</p>
                </div>
              </div>
              
              <p className="text-white/70 text-lg mb-6">
                We are currently engaged as vendors at Indiana University, working across 
                multiple departments to deliver innovative technology solutions and empower 
                their teams through specialized training programs.
              </p>

              <div className="p-4 rounded-lg bg-gold/10 border border-gold/20">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <p className="text-white/70 text-sm">
                    <span className="text-gold font-medium">Ongoing Partnership:</span> We are 
                    currently in the process of building additional applications for Indiana 
                    University, expanding our collaboration to meet their evolving needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section ref={deliverablesRef} className="section-padding bg-cosmic/30">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-gold text-sm font-medium uppercase tracking-wider">What We Have Delivered</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-3">
              Services & Solutions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {deliverables.map((item) => (
              <div 
                key={item.title}
                className="deliverable-card card p-6 flex gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training Programs Detail */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card p-8">
                <h3 className="font-display text-2xl font-bold mb-4">SBAR Builder Training</h3>
                <p className="text-white/70 mb-4">
                  We conducted comprehensive training sessions teaching Indiana University personnel 
                  how to effectively use SBAR (Situation, Background, Assessment, Recommendation) builders.
                </p>
                <ul className="space-y-2 text-white/60 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    Structured communication frameworks
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    Healthcare and administrative applications
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    Hands-on workshop sessions
                  </li>
                </ul>
              </div>

              <div className="card p-8">
                <h3 className="font-display text-2xl font-bold mb-4">PCTF Prompting Framework</h3>
                <p className="text-white/70 mb-4">
                  Our team provided in-depth instruction on the PCTF (Persona, Context, Task, Format) 
                  prompting framework to enhance AI interaction quality.
                </p>
                <ul className="space-y-2 text-white/60 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    Persona-based prompt engineering
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    Context-aware AI interactions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    Consistent, high-quality outputs
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="section-padding">
        <div className="container-custom">
          <div className="case-studies-cta text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to Work Together?
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto mb-8">
              Whether you need AI solutions, custom applications, or team training, 
              we deliver results that matter.
            </p>
            <a href="mailto:mastrianni@caake.org" className="btn btn-primary btn-animate inline-flex">
              Start a Conversation
              <ArrowRight className="ml-2" size={16} />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
