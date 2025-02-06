"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function DangerZone() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Danger zone</h2>

      <div className="space-y-4">
        <Button variant="destructive">Delete my account</Button>
        <p className="text-sm text-muted-foreground">
          This will immediately delete all of your data. This action is not
          reversible, so please continue with caution.{" "}
          <Link href="#" className="text-primary hover:underline">
            Learn more
          </Link>
        </p>
      </div>
    </div>
  );
}
