'use client';

import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-surface-cream py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-brand-green hover:underline mb-8 inline-block">
          &larr; Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-text-primary mb-4">Privacy Policy</h1>
        <p className="text-text-secondary mb-8">Last updated: January 18, 2026</p>

        <div className="prose prose-lg max-w-none text-text-primary">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-text-secondary mb-4">
              Handled (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our financial task management application and website at handled.finance (the &quot;Service&quot;).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-medium mb-2">Personal Information</h3>
            <p className="text-text-secondary mb-4">We may collect personal information that you voluntarily provide, including:</p>
            <ul className="list-disc pl-6 text-text-secondary mb-4">
              <li>Name and email address</li>
              <li>Account credentials</li>
              <li>Financial goals and preferences you share with us</li>
              <li>Documents you upload for analysis</li>
              <li>Payment information (processed securely by Stripe)</li>
            </ul>

            <h3 className="text-xl font-medium mb-2">Automatically Collected Information</h3>
            <p className="text-text-secondary mb-4">When you use our Service, we automatically collect:</p>
            <ul className="list-disc pl-6 text-text-secondary mb-4">
              <li>Device and browser information</li>
              <li>IP address and location data</li>
              <li>Usage patterns and preferences</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="text-text-secondary mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 text-text-secondary mb-4">
              <li>Provide and personalize our financial task management services</li>
              <li>Process your transactions and manage your subscription</li>
              <li>Analyze documents you upload to provide AI-powered insights</li>
              <li>Send you updates, notifications, and support messages</li>
              <li>Improve our Service and develop new features</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. AI and Document Processing</h2>
            <p className="text-text-secondary mb-4">
              Our Service uses artificial intelligence (powered by Anthropic&apos;s Claude) to analyze documents and provide personalized financial guidance. When you upload documents:
            </p>
            <ul className="list-disc pl-6 text-text-secondary mb-4">
              <li>Documents are processed securely and encrypted</li>
              <li>We do not sell or share your document contents with third parties</li>
              <li>AI analysis is used solely to provide you with insights and recommendations</li>
              <li>You can delete your documents at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Sharing and Disclosure</h2>
            <p className="text-text-secondary mb-4">We may share your information with:</p>
            <ul className="list-disc pl-6 text-text-secondary mb-4">
              <li><strong>Service Providers:</strong> Third parties that help us operate our Service (e.g., Supabase for authentication, Stripe for payments, Vercel for hosting)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
            <p className="text-text-secondary mb-4">We do not sell your personal information to third parties.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
            <p className="text-text-secondary mb-4">
              We implement appropriate technical and organizational measures to protect your personal information, including encryption, secure servers, and access controls. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
            <p className="text-text-secondary mb-4">Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 text-text-secondary mb-4">
              <li>Access and receive a copy of your personal data</li>
              <li>Rectify or update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Object to or restrict processing of your data</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="text-text-secondary mb-4">To exercise these rights, contact us at privacy@handled.finance.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Cookies</h2>
            <p className="text-text-secondary mb-4">
              We use cookies and similar technologies to enhance your experience, analyze usage, and assist in our marketing efforts. You can control cookies through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Children&apos;s Privacy</h2>
            <p className="text-text-secondary mb-4">
              Our Service is not intended for children under 18. We do not knowingly collect personal information from children under 18.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
            <p className="text-text-secondary mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
            <p className="text-text-secondary mb-4">
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-text-secondary">
              Email: privacy@handled.finance<br />
              Website: https://handled.finance
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
