'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Check, ArrowRight } from 'lucide-react';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // TODO: Connect to actual waitlist service (e.g., Mailchimp, ConvertKit, etc.)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitted(true);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="hero-glow top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-md w-full text-center relative z-10">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-brand-cream/50 hover:text-brand-cream transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/images/icon.png"
            alt="Handled"
            width={80}
            height={80}
            className="mx-auto rounded-2xl"
          />
        </div>

        {isSubmitted ? (
          // Success state
          <div>
            <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow-green">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-brand-cream mb-4">
              You&apos;re on the list!
            </h1>
            <p className="text-brand-cream/60">
              We&apos;ll let you know when Handled is ready. Thanks for your interest.
            </p>
          </div>
        ) : (
          // Form state
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-cream mb-4">
              Get early access
            </h1>
            <p className="text-brand-cream/60 mb-8">
              Be the first to know when we launch. No spam, just one email when we&apos;re ready.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-dark text-center"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary btn-lg w-full"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Joining...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Join the waitlist
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </button>
            </form>

            <p className="text-brand-cream/40 text-sm mt-6">
              Free to start. No credit card required.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
