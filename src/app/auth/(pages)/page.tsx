"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "../../../components/auth/auth-form";
import { createClient, supabase } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    console.log("Calling 1");

    const checkAuth = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      console.log("Calling 2");
      console.log("User:", user);
      console.log("Error:", error);

      if (user) {
        // Check if there's a stored original path
        const originalPath = user.user_metadata?.originalPath || "/discover";

        // Clear the stored path to prevent repeated redirects
        const { error: updateError } = await supabase.auth.updateUser({
          data: { originalPath: null },
        });
        console.log("Update User Error:", updateError);

        console.log("Calling 3");
        setAuthenticated(true);
        router.push(originalPath);
      } else {
        console.log("Calling 4");
        setLoading(false);
      }
    };

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth State Change - Event:", event);
      console.log("Auth State Change - Session:", session);
      if (session) {
        console.log("Calling session 2");
        setAuthenticated(true);
        router.push(session.user.user_metadata?.originalPath || "/discover");
      }
    });

    checkAuth();

    console.log("Calling session 3");
    console.log({ subscription });

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
