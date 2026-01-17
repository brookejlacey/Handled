'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
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

const AuthContext = createContext<AuthContextType | null>(null);

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
    const supabase = createClient();

    // Check current session
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setSupabaseUser(session.user);
        const authUser = await fetchUserProfile(session.user);
        setUser(authUser);
      }
      setIsLoading(false);
    };

    initAuth();

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
  }, [fetchUserProfile]);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setSupabaseUser(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, supabaseUser, isLoading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Re-export createClient for backwards compatibility
export { createClient } from '@/lib/supabase/client';
