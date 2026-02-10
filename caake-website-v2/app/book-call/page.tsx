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

gsap.registerPlugin(ScrollTrigger)

const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const benefits = [
  {
    icon: Target,
    title: 'Opportunity Assessment',
    description: 'We identify the highest-impact automation opportunities in your business.'
  },
  {
    icon: Sparkles,
    title: 'Solution Blueprint',
    description: 'You get a clear roadmap of what to build, in what order, and why.'
  },
  {
    icon: Zap,
    title: 'Implementation Plan',
    description: 'Understand timelines, resources needed, and expected ROI.'
  },
  {
    icon: CheckCircle,
    title: 'No Pressure',
    description: 'This is a genuine strategy session. No hard sell, ever.'
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
    challenge: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
            <span className="text-gold text-sm font-medium uppercase tracking-wider">Book a Call</span>
            <h1 className="font-display text-5xl md:text-6xl font-bold mt-4 mb-6">
              Let&apos;s Build Your{' '}
              <span className="text-gold-gradient">Recipe</span>
            </h1>
            <p className="text-xl text-white/60">
              Book a 30-minute strategy call. Walk away with a 90-day automation roadmap—
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
                        <h3 className="font-display text-xl font-bold">Strategy Call</h3>
                        <div className="flex items-center gap-4 text-white/60 text-sm mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" /> 30 min
                          </span>
                          <span className="flex items-center gap-1">
                            <Video className="w-4 h-4" /> Video
                          </span>
                        </div>
                      </div>
                    </div>

                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                      {/* Name Field */}
                      <div className="form-field form-input-wrapper">
                        <label className="field-label block text-sm font-medium mb-2 text-white/80">
                          Full Name
                        </label>
                        <div className="field-border relative rounded-lg bg-white/5 border border-white/10 transition-all">
                          <User className="field-icon absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-transparent focus:outline-none text-white"
                            placeholder="John Smith"
                          />
                        </div>
                      </div>

                      {/* Email Field */}
                      <div className="form-field form-input-wrapper">
                        <label className="field-label block text-sm font-medium mb-2 text-white/80">
                          Work Email
                        </label>
                        <div className="field-border relative rounded-lg bg-white/5 border border-white/10 transition-all">
                          <Mail className="field-icon absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                          <input
                            type="email"
                            required
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
                          <label className="field-label block text-sm font-medium mb-2 text-white/80">
                            Company
                          </label>
                          <div className="field-border relative rounded-lg bg-white/5 border border-white/10 transition-all">
                            <Building2 className="field-icon absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                              type="text"
                              required
                              value={formData.company}
                              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 bg-transparent focus:outline-none text-white"
                              placeholder="Acme Inc"
                            />
                          </div>
                        </div>

                        <div className="form-field form-input-wrapper">
                          <label className="field-label block text-sm font-medium mb-2 text-white/80">
                            Role
                          </label>
                          <div className="field-border relative rounded-lg bg-white/5 border border-white/10 transition-all">
                            <Briefcase className="field-icon absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <select
                              required
                              value={formData.role}
                              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 bg-transparent focus:outline-none text-white appearance-none cursor-pointer"
                            >
                              <option value="" className="bg-midnight">Select...</option>
                              <option value="ceo" className="bg-midnight">CEO / Founder</option>
                              <option value="cto" className="bg-midnight">CTO / VP Engineering</option>
                              <option value="coo" className="bg-midnight">COO / VP Operations</option>
                              <option value="cmo" className="bg-midnight">CMO / VP Marketing</option>
                              <option value="other" className="bg-midnight">Other</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Challenge Field */}
                      <div className="form-field form-input-wrapper">
                        <label className="field-label block text-sm font-medium mb-2 text-white/80">
                          What&apos;s your biggest automation challenge?
                        </label>
                        <div className="field-border relative rounded-lg bg-white/5 border border-white/10 transition-all">
                          <MessageSquare className="field-icon absolute left-3 top-3 w-5 h-5 text-white/40" />
                          <textarea
                            rows={4}
                            value={formData.challenge}
                            onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-transparent focus:outline-none text-white resize-none"
                            placeholder="Tell us about your current pain points..."
                          />
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        className="submit-btn btn btn-primary w-full justify-center text-lg relative overflow-hidden"
                      >
                        Schedule Your Call
                        <ArrowRight className="ml-2" size={18} />
                      </button>

                      <p className="text-white/40 text-xs text-center">
                        We respect your privacy. No spam, ever.
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
                      <h3 className="font-display text-2xl font-bold mb-4">You&apos;re All Set!</h3>
                      <p className="text-white/60 mb-6">
                        Thanks for booking. We&apos;ve sent a confirmation email with your meeting details.
                        Looking forward to strategizing with you!
                      </p>
                      <div className="text-white/40 text-sm">
                        Didn&apos;t receive it? Check your spam folder or{' '}
                        <a href="mailto:mastrianni@caake.org" className="text-gold hover:underline">
                          contact us
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
