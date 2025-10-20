import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AuthForm } from "@/components/auth/auth-form";

export default async function SignInPage() {
  const user = await getSession();

  if (user) {
    return redirect("/discover");
  }

  return (
    <div className="min-h-[100dvh] bg-linear-to-b from-white to-gray-50 flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <AuthForm mode="login" />
    </div>
  );
}
