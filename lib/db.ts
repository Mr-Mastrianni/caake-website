import 'server-only'
import { neon } from '@neondatabase/serverless'

// ---------- types ----------
export type LeadStatus = 'new' | 'contacted' | 'booked' | 'won' | 'lost'
export type LeadSource = 'inbound_contact' | 'inbound_booking' | 'agent_found'
export type MessageKind = 'reply' | 'outreach' | 'retention'
export type MessageStatus = 'draft' | 'approved' | 'rejected' | 'sent'

export interface Lead {
  id: string
  source: LeadSource
  name: string | null
  email: string | null
  company: string | null
  role: string | null
  message: string | null
  source_url: string | null
  signal: string | null
  score: number | null
  status: LeadStatus
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  lead_id: string | null
  client_id: string | null
  kind: MessageKind
  agent: string
  to_email: string | null
  subject: string | null
  body: string
  status: MessageStatus
  created_at: string
  decided_at: string | null
}

export interface Client {
  id: string
  name: string
  email: string | null
  company: string | null
  notes: string | null
  last_contact_at: string | null
  created_at: string
}

export interface AgentRun {
  id: string
  agent: string
  status: 'ok' | 'error'
  summary: string | null
  created_at: string
}

// ---------- connection ----------
type Sql = ReturnType<typeof neon>
let _sql: Sql | null = null
let _ready: Promise<void> | null = null

function client(): Sql {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')
  if (!_sql) _sql = neon(url)
  return _sql
}

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS business_memory (
     key text PRIMARY KEY,
     value text NOT NULL DEFAULT '',
     updated_at timestamptz NOT NULL DEFAULT now()
   )`,
  `CREATE TABLE IF NOT EXISTS leads (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     source text NOT NULL,
     name text, email text, company text, role text,
     message text, source_url text, signal text, score int,
     status text NOT NULL DEFAULT 'new',
     created_at timestamptz NOT NULL DEFAULT now(),
     updated_at timestamptz NOT NULL DEFAULT now()
   )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS leads_source_url_uniq ON leads (source_url) WHERE source_url IS NOT NULL`,
  `CREATE TABLE IF NOT EXISTS clients (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     name text NOT NULL, email text, company text, notes text,
     last_contact_at timestamptz,
     created_at timestamptz NOT NULL DEFAULT now()
   )`,
  `CREATE TABLE IF NOT EXISTS messages (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
     client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
     kind text NOT NULL, agent text NOT NULL,
     to_email text, subject text, body text NOT NULL,
     status text NOT NULL DEFAULT 'draft',
     created_at timestamptz NOT NULL DEFAULT now(),
     decided_at timestamptz
   )`,
  `CREATE TABLE IF NOT EXISTS agent_runs (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     agent text NOT NULL, status text NOT NULL, summary text,
     created_at timestamptz NOT NULL DEFAULT now()
   )`,
]

async function sql(): Promise<Sql> {
  const c = client()
  if (!_ready) {
    _ready = (async () => {
      for (const stmt of SCHEMA) await c.query(stmt)
    })().catch((e) => {
      _ready = null // allow retry on next call
      throw e
    })
  }
  await _ready
  return c
}

// ---------- business memory ----------
export const MEMORY_KEYS = ['offer', 'pricing', 'hours', 'ideal_customer', 'reviews', 'voice'] as const
export type MemoryKey = (typeof MEMORY_KEYS)[number]

export async function getMemory(): Promise<Record<string, string>> {
  const q = await sql()
  const rows = (await q.query('SELECT key, value FROM business_memory')) as { key: string; value: string }[]
  return Object.fromEntries(rows.map((r) => [r.key, r.value]))
}

export async function setMemory(key: MemoryKey, value: string): Promise<void> {
  const q = await sql()
  await q.query(
    `INSERT INTO business_memory (key, value) VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
    [key, value]
  )
}

// ---------- leads ----------
export async function createLead(
  l: Partial<Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'status'>> & { source: LeadSource }
): Promise<Lead | null> {
  const q = await sql()
  const rows = (await q.query(
    `INSERT INTO leads (source, name, email, company, role, message, source_url, signal, score)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT DO NOTHING
     RETURNING *`,
    [l.source, l.name ?? null, l.email ?? null, l.company ?? null, l.role ?? null,
     l.message ?? null, l.source_url ?? null, l.signal ?? null, l.score ?? null]
  )) as Lead[]
  return rows[0] ?? null // null => duplicate source_url
}

export async function listLeads(status?: LeadStatus): Promise<Lead[]> {
  const q = await sql()
  return (status
    ? await q.query('SELECT * FROM leads WHERE status = $1 ORDER BY score DESC NULLS LAST, created_at DESC LIMIT 200', [status])
    : await q.query('SELECT * FROM leads ORDER BY created_at DESC LIMIT 200')) as Lead[]
}

