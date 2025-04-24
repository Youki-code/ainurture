import React, { useEffect } from 'react';
import { useAuthStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth, setUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (session?.user) {
          // Refresh the session to ensure we have valid JWT claims
          const { data: { session: refreshedSession }, error: refreshError } = 
            await supabase.auth.refreshSession();
          
          if (refreshError) {
            throw refreshError;
          }

          if (refreshedSession) {
            await checkAuth();
            // Only navigate if we're not already on the email-campaign page
            if (location.pathname !== '/email-campaign') {
              navigate('/email-campaign', { replace: true });
            }
          } else {
            // If we couldn't get a refreshed session, sign out
            await supabase.auth.signOut();
            setUser(null);
            navigate('/', { replace: true });
          }
        }
      } catch (error) {
        console.error('Init auth error:', error);
        toast.error('Authentication failed. Please sign in again.');
        // Clean up on error
        await supabase.auth.signOut();
        setUser(null);
        navigate('/', { replace: true });
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        try {
          // Refresh session immediately after sign in
          const { data: { session: refreshedSession }, error: refreshError } = 
            await supabase.auth.refreshSession();
          
          if (refreshError) {
            throw refreshError;
          }

          if (refreshedSession) {
            await checkAuth();
            toast.success('Signed in successfully');
            navigate('/email-campaign', { replace: true });
          } else {
            throw new Error('Failed to refresh session');
          }
        } catch (error) {
          console.error('Auth state change error:', error);
          toast.error('Failed to process sign in');
          await supabase.auth.signOut();
          setUser(null);
          navigate('/', { replace: true });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        toast.success('Signed out successfully');
        navigate('/', { replace: true });
      } else if (event === 'TOKEN_REFRESHED') {
        // Handle token refresh events
        try {
          await checkAuth();
        } catch (error) {
          console.error('Token refresh error:', error);
          toast.error('Session expired. Please sign in again.');
          await supabase.auth.signOut();
          setUser(null);
          navigate('/', { replace: true });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkAuth, setUser, navigate, location]);

  return <>{children}</>;
}