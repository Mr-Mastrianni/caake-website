'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SeedButton() {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  async function load() {
    setBusy(true)
    setMsg('')
    const res = await fetch('/api/admin/memory/seed', { method: 'POST' })
    const data = await res.json().catch(() => ({}))
    setBusy(false)
    if (!res.ok) return setMsg(data.error || 'Failed')
    setMsg(`Filled ${data.filled} empty field(s). Review and edit below.`)
    router.refresh()
  }

  return (
    <div className="card p-4 flex flex-wrap items-center gap-3">
      <button onClick={load} disabled={busy} className="btn btn-primary disabled:opacity-60">
        {busy ? 'Loading...' : 'Load starter memory'}
      </button>
      <span className="text-sm text-white/60">
        Fills empty fields from your site and projects. Never overwrites anything you wrote.
      </span>
      {msg && <span role="status" className="text-sm text-gold">{msg}</span>}
    </div>
  )
}
