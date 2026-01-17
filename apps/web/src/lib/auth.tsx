'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// User type that matches what pages expect
export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  subscriptionTier: 'free' | 'monthly' | 'annual';
  subscriptionStatus?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  supabaseUser: SupabaseUser | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Default context value for SSR/SSG
const defaultContextValue: AuthContextType = {
  user: null,
  supabaseUser: null,
  isLoading: true,
  signOut: async () => {},
  refreshUser: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

// Transform Supabase user to our AuthUser format
function transformUser(supabaseUser: SupabaseUser | null, profileData?: { subscriptionTier?: string; displayName?: string }): AuthUser | null {
  if (!supabaseUser) return null;

  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    displayName: profileData?.displayName ||
                 supabaseUser.user_metadata?.display_name ||
                 supabaseUser.user_metadata?.full_name ||
                 supabaseUser.email?.split('@')[0] ||
                 'User',
    avatarUrl: supabaseUser.user_metadata?.avatar_url,
    subscriptionTier: (profileData?.subscriptionTier?.toLowerCase() as AuthUser['subscriptionTier']) || 'free',
    subscriptionStatus: 'active',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const fetchUserProfile = useCallback(async (supabaseUser: SupabaseUser): Promise<AuthUser | null> => {
    try {
      const response = await fetch('/api/user/me');
      if (response.ok) {
        const profileData = await response.json();
        return transformUser(supabaseUser, profileData);
      }
    } catch {
      // Ignore error, use default values
    }
    return transformUser(supabaseUser);
  }, []);

  const refreshUser = useCallback(async () => {
    if (typeof window === 'undefined') return;

    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      setSupabaseUser(session.user);
      const authUser = await fetchUserProfile(session.user);
      setUser(authUser);
    } else {
      setSupabaseUser(null);
      setUser(null);
    }
  }, [fetchUserProfile]);

  useEffect(() => {
    setIsMounted(true);

    // Only run on client
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    const initAuth = async () => {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      // Check current session
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setSupabaseUser(session.user);
        const authUser = await fetchUserProfile(session.user);
        setUser(authUser);
      }
      setIsLoading(false);

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_OUT' || !session) {
            setSupabaseUser(null);
            setUser(null);
          } else if (session?.user) {
            setSupabaseUser(session.user);
            const authUser = await fetchUserProfile(session.user);
            setUser(authUser);
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    };

    initAuth();
  }, [fetchUserProfile]);

  const signOut = useCallback(async () => {
    if (typeof window === 'undefined') return;

    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    await supabase.auth.signOut();
    setSupabaseUser(null);
    setUser(null);
  }, []);

  // During SSR/SSG, return default context
  if (!isMounted) {
    return (
      <AuthContext.Provider value={defaultContextValue}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ user, supabaseUser, isLoading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}

// Re-export createClient for backwards compatibility
export { createClient } from '@/lib/supabase/client';
