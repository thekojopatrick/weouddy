import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';
import { User } from '@prisma/client';

type UserProfile = Pick<
  User,
  'id' | 'name' | 'email' | 'avatarUrl' | 'bio' | 'username'
>;

interface UserState {
  currentUser: UserProfile | null;
  userProfiles: Record<string, UserProfile>;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  fetchUserProfile: (userId: string) => Promise<UserProfile | null>;
  updateCurrentUser: (updates: Partial<UserProfile>) => Promise<void>;
  clearStore: () => void;
  setIsLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      userProfiles: {},
      isLoading: false, // Changed initial value to false
      error: null,

      setIsLoading: (loading: boolean) => set({ isLoading: loading }),

      initialize: async () => {
        const supabase = createClient();

        try {
          set({ isLoading: true });
          const {
            data: { user },
            error,
          } = await supabase.auth.getUser();

          if (error || !user) {
            set({
              error: error?.message ?? 'No user found',
              isLoading: false,
              currentUser: null, // Ensure user is cleared
            });
            return;
          }

          const { data } = await supabase
            .from('User')
            .select('id, email, name, username, avatarUrl, bio')
            .eq('id', user.id)
            .single();

          if (data) {
            const userData: UserProfile = {
              id: data.id,
              email: data.email,
              name: data.name,
              username: data.username,
              avatarUrl: data.avatarUrl,
              bio: data.bio,
            };

            set({
              currentUser: userData,
              userProfiles: {
                ...get().userProfiles,
                [userData.id]: userData,
              },
              isLoading: false,
              error: null,
            });
          } else {
            set({ isLoading: false, currentUser: null });
          }
        } catch (error) {
          set({
            error: (error as Error).message,
            isLoading: false,
            currentUser: null,
          });
        }
      },

      fetchUserProfile: async (userId: string) => {
        const { userProfiles } = get();

        // Check local storage cache first
        if (userProfiles[userId]) {
          return userProfiles[userId];
        }

        const supabase = createClient();

        try {
          const { data } = await supabase
            .from('User')
            .select('id, email, name, username, avatarUrl, bio')
            .eq('id', userId)
            .single();

          if (data) {
            const userProfile: UserProfile = {
              id: data.id,
              email: data.email,
              name: data.name,
              username: data.username,
              avatarUrl: data.avatarUrl,
              bio: data.bio,
            };

            // Update store with new profile
            set((state) => ({
              userProfiles: {
                ...state.userProfiles,
                [userId]: userProfile,
              },
            }));

            return userProfile;
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }

        return null;
      },

      updateCurrentUser: async (updates: Partial<UserProfile>) => {
        const { currentUser } = get();
        const supabase = createClient();

        if (!currentUser) {
          throw new Error('No current user');
        }

        try {
          const { data, error } = await supabase
            .from('User')
            .update({
              ...updates,
              avatarUrl: currentUser?.avatarUrl as never,
              updatedAt: new Date().toISOString(),
            })
            .eq('id', currentUser.id)
            .single();

          if (error) throw error;

          if (data) {
            const updatedUser: UserProfile = {
              ...currentUser,
              ...updates,
            };

            set((state) => ({
              currentUser: updatedUser,
              userProfiles: {
                ...state.userProfiles,
                [currentUser.id]: updatedUser,
              },
            }));
          }
        } catch (error) {
          set({ error: (error as Error).message });
          throw error;
        }
      },

      clearStore: () => {
        set({
          currentUser: null,
          userProfiles: {},
          isLoading: false,
          error: null,
        });
        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user-storage');
        }
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
        userProfiles: state.userProfiles,
      }),
    }
  )
);
