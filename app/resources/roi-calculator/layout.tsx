import { pageMetadata } from '@/components/metadata'

export const metadata = pageMetadata({
  title: 'Automation ROI Calculator',
  description: 'Estimate the time and money automation could save your team.',
  path: '/resources/roi-calculator',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
