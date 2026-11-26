import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AUDIT_DELIVERABLE, CTA, SITE, type CaseStatus, type CaseStudy } from '@/lib/site'
import { cn } from '@/lib/utils'

export function PrimaryCta({ className, label = CTA.label }: { className?: string; label?: string }) {
  return (
    <Link href={CTA.href} className={cn('btn btn-primary gap-2', className)}>
      {label}
      <ArrowRight size={18} aria-hidden="true" />
    </Link>
  )
}

export function PageHero({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string
  title: React.ReactNode
  lede?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <section className="section-padding pt-24 md:pt-32 pb-12 md:pb-16">
      <div className="container-custom max-w-4xl text-center">
        <p className="text-gold text-sm font-medium uppercase tracking-wider">{eyebrow}</p>
        <h1 className="font-display text-4xl md:text-6xl font-bold mt-4 mb-6 leading-tight">{title}</h1>
        {lede && <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">{lede}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  )
}

const statusStyles: Record<CaseStatus, string> = {
  Live: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  'Ongoing engagement': 'bg-gold/10 text-gold border-gold/30',
  'Private deployment': 'bg-cyan/10 text-cyan-light border-cyan/30',
  'Internal tool': 'bg-purple/10 text-purple-light border-purple/30',
  'In development': 'bg-white/5 text-white/70 border-white/20',
}

export function StatusBadge({ status }: { status: CaseStatus }) {
  return (
    <span className={cn('inline-block text-xs font-medium px-2.5 py-1 rounded-full border', statusStyles[status])}>
      {status}
    </span>
  )
}

export function CaseCard({ study }: { study: CaseStudy }) {
  return (
    <Link
      href={`/work/${study.slug}`}
      className="card p-6 md:p-8 flex flex-col h-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <StatusBadge status={study.status} />
        <span className="text-xs text-white/50">{study.industry}</span>
      </div>
      <p className="text-gold text-sm font-medium mb-1">{study.client}</p>
      <h3 className="font-display text-xl md:text-2xl font-bold mb-3">{study.title}</h3>
      <p className="text-white/65 text-sm leading-relaxed flex-1">{study.summary}</p>
      <span className="mt-6 text-sm text-gold inline-flex items-center gap-1">
        Read the case study
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </Link>
  )
}

export function CtaBand({
  title = 'Find out where you’re losing customers',
  body = AUDIT_DELIVERABLE,
}: {
  title?: string
  body?: string
}) {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gold/5" aria-hidden="true" />
      <div className="container-custom relative max-w-3xl text-center">
        <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">{title}</h2>
        <p className="text-lg text-white/70 mb-8 leading-relaxed">{body}</p>
        <PrimaryCta className="text-lg px-8 py-4 rounded-full" />
        <p className="mt-6 text-sm text-white/50">
          Rather talk now? Call{' '}
          <a href={SITE.phoneHref} className="text-gold hover:underline">
            {SITE.phone}
          </a>{' '}
          or email{' '}
          <a href={`mailto:${SITE.email}`} className="text-gold hover:underline">
            {SITE.email}
          </a>
          .
        </p>
      </div>
    </section>
  )
}
