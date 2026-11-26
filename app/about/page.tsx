import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SITE } from '@/lib/site'
import { CtaBand, PageHero } from '@/components/marketing'
import { pageMetadata } from '@/components/metadata'

export const metadata = pageMetadata({
  title: 'About',
  description:
    'C.A.A.K.E. is a Fishers, Indiana team, founded in 2025, building websites, apps and AI for small businesses and healthcare organizations. Approved vendor to Indiana University.',
  path: '/about',
})

const timeline = [
  { year: '2025', text: 'Founded in Fishers, Indiana to make AI and modern software practical for small businesses.' },
  { year: '2025', text: 'First automation and software projects for healthcare and finance clients.' },
  { year: '2025', text: 'Launched the C.A.A.K.E. Homecare EVV caregiver platform.' },
  { year: '2026', text: 'Transitioned from LLC to C.A.A.K.E. Corporation. CareFlow, our next home-care product, is in development.' },
]

const principles = [
  {
    title: 'Plain language, fixed prices',
    body: 'You’ll always know what we’re building, why, and what it costs before we start.',
  },
  {
    title: 'Honest proof',
    body: 'We label work as live, private or in progress, and we don’t publish numbers we can’t back up.',
  },
  {
    title: 'A person stays in charge',
    body: 'Our AI tools draft and sort. People approve anything that goes to your customers.',
  },
  {
    title: 'Built to be handed over',
    body: 'You own your site and your data, with documentation your next hire can follow.',
  },
]

export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      <PageHero
        eyebrow="About"
        title={
          <>
            A build team that <span className="text-gold-gradient">ships</span>
          </>
        }
        lede={`C.A.A.K.E. is a small team in ${SITE.city}, ${SITE.regionName}. We design and build websites, booking and follow-up systems, custom apps and AI tools, and we teach teams to use AI well.`}
      />

      <section className="section-padding pt-0">
        <div className="container-custom max-w-3xl space-y-6 text-white/75 leading-relaxed text-lg">
          <p>
            Most agencies do one thing: a website, or ads, or “AI consulting.” Small businesses end up juggling three
            vendors who don’t talk to each other. We built C.A.A.K.E. so one team could handle the whole path a
            customer takes, from the first search to the booked visit to the follow-up.
          </p>
          <p>
            Our work spans owner-run businesses and regulated healthcare: brand and booking sites for local
            businesses, an offline-first EVV caregiver app for home care agencies, a patient education platform for
            brain tumor patients, and AI training as an approved vendor to Indiana University. That range is the point.
            The habits that make healthcare software dependable make a small-business website dependable too.
          </p>
          <p>
            The team is led by founder <span className="text-white">Corey Mastrianni</span>, a software engineer who
            builds healthcare platforms and AI automation.{' '}
            <a href={SITE.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
              His engineering portfolio
            </a>{' '}
            shows the wider range of what we can build, from 3D worlds to language-learning apps.
          </p>
          <p className="text-base text-white/55">
            C.A.A.K.E. stands for Cost Avoidance Automation Kingz Enterprise. In plain terms: we help you stop losing
            money to work a system should be doing.
          </p>
        </div>
      </section>

      <section className="section-padding bg-cosmic/30 border-y border-white/5">
        <div className="container-custom max-w-5xl">
          <h2 className="font-display text-3xl font-bold mb-8">How we work</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {principles.map((p) => (
              <div key={p.title} className="card p-6">
                <h3 className="font-display text-xl font-bold mb-2">{p.title}</h3>
                <p className="text-white/65 text-sm leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <h2 className="font-display text-3xl font-bold mb-8">Timeline</h2>
          <ol className="border-l border-gold/30 space-y-8 pl-6">
            {timeline.map((t, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-gold" aria-hidden="true" />
                <p className="text-gold font-display font-bold">{t.year}</p>
                <p className="text-white/75">{t.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10">
            <Link href="/work" className="text-gold inline-flex items-center gap-1 font-medium">
              See the work <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>

      <CtaBand />
    </div>
  )
}
