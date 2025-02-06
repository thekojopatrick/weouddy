"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { createClient, supabase } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const checkAuth = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user) {
        // Check if there's a stored original path
        const originalPath = user.user_metadata?.originalPath || "/discover";

        // Clear the stored path to prevent repeated redirects
        const { error: updateError } = await supabase.auth.updateUser({
          data: { originalPath: null },
        });

        setAuthenticated(true);
        router.push(originalPath);
      } else {
        setLoading(false);
      }
    };

    checkAuth();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setAuthenticated(true);
        router.push(session.user.user_metadata?.originalPath || "/discover");
      }
    });

    setLoading(false);

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase.auth]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Only show auth form if not authenticated
  if (!authenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
          <AuthForm />
        </div>
      </div>
    );
  }

  return null;
}
