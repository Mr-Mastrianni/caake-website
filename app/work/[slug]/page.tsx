import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Check } from 'lucide-react'
import { CASE_STUDIES } from '@/lib/site'
import { CtaBand, StatusBadge } from '@/components/marketing'
import { pageMetadata, BreadcrumbSchema } from '@/components/metadata'

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const c = CASE_STUDIES.find((s) => s.slug === params.slug)
  if (!c) return {}
  return pageMetadata({ title: `${c.client}: ${c.title}`, description: c.summary, path: `/work/${c.slug}` })
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const c = CASE_STUDIES.find((s) => s.slug === params.slug)
  if (!c) notFound()

  const others = CASE_STUDIES.filter((s) => s.slug !== c.slug).slice(0, 3)

  return (
    <div className="overflow-hidden">
      {BreadcrumbSchema([
        { name: 'Work', url: 'https://www.caake.org/work' },
        { name: c.client, url: `https://www.caake.org/work/${c.slug}` },
      ])}
      <article className="section-padding pt-24 md:pt-32">
        <div className="container-custom max-w-3xl">
          <Link href="/work" className="text-sm text-white/60 hover:text-gold inline-flex items-center gap-1 mb-8">
            <ArrowLeft size={14} aria-hidden="true" /> All work
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <StatusBadge status={c.status} />
            <span className="text-sm text-white/50">{c.industry}</span>
          </div>
          <p className="text-gold font-medium mb-2">{c.client}</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">{c.title}</h1>
          <p className="text-lg text-white/70 leading-relaxed mb-10">{c.summary}</p>

          {c.url && (
            <a
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary mb-12"
            >
              {c.urlLabel ?? 'Visit'} ↗
            </a>
          )}

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold mb-3">The problem</h2>
            <p className="text-white/75 leading-relaxed">{c.problem}</p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold mb-3">What we built</h2>
            <ul className="space-y-3">
              {c.built.map((b) => (
                <li key={b} className="flex gap-3 text-white/75 leading-relaxed">
                  <Check className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold mb-3">Result</h2>
            <ul className="space-y-3">
              {c.result.map((r) => (
                <li key={r} className="flex gap-3 text-white/75 leading-relaxed">
                  <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
            {c.note && <p className="mt-6 text-sm text-white/55 border-l-2 border-gold/40 pl-4">{c.note}</p>}
          </section>

          <p className="text-sm text-white/45">Services: {c.services.join(' · ')}</p>
        </div>
      </article>

      <section className="section-padding bg-cosmic/30 border-y border-white/5">
        <div className="container-custom">
          <h2 className="font-display text-2xl font-bold mb-6">More work</h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/work/${o.slug}`} className="card p-5 block h-full">
                  <StatusBadge status={o.status} />
                  <p className="text-gold text-sm mt-3">{o.client}</p>
                  <h3 className="font-display text-lg font-bold mt-1">{o.title}</h3>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </div>
  )
}
