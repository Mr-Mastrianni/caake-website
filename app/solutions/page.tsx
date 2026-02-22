'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import anime from 'animejs'
import { 
  ArrowRight, 
  Settings, 
  TrendingUp, 
  MessageSquare, 
  Cpu,
  FileText,
  BarChart,
  CheckCircle
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const solutions = [
  {
    id: 'operations',
    icon: Settings,
    title: 'Operations Automation',
    description: 'Streamline workflows, reduce manual tasks, and eliminate bottlenecks across your operational processes.',
    benefits: [
      'Automated workflow orchestration',
      'Intelligent document processing',
      'Supply chain optimization',
      'Inventory management AI',
      'Quality assurance automation'
    ],
    color: 'gold'
  },
  {
    id: 'sales',
    icon: TrendingUp,
    title: 'Sales Automation',
    description: 'Accelerate your pipeline with AI-powered lead scoring, outreach, and relationship management.',
    benefits: [
      'Lead scoring & qualification',
      'Personalized outreach at scale',
      'CRM data enrichment',
      'Proposal generation',
      'Pipeline forecasting'
    ],
    color: 'purple'
  },
  {
    id: 'support',
    icon: MessageSquare,
    title: 'Support Automation',
    description: 'Deliver exceptional customer experiences with intelligent ticketing, resolution, and knowledge management.',
    benefits: [
      'Intelligent ticket routing',
      'Automated resolution suggestions',
      'Knowledge base AI',
      'Sentiment analysis',
      '24/7 customer assistance'
    ],
    color: 'cyan'
  },
  {
    id: 'internal',
    icon: Cpu,
    title: 'Internal Tools',
    description: 'Empower your team with custom AI assistants tailored to your specific business processes.',
    benefits: [
      'Custom AI assistants',
      'Data analysis & reporting',
      'Meeting transcription & insights',
      'Code generation & review',
      'Research & summarization'
    ],
    color: 'gold'
  }
]

const processSteps = [
  {
    icon: FileText,
    title: 'Audit',
    description: 'We analyze your current workflows to identify automation opportunities'
  },
  {
    icon: BarChart,
    title: 'Prioritize',
    description: 'Rank opportunities by impact and implementation complexity'
  },
  {
    icon: Settings,
    title: 'Build',
    description: 'Develop custom AI solutions integrated with your stack'
  },
  {
    icon: CheckCircle,
    title: 'Deploy',
    description: 'Launch with training, documentation, and ongoing support'
  }
]

export default function SolutionsPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const processRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from('.solutions-hero-content', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      })

      // Recipe cards "assemble" animation - cards come from different directions
      const cards = document.querySelectorAll('.solution-card')
      const directions = [
        { x: -100, y: -50, rotate: -15 },   // From top-left
        { x: 100, y: -50, rotate: 15 },     // From top-right
        { x: -100, y: 50, rotate: -10 },    // From bottom-left
        { x: 100, y: 50, rotate: 10 },      // From bottom-right
      ]

      cards.forEach((card, i) => {
        const dir = directions[i % directions.length]
        
        gsap.from(card, {
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
          },
          x: dir.x,
          y: dir.y,
          rotate: dir.rotate,
          opacity: 0,
          scale: 0.8,
          duration: 0.8,
          delay: i * 0.15,
          ease: 'power3.out',
          onComplete: () => {
            // Small bounce effect after assembly
            anime({
              targets: card,
              scale: [1, 1.02, 1],
              duration: 300,
              easing: 'easeOutQuad'
            })
          }
        })
      })

      // Process steps stagger
      gsap.from('.process-step', {
        scrollTrigger: {
          trigger: processRef.current,
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out'
      })

      // Process connector line draw
      gsap.from('.process-connector', {
        scrollTrigger: {
          trigger: processRef.current,
          start: 'top 70%',
        },
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1,
        delay: 0.5,
        ease: 'power2.out'
      })

      // CTA section
      gsap.from('.solutions-cta', {
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

  // Micro-interactions with anime.js
  useEffect(() => {
    if (prefersReducedMotion()) return

    // Solution card hover - pulse effect
    document.querySelectorAll('.solution-card').forEach((card) => {
      let pulseAnimation: any = null
      
      card.addEventListener('mouseenter', () => {
        // Lift effect
        anime({
          targets: card,
          translateY: -10,
          boxShadow: '0 25px 50px rgba(212, 175, 55, 0.15)',
          duration: 400,
          easing: 'easeOutQuad'
        })

        // Subtle pulse on border
        pulseAnimation = anime({
          targets: card,
          borderColor: ['rgba(255,255,255,0.1)', 'rgba(212,175,55,0.5)', 'rgba(255,255,255,0.1)'],
          duration: 1500,
          loop: true,
          easing: 'easeInOutSine'
        })
      })
      
      card.addEventListener('mouseleave', () => {
        if (pulseAnimation) pulseAnimation.pause()
        
        anime({
          targets: card,
          translateY: 0,
          boxShadow: '0 0 0 rgba(0,0,0,0)',
          borderColor: 'rgba(255,255,255,0.1)',
          duration: 400,
          easing: 'easeOutQuad'
        })
      })
    })

    // Icon rotation on card hover
    document.querySelectorAll('.solution-icon').forEach((icon) => {
      const card = icon.closest('.solution-card')
      if (card) {
        card.addEventListener('mouseenter', () => {
          anime({
            targets: icon,
            rotate: '1turn',
            scale: 1.2,
            duration: 600,
            easing: 'easeOutElastic(1, .5)'
          })
        })
        
        card.addEventListener('mouseleave', () => {
          anime({
            targets: icon,
            rotate: 0,
            scale: 1,
            duration: 400,
            easing: 'easeOutQuad'
          })
        })
      }
    })

    // Button ripple effect
    document.querySelectorAll('.btn-ripple').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const rect = (btn as HTMLElement).getBoundingClientRect()
        const x = (e as MouseEvent).clientX - rect.left
        const y = (e as MouseEvent).clientY - rect.top
        
        const ripple = document.createElement('span')
        ripple.style.cssText = `
          position: absolute;
          width: 20px;
          height: 20px;
          background: rgba(212, 175, 55, 0.4);
          border-radius: 50%;
          left: ${x}px;
          top: ${y}px;
          transform: translate(-50%, -50%) scale(0);
          pointer-events: none;
        `
        btn.appendChild(ripple)
        
        anime({
          targets: ripple,
          scale: [0, 20],
          opacity: [1, 0],
          duration: 800,
          easing: 'easeOutQuad',
          complete: () => ripple.remove()
        })
      })
    })

    // Process step icon bounce
    document.querySelectorAll('.process-step-icon').forEach((icon) => {
      const step = icon.closest('.process-step')
      if (step) {
        step.addEventListener('mouseenter', () => {
          anime({
            targets: icon,
            scale: [1, 1.2, 1],
            duration: 400,
            easing: 'easeOutElastic(1, .5)'
          })
        })
      }
    })
  }, [])

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section ref={heroRef} className="section-padding pt-32">
        <div className="container-custom">
          <div className="solutions-hero-content max-w-3xl mx-auto text-center">
            <span className="text-gold text-sm font-medium uppercase tracking-wider">Solutions</span>
            <h1 className="font-display text-5xl md:text-7xl font-bold mt-4 mb-6">
              Automation for Every{' '}
              <span className="text-gold-gradient">Function</span>
            </h1>
            <p className="text-xl text-white/60">
              Purpose-built AI solutions for the departments that drive your business forward.
              From operations to sales, we help you move faster with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Grid - Recipe Cards */}
      <section ref={cardsRef} className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {solutions.map((solution) => (
              <div 
                key={solution.id}
                id={solution.id}
                className="solution-card card p-8 lg:p-10 group cursor-pointer"
                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <div className="flex flex-col h-full">
                  <div className="mb-6">
                    <solution.icon className={`solution-icon w-12 h-12 text-${solution.color}`} />
                  </div>
                  
                  <h2 className="font-display text-3xl font-bold mb-4">{solution.title}</h2>
                  <p className="text-white/60 mb-8 flex-1">{solution.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {solution.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-3 text-white/80">
                        <CheckCircle className="w-5 h-5 text-gold flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link 
                    href="mailto:mastrianni@caake.org"
                    className="btn btn-secondary w-full justify-center group/btn btn-ripple relative overflow-hidden"
                  >
                    Discuss Your {solution.title.split(' ')[0]} Needs
                    <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section ref={processRef} className="section-padding bg-cosmic/30">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-gold text-sm font-medium uppercase tracking-wider">Our Approach</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-4">
              How We <span className="text-gold">Deliver</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              A proven process that takes you from concept to deployed automation
            </p>
          </div>

          <div className="relative">
            {/* Connector line (visible on md+) */}
            <div className="process-connector hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-gold/0 via-gold/50 to-gold/0" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {processSteps.map((step, index) => (
                <div key={step.title} className="process-step text-center group cursor-pointer">
                  <div className="process-step-icon w-16 h-16 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-6 group-hover:bg-gold/20 group-hover:border-gold/50 transition-colors">
                    <step.icon className="w-8 h-8 text-gold" />
                  </div>
                  <div className="text-gold/60 text-sm mb-2">Step {index + 1}</div>
                  <h3 className="font-display text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-white/60 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="section-padding">
        <div className="container-custom">
          <div className="solutions-cta card p-12 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Not Sure Where to Start?
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto mb-8">
              Every business is different. Let us help you identify the highest-impact 
              automation opportunities in your organization.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="mailto:mastrianni@caake.org" className="btn btn-primary btn-ripple relative overflow-hidden">
                Get Your Free Automation Audit
                <ArrowRight className="ml-2" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
