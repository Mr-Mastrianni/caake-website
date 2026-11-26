import Link from 'next/link'
import { ArrowRight, Search, Hammer, Rocket, Globe, MessageSquareReply, AppWindow, Bot, GraduationCap, Users } from 'lucide-react'
import { CASE_STUDIES, PACKAGES, SERVICES, SITE, SMALL_BUSINESS_SITES } from '@/lib/site'
import { CaseCard, CtaBand, PrimaryCta } from '@/components/marketing'

const serviceIcons = {
  websites: Globe,
  'follow-up': MessageSquareReply,
  apps: AppWindow,
  ai: Bot,
  training: GraduationCap,
  community: Users,
} as const

const steps = [
  {
    icon: Search,
    title: 'Audit',
    body: 'A free 15-minute call and a short teardown of where your website, booking and follow-up lose people.',
  },
  {
    icon: Hammer,
    title: 'Build',
    body: 'We fix the biggest leak first, at a fixed price agreed before we start.',
  },
  {
    icon: Rocket,
    title: 'Launch',
    body: 'It goes live, we train your team, and we stay on call for fixes.',
  },
]

const leaks = [
  'Your site is slow or hard to use on a phone',
  'Calls after 5pm go to voicemail and never get returned',
  'Web inquiries wait a day or more for a reply',
  'Booking takes more than two taps',
  'Patients or clients don’t show up and nobody reminds them',
  'Staff retype the same information into three systems',
]

const featured = ['evv-homecare-platform', 'indiana-university', 'living-oncology', 'blessed-recovery-agency']

export default function HomePage() {
  const featuredStudies = featured
    .map((slug) => CASE_STUDIES.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
  const startPrice = PACKAGES.find((p) => p.slug === 'launch-site')?.price

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative flex items-center overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-midnight" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/10 via-midnight to-midnight opacity-60" />
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-purple/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-gold/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 container-custom">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            <img src="/logocaake.png" alt="C.A.A.K.E. logo" className="w-28 md:w-36 h-auto mb-8 drop-shadow-2xl" />
            <p className="text-gold text-sm font-medium uppercase tracking-wider mb-4">
              Websites · Booking & follow-up · Custom apps · AI
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
              We find where you’re losing customers.{' '}
              <span className="text-gold-gradient">Then we build the fix.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl leading-relaxed">
              C.A.A.K.E. is a {SITE.city}, {SITE.regionName} team that builds the websites, booking and follow-up
              systems, custom apps and AI tools that small businesses and healthcare organizations run on.
            </p>
            <PrimaryCta className="text-lg px-8 py-4 rounded-full shadow-lg shadow-gold/20" />
            <p className="mt-4 text-sm text-white/50">
              Free, 15 minutes, no obligation. Projects from {startPrice}, fixed price.
            </p>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="section-padding bg-cosmic/30 border-y border-white/5">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Sound familiar?</h2>
            <p className="text-white/70 mb-6 leading-relaxed">
              Most businesses don’t need “more AI.” They need the customers who already found them to stop slipping
              away. These are the leaks we see most:
            </p>
            <PrimaryCta label="Check my business for leaks" />
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {leaks.map((l) => (
              <li key={l} className="card p-4 text-sm text-white/80 leading-relaxed">
                {l}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What we build */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">One team, from your website to your back office</h2>
            <p className="text-white/65">
              You don’t need a web designer, an automation freelancer and a software agency. We’ve shipped all of it,
              for local businesses and for academic healthcare.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s) => {
              const Icon = serviceIcons[s.id as keyof typeof serviceIcons] ?? Globe
              return (
                <Link key={s.id} href={`/services#${s.id}`} className="card p-6 group">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-gold" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-white/65 text-sm leading-relaxed mb-4">{s.plain}</p>
                  <p className="text-xs text-white/45">Built for: {s.examples.join(' · ')}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="section-padding bg-cosmic/30 border-y border-white/5">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Work we can show you</h2>
              <p className="text-white/65">
                Real projects, labeled honestly: what’s live, what’s a private deployment, and what’s still in progress.
              </p>
            </div>
            <Link href="/work" className="text-gold inline-flex items-center gap-1 text-sm font-medium">
              See all work <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredStudies.map((c) => (
              <CaseCard key={c.slug} study={c} />
            ))}
          </div>
          <div className="mt-10">
            <p className="text-sm text-white/50 mb-3">Recent small-business websites</p>
            <ul className="flex flex-wrap gap-3">
              {SMALL_BUSINESS_SITES.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 rounded-full border border-white/10 text-sm text-white/75 hover:border-gold/40 hover:text-white"
                  >
                    {s.name} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-white/60">Simple, fixed-price, and you see the plan before you pay for anything.</p>
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {steps.map((s, i) => (
              <li key={s.title} className="card p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl font-display font-bold text-gold/30">0{i + 1}</span>
                  <s.icon className="w-6 h-6 text-gold" aria-hidden="true" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">{s.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{s.body}</p>
              </li>
            ))}
          </ol>
          <p className="text-center mt-10">
            <Link href="/pricing" className="text-gold inline-flex items-center gap-1 font-medium">
              See packages and prices <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>

      <CtaBand />
    </div>
  )
}
