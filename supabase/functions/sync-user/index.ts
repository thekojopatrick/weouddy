import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.7';
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
	try {
		const payload = await req.json();
		const event = payload.type;
		const record = payload.record;

		// Only proceed if this is a new user signup
		if (event === 'INSERT' && record?.id) {
			// Create a new user record in your users table
			const { error: userError } = await supabase
				.from('users')
				.insert([
					{
						id: record.id,
						email: record.email,
						name: record.raw_user_meta_data?.full_name || null,
						avatarUrl: record.raw_user_meta_data?.avatar_url || null,
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
					},
				])
				.select()
				.single();

			if (userError) throw userError;

			return new Response(
				JSON.stringify({ message: 'User synchronized successfully' }),
				{
					headers: { 'Content-Type': 'application/json' },
					status: 200,
				}
			);
		}

		return new Response(
			JSON.stringify({ message: 'Not a user insert event' }),
			{
				headers: { 'Content-Type': 'application/json' },
				status: 200,
			}
		);
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			headers: { 'Content-Type': 'application/json' },
			status: 400,
		});
	}
});
