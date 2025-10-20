import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <div className="w-full h-screen flex flex-col justify-center items-center gap-y-6">
        <div className="space-y-4 text-center max-w-xl">
          <h1 className="text-3xl font-bold">Page not found</h1>
          <p>
            You&apos;ve come a long way let&apos;s go back or contact support if
            this is a problem
          </p>
        </div>
        <div className="flex gap-x-3">
          <Button variant={"default"} className="rounded-full">
            <Link href={"/"}>Go back to home</Link>
          </Button>
          <Button variant={"secondary"} className="rounded-full" asChild>
            <Link href={"http://x.com/_kojopatrick"}>Contact Support</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
