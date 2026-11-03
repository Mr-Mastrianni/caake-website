import { requireAdminPage } from '@/lib/admin-auth'
import { getMemory } from '@/lib/db'
import { MemoryEditor } from '@/components/admin/memory-editor'
import { SeedButton } from '@/components/admin/seed-button'

export const dynamic = 'force-dynamic'

const FIELDS = [
  ['offer', 'What we sell', 'Your services in plain words, what is included, who it is for.'],
  ['pricing', 'Pricing', 'Real prices and packages. Agents will only quote what is written here.'],
  ['hours', 'Hours & availability', 'When you take calls, response times, booking process.'],
  ['ideal_customer', 'Ideal customer', 'Industries, company size, the situations where you win.'],
  ['reviews', 'Reviews & results', 'Paste real client reviews and results. Agents use these to learn what makes people say yes.'],
  ['voice', 'Brand voice', 'How you write: tone, words you like, words you avoid.'],
] as const

export default async function MemoryPage() {
  await requireAdminPage()
  const mem = await getMemory()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Business memory</h1>
        <p className="text-sm text-white/60 mt-1">
          Every agent reads this before it works. The more real detail you add, the better the output. Fill it in first.
        </p>
      </div>
      <SeedButton />
      {FIELDS.map(([key, label, hint]) => (
        <MemoryEditor key={`${key}-${(mem[key] ?? '').length}`} field={key} label={label} hint={hint} initial={mem[key] ?? ''} />
      ))}
    </div>
  )
}
