"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

export function AuthProvider({ children }) {
  const { checkAuth, setUser } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const initAuth = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (session?.user) {
          // Refresh the session to ensure we have valid JWT claims
          const {
            data: { session: refreshedSession },
            error: refreshError,
          } = await supabase.auth.refreshSession();

          if (refreshError) {
            throw refreshError;
          }

          if (refreshedSession) {
            await checkAuth();
          } else {
            // If we couldn't get a refreshed session, sign out
            await supabase.auth.signOut();
            setUser(null);
            router.push("/");
          }
        }
      } catch (error) {
        console.error("Init auth error:", error);
        toast.error("Authentication failed. Please sign in again.");
        // Clean up on error
        await supabase.auth.signOut();
        setUser(null);
        router.push("/");
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        try {
          // Refresh session immediately after sign in
          const {
            data: { session: refreshedSession },
            error: refreshError,
          } = await supabase.auth.refreshSession();

          if (refreshError) {
            throw refreshError;
          }

          if (refreshedSession) {
            await checkAuth();
            toast.success("Signed in successfully");
          } else {
            throw new Error("Failed to refresh session");
          }
        } catch (error) {
          console.error("Auth state change error:", error);
          toast.error("Failed to process sign in");
          await supabase.auth.signOut();
          setUser(null);
          router.push("/");
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        toast.success("Signed out successfully");
        router.push("/");
      } else if (event === "TOKEN_REFRESHED") {
        // Handle token refresh events
        try {
          await checkAuth();
        } catch (error) {
          console.error("Token refresh error:", error);
          toast.error("Session expired. Please sign in again.");
          await supabase.auth.signOut();
          setUser(null);
          router.push("/");
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkAuth, setUser, router, pathname, isMounted]);

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
}
