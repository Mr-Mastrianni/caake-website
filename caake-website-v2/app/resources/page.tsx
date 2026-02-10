'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, FileText, Video, BookOpen, Calculator, Download, ExternalLink } from 'lucide-react'

const categories = ['All', 'Guides', 'Tools', 'Webinars', 'Whitepapers']

const resources = [
  {
    title: 'The Enterprise AI Playbook',
    type: 'Guide',
    description: 'A comprehensive guide to implementing AI in enterprise environments. Learn practical strategies for getting started with automation.',
    icon: BookOpen,
    category: 'Guides',
    href: '/resources/enterprise-ai-playbook',
    isExternal: false
  },
  {
    title: 'Automation ROI Calculator',
    type: 'Tool',
    description: 'Interactive calculator to estimate the potential return on investment for your automation projects.',
    icon: Calculator,
    category: 'Tools',
    href: '/resources/roi-calculator',
    isExternal: false
  },
  {
    title: 'Security Best Practices for AI',
    type: 'Whitepaper',
    description: 'Learn how to secure your AI implementations at enterprise scale. Covers data protection, compliance, and risk management.',
    icon: FileText,
    category: 'Whitepapers',
    href: '/resources/security-best-practices',
    isExternal: false
  },
  {
    title: 'The Future of Work: AI Agents',
    type: 'Webinar',
    description: 'Recorded webinar on how AI agents are transforming business operations and what it means for your organization.',
    icon: Video,
    category: 'Webinars',
    href: '/resources/ai-agents-webinar',
    isExternal: false
  },
]

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredResources = activeCategory === 'All' 
    ? resources 
    : resources.filter(r => r.category === activeCategory)

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="section-padding pt-32">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-gold text-sm font-medium uppercase tracking-wider">Resources</span>
            <h1 className="font-display text-5xl md:text-7xl font-bold mt-4 mb-6">
              Learn & <span className="text-gold-gradient">Grow</span>
            </h1>
            <p className="text-xl text-white/60">
              Insights, guides, and tools to help you navigate the world of AI automation.
            </p>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Filter */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-gold text-midnight'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <Link 
                key={resource.title}
                href={resource.href}
                className="card p-6 group hover:border-gold/30 transition-all block"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                    <resource.icon className="w-6 h-6 text-gold" />
                  </div>
                  <span className="text-gold/60 text-sm">{resource.type}</span>
                </div>
                <h3 className="font-display text-xl font-bold mb-2 group-hover:text-gold transition-colors">
                  {resource.title}
                </h3>
                <p className="text-white/60 text-sm mb-4">{resource.description}</p>
                <div className="text-gold text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                  {resource.isExternal ? (
                    <>
                      Download <ExternalLink size={14} />
                    </>
                  ) : (
                    <>
                      Access Resource <ArrowRight size={14} />
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Newsletter */}
          <div className="mt-20 card p-8 md:p-12 text-center bg-gradient-to-br from-gold/10 to-purple/10">
            <h2 className="font-display text-3xl font-bold mb-4">
              Stay Updated
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto mb-8">
              Subscribe to our newsletter for the latest AI automation insights, 
              new resources, and best practices.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-gold focus:outline-none transition-colors"
              />
              <button type="submit" className="btn btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
