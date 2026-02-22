'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import anime from 'animejs'
import { 
  ArrowRight, 
  Shield, 
  Server, 
  Workflow,
  Database,
  Lock,
  Eye,
  FileCheck,
  Cpu,
  Network,
  ChevronRight,
  TrendingUp
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const features = [
  {
    icon: Server,
    title: 'Enterprise Infrastructure',
    description: 'SOC 2 Type II certified cloud infrastructure with 99.99% uptime SLA. Your data never touches unauthorized systems.',
    color: 'gold'
  },
  {
    icon: Workflow,
    title: 'Orchestration Engine',
    description: 'Our proprietary workflow engine coordinates multiple AI agents, human approvals, and system integrations seamlessly.',
    color: 'purple'
  },
  {
    icon: Database,
    title: 'Secure Data Handling',
    description: 'End-to-end encryption, data residency options, and automatic PII detection and masking.',
    color: 'cyan'
  },
  {
    icon: Lock,
    title: 'Access Control',
    description: 'Role-based permissions, SSO integration, and detailed audit logs for every action.',
    color: 'gold'
  }
]

const governanceFeatures = [
  { icon: Eye, title: 'Human Oversight', description: 'Every critical decision includes human review checkpoints' },
  { icon: FileCheck, title: 'Audit Logging', description: 'Complete history of all AI decisions and actions' },
  { icon: Shield, title: 'Model Governance', description: 'Version control, testing, and approval workflows for all models' },
  { icon: Network, title: 'Integration Security', description: 'Encrypted connections with strict API access controls' },
]

const pipelineSteps = [
  { title: 'Input', desc: 'Data ingestion', color: 'from-white/5 to-white/10', icon: Database },
  { title: 'Process', desc: 'AI analysis', color: 'from-gold/20 to-gold/30', icon: Cpu },
  { title: 'Review', desc: 'Human oversight', color: 'from-purple/20 to-purple/30', icon: Eye },
  { title: 'Action', desc: 'System execution', color: 'from-cyan/20 to-cyan/30', icon: Workflow },
  { title: 'Learn', desc: 'Continuous improvement', color: 'from-gold/20 to-gold/30', icon: TrendingUp },
]

export default function PlatformPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const pipelineRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const governanceRef = useRef<HTMLDivElement>(null)
  const integrationsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.from('.platform-hero', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      })

      // ===== PIPELINE FLOW ANIMATION =====
      // Steps stagger in
      gsap.from('.pipeline-step', {
        scrollTrigger: {
          trigger: pipelineRef.current,
          start: 'top 80%',
        },
        x: -50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power3.out'
      })

      // Pipeline connector line animation
      ScrollTrigger.create({
        trigger: pipelineRef.current,
        start: 'top 70%',
        onEnter: () => {
          // Animate the flow line
          anime({
            targets: '.pipeline-flow-line',
            strokeDashoffset: [anime.setDashoffset, 0],
            duration: 2000,
            easing: 'easeInOutSine'
          })

          // Pulse animation through each step
          document.querySelectorAll('.pipeline-node').forEach((node, i) => {
            setTimeout(() => {
              anime({
                targets: node,
                scale: [1, 1.3, 1],
                boxShadow: [
                  '0 0 0 rgba(212, 175, 55, 0)',
                  '0 0 30px rgba(212, 175, 55, 0.5)',
                  '0 0 0 rgba(212, 175, 55, 0)'
                ],
                duration: 600,
                easing: 'easeOutQuad'
              })
            }, 300 + i * 400)
          })

          // Animate arrows between steps
          document.querySelectorAll('.pipeline-arrow').forEach((arrow, i) => {
            anime({
              targets: arrow,
              translateX: [0, 10, 0],
              opacity: [0.3, 1, 0.3],
              duration: 1000,
              delay: 500 + i * 400,
              loop: 2,
              easing: 'easeInOutSine'
            })
          })
        },
        once: true
      })

      // Features grid animation
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
        },
        y: 60,
        opacity: 0,
        scale: 0.95,
        duration: 0.7,
        stagger: 0.1,
        ease: 'back.out(1.4)'
      })

      // Governance section
      gsap.from('.governance-text', {
        scrollTrigger: {
          trigger: governanceRef.current,
          start: 'top 80%',
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      })

      gsap.from('.governance-card', {
        scrollTrigger: {
          trigger: governanceRef.current,
          start: 'top 75%',
        },
        y: 40,
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.4)'
      })

      // Integrations floating animation
      gsap.from('.integration-badge', {
        scrollTrigger: {
          trigger: integrationsRef.current,
          start: 'top 85%',
        },
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out'
      })

      // CTA section
      gsap.from('.platform-cta', {
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 85%',
        },
        y: 50,
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        ease: 'power3.out'
      })
    })

    return () => ctx.revert()
  }, [])

  // Micro-interactions
  useEffect(() => {
    if (prefersReducedMotion()) return

    // Pipeline step hover - show details
    document.querySelectorAll('.pipeline-step').forEach((step) => {
      step.addEventListener('mouseenter', () => {
        anime({
          targets: step,
          scale: 1.05,
          duration: 300,
          easing: 'easeOutQuad'
        })
        
        const icon = step.querySelector('.step-icon')
        if (icon) {
          anime({
            targets: icon,
            rotate: '1turn',
            duration: 600,
            easing: 'easeOutElastic(1, .5)'
          })
        }
      })
      
      step.addEventListener('mouseleave', () => {
        anime({
          targets: step,
          scale: 1,
          duration: 300,
          easing: 'easeOutQuad'
        })
      })
    })

    // Feature card hover with icon animation
    document.querySelectorAll('.feature-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        anime({
          targets: card,
          translateY: -8,
          boxShadow: '0 20px 40px rgba(212, 175, 55, 0.1)',
          duration: 400,
          easing: 'easeOutQuad'
        })

        const icon = card.querySelector('.feature-icon')
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
      
      card.addEventListener('mouseleave', () => {
        anime({
          targets: card,
          translateY: 0,
          boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
          duration: 400,
          easing: 'easeOutQuad'
        })
      })
    })

    // Governance card hover
    document.querySelectorAll('.governance-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        anime({
          targets: card,
          translateY: -5,
          borderColor: 'rgba(212, 175, 55, 0.3)',
          duration: 300,
          easing: 'easeOutQuad'
        })
      })
      
      card.addEventListener('mouseleave', () => {
        anime({
          targets: card,
          translateY: 0,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          duration: 300,
          easing: 'easeOutQuad'
        })
      })
    })

    // Integration badge float animation
    document.querySelectorAll('.integration-badge').forEach((badge, i) => {
      anime({
        targets: badge,
        translateY: [-3, 3],
        duration: 2000 + i * 200,
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutSine'
      })
    })

    // Button animations
    document.querySelectorAll('.btn-platform').forEach((btn) => {
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
          <div className="platform-hero max-w-3xl mx-auto text-center">
            <span className="text-gold text-sm font-medium uppercase tracking-wider">Platform</span>
            <h1 className="font-display text-5xl md:text-7xl font-bold mt-4 mb-6">
              Built for Scale,{' '}
              <span className="text-gold-gradient">Designed for Trust</span>
            </h1>
            <p className="text-xl text-white/60">
              The C.A.A.K.E. platform combines enterprise-grade security with powerful 
              AI orchestration. Move fast with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Pipeline Visualization */}
      <section ref={pipelineRef} className="section-padding bg-cosmic/30">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              From <span className="text-gold">Input</span> to <span className="text-gold">Impact</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Our pipeline orchestrates data, AI models, and human oversight into seamless automation
            </p>
          </div>

          {/* Pipeline Steps */}
          <div className="relative">
            {/* SVG Flow Line */}
            <svg 
              className="hidden md:block absolute top-1/2 left-0 right-0 h-2 -translate-y-1/2 z-0" 
              viewBox="0 0 1200 10"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <line 
                className="pipeline-flow-line"
                x1="50" 
                y1="5" 
                x2="1150" 
                y2="5" 
                stroke="url(#flowGradient)" 
                strokeWidth="2"
                strokeDasharray="1100"
                strokeDashoffset="1100"
              />
            </svg>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
              {pipelineSteps.map((step, index) => (
                <div key={step.title} className="pipeline-step relative group cursor-pointer">
                  <div className={`pipeline-node bg-gradient-to-br ${step.color} rounded-xl p-6 border border-white/10 h-full transition-all`}>
                    <div className="step-icon w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                      <step.icon className="w-6 h-6 text-gold" />
                    </div>
                    <div className="text-gold/60 text-sm mb-1">Step {index + 1}</div>
                    <div className="font-display text-xl font-bold mb-2">{step.title}</div>
                    <div className="text-white/50 text-sm">{step.desc}</div>
                  </div>
                  
                  {/* Arrow (hidden on last item and mobile) */}
                  {index < 4 && (
                    <div className="pipeline-arrow hidden md:flex absolute top-1/2 -right-2 transform -translate-y-1/2 z-10 w-8 h-8 items-center justify-center">
                      <ChevronRight className="w-6 h-6 text-gold" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Data Flow Animation Visualization */}
          <div className="mt-16 p-8 rounded-2xl bg-void/50 border border-white/10">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5">
                <Database className="w-5 h-5 text-cyan" />
                <span className="text-sm text-white/70">Raw Data</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gold/50" />
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5">
                <Cpu className="w-5 h-5 text-gold" />
                <span className="text-sm text-white/70">AI Processing</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gold/50" />
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5">
                <Eye className="w-5 h-5 text-purple" />
                <span className="text-sm text-white/70">Human Review</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gold/50" />
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gold/10 border border-gold/30">
                <TrendingUp className="w-5 h-5 text-gold" />
                <span className="text-sm font-medium text-gold">Business Impact</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section ref={featuresRef} className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-gold text-sm font-medium uppercase tracking-wider">Features</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-4">
              Platform <span className="text-gold">Capabilities</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div 
                key={feature.title}
                className="feature-card card p-8 group"
              >
                <feature.icon className={`feature-icon w-12 h-12 text-${feature.color} mb-6`} />
                <h3 className="font-display text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Governance Section */}
      <section ref={governanceRef} className="section-padding bg-cosmic/30">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="governance-text">
              <span className="text-gold text-sm font-medium uppercase tracking-wider">Governance</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-6">
                AI You Can <span className="text-gold">Trust</span>
              </h2>
              <p className="text-white/60 mb-8">
                Enterprise AI requires enterprise governance. Our platform includes 
                comprehensive controls for human oversight, auditability, and compliance.
              </p>
              <Link 
                href="/security-governance"
                className="btn btn-secondary btn-platform"
              >
                Explore Security & Governance
                <ArrowRight className="ml-2" size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {governanceFeatures.map((feature) => (
                <div 
                  key={feature.title}
                  className="governance-card card p-6"
                  style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <feature.icon className="w-8 h-8 text-gold mb-4" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-white/50 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section ref={integrationsRef} className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-gold text-sm font-medium uppercase tracking-wider">Integrations</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-4">
              Works With Your <span className="text-gold">Stack</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Pre-built connectors for the tools you already use
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {['Salesforce', 'HubSpot', 'Slack', 'Zapier', 'OpenAI', 'Anthropic', 'AWS', 'Azure'].map((tool) => (
              <div 
                key={tool}
                className="integration-badge px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white/60 font-medium hover:bg-white/10 hover:border-gold/30 transition-colors cursor-pointer"
              >
                {tool}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="section-padding">
        <div className="container-custom">
          <div className="platform-cta card p-12 text-center bg-gradient-to-br from-gold/10 to-purple/10">
            <Cpu className="w-16 h-16 text-gold mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              See the Platform in Action
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto mb-8">
              Get a personalized demo of the C.A.A.K.E. platform and see how it can 
              transform your operations.
            </p>
            <a href="mailto:mastrianni@caake.org" className="btn btn-primary btn-platform">
              Request a Demo
              <ArrowRight className="ml-2" size={16} />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
