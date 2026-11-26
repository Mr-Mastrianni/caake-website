import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SERVICES } from '@/lib/site'
import { CtaBand, PageHero, PrimaryCta } from '@/components/marketing'
import { pageMetadata } from '@/components/metadata'

export const metadata = pageMetadata({
  title: 'Services',
  description:
    'Websites that book customers, lead follow-up and missed-call text-back, custom apps and portals, AI assistants, AI staff training and community platforms.',
  path: '/services',
})

export default function ServicesPage() {
  return (
    <div className="overflow-hidden">
      <PageHero
        eyebrow="Services"
        title={
          <>
            What we can build <span className="text-gold-gradient">for you</span>
          </>
        }
        lede="Plain-language versions of what we do. Not sure which one you need? That’s what the free audit is for."
      >
        <PrimaryCta />
      </PageHero>

      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl space-y-6">
          {SERVICES.map((s, i) => (
            <article id={s.id} key={s.id} className="card p-6 md:p-10 scroll-mt-28 grid md:grid-cols-[1fr_1.2fr] gap-6 md:gap-10">
              <div>
                <span className="text-sm text-gold/60 font-display">0{i + 1}</span>
                <h2 className="font-display text-2xl md:text-3xl font-bold mt-1 mb-3">{s.title}</h2>
                <p className="text-white/70 leading-relaxed">{s.plain}</p>
              </div>
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-white/90 mb-1">Best for</h3>
                  <p className="text-white/65 text-sm leading-relaxed">{s.bestFor}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white/90 mb-2">Where we’ve done it</h3>
                  <ul className="flex flex-wrap gap-2">
                    {s.examples.map((e) => (
                      <li key={e} className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/75">
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}

          <div className="card p-6 md:p-10 border-dashed">
            <h2 className="font-display text-2xl font-bold mb-3">Something nobody else will build?</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Our team has also built 3D worlds, language-learning apps, research dashboards and multi-agent AI systems.
              If your idea doesn’t fit a box above, bring it to the audit anyway.
            </p>
            <Link href="/work" className="text-gold inline-flex items-center gap-1 text-sm font-medium">
              See our work <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </div>
  )
}
