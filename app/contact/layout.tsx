import { pageMetadata } from '@/components/metadata'

export const metadata = pageMetadata({
  title: 'Contact',
  description: 'Email, call or message C.A.A.K.E. in Fishers, Indiana. A person replies within one business day.',
  path: '/contact',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
