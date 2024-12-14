import HomePage from '@/components/pages/homepage';
import { createClient } from '@/lib/supabase/server';

export default async function page() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return <HomePage user={user} />;
}
