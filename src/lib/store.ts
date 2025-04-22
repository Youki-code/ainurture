import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      error: null,
      setUser: (user) => set({ user }),
      setIsLoading: (isLoading) => set({ isLoading }),
      
      signInWithGoogle: async () => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/email-campaign`,
            },
          });
          if (error) throw error;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'An error occurred' });
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
          set({ error: error instanceof Error ? error.message : 'An error occurred' });
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
            return true;
          } else {
            set({ user: null });
            return false;
          }
        } catch (error) {
          console.error('Auth check error:', error);
          set({ error: error instanceof Error ? error.message : 'Session check failed', user: null });
          return false;
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          return JSON.parse(str);
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);