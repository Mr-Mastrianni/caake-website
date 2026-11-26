// Single source of truth for the public marketing site: contact details, the offer,
// pricing and proof. Change a price or a case study here and every page follows.

export const SITE = {
  name: 'C.A.A.K.E.',
  legalName: 'C.A.A.K.E. Corporation',
  url: 'https://www.caake.org',
  email: 'mastrianni@caake.org',
  phone: '480-364-1164',
  phoneHref: 'tel:+14803641164',
  city: 'Fishers',
  region: 'IN',
  regionName: 'Indiana',
  founded: '2025',
  portfolioUrl: 'https://orb-genesis-portfolio.vercel.app/',
  // Optional: set NEXT_PUBLIC_CALENDAR_URL (Cal.com / Calendly) in Vercel to let visitors
  // pick a time right after submitting the audit form.
  calendarUrl: process.env.NEXT_PUBLIC_CALENDAR_URL || '',
}

export const CTA = {
  label: 'Book a free Lead Leak Audit',
  short: 'Free Lead Leak Audit',
  href: '/book-call',
  callLength: '15-minute',
}

export const AUDIT_DELIVERABLE =
  'A 15-minute call, then a short written teardown (or Loom video) within 2 business days showing where your website, booking and follow-up lose customers, plus a fixed price to fix the biggest leak.'

export type Package = {
  slug: string
  name: string
  price: string
  priceNote?: string
  bestFor: string
  includes: string[]
  timeline: string
  featured?: boolean
}

export const PACKAGES: Package[] = [
  {
    slug: 'audit',
    name: 'Lead Leak Audit',
    price: 'Free',
    bestFor: 'Any business that gets inquiries but not enough booked customers.',
    includes: [
      '15-minute call about how customers find and book you',
      'Review of your website on a phone, your booking path and after-hours follow-up',
      'Written teardown or Loom within 2 business days',
      'A fixed price to fix the biggest leak, yours to keep either way',
    ],
    timeline: '2 business days',
  },
  {
    slug: 'launch-site',
    name: 'Launch Site',
    price: 'From $2,500',
    bestFor: 'A new or outdated website that should turn visitors into calls and bookings.',
    includes: [
      'Up to 5 pages, written and designed for phones first',
      'Booking or contact form wired to your inbox and calendar',
      'Google Business Profile, basic local SEO and analytics set up',
      'Fast hosting, SSL and 30 days of fixes after launch',
    ],
    timeline: 'About 3 weeks',
    featured: true,
  },
  {
    slug: 'follow-up-system',
    name: 'Lead Follow-Up System',
    price: 'From $1,500',
    priceNote: '+ $150/mo to run and maintain',
    bestFor: 'Businesses losing leads to slow replies, missed calls or no-shows.',
    includes: [
      'Instant, personal replies to web inquiries (reviewed by you before sending, or automatic)',
      'Missed-call text-back and appointment reminders',
      'Review requests after each visit',
      'One simple dashboard of every lead and where it stands',
    ],
    timeline: '2–3 weeks',
  },
  {
    slug: 'custom-build',
    name: 'Custom App or AI Build',
    price: 'From $7,500',
    priceNote: 'Fixed price, scoped in the audit',
    bestFor: 'Portals, field apps, internal tools, AI assistants and staff training.',
    includes: [
      'Discovery and a written scope with a fixed price before work starts',
      'Web or mobile app built, tested and deployed',
      'Training for your team and handoff documentation',
      'Optional ongoing support plan',
    ],
    timeline: 'Typically 6–12 weeks',
  },
]

export type Service = {
  id: string
  title: string
  plain: string
  bestFor: string
  examples: string[]
}

