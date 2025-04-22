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
  checkAuth: () => Promise<boolean>;
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
          
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/email-campaign`,
              queryParams: {
                access_type: 'offline',
                prompt: 'consent'
              }
            }
          });

          if (error) throw error;
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
          await supabase.auth.signOut();
          set({ user: null });
          sessionStorage.clear();
        } catch (error) {
          console.error('Sign out error:', error);
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
      storage: sessionStorage
    }
  )
);