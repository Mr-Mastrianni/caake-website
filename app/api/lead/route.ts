import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createLead } from '@/lib/db'
import { draftInboundReply } from '@/lib/agents'
import { rateLimit } from '@/lib/rate-limit'

export const maxDuration = 60

const Body = z.object({
  source: z.enum(['contact', 'booking']),
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  company: z.string().trim().max(200).optional(),
  role: z.string().trim().max(200).optional(),
  message: z.string().trim().max(3000).optional(),
  website: z.string().max(200).optional(), // honeypot: real users leave this empty
})

// Public endpoint used by the contact and book-call forms.
export async function POST(req: Request) {
  const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim()
  if (!rateLimit(`lead:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests. Please email us directly.' }, { status: 429 })
  }

  const parsed = Body.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  const d = parsed.data

  // Honeypot filled => bot. Pretend success, store nothing, spend nothing.
  if (d.website) return NextResponse.json({ ok: true })

  let lead
  try {
    lead = await createLead({
      source: d.source === 'booking' ? 'inbound_booking' : 'inbound_contact',
      name: d.name,
      email: d.email,
      company: d.company ?? null,
      role: d.role ?? null,
      message: d.message ?? null,
    })
  } catch (e) {
    console.error('lead create failed', e)
    return NextResponse.json({ error: 'Could not save your message. Please email us directly.' }, { status: 500 })
  }

  // The lead is safely stored. Drafting the reply is best-effort and never blocks the visitor.
  if (lead) {
    try {
      await draftInboundReply(lead)
    } catch (e) {
      console.error('draft reply failed', e)
    }
  }
  return NextResponse.json({ ok: true })
}
