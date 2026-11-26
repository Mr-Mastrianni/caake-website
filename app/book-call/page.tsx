'use client'

import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import anime from 'animejs'
import { 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  User,
  Mail,
  Building2,
  Briefcase,
  MessageSquare
} from 'lucide-react'

import { SITE } from '@/lib/site'

gsap.registerPlugin(ScrollTrigger)

const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const benefits = [
  {
    icon: Target,
    title: 'A 15-minute call',
    description: 'How customers find you, how they book, and what happens after hours. That’s it.'
  },
  {
    icon: Sparkles,
    title: 'A written teardown within 2 business days',
    description: 'We check your site on a phone, your booking path and your follow-up, then send a short write-up or Loom video.'
  },
  {
    icon: Zap,
    title: 'One fixed price to fix the biggest leak',
    description: 'If you want us to build it, you’ll know the exact cost first. Most first projects start at $1,500–$2,500.'
  },
  {
    icon: CheckCircle,
    title: 'Yours to keep',
    description: 'Use the teardown with us, with someone else, or on your own. No hard sell.'
  },
]

const formFields = [
  { name: 'name', label: 'Full Name', type: 'text', icon: User, placeholder: 'John Smith' },
  { name: 'email', label: 'Work Email', type: 'email', icon: Mail, placeholder: 'john@company.com' },
  { name: 'company', label: 'Company', type: 'text', icon: Building2, placeholder: 'Acme Inc' },
]

