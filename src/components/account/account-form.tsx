'use client';
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { type User } from '@supabase/supabase-js';
import Avatar from './avatar';

export default function AccountForm({ user }: { user: User | null }) {
	const [loading, setLoading] = useState(true);
	const [fullname, setFullname] = useState<string | null>(null);
	const [username, setUsername] = useState<string | null>(null);
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

	const getProfile = useCallback(async () => {
		try {
			setLoading(true);
			const { data, error, status } = await supabase
				.from('User')
				.select(`name, username, avatarUrl`)
				.eq('email', user?.email)
				.single();

			if (error && status !== 406) {
				console.log(error);
				throw error;
			}

			if (data) {
				setFullname(data.name);
				setUsername(data.username);
				setAvatarUrl(data.avatarUrl);
			}
		} catch (error: Error | unknown) {
			console.error(error);
			alert('Error loading user data!');
		} finally {
			setLoading(false);
		}
	}, [user]);

	useEffect(() => {
		getProfile();
	}, [user, getProfile]);

	async function updateProfile({
		username,
		avatarUrl,
	}: {
		username: string | null;
		fullname: string | null;
		avatarUrl: string | null;
	}) {
		try {
			setLoading(true);

			console.log({ user, fullname });

			const { error } = await supabase.from('User').upsert({
				id: user?.id as string,
				email: user?.email as string,
				name: fullname,
				username,
				avatarUrl,
				updatedAt: new Date().toISOString(),
			});
			if (error) throw error;
			alert('Profile updated!');
		} catch (error: Error | unknown) {
			console.log(error);
			alert('Error updating the data!');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className='form-widget'>
			<Avatar
				uid={user?.id ?? null}
				url={avatarUrl}
				size={150}
				onUploadAction={(url: string) => {
					setAvatarUrl(url);
					updateProfile({ fullname, username, avatarUrl: url });
				}}
			/>
			<div>
				<label htmlFor='email'>Email</label>
				<input id='email' type='text' value={user?.email} disabled />
			</div>
			<div>
				<label htmlFor='fullName'>Full Name</label>
				<input
					id='fullName'
					type='text'
					value={fullname || ''}
					onChange={(e) => setFullname(e.target.value)}
				/>
			</div>
			<div>
				<label htmlFor='username'>Username</label>
				<input
					id='username'
					type='text'
					value={username || ''}
					onChange={(e) => setUsername(e.target.value)}
				/>
			</div>

			<div>
				<button
					className='button primary block'
					onClick={() => updateProfile({ fullname, username, avatarUrl })}
					disabled={loading}
				>
					{loading ? 'Loading ...' : 'Update'}
				</button>
			</div>

			<div>
				<form action='/auth/signout' method='post'>
					<button className='button block' type='submit'>
						Sign out
					</button>
				</form>
			</div>
		</div>
	);
}
