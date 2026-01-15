import { create } from 'zustand';
import type { User } from '@handled/shared';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  completeOnboarding: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  accessToken: null,

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },

  setAccessToken: (token) => {
    set({ accessToken: token });
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      // TODO: Implement actual API call
      // For now, mock a successful login
      const mockUser: User = {
        id: '1',
        email,
        displayName: null,
        avatarUrl: null,
        subscriptionTier: 'free',
        subscriptionStatus: 'active',
        onboardingCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      set({ user: mockUser, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, accessToken: null });
  },

  completeOnboarding: () => {
    const { user } = get();
    if (user) {
      set({ user: { ...user, onboardingCompleted: true } });
    }
  },
}));
