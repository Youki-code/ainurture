"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../lib/store";

export default function AuthCallback() {
  const router = useRouter();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        console.log("Session data:", session);
        console.log("Session error:", error);

        if (error) {
          throw error;
        }

        if (session) {
          router.push("/email-campaign");
          console.log("Session exists, checking auth...");
          await checkAuth();
          console.log("Auth check completed, redirecting to email-campaign");
          router.push("/email-campaign");
        } else {
          console.log("No session found, redirecting to home");
          router.push("/");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        router.push("/");
      }
    };

    handleAuthCallback();
  }, [router, checkAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D1F]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00F0FF] mx-auto mb-4"></div>
        <p className="text-gray-300">正在处理登录...</p>
      </div>
    </div>
  );
}
