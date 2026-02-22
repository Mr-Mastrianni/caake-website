'use client'

export default function PrivacyPage() {
  return (
    <div className="overflow-hidden">
      <section className="section-padding pt-32">
        <div className="container-custom max-w-4xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-white/60">Last updated: February 2026</p>
            
            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Introduction</h2>
            <p className="text-white/70">
              C.A.A.K.E. Corporation (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed 
              to protecting your personal data. This privacy policy explains how we collect, use, 
              and safeguard your information when you visit our website or use our services.
            </p>

            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Information We Collect</h2>
            <p className="text-white/70">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mt-4">
              <li>Contact information (name, email, phone number)</li>
              <li>Company information</li>
              <li>Communication preferences</li>
              <li>Information provided in forms or surveys</li>
            </ul>

            <h2 className="font-display text-2xl font-bold mt-8 mb-4">How We Use Your Information</h2>
            <p className="text-white/70">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mt-4">
              <li>Provide and maintain our services</li>
              <li>Communicate with you about our services</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Data Security</h2>
            <p className="text-white/70">
              We implement appropriate technical and organizational measures to protect your 
              personal data against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Your Rights</h2>
            <p className="text-white/70">You have the right to:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mt-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Request data portability</li>
            </ul>

            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Contact Us</h2>
            <p className="text-white/70">
              If you have questions about this privacy policy, please contact us at{' '}
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
