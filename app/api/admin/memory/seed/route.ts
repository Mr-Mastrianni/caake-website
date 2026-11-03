import { NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin-auth'
import { MEMORY_KEYS, getMemory, setMemory } from '@/lib/db'
import { MEMORY_DEFAULTS } from '@/lib/memory-defaults'

// Fills only EMPTY memory fields with the starter text. Never overwrites anything you wrote.
export async function POST() {
  const { response } = await requireAdminApi()
  if (response) return response

  try {
    const current = await getMemory()
    let filled = 0
    for (const key of MEMORY_KEYS) {
      if (!(current[key] || '').trim() && MEMORY_DEFAULTS[key]) {
        await setMemory(key, MEMORY_DEFAULTS[key])
        filled++
      }
    }
    return NextResponse.json({ filled })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
