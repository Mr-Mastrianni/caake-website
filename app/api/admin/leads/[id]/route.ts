import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminApi } from '@/lib/admin-auth'
import { createClient, getLead, setLeadStatus } from '@/lib/db'

const Body = z.object({ status: z.enum(['new', 'contacted', 'booked', 'won', 'lost']) })
const UUID = /^[0-9a-f-]{36}$/i

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { response } = await requireAdminApi()
  if (response) return response
  if (!UUID.test(params.id)) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const parsed = Body.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  try {
    const lead = await getLead(params.id)
    if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await setLeadStatus(params.id, parsed.data.status)
    // A won lead becomes a client, so the retention agent can keep them coming back.
    if (parsed.data.status === 'won' && lead.status !== 'won') {
      await createClient({
        name: lead.name || lead.company || 'New client',
        email: lead.email,
        company: lead.company,
        notes: lead.signal || lead.message,
      })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
