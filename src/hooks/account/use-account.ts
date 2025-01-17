import { useUserStore } from '@/stores/user-store';

export const useAccount = () => {
  const { currentUser, isLoading, updateCurrentUser } =
    useUserStore();

  console.log({ isLoading });

  return {
    accountData: currentUser
      ? {
          id: currentUser.id,
          fullname: currentUser.name,
          username: currentUser.username,
          avatarUrl: currentUser.avatarUrl,
          email: currentUser.email,
        }
      : null,
    loading: isLoading,
    updateProfile: updateCurrentUser,
  };
};