export default function BookCallPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    site: '',
    phone: '',
    challenge: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const benefitsRef = useRef<HTMLDivElement>(null)
  const formContainerRef = useRef<HTMLDivElement>(null)

  // GSAP Scroll Animations
  useEffect(() => {
    if (prefersReducedMotion()) return
    
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.from('.booking-hero', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      })

      // Benefits stagger
      gsap.from('.benefit-item', {
        scrollTrigger: {
          trigger: benefitsRef.current,
          start: 'top 80%',
        },
        x: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out'
      })

      // Form container slide in
      gsap.from('.form-container', {
        scrollTrigger: {
          trigger: formContainerRef.current,
          start: 'top 85%',
        },
        x: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      })

      // Form fields stagger
      gsap.from('.form-field', {
        scrollTrigger: {
          trigger: formRef.current,
          start: 'top 85%',
        },
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out'
      })
    })

    return () => ctx.revert()
  }, [])

  // Success animation
  useEffect(() => {
    if (!isSubmitted || prefersReducedMotion()) return
    
    // Success icon bounce in
    anime({
      targets: '.success-icon',
      scale: [0, 1.2, 1],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutElastic(1, .5)'
    })

    // Checkmark draw
    anime({
      targets: '.success-check path',
      strokeDashoffset: [anime.setDashoffset, 0],
      duration: 600,
      delay: 300,
      easing: 'easeOutQuad'
    })

    // Success text fade up
    anime({
      targets: '.success-text > *',
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 600,
      delay: anime.stagger(150, { start: 400 }),
      easing: 'easeOutQuad'
    })

    // Confetti burst
    const confetti = document.querySelectorAll('.confetti-piece')
    confetti.forEach((piece, i) => {
      anime({
        targets: piece,
        translateX: () => anime.random(-200, 200),
        translateY: () => anime.random(-200, 100),
        rotate: () => anime.random(0, 360),
        scale: [1, 0],
        opacity: [1, 0],
        duration: 1000,
        delay: 600 + i * 50,
        easing: 'easeOutExpo'
      })
    })
  }, [isSubmitted])

  // Form field focus choreography with anime.js
  useEffect(() => {
    if (prefersReducedMotion()) return

    const inputs = document.querySelectorAll('.form-input-wrapper')
    
    inputs.forEach((wrapper) => {
      const input = wrapper.querySelector('input, select, textarea')
      const icon = wrapper.querySelector('.field-icon')
      const border = wrapper.querySelector('.field-border')
      
      if (!input) return

      const handleFocus = () => {
        // Scale up wrapper slightly
        anime({
          targets: wrapper,
          scale: 1.02,
          duration: 200,
          easing: 'easeOutQuad'
        })

        // Border glow animation
        anime({
          targets: border,
          borderColor: '#D4AF37',
          boxShadow: '0 0 0 3px rgba(212, 175, 55, 0.1)',
          duration: 200,
          easing: 'easeOutQuad'
        })

        // Icon color change + rotation
        if (icon) {
          anime({
            targets: icon,
            color: '#D4AF37',
            rotate: '1turn',
            scale: 1.1,
            duration: 400,
            easing: 'easeOutElastic(1, .5)'
          })
        }

        // Label float up
        const label = wrapper.querySelector('.field-label')
        if (label) {
          anime({
            targets: label,
            translateY: -5,
            color: '#D4AF37',
            duration: 200,
            easing: 'easeOutQuad'
          })
        }
      }

      const handleBlur = () => {
        // Scale back
        anime({
          targets: wrapper,
          scale: 1,
          duration: 200,
          easing: 'easeOutQuad'
        })

        // Border back to normal
        anime({
          targets: border,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          boxShadow: '0 0 0 0 rgba(212, 175, 55, 0)',
          duration: 200,
          easing: 'easeOutQuad'
        })

        // Icon back to normal
        if (icon) {
          anime({
            targets: icon,
            color: 'rgba(255, 255, 255, 0.4)',
            rotate: 0,
            scale: 1,
            duration: 300,
            easing: 'easeOutQuad'
          })
        }

        // Label back
        const label = wrapper.querySelector('.field-label')
        if (label) {
          anime({
            targets: label,
            translateY: 0,
            color: 'rgba(255, 255, 255, 0.8)',
            duration: 200,
            easing: 'easeOutQuad'
          })
        }
      }

      input.addEventListener('focus', handleFocus)
      input.addEventListener('blur', handleBlur)
    })

    // Button hover animation
    const submitBtn = document.querySelector('.submit-btn')
    if (submitBtn) {
      submitBtn.addEventListener('mouseenter', () => {
        anime({
          targets: submitBtn,
          scale: 1.02,
          boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)',
          duration: 300,
          easing: 'easeOutQuad'
        })
      })

      submitBtn.addEventListener('mouseleave', () => {
        anime({
          targets: submitBtn,
          scale: 1,
          boxShadow: '0 0 0 rgba(0,0,0,0)',
          duration: 300,
          easing: 'easeOutQuad'
        })
      })

      // Button click ripple
      submitBtn.addEventListener('click', (e) => {
        const rect = (submitBtn as HTMLElement).getBoundingClientRect()
        const x = (e as MouseEvent).clientX - rect.left
        const y = (e as MouseEvent).clientY - rect.top

        const ripple = document.createElement('span')
        ripple.style.cssText = `
          position: absolute;
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 50%;
          left: ${x}px;
          top: ${y}px;
          transform: translate(-50%, -50%) scale(0);
          pointer-events: none;
        `
        submitBtn.appendChild(ripple)

        anime({
          targets: ripple,
          scale: [0, 30],
          opacity: [1, 0],
          duration: 600,
          easing: 'easeOutQuad',
          complete: () => ripple.remove()
        })
      })
    }

    // Benefit item hover
    document.querySelectorAll('.benefit-item').forEach((item) => {
      item.addEventListener('mouseenter', () => {
        const icon = item.querySelector('.benefit-icon')
        anime({
          targets: item,
          x: 5,
          duration: 300,
          easing: 'easeOutQuad'
        })
        if (icon) {
          anime({
            targets: icon,
            scale: 1.2,
            rotate: [0, -10, 10, 0],
            duration: 500,
            easing: 'easeOutElastic(1, .5)'
          })
        }
      })

      item.addEventListener('mouseleave', () => {
        const icon = item.querySelector('.benefit-icon')
        anime({
          targets: item,
          x: 0,
          duration: 300,
          easing: 'easeOutQuad'
        })
        if (icon) {
          anime({
            targets: icon,
            scale: 1,
            rotate: 0,
            duration: 300,
            easing: 'easeOutQuad'
          })
        }
      })
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSending(true)
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'booking',
          name: formData.name,
          email: formData.email,
          company: formData.company,
          role: formData.role,
          message: [
            formData.site && `Website: ${formData.site}`,
            formData.phone && `Phone: ${formData.phone}`,
            formData.challenge,
          ]
            .filter(Boolean)
            .join('\n'),
          website: honeypot,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please email us directly.')
      setIsSending(false)
      return
    }
    setIsSending(false)
    // Animate form out before showing success
    if (!prefersReducedMotion()) {
      anime({
        targets: '.form-content',
        opacity: 0,
        scale: 0.95,
        duration: 300,
        easing: 'easeInQuad',
        complete: () => setIsSubmitted(true)
      })
    } else {
      setIsSubmitted(true)
    }
  }

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section ref={heroRef} className="section-padding pt-32">
        <div className="container-custom">
          <div className="booking-hero max-w-3xl mx-auto text-center">
            <span className="text-gold text-sm font-medium uppercase tracking-wider">Free Lead Leak Audit</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mt-4 mb-6">
              Find out where you&apos;re{' '}
              <span className="text-gold-gradient">losing customers</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60">
              A free 15-minute call and a written teardown of your website, booking and follow-up,
              whether you work with us or not.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Left: Benefits */}
            <div ref={benefitsRef} className="lg:sticky lg:top-32 lg:self-start">
              <h2 className="font-display text-3xl font-bold mb-8">
                What to <span className="text-gold">Expect</span>
              </h2>

              <div className="space-y-6">
                {benefits.map((item, index) => (
                  <div key={item.title} className="benefit-item flex gap-4 cursor-pointer">
                    <div className="benefit-icon flex-shrink-0 w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-white/60 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>


            </div>

            {/* Right: Form */}
            <div ref={formContainerRef}>
              <div className="form-container card p-8">
                {!isSubmitted ? (
                  <div className="form-content">
                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
                      <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-gold" />
                      </div>
                      <div>
                        <h2 className="font-display text-xl font-bold">Lead Leak Audit</h2>
                        <div className="flex items-center gap-4 text-white/60 text-sm mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" /> 15 min
                          </span>
                          <span className="flex items-center gap-1">
                            <Video className="w-4 h-4" /> Phone or video
                          </span>
                        </div>
                      </div>
                    </div>

                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                      {/* Name Field */}
                      <div className="form-field form-input-wrapper">
                        <label htmlFor="book-name" className="field-label block text-sm font-medium mb-2 text-white/80">
                          Your name
                        </label>
                        <div className="field-border relative rounded-lg bg-white/5 border border-white/10 transition-all">
                          <User className="field-icon absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                          <input
                            type="text"
                            required
                            id="book-name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-transparent focus:outline-none text-white"
                            placeholder="John Smith"
                          />
                        </div>
                      </div>

                      {/* Email Field */}
                      <div className="form-field form-input-wrapper">
                        <label htmlFor="book-email" className="field-label block text-sm font-medium mb-2 text-white/80">
                          Email
                        </label>
                        <div className="field-border relative rounded-lg bg-white/5 border border-white/10 transition-all">
                          <Mail className="field-icon absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                          <input
                            type="email"
                            required
                            id="book-email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-transparent focus:outline-none text-white"
                            placeholder="john@company.com"
                          />
                        </div>
                      </div>

                      {/* Company & Role Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="form-field form-input-wrapper">
                          <label htmlFor="book-company" className="field-label block text-sm font-medium mb-2 text-white/80">
                            Business name
                          </label>
                          <div className="field-border relative rounded-lg bg-white/5 border border-white/10 transition-all">
                            <Building2 className="field-icon absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                              type="text"
                              required
                              id="book-company"
                            value={formData.company}
                              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 bg-transparent focus:outline-none text-white"
                              placeholder="Your business"
                            />
                          </div>
                        </div>

                        <div className="form-field form-input-wrapper">
                          <label htmlFor="book-role" className="field-label block text-sm font-medium mb-2 text-white/80">
                            Role
                          </label>
                          <div className="field-border relative rounded-lg bg-white/5 border border-white/10 transition-all">
                            <Briefcase className="field-icon absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <select
                              required
                              id="book-role"
                            value={formData.role}
                              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 bg-transparent focus:outline-none text-white appearance-none cursor-pointer"
                            >
                              <option value="" className="bg-midnight">Select...</option>
                              <option value="owner" className="bg-midnight">Owner / Founder</option>
                              <option value="manager" className="bg-midnight">Office or practice manager</option>
                              <option value="clinical" className="bg-midnight">Clinical or operations lead</option>
                              <option value="marketing" className="bg-midnight">Marketing</option>
                              <option value="other" className="bg-midnight">Other</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Website & Phone Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="form-field">
                          <label htmlFor="book-site" className="block text-sm font-medium mb-2 text-white/80">
                            Website (if you have one)
                          </label>
                          <input
                            id="book-site"
                            type="text"
                            inputMode="url"
                            value={formData.site}
                            onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-gold focus:outline-none text-white"
                            placeholder="yourbusiness.com"
                          />
                        </div>
                        <div className="form-field">
                          <label htmlFor="book-phone" className="block text-sm font-medium mb-2 text-white/80">
                            Phone (optional)
                          </label>
                          <input
                            id="book-phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-gold focus:outline-none text-white"
                            placeholder="(317) 555-0100"
                          />
                        </div>
                      </div>

                      {/* Challenge Field */}
                      <div className="form-field form-input-wrapper">
                        <label htmlFor="book-challenge" className="field-label block text-sm font-medium mb-2 text-white/80">
                          Where do you think you&apos;re losing customers? (optional)
                        </label>
                        <div className="field-border relative rounded-lg bg-white/5 border border-white/10 transition-all">
                          <MessageSquare className="field-icon absolute left-3 top-3 w-5 h-5 text-white/40" />
                          <textarea
                            rows={4}
                            id="book-challenge"
                            value={formData.challenge}
                            onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-transparent focus:outline-none text-white resize-none"
                            placeholder="e.g. calls after hours go to voicemail, the site is slow on phones, no-shows..."
                          />
                        </div>
                      </div>

                      <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
                      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
                      <button 
                        type="submit" 
                        disabled={isSending}
                        className="submit-btn btn btn-primary w-full justify-center text-lg relative overflow-hidden disabled:opacity-60"
                      >
                        {isSending ? 'Sending...' : 'Request my free audit'}
                        <ArrowRight className="ml-2" size={18} />
                      </button>

                      <p className="text-white/40 text-xs text-center">
                        We&apos;ll email you within one business day to pick a time. No spam, ever.
                      </p>
                    </form>
                  </div>
                ) : (
                  <div className="success-state text-center py-8 relative">
                    {/* Confetti pieces */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className="confetti-piece absolute w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: ['#D4AF37', '#7C3AED', '#06B6D4'][i % 3],
                            left: '50%',
                            top: '30%',
                          }}
                        />
                      ))}
                    </div>

                    <div className="success-icon w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6 relative">
                      <CheckCircle className="success-check w-12 h-12 text-gold" />
                    </div>

                    <div className="success-text">
                      <h3 className="font-display text-2xl font-bold mb-4">Got it, thank you!</h3>
                      <p className="text-white/60 mb-6">
                        A person on our team will email you within one business day to pick a time for your
                        15-minute call.
                      </p>
                      {SITE.calendarUrl && (
                        <a href={SITE.calendarUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary mb-6">
                          Or pick a time now
                        </a>
                      )}
                      <div className="text-white/40 text-sm">
                        Need us sooner? Call{' '}
                        <a href={SITE.phoneHref} className="text-gold hover:underline">
                          {SITE.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  )
}
