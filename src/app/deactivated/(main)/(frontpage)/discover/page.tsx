import DiscoverPage from "@/features/events";
import { getSession } from "@/lib/auth";

export default async function Page() {
  const session = await getSession();

  return <DiscoverPage user={session?.user as never} />;
}
