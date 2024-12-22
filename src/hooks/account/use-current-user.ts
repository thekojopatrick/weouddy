import React from "react";
import { User } from "@prisma/client";
import { supabase } from "@/lib/supabase/client";

type CurrentUserData = Pick<
  User,
  "id" | "name" | "email" | "avatarUrl" | "bio" | "username"
>;

const useCurrentUser = (currentUserId: string) => {
  const [user, setUser] = React.useState<CurrentUserData | null>();

  const fetchUser = async () => {
    const { data, error, status } = await supabase
      .from("User")
      .select(`id,email,name, username, avatarUrl,bio`)
      .eq("id", currentUserId)
      .single();

    if (error && status !== 406) {
      console.error(error);
      throw error;
    }

    if (data) {
      setUser(data);
    }
  };

  React.useEffect(() => {
    fetchUser();
  }, []);

  return user;
};

export default useCurrentUser;
