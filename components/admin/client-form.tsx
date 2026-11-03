'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function ClientForm() {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const f = new FormData(form)
    setBusy(true)
    setErr('')
    const res = await fetch('/api/admin/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: f.get('name'), email: f.get('email'), company: f.get('company'), notes: f.get('notes'),
      }),
    })
    setBusy(false)
    if (!res.ok) return setErr('Could not add client')
    form.reset()
    router.refresh()
  }

  const input = 'px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:border-gold focus:outline-none'
  return (
    <form onSubmit={submit} className="card p-5 grid sm:grid-cols-2 gap-3">
      <input name="name" required placeholder="Name" className={input} />
      <input name="email" type="email" placeholder="Email" className={input} />
      <input name="company" placeholder="Company" className={input} />
      <input name="notes" placeholder="Notes (what we do for them)" className={input} />
      {err && <p role="alert" className="sm:col-span-2 text-sm text-red-400">{err}</p>}
      <button disabled={busy} className="btn btn-primary sm:col-span-2 justify-center disabled:opacity-60">
        {busy ? 'Adding...' : 'Add client'}
      </button>
    </form>
  )
}
