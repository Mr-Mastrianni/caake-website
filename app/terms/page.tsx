'use client'

export default function TermsPage() {
  return (
    <div className="overflow-hidden">
      <section className="section-padding pt-32">
        <div className="container-custom max-w-4xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-8">
            Terms of Service
          </h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-white/60">Last updated: February 2026</p>
            
            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Agreement to Terms</h2>
            <p className="text-white/70">
              By accessing or using the services of C.A.A.K.E. Corporation (&quot;Company,&quot; &quot;we,&quot; 
              &quot;us,&quot; or &quot;our&quot;), you agree to be bound by these Terms of Service. If you do not 
              agree to these terms, please do not use our services.
            </p>

            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Use of Services</h2>
            <p className="text-white/70">You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mt-4">
              <li>Use our services in any way that violates applicable laws</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with other users&apos; access to our services</li>
              <li>Use our services to transmit harmful code or content</li>
            </ul>

            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Intellectual Property</h2>
            <p className="text-white/70">
              All content, features, and functionality of our services are owned by C.A.A.K.E. 
              Corporation and are protected by copyright, trademark, and other intellectual 
              property laws.
            </p>

            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Limitation of Liability</h2>
            <p className="text-white/70">
              To the maximum extent permitted by law, C.A.A.K.E. Corporation shall not be 
              liable for any indirect, incidental, special, consequential, or punitive damages 
              arising out of or relating to your use of our services.
            </p>

            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Governing Law</h2>
            <p className="text-white/70">
              These Terms shall be governed by and construed in accordance with the laws of 
              the State of Arizona, without regard to its conflict of law provisions.
            </p>

            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Changes to Terms</h2>
            <p className="text-white/70">
              We reserve the right to modify these Terms at any time. We will notify you of 
              any material changes by posting the new Terms on this page.
            </p>

            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Contact Information</h2>
            <p className="text-white/70">
              If you have any questions about these Terms, please contact us at{' '}
              <a href="mailto:mastrianni@caake.org" className="text-gold hover:underline">
                mastrianni@caake.org
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
