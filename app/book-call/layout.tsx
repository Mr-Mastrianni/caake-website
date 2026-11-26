import { pageMetadata } from '@/components/metadata'

export const metadata = pageMetadata({
  title: 'Book a Free Lead Leak Audit',
  description: 'A free 15-minute call and a written teardown of where your website, booking and follow-up lose customers, plus a fixed price to fix the biggest leak.',
  path: '/book-call',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
