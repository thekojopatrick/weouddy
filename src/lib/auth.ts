import { createClient } from "@/utils/supabase/server";

export const getSession = async () => {
  const supabase = await createClient(); // Await the client creation
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(); // Destructure correctly

    if (error || !user) {
      console.info("Session error:", error);
      return null;
    }

    const { data: userData } = await supabase
      .from("User")
      .select("*")
      .eq("email", user.email!)
      .single();

    // if (!userData) {
    //   return null;
    // }

    return {
      userId: userData?.id ?? user.id,
      user: {
        ...user,
        name:
          userData?.name ??
          user.user_metadata.full_name ??
          user.email?.split("@", 1)[0],
        bio: userData?.bio ?? "",
        username: userData?.username ?? user.email?.split("@", 1)[0],
        avatarUrl: userData?.avatarUrl ?? user.user_metadata.avatar_url,
      },
    };
  } catch (error) {
    console.error("Error retrieving session:", error);
    return null;
  }
};