export const SERVICES: Service[] = [
  {
    id: 'websites',
    title: 'Websites that book customers',
    plain: 'Fast, phone-friendly sites that answer “can I trust you?” and “how do I book?” in the first ten seconds.',
    bestFor: 'Clinics, home care agencies, recovery homes, wellness practices, consultants, local shops.',
    examples: ['Blessed Recovery Agency', 'Fourth Quarter Consulting', 'Ruby Root & Co.', 'Taste Bud Therapy'],
  },
  {
    id: 'follow-up',
    title: 'Booking & lead follow-up',
    plain: 'Every inquiry gets a fast, personal reply. Missed calls get a text back. Booked visits get reminders and review requests.',
    bestFor: 'Anyone whose phone rings after hours or whose inbox fills faster than they can answer.',
    examples: ['The lead system we run C.A.A.K.E. on', 'C.A.A.K.E. Lead Finder'],
  },
  {
    id: 'apps',
    title: 'Custom apps & portals',
    plain: 'Software built around how your team actually works: field apps, patient and client portals, intake forms and dashboards.',
    bestFor: 'Healthcare and service teams stuck on paper, spreadsheets or software that doesn’t fit.',
    examples: ['EVV caregiver app for home care', 'Two-part clinic patient survey app'],
  },
  {
    id: 'ai',
    title: 'AI assistants & automation',
    plain: 'Assistants and agents that draft replies, sort paperwork, summarize research and hand the judgment calls back to a person.',
    bestFor: 'Teams doing the same writing, sorting or lookup work every day.',
    examples: ['Inbound reply drafting (human approves every message)', 'AI Director content agent'],
  },
  {
    id: 'training',
    title: 'AI training for your staff',
    plain: 'Practical workshops and courses that teach people what AI is good for, what it must never be trusted with, and how to prompt it well.',
    bestFor: 'Clinical, academic and office teams being asked to “use AI” without guidance.',
    examples: ['Indiana University (SBAR & PCTF training)', 'C.A.A.K.E. Academy course'],
  },
  {
    id: 'community',
    title: 'Content & community platforms',
    plain: 'Education hubs, member communities and content engines that keep people coming back between visits.',
    bestFor: 'Patient education, nonprofits, coaches and creators.',
    examples: ['Living Oncology', 'Out of Town Shooter book launch'],
  },
]

export type CaseStatus = 'Live' | 'Private deployment' | 'Ongoing engagement' | 'Internal tool' | 'In development'

export type CaseStudy = {
  slug: string
  client: string
  title: string
  industry: string
  status: CaseStatus
  summary: string
  problem: string
  built: string[]
  result: string[]
  services: string[]
  url?: string
  urlLabel?: string
  note?: string
}

