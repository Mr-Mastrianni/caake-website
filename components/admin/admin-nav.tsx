'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const items = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/approvals', label: 'Approvals' },
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/clients', label: 'Clients' },
  { href: '/admin/memory', label: 'Memory' },
]

export function AdminNav() {
  const path = usePathname()
  return (
    <nav className="flex md:flex-col gap-1 overflow-x-auto text-sm">
      {items.map((i) => {
        const active = i.href === '/admin' ? path === '/admin' : path.startsWith(i.href)
        return (
          <Link
            key={i.href}
            href={i.href}
            className={cn(
              'px-3 py-2 rounded-lg whitespace-nowrap transition-colors',
              active ? 'bg-gold/15 text-gold' : 'text-white/60 hover:text-white hover:bg-white/5'
            )}
          >
            {i.label}
          </Link>
        )
      })}
    </nav>
  )
}
