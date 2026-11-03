import { requireAdminPage } from '@/lib/admin-auth'
import { listLeads } from '@/lib/db'
import { fmt } from '@/lib/format'
import { LeadStatus } from '@/components/admin/lead-status'

export const dynamic = 'force-dynamic'

const SOURCE: Record<string, string> = {
  inbound_contact: 'Contact form',
  inbound_booking: 'Book a call',
  agent_found: 'Lead Finder',
}

export default async function LeadsPage() {
  await requireAdminPage()
  const leads = await listLeads()

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Leads</h1>
      {leads.length === 0 ? (
        <p className="text-white/50">No leads yet.</p>
      ) : (
        <div className="space-y-3">
          {leads.map((l) => (
            <div key={l.id} className="card p-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">
                    {l.name || l.company || 'Unknown'}
                    {l.company && l.name ? <span className="text-white/50 font-normal"> · {l.company}</span> : null}
                  </div>
                  <div className="text-xs text-white/40">
                    {SOURCE[l.source] ?? l.source} · {fmt(l.created_at)}
                    {l.score != null && <> · score <span className="text-gold">{l.score}</span></>}
                    {l.email && <> · {l.email}</>}
                  </div>
                </div>
                <LeadStatus id={l.id} status={l.status} />
              </div>
              {(l.signal || l.message) && <p className="text-sm text-white/70">{l.signal || l.message}</p>}
              {l.source_url && (
                <a href={l.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-gold hover:underline break-all">
                  {l.source_url}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
