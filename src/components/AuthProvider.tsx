import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Handle OAuth callback
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (session?.user) {
          const { id, email, user_metadata } = session.user;
          setUser({
            id,
            email: email || '',
            displayName: user_metadata.full_name || email?.split('@')[0] || 'User',
            profilePicture: user_metadata.avatar_url
          });

          // Store session
          sessionStorage.setItem('supabase.auth.token', session.access_token);

          // Handle hash fragment from OAuth callback
          if (window.location.hash.includes('access_token=')) {
            window.history.replaceState({}, '', '/email-campaign');
            navigate('/email-campaign', { replace: true });
          } else if (location.pathname === '/') {
            navigate('/email-campaign', { replace: true });
          }
        }
      } catch (error) {
        console.error('Init auth error:', error);
        toast.error('Failed to initialize authentication');
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);

      if (event === 'SIGNED_IN' && session) {
        try {
          const { id, email, user_metadata } = session.user;
          setUser({
            id,
            email: email || '',
            displayName: user_metadata.full_name || email?.split('@')[0] || 'User',
            profilePicture: user_metadata.avatar_url
          });

          sessionStorage.setItem('supabase.auth.token', session.access_token);
          
          // Handle navigation after sign in
          const targetPath = '/email-campaign';
          if (location.pathname !== targetPath) {
            window.history.replaceState({}, '', targetPath);
            navigate(targetPath, { replace: true });
          }
          toast.success('Signed in successfully');
        } catch (error) {
          console.error('Auth state change error:', error);
          toast.error('Failed to process sign in');
        }
      } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setUser(null);
        sessionStorage.removeItem('supabase.auth.token');
        toast.success('Signed out successfully');
        navigate('/', { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, navigate, location]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-[#00F0FF]">
          <svg className="w-8 h-8" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}