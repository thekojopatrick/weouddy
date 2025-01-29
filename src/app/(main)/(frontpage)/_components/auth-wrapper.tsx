"use client";

import React, { useEffect, useState } from "react";
import { useUserStore } from "@/stores/user-store";
import { createClient } from "@/utils/supabase/client";
import SplashScreen from "./splash-screen";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const { initialize, clearStore } = useUserStore();

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session && mounted) {
          await initialize();
        } else if (mounted) {
          await clearStore();
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (mounted) {
          clearStore();
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        if (mounted) {
          await clearStore();
        }
      } else if (event === "SIGNED_IN" && session) {
        if (mounted) {
          await initialize();
        }
      }
    });

    initializeAuth();

    // Cleanup
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [initialize, clearStore]);

  if (isLoading) {
    return <SplashScreen onLoadComplete={() => setIsLoading(false)} />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
