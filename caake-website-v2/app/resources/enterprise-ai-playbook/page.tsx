'use client'

import { ArrowLeft, BookOpen, CheckCircle, Lightbulb, Target, Shield } from 'lucide-react'
import Link from 'next/link'

const chapters = [
  {
    icon: Target,
    title: 'Getting Started',
    topics: ['Identifying automation opportunities', 'Building your AI roadmap', 'Setting realistic expectations']
  },
  {
    icon: Lightbulb,
    title: 'Choosing the Right Tools',
    topics: ['Build vs buy decisions', 'Integration considerations', 'Scalability factors']
  },
  {
    icon: Shield,
    title: 'Security & Governance',
    topics: ['Data protection strategies', 'Compliance requirements', 'Risk management']
  },
  {
    icon: CheckCircle,
    title: 'Implementation',
    topics: ['Pilot programs', 'Change management', 'Measuring success']
  }
]

export default function EnterpriseAIPlaybook() {
  return (
    <div className="overflow-hidden">
      <section className="section-padding pt-32">
        <div className="container-custom max-w-4xl">
          <Link href="/resources" className="text-gold text-sm flex items-center gap-2 mb-8 hover:underline">
            <ArrowLeft size={16} /> Back to Resources
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-gold" />
            <span className="text-gold text-sm font-medium uppercase tracking-wider">Guide</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
            The Enterprise AI Playbook
          </h1>

          <p className="text-xl text-white/60 mb-12">
            A practical guide for business leaders looking to implement AI automation 
            in their organizations. No hype, just actionable strategies.
          </p>

          <div className="card p-8 mb-12">
            <h2 className="font-display text-2xl font-bold mb-6">What You Will Learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {chapters.map((chapter) => (
                <div key={chapter.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <chapter.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{chapter.title}</h3>
                    <ul className="space-y-1">
                      {chapter.topics.map((topic) => (
                        <li key={topic} className="text-white/60 text-sm">• {topic}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <h2 className="font-display text-2xl font-bold mb-4">Introduction</h2>
            <p className="text-white/70 mb-6">
              AI is not magic. It is a tool—an incredibly powerful one, but still just a tool. 
              The organizations that succeed with AI are not the ones with the biggest budgets 
              or the most data scientists. They are the ones that approach AI pragmatically, 
              focusing on specific business outcomes rather than chasing the latest trends.
            </p>

            <h2 className="font-display text-2xl font-bold mb-4 mt-8">Chapter 1: Getting Started</h2>
            <h3 className="text-xl font-semibold mb-3 text-gold">Identifying Automation Opportunities</h3>
            <p className="text-white/70 mb-4">
              Before you spend a dollar on AI, you need to know where it can actually help. 
              Look for these three characteristics in your processes:
            </p>
            <ul className="space-y-3 text-white/70 mb-6">
              <li className="flex gap-3">
                <span className="text-gold font-bold">1.</span>
                <span><strong>Repetitive:</strong> Tasks that follow a predictable pattern and are performed frequently.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gold font-bold">2.</span>
                <span><strong>Time-consuming:</strong> Work that takes hours of human effort each week.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gold font-bold">3.</span>
                <span><strong>Error-prone:</strong> Manual processes where mistakes are costly or common.</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-gold">Building Your AI Roadmap</h3>
            <p className="text-white/70 mb-4">
              Do not try to automate everything at once. Start with one high-impact, low-complexity 
              project. Success with your first project builds momentum and teaches your team how 
              to work with AI.
            </p>
            <div className="bg-gold/10 border border-gold/20 rounded-lg p-6 my-6">
              <p className="text-white/80 italic">
                "We started with automating our invoice processing. It saved 20 hours a week 
                and paid for itself in two months. That success made getting buy-in for 
                bigger projects much easier."
              </p>
              <p className="text-white/60 text-sm mt-2">— Operations Director, Manufacturing Company</p>
            </div>

            <h2 className="font-display text-2xl font-bold mb-4 mt-8">Chapter 2: Choosing the Right Tools</h2>
            <h3 className="text-xl font-semibold mb-3 text-gold">Build vs Buy</h3>
            <p className="text-white/70 mb-4">
              Unless AI is your core business, you should probably buy rather than build. 
              The AI landscape changes rapidly. Buying lets you leverage specialists who 
              stay current so you can focus on your business.
            </p>
            <p className="text-white/70 mb-4">
              Consider building custom solutions only when:
            </p>
            <ul className="space-y-2 text-white/70 mb-6">
              <li>• You have unique data or processes no existing tool handles</li>
              <li>• The solution is core to your competitive advantage</li>
              <li>• You have the in-house expertise to maintain it</li>
            </ul>

            <h2 className="font-display text-2xl font-bold mb-4 mt-8">Chapter 3: Security & Governance</h2>
            <p className="text-white/70 mb-4">
              AI systems often handle sensitive data. Before implementing any AI solution, 
              answer these questions:
            </p>
            <ul className="space-y-2 text-white/70 mb-6">
              <li>• Where will our data be stored and processed?</li>
              <li>• Who has access to the AI models and outputs?</li>
              <li>• How do we ensure compliance with relevant regulations?</li>
              <li>• What is our process for auditing AI decisions?</li>
            </ul>

            <h2 className="font-display text-2xl font-bold mb-4 mt-8">Chapter 4: Implementation</h2>
            <h3 className="text-xl font-semibold mb-3 text-gold">Start with a Pilot</h3>
            <p className="text-white/70 mb-4">
              Run a 30-90 day pilot with a limited scope. Define success metrics upfront. 
              Document everything—what works, what does not, and why. This documentation 
              becomes your playbook for scaling.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-gold">Measuring Success</h3>
            <p className="text-white/70 mb-4">
              Track both quantitative and qualitative metrics:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-gold">Quantitative</h4>
                <ul className="text-white/60 text-sm space-y-1">
                  <li>• Time saved per task</li>
                  <li>• Error reduction percentage</li>
                  <li>• Cost per transaction</li>
                  <li>• Employee satisfaction scores</li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-gold">Qualitative</h4>
                <ul className="text-white/60 text-sm space-y-1">
                  <li>• Employee feedback</li>
                  <li>• Customer satisfaction</li>
                  <li>• Process improvements identified</li>
                  <li>• New capabilities unlocked</li>
                </ul>
              </div>
            </div>

            <h2 className="font-display text-2xl font-bold mb-4 mt-8">Conclusion</h2>
            <p className="text-white/70 mb-6">
              AI automation is a journey, not a destination. The organizations that succeed 
              are those that start small, learn fast, and stay focused on business outcomes 
              rather than technology for its own sake.
            </p>
            <p className="text-white/70 mb-6">
              If you need help getting started, we are here to help. 
              <a href="mailto:mastrianni@caake.org" className="text-gold hover:underline"> Contact us</a> 
              {' '}for a free automation audit.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
