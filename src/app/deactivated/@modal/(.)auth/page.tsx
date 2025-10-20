"use client";

import { AuthDialog } from "@/components/auth/auth-dialog";
import React, { Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";

const LoginModal = () => {
  const router = useRouter();
  const pathName = usePathname();

  return (
    <Suspense
      fallback={<div className="text-center">Loading authentication...</div>}
    >
      <AuthDialog
        open={pathName == "/forgot-password" ? false : true}
        onOpenChangeAction={() => router.back()}
        defaultView={"login"}
      />
    </Suspense>
  );
};

export default LoginModal;
