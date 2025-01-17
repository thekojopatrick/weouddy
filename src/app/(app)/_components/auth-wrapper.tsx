'use client';

import React, { useEffect, useState } from 'react';
import { useUserStore } from '@/stores/user-store';
import { createClient } from '@/lib/supabase/client';
import SplashScreen from './splash-screen';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { initialize, clearStore } = useUserStore();

  useEffect(() => {
    // Check if this is the first load or a page refresh
    const isPageRefresh = !document.referrer;

    const initializeAuth = async () => {
      try {
        const supabase = createClient();
        const session = await supabase.auth.getUser();

        if (session) {
          await initialize();
        } else {
          clearStore();
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearStore();
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        clearStore();
      } else if (event === 'SIGNED_IN' && session) {
        await initialize();
      }
    });

    // Only show splash screen on initial page load or refresh
    if (isInitialLoad && isPageRefresh) {
      initializeAuth();
    } else {
      setIsLoading(false);
    }

    // Cleanup
    return () => {
      subscription?.unsubscribe();
      setIsInitialLoad(false);
    };
  }, [initialize, clearStore, isInitialLoad]);

  if (isLoading) {
    return (
      <SplashScreen onLoadComplete={() => setIsLoading(false)} />
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;
