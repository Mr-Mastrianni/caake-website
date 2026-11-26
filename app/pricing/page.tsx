import { Check } from 'lucide-react'
import { PACKAGES } from '@/lib/site'
import { CtaBand, PageHero, PrimaryCta } from '@/components/marketing'
import { pageMetadata } from '@/components/metadata'
import { cn } from '@/lib/utils'

export const metadata = pageMetadata({
  title: 'Pricing',
  description:
    'Free Lead Leak Audit. Launch Sites from $2,500, Lead Follow-Up Systems from $1,500, custom apps and AI builds from $7,500. Fixed prices agreed before work starts.',
  path: '/pricing',
})

const faqs = [
  {
    q: 'Why “from”?',
    a: 'Prices depend on how many pages, integrations or users you need. The audit ends with one fixed number, in writing, before any work starts. It doesn’t change unless you change the scope.',
  },
  {
    q: 'Do I have to sign a long contract?',
    a: 'No. Projects are one-time and fixed price. Monthly plans can be cancelled with 30 days’ notice.',
  },
  {
    q: 'Do you work with healthcare organizations?',
    a: 'Yes. Much of our work is in home care, clinics, patient education and academic healthcare, and we design with privacy in mind. Tell us on the audit call what data is involved and we’ll be specific about how it’s handled.',
  },
  {
    q: 'What if I already have a website?',
    a: 'Great. Often the fastest win is fixing follow-up, not rebuilding the site. The audit will tell you which.',
  },
]

export default function PricingPage() {
  return (
    <div className="overflow-hidden">
      <PageHero
        eyebrow="Pricing"
        title={
          <>
            Clear prices. <span className="text-gold-gradient">Fixed before we start.</span>
          </>
        }
        lede="Start with the free audit. If you want us to build the fix, you’ll get one fixed price in writing first."
      />

      <section className="section-padding pt-0">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {PACKAGES.map((p) => (
              <div
                key={p.slug}
                className={cn('card p-6 md:p-8 flex flex-col', p.featured && 'border-gold/50 shadow-lg shadow-gold/10')}
              >
                {p.featured && <span className="text-xs font-medium text-gold mb-2">Most popular first project</span>}
                <h2 className="font-display text-2xl font-bold">{p.name}</h2>
                <p className="mt-3 text-3xl font-bold text-gold">{p.price}</p>
                {p.priceNote && <p className="text-sm text-white/55 mt-1">{p.priceNote}</p>}
                <p className="text-sm text-white/65 mt-4 leading-relaxed">{p.bestFor}</p>
                <ul className="mt-6 space-y-3 flex-1">
                  {p.includes.map((i) => (
                    <li key={i} className="flex gap-2 text-sm text-white/80 leading-relaxed">
                      <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
                      {i}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-white/45 mt-6">Timeline: {p.timeline}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <PrimaryCta className="text-lg px-8 py-4 rounded-full" />
          </div>
        </div>
      </section>

      <section className="section-padding bg-cosmic/30 border-y border-white/5">
        <div className="container-custom max-w-3xl">
          <h2 className="font-display text-3xl font-bold mb-8">Questions</h2>
          <dl className="space-y-8">
            {faqs.map((f) => (
              <div key={f.q}>
                <dt className="font-semibold text-lg mb-2">{f.q}</dt>
                <dd className="text-white/70 leading-relaxed">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CtaBand />
    </div>
  )
}
