'use client'

import { ArrowLeft, Video, Clock, Users, Play, CheckCircle, Lightbulb, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const keyTakeaways = [
  {
    icon: Lightbulb,
    title: 'What Are AI Agents',
    description: 'Understanding autonomous AI systems that can plan, act, and adapt without constant human guidance.'
  },
  {
    icon: TrendingUp,
    title: 'Business Applications',
    description: 'Real-world use cases across operations, customer service, sales, and internal workflows.'
  },
  {
    icon: AlertCircle,
    title: 'Implementation Challenges',
    description: 'Common pitfalls and how to avoid them when deploying agentic AI systems.'
  },
  {
    icon: CheckCircle,
    title: 'Getting Started',
    description: 'Practical steps to begin experimenting with AI agents in your organization.'
  }
]

const chapters = [
  { time: '00:00', title: 'Introduction to AI Agents', duration: '5 min' },
  { time: '05:30', title: 'How Agents Differ from Traditional AI', duration: '12 min' },
  { time: '17:45', title: 'Real-World Use Cases', duration: '18 min' },
  { time: '36:00', title: 'Architecture & Components', duration: '15 min' },
  { time: '51:15', title: 'Security Considerations', duration: '10 min' },
  { time: '61:30', title: 'Q&A Session', duration: '12 min' },
]

export default function AIAgentsWebinar() {
  return (
    <div className="overflow-hidden">
      <section className="section-padding pt-32">
        <div className="container-custom max-w-4xl">
          <Link href="/resources" className="text-gold text-sm flex items-center gap-2 mb-8 hover:underline">
            <ArrowLeft size={16} /> Back to Resources
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <Video className="w-6 h-6 text-gold" />
            <span className="text-gold text-sm font-medium uppercase tracking-wider">Webinar</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
            The Future of Work: AI Agents
          </h1>

          <p className="text-xl text-white/60 mb-8">
            How autonomous AI agents are transforming business operations and what 
            it means for your organization.
          </p>

          <div className="flex flex-wrap items-center gap-6 text-white/60 text-sm mb-12">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>73 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Recorded February 2025</span>
            </div>
          </div>

          {/* Video Placeholder */}
          <div className="card p-2 mb-12">
            <div className="aspect-video bg-gradient-to-br from-gold/20 to-purple/20 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-midnight/50" />
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 rounded-full bg-gold/30 flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-gold/40 transition-colors">
                  <Play className="w-8 h-8 text-gold ml-1" />
                </div>
                <p className="text-white/80 font-medium">Watch the Recording</p>
                <p className="text-white/50 text-sm mt-1">Video content coming soon</p>
              </div>
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold mb-6">Key Takeaways</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {keyTakeaways.map((takeaway) => (
                <div key={takeaway.title} className="card p-6">
                  <takeaway.icon className="w-10 h-10 text-gold mb-4" />
                  <h3 className="font-display text-xl font-bold mb-2">{takeaway.title}</h3>
                  <p className="text-white/60 text-sm">{takeaway.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chapters */}
          <div className="card p-6 mb-12">
            <h2 className="font-display text-xl font-bold mb-6">Webinar Chapters</h2>
            <div className="space-y-3">
              {chapters.map((chapter, index) => (
                <div 
                  key={chapter.title}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <span className="text-gold font-mono text-sm w-12">{chapter.time}</span>
                  <div className="flex-1">
                    <h3 className="font-medium">{chapter.title}</h3>
                  </div>
                  <span className="text-white/40 text-sm">{chapter.duration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Content */}
          <div className="prose prose-invert max-w-none">
            <h2 className="font-display text-2xl font-bold mb-4">Webinar Summary</h2>
            
            <h3 className="text-xl font-semibold mb-3 text-gold">What Are AI Agents?</h3>
            <p className="text-white/70 mb-4">
              AI agents are autonomous systems that can perceive their environment, make decisions, 
              and take actions to achieve specific goals. Unlike traditional AI that responds to 
              individual prompts, agents can:
            </p>
            <ul className="space-y-2 text-white/70 mb-6">
              <li>• Plan multi-step tasks and execute them independently</li>
              <li>• Use tools and APIs to interact with external systems</li>
              <li>• Learn from feedback and adapt their behavior</li>
              <li>• Maintain context and memory across interactions</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-gold">How Agents Differ from Traditional AI</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 text-gold">Aspect</th>
                    <th className="text-left py-3 text-gold">Traditional AI</th>
                    <th className="text-left py-3 text-gold">AI Agents</th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  <tr className="border-b border-white/10">
                    <td className="py-3">Interaction</td>
                    <td>Single-turn responses</td>
                    <td>Multi-turn, stateful</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3">Planning</td>
                    <td>None - responds to input</td>
                    <td>Decomposes goals into steps</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3">Tools</td>
                    <td>Cannot use external tools</td>
                    <td>Can call APIs, query databases</td>
                  </tr>
                  <tr>
                    <td className="py-3">Memory</td>
                    <td>Limited context window</td>
                    <td>Persistent memory & learning</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold mb-3 text-gold">Real-World Use Cases</h3>
            
            <h4 className="font-semibold mb-2 text-white">Customer Service Agent</h4>
            <p className="text-white/70 mb-4">
              An AI agent that can handle complex customer inquiries by checking order status, 
              processing returns, updating account information, and escalating to humans when needed—all 
              in a single conversation without pre-defined scripts.
            </p>

            <h4 className="font-semibold mb-2 text-white">Research Analyst</h4>
            <p className="text-white/70 mb-4">
              An agent that continuously monitors industry news, analyzes competitor movements, 
              summarizes relevant information, and generates weekly reports for the strategy team.
            </p>

            <h4 className="font-semibold mb-2 text-white">DevOps Assistant</h4>
            <p className="text-white/70 mb-4">
              An agent that monitors system metrics, identifies anomalies, creates tickets, 
              suggests fixes, and can even implement approved changes through your deployment pipeline.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-gold mt-8">Implementation Considerations</h3>
            
            <div className="bg-gold/10 border border-gold/20 rounded-lg p-6 my-6">
              <h4 className="font-semibold mb-3">When to Use Agents</h4>
              <ul className="space-y-2 text-white/70">
                <li>• Tasks requiring multiple steps and decisions</li>
                <li>• Processes that benefit from autonomy</li>
                <li>• Situations where context needs to be maintained</li>
                <li>• Workflows involving multiple tools or systems</li>
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6 my-6">
              <h4 className="font-semibold mb-3">When NOT to Use Agents</h4>
              <ul className="space-y-2 text-white/70">
                <li>• Simple, single-step tasks (overkill)</li>
                <li>• High-stakes decisions requiring human judgment</li>
                <li>• Processes with strict regulatory requirements</li>
                <li>• When you need predictable, deterministic outputs</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold mb-3 text-gold">Getting Started</h3>
            <p className="text-white/70 mb-4">
              If you are interested in experimenting with AI agents:
            </p>
            <ol className="space-y-3 text-white/70 mb-6">
              <li><strong>1. Start small:</strong> Pick a contained task with clear success criteria</li>
              <li><strong>2. Define guardrails:</strong> Set clear boundaries on what the agent can and cannot do</li>
              <li><strong>3. Plan for supervision:</strong> Build in human oversight and approval checkpoints</li>
              <li><strong>4. Measure everything:</strong> Track performance, errors, and business impact</li>
              <li><strong>5. Iterate:</strong> Use feedback to improve the agent over time</li>
            </ol>

            <h3 className="text-xl font-semibold mb-3 text-gold">The Future</h3>
            <p className="text-white/70 mb-6">
              AI agents represent a fundamental shift in how we think about automation. Instead of 
              programming specific behaviors, we are defining goals and letting AI figure out how to 
              achieve them. This opens up possibilities for automation that were previously impractical, 
              but it also requires new approaches to security, governance, and human-AI collaboration.
            </p>

            <div className="bg-white/5 rounded-lg p-6 mt-8">
              <p className="text-white/70 mb-4">
                Want to explore how AI agents could work in your organization?
              </p>
              <a 
                href="mailto:mastrianni@caake.org" 
                className="btn btn-primary inline-flex"
              >
                Schedule a Consultation
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
