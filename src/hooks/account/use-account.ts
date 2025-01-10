import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface AccountData {
  id?: string;
  fullname: string | null;
  username: string | null;
  avatarUrl: string | null;
  email: string | null;
}

export const useAccount = () => {
  const [loading, setLoading] = useState(true);
  const [accountData, setAccountData] = useState<AccountData>({
    id: '',
    fullname: null,
    username: null,
    avatarUrl: null,
    email: null,
  });

  const fetchProfile = useCallback(async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.email) return;

      const { data, error } = await supabase
        .from('User')
        .select(`name, username, avatarUrl`)
        .eq('email', userData.user.email)
        .single();

      if (error && error.code !== '406') throw error;

      if (data) {
        setAccountData({
          id: userData.user.id,
          fullname: data.name,
          username: data.username,
          avatarUrl:
            data.avatarUrl ??
            userData.user.user_metadata.avatar_url ??
            null,
          email: userData.user.email,
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (updates: Partial<AccountData>) => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user?.email)
          return { success: false, message: 'No user found' };

        setLoading(true);
        const updateData = {
          id: userData.user.id,
          email: userData.user.email,
          name: updates.fullname ?? accountData.fullname,
          username: updates.username ?? accountData.username,
          avatarUrl: updates.avatarUrl ?? accountData.avatarUrl,
          updatedAt: new Date().toISOString(),
        };

        const { error } = await supabase
          .from('User')
          .update(updateData)
          .eq('email', userData.user.email)
          .single();

        if (error) throw error;

        setAccountData((prev) => ({ ...prev, ...updates }));
        return { success: true, message: 'Profile updated!' };
      } catch (error) {
        console.error('Error updating profile:', error);
        return {
          success: false,
          message: 'Error updating the data!',
        };
      } finally {
        setLoading(false);
      }
    },
    [accountData]
  );

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { accountData, loading, updateProfile, fetchProfile };
};
