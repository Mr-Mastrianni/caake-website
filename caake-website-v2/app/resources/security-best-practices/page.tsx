'use client'

import { ArrowLeft, FileText, Shield, Lock, Eye, Database, AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const principles = [
  {
    icon: Lock,
    title: 'Data Encryption',
    description: 'All data should be encrypted in transit and at rest. Use industry-standard encryption protocols.'
  },
  {
    icon: Eye,
    title: 'Access Control',
    description: 'Implement principle of least privilege. Only give AI systems access to data they absolutely need.'
  },
  {
    icon: Database,
    title: 'Data Minimization',
    description: 'Collect and process only the data necessary for the specific task. Delete when no longer needed.'
  },
  {
    icon: AlertTriangle,
    title: 'Monitoring & Auditing',
    description: 'Log all AI system activities. Regularly audit outputs for bias, errors, and security issues.'
  }
]

export default function SecurityBestPractices() {
  return (
    <div className="overflow-hidden">
      <section className="section-padding pt-32">
        <div className="container-custom max-w-4xl">
          <Link href="/resources" className="text-gold text-sm flex items-center gap-2 mb-8 hover:underline">
            <ArrowLeft size={16} /> Back to Resources
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-gold" />
            <span className="text-gold text-sm font-medium uppercase tracking-wider">Whitepaper</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Security Best Practices for AI
          </h1>

          <p className="text-xl text-white/60 mb-12">
            A practical guide to securing your AI implementations. Learn how to protect 
            your data, ensure compliance, and manage risk.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {principles.map((principle) => (
              <div key={principle.title} className="card p-6">
                <principle.icon className="w-10 h-10 text-gold mb-4" />
                <h3 className="font-display text-xl font-bold mb-2">{principle.title}</h3>
                <p className="text-white/60 text-sm">{principle.description}</p>
              </div>
            ))}
          </div>

          <div className="prose prose-invert max-w-none">
            <h2 className="font-display text-2xl font-bold mb-4">Executive Summary</h2>
            <p className="text-white/70 mb-6">
              AI security is not fundamentally different from traditional software security, 
              but it does introduce unique challenges. AI systems often handle sensitive data, 
              make autonomous decisions, and can be vulnerable to new types of attacks like 
              prompt injection and model inversion.
            </p>
            <p className="text-white/70 mb-6">
              This whitepaper provides actionable guidance for securing AI implementations 
              at enterprise scale. It covers data protection, access control, compliance, 
              and operational security.
            </p>

            <h2 className="font-display text-2xl font-bold mb-4 mt-8">1. Data Protection</h2>
            
            <h3 className="text-xl font-semibold mb-3 text-gold">Understanding Your Data</h3>
            <p className="text-white/70 mb-4">
              Before implementing any AI solution, classify your data:
            </p>
            <ul className="space-y-2 text-white/70 mb-6">
              <li><strong>Public:</strong> Information that can be freely shared</li>
              <li><strong>Internal:</strong> Business information not meant for public disclosure</li>
              <li><strong>Confidential:</strong> Sensitive business data, customer information</li>
              <li><strong>Restricted:</strong> Highly sensitive data (PII, PHI, financial records)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-gold">Data Handling Requirements</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 text-gold">Data Type</th>
                    <th className="text-left py-3 text-gold">Encryption</th>
                    <th className="text-left py-3 text-gold">Access Control</th>
                    <th className="text-left py-3 text-gold">Logging</th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  <tr className="border-b border-white/10">
                    <td className="py-3">Public</td>
                    <td>In transit</td>
                    <td>Basic authentication</td>
                    <td>Standard</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3">Internal</td>
                    <td>In transit + at rest</td>
                    <td>Role-based</td>
                    <td>Standard</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3">Confidential</td>
                    <td>AES-256</td>
                    <td>Role-based + MFA</td>
                    <td>Enhanced</td>
                  </tr>
                  <tr>
                    <td className="py-3">Restricted</td>
                    <td>AES-256 + tokenization</td>
                    <td>Zero-trust</td>
                    <td>Comprehensive</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="font-display text-2xl font-bold mb-4 mt-8">2. Access Control</h2>
            
            <h3 className="text-xl font-semibold mb-3 text-gold">Principle of Least Privilege</h3>
            <p className="text-white/70 mb-4">
              AI systems should only have access to the minimum data and capabilities 
              required to perform their specific function. This limits the blast radius 
              if the system is compromised.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-gold">Authentication & Authorization</h3>
            <ul className="space-y-3 text-white/70 mb-6">
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-gold flex-shrink-0" />
                <span>Use multi-factor authentication for all administrative access</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-gold flex-shrink-0" />
                <span>Implement API key rotation every 90 days</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-gold flex-shrink-0" />
                <span>Use short-lived tokens for service-to-service communication</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-gold flex-shrink-0" />
                <span>Regularly audit access permissions</span>
              </li>
            </ul>

            <h2 className="font-display text-2xl font-bold mb-4 mt-8">3. Compliance Considerations</h2>
            
            <h3 className="text-xl font-semibold mb-3 text-gold">GDPR Compliance</h3>
            <p className="text-white/70 mb-4">
              If you process EU citizen data:
            </p>
            <ul className="space-y-2 text-white/70 mb-6">
              <li>• Obtain explicit consent for AI processing</li>
              <li>• Implement right to explanation for automated decisions</li>
              <li>• Maintain data processing records</li>
              <li>• Enable data portability and deletion</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-gold">HIPAA Compliance</h3>
            <p className="text-white/70 mb-4">
              For healthcare data:
            </p>
            <ul className="space-y-2 text-white/70 mb-6">
              <li>• Execute Business Associate Agreements with all vendors</li>
              <li>• Implement audit controls and access logs</li>
              <li>• Ensure data encryption at rest and in transit</li>
              <li>• Regular risk assessments</li>
            </ul>

            <h2 className="font-display text-2xl font-bold mb-4 mt-8">4. Operational Security</h2>
            
            <h3 className="text-xl font-semibold mb-3 text-gold">Prompt Injection Prevention</h3>
            <p className="text-white/70 mb-4">
              Prompt injection attacks attempt to manipulate AI systems by crafting 
              malicious inputs. Defend against them by:
            </p>
            <ul className="space-y-2 text-white/70 mb-6">
              <li>• Validating and sanitizing all user inputs</li>
              <li>• Using prompt boundaries and delimiters</li>
              <li>• Implementing output filtering</li>
              <li>• Never executing AI-generated code without review</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-gold">Model Security</h3>
            <ul className="space-y-2 text-white/70 mb-6">
              <li>• Keep model versions and dependencies updated</li>
              <li>• Monitor for model drift and unexpected behavior</li>
              <li>• Implement circuit breakers for anomalous outputs</li>
              <li>• Use private endpoints for sensitive applications</li>
            </ul>

            <h2 className="font-display text-2xl font-bold mb-4 mt-8">5. Incident Response</h2>
            <p className="text-white/70 mb-4">
              Prepare for security incidents before they happen:
            </p>
            <ol className="space-y-3 text-white/70 mb-6">
              <li><strong>1. Detection:</strong> Monitor logs for unusual patterns and set up alerts</li>
              <li><strong>2. Containment:</strong> Have procedures to quickly disable AI systems if compromised</li>
              <li><strong>3. Investigation:</strong> Preserve logs and evidence for forensic analysis</li>
              <li><strong>4. Recovery:</strong> Document rollback procedures and backup restoration</li>
              <li><strong>5. Post-Incident:</strong> Conduct blameless postmortems and update security measures</li>
            </ol>

            <h2 className="font-display text-2xl font-bold mb-4 mt-8">Security Checklist</h2>
            <div className="bg-white/5 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Data classified and encrypted',
                  'Access controls implemented',
                  'Audit logging enabled',
                  'Input validation in place',
                  'Regular security assessments',
                  'Incident response plan documented',
                  'Staff trained on AI security',
                  'Vendor security reviews completed',
                  'Compliance requirements met',
                  'Backup and recovery tested'
                ].map((item) => (
                  <label key={item} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded border-white/20 bg-white/5 text-gold focus:ring-gold" />
                    <span className="text-white/70 text-sm">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <h2 className="font-display text-2xl font-bold mb-4">Conclusion</h2>
            <p className="text-white/70 mb-6">
              AI security is an ongoing process, not a one-time setup. Regular reviews, 
              testing, and updates are essential as both threats and capabilities evolve.
            </p>
            <p className="text-white/70 mb-6">
              Need help securing your AI implementation? 
              <a href="mailto:mastrianni@caake.org" className="text-gold hover:underline"> Contact us</a> 
              {' '}for a security assessment.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
