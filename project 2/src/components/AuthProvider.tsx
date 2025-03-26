import React, { useEffect } from 'react';
import { useAuthStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle hash fragment from OAuth
        if (location.hash) {
          const hashParams = new URLSearchParams(location.hash.substring(1));
          if (hashParams.has('access_token')) {
            // Remove the hash immediately
            window.history.replaceState(null, '', window.location.pathname);
            
            // Get the session
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;

            if (session?.user) {
              const { id, email, user_metadata } = session.user;
              setUser({
                id,
                email: email || '',
                displayName: user_metadata.full_name || email?.split('@')[0] || 'User',
                profilePicture: user_metadata.avatar_url
              });

              navigate('/email-campaign', { replace: true });
              return;
            }
          }
        }

        // Regular session check
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user) {
          const { id, email, user_metadata } = session.user;
          setUser({
            id,
            email: email || '',
            displayName: user_metadata.full_name || email?.split('@')[0] || 'User',
            profilePicture: user_metadata.avatar_url
          });

          if (location.pathname === '/') {
            navigate('/email-campaign', { replace: true });
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        toast.error('Failed to initialize authentication');
      }
    };

    handleAuthCallback();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);

      if (event === 'SIGNED_IN' && session) {
        try {
          const { id, email, user_metadata } = session.user;
          setUser({
            id,
            email: email || '',
            displayName: user_metadata.full_name || email?.split('@')[0] || 'User',
            profilePicture: user_metadata.avatar_url
          });

          navigate('/email-campaign', { replace: true });
          toast.success('Signed in successfully');
        } catch (error) {
          console.error('Auth state change error:', error);
          toast.error('Failed to process sign in');
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        sessionStorage.clear();
        navigate('/', { replace: true });
        toast.success('Signed out successfully');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, navigate, location]);

  return <>{children}</>;
}