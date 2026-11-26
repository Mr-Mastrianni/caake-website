import { pageMetadata } from '@/components/metadata'

export const metadata = pageMetadata({
  title: 'Privacy Policy',
  description: 'How C.A.A.K.E. collects and uses information submitted through caake.org.',
  path: '/privacy',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
