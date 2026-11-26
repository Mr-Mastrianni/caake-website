import { CASE_STUDIES, SMALL_BUSINESS_SITES } from '@/lib/site'
import { CaseCard, CtaBand, PageHero } from '@/components/marketing'
import { pageMetadata } from '@/components/metadata'

export const metadata = pageMetadata({
  title: 'Our Work',
  description:
    'Case studies from C.A.A.K.E.: Indiana University AI training, an EVV caregiver app for home care, Living Oncology, Blessed Recovery Agency and more.',
  path: '/work',
})

export default function WorkPage() {
  return (
    <div className="overflow-hidden">
      <PageHero
        eyebrow="Our work"
        title={
          <>
            Proof, <span className="text-gold-gradient">labeled honestly</span>
          </>
        }
        lede="Every project shows its real status. Where a deployment is private, we’ll walk you through it on a call instead of inventing numbers."
      />

      <section className="section-padding pt-0">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CASE_STUDIES.map((c) => (
              <CaseCard key={c.slug} study={c} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-cosmic/30 border-y border-white/5">
        <div className="container-custom">
          <h2 className="font-display text-3xl font-bold mb-3">Small-business websites</h2>
          <p className="text-white/65 mb-8 max-w-2xl">
            Brand and booking sites for owner-run businesses. Open any of them on your phone; that’s how their customers
            see them.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SMALL_BUSINESS_SITES.map((s) => (
              <li key={s.name}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card p-5 block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <span className="text-xs text-emerald-300">Live</span>
                  <h3 className="font-display text-lg font-bold mt-1">{s.name} ↗</h3>
                  <p className="text-white/60 text-sm mt-1">{s.what}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <h2 className="font-display text-2xl font-bold mb-3">In development</h2>
          <p className="text-white/65 leading-relaxed">
            <span className="text-white">CAAKE CareFlow</span> is our next home-care product, building on the EVV
            caregiver app. It isn’t available yet; if you run a home care agency and want early access, mention it when
            you book your audit.
          </p>
        </div>
      </section>

      <CtaBand title="Want results like these for your business?" />
    </div>
  )
}
