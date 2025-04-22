import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../lib/store';
import { supabase } from '../lib/supabase';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setIsLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setIsLoading]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsLoading(false);
    };
    
    checkSession();
  }, [setUser, setIsLoading]);

  return <>{children}</>;
}