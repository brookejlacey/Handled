'use client';

import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-surface-cream py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-brand-green hover:underline mb-8 inline-block">
          &larr; Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-text-primary mb-4">Terms of Service</h1>
        <p className="text-text-secondary mb-8">Last updated: January 18, 2026</p>

        <div className="prose prose-lg max-w-none text-text-primary">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-text-secondary mb-4">
              By accessing or using Handled (&quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-text-secondary mb-4">
              Handled is a financial task management platform that helps users organize and complete personal finance tasks. Our Service includes:
            </p>
            <ul className="list-disc pl-6 text-text-secondary mb-4">
              <li>Personalized financial task recommendations</li>
              <li>AI-powered document analysis and insights</li>
              <li>Progress tracking and reminders</li>
              <li>Educational financial guidance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Not Financial Advice</h2>
            <p className="text-text-secondary mb-4 font-semibold">
              IMPORTANT: Handled is not a financial advisor, investment advisor, tax advisor, or legal advisor. The information and recommendations provided through our Service are for educational and informational purposes only.
            </p>
            <p className="text-text-secondary mb-4">
              You should consult with qualified professionals before making any financial, investment, tax, or legal decisions. We do not guarantee any specific outcomes or results from using our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. User Accounts</h2>
            <p className="text-text-secondary mb-4">To use certain features, you must create an account. You agree to:</p>
            <ul className="list-disc pl-6 text-text-secondary mb-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
            <p className="text-text-secondary mb-4">You must be at least 18 years old to use our Service.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Subscriptions and Payments</h2>
            <p className="text-text-secondary mb-4">
              Some features require a paid subscription. By subscribing, you agree to:
            </p>
            <ul className="list-disc pl-6 text-text-secondary mb-4">
              <li>Pay all applicable fees as described at the time of purchase</li>
              <li>Automatic renewal of your subscription unless cancelled</li>
              <li>Cancellation must be made before the renewal date to avoid charges</li>
            </ul>
            <p className="text-text-secondary mb-4">
              Payments are processed securely through Stripe. Refunds are provided at our discretion and in accordance with applicable law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. User Content</h2>
            <p className="text-text-secondary mb-4">
              You may upload documents and other content to our Service. You retain ownership of your content, but grant us a limited license to process, analyze, and store it to provide our Service.
            </p>
            <p className="text-text-secondary mb-4">You represent that you have the right to upload any content and that it does not violate any laws or third-party rights.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Prohibited Uses</h2>
            <p className="text-text-secondary mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-text-secondary mb-4">
              <li>Use the Service for any illegal purpose</li>
              <li>Upload malicious content or attempt to compromise our systems</li>
              <li>Share your account with others or create multiple accounts</li>
              <li>Reverse engineer or attempt to extract our source code</li>
              <li>Use automated systems to access the Service without permission</li>
              <li>Interfere with other users&apos; use of the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
            <p className="text-text-secondary mb-4">
              The Service, including its design, features, and content (excluding user content), is owned by Handled and protected by intellectual property laws. You may not copy, modify, or distribute our materials without permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Disclaimer of Warranties</h2>
            <p className="text-text-secondary mb-4">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
            <p className="text-text-secondary mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, HANDLED SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.
            </p>
            <p className="text-text-secondary mb-4">
              OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING FROM YOUR USE OF THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Indemnification</h2>
            <p className="text-text-secondary mb-4">
              You agree to indemnify and hold harmless Handled and its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Termination</h2>
            <p className="text-text-secondary mb-4">
              We may suspend or terminate your account at any time for violation of these Terms or for any other reason at our discretion. You may delete your account at any time through your account settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Changes to Terms</h2>
            <p className="text-text-secondary mb-4">
              We may modify these Terms at any time. We will notify you of material changes by email or through the Service. Your continued use after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14. Governing Law</h2>
            <p className="text-text-secondary mb-4">
              These Terms shall be governed by the laws of the State of Delaware, without regard to conflict of law principles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">15. Dispute Resolution</h2>
            <p className="text-text-secondary mb-4">
              Any disputes arising from these Terms or your use of the Service shall be resolved through binding arbitration in accordance with the American Arbitration Association rules, except that you may bring claims in small claims court if eligible.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">16. Contact Us</h2>
            <p className="text-text-secondary mb-4">
              If you have questions about these Terms, please contact us at:
            </p>
            <p className="text-text-secondary">
              Email: legal@handled.finance<br />
              Website: https://handled.finance
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
