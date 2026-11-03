import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminApi } from '@/lib/admin-auth'
import { decideMessage, setLeadStatus, touchClient } from '@/lib/db'
import { emailConfigured, sendEmail } from '@/lib/email'

const Body = z.object({
  action: z.enum(['approve', 'reject']),
  subject: z.string().max(200).nullable().optional(),
  body: z.string().min(1).max(5000).optional(),
})

const UUID = /^[0-9a-f-]{36}$/i

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { response } = await requireAdminApi()
  if (response) return response
  if (!UUID.test(params.id)) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const parsed = Body.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  const { action, subject, body } = parsed.data

  try {
    if (action === 'reject') {
      await decideMessage(params.id, 'rejected')
      return NextResponse.json({ status: 'rejected' })
    }

    // Approve (with any edits). If email is configured and we have an address, send it;
    // otherwise mark approved so the admin can send it manually (e.g. paste into a DM).
    const msg = await decideMessage(params.id, 'approved', { subject, body })
    if (!msg) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    let status: 'approved' | 'sent' = 'approved'
    if (emailConfigured() && msg.to_email) {
      await sendEmail(msg.to_email, msg.subject || 'Following up from C.A.A.K.E.', msg.body)
      await decideMessage(params.id, 'sent')
      status = 'sent'
      if (msg.lead_id) await setLeadStatus(msg.lead_id, 'contacted')
      if (msg.client_id) await touchClient(msg.client_id)
    }
    return NextResponse.json({ status })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
