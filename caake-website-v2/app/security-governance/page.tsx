'use client'

import Link from 'next/link'
import { Shield, Lock, Eye, FileCheck, Server, Users, Clock, CheckCircle, ArrowRight } from 'lucide-react'

const securityPillars = [
  {
    icon: Server,
    title: 'Infrastructure Security',
    description: 'SOC 2 Type II certified cloud infrastructure with 99.99% uptime SLA. Multi-region redundancy and automated failover.',
    features: ['End-to-end encryption', 'Multi-region backup', 'DDoS protection', 'Network isolation']
  },
  {
    icon: Lock,
    title: 'Data Protection',
    description: 'Your data is encrypted at rest and in transit. We never use client data to train models without explicit consent.',
    features: ['AES-256 encryption', 'TLS 1.3 in transit', 'PII detection & masking', 'Data residency options']
  },
  {
    icon: Users,
    title: 'Access Control',
    description: 'Role-based access control with SSO integration. Complete audit trail of every action.',
    features: ['SSO/SAML integration', 'Role-based permissions', 'MFA enforcement', 'Session management']
  },
  {
    icon: Eye,
    title: 'AI Governance',
    description: 'Human oversight built into every critical decision. Model versioning, testing, and approval workflows.',
    features: ['Human-in-the-loop', 'Model versioning', 'Output validation', 'Bias monitoring']
  }
]

const complianceItems = [
  { name: 'SOC 2 Type II', status: 'Certified', description: 'Annual audit for security, availability, and confidentiality' },
  { name: 'GDPR', status: 'Compliant', description: 'Full data protection and privacy compliance' },
  { name: 'CCPA', status: 'Compliant', description: 'California Consumer Privacy Act compliance' },
  { name: 'HIPAA', status: 'Available', description: 'Business Associate Agreements for healthcare' },
  { name: 'ISO 27001', status: 'In Progress', description: 'Information security management certification' },
]

export default function SecurityGovernancePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="section-padding pt-32">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-gold text-sm font-medium uppercase tracking-wider">Security & Governance</span>
            <h1 className="font-display text-5xl md:text-7xl font-bold mt-4 mb-6">
              Enterprise Security{' '}
              <span className="text-gold-gradient">by Design</span>
            </h1>
            <p className="text-xl text-white/60">
              Move fast with AI, safely. Our platform is built with enterprise-grade security 
              and governance from the ground up.
            </p>
          </div>
        </div>
      </section>

      {/* Security Pillars */}
      <section className="section-padding bg-cosmic/30">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {securityPillars.map((pillar) => (
              <div key={pillar.title} className="card p-8">
                <pillar.icon className="w-12 h-12 text-gold mb-6" />
                <h2 className="font-display text-2xl font-bold mb-3">{pillar.title}</h2>
                <p className="text-white/60 mb-6">{pillar.description}</p>
                <ul className="space-y-2">
                  {pillar.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-white/70 text-sm">
                      <CheckCircle className="w-4 h-4 text-gold flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-gold text-sm font-medium uppercase tracking-wider">Compliance</span>
              <h2 className="font-display text-4xl font-bold mt-2 mb-6">
                Certifications & <span className="text-gold">Standards</span>
              </h2>
              <p className="text-white/60 mb-8">
                We maintain rigorous compliance standards and undergo regular third-party audits. 
                Our commitment to security is not just a feature—it&apos;s our foundation.
              </p>
              <Link href="/ai-use-policy" className="btn btn-secondary">
                Read Our AI Use Policy
                <ArrowRight className="ml-2" size={16} />
              </Link>
            </div>

            <div className="space-y-4">
              {complianceItems.map((item) => (
                <div 
                  key={item.name}
                  className="flex items-center justify-between p-4 rounded-xl bg-cosmic border border-white/10"
                >
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-white/50 text-sm">{item.description}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.status === 'Certified' || item.status === 'Compliant'
                      ? 'bg-green-500/20 text-green-400'
                      : item.status === 'In Progress'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Governance */}
      <section className="section-padding bg-cosmic/30">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-gold text-sm font-medium uppercase tracking-wider">AI Ethics</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-4">
              Responsible <span className="text-gold">AI</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              We believe AI should augment human capabilities, not replace human judgment. 
              Our governance framework ensures ethical, transparent AI deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Human Oversight',
                description: 'Critical decisions always include human review. AI assists, humans decide.'
              },
              {
                icon: FileCheck,
                title: 'Transparency',
                description: 'Clear explanations of how AI makes decisions. No black boxes in critical systems.'
              },
              {
                icon: Clock,
                title: 'Continuous Monitoring',
                description: '24/7 monitoring for model drift, bias, and performance degradation.'
              }
            ].map((item) => (
              <div key={item.title} className="text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-white/60">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security CTA */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="card p-12 text-center bg-gradient-to-br from-gold/10 to-purple/10">
            <Shield className="w-16 h-16 text-gold mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Have Security Questions?
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto mb-8">
              Our security team is happy to discuss your specific requirements, 
              review our security documentation, or complete vendor assessments.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="btn btn-primary">
                Contact Security Team
                <ArrowRight className="ml-2" size={16} />
              </Link>
              <a 
                href="mailto:security@caake.org" 
                className="btn btn-ghost"
              >
                security@caake.org
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
