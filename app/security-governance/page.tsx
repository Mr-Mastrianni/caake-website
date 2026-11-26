import Link from 'next/link'
import { Lock, Eye, Users, FileCheck, ArrowRight } from 'lucide-react'
import { SITE } from '@/lib/site'
import { CtaBand, PageHero } from '@/components/marketing'
import { pageMetadata } from '@/components/metadata'

export const metadata = pageMetadata({
  title: 'How We Handle Your Data',
  description:
    'How C.A.A.K.E. handles client and customer data: encryption, limited access, privacy-conscious design for healthcare work, and human review of AI output.',
  path: '/security-governance',
})

const practices = [
  {
    icon: Lock,
    title: 'Encryption and reputable hosting',
    body: 'We build on established cloud providers, use HTTPS everywhere, and encrypt sensitive data at rest where the project stores it.',
  },
  {
    icon: Users,
    title: 'Least access',
    body: 'Only the people working on your project get access to your systems, and you can see and remove that access at any time.',
  },
  {
    icon: Eye,
    title: 'People review AI output',
    body: 'Our AI tools draft, sort and summarize. A person approves anything sent to your customers or used to make a decision about them.',
  },
  {
    icon: FileCheck,
    title: 'Privacy-conscious healthcare work',
    body: 'For projects involving patient or client health information, we map what data is collected, where it lives and who can see it before we build, and design to the obligations you tell us apply (for example HIPAA).',
  },
]

export default function SecurityGovernancePage() {
  return (
    <div className="overflow-hidden">
      <PageHero
        eyebrow="Data & security"
        title={
          <>
            How we handle <span className="text-gold-gradient">your data</span>
          </>
        }
        lede="Plain answers about what we do. We don’t claim certifications we don’t hold, so ask us anything specific your organization needs."
      />

      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {practices.map((p) => (
            <div key={p.title} className="card p-8">
              <p.icon className="w-10 h-10 text-gold mb-4" aria-hidden="true" />
              <h2 className="font-display text-2xl font-bold mb-3">{p.title}</h2>
              <p className="text-white/70 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding bg-cosmic/30 border-y border-white/5">
        <div className="container-custom max-w-3xl">
          <h2 className="font-display text-3xl font-bold mb-4">Certifications</h2>
          <p className="text-white/70 leading-relaxed mb-4">
            C.A.A.K.E. does not currently hold SOC 2, ISO 27001 or similar third-party certifications. The hosting
            providers we build on maintain their own certifications, and we can point you to their reports.
          </p>
          <p className="text-white/70 leading-relaxed mb-8">
            If your organization has a security questionnaire or vendor review, send it to{' '}
            <a href={`mailto:${SITE.email}`} className="text-gold hover:underline">
              {SITE.email}
            </a>{' '}
            and we’ll answer it in writing.
          </p>
          <Link href="/ai-use-policy" className="btn btn-secondary gap-2">
            Read our AI Use Policy <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <CtaBand />
    </div>
  )
}
