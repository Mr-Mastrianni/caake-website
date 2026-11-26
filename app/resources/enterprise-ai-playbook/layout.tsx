import { pageMetadata } from '@/components/metadata'

export const metadata = pageMetadata({
  title: 'AI Playbook',
  description: 'A practical guide to starting with AI and automation in your organization.',
  path: '/resources/enterprise-ai-playbook',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
