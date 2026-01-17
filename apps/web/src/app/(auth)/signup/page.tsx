'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Input, Card } from '@/components/ui';
import { signup, signInWithGoogle, signInWithApple } from '@/app/actions/auth';
import { Mail, Lock, User, AlertCircle, Check } from 'lucide-react';

export default function SignupPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await signup(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
    // If successful, the action will redirect
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const result = await signInWithGoogle();
    if (result?.error) {
      setError(result.error);
      setIsGoogleLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsAppleLoading(true);
    const result = await signInWithApple();
    if (result?.error) {
      setError(result.error);
      setIsAppleLoading(false);
    }
  };

  const passwordRequirements = [
    { met: password.length >= 8, text: 'At least 8 characters' },
    { met: /[A-Z]/.test(password), text: 'One uppercase letter' },
    { met: /[0-9]/.test(password), text: 'One number' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Create your account</h1>
        <p className="text-text-secondary">
          Start your journey to financial clarity
        </p>
      </div>

      <Card padding="lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-status-error text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <Input
              type="text"
              name="name"
              placeholder="Full name"
              className="pl-11"
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <Input
              type="email"
              name="email"
              placeholder="Email address"
              className="pl-11"
              required
            />
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <Input
                type="password"
                name="password"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-11"
                required
              />
            </div>
            {password && (
              <div className="mt-3 space-y-1.5">
                {passwordRequirements.map((req, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 text-xs ${
                      req.met ? 'text-brand-green' : 'text-text-muted'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 ${req.met ? 'opacity-100' : 'opacity-30'}`} />
                    {req.text}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 rounded border-border text-brand-green focus:ring-brand-green"
              required
            />
            <label htmlFor="terms" className="text-sm text-text-secondary">
              I agree to the{' '}
              <Link href="/terms" className="text-brand-green hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-brand-green hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-surface-white text-text-muted">or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            type="button"
            className="w-full"
            onClick={handleGoogleSignIn}
            isLoading={isGoogleLoading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>
          <Button
            variant="secondary"
            type="button"
            className="w-full"
            onClick={handleAppleSignIn}
            isLoading={isAppleLoading}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
            </svg>
            Apple
          </Button>
        </div>
      </Card>

      <p className="text-center mt-6 text-text-secondary">
        Already have an account?{' '}
        <Link href="/login" className="text-brand-green font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
