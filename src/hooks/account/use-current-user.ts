import { useUserStore } from '@/stores/user-store';
import { useEffect } from 'react';

const useCurrentUser = (userId: string) => {
  const { fetchUserProfile, userProfiles } = useUserStore();

  useEffect(() => {
    fetchUserProfile(userId);
  }, [userId, fetchUserProfile]);

  return userProfiles[userId] ?? null;
};

export default useCurrentUser;
