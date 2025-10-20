"use client";

import { LoginFormValues, SignUpFormValues } from "@/types/validation";
import { useState, useCallback } from "react";

import { LoginForm } from "./login-form";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { SignUpForm } from "./signup-form";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

import {
  signInAction,
  signInWithGoogleAction,
  signUpAction,
} from "@/components/deactivated/actions/auth";

interface AuthDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  defaultView?: "login" | "signup";
}

export function AuthDialog({
  open,
  onOpenChangeAction,
  defaultView = "login",
}: AuthDialogProps) {
  const [view, setView] = useState<"login" | "signup">(defaultView);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get redirect path from URL parameters and decode it
  const redirectPath = decodeURIComponent(
    searchParams.get("redirect") || "/discover"
  );

  const handleAuthSuccess = async (
    message: string,
    description: string,
    redirectTo: string = redirectPath
  ) => {
    toast.success(message, { description });
    onOpenChangeAction(false);
    // Use setTimeout to ensure state updates complete before navigation
    // Check if we're on an event page
    if (window.location.pathname.startsWith("/events/")) {
      // Use router.refresh() instead of navigation
      router.refresh();
    } else {
      // Use setTimeout to ensure state updates complete before navigation
      setTimeout(() => {
        router.push(redirectTo);
      }, 0);
    }
  };

  const handleSignIn = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

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
        await handleAuthSuccess(
          "Welcome back!",
          "You have successfully signed in."
        );
        return; // Exit early after successful auth
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

  const handleSignUp = async (values: SignUpFormValues) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await signUpAction({}, formData);

      if (!response.success || response.error) {
        throw new Error(response.error || "Sign up failed");
      }

      if (response.success && response.user) {
        await handleAuthSuccess(
          "Account created!",
          "Please check your email to verify your account."
        );
      }
    } catch (error) {
      toast.error("Sign Up Failed", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogleAction();

      console.log(result);

      if (!result?.success && result?.error) {
        throw new Error(result.error);
      }
      // OAuth redirect will handle the flow
      if (result.success && result.redirectPath) {
        router.push(result.redirectPath);
      }
    } catch (error) {
      toast.error("Google Sign In Failed", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
      console.error("Google sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);

    // Try multiple navigation methods
    try {
      Promise.resolve().then(() => {
        router.push("/auth/forgot-password");

        // Fallback to window location if router fails
        setTimeout(() => {
          window.location.href = "/auth/forgot-password";
        }, 100);
      });
    } catch (error) {
      console.error("Navigation error:", error);
      // Force navigation as last resort
      window.location.href = "/auth/forgot-password";
    } finally {
      setIsLoading(false);
    }
  }, [router, isLoading]);

  return (
    <ResponsiveDialog open={open} onOpenChangeAction={onOpenChangeAction}>
      {view === "login" ? (
        <LoginForm
          onSignUpClickAction={() => setView("signup")}
          onSubmitAction={handleSignIn}
          onForgotPassword={handleForgotPassword}
          isLoading={isLoading}
          onGoogleSignIn={handleGoogleSignIn}
        />
      ) : (
        <SignUpForm
          onLoginClickAction={() => setView("login")}
          onSubmitAction={handleSignUp}
          isLoading={isLoading}
          onGoogleSignIn={handleGoogleSignIn}
        />
      )}
    </ResponsiveDialog>
  );
}
