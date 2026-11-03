import { requireAdminPage } from '@/lib/admin-auth'
import { listClients } from '@/lib/db'
import { fmt } from '@/lib/format'
import { ClientForm } from '@/components/admin/client-form'

export const dynamic = 'force-dynamic'

export default async function ClientsPage() {
  await requireAdminPage()
  const clients = await listClients()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Clients</h1>
        <p className="text-sm text-white/60 mt-1">
          Marking a lead &ldquo;won&rdquo; adds them here. The Retention agent drafts check-ins for quiet clients.
        </p>
      </div>
      <ClientForm />
      <div className="space-y-3">
        {clients.map((c) => (
          <div key={c.id} className="card p-4">
            <div className="font-semibold">
              {c.name}
              {c.company ? <span className="text-white/50 font-normal"> · {c.company}</span> : null}
            </div>
            <div className="text-xs text-white/40">
              {c.email || 'no email'} · last contact {fmt(c.last_contact_at)}
            </div>
            {c.notes && <p className="text-sm text-white/70 mt-1">{c.notes}</p>}
          </div>
        ))}
        {clients.length === 0 && <p className="text-white/50">No clients yet.</p>}
      </div>
    </div>
  )
}
