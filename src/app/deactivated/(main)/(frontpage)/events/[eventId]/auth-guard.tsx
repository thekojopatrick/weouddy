"use client";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const AuthGuard = () => {
  const router = useRouter();
  const pathName = usePathname();

  const handleOpenChange = () => {
    // Check if we're on an event page
    if (pathName.startsWith("/events/")) {
      // Refresh the current page instead of redirecting
      router.refresh();
    } else {
      // Default behavior for other pages
      router.push("/discover");
    }
  };
  return (
    <div>
      <AuthDialog
        open={pathName == "/forgot-password" ? false : true}
        onOpenChangeAction={handleOpenChange}
        defaultView={"login"}
      />
    </div>
  );
};

export default AuthGuard;
