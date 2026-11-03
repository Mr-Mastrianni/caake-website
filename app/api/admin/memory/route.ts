import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminApi } from '@/lib/admin-auth'
import { MEMORY_KEYS, setMemory } from '@/lib/db'

const Body = z.object({
  key: z.enum(MEMORY_KEYS),
  value: z.string().max(50000),
})

export async function PUT(req: Request) {
  const { response } = await requireAdminApi()
  if (response) return response

  const parsed = Body.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  try {
    await setMemory(parsed.data.key, parsed.data.value)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
