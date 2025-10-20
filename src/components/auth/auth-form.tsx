"use client";

import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { LoginFormValues, signUpSchema } from "@/types/validation";
import { useEffect, useState } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { SignUpForm } from "@/components/auth/signup-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  signInAction,
  signInWithGoogleAction,
  signUpAction,
} from "@/components/deactivated/actions/auth";

export function AuthForm({ mode = "login" }: { mode?: "login" | "signup" }) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">(mode);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get redirect path from URL parameters and decode it
  const redirectPath = decodeURIComponent(
    searchParams.get("redirect") || "/discover"
  );

  // Initialize tab from URL on mount
  useEffect(() => {
    const view = searchParams.get("view");
    if (view === "login" || view === "signup") {
      setActiveTab(view);
    }
  }, [searchParams]);

  const handleAuthSuccess = async (
    message: string,
    description: string,
    redirectTo: string = redirectPath
  ) => {
    toast.success(message, { description });

    // Use setTimeout to ensure state updates complete before navigation
    setTimeout(() => {
      router.push(redirectTo);
    }, 0);
  };

  const handleSignUp = async (values: z.infer<typeof signUpSchema>) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Add redirect path to form data
      formData.append("redirect", redirectPath);

      const {
        error,
        success,
        redirectPath: resultPath,
      } = await signUpAction({}, formData);

      if (error) {
        toast.error("Error", {
          description: error || "Account creation not successfully",
        });
      }

      if (success) {
        await handleAuthSuccess(
          "Account created!",
          "Please check your email to verify your account.",
          resultPath || redirectPath
        );
      }

      router.refresh();
    } catch (error: Error | unknown) {
      toast.error("Error", {
        description: (error as Error).message || "An unknown error occurred.",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Pass the redirect path to the Google sign-in action
      const result = await signInWithGoogleAction();

      if (!result.success && result.error) {
        toast.error("Error", {
          description: result.error,
        });
      }

      if (result.success && result.redirectPath) {
        router.push(result.redirectPath);
      }
    } catch (error) {
      toast.error("Error", {
        description: "An unexpected error occurred during Google Sign-In.",
      });
      console.error(
        "An unexpected error occurred during Google Sign-In:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      // Add the form values
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Add the redirect path from URL params
      const redirect = searchParams.get("redirect");
      if (redirect) {
        formData.append("redirect", redirect);
      }

      const response = await signInAction({}, formData);

      if (!response.success || response.error) {
        throw new Error(response.error || "Invalid login credentials");
      }

      if (response.success && response.user) {
        // Use the response's redirectPath or fall back to the URL param redirect
        const redirectTo = response.redirectPath || redirect || "/discover";

        await handleAuthSuccess(
          "Welcome back!",
          "You have successfully signed in.",
          redirectTo
        );
        return;
      }
    } catch (error) {
      toast.error("Authentication Failed", {
        description:
          error instanceof Error ? error.message : "Invalid login credentials",
      });
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push(
      `/auth/forgot-password?redirect=${encodeURIComponent(redirectPath)}`
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xs">
      <CardContent>
        {activeTab === "login" ? (
          <LoginForm
            onSubmitAction={handleSignIn}
            onSignUpClickAction={() => setActiveTab("signup")}
            onForgotPassword={handleForgotPassword}
            isLoading={isLoading}
            onGoogleSignIn={handleGoogleSignIn}
          />
        ) : (
          <SignUpForm
            onSubmitAction={handleSignUp}
            onLoginClickAction={() => setActiveTab("login")}
            isLoading={isLoading}
            onGoogleSignIn={handleGoogleSignIn}
          />
        )}
      </CardContent>
    </Card>
  );
}
