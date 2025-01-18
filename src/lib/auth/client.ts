import { createClient } from '@/utils/supabase/client';

export const getClientSession = async () => {
  const supabase = createClient();
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error('Session error:', error);
      return null;
    }

    const { data: userData } = await supabase
      .from('User')
      .select('*')
      .eq('email', user.email!)
      .single();

    if (!userData) {
      return null;
    }

    return {
      userId: userData.id,
      user: {
        ...user,
        name: userData.name ?? user.user_metadata.full_name,
        bio: userData.bio ?? '',
        username: userData.username,
        avatarUrl:
          userData.avatarUrl ?? user.user_metadata.avatar_url,
      },
    };
  } catch (error) {
    console.error('Error retrieving session:', error);
    return null;
  }
};
