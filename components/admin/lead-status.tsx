'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STATUSES = ['new', 'contacted', 'booked', 'won', 'lost'] as const

export function LeadStatus({ id, status }: { id: string; status: string }) {
  const router = useRouter()
  const [value, setValue] = useState(status)
  const [busy, setBusy] = useState(false)

  async function change(next: string) {
    const prev = value
    setValue(next)
    setBusy(true)
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    setBusy(false)
    if (!res.ok) setValue(prev)
    else router.refresh()
  }

  return (
    <select
      value={value}
      disabled={busy}
      onChange={(e) => change(e.target.value)}
      className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-sm focus:border-gold focus:outline-none"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} className="bg-midnight">{s}</option>
      ))}
    </select>
  )
}
