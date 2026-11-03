'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export interface MessageView {
  id: string
  kind: string
  agent: string
  to_email: string | null
  subject: string | null
  body: string
  context: string // who/what this is about
  created: string
  canSend: boolean
}

export function MessageCard({ m }: { m: MessageView }) {
  const router = useRouter()
  const [subject, setSubject] = useState(m.subject ?? '')
  const [body, setBody] = useState(m.body)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function decide(action: 'approve' | 'reject') {
    setBusy(true)
    setErr('')
    try {
      const res = await fetch(`/api/admin/messages/${m.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action === 'approve' ? { action, subject: subject || null, body } : { action }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed')
      router.refresh()
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Failed')
      setBusy(false)
    }
  }

  const willSend = m.canSend && !!m.to_email

  return (
    <div className="card p-5 space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-xs text-white/50">
        <span className="px-2 py-0.5 rounded bg-gold/15 text-gold uppercase">{m.kind}</span>
        <span>{m.context}</span>
        <span>·</span>
        <span>{m.created}</span>
        {m.to_email && <span>· to {m.to_email}</span>}
      </div>
      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject"
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:border-gold focus:outline-none"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={7}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:border-gold focus:outline-none resize-y"
      />
      {err && <p role="alert" className="text-sm text-red-400">{err}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={() => decide('approve')} disabled={busy || !body.trim()} className="btn btn-primary disabled:opacity-60">
          {willSend ? 'Approve & send' : 'Approve'}
        </button>
        <button onClick={() => decide('reject')} disabled={busy} className="btn btn-secondary disabled:opacity-60">
          Reject
        </button>
        {!willSend && (
          <span className="text-xs text-white/40">
            {m.canSend ? 'No email address: copy and send it yourself.' : 'Email sending is not configured: copy and send it yourself.'}
          </span>
        )}
      </div>
    </div>
  )
}
