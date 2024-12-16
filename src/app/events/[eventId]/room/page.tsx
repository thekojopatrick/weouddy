import EventRoom from '@/components/pages/events/event';
import { createClient } from '@/lib/supabase/server';

export default async function EventRoomPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return <EventRoom user={user} />;
}
