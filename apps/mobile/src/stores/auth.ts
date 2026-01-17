import { create } from 'zustand';
import { supabase, signInWithEmail, signUpWithEmail, signOut, getCurrentUser } from '@/lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface AppUser {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  subscriptionTier: 'free' | 'monthly' | 'annual';
  subscriptionStatus: 'active' | 'inactive' | 'past_due' | 'canceled' | 'trialing';
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthState {
  user: AppUser | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: AppUser | null) => void;
  setSession: (session: Session | null) => void;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  register: (email: string, password: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  completeOnboarding: () => void;
}

// Convert Supabase user to app user
function mapSupabaseUser(user: SupabaseUser): AppUser {
  return {
    id: user.id,
    email: user.email || '',
    displayName: user.user_metadata?.display_name || null,
    avatarUrl: user.user_metadata?.avatar_url || null,
    subscriptionTier: 'free',
    subscriptionStatus: 'active',
    onboardingCompleted: user.user_metadata?.onboarding_completed || false,
    createdAt: new Date(user.created_at),
    updatedAt: new Date(user.updated_at || user.created_at),
  };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  supabaseUser: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },

  setSession: (session) => {
    if (session?.user) {
      const appUser = mapSupabaseUser(session.user);
      set({
        session,
        supabaseUser: session.user,
        user: appUser,
        isAuthenticated: true,
      });
    } else {
      set({
        session: null,
        supabaseUser: null,
        user: null,
        isAuthenticated: false,
      });
    }
  },

  initialize: async () => {
    set({ isLoading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const appUser = mapSupabaseUser(session.user);
        set({
          session,
          supabaseUser: session.user,
          user: appUser,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange((_event, session) => {
        get().setSession(session);
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await signInWithEmail(email, password);
      if (error) {
        set({ isLoading: false });
        return { error };
      }
      if (data.session) {
        get().setSession(data.session);
      }
      set({ isLoading: false });
      return { error: null };
    } catch (error) {
      set({ isLoading: false });
      return { error: error as Error };
    }
  },

  register: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await signUpWithEmail(email, password);
      if (error) {
        set({ isLoading: false });
        return { error };
      }
      if (data.session) {
        get().setSession(data.session);
      }
      set({ isLoading: false });
      return { error: null };
    } catch (error) {
      set({ isLoading: false });
      return { error: error as Error };
    }
  },

  logout: async () => {
    await signOut();
    set({
      user: null,
      supabaseUser: null,
      session: null,
      isAuthenticated: false,
    });
  },

  completeOnboarding: () => {
    const { user } = get();
    if (user) {
      set({ user: { ...user, onboardingCompleted: true } });
    }
  },
}));
