import { useCallback, useEffect, useState } from "react";

import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

export interface AccountData {
  fullname: string | null;
  username: string | null;
  avatarUrl: string | null;
  email: string | null;
}

export const useAccount = (user: User | null) => {
  const [loading, setLoading] = useState(true);
  const [accountData, setAccountData] = useState<AccountData>({
    fullname: user?.user_metadata.full_name ?? null,
    username: null,
    avatarUrl: user?.user_metadata.avatar_url ?? null,
    email: user?.email ?? null,
  });

  const fetchProfile = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data: users } = await supabase
        .from("users")
        .select("*");

      console.log({ users });

      const { data, error, status } = await supabase
        .from("users")
        .select(`name, username, avatarUrl`)
        .eq("email", user.email)
        .single();

      console.log({ data });

      if (error && status !== 406) {
        console.error(error);
        throw error;
      }

      if (data) {
        setAccountData((prev) => ({
          ...prev,
          fullname: data.name,
          username: data.username,
          avatarUrl: data.avatarUrl,
        }));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateProfile = async (updates: Partial<AccountData>) => {
    if (!user) return;

    try {
      setLoading(true);

      const updateData = {
        id: user.id,
        email: user.email,
        name: updates.fullname ?? accountData.fullname,
        username: updates.username ?? accountData.username,
        avatarUrl: updates.avatarUrl ?? accountData.avatarUrl,
        updatedAt: new Date().toISOString(),
      };

      const { error } = await supabase.from("User").upsert(updateData);

      if (error) throw error;

      // Update local state
      setAccountData((prev) => ({
        ...prev,
        ...updates,
      }));

      return { success: true, message: "Profile updated!" };
    } catch (error) {
      console.error("Error updating profile:", error);
      return {
        success: false,
        message: "Error updating the data!",
      };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user, fetchProfile]);

  return {
    accountData,
    loading,
    updateProfile,
    fetchProfile,
  };
};
