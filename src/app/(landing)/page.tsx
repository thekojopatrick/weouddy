import LandingPage from '@/components/pages/landing-page';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function page() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) {
		redirect('/discover');
	}

	return <LandingPage />;
}
