'use client'

import { useState } from 'react'

export function MemoryEditor({
  field, label, hint, initial,
}: { field: string; label: string; hint: string; initial: string }) {
  const [value, setValue] = useState(initial)
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  async function save() {
    setState('saving')
    const res = await fetch('/api/admin/memory', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: field, value }),
    })
    setState(res.ok ? 'saved' : 'error')
  }

  return (
    <div className="card p-5 space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-semibold">{label}</h3>
        <span className="text-xs text-white/40">
          {state === 'saving' && 'Saving...'}
          {state === 'saved' && 'Saved'}
          {state === 'error' && <span className="text-red-400">Save failed</span>}
        </span>
      </div>
      <p className="text-xs text-white/50">{hint}</p>
      <textarea
        value={value}
        onChange={(e) => { setValue(e.target.value); setState('idle') }}
        rows={6}
        maxLength={50000}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:border-gold focus:outline-none resize-y"
      />
      <button onClick={save} disabled={state === 'saving'} className="btn btn-secondary text-sm disabled:opacity-60">
        Save
      </button>
    </div>
  )
}
