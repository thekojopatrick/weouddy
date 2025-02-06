import AccountForm from "@/components/account/new-account-form";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Account() {
  const session = await getSession();

  if (!session) {
    redirect("/auth");
  }

  return <AccountForm user={session.user as never} />;
}
