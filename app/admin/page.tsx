import { requireAdminPage } from '@/lib/admin-auth'
import { getStats, listRuns } from '@/lib/db'
import { fmt } from '@/lib/format'
import { AgentPanel } from '@/components/admin/agent-panel'

export const dynamic = 'force-dynamic'

const REQUIRED_ENV = ['DATABASE_URL', 'ANTHROPIC_API_KEY', 'ADMIN_EMAILS'] as const

export default async function AdminOverview() {
  await requireAdminPage()

  const missing = REQUIRED_ENV.filter((k) => !process.env[k])
  let stats = null
  let runs: Awaited<ReturnType<typeof listRuns>> = []
  let dbError = ''
  try {
    ;[stats, runs] = await Promise.all([getStats(), listRuns()])
  } catch (e) {
    dbError = e instanceof Error ? e.message : 'Database error'
  }

  const cards = stats
    ? [
        ['Leads (7 days)', stats.leads_7d],
        ['Total leads', stats.leads_total],
        ['Found by agent', stats.leads_found],
        ['Booked / won', stats.leads_converted],
        ['Awaiting approval', stats.pending_approvals],
        ['Clients', stats.clients_total],
      ]
    : []

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-bold">Overview</h1>

      {(missing.length > 0 || dbError) && (
        <div className="card p-4 border-red-400/40 text-sm space-y-1">
          {missing.length > 0 && <p>Missing environment variables: <b>{missing.join(', ')}</b></p>}
          {dbError && <p className="text-red-400">{dbError}</p>}
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {cards.map(([label, value]) => (
            <div key={label as string} className="card p-5">
              <div className="text-3xl font-bold text-gold">{value}</div>
              <div className="text-sm text-white/60 mt-1">{label}</div>
            </div>
          ))}
        </div>
      )}

      <section className="space-y-3">
        <h2 className="font-semibold text-lg">Run agents</h2>
        <AgentPanel />
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-lg">Recent activity</h2>
        {runs.length === 0 ? (
          <p className="text-sm text-white/50">No agent runs yet.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {runs.map((r) => (
              <li key={r.id} className="card p-3 flex flex-wrap gap-x-3">
                <span className="text-white/40">{fmt(r.created_at)}</span>
                <span className="text-gold">{r.agent}</span>
                <span className={r.status === 'error' ? 'text-red-400' : 'text-white/70'}>{r.summary}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
