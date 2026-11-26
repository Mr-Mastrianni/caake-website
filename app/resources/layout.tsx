import { pageMetadata } from '@/components/metadata'

export const metadata = pageMetadata({
  title: 'Resources',
  description: 'Guides and tools from C.A.A.K.E. on using AI and automation in a small business or healthcare team.',
  path: '/resources',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
