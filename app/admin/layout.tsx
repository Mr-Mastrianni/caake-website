import { ClerkProvider, UserButton } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { requireAdminPage } from '@/lib/admin-auth'
import { AdminNav } from '@/components/admin/admin-nav'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Business OS | C.A.A.K.E.', robots: { index: false, follow: false } }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage() // signed-in but not on the allow-list => 404

  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <div className="min-h-screen md:flex">
        <aside className="md:w-56 md:min-h-screen border-b md:border-b-0 md:border-r border-white/10 bg-cosmic p-4 flex md:flex-col gap-4">
          <div className="flex items-center justify-between md:block">
            <div className="font-display text-lg font-bold text-gold">C.A.A.K.E. OS</div>
            <div className="md:hidden"><UserButton /></div>
          </div>
          <AdminNav />
          <div className="hidden md:block mt-auto"><UserButton showName /></div>
        </aside>
        <div className="flex-1 p-4 md:p-8 max-w-6xl">{children}</div>
      </div>
    </ClerkProvider>
  )
}
