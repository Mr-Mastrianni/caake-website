'use client'

import Link from 'next/link'
import { ArrowRight, Target, Lightbulb, Shield, Award } from 'lucide-react'

const values = [
  {
    icon: Target,
    title: 'Outcome Obsessed',
    description: 'We measure success by your results, not our activity. Every project has clear KPIs.'
  },
  {
    icon: Lightbulb,
    title: 'Pragmatic Innovation',
    description: 'We use the right tool for the job, not the flashiest. Practical AI that works.'
  },
  {
    icon: Shield,
    title: 'Trust First',
    description: 'Security and governance arent afterthoughts. Theyre built into everything we do.'
  },
  {
    icon: Award,
    title: 'Kingz Mentality',
    description: 'We take ownership. We deliver excellence. We treat your business like our own.'
  }
]

const milestones = [
  { year: '2025', title: 'The Beginning', description: 'C.A.A.K.E. founded with a mission to make AI accessible to small business owners.' },
  { year: '2025', title: 'First Clients', description: 'Delivered first automation solutions for finance and healthcare clients.' },
  { year: '2025', title: 'C.A.A.K.E. Homecare', description: 'Launched the C.A.A.K.E. Homecare platform.' },
  { year: '2026', title: 'Corporation', description: 'Transitioned from LLC to C.A.A.K.E. Corporation to serve enterprise clients.' },
]

export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="section-padding pt-32">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-gold text-sm font-medium uppercase tracking-wider">About Us</span>
            <h1 className="font-display text-5xl md:text-7xl font-bold mt-4 mb-6">
              The Kingz of{' '}
              <span className="text-gold-gradient">Automation</span>
            </h1>
            <p className="text-xl text-white/60">
              We&apos;re a team of AI strategists, engineers, and operators dedicated to making
              enterprise automation feel easy as C.A.A.K.E.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-cosmic/30">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-gold text-sm font-medium uppercase tracking-wider">Our Story</span>
              <h2 className="font-display text-4xl font-bold mt-2 mb-6">
                Why We Exist
              </h2>
              <div className="space-y-4 text-white/70">
                <p>
                  C.A.A.K.E. was founded on a simple belief: AI should make business easier, not more complicated.
                  Too many organizations struggle with vendor lock-in, technical debt, and solutions that
                  promise the world but deliver little.
                </p>
                <p>
                  We take a different approach. We start with your business outcomes, then build the
                  technology to achieve them. No fluff. No unnecessary complexity. Just practical
                  automation that works.
                </p>
                <p>
                  Our name reflects our promise. C.A.A.K.E. stands for Cost Avoidance Automation Kingz
                  Enterprise—not just because it spells something memorable, but because we believe in
                  royalty-level service for every client.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-gold/20 to-purple/20 p-8 flex items-center justify-center">
                <div className="text-center w-full h-full flex items-center justify-center">
                  <img
                    src="/logocaake.png"
                    alt="C.A.A.K.E. Logo"
                    className="max-w-[80%] max-h-[80%] object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-gold text-sm font-medium uppercase tracking-wider">Values</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-4">
              How We <span className="text-gold">Work</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="card p-8 hover:border-gold/30 transition-colors"
              >
                <value.icon className="w-12 h-12 text-gold mb-6" />
                <h3 className="font-display text-2xl font-bold mb-3">{value.title}</h3>
                <p className="text-white/60">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-cosmic/30">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-gold text-sm font-medium uppercase tracking-wider">Journey</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-4">
              Our <span className="text-gold">Story</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className="flex gap-8 mb-12 last:mb-0">
                <div className="flex-shrink-0 w-20 text-right">
                  <span className="font-display text-2xl font-bold text-gold">{milestone.year}</span>
                </div>
                <div className="flex-shrink-0 relative">
                  <div className="w-4 h-4 rounded-full bg-gold" />
                  {index < milestones.length - 1 && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-24 bg-gold/30" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-display text-xl font-bold mb-2">{milestone.title}</h3>
                  <p className="text-white/60">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Want to Join the Kingdom?
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto mb-8">
              We&apos;re always looking for exceptional talent. If you&apos;re passionate about
              AI and automation, we&apos;d love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="mailto:mastrianni@caake.org" className="btn btn-primary">
                Email Us
                <ArrowRight className="ml-2" size={16} />
              </a>
              <Link href="/contact" className="btn btn-ghost">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
