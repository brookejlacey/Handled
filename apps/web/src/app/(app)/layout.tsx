'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { signOut } from '@/app/actions/auth';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CheckSquare,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Crown,
} from 'lucide-react';
import { Button } from '@/components/ui';
import type { User } from '@supabase/supabase-js';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/chat', label: 'AI Mentor', icon: MessageSquare },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionTier, setSubscriptionTier] = useState<string>('free');

  useEffect(() => {
    const supabase = createClient();

    // Check current session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        // Fetch user subscription tier from our API
        try {
          const response = await fetch('/api/user/me');
          if (response.ok) {
            const userData = await response.json();
            setSubscriptionTier(userData.subscriptionTier || 'free');
          }
        } catch {
          // Ignore error, default to free tier
        }
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          router.push('/login');
        } else if (session?.user) {
          setUser(session.user);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
  };

  const displayName = user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const displayInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-surface-cream">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-surface-white border-b border-border h-16">
        <div className="flex items-center justify-between px-4 h-full">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-text-secondary hover:text-text-primary"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">H</span>
            </div>
            <span className="font-semibold text-text-primary">Handled</span>
          </Link>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-72 bg-surface-white border-r border-border transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-semibold text-text-primary">Handled</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-text-muted hover:text-text-primary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                    isActive
                      ? 'bg-brand-green-lighter text-brand-green font-medium'
                      : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* Upgrade Banner (for free users) */}
          {subscriptionTier === 'FREE' && (
            <div className="p-4">
              <div className="bg-gradient-to-br from-brand-green to-brand-green-dark rounded-xl p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5" />
                  <span className="font-semibold">Upgrade to Premium</span>
                </div>
                <p className="text-sm text-white/80 mb-3">
                  Unlock unlimited tasks, AI chat, and document analysis.
                </p>
                <Link href="/settings?tab=subscription">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full bg-white text-brand-green hover:bg-surface-cream"
                  >
                    View Plans
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* User Menu */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-brand-green-lighter rounded-full flex items-center justify-center">
                <span className="text-brand-green font-medium">
                  {displayInitial}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text-primary truncate">{displayName}</p>
                <p className="text-sm text-text-secondary truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-text-secondary hover:text-status-error hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
