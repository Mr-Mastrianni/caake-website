import { pageMetadata } from '@/components/metadata'

export const metadata = pageMetadata({
  title: 'Terms of Service',
  description: 'Terms of service for caake.org and C.A.A.K.E. Corporation.',
  path: '/terms',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
