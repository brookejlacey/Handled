import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-cream flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-green relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-green-dark/20 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <span className="text-2xl font-semibold text-white">Handled</span>
          </Link>

          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-white mb-6">
              Take control of your financial life
            </h1>
            <p className="text-lg text-white/80 mb-8">
              Personalized tasks, AI guidance, and document analysis. Everything you need to stop feeling behind.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {['S', 'J', 'E', 'M'].map((letter, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-white/20 border-2 border-white flex items-center justify-center"
                  >
                    <span className="text-white font-medium text-sm">{letter}</span>
                  </div>
                ))}
              </div>
              <p className="text-white/80 text-sm">
                Join 10,000+ people who have gotten their finances handled
              </p>
            </div>
          </div>

          <div className="text-white/60 text-sm">
            &copy; {new Date().getFullYear()} Handled. All rights reserved.
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full" />
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <span className="text-2xl font-semibold text-text-primary">Handled</span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
