import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminApi } from '@/lib/admin-auth'
import { runLeadFinder, runRetention } from '@/lib/agents'

export const maxDuration = 300

const Body = z.object({
  focus: z.string().max(500).optional(),
  days: z.number().int().min(1).max(365).optional(),
})

export async function POST(req: Request, { params }: { params: { agent: string } }) {
  const { response } = await requireAdminApi()
  if (response) return response

  const body = Body.safeParse(await req.json().catch(() => ({})))
  if (!body.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  try {
    if (params.agent === 'lead-finder') return NextResponse.json(await runLeadFinder(body.data.focus))
    if (params.agent === 'retention') return NextResponse.json(await runRetention(body.data.days ?? 30))
    return NextResponse.json({ error: 'Unknown agent' }, { status: 404 })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Agent failed' }, { status: 500 })
  }
}
