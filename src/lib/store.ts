import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from './supabase';

interface User {
  id: string;
  email: string;
  displayName: string;
  profilePicture?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      setUser: (user) => set({ user }),
      
      signInWithGoogle: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: window.location.origin,
              queryParams: {
                access_type: 'offline',
                prompt: 'consent'
              }
            }
          });

          if (error) throw error;
          
          return;
        } catch (error) {
          console.error('Google sign in error:', error);
          set({ error: error instanceof Error ? error.message : 'Authentication failed' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ user: null });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Sign out failed' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      checkAuth: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) throw error;

          if (session?.user) {
            const { id, email, user_metadata } = session.user;
            
            if (!email) throw new Error('User email is required');
            
            set({
              user: {
                id,
                email,
                displayName: user_metadata.full_name || email.split('@')[0],
                profilePicture: user_metadata.avatar_url
              }
            });
          } else {
            set({ user: null });
          }
        } catch (error) {
          console.error('Auth check error:', error);
          set({ error: error instanceof Error ? error.message : 'Session check failed', user: null });
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user })
    }
  )
);