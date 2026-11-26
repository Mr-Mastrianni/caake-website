import { pageMetadata } from '@/components/metadata'

export const metadata = pageMetadata({
  title: 'AI Use Policy',
  description: 'How C.A.A.K.E. uses AI in client work, including human review and data handling.',
  path: '/ai-use-policy',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
