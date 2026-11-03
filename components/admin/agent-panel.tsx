'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function AgentPanel() {
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)
  const [focus, setFocus] = useState('')
  const [days, setDays] = useState(30)
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null)

  async function run(agent: 'lead-finder' | 'retention') {
    setBusy(agent)
    setResult(null)
    try {
      const res = await fetch(`/api/admin/agents/${agent}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agent === 'lead-finder' ? { focus } : { days }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Agent failed')
      setResult({ ok: true, text: data.summary })
      router.refresh()
    } catch (e) {
      setResult({ ok: false, text: e instanceof Error ? e.message : 'Agent failed' })
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card p-5 space-y-3">
        <h3 className="font-semibold">Lead Finder</h3>
        <p className="text-sm text-white/60">
          Searches public posts for people who need what you sell right now and drafts a first message for each.
        </p>
        <input
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
          maxLength={500}
          placeholder="Optional focus, e.g. dental practices missing calls"
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:border-gold focus:outline-none"
        />
        <button onClick={() => run('lead-finder')} disabled={!!busy} className="btn btn-primary disabled:opacity-60">
          {busy === 'lead-finder' ? 'Searching (can take a minute)...' : 'Find leads'}
        </button>
      </div>
      <div className="card p-5 space-y-3">
        <h3 className="font-semibold">Retention</h3>
        <p className="text-sm text-white/60">
          Drafts check-ins for clients you haven&apos;t been in touch with lately.
        </p>
        <label className="text-sm text-white/60 flex items-center gap-2">
          Quiet for
          <input
            type="number" min={1} max={365} value={days}
            onChange={(e) => setDays(Number(e.target.value) || 30)}
            className="w-20 px-2 py-1 rounded-lg bg-white/5 border border-white/10 focus:border-gold focus:outline-none"
          />
          days
        </label>
        <button onClick={() => run('retention')} disabled={!!busy} className="btn btn-primary disabled:opacity-60">
          {busy === 'retention' ? 'Drafting...' : 'Draft check-ins'}
        </button>
      </div>
      {result && (
        <p role="status" className={`md:col-span-2 text-sm ${result.ok ? 'text-gold' : 'text-red-400'}`}>
          {result.text}
        </p>
      )}
    </div>
  )
}
