import { useUserStore } from '@/stores/user-store';
import { useEffect } from 'react';

const useCurrentUser = (userId: string) => {
  const { fetchUserProfile, userProfiles, initialize } =
    useUserStore();

  useEffect(() => {
    initialize();
    fetchUserProfile(userId);
  }, [userId, fetchUserProfile, initialize]);

  return userProfiles[userId] ?? null;
};

export default useCurrentUser;
