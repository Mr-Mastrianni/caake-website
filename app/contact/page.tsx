'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsSending(true)
    const f = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'contact',
          name: `${f.get('first') ?? ''} ${f.get('last') ?? ''}`.trim(),
          email: f.get('email'),
          message: `[${f.get('subject')}] ${f.get('message') ?? ''}`,
          website: f.get('website') ?? '',
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong')
      }
      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please email us directly.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="section-padding pt-32">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-gold text-sm font-medium uppercase tracking-wider">Contact</span>
            <h1 className="font-display text-5xl md:text-6xl font-bold mt-4 mb-6">
              Get in <span className="text-gold-gradient">Touch</span>
            </h1>
            <p className="text-xl text-white/60">
              Have a question or want to learn more? We&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div>
              <h2 className="font-display text-3xl font-bold mb-8">
                Let&apos;s <span className="text-gold">Talk</span>
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a href="mailto:mastrianni@caake.org" className="text-white/60 hover:text-gold transition-colors">
                      mastrianni@caake.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <a href="tel:+14803641164" className="text-white/60 hover:text-gold transition-colors">
                      480-364-1164
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-white/60">
                      Fishers, Indiana<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 rounded-xl bg-cosmic/50 border border-white/10">
                <h3 className="font-display text-xl font-bold mb-2">Ready to get started?</h3>
                <p className="text-white/60 mb-4">
                  Book a strategy call and get your personalized automation roadmap.
                </p>
                <a href="mailto:mastrianni@caake.org" className="btn btn-primary w-full justify-center">
                  Book Strategy Call
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              {!isSubmitted ? (
                <div className="card p-8">
                  <h3 className="font-display text-xl font-bold mb-6">Send a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name</label>
                        <input
                          name="first"
                          type="text"
                          required
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-gold focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name</label>
                        <input
                          name="last"
                          type="text"
                          required
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-gold focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        name="email"
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-gold focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Subject</label>
                      <select name="subject" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-gold focus:outline-none transition-colors">
                        <option className="bg-midnight text-white">General Inquiry</option>
                        <option className="bg-midnight text-white">Sales</option>
                        <option className="bg-midnight text-white">Support</option>
                        <option className="bg-midnight text-white">Partnerships</option>
                        <option className="bg-midnight text-white">Careers</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Message</label>
                      <textarea
                        name="message"
                        rows={5}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-gold focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
                    <button type="submit" disabled={isSending} className="btn btn-primary w-full justify-center disabled:opacity-60">
                      {isSending ? 'Sending...' : 'Send Message'}
                      <Send className="ml-2" size={16} />
                    </button>
                  </form>
                </div>
              ) : (
                <div className="card p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-gold" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-4">Message Sent!</h3>
                  <p className="text-white/60">
                    Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
