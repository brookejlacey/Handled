import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle,
  CreditCard,
  Users,
  RefreshCw,
  Shield,
  Building,
  PiggyBank,
  FileText,
  Clock,
  Target,
  Heart,
  Sparkles,
  ArrowRight,
  Star,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark-bg text-brand-cream">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-lg border-b border-white/5">
        <div className="page-container">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/icon.png"
                alt="Handled"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="font-bold text-lg">Handled</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-brand-cream/70 hover:text-brand-cream transition-colors text-sm font-medium"
              >
                Log in
              </Link>
              <Link href="/waitlist" className="btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background glow effects */}
        <div className="hero-glow top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2" />
        <div className="hero-glow bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2" />

        <div className="page-container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up">
                Finally get your finances{' '}
                <span className="gradient-text-green">handled</span>
              </h1>
              <p className="text-xl text-brand-cream/70 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Complete the financial tasks you keep putting off. Not another budgeting app—just the guidance you need to check things off your list.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/waitlist" className="btn-primary btn-lg">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="#how-it-works" className="btn-secondary btn-lg">
                  See How It Works
                </Link>
              </div>
            </div>

            {/* Right - Phone mockup */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative animate-float">
                {/* Phone frame */}
                <div className="w-[280px] sm:w-[320px] bg-dark-bg-tertiary rounded-[3rem] p-3 shadow-2xl border border-white/10">
                  <div className="bg-dark-bg rounded-[2.25rem] overflow-hidden">
                    {/* Phone screen content */}
                    <div className="p-6 space-y-4">
                      <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <CheckCircle className="w-6 h-6 text-brand-green" />
                        </div>
                        <p className="text-sm text-brand-cream/50">Your Progress</p>
                        <p className="text-2xl font-bold">5 of 8 completed</p>
                      </div>

                      {/* Task items */}
                      <TaskMockupItem completed title="Check credit score" />
                      <TaskMockupItem completed title="Update beneficiaries" />
                      <TaskMockupItem completed title="Review subscriptions" />
                      <TaskMockupItem completed title="Set up auto-transfer" />
                      <TaskMockupItem completed title="Roll over old 401(k)" />
                      <TaskMockupItem title="Review insurance" />
                      <TaskMockupItem title="Update emergency fund" />
                      <TaskMockupItem title="Check FSA deadline" />
                    </div>
                  </div>
                </div>
                {/* Glow behind phone */}
                <div className="absolute inset-0 -z-10 bg-brand-green/20 blur-3xl rounded-full scale-75" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-12 border-y border-white/5 bg-dark-bg-secondary">
        <div className="page-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-brand-cream/70 text-sm ml-2">4.8 stars on the App Store</span>
            </div>

            <div className="flex items-center gap-2 text-brand-cream/50 text-sm">
              <span>As featured in</span>
              <div className="flex items-center gap-6 ml-4">
                <span className="font-semibold text-brand-cream/40">Forbes</span>
                <span className="font-semibold text-brand-cream/40">Refinery29</span>
                <span className="font-semibold text-brand-cream/40">The Skimm</span>
                <span className="font-semibold text-brand-cream/40 hidden sm:block">Well+Good</span>
                <span className="font-semibold text-brand-cream/40 hidden md:block">Glamour</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="section-dark">
        <div className="page-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Budgeting apps track your money.
              <br />
              <span className="gradient-text-green">Handled gets things done.</span>
            </h2>
            <p className="text-xl text-brand-cream/60 leading-relaxed">
              We&apos;re not here to count your spending. We help you tackle the financial to-dos
              that fall through the cracks—the stuff you know you should do but never quite get around to.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section-dark-alt">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-brand-cream/60 text-lg">Three simple steps to financial peace of mind</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <HowItWorksCard
              step={1}
              title="Tell us about your life"
              description="Quick onboarding identifies which financial tasks matter for your situation—whether you're newly married, changing jobs, or just getting organized."
              icon={<Target className="w-8 h-8" />}
            />
            <HowItWorksCard
              step={2}
              title="Get your personalized checklist"
              description="We surface what needs attention: beneficiaries, old accounts, credit checks, insurance reviews—customized to your life stage."
              icon={<FileText className="w-8 h-8" />}
            />
            <HowItWorksCard
              step={3}
              title="Complete tasks with guidance"
              description="Step-by-step walkthroughs make each task manageable. And yes, we celebrate when you finish—because you deserve it."
              icon={<Sparkles className="w-8 h-8" />}
            />
          </div>
        </div>
      </section>

      {/* Task Examples Section */}
      <section className="section-dark">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Tasks We Help You Complete</h2>
            <p className="text-brand-cream/60 text-lg max-w-2xl mx-auto">
              The financial maintenance you&apos;ve been meaning to do—finally checked off
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <TaskExampleCard icon={<CreditCard />} title="Check your credit score" />
            <TaskExampleCard icon={<Users />} title="Update retirement beneficiaries" />
            <TaskExampleCard icon={<RefreshCw />} title="Roll over old 401(k)" />
            <TaskExampleCard icon={<Shield />} title="Review life insurance coverage" />
            <TaskExampleCard icon={<Building />} title="Consolidate old bank accounts" />
            <TaskExampleCard icon={<PiggyBank />} title="Set up emergency fund auto-transfer" />
            <TaskExampleCard icon={<FileText />} title="Update your will" />
            <TaskExampleCard icon={<Clock />} title="Check FSA/HSA deadlines" />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-dark-alt">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Real Women, Real Progress</h2>
            <p className="text-brand-cream/60 text-lg">Join thousands who&apos;ve finally gotten their finances handled</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="I had 401(k)s from three different jobs just sitting there. Handled walked me through consolidating them, and I actually did it. In one weekend!"
              name="Sarah M."
              detail="38, Marketing Director"
            />
            <TestimonialCard
              quote="After my divorce, I knew I needed to update all my beneficiaries but had no idea where to start. This app made it so simple—and judgment-free."
              name="Jennifer K."
              detail="45, Healthcare Administrator"
            />
            <TestimonialCard
              quote="I always knew I should do this stuff but never knew where to start. Handled breaks everything down into tiny steps that don't feel overwhelming."
              name="Michelle T."
              detail="34, Software Engineer"
            />
          </div>
        </div>
      </section>

      {/* Why Handled Feature Grid */}
      <section className="section-dark">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Handled?</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <FeatureCard
              icon={<Target className="w-6 h-6" />}
              title="Not another budget tracker"
              description="We focus on tasks, not transactions. No spreadsheets, no guilt about your latte habit."
            />
            <FeatureCard
              icon={<RefreshCw className="w-6 h-6" />}
              title="Built for your life stage"
              description="Divorce, new job, new baby? We adjust your checklist as your life changes."
            />
            <FeatureCard
              icon={<CheckCircle className="w-6 h-6" />}
              title="Done is better than perfect"
              description="Small wins add up to big peace of mind. Progress over perfection, always."
            />
            <FeatureCard
              icon={<Heart className="w-6 h-6" />}
              title="Judgment-free zone"
              description="No shame about what you don't know. Just support, guidance, and celebration when you finish."
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section-dark-alt relative overflow-hidden">
        <div className="hero-glow top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="page-container relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Ready to finally check it off?
            </h2>
            <p className="text-xl text-brand-cream/60 mb-8">
              Join the waitlist and be the first to get your finances handled.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link href="/waitlist" className="btn-primary btn-lg">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <p className="text-brand-cream/40 text-sm">
              Free to start. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="page-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <Image
                src="/images/icon.png"
                alt="Handled"
                width={24}
                height={24}
                className="rounded-md opacity-60"
              />
              <span className="text-brand-cream/60 text-sm">
                © 2025 Handled. All rights reserved.
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <Link href="/about" className="text-brand-cream/60 hover:text-brand-cream transition-colors">
                About
              </Link>
              <Link href="/blog" className="text-brand-cream/60 hover:text-brand-cream transition-colors">
                Blog
              </Link>
              <Link href="/privacy" className="text-brand-cream/60 hover:text-brand-cream transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-brand-cream/60 hover:text-brand-cream transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="text-brand-cream/60 hover:text-brand-cream transition-colors">
                Contact
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com/handledfinance"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-cream/40 hover:text-brand-cream transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/handledfinance"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-cream/40 hover:text-brand-cream transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://tiktok.com/@handledfinance"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-cream/40 hover:text-brand-cream transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Component: Task mockup item in phone
function TaskMockupItem({ title, completed = false }: { title: string; completed?: boolean }) {
  return (
    <div className={`flex items-center gap-3 py-2 px-3 rounded-lg ${completed ? 'bg-brand-green/10' : 'bg-dark-bg-secondary'}`}>
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${completed ? 'bg-brand-green' : 'border-2 border-brand-cream/30'}`}>
        {completed && <CheckCircle className="w-3 h-3 text-white" />}
      </div>
      <span className={`text-sm ${completed ? 'text-brand-cream/50 line-through' : 'text-brand-cream'}`}>
        {title}
      </span>
    </div>
  );
}

// Component: How It Works card
function HowItWorksCard({
  step,
  title,
  description,
  icon,
}: {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="feature-card text-center">
      <div className="w-16 h-16 bg-brand-green/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-green">
        {icon}
      </div>
      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-green/20 text-brand-green text-sm font-bold mb-4">
        {step}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-brand-cream/60 leading-relaxed">{description}</p>
    </div>
  );
}

// Component: Task example card
function TaskExampleCard({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="task-card">
      <div className="w-10 h-10 bg-brand-green/20 rounded-xl flex items-center justify-center text-brand-green flex-shrink-0">
        {icon}
      </div>
      <span className="text-sm font-medium">{title}</span>
    </div>
  );
}

// Component: Testimonial card
function TestimonialCard({
  quote,
  name,
  detail,
}: {
  quote: string;
  name: string;
  detail: string;
}) {
  return (
    <div className="testimonial-card">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <p className="text-brand-cream/80 mb-6 leading-relaxed">&ldquo;{quote}&rdquo;</p>
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-brand-cream/50">{detail}</p>
      </div>
    </div>
  );
}

// Component: Feature card
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="feature-card flex gap-4">
      <div className="w-12 h-12 bg-brand-green/20 rounded-xl flex items-center justify-center text-brand-green flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-brand-cream/60 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
