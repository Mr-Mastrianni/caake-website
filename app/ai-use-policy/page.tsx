'use client'

import Link from 'next/link'

export default function AIUsePolicyPage() {
  return (
    <div className="overflow-hidden">
      <section className="section-padding pt-32">
        <div className="container-custom max-w-4xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            AI Use Policy
          </h1>
          <p className="text-white/60 mb-8">C.A.A.K.E. Corporation&apos;s commitment to responsible AI</p>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-white/70">
              At C.A.A.K.E. Corporation, we believe that artificial intelligence should augment 
              human capabilities while respecting human autonomy and dignity. This policy outlines 
              our principles and practices for the ethical development and deployment of AI systems.
            </p>

            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Data Boundaries</h2>
            <p className="text-white/70">We commit to the following data practices:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mt-4">
              <li>We do not use client data to train models without explicit written consent</li>
              <li>We maintain strict data segregation between clients</li>
              <li>We implement automatic PII detection and masking in all AI workflows</li>
              <li>We offer data residency options for clients with geographic requirements</li>
              <li>We retain data only as long as necessary for the specified purpose</li>
            </ul>

            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Human Oversight</h2>
            <p className="text-white/70">AI systems should support, not replace, human judgment:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mt-4">
              <li>All high-stakes decisions include human review checkpoints</li>
              <li>Users can always request human review of AI-generated outputs</li>
              <li>AI systems provide clear explanations for their recommendations</li>
              <li>Humans have the final authority to override AI decisions</li>
              <li>We maintain human oversight throughout the AI lifecycle</li>
            </ul>

            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Tool and Model Boundaries</h2>
            <p className="text-white/70">We carefully select and manage the AI tools we use:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mt-4">
              <li>We use only vetted, enterprise-grade AI model providers</li>
              <li>All models undergo security and bias testing before deployment</li>
              <li>We maintain version control for all models in production</li>
              <li>We monitor model performance and drift continuously</li>
              <li>We have rollback procedures for model updates</li>
            </ul>

            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Transparency</h2>
            <p className="text-white/70">We are committed to transparency in our AI systems:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mt-4">
              <li>We disclose when AI is being used in our services</li>
              <li>We provide clear explanations of how AI systems make decisions</li>
              <li>We document limitations and potential biases of our AI systems</li>
              <li>We maintain audit logs of all AI decisions and actions</li>
            </ul>

            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Incident Response</h2>
            <p className="text-white/70">If something goes wrong, we respond quickly:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mt-4">
              <li>We have 24/7 monitoring for AI system anomalies</li>
              <li>We notify affected clients within 24 hours of any incident</li>
              <li>We conduct post-incident reviews and implement improvements</li>
              <li>We maintain incident response playbooks for common scenarios</li>
            </ul>

            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Contact</h2>
            <p className="text-white/70">
              For questions about our AI Use Policy, please contact us at{' '}
              <a href="mailto:mastrianni@caake.org" className="text-gold hover:underline">
                mastrianni@caake.org
              </a>
            </p>

            <div className="mt-12 p-6 rounded-xl bg-cosmic border border-white/10">
              <h3 className="font-display text-xl font-bold mb-4">Related Policies</h3>
              <div className="flex flex-wrap gap-4">
                <Link href="/privacy" className="text-gold hover:underline">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gold hover:underline">
                  Terms of Service
                </Link>
                <Link href="/security-governance" className="text-gold hover:underline">
                  Security & Governance
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
