"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";

// Separate component that uses useSearchParams
function ErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const errorMessage = searchParams.get("error") || "Authentication failed";

  const handleRetry = () => {
    router.push("/auth");
  };

  return (
    <Card className="w-full max-w-md shadow-none">
      <CardHeader>
        <CardTitle className="text-center text-red-600">
          Authentication Error
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-gray-700 mb-4">
            We encountered an issue during the authentication process.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Error details: {errorMessage}
          </p>
        </div>

        <div className="flex flex-col space-y-2">
          <Button onClick={handleRetry} className="w-full rounded-xl">
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="w-full rounded-xl"
          >
            Return to Home
          </Button>
        </div>

        <div className="text-center text-xs text-gray-500 mt-4">
          <p>
            If the problem persists, please contact support.{" "}
            <Link href="/contact">Contact us</Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Main page component with Suspense boundary
export default function AuthCodeErrorPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorContent />
      </Suspense>
    </div>
  );
}
