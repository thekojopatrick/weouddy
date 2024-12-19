import LandingPage from '@/components/pages/landing-page';
import { createClient } from '@/lib/supabase/server';

export default async function page() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	console.log({ user });

	return <LandingPage />;
}
