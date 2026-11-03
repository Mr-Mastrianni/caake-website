import { requireAdminPage } from '@/lib/admin-auth'
import { getLead, listClients, listMessages } from '@/lib/db'
import { emailConfigured } from '@/lib/email'
import { fmt } from '@/lib/format'
import { MessageCard, type MessageView } from '@/components/admin/message-card'

export const dynamic = 'force-dynamic'

export default async function ApprovalsPage() {
  await requireAdminPage()
  const [drafts, clients] = await Promise.all([listMessages('draft'), listClients()])
  const clientById = new Map(clients.map((c) => [c.id, c]))
  const canSend = emailConfigured()

  const views: MessageView[] = await Promise.all(
    drafts.map(async (m) => {
      let context: string = m.kind
      if (m.lead_id) {
        const l = await getLead(m.lead_id)
        if (l) context = `${l.name || l.company || 'Lead'}${l.score != null ? ` (score ${l.score})` : ''}${l.signal ? `: ${l.signal}` : l.message ? `: ${l.message.slice(0, 120)}` : ''}`
      } else if (m.client_id) {
        const c = clientById.get(m.client_id)
        if (c) context = `Client: ${c.name}`
      }
      return {
        id: m.id, kind: m.kind, agent: m.agent, to_email: m.to_email,
        subject: m.subject, body: m.body, context, created: fmt(m.created_at), canSend,
      }
    })
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Approvals</h1>
        <p className="text-sm text-white/60 mt-1">
          Nothing is sent until you approve it. Edit freely before approving.
        </p>
      </div>
      {views.length === 0 ? (
        <p className="text-white/50">Nothing waiting. Run an agent from the Overview page.</p>
      ) : (
        <div className="space-y-4">{views.map((v) => <MessageCard key={v.id} m={v} />)}</div>
      )}
    </div>
  )
}