// Only facts already claimed elsewhere by C.A.A.K.E. No invented metrics, clients or quotes.
export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'indiana-university',
    client: 'Indiana University',
    title: 'Approved AI vendor: training, applications and content',
    industry: 'Higher education & academic healthcare',
    status: 'Ongoing engagement',
    summary: 'Qualified as an approved vendor, then delivered AI training, custom applications and AI-produced content across multiple departments.',
    problem: 'A university can’t buy unvetted AI tools or training. Staff were being asked to use AI without a structure for doing it safely and well.',
    built: [
      'Hands-on training in SBAR builders for structured clinical communication',
      'The PCTF prompting framework (Persona, Context, Task, Format) taught in workshops',
      'Custom applications built for university teams',
      'AI-produced commercial and communications content',
    ],
    result: [
      'Approved vendor status with ongoing work across multiple departments',
      'Additional applications currently in progress',
    ],
    services: ['AI training', 'Custom apps', 'Content'],
  },
  {
    slug: 'evv-homecare-platform',
    client: 'C.A.A.K.E. Homecare (EVV platform)',
    title: 'An offline-first caregiver app for Medicaid home care',
    industry: 'Home healthcare',
    status: 'Private deployment',
    summary: 'A caregiver app that captures Electronic Visit Verification in the field, even with no signal, and replaces paper visit notes with an audit trail.',
    problem: 'Medicaid-funded home care agencies must record Electronic Visit Verification (who, what, where, when) for every visit, often in homes with poor connections. Paper notes and generic apps leave gaps that cost agencies money.',
    built: [
      'Installable caregiver app that keeps working offline and syncs when back online',
      'GPS check-in and check-out, task lists, vitals and medication records',
      'Tamper-evident audit trail with encryption at rest',
      'Designed with HIPAA-conscious data handling',
    ],
    result: [
      'Captures the mandated EVV data set for each visit',
      'Works without a connection in the field',
      'Audit trail replaces manual paperwork',
    ],
    services: ['Custom apps', 'Healthcare'],
    note: 'Private agency deployment. A walkthrough is available on request.',
  },
  {
    slug: 'living-oncology',
    client: 'Living Oncology',
    title: 'Plain-language education and community for brain tumor patients',
    industry: 'Patient education',
    status: 'Live',
    summary: 'A production education and community platform that explains neuro-oncology in words patients and families can use.',
    problem: 'Neuro-oncology patients and their families needed clear, trustworthy education and a place to connect, not institutional jargon.',
    built: [
      'Content pathways written for patients and caregivers, not clinicians',
      'Community features with a HIPAA-conscious approach to patient-facing data',
      'Production site, maintained and updated',
    ],
    result: ['In production and publicly available'],
    services: ['Websites', 'Community platforms', 'Healthcare'],
    url: 'https://www.livingoncology.org/',
    urlLabel: 'livingoncology.org',
  },
  {
    slug: 'blessed-recovery-agency',
    client: 'Blessed Recovery Agency',
    title: 'A fast, trustworthy website for a sober-living provider',
    industry: 'Recovery & behavioral health',
    status: 'Live',
    summary: 'A Sacramento sober-living provider needed a site that answers “is this legitimate?” and “how do I get in?” on a phone, and that they can maintain themselves.',
    problem: 'Families searching for sober living are anxious and on their phones. The site had to build trust fast, explain intake clearly and stay easy to update without a developer.',
    built: [
      'Static site built for speed on phones',
      'Clear intake path and contact options on every page',
      'Automated checks that block launch if placeholder text or accessibility issues slip in',
    ],
    result: ['Live and in use', 'Built for mobile performance'],
    services: ['Websites'],
    url: 'https://blessed-recovery-agency.vercel.app/',
    urlLabel: 'View the site',
  },
  {
    slug: 'caake-academy',
    client: 'C.A.A.K.E. Academy',
    title: 'An AI literacy course for clinical leaders',
    industry: 'Healthcare education',
    status: 'Live',
    summary: 'A modular course that teaches clinical and research leaders what AI is for, and what it must never be trusted with.',
    problem: 'Clinical and research leaders were being asked to adopt AI without a framework to judge it.',
    built: [
      'Modular curriculum written for clinical and research leaders',
      'Course site, deployed and maintained',
      'The same material used in live training (SBAR and PCTF workshops)',
    ],
    result: ['Course site live', 'Curriculum in use for institutional training'],
    services: ['AI training'],
    url: 'https://aicourse-eta.vercel.app/',
    urlLabel: 'View the course',
  },
  {
    slug: 'lead-system',
    client: 'C.A.A.K.E. (our own business)',
    title: 'The lead system we run our own business on',
    industry: 'Lead follow-up & AI agents',
    status: 'Internal tool',
    summary: 'Every inquiry to this website is saved, and an AI assistant drafts a specific reply for a person to approve. The same approach powers our Lead Follow-Up System.',
    problem: 'Small businesses lose leads to slow replies. We wanted every inquiry answered quickly and personally, without anything going out that a person hasn’t approved.',
    built: [
      'Inquiries from this site stored in a private dashboard',
      'An assistant that drafts a reply using our real services and prices',
      'A lead finder that searches public posts for people asking for help we offer',
      'A check-in assistant for past clients who have gone quiet',
    ],
    result: ['In daily use at C.A.A.K.E.', 'Nothing is sent without human approval'],
    services: ['Booking & follow-up', 'AI automation'],
  },
]

export type SiteProof = { name: string; what: string; url: string }

// Small-business sites we built. Confirm each client is happy to be listed before going live.
export const SMALL_BUSINESS_SITES: SiteProof[] = [
  { name: 'Fourth Quarter Consulting', what: 'Financial consulting firm: services, booking form and click-to-call', url: 'https://fourth-quarter-consulting.vercel.app/' },
  { name: 'Ruby Root & Co.', what: 'Small-batch botanical elixir brand', url: 'https://sahjuice.vercel.app/' },
  { name: 'Taste Bud Therapy', what: 'Private chef and wellness brand with a Substack journal feed', url: 'https://tastebudtherapy.vercel.app/' },
  { name: 'The Forge & The Roost', what: 'Homestead farm brand story site', url: 'https://forge-and-roost.vercel.app/' },
  { name: 'Out of Town Shooter', what: 'Book launch site for Halo Publishing', url: 'https://halopublishingllc.com/' },
]
