import { pageMetadata } from '@/components/metadata'

export const metadata = pageMetadata({
  title: 'Security Best Practices for AI',
  description: 'How to protect data and manage risk when adopting AI tools.',
  path: '/resources/security-best-practices',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