export async function getLead(id: string): Promise<Lead | null> {
  const q = await sql()
  const rows = (await q.query('SELECT * FROM leads WHERE id = $1', [id])) as Lead[]
  return rows[0] ?? null
}

export async function setLeadStatus(id: string, status: LeadStatus): Promise<void> {
  const q = await sql()
  await q.query('UPDATE leads SET status = $2, updated_at = now() WHERE id = $1', [id, status])
}

// ---------- messages (every outbound message is a draft until an admin approves it) ----------
export async function createMessage(m: {
  lead_id?: string | null
  client_id?: string | null
  kind: MessageKind
  agent: string
  to_email?: string | null
  subject?: string | null
  body: string
}): Promise<Message> {
  const q = await sql()
  const rows = (await q.query(
    `INSERT INTO messages (lead_id, client_id, kind, agent, to_email, subject, body)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [m.lead_id ?? null, m.client_id ?? null, m.kind, m.agent, m.to_email ?? null, m.subject ?? null, m.body]
  )) as Message[]
  return rows[0]
}

export async function listMessages(status?: MessageStatus): Promise<Message[]> {
  const q = await sql()
  return (status
    ? await q.query('SELECT * FROM messages WHERE status = $1 ORDER BY created_at DESC LIMIT 200', [status])
    : await q.query('SELECT * FROM messages ORDER BY created_at DESC LIMIT 200')) as Message[]
}

export async function decideMessage(
  id: string,
  status: Exclude<MessageStatus, 'draft'>,
  edits?: { subject?: string | null; body?: string }
): Promise<Message | null> {
  const q = await sql()
  const rows = (await q.query(
    `UPDATE messages SET status = $2, decided_at = now(),
       subject = COALESCE($3, subject), body = COALESCE($4, body)
     WHERE id = $1 RETURNING *`,
    [id, status, edits?.subject ?? null, edits?.body ?? null]
  )) as Message[]
  return rows[0] ?? null
}

// ---------- clients ----------
export async function listClients(): Promise<Client[]> {
  const q = await sql()
  return (await q.query('SELECT * FROM clients ORDER BY last_contact_at ASC NULLS FIRST, created_at DESC LIMIT 500')) as Client[]
}

export async function createClient(c: { name: string; email?: string | null; company?: string | null; notes?: string | null }): Promise<Client> {
  const q = await sql()
  const rows = (await q.query(
    `INSERT INTO clients (name, email, company, notes, last_contact_at) VALUES ($1,$2,$3,$4, now()) RETURNING *`,
    [c.name, c.email ?? null, c.company ?? null, c.notes ?? null]
  )) as Client[]
  return rows[0]
}

export async function touchClient(id: string): Promise<void> {
  const q = await sql()
  await q.query('UPDATE clients SET last_contact_at = now() WHERE id = $1', [id])
}

export async function staleClients(days: number): Promise<Client[]> {
  const q = await sql()
  return (await q.query(
    `SELECT * FROM clients
     WHERE (last_contact_at IS NULL OR last_contact_at < now() - make_interval(days => $1))
       AND NOT EXISTS (SELECT 1 FROM messages m WHERE m.client_id = clients.id AND m.status = 'draft')
     ORDER BY last_contact_at ASC NULLS FIRST LIMIT 25`,
    [days]
  )) as Client[]
}

// ---------- runs & stats ----------
export async function logRun(agent: string, status: 'ok' | 'error', summary: string): Promise<void> {
  const q = await sql()
  await q.query('INSERT INTO agent_runs (agent, status, summary) VALUES ($1,$2,$3)', [agent, status, summary.slice(0, 2000)])
}

export async function listRuns(): Promise<AgentRun[]> {
  const q = await sql()
  return (await q.query('SELECT * FROM agent_runs ORDER BY created_at DESC LIMIT 25')) as AgentRun[]
}

export async function getStats() {
  const q = await sql()
  const [r] = (await q.query(
    `SELECT
       (SELECT count(*) FROM leads)::int AS leads_total,
       (SELECT count(*) FROM leads WHERE created_at > now() - interval '7 days')::int AS leads_7d,
       (SELECT count(*) FROM leads WHERE source = 'agent_found')::int AS leads_found,
       (SELECT count(*) FROM leads WHERE status IN ('booked','won'))::int AS leads_converted,
       (SELECT count(*) FROM messages WHERE status = 'draft')::int AS pending_approvals,
       (SELECT count(*) FROM clients)::int AS clients_total`
  )) as Record<string, number>[]
  return r as {
    leads_total: number; leads_7d: number; leads_found: number
    leads_converted: number; pending_approvals: number; clients_total: number
  }
}
