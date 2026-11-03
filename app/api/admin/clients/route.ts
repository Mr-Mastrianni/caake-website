import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminApi } from '@/lib/admin-auth'
import { createClient } from '@/lib/db'

const Body = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320).optional().or(z.literal('')),
  company: z.string().trim().max(200).optional(),
  notes: z.string().trim().max(2000).optional(),
})

export async function POST(req: Request) {
  const { response } = await requireAdminApi()
  if (response) return response

  const parsed = Body.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  try {
    const c = await createClient({ ...parsed.data, email: parsed.data.email || null })
    return NextResponse.json(c)
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
